import { useAccountStore } from './stores/accountStore';
import { createRouter, createWebHistory } from 'vue-router';
import Index from './pages/index.vue'
import { addAlert } from './composables/addAlert';

const requireAuth = (to, from, next) => {
    const accountStore = useAccountStore();
    
    if (accountStore.isLogged()) {
        if(accountStore.getAccessLevel() > 0){
            next();
        }else{
            if(accountStore.getAccountValidate()){
                next();
            }else{
                next({name: 'ComplDossier'})
            }
        }
    } else {
        next({ name: 'Login' });
        addAlert(true, {
            data: { 
                error: 'Vous devez être connecté pour accéder à cette page.'
            }
        })
    }
};

const requireAccess = (accessLevel) => (to, from, next) => {
    const accountStore = useAccountStore();
    
    if (accountStore.isLogged() && accountStore.getAccessLevel() >= accessLevel) {
        next();
    } else {
        next({ name: 'Dashboard' });
        addAlert(true, {data: {error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'}})
    }
};

const isAlreadyLogin = (to, from, next) => {
    const accountStore = useAccountStore();
    if(accountStore.isLogged()){
        next({name: 'Dashboard'})
    }else{
        next();
    }
}

const routes = [
    { path: '/', name: 'Accueil', component: Index },
    { path: '/not-found', name: 'NotFound', component: () => import('./pages/notfound.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/not-found' },
    { path: '/convert', name: 'Convert', component: () => import('./pages/convert.vue') },
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue'), beforeEnter: isAlreadyLogin },
    { path: '/compldossier', name: 'ComplDossier', component: () => import('./pages/compldossier.vue') },
    { path: '/article/:art_id', name: 'Article', component: () => import('./pages/article.vue') },
    { 
        path: '/dashboard', 
        component: () => import('./pages/dashboard.vue'), 
        beforeEnter: requireAuth,
        children: [
            { path: '', name: 'Dashboard', component: () => import('./pages/dashboard/home.vue')},
            { 
                path: 'article', 
                name: 'ArticleDash', 
                component: () => import('./pages/dashboard/article.vue'),
                beforeEnter: requireAccess(1)
            },
            { 
                path: 'departement', 
                name: 'DepartementDash', 
                component: () => import('./pages/dashboard/departement.vue'),
                beforeEnter: requireAccess(1)
            },
            { 
                path: 'modifbase', 
                name: 'ModifBaseDash', 
                component: () => import('./pages/dashboard/modifbase.vue'),
                beforeEnter: requireAccess(1) 
            },
            { 
                path: 'accord', 
                name: 'AccordDash', 
                component: () => import('./pages/dashboard/accord.vue'),
                beforeEnter: requireAccess(1)
            },
            { 
                path: 'access', 
                name: 'AccessDash', 
                component: () => import('./pages/dashboard/access.vue'),
                beforeEnter: requireAccess(1) 
            },
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

