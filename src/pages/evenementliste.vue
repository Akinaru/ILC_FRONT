<template>
    <div v-if="isLoaded">
        <div v-if="isValidDate">
            <div class="text-sm breadcrumbs font-bold">
                <ul>
                    <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li>
                    <li>Évènements</li>
                </ul>
            </div>
            <p class="font-bold text-2xl py-10 flex items-center justify-center">
                {{ displayMode === 'all' ? 'Liste des évènements' : 'Évènements du ' + formatDate(selectedDate) }}
            </p>
            <div v-if="pastEvents && pastEvents.length > 0 || todayEvents && todayEvents.length > 0 || futureEvents && futureEvents.length > 0">

                <!-- Événements passés -->
                <div class="flex flex-col justify-center items-center py-10">
                    <h2 class="font-bold text-lg">Événements passés</h2>
                    <div v-if="pastEvents.length > 0" class="w-full flex flex-col justify-center items-center py-5">

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
                    <div v-else>
                        <p>Aucun événement passés.</p>
                    </div>
                </div>
                
                <!-- Événements d'aujourd'hui -->
                <div  class="flex flex-col justify-center items-center py-10">
                    <h2 class="font-bold text-lg">Événements d'aujourd'hui</h2>
                    <div v-if="todayEvents.length > 0" class="w-full flex flex-col justify-center items-center py-5">
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
                <div class="flex flex-col justify-center items-center py-10">
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

            <div v-if="displayMode != 'all'" class="flex items-center justify-center p-10 w-full">
                <RouterLink :to="{name: 'Evenement'}" class="btn btn-primary w-100">Voir tous les évènements</RouterLink>
            </div>
        </div>
        <div v-else>
            <p>La date passée en paramètre est incorrecte.</p>
        </div>
    </div>
</template>




<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { request } from '../composables/httpRequest';
import config from '../config';

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

function formatDate(date) {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
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
    await request('GET', false, events, config.apiUrl + 'api/event');
    filteredEvents.value = events.value.events;
    isLoaded.value = true;
}

async function fetchEventsByDay(date) {
    isLoaded.value = false;
    await request('GET', false, events, config.apiUrl + 'api/event');
    filteredEvents.value = events.value.events.filter(event => formatDate(event.evt_datetime) === formatDate(date));
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