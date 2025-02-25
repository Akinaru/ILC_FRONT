<template>
  <div v-if="isLoaded" class="container">
    <div v-if="events && events.count > 0" class="flex flex-col lg:flex-row gap-6">
      <!-- Calendrier - largeur naturelle -->
      <div class="bg-base-100 rounded-xl shadow-md p-4 lg:w-auto flex-shrink-0">
        <h2 class="text-xl font-semibold mb-4">Calendrier des événements</h2>
        <CalendarComp :events="events"></CalendarComp>
      </div>

      <!-- Partie droite (largeur flexible) -->
      <div class="lg:flex-1 space-y-6">
        <!-- Section des dernières actions -->
        <div class="bg-base-100 rounded-xl shadow-md p-4">
          <h2 class="text-xl font-semibold mb-4">Vos 5 dernières actions</h2>
          
          <div v-if="limitedActions.length > 0" class="space-y-2">
            <div v-for="(action, index) in limitedActions" :key="index" 
                 class="flex items-start p-2 rounded-lg hover:bg-base-200 transition-colors">
              <div v-if="getType(action.act_type)" 
                   :class="['badge', getType(action.act_type).color, 'mr-3 mt-1']">
                {{ getType(action.act_type).name }}
              </div>
              <div>
                <div class="text-sm opacity-70">{{ action.act_date }}</div>
                <div>{{ action.act_description }}</div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-4 italic opacity-70">
            Aucune action récente.
          </div>
        </div>

        <!-- Section date limite et arbitrage -->
        <div class="bg-base-100 rounded-xl shadow-md p-4">
          <div class="grid md:grid-cols-2 gap-4">
            <!-- Date limite des voeux -->
            <div class="bg-base-200 rounded-lg p-4">
              <h3 class="text-lg font-medium mb-2">Date limite des voeux</h3>
              <div class="flex flex-col items-center justify-center h-24">
                <div class="text-2xl font-bold">{{ formatDate(admin.adm_datelimite) }}</div>
                <div class="mt-1 text-sm" :class="joursRestants(admin.adm_datelimite) < 0 ? 'text-error' : 'text-success'">
                  {{ getJoursRestants(admin.adm_datelimite) }}
                </div>
                <label for="modal_date" class="btn btn-sm btn-primary mt-2">
                  Modifier
                </label>
              </div>

              <!-- Modal modification date -->
              <input type="checkbox" id="modal_date" class="modal-toggle" />
              <div class="modal" role="dialog">
                <div class="modal-box">
                  <h3 class="font-bold text-lg">Modification de la date limite</h3>
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

            <!-- Status Arbitrage -->
            <div class="bg-base-200 rounded-lg p-4">
              <h3 class="text-lg font-medium mb-2">Statut de l'arbitrage</h3>
              <div class="flex items-center justify-between py-4">
                <div class="flex flex-col items-center">
                  <span class="font-medium" :class="admin.adm_arbitragetemporaire ? 'text-warning' : 'opacity-50'">
                    Temporaire
                  </span>
                  <div class="h-3 w-3 rounded-full border-2 border-warning mt-1"
                       :class="admin.adm_arbitragetemporaire ? 'bg-warning' : ''"></div>
                </div>
                
                <input type="checkbox" 
                       class="toggle toggle-lg toggle-primary" 
                       :checked="!admin.adm_arbitragetemporaire"
                       @change="updateArbitrageStatus" />
                       
                <div class="flex flex-col items-center">
                  <span class="font-medium" :class="!admin.adm_arbitragetemporaire ? 'text-success' : 'opacity-50'">
                    Définitif
                  </span>
                  <div class="h-3 w-3 rounded-full border-2 border-success mt-1"
                       :class="!admin.adm_arbitragetemporaire ? 'bg-success' : ''"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section étapes -->
        <div class="bg-base-100 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4 text-center">Avancement du processus</h2>
          <ul class="steps steps-vertical sm:steps-horizontal w-full">
            <li class="step step-primary">Inscriptions</li>
            <li class="step step-primary">Choix des voeux</li>
            <li class="step" :class="{'step-primary': joursRestants(admin.adm_datelimite) < 0}">Arbitrage</li>
          </ul>
        </div>
        
        <!-- Sauvegarde de base de données (version simplifiée) -->
        <div class="bg-base-100 rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Maintenance</h2>
          <div class="flex flex-col">
            <div class="bg-base-200 rounded-lg p-4">
              <h3 class="text-lg font-medium mb-2">Sauvegarde de la base de données</h3>
              
              <button 
                @click="backupDatabase" 
                class="btn btn-primary"
                :class="{ 'opacity-60': isBackingUp }"
                :disabled="isBackingUp"
              >
                <span v-if="isBackingUp" class="loading loading-spinner loading-sm mr-2"></span>
                <i class="mr-2">💾</i>
                {{ isBackingUp ? 'Sauvegarde en cours...' : 'Sauvegarder la base de données' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center items-center min-h-screen">
    <LoadingComp></LoadingComp>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import CalendarComp from '../../components/utils/CalendarComp.vue';
import { request } from '../../composables/httpRequest';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import { getType } from '../../composables/actionType';
import LoadingComp from '../../components/utils/LoadingComp.vue';
import { addAlert } from '../../composables/addAlert';

const accountStore = useAccountStore();
const events = ref([]);
const actions = ref([]);
const admin = ref([]);
const isLoaded = ref(false);
const modifDate = ref(null);
const response = ref([]);

// Variables simplifiées pour la sauvegarde
const isBackingUp = ref(false);
const backupSuccess = ref(false);

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

async function updateArbitrageStatus(event) {
  const requestData = {
    adm_id: admin.value.adm_id,
    adm_arbitragetemporaire: !event.target.checked
  };
  
  await request('PUT', true, response, config.apiUrl + 'api/admin/arbitrage', requestData);
  if(response.value.status == 200) {
    await request('GET', false, admin, config.apiUrl + 'api/admin');
  }
}

// Fonction simplifiée pour la sauvegarde de la base de données
async function backupDatabase() {
  if (isBackingUp.value) return;
  
  isBackingUp.value = true;
  
  try {
    const backupResp = ref([]);
    await request('POST', true, backupResp, config.apiUrl + 'api/admin/database');
    
    if (backupResp.value && backupResp.value.status === 200) {
      backupSuccess.value = true;
    } else {
      backupSuccess.value = false;
    }
  } catch (error) {
    backupSuccess.value = false;
  } finally {
    isBackingUp.value = false;
  }
}

function getJoursRestants(date){
  if(joursRestants(date) == 0){
    return "aujourd'hui";
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
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
  await request('PUT', false, response, config.apiUrl+'api/admin/date', requestData);
  if(response.value.status == 200){
    await request('GET', false, admin, config.apiUrl + 'api/admin');
  }
}

function formatDateModif(dateTime) {
   const date = new Date(dateTime);
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const day = String(date.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
}
</script>