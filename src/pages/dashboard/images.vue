<template>
  <div class="w-full">
    <!-- Affichage des images -->
    <div class="w-full">
      <div v-for="(image, index) in images" :key="image.name" class="relative mb-8">
        <!-- En-tête avec nom et boutons -->
        <div class="w-full flex justify-between items-center bg-base-200">
          <p class="px-3 font-bold">{{ image.vrainom }}</p>
          <div class="flex">
            <!-- Bouton de modification -->
            <button class="hover:opacity-70 p-5 hover:cursor-pointer bg-base-300" 
                    @click="openModifModal(image)">
              <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2"/>
                <polygon fill="none" 
                         points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                         stroke="currentColor" 
                         stroke-linecap="round" 
                         stroke-linejoin="round" 
                         stroke-width="2"/>
              </svg>
            </button>
            <button v-if="image.exists" class="hover:opacity-70 p-5 hover:cursor-pointer bg-base-300" @click="openConfirmModal(image)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
          </div>
        </div>

        <!-- Zone d'affichage de l'image -->
        <div class="w-full h-24 sm:h-32 md:h-36 lg:h-44 bg-base-200">
          <div class="w-full h-full relative">
            <!-- Image si elle existe -->
            <img v-if="image.exists"
              :src="`${config.apiUrl}api/image?path=${image.path}&name=${image.nom}`"
              :alt="image.name"
              class="w-full h-full object-cover"
            />
            <!-- Message si pas d'image -->
            <div v-else 
                 class="w-full h-full flex items-center justify-center">
              <div class="text-center">
                <span class="text-gray-500">Image non trouvée</span>
                <p class="text-sm text-gray-400 mt-2">Cliquez sur le bouton de modification pour ajouter une image</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations supplémentaires -->
        <div class="w-full bg-base-200 px-3 py-2 text-sm text-gray-500">
          <p v-if="image.lastModified">Dernière modification: {{ image.lastModified }}</p>
          <p v-if="image.extension">Format: {{ image.extension }}</p>
        </div>
      </div>
    </div>


      <!-- Modal de confirmation suppression -->
      <dialog id="confirmModal" ref="confirmModal" class="modal">
          <div class="modal-box">
              <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
              <div class="py-3">
                  <p>Confirmez vous la suppression de l'image:</p>
                  <!-- Affichage -->
                  <div>
                      <div class="p-2">
                          <div :style="{ backgroundImage: `url(${confirmDeleteImage.img_path ? config.apiUrl + confirmDeleteImage.img_path : config.apiUrl+'images/no_image.jpg'})` }" 
                              class="bg-cover bg-center w-full h-48">
                          </div>
                      </div>
                      <div class="p-4 flex flex-col justify-start">
                          <div class="mb-2">
                              <p class="font-bold text-xl">{{ confirmDeleteImage.img_name }}</p>
                              <p class="text-gray-600 text-sm">Dernière modif: {{ confirmDeleteImage.img_lastmodif }}</p>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="modal-action">
                  <button class="btn" @click="closeModal">Annuler</button>
                  <button class="btn btn-error" @click="removeImage(confirmDeleteImage.img_name, confirmDeleteImage.img_id)">Confirmer</button>
              </div>
          </div>
      </dialog>

      <!-- Modal de modification -->
      <dialog id="modifModal" ref="modifModal" class="modal">
          <div class="modal-box max-w-3xl">
              <h3 class="text-lg font-bold">Modifier l'image</h3>
              <h4>{{ currentImageModif.vrainom }} ({{ currentImageModif.nom }})</h4>
              <div class="py-3">
                  <!-- Prévisualisation de l'image -->
                  <div class="flex items-center justify-center">
                      <div :style="{ backgroundImage: `url(${isModifying ? backgroundImageModif : backgroundImage})` }" 
                          class="bg-cover bg-center w-full h-32 mb-4">
                      </div>
                  </div>
                  
                  <!-- Formulaire de modification -->
                  <div class="form-control w-full">
                      <input type="file" 
                            @change="handleFileInputChange" 
                            name="image" 
                            accept="image/*" 
                            class="file-input file-input-bordered w-full" />
                            
                      <p class="text-sm text-gray-500 mt-2">Format recommandé : 1920x400 pixels</p>
                  </div>
              </div>
              
              <div class="modal-action">
                  <button class="btn" @click="cancelModifImage">Annuler</button>
                  <button class="btn btn-success" @click="confirmModifImage">Enregistrer</button>
              </div>
          </div>
      </dialog>

      <!-- Modal de suppression -->
      <dialog id="deleteModal" ref="deleteModal" class="modal">
          <div class="modal-box max-w-3xl">
              <h3 class="text-lg font-bold">Supprimer l'image</h3>
              <h4>{{ currentImageDelete.vrainom }} ({{ currentImageDelete.nom }})</h4>
              <div class="py-3">
                  <!-- Prévisualisation de l'image -->
                  <div class="flex items-center justify-center">
                      <div :style="{ backgroundImage: `url(${backgroundImageDelete})` }" 
                          class="bg-cover bg-center w-full h-32 mb-4">
                      </div>
                  </div>
              </div>
              
              <div class="modal-action">
                  <button class="btn" @click="cancelDeleteImage">Annuler</button>
                  <button class="btn btn-success" @click="confirmSuprImage">Confirmer</button>
              </div>
          </div>
      </dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted  } from 'vue'
  import config from '../../config';
  import { request } from '../../composables/httpRequest';
    import { addAlert } from '../../composables/addAlert';

  
  const confirmDeleteImage = ref([]);
  const response = ref([]);
  const newImage = ref({ name: null, file: null });
  const imagePreview = ref(null);
  const isModifying = ref(false);
  const currentImageModif = ref({});
  const currentImageDelete = ref({});
  const imagePreviewModif = ref(null);
  const imagePreviewDelete = ref(null);

  const images = ref([
    { vrainom: 'Destinations Accueil', nom: 'banner_dest', path: 'private/images/site', exists: false },
    { vrainom: 'Articles Accueil', nom: 'banner_art', path: 'private/images/site', exists: false },
    { vrainom: 'Evenements Accueil', nom: 'banner_evt', path: 'private/images/site', exists: false },
  ]);

  const backgroundImage = computed(() => {
    return imagePreview.value ? imagePreview.value : `${config.apiUrl}images/no_image.jpg`;
  });

  const backgroundImageModif = computed(() => {
    return imagePreviewModif.value ? imagePreviewModif.value : 
        currentImageModif.value.img_path
        ? `${config.apiUrl}${currentImageModif.value.img_path}`
        : `${config.apiUrl}images/no_image.jpg`;
  });

  const backgroundImageDelete = computed(() => {
    return imagePreviewModif.value ? imagePreviewDelete.value : 
        currentImageDelete.value.img_path
        ? `${config.apiUrl}${currentImageDelete.value.img_path}`
        : `${config.apiUrl}images/no_image.jpg`;
  });

  async function fetchAll() {
    for (const image of images.value) {
        await request(
            'GET', 
            false, 
            response, 
            `${config.apiUrl}api/image?path=${image.path}&name=${image.nom}`
        );
        if (!response?.value?.error) {
            image.exists = true;
        } else {
            image.exists = false;
        }
    }
    isModifying.value = false;
}

  // Fermer le modal de confirmation de suppression
  function closeModal() {
      const modal = document.getElementById('confirmModal')
      modal.close()
  }

  // Gestion du changement d'image dans le formulaire
  const handleFileInputChange = (event) => {
    if(isModifying.value){
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreviewModif.value = e.target.result;
            };
            reader.readAsDataURL(file);
            currentImageModif.value.file = file;
        } else {
            imagePreviewModif.value = null;
            currentImageModif.value.file = null;
        }
      }else{
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.value = e.target.result;
            };
            reader.readAsDataURL(file);
            newImage.value.file = file;
        } else {
            imagePreview.value = null;
            newImage.value.file = null;
        }
      }

  };

  // Ouvrir le modal de modification
  function openModifModal(image) {
      currentImageModif.value = {...image}; // Clone l'objet image
      isModifying.value = true;
      const modal = document.getElementById('modifModal');
      modal.showModal();
  }

    // Ouvrir le modal de suppression
    function openConfirmModal(image) {
      currentImageDelete.value = {...image}; // Clone l'objet image
      const modal = document.getElementById('deleteModal');
      modal.showModal();
  }

  // Annuler la modification
  function cancelModifImage() {
      isModifying.value = false;
      currentImageModif.value = {};
      imagePreviewModif.value = null;
      const modal = document.getElementById('modifModal');
      modal.close();
  }

    // Annuler la suppression
    function cancelDeleteImage() {
      currentImageDelete.value = {};
      imagePreviewDelete.value = null;
      const modal = document.getElementById('deleteModal');
      modal.close();
  }

  // Confirmer la modification
  async function confirmModifImage() {

      try {
          // Si une nouvelle image a été sélectionnée
          if(currentImageModif.value.file) {

            try{
                const formData = new FormData();
              formData.append('image', currentImageModif.value.file);
              formData.append('fileName', currentImageModif.value.nom);
              formData.append('filePath', 'private/images/site');
              
              await request('POST', true, response, config.apiUrl + 'api/image/upload', formData);   
           } catch (error){
               console.log("Erreur ajout image: "+error)
           }


          }
          
          if(response.value.status === 200) {

              await fetchAll();
              cancelModifImage();
          }
      } catch (error) {
          console.log("Erreur modification image: " + error);
          addAlert('error', {data:{error: error, message:'Erreur lors de la modification de l\'image.'}});
      }
  }

  // Confirmer la modification
  async function confirmSuprImage() {

try {
    // Si une nouvelle image a été sélectionnée
    if(currentImageDelete.value) {

      try{
        
        var requestData = {
          'fileName': currentImageDelete.value.nom,
          'filePath': 'private/images/site'
        }

        await request('DELETE', true, response, config.apiUrl + 'api/image', requestData);   
     } catch (error){
         console.log("Erreur ajout image: "+error)
     }


    }
    
    if(response.value.status === 200) {

        await fetchAll();
        cancelModifImage();
    }
} catch (error) {
    console.log("Erreur modification image: " + error);
    addAlert('error', {data:{error: error, message:'Erreur lors de la modification de l\'image.'}});
}
}

  onMounted(fetchAll);

  </script>