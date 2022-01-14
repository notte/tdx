import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/App.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("@/views/TaiwanView.vue"),
  },
  {
    path: "/:id",
    name: "City",
    component: () => import("@/views/CityView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
