<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
            <li>Évènements</li> 
        </ul>
    </div>
    <p class="font-bold text-xl py-10 flex items-center justify-center">Liste des évènements</p>
    <div v-if="events && events.count > 0" class="flex flex-col justify-center items-center">
        <RouterLink v-for="event in events.events" class="hover:opacity-60 sm:w-2/3 w-full bg-base-300 my-2 flex overflow-hidden" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
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
        <p class="text-lg">Aucun évènements...</p>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';

    const events = ref([])

    function formatDate(date) {
      const options = { day: '2-digit', month: '2-digit' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    }

    async function fetch(){
        await request('GET', false, events, config.apiUrl+'api/event')
    }

    onMounted(fetch)
</script>