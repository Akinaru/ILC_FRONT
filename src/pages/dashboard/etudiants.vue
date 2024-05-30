<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
            <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
        </ul>
    </div>
    <div class="m-5">
        <p>Liste des étudiants:</p>
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

    const etudiants = ref([])

    async function fetch(){
        await request('GET', false, etudiants, config.apiUrl+'api/account')
    }

    onMounted(fetch)

</script>