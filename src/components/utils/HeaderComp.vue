<template>
  <div class="fixed w-full top-0 z-50">
    <div class="flex justify-between items-center bg-base-300 md:p-10 px-3 py-8 drop-shadow-md min-h-36 transition-all duration-300 ease-in-out">
      <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-80 transition-all hover:scale-105">
        <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="w-24 sm:w-36 transition-all duration-300 ease-in-out">
      </RouterLink>

      <div class="flex items-center justify-center">
        <!-- Connexion -->
        <div v-if="!accountStore.isLogged()">
          <!-- Afficher le portail de connexion -->
          <p class=" hover:opacity-70 transition-all mr-2">
            <RouterLink :to="{ name: 'Login' }">Portail connexion</RouterLink>
          </p>
        </div>
        <!-- Profil -->
        <div v-else class="flex items-center justify-center">
          <ul class="menu menu-horizontal">
            <li>
              <details>
                <summary>
                  {{ fullname }}
                </summary>
                <ul class="bg-base-100 rounded-t-none">
                  <li><a @click="profil">Profil</a></li>
                  <li><a @click="logout" class="text-red-600">Déconnexion</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <!-- Notification -->
        <div v-if="accountStore.isLogged()" class="dropdown dropdown-end" @click="handleMenuOpen">
          <div tabindex="0" role="button" class="indicator  cursor-pointer group flex items-center justify-center">
            <svg width="36px" height="36px" viewBox="0 0 24 24"  class="w-8 h-8 fill-current transition-all group-hover:opacity-60" xmlns="http://www.w3.org/2000/svg" >
              <path fill="currentColor" d="M11.713 7.14977C12.1271 7.13953 12.4545 6.79555 12.4443 6.38146C12.434 5.96738 12.0901 5.63999 11.676 5.65023L11.713 7.14977ZM6.30665 12.193H7.05665C7.05665 12.1874 7.05659 12.1818 7.05646 12.1761L6.30665 12.193ZM6.30665 14.51L6.34575 15.259C6.74423 15.2382 7.05665 14.909 7.05665 14.51H6.30665ZM6.30665 17.6L6.26755 18.349C6.28057 18.3497 6.29361 18.35 6.30665 18.35L6.30665 17.6ZM9.41983 18.35C9.83404 18.35 10.1698 18.0142 10.1698 17.6C10.1698 17.1858 9.83404 16.85 9.41983 16.85V18.35ZM10.9445 6.4C10.9445 6.81421 11.2803 7.15 11.6945 7.15C12.1087 7.15 12.4445 6.81421 12.4445 6.4H10.9445ZM12.4445 4C12.4445 3.58579 12.1087 3.25 11.6945 3.25C11.2803 3.25 10.9445 3.58579 10.9445 4H12.4445ZM11.713 5.65023C11.299 5.63999 10.955 5.96738 10.9447 6.38146C10.9345 6.79555 11.2619 7.13953 11.676 7.14977L11.713 5.65023ZM17.0824 12.193L16.3325 12.1761C16.3324 12.1818 16.3324 12.1874 16.3324 12.193H17.0824ZM17.0824 14.51H16.3324C16.3324 14.909 16.6448 15.2382 17.0433 15.259L17.0824 14.51ZM17.0824 17.6V18.35C17.0954 18.35 17.1084 18.3497 17.1215 18.349L17.0824 17.6ZM13.9692 16.85C13.555 16.85 13.2192 17.1858 13.2192 17.6C13.2192 18.0142 13.555 18.35 13.9692 18.35V16.85ZM10.1688 17.6027C10.1703 17.1885 9.83574 16.8515 9.42153 16.85C9.00732 16.8485 8.67034 17.1831 8.66886 17.5973L10.1688 17.6027ZM10.0848 19.3L10.6322 18.7873L10.6309 18.786L10.0848 19.3ZM13.3023 19.3L12.7561 18.786L12.7549 18.7873L13.3023 19.3ZM14.7182 17.5973C14.7167 17.1831 14.3797 16.8485 13.9655 16.85C13.5513 16.8515 13.2167 17.1885 13.2182 17.6027L14.7182 17.5973ZM9.41788 16.85C9.00366 16.85 8.66788 17.1858 8.66788 17.6C8.66788 18.0142 9.00366 18.35 9.41788 18.35V16.85ZM13.9692 18.35C14.3834 18.35 14.7192 18.0142 14.7192 17.6C14.7192 17.1858 14.3834 16.85 13.9692 16.85V18.35ZM11.676 5.65023C8.198 5.73622 5.47765 8.68931 5.55684 12.2099L7.05646 12.1761C6.99506 9.44664 9.09735 7.21444 11.713 7.14977L11.676 5.65023ZM5.55665 12.193V14.51H7.05665V12.193H5.55665ZM6.26755 13.761C5.0505 13.8246 4.125 14.8488 4.125 16.055H5.625C5.625 15.6136 5.95844 15.2792 6.34575 15.259L6.26755 13.761ZM4.125 16.055C4.125 17.2612 5.0505 18.2854 6.26755 18.349L6.34575 16.851C5.95843 16.8308 5.625 16.4964 5.625 16.055H4.125ZM6.30665 18.35H9.41983V16.85H6.30665V18.35ZM12.4445 6.4V4H10.9445V6.4H12.4445ZM11.676 7.14977C14.2917 7.21444 16.3939 9.44664 16.3325 12.1761L17.8322 12.2099C17.9114 8.68931 15.191 5.73622 11.713 5.65023L11.676 7.14977ZM16.3324 12.193V14.51H17.8324V12.193H16.3324ZM17.0433 15.259C17.4306 15.2792 17.764 15.6136 17.764 16.055H19.264C19.264 14.8488 18.3385 13.8246 17.1215 13.761L17.0433 15.259ZM17.764 16.055C17.764 16.4964 17.4306 16.8308 17.0433 16.851L17.1215 18.349C18.3385 18.2854 19.264 17.2612 19.264 16.055H17.764ZM17.0824 16.85H13.9692V18.35H17.0824V16.85ZM8.66886 17.5973C8.66592 18.4207 8.976 19.2162 9.53861 19.814L10.6309 18.786C10.335 18.4715 10.1673 18.0473 10.1688 17.6027L8.66886 17.5973ZM9.53739 19.8127C10.0977 20.4109 10.8758 20.7529 11.6935 20.7529V19.2529C11.2969 19.2529 10.9132 19.0873 10.6322 18.7873L9.53739 19.8127ZM11.6935 20.7529C12.5113 20.7529 13.2894 20.4109 13.8497 19.8127L12.7549 18.7873C12.4739 19.0873 12.0901 19.2529 11.6935 19.2529V20.7529ZM13.8484 19.814C14.4111 19.2162 14.7211 18.4207 14.7182 17.5973L13.2182 17.6027C13.2198 18.0473 13.0521 18.4715 12.7561 18.786L13.8484 19.814ZM9.41788 18.35H13.9692V16.85H9.41788V18.35Z" />
            </svg>
            <span class="badge badge-sm badge-info indicator-item select-none" v-if="notification && notification.countvue > 0">{{ notification.countvue }}</span>
          </div>

          <div tabindex="0" class="dropdown-content menu bg-base-200 z-[1] w-120 p-2 min-h-96 flex items-center justify-center drop-shadow-lg"  >
            <div v-if="notification.count && notification.count > 0" class="w-full h-96 overflow-y-auto">
              <p>Vous avez {{ notification.count }} notification{{ notification.count > 1 ? 's' : '' }} dont {{ notification.countvue }} non lue{{ notification.countvue > 1 ? 's' : '' }}.</p>
              <!-- Liste des notifs -->
              <div v-for="(notif, index) in notification.notifications" :key="index" class="relative w-full my-1 flex items-center justify-start p-2"
                  :class="{ 'bg-base-100 border-l-4 border-blue-500': !notif.not_vue, 'bg-base-100 border-l-4 border-base-100': notif.not_vue }">
                  <!-- Image -->
                  <div class="avatar placeholder h-12 my-1 mr-2">
                    <div class="text-neutral-content w-12 rounded-full select-none" :class="notif.envoyeur.access?.acs_accounttype == 1 ? 'bg-red-600' : 'bg-neutral'" :style="{backgroundColor: notif.envoyeur?.department?.dept_color}">
                      <span>{{ getInitials(notif.envoyeur?.acc_fullname) }}</span>
                    </div>
                  </div>
                  <!-- Texte -->
                  <div class="flex flex-col w-full">
                    <div class="flex justify-between w-full py-1">
                      <p class="font-bold" v-if="notif.envoyeur?.acc_fullname">
                        <span v-if="notif.envoyeur?.access?.acs_accounttype == 1" class=" bg-red-600 p-1 rounded-lg">ILC</span>
                        <span v-else-if="notif.envoyeur?.department?.dept_name" :style="{backgroundColor: notif.envoyeur?.department?.dept_color}" class="p-1 rounded-lg">{{ notif.envoyeur.department.dept_shortname }}</span>
                         {{ notif.envoyeur.acc_fullname }}
                      </p>
                      <p class="font-bold" v-else><span class="bg-blue-600 p-1 rounded-lg">Auto</span> Système</p>
                      <p>{{ notif.not_date }}</p>
                    </div>
                    <p>{{ notif.not_message }}</p>
                  </div>
              </div>
            </div>
            <div v-else class="w-full">
              <p class="font-bold text-center">Vous n'avez pas de notification.</p>
            </div>
          </div>
        </div>

        <!-- Changement de thème -->
        <div class="scale-75 hover:opacity-60 transition-all ml-2 flex items-center justify-center">
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
import { onMounted, ref, nextTick } from 'vue';
import { request } from '../../composables/httpRequest';

const router = useRouter();
const accountStore = useAccountStore();
const { fullname } = storeToRefs(accountStore);
const theme = ref(localStorage.getItem('theme') || 'light');

const notification = ref([])
const response = ref([])
const menuAlreadyOpen = ref(false)

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

async function handleMenuOpen(){
  if(!menuAlreadyOpen.value && notification.value.countvue > 0){
    menuAlreadyOpen.value = true;
    const requestData = {
      acc_id: accountStore.login
    }
    await request('PUT', false, response, config.apiUrl+'api/notification/watch', requestData)
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

function getInitials(fullname) {
  if (!fullname) {
    return 'Sys';
  }
  const names = fullname.split(' ');
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return (names[0][0] + names[1][0]).toUpperCase();
}

async function load(){
  await nextTick();
  await request('GET', true, notification, config.apiUrl+'api/notification/getbylogin/'+accountStore.login)
  applyTheme(theme.value);
}

onMounted(load)
</script>

<style scoped>
  .drop-shadow-lg {
      --tw-drop-shadow: none !important;
  }
</style>