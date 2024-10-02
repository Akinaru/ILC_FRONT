<template>
    <div class="m-5 flex justify-center items-center flex-col pt-72">
        <p class="text-lg font-bold">Connexion</p>
        <p v-if="login">Login: {{ login }}</p>
        <p v-if="auth">Auth: {{ auth }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authLogAccount } from '../composables/authGuard';
import { useRouter } from 'vue-router';
import { request } from '../composables/httpRequest';
import config from '../config';
import { addAlert } from '../composables/addAlert';

const router = useRouter();
const login = ref(null);
const auth = ref(null);
const acceptedResponse = ref([])
const accessResponse = ref([])

onMounted(() => {
    // Récupérer les valeurs de localStorage
    login.value = localStorage.getItem('login');
    auth.value = localStorage.getItem('auth');
    if(auth.value == 'success'){

        loginUser();
    }

});

async function loginUser() {
    try {
        // Effectue des requêtes pour vérifier si le login existe dans acceptedaccount ou access
        await request('GET', false, acceptedResponse, config.apiUrl + 'api/acceptedaccount/getbylogin/' + login.value);
        await request('GET', false, accessResponse, config.apiUrl + 'api/access/getbylogin/' + login.value);

        // Vérifie si le login est accepté dans l'une des deux listes
        const isLoginAccepted = acceptedResponse.value && acceptedResponse.value.account;
        const isLoginAccess = accessResponse.value && accessResponse.value.access;

        if (isLoginAccepted || isLoginAccess) {
            await authLogAccount(login.value, router);
        } else {
            addAlert('error', { data: { error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.' } });
            router.push({ name: 'Accueil' }); // Redirection vers l'accueil
        }
    } catch (error) {
        addAlert('error', { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: error.message } });
        console.log(error);
        router.push({ name: 'Accueil' }); // Redirection vers l'accueil en cas d'erreur
    }
}
</script>

<style scoped>
/* Ajoutez votre style ici si nécessaire */
</style>
