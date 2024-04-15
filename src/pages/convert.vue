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
  import Papa from 'papaparse';
  import { ref } from 'vue';
  
  let csvFile = null;
  let jsonObject = ref(null);
  
  const UpdateCSVFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
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
        
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        jsonObject.value = results.data;
      },
      error: (error) => {
        console.error('Erreur lors de la conversion de CSV en JSON :', error);
      }
    });
  };
  </script>
  