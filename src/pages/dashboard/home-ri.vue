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
                  <div class="text-2xl font-bold">{{ formatDate(admin.adm_datelimite_printemps) }}</div>
                  <div
                    class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    :class="joursRestants(admin.adm_datelimite_printemps) < 0 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : 'bg-green-100 text-green-800 border border-green-300'"
                  >
                    <svg
                      v-if="joursRestants(admin.adm_datelimite_printemps) < 0"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ getJoursRestants(admin.adm_datelimite_printemps) }}
                  </div>
                  <label for="modal_date_printemps" class="btn btn-sm btn-primary mt-3 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifier
                  </label>
                </div>

                <!-- Modal modification date printemps -->
                <Teleport to="body">
                  <input type="checkbox" id="modal_date_printemps" class="modal-toggle" />
                  <div class="modal" role="dialog">
                    <div class="modal-box max-w-md rounded-2xl shadow-xl border border-base-300">
                      
                      <!-- Titre -->
                      <h3 class="text-xl font-bold text-primary">
                        Modification de la date limite – Printemps
                      </h3>

                      <!-- Description -->
                      <p class="text-sm text-base-content/70 mt-2">
                        Définissez une nouvelle date limite pour les candidatures du semestre de printemps.
                      </p>

                      <!-- Séparateur -->
                      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

                      <!-- Formulaire -->
                      <form @submit.prevent="confirmModifDate('printemps')" class="space-y-4">
                        <label class="form-control w-full">
                          <div class="label">
                            <span class="label-text font-medium">Nouvelle date</span>
                          </div>
                          <input type="date" v-model="modifDatePrintemps" class="input input-bordered w-full" />
                        </label>

                        <!-- Actions -->
                        <div class="modal-action">
                          <label for="modal_date_printemps" class="btn btn-ghost">Annuler</label>
                          <button type="submit">
                            <label for="modal_date_printemps" class="btn btn-primary">Valider</label>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Teleport>

              </div>

              <!-- Date limite des voeux - Automne -->
              <div class="bg-gradient-to-br from-base-200 to-base-300 rounded-lg p-5 transition-all hover:shadow-md">
                <h3 class="text-lg font-medium mb-3 flex items-center">
                  <span class="mr-2">🍂</span> Date limite - Automne
                </h3>
                <div class="flex flex-col items-center justify-center h-28">
                  <div class="text-2xl font-bold">{{ formatDate(admin.adm_datelimite_automne) }}</div>
                  <div
                    class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    :class="joursRestants(admin.adm_datelimite_automne) < 0 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : 'bg-green-100 text-green-800 border border-green-300'"
                  >
                    <svg
                      v-if="joursRestants(admin.adm_datelimite_automne) < 0"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ getJoursRestants(admin.adm_datelimite_automne) }}
                  </div>
                  <label for="modal_date_automne" class="btn btn-sm btn-primary mt-3 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Modifier
                  </label>
                </div>

                <!-- Modal modification date automne -->
                <Teleport to="body">
                  <input type="checkbox" id="modal_date_automne" class="modal-toggle" />
                  <div class="modal" role="dialog">
                    <div class="modal-box max-w-md rounded-2xl shadow-xl border border-base-300">
                      
                      <!-- Titre -->
                      <h3 class="text-xl font-bold text-primary">
                        Modification de la date limite – Automne
                      </h3>

                      <!-- Description -->
                      <p class="text-sm text-base-content/70 mt-2">
                        Définissez une nouvelle date limite pour les candidatures du semestre d'automne.
                      </p>

                      <!-- Séparateur -->
                      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

                      <!-- Formulaire -->
                      <form @submit.prevent="confirmModifDate('automne')" class="space-y-4">
                        <label class="form-control w-full">
                          <div class="label">
                            <span class="label-text font-medium">Nouvelle date</span>
                          </div>
                          <input type="date" v-model="modifDateAutomne" class="input input-bordered w-full" />
                        </label>

                        <!-- Actions -->
                        <div class="modal-action">
                          <label for="modal_date_automne" class="btn btn-ghost">Annuler</label>
                          <button type="submit">
                            <label for="modal_date_automne" class="btn btn-primary">Valider</label>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Teleport>
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
const modifDatePrintemps = ref(null);
const modifDateAutomne = ref(null);
const response = ref([]);

// Variables simplifiées pour la sauvegarde
const isBackingUp = ref(false);
const backupSuccess = ref(false);


async function fetch() {
  isLoaded.value = false;
  await request('GET', false, events, config.apiUrl + 'api/event');
  await request('GET', false, actions, config.apiUrl + 'api/action/getfivebylogin/' + accountStore.account.acc_id);
  await request('GET', false, admin, config.apiUrl + 'api/admin');
  modifDateAutomne.value = formatDateModif(admin.value.adm_datelimite_automne);
  modifDatePrintemps.value = formatDateModif(admin.value.adm_datelimite_printemps);
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

async function confirmModifDate(periode){
  var selectedDate = null;
  if(periode == 'printemps'){
   selectedDate = new Date(modifDatePrintemps.value);

  }
  else if (periode == 'automne'){
    selectedDate = new Date(modifDateAutomne.value);
  }
  else{
    return;
  }

  const currentDate = new Date();
  var requestData = {}
  if(periode == 'printemps'){
    requestData.adm_datelimite_printemps = modifDatePrintemps.value;
  }
  else{
    requestData.adm_datelimite_automne = modifDateAutomne.value;
  }
  await request('PUT', false, response, config.apiUrl+'api/admin/date/'+ (periode == 'printemps' ? 'printemps' : 'automne'), requestData);
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