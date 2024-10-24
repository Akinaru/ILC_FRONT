<template>
    <div>
        <div v-if="isLoaded">

            <!-- Partie ajout d'un accord -->
            <div class="m-5 my-20">
                <div class="m-5 flex justify-center items-center flex-col" >
                    <p class="text-lg font-bold">Ajout université</p>
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
                        <!-- Drapeau -->
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
                        <label for="modal_modif" class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="modifUniv(univ)">
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
                    <p>Nombre d'accords relié à cette Université: {{ countAgreementsByUniv(univ.univ_id) }}</p>
                

                </div>
            </div>

            <!-- Modal modification -->
            <input type="checkbox" id="modal_modif" class="modal-toggle" />
            <div class="modal modal-bottom sm:modal-middle" role="dialog">
                <div class="modal-box">
                    <h3 class="font-bold text-lg">Modification de l'université n° {{ currentUnivModif.univ_id }}</h3>
                    <form @submit.prevent="confirmModifUniv" class="w-full">
                        <!-- Nom -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentUnivModif.univ_name"/>
                        </label>
                        <!-- Ville -->
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Ville</span>
                            </div>
                            <input type="text"  class="input input-bordered w-full" v-model="currentUnivModif.univ_city"/>
                        </label>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Pays</span>
                            </div>

                            <select class="select select-bordered w-full select-primary" id="partnercountry_select" v-model="currentUnivModif.parco_id">
                                <option disabled selected value="selectACountry">Selectionnez un pays</option>
                                <option v-for="(parco, index) in partnercountry" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                            </select>
                        </label>
                        <div class="modal-action">
                            <label for="modal_modif" class="btn">Annuler</label>
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
                        <p>Confirmez vous la supression de l'université:</p>
                        <p>Cette action entraînera la suppression de l'université dans tous les accords qui y sont liés.</p>
                        <div class="bg-base-300 p-3 my-2 relative">
                            <span class="relative flex items—center justify-between">
                                <div class="flex items-center">

                                    <!-- Drapeau -->
                                    <span class="fi text-2xl" :class="'fi-' + (confirmDeleteUniv.partnercountry?.parco_code || '')"></span>
                                    
                                    <!-- Point d'interrogation si pas de drapeau -->
                                    <template v-if="!confirmDeleteUniv.partnercountry?.parco_code">
                                        <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                            ?
                                        </span>
                                    </template>
                                    
                                    
                                    <p class="ml-2">{{ confirmDeleteUniv.partnercountry?.parco_name ?? 'Pays indisponible' }}</p>
                                </div>
                            </span>
                            <p class="mt-1"><strong>{{ confirmDeleteUniv.univ_name ? confirmDeleteUniv.univ_name : 'Nom université indisponible'  }}</strong> à {{ confirmDeleteUniv.univ_city ? confirmDeleteUniv.univ_city : 'Nom ville indisponible' }}</p>
                        

                        </div>
                        <!-- Liste des accords liés -->
                        <div class="py-3">
                                <h4 class="text-lg font-bold">Accords liés à cette université ({{ filteredAgreements.length }}):</h4>
                                <div class="flex flex-col w-full max-h-64 overflow-y-auto">
                                    <div v-if="filteredAgreements.length > 0" v-for="(accord, index) in filteredAgreements" :key="index" class="bg-base-300 my-1 p-3">
                                        <span class="mr-2 flex items-center justify-start">
                                            <span class="fi text-xl transition-all duration-100 ease-in-out" :class="'fi-'+ getCountryCode(accord.partnercountry.parco_name) "></span>
                                        </span>
                                        <div class="flex flex-col">
                                            <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{ accord.university?.univ_city ?? 'Aucune ville' }} - {{ accord.university?.univ_name ?? 'Aucune université' }}</span> </p>
                                            <p>({{ accord.isced?.isc_code ?? '??' }}) - {{ accord.isced?.isc_name ?? 'ISCED indisponible' }} | {{ accord.component?.comp_name ?? 'Aucune composante' }}</p>    
                                        </div>
                                    </div>
                                    <div v-else>
                                        <p class="text-center my-5">Aucun accords</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                <div class="modal-action">
                    <button class="btn" @click="closeModal">Annuler</button>
                    <button class="btn btn-success" @click="deleteUniv(confirmDeleteUniv.univ_id, confirmDeleteUniv.univ_name, confirmDeleteUniv.univ_city)">Confirmer</button>
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
            const requestDataAction = {
                act_description: 'Modification de l\'université '+requestData.univ_name+' (' + requestData.univ_city + ').',
                acc_id: accountStore.login,
                univ_id: requestData.univ_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
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
            const requestDataAction = {
                act_description: 'Ajout de l\'université ' + requestData.univ_name + ' (' + requestData.univ_city + ').',
                acc_id: accountStore.login,
                univ_id: 1
            };
            await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
        }

    }

    // Supprimer une université
    async function deleteUniv(univ_id, univ_name, univ_city){
        await request('DELETE', true, response, config.apiUrl+'api/university/deletebyid/'+univ_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'université '+univ_name+' (' + univ_city + ').',
                acc_id: accountStore.login,
                univ_id: univ_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
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