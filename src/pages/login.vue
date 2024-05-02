<template>
    <div class="min-h-screen min-w-screen">
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col" >
                <p class="text-lg font-bold">Connexion</p>
                <form @submit.prevent="login" class="w-fit *:my-2">
                    <input type="text" placeholder="Login" v-model="newLogin.login" class="input input-bordered w-full " />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Se connecter</button>
                    </div>
                </form>

                <input type="text" v-model="name">
                <button @click="searchUser" class="btn btn-primary" type="button">Rechercher</button>
            </div>
        </div>
        <div v-if="decomposedInfo">
            <p>Full Name: {{ decomposedInfo.fullname }}</p>
            <p>Status: {{ decomposedInfo.status }}</p>
            <p v-if="decomposedInfo.fonction">Function: {{ decomposedInfo.fonction }}</p>
            <p v-else>Function: N/A</p>
        </div>
    </div>
</template>

<script setup>
    import { request } from '../composables/httpRequest'
    import { onMounted, ref } from 'vue';
    import { useAccountStore } from "../stores/accountStore";
    import { useRouter } from 'vue-router';
    import {decomposeDN} from '../composables/destructLDAP'
    import config from '../config';
    import { authLogAccount } from '../composables/authGuard'

    const router = useRouter();
    const newLogin = ref({ login: 'gallottm', password: '' });
    const response = ref([]);
    const name = ref("");
    const decomposedInfo = ref(null);

    const validLogin = ['gallottm', 'ldama']

    async function login(){
        // if(newLogin.value.login !== null && newLogin.value.password !== null){
        //     const accountStore = useAccountStore();
        //     accountStore.loginAccount('gallottm', 'GALLOTTA-FLAMENT', 'Maxime');
        //     router.push({ name: 'Dashboard' });
        // }
        authLogAccount(newLogin.value.login);
        cc
    }

    async function fetch(){
        const login = 'ldama';
        await request('GET', true, response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login='+login);
        decomposedInfo.value = decomposeDN(login, response.value[0].dn);
    }



    async function searchUser() {
        if(name.value.trim() !== "") {
            // Send a request with the entered name as a parameter
            await request('GET', true, response, `http://srv-peda.iut-acy.local/ldama/ldap/?login=${name.value.trim()}`);
            decomposedInfo.value = decomposeDN(name.value.trim(), response.value[0].dn);
        }
    }

    onMounted(fetch);
</script>
