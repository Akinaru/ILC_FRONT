import { useAccountStore } from './stores/accountStore';
import { createRouter, createWebHashHistory } from 'vue-router';
import Index from './pages/index.vue'
import { addAlert } from './composables/addAlert';
import { ref } from 'vue';
import config from './config';
import { request } from './composables/httpRequest';

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
        addAlert('error', {
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
        addAlert('error', {data: {error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'}})
    }
};
function checkMultipleAccess(...levels) {
    return (to, from, next) => {
        const accountStore = useAccountStore();
  
      if (levels.some(level => accountStore.getAccessLevel() >= level)) {
        next();
      } else {
        next({ name: 'Dashboard' });
        addAlert('error', {data: {error: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'}})
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
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue'), beforeEnter: isAlreadyLogin, meta: { title: 'Login' } },
    { path: '/compldossier', name: 'ComplDossier', component: () => import('./pages/compldossier.vue'), beforeEnter: isAlreadyComplete, meta: { title: 'Compléter Dossier' } },
    { path: '/articles', name: 'Articles', component: () => import('./pages/articles.vue'), meta: { title: 'Liste des articles' } },
    { path: '/article/:art_id', name: 'Article', component: () => import('./pages/article.vue'), meta: {
        title: route => `Article n° ${route.params.art_id}`
    } },
    { path: '/accord/:agree_id', name: 'Accord', component: () => import('./pages/accord.vue'), meta: {
        title: route => `Accord n° ${route.params.agree_id}`
    } },
    { path: '/evenement', name: 'Evenement', component: () => import('./pages/evenementliste.vue'), meta: { title: 'Liste des évènements' } },
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
                path: 'universite', 
                name: 'UniversiteDash', 
                component: () => import('./pages/dashboard/universite.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Université' } 
            },
            { 
                path: 'isced', 
                name: 'IscedDash', 
                component: () => import('./pages/dashboard/isced.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - ISCED' } 
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
                beforeEnter: checkMultipleAccess(1, 2),
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
                path: 'documents', 
                name: 'DocumentsDash', 
                component: () => import('./pages/dashboard/documents.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Documents' }
            },
            { 
                path: 'arbitrage', 
                name: 'Arbitrage', 
                component: () => import('./pages/dashboard/arbitrage.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Arbitrage' }
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


const account = ref([])
async function checkUserLogin() {
    try {
    const accountStore = useAccountStore();
      const response = await fetch(config.apiUrl+'cas.php'+'?check_login=true');
      if (response.ok) {
        const data = await response.json();
        const isLogged = data.logged_in; // Renommez cette variable pour correspondre à ce que vous voulez retourner
        const userLogin = data.login; // Renommez cette variable pour correspondre à ce que vous voulez retourner
  
        // Mettez à jour le store si nécessaire
        if (isLogged) {
          accountStore.$patch({ logged: true, login: userLogin });
        }
  
        return [isLogged, userLogin]; // Retournez un tableau avec isLogged et userLogin
      } else {
        console.error('Erreur lors de la vérification de l\'état de connexion.');
        return [false, null]; // Si la réponse n'est pas OK, retournez false et null
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      return [false, null]; // Si une erreur se produit, retournez false et null
    }
  }

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
});

router.isReady().then(async () => {
    const accountStore = useAccountStore();
    
    try {
        const [isLogged, userLogin] = await checkUserLogin()
        if(isLogged && userLogin != null){
          await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+userLogin);
          const patchedValues = {
            login: account.value.acc_id,
            fullname: account.value.acc_fullname,
            logged: true,
            last_login: new Date().toISOString(),
            access: account.value.access ? account.value.access.acs_accounttype : 0,
            acc_validateacc: account.acc_validateacc
          }
          accountStore.$patch(patchedValues); // Utilisez uniquement les propriétés nécessaires
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de la connexion :', error);
    }
});

router.beforeEach((to, from, next) => {
    const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title;
    document.title = `ILC - ${title || to.name}`;
    next();
});

export default router;
