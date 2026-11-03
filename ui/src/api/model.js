export class Body_UploadAvatar {
  
    /**
     *
     * @param {String} user_avatar 
     */ 
    constructor(user_avatar = undefined){
        this.user_avatar = user_avatar
    }
       
    /**
     * 
     * @type {String}
     */
    user_avatar=undefined
    
}
export class Body_UploadMemberAvatar {
  
    /**
     *
     * @param {String} id 
     * @param {String} member_avatar 
     */ 
    constructor(id = undefined,member_avatar = undefined){
        this.id = id
        this.member_avatar = member_avatar
    }
       
    /**
     * 
     * @type {String}
     */
    id=undefined   
    /**
     * 
     * @type {String}
     */
    member_avatar=undefined
    
}
export class Body_UploadProductLogo {
  
    /**
     *
     * @param {String} logo 
     */ 
    constructor(logo = undefined){
        this.logo = logo
    }
       
    /**
     * 
     * @type {String}
     */
    logo=undefined
    
}
export class Edu {
  
    /**
     *
     * @param {String} id 
     * @param {String} name 
     */ 
    constructor(id = undefined,name = undefined){
        this.id = id
        this.name = name
    }
       
    /**
     * 
     * @type {String}
     */
    id=undefined   
    /**
     * 
     * @type {String}
     */
    name=undefined
    
}
export class Group {
  
    /**
     *
     * @param {String} id 
     * @param {String} name 
     */ 
    constructor(id = undefined,name = undefined){
        this.id = id
        this.name = name
    }
       
    /**
     * 
     * @type {String}
     */
    id=undefined   
    /**
     * 
     * @type {String}
     */
    name=undefined
    
}
export class HTTPValidationError {
  
    /**
     *
     * @param {Array} detail 
     */ 
    constructor(detail = undefined){
        this.detail = detail
    }
       
    /**
     * 
     * @type {Array}
     */
    detail=undefined
    
}
export class MemberAward {
  
    /**
     *
     * @param {String} competitionName 
     * @param {String} level 
     * @param {String} session 
     * @param {String} date 
     * @param {String} region 
     */ 
    constructor(competitionName = undefined,level = undefined,session = undefined,date = undefined,region = undefined){
        this.competitionName = competitionName
        this.level = level
        this.session = session
        this.date = date
        this.region = region
    }
       
    /**
     * 
     * @type {String}
     */
    competitionName=undefined   
    /**
     * 
     * @type {String}
     */
    level=undefined   
    /**
     * 
     * @type {String}
     */
    session=undefined   
    /**
     * 
     * @type {String}
     */
    date=undefined   
    /**
     * 
     * @type {String}
     */
    region=undefined
    
}
export class MemberInfo {
  
    /**
     *
     * @param {String} id 
     * @param {String} name 
     * @param {String} grade 
     * @param {String} session 
     * @param {String} major 
     * @param {String} title 
     * @param {String} toWhere 
     * @param {String} postAddress 
     * @param {Array} educations 
     * @param {Array} teams 
     * @param {Array} groups 
     * @param {String} introduction 
     * @param {String} photo 
     * @param {Array} awards 
     * @param {String} email 
     * @param {String} mobile 
     */ 
    constructor(id = undefined,name = undefined,grade = undefined,session = undefined,major = undefined,title = undefined,toWhere = undefined,postAddress = undefined,educations = undefined,teams = undefined,groups = undefined,introduction = undefined,photo = undefined,userid = undefined,awards = undefined,email = undefined,mobile = undefined,external = undefined){
        this.id = id
        this.name = name
        this.grade = grade
        this.session = session
        this.major = major
        this.title = title
        this.toWhere = toWhere
        this.postAddress = postAddress
        this.educations = educations
        this.teams = teams
        this.groups = groups
        this.introduction = introduction
        this.photo = photo
        this.userid = userid
        this.awards = awards
        this.email = email
        this.mobile = mobile
        this.external = external
    }
       
    /**
     * 
     * @type {String}
     */
    id=undefined   
    /**
     * 
     * @type {String}
     */
    name=undefined   
    /**
     * 
     * @type {String}
     */
    grade=undefined   
    /**
     * 
     * @type {String}
     */
    session=undefined   
    /**
     * 
     * @type {String}
     */
    major=undefined   
    /**
     * 
     * @type {String}
     */
    title=undefined   
    /**
     * 
     * @type {String}
     */
    toWhere=undefined   
    /**
     * 
     * @type {String}
     */
    postAddress=undefined   
    /**
     * 
     * @type {Array}
     */
    educations=undefined   
    /**
     * 
     * @type {Array}
     */
    teams=undefined   
    /**
     * 
     * @type {Array}
     */
    groups=undefined   
    /**
     * 
     * @type {String}
     */
    introduction=undefined   
    /**
     * 
     * @type {String}
     */
    photo=undefined   
    /**
     * 
     * @type {Array}
     */
    awards=undefined   
    /**
     * 
     * @type {String}
     */
    email=undefined   
    /**
     * 
     * @type {String}
     */
    mobile=undefined
    
}
export class ProductAttributeItem {
  
    /**
     *
     * @param {String} name 
     * @param {String} attribute_type 
     */ 
    constructor(id = undefined,name = undefined,attribute_type = undefined,create_time = undefined,update_time = undefined){
        this.id = id
        this.name = name
        this.attribute_type = attribute_type
        this.create_time = create_time
        this.update_time = update_time
    }
       
    /**
     * 
     * @type {String}
     */
    name=undefined   
    /**
     * 
     * @type {String}
     */
    attribute_type=undefined
    
}
export class ProductAttributeValueItem {
  
    /**
     *
     * @param {String} product_id 
     * @param {String} attribute_id 
     */ 
    constructor(id = undefined,product_id = undefined,attribute_id = undefined,value = undefined,publisher_id = undefined,publish_time = undefined,update_time = undefined){
        this.id = id
        this.product_id = product_id
        this.attribute_id = attribute_id
        this.value = value
        this.publisher_id = publisher_id
        this.publish_time = publish_time
        this.update_time = update_time
    }
       
    /**
     * 
     * @type {String}
     */
    product_id=undefined   
    /**
     * 
     * @type {String}
     */
    attribute_id=undefined
    
}
export class ProductItem {
  
    /**
     *
     * @param {String} tool_name 
     */ 
    constructor(id = undefined,tool_name = undefined,tool_type = undefined,organization = undefined,homepage_url = undefined,introduction = undefined,audit_status = undefined,publish_time = undefined,update_time = undefined,publisher_id = undefined){
        this.id = id
        this.tool_name = tool_name
        this.tool_type = tool_type
        this.organization = organization
        this.homepage_url = homepage_url
        this.introduction = introduction
        this.audit_status = audit_status
        this.publish_time = publish_time
        this.update_time = update_time
        this.publisher_id = publisher_id
    }
       
    /**
     * 
     * @type {String}
     */
    tool_name=undefined
    
}
export class ProductReviewItem {
  
    /**
     *
     * @param {String} product_id 
     * @param {String} review 
     */ 
    constructor(id = undefined,product_id = undefined,review = undefined,reviewer_id = undefined,review_time = undefined,update_time = undefined){
        this.id = id
        this.product_id = product_id
        this.review = review
        this.reviewer_id = reviewer_id
        this.review_time = review_time
        this.update_time = update_time
    }
       
    /**
     * 
     * @type {String}
     */
    product_id=undefined   
    /**
     * 
     * @type {String}
     */
    review=undefined
    
}
export class Team {
  
    /**
     *
     * @param {String} id 
     * @param {String} name 
     */ 
    constructor(id = undefined,name = undefined){
        this.id = id
        this.name = name
    }
       
    /**
     * 
     * @type {String}
     */
    id=undefined   
    /**
     * 
     * @type {String}
     */
    name=undefined
    
}
export class User {
  
    /**
     *
     * @param {String} userid 
     * @param {String} pwd 
     */ 
    constructor(userid = undefined,name = undefined,pwd = undefined,avatar = undefined,email = undefined,phone = undefined,gender = undefined,invite_code = undefined,role = undefined,apply_time = undefined,last_login = undefined){
        this.userid = userid
        this.name = name
        this.pwd = pwd
        this.avatar = avatar
        this.email = email
        this.phone = phone
        this.gender = gender
        this.invite_code = invite_code
        this.role = role
        this.apply_time = apply_time
        this.last_login = last_login
    }
       
    /**
     * 
     * @type {String}
     */
    userid=undefined   
    /**
     * 
     * @type {String}
     */
    pwd=undefined
    
}
export class UserInfo {
  
    /**
     *
     * @param {String} userid 
     * @param {String} pwd 
     */ 
    constructor(userid = undefined,name = undefined,pwd = undefined,avatar = undefined,email = undefined,phone = undefined,gender = undefined,invite_code = undefined,role = undefined,apply_time = undefined,last_login = undefined){
        this.userid = userid
        this.name = name
        this.pwd = pwd
        this.avatar = avatar
        this.email = email
        this.phone = phone
        this.gender = gender
        this.invite_code = invite_code
        this.role = role
        this.apply_time = apply_time
        this.last_login = last_login
    }
       
    /**
     * 
     * @type {String}
     */
    userid=undefined   
    /**
     * 
     * @type {String}
     */
    pwd=undefined
    
}
export class UserSecurityInfo {
  
    /**
     *
     * @param {String} userid 
     * @param {String} pwd 
     * @param {String} confirm_pwd 
     */ 
    constructor(userid = undefined,pwd = undefined,confirm_pwd = undefined){
        this.userid = userid
        this.pwd = pwd
        this.confirm_pwd = confirm_pwd
    }
       
    /**
     * 
     * @type {String}
     */
    userid=undefined   
    /**
     * 
     * @type {String}
     */
    pwd=undefined   
    /**
     * 
     * @type {String}
     */
    confirm_pwd=undefined
    
}
export class ValidationError {
  
    /**
     *
     * @param {Array} loc 
     * @param {String} msg 
     * @param {String} type 
     * @param {undefined} ctx 
     */ 
    constructor(loc = undefined,msg = undefined,type = undefined,input = undefined,ctx = undefined){
        this.loc = loc
        this.msg = msg
        this.type = type
        this.input = input
        this.ctx = ctx
    }
       
    /**
     * 
     * @type {Array}
     */
    loc=undefined   
    /**
     * 
     * @type {String}
     */
    msg=undefined   
    /**
     * 
     * @type {String}
     */
    type=undefined   
    /**
     * 
     * @type {undefined}
     */
    ctx=undefined
    
}
