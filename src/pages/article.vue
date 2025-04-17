<template>
    <div class="max-w-7xl mx-auto px-4 py-8" v-if="isLoaded">
      <div v-if="article && article.art_id" class="card bg-base-100 shadow-xl overflow-hidden">
        <!-- Navigation -->
        <div class="bg-base-200 px-6 py-3">
          <div class="text-sm breadcrumbs font-bold">
            <ul>
              <li><RouterLink class="text-primary hover:text-primary-focus transition-colors" :to="{name: 'Accueil'}">Accueil</RouterLink></li>
              <li><RouterLink class="text-primary hover:text-primary-focus transition-colors" :to="{name: 'Articles'}">Articles</RouterLink></li>
              <li class="">{{ article.art_title }}</li>
            </ul>
          </div>
        </div>
        
        <!-- Header with Image -->
        <div class="relative">
          <div class="w-full h-80 md:h-120 overflow-hidden" @click="afficherLightbox">
            <img 
              class="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105" 
              :src="article.art_image ? config.apiUrl+'api/article/image/'+article.art_id : config.apiUrl+'images/no_image.jpg'" 
              alt=""
            >
          </div>
          
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 class="font-bold text-3xl md:text-4xl text-white mb-2">{{ article.art_title }}</h1>
            <p class="text-gray-200 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dernière modification: {{ formatDate(article.art_lastmodif) }}
            </p>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-8">
          <div id="description" v-html="article.art_description"></div>
        </div>
        
        <!-- Footer -->
        <div class="bg-base-200 px-6 py-4 border-t border-base-300">
          <div class="flex justify-between items-center">
            <div class="text-sm text-base-content opacity-70">
              ILC - {{ new Date().getFullYear() }}
            </div>
            <div class="flex space-x-4">
              <button @click="shareArticle" class="btn btn-ghost btn-sm gap-2 normal-case">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager
              </button>
              <button @click="printArticle" class="btn btn-ghost btn-sm gap-2 normal-case">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-base-content opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-4 font-bold text-xl text-base-content">Article introuvable...</p>
          <p class="mt-2 text-base-content opacity-70">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <RouterLink :to="{name: 'Articles'}" class="btn btn-primary mt-6">
            Retour aux articles
          </RouterLink>
        </div>
      </div>
    </div>
    <div v-else class="min-h-screen">
      <LoadingComp></LoadingComp>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { request } from '../composables/httpRequest';
  import config from '../config';
  import LoadingComp from '../components/utils/LoadingComp.vue';
  
  const route = useRoute();
  const art_id = route.params.art_id;
  const article = ref([]);
  const isLoaded = ref(false);
  
  // Formater la date pour un affichage plus convivial
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('fr-FR', options).replace(',', ' à');
  }
  
// Fonction pour partager l'article (copier le lien)
function shareArticle() {
  // Copier le lien dans le presse-papiers
  navigator.clipboard.writeText(window.location.href)
    .then(() => {
      alert("Lien copié dans le presse-papiers!");
    })
    .catch(err => {
      console.error("Erreur lors de la copie:", err);
    });
}

// Fonction pour imprimer l'article
function printArticle() {
  window.print();
}

  async function fetchAll() {
    isLoaded.value = false;
    await request('GET', false, article, config.apiUrl+'api/article/getbyid/'+art_id);
    document.title = `ILC - ${article.value.art_title || 'Article non trouvé'}`;
    isLoaded.value = true;
  }
  
  onMounted(fetchAll);

  //Fonction pour afficher l'image en entier
  function create(tag, container, text=null){
    let element = document.createElement(tag)
    if (text)
      element.innerHTML = text
    container.appendChild(element)
    return element
  }

  function afficherLightbox(){
    const app = document.querySelector("#app")
    let bg = create("div", app)
    bg.id = "bg"

    let box = create("div", bg)
    box.id = "box"
    box.classList.add("shadow-xl","bg-base-200")

    let newImage = create("img", box)
    newImage.src = article.value.art_image ? config.apiUrl+'api/article/image/'+art_id : config.apiUrl+'images/no_image.jpg'

    let closeButton = create("div", box, "X")
    closeButton.id = "close"

    function remove(){
      box.classList.add("out")
      setTimeout(function(){
        bg.remove()
      }, 800)
    }

    closeButton.addEventListener("click", function(){
      remove()
    })

    box.addEventListener("click", function(event){
      event.stopPropagation()
    })

    bg.addEventListener("click", function(event){
      remove()
    })

    app.addEventListener("keyup", function(event){
      if(event.key == "Escape")
        remove()
    })
  }
  </script>
  
  <style scoped>
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .breadcrumbs {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  /* Hauteur personnalisée pour les images */
  @media (min-width: 768px) {
    .h-120 {
      height: 30rem;
    }
  }
  </style>

  
<style>
#bg{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
}

#box{
  margin: calc(10vh - 20px) auto;
  margin-top: 120px;
  padding: 20px;
  width: fit-content;
  border-radius: 1rem;
  position: relative;
  transition: all 1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 80vw;
}

#box.out{
  transform: translateY(-100vh);
}

#box img{
  max-height: 100%;
  max-width: 100%;
}

#close{
  position: absolute;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, .8);
  box-shadow: 0 0 2px black;
  color: #888888;
  font-family: sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: all .5s ease;
}

#close:hover{
  background-color: rgba(255, 255, 255, 1);
  color: #333333;
  box-shadow: 0 0 4px black;
  transform: scale(1.1);
}
</style>