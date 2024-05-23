<template>
    <div>
        <div>
            <p class="text-2xl font-bold">Les accords</p>
            <div class="block lg:flex my-5">
 
                <!-- Partie filtre -->
                <div class="bg-base-200 w-96 drop-shadow-lg hidden lg:block" v-if="accords && accords.agreements">
                    <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                    <p>{{ filteredAccords.length }} résultats ({{ selectedDepartment.length + selectedCountries.length }} filtre{{ selectedCountries.length + selectedDepartment.length > 1 ? 's' : '' }})</p>
                    <!-- Pays -->
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                        <p>Pays ({{ selectedCountries.length }})</p>
                        <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                    </div>
                    <div class="p-1" v-show="isOpen.pays">
                        <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1">
                            <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2" :value="country.parco_name" v-model="selectedCountries">
                            <label :for="'filt_pays_'+index" class="select-none">{{ country.parco_name }}</label>
                        </div>
                    </div>
                    <!-- Départements -->
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                        <p>Départements ({{ selectedDepartment.length }})</p>
                        <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.departments">
                        <div v-for="(comp, index) in components.components" :key="index">
                            <p>{{ comp.comp_name }}</p>
                            <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1">
                                <input :id="'filt_dept_'+index" type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartment">
                                <label :for="'filt_dept_'+index" class="select-none">{{ dept.dept_shortname }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Partie rendu des accord -->
                <div class="w-full">

                    <div v-if="accords && accords.agreements">
                        <div v-if="filteredAccords && filteredAccords.length > 0">
                            <div v-for="(accord, index) in filteredAccords" :key="index" class="bg-base-300 mb-3 mx-2 *:list-disc flex justify-between items-center drop-shadow-lg">
                                <div class="flex justify-between items-center w-full">

                                    <p>
                                        <span class="tooltip" :data-tip="accord.partnercountry.parco_name" v-html="getCountryFlag(accord.partnercountry.parco_name)"></span> 
                                        {{ accord.university.univ_name }} ({{ accord.university.univ_city }}) [0{{ accord.isced.isc_code }} {{ accord.isced.isc_name }}] pour {{ accord.component.comp_name }}
                                    </p>
                                    <div v-if="accord.departments.length > 0" class="flex">
                                        <div v-for="(dept,index) in accord.departments" :key="index">
                                            <p class="p-3 m-1 tooltip font-bold drop-shadow-lg" :data-tip="'Département '+ dept.dept_name" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <p class="p-3 m-1 tooltip" :data-tip="'Aucun département pour cet accord.'">Aucun département</p>
                                    </div>
                                </div>
                                <div class="p-5 flex items-center justify-center hover:opacity-60 hover:cursor-pointer">
                                    {{ index }}
                                </div>
                            </div>

                        </div>
                        <div v-else class="flex items-center justify-center">
                            <p>Aucun accord n'a été trouvé.</p>
                        </div>
                    </div>
                    <div v-else class="flex items-center justify-center my-20">
                        <span class="loading loading-dots loading-lg"></span>
                    </div>
                </div>

            </div>
        </div>

        <!-- Espace communication -->
        <div>
            <p class="text-2xl font-bold">Espace communication</p>
            <!-- Articles -->
                <p class="text-xl font-bold">Articles</p>

                    <div v-if="articles && articles.articles">
                        <div class="flex flex-col" v-if="articles.count > 0">
                            <RouterLink  v-for="(article, index) in articles.articles" :key="index" :to="{name: 'Article', params: {art_id: article.art_id}}">
                                <ArticleComp :article="article" class="my-1"></ArticleComp>
                            </RouterLink>
                        </div>
                        <div v-else class="m-5">

                            <p>Aucun article n'a été trouvé.</p>
                        </div>
                    </div>
                    <div v-else class="flex items-center justify-center my-20">
                        <span class="loading loading-dots loading-lg"></span>
                    </div>

            <!-- Agenda -->
                <p class="text-xl font-bold">Agenda</p>
                <div class="m-5 flex items-start justify-center">
                    <CalendarComp></CalendarComp>
                    <div class="p-5">
                        <p class="font-bold text-lg">Liste des prochains évenements</p>
                        <div v-for="n in 5" class="flex items-center justify-center">
                            <p class="p-5">22/05</p>
                            <div class="bg-base-300 p-6 w-96 my-3 drop-shadow-lg flex flex-col">
                                <p class="badge">Thématique</p>
                                <p>Ici le titre de l'evenement</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { ref, computed } from 'vue';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import {getCountryFlag} from '../composables/getFlag'

    import ArticleComp from '../components/index/ArticleComp.vue';
    import CalendarComp from '../components/utils/CalendarComp.vue';

    const articles = ref([]);
    const accords = ref([]);
    const partnercountry = ref([]);
    const components = ref([]);

    const selectedDepartment = ref([]);
    const selectedComponent = ref([]);
    const selectedUniversity = ref([]);
    const selectedCountries = ref([]);

    const isOpen = ref({
        pays: true,
        departments: true,
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    async function fetchAll(){
        await request('GET', false, articles, config.apiUrl+'api/article')
        await request('GET', false, accords, config.apiUrl+'api/agreement')
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry')
        await request('GET', false, components, config.apiUrl+'api/component')
    }

    const filteredAccords = computed(() => {
        return accords.value.agreements.filter(accord => {
            const matchesDepartments = selectedDepartment.value.length === 0 || accord.departments.some(dept => selectedDepartment.value.includes(dept.dept_shortname));
            const matchesCountries = selectedCountries.value.length === 0 || selectedCountries.value.includes(accord.partnercountry.parco_name);
            
            return matchesDepartments && matchesCountries;
        });
    });
    
    onMounted(fetchAll)

</script>