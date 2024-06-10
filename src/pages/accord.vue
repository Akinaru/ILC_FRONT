<template>
    <div class="" v-if="isLoaded">
        <div v-if="accord && accord.agree_id" class="">
            <p class="flex justify-center font-bold py-10 text-xl">Accord n°{{ accord.agree_id }}</p>
            <div class="flex items-center flex-col text-xl md:text-2xl">
                <!-- Drapeau -->
                <div class="bg-base-300 w-fit flex justify-start items-center flex-col p-10 rounded-xl">
                    <span class="fi text-10xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code "></span>
                </div>
                <!-- Informations -->
                <div class="flex items-center flex-col py-10">
                    <p><span class="font-bold ">{{ accord.university.univ_name }}</span> à {{ accord.university.univ_city }} en ({{ accord.partnercountry.parco_name }})</p>

                    <!-- Departement -->
                    <p class="pt-5">Les départements disponibles pour cet accord:</p>
                    <div class="flex items-center flex-wrap">
                        <div v-if="accord.departments.length > 0" class="flex flex-col md:flex-row items-center transition-all duration-100 ease-in-out">
                            <div v-for="(dept, index) in accord.departments" :key="index">
                                <p v-if="dept.pivot.deptagree_valide" class="transition-all duration-100 ease-in-out md:p-3 min-w-11 p-1 ml-0 m-1 font-bold drop-shadow-lg select-none text-lg" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                            </div>
                        </div>
                        <div v-else>
                            <p class="p-3 m-1">Aucun département</p>
                        </div>
                    </div>

                    <p class="pt-5">{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}</p>
                </div>

                <!-- Autres accords -->
                <p class="flex items-start w-full py-2">Autres accords qui pourraient vous plaire:</p>
                <div class="bg-base-300 w-full h-64 overflow-x-auto whitespace-nowrap flex items-center text-sm">
                    <!-- Afficher les autres accords ici -->
                    <RouterLink :to="{name: 'Accord', params: {agree_id: item.agree_id}}" v-for="(item, index) in accords.agreements" :key="index" class="relative group hover:opacity-60 hover:cursor-pointer bg-base-100 rounded-lg p-4 m-2 min-w-80 w-80 h-52 drop-shadow-lg flex flex-col justify-between">
                        <span class="fi text-5xl transition-all duration-100 ease-in-out" :class="'fi-'+item.partnercountry.parco_code "></span>
                        <div>
                            <p class="font-bold break-words whitespace-normal text-xl">{{ item.university.univ_name }}</p>
                            <p>{{ item.university.univ_city }} ({{ item.partnercountry.parco_name }})</p>
                        </div>
                        <span class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-opacity-75">Voir plus</span>
                    </RouterLink>
                </div>

            </div>
        </div>
        <div v-else>
            <p class="flex font-bold items-center justify-center py-64">Accord introuvable...</p>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import LoadingComp from '../components/utils/LoadingComp.vue';
 
    const route = useRoute();
    const accord = ref([]);
    const isLoaded = ref(false);
    const accords = ref([])

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, accord, config.apiUrl+'api/agreement/getbyid/'+route.params.agree_id);
        await request('GET', false, accords, config.apiUrl+'api/agreement/random');
        isLoaded.value = true;
    }

    onMounted(fetchAll)

    watch(() => route.params.agree_id, () => {
        fetchAll();
    });
    
</script>
