<template>
    <div v-if="isLoaded">

        <p class="text-xl font-bold">Accès</p>

        <!-- Partie accès de haut niveau -->
        <div class="m-5 flex items-start justify-center md:flex-row flex-col">
            <div class="w-4/5 flex items-center flex-col">
                <p class="text-lg font-bold">Liste des accès de haut niveau</p>
                <div v-if="access && access.count" class="w-full my-2">
                    <div v-if="access && access.count > 0">

                        <!-- Relations Internationales -->
                        <p>RI (Relations Internationales)</p>
                        <div class="md:m-5 m-1 flex w-full items-center justify-between">
                            <!-- Liste acces ADMIN -->
                             <div class="md:w-1/2 w-full flex flex-col items-start justify-center">
                                <div v-for="(acc, index) in access.access[1]" :key="index" class="flex *:my-1 w-full">
                                    <div class="bg-base-300 p-2 w-full flex items-center justify-between">
                                        <div>

                                            <!-- Image -->
                                            <div class="avatar placeholder h-12 my-1 mr-2">
                                                <div
                                                v-if="acc.account" 
                                                :style="{ backgroundColor: getColorFromName(acc.account.acc_fullname) }"
                                                class="text-neutral-content w-12 rounded-full select-none"
                                                >
                                                    <span>{{ getInitials(acc.account.acc_fullname) }}</span>
                                                </div>
                                                <div v-else class="text-neutral-content w-12 rounded-full select-none bg-neutral">
                                                    <span>ILC</span>  <!-- Affichage par défaut si acc.account est null -->
                                                </div>
                                            </div>
                                            <span class="font-bold mr-1">{{ acc.acc_id }}</span>
                                            <span v-if="acc.account">({{ acc.account.acc_fullname }})</span>
                                            <span v-else>(Nom introuvable)</span> 
                                        </div>
                                        <span>Dernière connexion: <span v-if="acc.account && acc.account.acc_lastlogin">{{ formatDate(acc.account.acc_lastlogin) }}</span><span v-else>Jamais</span></span>
                                    </div>
                                    <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="openConfirmModal(acc)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            </div>


                            <!-- Partie ajoute access -->
                            <div class="md:w-1/2 w-full flex items-center flex-col">
                                <p class="text-lg font-bold">Ajouter/modifier un utilisateur</p>
                                <form @submit.prevent="addAccess" class="w-2/5 *:my-2">
                                    <input type="text" placeholder="Login" v-model="newAccess.login" class="input input-bordered w-full " />
                                    <select class="select select-bordered w-full" v-model="newAccess.access">
                                        <option disabled selected>Selectionnez un niveau d'accès</option>
                                        <option value="1">1 (Relations Internationales)</option>
                                        <option value="2">2 (Département)</option>
                                    </select>
                                    <div class="flex items-center justify-center">
                                        <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70 w-full" type="submit">Ajouter l'accès</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <!-- Departement -->
                        <p>Dept (Département)</p>
                        <div class="md:m-5 m-1">
                            <!-- Liste access chef DEPT -->
                            <div class="grid grid-cols-2 gap-4 w-full">
                                <div v-for="(acc, index) in access.access[2]" 
                                    :key="index" 
                                    class="bg-base-300 p-4 rounded-lg">
                                    
                                    <div class="flex justify-between items-start relative">
                                        <!-- Partie gauche : Avatar et infos principales -->
                                        <div class="flex items-center">
                                            <div class="avatar placeholder h-12 mr-3">
                                                <div class="text-neutral-content w-12 rounded-full select-none bg-neutral">
                                                    <span>{{ getInitials(acc.account?.acc_fullname) }}</span>
                                                </div>
                                            </div>

                                            <div class="flex flex-col">
                                                <div class="flex items-center">
                                                    <span v-if="acc.account">
                                                        ({{ acc.account.acc_fullname }})
                                                    </span>
                                                    <span v-else>(Inconnu ou non enregistré)</span>
                                                </div>
                                                <span class="font-bold mr-1">{{ acc.acc_id }}</span>

                                                
                                                <span class="text-sm">
                                                    Dernière connexion: 
                                                    <span v-if="acc.account && acc.account.acc_lastlogin">
                                                        {{ formatDate(acc.account.acc_lastlogin) }}
                                                    </span>
                                                    <span v-else>Jamais</span>
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Bouton de suppression -->
                                        <button class="absolute top-0 right-0 hover:opacity-60 p-2 rounded" @click="openConfirmModal(acc)">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <!-- Département -->
                                    <div class="mt-4 flex flex-col justify-between">
                                        <div v-if="acc.account && acc.account.department && acc.account.department.dept_shortname" 
                                            class="flex items-center">
                                            <span class="p-2 flex items-center rounded" 
                                                :style="{backgroundColor: acc.account.department.dept_color}">
                                                <p class="mx-1 select-none">{{ acc.account.department.dept_shortname}}</p>
                                                <button class="hover:opacity-60 bg-base-300 p-1 rounded ml-2" 
                                                        @click="removeDept(acc.acc_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                        <div v-else>
                                            <button class="btn btn-sm" 
                                                v-if="!showForms[acc.acc_id]" 
                                                @click="showForm(acc.account.acc_id)"
                                                :disabled="!acc.account">
                                            Séléctionner un département
                                        </button>
                                        </div>
                                    </div>

                                    <!-- Formulaire pour ajouter un département -->
                                    <div v-if="showForms[acc.acc_id]" class="mt-4">
                                        <form @submit.prevent="submitForm(acc.account.acc_id)">
                                            <select class="select select-bordered w-full mb-2" 
                                                    v-model="selectedDepartment[acc.account.acc_id]">
                                                <option disabled selected>Séléctionnez un département</option>
                                                <template v-for="(compo, index) in components.components" :key="index">
                                                    <optgroup :label="compo.comp_name">
                                                        <option v-for="(dept, index) in compo.departments" 
                                                                :key="index" 
                                                                :value="dept.dept_id" 
                                                                :style="{ color: dept.dept_color }">
                                                            ({{ dept.dept_shortname }}) {{ dept.dept_name }}
                                                        </option>
                                                    </optgroup>
                                                </template>
                                            </select>
                                            
                                            <div class="flex gap-2">
                                                <button class="btn btn-primary btn-sm" type="submit">Valider</button>
                                                <button class="btn btn-sm" @click="showForm(acc.account.acc_id)">Annuler</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            
                        </div>

                        <!-- Modal de confirmation suppression access -->
                        <dialog id="confirmModal" ref="confirmModal" class="modal">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                <div class="py-3">
                                    <p>Confirmez vous la supression de l'accès pour: </p>
                                    <p v-if="confirmDeleteAccess.account"  class="mt-1">
                                        <span class="md:p-1 rounded-lg w-fit" :style="{ backgroundColor: `${confirmDeleteAccess.account.role.color ? confirmDeleteAccess.account.role.color : '#aaaaaa'}` }">{{ confirmDeleteAccess.account.role.role }}</span>
                                        {{confirmDeleteAccess.account.acc_fullname}}
                                    </p>
                                    <p v-else class="mt-1">
                                        <span class="badge badge-neutral p-3">Introuvable</span>
                                        {{ confirmDeleteAccess.acc_id }}
                                    </p>
                                </div>
                            <div class="modal-action">
                                <button class="btn" @click="closeModal">Annuler</button>
                                <button class="btn btn-success" @click="removeAccess(confirmDeleteAccess.acc_id)">Confirmer</button>
                            </div>
                            </div>
                        </dialog>
                    </div>
                    <div v-else>
                        <p>Aucun accès n'a été trouvé.</p>
                    </div>
                </div>
            </div>

        </div>

        <!-- Séparateur -->
        <div class="bg-base-200 w-full h-4"></div>


        <!-- Partie autorisation au site -->
        <div class="m-5 flex items-start justify-center md:flex-row flex-col">
            <div class="flex items-center flex-col w-1/2">
                <p class="text-lg font-bold">Liste des autorisations au site</p>
                <div v-if="accepted" class="w-full my-2">
                    <div v-if="accepted && accepted.count > 0">
                        <!-- Barre de recherche -->
                        <div class="py-2">
                            <label class="input input-bordered flex items-center gap-2 min-w-full">
                                <input type="text" class="grow" placeholder="Recherche par nom ou login" v-model="searchQuery" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                                    <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                                </svg>
                            </label>
                        </div>

                        <!-- Liste utilisateurs -->
                        <div class="overflow-x-auto max-h-125 " v-if="filteredEtudiants.length > 0">
                            <table class="table table-zebra w-full">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th class="w-1/12"></th>
                                        <th class="w-2/12">Login</th>
                                        <th class="w-4/12">NOM Prénom</th>
                                        <th class="w-2/12 flex items-center justify-center">Département</th>
                                        <th class="w-3/12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(acc, index) in filteredEtudiants" :key="index">
                                        <!-- Numéro -->
                                        <th>{{ index }}</th>
                                        <!-- Login -->
                                        <th>{{ acc.acc_id }}</th>
                                        <!-- Nom Prénom -->
                                        <th class="min-w-44" v-if="acc.account">{{ acc.account.acc_fullname }}</th>
                                        <th class="min-w-44" v-else>Nom introuvable</th>
                                        <!-- Département -->
                                        <th>
                                            <span class="flex items-center justify-center">
                                                <span v-if="acc.department" class="badge p-3 min-w-40" :style="{backgroundColor: acc.department.dept_color}">{{ acc.department.dept_shortname }}</span>
                                                <span v-else-if="acc.account" class="badge badge-neutral p-3 min-w-40">Aucun</span>
                                                <span v-else class="badge badge-neutral p-3 min-w-40">Introuvable</span>
                                            </span>
                                        </th>
                                        <!-- Actions -->
                                        <th>
                                            <!-- Ouvrir le profil -->
                                            <RouterLink target="_blank" :to="{name: 'Profile', params: {acc_id: acc.acc_id}}" class="tooltip" data-tip="Afficher le profil">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                            <!-- Supprimer -->
                                            <span class="tooltip" data-tip="Supprimer de la liste">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2" @click="openConfirmModalAccepted(acc)" >
                                                    <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" class="stroke-current" fill="none" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </span>

                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-else>
                            <p class="text-center p-5">Aucun étudiant trouvé.</p>
                        </div>

                        <!-- Modal de confirmation suppression accepted -->
                        <dialog id="confirmModalAccepted" ref="confirmModalAccepted" class="modal">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                <div class="py-3">
                                    <p>Confirmez vous la supression de l'accès pour: </p>
                                    <p v-if="confirmDeleteAccepted.account" class="mt-1 font-bold">
                                        <span v-if="confirmDeleteAccepted.department" class="badge p-3 font-bold" :style="{backgroundColor: confirmDeleteAccepted.department.dept_color}">{{ confirmDeleteAccepted.department.dept_shortname }}</span>
                                        <span v-else class="badge badge-neutral p-3">Aucun</span>
                                        {{confirmDeleteAccepted.account.acc_fullname}}
                                    </p>
                                    <p v-else class="mt-1 font-bold">
                                        <span class="badge badge-neutral p-3">Introuvable</span>
                                        {{ confirmDeleteAccepted.acc_id }}
                                    </p>
                                </div>
                            <div class="modal-action">
                                <button class="btn " @click="closeModal">Annuler</button>
                                <button class="btn btn-success" @click="removeAccepted(confirmDeleteAccepted.acc_id)">Confirmer</button>
                            </div>
                            </div>
                        </dialog>
                    </div>
                    <div v-else>
                        <p>Aucun utilisateur n'a été trouvé.</p>
                    </div>
                </div>
            </div>
            <!-- Formulaire ajout accepted etudiant -->
            <div class="md:w-1/2 w-full flex items-center justify-center flex-col">
                <div class="w-full flex items-center flex-col justify-center mb-3">
                    <p class="text-lg font-bold">Ajouter un utilisateur</p>
                    <form @submit.prevent="addAccepted" class="w-2/5 *:my-2">
                        <input type="text" placeholder="Login" v-model="newAccepted.login" class="input input-bordered w-full" />
                            <button class="btn btn-primary w-full hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter l'utilisateur</button>
                    </form>
                </div>
                <ImportComp text="Importer des étudiants en csv" @csv-imported="handleCsvImported"></ImportComp>
                <div class="py-10">
                    <p class="text-center">Exemple de csv à importer:</p>
                    <p class="text-center">(Important: "login" sans majuscule)</p>

                    <div class="overflow-x-auto mt-3">
                        <table class="table table-zebra">
                            <!-- head -->
                            <thead>
                            <tr>
                                <th>login</th>
                            </tr>
                            </thead>
                            <tbody>
                            <!-- row 1 -->
                            <tr >
                                <th >sbouc</th>
                            </tr>
                            <!-- row 2 -->
                            <tr>
                                <th>ldama</th>
                            </tr>
                            <!-- row 3 -->
                            <tr>
                                <th>gallottm</th>
                            </tr>
                            <!-- row 4 -->
                            <tr>
                                <th>taillezb</th>
                            </tr>
                            </tbody>
                        </table>
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

    import { ref, onMounted, nextTick, computed } from 'vue';
    import { request } from '../../composables/httpRequest.js'
    import config from '../../config'
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { addAlert } from '../../composables/addAlert';
    import ImportComp from '../../components/impexp/ImportComp.vue';
    import { decomposeDN } from '../../composables/destructLDAP';
import { addAction } from '../../composables/actionType.js';

    const accountStore = useAccountStore();
    const access = ref([]);
    const account = ref([]);
    const accepted = ref([]);
    const newAccess = ref({ login: '', access: ''});
    const newAccepted = ref({ login: ''});
    const response = ref([]);
    const components = ref([]);
    const confirmDeleteAccess = ref([])
    const confirmDeleteAccepted = ref([])

    const isLoaded = ref(false);
    
    const showForms = ref([]);
    const selectedDepartment = ref([]);

    const searchQuery = ref('');


    function getInitials(fullname) {
        if (!fullname) {
            return 'ILC';
        }
        const names = fullname.split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    function getColorFromName(name) {
        // Créez un hachage simple basé sur le nom
        const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Utilisez le hachage pour déterminer une couleur
        const hue = hash % 360; // Choisissez une teinte entre 0 et 359
        return `hsl(${hue}, 70%, 50%)`; // Utilisez HSL pour une couleur vibrante
    }


    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(acc) {
    
        confirmDeleteAccess.value = acc;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    function openConfirmModalAccepted(acc) {
    
        confirmDeleteAccepted.value = acc;
        const modal = document.getElementById('confirmModalAccepted')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
        const modal2 = document.getElementById('confirmModalAccepted')
        modal2.close()
    }

    async function addAccess(){
        if(newAccess.value.login == ''){
            addAlert('error', {data:{error: 'Vous devez entrer un login.', message:'L\'ajout de l\'accès a été annulé.'}})
            return;
        }
        if(newAccess.value.access == "Selectionnez un niveau d'accès"){
            addAlert('error', {data:{error: 'Vous devez choisir un niveau d\'accès.', message:'L\'ajout de l\'accès a été annulé.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccess.value.login,
            acs_accounttype: newAccess.value.access,
        }; 

        const accountExists = account.value.accounts.some(acc => acc.acc_id === requestData.acc_id);
        
        try {
            if (!accountExists) {
                const decomposedInfo = ref([]);
                
                // Requête LDAP
                try {
                    await request('GET', false, response, config.apiUrl + 'ldap.php/?login=' + newAccess.value.login);
                    await nextTick();
                    decomposedInfo.value = decomposeDN(newAccess.value.login, response.value[0].dn);
                } catch (ldapError) {
                    console.error('Erreur lors de la requête LDAP:', ldapError);
                    throw new Error('Impossible de récupérer les informations LDAP de l\'utilisateur');
                }

                // Création de l'utilisateur
                try {
                    const requestData = {
                        acc_id: decomposedInfo.value.login,
                        acc_fullname: decomposedInfo.value.fullname,
                    };
                    await request('POST', false, response, config.apiUrl + 'api/account', requestData);
                } catch (createError) {
                    console.error('Erreur lors de la création du compte:', createError);
                    throw new Error('Impossible de créer le compte utilisateur');
                }
            }
        } catch (error) {
            addAlert('error', { data: { error: 'Impossible de récupéer les informations.', message: "Le login que vous avez fournis n'est pas reconnu." } });
        }

        await request("POST", true, response, config.apiUrl+'api/access', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'access', response, 'Ajout de l\'access pour '+newAccess.value.login+'. (Accès de niveau '+ newAccess.value.access +')');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        resetInput();
    }
    async function removeAccess(acc_id){
        closeModal();
        const requestData = {
            acc_id: acc_id,
            acc_id_action: accountStore.login
        }
        await request('DELETE', true, response, config.apiUrl+'api/access/delete', requestData);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression de l\'access pour '+acc_id+'.');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
    }


    async function addAccepted(){
        if(newAccepted.value.login == ''){
            addAlert('error', {data:{error: 'Vous devez entrer un login.', message:'L\'ajout de l\'autorisation a été annulée.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccepted.value.login,
        };
        await request("POST", true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'access', response, 'Ajout de l\'autorisation pour l\'utilisateur '+requestData.acc_id+'.');
        }
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        resetInput();
    }
    async function removeAccepted(acc_id){
        const requestData = {
            acc_id: acc_id,
        }
        await request('DELETE', true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression de l\'autorisation pour l\'utilisateur '+acc_id+'.');
        }
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        closeModal();
    }



    const filteredEtudiants = computed(() => {
        if (!searchQuery.value) {
            return accepted.value.accounts;
        }
        return accepted.value.accounts.filter(acc => {
            const fullNameMatch = acc.account?.acc_fullname?.toLowerCase().includes(searchQuery.value.toLowerCase());
            const idMatch = acc.acc_id?.toString().includes(searchQuery.value.toLowerCase());
            return fullNameMatch || idMatch;
        });
    });





    function resetInput(){
        newAccess.value.login = '';
        newAccess.value.access = document.querySelector('.select').options[0].value;
        newAccepted.value.login = '';
    }

    // Partie gestion du département d'un accès

    async function removeDept(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/account/removedept/'+acc_id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression du département pour l\'access de '+acc_id+'.');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
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

    async function showForm(acc_id) {
        showForms.value[acc_id] = !showForms.value[acc_id];
    }

    
    // Changer departement d'un utilisateur
    async function submitForm(acc_id) {
        showForms.value[acc_id] = false;
        await request('put', true, response, config.apiUrl+'api/account/changedept/'+acc_id+'/'+selectedDepartment.value[acc_id]);
        if(response.value.status == 200){
            addAction(accountStore.login, 'access', response, 'Changement du département dans l\'access pour '+acc_id+' (Nouveau: '+ selectedDepartment.value[acc_id] +').');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
    }


    // Partie récupération des données

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, account, config.apiUrl+'api/account');
        isLoaded.value = true;
        if(access.value.access && access.value.access[2]){
            showForms.value = Array(access.value.access[2].length).fill(false);
            selectedDepartment.value = Array(access.value.access[2].length).fill('');
        }
        await nextTick()
        resetInput();
    }

    const handleCsvImported = async (csvData) => {
        const requestData = csvData.map(item => ({
            acc_id: item.login,
        }));

        await request("POST", true, response, config.apiUrl+'api/acceptedaccount/import', requestData);
        if (response.value && response.value.status === 201) {
            addAction(accountStore.login, 'access', response, `Importation de ${response.value.added_accounts.length} étudiants.`);
        }
        
        fetch();
    };


    onMounted(fetch)
</script>