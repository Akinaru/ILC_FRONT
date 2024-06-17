<template>
    <div v-if="isLoaded">
        <p class="font-bold text-xl text-center">Arbitrage</p>
        <div class="flex">
            <!-- Gauche -->
            <div class="w-1/2 min-h-screen">
                <p class="text-center py-5">Liste des étudiants</p>

                <!-- Partie filtre étudiants -->
                <div class="flex items-center justify-center py-5">
                    <div class="bg-base-200 drop-shadow-lg w-96" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                        <p>{{ filteredEtudiants.length }} résultats ({{ selectedDepartment.length }} filtre{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                        <!-- Départements -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                                <p>Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.departments">
                                <div v-for="(comp, index) in components.components" :key="index">
                                    <div class="lg:block flex flex-wrap">
                                        <p>{{ comp.comp_name }}</p>
                                        <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 ">
                                            <input :id="'filt_dept_'+index" type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartment">
                                            <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                            <label :for="'filt_dept_'+index" class="select-none w-full">{{ dept.dept_shortname }}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="flex flex-col items-center justify-start w-full">
                   <div class="bg-base-300 w-96 h-24 mb-2 flex items-center justify-center cursor-move select-none hover:opacity-80 flex-col" 
                   v-for="(etu, index) in filteredEtudiants" :key="index"
                   :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">   
                        <p>{{ etu.acc_fullname }}</p> 
                        <p v-if="etu.department" :style="{backgroundColor: etu.department.dept_color}" class="p-2">{{ etu.department.dept_shortname }}</p>
                        <p v-else class="bg-gray-500 p-2">Aucun</p>
                   </div>
               </div>
            </div>
            <!-- Droite -->
            <div class="w-1/2 min-h-screen">
                <p class="text-center py-5">Liste des accords</p>

                <!-- Partie filtre accords-->
                <div class="flex items-center justify-center py-5 w-120">
                    <div class="bg-base-200 drop-shadow-lg w-120" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                        <p>{{ filteredAccords.length }} résultats ({{  selectedCountries.length  }} filtre{{ selectedCountries.length  > 1 ? 's' : '' }})</p>
                        <!-- Pays -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                                <p>Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.pays">
                                <div class="flex flex-wrap items-center justify-center">

                                    <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 w-1/2">
                                        <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2 checkbox-sm" :value="country.parco_name" v-model="selectedCountries">
                                        <div class="flex  w-full">
                                            <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                            <label :for="'filt_pays_'+index" class="select-none w-full text-sm">{{ country.parco_name }}</label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-start w-120">
                    <div class="bg-base-300 w-120 h-32 mb-1" v-for="(accord, index) in filteredAccords" :key="index">
                        <span class="mr-2 flex items-center justify-center">
                            <span class="fi md:text-5xl text-3xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code"></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { ref, onMounted, computed } from 'vue'
    import { request } from '../../composables/httpRequest'
    import config from '../../config'

    const accords = ref([])
    const etudiants = ref([])
    const components = ref([])
    const partnercountry = ref([])
    const isLoaded = ref(false)

    const selectedDepartment = ref([]);
    const selectedCountries = ref([]);

    const isOpen = ref({
        pays: false,
        departments: false,
    });

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        await request('GET', false, etudiants, config.apiUrl+'api/account/students');
        isLoaded.value = true;
    }

    const filteredEtudiants = computed(() => {
        return etudiants.value.accounts.filter(etu => {
            const matchesDepartments = selectedDepartment.value.length === 0 || (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname));

            return matchesDepartments;
        });
    });

    const filteredAccords = computed(() => {
        return accords.value.agreements.filter(accord => {
            const matchesCountries = selectedCountries.value.length === 0 || selectedCountries.value.includes(accord.partnercountry.parco_name);
            
            return matchesCountries;
        });
    });

    onMounted(fetch)

</script>