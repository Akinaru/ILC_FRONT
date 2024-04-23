<template>
    <div>
        <p class="text-xl font-bold">Articles</p>

        <!-- Formulaire d'ajout d'article -->
        <div class="m-5">
            <p class="text-lg font-bold">Ajout article</p>
            <form @submit.prevent="addArticle">
                <input type="text" placeholder="Titre" v-model="newArticle.title">
                <input type="text" placeholder="Description" v-model="newArticle.description">
                <label for="art_pin">Epinglé ?</label>
                <input id="art_pin" type="checkbox" v-model="newArticle.pinned">
                <button class="bg-base-200 p-5 m-1" type="submit">Ajouter l'article</button>
            </form>
        </div>

        <div class="m-5">
            <p class="text-lg font-bold">Liste article</p>
            <div v-for="(article, index) in articles" :key="index" class="m-2 bg-base-300 flex items-center justify-between">
                    <div class="w-full">
                        <p v-if="article.art_pin" class="">
                            <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Epingle</span>
                        </p>
                        <div class="flex justify-between items-center">
                            <p class="text-lg font-bold">{{ article.art_title }}</p>
                            <p>{{ article.art_datetime }}</p>
                            
                        </div>
                        <p>{{ article.art_description }}</p>
                    </div>
                    <div>
                        <p class="hover:opacity-60 p-5 hover:cursor-pointer" @click="removeArticle(article.art_id)">X</p>
                    </div>
                </div>
            </div>
            {{ response }}
    </div>
</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref } from 'vue';
    import config from '../../config';

    const response = ref([]);
    const articles = ref([]);
    const newArticle = ref({ title: '', description: '', pinned: false });

    async function addArticle(){
        const requestData = { 
            art_title: newArticle.value.title,
            art_description: newArticle.value.description,
            art_pin: newArticle.value.pinned 
        };
        await request("POST", response, config.apiURL+'api/article', requestData);

        await fetchAll();

        newArticle.value.title = '';
        newArticle.value.description = '';
        newArticle.value.pinned = false;

    }

    async function removeArticle(id){
        await request('DELETE', response, config.apiURL+'api/article/deletebyid/'+id);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', articles, config.apiURL+'api/article');
    }

    onMounted(fetchAll);
</script>
