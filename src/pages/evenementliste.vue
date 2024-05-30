<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><a>Accueil</a></li> 
            <li>Évènement</li> 
        </ul>
    </div>
    <div v-if="events && events.count > 0" class="w-150 flex flex-col justify-center items-center bg-green-500">
        <RouterLink class="hover:opacity-65 flex my-2" v-for="(event, index) in events.events" :key="index" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
            <p class="p-5 flex items-center justify-center font-bold">{{ formatDate(event.evt_datetime) }}</p>
            <div class="flex flex-col items-start justify-between bg-base-300 p-2">
                <div class="flex items-center justify-between w-full">
                    <p class="font-bold">{{ event.evt_name }}</p>
                    <span class="badge min-w-fit">{{ event.theme.evthm_name }}</span>
                </div>
                <p class="bg-base-300 w-full truncate">{{ event.evt_description }}</p>
            </div>
        </RouterLink>
    </div>
    <div v-else>
        <p>Aucun évenements enregistrés.</p>
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