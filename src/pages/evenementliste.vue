<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
            <li>Évènements</li> 
        </ul>
    </div>
    <p class="font-bold text-xl py-10 flex items-center justify-center">Liste des évènements</p>
    <div v-if="events && events.count > 0" class="flex flex-col justify-center items-center">
        <RouterLink v-for="event in events.events" class="hover:opacity-60 w-2/3 bg-base-300 my-2 flex overflow-hidden" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
            <p class="font-bold text-xl flex items-center justify-center p-5">{{ formatDate(event.evt_datetime) }}</p>
            <div class="flex flex-col w-5/6 items-start justify-center">
                <div class="flex items-center justify-start w-full">
                    <span class="badge min-w-fit">{{ event.theme.evthm_name }}</span>
                    <p class="font-bold mx-3">{{ event.evt_name }}</p>
                </div>
                <p class="truncate overflow-hidden w-full whitespace-nowrap">{{ event.evt_description }}</p>
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