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
    }
  ]
});

export default router;
