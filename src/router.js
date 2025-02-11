import { useAccountStore } from './stores/accountStore';
import { createRouter, createWebHashHistory } from 'vue-router';
import Index from './pages/index.vue'
import { addAlert } from './composables/addAlert';
import { ref } from 'vue';
import config from './config';
import { request } from './composables/httpRequest';



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


const isAlreadyComplete = (to, from, next) => {
    const accountStore = useAccountStore();
    if(accountStore.isLogged()){

        if(accountStore.getAccountValidate()){
            next({name: 'Dashboard'})
        }else{
            next();
        }    
    }else{
        next({name: 'Accueil'});
        addAlert('error', {data: {error: 'Vous devez être connecté pour accéder à cette page.'}})
    }
}

const routes = [
    { path: '/', name: 'Accueil', component: Index, meta: { title: 'Accueil', requiresAuth: false } },
    { path: '/not-found', name: 'NotFound', component: () => import('./pages/notfound.vue'), meta: { title: 'Not Found', requiresAuth: false } },
    { path: '/:pathMatch(.*)*', redirect: '/not-found' },
    { path: '/login', name: 'Login', component: () => import('./pages/login.vue'), meta: { title: 'Login', requiresAuth: false } },
    { path: '/compldossier', name: 'ComplDossier', component: () => import('./pages/compldossier.vue'), beforeEnter: isAlreadyComplete, meta: { title: 'Votre dossier est incomplet!', requiresAuth: false } },
    { path: '/articles', name: 'Articles', component: () => import('./pages/articles.vue'), meta: { title: 'Liste des articles', requiresAuth: false } },
    { path: '/article/:art_id', name: 'Article', component: () => import('./pages/article.vue'), meta: { title: route => `Article n° ${route.params.art_id}`, requiresAuth: false } },
    { path: '/accord/:agree_id', name: 'Accord', component: () => import('./pages/accord.vue'), meta: { title: route => `Accord n° ${route.params.agree_id}`, requiresAuth: false } },
    { path: '/evenement', name: 'Evenement', component: () => import('./pages/evenementliste.vue'), meta: { title: 'Liste des évènements', requiresAuth: false } },
    { path: '/evenement/:evt_id', name: 'EvenementDetail', component: () => import('./pages/evenementdetail.vue'), meta: { title: route => `Évènement ${route.params.evt_id}`, requiresAuth: false } },
    
    { 
        path: '/dashboard', 
        component: () => import('./pages/dashboard.vue'), 
        meta: { title: 'Dashboard', requiresAuth: true },
        children: [
            { path: '', name: 'Dashboard', meta: { title: 'Dashboard', requiresAuth: true }, beforeEnter: (to, from, next) => {
                const accountStore = useAccountStore();
                if (accountStore.getAccessLevel() === 1) {
                    next({ name: 'HomeRI' });
                } else if (accountStore.getAccessLevel() === 2) {
                    next({ name: 'EtudiantsDash' });
                } else {
                    next({ name: 'Home' });
                }
            }},
            { 
                path: 'article', 
                name: 'ArticleDash', 
                component: () => import('./pages/dashboard/article.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Article', requiresAuth: true }
            },
            { 
                path: 'departement', 
                name: 'DepartementDash', 
                component: () => import('./pages/dashboard/departement.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Departement', requiresAuth: true }
            },
            { 
                path: 'universite', 
                name: 'UniversiteDash', 
                component: () => import('./pages/dashboard/universite.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Université', requiresAuth: true } 
            },
            { 
                path: 'isced', 
                name: 'IscedDash', 
                component: () => import('./pages/dashboard/isced.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - ISCED', requiresAuth: true } 
            },
            { 
                path: 'accord', 
                name: 'AccordDash', 
                component: () => import('./pages/dashboard/accord.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Accord', requiresAuth: true }
            },
            { 
                path: 'access', 
                name: 'AccessDash', 
                component: () => import('./pages/dashboard/access.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Access', requiresAuth: true }
            },
            { 
                path: 'etudiants', 
                name: 'EtudiantsDash', 
                component: () => import('./pages/dashboard/etudiants.vue'),
                beforeEnter: checkMultipleAccess(1, 2),
                meta: { title: 'Dashboard - Etudiants', requiresAuth: true }
            },
            { 
                path: 'pays', 
                name: 'PaysDash', 
                component: () => import('./pages/dashboard/pays.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Pays', requiresAuth: true }
            },            
            { 
                path: 'historique', 
                name: 'HistoriqueDash', 
                component: () => import('./pages/dashboard/historique.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Historique', requiresAuth: true }
            },
            { 
                path: 'evenement', 
                name: 'EvenementDash', 
                component: () => import('./pages/dashboard/evenement.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Evenements', requiresAuth: true }
            },
            { 
                path: 'documents', 
                name: 'DocumentsDash', 
                component: () => import('./pages/dashboard/documents.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Documents', requiresAuth: true }
            },
            { 
                path: 'images', 
                name: 'ImagesDash', 
                component: () => import('./pages/dashboard/images.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Images', requiresAuth: true }
            },
            { 
                path: 'temoignage', 
                name: 'TemoignageDash', 
                component: () => import('./pages/dashboard/temoignage.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Témoignages', requiresAuth: true }
            },
            { 
                path: 'arbitrage', 
                name: 'Arbitrage', 
                component: () => import('./pages/dashboard/arbitrage.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Arbitrage', requiresAuth: true }
            },
            { 
                path: 'home-ri', 
                name: 'HomeRI', 
                component: () => import('./pages/dashboard/home-ri.vue'),
                beforeEnter: requireAccess(1),
                meta: { title: 'Dashboard - Home RI', requiresAuth: true }
            },
            { 
                path: 'home', 
                name: 'Home', 
                component: () => import('./pages/dashboard/home.vue'),
                beforeEnter: requireAccess(0),
                meta: { title: 'Dashboard - Home', requiresAuth: true }
            },
            { 
                path: 'profile/:acc_id', 
                name: 'Profile', 
                component: () => import('./pages/dashboard/profile.vue'),
                beforeEnter: checkMultipleAccess(1, 2),
                meta: { title: route => `Dashboard - Profile de ${route.params.acc_id}`, requiresAuth: true }
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
        const isLogged = data.logged_in;
        const userLogin = data.login;
        if(!isLogged){
            accountStore.logoutAccount();
        }
  
        return [isLogged, userLogin];
      } else {
        console.error('Erreur lors de la vérification de l\'état de connexion.');
        return [false, null];
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      return [false, null];
    }
  }

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    },
});

router.beforeEach(async (to, from, next) => {
    const accountStore = useAccountStore();
    const [isLogged, userLogin] = await checkUserLogin();
    if(isLogged){
        accountStore.loadAccountFromLocal();
    }

    // Si la route nécessite une authentification
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLogged) {
            addAlert('error', {
                data: { error: 'Vous devez être connecté pour accéder à cette page.' }
            });
            accountStore.logoutAccount();
            return next({ name: 'Accueil' });
        } else {
            // Mettez à jour le store si l'utilisateur est connecté
            if (userLogin != null) {
                try {
                    await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + userLogin);

                    if (account.value) {
                        const patchedValues = {
                            login: account.value.acc_id,
                            fullname: account.value.acc_fullname,
                            logged: true,
                            last_login: new Date().toISOString(),
                            access: account.value.access ? account.value.access.acs_accounttype : 0,
                            acc_validateacc: account.value.acc_validateacc
                        };
                        accountStore.$patch(patchedValues);

                        // Vérifiez la validation du compte ici
                        const accessLevel = accountStore.getAccessLevel();
                        const isValidated = accountStore.getAccountValidate();

                        if (accessLevel == 0 && !isValidated) {
                            if (to.name !== 'ComplDossier') {
                                return next({ name: 'ComplDossier' });
                            }
                        }
                    }
                } catch (error) {
                    console.log("Erreur lors de la récupération du compte:", error);
                    return next({ name: 'Accueil' });
                }
            }
        }
    }

    // Mettez à jour le titre de la page
    const title = typeof to.meta.title === 'function' ? to.meta.title(to) : to.meta.title;
    document.title = `ILC - ${title || to.name}`;
    
    next();
});


export default router;
