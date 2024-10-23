<template>
    <div>
        <div v-if="isLoaded">

            <!-- Partie ajout d'un pays -->
            <div class="m-5 my-20">
                <div class="m-5 flex justify-center items-center flex-col" >
                    <p class="text-lg font-bold">Ajout Pays</p>
                    <form @submit.prevent="addPays" class="w-2/5 *:my-2">
                        <!-- Formulaire Pays -->
                        <label class="form-control w-full items-center justify-center">
                        

                            <input type="text" placeholder="Nom du pays" v-model="newPays.parco_name" class="input input-bordered w-full my-1" />
                            <input type="text" placeholder="Code du pays (ex: FR, BE, DE)" v-model="newPays.parco_code" class="input input-bordered w-full my-1" />

                            
                        </label>
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter le pays</button>
                        </div>
                    </form>
                </div>

            </div>


            <p class="font-bold text-xl mb-5">Liste des Pays</p>
            <!-- Liste des Pays -->
            <div class="flex flex-wrap justify-center gap-2">
                <div v-for="(pays, index) in partnercountry" :key="index" class="bg-base-300 min-h-30 p-3 my-2 min-w-96 max-w-96 relative">
                    <span class="relative flex items—center justify-between">
                        <!-- Drapeau -->
                        <span class="relative inline-block">
                            <span class="fi text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (pays?.parco_code || '')"></span>

                            <!-- Point d'interrogation si pas de drapeau -->
                            <span v-if="!pays?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                ?
                            </span>
                        </span>
                        <!-- Boutons -->
                        <div class="flex w-full justify-end">
                            
                            <!-- Bouton de modification -->
                            <label for="modal_modif" class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="modifPays(pays)">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>
                            <!-- Bouton de suppression -->
                            <button class="hover:opacity-70 p-3 hover:cursor-pointer bg-base-300 " @click="openConfirmModal(pays)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </span>

                    <p class="mt-1"><strong>{{ pays.parco_name }}</strong> ({{ pays.parco_code.toUpperCase() }})</p>
                    <p>Nombre d'universités relié à ce pays: {{ countUnivByPays(pays.parco_id) }}</p>

                </div>
            </div>

            <!-- Modal modification -->
            <input type="checkbox" id="modal_modif" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle" role="dialog">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification du pays n° {{ currentPaysModif.parco_id }}</h3>
                    <form @submit.prevent="confirmModifPays" class="w-full">
                        <!-- Nom -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentPaysModif.parco_name"/>
                        </label>
                        <!-- Code -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Code</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentPaysModif.parco_code"/>
                        </label>


                        <div class="modal-action">
                            <label for="modal_modif" class="btn ">Annuler</label>
                            <button type="submit">
                                <label for="modal_modif" class="btn btn-success">Enregistrer</label>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal de confirmation suppression -->
            <dialog id="confirmModal" ref="confirmModal" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                    <div class="py-3">
                        <p>Confirmez vous la supression du pays:</p>
                        <p>Cette action entraînera la suppression du pays dans tous les accords qui y sont liés.</p>
                        <div class="bg-base-300 p-3 my-2 flex items-center justify-start">
                            <!-- Drapeau -->
                            <span class="relative inline-block">
                                <span class="fi text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (confirmDeletePays?.parco_code || '')"></span>

                                <!-- Point d'interrogation si pas de drapeau -->
                                <span v-if="!confirmDeletePays?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                    ?
                                </span>
                            </span>
                            <p class="mt-1 ml-1">({{ confirmDeletePays.parco_code }}) - {{ confirmDeletePays.parco_name }}</p>
                        </div>

                        <!-- Liste des université liés -->
                        <div class="py-3">
                            <h4 class="text-lg font-bold">Universités liés à ce pays ({{ filteredUniveristy.length }}):</h4>
                            <div class="flex flex-col w-full max-h-64 overflow-y-auto">
                                <div v-if="filteredUniveristy.length > 0" v-for="(univ, index) in filteredUniveristy" :key="index" class="bg-base-300 my-1 p-3 flex items-center justify-start">
                                    <span class="mr-2 flex items-center justify-start">
                                        <span class="fi text-xl transition-all duration-100 ease-in-out" :class="'fi-'+ getCountryCode(univ.partnercountry.parco_name) "></span>
                                    </span>
                                    <div class="flex flex-col">
                                        <p class="w-full select-none"><span class="font-bold">{{ univ.univ_city ?? 'Aucune ville' }} - {{ univ.univ_name ?? 'Aucune université' }}</span> </p>  
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="text-center my-5">Aucune université</p>
                                </div>
                            </div>
                        </div>

                    </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success" @click="deletePays(confirmDeletePays.parco_id, confirmDeletePays.parco_name, confirmDeletePays.parco_code)">Confirmer</button>
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
            const requestDataAction = {
                act_description: 'Modification du pays (' + requestData.parco_code + ') '+requestData.parco_name+'.',
                acc_id: accountStore.login,
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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
            
            // Rafraîchir les données après l'ajout
            const requestDataAction = {
                act_description: 'Ajout du pays (' + requestData.parco_code + ') '+requestData.parco_name+'.',
                acc_id: accountStore.login,
            };
            await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
            fetchAll();
        }

    }

    // Supprimer un pays
    async function deletePays(parco_id, parco_name, parco_code){
        await request('DELETE', true, response, config.apiUrl+'api/partnercountry/'+parco_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression du pays (' + parco_code + ') '+parco_name+'.',
                acc_id: accountStore.login,
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
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