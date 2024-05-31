<template>
    <div class="m-5">
        <div v-if="article && article.art_id">
            <p class="text-2xl">{{ article.art_title }}</p>
            <div id="description" v-html="article.art_description"></div>
            <img class="w-96" :src="config.apiUrl+'api/article/image/'+article.art_id" alt="">
        </div>
        <div v-else>
            <p class="flex font-bold items-center justify-center py-64">Article introuvable...</p>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
 
    const route = useRoute();
    const art_id = route.params.art_id;
    const article = ref([]);

    async function fetchAll(){
        await request('GET', false, article, config.apiUrl+'api/article/getbyid/'+art_id);
    }

    onMounted(fetchAll)

</script>