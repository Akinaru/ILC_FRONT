import { request } from "./httpRequest";
import { decomposeDN } from '../composables/destructLDAP';
import { ref } from 'vue';
import { useAccountStore } from "../stores/accountStore";
import config from '../config';
import { addAlert } from '../composables/addAlert';

export async function authLogAccount(login, router) {
    const response = ref([]);
    await request('GET', false, response, config.apiUrl + 'api/account/getbylogin/' + login);
    if (response.value && response.value.status == 404) {
        await authRegisterAccount(login, router);
    } else {
        await request('PUT', false, response, config.apiUrl+'api/account/login/'+login)
        
        var requestData = {
            acc_id: response.value.acc_id,
            acc_fullname: response.value.acc_fullname,
            acc_lastlogin: response.value.acc_lastlogin,
            acc_validateacc: response.value.acc_validateacc
        };
        await request('GET', false, response, config.apiUrl+'api/access/getbylogin/'+login);
        if(response.value.count == 1){
            requestData.acc_access = response.value.access.acs_accounttype;
        }
        else{
            requestData.acc_access = 0;
        }
        authStoreUser(requestData);
        router.push({ name: 'Dashboard' });
        
    }
}

async function authRegisterAccount(login, router) {
    // Récupération des informations de l'utilisateur depuis le LDAP
    const decomposedInfo = ref([]);
    const response = ref([]);

    try {
        await request('GET', false, response, 'https://srv-peda.iut-acy.local/ldama/ldap/?login=' + login);
        if(!response.value.count || response.value.count == 0 ){
            addAlert('error', { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: "Impossible de récupérer les informations de l'utilisateur." } });
            router.push({ name: 'Accueil' });
            return
        }
        decomposedInfo.value = decomposeDN(login, response.value[0].dn);

        // Création de l'utilisateur dans la base
        const requestData = {
            acc_id: decomposedInfo.value.login,
            acc_fullname: decomposedInfo.value.fullname,
        };
        await request('POST', false, response, config.apiUrl + 'api/account', requestData);

        if (response.value.status && response.value.status === 201) {
            const userData = {
                acc_id: response.value.account.acc_id,
                acc_fullname: response.value.account.acc_fullname,
                acc_lastlogin: response.value.account.acc_lastlogin,
                acc_validateacc: response.value.account.acc_validateacc,
                acc_access: response.value.access
            };

            authStoreUser(userData);
            router.push({ name: 'Dashboard' });
        }
    } catch (error) {
        console.error("Une erreur est survenue (register_acc_auth):", error);
        // Vous pouvez également afficher un message d'erreur à l'utilisateur ici
        addAlert('error', { data: { error: 'Une erreur s\'est produite lors de la connexion.', message: error.message } });
        router.push({ name: 'Accueil' });
        return

    }
}


function authStoreUser(data) {
    const accountStore = useAccountStore();
    accountStore.loginAccount(data);
}
