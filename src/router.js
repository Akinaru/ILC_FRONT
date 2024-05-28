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
    
    if (accountStore.isLogged() && accountStore.getAccessLevel() == accessLevel) {
        next();
    } else {
        next({ name: 'Dashboard' });
        addAlert(true, {data: {error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'}})
    }
};
function checkMultipleAccess(...levels) {
    return (to, from, next) => {
        const accountStore = useAccountStore();
  
      if (levels.some(level => accountStore.getAccessLevel() >= level)) {
        next();
      } else {
        next({ name: 'Dashboard' });
        addAlert(true, {data: {error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'}})
      }
    };
  }

const isAlreadyLogin = (to, from, next) => {
    const accountStore = useAccountStore();
    if(accountStore.isLogged()){
        next({name: 'Dashboard'})
    }else{
        next();
    }
}

const isAlreadyComplete = (to, from, next) => {
    const accountStore = useAccountStore();
    if(accountStore.getAccountValidate()){
        next({name: 'Dashboard'})
    }else{
        next();
    }    
}

const routes = [
    { path: '/', name: 'Accueil', component: Index, meta: { title: 'Accueil' } },
    { path: '/not-found', name: 'NotFound', component: () => import('./pages/notfound.vue'), meta: { title: 'Not Found' } },
    { path: '/:pathMatch(.*)*', redirect: '/not-found' },
    { path: '/convert', name: 'Convert', component: () => import('./pages/convert.vue'), meta: { title: 'Convert' } },
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue'), beforeEnter: isAlreadyLogin, meta: { title: 'Login' } },
    { path: '/compldossier', name: 'ComplDossier', component: () => import('./pages/compldossier.vue'), beforeEnter: isAlreadyComplete, meta: { title: 'Compléter Dossier' } },
    { path: '/article/:art_id', name: 'Article', component: () => import('./pages/article.vue'), meta: {
        title: route => `Dashboard - Article n° ${route.params.art_id}`
    } },
    { path: '/evenement', name: 'Evenement', component: () => import('./pages/evenementliste.vue'), meta: { title: 'Liste des évènement' } },
    { path: '/evenement/:evt_id', name: 'EvenementDetail', component: () => import('./pages/evenementdetail.vue'), meta: { title: route => `Évènement ${route.params.evt_id}` }},

    { 
        path: '/dashboard', 
        component: () => import('./pages/dashboard.vue'), 
        beforeEnter: requireAuth,
        children: [
            { path: '', name: 'Dashboard', meta: { title: 'Dashboard' }, beforeEnter: (to, from, next) => {
                const accountStore = useAccountStore();
                if (accountStore.getAccessLevel() && accountStore.getAccessLevel() === 1) {
                    next({ name: 'HomeRI' });
                } else if (accountStore.getAccessLevel() && accountStore.getAccessLevel() === 2) {
                    next({ name: 'HomeDept' });
                } else {
                    next({ name: 'Home' });
                }
            }},
            { 
                path: 'article', 
                name: 'ArticleDash', 
                component: () => import('./pages/dashboard/article.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Article' }
            },
            { 
                path: 'departement', 
                name: 'DepartementDash', 
                component: () => import('./pages/dashboard/departement.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Departement' }
            },
            { 
                path: 'modifbase', 
                name: 'ModifBaseDash', 
                component: () => import('./pages/dashboard/modifbase.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - ModifBase' } 
            },
            { 
                path: 'accord', 
                name: 'AccordDash', 
                component: () => import('./pages/dashboard/accord.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Accord' }
            },
            { 
                path: 'access', 
                name: 'AccessDash', 
                component: () => import('./pages/dashboard/access.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Access' }
            },
            { 
                path: 'etudiants', 
                name: 'EtudiantsDash', 
                component: () => import('./pages/dashboard/etudiants.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Etudiants' }
            },
            { 
                path: 'historique', 
                name: 'HistoriqueDash', 
                component: () => import('./pages/dashboard/historique.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Historique' }
            },
            { 
                path: 'evenement', 
                name: 'EvenementDash', 
                component: () => import('./pages/dashboard/evenement.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Evenements' }
            },
            { 
                path: 'home-ri', 
                name: 'HomeRI', 
                component: () => import('./pages/dashboard/home-ri.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Home RI' }
            },
            { 
                path: 'home-dept', 
                name: 'HomeDept', 
                component: () => import('./pages/dashboard/home-dept.vue'),
                beforeEnter: requireAccess(2),
                meta: { title: 'Dashboard - Home Dept' }
            },
            { 
                path: 'home', 
                name: 'Home', 
                component: () => import('./pages/dashboard/home.vue'),
                beforeEnter: requireAccess(0),
                meta: { title: 'Dashboard - Home' }
            },
            { 
                path: 'profile/:acc_id', 
                name: 'Profile', 
                component: () => import('./pages/dashboard/profile.vue'),
                beforeEnter: checkMultipleAccess(1, 2),
                meta: {
                    title: route => `Dashboard - Profile de ${route.params.acc_id}`
                }
            },
        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
});

router.beforeEach((to, from, next) => {
    const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title;
    document.title = `ILC - ${title || to.name}`;
    next();
});

export default router;
