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

    <div v-else class="text-center text-success">
      <p class="text-lg font-semibold">Tu es déjà connecté !</p>
    </div>
  </div>
</template>

<script setup>
import { useAccountStore } from '../stores/accountStore';
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import config from '../config';

const accountStore = useAccountStore()
const { logged } = storeToRefs(accountStore)

const isUserLoggedIn = computed(() => logged.value)
const currentUrl = window.location.href
</script>
