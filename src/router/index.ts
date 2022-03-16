import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    redirect: { name: "Map" },
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("@/views/MapView.vue"),
  },
  {
    path: "/city",
    name: "City",
    component: () => import("@/views/CityView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
