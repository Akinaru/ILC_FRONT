<template>
    <div>
      <div class="container mx-auto px-4 py-6">
        <!-- En-tête avec bannière -->
        <div class="bg-base-200 rounded-xl shadow-lg mb-8 p-6">
          <h1 class="text-2xl font-bold text-center">Gestion des Départements</h1>
          <div class="divider"></div>
          <p class="text-center opacity-75">Gérez les composantes et départements de votre établissement</p>
        </div>
  
        <div class="flex justify-between items-center mb-6">
          <div></div> <!-- Spacer pour l'alignement -->
          <div>
            <ExportComp texte="Exporter des départements en CSV" :link="config.apiUrl+'api/department/export'" class="btn btn-outline btn-primary btn-sm">
            </ExportComp>
          </div>
        </div>
  
        <div class="grid md:grid-cols-2 gap-8 mb-8">
          <!-- SECTION AJOUT D'UNE COMPOSANTE -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Ajouter une composante
              </h2>
              
              <form @submit.prevent="addComposante" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom de la composante</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: IUT Annecy, IAE" 
                    v-model="newComp.name" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom raccourci</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: IUT, IAE..." 
                    v-model="newComp.shortname" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter la composante
                  </button>
                </div>
              </form>
            </div>
          </div>
  
          <!-- SECTION AJOUT D'UN DÉPARTEMENT -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                Ajouter un département
              </h2>
              
              <form @submit.prevent="addDepartment" class="space-y-4 mt-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Composante</span>
                  </label>
                  <select class="select select-bordered w-full" v-model="newDep.compo">
                    <option disabled selected>Sélectionnez une composante</option>
                    <option v-for="(compo, index) in composantes.components" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                  </select>
                </div>
                
                <!-- Champs pour ajouter une nouvelle composante -->
                <div class="form-control" v-if="newDep.compo === 'addNew'">
                  <div class="bg-base-200 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Nouvelle composante</h3>
                    <div class="space-y-3">
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Nom de la composante</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ex: IUT Annecy" 
                          v-model="newDep.newcompo.name" 
                          class="input input-bordered w-full" 
                        />
                      </div>
                      <div class="form-control">
                        <label class="label">
                          <span class="label-text">Nom raccourci</span>
                        </label>
                        <input 
                          type="text" 
                          placeholder="Ex: IUT-A" 
                          v-model="newDep.newcompo.shortname" 
                          class="input input-bordered w-full" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom du département</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Informatique, Mesures Physiques..." 
                    v-model="newDep.name" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Nom raccourci</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: INFO, MPH..." 
                    v-model="newDep.shortname" 
                    class="input input-bordered w-full" 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Couleur</span>
                  </label>
                  <div class="flex items-center gap-3">
                    <input type="color" id="colorPicker" v-model="newDep.color" class="h-10 w-20 cursor-pointer rounded">
                  </div>
                </div>
                
                <div class="form-control mt-6">
                  <button type="submit" class="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter le département
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <!-- LISTE DES COMPOSANTES ET DÉPARTEMENTS -->
        <div class="card bg-base-100 shadow-xl mt-8">
          <div class="card-body">
            <h2 class="card-title flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Liste des composantes et départements
            </h2>
            
            <div v-if="composantes && composantes.components" class="space-y-6">
              <div v-if="composantes.count > 0">
                <div v-for="(compo, index) in composantes.components" :key="index" class="bg-base-200 rounded-lg mb-4 overflow-hidden">
                  <!-- Entête de la composante -->
                  <div class="bg-base-300 flex justify-between items-center">
                    <div class="p-4 flex-1">
                      <h3 class="font-bold text-lg">{{ compo.comp_name }}</h3>
                      <div class="badge badge-outline">{{ compo.comp_shortname }}</div>
                    </div>
                    
                    <div class="flex">
                      <!-- Bouton de modification composante -->
                      <label for="modal_modif_comp" 
                        class="btn btn-square btn-ghost" 
                        @click="modifComp(compo)">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                            fill="none" stroke="currentColor" stroke-linecap="round" 
                            stroke-linejoin="round" stroke-width="2"/>
                          <polygon fill="none" 
                            points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                            stroke="currentColor" stroke-linecap="round" 
                            stroke-linejoin="round" stroke-width="2"/>
                        </svg>
                      </label>
                      
                      <!-- Bouton de suppression composante -->
                      <button class="btn btn-square btn-ghost" 
                        @click="openConfirmModalCompo(compo)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" 
                            stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <!-- Liste des départements -->
                  <div class="p-4">
                    <div v-if="compo.departments.length > 0" class="space-y-2">
                      <div v-for="(dept, index) in compo.departments" :key="index" 
                        class="bg-base-100 rounded-md shadow-sm hover:shadow-md transition-shadow">
                        <div class="p-3 flex justify-between items-center">
                          <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-md tooltip cursor-pointer" 
                              :data-tip="`${dept.dept_color} Cliquer pour copier`" 
                              @click="copyColor(dept.dept_color)" 
                              :style="{backgroundColor: dept.dept_color}">
                            </div>
                            
                            <div>
                              <h4 class="font-medium">{{ dept.dept_name }}</h4>
                              <div class="badge badge-sm">{{ dept.dept_shortname }}</div>
                            </div>
                          </div>
                          
                          <div class="flex gap-1">
                            <!-- Bouton de modification département -->
                            <label for="modal_modif" 
                              class="btn btn-circle btn-sm btn-ghost" 
                              @click="modifDept(dept)">
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
                            
                            <!-- Bouton de suppression département -->
                            <button class="btn btn-circle btn-sm btn-ghost" 
                              @click="openConfirmModal(dept)">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" 
                                  stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="py-4 text-center opacity-70">
                      <span>Aucun département</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="py-10 text-center opacity-70">
                <span>Aucune composante trouvée</span>
              </div>
            </div>
            <div v-else class="flex items-center justify-center py-10">
              <span class="loading loading-dots loading-lg"></span>
            </div>
          </div>
        </div>
  
        <!-- MODAL MODIFICATION DÉPARTEMENT -->
        <input type="checkbox" id="modal_modif" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
          <div class="modal-box">
            <h3 class="font-bold text-lg flex items-center gap-2" v-if="currentDeptModif">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                  fill="none" stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
                <polygon fill="none" 
                  points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                  stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
              </svg>
              Modification du département n° {{ currentDeptModif?.dept_id || '' }}
            </h3>
            
            <form @submit.prevent="confirmModifDept" class="mt-4 space-y-4" v-if="currentDeptModif">
              <!-- Nom -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom du département</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentDeptModif.dept_name"/>
              </div>
              
              <!-- Nom raccourci -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom raccourci</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentDeptModif.dept_shortname"/>
              </div>
              
              <!-- Couleur -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Couleur</span>
                </label>
                <div class="flex items-center gap-3">
                  <input type="color" id="colorPicker" v-model="currentDeptModif.dept_color" class="h-10 w-20 cursor-pointer rounded">
                  <div class="bg-base-200 p-2 rounded-md flex-1">
                    <div class="h-6 rounded" :style="{backgroundColor: currentDeptModif.dept_color}"></div>
                  </div>
                </div>
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
  
        <!-- MODAL MODIFICATION COMPOSANTE -->
        <input type="checkbox" id="modal_modif_comp" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
          <div class="modal-box">
            <h3 class="font-bold text-lg flex items-center gap-2" v-if="currentCompModif">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" 
                  fill="none" stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
                <polygon fill="none" 
                  points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" 
                  stroke="currentColor" stroke-linecap="round" 
                  stroke-linejoin="round" stroke-width="2"/>
              </svg>
              Modification de la composante n° {{ currentCompModif?.comp_id || '' }}
            </h3>
            
            <form @submit.prevent="confirmModifComp" class="mt-4 space-y-4" v-if="currentCompModif">
              <!-- Nom -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom de la composante</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentCompModif.comp_name"/>
              </div>
              
              <!-- Nom raccourci -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Nom raccourci</span>
                </label>
                <input type="text" class="input input-bordered w-full" 
                  v-model="currentCompModif.comp_shortname"/>
              </div>
  
              <div class="modal-action">
                <label for="modal_modif_comp" class="btn btn-ghost">Annuler</label>
                <button type="submit">
                  <label for="modal_modif_comp" class="btn btn-primary">Enregistrer</label>
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- MODAL CONFIRMATION SUPPRESSION DÉPARTEMENT -->
        <dialog id="confirmModal" ref="confirmModal" class="modal">
          <div class="modal-box" v-if="confirmDeleteDepartment">
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
                <span>Cette action supprimera définitivement le département.</span>
              </div>
              
              <div class="bg-base-200 p-4 rounded-lg mt-4 flex items-center gap-3">
                <div class="h-12 w-12 rounded-md" :style="{backgroundColor: confirmDeleteDepartment.dept_color}"></div>
                
                <div>
                  <h4 class="font-bold text-lg">{{ confirmDeleteDepartment.dept_name }}</h4>
                  <div class="badge badge-outline">{{ confirmDeleteDepartment.dept_shortname }}</div>
                </div>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-error" 
                @click="removeDepartment(confirmDeleteDepartment.dept_shortname, confirmDeleteDepartment.dept_id)">
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
  
        <!-- MODAL CONFIRMATION SUPPRESSION COMPOSANTE -->
        <dialog id="confirmModalCompo" ref="confirmModalCompo" class="modal">
          <div class="modal-box" v-if="confirmDeleteComposante">
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
                <span>Cette action supprimera définitivement la composante et tous ses départements associés.</span>
              </div>
              
              <div class="bg-base-200 p-4 rounded-lg mt-4">
                <h4 class="font-bold text-lg">{{ confirmDeleteComposante.comp_name }}</h4>
                <div class="badge badge-outline">{{ confirmDeleteComposante.comp_shortname }}</div>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn btn-ghost" @click="closeModal">Annuler</button>
              <button class="btn btn-error" 
                @click="removeComp(confirmDeleteComposante.comp_id)">
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
    </div>
  </template>

<script setup>

    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { addAlert } from '../../composables/addAlert';
    import { useAccountStore } from '../../stores/accountStore';
    import ExportComp from '../../components/impexp/ExportComp.vue';
import { addAction } from '../../composables/actionType';

    const accountStore = useAccountStore();

    const composantes = ref([]);
    const response = ref([]);
    const currentDeptModif = ref([]);
    const currentCompModif = ref([]);
    const confirmDeleteDepartment = ref([])
    const confirmDeleteComposante = ref([])

    const newDep = ref({ 
        name: '', 
        shortname: '', 
        color: '#9e9e9e', 
        compo: '', 
        newcompo: {
            name: null, 
            shortname: null
        } 
    });

    const newComp = ref({
        name: '',
        shortname: ''
    })

    // Ajouter un département
    async function addDepartment(){
        const requestData = { 
            dept_name: newDep.value.name,
            dept_shortname: newDep.value.shortname.toUpperCase(),
            dept_color: newDep.value.color,
        };

        // Gestion de la nouvelle composante
        if (newDep.value.compo == 'Selectionnez une composante'){
            addAlert('error', {data:{error: 'Vous devez choisir une composante.', message:'Ajout du département annulé.'}})
            return;
        }else if (newDep.value.compo !== 'addNew') {
            requestData.comp_id = newDep.value.compo;
        }
        
        if(newDep.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom à votre département.', message:'Ajout du département annulé.'}})
            return;
        }
        if(newDep.value.shortname == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom raccourci à votre département.', message:'Ajout du département annulé.'}})
            return;
        }
        
        await request("POST", true, response, config.apiUrl+'api/department', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'department', response, 'Ajout du département '+newDep.value.shortname+'.');
        }
        await fetchAll();
        resetInput();

    }

    // Ajouter une composante
    async function addComposante(){
        const requestData = { 
            comp_name: newComp.value.name,
            comp_shortname: newComp.value.shortname.toUpperCase(),
        };
        
        if(newComp.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom à votre composante.', message:'Ajout de la composante annulé.'}})
            return;
        }
        if(newComp.value.shortname == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom raccourci à votre composante.', message:'Ajout de la composante annulé.'}})
            return;
        }
        
        await request("POST", true, response, config.apiUrl+'api/component', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'department', response, 'Ajout de la composante '+newComp.value.shortname+'.');
        }
        await fetchAll();
        resetInput();

    }

    //ouvrir le modal de confirmation de suppression des dept
    function openConfirmModal(dept) {
        confirmDeleteDepartment.value = dept;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    //ouvrir le modal de confirmation de suppression des composantes
    function openConfirmModalCompo(compo) {
        confirmDeleteComposante.value = compo;
        const modal = document.getElementById('confirmModalCompo')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
        const modal2 = document.getElementById('confirmModalCompo')
        modal2.close()
    }


    // Gestion de la modification de departement
    // Modifie la ref par departement qu'on veut modifier
    // pour afficher les bonnes informations dans le form de modif
    function modifDept(dept){
        currentDeptModif.value.dept_id = dept.dept_id;
        currentDeptModif.value.dept_name = dept.dept_name;
        currentDeptModif.value.dept_shortname = dept.dept_shortname;
        currentDeptModif.value.dept_color = dept.dept_color;
    }
    function modifComp(comp){
        currentCompModif.value.comp_id = comp.comp_id;
        currentCompModif.value.comp_name = comp.comp_name;
        currentCompModif.value.comp_shortname = comp.comp_shortname;
    }


    // Confirmer la modification
    async function confirmModifDept(){
        const requestData = { 
            dept_id: currentDeptModif.value.dept_id,
            dept_name: currentDeptModif.value.dept_name,
            dept_shortname: currentDeptModif.value.dept_shortname,
            dept_color: currentDeptModif.value.dept_color,
        };
        await request('PUT', true, response, config.apiUrl+'api/department', requestData);
        if(response.value.status == 200){
            addAction(accountStore.login, 'department', response, 'Modification du département '+requestData.dept_shortname+'.');
        }
        fetchAll();
    }
    // Confirmer la modification
    async function confirmModifComp(){
        const requestData = { 
            comp_id: currentCompModif.value.comp_id,
            comp_name: currentCompModif.value.comp_name,
            comp_shortname: currentCompModif.value.comp_shortname,
        };
        await request('PUT', true, response, config.apiUrl+'api/component', requestData);
        fetchAll();
    }

    // Supprimer un département
    async function removeDepartment(shortname, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/department/deletebyid/'+id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'department', response, 'Suppression du département '+shortname+'.');
        }
        fetchAll();
    }
    // Supprimer une composante
    async function removeComp(id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/component/deletebyid/'+id);
        fetchAll();
    }


    async function fetchAll(){
        await request('GET',false, composantes, config.apiUrl+'api/component');

        resetInput();
    }

    function resetInput(){
        newDep.value.name = '';
        newDep.value.shortname = '';
        newDep.value.color = '#9e9e9e';
        newDep.value.compo = document.querySelector('.select').options[0].value;

        newDep.value.newcompo.shortname = '';
        newDep.value.newcompo.name = '';

        newComp.value.shortname = '';
        newComp.value.name = '';
    }

    function copyColor(color){
        navigator.clipboard.writeText(color);
    }

    onMounted(fetchAll);

</script>