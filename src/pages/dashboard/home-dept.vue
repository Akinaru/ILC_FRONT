<template>
    <div class="">
        <div class="text-sm breadcrumbs py-5">
            <ul>
                <li class="font-bold text-sm ">Dashboard</li> 
            </ul>
        </div>
         <div v-if="accountStore.access == 2 && account && account.department">
            <p>Bienvenue {{ account.acc_fullname }}. Vous êtes le responsable du département: <span class="p-3" :style="{backgroundColor: account.department.dept_color}">{{ account.department.dept_shortname }}</span></p>
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

    const account = ref([]);

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login);
    }

    onMounted(fetch)

</script>