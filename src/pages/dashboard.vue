<template>
    <div>
        <p>Dashboard</p>
        <div class="m-5 flex">
            <RouterLink :to="{name: 'ArticleDash'}" class="m-3 p-3 bg-base-300">Article</RouterLink>
            <RouterLink :to="{name: 'DepartementDash'}" class="m-3 p-3 bg-base-300">Departement</RouterLink>
            <RouterLink :to="{name: 'ComposanteDash'}" class="m-3 p-3 bg-base-300">Composante</RouterLink>
            <RouterLink :to="{name: 'AccordDash'}" class="m-3 p-3 bg-base-300">Accord</RouterLink>
            <RouterLink :to="{name: 'IscedDash'}" class="m-3 p-3 bg-base-300">Isced</RouterLink>
            <RouterLink :to="{name: 'ParametresDash'}" class="m-3 p-3 bg-base-300">Parametres</RouterLink>
            <RouterLink :to="{name: 'ModifBaseDash'}" class="m-3 p-3 bg-base-300">Modif Base</RouterLink>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script setup>

</script>
