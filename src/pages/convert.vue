<template>
    <div>
      <input type="file" @change="UpdateCSVFile" accept=".csv" />
      <button @click="convertCsvToJson">Convertir en JSON</button>
      <div v-if="jsonObject">
        <h2>Contenu JSON :</h2>
        <pre>{{ jsonObject }}</pre>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { convertCSVToJson, checkCSVFile } from '../composables/csvConvert'
  
  let csvFile = null;
  let jsonObject = ref(null);
  
  const UpdateCSVFile = (event) => {
    const file = event.target.files[0];
    if(checkCSVFile(file)){
      csvFile = file;
    } else {
      alert('Veuillez sélectionner un fichier CSV valide.');
    }
  };
  
  const convertCsvToJson = () => {
    if (!csvFile) {
        alert('Veuillez d\'abord télécharger un fichier CSV.');
        return;
    }
    convertCSVToJson(jsonObject, csvFile);
  }
  </script>
  