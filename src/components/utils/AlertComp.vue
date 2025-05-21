<template>
  <div v-if="response" class="md:mb-4 md:mr-4">
    <div
      role="alert"
      :class="[
        'relative rounded-lg border-l-4 shadow-md p-4 pr-12 transition-all',
        response.status === 'message' && 'border-green-500 bg-green-50 text-green-800',
        response.status === 'error' && 'border-red-500 bg-red-50 text-red-800',
        response.status === 'save' && 'border-blue-500 bg-blue-50 text-blue-800',
      ]"
    >
      <!-- Contenu texte -->
      <div class="text-sm">
        <p class="font-bold">
          {{
            response.status === 'error'
              ? response.response.data.error
              : response.status === 'save'
              ? response.response.save
              : 'Succès'
          }}
        </p>
        <p class="mt-0.5">
          {{
            response.status === 'error'
              ? response.response.data.message
              : response.response.message
          }}
        </p>
      </div>

      <!-- Bouton de fermeture -->
      <button
        @click="dismissAlert"
        class="absolute top-1/2 -translate-y-1/2 right-3 text-xl text-black/30 hover:text-black/50"
      >
        &times;
      </button>

      <!-- Barre de progression -->
      <div
        class="progress-bar w-full h-[4px] absolute bottom-0 left-0 opacity-50"
        :class="{
          'bg-green-500': response.status === 'message',
          'bg-red-500': response.status === 'error',
          'bg-blue-500': response.status === 'save',
        }"
        :style="{ '--alert-time': duration + 's' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAlertStore } from '../../stores/alertStore';
import config from '../../config';

const props = defineProps({
  response: Object,
});

const alertStore = useAlertStore();

function dismissAlert() {
  alertStore.removeAlert(props.response.id);
}

const duration = props.response.duration ?? config.alertTimeBeforeRemove;

function startTimer() {
  if (props.response.duration === null) return;
  setTimeout(dismissAlert, duration * 1000);
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