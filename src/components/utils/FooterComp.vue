<template>
<!-- Footer moderne redesigné -->
<footer class="bg-base-200 border-t border-base-300">
  <div class="container mx-auto py-10 px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
      <!-- Colonne 1: Logos -->
      <div class="flex flex-col items-center md:items-start space-y-6">
        <div class="flex items-center gap-6">
          <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-90 transition-all duration-300">
            <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="h-16 md:h-20">
          </RouterLink>
          <a href="https://www.univ-smb.fr/iut-annecy/" class="hover:opacity-90 transition-all duration-300">
            <img :src="config.apiUrl + 'images/LOGOS/Logo_IUT_Annecy_Bleu.png'" alt="IUT Annecy" class="h-14 md:h-16">
          </a>
        </div>
        <p class="text-sm text-base-content/70 max-w-xs text-center md:text-left">
          Le service des relations internationales de l'IUT d'Annecy, pour un accompagnement personnalisé dans votre mobilité.
        </p>
      </div>
      
      <!-- Colonne 2: Navigation -->
      <div class="flex flex-col items-center space-y-6">
        <h3 class="font-medium text-lg">Navigation</h3>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <RouterLink :to="{name: 'Accueil'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Accueil
          </RouterLink>
          <RouterLink :to="{name: 'Evenement'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Événements
          </RouterLink>
          <RouterLink :to="{name: 'Articles'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Articles
          </RouterLink>
          <RouterLink v-if="!accountStore.isLogged()" :to="{name: 'Login'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Connexion
          </RouterLink>
          <RouterLink v-else :to="{name: 'Dashboard'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profil
          </RouterLink>
          <RouterLink :to="{name: 'Aide'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.227 9.157c.25-.65.874-1.157 1.773-1.157 1.105 0 2 .672 2 1.5 0 .513-.242.837-.594 1.073-.275.188-.64.321-.91.584C10.958 11.552 11 12 11 12m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aide
          </RouterLink>
          <RouterLink :to="{name: 'MentionsLegales'}" class="flex items-center gap-1.5 text-base-content/80 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mentions légales
          </RouterLink>
        </div>
      </div>
      
      <!-- Colonne 3: Contact -->
      <div class="flex flex-col items-center md:items-end space-y-6">
        <h3 class="font-medium text-lg">Contact</h3>
        <div class="flex flex-col items-center md:items-end gap-3 text-sm text-base-content/80">
          <a href="mailto:ilc-admin.iut-acy@univ-smb.fr" class="flex items-center gap-1.5 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ilc-admin.iut-acy@univ-smb.fr
          </a>
          <a href="tel:+33450092210" class="flex items-center gap-1.5 hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +33 (0)4 50 09 22 10
          </a>
        </div>
      </div>
    </div>
    
    <!-- Séparateur -->
    <div class="w-full h-px bg-base-300 my-8"></div>
    
    <!-- Copyright -->
    <div class="flex flex-col md:flex-row justify-between items-center">
      <p class="text-sm text-base-content/70">
        Copyright © {{ date }} ILC - Tous droits réservés.
      </p>
      <p class="text-sm text-base-content/60 mt-2 md:mt-0">
        Développé par Maxime GALLOTTA & Luc DAMAS
      </p>
    </div>
  </div>
</footer>
</template>
    
<script setup>
    import config from '../../config'
    import {ref} from 'vue'
    import { useAccountStore } from '../../stores/accountStore';
    const accountStore = useAccountStore();

    const date = ref('')
    date.value = new Date().getFullYear();
</script>