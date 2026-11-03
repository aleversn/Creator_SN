/* eslint-disable */
// More information: https://github.com/minskiter/openapijs
import axios from './config.js'
import * as Axios from 'axios'
import * as UserModel from './model.js'

// fix vite error.
const CancelTokenSource = Axios.CancelTokenSource;


export class User {
 
  /**
  * @summary Apply for a user account
  * @param {UserModel.User} [user] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ApplyUser(user,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/apply_user',
        data:user,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Login
  * @param {UserModel.User} [user] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async Login(user,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/login',
        data:user,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get user info
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetUserInfo(valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/info_me',
        data:{},
        params:{valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Update user info
  * @param {undefined} [valid_info] 
  * @param {UserModel.UserInfo} [userinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UpdateUserInfo(valid_info,userinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/update_me',
        data:userinfo,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Update user password
  * @param {undefined} [valid_info] 
  * @param {UserModel.UserSecurityInfo} [usersecurityinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UpdateUserPassword(valid_info,usersecurityinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/update_pwd',
        data:usersecurityinfo,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Reset user password (Admin)
  * @param {undefined} [valid_info] 
  * @param {UserModel.UserSecurityInfo} [usersecurityinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ResetUserPassword(valid_info,usersecurityinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/reset_pwd',
        data:usersecurityinfo,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get all users (Admin)
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetAllUsers(valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/user/get_users',
        data:{},
        params:{valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List users (Admin)
  * @param {undefined} [search] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListUsers(search,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/list_users',
        data:{},
        params:{search,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get total user count (Admin)
  * @param {undefined} [search] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetTotalUserCount(search,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/list_users_size',
        data:{},
        params:{search},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Upload user avatar
  * @param {undefined} [valid_info] 
  * @param {UserModel.Body_UploadAvatar} [body_uploadavatar] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UploadAvatar(valid_info,body_uploadavatar,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/upload_avatar',
        data:body_uploadavatar,
        params:{valid_info},
        headers:{
          "Content-Type":"multipart/form-data"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get user avatar
  * @param {undefined} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetUserAvatar(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/user/avatar',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get my avatar
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMyAvatar(valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/me/avatar',
        data:{},
        params:{valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get all user roles (Admin)
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetAllUserRoles(cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/user/get_users_roles',
        data:{},
        params:{},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add user role (Admin)
  * @param {UserModel.UserInfo} [userinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddUserRole(userinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/add/role',
        data:userinfo,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Remove user role (Admin)
  * @param {UserModel.UserInfo} [userinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async RemoveUserRole(userinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/del/role',
        data:userinfo,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
}

// class User static method properties bind
/**
* @description ApplyUser url链接，包含baseURL
*/
User.ApplyUser.fullPath=`${axios.defaults.baseURL}/apply_user`
/**
* @description ApplyUser url链接，不包含baseURL
*/
User.ApplyUser.path=`/apply_user`
/**
* @description Login url链接，包含baseURL
*/
User.Login.fullPath=`${axios.defaults.baseURL}/login`
/**
* @description Login url链接，不包含baseURL
*/
User.Login.path=`/login`
/**
* @description GetUserInfo url链接，包含baseURL
*/
User.GetUserInfo.fullPath=`${axios.defaults.baseURL}/info_me`
/**
* @description GetUserInfo url链接，不包含baseURL
*/
User.GetUserInfo.path=`/info_me`
/**
* @description UpdateUserInfo url链接，包含baseURL
*/
User.UpdateUserInfo.fullPath=`${axios.defaults.baseURL}/update_me`
/**
* @description UpdateUserInfo url链接，不包含baseURL
*/
User.UpdateUserInfo.path=`/update_me`
/**
* @description UpdateUserPassword url链接，包含baseURL
*/
User.UpdateUserPassword.fullPath=`${axios.defaults.baseURL}/update_pwd`
/**
* @description UpdateUserPassword url链接，不包含baseURL
*/
User.UpdateUserPassword.path=`/update_pwd`
/**
* @description ResetUserPassword url链接，包含baseURL
*/
User.ResetUserPassword.fullPath=`${axios.defaults.baseURL}/reset_pwd`
/**
* @description ResetUserPassword url链接，不包含baseURL
*/
User.ResetUserPassword.path=`/reset_pwd`
/**
* @description GetAllUsers url链接，包含baseURL
*/
User.GetAllUsers.fullPath=`${axios.defaults.baseURL}/user/get_users`
/**
* @description GetAllUsers url链接，不包含baseURL
*/
User.GetAllUsers.path=`/user/get_users`
/**
* @description ListUsers url链接，包含baseURL
*/
User.ListUsers.fullPath=`${axios.defaults.baseURL}/list_users`
/**
* @description ListUsers url链接，不包含baseURL
*/
User.ListUsers.path=`/list_users`
/**
* @description GetTotalUserCount url链接，包含baseURL
*/
User.GetTotalUserCount.fullPath=`${axios.defaults.baseURL}/list_users_size`
/**
* @description GetTotalUserCount url链接，不包含baseURL
*/
User.GetTotalUserCount.path=`/list_users_size`
/**
* @description UploadAvatar url链接，包含baseURL
*/
User.UploadAvatar.fullPath=`${axios.defaults.baseURL}/upload_avatar`
/**
* @description UploadAvatar url链接，不包含baseURL
*/
User.UploadAvatar.path=`/upload_avatar`
/**
* @description GetUserAvatar url链接，包含baseURL
*/
User.GetUserAvatar.fullPath=`${axios.defaults.baseURL}/user/avatar`
/**
* @description GetUserAvatar url链接，不包含baseURL
*/
User.GetUserAvatar.path=`/user/avatar`
/**
* @description GetMyAvatar url链接，包含baseURL
*/
User.GetMyAvatar.fullPath=`${axios.defaults.baseURL}/me/avatar`
/**
* @description GetMyAvatar url链接，不包含baseURL
*/
User.GetMyAvatar.path=`/me/avatar`
/**
* @description GetAllUserRoles url链接，包含baseURL
*/
User.GetAllUserRoles.fullPath=`${axios.defaults.baseURL}/user/get_users_roles`
/**
* @description GetAllUserRoles url链接，不包含baseURL
*/
User.GetAllUserRoles.path=`/user/get_users_roles`
/**
* @description AddUserRole url链接，包含baseURL
*/
User.AddUserRole.fullPath=`${axios.defaults.baseURL}/add/role`
/**
* @description AddUserRole url链接，不包含baseURL
*/
User.AddUserRole.path=`/add/role`
/**
* @description RemoveUserRole url链接，包含baseURL
*/
User.RemoveUserRole.fullPath=`${axios.defaults.baseURL}/del/role`
/**
* @description RemoveUserRole url链接，不包含baseURL
*/
User.RemoveUserRole.path=`/del/role`

export class Member {
 
  /**
  * @summary List Members Client
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListMembersClient(offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/list_members_client',
        data:{},
        params:{offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Members
  * @param {undefined} [search] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListMembers(search,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/list_members',
        data:{},
        params:{search,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Member
  * @param {undefined} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMember(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/get_member',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Member Client
  * @param {undefined} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMemberClient(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/get_member_client',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Myself
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMyCv(valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/get_my_cv',
        data:{},
        params:{valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add Member
  * @param {UserModel.MemberInfo} [memberinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddMember(memberinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/add_member',
        data:memberinfo,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Update Member
  * @param {UserModel.MemberInfo} [memberinfo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UpdateMember(memberinfo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/update_member',
        data:memberinfo,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Upload Member Avatar
  * @param {UserModel.Body_UploadMemberAvatar} [body_uploadmemberavatar] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UploadMemberAvatar(body_uploadmemberavatar,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/upload_member_avatar',
        data:body_uploadmemberavatar,
        params:{},
        headers:{
          "Content-Type":"multipart/form-data"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Member Avatar
  * @param {undefined} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMemberAvatar(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/get_member_avatar',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Delete Member
  * @param {undefined} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async DeleteMember(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/remove_member',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
}

// class Member static method properties bind
/**
* @description ListMembersClient url链接，包含baseURL
*/
Member.ListMembersClient.fullPath=`${axios.defaults.baseURL}/list_members_client`
/**
* @description ListMembersClient url链接，不包含baseURL
*/
Member.ListMembersClient.path=`/list_members_client`
/**
* @description ListMembers url链接，包含baseURL
*/
Member.ListMembers.fullPath=`${axios.defaults.baseURL}/list_members`
/**
* @description ListMembers url链接，不包含baseURL
*/
Member.ListMembers.path=`/list_members`
/**
* @description GetMember url链接，包含baseURL
*/
Member.GetMember.fullPath=`${axios.defaults.baseURL}/get_member`
/**
* @description GetMember url链接，不包含baseURL
*/
Member.GetMember.path=`/get_member`
/**
* @description GetMemberClient url链接，包含baseURL
*/
Member.GetMemberClient.fullPath=`${axios.defaults.baseURL}/get_member_client`
/**
* @description GetMemberClient url链接，不包含baseURL
*/
Member.GetMemberClient.path=`/get_member_client`
/**
* @description GetMyCv url链接，包含baseURL
*/
Member.GetMyCv.fullPath=`${axios.defaults.baseURL}/get_my_cv`
/**
* @description GetMyCv url链接，不包含baseURL
*/
Member.GetMyCv.path=`/get_my_cv`
/**
* @description AddMember url链接，包含baseURL
*/
Member.AddMember.fullPath=`${axios.defaults.baseURL}/add_member`
/**
* @description AddMember url链接，不包含baseURL
*/
Member.AddMember.path=`/add_member`
/**
* @description UpdateMember url链接，包含baseURL
*/
Member.UpdateMember.fullPath=`${axios.defaults.baseURL}/update_member`
/**
* @description UpdateMember url链接，不包含baseURL
*/
Member.UpdateMember.path=`/update_member`
/**
* @description UploadMemberAvatar url链接，包含baseURL
*/
Member.UploadMemberAvatar.fullPath=`${axios.defaults.baseURL}/upload_member_avatar`
/**
* @description UploadMemberAvatar url链接，不包含baseURL
*/
Member.UploadMemberAvatar.path=`/upload_member_avatar`
/**
* @description GetMemberAvatar url链接，包含baseURL
*/
Member.GetMemberAvatar.fullPath=`${axios.defaults.baseURL}/get_member_avatar`
/**
* @description GetMemberAvatar url链接，不包含baseURL
*/
Member.GetMemberAvatar.path=`/get_member_avatar`
/**
* @description DeleteMember url链接，包含baseURL
*/
Member.DeleteMember.fullPath=`${axios.defaults.baseURL}/remove_member`
/**
* @description DeleteMember url链接，不包含baseURL
*/
Member.DeleteMember.path=`/remove_member`

export class Product {
 
  /**
  * @summary List Products
  * @param {undefined} [search] 
  * @param {undefined} [tool_type] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListProducts(search,tool_type,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/get_products',
        data:{},
        params:{search,tool_type,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Client Products
  * @param {undefined} [search] 
  * @param {undefined} [tool_type] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListClientProducts(search,tool_type,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/get_products',
        data:{},
        params:{search,tool_type,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Count Client Products
  * @param {undefined} [search] 
  * @param {undefined} [tool_type] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async CountClientProducts(search,tool_type,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/get_products_total',
        data:{},
        params:{search,tool_type},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Client Product Tool Types
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListClientProductToolTypes(cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/get_tool_types',
        data:{},
        params:{},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Product
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetProduct(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/get_product',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Client Product
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetClientProduct(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/get_product',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add Or Update Product
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductItem} [productitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddOrUpdateProduct(valid_info,productitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/update',
        data:productitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Submit Product
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductItem} [productitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async SubmitProduct(valid_info,productitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/submit',
        data:productitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Delete Product
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async DeleteProduct(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'delete',
        url:'/products/remove',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Upload Product Logo
  * @param {String} [id] 
  * @param {undefined} [valid_info] 
  * @param {UserModel.Body_UploadProductLogo} [body_uploadproductlogo] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async UploadProductLogo(id,valid_info,body_uploadproductlogo,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/upload_logo',
        data:body_uploadproductlogo,
        params:{id,valid_info},
        headers:{
          "Content-Type":"multipart/form-data"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Product Logo
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetProductLogo(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/get_logo',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Admin Product Logo
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetAdminProductLogo(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/admin/get_logo',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Product Reviews
  * @param {String} [product_id] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListProductReviews(product_id,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/reviews/get_reviews',
        data:{},
        params:{product_id,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Client Product Reviews
  * @param {String} [product_id] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListClientProductReviews(product_id,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/reviews/get_reviews',
        data:{},
        params:{product_id,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Product Review
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetProductReview(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/reviews/get_review',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get My Product Review
  * @param {String} [product_id] 
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMyProductReview(product_id,valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/reviews/my_review',
        data:{},
        params:{product_id,valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add Or Update Product Review
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductReviewItem} [productreviewitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddOrUpdateProductReview(valid_info,productreviewitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/reviews/update',
        data:productreviewitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Submit Product Review
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductReviewItem} [productreviewitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async SubmitProductReview(valid_info,productreviewitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/reviews/submit',
        data:productreviewitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Delete Product Review
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async DeleteProductReview(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'delete',
        url:'/products/reviews/remove',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Product Attributes
  * @param {undefined} [search] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListProductAttributes(search,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/attributes/get_attributes',
        data:{},
        params:{search,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Client Product Attributes
  * @param {undefined} [search] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListClientProductAttributes(search,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/attributes/get_attributes',
        data:{},
        params:{search,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Product Attribute
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetProductAttribute(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/attributes/get_attribute',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add Or Update Product Attribute
  * @param {UserModel.ProductAttributeItem} [productattributeitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddOrUpdateProductAttribute(productattributeitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/attributes/update',
        data:productattributeitem,
        params:{},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Delete Product Attribute
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async DeleteProductAttribute(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'delete',
        url:'/products/attributes/remove',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Product Attribute Values
  * @param {undefined} [product_id] 
  * @param {undefined} [attribute_id] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListProductAttributeValues(product_id,attribute_id,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/attribute_values/get_values',
        data:{},
        params:{product_id,attribute_id,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary List Client Product Attribute Values
  * @param {undefined} [product_id] 
  * @param {undefined} [attribute_id] 
  * @param {Number} [offset] 
  * @param {Number} [limit] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async ListClientProductAttributeValues(product_id,attribute_id,offset,limit,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/client/attribute_values/get_values',
        data:{},
        params:{product_id,attribute_id,offset,limit},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get Product Attribute Value
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetProductAttributeValue(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/attribute_values/get_value',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Get My Product Attribute Values
  * @param {String} [product_id] 
  * @param {undefined} [attribute_id] 
  * @param {undefined} [valid_info] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async GetMyProductAttributeValues(product_id,attribute_id,valid_info,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/products/attribute_values/my_values',
        data:{},
        params:{product_id,attribute_id,valid_info},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Add Or Update Product Attribute Value
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductAttributeValueItem} [productattributevalueitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async AddOrUpdateProductAttributeValue(valid_info,productattributevalueitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/attribute_values/update',
        data:productattributevalueitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Submit Product Attribute Value
  * @param {undefined} [valid_info] 
  * @param {UserModel.ProductAttributeValueItem} [productattributevalueitem] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async SubmitProductAttributeValue(valid_info,productattributevalueitem,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'post',
        url:'/products/attribute_values/submit',
        data:productattributevalueitem,
        params:{valid_info},
        headers:{
          "Content-Type":"application/json"
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
 
  /**
  * @summary Delete Product Attribute Value
  * @param {String} [id] 
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async DeleteProductAttributeValue(id,cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'delete',
        url:'/products/attribute_values/remove',
        data:{},
        params:{id},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
}

// class Product static method properties bind
/**
* @description ListProducts url链接，包含baseURL
*/
Product.ListProducts.fullPath=`${axios.defaults.baseURL}/products/get_products`
/**
* @description ListProducts url链接，不包含baseURL
*/
Product.ListProducts.path=`/products/get_products`
/**
* @description ListClientProducts url链接，包含baseURL
*/
Product.ListClientProducts.fullPath=`${axios.defaults.baseURL}/products/client/get_products`
/**
* @description ListClientProducts url链接，不包含baseURL
*/
Product.ListClientProducts.path=`/products/client/get_products`
/**
* @description CountClientProducts url链接，包含baseURL
*/
Product.CountClientProducts.fullPath=`${axios.defaults.baseURL}/products/client/get_products_total`
/**
* @description CountClientProducts url链接，不包含baseURL
*/
Product.CountClientProducts.path=`/products/client/get_products_total`
/**
* @description ListClientProductToolTypes url链接，包含baseURL
*/
Product.ListClientProductToolTypes.fullPath=`${axios.defaults.baseURL}/products/client/get_tool_types`
/**
* @description ListClientProductToolTypes url链接，不包含baseURL
*/
Product.ListClientProductToolTypes.path=`/products/client/get_tool_types`
/**
* @description GetProduct url链接，包含baseURL
*/
Product.GetProduct.fullPath=`${axios.defaults.baseURL}/products/get_product`
/**
* @description GetProduct url链接，不包含baseURL
*/
Product.GetProduct.path=`/products/get_product`
/**
* @description GetClientProduct url链接，包含baseURL
*/
Product.GetClientProduct.fullPath=`${axios.defaults.baseURL}/products/client/get_product`
/**
* @description GetClientProduct url链接，不包含baseURL
*/
Product.GetClientProduct.path=`/products/client/get_product`
/**
* @description AddOrUpdateProduct url链接，包含baseURL
*/
Product.AddOrUpdateProduct.fullPath=`${axios.defaults.baseURL}/products/update`
/**
* @description AddOrUpdateProduct url链接，不包含baseURL
*/
Product.AddOrUpdateProduct.path=`/products/update`
/**
* @description SubmitProduct url链接，包含baseURL
*/
Product.SubmitProduct.fullPath=`${axios.defaults.baseURL}/products/submit`
/**
* @description SubmitProduct url链接，不包含baseURL
*/
Product.SubmitProduct.path=`/products/submit`
/**
* @description DeleteProduct url链接，包含baseURL
*/
Product.DeleteProduct.fullPath=`${axios.defaults.baseURL}/products/remove`
/**
* @description DeleteProduct url链接，不包含baseURL
*/
Product.DeleteProduct.path=`/products/remove`
/**
* @description UploadProductLogo url链接，包含baseURL
*/
Product.UploadProductLogo.fullPath=`${axios.defaults.baseURL}/products/upload_logo`
/**
* @description UploadProductLogo url链接，不包含baseURL
*/
Product.UploadProductLogo.path=`/products/upload_logo`
/**
* @description GetProductLogo url链接，包含baseURL
*/
Product.GetProductLogo.fullPath=`${axios.defaults.baseURL}/products/get_logo`
/**
* @description GetProductLogo url链接，不包含baseURL
*/
Product.GetProductLogo.path=`/products/get_logo`
/**
* @description GetAdminProductLogo url链接，包含baseURL
*/
Product.GetAdminProductLogo.fullPath=`${axios.defaults.baseURL}/products/admin/get_logo`
/**
* @description GetAdminProductLogo url链接，不包含baseURL
*/
Product.GetAdminProductLogo.path=`/products/admin/get_logo`
/**
* @description ListProductReviews url链接，包含baseURL
*/
Product.ListProductReviews.fullPath=`${axios.defaults.baseURL}/products/reviews/get_reviews`
/**
* @description ListProductReviews url链接，不包含baseURL
*/
Product.ListProductReviews.path=`/products/reviews/get_reviews`
/**
* @description ListClientProductReviews url链接，包含baseURL
*/
Product.ListClientProductReviews.fullPath=`${axios.defaults.baseURL}/products/client/reviews/get_reviews`
/**
* @description ListClientProductReviews url链接，不包含baseURL
*/
Product.ListClientProductReviews.path=`/products/client/reviews/get_reviews`
/**
* @description GetProductReview url链接，包含baseURL
*/
Product.GetProductReview.fullPath=`${axios.defaults.baseURL}/products/reviews/get_review`
/**
* @description GetProductReview url链接，不包含baseURL
*/
Product.GetProductReview.path=`/products/reviews/get_review`
/**
* @description GetMyProductReview url链接，包含baseURL
*/
Product.GetMyProductReview.fullPath=`${axios.defaults.baseURL}/products/reviews/my_review`
/**
* @description GetMyProductReview url链接，不包含baseURL
*/
Product.GetMyProductReview.path=`/products/reviews/my_review`
/**
* @description AddOrUpdateProductReview url链接，包含baseURL
*/
Product.AddOrUpdateProductReview.fullPath=`${axios.defaults.baseURL}/products/reviews/update`
/**
* @description AddOrUpdateProductReview url链接，不包含baseURL
*/
Product.AddOrUpdateProductReview.path=`/products/reviews/update`
/**
* @description SubmitProductReview url链接，包含baseURL
*/
Product.SubmitProductReview.fullPath=`${axios.defaults.baseURL}/products/reviews/submit`
/**
* @description SubmitProductReview url链接，不包含baseURL
*/
Product.SubmitProductReview.path=`/products/reviews/submit`
/**
* @description DeleteProductReview url链接，包含baseURL
*/
Product.DeleteProductReview.fullPath=`${axios.defaults.baseURL}/products/reviews/remove`
/**
* @description DeleteProductReview url链接，不包含baseURL
*/
Product.DeleteProductReview.path=`/products/reviews/remove`
/**
* @description ListProductAttributes url链接，包含baseURL
*/
Product.ListProductAttributes.fullPath=`${axios.defaults.baseURL}/products/attributes/get_attributes`
/**
* @description ListProductAttributes url链接，不包含baseURL
*/
Product.ListProductAttributes.path=`/products/attributes/get_attributes`
/**
* @description ListClientProductAttributes url链接，包含baseURL
*/
Product.ListClientProductAttributes.fullPath=`${axios.defaults.baseURL}/products/client/attributes/get_attributes`
/**
* @description ListClientProductAttributes url链接，不包含baseURL
*/
Product.ListClientProductAttributes.path=`/products/client/attributes/get_attributes`
/**
* @description GetProductAttribute url链接，包含baseURL
*/
Product.GetProductAttribute.fullPath=`${axios.defaults.baseURL}/products/attributes/get_attribute`
/**
* @description GetProductAttribute url链接，不包含baseURL
*/
Product.GetProductAttribute.path=`/products/attributes/get_attribute`
/**
* @description AddOrUpdateProductAttribute url链接，包含baseURL
*/
Product.AddOrUpdateProductAttribute.fullPath=`${axios.defaults.baseURL}/products/attributes/update`
/**
* @description AddOrUpdateProductAttribute url链接，不包含baseURL
*/
Product.AddOrUpdateProductAttribute.path=`/products/attributes/update`
/**
* @description DeleteProductAttribute url链接，包含baseURL
*/
Product.DeleteProductAttribute.fullPath=`${axios.defaults.baseURL}/products/attributes/remove`
/**
* @description DeleteProductAttribute url链接，不包含baseURL
*/
Product.DeleteProductAttribute.path=`/products/attributes/remove`
/**
* @description ListProductAttributeValues url链接，包含baseURL
*/
Product.ListProductAttributeValues.fullPath=`${axios.defaults.baseURL}/products/attribute_values/get_values`
/**
* @description ListProductAttributeValues url链接，不包含baseURL
*/
Product.ListProductAttributeValues.path=`/products/attribute_values/get_values`
/**
* @description ListClientProductAttributeValues url链接，包含baseURL
*/
Product.ListClientProductAttributeValues.fullPath=`${axios.defaults.baseURL}/products/client/attribute_values/get_values`
/**
* @description ListClientProductAttributeValues url链接，不包含baseURL
*/
Product.ListClientProductAttributeValues.path=`/products/client/attribute_values/get_values`
/**
* @description GetProductAttributeValue url链接，包含baseURL
*/
Product.GetProductAttributeValue.fullPath=`${axios.defaults.baseURL}/products/attribute_values/get_value`
/**
* @description GetProductAttributeValue url链接，不包含baseURL
*/
Product.GetProductAttributeValue.path=`/products/attribute_values/get_value`
/**
* @description GetMyProductAttributeValues url链接，包含baseURL
*/
Product.GetMyProductAttributeValues.fullPath=`${axios.defaults.baseURL}/products/attribute_values/my_values`
/**
* @description GetMyProductAttributeValues url链接，不包含baseURL
*/
Product.GetMyProductAttributeValues.path=`/products/attribute_values/my_values`
/**
* @description AddOrUpdateProductAttributeValue url链接，包含baseURL
*/
Product.AddOrUpdateProductAttributeValue.fullPath=`${axios.defaults.baseURL}/products/attribute_values/update`
/**
* @description AddOrUpdateProductAttributeValue url链接，不包含baseURL
*/
Product.AddOrUpdateProductAttributeValue.path=`/products/attribute_values/update`
/**
* @description SubmitProductAttributeValue url链接，包含baseURL
*/
Product.SubmitProductAttributeValue.fullPath=`${axios.defaults.baseURL}/products/attribute_values/submit`
/**
* @description SubmitProductAttributeValue url链接，不包含baseURL
*/
Product.SubmitProductAttributeValue.path=`/products/attribute_values/submit`
/**
* @description DeleteProductAttributeValue url链接，包含baseURL
*/
Product.DeleteProductAttributeValue.fullPath=`${axios.defaults.baseURL}/products/attribute_values/remove`
/**
* @description DeleteProductAttributeValue url链接，不包含baseURL
*/
Product.DeleteProductAttributeValue.path=`/products/attribute_values/remove`

export class common {
 
  /**
  * @summary Home
  * @param {CancelTokenSource} [cancelSource] Axios Cancel Source 对象，可以取消该请求
  * @param {Function} [uploadProgress] 上传回调函数
  * @param {Function} [downloadProgress] 下载回调函数
  */
  static async Home(cancelSource,uploadProgress,downloadProgress,baseURL){
    return await new Promise((resolve,reject)=>{
      let responseType = "json";
      let options = {
        method:'get',
        url:'/',
        data:{},
        params:{},
        headers:{
          "Content-Type":""
        },
        onUploadProgress:uploadProgress,
        onDownloadProgress:downloadProgress
      }
      if (baseURL!==undefined){
        options.baseURL = baseURL
      }
      // support wechat mini program
      if (cancelSource!=undefined){
        options.cancelToken = cancelSource.token
      }
      if (responseType != "json"){
        options.responseType = responseType;
      }
      axios(options)
      .then(res=>{
        if (res.config.responseType=="blob"){
          resolve(new Blob([res.data],{
            type: res.headers["content-type"].split(";")[0]
          }))
        }else{
          resolve(res.data);
          return res.data
        }
      }).catch(err=>{
        if (err.response){
          if (err.response.data)
            reject(err.response.data)
          else
            reject(err.response);
        }else{
          reject(err)
        }
      })
    })
  }
}

// class common static method properties bind
/**
* @description Home url链接，包含baseURL
*/
common.Home.fullPath=`${axios.defaults.baseURL}/`
/**
* @description Home url链接，不包含baseURL
*/
common.Home.path=`/`
