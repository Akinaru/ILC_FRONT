<template>
    <div v-if="isLoaded">
        <!-- Partie accord -->
        <div>
            <p class="text-2xl font-bold">Les accords</p>
            <div class="block lg:flex my-5">
 
                <!-- Partie filtre -->
                <div class="bg-base-200 drop-shadow-lg lg:w-96 w-full lg:my-0 my-5" v-if="accords && accords.agreements">
                    <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                    <p>{{ filteredAccords.length }} résultats ({{ selectedDepartment.length + selectedCountries.length + selectedComponent.length }} filtre{{ selectedCountries.length + selectedDepartment.length + selectedComponent.length > 1 ? 's' : '' }})</p>
                    <!-- Pays -->
                    <div>
                        <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                            <p>Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                            <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                        </div>
                        <div class="p-1" v-show="isOpen.pays">
                            <div class="lg:block flex flex-wrap">

                                <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 w-1/2 sm:w-1/3 lg:w-full">
                                    <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2" :value="country.parco_name" v-model="selectedCountries">
                                    <div class="flex  w-full">
                                        <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                        <label :for="'filt_pays_'+index" class="select-none w-full">{{ country.parco_name }}</label>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <!-- Départements -->
                    <div>
                        <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                            <p>Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                            <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                        </div>
                        <div class="p-1" v-show="isOpen.departments">
                            <div v-for="(comp, index) in components.components" :key="index">
                                <div class="lg:block flex flex-wrap">
                                    <p>{{ comp.comp_name }}</p>
                                    <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 ">
                                        <input :id="'filt_dept_'+index" type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartment">
                                        <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                        <label :for="'filt_dept_'+index" class="select-none w-full">{{ dept.dept_shortname }}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Component -->
                    <div>
                        <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('component')">
                            <p>Composante ({{ selectedComponent.length }} séléctionné{{ selectedComponent.length > 1 ? 's' : '' }})</p>
                            <span :class="isOpen.component ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                        </div>
                        <div class="p-1" v-show="isOpen.component">
                            <div class="lg:block flex flex-wrap">
                                <div v-for="(compo,index) in components.components" :key="index" class="flex items-center hover:opacity-60 my-1 w-fit">
                                    <input :id="'filt_compo_'+index" type="checkbox" class="checkbox mx-2" :value="compo.comp_name" v-model="selectedComponent">
                                    <label :for="'filt_compo_'+index" class="select-none w-full">{{ compo.comp_name }}</label>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                </div>

                
                <!-- Partie rendu des accords -->
                <div class="w-full overflow-x-hidden">
                    <div>
                        <!-- Si il y a des accords -->
                        <div v-if="filteredAccords && filteredAccords.length > 0">



                            <div v-for="(accord, index) in filteredAccords" :key="index" class="bg-base-300 mb-3 mx-2 list-disc flex justify-between items-center drop-shadow-lg overflow-hidden">
                                <RouterLink :to="{name: 'Accord', params: {agree_id: accord.agree_id}}" class="flex w-full justify-between hover:opacity-60 transition-all duration-100 ease-in-out relative group">

                                    <div class="flex items-center flex-wrap">
                                        <span class="mr-2 flex items-center justify-center">
                                            <span class="fi md:text-5xl text-3xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code"></span>
                                        </span>
                                        <div class="flex flex-col">
                                            <p><span class="font-bold">{{ accord.university.univ_name }}</span> à {{ accord.university.univ_city }} ({{ accord.partnercountry.parco_name }})</p>
                                            <p>[{{ accord.isced.isc_code }} {{ accord.isced.isc_name }}] pour {{ accord.component.comp_name }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center flex-wrap">
                                        <div v-if="accord.departments.length > 0" class="flex flex-col md:flex-row items-center transition-all duration-100 ease-in-out">
                                            <div v-for="(dept, index) in accord.departments" :key="index">
                                                <p v-if="dept.pivot.deptagree_valide" class="transition-all duration-100 ease-in-out md:p-3 min-w-11 p-1 m-1 font-bold drop-shadow-lg select-none" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <p class="p-3 m-1">Aucun département</p>
                                        </div>
                                    </div>

                                    <span class="absolute inset-0 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-opacity-75">Voir plus</span>
                                </RouterLink>

                                <span v-if="accountStore.isLogged() && accountStore.isStudent()">
                                    <div @click="toggleFavoris(accord.agree_id)" class="md:p-5 p-2 flex items-center justify-center hover:opacity-60 hover:cursor-pointer">
                                        <svg v-if="isFavorited(accord.agree_id)" class="md:w-5 w-4 md:h-5 h-4 transition-all duration-100 ease-in-out" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="currentColor" stroke="currentColor" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                                        </svg>
                                        <svg v-else class="md:w-5 w-4 md:h-5 h-4 transition-all duration-100 ease-in-out" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path fill="none" stroke="currentColor" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                                        </svg>
                                    </div>
                                </span>
                            </div>



                        </div>
                        <!-- Sil y n'y a pas d'accords -->
                        <div v-else class="flex items-center justify-center">
                            <p>Aucun accord n'a été trouvé.</p>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <!-- Espace communication -->
        <div class="w-full ">
            <p class="text-2xl font-bold">Espace communication</p>
            <!-- Articles -->
                <p class="text-xl font-bold">Articles</p>
                    <div v-if="articles && articles.articles" class="flex justify-center items-center flex-col py-5">

                        <div class="flex flex-wrap justify-center w-full bg-red-105 gap-5" v-if="articles.count > 0">
                            <RouterLink v-for="(article, index) in articles.articles.slice(0,6)" :key="index" :to="{name: 'Article', params: {art_id: article.art_id}}" class="rounded-lg relative bg-base-300 w-80 pt-5 md:w-110 h-96 transition-all duration-100 ease-in-out drop-shadow-lg hover:scale-105">
                                <div :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl+'images/no_image.jpg'})` }" class="bg-cover bg-center w-full h-48"></div>
                                <span v-if="article.art_pin" class="badge badge-primary absolute top-6 left-1">📌Épinglé</span>
                                <div class="p-3 flex flex-col justify-start h-52">
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
                        <RouterLink v-if="articles.count > 0" :to="{name: 'Articles'}" class=" py-12">
                            <button  class="btn btn-primary w-96">Voir tous les articles</button>
                        </RouterLink>
                    </div>
                    <div v-else class="flex items-center justify-center my-20">
                        <span class="loading loading-dots loading-lg"></span>
                    </div>

            <!-- Agenda -->
                <p class="text-xl font-bold">Agenda</p>
                <div class="m-5 flex items-center justify-center flex-col">
                    <p class="font-bold text-xl p-5">Prochains évenements</p>
                    <div class="flex h-full items-center lg:items-start justify-center md:flex-row flex-col " v-if="events && events.count > 0">
                        <div class="flex flex-col items-center justify-center">
                            <CalendarComp :events="events"></CalendarComp>
                            <div class="flex items-center justify-center p-5 w-full">
                                <RouterLink :to="{name: 'Evenement'}" class="btn btn-primary w-full">Voir tous les évènements</RouterLink>
                            </div>
                        </div>

                        <div class="p-5 flex flex-col">
                            <div v-if="events && events.count > 0" class="flex-1 flex flex-col">
                                <div v-for="(event, index) in eventspf.events.slice(0, 4)" :key="index" class="flex items-center justify-center flex-1 ">
                                    <p class="md:p-4 p-1 md:text-xl font-bold">{{ formatDate(event.evt_datetime) }}</p>
                                    <div class="bg-base-300 p-6 xl:w-110 md:w-100 w-80 my-3 drop-shadow-lg flex flex-col transition-all duration-100 ease-in-out rounded-lg">
                                        <div class="flex justify-between">
                                            <p class="font-bold  truncate">{{ event.evt_name }}</p>
                                            <span class="badge badge-warning">{{ event.theme.evthm_name }}</span>
                                        </div>  
                                        <p class="truncate">{{ event.evt_description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { ref, computed } from 'vue';
    import { request } from '../composables/httpRequest';
    import config from '../config';

    import CalendarComp from '../components/utils/CalendarComp.vue';
    import { useAccountStore } from '../stores/accountStore';
    import LoadingComp from '../components/utils/LoadingComp.vue';

    import "/node_modules/flag-icons/css/flag-icons.min.css";

    const accountStore = useAccountStore();


    const response = ref([]);
    const articles = ref([]);
    const accords = ref([]);
    const partnercountry = ref([]);
    const components = ref([]);
    const events = ref([]);
    const eventspf = ref([]);
    const favoris = ref([]);


    const isLoaded = ref(false);

    const selectedDepartment = ref([]);
    const selectedComponent = ref([]);
    const selectedCountries = ref([]);

    const isOpen = ref({
        pays: false,
        departments: false,
        component: false,
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    async function fetchAll(){
        await request('GET', false, articles, config.apiUrl+'api/article')
        await request('GET', false, accords, config.apiUrl+'api/agreement')
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry')
        await request('GET', false, components, config.apiUrl+'api/component')
        await request('GET', false, events, config.apiUrl+'api/event')
        await request('GET', false, eventspf, config.apiUrl+'api/event/pfonly')
        if(accountStore.isLogged)
            await request('GET', false, favoris, config.apiUrl+'api/favoris/getbylogin/'+accountStore.login)
        isLoaded.value = true;
    }

    function formatDate(date) {
      const options = { day: '2-digit', month: '2-digit' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    }

    const filteredAccords = computed(() => {
        return accords.value.agreements.filter(accord => {
            const matchesDepartments = selectedDepartment.value.length === 0 || accord.departments.some(dept => selectedDepartment.value.includes(dept.dept_shortname));
            const matchesCountries = selectedCountries.value.length === 0 || selectedCountries.value.includes(accord.partnercountry.parco_name);
            
            return matchesDepartments && matchesCountries;
        });
    });

    function isFavorited(agree_id) {
      return favoris.value.favoris.some(
        favori => favori.acc_id === accountStore.login && favori.agree_id === agree_id
      );
    }

    async function toggleFavoris(agree_id) {
        if(!isFavorited(agree_id)){
            const requestData = {
                acc_id: accountStore.login,
                agree_id: agree_id
            }
            await request('post', true, response, config.apiUrl+'api/favoris', requestData);
            if(response.value.status == 201){
                favoris.value.favoris.push({
                    acc_id: accountStore.login,
                    agree_id: agree_id
                });
            }
        }
        else{
            await request('delete', true, response, config.apiUrl+'api/favoris/delete/'+accountStore.login+'/'+agree_id);
            favoris.value.favoris = favoris.value.favoris.filter(favori => !(favori.acc_id === accountStore.login && favori.agree_id === agree_id));
            
        }
    }
    
    // Ouvrir les filtres ou les fermer en fonction de la taille de l'écran
    function updateIsOpenState() {
        if (window.innerWidth >= 1024) {
            isOpen.value.pays = true;
            isOpen.value.departments = true;
            isOpen.value.component = true;
        } else {
            isOpen.value.pays = false;
            isOpen.value.departments = false;
            isOpen.value.component = false;
        }
    }

    onMounted(() => {
        fetchAll();
        updateIsOpenState();
    });

</script>