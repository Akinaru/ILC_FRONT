<template>
    <div class="relative" v-if="isLoaded">
        <div v-if="article && article.art_id">
            <div class="text-sm breadcrumbs font-bold">
                <ul>
                    <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li>
                    <li><RouterLink :to="{name: 'Articles'}">Articles</RouterLink></li>
                    <li>{{ article.art_title }}</li>
                </ul>
            </div>
            <div class="block md:flex">
                <div class="w-full md:w-2/3 mr-2">
                    <div class="mb-2">
                        <p class="font-bold text-3xl">{{ article.art_title }}</p>
                        <p class="text-gray-600 text-md">Dernière modif: {{ article.art_lastmodif }}</p>
                    </div>
                    <div id="description" v-html="article.art_description"></div>
                </div>
                <div class="w-full md:w-1/3 flex items-start justify-center md:py-0 py-10">
                    <img class="sticky top-0 w-full md:w-auto md:max-w-full" :src="article.art_image ? config.apiUrl+'api/article/image/'+article.art_id : config.apiUrl+'images/no_image.jpg'" alt="">
                </div>
            </div>
        </div>
        <div v-else>
            <p class="flex font-bold items-center justify-center py-64">Article introuvable...</p>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import LoadingComp from '../components/utils/LoadingComp.vue';
 
    const route = useRoute();
    const art_id = route.params.art_id;
    const article = ref([]);
    const isLoaded = ref(false);

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, article, config.apiUrl+'api/article/getbyid/'+art_id);
        document.title = `ILC - ${article.value.art_title}`
        isLoaded.value = true;
    }

    onMounted(fetchAll)

</script>