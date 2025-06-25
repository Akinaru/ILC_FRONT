<template>
  <div class="container mx-auto py-12">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold mb-2">Accès Administrateur</h1>
    </div>

    <div v-if="!isUserLoggedIn" class="flex justify-center">
      <a
        :href="`${config.apiUrl}cas.php?redirect=${encodeURIComponent(currentUrl)}&admin=true`"
        class="btn btn-primary btn-outline rounded-full gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Connexion administrateur
      </a>
    </div>

    <div v-else class="flex flex-col items-center gap-4">
      <p class="text-lg font-semibold text-success">Tu es déjà connecté !</p>
      <button @click="logout" class="btn btn-error btn-outline gap-2 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Déconnexion
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAccountStore } from '../stores/accountStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import config from '../config';
import { useRouter } from 'vue-router';
import { request } from '../composables/httpRequest';

const router = useRouter();
const accountStore = useAccountStore();
const { logged } = storeToRefs(accountStore);

const isUserLoggedIn = computed(() => logged.value);
const currentUrl = window.location.href;

function getCurrentURL() {
  return window.location.href;
}

async function logout() {
  try {
    // Appel API Laravel logout (si nécessaire)
    await request('POST', false, null, config.apiUrl + 'api/logout');
  } catch (e) {
    console.warn('Échec logout Laravel', e);
  }

  // Nettoyage local
  localStorage.removeItem('login');
  localStorage.removeItem('auth');
  localStorage.removeItem('token');

  // Déconnexion côté phpCAS (et admin fake)
  window.open(config.apiUrl + 'cas.php?logout=true&redirect=' + encodeURIComponent(getCurrentURL()), '_blank');

  // Redirection frontend
  accountStore.logoutAccount();
  router.push({ name: 'Accueil' });
}
</script>
