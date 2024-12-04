<template>
  <div v-if="response">
    <div
      role="alert"
      :class="{
        'border-t-green-500': response.status === 'message',
        'border-t-red-500': response.status === 'error',
        'border-t-blue-500': response.status === 'save',
      }"
      class="alert relative border-t-4 my-1 overflow-hidden drop-shadow-lg flex"
    >
      <div class="relative w-12 h-12 flex-shrink-0">
        <!-- Lottie icon for error -->
        <Vue3Lottie
          v-if="response.status === 'error'"
          :animationData="invalidIcon"
          class="absolute inset-0 transform scale-150"
        />
        
        <!-- Lottie icon for save -->
        <Vue3Lottie
          v-else-if="response.status === 'save'"
          :animationData="infoIcon"
          class="absolute inset-0 transform scale-150"
        />

        <!-- Lottie icon for success -->
        <Vue3Lottie
          v-else
          :animationData="validIcon"
          class="absolute inset-0 transform scale-150"
        />
      </div>

      <span v-if="response.status === 'error'">
        <p class="font-bold">{{ response.response.data.error }}</p>
        <p>{{ response.response.data.message }}</p>
      </span>
      <span v-if="response.status === 'save'">
        <p class="font-bold">{{ response.response.save }}</p>
        <p>{{ response.response.message }}</p>
      </span>
      <span v-else>
        <p class="font-bold">{{ response.response.message }}</p>
      </span>

      <div class="progress-bar w-full h-[4px] bg-black absolute bottom-0 left-0 opacity-50"></div>

      <button @click="dismissAlert" class="ml-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8 hover:opacity-70 transition-all" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { useAlertStore } from '../../stores/alertStore';
  import { onMounted } from 'vue';
  import config from '../../config';
  import { Vue3Lottie } from 'vue3-lottie';
  import valid from '../../animations/valid.json';
  const validIcon = valid;
  import invalid from '../../animations/invalid.json';
  const invalidIcon = invalid;
  import info from '../../animations/info.json';
  const infoIcon = info;

  const props = defineProps({
    response: Object,
  });

  const alertStore = useAlertStore();

  function dismissAlert() {
    alertStore.removeAlert(props.response.id);
  }

  function startTimer() {
    // Si duration est null, ne pas démarrer le timer
    if (props.response.duration === null) {
      return;
    }

    // Utiliser soit la durée spécifiée, soit la durée par défaut du config
    const duration = props.response.duration || config.alertTimeBeforeRemove;
    
    document.documentElement.style.setProperty('--alert-time', duration + 's');
    
    setTimeout(() => {
      dismissAlert();
    }, duration * 1000);
  }

  onMounted(startTimer);
</script>

<style scoped>
  .progress-bar {
    animation: progressBar var(--alert-time) linear forwards;
    /* Ne montrer la barre de progression que si une durée est définie */
    display: v-bind('props.response.duration === null ? "none" : "block"');
  }

  @keyframes progressBar {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
</style>