<template>
    <div class="m-5">
        <div class="m-5 flex justify-center items-center flex-col pt-72">
            <p class="text-lg font-bold">Connexion</p>
            <form @submit.prevent="login" class="w-fit *:my-2">
                <input type="text" placeholder="Login" v-model="newLogin.login" class="input input-bordered w-full" />
                <div class="flex items-center justify-center">
                    <button class="btn btn-primary" type="submit">Se connecter</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { authLogAccount } from '../composables/authGuard';
import { useRouter } from 'vue-router';
import { request } from '../composables/httpRequest';
import config from '../config';
import { addAlert } from '../composables/addAlert';

const router = useRouter();
const newLogin = ref({ login: '' });
const tryToLogin = ref(false);
const acceptedResponse = ref([])
const accessResponse = ref([])


async function login() {
    tryToLogin.value = true;
    if (newLogin.value.login) {
        try {
            // Effectue des requêtes pour vérifier si le login existe dans acceptedaccount ou access
            await request('GET', false, acceptedResponse, config.apiUrl+ 'api/acceptedaccount/getbylogin/'+newLogin.value.login),
            await request('GET', false, accessResponse, config.apiUrl+'api/access/getbylogin/'+newLogin.value.login)

            // Vérifie si le login est accepté dans l'une des deux listes
        
            const isLoginAccepted = acceptedResponse.value && acceptedResponse.value.account;
            const isLoginAccess = accessResponse.value && accessResponse.value.access;

            if (isLoginAccepted || isLoginAccess) {
                await authLogAccount(newLogin.value.login, router);
            } else {
                addAlert(true, { data: { error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.' } });
            }
        } catch (error) {
            addAlert(true, { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: error.message } });
            console.log(error)
        }
    } else {
        addAlert(true, { data: { error: 'Vous devez entrer un login.', message: 'Veuillez saisir votre identifiant de connexion.' } });
    }
    tryToLogin.value = false;
}
</script>
