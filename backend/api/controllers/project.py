import datetime
import json
import os
import shutil
from typing import Optional

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse
from tortoise.expressions import Q

from api.models.body import ProjectItem, response_body
from api.models.db_init import ensure_folder
from api.models.db_models import ProjectDBModel
from api.models.verify_tool import Auth
from api.utils.image_compress import clear_compressed_image_cache, get_compressed_image_info

router = APIRouter(tags=['Project'])
with open('./api/app_config.json', encoding='utf-8') as config_file:
    app_config = json.load(config_file)
auth = Auth(app_config=app_config)

AUDIT_PENDING = 'pending'
AUDIT_APPROVED = 'approved'
AUDIT_REJECTED = 'rejected'
PROJECT_FIELDS = [
    'id', 'name', 'info', 'repo_type', 'href', 'icon', 'favor',
    'audit_status', 'publish_time', 'update_time', 'publisher_id',
]
PROJECT_CACHE = {'featured': [], 'dirty': True}


def _now() -> str:
    return datetime.datetime.now().isoformat()


def _project_dir(project_id: str) -> str:
    return f'projects/{project_id}'


def _icon_path(project_id: str) -> str:
    return os.path.join(_project_dir(project_id), 'icon')


def _with_icon_url(item: dict) -> dict:
    item['icon_url'] = f'/projects/icon/{item["id"]}' if os.path.exists(_icon_path(item['id'])) else None
    return item


async def _refresh_featured_cache():
    items = await ProjectDBModel.filter(
        audit_status=AUDIT_APPROVED,
        favor=True,
    ).order_by('-update_time').values(*PROJECT_FIELDS)
    PROJECT_CACHE['featured'] = [_with_icon_url(item) for item in items]
    PROJECT_CACHE['dirty'] = False


def _mark_cache_dirty():
    PROJECT_CACHE['dirty'] = True


async def seed_default_projects():
    now = _now()
    defaults = [
        ('fabulous', 'Fabulous', '让美好的界面变得简单。', 'github', 'https://github.com/Creator-SN/Fabulous', None),
        ('mathfx', 'MathFX', '让强大的数学工具更简单。', 'github', 'https://github.com/Creator-SN/MathFX', None),
        ('vfluent3', 'VFluent3', '人人可用的 Fluent 设计。', 'github', 'https://github.com/Creator-SN/VFluent3', None),
        ('powereditor', 'PowerEditor', '更聪明地编辑，更快地创作。', 'github', 'https://github.com/Creator-SN/PowerEditor', None),
    ]
    for project_id, name, info, repo_type, href, icon in defaults:
        existing = await ProjectDBModel.filter(id=project_id).first()
        if existing is None:
            await ProjectDBModel.create(
                id=project_id, name=name, info=info, repo_type=repo_type,
                href=href, icon=icon, favor=True,
                audit_status=AUDIT_APPROVED, publish_time=now,
                update_time=now, publisher_id='system',
            )
        elif existing.icon in {'ms-Icon--ViewDashboard', 'ms-Icon--Calculator', 'ms-Icon--Design', 'ms-Icon--Edit'}:
            await ProjectDBModel.filter(id=project_id).update(icon=None)
    _mark_cache_dirty()


async def _list_projects(search: Optional[str], offset: int, limit: int, approved: bool):
    query = ProjectDBModel.all()
    if approved:
        query = query.filter(audit_status=AUDIT_APPROVED)
    if search:
        query = query.filter(Q(name__icontains=search) | Q(info__icontains=search) | Q(repo_type__icontains=search))
    items = await query.order_by('-favor', '-update_time').values(*PROJECT_FIELDS)
    total = len(items)
    return {'list': [_with_icon_url(item) for item in items[offset:offset + limit]], 'total': total}


@router.get('/projects/featured', operation_id='ListFeaturedProjects')
async def list_featured_projects():
    if PROJECT_CACHE['dirty']:
        await _refresh_featured_cache()
    return response_body(code=200, status='success', data=PROJECT_CACHE['featured'])


@router.get('/projects/list', operation_id='ListProjects')
async def list_projects(search: Optional[str] = None, offset: int = 0, limit: int = 12):
    return response_body(code=200, status='success', data=await _list_projects(search, offset, limit, True))


@router.get('/projects/admin/list', operation_id='ListAdminProjects')
@auth.require_admin()
async def list_admin_projects(search: Optional[str] = None, offset: int = 0, limit: int = 99999):
    return response_body(code=200, status='success', data=await _list_projects(search, offset, limit, False))


@router.get('/projects/{id}', operation_id='GetProject')
async def get_project(id: str):
    result = await ProjectDBModel.filter(id=id, audit_status=AUDIT_APPROVED).values(*PROJECT_FIELDS)
    if not result:
        return response_body(code=404, status='failed', message='Project not found')
    return response_body(code=200, status='success', data=_with_icon_url(result[0]))


@router.post('/projects/update', operation_id='AddOrUpdateProject')
@auth.require_admin()
async def add_or_update_project(project: ProjectItem, valid_info=None):
    now = _now()
    if project.id:
        existed = await ProjectDBModel.filter(id=project.id).exists()
        if not existed:
            return response_body(code=404, status='failed', message='Project not found')
        await ProjectDBModel.filter(id=project.id).update(
            name=project.name, info=project.info, repo_type=project.repo_type,
            href=project.href, icon=project.icon, favor=project.favor,
            audit_status=project.audit_status or AUDIT_APPROVED, update_time=now,
        )
        _mark_cache_dirty()
        return response_body(code=200, status='success', data=project.dict())

    project_id = project.name.lower().replace(' ', '-')[:48]
    if await ProjectDBModel.filter(id=project_id).exists():
        project_id = f'{project_id}-{int(datetime.datetime.now().timestamp())}'
    data = project.dict(exclude={'id'})
    data.update(id=project_id, audit_status=project.audit_status or AUDIT_APPROVED,
                publish_time=now, update_time=now, publisher_id=valid_info['userid'])
    await ProjectDBModel.create(**data)
    _mark_cache_dirty()
    return response_body(code=200, status='success', data=data)


@router.delete('/projects/{id}', operation_id='DeleteProject')
@auth.require_admin()
async def delete_project(id: str):
    removed = await ProjectDBModel.filter(id=id).delete()
    if removed == 0:
        return response_body(code=404, status='failed', message='Project not found')
    project_dir = _project_dir(id)
    if os.path.exists(project_dir):
        shutil.rmtree(project_dir)
    _mark_cache_dirty()
    return response_body(code=200, status='success', message='Project deleted successfully')


@router.post('/projects/upload_icon', operation_id='UploadProjectIcon')
@auth.require_admin()
async def upload_project_icon(id: str, icon: UploadFile = File(...), valid_info=None):
    if not await ProjectDBModel.filter(id=id).exists():
        return response_body(code=404, status='failed', message='Project not found')
    project_dir = _project_dir(id)
    ensure_folder(project_dir)
    clear_compressed_image_cache(project_dir, 'icon')
    with open(_icon_path(id), 'wb') as buffer:
        buffer.write(await icon.read())
    await ProjectDBModel.filter(id=id).update(icon='icon', update_time=_now())
    _mark_cache_dirty()
    return response_body(code=200, status='success', message='Project icon uploaded successfully')


@router.get('/projects/icon/{id}', operation_id='GetProjectIcon')
async def get_project_icon(id: str):
    result = await ProjectDBModel.filter(id=id, audit_status=AUDIT_APPROVED).first()
    if result is None or not os.path.exists(_icon_path(id)):
        return response_body(code=404, status='failed', message='Project icon not found')
    compressed_path, media_type = get_compressed_image_info(_project_dir(id), 'icon')
    return FileResponse(compressed_path, media_type=media_type)
