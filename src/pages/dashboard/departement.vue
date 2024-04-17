<template>
    <div>
        <p>Departement</p>
        <div class="m-5">
            <p class="text-lg font-bold">Ajout departement</p>
            <div> 
                <select id="comp_id" name="composante_id">
                    <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                </select> 
                <input type="color" id="dept_color">
                <input type="text" placeholder="Nom" id="dept_name">
                <input type="text" placeholder="Nom raccourci" id="dept_shortname">
                <input class="bg-slate-200 p-5 m-1" type="submit" value="Ajouter le departement" @click="addDepartment">
            </div>
        </div>
        <div>
            <div v-for="(compo, index) in composantes" :key="index">
                <p>{{ compo.comp_name }}</p>
                <ul>
                    <li v-for="(dept, index) in compo.departments" :key="index" class="list-disc mx-10">
                        <p :style="{backgroundColor: dept.dept_color}">{{ dept.dept_name }} ({{ dept.dept_shortname }})</p>
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

    async function addDepartment(){
        const name = dept_name.value;
        const shortname = dept_shortname.value.toUpperCase();
        const color = dept_color.value;
        const composante = comp_id.value;

        const requestData = { dept_name: name, dept_shortname: shortname, dept_color: color , comp_id: composante};
        await request("POST", response, config.apiUrl+'department', requestData);
        if (response.value.status == 201) {
            dept_name.value = '';
            dept_shortname.value = '';
        }
        fetchAll();
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