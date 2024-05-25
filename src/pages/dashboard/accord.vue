<template>
    <div>

        <p class="font-bold text-xl">Accord</p>
        <!-- Partie ajout d'un accord -->
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col" >
                <p class="text-lg font-bold">Ajout accord</p>
                <form @submit.prevent="addAgreement" class="w-2/5 *:my-2">
                    <!-- Formulaire Isced -->
                    <label class="form-control w-full items-center justify-center">
                        <div class="label">
                            <span class="label-text">Isced</span>
                        </div>
                        <select class="select select-bordered w-full select-primary" id="isced_select" v-model="newAgreement.isced">
                            <option disabled selected>Selectionnez un isced</option>
                            <option     v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{isced.isc_code}}) {{ isced.isc_name }}</option>
                            <option value="addNew">Créer un isced</option>
                        </select>
                        <label class="form-control w-5/6 my-1" v-if="newAgreement.isced === 'addNew'">
                            <div class="label">
                                <span class="label-text">Créer un Isced</span>
                            </div>
                            <input type="number" placeholder="Code (ex: 061)" v-model="newAgreement.newisced.code" class="input input-bordered w-full" />
                            <input type="text" placeholder="Nom (ex: Information and Communication Technologies)" v-model="newAgreement.newisced.name" class="input input-bordered w-full " />
                        </label>
                    </label>
                    <!-- Formualire composante -->
                    <label class="form-control w-full items-center justify-center">
                        <div class="label">
                            <span class="label-text">Composante</span>
                        </div>
                        <select class="select select-bordered w-full select-primary" id="compo_select" v-model="newAgreement.compo">
                            <option disabled selected>Selectionnez une composante</option>
                            <option v-if="composantes && composantes.components" v-for="(compo, index) in composantes.components" :key="index" :value="compo.comp_id">{{ compo.comp_name }} ({{ compo.comp_shortname }})</option>
                            <option value="addNew">Créer une composante</option>
                        </select>
                        <label class="form-control w-5/6 my-1" v-if="newAgreement.compo === 'addNew'">
                            <div class="label">
                                <span class="label-text">Créer une composante</span>
                            </div>
                            <input type="text" placeholder="Nom (ex: IUT Annecy)" v-model="newAgreement.newcompo.name" class="input input-bordered w-full" />
                            <input type="text" placeholder="Nom raccourci (ex: IUT-A)" v-model="newAgreement.newcompo.shortname" class="input input-bordered w-full " />
                        </label>
                    </label>
                    <!-- Formulaire université -->
                    <label class="form-control w-full items-center justify-center">
                        <div class="label">
                            <span class="label-text">Université</span>
                        </div>
                        <select class="select select-bordered w-full select-primary" id="univ_select" v-model="newAgreement.univ">
                            <option disabled selected>Selectionnez une université</option>
                            <option v-if="universites && universites.length > 0" v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }} ({{ univ.univ_city }} - {{ univ.partnercountry.parco_name }})</option>
                            <option value="addNew">Créer une université</option>
                        </select>
                        <label class="form-control w-5/6 my-1" v-if="newAgreement.univ === 'addNew'">
                            <div class="label">
                                <span class="label-text">Créer une université</span>
                            </div>
                            <span class="my-1">
                                <input type="text" placeholder="Nom (ex: Université Savoie Mont Blanc)" v-model="newAgreement.newuniv.name" class="input input-bordered w-full " />
                                <input type="text" placeholder="Ville (ex: Annecy)" v-model="newAgreement.newuniv.city" class="input input-bordered w-full " />
                            </span>
                            <select class="select select-bordered w-full select-primary" id="partnercountry_select" v-model="newAgreement.newuniv.partnercountry">
                                <option disabled selected>Selectionnez un pays</option>
                                <option v-for="(parco, index) in partnercountrys" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                                <option value="addNew">Créer un pays</option>
                            </select>
                            <span class="flex items-center justify-center">

                                <input v-if="newAgreement.newuniv.partnercountry === 'addNew'" type="text" placeholder="Nouveau pays (ex: France)" v-model="newAgreement.newuniv.newpartnercountry" class="input input-bordered w-5/6 my-1" />
                            </span>

                        </label>
                    </label>
                    <!-- Formulaire Typeaccord -->
                    <label class="form-control w-full items-center justify-center">
                        <div class="label">
                            <span class="label-text">Type accord</span>
                        </div>
                        <select class="select select-bordered w-full select-primary" id="typeaccord_select" v-model="newAgreement.typeaccord">
                            <option disabled selected>Selectionnez un type d'accord</option>
                            <option>Bilatéral</option>
                            <option>Erasmus</option>
                        </select>
                    </label>
                    <!-- Formulaire Nombre de place -->
                    <label class="form-control w-full items-center justify-center">
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
            <div v-if="accords && accords.agreements">
                <div v-if="accords.count > 0">

                    <div v-for="(accord, indexAccord) in accords.agreements" :key="indexAccord" class="m-5 p-3 flex">
                        <div class="w-full bg-base-300 p-2 drop-shadow-lg">
    
                            <p>({{ accord.partnercountry.parco_name }}) {{accord.university.univ_name}} ({{ accord.university.univ_city }}): [{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}] Composante: {{ accord.component.comp_name }}</p>
                            <!-- Liste des départements d'un accord -->
                            <p>Les départements: </p>
                            <div class="flex items-center justify-start">
                                <div v-for="(dept, indexDept) in accord.departments" :key="indexDept">
                                    <div class="w-fit p-2 flex drop-shadow-lg items-center justify-center mx-1 tooltip select-none font-bold" :data-tip="(dept.pivot.deptagree_valide == 0 ? '(INVISIBLE) ' : '')+'Département '+ dept.dept_name" :style="{backgroundColor: dept.dept_color}" >
                                        <p>{{ dept.dept_shortname }}<span class="font-bold">{{ dept.pivot.deptagree_valide === 0 ? ' (Invisible)' : '' }}</span></p>
                                        <button  class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-1 ml-2" @click="changeVisibility(accord.agree_id, dept.dept_id, dept.pivot.deptagree_valide)">
                                            <svg v-if="dept.pivot.deptagree_valide === 1" class="stroke-current shrink-0 h-5 w-5" fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                    viewBox="0 0 488.85 488.85" xml:space="preserve">
                                                <g>
                                                    <path d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
                                                        s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
                                                        c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
                                                        C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
                                                        c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"/>
                                                </g>
                                            </svg>
                                            <svg v-else class="stroke-current shrink-0 h-5 w-5" fill="#ff0000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 488.85 488.85" xml:space="preserve">
                                            <g>
                                                <!-- Contour de l'œil -->
                                                <path d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
                                                    s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
                                                    c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
                                                    C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
                                                    c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"/>
                                                <!-- Ligne de barre de l'œil -->
                                                <line x1="100" y1="100" x2="400" y2="400" style="stroke:red;stroke-width:40"/>
                                            </g>
                                        </svg>

                                        </button>
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
                        <!-- Bouton de modification -->
                        <label :for="'my_modal_'+ accord.agree_id" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
    
                        <!-- Modal de modification d'accord -->
                        <ModifAccordComp :accord="accord" :accords="accords" :isceds="isceds" :composantes="composantes" :universites="universites" :departments="departments" :partnercountrys="partnercountrys"></ModifAccordComp>
    
                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="deleteAgreement(accord.university.univ_name, accord.agree_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            
                <div v-else>
                    <p>Aucun accord trouvé.</p>
                </div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
    </div>

</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import config from '../../config'
    import { request } from '../../composables/httpRequest';
    import ModifAccordComp from '../../components/modif/ModifAccordComp.vue';
    import { useAccountStore } from '../../stores/accountStore';

    const accountStore = useAccountStore();
    const response = ref([]);
    const accords = ref([]);
    const isceds = ref([]);
    const composantes = ref([]);
    const universites = ref([]);
    const departments = ref([]);
    const partnercountrys = ref([]);
    const newAgreement = ref({ 
        isced: '', //Si addNew = nouveau isced
        compo: '', //Si addNew = nouveau composante
        univ: '', //Si addNew = nouveau univiserte
        typeaccord: '',
        nbplace: 0,

        newisced: {code: 0, name: ''},
        newcompo: {name: '', shortname: ''},
        newuniv: {
            partnercountry: '', //Si addNew = nouveau pays partenaire
            name: '', 
            city: '', 
            newpartnercountry: ''
        },
    });



    async function addAgreement(){

        const requestData = { 
            typeaccord: newAgreement.value.typeaccord,
            nbplace: newAgreement.value.nbplace 
        };
        // Gestion du nouveau isced
        if (newAgreement.value.isced !== 'addNew') {
            requestData.isc_id = newAgreement.value.isced;
        } else {
            requestData.newisced = {
                isc_code: newAgreement.value.newisced.code.toString(),
                isc_name: newAgreement.value.newisced.name
            };
        }
        // Gestion de la nouvelle composante
        if (newAgreement.value.compo !== 'addNew') {
            requestData.comp_id = newAgreement.value.compo;
        } else {
            requestData.newcompo = {
                comp_name: newAgreement.value.newcompo.name,
                comp_shortname: newAgreement.value.newcompo.shortname.toUpperCase()
            };
        }
        // Gestion de la nouvelle université
        if (newAgreement.value.univ !== 'addNew') {
            requestData.univ_id = newAgreement.value.univ;
        } else {
            requestData.newuniv = {
                univ_name: newAgreement.value.newuniv.name,
                univ_city: newAgreement.value.newuniv.city,
            };
            if(newAgreement.value.newuniv.partnercountry !== 'addNew'){
                requestData.newuniv.parco_id = newAgreement.value.newuniv.partnercountry;
            }else{
                requestData.newuniv.parco_name = newAgreement.value.newuniv.newpartnercountry
            }
        }

        await request("POST",true, response, config.apiUrl+'api/agreement', requestData);
        if(response.value.status == 201){
            const requestDataAction = {
                act_description: 'Ajout de l\'accord avec '+response.value.agreement.university.univ_name+'.',
                acc_id: accountStore.login,
                agree_id: response.value.agreement.agree_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, isceds, config.apiUrl+'api/isced');
        await request('GET', false, composantes, config.apiUrl+'api/component');
        await request('GET', false, universites, config.apiUrl+'api/university');
        await request('GET', false, departments, config.apiUrl+'api/department');
        await request('GET', false, partnercountrys, config.apiUrl+'api/partnercountry');

        //On cache tous les formulaires
        showForms.value = Array(accords.value.length).fill(false);
        selectedDepartment.value = Array(accords.value.length).fill('');
        resetInput();
    }
    async function removeDeptFromAgreement(agree_id, dept_id){
        await request('DELETE', true, response, config.apiUrl+'api/departmentagreement/delete/'+agree_id+'/'+dept_id);
        fetchAll();
    }
    async function deleteAgreement(univ_name, agree_id){
        await request('DELETE', true, response, config.apiUrl+'api/agreement/deletebyid/'+agree_id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression de l\'accord avec '+univ_name+'.',
                acc_id: accountStore.login,
                agree_id: agree_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
    }
    function filteredDepartments(accord) {
        if(accord.departments.length > 0){

            const accordDepartmentIds = accord.departments.map(dept => dept.dept_id);
            return departments.value.departments.filter(dept => !accordDepartmentIds.includes(dept.dept_id));
        }else{
            return departments.value.departments;
        }
    }
    function resetInput(){
        newAgreement.value.isced = document.querySelector('#isced_select').options[0].value;
        newAgreement.value.compo = document.querySelector('#compo_select').options[0].value;
        newAgreement.value.univ = document.querySelector('#univ_select').options[0].value;
        newAgreement.value.typeaccord = document.querySelector('#typeaccord_select').options[0].value;  
        newAgreement.value.newuniv.name = '';
        newAgreement.value.newuniv.city = '';
        newAgreement.value.newuniv.newpartnercountry = '';
    }

    async function changeVisibility(accordId, deptId, deptagree_valide) {
        const newVisibility = deptagree_valide === 0 ? 1 : 0;

        const requestData = {
            dept_id: deptId,
            agree_id: accordId,
            deptagree_valide: newVisibility
        }

        await request('PUT', true, response, config.apiUrl+'api/departmentagreement/changevisibility', requestData);
        if(response.value.status == 200){
            const accord = accords.value.agreements.find(accord => accord.agree_id == accordId);
            const dept = accord.departments.find(dept => dept.dept_id == deptId);
            dept.pivot.deptagree_valide = newVisibility;
        }
    }


        /**
     * Pour les deux:
     * agree_id: valeur
     */
    const showForms = ref([]);
    const selectedDepartment = ref([]);
    async function showForm(agree_id) {
        showForms.value[agree_id] = !showForms.value[agree_id];
    }
    async function submitForm(agree_id) {
        showForms.value[agree_id] = false;
        const requestData = {
            agree_id: agree_id,
            dept_id: selectedDepartment.value[agree_id],
            deptagree_valide: true
        }
        await request('POST', true, response, config.apiUrl+'api/departmentagreement', requestData);
        fetchAll();
    }

    onMounted(fetchAll)

</script>
