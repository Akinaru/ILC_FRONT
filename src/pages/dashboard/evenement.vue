<template>
    <div class="container mx-auto px-4 py-8">
      <!-- Titre principal -->
      <h1 class="text-2xl font-bold text-primary mb-8">Évènements</h1>
      
      <!-- Formulaire d'ajout d'événement -->
      <div class="card bg-base-200 shadow-xl mb-10">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold text-center">Ajout évènement</h2>
          <form @submit.prevent="addEvent" class="space-y-4" enctype="multipart/form-data">
            <div class="form-control">
              <input type="text" placeholder="Titre" v-model="newEvent.name" class="input input-bordered w-full" />
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Thématique</span>
              </label>
              <select class="select select-bordered w-full" v-model="newEvent.thematique">
                <option disabled selected>Selectionnez une thématique</option>
                <option v-for="(theme, index) in thematiques" :key="index" :value="theme.evthm_id">{{ theme.evthm_name }}</option>
                <option value="addNew">Créer une thématique</option>
              </select>
              
              <div v-if="newEvent.thematique == 'addNew'" class="mt-4">
                <label class="label">
                  <span class="label-text font-medium">Nom thématique</span>
                </label>
                <input type="text" class="input input-bordered w-full" v-model="newEvent.newthem.name" placeholder="Nom de la thématique"/>
                <div class="mt-2">
                  <span class="badge badge-warning badge-lg">{{ newEvent.newthem.name ? newEvent.newthem.name : 'Aperçu de la thématique' }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Date de l'évènement</span>
              </label>
              <input type="date" class="input input-bordered w-full" v-model="newEvent.datetime" />
            </div>
            
            <div class="form-control">
              <textarea class="textarea textarea-bordered h-40" placeholder="Description" v-model="newEvent.description"></textarea>
            </div>
            
            <div class="flex justify-center mt-6">
              <button class="btn btn-primary btn-wide" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Ajouter l'évènement
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Liste des thématiques -->
      <div class="card bg-base-200 shadow-xl mb-10">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold">Liste des thématiques</h2>
          
          <div v-if="thematiques" class="flex flex-wrap gap-3 mt-4">
            <div v-for="(them, index) in thematiques" :key="index" 
                 class="flex items-center bg-base-300 rounded-lg shadow p-2 transition-all hover:shadow-md">
              <span class="badge badge-warning badge-md mr-2">{{ them.evthm_name }}</span>
              
              <div class="flex space-x-1">
                <!-- Bouton de modification -->
                <label for="modal_modif_them" 
                       class="btn btn-circle btn-ghost btn-xs" 
                       @click="modifThematique(them)">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                  </svg>
                </label>
                
                <!-- Bouton de suppression -->
                <button class="btn btn-circle btn-ghost btn-xs" @click="openConfirmModalThematique(them)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Ajout de thématique -->
            <div v-if="addThematique.open" class="flex items-center bg-base-300 rounded-lg shadow p-2">
              <input type="text" 
                     class="input input-bordered input-sm mr-2"   
                     v-model="addThematique.name" 
                     placeholder="Nouvelle thématique" />
              
              <div class="flex space-x-1">
                <button class="btn btn-circle btn-ghost btn-xs text-success" @click="ajouterThematique()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                <button class="btn btn-circle btn-ghost btn-xs text-error" @click="addThematique.open = !addThematique.open">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button v-if="!addThematique.open" 
                    class="btn btn-sm btn-outline btn-primary" 
                    @click="addThematique.open = !addThematique.open">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Ajouter
            </button>
          </div>
        </div>
      </div>
  
      <!-- Liste des événements -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold">Liste des évènements</h2>
          
          <div v-if="evenements && evenements.events" class="mt-4">
            <div v-if="evenements.count > 0" class="space-y-4">
              <div v-for="(event, index) in evenements.events" :key="index" 
                   class="card bg-base-100 shadow-md hover:shadow-lg transition-all">
                <div class="flex flex-col md:flex-row">
                  <!-- Détails de l'événement -->
                  <RouterLink class="flex-1 card-body" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
                    <div class="flex flex-col space-y-3">
                      <!-- En-tête: date, titre et thématique -->
                      <div>
                        <h3 class="card-title mb-1">
                          <span :class="getBadgeClass(event.evt_datetime)" class="badge badge-md mr-2">
                            {{ formatDate(event.evt_datetime) }}
                          </span>
                          {{ event.evt_name }}
                        </h3>
                        
                        <!-- Badge thématique -->
                        <div class="mt-1">
                          <span v-if="event.theme" class="badge badge-warning badge-md">
                            {{ event.theme.evthm_name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </RouterLink>
                  
                  <!-- Actions -->
                  <div class="flex md:flex-col justify-end border-t md:border-t-0 md:border-l border-base-300">
                    <!-- Bouton de modification -->
                    <label for="modal_modif" 
                           class="btn btn-ghost btn-md flex-1 rounded-none" 
                           @click="modifEvent(event)">
                      <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                        <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      </svg>
                    </label>
                    
                    <!-- Bouton de suppression -->
                    <button class="btn btn-ghost btn-md flex-1 rounded-none text-error" 
                            @click="openConfirmModalEvenement(event)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Aucun évènement trouvé.</span>
            </div>
          </div>
          
          <!-- Loader -->
          <div v-else class="flex justify-center py-16">
            <span class="loading loading-dots loading-lg"></span>
          </div>
        </div>
      </div>
  
      <!-- Modals: garder la structure mais améliorer le style -->
      <div>
        <!-- Modal de modification d'événement -->
        <input type="checkbox" id="modal_modif" class="modal-toggle" />
        <div class="modal" role="dialog">
          <div class="modal-box max-w-2xl">
            <h3 class="font-bold text-lg mb-4">Modification de l'évènement {{ currentEventModif.evt_id }}</h3>
            
            <form @submit.prevent="confirmModifEvent" class="space-y-4">
              <!-- Titre -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Titre</span>
                </label>
                <input type="text" class="input input-bordered w-full" v-model="currentEventModif.evt_name"/>
              </div>
              
              <!-- Thématique -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Thématique</span>
                </label>
                <select class="select select-bordered w-full" v-model="currentEventModif.evthm_id">
                  <option disabled value="">Sélectionnez une thématique</option>
                  <option v-for="(theme, index) in thematiques" :key="index" :value="theme.evthm_id">
                    {{ theme.evthm_name }}
                  </option>
                </select>
              </div>
              
              <!-- Date -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Date</span>
                </label>
                <input type="date" class="input input-bordered w-full" v-model="currentEventModif.evt_datetime"/>
              </div>
              
              <!-- Description -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Description</span>
                </label>
                <textarea class="textarea textarea-bordered h-64" v-model="currentEventModif.evt_description"></textarea>
              </div>
              
              <!-- Actions -->
              <div class="modal-action mt-6">
                <label for="modal_modif" class="btn">Annuler</label>
                <button type="submit">
                  <label for="modal_modif" class="btn btn-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer
                  </label>
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Modal de modification de thématique -->
        <input type="checkbox" id="modal_modif_them" class="modal-toggle" />
        <div class="modal" role="dialog">
          <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Modification de la thématique {{ currentThematiqueModif.evthm_id }}</h3>
            
            <form @submit.prevent="confirmModifThematique" class="space-y-4">
              <!-- Nom -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Nom</span>
                </label>
                <input type="text" class="input input-bordered w-full" v-model="currentThematiqueModif.evthm_name"/>
              </div>
              
              <div class="mt-2">
                <span class="badge badge-warning badge-lg">{{ currentThematiqueModif.evthm_name ? currentThematiqueModif.evthm_name : 'Aperçu de la thématique' }}</span>
              </div>
              
              <!-- Actions -->
              <div class="modal-action mt-6">
                <label for="modal_modif_them" class="btn">Annuler</label>
                <button type="submit">
                  <label for="modal_modif_them" class="btn btn-success">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enregistrer
                  </label>
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Modal de confirmation suppression thématique -->
        <dialog id="confirmModalThematique" ref="confirmModalThematique" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold mb-4">Confirmer la suppression ?</h3>
            
            <div class="py-3">
              <div v-if="confirmDeleteThematique.canDelete">
                <p>Confirmez-vous la suppression de la thématique :</p>
              </div>
              <p v-else class="text-error">Vous ne pouvez pas supprimer cette thématique car elle appartient à un ou plusieurs évenements.</p>
              
              <div class="mt-3">
                <span class="badge badge-warning badge-lg">{{confirmDeleteThematique.evthm_name}}</span>
              </div>
            </div>
            
            <!-- Actions si suppression possible -->
            <div class="modal-action" v-if="confirmDeleteThematique.canDelete">
              <button class="btn" @click="closeModal">Annuler</button>
              <button class="btn btn-error" @click="removeThematique(confirmDeleteThematique.evthm_name, confirmDeleteThematique.evthm_id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
            
            <!-- Actions si suppression impossible -->
            <div class="modal-action" v-else>
              <button class="btn" @click="closeModal">Fermer</button>
            </div>
          </div>
        </dialog>
  
        <!-- Modal de confirmation suppression événement -->
        <dialog id="confirmModalEvenement" ref="confirmModalEvenement" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold mb-4">Confirmer la suppression ?</h3>
            
            <div class="py-3">
              <p>Confirmez-vous la suppression de l'événement :</p>
              
              <div class="card bg-base-300 p-4 mt-3">
                <div class="mb-2">
                  <span :class="getBadgeClass(confirmDeleteEvenement.evt_datetime)" class="badge badge-md mr-2">
                    {{ formatDate(confirmDeleteEvenement.evt_datetime) }}
                  </span>
                  <span v-if="confirmDeleteEvenement.theme" class="badge badge-warning badge-md">
                    {{ confirmDeleteEvenement.theme.evthm_name }}
                  </span>
                </div>
                <h4 class="font-bold text-lg">{{ confirmDeleteEvenement.evt_name }}</h4>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn" @click="closeModal">Annuler</button>
              <button class="btn btn-error" @click="removeEvent(confirmDeleteEvenement.evt_name, confirmDeleteEvenement.evt_id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  </template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref, computed } from 'vue';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import { addAlert } from '../../composables/addAlert';
import { addAction } from '../../composables/actionType';

    const accountStore = useAccountStore();
    const response = ref([]);
    const evenements = ref([]);
    const thematiques = ref([]);
    const newEvent = ref({ name: '', description: '', datetime: '', thematique: '', newthem: {name: ''} });

    const currentEventModif = ref([]);
    const currentThematiqueModif = ref([]);

    const confirmDeleteThematique = ref([])
    const confirmDeleteEvenement = ref([])

    const addThematique = ref({
        open: false,
        name: ''
    })


    // Ajout d'evenement
    async function addEvent(){
        if(newEvent.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un titre d\'événement.', message:'Ajout de l\'événement annulé.'}})
            return;
        }
        if(newEvent.value.description == ''){
            addAlert('error', {data:{error: 'Vous devez mettre une description.', message:'Ajout de l\'événement annulé.'}})
            return;
        }
        if(newEvent.value.datetime == ''){
            addAlert('error', {data:{error: 'Vous devez mettre une date.', message:'Ajout de l\'événement annulé.'}})
            return;
        }        
        const requestData = {
            evt_name: newEvent.value.name, 
            evt_description: newEvent.value.description, 
            evt_datetime: newEvent.value.datetime, 
        }
        if (newEvent.value.thematique !== 'addNew') {
            requestData.evthm_id = newEvent.value.thematique;
        } else {
            if(newEvent.value.newthem.name == ''){
                addAlert('error', {data:{error: 'Vous devez choisir un nom de thématique.', message:'Ajout de l\'événement annulé.'}})
                return;
            }
            requestData.newthem = {
                evthm_name: newEvent.value.newthem.name,
            };
        }
        if(requestData.evthm_id == 'Selectionnez une thématique'){
            addAlert('error', {data:{error: 'Vous devez choisir une thématique.', message:'Ajout de l\'événement annulé.'}})
            return;
        }

        var rep = ref();
        await request("POST", true, rep, config.apiUrl+'api/event', requestData);
        await fetchAll();

        if(rep.value.status == 201){
            addAction(accountStore.login, 'event', response, 'Ajout de l\'évènement '+rep.value.event.evt_name+' pour le '+rep.value.event.evt_datetime);
        }
        resetInput()

    }

    //Ajouter une thématique
    async function ajouterThematique(){
        if(addThematique.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom de thématique.', message:'Ajout de la thématique annulé.'}})
            return;
        }   
        const requestData = {
            evthm_name: addThematique.value.name
        }
        var rep = ref();
        await request("POST", true, rep, config.apiUrl+'api/eventtheme', requestData);

        if(rep.value.status == 201){
            addThematique.value = {
                open: false,
                name: ''
            }
            addAction(accountStore.login, 'event', response, 'Ajout de la thématique '+requestData.evthm_name+'.');
            await fetchAll();
        }
    }

    //ouvrir le modal de confirmation de suppression des thematiques
    function openConfirmModalThematique(them) {
        confirmDeleteThematique.value = them;
        confirmDeleteThematique.value.canDelete = countEventsByTheme(them.evthm_id) > 0 ? false : true;
        const modal = document.getElementById('confirmModalThematique')
        modal.showModal()
    }
    //ouvrir le modal de confirmation de suppression des evenements
    function openConfirmModalEvenement(event) {
        confirmDeleteEvenement.value = event;
        const modal = document.getElementById('confirmModalEvenement')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModalThematique')
        modal.close()
        const modal2 = document.getElementById('confirmModalEvenement')
        modal2.close()
    }

    // Renvoie le nombre d'evenement qui ont la thématique demandée (id de la thematique en parametre)
    function countEventsByTheme(themeId) {
        if (!evenements.value || !evenements.value.events) {
            return 0;
        }
        const eventsWithTheme = evenements.value.events.filter(event => event.theme && event.theme.evthm_id === themeId);
        return eventsWithTheme.length;
    }

    async function removeThematique(name, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/eventtheme/deletebyid/'+id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'event', response, 'Suppression de la thématique '+name+'.');
        }
        await fetchAll();
    }


    // Suppression d'evenement
    async function removeEvent(title, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/event/deletebyid/'+id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'event', response, 'Suppression de l\'évènement '+title+'.');
        }
        await fetchAll();
    }


    
    // Gestion de la modification d'evenement
    // Modifie la ref par l'evenement qu'on veut modifier
    // pour afficher les bonnes informations dans le form de modif
    function modifEvent(event){
        currentEventModif.value.evt_id = event.evt_id;
        currentEventModif.value.evt_name = event.evt_name;
        currentEventModif.value.evthm_id = event.theme.evthm_id;
        currentEventModif.value.evt_description = event.evt_description;
        currentEventModif.value.evt_datetime = formatDateModif(event.evt_datetime);
    }
    function modifThematique(them){
        currentThematiqueModif.value.evthm_id = them.evthm_id;
        currentThematiqueModif.value.evthm_name = them.evthm_name;
    }

    // On format la date car la valeur entrée de input et sortie de l'api ne sont pas compatible 
    function formatDateModif(dateTime) {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Confirmer la modification
    async function confirmModifThematique(){
        const requestData = { 
            evthm_id: currentThematiqueModif.value.evthm_id,
            evthm_name: currentThematiqueModif.value.evthm_name,
        };
        await request('PUT', true, response, config.apiUrl+'api/eventtheme', requestData);
        if(response.value.status == 200){
            addAction(accountStore.login, 'event', response, 'Modification de la thématique '+currentThematiqueModif.value.evthm_name+'.');
        }
        fetchAll();
    }

    // Confirmer la modification
    async function confirmModifEvent(){
        const requestData = { 
            evt_id: currentEventModif.value.evt_id,
            evt_name: currentEventModif.value.evt_name,
            evthm_id: currentEventModif.value.evthm_id,
            evt_description: currentEventModif.value.evt_description,
            evt_datetime: currentEventModif.value.evt_datetime,
        };
        await request('PUT', true, response, config.apiUrl+'api/event', requestData);
        if(response.value.status == 200){
            addAction(accountStore.login, 'event', response, 'Modification de l\'évènement '+currentEventModif.value.evt_name+'.');
        }
        fetchAll();
    }

    function resetInput(){
        newEvent.value.name = '';
        newEvent.value.description = '';
        newEvent.value.datetime = '';
        newEvent.value.thematique = document.querySelector('.select').options[0].value;
    }

    function formatDate(dateTime) {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont de 0 à 11
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    function getBadgeClass(dateTime) {
        const eventDate = new Date(dateTime);
        const now = new Date();
        if (eventDate.toDateString() === now.toDateString()) {
            return 'badge-primary'; // Si c'est aujourd'hui
        } else {
            return eventDate >= now ? 'badge-success' : 'badge-error'; // Sinon, comme avant
        }
    }
    
    async function fetchAll(){
        await request('GET', false, evenements, config.apiUrl+'api/event');
        await request('GET', false, thematiques, config.apiUrl+'api/eventtheme');
        resetInput()
    }

    onMounted(fetchAll);
</script>


<style scoped>

    .modal-box{
        z-index: 50 !important;
    }

    .custom-placeholder-input::placeholder {
        color: black; /* Remplacez 'gray' par la couleur de votre choix */
        opacity: 1; /* Pour rendre le placeholder bien visible */
    }

</style>