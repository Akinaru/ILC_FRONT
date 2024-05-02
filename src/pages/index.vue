<template>
    <div>
        <div>
            <p class="text-2xl font-bold">Les accords</p>
            <div class="m-5">
                <div v-if="accords && accords.agreements">

                    <ul v-if="accords && accords.count > 0" v-for="(accord, index) in accords" :key="index" class="bg-base-300 m-2 *:list-disc">
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
                    <div v-else>
                        <p>Aucun accord n'a été trouvé.</p>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center my-20">
                    <span class="loading loading-dots loading-lg"></span>
                </div>
            </div>
        </div>

        <div>
            <p class="text-2xl font-bold">Espace communication</p>
            <div class="m-5">
                <p class="text-xl font-bold">Articles</p>
                <div v-if="articles && articles.articles">
                    <div class="flex flex-col" v-if="articles && articles.count > 0">
                        <RouterLink  v-for="(article, index) in articles.articles" :key="index" :to="{name: 'Article', params: {art_id: article.art_id}}">
                            <ArticleComp :article="article" class="my-1"></ArticleComp>
                        </RouterLink>
                    </div>
                    <div v-else>
                        <p>Aucun article n'a été trouvé.</p>
                    </div>
                </div>
                <div v-else class="flex items-center justify-center my-20">
                    <span class="loading loading-dots loading-lg"></span>
                </div>
                <p class="text-xl font-bold">Agenda</p>
                <div >
                    <p>Aucun agenda n'a été trouvé.</p>
                </div>
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
        await request('GET', false, articles, config.apiUrl+'api/article')
        await request('GET', false, accords, config.apiUrl+'api/agreement')
    }

    onMounted(fetchAll)

</script>