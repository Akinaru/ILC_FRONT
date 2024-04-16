<template>
    <div class="min-h-screen min-w-screen">
        <RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink>
        <form @submit.prevent="fetchUser">
            <div>
                <input type="text" placeholder="login" v-model="login">
                <input type="submit">
            </div>
        </form>
        {{ user }}
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