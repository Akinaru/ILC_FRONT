<template>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col pt-72" >
                <p class="text-lg font-bold">Connexion</p>
                <form @submit.prevent="login" class="w-fit *:my-2">
                    <input type="text" placeholder="Login" v-model="newLogin.login" class="input input-bordered w-full " />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { authLogAccount } from '../composables/authGuard'
    import { useRouter } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
import { addAlert } from '../composables/addAlert';

    const router = useRouter();
    const newLogin = ref({ login: ''});
    const accepted = ref([]);
    const access = ref([]);
    const tryToLogin = ref(false);

    async function fetch(){
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        await request('GET', false, access, config.apiUrl+'api/access');
    }

    async function login() {
        tryToLogin.value = true;
        if (accepted.value.count > 0 && newLogin.value.login !== null) {
            const isLoginAccepted = accepted.value.accounts.some(account => account.acc_id === newLogin.value.login);
            const isLoginAcceptedAccess = access.value.access.some(account => account.acc_id === newLogin.value.login);
            
            if (isLoginAccepted || isLoginAcceptedAccess) {
                await authLogAccount(newLogin.value.login, router);
            } else {
                addAlert(true, {data: {error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.'}});
            }
        } else {
            addAlert(true, {data: {error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.'}});
        }
        tryToLogin.value = false;
    }

    onMounted(fetch)
</script>
