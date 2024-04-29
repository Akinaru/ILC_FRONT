<template>
    <div>
        <p class="text-2xl font-bold">Dashboard</p>
        <div class="m-5 flex flex-wrap">
            <RouterLink :to="{name: 'ArticleDash'}" class="m-3 p-3 bg-base-300" :class="{ 'current-link': $route.name === 'ArticleDash' }">Article</RouterLink>
            <RouterLink :to="{name: 'DepartementDash'}" class="m-3 p-3 bg-base-300" :class="{ 'current-link': $route.name === 'DepartementDash' }">Departement</RouterLink>
            <RouterLink :to="{name: 'AccordDash'}" class="m-3 p-3 bg-base-300" :class="{ 'current-link': $route.name === 'AccordDash' }">Accord</RouterLink>
            <RouterLink :to="{name: 'ModifBaseDash'}" class="m-3 p-3 bg-base-300" :class="{ 'current-link': $route.name === 'ModifBaseDash' }">Modif Base</RouterLink>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<style scoped>
    .current-link {
        color: rgb(63, 42, 180);
    }
</style>