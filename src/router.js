import { createRouter, createWebHistory } from 'vue-router'
import Index from './pages/index.vue'

const routes = [
    { path: '/', name: 'Accueil', component: Index },
    { path: '/convert', name: 'Convert', component: () => import('./pages/convert.vue') },
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue') },
    { path: '/dashboard', name: 'Dashboard', component: () => import('./pages/dashboard.vue'), children: [
        { path: '', component: () => import('./pages/dashboard/home.vue')},
        { path: 'article', name: 'ArticleDash', component: () => import('./pages/dashboard/article.vue') },
        { path: 'parametres', name: 'ParametresDash', component: () => import('./pages/dashboard/parametres.vue') },
        { path: 'modifbase', name: 'ModifBaseDash', component: () => import('./pages/dashboard/modifbase.vue') },
    ]},


];

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
      },
});
