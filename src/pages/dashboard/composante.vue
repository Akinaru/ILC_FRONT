<template>
    <div>
        <p class="text-lg font-bold">Composantes</p>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col">
                <p class="text-lg font-bold">Ajout composante</p>
                <form @submit.prevent="addComponent" class="w-fit *:my-2">
                    <input type="text" placeholder="Nom" v-model="newComp.name" class="input input-bordered w-full " />
                    <input type="text" placeholder="Nom raccourci" v-model="newComp.shortname" class="input input-bordered w-full" />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Ajouter la composante</button>

                    </div>
                </form>
            </div>
        </div>
        <div>
            <p class="text-lg font-bold">Liste composantes</p>
            <div v-if="composantes && composantes.length > 0">
                <div v-for="(compo, index) in composantes" :key="index" class="my-1 mx-10 flex">
                    <p class="bg-base-300 p-5 w-full">{{ compo.comp_name }} ({{ compo.comp_shortname }})</p>
                    <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeComponent(compo.comp_id)">
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

    const composantes = ref([]);
    const response = ref([]);

    const newComp = ref({ name: '', shortname: '' });

    async function addComponent(){
        const requestData = { comp_name: newComp.value.name, comp_shortname: newComp.value.shortname.toUpperCase() };
        await request("POST", response, config.apiUrl+'api/component', requestData);
        if (response.value.status == 201) {
            newComp.value.name = '';
            newComp.value.shortname = '';
        }
        fetchAll();
    }

    async function removeComponent(id){
        await request('DELETE', response, config.apiUrl+'api/component/deletebyid/'+id);
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', composantes, config.apiUrl+'api/component');
    }

    onMounted(fetchAll);

</script>