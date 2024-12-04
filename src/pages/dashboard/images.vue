<template>
    <div class="w-full">
      <!-- Affichage des images -->
      <div v-for="(image, index) in images" :key="image.nom" class="relative mb-8">
        <div class="w-full h-24 sm:h-32 md:h-36 lg:h-44">
          <img 
            :src="config.apiUrl + 'images/' + image.nom + '.webp'"
            alt="Bannière"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Bouton d'édition -->
        <button 
          @click="openEditModal(index)"
          class="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
        >
          Modifier
        </button>
      </div>
  
      <!-- Modal d'édition -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-xl font-bold mb-4">Modifier la bannière</h2>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nouvelle image</label>
            <input 
              type="file" 
              @change="handleFileChange" 
              accept="image/webp"
              class="w-full border rounded p-2"
            >
          </div>
  
          <div class="flex justify-end gap-2">
            <button 
              @click="closeModal" 
              class="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Annuler
            </button>
            <button 
              @click="saveChanges" 
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import config from '../../config';
  
  const images = ref([
    { nom: 'banner_dest' },
    { nom: 'banner_art' },
    { nom: 'banner_evt' },
  ])
  
  const showModal = ref(false)
  const currentEditIndex = ref(null)
  const selectedFile = ref(null)
  
  const openEditModal = (index) => {
    currentEditIndex.value = index
    showModal.value = true
  }
  
  const closeModal = () => {
    showModal.value = false
    currentEditIndex.value = null
    selectedFile.value = null
  }
  
  const handleFileChange = (event) => {
    selectedFile.value = event.target.files[0]
  }
  
  const saveChanges = async () => {
    if (!selectedFile.value) {
      alert('Veuillez sélectionner une image')
      return
    }
  
    try {
      const formData = new FormData()
      formData.append('image', selectedFile.value)
      formData.append('nom', images.value[currentEditIndex.value].nom)
  
      // Appel API à implémenter
      const response = await fetch(`${config.apiUrl}update-banner`, {
        method: 'POST',
        body: formData
      })
  
      if (response.ok) {
        // Forcer le rechargement de l'image en ajoutant un timestamp
        const timestamp = new Date().getTime()
        images.value[currentEditIndex.value].timestamp = timestamp
        closeModal()
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      alert('Erreur lors de la modification : ' + error.message)
    }
  }
  </script>