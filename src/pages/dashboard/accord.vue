<template>
    <div v-if="accords.length > 0 && isceds.length > 0 && composantes.length > 0 && universites.length > 0">

        <p class="font-bold text-xl">Accord</p>
        <!-- Partie ajout d'un accord -->
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col" >
                <p class="text-lg font-bold">Ajout accord</p>
                <form @submit.prevent="addAgreement" class="w-2/5 *:my-2">
                    <select class="select select-bordered w-full" id="isced_select" v-model="newAgreement.isced">
                        <option disabled selected>Selectionnez un isced</option>
                        <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{isced.isc_code}}) {{ isced.isc_name }}</option>
                    </select>
                    <select class="select select-bordered w-full" id="compo_select" v-model="newAgreement.compo">
                        <option disabled selected>Selectionnez une composante</option>
                        <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                    </select>
                    <select class="select select-bordered w-full" id="univ_select" v-model="newAgreement.univ">
                        <option disabled selected>Selectionnez une université</option>
                        <option v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }}</option>
                    </select>
                    <select class="select select-bordered w-full" id="typeaccord_select" v-model="newAgreement.typeaccord">
                        <option disabled selected>Selectionnez un type d'accord</option>
                        <option>Bilatéral</option>
                        <option>Erasmus</option>
                    </select>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nombre de place</span>
                        </div>
                        <input type="number" class="input input-bordered w-full" v-model="newAgreement.nbplace"/>
                    </label>
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Ajouter l'accord</button>
                    </div>
                </form>
            </div>

        </div>
        <!-- Partie liste des accords -->
        <div>
            <p class="font-bold">Liste des accords:</p>
            <div v-if="accords && accords.length > 0" v-for="(accord, indexAccord) in accords" :key="indexAccord" class="m-5 p-3 flex">
                <div class="w-full bg-base-300 p-2">

                    <p>{{accord.university.univ_name}} ({{ accord.university.univ_city }}): [{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}] Composante: {{ accord.component.comp_name }}</p>
                    <!-- Liste des départements d'un accord -->
                    <p>Les départements: </p>
                    <div class="flex items-center justify-start">
                        <div v-for="(dept, indexDept) in accord.departments" :key="indexDept">
                            <div class="w-fit p-2 flex items-center justify-center mx-1" :style="{backgroundColor: dept.dept_color}">
                                <p>{{ dept.dept_shortname }} <span class="font-bold">{{ dept.pivot.deptagree_valide === 0 ? '(Non validé par le dep)' : '' }}</span></p>
                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-1 ml-2" @click="removeDeptFromAgreement(accord.agree_id, dept.dept_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </div>
                        <p class="bg-base-200 p-4 hover:cursor-pointer hover:opacity-60 select-none mx-1" @click="showForm(accord.agree_id)">Ajouter un département</p>
                    </div>
                    <!-- Formulaire pour ajouter un département -->
                    <div v-if="showForms[accord.agree_id]">
                        <form @submit.prevent="submitForm(accord.agree_id)">
                            <p>Ajouter un département</p>
                            <div class="flex items-center justify-start *:m-1">
                                <select class="select select-bordered w-full max-w-xs" :id="'form_dept_select_'+accord.agree_id" v-model="selectedDepartment[accord.agree_id]">
                                    <option disabled selected>Selectionnez un département</option>
                                    <option v-for="(dept, indexDept) in filteredDepartments(accord)" :key="indexDept" :value="dept.dept_id">{{ dept.dept_shortname }} ({{dept.component.comp_name}})</option>
                                </select>
                                <div class="flex items-center justify-center">
                                    <button class="btn btn-primary" type="submit">Ajouter le département</button>
                                </div>
                                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="showForm(accord.agree_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="deleteAgreement(accord.agree_id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center my-20">
        <span class="loading loading-dots loading-lg"></span>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import config from '../../config'
    import { request } from '../../composables/httpRequest';

    const response = ref([]);

    const accords = ref([]);
    const isceds = ref([]);
    const composantes = ref([]);
    const universites = ref([]);
    const departments = ref([]);

    const newAgreement = ref({ isced: '', compo: '', univ: '', typeaccord: '', nbplace: 0 });

    /**
     * Pour les deux:
     * agree_id: valeur
     */
    const showForms = ref([]);
    const selectedDepartment = ref([]);

    async function addAgreement(){
        const requestData = { 
            isc_id: newAgreement.value.isced,
            comp_id: newAgreement.value.compo,
            univ_id: newAgreement.value.univ,
            typeaccord: newAgreement.value.typeaccord,
            nbplace: newAgreement.value.nbplace 
        };
        await request("POST", response, config.apiUrl+'api/agreement', requestData);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', accords, config.apiUrl+'api/agreement');
        await request('GET', isceds, config.apiUrl+'api/isced');
        await request('GET', composantes, config.apiUrl+'api/component');
        await request('GET', universites, config.apiUrl+'api/university');
        await request('GET', departments, config.apiUrl+'api/department');

        //On cache tous les formulaires
        showForms.value = Array(accords.value.length).fill(false);
        selectedDepartment.value = Array(accords.value.length).fill('');
        resetInput();
    }

    onMounted(fetchAll)

    async function showForm(agree_id) {
        showForms.value[agree_id] = !showForms.value[agree_id];
    }

    async function removeDeptFromAgreement(agree_id, dept_id){
        await request('DELETE', response, config.apiUrl+'api/departmentagreement/delete/'+agree_id+'/'+dept_id);
        fetchAll();
    }

    async function deleteAgreement(agree_id){
        await request('DELETE', response, config.apiUrl+'api/agreement/deletebyid/'+agree_id);
        fetchAll();
    }

    async function submitForm(agree_id) {
        showForms.value[agree_id] = false;
        const requestData = {
            agree_id: agree_id,
            dept_id: selectedDepartment.value[agree_id],
            deptagree_valide: true
        }
        await request('POST', response, config.apiUrl+'api/departmentagreement', requestData);
        fetchAll();
    }

    function filteredDepartments(accord) {
        const accordDepartmentIds = accord.departments.map(dept => dept.dept_id);
        return departments.value.filter(dept => !accordDepartmentIds.includes(dept.dept_id));
    }

    function resetInput(){
        newAgreement.value.isced = document.querySelector('#isced_select').options[0].value;
        newAgreement.value.compo = document.querySelector('#compo_select').options[0].value;
        newAgreement.value.univ = document.querySelector('#univ_select').options[0].value;
        newAgreement.value.typeaccord = document.querySelector('#typeaccord_select').options[0].value;
    }
</script>
