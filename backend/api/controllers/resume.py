import datetime
import json
import uuid

from fastapi import APIRouter

from api.models.body import ResumeInfo, response_body
from api.models.db_models import ResumeDBModel, UserDBModel
from api.models.verify_tool import Auth

router = APIRouter(prefix="/resume", tags=["Resume"])

with open("./api/app_config.json", encoding="utf-8") as config_file:
    app_config = json.load(config_file)
auth = Auth(app_config=app_config)


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
    return response_body(code=200, message="Resume deleted successfully")
