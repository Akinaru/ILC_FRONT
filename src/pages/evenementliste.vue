<template>
    <div v-if="isLoaded">
        <div v-if="isValidDate">
            <div class="text-sm breadcrumbs font-bold">
                <ul>
                    <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
                    <li>Évènements</li> 
                </ul>
            </div>
            <p class="font-bold text-xl py-10 flex items-center justify-center">
                {{ displayMode === 'all' ? 'Liste des évènements' : 'Évènements du ' + formatDate(selectedDate) }}
            </p>
            <p class="flex items-center justify-center">
                {{ filteredEvents.length }} résultat{{ filteredEvents.length > 1 ? 's' : '' }}
            </p>
            <div v-if="filteredEvents && filteredEvents.length > 0" class="flex flex-col justify-center items-center">
                <RouterLink v-for="event in filteredEvents" :key="event.evt_id" class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
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
            <div v-else class="flex items-center justify-center p-52">
                <p class="text-lg">{{ displayMode === 'all' ? 'Aucun évènement...' : 'Aucun évènement pour cette journée...' }}</p>
            </div>
        </div>
        <div v-else>
            <p>La date passée en paramètre est incorrecte.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
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

function formatDate(date) {
    if (!date) return ''; 
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
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
</script>
