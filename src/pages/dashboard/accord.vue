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
        
        <div v-for="(accord, index) in accords" :key="index" class="m-5 bg-slate-200">
            <p>{{accord.university.univ_name}} ({{ accord.university.univ_shortname }}): [{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}] Composante: {{ accord.component.comp_name }}</p>
            <p>Les départements: </p>
            <div class="flex items-center justify-start">
                <div v-for="(dept, index) in accord.departments" :key="index">
                    <p class="mx-5 w-fit p-2" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                </div>
                <p class="bg-slate-300 p-2">+</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import config from '../../config'
    import { request } from '../../composables/httpRequest';

    const accords = ref([]);
    const isceds = ref([]);
    const composantes = ref([]);
    const universites = ref([]);

    const newAgreement = ref({ isced: '', compo: '', univ: '', typeaccord: '', nbplace: 0 });

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
    }

    onMounted(fetchAll)

</script>