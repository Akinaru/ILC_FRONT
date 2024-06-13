<template>
  <div class="fixed w-full top-0 z-50">
    <div class="flex justify-between items-center bg-base-300 md:p-10 px-3 py-8 drop-shadow-lg min-h-36">
      <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-60 transition-all hover:scale-105">
        <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="w-36">
      </RouterLink>

      <div class="flex items-center justify-center">
        <div v-if="!accountStore.isLogged()">
          <!-- Afficher le portail de connexion -->
          <p class="mx-5 hover:opacity-70 transition-all">
            <RouterLink :to="{ name: 'Login' }">Portail connexion</RouterLink>
          </p>
        </div>
        <div v-else>
          <ul class="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                  {{ fullname }}
                </summary>
                <ul class="p-2 bg-base-100 rounded-t-none">
                  <li><a @click="profil">Profil</a></li>
                  <li><a @click="logout">Déconnexion</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <!-- Changement de thème -->
        <div class="scale-75 hover:opacity-60 transition-all ml-5">
          <label class="swap swap-rotate">
            <input type="checkbox" class="theme-controller" @change="toggleTheme" :checked="theme === 'dark'" />
            <svg class="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
            <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAccountStore } from '../../stores/accountStore';
import { storeToRefs } from 'pinia';
import config from '../../config';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter();
const accountStore = useAccountStore();
const { fullname } = storeToRefs(accountStore);
const theme = ref(localStorage.getItem('theme') || 'light');

function logout() {
  accountStore.logoutAccount();
  router.push({ name: 'Login' });
}

function closeMenu() {
  const details = document.querySelector('details');
  if (details) {
    details.removeAttribute('open');
  }
}

function profil() {
  router.push({ name: 'Dashboard' });
  // On force la fermeture du menu, car vu que le changement de page est dynamique, alors le menu ne se ferme pas.
  closeMenu();
}

function toggleTheme() {
  theme.value = theme.value == 'light' ? 'dark' : 'light';
  applyTheme(theme.value);
  localStorage.setItem('theme', theme.value);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

onMounted(() => {
  applyTheme(theme.value);
});
</script>
