<template>
    <div>
        <p class="text-xl font-bold">Isced</p>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col">
                <p class="text-lg font-bold">Ajout isced</p>
                <form @submit.prevent="addIsced" class="w-2/5 *:my-2">
                    <input type="number" placeholder="Code" v-model="newIsced.code" class="input input-bordered w-full" />
                    <input type="text" placeholder="Nom" v-model="newIsced.name" class="input input-bordered w-full " />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Ajouter l'isced</button>

                    </div>
                </form>
            </div>
        </div>
        <div>
            <p class="text-lg font-bold">Liste isced</p>

            <div v-if="isced && isced.length > 0">
                <div  v-for="(isc, index) in isced" :key="index" class="my-1 mx-10 flex">
                    <p class="bg-base-300 p-5 w-full">({{ isc.isc_code }}) {{ isc.isc_name }}</p>
                    <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="deleteIsced(isc.isc_id)">
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

    const isced = ref([]);
    const response = ref([]);

    const newIsced = ref({ code: 0, name: '' });

    async function addIsced(){

        const requestData = { isc_code: newIsced.value.code.toString(), isc_name: newIsced.value.name };
        await request("POST", response, config.apiUrl+'api/isced', requestData);
        if (response.value.status == 201) {
            newIsced.value.code = 0;
            newIsced.value.name = '';
        }
        fetchAll();
    }

    async function deleteIsced(id){
        await request('DELETE', response, config.apiUrl+'api/isced/deletebyid/'+id);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', isced, config.apiUrl+'api/isced');
    }

    onMounted(fetchAll);

</script>