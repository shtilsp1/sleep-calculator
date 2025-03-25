import { createRouter, createWebHistory } from 'vue-router';
import WakeUpView from '../views/WakeUpView.vue';
import SleepView from '../views/SleepView.vue';

const routes = [
  { path: '/', name: 'wake-up', component: WakeUpView },
  { path: '/sleep', name: 'sleep', component: SleepView },
  { path: '/nap', name: 'nap', component: () => import('../views/NapView.vue') },
  { path: '/phases', name: 'phases', component: () => import('../views/SleepPhases.vue') }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;