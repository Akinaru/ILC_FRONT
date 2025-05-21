<template>
  <!-- Header moderne refait -->
  <header class="w-full z-50 sticky top-0">
    <div class="bg-base-100 shadow-md border-b border-base-200">
      <div class="px-5 w-full">
        <div class="flex justify-between items-center py-3">
          <!-- Logo avec effet hover amélioré -->
          <RouterLink :to="{ name: 'Accueil' }" class="group flex items-center hover:opacity-90 transition-all duration-300">
            <div class="relative rounded-lg">
              <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="w-28 sm:w-40 relative z-10 transition-all duration-300 ease-in-out group-hover:translate-x-1">
            </div>
          </RouterLink>
          
          <!-- Partie droite avec les actions -->
          <div class="flex items-center space-x-1 sm:space-x-3">

            <!-- Bouton connexion (visible si non connecté) -->
            <div v-if="!isUserLoggedIn" class="mr-2">
              <a :href="config.apiUrl+'cas.php?redirect='+currentUrl" class="btn btn-sm btn-primary btn-outline rounded-full px-4 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Connexion
              </a>
            </div>
            
            <!-- Menu utilisateur (visible si connecté) -->
            <div v-else class="relative">
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-sm px-2 sm:px-3 rounded-full border border-base-300 hover:bg-base-200 cursor-pointer">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <!-- Badge de rôle -->
                    <div class="px-1.5 py-0.5 text-xs rounded-md transition-all" 
                      :style="{ 
                        backgroundColor: accountStore?.account?.role.color || '#aaaaaa',
                        color: getOptimalTextColor(accountStore?.account?.role.color || '#aaaaaa')
                      }">
                      {{ accountStore?.account?.role.role || 'Étudiant' }}
                    </div>
                    
                    <!-- Nom d'utilisateur avec traitement différent selon taille d'écran -->
                    <span class="hidden sm:inline font-medium text-sm">
                      {{ accountStore.account.acc_fullname != null ? accountStore.account.acc_fullname : 'Compte' }}
                    </span>
                    
                    <!-- Avatar/Initiales pour mobile -->
                    <div class="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary sm:hidden">
                      <span class="text-xs font-bold">
                        {{ accountStore.account.acc_fullname ? accountStore.account.acc_fullname.charAt(0) : 'U' }}
                      </span>
                    </div>
                    
                    <!-- Icône chevron -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </label>
                
                <!-- Menu déroulant redesigné -->
                <ul tabindex="0" class="dropdown-content z-[100] menu menu-sm shadow-lg bg-base-100 rounded-box w-60 mt-2 p-1 border border-base-200">
                  <li class="menu-title px-4 py-2 text-xs font-medium text-base-content/60">
                    <span>Mon compte</span>
                  </li>
                  
                  <!-- Info utilisateur -->
                  <div class="px-4 py-2 bg-base-200/50 rounded-lg mb-2 text-sm">
                    <div class="font-semibold">{{ accountStore.account.acc_fullname || 'Utilisateur' }}</div>
                    <div class="text-xs text-base-content/70">Login: {{ accountStore.account.acc_id }}</div>
                  </div>


                  <div  class="px-4 py-2 text-sm">

                    <div v-if="accountStore.isStudent() && accountStore.account?.acc_validateacc" class="text-xs text-base-content/70">Profil complété: <span class="badge badge-sm">{{ accountStore.account.acc_validateacc ? '✅' : '❌' }}</span></div>
                    <div v-if="accountStore.isStudent()" class="text-xs text-base-content/70">
                      Date limite :
                      <span 
                        class="badge badge-sm" 
                        :class="joursRestants(accountStore.account.datelimite) < 0 
                          ? 'bg-red-100 text-red-800 border border-red-300' 
                          : 'bg-green-100 text-green-800 border border-green-300'">
                        {{ getJoursRestants(accountStore.account.datelimite) }}
                      </span>
                    </div>
                    <div v-if="accountStore.isStudent()" class="text-xs text-base-content/70">Nombre de voeux: <span class="badge badge-sm">{{ accountStore.account.wishes.count }}</span></div>
                    <div v-if="accountStore.isStudent() && accountStore.account?.favoris?.count" class="text-xs text-base-content/70">Nombre de favoris: <span class="badge badge-sm">{{ accountStore.account.favoris.count }}</span></div>

                    <div v-if="(accountStore.isAdmin() || accountStore.isChefDept()) && accountStore.account?.metrics?.students" class="text-xs text-base-content/70">Nombre d'étudiants: <span class="badge badge-sm">{{ accountStore.account.metrics.students }}</span></div>
                    <div v-if="accountStore.isAdmin() && accountStore.account?.metrics?.agreements" class="text-xs text-base-content/70">Nombre d'accords: <span class="badge badge-sm">{{ accountStore.account.metrics.agreements }}</span></div>
                    <div v-if="accountStore.isAdmin() && accountStore.account?.metrics?.articles" class="text-xs text-base-content/70">Nombre d'articles: <span class="badge badge-sm">{{ accountStore.account.metrics.articles }}</span></div>
                  </div>

                  <div class="divider my-1"></div>
                  
                  <!-- Options du menu -->
                  <li>
                    <a @click="goToPage('Dashboard')" class="flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span v-if="accountStore.isAdmin()">Dashboard</span>
                      <span v-else-if="accountStore.isChefDept()">Etudiants</span>
                      <span v-else>Mon profil</span>
                    </a>
                  </li>
                  <li v-if="accountStore.isAdmin()">
                    <a @click="goToPage('AccordDash')" class="flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Accords</span>
                    </a>
                  </li>
                  <li v-if="accountStore.isAdmin()">
                    <a @click="goToPage('EtudiantsDash')" class="flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Etudiants</span>
                    </a>
                  </li>
                  <li v-if="accountStore.isAdmin()">
                    <a @click="goToPage('ArticleDash')" class="flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                      <span>Articles</span>
                    </a>
                  </li>
                  <li v-if="accountStore.isAdmin()">
                    <a @click="goToPage('Arbitrage')" class="flex items-center gap-2 px-4 py-2 hover:bg-base-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      <span>Arbitrage</span>
                    </a>
                  </li>
                  
                  <div class="divider my-1"></div>
                  
                  <li>
                    <a @click="logout" class="flex items-center gap-2 px-4 py-2 text-error hover:bg-error/10 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Switch thème -->
            <div class="p-1">
              <label class="swap swap-rotate hover:opacity-80 transition-opacity" style="margin-top: 6px;">
                <input type="checkbox" class="theme-controller" @change="toggleTheme" :checked="theme === 'dark'" />
                <!-- Icône soleil -->
                <svg class="swap-off fill-current w-6 h-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
                </svg>
                <!-- Icône lune -->
                <svg class="swap-on fill-current w-6 h-6 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

</template>

<script setup>
import { useAccountStore } from '../../stores/accountStore';
import { storeToRefs } from 'pinia';
import config from '../../config';
import { useRouter } from 'vue-router';
import { onMounted, ref, nextTick, watch, computed } from 'vue';
import { request } from '../../composables/httpRequest';

const router = useRouter();
const accountStore = useAccountStore();
const { logged } = storeToRefs(accountStore);
const theme = ref(localStorage.getItem('theme') || 'light');
const currentUrl = ref('');
const account = ref([]);
const response = ref([]);

// Propriété computed pour vérifier l'état de connexion
const isUserLoggedIn = computed(() => logged.value);

// Fonction pour obtenir l'URL courante pour la déconnexion
function getCurrentURL() {
  // Vérifier si window est défini (pour éviter les erreurs pendant le SSR)
  if (typeof window !== 'undefined' && window.location) {
    return encodeURIComponent(window.location.href);
  }
  return '';
}

async function logout() {
  // Appel API logout
  await request('POST', false, response, config.apiUrl + 'api/logout');
  
  // Nettoyage localStorage
  localStorage.removeItem('login');
  localStorage.removeItem('auth');
  localStorage.removeItem('token');
  
  // Utilisation du paramètre redirect pour la déconnexion
  window.open(config.apiUrl + 'cas.php?logout=true&redirect=' + getCurrentURL(), '_blank');
  router.push({ name: 'Accueil' });
  accountStore.logoutAccount();
}

// Reste des fonctions inchangées
function closeMenu() {
  const details = document.querySelector('details');
  if (details) {
    details.removeAttribute('open');
  }
}

function profil() {
  router.push({ name: 'Dashboard' });

  closeMenu();
}

function getJoursRestants(date){
  if(joursRestants(date) == 0){
    return "aujourd'hui";
  }
  else if(joursRestants(date) == 1){
    return 'demain';
  }
  else if(joursRestants(date) < 0){
    return 'il y a '+(-joursRestants(date)) + ' jour' + (-joursRestants(date) > 1 ? 's' : '');
  }
  return ''+ joursRestants(date) +' jours restants';
}

function joursRestants(date) {
  const dateLimite = new Date(date);
  const currentDate = new Date();
  const timeDifference = dateLimite - currentDate;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function goToPage(route) {
  router.push({ name: route });
  closeMenu();
}

function getOptimalTextColor(backgroundColor) {
  let r, g, b;
  
  // Gestion du format hexadécimal
  if (backgroundColor.startsWith('#')) {
    const hex = backgroundColor.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      // Valeur par défaut pour un format hexadécimal invalide
      r = 128; g = 128; b = 128;
    }
  } 
  // Gestion du format RGB ou RGBA
  else if (backgroundColor.startsWith('rgb')) {
    const match = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      // Valeur par défaut pour un format RGB invalide
      r = 128; g = 128; b = 128;
    }
  } 
  // Gestion des noms de couleurs CSS via un élément temporaire
  else {
    const tempElement = document.createElement('div');
    tempElement.style.color = backgroundColor;
    document.body.appendChild(tempElement);
    const computedColor = window.getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      // Valeur par défaut si la couleur n'est pas reconnue
      r = 128; g = 128; b = 128;
    }
  }
  
  // Calculer la luminance relative selon la formule du WCAG 2.0
  // https://www.w3.org/TR/WCAG20-TECHS/G17.html
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Utiliser du texte blanc sur fond foncé, du texte noir sur fond clair
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

function toggleTheme() {
  theme.value = theme.value == 'light' ? 'dark' : 'light';
  applyTheme(theme.value);
  localStorage.setItem('theme', theme.value);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

async function load() {
  currentUrl.value = window.location.href;

  await nextTick();

  applyTheme(theme.value);
}

watch(logged, async (newVal) => {
  isUserLoggedIn.value = logged.value;
});


onMounted(load);
</script>