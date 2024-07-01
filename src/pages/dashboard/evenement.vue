<template>
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

                    <button class="btn btn-primary" type="submit">Ajouter l'évènement</button>
                </div>
            </form>
        </div>
        <!-- Liste des events -->
        <div>
            <p class="text-lg font-bold">Liste des évènements</p>
            <div v-if="evenements && evenements.events" class="flex flex-col py-5">
                <div v-if="evenements.count > 0">

                    <div v-for="(event, index) in evenements.events" :key="index" class="flex bg-base-300 my-1"> 

                        <RouterLink class="hover:opacity-60 transition-opacity flex my-1  w-full" :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}">
                            <div class=" w-full p-2 transition-opacity drop-shadow-lg">
                                <div class="flex justify-between items-center">
                                    <div class="flex items-center justify-center">
                                        <p class="text-lg font-bold"><span :class="getBadgeClass(event.evt_datetime)" class="badge mr-2">{{ formatDate(event.evt_datetime) }}</span>{{ event.evt_name }}</p>
                                    </div>
                                    
                                </div>
                                <pre class="overflow-hidden whitespace-nowrap text-ellipsis">{{ event.evt_description }}</pre>
                            </div>
                        </RouterLink>

                        <!-- Bouton de modification -->
                        <label for="modal_modif" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifEvent(event)">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                        
                        
                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-60 p-5 hover:cursor-pointer bg-base-300" @click="removeEvent(event.evt_name, event.evt_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
                <!-- Description -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Description</span>
                    </div>
                    <textarea class="textarea w-full textarea-bordered h-96" v-model="currentEventModif.evt_description"></textarea>
                </label>
                <!-- Datetime -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Date</span>
                    </div>
                    <input type="date" class="input input-bordered w-full" v-model="currentEventModif.evt_datetime"/>
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
</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref } from 'vue';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import { addAlert } from '../../composables/addAlert';

    const accountStore = useAccountStore();
    const response = ref([]);
    const evenements = ref([]);
    const thematiques = ref([]);
    const newEvent = ref({ name: '', description: '', datetime: '', thematique: '', newthem: {name: ''} });

    const currentEventModif = ref([]);


    // Ajout d'evenement
    async function addEvent(){
        if(newEvent.value.name == ''){
            addAlert(true, {data:{error: 'Vous devez mettre un titre d\'événement.', message:'Ajout de l\'événement annulé.'}})
            return;
        }
        if(newEvent.value.description == ''){
            addAlert(true, {data:{error: 'Vous devez mettre une description.', message:'Ajout de l\'événement annulé.'}})
            return;
        }
        if(newEvent.value.datetime == ''){
            addAlert(true, {data:{error: 'Vous devez mettre une date.', message:'Ajout de l\'événement annulé.'}})
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
                addAlert(true, {data:{error: 'Vous devez choisir un nom de thématique.', message:'Ajout de l\'événement annulé.'}})
                return;
            }
            requestData.newthem = {
                evthm_name: newEvent.value.newthem.name,
            };
        }
        if(requestData.evthm_id == 'Selectionnez une thématique'){
            addAlert(true, {data:{error: 'Vous devez choisir une thématique.', message:'Ajout de l\'événement annulé.'}})
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

    // Suppression d'evenement
    async function removeEvent(title, id){
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
        currentEventModif.value.evt_description = event.evt_description;
        currentEventModif.value.evt_datetime = formatDateModif(event.evt_datetime);
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
    async function confirmModifEvent(){
        const requestData = { 
            evt_id: currentEventModif.value.evt_id,
            evt_name: currentEventModif.value.evt_name,
            evt_description: currentEventModif.value.evt_description,
            evt_datetime: currentEventModif.value.evt_datetime,
        };
        await request('PUT', true, response, config.apiUrl+'api/event', requestData);
        if(response.value.status == 200){
            const requestDataAction = {
                act_description: 'Modification de l\'évènement '+currentEventModif.value.evt_name+'.',
                acc_id: accountStore.login,
                art_id: currentEventModif.value.evt_id
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
