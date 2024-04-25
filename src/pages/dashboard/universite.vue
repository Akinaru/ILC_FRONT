<template>
    <div>
        <p class="text-xl font-bold">Universités</p>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col">
                <p class="text-lg font-bold">Ajout université</p>
                <form @submit.prevent="addUniversite" class="w-2/5 *:my-2">
                    <select class="select select-bordered w-full" v-model="newUniv.partnercountry">
                        <option disabled selected>Selectionnez un pays</option>
                        <option v-for="(parco, index) in partnercountrys" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                        <option value="addNew">Ajouter un nouveau pays</option>
                    </select>
                    <input v-if="newUniv.partnercountry === 'addNew'" type="text" placeholder="Nouveau pays" v-model="newUniv.newcountry" class="input input-bordered w-full " />
                    <input type="text" placeholder="Nom" v-model="newUniv.name" class="input input-bordered w-full " />
                    <input type="text" placeholder="Ville" v-model="newUniv.city" class="input input-bordered w-full" />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Ajouter l'université</button>
                    </div>
                </form>
            </div>
        </div>
        <div>
            <p class="text-lg font-bold">Liste universités</p>
            <div v-if="universites && universites.length > 0">
                <div v-for="(univ, index) in universites" :key="index" class="my-1 mx-10 flex">
                    <p class="bg-base-300 p-5 w-full">{{ univ.univ_name }} à {{ univ.univ_city }} ({{ univ.partnercountry.parco_name }})</p>
                    <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeUniversite(univ.univ_id)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
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

    const universites = ref([]);
    const partnercountrys = ref([]);
    const response = ref([]);

    const newUniv = ref({ name: '', city: '', partnercountry: 1, newcountry: '' });

    async function addUniversite(){
        const requestData = { univ_name: newUniv.value.name, univ_city: newUniv.value.city, parco_id: newUniv.value.partnercountry };
        await request("POST", response, config.apiUrl+'api/university', requestData);
        if (response.value.status == 201) {
            newUniv.value.name = '';
            newUniv.value.city = '';
        }
        fetchAll();
        resetInput();
    }

    async function removeUniversite(id){
        await request('DELETE', response, config.apiUrl+'api/university/deletebyid/'+id);
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', universites, config.apiUrl+'api/university');
        await request('GET', partnercountrys, config.apiUrl+'api/partnercountry');
        resetInput();
    }

    function resetInput(){
        newUniv.value.name = '';
        newUniv.value.city = '';
        newUniv.value.partnercountry = document.querySelector('.select').options[0].value;
    }

    onMounted(fetchAll);

</script>