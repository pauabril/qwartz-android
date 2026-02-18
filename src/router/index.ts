import { createRouter, createWebHistory } from "vue-router";

import MainLayout from "../layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "root",
      component: MainLayout,
      redirect: { name: "list" },
      children: [
        {
          path: "calendar",
          name: "calendar",
          component: () => import("../views/CalendarView.vue"),
        },
        {
          path: "list",
          name: "list",
          component: () => import("../views/ListView.vue"),
        },
        {
          path: "insights",
          name: "insights",
          component: () => import("../views/InsightsView.vue"),
        },
        {
          path: "time-entry",
          name: "time-entry-root",
          children: [
            {
              path: "new",
              name: "new-time-entry",
              component: () => import("../views/NewEntryView.vue"),
            },
          ],
        },
      ],
    },
  ],
});

export default router;
