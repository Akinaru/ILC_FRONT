<template>
    <div>
        <div class="m-5">
            <p class="text-xl font-bold">Modification de la base de données</p>
            <input type="text" placeholder="Mot de passe" v-model="password">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser la base" @click="resetMethod('all')">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser les actions" @click="resetMethod('action')">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Réinitialiser les articles" @click="resetMethod('t_e_article_art')">
        </div>
        <div class="m-5">
            <p class="text-xl font-bold">Ajout article</p>
            <input type="text" placeholder="Titre" id="art_title">
            <input type="text" placeholder="Description" id="art_description">
            <label for="art_pin">Epinglé ?</label>
            <input id="art_pin" type="checkbox">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Ajouter l'article" @click="addArticle">
        </div>
        {{ response }}  
    </div>
</template>

<script setup>
    import { request } from '../composables/httpRequest';
    import { ref } from 'vue';

    const response = ref([]);
    const password = ref('');

    async function resetMethod(who){
        await request("DELETE", response, `https://gallotta.fr/ILC/api/reset/${who}?password=${password.value}`);
    }
    async function addArticle(){
        const title = art_title.value;
        const description = art_description.value;
        const pinned = document.getElementById('art_pin').checked;

        const requestData = { art_title: title, art_description: description, art_pin: pinned };
        await request("POST", response, 'https://gallotta.fr/ILC/api/article', requestData);
    }

</script>
