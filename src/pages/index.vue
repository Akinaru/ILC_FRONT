<template>
    <div>
        <div>
            <p class="text-2xl font-bold">Les accords</p>
            <div class="flex my-5">
                <!-- Partie filtre -->
                <div class="bg-base-200 w-96">
                    <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg">Filtres</p>
                    <!-- Pays -->
                    <div class="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" /> 
                        <div class="collapse-title text-xl font-medium">
                            Pays
                        </div>
                        <div class="collapse-content"> 
                            <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center">
                                <input type="checkbox" class="checkbox mx-2" :value="country.parco_name" v-model="selectedCountries">
                                <label>{{ country.parco_name }}</label>
                            </div>
                        </div>
                    </div>
                    <!-- Départements -->
                    <div class="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" /> 
                        <div class="collapse-title text-xl font-medium">
                            Départements
                        </div>
                        <div class="collapse-content"> 
                            <div v-for="(comp, index) in components.components" :key="index">
                                <p>{{ comp.comp_name }}</p>
                                <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center">
                                    <input type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartments">
                                    <label>{{ dept.dept_shortname }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Universités -->
                    <div class="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" /> 
                        <div class="collapse-title text-xl font-medium">
                            Université
                        </div>
                        <div class="collapse-content"> 
                            <p>hello</p>
                        </div>
                    </div>
                </div>
                <!-- Partie rendu des accord -->
                <div class="w-full">

                    <div v-if="accords && accords.agreements">
                        <div v-if="accords && accords.count > 0">
                            <div v-for="(accord, index) in accords.agreements" :key="index" class="bg-base-300 mb-2 mx-2 *:list-disc flex justify-between items-center ">
                                <p>
                                    <span class="tooltip" :data-tip="accord.partnercountry.parco_name" v-html="getCountryFlag(accord.partnercountry.parco_name)"></span> 
                                    {{ accord.university.univ_name }} ({{ accord.university.univ_city }}) [0{{ accord.isced.isc_code }} {{ accord.isced.isc_name }}] pour {{ accord.component.comp_name }}
                                </p>
                                    <div v-if="accord.departments.length > 0" class="flex">
                                        <div v-for="(dept,index) in accord.departments" :key="index">
                                            <p class="p-3 m-1 tooltip" :data-tip="'Département '+ dept.dept_name" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <p class="p-3 m-1 tooltip" :data-tip="'Aucun département pour cet accord.'">Aucun département</p>
                                    </div>
                            </div>
                        </div>
                        <div v-else>
                            <p>Aucun accord n'a été trouvé.</p>
                        </div>
                    </div>
                    <div v-else class="flex items-center justify-center my-20">
                        <span class="loading loading-dots loading-lg"></span>
                    </div>
                </div>

            </div>
        </div>

        <div>
            <p class="text-2xl font-bold">Espace communication</p>
            <div class="m-5">
                <p class="text-xl font-bold">Articles</p>
                <div class="m-5">

                    <div v-if="articles && articles.articles">
                        <div class="flex flex-col" v-if="articles.count > 0">
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
                </div>

                <p class="text-xl font-bold">Agenda</p>
                <div class="m-5">
                    <div>
                        <p>Aucun agenda n'a été trouvé.</p>
                    </div>
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
    import {getCountryFlag} from '../composables/getFlag'

    import ArticleComp from '../components/index/ArticleComp.vue';

    const articles = ref([]);
    const accords = ref([]);
    const partnercountry = ref([]);
    const components = ref([]);

    async function fetchAll(){
        await request('GET', false, articles, config.apiUrl+'api/article')
        await request('GET', false, accords, config.apiUrl+'api/agreement')
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry')
        await request('GET', false, components, config.apiUrl+'api/component')
    }


    
    onMounted(fetchAll)

</script>