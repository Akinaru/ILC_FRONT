<template>
  <div v-if="isLoaded">
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
                 class="flex items-start p-2 rounded-lg hover:bg-base-200 transition-colors flex-col">
              <div v-if="getType(action.act_type)" 
                   :class="['badge', getType(action.act_type).color, 'my-1']">
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
        <div class="bg-base-100 rounded-xl shadow-xl p-6">
          <div class="grid gap-6">
            <!-- Ligne 1: Les deux dates -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Date limite des voeux - Printemps -->
              <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-lg p-5 transition-all hover:shadow-md">
                <h3 class="text-lg font-medium mb-3 flex items-center">
                  <span class="mr-2">🌱</span> Date limite - Printemps
                </h3>
                <div class="flex flex-col items-center justify-center h-28">
                  <div class="text-2xl font-bold">{{ formatDate(admin.adm_datelimite) }}</div>
                  <div class="mt-2 badge" :class="joursRestants(admin.adm_datelimite) < 0 ? 'badge-error' : 'badge-success'">
                    {{ getJoursRestants(admin.adm_datelimite) }}
                  </div>
                  <label for="modal_date_printemps" class="btn btn-sm btn-primary mt-3 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifier
                  </label>
                </div>

                <!-- Modal modification date printemps -->
                <input type="checkbox" id="modal_date_printemps" class="modal-toggle" />
                <div class="modal" role="dialog">
                  <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification date limite - Printemps</h3>
                    <form @submit.prevent="confirmModifDate" class="w-full">
                      <input type="date" v-model="modifDate" class="input input-bordered w-full my-3">
                      <div class="modal-action">
                        <button type="submit">
                          <label for="modal_date_printemps" class="btn btn-success">Valider</label>
                        </button>
                        <label for="modal_date_printemps" class="btn">Annuler</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- Date limite des voeux - Automne -->
              <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-lg p-5 transition-all hover:shadow-md">
                <h3 class="text-lg font-medium mb-3 flex items-center">
                  <span class="mr-2">🍂</span> Date limite - Automne
                </h3>
                <div class="flex flex-col items-center justify-center h-28">
                  <div class="text-2xl font-bold">{{ formatDate(admin.adm_datelimite) }}</div>
                  <div class="mt-2 badge" :class="joursRestants(admin.adm_datelimite) < 0 ? 'badge-error' : 'badge-success'">
                    {{ getJoursRestants(admin.adm_datelimite) }}
                  </div>
                  <label for="modal_date_automne" class="btn btn-sm btn-primary mt-3 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifier
                  </label>
                </div>

                <!-- Modal modification date automne -->
                <input type="checkbox" id="modal_date_automne" class="modal-toggle" />
                <div class="modal" role="dialog">
                  <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification date limite - Automne</h3>
                    <form @submit.prevent="confirmModifDate" class="w-full">
                      <input type="date" v-model="modifDate" class="input input-bordered w-full my-3">
                      <div class="modal-action">
                        <button type="submit">
                          <label for="modal_date_automne" class="btn btn-success">Valider</label>
                        </button>
                        <label for="modal_date_automne" class="btn">Annuler</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ligne 2: Status Arbitrage étiré -->
            <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-lg p-5 transition-all hover:shadow-md">
              <h3 class="text-lg font-medium mb-3 flex items-center">
                <span class="mr-2">⚖️</span> Statut de l'arbitrage
              </h3>
              <div class="flex flex-col items-center justify-center py-4">
                <div class="text-center mb-4">
                  <div class="text-3xl font-bold" :class="admin.adm_arbitragetemporaire ? 'text-warning' : 'text-success'">
                    {{ admin.adm_arbitragetemporaire ? 'Temporaire' : 'Définitif' }}
                  </div>
                </div>

                <div class="form-control w-full max-w-xs">
                  <label class="label cursor-pointer justify-center gap-6">
                    <span class="label-text text-lg font-medium opacity-75">Temporaire</span>
                    <input type="checkbox"
                          class="toggle toggle-lg toggle-primary"
                          :checked="!admin.adm_arbitragetemporaire"
                          @change="updateArbitrageStatus" />
                    <span class="label-text text-lg font-medium opacity-75">Définitif</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
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
  await request('GET', false, actions, config.apiUrl + 'api/action/getfivebylogin/' + accountStore.account.acc_id);
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