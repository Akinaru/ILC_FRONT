<template>
    <div>
        <div class="flex py-3">
            <span v-if="access == 1" class=" ">
                <span class="flex md:flex-row flex-col *:p-2 *:mx-1 *:bg-base-300 *:drop-shadow-lg">
                    <RouterLink :to="{name: 'ArticleDash'}" :class="{ 'text-[#3f2ab4]': $route.name === 'ArticleDash' }">Article</RouterLink>
                    <RouterLink :to="{name: 'DepartementDash'}"  :class="{ 'text-[#3f2ab4]': $route.name === 'DepartementDash' }">Departement</RouterLink>
                    <RouterLink :to="{name: 'AccordDash'}"  :class="{ 'text-[#3f2ab4]': $route.name === 'AccordDash' }">Accord</RouterLink>
                    <RouterLink :to="{name: 'AccessDash'}"  :class="{ 'text-[#3f2ab4]': $route.name === 'AccessDash' }">Access</RouterLink>
                    <RouterLink :to="{name: 'HistoriqueDash'}"  :class="{ 'text-[#3f2ab4]': $route.name === 'HistoriqueDash' }">Historique</RouterLink>
                    <RouterLink :to="{name: 'EtudiantsDash'}"  :class="{ 'text-[#3f2ab4]': $route.name === 'EtudiantsDash' }">Etudiants</RouterLink>
                    <RouterLink :to="{name: 'ModifBaseDash'}" :class="{ 'text-[#3f2ab4]': $route.name === 'ModifBaseDash' }">Modif Base</RouterLink>
                </span>
            </span>
            <span v-else-if="access == 2">
                <!-- Departement -->
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

    const accountStore = useAccountStore();
    const { access } = storeToRefs(accountStore)

</script>