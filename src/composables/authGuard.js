import { request } from "./httpRequest";
import { decomposeDN } from '../composables/destructLDAP';
import { ref } from 'vue';
import { useAccountStore } from "../stores/accountStore";
import config from '../config';

export async function authLogAccount(login, router) {
    const response = ref([]);
    await request('GET', false, response, config.apiUrl + 'api/account/getbylogin/' + login);
    if (response.value.response && response.value.response.status == 404) {
        await authRegisterAccount(login, router);
        router.push({ name: 'Dashboard' });
    } else {
        const requestData = {
            acc_id: response.value.acc_id,
            acc_fullname: response.value.acc_fullname
        };
        authStoreUser(requestData);
        router.push({ name: 'Dashboard' });
    }
}

async function authRegisterAccount(login, router) {
    const decomposedInfo = ref([]);
    const response = ref([]);
    await request('GET', true, response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login=' + login);
    decomposedInfo.value = decomposeDN(login, response.value[0].dn);
    const requestData = {
        acc_id: decomposedInfo.value.login,
        acc_fullname: decomposedInfo.value.fullname
    };

    await request('POST', true, response, config.apiUrl + 'api/account', requestData);
    if (response.value.status && response.value.status == 201) {
        authStoreUser(requestData);
    }
}

function authStoreUser(data) {
    const accountStore = useAccountStore();
    accountStore.loginAccount(data.acc_id, data.acc_fullname);
}
