<template>
    <div>
      <!-- Navbar améliorée -->
      <div class="mb-6">
        <div v-if="access == 1" class="bg-base-200 rounded-lg shadow-md p-2">
          <div class="flex flex-wrap gap-2 justify-start">
            <RouterLink
              v-for="route in routesRi"
              :key="route.routeName"
              :to="{name: route.routeName}"
              :class="[
                $route.name === route.routeName 
                  ? 'bg-[#3f2ab4] text-white' 
                  : 'bg-base-300 hover:bg-base-100',
                'px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-sm'
              ]"
              class="select-none"
            >
              <span>{{ route.name }}</span>
            </RouterLink>
          </div>
        </div>
  
        <div v-else-if="access == 2" class="bg-base-200 rounded-lg shadow-md p-2">
          <div class="flex flex-wrap md:flex-row flex-col gap-2">
            <RouterLink
              v-for="route in routesDept"
              :key="route.routeName"
              :to="{name: route.routeName}"
              :class="[
                $route.name === route.routeName 
                  ? 'bg-[#3f2ab4] text-white' 
                  : 'bg-base-300 hover:bg-base-100',
                'px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-sm'
              ]"
              class="select-none"
            >
              <span>{{ route.name }}</span>
            </RouterLink>
          </div>
        </div>
      </div>
      
      <!-- Affichage du contenu du dashboard -->
      <RouterView></RouterView>
    </div>
  </template>
  
  <script setup>
  import { useAccountStore } from '../stores/accountStore';
  
  const routesRi = [
      {routeName: 'HomeRI', name: '🏠 Accueil'},
      {routeName: 'ArticleDash', name: '📄 Article'},
      {routeName: 'DepartementDash', name: '📍 Departement'},
      {routeName: 'AccordDash', name: '🔗 Accord'},
      {routeName: 'UniversiteDash', name: '🎓 Université'},
      {routeName: 'PaysDash', name: '🇫🇷 Pays'},
      {routeName: 'IscedDash', name: '🔢 ISCED'},
      {routeName: 'AccessDash', name: '🛡️ Accès'},
      {routeName: 'EvenementDash', name: '📆 Evenements'},
      {routeName: 'HistoriqueDash', name: '🕵️‍♀️ Historique'},
      {routeName: 'EtudiantsDash', name: '👩‍🎓 Etudiants'},
      {routeName: 'DocumentsDash', name: '📜 Documents'},
      {routeName: 'TemoignageDash', name: '📜 Témoignages'},
      {routeName: 'Arbitrage', name: '🖥️ Arbitrage'},
      {routeName: 'AnciensDash', name: '👴 Anciens'},
  ]
  
  const routesDept = [
      {routeName: 'EtudiantsDash', name: '👩‍🎓 Etudiants'},
  ]
  
  const accountStore = useAccountStore();
  const access = accountStore.getAccessLevel();
  </script>