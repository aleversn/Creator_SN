import datetime
import json
import os
import shutil
import uuid

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import FileResponse

from api.models.body import ResumeInfo, response_body
from api.models.db_init import ensure_folder
from api.models.db_models import ResumeDBModel, UserDBModel
from api.utils.image_compress import get_compressed_image_info
from api.models.verify_tool import Auth

router = APIRouter(prefix="/resume", tags=["Resume"])

with open("./api/app_config.json", encoding="utf-8") as config_file:
    app_config = json.load(config_file)
auth = Auth(app_config=app_config)
RESUME_IMAGE_ROOT = "resume_images"


def _resume_image_dir(resume_id: str) -> str:
    return os.path.join(RESUME_IMAGE_ROOT, resume_id)


async def _serialize(resume):
    user = None
    if resume.userid:
        users = await UserDBModel.filter(userid=resume.userid).values(
            "userid", "name", "email", "phone", "gender", "role"
        )
        user = users[0] if users else None
    return {
        "id": resume.id,
        "userid": resume.userid,
        "introduction": resume.introduction or {"type": "doc", "content": []},
        "updated_at": resume.updated_at,
        "user": user,
    }


@router.get("/list", operation_id="ListResumes")
async def list_resumes(valid_info=None):
    resumes = await ResumeDBModel.all().order_by("-updated_at")
    return response_body(code=200, data=[await _serialize(item) for item in resumes])


@router.get("/mine", operation_id="GetMyResume")
@auth.require_user()
async def get_my_resume(valid_info=None):
    resumes = await ResumeDBModel.filter(userid=valid_info["userid"])
    if not resumes:
        return response_body(code=404, status="failed", message="Resume not found")
    return response_body(code=200, data=await _serialize(resumes[0]))


@router.post("/save", operation_id="SaveResume")
@auth.require_user()
async def save_resume(resume: ResumeInfo, valid_info=None):
    is_admin = "admin" in str(valid_info.get("role") or "").split(",")
    userid = resume.userid if is_admin else valid_info["userid"]

    if userid and not await UserDBModel.filter(userid=userid).exists():
        return response_body(code=404, status="failed", message="User not found")

    current = None
    if resume.id:
        found = await ResumeDBModel.filter(id=resume.id).first()
        if found:
            current = found
    if current is None and userid:
        current = await ResumeDBModel.filter(userid=userid).first()

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    content = resume.introduction or {"type": "doc", "content": []}
    if current:
        if not is_admin and current.userid != valid_info["userid"]:
            return response_body(code=403, status="failed", message="Permission denied")
        await ResumeDBModel.filter(id=current.id).update(
            userid=userid, introduction=content, updated_at=now
        )
        current = await ResumeDBModel.filter(id=current.id).first()
    else:
        current = await ResumeDBModel.create(
            id=str(uuid.uuid4()), userid=userid, introduction=content, updated_at=now
        )
    return response_body(code=200, data=await _serialize(current))


@router.delete("/{resume_id}", operation_id="DeleteResume")
@auth.require_admin()
async def delete_resume(resume_id: str):
    removed = await ResumeDBModel.filter(id=resume_id).delete()
    if not removed:
        return response_body(code=404, status="failed", message="Resume not found")
    image_dir = _resume_image_dir(resume_id)
    if os.path.exists(image_dir):
        shutil.rmtree(image_dir)
    return response_body(code=200, message="Resume deleted successfully")


@router.post("/upload_image", operation_id="UploadResumeImage")
@auth.require_user()
async def upload_resume_image(
    id: str = Form(...), image: UploadFile = File(...), valid_info=None
):
    resume = await ResumeDBModel.filter(id=id).first()
    if not resume:
        return response_body(code=404, status="failed", message="Resume not found")

    is_admin = "admin" in str(valid_info.get("role") or "").split(",")
    if not is_admin and resume.userid != valid_info["userid"]:
        return response_body(code=403, status="failed", message="Permission denied")
    if not image.content_type or not image.content_type.startswith("image/"):
        return response_body(code=400, status="failed", message="Only image files are supported")

    image_dir = _resume_image_dir(id)
    ensure_folder(image_dir)
    image_name = f"{uuid.uuid4()}.jpg"
    image_path = os.path.join(image_dir, image_name)
    with open(image_path, "wb") as buffer:
        buffer.write(await image.read())

    return response_body(
        code=200,
        status="success",
        message="Resume image uploaded successfully",
        data={"image_name": image_name},
    )


@router.get("/image/{resume_id}/{image_name}", operation_id="GetResumeImage")
async def get_resume_image(resume_id: str, image_name: str):
    if (
        not image_name
        or image_name != os.path.basename(image_name)
        or not image_name.endswith(".jpg")
        or "_cmp_cache" in image_name
    ):
        return response_body(code=400, status="failed", message="Invalid image name")

    image_dir = _resume_image_dir(resume_id)
    image_path = os.path.join(image_dir, image_name)
    if not os.path.exists(image_path):
        return response_body(code=404, status="failed", message="Image not found")

    compressed_path, media_type = get_compressed_image_info(image_dir, image_name)
    return FileResponse(compressed_path, media_type=media_type)
