<template>
    <div>
      <div v-if="isLoaded" class="container mx-auto px-4 py-6">
        <!-- En-tête avec bannière -->
        <div class="bg-base-200 rounded-xl shadow-lg mb-8 p-6">
          <h1 class="text-2xl font-bold text-center">Gestion des Universités</h1>
          <div class="divider"></div>
          <p class="text-center opacity-75">Gérez les universités partenaires pour les échanges internationaux</p>
        </div>
  
        <div class="grid md:grid-cols-2 gap-8">
          <!-- SECTION AJOUT D'UNE UNIVERSITÉ -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter une université
              </h2>
              
              <form @submit.prevent="addUniv" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom de l'université</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Université de Sorbonne, MIT..." 
                    v-model="newUniv.univ_name" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Ville</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Paris, New York, Berlin..." 
                    v-model="newUniv.univ_city" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Pays</span>
                  </label>
                  <select id="partnercountry_select" class="select select-bordered w-full" v-model="newUniv.parco_id" v-if="partnercountry && partnercountry.length > 0">
                    <option disabled selected value="selectACountry">Sélectionnez un pays</option>
                    <option value="addNew">+ Créer un pays</option>
                    <option v-for="(parco, index) in partnercountry" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                  </select>
                  <div v-else class="alert alert-info">Chargement des pays...</div>
                </div>
                
                <!-- Champs pour ajouter un nouveau pays -->
                <div class="form-control" v-if="newUniv.parco_id === 'addNew'">
                  <div class="bg-base-200 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Nouveau pays</h3>
                    <div class="space-y-3">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Nom du pays</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ex: France, Allemagne..." 
                          v-model="newUniv.newparco.parco_name" 
                          class="input input-bordered w-full" 
                        />
                      </div>
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Code ISO du pays</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ex: fr, de, it (2 lettres)" 
                          v-model="newUniv.newparco.parco_code" 
                          class="input input-bordered w-full" 
                        />
                        <label class="label">
                          <span class="label-text-alt text-opacity-60">Format à 2 lettres selon le standard ISO 3166-1</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter l'université
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
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="stat-title">Total universités</div>
                  <div class="stat-value text-primary">{{ filteredUniversities.length }}</div>
                </div>
              </div>
  
              <!-- FILTRES -->
              <div class="mt-6">
                <h3 class="font-medium mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtres
                </h3>
                <div class="bg-base-200 rounded-lg p-4">
                  <p class="text-sm mb-2">{{ filteredUniversities.length }} résultats ({{ selectedCountries.length }} filtre{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                  
                  <div class="bg-base-300 rounded-md overflow-hidden mb-4">
                    <div class="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-80" @click="toggleCollapse('pays')">
                      <span class="font-medium">Pays ({{ selectedCountries.length }} sélectionné{{ selectedCountries.length > 1 ? 's' : '' }})</span>
                      <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl">&#9662;</span>
                    </div>
                    
                    <div class="p-3 bg-base-100 rounded-b-md" v-show="isOpen.pays">
                      <button class="text-xs text-primary hover:underline mb-2" @click="deselectAllCountry">Tout désélectionner</button>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div v-for="(country, index) in partnercountry" :key="index" class="flex items-center">
                          <input :id="'filt_pays_' + index" type="checkbox" class="checkbox checkbox-sm mr-2" :value="country.parco_name" v-model="selectedCountries">
                          <label :for="'filt_pays_' + index" class="flex items-center cursor-pointer text-sm">
                            <span class="fi mr-1" :class="'fi-' + country.parco_code"></span>
                            <span class="truncate">{{ country.parco_name }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- LISTE DES UNIVERSITÉS -->
        <div class="card bg-base-100 shadow-xl mt-8">
          <div class="card-body">
            <h2 class="card-title flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Liste des universités ({{ filteredUniversities.length }})
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(univ, index) in filteredUniversities" :key="index" 
                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                      <!-- Drapeau -->
                      <div class="relative inline-block">
                        <span class="fi text-4xl" :class="'fi-' + (univ.partnercountry?.parco_code || '')"></span>
                        <span v-if="!univ.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full">
                          ?
                        </span>
                      </div>
                      
                      <div>
                        <h3 class="font-bold text-lg">{{ univ.univ_name || 'Nom indisponible' }}</h3>
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{{ univ.univ_city || 'Ville indisponible' }}</span>
                        </div>
                        <div class="badge badge-outline mt-1">{{ univ.partnercountry?.parco_name || 'Pays indisponible' }}</div>
                      </div>
                    </div>
                    
                    <div class="flex gap-1">
                      <!-- Bouton de modification -->
                      <label for="modal_modif" 
                        class="btn btn-circle btn-sm btn-ghost" 
                        @click="modifUniv(univ)">
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
                        @click="openConfirmModal(univ)">
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div class="text-sm">
                      Accords liés: 
                      <span class="font-semibold">{{ countAgreementsByUniv(univ.univ_id) }}</span>
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
            <div class="modal-box rounded-2xl border border-base-300 shadow-xl" v-if="currentUnivModif">
              <h3 class="text-xl font-bold">Modification de l'université n° {{ currentUnivModif?.univ_id || '' }}</h3>
              <p class="text-sm text-base-content/70 mt-2">Modifiez les informations de l’université sélectionnée.</p>
              <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

              <form @submit.prevent="confirmModifUniv" class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Nom de l'université</span></label>
                  <input type="text" class="input input-bordered w-full" v-model="currentUnivModif.univ_name" />
                </div>

                <div class="form-control">
                  <label class="label"><span class="label-text">Ville</span></label>
                  <input type="text" class="input input-bordered w-full" v-model="currentUnivModif.univ_city" />
                </div>

                <div class="form-control">
                  <label class="label"><span class="label-text">Pays</span></label>
                  <select class="select select-bordered w-full" v-model="currentUnivModif.parco_id">
                    <option disabled value="selectACountry">Sélectionnez un pays</option>
                    <option v-for="(parco, index) in partnercountry" :key="index" :value="parco.parco_id">
                      {{ parco.parco_name }}
                    </option>
                  </select>
                </div>

                <div class="modal-action mt-6">
                  <label for="modal_modif" class="btn btn-ghost">Annuler</label>
                  <button type="submit">
                    <label for="modal_modif" class="btn btn-primary">Modifier</label>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Teleport>

        <!-- MODAL CONFIRMATION SUPPRESSION -->
        <Teleport to="body">
  <dialog id="confirmModal" ref="confirmModal" class="modal">
    <div class="modal-box rounded-2xl border border-base-300 shadow-xl" v-if="confirmDeleteUniv">
      <h3 class="text-xl font-bold">Confirmer la suppression</h3>
      <p class="text-sm text-base-content/70 mt-2">Cette action supprimera l’université et tous les accords qui y sont liés.</p>
      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

      <div class="bg-base-200 p-4 rounded-lg flex items-center gap-3 mt-2">
        <div class="relative inline-block">
          <span class="fi text-4xl" :class="'fi-' + (confirmDeleteUniv.partnercountry?.parco_code || '')"></span>
          <span v-if="!confirmDeleteUniv.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full">?</span>
        </div>
        <div>
          <h4 class="font-bold text-lg">{{ confirmDeleteUniv.univ_name || 'Nom indisponible' }}</h4>
          <div class="text-sm">{{ confirmDeleteUniv.univ_city || 'Ville indisponible' }}</div>
          <div class="badge badge-outline mt-1">{{ confirmDeleteUniv.partnercountry?.parco_name || 'Pays indisponible' }}</div>
        </div>
      </div>

      <div class="mt-6">
        <h4 class="font-bold mb-2">Accords liés ({{ filteredAgreements.length }})</h4>
        <div class="bg-base-200 rounded-lg max-h-64 overflow-y-auto">
          <div v-if="filteredAgreements.length > 0">
            <div v-for="(accord, index) in filteredAgreements" :key="index" class="border-b last:border-b-0 border-base-300 p-3">
              <div class="flex items-center gap-3">
                <span class="fi text-xl" :class="'fi-'+ getCountryCode(accord.partnercountry.parco_name)"></span>
                <div>
                  <p class="font-semibold">{{ accord.university?.univ_name || 'Université non spécifiée' }}</p>
                  <p class="text-sm opacity-70">
                    ({{ accord.isced?.isc_code || '??' }}) - {{ accord.isced?.isc_name || 'ISCED indisponible' }} |
                    {{ accord.component?.comp_name || 'Aucune composante' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-4 text-center opacity-70">
            Aucun accord lié à cette université
          </div>
        </div>
      </div>

      <div class="modal-action mt-6">
        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
        <button class="btn btn-error"
                @click="deleteUniv(confirmDeleteUniv?.univ_id || '', confirmDeleteUniv?.univ_name || '', confirmDeleteUniv?.univ_city || '')">
          Supprimer
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
    const universites = ref([]);
    const accords = ref([]);
    const partnercountry = ref([]);
    const confirmDeleteUniv = ref([])
    const selectedCountries = ref([]);
    const response = ref([])
    const currentUnivModif = ref([]);

    const newUniv = ref({
        univ_name: '',
        univ_city: '',
        parco_id: '',
        newparco: {
            parco_name: '',
            parco_code: ''
        }
    });

    // Méthode pour filtrer et trier les universités
    const filteredUniversities = computed(() => {
        return universites.value
            .filter(univ => 
                selectedCountries.value.length === 0 || 
                selectedCountries.value.includes(univ.partnercountry.parco_name) // Filtre sur les pays sélectionnés
            )
            .sort((a, b) => {
                const nameA = a.partnercountry.parco_name || '';
                const nameB = b.partnercountry.parco_name || '';
                return nameA.localeCompare(nameB); // Trie par nom
            });
    });


    const isOpen = ref({
        pays: false,
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }


    
    // Modal modif univ
    function modifUniv(univ){
        currentUnivModif.value.univ_id = univ.univ_id || null;
        currentUnivModif.value.univ_name = univ.univ_name || null;
        currentUnivModif.value.univ_city = univ.univ_city || null;
        currentUnivModif.value.parco_id = univ.partnercountry.parco_id || null;
    }

    // Confirm modification univ
    async function confirmModifUniv(){
        const requestData = { 
            univ_id: currentUnivModif.value.univ_id,
            univ_name: currentUnivModif.value.univ_name,
            univ_city: currentUnivModif.value.univ_city,
            parco_id: currentUnivModif.value.parco_id,

        };
        await request('PUT', true, response, config.apiUrl+'api/university', requestData);
        if(response.value.status == 200){
            addAction(accountStore.account.acc_id, 'university', response, 'Modification de l\'université '+requestData.univ_name+' (' + requestData.univ_city + ').');
        }
        fetchAll();
    }


    // Retourne le nombre d'unv lié à l'accord
    function countAgreementsByUniv(univ_id) {
        return accords.value.agreements.filter(agreement => 
            agreement.university && agreement.university.univ_id === univ_id
        ).length;
    }

    // Ajouter une université
    async function addUniv() {

        if (newUniv.value.univ_name == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un nom d\'université.', message: 'Ajout de l\'université annulé.' } });
            return;
        }
        if (newUniv.value.univ_city == '') {
            addAlert('error', { data: { error: 'Vous devez choisir un nom de ville.', message: 'Ajout de l\'université annulé.' } });
            return;
        }

        const requestData = { 
            univ_name: newUniv.value.univ_name,
            univ_city: newUniv.value.univ_city,
        };


        if (newUniv.value.parco_id == 'selectACountry') {
            addAlert('error', { data: { error: 'Vous devez choisir un pays.', message: 'Ajout de l\'université annulé.' } });
            return;
        }

        if(newUniv.value.parco_id == 'addNew'){
            requestData.parco_name = newUniv.value.newparco.parco_name;
            requestData.parco_code = newUniv.value.newparco.parco_code;
            requestData.parco_id = `addNew`;
        }else{
            requestData.parco_id = `${newUniv.value.parco_id}`;
        }
        // Effectuer la requête POST pour ajouter l'accord
        await request("POST", true, response, config.apiUrl + 'api/university', requestData);

        // Vérification de la réponse et ajout d'une action si nécessaire
        if (response.value.status === 201) {
            
            // Rafraîchir les données après l'ajout
            await fetchAll();
            addAction(accountStore.account.acc_id, 'university', response, 'Ajout de l\'université ' + requestData.univ_name + ' (' + requestData.univ_city + ').');
        }

    }

    // Supprimer une université
    async function deleteUniv(univ_id, univ_name, univ_city){
        await request('DELETE', true, response, config.apiUrl+'api/university/deletebyid/'+univ_id);
        if(response.value.status == 202){
            addAction(accountStore.account.acc_id, 'university', response, 'Suppression de l\'université '+univ_name+' (' + univ_city + ').');
        }
        fetchAll();
        closeModal();

    }

    // Liste des accords concerné par l'univ qu'on supprime
    const filteredAgreements = computed(() => {
        return accords.value.agreements.filter(agreement => 
            agreement.university && agreement.university.univ_id === confirmDeleteUniv.value.univ_id
        );
    });
    
    // Fonction pour trouver le pays
    function getCountryCode(pays) {
        const country = partnercountry.value.find(country => country.parco_name === pays);
        return country ? country.parco_code : 'Code non disponible';
    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(univ) {
    
    confirmDeleteUniv.value = univ;
    const modal = document.getElementById('confirmModal')
    modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
    const modal = document.getElementById('confirmModal')
    modal.close()
    }

    function resetInput(){
        newUniv.value.univ_name = '',
        newUniv.value.univ_city = '',
        newUniv.value.parco_id = '',
        newUniv.value.newparco = {
            parco_name: '',
            parco_code: ''
        }
        newUniv.value.parco_id = document.querySelector('#partnercountry_select').options[0].value;
    }


    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, universites, config.apiUrl + 'api/university');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        isLoaded.value = true;
        await nextTick()
        resetInput()
    }

    function deselectAllCountry() {
            selectedCountries.value = [];
        }

    onMounted(fetchAll)
</script>