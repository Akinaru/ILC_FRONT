<template>
    <div v-if="events && events.count > 0" class="flex">
      <CalendarComp :events="events"></CalendarComp>
      <div class="px-3">
        <p>Vos 5 dernières actions:</p>
        <div v-if="limitedActions.length > 0" v-for="(action, index) in limitedActions" :key="index" class="flex py-2">
          <span v-for="(type, typeIndex) in types" :key="typeIndex" class="flex items-center justify-center">
            <template v-if="type && type.condition && checkCondition(type.condition, action)">
              <span :class="['badge', type.color]">{{ type.name }}</span>
            </template>
          </span>
          <p class="ml-2">{{ action.act_description }}</p>
        </div>
        <div v-else>
            <p>Aucune action.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import CalendarComp from '../../components/utils/CalendarComp.vue';
  import { request } from '../../composables/httpRequest';
  import config from '../../config';
  import { useAccountStore } from '../../stores/accountStore';
  import { checkCondition } from '../../composables/actionType';
  import { types } from '../../composables/actionType';
  
  const accountStore = useAccountStore();
  const events = ref([]);
  const actions = ref([]);
  
  async function fetch() {
    await request('GET', false, events, config.apiUrl + 'api/event');
    await request('GET', false, actions, config.apiUrl + 'api/action/getbylogin/' + accountStore.login);
  }
  
  onMounted(fetch);
  
  const limitedActions = computed(() => {
    return actions.value.slice(0, 5);
  });
  </script>
  