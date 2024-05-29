<template>
    <div class="">
        <div class="text-sm breadcrumbs py-5">
            <ul>
                <li class="font-bold text-sm ">Dashboard</li> 
            </ul>
        </div>
         <div v-if="accountStore.access == 2 && account && account.department">
            <p>Bienvenue {{ account.acc_fullname }}. Vous êtes le responsable du département: {{ account.department.dept_shortname }}</p>
            <p>Liste des étudiants ({{ students.count }}):</p>
            <div class="flex flex-col w-96">
                <RouterLink v-for="(stud, index) in students.accounts" :key="index" class="btn my-1" :to="{name: 'Profile', params: {acc_id: stud.acc_id}}">
                    <p>{{ stud.acc_fullname }} ({{ stud.acc_id }})</p>
                </RouterLink>
            </div>
         </div>
         <div v-else>
            <p>Vous n'avez été attribué à aucun département. Veuillez vous référer au service des relations internationales.</p>
         </div>
    </div>

</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useAccountStore } from '../../stores/accountStore';    
    import { request } from '../../composables/httpRequest';
    import config from '../../config';


    const accountStore = useAccountStore();

    const students = ref([]);
    const account = ref([]);

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login);
        if(account.value.department != null){
            await request('GET', false, students, config.apiUrl+'api/account/getbydept/'+account.value.department.dept_id);
        }
    }

    onMounted(fetch)

</script>