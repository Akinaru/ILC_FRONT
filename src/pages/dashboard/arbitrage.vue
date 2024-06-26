<template>
    <div v-if="isLoaded">
        <p class="font-bold text-xl text-center">Arbitrage</p>
        <div class="flex">
            <!-- Gauche -->
            <div class="w-1/2 min-h-screen flex flex-col items-center">
                <p class="text-center py-5">Liste des étudiants</p>

                <!-- Partie filtre étudiants -->
                <div class="flex items-center justify-center py-5">
                    <div class="bg-base-200 drop-shadow-lg w-96" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg">Filtres</p>
                        <p>{{ filteredEtus.length }} résultats ({{ selectedDepartment.length }} filtre{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                        <!-- Départements -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                                <p>Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.departments">
                                <button class="hover:opacity-70" @click="deselectAllDept">Tout désélectionner</button>
                                <div v-for="(comp, index) in components.components" :key="index">
                                    <div class="lg:block flex flex-wrap">
                                        <p>- {{ comp.comp_name }}</p>
                                        <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 ">
                                            <input :id="'filt_dept_'+index" type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartment">
                                            <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                            <label :for="'filt_dept_'+index" class="select-none w-full">{{ dept.dept_shortname }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-start w-full">
                    <div class="elementDrag bg-base-300 w-96 h-24 mb-2 flex items-center justify-center cursor-move select-none hover:opacity-80 flex-col" 
                        :draggable="true" 
                        :id="'etu_drag_'+etu.acc_id"
                        v-for="(etu, index) in filteredEtus" :key="index"
                        :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">   
                        
                        <p>{{ etu.acc_fullname }}</p> 
                        <p v-if="etu.department" :style="{backgroundColor: etu.department.dept_color}" class="p-2">{{ etu.department.dept_shortname }}</p>
                        <p v-else class="bg-gray-500 p-2">Aucun</p>
                    </div>
                </div>
            </div>

            <!-- Droite -->
            <div class="w-1/2 min-h-screen flex flex-col items-center">
                <p class="text-center py-5 w-full">Liste des accords</p>

                <!-- Partie filtre accords -->
                <div class="flex items-center justify-center py-5 w-full">
                    <div class="bg-base-200 drop-shadow-lg w-11/12" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg">Filtres</p>
                        <p>{{ filteredArbitrage.length }} résultats ({{ selectedCountries.length }} filtre{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                        <!-- Pays -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                                <p>Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.pays">
                                <button class="hover:opacity-70" @click="deselectAllCountry">Tout désélectionner</button>
                                <div class="flex flex-wrap items-center justify-center">

                                    <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 w-1/2">
                                        <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2 checkbox-sm" :value="country.parco_name" v-model="selectedCountries">
                                        <div class="flex w-full">
                                            <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                            <label :for="'filt_pays_'+index" class="select-none w-full text-sm">{{ country.parco_name }}</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <button class="btn w-11/12 btn-success mb-5" @click="saveArbitrage">Enregistrer</button>

                <!-- Partie rendu accord -->
                <div class="flex flex-col items-center justify-start w-full select-none">
                    <div v-for="(arbitrage, accordIndex) in filteredArbitrage" :key="'accord-' + accordIndex" class="bg-base-300 w-11/12 mb-4 p-4 rounded-lg">
                        <div class="flex items-center justify-center mb-2">
                            <span class="fi md:text-3xl text-xl transition-all duration-200 ease-in-out mr-2" :class="'fi-' + arbitrage.agreement.partnercountry.parco_code"></span>
                            <p class="font-bold text-lg">{{ arbitrage.agreement.partnercountry.parco_name }}</p>
                        </div>

                        <div class="w-full flex justify-center">
                            <div class="flex flex-wrap gap-4 justify-start w-full">
                                <div :id="'drop_'+arbitrage.agreement.agree_id+'_'+placeIndex" v-for="(place, placeIndex) in Array(arbitrage.agreement.agree_nbplace).fill()" :key="'place-' + placeIndex" 
                                    class="dropZones bg-base-200 m-1 h-20 w-80 flex justify-center items-center relative"
                                    :style="{borderBottom: `4px solid ${arbitrage.accounts[placeIndex]?.account?.department?.dept_color || '#aaaaaa'}`}">
                                    
                                    <div v-if="arbitrage.accounts[placeIndex] && arbitrage.accounts[placeIndex].account">
                                        <p>{{ arbitrage.accounts[placeIndex].account.acc_fullname }}</p>
                                        <button @click="removeEtuFromPlace(arbitrage.agreement.agree_id, placeIndex)" class="hover:cursor-pointer hover:opacity-60 absolute top-0 right-0 p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <p v-else>Aucun étudiant</p>
                                </div>
                                <div class="w-80 h-20 m-1 flex items-center justify-center border-8 border-base-200 bg-base-100 hover:opacity-60 cursor-pointer">
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
    const selectedCountries = ref([]);

    const arbitrage = ref([])

    const localEtus = ref([]);
    const localArbitrage = ref([])

    const isOpen = ref({
        pays: false,
        departments: false,
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        await request('GET', false, etudiants, config.apiUrl+'api/account/students');
        await request('GET', false, arbitrage, config.apiUrl+'api/arbitrage');
        isLoaded.value = true;
        init();
    }



    async function init() {
        // Initialiser localEtus avec les étudiants qui ne sont pas dans arbitrage
        localEtus.value = etudiants.value.accounts
            .filter(etu => !arbitrage.value.some(arbitre => arbitre.account.acc_id === etu.acc_id))
            .reduce((acc, etu) => {
                acc[etu.acc_id] = etu;
                return acc;
        }, {});

        localArbitrage.value = accords.value.agreements.reduce((acc, accord) => {
            // Chercher les étudiants correspondants dans arbitrage
            const matchingArbitrages = arbitrage.value.filter(arbitre => arbitre.agreement.agree_id === accord.agree_id);

            // Créer l'objet pour l'accord actuel
            acc[accord.agree_id] = {
                agreement: accord,
                accounts: Array.from({ length: accord.agree_nbplace }, (_, index) => {
                    const matchingArbitrage = matchingArbitrages.find(arbitre => arbitre.arb_pos === (index + 1));
                    return {
                        arb_pos: index + 1,
                        account: matchingArbitrage ? matchingArbitrage.account : null // Mettre account à null si matchingArbitrage n'existe pas
                    };
                })
            };

            return acc;
        }, {});

        await nextTick();
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
                if (selectedDepartment.value.length === 0) {
                    return true; // Retourne tous les étudiants si aucun filtre n'est sélectionné
                }
                return selectedDepartment.value.includes(etu.department?.dept_shortname);
            })
            .sort((a, b) => a.acc_fullname.localeCompare(b.acc_fullname));
    });

    const filteredArbitrage = computed(() => {
        return Object.values(localArbitrage.value)
            .filter(arbitrage => {
                return selectedCountries.value.length === 0 || selectedCountries.value.includes(arbitrage.agreement.partnercountry.parco_name);
            });
    });

    function removeEtuFromPlace(agree_id, pos) {
        const etu = localArbitrage.value[agree_id].accounts[pos].account
        localEtus.value[etu.acc_id] = etu;
        localArbitrage.value[agree_id].accounts[pos].account = null;
        refreshDrag();
    }

    async function handleFiltreEtu() {
        await nextTick();
        refreshDrag();
        refreshDrop();
    }

    async function handleChangeArbitrage(){
        console.log("l'arbitrage a été modifié")
    }

    watch(selectedDepartment, handleFiltreEtu);


    async function refreshDrop(){
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

                        const etu = localEtus.value[etuId];
                        if (etu) {

                            const existingStudent = localArbitrage.value[agree_id].accounts[pos];
                            if (existingStudent && existingStudent.account != null) {
                                // Remettre l'étudiant existant dans localEtus.value
                                localEtus.value[existingStudent.account.acc_id] = existingStudent.account;
                            }

                            // Supprimer l'étudiant de localEtus.value
                            delete localEtus.value[etuId];

                            // Ajouter l'étudiant à localArbitrage.value[agree_id]
                            localArbitrage.value[agree_id].accounts[pos] = {
                                arb_pos: pos + 1,
                                account: etu
                            };
                            refreshDrag();
                        } else {
                            console.error("Étudiant non trouvé dans localEtus.value avec etuId :", etuId);
                        }
                    } else {
                        console.error("ID de dropZone non valide :", dropZone.id);
                    }
                }
            });
        }
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
    function deselectAllCountry() {
        selectedCountries.value = [];
    }
    onMounted(fetch)

</script>