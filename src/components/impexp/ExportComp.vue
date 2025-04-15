<template>
    <a :href="link" class="btn btn-outline btn-primary flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="stroke-current" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>{{ texte }}</span>
    </a>
  </template>

<script setup>

  
    const props = defineProps({
      texte: String,
      link: String
    });


</script>