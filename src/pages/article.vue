<template>
    <div class="m-5">
        <div v-if="art_id">
            <p class="text-2xl">{{ article.art_title }}</p>
            <pre>{{ article.art_description }}</pre>
            <img class="w-96" :src="config.apiUrl+'api/article/image/'+article.art_id" alt="">
        </div>
        <div v-else>
            <p>Cet article n'existe pas.</p>
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
        await request('GET', article, config.apiUrl+'api/article/getbyid/'+art_id);
    }

    onMounted(fetchAll)

</script>