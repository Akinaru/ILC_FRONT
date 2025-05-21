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
      <div class="card bg-base-100 shadow-xl mt-8">
  <div class="card-body">
    <h2 class="card-title flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 4.75h.5a.75.75 0 0 1 .75.75v13a.75.75 0 0 1-.75.75h-.5A4.75 4.75 0 0 1 5 14.5V9.5A4.75 4.75 0 0 1 9.75 4.75zM14.75 4.75h.5A4.75 4.75 0 0 1 20 9.5v5a4.75 4.75 0 0 1-4.75 4.75h-.5a.75.75 0 0 1-.75-.75v-13a.75.75 0 0 1 .75-.75z" />
      </svg>
      Liste des thématiques ({{ thematiques.length }})
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="(them, index) in thematiques" :key="index" class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
        <div class="card-body p-4">
          <div class="flex justify-between items-center">
            <span class="badge badge-warning badge-lg">{{ them.evthm_name }}</span>
            <div class="flex gap-1">
              <label for="modal_modif_them" class="btn btn-circle btn-sm btn-ghost" @click="modifThematique(them)">
                <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                    fill="none" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="2" />
                  <polygon fill="none"
                    points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                    stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="2" />
                </svg>
              </label>
              <button class="btn btn-circle btn-sm btn-ghost" @click="openConfirmModalThematique(them)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="addThematique.open" class="card bg-base-200 shadow-sm">
        <div class="card-body p-4">
          <input type="text" class="input input-bordered input-sm w-full mb-3"
            v-model="addThematique.name" placeholder="Nouvelle thématique" />
          <div class="flex justify-end gap-2">
            <button class="btn btn-sm " @click="addThematique.open = false">Annuler</button>
            <button class="btn btn-sm btn-primary" @click="ajouterThematique()">Ajouter</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!addThematique.open" class="mt-4">
      <button class="btn btn-sm btn-outline btn-primary" @click="addThematique.open = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une thématique
      </button>
    </div>
  </div>
</div>
  
      <!-- Liste des événements -->
      <div class="card bg-base-100 shadow-xl mt-8">
  <div class="card-body">
    <h2 class="card-title flex items-center gap-2 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" />
      </svg>
      Liste des évènements ({{ evenements.count || 0 }})
    </h2>

    <div v-if="evenements && evenements.events">
      <div v-if="evenements.count > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="(event, index) in evenements.events" :key="index" class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="card-body p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-bold text-lg">
                  <div
  class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mr-2"
  :class="joursRestants(event.evt_datetime) < 0 
    ? 'bg-red-100 text-red-800 border border-red-300' 
    : 'bg-green-100 text-green-800 border border-green-300'"
>
  <svg
    v-if="joursRestants(event.evt_datetime) < 0"
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
  {{ getJoursRestants(event.evt_datetime) }}
</div>
                  {{ event.evt_name }}
                </h3>
                <div class="badge badge-warning mt-1" v-if="event.theme">
                  {{ event.theme.evthm_name }}
                </div>
              </div>
              <div class="flex gap-1">
                <label for="modal_modif" class="btn btn-circle btn-sm btn-ghost" @click="modifEvent(event)">
                  <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                      fill="none" stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2" />
                    <polygon fill="none"
                      points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                      stroke="currentColor" stroke-linecap="round"
                      stroke-linejoin="round" stroke-width="2" />
                  </svg>
                </label>
                <button class="btn btn-circle btn-sm btn-ghost text-error" @click="openConfirmModalEvenement(event)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <RouterLink :to="{ name: 'EvenementDetail', params: { evt_id: event.evt_id } }"
              class="text-sm text-primary hover:underline mt-2 inline-block">Voir les détails</RouterLink>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-info mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Aucun évènement trouvé.</span>
      </div>
    </div>

    <div v-else class="flex justify-center py-16">
      <span class="loading loading-dots loading-lg"></span>
    </div>
  </div>
</div>

      <div>
        <!-- Modal de modification d'événement -->
        <Teleport to="body">
          <input type="checkbox" id="modal_modif" class="modal-toggle" />
          <div class="modal" role="dialog">
            <div class="modal-box max-w-2xl rounded-2xl border border-base-300 shadow-xl">
              <h3 class="text-xl font-bold">Modification de l'événement {{ currentEventModif.evt_id }}</h3>
              <p class="text-sm text-base-content/70 mt-2">Mettez à jour les informations de cet événement à venir ou passé.</p>
              <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

              <form @submit.prevent="confirmModifEvent" class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Titre</span></label>
                  <input type="text" class="input input-bordered w-full" v-model="currentEventModif.evt_name" />
                </div>

                <div class="form-control">
                  <label class="label"><span class="label-text">Thématique</span></label>
                  <select class="select select-bordered w-full" v-model="currentEventModif.evthm_id">
                    <option disabled value="">Sélectionnez une thématique</option>
                    <option v-for="(theme, index) in thematiques" :key="index" :value="theme.evthm_id">{{ theme.evthm_name }}</option>
                  </select>
                </div>

                <div class="form-control">
                  <label class="label"><span class="label-text">Date</span></label>
                  <input type="date" class="input input-bordered w-full" v-model="currentEventModif.evt_datetime" />
                </div>

                <div class="form-control">
                  <label class="label"><span class="label-text">Description</span></label>
                  <textarea class="textarea textarea-bordered h-64" v-model="currentEventModif.evt_description"></textarea>
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

  
        <!-- Modal de modification de thématique -->
        <Teleport to="body">
          <input type="checkbox" id="modal_modif_them" class="modal-toggle" />
          <div class="modal" role="dialog">
            <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
              <h3 class="text-xl font-bold">Modification de la thématique {{ currentThematiqueModif.evthm_id }}</h3>
              <p class="text-sm text-base-content/70 mt-2">Modifiez le nom et l'aperçu visuel de la thématique.</p>
              <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

              <form @submit.prevent="confirmModifThematique" class="space-y-4">
                <div class="form-control">
                  <label class="label"><span class="label-text">Nom</span></label>
                  <input type="text" class="input input-bordered w-full" v-model="currentThematiqueModif.evthm_name" />
                </div>

                <div class="mt-2">
                  <span class="badge badge-warning badge-lg">{{ currentThematiqueModif.evthm_name || 'Aperçu de la thématique' }}</span>
                </div>

                <div class="modal-action mt-6">
                  <label for="modal_modif_them" class="btn btn-ghost">Annuler</label>
                  <button type="submit">
                    <label for="modal_modif_them" class="btn btn-primary">Modifier</label>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Teleport>

  
        <!-- Modal de confirmation suppression thématique -->
        <Teleport to="body">
          <dialog id="confirmModalThematique" ref="confirmModalThematique" class="modal">
            <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
              <h3 class="text-xl font-bold">Confirmer la suppression</h3>
              <p class="text-sm text-base-content/70 mt-2">
                {{ confirmDeleteThematique.canDelete
                    ? 'Supprimez cette thématique si elle n’est liée à aucun événement.'
                    : 'Cette thématique est utilisée par au moins un événement et ne peut pas être supprimée.' }}
              </p>
              <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

              <div class="mt-3">
                <span class="badge badge-warning badge-lg">{{ confirmDeleteThematique.evthm_name }}</span>
              </div>

              <div class="modal-action mt-6">
                <button class="btn btn-ghost" @click="closeModal">Fermer</button>
                <button v-if="confirmDeleteThematique.canDelete"
                        class="btn btn-error"
                        @click="removeThematique(confirmDeleteThematique.evthm_name, confirmDeleteThematique.evthm_id)">
                  Supprimer
                </button>
              </div>
            </div>
          </dialog>
        </Teleport>

  
        <!-- Modal de confirmation suppression événement -->
        <Teleport to="body">
          <dialog id="confirmModalEvenement" ref="confirmModalEvenement" class="modal">
            <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
              <h3 class="text-xl font-bold">Confirmer la suppression</h3>
              <p class="text-sm text-base-content/70 mt-2">Cette action supprimera définitivement l'événement sélectionné.</p>
              <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

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

              <div class="modal-action mt-6">
                <button class="btn btn-ghost" @click="closeModal">Annuler</button>
                <button class="btn btn-error" @click="removeEvent(confirmDeleteEvenement.evt_name, confirmDeleteEvenement.evt_id)">
                  Supprimer
                </button>
              </div>
            </div>
          </dialog>
        </Teleport>

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
            addAction(accountStore.account.acc_id, 'event', response, 'Ajout de l\'évènement '+rep.value.event.evt_name+' pour le '+rep.value.event.evt_datetime);
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
            addAction(accountStore.account.acc_id, 'event', response, 'Ajout de la thématique '+requestData.evthm_name+'.');
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
            addAction(accountStore.account.acc_id, 'event', response, 'Suppression de la thématique '+name+'.');
        }
        await fetchAll();
    }


    // Suppression d'evenement
    async function removeEvent(title, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/event/deletebyid/'+id);
        if(response.value.status == 202){
            addAction(accountStore.account.acc_id, 'event', response, 'Suppression de l\'évènement '+title+'.');
        }
        await fetchAll();
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
            addAction(accountStore.account.acc_id, 'event', response, 'Modification de la thématique '+currentThematiqueModif.value.evthm_name+'.');
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
            addAction(accountStore.account.acc_id, 'event', response, 'Modification de l\'évènement '+currentEventModif.value.evt_name+'.');
        }
        fetchAll();
    }

    function resetInput(){
        newEvent.value.name = '';
        newEvent.value.description = '';
        newEvent.value.datetime = '';
        newEvent.value.thematique = document.querySelector('.select').options[0].value;
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