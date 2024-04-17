<template>
    <div>
        <p>Dashboard</p>
        <div class="m-5 flex">
            <RouterLink :to="{name: 'ArticleDash'}" class="m-3 p-3 bg-slate-400">Article</RouterLink>
            <RouterLink :to="{name: 'ComposanteDash'}" class="m-3 p-3 bg-slate-400">Composante</RouterLink>
            <RouterLink :to="{name: 'ParametresDash'}" class="m-3 p-3 bg-slate-400">Parametres</RouterLink>
            <RouterLink :to="{name: 'ModifBaseDash'}" class="m-3 p-3 bg-slate-400">Modif Base</RouterLink>
        </div>
        <RouterView></RouterView>
    </div>
</template>

<script setup>

</script>
