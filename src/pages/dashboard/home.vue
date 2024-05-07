<template>
    <div class="m-5">
        <p>Bienvenue sur votre accès personnel. Veuillez remplir les informations ci-dessous pour compléter votre dossier étudiant lié aux relations internationales.</p>
        {{ accountStore }}
    </div>


    <div class="flex items-center justify-center">
        <button @click="logout" class="btn btn-error" type="submit">Se déconnecter</button>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useAccountStore } from '../../stores/accountStore';
    import { storeToRefs } from 'pinia'
    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';


    const router = useRouter();
    const accountStore = useAccountStore();
    const { login } = storeToRefs(accountStore)
    const response = ref([]);
    const access = ref([]);
    
    function logout(){
        accountStore.logoutAccount();
        router.push({ name: 'Login' });
    }

    async function fetch(){
        await request('GET', false, response, config.apiUrl+'api/access/getbylogin/'+login.value);
        if(response.value.count == 1){
            access.value = response.value.access;
            accountStore.setAccess(access.value.acs_accounttype);
        }
    }
    
    onMounted(fetch)

</script>