<template>
        <div class="m-5">
            <p class="text-xl font-bold">Modification de la base de données</p>
            <input type="text" placeholder="Mot de passe" v-model="password">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser la base" @click="resetMethod('all')">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser les actions" @click="resetMethod('action')">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser les articles" @click="resetMethod('t_e_article_art')">
        </div>
        
        {{ response }}  
</template>

<script setup>
    import { ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';


    const response = ref([]);
    const password = ref('');

    async function resetMethod(who){
        await request("DELETE", response, config.apiUrl+`reset/${who}?password=${password.value}`);
    }
</script>