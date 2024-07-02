<template>
    <div v-if="isLoaded">
        <!-- Partie accès de haut niveau -->
        <p class="text-xl font-bold">Accès</p>
        <div class="m-5 flex items-center justify-center md:flex-row flex-col">
            <div class="md:w-1/2 w-4/5 flex items-center flex-col">
                <p class="text-lg font-bold">Liste des accès de haut niveau</p>
                <div v-if="access && access.count" class="w-full my-2">
                    <div v-if="access && access.count > 0">
                        <p>RI (Relations Internationales)</p>
                        <div class="md:m-5 m-1">
                            <div v-for="(acc, index) in access.access[1]" :key="index" class="flex *:my-1">
                                <div class="bg-base-300 p-2 w-full flex items-center">
                                    <span class="font-bold mr-1">{{ acc.acc_id }}</span>
                                    <span v-if="acc.account">({{ acc.account.acc_fullname }})</span>
                                    <span v-else>(Nom introuvable)</span>
                                </div>
                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeAccess(acc.acc_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        <p>Dept (Département)</p>
                        <div class="md:m-5 m-1">
                            <div v-for="(acc, index) in access.access[2]" :key="index" class="flex flex-col *:my-1">
                                <div class="flex w-full">

                                    <div class="bg-base-300 p-2 w-full flex items-center">
                                        <span class="font-bold mr-1">{{ acc.acc_id }}</span>
                                        <span v-if="acc.account">
                                            ({{ acc.account.acc_fullname }})
                                        </span>
                                        <span v-else>
                                            (Inconnu ou non enregistré)
                                        </span>
                                        <div v-if="acc.account && acc.account.department && acc.account.department.dept_shortname" class="flex bg-base-300 items-center justify-center">
                                            <span class="p-2 mx-2 flex items-center justify-center" :style="{backgroundColor: acc.account.department.dept_color}">
                                                <p class="mx-1">{{ acc.account.department.dept_shortname}}</p>
                                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-1" @click="removeDept(acc.acc_id)">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </span>
                                        </div>
                                        <div v-else-if="acc.account">
                                            <button  class="btn  mx-2" v-if="!showForms[acc.acc_id]" @click="showForm(acc.account.acc_id)">Séléctionner un département</button>
                                        </div>

                                        
                                    </div>
                                    
                                    <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeAccess(acc.acc_id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <!-- Formulaire pour ajouter un département -->
                                <div v-if="showForms[acc.acc_id]">
                                    <form @submit.prevent="submitForm(acc.account.acc_id)" class="my-1">
                                        <label class="form-control w-full max-w-xs">
                                            <div class="label">
                                                <span class="label-text">Séléctionnez un département</span>
                                            </div>


                                            <select class="select select-bordered" v-model="selectedDepartment[acc.account.acc_id]">
                                                <option disabled selected>Séléctionnez un département</option>
                                                <template v-for="(compo, index) in components.components" :key="index">
                                                    <optgroup :label="compo.comp_name">
                                                        <option v-for="(dept, index) in compo.departments" :value="dept.dept_id" :key="index">{{ dept.dept_name }} ({{ dept.dept_shortname }})</option>
                                                    </optgroup>
                                                </template>
                                            </select>
                                        </label>
                                        <div class="flex items-center justify-start">
                                            <div class="flex items-center justify-center">
                                                <button class="btn btn-primary" type="submit">Valider</button>
                                            </div>
                                            <div class="flex items-center justify-center">
                                                <button class="btn" @click="showForm(acc.account.acc_id)">Annuler</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div v-else>
                        <p>Aucun accès n'a été trouvé.</p>
                    </div>
                </div>
            </div>
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
                        <button class="btn btn-primary" type="submit">Ajouter l'accès</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="bg-base-200 w-full h-4"></div>
        <!-- Partie autorisation au site -->
        <div class="m-5 flex items-start justify-center md:flex-row flex-col">
            <div class="md:w-1/2 w-4/5 flex items-center flex-col">
                <p class="text-lg font-bold">Liste des autorisations au site</p>
                <div v-if="accepted" class="w-full my-2">
                    <div v-if="accepted && accepted.count > 0">
                        <!-- Barre de recherche -->
                        <div class="py-2">
                            <label class="input input-bordered flex items-center gap-2">
                                <input type="text" class="grow" placeholder="Recherche par nom" v-model="searchQuery" />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                                    <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                                </svg>
                            </label>
                        </div>
                        <!-- Liste utilisateurs -->

                        <div class="overflow-x-auto" v-if="filteredEtudiants.length > 0">
                            <table class="table table-zebra">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Login</th>
                                        <th>NOM Prénom</th>
                                        <th class="flex items-center justify-center">Département</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(acc, index) in filteredEtudiants" :key="index">
                                        <th>{{ index }}</th>
                                        <th>{{ acc.acc_id }}</th>
                                        <th class="min-w-44" v-if="acc.account">{{ acc.account.acc_fullname }}</th>
                                        <th class="min-w-44" v-else>Nom introuvable</th>
                                        <th>
                                            <span class="flex items-center justify-center">
                                                <span v-if="acc.department" class="badge p-3 min-w-40" :style="{backgroundColor: acc.department.dept_color}">{{ acc.department.dept_shortname }}</span>
                                                <span v-else-if="acc.account" class="badge p-3 min-w-40">Aucun</span>
                                                <span v-else class="badge p-3 min-w-40">Introuvable</span>
                                            </span>
                                        </th>
                                        <th>
                                            <RouterLink :to="{name: 'Profile', params: {acc_id: acc.acc_id}}">
                                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 p-2">
                                                    <svg fill="#000000" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" d="M5,2 L7,2 C7.55228475,2 8,2.44771525 8,3 C8,3.51283584 7.61395981,3.93550716 7.11662113,3.99327227 L7,4 L5,4 C4.48716416,4 4.06449284,4.38604019 4.00672773,4.88337887 L4,5 L4,19 C4,19.5128358 4.38604019,19.9355072 4.88337887,19.9932723 L5,20 L19,20 C19.5128358,20 19.9355072,19.6139598 19.9932723,19.1166211 L20,19 L20,17 C20,16.4477153 20.4477153,16 21,16 C21.5128358,16 21.9355072,16.3860402 21.9932723,16.8833789 L22,17 L22,19 C22,20.5976809 20.75108,21.9036609 19.1762728,21.9949073 L19,22 L5,22 C3.40231912,22 2.09633912,20.75108 2.00509269,19.1762728 L2,19 L2,5 C2,3.40231912 3.24891996,2.09633912 4.82372721,2.00509269 L5,2 L7,2 L5,2 Z M21,2 L21.081,2.003 L21.2007258,2.02024007 L21.2007258,2.02024007 L21.3121425,2.04973809 L21.3121425,2.04973809 L21.4232215,2.09367336 L21.5207088,2.14599545 L21.5207088,2.14599545 L21.6167501,2.21278596 L21.7071068,2.29289322 L21.7071068,2.29289322 L21.8036654,2.40469339 L21.8036654,2.40469339 L21.8753288,2.5159379 L21.9063462,2.57690085 L21.9063462,2.57690085 L21.9401141,2.65834962 L21.9401141,2.65834962 L21.9641549,2.73400703 L21.9641549,2.73400703 L21.9930928,2.8819045 L21.9930928,2.8819045 L22,3 L22,3 L22,9 C22,9.55228475 21.5522847,10 21,10 C20.4477153,10 20,9.55228475 20,9 L20,5.414 L13.7071068,11.7071068 C13.3466228,12.0675907 12.7793918,12.0953203 12.3871006,11.7902954 L12.2928932,11.7071068 C11.9324093,11.3466228 11.9046797,10.7793918 12.2097046,10.3871006 L12.2928932,10.2928932 L18.584,4 L15,4 C14.4477153,4 14,3.55228475 14,3 C14,2.44771525 14.4477153,2 15,2 L21,2 Z"/>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 p-2" @click="removeAccepted(acc.acc_id)">
                                                <svg width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" class="stroke-current" fill="none" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else>
                            <p class="text-center p-5">Aucun étudiant trouvé.</p>
                        </div>
                    </div>
                    <div v-else>
                        <p>Aucun utilisateur n'a été trouvé.</p>
                    </div>
                </div>
            </div>
            <div class="md:w-1/2 w-full flex items-center justify-center flex-col">
                <div class="w-96 flex items-center flex-col justify-center">
                    <p class="text-lg font-bold">Ajouter un utilisateur</p>
                    <form @submit.prevent="addAccepted" class="w-2/5 *:my-2">
                        <input type="text" placeholder="Login" v-model="newAccepted.login" class="input input-bordered w-full " />
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary" type="submit">Ajouter l'utilisateur</button>
                        </div>
                    </form>
                </div>
                <ImportComp text="Importer des étudiants en csv"></ImportComp>
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

    const accountStore = useAccountStore();
    const access = ref([]);
    const accepted = ref([]);
    const newAccess = ref({ login: '', access: ''});
    const newAccepted = ref({ login: ''});
    const response = ref([]);
    const components = ref([]);

    const isLoaded = ref(false);
    
    const showForms = ref([]);
    const selectedDepartment = ref([]);

    const searchQuery = ref('');


    async function addAccess(){
        if(newAccess.value.login == ''){
            addAlert(true, {data:{error: 'Vous devez entrer un login.', message:'Ajout de l\'accès annulé.'}})
            return;
        }
        if(newAccess.value.access == "Selectionnez un niveau d'accès"){
            addAlert(true, {data:{error: 'Vous devez choisir un niveau d\'accès..', message:'Ajout de l\'accès annulé.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccess.value.login,
            acs_accounttype: newAccess.value.access,
            }; 
        await request("POST", true, response, config.apiUrl+'api/access', requestData);
        if(response.value.status == 201){
            const requestDataAction = {
                act_description: 'Ajout de l\'access pour '+newAccess.value.login+'. (Accès de niveau '+ newAccess.value.access +')',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetch();
        resetInput();
    }

    async function addAccepted(){
        if(newAccepted.value.login == ''){
            addAlert(true, {data:{error: 'Vous devez entrer un login.', message:'Ajout de l\'autorisation annulé.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccepted.value.login,
        };
        await request("POST", true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 201){
            const requestDataAction = {
                act_description: 'Ajout de l\'autorisation pour l\'utilisateur '+newAccess.value.login+'.',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetch();
        resetInput();
    }

    async function removeAccess(acc_id){
        const requestData = {
            acc_id: acc_id,
            acc_id_action: accountStore.login
        }
        await request('DELETE', true, response, config.apiUrl+'api/access/delete', requestData);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'access pour '+acc_id+'.',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }

    const filteredEtudiants = computed(() => {
        if (!searchQuery.value) {
            return accepted.value.accounts;
        }
        return accepted.value.accounts.filter(acc =>
            acc.account.acc_fullname.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });


    async function removeAccepted(acc_id){
        const requestData = {
            acc_id: acc_id,
        }
        await request('DELETE', true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'autorisation pour l\'utilisateur '+acc_id+'.',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }

    function resetInput(){
        newAccess.value.login = '';
        newAccess.value.access = document.querySelector('.select').options[0].value;
        newAccepted.value.login = '';
    }

    // Partie gestion du département d'un accès

    async function removeDept(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/account/removedept/'+acc_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression du département pour l\'access de '+acc_id+'.',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }

    async function showForm(acc_id) {
        showForms.value[acc_id] = !showForms.value[acc_id];
    }
    
    // Changer departement d'un utilisateur
    async function submitForm(acc_id) {
        showForms.value[acc_id] = false;
        await request('put', true, response, config.apiUrl+'api/account/changedept/'+acc_id+'/'+selectedDepartment.value[acc_id]);
        if(response.value.status == 200){
            const requestDataAction = {
                act_description: 'Changement du département dans l\'access pour '+acc_id+' (Nouveau: '+ selectedDepartment.value[acc_id] +').',
                acc_id: accountStore.login,
                access: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }


    // Partie récupération des données

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        await request('GET', false, components, config.apiUrl+'api/component');
        isLoaded.value = true;
        if(access.value.access && access.value.access[2]){
            showForms.value = Array(access.value.access[2].length).fill(false);
            selectedDepartment.value = Array(access.value.access[2].length).fill('');
        }
        await nextTick()
        resetInput();
    }

    onMounted(fetch)
</script>