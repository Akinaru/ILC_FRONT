<template>
    <div v-if="isLoaded">
        <div class="flex justify-between items-center">
            <div class="text-sm breadcrumbs font-bold">
                <ul>
                    <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li>
                    <li v-if="displayMode == 'all'">Évènements</li>
                    <li v-else><RouterLink :to="{name: 'Evenement'}">Évènements</RouterLink></li>
                    <li v-if="displayMode != 'all'">{{  formatDate(selectedDate) }}</li>
                </ul>
            </div>
            <div class="flex justify-start items-end">
                <button class="hover:opacity-70 transition-all btn btn-primary mx-1" @click="switchAffichage(true)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10ZM7 14H9V16H7V14ZM11 14H13V16H11V14ZM15 14H17V16H15V14ZM19 3H18V1H16V3H8V1H6V3H5C3.9 3 3 3.9 3 5V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V5C21 3.9 20.1 3 19 3ZM19 21H5V8H19V21Z" fill="currentColor"/>
                    </svg>
                </button>

                <button class="hover:opacity-70 transition-all btn btn-primary" @click="switchAffichage(false)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3H11V11H3V3ZM13 3H21V11H13V3ZM3 13H11V21H3V13ZM13 13H21V21H13V13Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
        <div v-if="!affichageCal">

            <div v-if="isValidDate">

                    <!-- Titre de la page -->
                    <p class="font-bold text-2xl py-10 flex items-center justify-center">
                        {{ displayMode === 'all' ? 'Liste des évènements' : 'Évènements du ' + formatDate(selectedDate) }}
                    </p>

                    <!-- Filtes -->
                    <div class="w-full flex justify-center items-center flex-col">
                        <!-- Barre de recherche -->
                        <label class="input input-bordered flex items-center gap-2 w-2/3">
                            <input type="text" class="grow" placeholder="Rechercher" v-model="searchQuery" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                        </label>

                        <!-- Filtre sur les thematiques -->
                        <div class="flex w-2/3" >
                            <div v-for="(them, index) in thematiques" class="flex items-center justify-center py-1 min-w-fit">
                                <input :id="'filt_them_'+index" type="checkbox" class="checkbox" :value="them.evthm_id" v-model="selectedThematique">
                                <label :for="'filt_them_'+index" class="select-none w-full mx-2">
                                    <span class="badge badge-warning min-w-fit">{{ them.evthm_name }}</span>
                                </label>
                            </div>
                        </div>
                    </div>


                    <div v-if="pastEvents && pastEvents.length > 0 || todayEvents && todayEvents.length > 0 || futureEvents && futureEvents.length > 0">
                        <!-- Événements passés -->
                        <div v-if="pastEvents.length > 0 && displayMode !== 'day'" class="flex flex-col justify-center items-center py-10">
                            <h2 class="font-bold text-lg">Événements passés</h2>
                            <div class="w-full flex flex-col justify-center items-center py-5">
                                <!-- Afficher les événements passés -->
                                <RouterLink
                                    v-for="event in visiblePastEvents"
                                    :key="event.evt_id"
                                    class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden opacity-50 scale-100 hover:scale-105 transition-all duration-200 ease-in-out"
                                    :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}"
                                >
                                    <p class="font-bold md:text-xl flex items-center justify-center md:p-5 p-2 transition-all duration-200 ease-in-out">{{ formatDate(event.evt_datetime) }}</p>
                                    <div class="flex flex-col w-5/6 items-start justify-center md:py-5 p-3">
                                        <div class="flex items-center justify-start w-full md:flex-row flex-col transition-all duration-200 ease-in-out">
                                            <span class="badge badge-warning min-w-fit transition-all duration-200 ease-in-out">{{ event.theme.evthm_name }}</span>
                                            <p class="font-bold md:mx-3 transition-all duration-200 ease-in-out">{{ event.evt_name }}</p>
                                        </div>
                                        <p class="truncate overflow-hidden w-full whitespace-nowrap transition-all duration-200 ease-in-out">{{ event.evt_description }}</p>
                                    </div>
                                </RouterLink>
                                <button v-if="!showAllPastEvents && pastEvents.length > 2" @click="showAllPastEvents = true" class="btn btn-primary mt-2">Voir plus d'événements passés</button>
                            </div>
                        </div>
                        <!-- Condition pour cacher la section si aucun événement passé ou si mode affichage par jour -->
                        <div v-else-if="pastEvents.length === 0 && displayMode === 'all'" class="flex flex-col justify-center items-center py-10">
                            <h2 class="font-bold text-lg">Événements passés</h2>
                            <p>Aucun événement passé.</p>
                        </div>

                        
                        <!-- Événements d'aujourd'hui -->
                        <div class="flex flex-col justify-center items-center py-10">
                            <h2 v-if="displayMode === 'all'" class="font-bold text-lg">Événements d'aujourd'hui</h2>
                            <div v-if="todayEvents.length > 0" class="w-full flex flex-col justify-center items-center py-5">
                                <!-- Afficher les événements d'aujourd'hui -->
                                <RouterLink
                                    v-for="event in todayEvents"
                                    :key="event.evt_id"
                                    class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden scale-110 hover:scale-115 transition-all duration-200 ease-in-out "
                                    :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}"
                                >
                                <p class="font-bold md:text-xl flex items-center justify-center md:p-5 p-2 transition-all duration-200 ease-in-out">{{ formatDate(event.evt_datetime) }}</p>
                                    <div class="flex flex-col w-5/6 items-start justify-center md:py-5 p-3">
                                        <div class="flex items-center justify-start w-full md:flex-row flex-col transition-all duration-200 ease-in-out">
                                            <span class="badge badge-warning min-w-fit transition-all duration-200 ease-in-out">{{ event.theme.evthm_name }}</span>
                                            <p class="font-bold md:mx-3 transition-all duration-200 ease-in-out">{{ event.evt_name }}</p>
                                        </div>
                                        <p class="truncate overflow-hidden w-full whitespace-nowrap transition-all duration-200 ease-in-out">{{ event.evt_description }}</p>
                                    </div>
                                </RouterLink>
                            </div>
                            <div v-else>
                                <p>Aucun événement aujourd'hui.</p>
                            </div>
                        </div>
                        
                        <!-- Événements à venir -->
                        <div v-if="displayMode !== 'day'" class="flex flex-col justify-center items-center py-10">
                            <h2 class="font-bold text-lg">Événements à venir</h2>
                            <div v-if="futureEvents && futureEvents.length" class="w-full flex flex-col justify-center items-center py-5">
                                <RouterLink
                                    v-for="event in visibleFutureEvents"
                                    :key="event.evt_id"
                                    class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden scale-100 hover:scale-105 transition-all duration-200 ease-in-out"
                                    :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}"
                                >
                                    <p class="font-bold md:text-xl flex items-center justify-center md:p-5 p-2 transition-all duration-200 ease-in-out">{{ formatDate(event.evt_datetime) }}</p>
                                    <div class="flex flex-col w-5/6 items-start justify-center md:py-5 p-3">
                                        <div class="flex items-center justify-start w-full md:flex-row flex-col transition-all duration-200 ease-in-out">
                                            <span class="badge badge-warning min-w-fit transition-all duration-200 ease-in-out">{{ event.theme.evthm_name }}</span>
                                            <p class="font-bold md:mx-3 transition-all duration-200 ease-in-out">{{ event.evt_name }}</p>
                                        </div>
                                        <p class="truncate overflow-hidden w-full whitespace-nowrap transition-all duration-200 ease-in-out">{{ event.evt_description }}</p>
                                    </div>
                                </RouterLink>
                                <button v-if="futureEvents.length > 2 && !showAllFutureEvents" @click="showAllFutureEvents = true" class="btn btn-primary mt-2">Voir plus d'événements à venir</button>
                            </div>
                            <div v-else>
                                <p>Aucun événement à venir.</p>
                            </div>
                        </div>



                    </div>
                    <div v-else class="flex items-center justify-center py-20">
                        <p>Aucun événement n'a été trouvé.</p>
                    </div>

                    <div v-if="displayMode != 'all'" class="flex items-center justify-center p-10 w-full">
                        <RouterLink :to="{name: 'Evenement'}" class="btn btn-primary w-100">Voir tous les évènements</RouterLink>
                    </div>
            </div>
            <div v-else>
                <p>La date passée en paramètre est incorrecte.</p>
            </div>
        </div>

        <div v-else class="py-10 flex items-center justify-center flex-col">
            <p class="font-bold text-2xl py-10 flex items-center justify-center">Calendrier</p>
            <CalendarComp :events="events"></CalendarComp>
        </div>
    </div>
</template>




<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import CalendarComp from '../components/utils/CalendarComp.vue';

    const events = ref([]);
    const filteredEvents = ref([]);
    const route = useRoute();
    const router = useRouter();
    const isLoaded = ref(false);
    const selectedDate = ref(null);
    const displayMode = ref('all');
    const isValidDate = ref(true);
    const showAllPastEvents = ref(false);
    const showAllFutureEvents = ref(false);
    const thematiques = ref([])

    const affichageCal = ref(false);

    const selectedThematique = ref([]);
    const searchQuery = ref('');

    function formatDate(date) {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }


    function switchAffichage(val){
        affichageCal.value = val;
    }

    function parseDate(dateStr) {
        const [day, month, year] = dateStr.split('/');
        return new Date(`${year}-${month}-${day}`);
    }

    function isToday(dateStr) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        const todayStr = `${day}/${month}/${year}`;

        return dateStr === todayStr;
    }

    async function fetchEvents() {
        isLoaded.value = false;
        switchAffichage(false);
        await request('GET', false, events, config.apiUrl + 'api/event');
        await request('GET', false, thematiques, config.apiUrl + 'api/eventtheme');
        filteredEvents.value = events.value.events;
        isLoaded.value = true;
        applyFilters();
    }

    async function fetchEventsByDay(date) {
        isLoaded.value = false;
        switchAffichage(false);
        await request('GET', false, events, config.apiUrl + 'api/event');
        await request('GET', false, thematiques, config.apiUrl + 'api/eventtheme');
        const formattedDate = formatDate(date);
        filteredEvents.value = events.value.events.filter(event => formatDate(event.evt_datetime) === formattedDate);
        isLoaded.value = true;
    }


    watch(() => route.query, async (newQuery, oldQuery) => {
        const { date } = newQuery;
        if (date) {
            const parsedDate = parseDate(date);
            if (isNaN(parsedDate)) {
                isValidDate.value = false;
                return;
            }
            selectedDate.value = parsedDate;
            displayMode.value = 'day';
            await fetchEventsByDay(parsedDate);
        } else {
            displayMode.value = 'all';
            await fetchEvents();
        }
        isValidDate.value = true;
    });

    onMounted(async () => {
        const { date } = route.query;
        if (date) {
            const parsedDate = parseDate(date);
            if (isNaN(parsedDate)) {
                isValidDate.value = false;
                return;
            }
            selectedDate.value = parsedDate;
            displayMode.value = 'day';
            await fetchEventsByDay(parsedDate);
        } else {
            displayMode.value = 'all';
            await fetchEvents();
        }
        isValidDate.value = true;
    });


    function applyFilters() {
        filteredEvents.value = events.value.events.filter(event => {
            // Filtre par texte de recherche
            const searchRegex = new RegExp(searchQuery.value, 'i');
            const matchesSearch = searchQuery.value ? searchRegex.test(event.evt_name) || searchRegex.test(event.evt_description) : true;

            // Filtre par thématique
            const matchesThematique = selectedThematique.value.length === 0 || selectedThematique.value.includes(event.theme.evthm_id);

            return matchesSearch && matchesThematique;
        });
    }

    watch(selectedThematique, applyFilters);
    watch(searchQuery, applyFilters);

    const pastEvents = computed(() => {
        return filteredEvents.value ? filteredEvents.value.filter(event => {
            const eventDate = new Date(event.evt_datetime);
            const today = new Date();
            return eventDate < today && !isToday(formatDate(event.evt_datetime));
        }) : [];
    });

    const todayEvents = computed(() => {
        return filteredEvents.value ? filteredEvents.value.filter(event => isToday(formatDate(event.evt_datetime))) : [];
    });

    const futureEvents = computed(() => {
        return filteredEvents.value ? filteredEvents.value.filter(event => new Date(event.evt_datetime) > new Date()) : [];
    });

    const visiblePastEvents = computed(() => {
        const eventsToShow = showAllPastEvents.value ? pastEvents.value : pastEvents.value.slice(0, 2);
        return eventsToShow.filter(event => !isToday(formatDate(event.evt_datetime)));
    });

    const visibleFutureEvents = computed(() => {
        return showAllFutureEvents.value ? futureEvents.value : futureEvents.value.slice(0, 2);
    });

</script>