<template>
    <div v-if="isLoaded">
        <p class="font-bold text-xl text-center">Arbitrage</p>
        <div class="flex">
            <!-- Gauche -->
            <div class=" min-h-screen flex flex-col items-center">
                <p class="text-center py-5">Liste des étudiants</p>

                <!-- Partie filtre étudiants -->
                <div class="flex items-center justify-center py-5">
                    <div class="bg-base-200 drop-shadow-lg w-96" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg select-none">Filtres</p>
                        <p class="select-none">{{ filteredEtus.length }} résultats ({{ selectedDepartment.length }} filtre{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                        <!-- Départements -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                                <p class="select-none">Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.departments">
                                <button class="hover:opacity-70" @click="deselectAllDept">Tout désélectionner</button>
                                <div v-for="(comp, index) in components.components" :key="index">
                                    <div class="lg:block flex flex-wrap">
                                        <p>- {{ comp.comp_name }}</p>
                                        <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                            <input :id="'filt_dept_'+index" type="checkbox" class="checkbox" :value="dept.dept_shortname" v-model="selectedDepartment">
                                            <label :for="'filt_dept_'+index" class="w-full flex items-center justify-center cursor-pointer pl-2">
                                                <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                                <label :for="'filt_dept_'+index" class="select-none w-full hover:cursor-pointer">{{ dept.dept_shortname }}</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Voeux -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('voeux')">
                                <p class="select-none">Nombre de voeux ({{ selectedVoeux.length }} séléctionné{{ selectedVoeux.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.voeux ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.voeux">
                                <button class="hover:opacity-70" @click="deselectAllVoeux">Tout désélectionner</button>
                                
                                <div v-for="(voeu,index) in voeuxNoms" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                    <input :id="'filt_voeux_'+index" type="checkbox" class="checkbox" :value="voeu.val" v-model="selectedVoeux">
                                    <label :for="'filt_voeux_'+index" class="cursor-pointer w-full pl-2">
                                        <label :for="'filt_voeux_'+index" class="select-none w-full hover:cursor-pointer">{{ voeu.name }}</label>
                                    </label>
                                </div>
                            </div>
                        </div>                        
                        <!-- Accords -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('accords')">
                                <p class="select-none">Accords (voeux) ({{ selectedAccord.length }} séléctionné{{ selectedAccord.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.accords ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.accords">
                                <button class="hover:opacity-70" @click="deselectAllAccord">Tout désélectionner</button>

                                <div v-for="(accord,index) in accords.agreements" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                    <input :id="'filt_accord_'+index" type="checkbox" class="checkbox" :value="accord.agree_id" v-model="selectedAccord">
                                    <label :for="'filt_accord_'+index" class="cursor-pointer w-full pl-2">
                                        <span class="fi mr-1" :class="'fi-'+accord.partnercountry.parco_code"></span>
                                        <label :for="'filt_accord_'+index" class="select-none w-full hover:cursor-pointer">{{ accord.university.univ_name }} - {{ accord.isced.isc_code }}</label>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Affichage des etudiants -->
                <div class="flex flex-col items-center justify-start w-full">
                    <div class="elementDrag bg-base-300 w-96 mb-2 flex items-center justify-center cursor-move select-none hover:opacity-80 flex-col" 
                        :draggable="true" 
                        :id="'etu_drag_'+etu.acc_id"
                        v-for="(etu, index) in filteredEtus" :key="index"
                        :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">  

                        <div class="flex items-center justify-between w-full p-1">
                            <p v-if="etu.department" :style="{backgroundColor: etu.department.dept_color}" class="p-2 rounded-lg min-w-16 text-center">{{ etu.department.dept_shortname }}</p>
                            <p v-else class="bg-gray-500 p-2 rounded-lg min-w-16 text-center">Aucun</p>
                            <div class="flex flex-col w-full items-center justify-start">
                                <p class="w-full text-center">{{ etu.acc_fullname }}</p> 
                                <p class="py-1" v-if="etu.wishes.count <= 0" >Aucun voeux enregistrés.</p>
                            </div>
                        </div>

                        <div v-if="etu.wishes.count > 0" class="bg-base-200 w-full p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapseEtu(etu.acc_id)">
                            <p>Voir les voeux</p>
                            <span :class="isOpen.etudiants[etu.acc_id] ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                        </div>

                        <div class="p-1 w-full" v-show="isOpen.etudiants[etu.acc_id]">
                            <div>
                                <div>
                                    <div v-for="(accord, index) in getFilteredAgreements(etu)" :key="index" class="flex justify-between">
                                        <p class="min-w-fit">Voeu {{ accord.place }}</p>
                                        <div class="flex w-full items-center justify-start ml-2">
                                            <span class="fi mr-1" :class="'fi-'+accord.agreement.partnercountry.parco_code"></span>
                                            <p>{{accord.agreement.university.univ_name}} {{ accord.agreement.isced.isc_code }}</p>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>
                        </div>
   

                    </div>
                </div>
            </div>

            <!-- Droite -->
            <div class=" min-h-screen flex flex-col items-center">
                <p class="text-center py-5 w-full">Liste des accords</p>

                <!-- Partie filtre accords -->
                <div class="flex items-center justify-center py-5 w-full">
                    <div class="bg-base-200 drop-shadow-lg w-11/12" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg select-none">Filtres</p>
                        <p class="select-none">{{ filteredArbitrage.length }} résultats ({{ selectedCountries.length }} filtre{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                        <!-- Pays -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                                <p class="select-none">Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.pays">
                                <button class="hover:opacity-70" @click="deselectAllCountry">Tout désélectionner</button>
                                <div class="flex flex-wrap items-center justify-start">

                                    <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 md:w-2/6 xl:w-1/6 hover:cursor-pointer">
                                        <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2 checkbox-sm" :value="country.parco_name" v-model="selectedCountries">
                                        <div class="flex w-full">
                                            <label :for="'filt_pays_'+index" class="w-full cursor-pointer">
                                                <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                                <label :for="'filt_pays_'+index" class="select-none w-full text-sm  hover:cursor-pointer">{{ country.parco_name }}</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                
                <!-- Partie rendu accord -->
                <div class="flex flex-col items-center justify-start w-full select-none">
                    <div v-for="(arbitrage, accordIndex) in filteredArbitrage" :key="'accord-' + accordIndex" class="bg-base-300 w-11/12 mb-4 p-4 rounded-lg">
                        <div class="flex items-center justify-center mb-2">
                            <span class="fi md:text-3xl text-xl transition-all duration-200 ease-in-out mr-2" :class="'fi-' + arbitrage.agreement.partnercountry.parco_code"></span>
                            <p class="font-bold text-lg">{{ arbitrage.agreement.partnercountry.parco_name }}</p>
                        </div>
                        <p class="text-center mb-3">{{ arbitrage.agreement.university.univ_name }} - {{ arbitrage.agreement.isced.isc_code }} {{ arbitrage.agreement.isced.isc_name }} </p>

                        <div class="w-full flex justify-center">
                            <div class="flex flex-wrap gap-4 justify-center w-full">
                                <!-- Rendu des cases -->
                                <div :id="'drop_'+arbitrage.agreement.agree_id+'_'+placeIndex" v-for="(place, placeIndex) in getNumberOfPlace(arbitrage.agreement.agree_id)" :key="'place-' + placeIndex" 
                                    class="dropZones bg-base-200 m-1 h-20 w-72 relative flex items-center justify-center">
                                    <div v-if="arbitrage.accounts[placeIndex] && arbitrage.accounts[placeIndex].account"
                                    draggable="true"
                                    :id="'etu_drag_'+arbitrage.accounts[placeIndex].account.acc_id"
                                    class="h-full w-full flex items-center justify-center elementDrag cursor-move hover:opacity-60"
                                    :style="{borderBottom: `4px solid ${arbitrage.accounts[placeIndex]?.account?.department?.dept_color || '#aaaaaa'}`}">
                                        <p>{{ arbitrage.accounts[placeIndex].account.acc_fullname }}</p>
                                        <button @click="removeEtuFromPlace(arbitrage.agreement.agree_id, placeIndex)" class="hover:cursor-pointer hover:opacity-60 absolute top-0 right-0 p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <p v-else class="">Aucun étudiant</p>
                                </div>
                                <div class="w-72 h-20 m-1 flex items-center justify-center border-8 border-base-200 bg-base-100 hover:opacity-60 cursor-pointer"
                                    @click="addPlace(arbitrage.agreement.agree_id)">
                                    <p class="text-lg font-bold">+</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>

    import { ref, onMounted, computed, nextTick, watch } from 'vue'
    import { request } from '../../composables/httpRequest'
    import config from '../../config'
    import LoadingComp from '../../components/utils/LoadingComp.vue';

    const response = ref([])
    const accords = ref([])
    const etudiants = ref([])
    const components = ref([])
    const partnercountry = ref([])
    const isLoaded = ref(false)

    const selectedDepartment = ref([]);
    const selectedAccord = ref([]);
    const selectedVoeux = ref([]);
    const selectedCountries = ref([]);

    const arbitrage = ref([])

    const localEtus = ref([]);
    const localArbitrage = ref([])

    const voeuxNoms = [
        {val: 0, name: 'Aucun voeux'},
        {val: 1, name: '1 voeu'},
        {val: 2, name: '2 voeux'},
        {val: 3, name: '3 voeux'},
        {val: 4, name: '4 voeux'},
        {val: 5, name: '5 voeux'},
        {val: 6, name: '6 voeux'},
    ]

    const isOpen = ref({
        pays: false,
        departments: false,
        accords: false,
        voeux: false,
        etudiants: [], 
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }
    const toggleCollapseEtu = (acc_id) => {
        isOpen.value.etudiants[acc_id] = !isOpen.value.etudiants[acc_id];
    };

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        await request('GET', false, etudiants, config.apiUrl+'api/account/students');
        await request('GET', false, arbitrage, config.apiUrl+'api/arbitrage');
        isLoaded.value = true;
        init();
        if (etudiants.value && etudiants.value.accounts) {
            isOpen.value.etudiants = etudiants.value.accounts.reduce((acc, student) => {
                acc[student.acc_id] = false;
                return acc;
            }, {});
        }
    }



    async function init() {
    // Initialiser localEtus avec les étudiants qui ne sont pas dans arbitrage
    localEtus.value = etudiants.value.accounts
        .filter(etu => !arbitrage.value.some(arbitre => arbitre.account.acc_id === etu.acc_id))
        .reduce((acc, etu) => {
            acc[etu.acc_id] = etu;
            return acc;
    }, {});

    // Initialiser localArbitrage avec les accords et les informations sur les étudiants correspondants
    localArbitrage.value = accords.value.agreements.reduce((acc, accord) => {
        // Obtenir toutes les positions possibles pour l'accord actuel
        const allPositions = getNumberOfPlace(accord.agree_id);

        // Chercher les étudiants correspondants dans arbitrage
        const matchingArbitrages = arbitrage.value.filter(arbitre => arbitre.agreement.agree_id === accord.agree_id);

        // Créer l'objet pour l'accord actuel
        acc[accord.agree_id] = {
            agreement: accord,
            accounts: allPositions.map(pos => {
                // Chercher les arbitrages qui correspondent à la position actuelle
                const matchingArbitrage = matchingArbitrages.find(arbitre => arbitre.arb_pos === pos + 1);
                return {
                    arb_pos: pos + 1, // Les positions doivent être basées sur 1
                    account: matchingArbitrage ? matchingArbitrage.account : null // Mettre account à null si matchingArbitrage n'existe pas
                };
            })
        };

        return acc;
    }, {});

    // Attendre le prochain "tick" pour assurer que les changements sont appliqués
    await nextTick();

    // Rafraîchir les éléments de drag and drop
    refreshDrag();
    refreshDrop();
}




    async function saveArbitrage(){
    const extractedData = Object.values(localArbitrage.value).reduce((acc, arbitrage) => {
        arbitrage.accounts.forEach(accountInfo => {
            if (accountInfo.account) {
                acc.push({
                    acc_id: accountInfo.account.acc_id,
                    agree_id: arbitrage.agreement.agree_id,
                    arb_pos: accountInfo.arb_pos
                });
            }
        });
        return acc;
    }, []);

    await request('POST', true, response, config.apiUrl+'api/arbitrage', extractedData)
}


    const filteredEtus = computed(() => {
        return Object.values(localEtus.value)
            .filter(etu => {
                // Filtre par département
                if (selectedDepartment.value.length === 0) {
                    return true; // Retourne tous les étudiants si aucun filtre n'est sélectionné
                }
                return selectedDepartment.value.includes(etu.department?.dept_shortname);
            })
            .filter(etu => {
                // Filtre par accords
                const filteredAgreements = getFilteredAgreements(etu).map(item => item.agreement.agree_id);
                return selectedAccord.value.length === 0 || selectedAccord.value.some(accord => filteredAgreements.includes(accord));
            })
            .filter(etu => {
                // Filtre par nombre de vœux
                const voeuxCount = etu.wishes.count;
                return selectedVoeux.value.length === 0 || selectedVoeux.value.includes(voeuxCount);
            })
            .sort((a, b) => {
                // Tri par position du vœu et alphabétiquement
                const aMinPlace = Math.min(...getFilteredAgreements(a).filter(item => selectedAccord.value.includes(item.agreement.agree_id)).map(item => item.place));
                const bMinPlace = Math.min(...getFilteredAgreements(b).filter(item => selectedAccord.value.includes(item.agreement.agree_id)).map(item => item.place));
                if (aMinPlace !== bMinPlace) {
                    return aMinPlace - bMinPlace;
                }
                return a.acc_fullname.localeCompare(b.acc_fullname);
            });
    });


    const filteredArbitrage = computed(() => {
        return Object.values(localArbitrage.value)
            .filter(arbitrage => {
                return selectedCountries.value.length === 0 || selectedCountries.value.includes(arbitrage.agreement.partnercountry.parco_name);
            });
    });
    
    function getFilteredAgreements(etu) {
      const wishes = etu.wishes;
      const wishIds = [
        { place: 1, id: wishes.wsha_one },
        { place: 2, id: wishes.wsha_two },
        { place: 3, id: wishes.wsha_three },
        { place: 4, id: wishes.wsha_four },
        { place: 5, id: wishes.wsha_five },
        { place: 6, id: wishes.wsha_six }
      ].filter(wsha => wsha !== null);

      return wishIds.map(wsha => {
        const agreement = accords.value.agreements.find(agreement => agreement.agree_id === wsha.id);
        return { place: wsha.place, agreement };
      }).filter(item => item.agreement !== undefined);
    }

    function removeEtuFromPlace(agree_id, pos) {
        const etu = localArbitrage.value[agree_id].accounts[pos].account
        localEtus.value[etu.acc_id] = etu;
        localArbitrage.value[agree_id].accounts[pos].account = null;
        refreshDrag();
        saveArbitrage();
    }

    async function addPlace(agreeId) {
    // Trouver l'accord correspondant par son ID
    let foundAgreement = accords.value.agreements.find(agreement => agreement.agree_id === agreeId);
    let currentPlaces = getNumberOfPlace(agreeId).length;

    if (foundAgreement) {
        // Synchroniser les places si elles sont différentes
        if (foundAgreement.agree_nbplace !== currentPlaces) {
            foundAgreement.agree_nbplace = currentPlaces;
        }

        // Ajouter temporairement une place en incrémentant agree_nbplace
        foundAgreement.agree_nbplace += 1;

        // Ajouter temporairement une place dans localArbitrage
        if (!localArbitrage.value[agreeId]) {
            localArbitrage.value[agreeId] = { accounts: [] };
        }
        if (!localArbitrage.value[agreeId].accounts) {
            localArbitrage.value[agreeId].accounts = [];
        }
        localArbitrage.value[agreeId].accounts.push({
            arb_pos: localArbitrage.value[agreeId].accounts.length + 1,
            account: null
        });

        await nextTick();
        refreshDrop();
    }
}


function getNumberOfPlace(agreeId) {
    const agreements = accords.value.agreements;
    
    const agreement = agreements.find(agreement => agreement.agree_id === agreeId);
    
    if (!agreement) {
        console.error(`Accord avec agreeId ${agreeId} non trouvé.`);
        return [];
    }
    
    const numberOfPlaces = agreement.agree_nbplace;
    
    const studentPositions = arbitrage.value.filter(entry => entry.agree_id === agreeId);
    
    
    const maxPosition = studentPositions.reduce((max, student) => {
        return student.arb_pos > max ? student.arb_pos : max;
    }, numberOfPlaces - 1);
    
    
    const totalPlaces = Math.max(numberOfPlaces, maxPosition );
    
    
    const places = Array.from({ length: totalPlaces }, (v, k) => k);
    
    return places;
}





    async function handleFiltreEtu() {
        await nextTick();
        refreshDrag();
        refreshDrop();
    }


    watch(selectedDepartment, handleFiltreEtu);
    watch(selectedAccord, handleFiltreEtu);
    watch(selectedVoeux, handleFiltreEtu);


    async function refreshDrop() {
    let dropZones = document.getElementsByClassName('dropZones');
    for (let dropZone of dropZones) {
        dropZone.addEventListener("dragover", function(e) {
            e.preventDefault();
        });
        dropZone.addEventListener("drop", function(e) {
            e.preventDefault();
            let id = e.dataTransfer.getData("text/plain");
            let selected = document.getElementById(id);
            if (selected) {
                const etuId = selected.id.replace('etu_drag_', '');
                const idMatch = dropZone.id.match(/^drop_(\d+)_(\d+)$/);
                if (idMatch) {
                    const agree_id = parseInt(idMatch[1]); // Convertir en entier si nécessaire
                    const pos = parseInt(idMatch[2]); // Convertir en entier si nécessaire

                    let etu = localEtus.value[etuId];



                    if (etu) {
                        // Vérifier si l'étudiant est déjà dans localArbitrage.value
                        const existingStudent = localArbitrage.value[agree_id].accounts[pos];
                        if (existingStudent && existingStudent.account != null) {

                            // Échanger les étudiants si celui en cours de drag n'est pas déjà dans la dropzone
                            const currentEtuId = existingStudent.account.acc_id;
                            if (currentEtuId !== etu.acc_id) {
                                // Remettre l'étudiant existant dans localEtus.value
                                localEtus.value[currentEtuId] = existingStudent.account;
                            }
                        }

                        // Supprimer l'étudiant de localEtus.value s'il est là
                        if (localEtus.value[etuId]) {
                            delete localEtus.value[etuId];
                        }

                        // Mettre l'étudiant dans la dropzone actuelle de l'arbitrage
                        localArbitrage.value[agree_id].accounts[pos].account = etu;
                        refreshDrag();
                        saveArbitrage();
                    // Si l'étudiant n'est pas trouvé dans localEtus.value, chercher dans localArbitrage.value
                    }else if (!etu) {
                        etu = findStudentInArbitrage(etuId);
                        if((findStudentPositionInArbitrage(etuId)-1) != pos || getCurrentAgreeIdByAccId(etuId) != agree_id){
                            const existingStudent = localArbitrage.value[agree_id].accounts[pos];
                            if (existingStudent && existingStudent.account != null) {
                                localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[findStudentPositionInArbitrage(etuId)-1].account = existingStudent.account 
                                localArbitrage.value[agree_id].accounts[pos].account = etu
                                refreshDrag();
                                saveArbitrage();
                            }else{
                                localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[findStudentPositionInArbitrage(etuId)-1].account = null;
                                localArbitrage.value[agree_id].accounts[pos].account = etu;                       
                                refreshDrag();
                                saveArbitrage();
                            }
                            //Verifier si il y a deja un étudiant dans la dropzone
                        }
                    } else {
                        console.error("Étudiant non trouvé dans localEtus.value ou localArbitrage.value avec etuId :", etuId);
                    }
                } else {
                    console.error("ID de dropZone non valide :", dropZone.id);
                }
            }
        });
    }
}


function findStudentInArbitrage(etuId) {
    for (let agreementId in localArbitrage.value) {
        const accounts = localArbitrage.value[agreementId].accounts;
        for (let accountInfo of accounts) {
            if (accountInfo.account && accountInfo.account.acc_id == etuId) {
                return accountInfo.account;
            }
        }
    }
    return null;
}

function findStudentPositionInArbitrage(accId) {
    for (let agreementId in localArbitrage.value) {
        const accounts = localArbitrage.value[agreementId].accounts;
        for (let i = 0; i < accounts.length; i++) {
            const accountInfo = accounts[i];
            if (accountInfo.account && accountInfo.account.acc_id === accId) {
                return i + 1; // Return arb_pos (adjusted to 1-based index)
            }
        }
    }
    return null; // Return null if student not found
}

function getCurrentAgreeIdByAccId(accId) {
    for (let agreementId in localArbitrage.value) {
        const accounts = localArbitrage.value[agreementId].accounts;
        for (let accountInfo of accounts) {
            if (accountInfo.account && accountInfo.account.acc_id === accId) {
                return parseInt(agreementId);
            }
        }
    }
    console.error("Aucun accord trouvé pour l'acc_id :", accId);
    return null;
}



    async function refreshDrag() {
        await nextTick();
        let elementsDraggable = document.getElementsByClassName("elementDrag");
        // Parcourir tous les éléments
        for (let element of elementsDraggable) {
            if (!element.hasListener) {
                element.addEventListener("dragstart", dragStartHandler);
                element.hasListener = true;
            }
        }
    }
    function dragStartHandler(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
    }

    function deselectAllDept() {
        selectedDepartment.value = [];
    }
    function deselectAllAccord() {
        selectedAccord.value = [];
    }
    function deselectAllCountry() {
        selectedCountries.value = [];
    }
    function deselectAllVoeux() {
        selectedVoeux.value = [];
    }
    onMounted(fetch)

</script>