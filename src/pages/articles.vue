<template>
    <div class="max-w-8xl mx-auto px-4 py-6">
      <div v-if="isLoaded">
        <!-- Fil d'Ariane -->
        <div class="bg-base-200 rounded-lg px-6 py-3 mb-6">
          <div class="text-sm breadcrumbs font-bold">
            <ul>
              <li><RouterLink class="text-primary hover:text-primary-focus transition-colors" :to="{name: 'Accueil'}">Accueil</RouterLink></li>
              <li>Articles</li>
            </ul>
          </div>
        </div>
  
        <!-- Titre -->
        <div class="text-center mb-8">
          <h1 class="font-bold text-2xl md:text-3xl">Liste des articles</h1>
          <div class="mt-2 w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
  
        <!-- Liste des articles -->
        <div v-if="articles && articles.articles" class="py-5">
          <div v-if="articles.count > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Carte d'article -->
            <RouterLink 
              v-for="(article, index) in filteredArticles" 
              :key="index" 
              :to="{name: 'Article', params: {art_id: article.art_id}}" 
              class="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102 w-full"
            >
              <!-- Image de couverture -->
              <figure class="relative">
                <div 
                  :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl+'images/no_image.jpg'})` }" 
                  class="bg-cover bg-center w-full h-56"
                ></div>
                <span v-if="article.art_pin" class="badge badge-primary badge-lg absolute top-3 left-3 shadow-md gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Épinglé
                </span>
              </figure>
              
              <!-- Contenu de la carte -->
              <div class="card-body">
                <h2 class="card-title line-clamp-2">{{ article.art_title }}</h2>
                <div class="text-sm text-base-content/70 mb-3 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(article.art_lastmodif) }}
                </div>
                <div class="overflow-hidden line-clamp-3 text-sm" v-html="article.art_description"></div>
                <div class="card-actions justify-end mt-4">
                  <button class="btn btn-primary btn-sm">Lire l'article</button>
                </div>
              </div>
            </RouterLink>
          </div>
          
          <!-- Message si aucun article -->
          <div v-else class="card bg-base-100 shadow-xl p-10 text-center">
            <div class="flex flex-col items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-lg font-medium">Aucun article n'a été trouvé.</p>
              <p class="text-base-content/70">Revenez bientôt pour découvrir nos nouveaux contenus.</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Écran de chargement -->
      <div v-else class="min-h-screen">
        <LoadingComp></LoadingComp>
      </div>
    </div>
  </template>
  
  <script setup>
  import LoadingComp from '../components/utils/LoadingComp.vue';
  import { request } from '../composables/httpRequest';
  import config from '../config';
  import { onMounted, ref, computed } from 'vue';
  
  const articles = ref([]);
  const isLoaded = ref(false);
  
  // Filtrer les articles selon leur date de sortie
  const filteredArticles = computed(() => {
    if (!articles.value || !articles.value.articles) return [];
    
    return articles.value.articles.filter(article => {
      if (!article.art_datesortie) return true; // si pas de date, on affiche
      return new Date(article.art_datesortie) <= new Date(); // sinon on compare avec maintenant
    });
  });
  
  // Formater la date pour un affichage plus convivial
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    };
    
    return date.toLocaleDateString('fr-FR', options);
  }
  
  async function fetch() {
    isLoaded.value = false;
    await request('GET', false, articles, config.apiUrl + 'api/article');
    document.title = 'ILC - Articles';
    isLoaded.value = true;
  }
  
  onMounted(fetch);
  </script>
  
  <style scoped>
  /* Animations et styles spécifiques */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .scale-102 {
    transform: scale(1.02);
  }
  
  /* Limite des lignes (extrait d'article) */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Personnalisation de la largeur maximale */
  @media (min-width: 1280px) {
    .max-w-8xl {
      max-width: 90rem;
    }
  }
  </style>