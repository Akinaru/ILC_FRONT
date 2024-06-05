<template>
    <div v-if="isLoaded">
        <div class="text-sm breadcrumbs font-bold">
            <ul>
                <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
                <li>Évènements</li> 
            </ul>
        </div>
        <div>
            <p class="font-bold text-xl py-10 flex items-center justify-center">{{ displayMode === 'all' ? 'Liste des évènements' : 'Évènements du ' + formatDate(selectedDate) }}</p>
            <p class="flex items-center justify-center">{{ filteredEvents.length }} résultat{{ filteredEvents.length > 1 ? 's' : '' }}</p>
            <div v-if="filteredEvents && filteredEvents.length > 0" class="flex flex-col justify-center items-center">
                <RouterLink v-for="event in filteredEvents" :key="event.evt_id" class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
                    <p class="font-bold md:text-xl flex items-center justify-center md:p-5 p-2 transition-all duration-200 ease-in-out">{{ formatDate(event.evt_datetime) }}</p>
                    <div class="flex flex-col w-5/6 items-start justify-center md:py-5 p-3">
                        <div class="flex items-start justify-start w-full md:flex-row flex-col transition-all duration-200 ease-in-out">
                            <span class="badge badge-warning min-w-fit transition-all duration-200 ease-in-out">{{ event.theme.evthm_name }}</span>
                            <p class="font-bold md:mx-3 transition-all duration-200 ease-in-out">{{ event.evt_name }}</p>
                        </div>
                        <p class="truncate overflow-hidden w-full whitespace-nowrap transition-all duration-200 ease-in-out">{{ event.evt_description }}</p>
                    </div>
                </RouterLink>
            </div>
            <div v-else class="flex items-center justify-center p-52">
                <p class="text-lg">{{ displayMode === 'all' ? 'Aucun évènement...' : 'Aucun évènement pour cette journée...' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { request } from '../composables/httpRequest';
import config from '../config';

const events = ref([]);
const filteredEvents = ref([]);
const route = useRoute();
const isLoaded = ref(false);
const selectedDate = ref(null); // Définissez la date sélectionnée initialement à null
const displayMode = ref('all'); // Initialisez displayMode à 'all'

function formatDate(date) {
    if (!date) return ''; // Gestion des dates null ou undefined
    const options = { day: '2-digit', month: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
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

watch(() => route.params, async (newParams, oldParams) => {
    const { year, month, day } = newParams;
    const newDate = year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : null;
    selectedDate.value = newDate;
    if (newDate) {
        displayMode.value = 'day';
        await fetchEventsByDay(newDate);
    } else {
        displayMode.value = 'all';
        await fetchEvents();
    }
});

onMounted(async () => {
    const { year, month, day } = route.params;
    const initialDate = year && month && day ? `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}` : null;
    selectedDate.value = initialDate;
    if (initialDate) {
        displayMode.value = 'day';
        await fetchEventsByDay(initialDate);
    } else {
        displayMode.value = 'all';
        await fetchEvents();
    }
});
</script>
