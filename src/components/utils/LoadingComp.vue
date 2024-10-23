<template>
    <div class="min-h-screen flex items-center justify-center flex-col">
        <p class="p-3 font-bold select-none sm:text-2xl">Chargement des données en cours...</p>
        <Vue3Lottie :animationData="loading" :height="animationWidth" :width="animationWidth" />
    </div>
</template>

<script setup>
import { Vue3Lottie } from 'vue3-lottie'
import loading from '../../animations/loading.json'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

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