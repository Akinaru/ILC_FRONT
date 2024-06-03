import { request } from "./httpRequest";
import { decomposeDN } from '../composables/destructLDAP';
import { ref } from 'vue';
import { useAccountStore } from "../stores/accountStore";
import config from '../config';
import { addAlert } from "./addAlert";

export async function authLogAccount(login, router) {
    const response = ref([]);
    await request('GET', false, response, config.apiUrl + 'api/account/getbylogin/' + login);
    if (response.value.response && response.value.response.status == 404) {
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
    const decomposedInfo = ref([]);
    const response = ref([]);
    await request('GET', true, response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login=' + login);
    decomposedInfo.value = decomposeDN(login, response.value[0].dn);
    var requestData = {
        acc_id: decomposedInfo.value.login,
        acc_fullname: decomposedInfo.value.fullname,
    };

    await request('POST', false, response, config.apiUrl + 'api/account', requestData);
    if (response.value.status && response.value.status == 201) {
        requestData = {
            acc_id: response.value.account.acc_id,
            acc_fullname: response.value.account.acc_fullname,
            acc_lastlogin: response.value.account.acc_lastlogin,
            acc_validateacc: response.value.account.acc_validateacc
        };

        authStoreUser(requestData);
        router.push({ name: 'Dashboard' });
    }
}

function authStoreUser(data) {
    const accountStore = useAccountStore();
    accountStore.loginAccount(data);
}
