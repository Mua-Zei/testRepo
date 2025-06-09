import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home.vue';
import Writer from '@/pages/Writer.vue';
import Playground from '@/pages/Playground.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: Home },
  { path: '/writer', name: 'Writer', component: Writer },
  { path: '/playground', name: 'Playground', component: Playground }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
