<template>
    <div>
        <div v-if="isLoaded">

            <!-- Partie ajout d'un isced -->
            <div class="m-5 my-20">
                <div class="m-5 flex justify-center items-center flex-col" >
                    <p class="text-lg font-bold">Ajout Isced</p>
                    <form @submit.prevent="addIsced" class="w-2/5 *:my-2">
                        <!-- Formulaire Isced -->
                        <label class="form-control w-full items-center justify-center">
                        

                            <input type="text" placeholder="Code de l'isced (ex: 071)" v-model="newIsced.isc_code" class="input input-bordered w-full my-1" />
                            <input type="text" placeholder="Nom de l'isced" v-model="newIsced.isc_name" class="input input-bordered w-full my-1" />

                            
                        </label>
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter l'isced</button>
                        </div>
                    </form>
                </div>

            </div>


            <p class="font-bold text-xl mb-5">Liste des ISCED:</p>
            <!-- Liste des ISCED -->
            <div class="flex flex-wrap justify-center gap-2">
                <div v-for="(isced, index) in isceds" :key="index" class="bg-base-300 min-h-30 p-3 my-2 min-w-96 max-w-96 relative">
                    <span class="relative flex items—center justify-between">
                        <div class="flex w-full justify-end">
                            <!-- Bouton de modification -->
                            <label for="modal_modif" class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="modifIsced(isced)">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>
                            <!-- Bouton de suppression -->
                            <button class="hover:opacity-70 p-3 hover:cursor-pointer bg-base-300 " @click="openConfirmModal(isced)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </span>
                    <p class="mt-1">{{ isced.isc_code }} - <strong>{{ isced.isc_name }}</strong></p>
                    <p>Nombre d'accords relié à cet ISCED: {{ countAgreementsByIsced(isced.isc_id) }}</p>

                </div>
            </div>

            <!-- Modal modification -->
            <input type="checkbox" id="modal_modif" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle" role="dialog">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification de l'isced n° {{ currentIscedModif.isc_id }}</h3>
                    <form @submit.prevent="confirmModifIsced" class="w-full">
                        <!-- Code -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Code</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentIscedModif.isc_code"/>
                        </label>
                        <!-- Nom -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentIscedModif.isc_name"/>
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
                        <p>Confirmez vous la supression de l'isced:</p>
                        <p>Cette action entraînera la suppression de l'ISCED dans tous les accords qui y sont liés.</p>
                        <div class="bg-base-300 p-3 my-2 relative">
                            <p class="mt-1">({{ confirmDeleteIsced.isc_code }}) - {{ confirmDeleteIsced.isc_name }}</p>
                        </div>

                        <!-- Liste des accords liés -->
                        <div class="py-3">
                            <h4 class="text-lg font-bold">Accords liés à cet ISCED ({{ filteredAgreements.length }}):</h4>
                            <div class="flex flex-col w-full max-h-64 overflow-y-auto">
                                <div v-if="filteredAgreements.length > 0" v-for="(accord, index) in filteredAgreements" :key="index" class="bg-base-300 my-1 p-3">
                                    <span class="mr-2 flex items-center justify-start">
                                        <span class="fi text-xl transition-all duration-100 ease-in-out" :class="'fi-'+ getCountryCode(accord.partnercountry.parco_name) "></span>
                                    </span>
                                    <div class="flex flex-col">
                                        <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{ accord.university?.univ_city ?? 'Aucune ville' }} - {{ accord.university?.univ_name ?? 'Aucune université' }}</span> </p>
                                        <p>{{ accord.component?.comp_name ?? 'Aucune composante' }}</p>    
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="text-center my-5">Aucun accords</p>
                                </div>
                            </div>
                        </div>

                    </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success" @click="deleteIsced(confirmDeleteIsced.isc_id, confirmDeleteIsced.isc_name, confirmDeleteIsced.isc_code)">Confirmer</button>
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
        currentIscedModif.value.isc_id = isced.isc_id;
        currentIscedModif.value.isc_name = isced.isc_name;
        currentIscedModif.value.isc_code = isced.isc_code;
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
            const requestDataAction = {
                act_description: 'Modification de l\'isced (' + requestData.isc_code + ') '+requestData.isc_name+'.',
                acc_id: accountStore.login,
                isc_id: requestData.isc_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Ajout de l\'isced (' + requestData.isc_code + ') '+requestData.isc_name+'.',
                acc_id: accountStore.login,
                isc_id: 1
            };
            await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
        }

    }

    // Supprimer une université
    async function deleteIsced(isc_id, isc_name, isc_code){
        await request('DELETE', true, response, config.apiUrl+'api/isced/deletebyid/'+isc_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'université (' + isc_code + ') '+isc_name+'.',
                acc_id: accountStore.login,
                isc_id: isc_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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