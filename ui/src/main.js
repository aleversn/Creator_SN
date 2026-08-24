import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueFluent from "@creatorsn/vfluent3";
import "@creatorsn/vfluent3/style.css";

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title;
});

const app = createApp(App);
app.use(VueFluent);
app.use(createPinia());
app.use(router);
app.config.globalProperties.$Go = (path) => router.push(path);
app.config.globalProperties.$Back = () => router.back();
app.config.globalProperties.$Jump = (url) => window.open(url);
app.mount("#app");
