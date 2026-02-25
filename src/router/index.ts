import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '../layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: MainLayout,
      redirect: { name: 'list' },
      children: [
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('../views/CalendarView.vue'),
        },
        {
          path: 'list',
          name: 'list',
          component: () => import('../views/ListView.vue'),
        },
        {
          path: 'insights',
          name: 'insights',
          component: () => import('../views/InsightsView.vue'),
        },
        {
          path: 'time-entry',
          name: 'time-entry-root',
          children: [
            {
              path: 'new',
              name: 'new-time-entry',
              component: () => import('../views/NewEntryView.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/onboarding',
      name: 'onboarding-root',
      component: () => import('../layouts/OnboardingLayout.vue'),
      redirect: '/onboarding/1',
      meta: {
        fullscreen: true,
      },
      children: [
        {
          path: '1',
          name: 'onboarding-1',
          component: () => import('../views/onboarding/Slide1.vue'),
          meta: { index: 1 },
        },
        {
          path: '2',
          name: 'onboarding-2',
          component: () => import('../views/onboarding/Slide2.vue'),
          meta: { index: 2 },
        },
        {
          path: '3',
          name: 'onboarding-3',
          component: () => import('../views/onboarding/Slide3.vue'),
          meta: { index: 3 },
        },
        {
          path: '4',
          name: 'onboarding-4',
          component: () => import('../views/onboarding/Slide4.vue'),
          meta: { index: 4 },
        },
      ],
    },
  ],
})

export default router
