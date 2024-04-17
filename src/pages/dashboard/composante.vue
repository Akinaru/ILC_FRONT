<template>
    <div>
        <p>Composantes</p>
        <div class="m-5">
            <p class="text-lg font-bold">Ajout composante</p>
            <input type="text" placeholder="Nom" id="comp_name">
            <input type="text" placeholder="Nom raccourci" id="comp_shortname">
            <input class="bg-slate-200 p-5 m-1" type="submit" value="Ajouter la composante" @click="addComponent">
        </div>
        <div>
            <p>Liste composantes:</p>
            <ul>
                <li class="list-disc mx-10" v-for="(compo, index) in composantes" :key="index">
                    {{ compo.comp_name }} ({{ compo.comp_shortname }})
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

    const composantes = ref([]);
    const response = ref([]);

    async function addComponent(){
        const name = comp_name.value;
        const shortname = comp_shortname.value.toUpperCase();

        const requestData = { comp_name: name, comp_shortname: shortname };
        await request("POST", response, config.apiUrl+'component', requestData);
        if (response.value.status == 201) {
            comp_name.value = '';
            comp_shortname.value = '';
        }
        fetchAll();
    }

    async function fetchAll(){
        await request('GET', composantes, config.apiUrl+'component');
    }

    onMounted(fetchAll);

</script>