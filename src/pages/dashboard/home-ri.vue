<template>
  <div v-if="isLoaded">
    <div v-if="events && events.count > 0" class="flex lg:flex-row flex-col">
      <!-- Calendrier -->
      <CalendarComp :events="events"></CalendarComp>

      <!-- Partie droite (actions, date limite) -->
      <div class="px-3 w-full">
        <div>
          <p>Vos 5 dernières actions:</p>
          <div v-if="limitedActions.length > 0" v-for="(action, index) in limitedActions" :key="index" class="flex py-2">
              <template v-if="getType(action.act_type)">
                <span class="min-w-32" :class="['badge', getType(action.act_type).color]">{{ getType(action.act_type).name }}</span>
              </template>
            <p class="ml-2">{{ action.act_date }}</p>
            <p class="ml-2">{{ action.act_description }}</p>
          </div>
          <div v-else>
            <p>Aucune action.</p>
          </div>
        </div>

        <!-- Date limite voeux -->
        <div class="flex items-center justify-center flex-col pt-5">
          <p>Date limite des voeux:</p>
          <div class="flex items-center justify-start bg-base-300 w-fit p-3">
            <div class="flex py-3 pr-3 ">
              <p class="font-bold">{{ formatDate(admin.adm_datelimite) }}</p>
              <p class="mx-2">{{ getJoursRestants(admin.adm_datelimite) }}</p>
            </div>
            <label for="modal_date" class="btn btn-primary hover:scale-105 transition-all hover:opacity-70">Modifier</label>


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
          <!-- Etapes -->
          <div class="w-fit flex items-center justify-center flex-col md:py-10">
                <p class="py-4">Avancement des étapes actuelles:</p>
                <ul class="steps steps-vertical sm:steps-horizontal max-w-lg">
                    <li class="step step-primary">Inscriptions</li>
                    <li class="step step-primary">Choix des voeux</li>
                    <li class="step" :class="{'step-primary' : joursRestants(admin.adm_datelimite) < 0}">Arbitrage</li>
                </ul>
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
import { getType } from '../../composables/actionType'
import { types } from '../../composables/actionType'
import LoadingComp from '../../components/utils/LoadingComp.vue';
import { addAlert } from '../../composables/addAlert';

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

function getJoursRestants(date){
  if(joursRestants(date) == 0){
    return "ajourd'hui";
  }
  else if(joursRestants(date) == 1){
    return 'demain';
  }
  else if(joursRestants(date) < 0){
    return 'il y a '+(-joursRestants(date)) + ' jour' + (-joursRestants(date) > 1 ? 's' : '');
  }
  return '('+ joursRestants(date) +' jours restants)';
}

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
  const selectedDate = new Date(modifDate.value);
  const currentDate = new Date();
  
  if (selectedDate < currentDate) {
    addAlert('error', { data: {error: 'Le jour que vous avez choisi est déjà passé. Action annulée.'} });
    modifDate.value = formatDateModif(admin.value.adm_datelimite);
    return;
  }
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
