<template>
  <div v-if="response">
    <div role="alert" :class="{'alert-success': response.status === 'message', 'alert-error': response.status === 'error', 'alert-info': response.status === 'save'}" class="relative alert my-1 overflow-hidden drop-shadow-lg flex">
      <div v-if="response.status === 'error'">
        <Vue3Lottie :animationData="infoIcon" :height="24" :width="24" />
      </div>
      <!-- <svg v-if="response.status === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg> -->

      <div v-else-if="response.status === 'save'">
        <Vue3Lottie :animationData="infoIcon" :height="24" :width="24" />
      </div>
      <!-- <svg v-else-if="response.status === 'save'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg> -->

      <div v-else>
        <Vue3Lottie :animationData="validIcon" :height="24" :width="24" />
      </div>
      <!-- <svg v-else xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg> -->


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
    import { Vue3Lottie } from 'vue3-lottie'
    import valid from '../../animations/valid.json'
    const validIcon = valid

    import invalid from '../../animations/invalid.json'
    const invalidIcon = invalid
    import info from '../../animations/info.json'
    const infoIcon = info
  
    const props = defineProps({
      response: Object,
    });

    const alertStore = useAlertStore();
  
    function dismissAlert() {
      alertStore.removeAlert(props.response.id);
    }
  
    function startTimer() {
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