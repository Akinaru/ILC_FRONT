<template>
  <div>
    <TextEditor v-model="description"></TextEditor>
    <p>Contenu de l'éditeur : {{ description }}</p>
  </div>
</template>

<script setup>
  import TextEditor from '../components/utils/TextEditor.vue';
  import { ref } from 'vue';
  const description = ref('');
</script>
