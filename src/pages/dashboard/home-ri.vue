<template>
  <div v-if="isLoaded">
    <div v-if="events && events.count > 0" class="flex lg:flex-row flex-col">
      <!-- Calendrier -->
      <CalendarComp :events="events"></CalendarComp>
      <!-- Partie droite (actions, date limite) -->
      <div class="px-3">
        <div>
          <p>Vos 5 dernières actions:</p>
          <div v-if="limitedActions.length > 0" v-for="(action, index) in limitedActions" :key="index" class="flex py-2">
            <span v-for="(type, typeIndex) in types" :key="typeIndex" class="flex items-center justify-center">
              <template v-if="type && type.condition && checkCondition(type.condition, action)">
                <span :class="['badge', type.color]" class="min-w-32">{{ type.name }}</span>
              </template>
            </span>
            <p class="ml-2">{{ action.act_date }}</p>
            <p class="ml-2">{{ action.act_description }}</p>
          </div>
          <div v-else>
            <p>Aucune action.</p>
          </div>
        </div>
        <div>
          <p>Date limite des voeux:</p>
          <div class="flex items-center justify-start bg-base-300 w-fit p-2">
            <div class="flex py-3 pr-3 ">
              <p class="font-bold">{{ formatDate(admin.adm_datelimite) }}</p>
              <p class="mx-2">({{ joursRestants(admin.adm_datelimite) }} jour{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }})</p>
            </div>
            <label for="modal_date" class="btn btn-primary">Modifier</label>
            <!-- Modal modification date -->
            <input type="checkbox" id="modal_date" class="modal-toggle" />
            <div class="modal" role="dialog">
              <div class="modal-box">
                <h3 class="font-bold text-lg">Modification date limite</h3>
                <form @submit.prevent="confirmModifDate" class="w-full">
                  <input type="date" v-model="modifDate" class="input input-bordered w-full my-3">
                  <div class="modal-action">
                    <button type="submit">
                      <label for="modal_date" class="btn btn-success">Valider</label>
                    </button>  
                    <label for="modal_date" class="btn">Annuler</label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <LoadingComp></LoadingComp>
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
import LoadingComp from '../../components/utils/LoadingComp.vue';

const accountStore = useAccountStore();
const events = ref([]);
const actions = ref([]);
const admin = ref([]);
const isLoaded = ref(false);
const modifDate = ref(null);
const response = ref([]);

async function fetch() {
  isLoaded.value = false;
  await request('GET', false, events, config.apiUrl + 'api/event');
  await request('GET', false, actions, config.apiUrl + 'api/action/getbylogin/' + accountStore.login);
  await request('GET', false, admin, config.apiUrl + 'api/admin');
  modifDate.value = formatDateModif(admin.value.adm_datelimite);
  isLoaded.value = true;
}

onMounted(fetch);

const limitedActions = computed(() => {
  return actions.value.slice(0, 5);
});

function joursRestants(date) {
  const dateLimite = new Date(date);
  const currentDate = new Date();
  const timeDifference = dateLimite - currentDate;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function confirmModifDate(){
  const requestData = { 
    adm_datelimite: modifDate.value,
  };
  await request('PUT', true, response, config.apiUrl+'api/admin', requestData);
  if(response.value.status == 200){
        const requestDataAction = {
          act_description: 'Modification administration: Nouvelle date limite des voeux: '+formatDate(requestData.adm_datelimite),
          acc_id: accountStore.login,
          admin: 1
      }
      await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
  }
  fetch();
}

function formatDateModif(dateTime) {
   const date = new Date(dateTime);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
}

</script>
