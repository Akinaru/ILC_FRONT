<template>
  <div>
    <button class="btn btn-info hover:scale-105 transition-all hover:opacity-70" @click="triggerFileInput">
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
import Papa from 'papaparse';

const props = defineProps({
  texte: {
    type: String,
    default: 'Importer des x en csv',
  },
});

const fileInput = ref(null);
const result = ref([]);

// Utilisation de getCurrentInstance pour obtenir l'objet emit
const { emit } = getCurrentInstance();

const triggerFileInput = () => {
  fileInput.value.click();
};

const isEmptyRow = (row) => {
  // Vérifier si tous les champs d'une ligne sont vides
  return Object.values(row).every(value => !value || value.trim() === '');
};

// Fonction pour lire le fichier CSV en tant que texte UTF-8
const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      resolve(text);
    };

    reader.onerror = (event) => {
      reject(new Error('Erreur de lecture du fichier'));
    };

    // Utiliser un TextDecoder pour forcer l'encodage UTF-8
    reader.readAsText(file, 'UTF-8');
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (file && file.name.endsWith('.csv')) {
    try {
      const fileContent = await readFileAsText(file);

      // Utiliser PapaParse pour analyser le contenu du fichier CSV
      Papa.parse(fileContent, {
  header: true,
  skipEmptyLines: false,
  dynamicTyping: true, // Convertit automatiquement les données en type approprié
  complete: (results) => {
    // Filtrer les lignes vides
    let parsedData = results.data.filter(row => !isEmptyRow(row));

    // Variable pour garder la dernière valeur de Pays
    let lastCountry = '';

    // Réorganiser les colonnes, combiner ISCED, et compléter le Pays si vide
    result.value = parsedData.map((row) => {
      // Si la colonne "Pays" est vide, utiliser la dernière valeur connue
      if (!row.Pays || row.Pays.trim() === '') {
        row.Pays = lastCountry;
      } else {
        lastCountry = row.Pays;  // Mettre à jour avec la nouvelle valeur
      }

      // Créer une nouvelle ligne avec les colonnes ordonnées
      return {
        'Pays': row.Pays || '',
        'Universite': row.Universite || '',
        'Ville': row.Ville || '',
        'Composante': row.Composante || '',
        'Lien': row.Lien || '',
        'Description': row.Description || '',
        'Isced': row.Isced,
        'Nombre_de_place': row['Nombre de place'] || '',
        'Type_accord': row['Type accord'] || '',
        'Departements': row['Departements'] || ''
      };
    });

    // Émet l'événement après que les données ont été mises à jour
    emit('csv-imported', result.value);
  },
  error: (error) => {
    console.error('Erreur lors de la conversion de CSV en JSON :', error);
  }
});
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier :', error);
    }
  } else {
    console.error('Fichier non valide');
  }
};
</script>
