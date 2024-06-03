<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
            <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
        </ul>
    </div>
    <div class="m-5" v-if="account && account.acc_id">
        <p>Liste des étudiants <span v-if="account.access.acs_accounttype ==2">dans le département {{ account.department.dept_shortname }}</span>:</p>
        <div v-if="etudiants && etudiants.accounts">
            <div v-for="(etu, index) in etudiants.accounts" :key="index">
                <RouterLink class="btn my-1" v-if="!etu.access" :to="{name: 'Profile', params: {acc_id: etu.acc_id}}">
                    <p><span class="font-bold">{{ etu.acc_fullname }}</span> <span v-if="etu.department">({{ etu.department.dept_name }})</span><span v-else>(Aucun departement)</span></p>
                </RouterLink>
            </div>
        </div>
    </div>

</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { ref, onMounted } from 'vue'
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';

    const accountStore = useAccountStore();
    const etudiants = ref([])
    const account = ref([])

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login);
        if(account.value.access != null && account.value.access.acs_accounttype == 1){
            await request('GET', false, etudiants, config.apiUrl+'api/account');
        }else if(account.value.access != null && account.value.department != null) {
            await request('GET', false, etudiants, config.apiUrl+'api/account/getbydept/'+account.value.department.dept_id);
        }
    }

    onMounted(fetch)

</script>