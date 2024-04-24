<template>
    <p>Bienvenue {{ prenom }} sur votre dashboard !</p>
    <div>
        {{ accountStore }}
    </div>


    <div class="flex items-center justify-center">
        <button @click="logout" class="btn btn-primary" type="submit">Se déconnecter</button>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    import { useAccountStore } from '../../stores/accountStore';
    import { storeToRefs } from 'pinia'
    const router = useRouter();

    const accountStore = useAccountStore();
    const { last_login, nom, prenom } = storeToRefs(accountStore)

    function logout(){
        const accountStore = useAccountStore();
        accountStore.logoutAccount();
        router.push({ name: 'Login' });
    }

</script>