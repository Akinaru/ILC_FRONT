<template>
    <div v-if="isLoaded">
        <!-- Partie accord -->
        <div>
            
            <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
                <img 
                v-if="images.find(img => img.nom === 'banner_dest').exists"
                :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_dest`"
                    alt="Bannière"
                    className="w-full h-full object-cover"
                />
                <div v-else
                    class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                        <span class="text-3xl font-bold">Destinations</span>
                    </div>
                </div>
            </div>
            <div class="block lg:flex my-5">
 
                <!-- Partie filtre -->
                <div class="bg-base-200 drop-shadow-lg lg:w-96 w-full lg:my-0 my-5 z-10" v-if="accords && accords.agreements">
                    <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg">Filtres des Accords</p>
                    <p>{{ filteredAccords.length }} résultats ({{ selectedDepartment.length + selectedCountries.length }} filtre{{ selectedCountries.length + selectedDepartment.length > 1 ? 's' : '' }})</p>
                    <button class="hover:opacity-70 underline" @click="deselectAll">Tout désélectionner</button>

                    
                    <!-- Pays -->
                    <div>
                        <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                            <p>Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                            <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                        </div>
                        <div class="p-1" v-show="isOpen.pays">
                            <button class="hover:opacity-70 underline" @click="deselectAllCountry">Tout désélectionner</button>

                            <div class="lg:block flex flex-wrap">
                                
                                <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 w-1/2 sm:w-1/3 lg:w-full">
                                    <input :id="'filt_pays_'+index" type="checkbox" class="checkbox " :value="country.parco_name" v-model="selectedCountries">
                                    <label :for="'filt_pays_'+index"  class="flex  w-full hover:cursor-pointer pl-2">
                                        <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                        <label :for="'filt_pays_'+index" class="select-none w-full cursor-pointer">{{ country.parco_name }}</label>
                                    </label>
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
                            <button class="hover:opacity-70 underline" @click="deselectAllDept">Tout désélectionner</button>

                            <div v-for="(comp, index) in components.components" :key="index">
                                <div class="lg:block flex flex-wrap">
                                    <p>{{ comp.comp_name }}</p>
                                    <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 ">
                                        <input :id="'filt_dept_'+index" type="checkbox" class="checkbox " :value="dept.dept_shortname" v-model="selectedDepartment">
                                        <label :for="'filt_dept_'+index" class="hover:cursor-pointer flex items-center justify-center w-full pl-2">
                                            <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                            <label :for="'filt_dept_'+index" class="select-none w-full hover:cursor-pointer">{{ dept.dept_shortname }}</label>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                
                <!-- Partie rendu des accords -->
                <div class="w-full z-20">
                    <div>
                        <!-- Si il y a des accords -->
                        <div v-if="filteredAccords && filteredAccords.length > 0">

                            <div class="z-10">
                                <div v-for="(accord, index) in paginatedAccords" :key="index" class=" mb-3 mx-2 list-disc overflow-hidden transition-all hover:scale-102">
                                    <div class="w-full bg-base-300 flex justify-between items-center ">

                                        <RouterLink :to="{ name: 'Accord', params: { agree_id: accord.agree_id }}" class="flex w-full justify-between transition-all duration-100 ease-in-out relative group">
                                            <div class="flex items-center flex-wrap">
                                                <span class="relative inline-block">
                                                    <!-- Drapeau -->
                                                    <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.partnercountry?.parco_code || '')"></span>

                                                    <!-- Point d'interrogation si pas de drapeau -->
                                                    <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                        ?
                                                    </span>
                                                </span>
                                            <div class="md:ml-2 ml-1 flex flex-col">
                                                <p>
                                                <span class="font-bold">{{ accord.university?.univ_name || 'Université indisponible' }}</span> à {{ accord.university?.univ_city || 'Ville indisponible' }} ({{accord.partnercountry?.parco_name || 'Pays indisponible' }})
                                                </p>
                                                <p>[{{ accord.isced?.isc_code || 'Code ISCED indisponible' }} {{ accord.isced?.isc_name || 'Nom ISCED indisponible' }}] pour {{ accord.component?.comp_name || 'Composante indisponible' }}</p>
                                            </div>
                                            </div>
                                            <div class="flex items-center flex-wrap">
                                            <div v-if="countVisibleDepartments(accord)" class="flex flex-col md:flex-row items-center  h-full z-0">
                                                <div v-for="(dept, index) in accord.departments" :key="index">
                                                    <p v-if="dept.pivot?.deptagree_valide" class="transition-all duration-100 ease-in-out xl:p-3 min-w-11 p-1 m-1 font-bold text-xs text-center select-none z-0" :style="{ backgroundColor: dept.dept_color }">{{ dept.dept_shortname }}</p>
                                                </div>
                                            </div>
                                            <div v-else class="hidden md:block">
                                                <p class="p-3 m-1">Aucun département</p>
                                            </div>
                                            </div>
                                            <span class="hidden xs:absolute inset-0 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-opacity-75">Voir plus</span>
                                        </RouterLink>
                                        <span v-if="accountStore.isLogged() && accountStore.isStudent()">
                                            <div @click="toggleFavoris(accord.agree_id)" class="group md:p-5 p-2 flex items-center justify-center  hover:cursor-pointer" :class="{'hover:opacity-60' : isFavorited(accord.agree_id)}">
                                                <svg 
                                                    class="md:w-5 w-4 md:h-5 h-4 transition-all duration-100 ease-in-out" 
                                                    viewBox="0 0 24 24" 
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path 
                                                        :class="{'fill-current': isFavorited(accord.agree_id), 'group-hover:fill-current': !isFavorited(accord.agree_id)}" 
                                                        :fill="isFavorited(accord.agree_id) ? 'currentColor' : 'none'" 
                                                        stroke="currentColor" 
                                                        stroke-width="2" 
                                                        d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z" />
                                                </svg>
                                            </div>


                                        </span>
                                    </div>

                                </div>
                                <div class="flex items-center justify-center">
                                    <button v-if="canShowMore" @click="showMore" class="btn btn-primary mt-4 w-52 hover:opacity-80 transition-all hover:scale-105" >Voir plus d'accords</button>
                                </div>
                            </div>



                        </div>
                        <!-- Sil y n'y a pas d'accords -->
                        <div v-else class="flex items-center justify-center ">
                            <p class="my-52">Aucun accord n'a été trouvé.</p>
                        </div>
                    </div>
                </div>


            </div>
        </div>

        <!-- Espace communication -->
        <div class="w-full ">
            <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
                <img 
                v-if="images.find(img => img.nom === 'banner_art').exists"
                :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_art`"
                    alt="Bannière"
                    className="w-full h-full object-cover"
                />
                <div v-else
                    class="w-full h-full flex items-center justify-center ">
                    <div class="text-center">
                        <span class="text-3xl font-bold">Articles</span>
                    </div>
                </div>
            </div>
            <!-- Articles -->
            <div v-if="articles && articles.articles" class="flex justify-center items-center flex-col py-5">
                <div v-if="articles.count > 0" class="flex flex-wrap justify-center gap-5 max-w-7xl mx-auto">
                        <RouterLink 
                        v-for="(article, index) in articles.articles
                            .filter(article => {
                                if (!article.art_datesortie) return true; // si pas de date, on affiche
                                return new Date(article.art_datesortie) <= new Date(); // sinon on compare avec maintenant
                            })
                            .slice(0, 6)" 
                        
                        :key="index" :to="{ name: 'Article', params: { art_id: article.art_id } }" class="rounded-lg relative bg-base-300 w-80 md:w-96 h-96 transition-all duration-100 ease-in-out drop-shadow-lg hover:scale-105 mb-5">
                            <div class="p-2">
                                <div :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl + 'images/no_image.jpg'})` }" class=" bg-cover bg-center w-full h-48"></div>
                            </div>
                            <span v-if="article.art_pin" class="badge badge-primary absolute top-6 left-1">📌Épinglé</span>
                            <div class="p-3 flex flex-col justify-start h-48">
                                <div class="mb-2">
                                    <p class="font-bold text-md">{{ article.art_title }}</p>
                                    <p class="text-gray-600 text-sm">Dernière modif: {{ article.art_lastmodif }}</p>
                                </div>
                                <div class="overflow-hidden text-sm text-gray-700 max-h-20" v-html="article.art_description"></div>
                            </div>
                        </RouterLink>
                    </div>
                    <div v-else class="m-5 text-center">
                        <p>Aucun article n'a été trouvé.</p>
                    </div>
                    <RouterLink v-if="articles.count > 0" :to="{ name: 'Articles' }" class="my-12 flex justify-center">
                        <button class="btn btn-primary w-96 hover:opacity-80 transition-all hover:scale-105">Voir tous les articles</button>
                    </RouterLink>
            </div>

            <!-- Agenda -->
            <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
                <img 
                v-if="images.find(img => img.nom === 'banner_evt').exists"
                :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_evt`"
                    alt="Bannière"
                    className="w-full h-full object-cover"
                />
                <div v-else
                    class="w-full h-full flex items-center justify-center">
                    <div class="text-center">
                        <span class="text-3xl font-bold">Evenements</span>
                    </div>
                </div>
            </div>
                <div class="m-5 flex items-center justify-center flex-col">
                    <div class="flex h-full items-start justify-center md:flex-row flex-col " v-if="events && events.count > 0">
                        <!-- Calendrier -->
                        <div class="flex flex-col items-center justify-center w-full">
                            <CalendarComp :events="events"></CalendarComp>
                            <div class="flex items-center justify-center py-5 w-full">
                                <RouterLink :to="{name: 'Evenement'}" class="btn btn-primary lg:w-100 w-80 hover:opacity-80 transition-all hover:scale-105">Voir tous les évènements</RouterLink>
                            </div>
                        </div>

                        <!-- Evenements -->
                        <div class="p-5 flex flex-col">
                            <div v-if="events && events.count > 0" class="flex-1 flex flex-col">
                                <p class="text-center">Les 4 prochains événements</p>
                                <RouterLink :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}" v-for="(event, index) in eventspf.events.slice(0, 4)" :key="index" class="hover:opacity-70 hover:scale-105 transition-all flex items-center justify-center flex-1 md:w-full ">
                                    <p class="md:p-4 p-1 md:text-xl text-xs font-bold">{{ formatDate(event.evt_datetime) }}</p>
                                    <div class="bg-base-300 p-6 xl:w-110 md:w-100 w-80 my-3 drop-shadow-lg flex flex-col transition-all duration-100 ease-in-out rounded-lg">
                                        <div class="flex justify-between">
                                            <p class="font-bold truncate md:text-md text-xs">{{ event.evt_name }}</p>
                                            <span class="badge md:badge-md badge-xs md:text-md text-xxs badge-warning min-w-fit">{{ event.theme.evthm_name }}</span>
                                        </div>  
                                        <p class="truncate md:text-xs text-xxs">{{ event.evt_description }}</p>
                                    </div>
                                </RouterLink>
                                <div v-if="eventspf.events.length < 4" class="flex flex-col">
                                    <div v-for="(n, index) in (4 - eventspf.events.length)" :key="index" class="opacity-60 transition-all flex items-center justify-center flex-1 w-full">
                                        <p class="md:p-4 p-1 md:text-xl text-xs font-bold">XX/XX/XX</p>
                                        <div class="bg-base-300 p-6 xl:w-110 md:w-100 w-80 my-3 drop-shadow-lg flex flex-col transition-all duration-100 ease-in-out rounded-lg">
                                            <div class="flex justify-between">
                                                <p class="font-bold truncate md:text-md text-xs">Aucun évenement...</p>
                                            </div>  
                                            <p class="truncate md:text-xs text-xxs">La case correspondant à cet événement est vide.</p>
                                        </div>
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
    import { ref, computed, watch } from 'vue';
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
    const images = ref([
        { vrainom: 'Destinations Accueil', nom: 'banner_dest', path: 'private/images/site', exists: false },
        { vrainom: 'Articles Accueil', nom: 'banner_art', path: 'private/images/site', exists: false },
        { vrainom: 'Evenements Accueil', nom: 'banner_evt', path: 'private/images/site', exists: false },
    ]);

    const itemsToShow = ref(12);

    const isLoaded = ref(false);

    const selectedDepartment = ref([]);
    const selectedCountries = ref([]);
    // Fonction pour charger les filtres depuis sessionStorage pour la page d'accueil
    function loadFilters() {
        const savedDepartments = sessionStorage.getItem('home_dashboard.selectedDepartment');
        const savedCountries = sessionStorage.getItem('home_dashboard.selectedCountries');


        if (savedDepartments) {
            selectedDepartment.value = JSON.parse(savedDepartments);

        }
        if (savedCountries) {
            selectedCountries.value = JSON.parse(savedCountries);
        }



    }

    // Fonction pour sauvegarder les filtres dans sessionStorage pour la page d'accueil
    function saveFilters() {
        sessionStorage.setItem('home_dashboard.selectedDepartment', JSON.stringify(selectedDepartment.value));
        sessionStorage.setItem('home_dashboard.selectedCountries', JSON.stringify(selectedCountries.value));
    }

    const isOpen = ref({
        pays: false,
        departments: false,
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
        for (const image of images.value) {
            await request(
                'GET', 
                false, 
                response, 
                `${config.apiUrl}api/image?path=${image.path}&name=${image.nom}`
            );
            if (!response?.value?.error) {
                image.exists = true;
            } else {
                image.exists = false;
            }
        }
        if(accountStore.isLogged()){
            await request('GET', false, favoris, config.apiUrl+'api/favoris/getbylogin/'+accountStore.login)
        }
        isLoaded.value = true;
    }

    // Renvoie la date formatée
    function formatDate(date) {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    const filteredAccords = computed(() => {
    return accords.value.agreements
        .filter(accord => {
            // Gestion des valeurs nulles ou undefined
            const departments = accord.departments || [];
            const partnercountry = accord.partnercountry || {};
            const component = accord.component || {};
            const deptShortnames = selectedDepartment.value || [];
            const countryNames = selectedCountries.value || [];

            // Les accords doivent être filtrés en fonction des départements, pays et composantes sélectionnés
            const matchesDepartments = deptShortnames.length === 0 || 
                departments.some(dept => dept && dept.dept_shortname && deptShortnames.includes(dept.dept_shortname));
            
            const matchesCountries = countryNames.length === 0 || 
                (partnercountry && partnercountry.parco_name && countryNames.includes(partnercountry.parco_name));

            // Assurez-vous que departments est un tableau et vérifiez sa longueur
            const hasDepartments = Array.isArray(departments) && departments.length > 0;

            // Retourner les accords qui correspondent aux filtres ou qui ont des départements
            return matchesDepartments && matchesCountries && (hasDepartments || deptShortnames.length === 0);
        })
        .sort((a, b) => {
            // Récupération des noms de pays avec gestion des undefined
            const countryA = a.partnercountry?.parco_name || '';
            const countryB = b.partnercountry?.parco_name || '';

            // Si les pays sont différents, on trie par pays
            if (countryA !== countryB) {
                return countryA.localeCompare(countryB);
            }

            // Si les pays sont identiques, on trie par nom d'université
            const univA = a.university?.univ_name || '';
            const univB = b.university?.univ_name || '';
            return univA.localeCompare(univB);
        });
});

    
    const canShowMore = computed(() => {
      return itemsToShow.value < filteredAccords.value.length;
    });
    const paginatedAccords = computed(() => {
      return filteredAccords.value.slice(0, itemsToShow.value);
    });


    const showMore = () => {
      itemsToShow.value += 5;
    };


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
    

    // renvoie le nombre de département visible d'un accord
    function countVisibleDepartments(accord) {
        return accord.departments?.filter(dept => dept.pivot?.deptagree_valide).length || 0;
    }

    function deselectAll() {
        selectedDepartment.value = [];
        selectedCountries.value = [];
    }
    function deselectAllDept() {
        selectedDepartment.value = [];
    }
    function deselectAllCountry() {
        selectedCountries.value = [];
    }
    // Surveiller les changements et sauvegarder les filtres
    watch(selectedDepartment, saveFilters);
    watch(selectedCountries, saveFilters);

    onMounted(() => {
        fetchAll();
        loadFilters();
    });


</script>
