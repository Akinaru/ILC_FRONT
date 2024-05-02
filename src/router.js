import { useAccountStore } from './stores/accountStore';
import { createRouter, createWebHistory } from 'vue-router';
import Index from './pages/index.vue'
import { addAlert } from './composables/addAlert';

const requireAuth = (to, from, next) => {
    const accountStore = useAccountStore();
    
    if (accountStore.isLogged()) {
        next();
    } else {
        next({ name: 'Login' });
        addAlert({error: 'Vous devez être connecté pour accéder à cette page.'})
    }
};

const routes = [
    { path: '/', name: 'Accueil', component: Index },
    { path: '/convert', name: 'Convert', component: () => import('./pages/convert.vue') },
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue') },
    { path: '/article/:art_id', name: 'Article', component: () => import('./pages/article.vue') },
    { 
        path: '/dashboard', 
        component: () => import('./pages/dashboard.vue'), 
        beforeEnter: requireAuth,
        children: [
            { path: '', name: 'Dashboard', component: () => import('./pages/dashboard/home.vue')},
            { path: 'article', name: 'ArticleDash', component: () => import('./pages/dashboard/article.vue') },
            { path: 'departement', name: 'DepartementDash', component: () => import('./pages/dashboard/departement.vue') },
            { path: 'modifbase', name: 'ModifBaseDash', component: () => import('./pages/dashboard/modifbase.vue') },
            { path: 'accord', name: 'AccordDash', component: () => import('./pages/dashboard/accord.vue') },
            { path: 'access', name: 'AccessDash', component: () => import('./pages/dashboard/access.vue') },
        ]
    },
];

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
});

