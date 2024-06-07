<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
            <li><RouterLink :to="{name: 'Evenement'}">Évènements</RouterLink></li> 
            <li v-if="event && event.evt_id">{{ event.evt_name }}</li>
            <li v-else>?</li>
        </ul>
    </div>
    <div v-if="event && event.evt_id" class="py-10">
        <p>{{ formatDate(event.evt_datetime) }}</p>
        <div class="flex items-center justify-start">
            <span class="badge badge-warning">{{ event.theme.evthm_name }}</span>
            <p class="font-bold text-3xl mx-3">{{ event.evt_name }}</p>
        </div>
        <p class="text-xl py-5">{{ event.evt_description }}</p>
    </div>
    <div v-else>
        <p class="flex font-bold items-center justify-center py-52">Évènement introuvable...</p>
    </div>

</template>

<script setup>

    import { ref, onMounted } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const evt_id = route.params.evt_id;
    const event = ref([])

    async function fetch(){
        await request('GET', false, event, config.apiUrl+'api/event/getbyid/'+evt_id)
    }

    function formatDate(date) {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    onMounted(fetch)

</script>