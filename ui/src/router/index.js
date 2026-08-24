import { createRouter, createWebHistory } from "vue-router";
import tool from "./tools";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: tool.AsyncLoad(() => import("@/views/home/index.vue")),
      meta: { title: "创造者官网" }
    },
    {
      path: "/team",
      name: "Team",
      component: tool.AsyncLoad(() => import("@/views/team/index.vue")),
      children: [{
        path: "",
        name: "lpc",
        component: tool.AsyncLoad(() => import("@/views/team/cv/lpc.vue"))
      }]
    },
    {
      path: "/dev",
      name: "Dev",
      component: tool.AsyncLoad(() => import("@/views/dev/index.vue"))
    },
    {
      path: "/login",
      name: "Login",
      component: tool.AsyncLoad(() => import("@/views/auth/AuthLayout.vue")),
      children: [
        { path: "", name: "LoginForm", component: tool.AsyncLoad(() => import("@/views/auth/LoginView.vue")) },
        { path: "register", name: "Register", component: tool.AsyncLoad(() => import("@/views/auth/RegisterView.vue")) }
      ]
    },
    {
      path: "/profile",
      name: "Profile",
      component: tool.AsyncLoad(() => import("@/views/profile/ProfileView.vue")),
      meta: { requiresAuth: true, title: "个人中心 · Creator SN" }
    }
  ]
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem("ApiToken")) {
    return { path: "/login", query: { return_url: to.fullPath } };
  }
  if (to.meta.title) document.title = to.meta.title;
  return true;
});

export default router;
