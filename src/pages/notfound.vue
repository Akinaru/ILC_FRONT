<template>
    <div class="w-full h-screen flex flex-col items-center justify-center space-y-4">
      <p class="text-3xl font-bold">Désolé, page introuvable</p>
      <p class="pb-7">La page que vous avez demandée est introuvable.</p>
      <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-80 transition-all hover:scale-105">
          <button class="btn btn-primary">Revenir à l'accueil</button>
        </RouterLink>

      <div class="flex flex-col items-center space-y-4">
        <Vue3Lottie :animationData="notFound" :height="animationWidth" :width="animationWidth" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { Vue3Lottie } from 'vue3-lottie'
  import notfound from '../animations/notfound.json'
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  
  const notFound = notfound
  
  const screenWidth = ref(window.innerWidth)
  
  const updateDimensions = () => {
    screenWidth.value = window.innerWidth
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateDimensions)
    // Initial calculation
    updateDimensions()
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDimensions)
  })
  
  const animationWidth = computed(() => {
    // Ajuste la largeur en fonction de la taille de l'écran, avec une largeur minimale et maximale
    return Math.min(Math.max(screenWidth.value * 0.6, 200), 500)
  })
  </script>
  