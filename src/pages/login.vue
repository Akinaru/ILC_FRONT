<template>
    <div class="m-5 flex justify-center items-center flex-col pt-72">
        <p class="text-2xl font-bold">Redirection en cours...</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { authLogAccount, authRegisterAccount } from '../composables/authGuard';
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
const response = ref([])
const accountStore = useAccountStore();

onMounted(() => {
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
        // Appel API Laravel login

        await request('POST', false, response, config.apiUrl + 'api/login', {login: login.value});


        if(response.value.status != 404){
            //Le compte du user existe deja
            localStorage.setItem('token', response.value.token);


            await request('GET', false, acceptedResponse, config.apiUrl + 'api/acceptedaccount/getbylogin/' + login.value);
            await request('GET', false, accessResponse, config.apiUrl + 'api/access/getbylogin/' + login.value);

            const isLoginAccepted = acceptedResponse.value && acceptedResponse.value.account;
            const isLoginAccess = accessResponse.value && accessResponse.value.access;

            if (isLoginAccepted || isLoginAccess) {
                await authLogAccount(login.value, router);
            } else {
                addAlert('error', { data: { error: 'Vous n\'êtes pas autorisé à accéder à la partie connectée.', message: 'Veuillez vous renseigner auprès du service ILC.' } });
                router.push({ name: 'Accueil' });
            }
        }else{
            //Le compte du user n'existe pas
            await authRegisterAccount(login.value, router);
        }
    } catch (error) {
        addAlert('error', { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: error.message } });
        router.push({ name: 'Accueil' });
    } 
}
</script>