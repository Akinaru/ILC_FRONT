<template>
    <div>
        <div class="flex py-3">
    <span v-if="access == 1">
        <span class="flex flex-wrap *:p-2 *:mx-1 *:bg-base-300 *:drop-shadow-lg mb-4">
            <RouterLink 
                v-for="route in routesRi" 
                :key="route.routeName" 
                :to="{name: route.routeName}" 
                :class="{ 'border-b-2 border-current text-[#3f2ab4]': $route.name === route.routeName }" 
                class="hover:opacity-60 transition-opacity m-1 select-none">
                {{ route.name }}
            </RouterLink>
        </span>
    </span>
    <span v-else-if="access == 2">
        <span class="flex flex-wrap md:flex-row flex-col *:p-2 *:mx-1 *:bg-base-300 *:drop-shadow-lg mb-4">
            <RouterLink 
                v-for="route in routesDept" 
                :key="route.routeName" 
                :to="{name: route.routeName}" 
                :class="{ 'border-b-2 border-current text-[#3f2ab4]': $route.name === route.routeName }" 
                class="hover:opacity-60 transition-opacity">
                {{ route.name }}
            </RouterLink>
        </span>
    </span>
    <span v-else>
        <!-- Etu -->
    </span>
</div>
        <!-- Affichage du contenu du dashboard -->
        <RouterView></RouterView>
    </div>
</template>

<script setup>
    import { useAccountStore } from '../stores/accountStore';
    import { storeToRefs } from 'pinia'

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
        {routeName: 'Arbitrage', name: '🖥️ Arbitrage'},
    ]

    const routesDept = [
        {routeName: 'HomeDept', name: '🏠 Accueil'},
        {routeName: 'EtudiantsDash', name: '👩‍🎓 Etudiants'},
    ]

    const accountStore = useAccountStore();
    const { access } = storeToRefs(accountStore)

</script>