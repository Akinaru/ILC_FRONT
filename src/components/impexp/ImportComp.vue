<template>
    <div>
      <button class="btn btn-info" @click="triggerFileInput">
        <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" id="import-left" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line">
          <polyline id="primary" points="15 13 11 13 11 9" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></polyline>
          <line id="primary-2" data-name="primary" x1="21" y1="3" x2="11" y2="13" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></line>
          <path id="primary-3" data-name="primary" d="M19,13.89V20a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V6A1,1,0,0,1,4,5h6.11" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;"></path>
        </svg>
        <p>{{ texte }}</p>
      </button>
      <input type="file" ref="fileInput" @change="handleFileUpload" accept=".csv" style="display: none;" />
    </div>
  </template>
  
  <script setup>
  import { ref, getCurrentInstance } from 'vue';
  import { convertCSVToJson, checkCSVFile } from '../../composables/csvConvert.js';
  import Papa from 'papaparse';
  
  const props = defineProps({
    texte: {
      type: String,
      default: 'Importer des étudiants en csv',
    },
  });
  
  const fileInput = ref(null);
  const result = ref([]);
 
  
  // Utilisation de getCurrentInstance pour obtenir l'objet emit
  const { emit } = getCurrentInstance();
  
  const triggerFileInput = () => {
    fileInput.value.click();
  };
  
  const handleFileUpload = (event) => {
  const file = event.target.files[0];

  if (checkCSVFile(file)) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        result.value = results.data;

        // Émet l'événement après que les données ont été mises à jour
        emit('csv-imported', result.value);
      },
      error: (error) => {
        console.error('Erreur lors de la conversion de CSV en JSON :', error);
      }
    });
  } else {
    console.error('Fichier non valide');
  }
};
  </script>
  