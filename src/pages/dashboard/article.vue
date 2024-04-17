<template>
<p class="text-xl font-bold">Articles</p>
        <div class="m-5">
            <p class="text-lg font-bold">Ajout article</p>
            <input type="text" placeholder="Titre" id="art_title">
            <input type="text" placeholder="Description" id="art_description">
            <label for="art_pin">Epinglé ?</label>
            <input id="art_pin" type="checkbox">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Ajouter l'article" @click="addArticle">
        </div>
        <div class="m-5">
            <p class="text-lg font-bold">Liste article</p>
            <div v-for="(article, index) in articles" :key="index" class="m-2 bg-slate-400 flex items-center justify-between">
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
                        <p class="hover:opacity-60 p-5 hover:cursor-pointer" @click="removeArticle(article.art_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.021 512.021" style="enable-background:new 0 0 512.021 512.021;" xml:space="preserve" width="32" height="32">
                                <g>
                                    <path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/>
                                </g>
                            </svg>
                        </p>
                    </div>
                </div>
        </div>
        {{ response }}
</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref } from 'vue';
    import config from '../../config';

    const response = ref([]);
    const articles = ref([]);

    async function addArticle(){
        const title = art_title.value;
        const description = art_description.value;
        const pinned = document.getElementById('art_pin').checked;

        const requestData = { art_title: title, art_description: description, art_pin: pinned };
        await request("POST", response, config.apiUrl+'article', requestData);
        fetchAll();
    }

    async function removeArticle(id){
        await request('DELETE', response, config.apiUrl+'article/deletebyid/'+id);
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', articles, config.apiUrl+'article');
    }

    onMounted(fetchAll);
</script>