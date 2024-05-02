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
            </div>
        </div>
        {{ response }}
    </div>
</template>


<script setup>

    import { request } from '../composables/httpRequest'
    import { onMounted, ref } from 'vue';
    import { useAccountStore } from "../stores/accountStore";
    import { useRouter } from 'vue-router';
    import axios from 'axios'
    const router = useRouter();

    const newLogin = ref({ login: '', password: '' });

    async function login(){
        if(newLogin.value.login !== null && newLogin.value.password !== null){
            const accountStore = useAccountStore();
            accountStore.loginAccount('gallottm', 'GALLOTTA-FLAMENT', 'Maxime');
            
            router.push({ name: 'Dashboard' });
        }
    }

    const response = ref([]);

    async function fetch(){
        await request('GET', response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login=ldama');
    }

    onMounted(fetch)

</script>