<template>
    <div>
        <div>
            <p class="text-2xl font-bold">Les accords</p>
            <div class="m-5">
                <ul v-for="(accord, index) in accords" :key="index" class="bg-base-300 m-2 *:list-disc">
                    <li>{{ accord.university.univ_name }} ({{ accord.university.univ_city }})</li>
                    <li>{{ accord.isced.isc_code }} {{ accord.isced.isc_name }}</li>
                    <li>{{ accord.component.comp_name }}</li>
                    <li>
                        <ul>
                            <p>Les departements:</p>
                            <li v-for="(dept,index) in accord.departments" class="list-disc mx-6" :key="index" :style="{ color: dept.pivot.deptagree_valide === 0 ? 'red' : '' }">{{ dept.dept_name }} ({{ dept.dept_shortname }}) - Validé par dep: {{ dept.pivot.deptagree_valide === 1 ? 'Oui' : 'Non' }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>

        <div>
            <p class="text-2xl font-bold">Espace communication</p>
            <div class="m-5">
                <p class="text-xl font-bold">Articles</p>
                <div class="flex flex-col">
                    <RouterLink v-for="(article, index) in articles" :key="index" :to="{name: 'Article', params: {art_id: article.art_id}}">
                        <ArticleComp :article="article" class="my-1"></ArticleComp>
                    </RouterLink>
                </div>
                <p class="text-xl font-bold">Agenda</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import { request } from '../composables/httpRequest';
    import config from '../config';

    import ArticleComp from '../components/index/ArticleComp.vue';

    const articles = ref([]);
    const accords = ref([]);

    async function fetchAll(){
        await request('GET', articles, config.apiUrl+'api/article')
        await request('GET', accords, config.apiUrl+'api/agreement')
    }

    onMounted(fetchAll)

</script>