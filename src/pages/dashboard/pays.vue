<template>
    <div>
      <div v-if="isLoaded" class="container mx-auto px-4 py-6">
        <!-- En-tête avec bannière -->
        <div class="bg-base-200 rounded-xl shadow-lg mb-8 p-6">
          <h1 class="text-2xl font-bold text-center">Gestion des Pays</h1>
          <div class="divider"></div>
          <p class="text-center opacity-75">Gérez les pays partenaires pour les échanges internationaux</p>
        </div>
  
        <div class="grid md:grid-cols-2 gap-8">
          <!-- SECTION AJOUT D'UN PAYS -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter un pays
              </h2>
              
              <form @submit.prevent="addPays" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom du pays</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: France, Allemagne, Espagne..." 
                    v-model="newPays.parco_name" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Code ISO du pays</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: FR, DE, ES (2 lettres)" 
                    v-model="newPays.parco_code" 
                    class="input input-bordered w-full" 
                  />
                  <label class="label">
                    <span class="label-text-alt text-opacity-60">Format à 2 lettres selon le standard ISO 3166-1</span>
                  </label>
                </div>
                
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter le pays
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Statistiques
              </h2>
              
              <div class="stats shadow mt-4">
                <div class="stat">
                  <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </div>
                  <div class="stat-title">Total pays</div>
                  <div class="stat-value text-primary">{{ partnercountry.length }}</div>
                </div>
              </div>
              
              <div class="alert alert-info mt-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p>Les codes pays doivent être au format ISO 3166-1 Alpha-2 (deux lettres) pour l'affichage correct des drapeaux.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- LISTE DES PAYS -->
        <div class="card bg-base-100 shadow-xl mt-8">
          <div class="card-body">
            <h2 class="card-title flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Liste des pays ({{ partnercountry.length }})
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(pays, index) in partnercountry" :key="index" 
                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                      <!-- Drapeau -->
                      <div class="relative inline-block">
                        <span class="fi text-4xl" :class="'fi-' + (pays?.parco_code || '')"></span>
                        <span v-if="!pays?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full">
                          ?
                        </span>
                      </div>
                      
                      <div>
                        <h3 class="font-bold text-lg">{{ pays.parco_name }}</h3>
                        <div class="badge badge-outline">{{ pays?.parco_code?.toUpperCase() || '' }}</div>
                      </div>
                    </div>
                    
                    <div class="flex gap-1">
                      <!-- Bouton de modification -->
                      <label for="modal_modif" 
                        class="btn btn-circle btn-sm btn-ghost" 
                        @click="modifPays(pays)">
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
                        @click="openConfirmModal(pays)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" 
                            stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-2 mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div class="text-sm">
                      Universités liées: 
                      <span class="font-semibold">{{ countUnivByPays(pays.parco_id) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- MODAL MODIFICATION -->
        <Teleport to="body">
        <input type="checkbox" id="modal_modif" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
          <div class="modal-box">
            <h3 class="font-bold text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                  fill="none" stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
                <polygon fill="none" 
                  points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                  stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
              </svg>
              Modification du pays n° {{ currentPaysModif.parco_id }}
            </h3>
            
            <form @submit.prevent="confirmModifPays" class="mt-4 space-y-4">
              <!-- Nom -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom du pays</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentPaysModif.parco_name"/>
              </div>
              
              <!-- Code -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Code ISO du pays</span>
                </label>
                <div class="flex gap-2">
                  <input type="text" class="input input-bordered w-full" 
                    v-model="currentPaysModif.parco_code"/>
                  <div class="relative h-12 w-12 flex-shrink-0 overflow-hidden">
                    <span class="fi text-3xl absolute inset-0 flex items-center justify-center" 
                      :class="'fi-' + (currentPaysModif?.parco_code || '')"></span>
                    <span v-if="!currentPaysModif?.parco_code" 
                      class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-gray-200 rounded-md">
                      ?
                    </span>
                  </div>
                </div>
                <label class="label">
                  <span class="label-text-alt">Le drapeau s'affichera automatiquement si le code est valide</span>
                </label>
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
        </Teleport>
  
        <!-- MODAL CONFIRMATION SUPPRESSION -->
        <Teleport to="body">
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
                <span>Cette action supprimera le pays dans tous les accords liés.</span>
              </div>
              
              <div class="bg-base-200 p-4 rounded-lg mt-4 flex items-center gap-3">
                <!-- Drapeau -->
                <div class="relative inline-block">
                  <span class="fi text-4xl" :class="'fi-' + (confirmDeletePays?.parco_code || '')"></span>
                  <span v-if="!confirmDeletePays?.parco_code" 
                    class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full">
                    ?
                  </span>
                </div>
                
                <div>
                  <h4 class="font-bold text-lg">{{ confirmDeletePays.parco_name }}</h4>
                  <div class="badge badge-outline">{{ confirmDeletePays?.parco_code?.toUpperCase() || '' }}</div>
                </div>
              </div>
  
              <!-- Liste des universités liées -->
              <div class="mt-6">
                <h4 class="font-bold mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Universités liées ({{ filteredUniveristy.length }})
                </h4>
                
                <div class="bg-base-200 rounded-lg max-h-64 overflow-y-auto">
                  <div v-if="filteredUniveristy.length > 0">
                    <div v-for="(univ, index) in filteredUniveristy" :key="index" 
                      class="border-b last:border-b-0 border-base-300 p-3">
                      <div class="flex items-center gap-3">
                        <span class="fi text-xl" 
                          :class="'fi-'+ getCountryCode(univ.partnercountry.parco_name)"></span>
                        <div>
                          <p class="font-semibold">
                            {{ univ.univ_name ?? 'Université non spécifiée' }}
                          </p>
                          <p class="text-sm opacity-70">
                            {{ univ.univ_city ?? 'Ville non spécifiée' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="p-4 text-center opacity-70">
                    Aucune université liée à ce pays
                  </div>
                </div>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-error" 
                @click="deletePays(confirmDeletePays.parco_id, confirmDeletePays.parco_name, confirmDeletePays.parco_code)">
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
        </Teleport>
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
    const accords = ref([]);
    const universitys = ref([]);
    const partnercountry = ref([]);
    const confirmDeletePays = ref([])
    const response = ref([])
    const currentPaysModif = ref([]);

    const newPays = ref({
        parco_code: '',
        parco_name: '',
    });


    // Modal modif pays
    function modifPays(pays){
        currentPaysModif.value.parco_id = pays.parco_id || null;
        currentPaysModif.value.parco_name = pays.parco_name || null;
        currentPaysModif.value.parco_code = pays.parco_code || null;
    }

    // Confirm modification pays
    async function confirmModifPays(){
        const requestData = { 
            parco_id: currentPaysModif.value.parco_id,
            parco_name: currentPaysModif.value.parco_name,
            parco_code: currentPaysModif.value.parco_code,

        };
        await request('PUT', true, response, config.apiUrl+'api/partnercountry', requestData);
        if(response.value.status == 200){
            addAction(accountStore.account.acc_id, 'university', response, 'Modification du pays (' + requestData.parco_code + ') '+requestData.parco_name+'.');
        }
        fetchAll();
    }

    // Ajouter un pays
    async function addPays() {

        if (newPays.value.parco_name == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un nom de pays.', message: 'Ajout du pays annulé.' } });
            return;
        }
        if (newPays.value.parco_code == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un code de pays.', message: 'Ajout du pays annulé.' } });
            return;
        }

        const requestData = { 
            parco_name: newPays.value.parco_name,
            parco_code: newPays.value.parco_code,
        };
        await request("POST", true, response, config.apiUrl + 'api/partnercountry', requestData);

        if (response.value.status === 201) {
            addAction(accountStore.account.acc_id, 'university', response, 'Ajout du pays (' + requestData.parco_code + ') '+requestData.parco_name+'.');
            fetchAll();
        }

    }

    // Supprimer un pays
    async function deletePays(parco_id, parco_name, parco_code){
        await request('DELETE', true, response, config.apiUrl+'api/partnercountry/'+parco_id);
        if(response.value.status == 202){
            addAction(accountStore.account.acc_id, 'university', response, 'Suppression du pays (' + parco_code + ') '+parco_name+'.');
        }
        fetchAll();
        closeModal();
    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(pays) {
        confirmDeletePays.value = pays;
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
        newPays.value.parco_name = ''
        newPays.value.parco_code = ''
    }

    // Retourne le nombre d'accord lié au pays
    function countUnivByPays(parco_id) {
        return universitys.value.filter(univ => 
            univ.partnercountry && univ.partnercountry.parco_id === parco_id
        ).length;
    }

    // Fonction pour trouver le pays
    function getCountryCode(pays) {
        const country = partnercountry.value.find(country => country.parco_name === pays);
        return country ? country.parco_code : 'Code non disponible';
    }


    // Liste des universités concerné par le pays qu'on supprime
    const filteredUniveristy = computed(() => {
        return universitys.value.filter(univ => 
            univ.partnercountry && univ.partnercountry.parco_id === confirmDeletePays.value.parco_id
        );
    });

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl + 'api/agreement');
        await request('GET', false, universitys, config.apiUrl + 'api/university');
        await request('GET', false, partnercountry, config.apiUrl + 'api/partnercountry');
        isLoaded.value = true;
        await nextTick()
        resetInput()
    }

    onMounted(fetchAll)
</script>