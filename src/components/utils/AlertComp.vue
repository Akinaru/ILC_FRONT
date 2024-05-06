<template>
  <div v-if="response">

      <div role="alert" :class="{'alert-success': !response.iserror, 'alert-error': response.iserror}" class="relative alert m-1 w-full overflow-hidden">
        <svg v-if="response.iserror" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span v-if="response.iserror">
          <p class="font-bold">{{ response.response.data.error }}</p>
          <p>{{ response.response.data.message }}</p>
        </span>
        <span v-else>
          <p class="font-bold">{{ response.response.message }}</p>
        </span>
        
          <div class="progress-bar w-full h-[4px] bg-black absolute bottom-0 left-0 opacity-50"></div> 
        
        <button @click="dismissAlert" class="ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
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
  
    const props = defineProps({
      response: Object,
    });

    const alertStore = useAlertStore();
  
    function dismissAlert() {
      alertStore.removeAlert(props.response.id);
    }
  
    function startTimer() {
      console.log(props.response.value);
      setTimeout(() => {
        dismissAlert();
      }, config.alertTimeBeforeRemove * 1000);
      document.documentElement.style.setProperty('--alert-time', config.alertTimeBeforeRemove + 's');
  
    }
  

    onMounted(startTimer);
  </script>
  
  <style scoped>
  .progress-bar {
    animation: progressBar var(--alert-time) linear forwards;
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