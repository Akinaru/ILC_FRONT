<template>
    <div class="m-5 flex justify-center items-center flex-col pt-72">
        <p class="text-2xl font-bold">Redirection en cours...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authLogAccount } from '../composables/authGuard';
import { useRouter } from 'vue-router';
import { request } from '../composables/httpRequest';
import config from '../config';
import { addAlert } from '../composables/addAlert';
import { useAccountStore } from '../stores/accountStore';

const router = useRouter();
const login = ref(null);
const auth = ref(null);
const acceptedResponse = ref([])
const accessResponse = ref([])
const accountStore = useAccountStore();

onMounted(() => {

    // Récupérer les valeurs de localStorage
    login.value = localStorage.getItem('login');
    auth.value = localStorage.getItem('auth');
    if(auth.value == 'success'){
        loginUser();
        
    }else{
        if(accountStore.isLogged()){
            router.push({ name: 'Dashboard' });
        }else{
            router.push({ name: 'Accueil' });
        }
    }

});

async function loginUser() {

    try {
        
        await request('GET', false, acceptedResponse, config.apiUrl + 'api/acceptedaccount/getbylogin/' + login.value);
        await request('GET', false, accessResponse, config.apiUrl + 'api/access/getbylogin/' + login.value);

        // Vérifie si le login est accepté dans l'une des deux listes
        const isLoginAccepted = acceptedResponse.value && acceptedResponse.value.account;
        const isLoginAccess = accessResponse.value && accessResponse.value.access;

        if (isLoginAccepted || isLoginAccess) {
            await authLogAccount(login.value, router);
        } else {
            addAlert('error', { data: { error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.' } });
            router.push({ name: 'Accueil' });
        }
    } catch (error) {
        addAlert('error', { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: error.message } });
        router.push({ name: 'Accueil' });
    } 
}

</script>

<style scoped>
/* Ajoutez votre style ici si nécessaire */
</style>
