<template>
    <div class="text-sm breadcrumbs" v-if="event">
        <ul>
            <li><a>Accueil</a></li> 
            <li><a>Évènement</a></li> 
            <li>{{ event.evt_name }}</li> 
        </ul>
        <p>Détail de l'evenement x</p>
        {{ event }}
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