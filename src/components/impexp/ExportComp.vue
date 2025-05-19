<template>
  <button
    @click="exportData"
    class="btn btn-outline btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="stroke-current" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
    <span>{{ texte }}</span>
  </button>
</template>

<script setup>
import axios from 'axios';

const props = defineProps({
  texte: String,
  link: String
});

const exportData = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(props.link, {
      responseType: 'blob', // important pour le CSV
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'export.csv'; // nom du fichier
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    alert('Erreur lors de l’export : accès refusé ou serveur indisponible.');
  }
};
</script>