<template>
    <div>
        <p>Departement</p>
        <div class="m-5">
            <p class="text-lg font-bold">Ajout departement</p>

            <form @submit.prevent="addDepartment" class="bg-slate-100">
                <select v-model="newDep.comp">
                    <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                </select> 
                <input type="color" v-model="newDep.color">
                <input type="text" placeholder="Nom" v-model="newDep.name">
                <input type="text" placeholder="Nom raccourci" v-model="newDep.shortname">
                <button class="bg-slate-200 p-5 m-1" type="submit">Ajouter le département</button>
            </form>
        </div>
        <div>
            <div v-for="(compo, index) in composantes" :key="index">
                <p>{{ compo.comp_name }}</p>
                <ul>
                    <li v-for="(dept, index) in compo.departments" :key="index" class="list-disc mx-10 flex items-center justify-center m-1">
                        <p class="w-full p-2" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_name }} ({{ dept.dept_shortname }})</p>
                        <div>
                            <p class="hover:opacity-60 hover:cursor-pointer bg-slate-200 p-2" @click="removeDepartment(dept.dept_id)">X</p>
                        </div>
                    </li>
                    <p class="list-disc mx-10" v-if="compo.departments.length == 0">Aucun département</p>
                </ul>
            </div>
        </div>
        <p>Réponse: {{ response }}</p>
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    const departements = ref([]);
    const composantes = ref([]);
    const response = ref([]);

    const newDep = ref({ name: '', shortname: '', color: '#9e9e9e', compo: 1 });


    async function addDepartment(){
        const requestData = { 
            dept_name: newDep.value.name,
            dept_shortname: newDep.value.shortname,
            dept_color: newDep.value.color,
            comp_id: newDep.value.comp 
        };
        await request("POST", response, config.apiUrl+'department', requestData);
        await fetchAll();

        newDep.value.name = '';
        newDep.value.shortname = '';
        newDep.value.color = '#9e9e9e';
        newDep.value.compo = '';

    }

    async function removeDepartment(id){
        await request('DELETE', response, config.apiUrl+'department/deletebyid/'+id);
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', departements, config.apiUrl+'department');
        await request('GET', composantes, config.apiUrl+'component');
    }

    onMounted(fetchAll);

</script>