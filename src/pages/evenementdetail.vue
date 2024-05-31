<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Accueil'}">Accueil</RouterLink></li> 
            <li><RouterLink :to="{name: 'Evenement'}">Évènements</RouterLink></li> 
            <li v-if="event && event.evt_id">{{ event.evt_name }}</li>
            <li v-else>?</li>
        </ul>
    </div>
    <div v-if="event && event.evt_id">
        <p>Détail de l'evenement x</p>
        {{ event }}
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

    onMounted(fetch)

</script>