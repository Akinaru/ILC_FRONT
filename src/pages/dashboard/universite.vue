<template>
    <div>
        <div v-if="isLoaded">

            <!-- Partie ajout d'un accord -->
            <div class="m-5 my-20">
                <div class="m-5 flex justify-center items-center flex-col" >
                    <p class="text-lg font-bold">Ajout accord</p>
                    <form @submit.prevent="addUniv" class="w-2/5 *:my-2">
                        <!-- Formulaire université -->
                        <label class="form-control w-full items-center justify-center">
                        

                            <input type="text" placeholder="Nom de l'université" v-model="newUniv.univ_name" class="input input-bordered w-full my-1" />
                            <input type="text" placeholder="Nom de la ville" v-model="newUniv.univ_city" class="input input-bordered w-full my-1" />

                            <select class="select select-bordered w-full select-primary" id="partnercountry_select" v-model="newUniv.parco_id">
                                <option disabled selected value="selectACountry">Selectionnez un pays</option>
                                <option value="addNew"> + Créer un pays</option>
                                <option v-for="(parco, index) in partnercountry" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                            </select>
                            <span class="flex items-center justify-center w-full" v-if="newUniv.parco_id === 'addNew'" type="text">
                                <input placeholder="Nouveau pays (ex: France)" v-model="newUniv.newparco.parco_name" class="input input-bordered w-5/6 my-1" />
                                <input type="text" placeholder="Code pays (ex: fr, de, it)" v-model="newUniv.newparco.parco_code" class="input input-bordered w-5/6 my-1" />
                            </span>

                            
                        </label>
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter l'accord</button>
                        </div>
                    </form>
                </div>

            </div>


            <p class="font-bold text-xl mb-5">Liste des Universités:</p>
            <!-- Partie filtre -->
            <div class="bg-base-200 w-full drop-shadow-lg block my-10">
                <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                <p>{{ filteredUniversities.length }} résultats ({{ selectedCountries.length}} filtre{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                <!-- Pays -->
                <div>
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                        <p>Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                    </div>
                    <div class="p-1" v-show="isOpen.pays">
                        <button class="hover:opacity-70 underline" @click="deselectAllCountry">Tout désélectionner</button>
                        <div class="flex flex-wrap">
                            <div v-for="(country, index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 w-1/2 sm:w-1/3 lg:w-1/4 xl:w-1/5">
                                <input :id="'filt_pays_' + index" type="checkbox" class="checkbox" :value="country.parco_name" v-model="selectedCountries">
                                <label :for="'filt_pays_' + index" class="flex w-full items-center cursor-pointer pl-2">
                                    <span class="fi mr-1" :class="'fi-' + country.parco_code"></span>
                                    <label :for="'filt_pays_' + index" class="select-none w-full cursor-pointer">{{ country.parco_name }}</label>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Liste des universités -->
            <div class="flex flex-wrap justify-center gap-2">
                <div v-for="(univ, index) in filteredUniversities" :key="index" class="bg-base-300 min-h-40 p-3 my-2 min-w-96 max-w-96 relative">
                    <span class="relative flex items—center justify-between">
                        <div class="flex items-center">

                            <!-- Drapeau -->
                            <span class="fi text-2xl" :class="'fi-' + (univ.partnercountry?.parco_code || '')"></span>
                            
                            <!-- Point d'interrogation si pas de drapeau -->
                            <template v-if="!univ.partnercountry?.parco_code">
                                <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                    ?
                                </span>
                            </template>
                            
                            
                            <p class="ml-2">{{ univ.partnercountry?.parco_name ?? 'Pays indisponible' }}</p>
                        </div>
                        <div class="flex">
                        <!-- Bouton de modification -->
                        <label class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="modifUniv(univ)">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-70 p-3 hover:cursor-pointer bg-base-300 " @click="openConfirmModal(univ)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    </span>
                    <p class="mt-1"><strong>{{ univ.univ_name ? univ.univ_name : 'Nom université indisponible'  }}</strong> à {{ univ.univ_city ? univ.univ_city : 'Nom ville indisponible' }}</p>
                

                </div>
            </div>
            <!-- Modal de confirmation suppression -->
            <dialog id="confirmModal" ref="confirmModal" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                    <div class="py-3">
                        <p>Confirmez vous la supression de l'université: <strong>{{confirmDeleteUniv}}</strong></p>
                    </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success">Confirmer</button>
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
    const universites = ref([]);
    const partnercountry = ref([]);
    const confirmDeleteUniv = ref([])
    const selectedCountries = ref([]);
    const response = ref([])

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
        console.log(requestData)
        // Effectuer la requête POST pour ajouter l'accord
        await request("POST", true, response, config.apiUrl + 'api/university', requestData);

        // Vérification de la réponse et ajout d'une action si nécessaire
        if (response.value.status === 201) {
            
            // Rafraîchir les données après l'ajout
            await fetchAll();
            const requestDataAction = {
                act_description: 'Ajout de l\'université avec ' + newUniv.value.univ_name + ' (' + newUniv.value.parco_name + ').',
                acc_id: accountStore.login,
                univ_id: 1
            };
            await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
        }

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

    async function deleteUniv(univ_id, univ_name){

    }

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, universites, config.apiUrl + 'api/university');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        isLoaded.value = true;
        await nextTick()
        resetInput()
    }

    function deselectAllCountry() {
            selectedCountries.value = [];
        }

    onMounted(fetchAll)
</script>