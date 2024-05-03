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

                <p class="text-lg font-bold">Recherche login</p>
                <form @submit.prevent="searchUser" class="w-fit *:my-2">
                    <input type="text" placeholder="Login" v-model="name" class="input input-bordered w-full " />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Rechercher</button>
                    </div>
                </form>
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
    import {decomposeDN} from '../composables/destructLDAP'
    import { authLogAccount } from '../composables/authGuard'
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const newLogin = ref({ login: 'gallottm', password: '' });
    const response = ref([]);
    const name = ref("");
    const decomposedInfo = ref(null);

    const validLogin = ['gallottm', 'ldama', 'martmate'];

    async function login() {
        if (newLogin.value.login !== null && validLogin.includes(newLogin.value.login)) {
            await authLogAccount(newLogin.value.login, router);
        } else {
            console.log("Le login n'est pas valide.");
        }
    }


    async function searchUser() {
        if(name.value.trim() !== "") {
            await request('GET', true, response, `http://srv-peda.iut-acy.local/ldama/ldap/?login=${name.value.trim()}`);
            decomposedInfo.value = decomposeDN(name.value.trim(), response.value[0].dn);
        }
    }
    async function fetch(){
        name.value = 'ldama';
        searchUser();
    }
    onMounted(fetch);
</script>
