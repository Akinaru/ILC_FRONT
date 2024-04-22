<template>
    <p class="font-bold text-xl">Accord</p>
    <div>
        <p class="font-bold">Ajout d'accord</p>
        <div class="flex *:m-2 bg-slate-300">


            <form @submit.prevent="addAgreement" class="bg-slate-100 *:m-1 w-full flex">
                <select id="isced_id" name="numisced_id" v-model="newAgreement.isced">
                    <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{isced.isc_code}}) {{ isced.isc_name }}</option>
                </select> 
                <select id="comp_id" name="composante_id" v-model="newAgreement.compo">
                    <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                </select> 
                <select id="univ_id" name="universite_id" v-model="newAgreement.univ">
                    <option v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }}</option>
                </select> 
                <select name="" id="" v-model="newAgreement.typeaccord">
                    <option value="">Bilatéral</option>
                    <option value="">Erasmus</option>
                </select>
                <div>
                    <p>Nb de place</p>
                    <input type="number" name="" id="" value="0" v-model="newAgreement.nbplace">
                </div>
                <button class="bg-slate-200 p-5 m-1" type="submit">Ajouter l'accord</button>
            </form>
            
        </div>
    </div>
    <div>
        <p class="font-bold">Liste des accords:</p>
        
        <div v-for="(accord, indexAccord) in accords" :key="indexAccord" class="m-5 bg-slate-200">
            <p>{{accord.university.univ_name}} ({{ accord.university.univ_city }}): [{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}] Composante: {{ accord.component.comp_name }}</p>
            <p>Les départements: </p>
            <div class="flex items-center justify-start">
                <div v-for="(dept, indexDept) in accord.departments" :key="indexDept">
                    <div class="w-fit p-2 flex items-center justify-center" :style="{backgroundColor: dept.dept_color}">
                        <p>{{ dept.dept_shortname }} <span class="font-bold">{{ dept.pivot.deptagree_valide === 0 ? '(Non validé par le dep)' : '' }}</span></p>
                        <p class="m-1 bg-slate-200 p-1 hover:cursor-pointer hover:opacity-60 select-none" @click="removeDeptFromAgreement(accord.agree_id, dept.dept_id)">X</p>
                    </div>
                </div>
                <p class="bg-slate-300 p-2 hover:cursor-pointer hover:opacity-60 select-none" @click="showForm(accord.agree_id)">+</p>
            </div>
            <div v-if="showForms[accord.agree_id]">
                <form @submit.prevent="submitForm(accord.agree_id)">
                    <p>Ajouter un département</p>
                    <select v-model="selectedDepartment[accord.agree_id]">
                        <option v-for="(dept, indexDept) in filteredDepartments(accord)" :key="indexDept" :value="dept.dept_id">{{ dept.dept_shortname }} ({{dept.component.comp_name}})</option>
                    </select>
                    <button type="submit" class="p-5 bg-slate-300 hover:cursor-pointer hover:opacity-60">Submit</button>
                </form>
            </div>
        </div>
    </div>
    {{ response }}
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
        await request("POST", response, config.apiUrl+'agreement', requestData);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', accords, config.apiUrl+'agreement');
        await request('GET', isceds, config.apiUrl+'isced');
        await request('GET', composantes, config.apiUrl+'component');
        await request('GET', universites, config.apiUrl+'university');
        await request('GET', departments, config.apiUrl+'department');

        //On cache tous les formulaires
        showForms.value = Array(accords.value.length).fill(false);
        selectedDepartment.value = Array(accords.value.length).fill('');
    }

    onMounted(fetchAll)

    async function showForm(agree_id) {
        showForms.value[agree_id] = !showForms.value[agree_id];
    }

    async function removeDeptFromAgreement(agree_id, dept_id){
        await request('DELETE', response, config.apiUrl+'departmentagreement/delete/'+agree_id+'/'+dept_id);
        fetchAll();
    }

    async function submitForm(agree_id) {
        console.log('Selected department:', selectedDepartment.value[agree_id], 'Agreement:', agree_id);
        showForms.value[agree_id] = false;
        const requestData = {
            agree_id: agree_id,
            dept_id: selectedDepartment.value[agree_id],
            deptagree_valide: true
        }
        await request('POST', response, config.apiUrl+'departmentagreement', requestData);
        fetchAll();
    }

    function filteredDepartments(accord) {
        const accordDepartmentIds = accord.departments.map(dept => dept.dept_id);
        return departments.value.filter(dept => !accordDepartmentIds.includes(dept.dept_id));
    }
</script>
