<template>
    <div class="m-5 flex items-center justify-center md:flex-row flex-col">
        <div class="md:w-1/2 w-4/5 flex items-center flex-col">
            <p class="text-lg font-bold">Liste des utilisateurs</p>
            <div v-if="access && access.count" class="w-full my-2">
                <div v-if="access && access.count > 0">
                    <p>RI (Relations Internationales)</p>
                    <div class="md:m-5 m-1">
                        <div v-for="(acc, index) in access.access[1]" :key="index" class="flex *:my-1">
                            <div class="bg-base-300 p-2 w-full flex items-center">
                                <span class="font-bold mr-1">{{ acc.acc_id }}</span>  <span v-if="acc.account">({{ acc.account.acc_fullname }})</span>
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
                                    <span v-if="acc.account">({{ acc.account.acc_fullname }})</span>
                                    <div v-if="acc.account.department && acc.account.department.dept_shortname" class="flex bg-base-300 items-center justify-center">
                                        <span class="p-2 mx-2 flex items-center justify-center" :style="{backgroundColor: acc.account.department.dept_color}">
                                            <p class="mx-1">{{ acc.account.department.dept_shortname}}</p>
                                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="removeDept(acc.acc_id)">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </span>
                                    </div>
                                    <div v-else>
                                        <button class="btn  mx-2" v-if="!showForms[acc.account.acc_id]" @click="showForm(acc.account.acc_id)">Séléctionner un département</button>
                                    </div>

                                    
                                </div>
                                
                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeAccess(acc.acc_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <!-- Formulaire pour ajouter un département -->
                            <div v-if="showForms[acc.account.acc_id]">
                                <form @submit.prevent="submitForm(acc.account.acc_id)" class="my-1">
                                    <label class="form-control w-full max-w-xs">
                                        <div class="label">
                                            <span class="label-text">Séléctionnez un département</span>
                                        </div>
                                        <select class="select select-bordered" v-model="selectedDepartment[acc.account.acc_id]">
                                            <option disabled selected>Séléctionnez un Département</option>
                                            <option v-for="(dept, index) in departments.departments" :key="index" :value="dept.dept_id">{{ dept.dept_shortname }}</option>
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
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
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
</template>

<script setup>

    import { ref, onMounted } from 'vue';
    import { request } from '../../composables/httpRequest.js'
    import config from '../../config'

    const access = ref([]);
    const newAccess = ref({ login: '', access: ''});
    const response = ref([]);
    const departments = ref([]);
    
    const showForms = ref([]);
    const selectedDepartment = ref([]);


    async function addAccess(){
        const requestData = { 
            acc_id: newAccess.value.login,
            acs_accounttype: newAccess.value.access,
        };
        await request("POST", true, response, config.apiUrl+'api/access', requestData);
        await fetch();
        resetInput();

    }

    async function removeAccess(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/access/deletebylogin/'+acc_id);
        fetch();
    }

    function resetInput(){
        newAccess.value.login = '';
        newAccess.value.access = document.querySelector('.select').options[0].value;
    }
    async function removeDept(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/account/removedept/'+acc_id);
        fetch();
    }

    async function showForm(acc_id) {
        showForms.value[acc_id] = !showForms.value[acc_id];
    }
    
    async function submitForm(acc_id) {
        showForms.value[acc_id] = false;
        await request('put', true, response, config.apiUrl+'api/account/changedept/'+acc_id+'/'+selectedDepartment.value[acc_id]);
        fetch();
    }

    async function fetch(){
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        await request('GET', false, departments, config.apiUrl+'api/department');
        showForms.value = Array(access.value.access[2].length).fill(false);
        selectedDepartment.value = Array(access.value.access[2].length).fill('');

        resetInput();
    }

    onMounted(fetch)
</script>