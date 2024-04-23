<template>
    <div class="min-h-screen min-w-screen">
        <RouterLink :to="{name: 'Dashboard'}" class="p-3 bg-base-300">Dashboard</RouterLink>
    </div>
</template>


<script setup>

    import { request } from '../composables/httpRequest'
    import { ref } from 'vue';

    const user = ref([]);
    const login = ref('');

    async function fetchUser(){
        await request('GET', user, 'https://srv-peda.iut-acy.local/ldama/ldap/?login='+login.value)
    }

</script>