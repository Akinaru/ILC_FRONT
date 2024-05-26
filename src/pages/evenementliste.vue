<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><a>Accueil</a></li> 
            <li>Évènement</li> 
        </ul>
    </div>
    Liste des events
    <div v-if="events && events.count > 0" v-for="(event, index) in events.events" :key="index">
        <RouterLink class="btn btn-error" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">{{ event.evt_name }}</RouterLink>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';

    const events = ref([])

    async function fetch(){
        await request('GET', false, events, config.apiUrl+'api/event')
    }

    onMounted(fetch)
</script>