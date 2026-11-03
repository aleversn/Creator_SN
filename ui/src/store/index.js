import { defineStore } from "pinia";
import i18n from "@/js/i18n.js";

export const useAppStore = defineStore("app", {
    state: () => ({
        language: localStorage.getItem("creator-sn-language") || "cn",
        i18n
    }),
    getters: {
        local: (state) => (text, params = {}) => {
            const result = state.i18n[text];
            const translated = result ? result[state.language] || result.en || text : text;
            return Object.entries(params).reduce((value, [key, replacement]) => value.replaceAll(`{${key}}`, replacement), translated);
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
