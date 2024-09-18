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
  return Object.values(row).every(value => !value || value.trim() === '');
};

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      resolve(arrayBuffer);
    };

    reader.onerror = (event) => {
      reject(new Error('Erreur de lecture du fichier'));
    };

    reader.readAsArrayBuffer(file); // Lire le fichier en ArrayBuffer
  });
};

const decodeArrayBuffer = (arrayBuffer) => {
  const decoder = new TextDecoder('utf-8'); // Utiliser TextDecoder pour l'encodage UTF-8
  return decoder.decode(arrayBuffer);
};

const parseCSV = (csvText) => {
  // Utiliser un séparateur robuste qui fonctionne avec les accents
  const rows = csvText.split('\n').map(row => row.trim()).filter(row => row.length > 0);
  const headers = rows[0].split(';').map(header => header.trim());
  
  // Assurez-vous que les indices correspondent à l'ordre désiré
  return rows.slice(1).map(row => {
    const columns = row.split(';').map(column => column.trim());
    return {
      'Pays': columns[0] || '',
      'Universite': columns[1] || '',
      'Ville': columns[2] || '',
      'Composante': columns[3] || '',
      'Lien': columns[4] || '',
      'Description': columns[5] || '',
      'Isced': columns[6] || '',
      'Nombre_de_place': columns[7] || '',
      'Type_accord': columns[8] || '',
      'Departements': columns[9] || ''
    };
  });
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (file && file.name.endsWith('.csv')) {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const fileContent = decodeArrayBuffer(arrayBuffer);
      const parsedData = parseCSV(fileContent);

      // Filtrer les lignes vides
      const filteredData = parsedData.filter(row => !isEmptyRow(row));

      // Variable pour garder la dernière valeur de Pays
      let lastCountry = '';

      // Réorganiser les colonnes, combiner ISCED, et compléter le Pays si vide
      result.value = filteredData.map((row) => {
        // Si la colonne "Pays" est vide, utiliser la dernière valeur connue
        if (!row.Pays || row.Pays.trim() === '') {
          row.Pays = lastCountry;
        } else {
          lastCountry = row.Pays;  // Mettre à jour avec la nouvelle valeur
        }

        return row;
      });

      // Émet l'événement après que les données ont été mises à jour
      emit('csv-imported', result.value);
    } catch (error) {
      console.error('Erreur lors de la lecture du fichier :', error);
    }
  } else {
    console.error('Fichier non valide');
  }
};
</script>
