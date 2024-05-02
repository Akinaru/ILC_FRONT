import { request } from "./httpRequest";
import {decomposeDN} from '../composables/destructLDAP'
import { ref } from 'vue';
import config from '../config';

export async function authLogAccount(login){
    const response = ref([]);
    await request('GET', false, response, config.apiUrl+'api/account/getbylogin/'+login);
    if(response.value.response && response.value.response.status == 404){
        console.log("auth: Compte non trouvé");
        authRegisterAccount(login);
    }else{
        console.log("auth: Compte trouvé");
    }
}

async function authRegisterAccount(login){
    const decomposedInfo = ref([]);
    const response = ref([]);
    await request('GET', true, response, 'http://srv-peda.iut-acy.local/ldama/ldap/?login='+login);
    decomposedInfo.value = decomposeDN(login, response.value[0].dn);
    const requestData = {
        acc_id: decomposedInfo.value.login,
        acc_fullname: decomposedInfo.value.fullname
    }
    // console.log(requestData)
    await request('POST', true, response, config.apiUrl+'api/account', requestData)
}