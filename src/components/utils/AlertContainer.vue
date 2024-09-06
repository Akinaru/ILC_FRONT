<template>
    <div id="alert-container" class="fixed bottom-0 right-0 lg:w-5/12 md:w-1/2 w-full flex flex-col items-end ">
      <AlertComp v-for="alert in alerts" :key="alert.id" :response="alert" class="w-full" />
    </div>
</template>
  
<script setup>
  import { useAlertStore } from '../../stores/alertStore';
  import AlertComp from './AlertComp.vue';
  import { reactive } from 'vue';
  
  const alertStore = useAlertStore();

  const alerts = reactive(alertStore.alerts);
</script>
