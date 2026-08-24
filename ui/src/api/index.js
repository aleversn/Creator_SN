import client from "./config.js";

const request = (method, url, data, config = {}) =>
  client({ method, url, data, ...config }).then((response) => response.data);

export const UserApi = {
  login: (payload) => request("post", "/login", payload),
  register: (payload) => request("post", "/apply_user", payload),
  me: () => request("get", "/info_me"),
  updateMe: (payload) => request("post", "/update_me", payload),
  updatePassword: (payload) => request("post", "/update_pwd", payload),
  uploadAvatar: (file, onUploadProgress) => {
    const form = new FormData();
    form.append("user_avatar", file);
    return request("post", "/upload_avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress
    });
  },
  avatar: () => request("get", "/me/avatar"),
  list: (params) => request("get", "/list_users", undefined, { params }),
  count: (params) => request("get", "/list_users_size", undefined, { params })
};

export { client as axios };
