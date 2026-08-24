import client from "./config.js";
import { User } from "./api.js";

const request = (method, url, data, config = {}) =>
  client({ method, url, data, ...config }).then((response) => response.data);

export const UserApi = {
  login: (payload) => User.Login(payload),
  register: (payload) => User.ApplyUser(payload),
  me: () => User.GetUserInfo(),
  updateMe: (payload) => User.UpdateUserInfo(null, payload),
  updatePassword: (payload) => User.UpdateUserPassword(null, payload),
  uploadAvatar: (file, onUploadProgress) => {
    const form = new FormData();
    form.append("user_avatar", file);
    return User.UploadAvatar(null, form, undefined, onUploadProgress);
  },
  avatar: () => User.GetMyAvatar(),
  list: (search, offset, limit) => User.ListUsers(search, offset, limit),
  count: (search) => User.GetTotalUserCount(search),
  roles: () => User.GetAllUserRoles(),
  resetPassword: (userid) => User.ResetUserPassword(null, { userid, pwd: "", confirm_pwd: "" }),
  addRole: (userid, role) => User.AddUserRole({ userid, role }),
  removeRole: (userid, role) => User.RemoveUserRole({ userid, role }),
  userAvatar: (userid) => User.GetUserAvatar(userid)
};

export const ResumeApi = {
  list: () => request("get", "/resume/list"),
  mine: () => request("get", "/resume/mine"),
  save: (payload) => request("post", "/resume/save", payload),
  remove: (id) => request("delete", `/resume/${id}`)
};

export { client as axios, User };
