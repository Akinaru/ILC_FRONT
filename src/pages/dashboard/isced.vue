<template>
    <div>
      <div v-if="isLoaded" class="container mx-auto px-4 py-6">
        <!-- En-tête avec bannière -->
        <div class="bg-base-200 rounded-xl shadow-lg mb-8 p-6">
          <h1 class="text-2xl font-bold text-center">Gestion des ISCEDs</h1>
          <div class="divider"></div>
          <p class="text-center opacity-75">Gérez les codes et classifications des domaines d'études</p>
        </div>
  
        <div class="grid md:grid-cols-2 gap-8">
          <!-- SECTION AJOUT D'UN ISCED -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un ISCED
              </h2>
              
              <form @submit.prevent="addIsced" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Code ISCED</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: 071" 
                    v-model="newIsced.isc_code" 
                    class="input input-bordered w-full" 
                  />
                  <label class="label">
                    <span class="label-text-alt text-opacity-60">Format à 3 chiffres recommandé</span>
                  </label>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom du domaine</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Informatique et technologies" 
                    v-model="newIsced.isc_name" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter l'ISCED
                  </button>
                </div>
              </form>
            </div>
          </div>
  
          <!-- SECTION STATISTIQUES -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Statistiques
              </h2>
              
              <div class="stats shadow mt-4">
                <div class="stat">
                  <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div class="stat-title">Total ISCEDs</div>
                  <div class="stat-value text-primary">{{ isceds.length }}</div>
                </div>
              </div>
              
              <div class="alert alert-info mt-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p>Les codes ISCED (International Standard Classification of Education) sont utilisés pour classer les domaines d'études selon un standard international.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- LISTE DES ISCEDS -->
        <div class="card bg-base-100 shadow-xl mt-8">
          <div class="card-body">
            <h2 class="card-title flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Liste des ISCEDs ({{ isceds.length }})
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(isced, index) in isceds" :key="index" 
                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start mb-2">
                    <div class="badge badge-lg">{{ isced.isc_code }}</div>
                    <div class="flex gap-1">
                      <!-- Bouton de modification -->
                      <label for="modal_modif" 
                        class="btn btn-circle btn-sm btn-ghost" 
                        @click="modifIsced(isced)">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                            fill="none" stroke="currentColor" stroke-linecap="round" 
                            stroke-linejoin="round" stroke-width="2"/>
                          <polygon fill="none" 
                            points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                            stroke="currentColor" stroke-linecap="round" 
                            stroke-linejoin="round" stroke-width="2"/>
                        </svg>
                      </label>
                      
                      <!-- Bouton de suppression -->
                      <button class="btn btn-circle btn-sm btn-ghost" 
                        @click="openConfirmModal(isced)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" 
                            stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <h3 class="font-bold text-lg">{{ isced.isc_name }}</h3>
                  
                  <div class="flex items-center gap-2 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div class="text-sm">
                      Accords liés: 
                      <span class="font-semibold">{{ countAgreementsByIsced(isced.isc_id) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- MODAL MODIFICATION -->
        <input type="checkbox" id="modal_modif" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
          <div class="modal-box">
            <h3 class="font-bold text-lg">
              Modification de l'ISCED n° {{ currentIscedModif.isc_id }}
            </h3>
            <form @submit.prevent="confirmModifIsced" class="mt-4 space-y-4">
              <!-- Code -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Code</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentIscedModif.isc_code"/>
              </div>
              
              <!-- Nom -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentIscedModif.isc_name"/>
              </div>
  
              <div class="modal-action">
                <label for="modal_modif" class="btn btn-ghost">Annuler</label>
                <button type="submit">
                  <label for="modal_modif" class="btn btn-primary">Enregistrer</label>
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- MODAL CONFIRMATION SUPPRESSION -->
        <dialog id="confirmModal" ref="confirmModal" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-warning" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Confirmer la suppression
            </h3>
            
            <div class="py-4">
              <div class="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" 
                  fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Cette action supprimera l'ISCED dans tous les accords liés.</span>
              </div>
              
              <div class="bg-base-200 p-4 rounded-lg mt-4">
                <div class="flex items-center gap-2">
                  <div class="badge badge-lg">{{ confirmDeleteIsced.isc_code }}</div>
                  <h4 class="font-bold">{{ confirmDeleteIsced.isc_name }}</h4>
                </div>
              </div>
  
              <!-- Liste des accords liés -->
              <div class="mt-6">
                <h4 class="font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Accords liés ({{ filteredAgreements.length }})
                </h4>
                
                <div class="bg-base-200 rounded-lg max-h-64 overflow-y-auto">
                  <div v-if="filteredAgreements.length > 0">
                    <div v-for="(accord, index) in filteredAgreements" :key="index" 
                      class="border-b last:border-b-0 border-base-300 p-3">
                      <div class="flex items-center gap-3">
                        <span class="fi text-xl" 
                          :class="'fi-'+ getCountryCode(accord.partnercountry.parco_name)"></span>
                        <div>
                          <p class="font-semibold">
                            {{ accord.university?.univ_name ?? 'Université non spécifiée' }}
                          </p>
                          <p class="text-sm opacity-70">
                            {{ accord.partnercountry.parco_name }} - 
                            {{ accord.university?.univ_city ?? 'Ville non spécifiée' }}
                          </p>
                          <p class="text-sm">
                            {{ accord.component?.comp_name ?? 'Aucune composante' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="p-4 text-center opacity-70">
                    Aucun accord lié à cet ISCED
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-error" 
                @click="deleteIsced(confirmDeleteIsced.isc_id, confirmDeleteIsced.isc_name, confirmDeleteIsced.isc_code)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Confirmer la suppression
              </button>
            </div>
          </div>
        </dialog>
      </div>
      <LoadingComp v-else></LoadingComp>
    </div>
  </template>

<script setup>
    import { ref, onMounted, computed, nextTick } from 'vue';
    import config from '../../config'
    import { request } from '../../composables/httpRequest';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { addAlert } from '../../composables/addAlert';
    import { useAccountStore } from '../../stores/accountStore';
import { addAction } from '../../composables/actionType';
    const accountStore = useAccountStore();

    const isLoaded = ref(false);
    const isceds = ref([]);
    const accords = ref([]);
    const partnercountry = ref([]);
    const confirmDeleteIsced = ref([])
    const response = ref([])
    const currentIscedModif = ref([]);

    const newIsced = ref({
        isc_code: '',
        isc_name: '',
    });


    // Modal modif isced
    function modifIsced(isced){
        currentIscedModif.value.isc_id = isced.isc_id || null;
        currentIscedModif.value.isc_name = isced.isc_name || null;
        currentIscedModif.value.isc_code = isced.isc_code || null;
    }

    // Confirm modification isced
    async function confirmModifIsced(){
        const requestData = { 
            isc_id: currentIscedModif.value.isc_id,
            isc_name: currentIscedModif.value.isc_name,
            isc_code: currentIscedModif.value.isc_code,

        };
        await request('PUT', true, response, config.apiUrl+'api/isced', requestData);
        if(response.value.status == 200){
            addAction(accountStore.login, 'isced', response, 'Modification de l\'isced (' + requestData.isc_code + ') '+requestData.isc_name+'.');
        }
        fetchAll();
    }

    // Ajouter un isced
    async function addIsced() {

        if (newIsced.value.isc_name == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un nom d\'isced.', message: 'Ajout de l\'isced annulé.' } });
            return;
        }
        if (newIsced.value.isc_code == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un code.', message: 'Ajout de l\'isced annulé.' } });
            return;
        }

        const requestData = { 
            isc_name: newIsced.value.isc_name,
            isc_code: newIsced.value.isc_code,
        };
        // Effectuer la requête POST pour ajouter l'isced
        await request("POST", true, response, config.apiUrl + 'api/isced', requestData);

        // Vérification de la réponse et ajout d'une action si nécessaire
        if (response.value.status === 201) {
            
            // Rafraîchir les données après l'ajout
            await fetchAll();
            addAction(accountStore.login, 'isced', response, 'Ajout de l\'isced (' + requestData.isc_code + ') '+requestData.isc_name+'.');
        }

    }

    // Supprimer une université
    async function deleteIsced(isc_id, isc_name, isc_code){
        await request('DELETE', true, response, config.apiUrl+'api/isced/deletebyid/'+isc_id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'isced', response, 'Suppression de l\'université (' + isc_code + ') '+isc_name+'.');
        }
        fetchAll();
    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(isced) {
        confirmDeleteIsced.value = isced;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
    }

    // Reset les input apres rechargement
    function resetInput(){
        newIsced.value.isc_name = ''
        newIsced.value.isc_code = ''
    }

    // Retourne le nombre d'isced lié à l'accord
    function countAgreementsByIsced(isc_id) {
        return accords.value.agreements.filter(agreement => 
            agreement.isced && agreement.isced.isc_id === isc_id
        ).length;
    }

    // Fonction pour trouver le pays
    function getCountryCode(pays) {
        const country = partnercountry.value.find(country => country.parco_name === pays);
        return country ? country.parco_code : 'Code non disponible';
    }

    // Liste des accords concerné par l'isced qu'on supprime
    const filteredAgreements = computed(() => {
        return accords.value.agreements.filter(agreement => 
            agreement.isced && agreement.isced.isc_id === confirmDeleteIsced.value.isc_id
        );
    });

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, isceds, config.apiUrl + 'api/isced');
        await request('GET', false, accords, config.apiUrl + 'api/agreement');
        await request('GET', false, partnercountry, config.apiUrl + 'api/partnercountry');
        isceds.value.sort((a, b) => a.isc_code.localeCompare(b.isc_code));
        isLoaded.value = true;
        await nextTick()
        resetInput()
    }

    onMounted(fetchAll)
</script>