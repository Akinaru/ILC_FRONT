<template>
    <div>
        <p>Isced</p>
        <div class="m-5">
            <p class="text-lg font-bold">Ajout Isced</p>
            <input type="number" placeholder="Code" id="isc_code">
            <input type="text" placeholder="Nom" id="isc_name">
            <input class="bg-slate-200 p-5 m-1 hover:cursor-pointer hover:opacity-60" type="submit" value="Ajouter l'isced" @click="addIsced">
        </div>
        <div>
            <p>Liste isced:</p>
            <ul>
                <li class="mx-10 flex items-center justify-between bg-slate-100" v-for="(isc, index) in isced" :key="index">
                    <p class="bg-slate-100">({{ isc.isc_code }}) {{ isc.isc_name }}</p>
                    <p @click="deleteIsced(isc.isc_id)" class="hover:cursor-pointer hover:opacity-60 bg-slate-300 p-3">X</p>
                </li>
            </ul>
        </div>
        <p>Réponse: {{ response }}</p>
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    const isced = ref([]);
    const response = ref([]);

    async function addIsced(){
        const name = isc_name.value;
        const code = isc_code.value;

        const requestData = { isc_code: code, isc_name: name };
        await request("POST", response, config.apiURL+'api/isced', requestData);
        if (response.value.status == 201) {
            isc_name.value = '';
            isc_code.value = '';
        }
        fetchAll();
    }

    async function deleteIsced(id){
        await request('DELETE', response, config.apiURL+'api/isced/deletebyid/'+id);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', isced, config.apiURL+'api/isced');
    }

    onMounted(fetchAll);

</script>