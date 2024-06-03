<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
            <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
        </ul>
    </div>
    <div class="m-5" v-if="account && account.acc_id">
    <p class="text-lg font-semibold">Liste des étudiants <span v-if="account.access.acs_accounttype == 2">dans le département <span :style="{color: account.department.dept_color}">{{ account.department.dept_shortname }}</span></span>:</p>
    <div v-if="etudiants && etudiants.accounts" class="flex flex-wrap gap-5 items-center justify-center">
        <div v-for="(etu, index) in etudiants.accounts" :key="index">
            <template  class="w-full md:w-1/3 lg:w-1/4 py-2" v-if="!etu.access">
                <RouterLink  :to="{ name: 'Profile', params: { acc_id: etu.acc_id }}">
                    <div class="bg-base-300 shadow-lg rounded-lg p-4 hover:scale-105 transform transition-transform duration-200 h-full flex flex-col">
                        <div class="flex-1">
                            <h5 class="text-xl font-bold mb-2 truncate">{{ etu.acc_fullname }}</h5>
                            <h6 class="text-gray-600 mb-2 truncate">{{ etu.acc_id }} <span :style="{color: etu.department.dept_color}" v-if="etu.department">({{ etu.department.dept_name }})</span><span v-else>(Aucun département)</span></h6>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-700">
                                <strong>Nombre de vœux:</strong> {{ etu.wishes ? etu.wishes.count : 0 }}<br>
                                <strong>Dernière connexion:</strong> {{ etu.acc_lastlogin }}
                            </p>
                        </div>
                    </div>
                </RouterLink>
            </template>
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