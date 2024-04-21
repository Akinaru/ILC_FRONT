<template>
    <div>
        <div>
            <p>Les accords</p>
            <div class="m-5">
                <div v-for="(accord, index) in accords" :key="index">
                    <p>{{ accord }}</p>
                </div>
            </div>
        </div>

        <div>
            <p>Espace communication</p>
            <div class="m-5">
                <p>Articles</p>
                <div v-for="(article, index) in articles" :key="index" class="m-2 bg-slate-400">
                    <p v-if="article.art_pin" class="">
                        <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Epingle</span>
                    </p>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold">{{ article.art_title }}</p>
                        <p>{{ article.art_datetime }}</p>

                    </div>
                    <p>{{ article.art_description }}</p>
                </div>
                <p>Agenda</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import { request } from '../composables/httpRequest';
    import config from '../config';

    const articles = ref([]);
    const accords = ref([]);

    async function fetchAll(){
        await request('GET', articles, config.apiUrl+'article')
        await request('GET', accords, config.apiUrl+'agreement')
    }

    onMounted(fetchAll)

</script>