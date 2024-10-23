<template>
    <div>
        <div class="text-sm breadcrumbs font-bold">
            <ul>
                <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
                <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
            </ul>
        </div>
        <div v-if="isLoaded" class="flex">
            <!-- Filtres -->
            <div class="bg-base-200 min-w-72 h-fit min-h-screen drop-shadow-lg" >
                <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                <button class="hover:opacity-70 underline" @click="deselectAll">Tout désélectionner</button>
                
                <!-- Départements -->
                <div v-if="account.access.acs_accounttype == 1">
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                        <p>Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.departments">
                        <button class="hover:opacity-70 underline" @click="deselectAllDept">Tout désélectionner</button>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_dept_zero" type="checkbox" class="checkbox " value="Aucun" v-model="selectedDepartment">
                            <label for="filt_dept_zero" class="flex items-center justify-center w-full cursor-pointer pl-2">
                                <div class="w-3 h-3 mr-1" :style="{backgroundColor: '#aaaaaa'}"></div>
                                <label for="filt_dept_zero" class="select-none w-full cursor-pointer">Aucun</label>
                            </label>
                        </div>
                        <div v-for="(comp, index) in components.components" :key="index">
                            <p>{{ comp.comp_name }}</p>
                            <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1">
                                <input :id="'filt_dept_'+index" type="checkbox" class="checkbox" :value="dept.dept_shortname" v-model="selectedDepartment">
                                <label :for="'filt_dept_'+index" class="cursor-pointer w-full flex items-center justify-center pl-2">
                                    <div class="w-3 h-3 mr-1" :style="{backgroundColor: dept.dept_color}"></div>
                                    <label :for="'filt_dept_'+index" class="select-none w-full cursor-pointer">{{ dept.dept_shortname }}</label>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Voeux -->
                <div>
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('voeux')">
                        <p>Voeux ({{ selectedVoeux.length }} séléctionné{{ selectedVoeux.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.voeux ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.voeux">
                        <button class="hover:opacity-70 underline" @click="deselectAllVoeux">Tout désélectionner</button>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_voeux_1" type="checkbox" class="checkbox " value="Aucun" v-model="selectedVoeux">
                            <label for="filt_voeux_1" class="select-none w-full cursor-pointer pl-2">Aucun</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_voeux_2" type="checkbox" class="checkbox " value="AuMoinsUn" v-model="selectedVoeux">
                            <label for="filt_voeux_2" class="select-none w-full cursor-pointer pl-2">Au moins un</label>
                        </div>
                    </div>
                </div>
                <!-- Documents -->
                <div>
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('document')">
                        <p>Documents ({{ selectedDocument.length }} séléctionné{{ selectedDocument.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.document ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.document">
                        <button class="hover:opacity-70 underline" @click="deselectAllDocuments">Tout désélectionner</button>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_document_0" type="checkbox" class="checkbox" value="0" v-model="selectedDocument">
                            <label for="filt_document_0" class="select-none w-full cursor-pointer pl-2">0</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_document_1" type="checkbox" class="checkbox " value="1" v-model="selectedDocument">
                            <label for="filt_document_1" class="select-none w-full cursor-pointer pl-2">1</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_document_2" type="checkbox" class="checkbox " value="2" v-model="selectedDocument">
                            <label for="filt_document_2" class="select-none w-full cursor-pointer pl-2">2</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_document_3" type="checkbox" class="checkbox " value="3" v-model="selectedDocument">
                            <label for="filt_document_3" class="select-none w-full cursor-pointer pl-2">3</label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Liste des étudiants -->
            <div v-if="account && account.acc_id && etudiants && etudiants.accounts" class="w-full px-2">
                <div class="w-full flex items-center justify-between flex-col md:flex-row">
                    <p class="text-lg font-semibold">Liste des étudiants 
                        <span v-if="account.access.acs_accounttype == 2">dans le département 
                            <span :style="{color: account.department.dept_color}">{{ account.department.dept_shortname }}</span>
                        </span>:
                        {{ filteredEtudiants.length }} résultat{{ filteredEtudiants.length > 1 ? 's' : '' }}
                    </p>
                    <div class="flex items-center justify-center">
                        <!--  Bulle information -->
                        <div class="dropdown dropdown-end mx-2">
                            <div tabindex="0" role="button" class="btn btn-circle btn-ghost btn-xs text-info">
                                <svg
                                    tabindex="0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    class="h-4 w-4 stroke-current text-current">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div
                                tabindex="0"
                                class="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow">
                                <div tabindex="0" class="card-body">
                                <h2 class="card-title">⚠️ Information</h2>
                                <p>Les étudiants exportés correspondent aux résultats des filtres.</p>
                                </div>
                            </div>
                        </div>
                        <ExportComp texte="Exporter tous les étudiants en csv" :link="exportUrl"></ExportComp>
                    </div>

                </div>

                <!-- Barre de recherche -->
                <div class="py-2">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Recherche par nom et prénom" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                        </svg>
                    </label>
                </div>
                <!-- Liste des etudiants -->
                <div class="flex flex-wrap gap-1 items-center justify-center py-5">
                    <div v-for="(etu, index) in filteredEtudiants" :key="index" v-if="filteredEtudiants && filteredEtudiants.length > 0" class="">
                        <template class="w-full md:w-1/3 lg:w-1/4 py-2" v-if="etu.acc_id">
                                <div class="bg-base-300 shadow-lg rounded-lg p-4 transform transition-transform duration-200 h-full flex flex-col"
                                    :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">
                                    <!-- Bouton de suppression -->
                                    <button class="hover:opacity-70 p-3 hover:cursor-pointer absolute top-0 right-0 hover:scale-120 scale-100 transition-all duration-100 ease-in-out" @click="openConfirmModal(etu)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                    <div class="flex-1">
                                        <h5 class="text-lg font-bold mb-2 truncate min-w-72">{{ etu.acc_fullname }}</h5>
                                        <h6 class="text-gray-600 mb-2 truncate">
                                            {{ etu.acc_id }} 
                                            <span v-if="etu.department" :style="{color: etu.department.dept_color}">({{ etu.department.dept_shortname }})</span>
                                            <span v-else>(Aucun département)</span>
                                        </h6>
                                    </div>
                                    <div class="mt-4">
                                        <p class="text-sm text-gray-400">
                                            <strong>Nombre de vœux:</strong> {{ etu.wishes ? etu.wishes.count : 0 }}<br>
                                            <strong>Documents ajouté(s):</strong> {{ etu.documents?.count || 0 }}/{{ etu.documents?.countmax }}<br>
                                            <strong>Dernière connexion:</strong> {{ formatDate(etu.acc_lastlogin) }}<br>
                                            <strong>Aménagement aux éxams:</strong> {{ etu.acc_amenagement == true ? 'Oui' : 'Non' }}
                                        </p>
                                    </div>
                                <RouterLink :to="{ name: 'Profile', params: { acc_id: etu.acc_id }}" class="mt-3">
                                    <button class="btn w-full">Voir le profil</button>
                                </RouterLink>

                                </div>
                        </template>
                    </div>

                    <div v-else>
                        <p>Aucun résultat</p>
                    </div>
                </div>
                <!-- Modal de confirmation suppression -->
                <dialog id="confirmModal" ref="confirmModal" class="modal">
                    <div class="modal-box">
                        <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                        <div class="py-3">
                            <p>Confirmez vous la supression de l'étudiant:</p>
                            <p>Cela entraînera la suppression de ses vœux et de son emplacement dans l'arbitrage.</p>
                            <div class="w-full py-2">
                                
                                    <div class="bg-base-300 shadow-lg rounded-lg p-4 h-full flex flex-col"
                                        :style="{ borderBottom: `4px solid ${confirmDeleteEtu.department ? confirmDeleteEtu.department.dept_color : '#aaaaaa'}` }">
                                        <div class="flex-1">
                                            <h5 class="text-xl font-bold mb-2 truncate min-w-72">{{ confirmDeleteEtu.acc_fullname }}</h5>
                                            <h6 class="text-gray-600 mb-2 truncate">
                                                {{ confirmDeleteEtu.acc_id }} 
                                                <span v-if="confirmDeleteEtu.department" :style="{color: confirmDeleteEtu.department.dept_color}">({{ confirmDeleteEtu.department.dept_shortname }})</span>
                                                <span v-else>(Aucun département)</span>
                                            </h6>
                                        </div>
                                        <div class="mt-4">
                                            <p class="text-sm text-gray-400">
                                                <strong>Nombre de vœux:</strong> {{ confirmDeleteEtu.wishes ? confirmDeleteEtu.wishes.count : 0 }}<br>
                                                <strong>Documents ajouté(s):</strong> {{ confirmDeleteEtu.documents?.count || 0 }}/{{ confirmDeleteEtu.documents?.countmax }}<br>
                                                <strong>Dernière connexion:</strong> {{ formatDate(confirmDeleteEtu.acc_lastlogin) }}
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    <div class="modal-action">
                        <button class="btn btn-error" @click="closeModal">Annuler</button>
                        <button class="btn btn-success" @click="deleteEtu(confirmDeleteEtu.acc_id, confirmDeleteEtu.acc_fullname, confirmDeleteEtu.department?.dept_shortname || 'Aucun département')">Confirmer</button>
                    </div>
                    </div>
                </dialog>
            </div>
        </div>
        <div v-else>
            <LoadingComp></LoadingComp>
        </div>    
    </div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { ref, onMounted, computed, watch } from 'vue';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import LoadingComp from '../../components/utils/LoadingComp.vue';
import ExportComp from '../../components/impexp/ExportComp.vue';

const accountStore = useAccountStore();
const etudiants = ref([]);
const account = ref([]);
const components = ref([]);
const isLoaded = ref(false);
const searchQuery = ref('');
const confirmDeleteEtu = ref([])
const response = ref([])

const selectedDepartment = ref([]);
const selectedVoeux = ref([]);
const selectedDocument = ref([]);
const isOpen = ref({
    voeux: true,
    departments: true,
    document: true,
});
function toggleCollapse(section) {
    isOpen.value[section] = !isOpen.value[section];
}

const filteredEtudiants = computed(() => {
    return etudiants.value.accounts
        .filter(etu => {
            const matchesDepartments = selectedDepartment.value.length === 0 || 
                (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname)) ||
                (selectedDepartment.value.includes('Aucun') && !etu.department);
            
            const hasAccess = etu.access === null;

            const matchesVoeux = selectedVoeux.value.length === 0 || 
                (selectedVoeux.value.includes('Aucun') && etu.wishes.count === 0) ||
                (selectedVoeux.value.includes('AuMoinsUn') && etu.wishes.count > 0);

            // Filtrer par nom d'étudiant s'il y a une recherche en cours
            const matchesSearchQuery = !searchQuery.value || etu.acc_fullname.toLowerCase().includes(searchQuery.value.toLowerCase());

            // Vérification du nombre de documents
            const documentCount = etu.documents.count || 0; // Utiliser 0 par défaut si undefined
            const matchesDocuments = selectedDocument.value.length === 0 || 
                selectedDocument.value.includes(documentCount.toString());

            return matchesDepartments && hasAccess && matchesVoeux && matchesSearchQuery && matchesDocuments;
        })
        .sort((a, b) => {
            // Trier les étudiants par leur nom complet
            return a.acc_fullname.localeCompare(b.acc_fullname);
        });
});



async function fetch() {
    await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
    if (account.value.access != null && account.value.access.acs_accounttype == 1) {
        await request('GET', false, etudiants, config.apiUrl + 'api/account');
    } else if (account.value.access != null && account.value.department != null) {
        await request('GET', false, etudiants, config.apiUrl + 'api/account/getbydept/' + account.value.department.dept_id);
    }
    await request('GET', false, components, config.apiUrl + 'api/component');
    isLoaded.value = true;
}

//ouvrir le modal de confirmation de suppression
function openConfirmModal(etu) {
    
    confirmDeleteEtu.value = etu;
    const modal = document.getElementById('confirmModal')
    modal.showModal()
}
//Fermer le modal de confirmation de suppression
function closeModal() {
    const modal = document.getElementById('confirmModal')
    modal.close()
}

    // Supprimer un étudiant
    async function deleteEtu(acc_id, acc_fullname, dept_shortname){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/account/deletebyid/'+acc_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'étudiant '+acc_fullname+' (' + dept_shortname + ').',
                acc_id: accountStore.login,
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }

    function formatDate(date) {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} à ${hours}h${minutes}`;
    }

const exportUrl = computed(() => {
    const ids = filteredEtudiants.value.map(etu => etu.acc_id);
    const queryString = new URLSearchParams({ ids: JSON.stringify(ids) }).toString();
    return `${config.apiUrl}api/account/export?${queryString}`;
});

    // Fonction pour charger les filtres depuis sessionStorage pour la page d'accueil
    function loadFilters() {
        const savedDepartments = sessionStorage.getItem('etu_dashboard.selectedDepartment');
        const savedDocument = sessionStorage.getItem('etu_dashboard.selectedDocument');
        const savedVoeux = sessionStorage.getItem('etu_dashboard.selectedVoeux');



        if (savedDepartments) {
            selectedDepartment.value = JSON.parse(savedDepartments);

        }
        if (savedVoeux) {
            selectedVoeux.value = JSON.parse(savedVoeux);

        }
        if (savedDocument) {
            selectedDocument.value = JSON.parse(savedDocument);

        }


    }

    function saveFilters() {
        sessionStorage.setItem('etu_dashboard.selectedDepartment', JSON.stringify(selectedDepartment.value));
        sessionStorage.setItem('etu_dashboard.selectedVoeux', JSON.stringify(selectedVoeux.value));
        sessionStorage.setItem('etu_dashboard.selectedDocument', JSON.stringify(selectedDocument.value));
    }

    watch(selectedDepartment, saveFilters);
    watch(selectedVoeux, saveFilters);
    watch(selectedDocument, saveFilters);

onMounted(() => {
    fetch();
    loadFilters();
});

    function deselectAll() {
        selectedDepartment.value = [];
        selectedVoeux.value = [];
        selectedDocument.value = [];
    }
    function deselectAllDept() {
        selectedDepartment.value = [];
    }
    function deselectAllVoeux() {
        selectedVoeux.value = [];
    }
    function deselectAllDocuments() {
        selectedDocument.value = [];
    }
</script>
