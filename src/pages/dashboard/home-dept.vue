<template>
    <div class="m-5">
         <div v-if="accountStore.access == 2 && account && account.department">
            <p>Bienvenue {{ account.acc_fullname }}. Vous êtes le résponsable du département: {{ account.department.dept_shortname }}</p>
            <p>Liste des étudiants ({{ students.count }}):</p>
            <div v-for="(stud, index) in students.accounts" :key="index">
                <RouterLink :to="{name: 'Profile', params: {acc_id: stud.acc_id}}"><p>{{ stud.acc_fullname }} ({{ stud.acc_id }})</p></RouterLink>
            </div>
         </div>
    </div>

</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useAccountStore } from '../../stores/accountStore';    
    import { storeToRefs } from 'pinia'
    import { request } from '../../composables/httpRequest';
    import config from '../../config';


    const accountStore = useAccountStore();

    const students = ref([]);
    const account = ref([]);

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login);
        await request('GET', false, students, config.apiUrl+'api/account/getbydept/'+account.value.department.dept_id);
    }

    onMounted(fetch)

</script>