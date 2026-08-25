from typing import Optional, List, Union
from pydantic import BaseModel


class response_body:
    def __init__(self, code=200, status='success', message='', data=None):
        self.code = code
        self.status = status
        self.message = message
        self.data = data

    def __call__(self):
        res = {}
        for key, value in self.__dict__.items():
            if value:
                res[key] = value
        return res


class User(BaseModel):
    userid: str
    name: Optional[str] = None
    pwd: str
    avatar: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    invite_code: Optional[str] = None
    role: Optional[str] = None
    apply_time: Optional[str] = None
    last_login: Optional[str] = None


class UserInfo(User):
    userid: str = None
    pwd: str = None


class UserSecurityInfo(BaseModel):
    userid: str = None
    pwd: str
    confirm_pwd: str


class ResumeInfo(BaseModel):
    id: Optional[str] = None
    userid: Optional[str] = None
    introduction: Union[dict, list, str, None] = None


class Major(BaseModel):
    id: str = None
    name: str = None


class Group(BaseModel):
    id: str = None
    name: str = None


class Edu(BaseModel):
    id: str = None
    name: str = None


class Team(BaseModel):
    id: str = None
    name: str = None

class ClientTeam(BaseModel):
    id: str = None
    name: str = None
    groups: List[Group] = None

class ToWhere(BaseModel):
    id: str = None
    name: str = None


class AwardItem(BaseModel):
    id: str = None
    name: str = None


class AwardLevel(BaseModel):
    id: str = None
    level: str = None


class MemberAward(BaseModel):
    competitionName: str
    level: str
    session: str
    date: str
    region: str


class MemberInfo(BaseModel):
    id: str = None
    name: str
    grade: str
    session: str
    major: str
    title: str
    toWhere: str
    postAddress: str
    educations: List[Edu]
    teams: List[Team]
    groups: List[Group]
    introduction: str
    photo: str = None
    userid: Optional[str] = None
    awards: List[MemberAward]
    email: str
    mobile: str
    external: Optional[str] = None

class NewsItem(BaseModel):
    id: str = None
    title: str
    description: str = None
    news_type: str = None
    publisher_id: str = None
    content: str = None
    create_time: str = None
    update_time: str = None
    external: Optional[str] = None

class PublicationItem(BaseModel):
    id: Optional[str] = None
    publisher: Optional[str] = None
    DOI: Optional[str] = None
    year: Optional[str] = None
    createDate: Optional[str] = None
    source: Optional[str] = None
    title: Optional[str] = None
    url: Optional[str] = None
    booktitle: Optional[str] = None  # 一般是会议名称
    abstract: Optional[str] = None
    ISSN: Optional[str] = None
    language: Optional[str] = None
    chapter: Optional[str] = None
    volume: Optional[str] = None
    number: Optional[str] = None
    pages: Optional[str] = None
    school: Optional[str] = None
    note: Optional[str] = None
    author: Optional[str] = None
    authors: Optional[str] = None
    containerTitle: Optional[str] = None
    entry_type: Optional[str] = None
    bib: Optional[str] = None


class ProductItem(BaseModel):
    id: Optional[str] = None
    tool_name: str
    tool_type: Optional[str] = None
    organization: Optional[str] = None
    homepage_url: Optional[str] = None
    introduction: Optional[str] = None
    audit_status: Optional[str] = None
    publish_time: Optional[str] = None
    update_time: Optional[str] = None
    publisher_id: Optional[str] = None


class ProjectItem(BaseModel):
    id: Optional[str] = None
    name: str
    info: Optional[str] = None
    repo_type: Optional[str] = None
    href: Optional[str] = None
    icon: Optional[str] = None
    favor: bool = False
    audit_status: Optional[str] = None
    publish_time: Optional[str] = None
    update_time: Optional[str] = None
    publisher_id: Optional[str] = None


class ProductReviewItem(BaseModel):
    id: Optional[str] = None
    product_id: str
    review: str
    reviewer_id: Optional[str] = None
    review_time: Optional[str] = None
    update_time: Optional[str] = None


class ProductAttributeItem(BaseModel):
    id: Optional[str] = None
    name: str
    attribute_type: str
    create_time: Optional[str] = None
    update_time: Optional[str] = None


class ProductAttributeValueItem(BaseModel):
    id: Optional[str] = None
    product_id: str
    attribute_id: str
    value: Optional[Union[str, int, float, bool]] = None
    publisher_id: Optional[str] = None
    publish_time: Optional[str] = None
    update_time: Optional[str] = None
