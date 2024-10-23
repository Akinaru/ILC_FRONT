<template>
    <div>
        <!-- Page -->
        <div>
            <p class="text-xl font-bold">Évènements</p>

            <!-- Formulaire d'ajout d'evenement -->
            <div class="m-5 flex justify-center items-center flex-col">
                <p class="text-lg font-bold">Ajout évènement</p>
                <form @submit.prevent="addEvent" class="w-2/5 *:my-2" enctype="multipart/form-data">
                    <input type="text" placeholder="Titre" v-model="newEvent.name" class="input input-bordered w-full" />
                    <label class="form-control w-full ">
                        <div class="label">
                            <span class="label-text">Thématique</span>
                        </div>
                        <select class="select select-bordered w-full" v-model="newEvent.thematique">
                            <option disabled selected>Selectionnez une thématique</option>
                            <option v-for="(theme, index) in thematiques" :key="index" :value="theme.evthm_id">{{ theme.evthm_name }}</option>
                            <option value="addNew">Créer une thématique</option>
                        </select>
                        <label class="form-control w-full " v-if="newEvent.thematique == 'addNew'">
                            <div class="label">
                                <span class="label-text">Nom thématique</span>
                            </div>
                            <input type="text" class="input input-bordered w-full" v-model="newEvent.newthem.name" placeholder="Nom de la thématique"/>
                            <span class="badge badge-warning mt-3">{{ newEvent.newthem.name ? newEvent.newthem.name : 'Aperçu de la thématique' }}</span>
                        </label>
                    </label>
                    <label class="form-control w-full ">
                        <div class="label">
                            <span class="label-text">Date de l'évènement</span>
                        </div>
                        <input type="date" class="input input-bordered w-full" v-model="newEvent.datetime" />
                    </label>
                    <textarea class="textarea w-full textarea-bordered h-48" placeholder="Description" v-model="newEvent.description"></textarea>
                    <div class="flex items-center justify-center *:mx-1">

                        <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter l'évènement</button>
                    </div>
                </form>
            </div>

            <!-- Liste des thématiques -->
            <div>
                <p class="text-lg font-bold">Liste des thématiques</p>
                <div v-if="thematiques" class="flex flex-wrap gap-4 py-5">
                    <div v-for="(them, index) in thematiques" :key="index" class="flex items-center my-2 bg-base-300 w-fit rounded-lg shadow-lg p-3">
                        <!-- Badge de la thématique -->
                        <span class="badge badge-warning mr-2">{{ them.evthm_name }}</span>

                        <!-- Bouton de modification -->
                        <label for="modal_modif_them" class="hover:opacity-60 cursor-pointer flex items-center p-2" @click="modifThematique(them)">
                            <svg class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                        
                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-60 p-2 cursor-pointer" @click="openConfirmModalThematique(them)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>   
                    <div v-if="addThematique.open" class="flex items-center my-2 bg-base-300 w-fit rounded-lg shadow-lg p-3">
                        <input 
                        type="text" 
                        class="badge badge-warning text-black custom-placeholder-input outline-none"   
                        v-model="addThematique.name" 
                        placeholder="Écrivez la thématique ici" 
                        />
                        <button class="hover:opacity-60 p-2 cursor-pointer" @click="ajouterThematique()">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </button>

                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-60 p-2 cursor-pointer" @click="addThematique.open = !addThematique.open">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                    </div>
                    <div v-if="!addThematique.open" class="flex items-center my-2 bg-base-300 w-fit rounded-lg shadow-lg p-3 hover:opacity-70 transition-all cursor-pointer hover:scale-105" @click="addThematique.open = !addThematique.open">Ajouter</div>                 
                </div>
            </div>


            <!-- Liste des events -->
            <div>
                <p class="text-lg font-bold">Liste des évènements</p>
                <div v-if="evenements && evenements.events" class="flex flex-col py-5 space-y-4">
                    
                    <div v-if="evenements.count > 0">

                        <div v-for="(event, index) in evenements.events" :key="index" class="flex bg-base-300 my-3 w-full max-w-full overflow-hidden rounded-lg shadow-lg"> 

                            <RouterLink class="hover:opacity-60 transition-opacity flex my-1 w-full" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
                                <div class="w-full p-4 transition-opacity">
                                    <!-- Titre de l'événement avec badge thématique -->
                                    <div class="flex justify-between items-center">
                                        <div class="flex flex-col space-y-2">
                                            <p class="text-xl font-bold">
                                                <span :class="getBadgeClass(event.evt_datetime)" class="badge badge-info mr-2">
                                                    {{ formatDate(event.evt_datetime) }}
                                                </span>
                                                {{ event.evt_name }}
                                            </p>
                                            <!-- Badge pour la thématique de l'événement -->
                                            <span v-if="event.theme" class="badge badge-warning">
                                                {{ event.theme.evthm_name }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Description de l'événement -->
                                    <pre class="truncate max-h-20 overflow-hidden whitespace-normal text-sm text-gray-700 mt-2">
                                        {{ event.evt_description }}
                                    </pre>
                                </div>
                            </RouterLink>

                            <!-- Bouton de modification -->
                            <label for="modal_modif" class="hover:opacity-60 cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifEvent(event)">
                                <svg class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>
                            
                            <!-- Bouton de suppression -->
                            <button class="hover:opacity-60 p-5 cursor-pointer bg-base-300" @click="openConfirmModalEvenement(event)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>

                        </div>
                    </div>

                    <div v-else>
                        <p>Aucun évènement trouvé.</p>
                    </div>
                </div>
                
                <div v-else class="flex items-center justify-center my-20">
                    <span class="loading loading-dots loading-lg"></span>
                </div>
            </div>



        </div>

        <!-- Partie modification et confirmation -->
        <div>
            <!-- Modal de modification d'evenement -->
            <input type="checkbox" id="modal_modif" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle" role="dialog">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification de l'évènement {{ currentEventModif.evt_id }}</h3>
                    <form @submit.prevent="confirmModifEvent" class="w-full">
                        <!-- Titre -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Titre</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentEventModif.evt_name"/>
                        </label>
                        <!-- Thématique -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Thématique</span>
                            </div>
                            <!-- Utilisation de v-model pour lier la valeur sélectionnée à la propriété currentEventModif.value.evthm_id -->
                            <select class="select select-bordered w-full" v-model="currentEventModif.evthm_id">
                                <option disabled value="">Sélectionnez une thématique</option>
                                <option v-for="(theme, index) in thematiques" :key="index" :value="theme.evthm_id">
                                    {{ theme.evthm_name }}
                                </option>
                            </select>
                        </label>
                        <!-- Datetime -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Date</span>
                            </div>
                            <input type="date" class="input input-bordered w-full" v-model="currentEventModif.evt_datetime"/>
                        </label>    
                        <!-- Description -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Description</span>
                            </div>
                            <textarea class="textarea w-full textarea-bordered h-96 min-h-96" v-model="currentEventModif.evt_description"></textarea>
                        </label>
                    
                        <!-- Save -->
                        <div class="modal-action">
                            <label for="modal_modif" class="btn ">Annuler</label>
                            <button type="submit">
                                <label for="modal_modif" class="btn btn-success">Enregistrer</label>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal de modification de thematique -->
            <input type="checkbox" id="modal_modif_them" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle" role="dialog">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification de la thématique {{ currentThematiqueModif.evthm_id }}</h3>
                    <form @submit.prevent="confirmModifThematique" class="w-full">
                        <!-- Nom -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentThematiqueModif.evthm_name"/>
                        </label>
                        <span class="badge badge-warning mt-3">{{ currentThematiqueModif.evthm_name ? currentThematiqueModif.evthm_name : 'Apperçu de la thématique' }}</span>
                    
                        <!-- Save -->
                        <div class="modal-action">
                            <label for="modal_modif_them" class="btn ">Annuler</label>
                            <button type="submit">
                                <label for="modal_modif_them" class="btn btn-success">Enregistrer</label>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal de confirmation suppression thematique -->
            <dialog id="confirmModalThematique" ref="confirmModalThematique" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                    <div class="py-3">
                        <div v-if="confirmDeleteThematique.canDelete">
                            <p>Confirmez vous la supression de la thématique: </p>
                        </div>
                        <p v-else>Vous ne pouvez pas supprimer cette thématique car elle appartient à un ou plusieurs évenements.</p>
                        <span class="badge badge-warning mt-3">{{confirmDeleteThematique.evthm_name}}</span>
                    </div>
                <!-- Si la thematique n'est dans aucun evenement -->
                <div class="modal-action" v-if="confirmDeleteThematique.canDelete">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success"  @click="removeThematique(confirmDeleteThematique.evthm_name, confirmDeleteThematique.evthm_id)">Confirmer</button>
                </div>
                <!-- Si la thematique est dans 1 ou plusieurs evenement -->
                <div class="modal-action" v-else>
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                </div>
                </div>
            </dialog>

            <!-- Modal de confirmation suppression evenement -->
            <dialog id="confirmModalEvenement" ref="confirmModalEvenement" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                    <div class="py-3">
                        <p>Confirmez vous la suppression de l'événement:</p>
                        <div class="mt-3">
                            <div>
                                <span :class="getBadgeClass(confirmDeleteEvenement.evt_datetime)" class="badge badge-info mr-2">{{ formatDate(confirmDeleteEvenement.evt_datetime) }}</span>
                                <span v-if="confirmDeleteEvenement.theme" class="badge badge-warning">{{ confirmDeleteEvenement.theme.evthm_name }}</span>
                            </div>
                            <strong>{{ confirmDeleteEvenement.evt_name }}</strong>
                        </div>
                    </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success"  @click="removeEvent(confirmDeleteEvenement.evt_name, confirmDeleteEvenement.evt_id)">Confirmer</button>
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
            const requestDataAction = {
                act_description: 'Ajout de l\'évènement '+rep.value.event.evt_name+' pour le '+rep.value.event.evt_datetime,
                acc_id: accountStore.login,
                evt_id: rep.value.event.evt_id
            }
            await request('POST', false, rep, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Ajout de la thématique '+requestData.evthm_name+'.',
                acc_id: accountStore.login,
                evt_id: 1
            }
            await request('POST', false, rep, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Suppression de la thématique '+name+'.',
                acc_id: accountStore.login,
                evt_id: id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetchAll();
    }


    // Suppression d'evenement
    async function removeEvent(title, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/event/deletebyid/'+id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'évènement '+title+'.',
                acc_id: accountStore.login,
                evt_id: id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Modification de la thématique '+currentThematiqueModif.value.evthm_name+'.',
                acc_id: accountStore.login,
                evt_id: currentThematiqueModif.value.evthm_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Modification de l\'évènement '+currentEventModif.value.evt_name+'.',
                acc_id: accountStore.login,
                evt_id: currentEventModif.value.evt_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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