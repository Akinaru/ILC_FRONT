<template>
    <div id="alert-container" class="fixed bottom-0 right-0 w-3/7 flex flex-col items-end">
      <AlertComp v-for="alert in alerts" :key="alert.id" :response="alert" />
    </div>
</template>
  
<script setup>
  import { useAlertStore } from '../../stores/alertStore';
  import AlertComp from './AlertComp.vue';
  import { reactive } from 'vue';
  
  const alertStore = useAlertStore();

  const alerts = reactive(alertStore.alerts);
</script>
