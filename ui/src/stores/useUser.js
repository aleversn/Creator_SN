import { defineStore } from "pinia";
import { UserApi } from "@/api";
import defaultAvatar from "@/assets/default-avatar.png";

const emptyInfo = () => ({ status: false, userid: "", role: "" });

export const useUserStore = defineStore("user", {
  state: () => ({
    info: emptyInfo(),
    avatar: defaultAvatar,
    loading: false
  }),
  getters: { isLoggedIn: (state) => Boolean(state.info.status && state.info.userid) },
  actions: {
    hydrate() {
      const userid = localStorage.getItem("ApiUserId");
      const role = localStorage.getItem("ApiUserRole");
      if (userid) this.info = { ...emptyInfo(), status: true, userid, role: role || "user" };
    },
    async loadMe() {
      const result = await UserApi.me();
      if (result.code !== 200) throw new Error(result.message || "Unable to load profile");
      this.info = { ...this.info, ...result.data, status: true };
      await this.loadAvatar();
      return this.info;
    },
    async loadAvatar() {
      const result = await UserApi.avatar();
      if (result.code === 200 && result.data) this.avatar = result.data;
    },
    setSession(data) {
      this.info = { ...emptyInfo(), ...data, status: true };
      localStorage.setItem("ApiToken", data.token);
      localStorage.setItem("ApiTokenExpiredAt", String(data.exp));
      localStorage.setItem("ApiUserId", data.userid);
      localStorage.setItem("ApiUserRole", data.role || "user");
    },
    logout() {
      ["ApiToken", "ApiTokenExpiredAt", "ApiUserId", "ApiUserRole"].forEach((key) => localStorage.removeItem(key));
      this.info = emptyInfo();
      this.avatar = defaultAvatar;
    }
  }
});
