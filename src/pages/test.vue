<template>
    <div class="flex flex-col items-center">
      <!-- Liste des accords favoris -->
      <div class="w-full flex justify-center py-2">
        <button
          v-for="accord in accordsFavoris"
          :key="accord.id"
          class="btn btn-primary mx-1"
          @click="selectAccord(accord)"
        >
          {{ accord.name }}
        </button>
      </div>
  
      <!-- Grille des voeux -->
      <div class="grid grid-cols-2 gap-4 w-full p-4">
        <div
          v-for="(voeu, index) in voeux"
          :key="index"
          class="w-full p-4 border-2 border-gray-300 flex flex-col items-center justify-center"
        >
          <p v-if="voeu">{{ voeu.name }}</p>
          <button
            class="btn btn-outline"
            @click="openAccordSelection(index)"
          >
            {{ voeu ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </div>
  
      <!-- Modal pour sélection des accords -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-4 rounded shadow-lg">
          <h2 class="font-bold text-lg mb-4">Sélectionnez un accord</h2>
          <button
            v-for="accord in accordsFavoris"
            :key="accord.id"
            class="btn btn-primary my-1"
            @click="assignAccordToVoeux(accord)"
          >
            {{ accord.name }}
          </button>
          <button class="btn btn-secondary mt-4" @click="closeModal">Annuler</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';

const accordsFavoris = ref([
  { id: 1, name: 'Accord A' },
  { id: 2, name: 'Accord B' },
  { id: 3, name: 'Accord C' },
  // Ajoutez plus d'accords ici
]);

const voeux = ref([null, null, null, null, null, null]);

const showModal = ref(false);
const currentVoeuxIndex = ref(null);

const openAccordSelection = (index) => {
  currentVoeuxIndex.value = index;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentVoeuxIndex.value = null;
};

const assignAccordToVoeux = (accord) => {
  if (currentVoeuxIndex.value !== null) {
    voeux.value[currentVoeuxIndex.value] = accord;
    closeModal();
  }
};
</script>
