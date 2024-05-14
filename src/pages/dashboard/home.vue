<template>
    <div class="m-5">
         <div v-if="accountStore.access == 2 && account && account.department">
            <p>Bienvenue {{ account.acc_fullname }}. Vous êtes le résponsable du département: {{ account.department.dept_shortname }}</p>
            <p>Liste des étudiants:</p>
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
    const { login } = storeToRefs(accountStore)

    const account = ref([]);

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login);
    }

    onMounted(fetch)

</script>