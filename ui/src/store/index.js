import { defineStore } from "pinia";
import i18n from "@/js/i18n.js";

export const useAppStore = defineStore("app", {
  state: () => ({
    language: localStorage.getItem("creator-sn-language") || "cn",
    i18n
  }),
  getters: {
    local: (state) => (text) => {
      const result = state.i18n[text];
      if (!result) return text;
      return result[state.language] || result.en || text;
    }
  },
  actions: {
    setLanguage(language) {
      if (!Object.prototype.hasOwnProperty.call({ en: true, cn: true }, language)) return;
      this.language = language;
      localStorage.setItem("creator-sn-language", language);
    }
  }
});

export default useAppStore;
