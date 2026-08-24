import os
import json
import uuid
import shutil
import datetime
from typing import Optional
from tortoise.expressions import Q
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from api.models.body import (
    response_body,
    ProductItem,
    ProductReviewItem,
    ProductAttributeItem,
    ProductAttributeValueItem,
)
from api.models.db_init import ensure_folder
from api.models.verify_tool import Auth
from api.models.db_models import (
    ProductDBModel,
    ProductReviewDBModel,
    ProductAttributeDBModel,
    ProductAttributeValueDBModel,
)
from api.utils.image_compress import clear_compressed_image_cache, get_compressed_image_info

router = APIRouter(tags=['Product'])

with open('./api/app_config.json') as f:
    app_config = json.load(f)
auth = Auth(app_config=app_config)

# 产品审核状态：
# pending 表示用户提交后待管理员审核；
# approved 表示审核通过，可在公开接口中展示；
# rejected 表示审核未通过，仅后台可见。
AUDIT_PENDING = 'pending'
AUDIT_APPROVED = 'approved'
AUDIT_REJECTED = 'rejected'

# 各类返回字段白名单，统一用 values(...) 返回，避免把 ORM 对象直接暴露给接口层。
PRODUCT_FIELDS = [
    'id', 'tool_name', 'tool_type', 'organization', 'homepage_url', 'introduction',
    'audit_status', 'publish_time', 'update_time', 'publisher_id',
]
PRODUCT_REVIEW_FIELDS = [
    'id', 'product_id', 'review', 'reviewer_id', 'review_time', 'update_time',
]
PRODUCT_ATTRIBUTE_FIELDS = [
    'id', 'name', 'attribute_type', 'create_time', 'update_time',
]
PRODUCT_ATTRIBUTE_VALUE_FIELDS = [
    'id', 'product_id', 'attribute_id', 'value', 'publisher_id', 'publish_time', 'update_time',
]
ATTRIBUTE_DEFAULT_VALUES = {
    'score': 5,
    'number': 0,
    'bool': 1,
}

# 公开排行榜缓存：
# attributes 保存当前所有属性列；
# products 保存审核通过产品的聚合结果，key 为 product_id；
# dirty 为 True 时表示产品/属性结构有变化，需要在下次公开查询时重建缓存。
PRODUCT_RANKING_CACHE = {
    'attributes': [],
    'products': {},
    'dirty': True,
    'updated_at': None,
}


def _now() -> str:
    # 统一时间格式，避免不同接口各自拼接时间字符串。
    return datetime.datetime.now().isoformat()


def _product_dir(product_id: str) -> str:
    # 每个产品一个独立目录，当前主要用于存 logo。
    return f'products/{product_id}'


def _product_logo_exists(product_id: str) -> bool:
    # 用于列表接口快速标记产品是否已上传 logo，方便前端直接判断展示占位图还是实际图片。
    return os.path.exists(os.path.join(_product_dir(product_id), 'logo'))


async def _product_exists(product_id: str) -> bool:
    # 统一产品存在性检查，减少重复代码。
    return await ProductDBModel.filter(id=product_id).exists()


async def _attribute_exists(attribute_id: str) -> bool:
    # 统一属性定义存在性检查。
    return await ProductAttributeDBModel.filter(id=attribute_id).exists()


async def _is_duplicate_product_name(tool_name: str, exclude_id: Optional[str] = None) -> bool:
    # 按“完全重名”拦截产品，新增和编辑都走这里。
    query = ProductDBModel.filter(tool_name=tool_name)
    if exclude_id:
        query = query.exclude(id=exclude_id)
    return await query.exists()


async def _get_product_or_none(product_id: str) -> Optional[dict]:
    # 单条产品查询，同时补充 has_logo 这种衍生字段，避免前端再额外请求一次 logo。
    result = await ProductDBModel.filter(id=product_id).values(*PRODUCT_FIELDS)
    if len(result) == 0:
        return None
    product = result[0]
    product['has_logo'] = _product_logo_exists(product['id'])
    return product


def _with_logo_flag(items: list[dict]) -> list[dict]:
    # 列表接口批量补充 has_logo 标记。
    for item in items:
        item['has_logo'] = _product_logo_exists(item['id'])
    return items


async def _is_approved_product(product_id: str) -> bool:
    # 公开展示、普通用户评价/打分都只允许针对审核通过的产品。
    return await ProductDBModel.filter(id=product_id, audit_status=AUDIT_APPROVED).exists()


async def _is_product_owner(product_id: str, userid: str) -> bool:
    # 用户上传 logo 时，允许产品提交者本人操作。
    return await ProductDBModel.filter(id=product_id, publisher_id=userid).exists()


async def _assert_upload_permission(product_id: str, userid: str, role: str):
    # 管理员可上传任意产品 logo，普通用户只能上传自己提交产品的 logo。
    if 'admin' in role:
        return True
    return await _is_product_owner(product_id, userid)


def _mark_product_ranking_cache_dirty():
    # 当产品或属性结构变化时，直接标记缓存失效，避免继续返回旧列结构。
    PRODUCT_RANKING_CACHE['dirty'] = True


def _parse_numeric_value(raw_value, attribute_type: str) -> float:
    # 属性值统一按数值参与平均：
    # score / number 直接转数值，bool 也按 0/1 处理。
    try:
        if raw_value is None or raw_value == '':
            return float(ATTRIBUTE_DEFAULT_VALUES.get(attribute_type, 0))
        return float(raw_value)
    except (TypeError, ValueError):
        return float(ATTRIBUTE_DEFAULT_VALUES.get(attribute_type, 0))


def _normalize_attribute_value(raw_value):
    # 属性值数据库字段当前用 TextField 存储；
    # 接口层允许前端直接传数字/布尔，这里统一转成字符串后再入库。
    if raw_value is None:
        return None
    return str(raw_value)


def _compute_sort_score(attribute_value_list: list[dict]) -> float:
    # 排行仅看 score 类型属性的均分。
    # 展示层仍可对未评分项返回默认满分，但排序时这些“无评分”项按 0 分处理。
    score_values = []
    for item in attribute_value_list:
        if item.get('attribute_type') != 'score':
            continue
        current_count = item.get('value_count', 0) or 0
        if current_count == 0:
            score_values.append(0.0)
            continue
        score_values.append(float(item.get('avg_value', 0)))

    if len(score_values) == 0:
        return 0.0
    return round(sum(score_values) / len(score_values), 4)


async def _build_product_ranking_payload(product: dict, attributes: list[dict]) -> dict:
    # 计算单个产品在所有属性维度上的平均分。
    # 若某属性暂无任何用户打分，则返回该属性类型的默认值：
    # score=5, number=0, bool=1。
    attribute_values = await ProductAttributeValueDBModel.filter(product_id=product['id']).values(
        'attribute_id', 'value'
    )
    grouped_values: dict[str, list[float]] = {}
    for item in attribute_values:
        grouped_values.setdefault(item['attribute_id'], []).append(item['value'])

    attribute_score_map = {}
    attribute_score_list = []
    for attribute in attributes:
        attribute_id = attribute['id']
        attribute_type = attribute['attribute_type']
        current_values = grouped_values.get(attribute_id, [])
        if len(current_values) == 0:
            avg_value = float(ATTRIBUTE_DEFAULT_VALUES.get(attribute_type, 0))
        else:
            numeric_values = [_parse_numeric_value(value, attribute_type) for value in current_values]
            avg_value = round(sum(numeric_values) / len(numeric_values), 4)

        attribute_score_map[attribute_id] = avg_value
        attribute_score_list.append({
            'attribute_id': attribute_id,
            'name': attribute['name'],
            'attribute_type': attribute_type,
            'avg_value': avg_value,
            'value_count': len(current_values),
        })

    cached_product = product.copy()
    cached_product['has_logo'] = _product_logo_exists(product['id'])
    cached_product['attribute_values'] = attribute_score_map
    cached_product['attribute_value_list'] = attribute_score_list
    return cached_product


async def _rebuild_product_ranking_cache():
    # 全量重建公开排行榜缓存：
    # 1. 读取全部属性列；
    # 2. 读取全部审核通过产品；
    # 3. 为每个产品计算所有属性的平均值。
    attributes = await ProductAttributeDBModel.all().values(*PRODUCT_ATTRIBUTE_FIELDS)
    approved_products = await ProductDBModel.filter(audit_status=AUDIT_APPROVED).values(*PRODUCT_FIELDS)

    cached_products = {}
    for product in approved_products:
        cached_products[product['id']] = await _build_product_ranking_payload(product, attributes)

    PRODUCT_RANKING_CACHE['attributes'] = attributes
    PRODUCT_RANKING_CACHE['products'] = cached_products
    PRODUCT_RANKING_CACHE['dirty'] = False
    PRODUCT_RANKING_CACHE['updated_at'] = _now()


async def _ensure_product_ranking_cache():
    # 公开查询前先确保缓存可用。
    if PRODUCT_RANKING_CACHE['dirty']:
        await _rebuild_product_ranking_cache()


async def _refresh_cached_product_ranking(product_id: str):
    # 当某个产品被用户重新打分后，只增量刷新该产品在缓存中的聚合结果。
    await _ensure_product_ranking_cache()
    product = await ProductDBModel.filter(id=product_id, audit_status=AUDIT_APPROVED).values(*PRODUCT_FIELDS)
    if len(product) == 0:
        PRODUCT_RANKING_CACHE['products'].pop(product_id, None)
        PRODUCT_RANKING_CACHE['updated_at'] = _now()
        return

    attributes = PRODUCT_RANKING_CACHE['attributes']
    PRODUCT_RANKING_CACHE['products'][product_id] = await _build_product_ranking_payload(product[0], attributes)
    PRODUCT_RANKING_CACHE['updated_at'] = _now()


async def _list_products_core(
    search: Optional[str] = None,
    tool_type: Optional[str] = None,
    offset: int = 0,
    limit: int = 99999,
    only_approved: bool = False,
):
    # 产品列表的通用查询逻辑：
    # 后台和公开端都复用，差别主要在是否只看审核通过的数据。
    query = ProductDBModel.all()
    if only_approved:
        query = query.filter(audit_status=AUDIT_APPROVED)
    if search:
        query = query.filter(
            Q(tool_name__icontains=search) |
            Q(tool_type__icontains=search) |
            Q(organization__icontains=search) |
            Q(introduction__icontains=search)
        )
    if tool_type:
        query = query.filter(tool_type=tool_type)

    products = await query.values(*PRODUCT_FIELDS)
    total = len(products)
    paginated_products = _with_logo_flag(products[offset:offset + limit])
    return {'list': paginated_products, 'total': total}


async def _list_client_products_with_ranking(
    search: Optional[str] = None,
    tool_type: Optional[str] = None,
    offset: int = 0,
    limit: int = 99999,
):
    # 公开排行榜查询直接读取缓存，并返回：
    # 1. attributes: 所有属性列；
    # 2. list: 当前页产品；
    # 3. total: 过滤后的总数。
    await _ensure_product_ranking_cache()

    cached_products = list(PRODUCT_RANKING_CACHE['products'].values())
    filtered_products = []
    for product in cached_products:
        if search:
            matched = (
                search.lower() in (product.get('tool_name') or '').lower()
                or search.lower() in (product.get('tool_type') or '').lower()
            )
            if not matched:
                continue
        if tool_type and product.get('tool_type') != tool_type:
            continue
        filtered_products.append(product)

    filtered_products.sort(key=lambda product: product.get('tool_name') or '')
    filtered_products.sort(key=lambda product: product.get('publish_time') or '', reverse=True)
    filtered_products.sort(
        key=lambda product: _compute_sort_score(product.get('attribute_value_list', [])),
        reverse=True,
    )

    total = len(filtered_products)
    paginated_products = filtered_products[offset:offset + limit]
    return {
        'attributes': PRODUCT_RANKING_CACHE['attributes'],
        'list': paginated_products,
        'total': total,
        'updated_at': PRODUCT_RANKING_CACHE['updated_at'],
    }


async def _count_client_products(search: Optional[str] = None, tool_type: Optional[str] = None) -> int:
    # 与公开列表保持一致的筛选条件，只返回数量给前端分页。
    await _ensure_product_ranking_cache()

    count = 0
    for product in PRODUCT_RANKING_CACHE['products'].values():
        if search:
            matched = (
                search.lower() in (product.get('tool_name') or '').lower()
                or search.lower() in (product.get('tool_type') or '').lower()
            )
            if not matched:
                continue
        if tool_type and product.get('tool_type') != tool_type:
            continue
        count += 1
    return count


async def _list_client_tool_types() -> list[str]:
    # 公开端只返回审核通过产品下的 tool_type，并做去重和空值过滤。
    tool_types = await ProductDBModel.filter(audit_status=AUDIT_APPROVED).values_list('tool_type', flat=True)
    return sorted({tool_type for tool_type in tool_types if tool_type})


# 管理端产品列表。
@router.get('/products/get_products', operation_id='ListProducts')
@auth.require_admin()
async def list_products(search: Optional[str] = None, tool_type: Optional[str] = None, offset: int = 0, limit: int = 99999):
    return response_body(code=200, status='success', data=await _list_products_core(search, tool_type, offset, limit))


# 公开产品列表，只返回审核通过的数据，支持搜索、分类和分页。
@router.get('/products/client/get_products', operation_id='ListClientProducts')
async def list_client_products(search: Optional[str] = None, tool_type: Optional[str] = None, offset: int = 0, limit: int = 99999):
    return response_body(
        code=200,
        status='success',
        data=await _list_client_products_with_ranking(search, tool_type, offset, limit),
    )


# 公开产品列表总数，供前端分页时单独查询。
@router.get('/products/client/get_products_total', operation_id='CountClientProducts')
async def count_client_products(search: Optional[str] = None, tool_type: Optional[str] = None):
    return response_body(
        code=200,
        status='success',
        data={'total': await _count_client_products(search, tool_type)},
    )


# 公开端获取所有去重后的 tool_type，只统计审核通过产品。
@router.get('/products/client/get_tool_types', operation_id='ListClientProductToolTypes')
async def list_client_product_tool_types():
    return response_body(
        code=200,
        status='success',
        data={'list': await _list_client_tool_types()},
    )


# 管理端查看单个产品详情。
@router.get('/products/get_product', operation_id='GetProduct')
@auth.require_admin()
async def get_product(id: str):
    product = await _get_product_or_none(id)
    if product is None:
        return response_body(code=404, status='failed', message='Product not found')
    return response_body(code=200, status='success', data=product)


# 公开端查看产品详情，仅限审核通过产品。
@router.get('/products/client/get_product', operation_id='GetClientProduct')
async def get_client_product(id: str):
    product = await _get_product_or_none(id)
    if product is None or product.get('audit_status') != AUDIT_APPROVED:
        return response_body(code=404, status='failed', message='Product not found')
    return response_body(code=200, status='success', data=product)


# 管理员新增或编辑产品。
# 管理员创建的数据默认可直接设为 approved，也可手动传其他审核状态。
@router.post('/products/update', operation_id='AddOrUpdateProduct')
@auth.require_admin()
async def add_or_update_product(product_item: ProductItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()

    if await _is_duplicate_product_name(product_item.tool_name, product_item.id):
        return response_body(code=400, status='failed', message='Product name already exists')

    if product_item.id:
        existed = await ProductDBModel.filter(id=product_item.id).exists()
        if not existed:
            return response_body(code=404, status='failed', message='Product not found')

        update_data = {
            'tool_name': product_item.tool_name,
            'tool_type': product_item.tool_type,
            'organization': product_item.organization,
            'homepage_url': product_item.homepage_url,
            'introduction': product_item.introduction,
            'audit_status': product_item.audit_status or AUDIT_APPROVED,
            'update_time': now,
        }
        await ProductDBModel.filter(id=product_item.id).update(**update_data)
        _mark_product_ranking_cache_dirty()
        return response_body(code=200, status='success', message='Product updated successfully')

    product_id = str(uuid.uuid4())
    product_data = {
        'id': product_id,
        'tool_name': product_item.tool_name,
        'tool_type': product_item.tool_type,
        'organization': product_item.organization,
        'homepage_url': product_item.homepage_url,
        'introduction': product_item.introduction,
        'audit_status': product_item.audit_status or AUDIT_APPROVED,
        'publish_time': now,
        'update_time': now,
        'publisher_id': userid,
    }
    await ProductDBModel.create(**product_data)
    _mark_product_ranking_cache_dirty()
    return response_body(code=200, status='success', message='Product added successfully', data=product_data)


# 普通用户提交产品，统一进入待审核状态。
@router.post('/products/submit', operation_id='SubmitProduct')
@auth.require_user()
async def submit_product(product_item: ProductItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()

    if await _is_duplicate_product_name(product_item.tool_name):
        return response_body(code=400, status='failed', message='Product name already exists')

    product_id = str(uuid.uuid4())
    product_data = {
        'id': product_id,
        'tool_name': product_item.tool_name,
        'tool_type': product_item.tool_type,
        'organization': product_item.organization,
        'homepage_url': product_item.homepage_url,
        'introduction': product_item.introduction,
        'audit_status': AUDIT_PENDING,
        'publish_time': now,
        'update_time': now,
        'publisher_id': userid,
    }
    await ProductDBModel.create(**product_data)
    _mark_product_ranking_cache_dirty()
    return response_body(code=200, status='success', message='Product submitted successfully', data=product_data)


# 删除产品时依赖外键级联清理评价、属性值；
# 同时手动删除 products/{id} 目录，清掉 logo 等文件资源。
@router.delete('/products/remove', operation_id='DeleteProduct')
@auth.require_admin()
async def delete_product(id: str):
    removed = await ProductDBModel.filter(id=id).delete()
    if removed == 0:
        return response_body(code=404, status='failed', message='Product not found')

    product_dir = _product_dir(id)
    if os.path.exists(product_dir):
        shutil.rmtree(product_dir)

    _mark_product_ranking_cache_dirty()
    return response_body(code=200, status='success', message='Product deleted successfully')


# 上传产品 logo。
# 存储路径固定为 products/{id}/logo，便于后续统一读取和删除。
@router.post('/products/upload_logo', operation_id='UploadProductLogo')
@auth.require_user()
async def upload_product_logo(id: str, logo: UploadFile = File(...), valid_info=None):
    userid = valid_info['userid']
    role = valid_info['role']
    existed = await _product_exists(id)
    if not existed:
        return response_body(code=404, status='failed', message='Product not found')

    allowed = await _assert_upload_permission(id, userid, role)
    if not allowed:
        return response_body(code=403, status='failed', message='permission denied')

    image_dir = _product_dir(id)
    ensure_folder(image_dir)
    clear_compressed_image_cache(image_dir, 'logo')
    logo_path = os.path.join(image_dir, 'logo')
    with open(logo_path, 'wb') as buffer:
        buffer.write(logo.file.read())

    return response_body(code=200, status='success', message='Logo uploaded successfully')


# 公开端读取 logo，只允许查看审核通过产品的 logo。
@router.get('/products/get_logo', operation_id='GetProductLogo')
async def get_product_logo(id: str):
    product = await _get_product_or_none(id)
    if product is None:
        return response_body(code=404, status='failed', message='Product not found')
    if product.get('audit_status') != AUDIT_APPROVED:
        return response_body(code=404, status='failed', message='Logo not found')

    image_dir = _product_dir(id)
    file_path = os.path.join(image_dir, 'logo')
    if not os.path.exists(file_path):
        return response_body(code=404, status='failed', message='Logo not found')

    compressed_path, media_type = get_compressed_image_info(image_dir, 'logo')
    return FileResponse(compressed_path, media_type=media_type)


# 按现有前端调用保留 admin 路径，但这里不再做权限限制。
# 与公开接口的区别是：这个接口不校验审核状态，只要产品存在且有 logo 就可读取。
@router.get('/products/admin/get_logo', operation_id='GetAdminProductLogo')
async def get_admin_product_logo(id: str):
    existed = await _product_exists(id)
    if not existed:
        return response_body(code=404, status='failed', message='Product not found')

    image_dir = _product_dir(id)
    file_path = os.path.join(image_dir, 'logo')
    if not os.path.exists(file_path):
        return response_body(code=404, status='failed', message='Logo not found')

    compressed_path, media_type = get_compressed_image_info(image_dir, 'logo')
    return FileResponse(compressed_path, media_type=media_type)


# 管理端查看指定产品下的所有评价。
@router.get('/products/reviews/get_reviews', operation_id='ListProductReviews')
@auth.require_admin()
async def list_product_reviews(product_id: str, offset: int = 0, limit: int = 99999):
    if not await _product_exists(product_id):
        return response_body(code=404, status='failed', message='Product not found')

    reviews = await ProductReviewDBModel.filter(product_id=product_id).values(*PRODUCT_REVIEW_FIELDS)
    total = len(reviews)
    paginated_reviews = reviews[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_reviews, 'total': total})


# 公开端查看审核通过产品下的评价。
@router.get('/products/client/reviews/get_reviews', operation_id='ListClientProductReviews')
async def list_client_product_reviews(product_id: str, offset: int = 0, limit: int = 99999):
    if not await _is_approved_product(product_id):
        return response_body(code=404, status='failed', message='Product not found')

    reviews = await ProductReviewDBModel.filter(product_id=product_id).values(*PRODUCT_REVIEW_FIELDS)
    total = len(reviews)
    paginated_reviews = reviews[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_reviews, 'total': total})


# 管理端查看单条评价。
@router.get('/products/reviews/get_review', operation_id='GetProductReview')
@auth.require_admin()
async def get_product_review(id: str):
    result = await ProductReviewDBModel.filter(id=id).values(*PRODUCT_REVIEW_FIELDS)
    if len(result) == 0:
        return response_body(code=404, status='failed', message='Review not found')
    return response_body(code=200, status='success', data=result[0])


# 当前登录用户查看自己对某个产品的评价。
# 前端在“修改评价”前可先调这个接口，有记录就回填，没有则提示用户新建。
@router.get('/products/reviews/my_review', operation_id='GetMyProductReview')
@auth.require_user()
async def get_my_product_review(product_id: str, valid_info=None):
    userid = valid_info['userid']
    if not await _is_approved_product(product_id):
        return response_body(code=404, status='failed', message='Product not found')

    result = await ProductReviewDBModel.filter(
        product_id=product_id,
        reviewer_id=userid,
    ).values(*PRODUCT_REVIEW_FIELDS)
    if len(result) == 0:
        return response_body(code=200, status='success', data={'exists': False, 'review': None})
    return response_body(code=200, status='success', data={'exists': True, 'review': result[0]})


# 管理员维护评价，保留这个接口便于后台纠错或代录。
@router.post('/products/reviews/update', operation_id='AddOrUpdateProductReview')
@auth.require_admin()
async def add_or_update_product_review(review_item: ProductReviewItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()

    if not await _product_exists(review_item.product_id):
        return response_body(code=404, status='failed', message='Product not found')

    if review_item.id:
        existed = await ProductReviewDBModel.filter(id=review_item.id).exists()
        if not existed:
            return response_body(code=404, status='failed', message='Review not found')

        update_data = {
            'review': review_item.review,
            'update_time': now,
        }
        await ProductReviewDBModel.filter(id=review_item.id).update(**update_data)
        await _refresh_cached_product_ranking(review_item.product_id)
        return response_body(code=200, status='success', message='Review updated successfully')

    review_id = str(uuid.uuid4())
    review_data = {
        'id': review_id,
        'product_id': review_item.product_id,
        'review': review_item.review,
        'reviewer_id': userid,
        'review_time': now,
        'update_time': now,
    }
    await ProductReviewDBModel.create(**review_data)
    await _refresh_cached_product_ranking(review_item.product_id)
    return response_body(code=200, status='success', message='Review added successfully', data=review_data)


# 普通用户提交评价。
# 这里约束为“同一用户对同一产品只保留一条评价”，重复提交按更新处理。
@router.post('/products/reviews/submit', operation_id='SubmitProductReview')
@auth.require_user()
async def submit_product_review(review_item: ProductReviewItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()

    if not await _is_approved_product(review_item.product_id):
        return response_body(code=404, status='failed', message='Product not found')

    existed_review = await ProductReviewDBModel.filter(
        product_id=review_item.product_id,
        reviewer_id=userid,
    ).values(*PRODUCT_REVIEW_FIELDS)
    if len(existed_review) > 0:
        review_id = existed_review[0]['id']
        await ProductReviewDBModel.filter(id=review_id).update(
            review=review_item.review,
            update_time=now,
        )
        await _refresh_cached_product_ranking(review_item.product_id)
        return response_body(code=200, status='success', message='Review updated successfully', data={'id': review_id})

    review_id = str(uuid.uuid4())
    review_data = {
        'id': review_id,
        'product_id': review_item.product_id,
        'review': review_item.review,
        'reviewer_id': userid,
        'review_time': now,
        'update_time': now,
    }
    await ProductReviewDBModel.create(**review_data)
    await _refresh_cached_product_ranking(review_item.product_id)
    return response_body(code=200, status='success', message='Review submitted successfully', data=review_data)


# 管理员删除单条评价。
@router.delete('/products/reviews/remove', operation_id='DeleteProductReview')
@auth.require_admin()
async def delete_product_review(id: str):
    review = await ProductReviewDBModel.filter(id=id).values('product_id')
    removed = await ProductReviewDBModel.filter(id=id).delete()
    if removed == 0:
        return response_body(code=404, status='failed', message='Review not found')
    if len(review) > 0:
        await _refresh_cached_product_ranking(review[0]['product_id'])
    return response_body(code=200, status='success', message='Review deleted successfully')


# 管理端查看属性定义列表。
@router.get('/products/attributes/get_attributes', operation_id='ListProductAttributes')
@auth.require_admin()
async def list_product_attributes(search: Optional[str] = None, offset: int = 0, limit: int = 99999):
    query = ProductAttributeDBModel.all()
    if search:
        query = query.filter(Q(name__icontains=search) | Q(attribute_type__icontains=search))

    attributes = await query.values(*PRODUCT_ATTRIBUTE_FIELDS)
    total = len(attributes)
    paginated_attributes = attributes[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_attributes, 'total': total})


# 公开端查看属性定义列表，方便前端渲染评价维度。
@router.get('/products/client/attributes/get_attributes', operation_id='ListClientProductAttributes')
async def list_client_product_attributes(search: Optional[str] = None, offset: int = 0, limit: int = 99999):
    query = ProductAttributeDBModel.all()
    if search:
        query = query.filter(Q(name__icontains=search) | Q(attribute_type__icontains=search))

    attributes = await query.values(*PRODUCT_ATTRIBUTE_FIELDS)
    total = len(attributes)
    paginated_attributes = attributes[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_attributes, 'total': total})


# 管理端查看单个属性定义。
@router.get('/products/attributes/get_attribute', operation_id='GetProductAttribute')
@auth.require_admin()
async def get_product_attribute(id: str):
    result = await ProductAttributeDBModel.filter(id=id).values(*PRODUCT_ATTRIBUTE_FIELDS)
    if len(result) == 0:
        return response_body(code=404, status='failed', message='Attribute not found')
    return response_body(code=200, status='success', data=result[0])


# 管理员维护属性定义，例如“易用性”“价格”“功能完整度”等。
@router.post('/products/attributes/update', operation_id='AddOrUpdateProductAttribute')
@auth.require_admin()
async def add_or_update_product_attribute(attribute_item: ProductAttributeItem):
    now = _now()

    if attribute_item.id:
        existed = await ProductAttributeDBModel.filter(id=attribute_item.id).exists()
        if not existed:
            return response_body(code=404, status='failed', message='Attribute not found')

        duplicate = await ProductAttributeDBModel.filter(name=attribute_item.name).exclude(id=attribute_item.id).exists()
        if duplicate:
            return response_body(code=400, status='failed', message='Attribute name already exists')

        update_data = {
            'name': attribute_item.name,
            'attribute_type': attribute_item.attribute_type,
            'update_time': now,
        }
        await ProductAttributeDBModel.filter(id=attribute_item.id).update(**update_data)
        _mark_product_ranking_cache_dirty()
        return response_body(code=200, status='success', message='Attribute updated successfully')

    duplicate = await ProductAttributeDBModel.filter(name=attribute_item.name).exists()
    if duplicate:
        return response_body(code=400, status='failed', message='Attribute name already exists')

    attribute_id = str(uuid.uuid4())
    attribute_data = {
        'id': attribute_id,
        'name': attribute_item.name,
        'attribute_type': attribute_item.attribute_type,
        'create_time': now,
        'update_time': now,
    }
    await ProductAttributeDBModel.create(**attribute_data)
    _mark_product_ranking_cache_dirty()
    return response_body(code=200, status='success', message='Attribute added successfully', data=attribute_data)


# 删除属性定义时，对应属性值会通过外键级联自动删除。
@router.delete('/products/attributes/remove', operation_id='DeleteProductAttribute')
@auth.require_admin()
async def delete_product_attribute(id: str):
    removed = await ProductAttributeDBModel.filter(id=id).delete()
    if removed == 0:
        return response_body(code=404, status='failed', message='Attribute not found')
    _mark_product_ranking_cache_dirty()
    return response_body(code=200, status='success', message='Attribute deleted successfully')


# 管理端查看属性值，可按产品或属性维度筛选。
@router.get('/products/attribute_values/get_values', operation_id='ListProductAttributeValues')
@auth.require_admin()
async def list_product_attribute_values(
    product_id: Optional[str] = None,
    attribute_id: Optional[str] = None,
    offset: int = 0,
    limit: int = 99999,
):
    query = ProductAttributeValueDBModel.all()
    if product_id:
        query = query.filter(product_id=product_id)
    if attribute_id:
        query = query.filter(attribute_id=attribute_id)

    values = await query.values(*PRODUCT_ATTRIBUTE_VALUE_FIELDS)
    total = len(values)
    paginated_values = values[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_values, 'total': total})


# 公开端查看属性值。
# 如果指定 product_id，则要求该产品已审核通过；
# 如果不指定 product_id，则只返回所有已审核通过产品下的属性值。
@router.get('/products/client/attribute_values/get_values', operation_id='ListClientProductAttributeValues')
async def list_client_product_attribute_values(
    product_id: Optional[str] = None,
    attribute_id: Optional[str] = None,
    offset: int = 0,
    limit: int = 99999,
):
    if product_id and not await _is_approved_product(product_id):
        return response_body(code=404, status='failed', message='Product not found')

    query = ProductAttributeValueDBModel.all()
    if product_id:
        query = query.filter(product_id=product_id)
    if attribute_id:
        query = query.filter(attribute_id=attribute_id)

    if not product_id:
        approved_product_ids = await ProductDBModel.filter(audit_status=AUDIT_APPROVED).values_list('id', flat=True)
        query = query.filter(product_id__in=list(approved_product_ids))

    values = await query.values(*PRODUCT_ATTRIBUTE_VALUE_FIELDS)
    total = len(values)
    paginated_values = values[offset:offset + limit]
    return response_body(code=200, status='success', data={'list': paginated_values, 'total': total})


# 管理端查看单条属性值。
@router.get('/products/attribute_values/get_value', operation_id='GetProductAttributeValue')
@auth.require_admin()
async def get_product_attribute_value(id: str):
    result = await ProductAttributeValueDBModel.filter(id=id).values(*PRODUCT_ATTRIBUTE_VALUE_FIELDS)
    if len(result) == 0:
        return response_body(code=404, status='failed', message='Attribute value not found')
    return response_body(code=200, status='success', data=result[0])


# 当前登录用户查看自己对某个产品的属性值记录。
# 可传 attribute_id 查单个属性，也可不传以便一次性回填整个表单。
@router.get('/products/attribute_values/my_values', operation_id='GetMyProductAttributeValues')
@auth.require_user()
async def get_my_product_attribute_values(product_id: str, attribute_id: Optional[str] = None, valid_info=None):
    userid = valid_info['userid']
    if not await _is_approved_product(product_id):
        return response_body(code=404, status='failed', message='Product not found')

    query = ProductAttributeValueDBModel.filter(
        product_id=product_id,
        publisher_id=userid,
    )
    if attribute_id:
        query = query.filter(attribute_id=attribute_id)

    values = await query.values(*PRODUCT_ATTRIBUTE_VALUE_FIELDS)
    if attribute_id:
        if len(values) == 0:
            return response_body(code=200, status='success', data={'exists': False, 'value': None})
        return response_body(code=200, status='success', data={'exists': True, 'value': values[0]})

    value_map = {}
    for item in values:
        value_map[item['attribute_id']] = item
    return response_body(code=200, status='success', data={'list': values, 'map': value_map})


# 管理员维护属性值，便于后台修正异常数据。
@router.post('/products/attribute_values/update', operation_id='AddOrUpdateProductAttributeValue')
@auth.require_admin()
async def add_or_update_product_attribute_value(value_item: ProductAttributeValueItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()
    normalized_value = _normalize_attribute_value(value_item.value)

    if not await _product_exists(value_item.product_id):
        return response_body(code=404, status='failed', message='Product not found')
    if not await _attribute_exists(value_item.attribute_id):
        return response_body(code=404, status='failed', message='Attribute not found')

    if value_item.id:
        existed = await ProductAttributeValueDBModel.filter(id=value_item.id).exists()
        if not existed:
            return response_body(code=404, status='failed', message='Attribute value not found')

        update_data = {
            'product_id': value_item.product_id,
            'attribute_id': value_item.attribute_id,
            'value': normalized_value,
            'update_time': now,
        }
        await ProductAttributeValueDBModel.filter(id=value_item.id).update(**update_data)
        await _refresh_cached_product_ranking(value_item.product_id)
        return response_body(code=200, status='success', message='Attribute value updated successfully')

    value_id = str(uuid.uuid4())
    value_data = {
        'id': value_id,
        'product_id': value_item.product_id,
        'attribute_id': value_item.attribute_id,
        'value': normalized_value,
        'publisher_id': userid,
        'publish_time': now,
        'update_time': now,
    }
    await ProductAttributeValueDBModel.create(**value_data)
    await _refresh_cached_product_ranking(value_item.product_id)
    return response_body(code=200, status='success', message='Attribute value added successfully', data=value_data)


# 普通用户提交属性值。
# 这里约束为“同一用户对同一产品的同一属性只保留一条记录”，重复提交按更新处理。
@router.post('/products/attribute_values/submit', operation_id='SubmitProductAttributeValue')
@auth.require_user()
async def submit_product_attribute_value(value_item: ProductAttributeValueItem, valid_info=None):
    userid = valid_info['userid']
    now = _now()
    normalized_value = _normalize_attribute_value(value_item.value)

    if not await _is_approved_product(value_item.product_id):
        return response_body(code=404, status='failed', message='Product not found')
    if not await _attribute_exists(value_item.attribute_id):
        return response_body(code=404, status='failed', message='Attribute not found')

    existed_value = await ProductAttributeValueDBModel.filter(
        product_id=value_item.product_id,
        attribute_id=value_item.attribute_id,
        publisher_id=userid,
    ).values(*PRODUCT_ATTRIBUTE_VALUE_FIELDS)
    if len(existed_value) > 0:
        value_id = existed_value[0]['id']
        await ProductAttributeValueDBModel.filter(id=value_id).update(
            value=normalized_value,
            update_time=now,
        )
        await _refresh_cached_product_ranking(value_item.product_id)
        return response_body(code=200, status='success', message='Attribute value updated successfully', data={'id': value_id})

    value_id = str(uuid.uuid4())
    value_data = {
        'id': value_id,
        'product_id': value_item.product_id,
        'attribute_id': value_item.attribute_id,
        'value': normalized_value,
        'publisher_id': userid,
        'publish_time': now,
        'update_time': now,
    }
    await ProductAttributeValueDBModel.create(**value_data)
    await _refresh_cached_product_ranking(value_item.product_id)
    return response_body(code=200, status='success', message='Attribute value submitted successfully', data=value_data)


# 管理员删除单条属性值。
@router.delete('/products/attribute_values/remove', operation_id='DeleteProductAttributeValue')
@auth.require_admin()
async def delete_product_attribute_value(id: str):
    attribute_value = await ProductAttributeValueDBModel.filter(id=id).values('product_id')
    removed = await ProductAttributeValueDBModel.filter(id=id).delete()
    if removed == 0:
        return response_body(code=404, status='failed', message='Attribute value not found')
    if len(attribute_value) > 0:
        await _refresh_cached_product_ranking(attribute_value[0]['product_id'])
    return response_body(code=200, status='success', message='Attribute value deleted successfully')
