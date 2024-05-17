<template>
    <div>
        <div class="m-5 flex ">
            <span v-if="access == 1" class="flex md:flex-row flex-col">
                <RouterLink :to="{name: 'ArticleDash'}" class="md:m-3 m-1 md:p-3 bg-base-300" :class="{ 'current-link': $route.name === 'ArticleDash' }">Article</RouterLink>
                <RouterLink :to="{name: 'DepartementDash'}" class="md:m-3 m-1 md:p-3 bg-base-300" :class="{ 'current-link': $route.name === 'DepartementDash' }">Departement</RouterLink>
                <RouterLink :to="{name: 'AccordDash'}" class="md:m-3 m-1 md:p-3 bg-base-300" :class="{ 'current-link': $route.name === 'AccordDash' }">Accord</RouterLink>
                <RouterLink :to="{name: 'AccessDash'}" class="md:m-3 m-1 md:p-3 bg-base-300" :class="{ 'current-link': $route.name === 'AccessDash' }">Access</RouterLink>
                <RouterLink :to="{name: 'ModifBaseDash'}" class="md:m-3 m-1 md:p-3 bg-base-300" :class="{ 'current-link': $route.name === 'ModifBaseDash' }">Modif Base</RouterLink>
            </span>
            <span v-else-if="access == 2">
                <!-- Departement -->
            </span>
            <span v-else>
                <!-- Etu -->
            </span>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script setup>
    import { useAccountStore } from '../stores/accountStore';
    import { storeToRefs } from 'pinia'
    const accountStore = useAccountStore();
    const { fullname, login, access } = storeToRefs(accountStore)

</script>

<style scoped>
    .current-link {
        color: rgb(63, 42, 180);
    }
</style>