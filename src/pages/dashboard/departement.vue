<template>
    <div>
        <p class="text-xl font-bold">Departement</p>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col">
                <p class="text-lg font-bold">Ajout département</p>
                <form @submit.prevent="addDepartment" class="w-fit *:my-2">
                    <select class="select select-bordered w-full" v-model="newDep.comp">
                        <option disabled selected>Selectionnez une composante</option>
                        <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                    </select>
                    <div class="w-full flex items-center justify-between">
                        <span class="label-text">Couleur</span> 
                        <input type="color" v-model="newDep.color">
                    </div>
                    <input type="text" placeholder="Nom" v-model="newDep.name" class="input input-bordered w-full " />
                    <input type="text" placeholder="Nom raccourci" v-model="newDep.shortname" class="input input-bordered w-full" />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Ajouter le département</button>

                    </div>
                </form>
            </div>
        </div>




        <div>
            <p class="text-lg font-bold">Liste département</p>
            <div v-if="composantes && composantes.length > 0">

                <div v-for="(compo, index) in composantes" :key="index">
                    <li class="list-disc">{{ compo.comp_name }}</li>
                    <div v-for="(dept, index) in compo.departments" :key="index" class="mx-10 flex m-1">
                        
                        <div class="bg-base-300 w-full p-5 flex items-center justify-center">
                            <div class="h-10 w-10 mx-5" :style="{backgroundColor: dept.dept_color}"></div>
                            <p class="w-full">{{ dept.dept_name }} ({{ dept.dept_shortname }})</p>
                        </div>
                        <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeDepartment(dept.dept_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <p class="list-disc mx-10 my-5" v-if="compo.departments.length == 0">Aucun département</p>
                </div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
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
            dept_shortname: newDep.value.shortname.toUpperCase(),
            dept_color: newDep.value.color,
            comp_id: newDep.value.comp 
        };
        await request("POST", response, config.apiUrl+'api/department', requestData);
        await fetchAll();

        newDep.value.name = '';
        newDep.value.shortname = '';
        newDep.value.color = '#9e9e9e';
        newDep.value.comp = document.querySelector('.select').options[0].value;

    }

    async function removeDepartment(id){
        await request('DELETE', response, config.apiUrl+'api/department/deletebyid/'+id);
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', departements, config.apiUrl+'api/department');
        await request('GET', composantes, config.apiUrl+'api/component');
        newDep.value.comp = document.querySelector('.select').options[0].value;
    }

    onMounted(fetchAll);

</script>