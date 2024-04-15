import { createRouter, createWebHistory } from 'vue-router'
import Index from './pages/index.vue'

const routes = [
    { path: '/', name: 'Accueil', component: Index },
    { path: '/convert', name: 'Convert', component: () => import('./pages/convert.vue') },

];

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
      },
});
