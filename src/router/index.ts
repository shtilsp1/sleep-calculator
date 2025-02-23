import { createRouter, createWebHistory } from 'vue-router';
import WakeUpView from '../views/WakeUpView.vue';
import SleepView from '../views/SleepView.vue';

const routes = [
  { path: '/', name: 'wake-up', component: WakeUpView },
  { path: '/sleep', name: 'sleep', component: SleepView }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;