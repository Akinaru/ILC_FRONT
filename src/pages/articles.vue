<template>
 <div>
    <div v-if="isLoaded">
        <div class="text-sm breadcrumbs font-bold">
                <ul>
                    <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li>
                    <li>Articles</li>
                </ul>
            </div>
        <p class="flex justify-center items-center font-bold text-xl py-5">Liste des articles</p>
        <div v-if="articles && articles.articles" class="flex justify-center items-center flex-col py-5">
            <div v-if="articles.count > 0" class="flex flex-wrap justify-center w-full bg-red-105 gap-5">
                <RouterLink v-for="(article, index) in articles.articles" :key="index" :to="{name: 'Article', params: {art_id: article.art_id}}" class="rounded-lg relative bg-base-300 w-80 md:w-110 h-96 transition-all duration-100 ease-in-out drop-shadow-lg hover:scale-105">
                    <div :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl+'images/no_image.jpg'})` }" class="bg-cover bg-center w-full h-48"></div>
                    <span v-if="article.art_pin" class="badge badge-primary absolute top-1 left-1">📌Épinglé</span>
                    <div class="p-4 flex flex-col justify-start h-52">
                        <div class="mb-2">
                            <p class="font-bold text-xl">{{ article.art_title }}</p>
                            <p class="text-gray-600 text-sm">Dernière modif: {{ article.art_lastmodif }}</p>
                        </div>
                        <p class="overflow-hidden text-sm text-gray-700 max-h-24">{{ article.art_description }}{{ article.art_description }}</p>
                    </div>
                </RouterLink>
            </div>
            <div v-else class="m-5">
                <p>Aucun article n'a été trouvé.</p>
            </div>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
 </div>
</template>

<script setup>

    import LoadingComp from '../components/utils/LoadingComp.vue';
import { request } from '../composables/httpRequest';
    import config from '../config';
    import { onMounted, ref } from 'vue';

    const articles = ref([])
    const isLoaded = ref(false)

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, articles, config.apiUrl+'api/article');
        isLoaded.value = true;
    }

    onMounted(fetch)

</script>
