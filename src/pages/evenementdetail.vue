<template>
    <div v-if="isLoaded" class="container mx-auto px-4 py-6">
      <!-- Fil d'Ariane -->
      <div class="text-sm breadcrumbs font-bold mb-6">
        <ul>
          <li><RouterLink :to="{name: 'Accueil'}" class="hover:text-primary">Accueil</RouterLink></li> 
          <li><RouterLink :to="{name: 'Evenement'}" class="hover:text-primary">Évènements</RouterLink></li> 
          <li v-if="event && event.evt_id" class="text-primary">{{ event.evt_name }}</li>
          <li v-else class="text-gray-400">?</li>
        </ul>
      </div>
      
      <!-- Contenu de l'événement -->
      <div v-if="event && event.evt_id" class="bg-white rounded-lg shadow-md p-6 md:p-8">
        <!-- En-tête avec badge de thème -->
        <div class="flex justify-between items-start mb-4">
          <span :class="`badge text-xs font-semibold px-3 py-1 badge-${event.theme.evthm_color || 'neutral'}`">
          {{ event.theme.evthm_name }}
        </span>
          <p class="text-gray-600">{{ formatDate(event.evt_datetime) }}</p>
        </div>
        
        <!-- Titre de l'événement -->
        <h1 class="font-bold text-2xl md:text-3xl text-gray-800 mb-6">{{ event.evt_name }}</h1>
        
        <!-- Description de l'événement -->
        <div class="prose max-w-none">
          <p class="text-lg md:text-xl text-gray-700">{{ event.evt_description }}</p>
        </div>
      </div>
      
      <!-- Page événement non trouvé -->
      <div v-else class="min-h-[70vh] flex flex-col justify-center items-center">
        <div class="bg-white rounded-lg shadow-md p-8 text-center max-w-lg w-full">
          <p class="font-bold text-xl md:text-2xl text-gray-800 mb-6">Evenement introuvable...</p>
          <RouterLink :to="{ name: 'Accueil' }" class="inline-block">
            <button class="btn btn-primary hover:opacity-90 transition-all hover:scale-105">
              Revenir à l'accueil
            </button>
          </RouterLink>
          <div class="mt-6">
            <Vue3Lottie :animationData="notfound" :height="animationWidth" :width="animationWidth" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading component -->
    <div v-else class="min-h-screen">
      <LoadingComp></LoadingComp>
    </div>
  </template>

<script setup>

    import { ref, onMounted, computed } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import { useRoute } from 'vue-router';
    import { Vue3Lottie } from 'vue3-lottie'
    import notfound from '../animations/notfound.json'
    import LoadingComp from '../components/utils/LoadingComp.vue';

    const isLoaded = ref(false);
    const route = useRoute();
    const evt_id = route.params.evt_id;
    const event = ref([])

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, event, config.apiUrl+'api/event/getbyid/'+evt_id)
        document.title = `ILC - ${event.value.evt_name}`
        isLoaded.value = true;
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