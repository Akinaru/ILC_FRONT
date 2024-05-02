<template>
    <div class="min-h-screen min-w-screen">
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col" >
                <p class="text-lg font-bold">Connexion</p>
                <form @submit.prevent="login" class="w-fit *:my-2">
                    <input type="text" placeholder="Login" v-model="newLogin.login" class="input input-bordered w-full " />
                    <input type="password" placeholder="Mot de passe" v-model="newLogin.password" class="input input-bordered w-full" />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Se connecter</button>
                    </div>
                </form>

                <input type="text" v-model="name">
                <button @click="searchUser" class="btn btn-primary" type="button">Rechercher</button>
            </div>
        </div>
        <div v-if="decomposedInfo">
            <p>Full Name: {{ decomposedInfo.full_name }}</p>
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

    const router = useRouter();
    const newLogin = ref({ login: '', password: '' });
    const response = ref([]);
    const name = ref("");
    const decomposedInfo = ref(null);

    async function login(){
        if(newLogin.value.login !== null && newLogin.value.password !== null){
            const accountStore = useAccountStore();
            accountStore.loginAccount('gallottm', 'GALLOTTA-FLAMENT', 'Maxime');
            router.push({ name: 'Dashboard' });
        }
    }

    async function fetch(){
        await request('GET', response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login=ldama');
        decomposedInfo.value = decomposeDN(response.value[0].dn);
    }



    async function searchUser() {
        if(name.value.trim() !== "") {
            // Send a request with the entered name as a parameter
            await request('GET', response, `http://srv-peda.iut-acy.local/ldama/ldap/?login=${name.value.trim()}`);
            decomposedInfo.value = decomposeDN(response.value[0].dn);
        }
    }

    onMounted(fetch);
</script>
