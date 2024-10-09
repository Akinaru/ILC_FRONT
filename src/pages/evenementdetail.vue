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
        <span class="badge badge-warning">{{ event.theme.evthm_name }}</span>
        <div class="flex flex-col items-start justify-start my-10">
            <p class="">{{ formatDate(event.evt_datetime) }}</p>
            <p class="font-bold text-2xl">{{ event.evt_name }}</p>
        </div>
        <p class="text-xl py-5">{{ event.evt_description }}</p>
    </div>
    <div v-else class="h-full min-h-screen flex flex-col justify-center items-center">
            <p class="flex font-bold items-center justify-center text-xl md:text-2xl pb-10">Evenement introuvable...</p>
            <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-80 transition-all hover:scale-105">
                <button class="btn btn-primary">Revenir à l'accueil</button>
            </RouterLink>
            <div class="flex flex-col items-center space-y-4">
                <Vue3Lottie :animationData="notfound" :height="animationWidth" :width="animationWidth" />
            </div>
        </div>

</template>

<script setup>

    import { ref, onMounted, computed } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import { useRoute } from 'vue-router';
    import { Vue3Lottie } from 'vue3-lottie'
    import notfound from '../animations/notfound.json'

    const route = useRoute();
    const evt_id = route.params.evt_id;
    const event = ref([])

    async function fetch(){
        await request('GET', false, event, config.apiUrl+'api/event/getbyid/'+evt_id)
        document.title = `ILC - ${event.value.evt_name}`
    }

    function formatDate(date) {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    const screenWidth = ref(window.innerWidth)
    const animationWidth = computed(() => {
        // Ajuste la largeur en fonction de la taille de l'écran, avec une largeur minimale et maximale
        return Math.min(Math.max(screenWidth.value * 0.6, 200), 500)
    })

    onMounted(fetch)

</script>