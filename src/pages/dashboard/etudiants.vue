<template>
    <div>
        <div class="text-sm breadcrumbs font-bold">
            <ul>
                <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
                <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
            </ul>
        </div>
        <div v-if="isLoaded" class="flex">
            <!-- Filtres -->
            <div class="bg-base-200 min-w-72 drop-shadow-lg" v-if="account.access.acs_accounttype == 1">
                <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Filtres</p>
                
                <!-- Départements -->
                <div>
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                        <p>Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.departments">
                        <div v-for="(comp, index) in components.components" :key="index">
                            <p>{{ comp.comp_name }}</p>
                            <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1">
                                <input :id="'filt_dept_'+index" type="checkbox" class="checkbox mx-2" :value="dept.dept_shortname" v-model="selectedDepartment">
                                <label :for="'filt_dept_'+index" class="select-none w-full">{{ dept.dept_shortname }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Voeux -->
                <div>
                    <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('voeux')">
                        <p>Voeux ({{ selectedVoeux.length }} séléctionné{{ selectedVoeux.length > 1 ? 's' : '' }})</p>
                        <span :class="isOpen.voeux ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                    </div>
                    <div class="p-1" v-show="isOpen.voeux">
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_voeux_1" type="checkbox" class="checkbox mx-2" value="Aucun" v-model="selectedVoeux">
                            <label for="filt_voeux_1" class="select-none w-full">0</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_voeux_2" type="checkbox" class="checkbox mx-2" value="Mid" v-model="selectedVoeux">
                            <label for="filt_voeux_2" class="select-none w-full">&lt; 6 &gt; 0</label>
                        </div>
                        <div class="flex items-center hover:opacity-60 my-1">
                            <input id="filt_voeux_3" type="checkbox" class="checkbox mx-2" value="Tous" v-model="selectedVoeux">
                            <label for="filt_voeux_3" class="select-none w-full">6</label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Liste des étudiants -->
            <div v-if="account && account.acc_id && etudiants && etudiants.accounts" class="w-full px-10">
                <p class="text-lg font-semibold">Liste des étudiants 
                    <span v-if="account.access.acs_accounttype == 2">dans le département 
                        <span :style="{color: account.department.dept_color}">{{ account.department.dept_shortname }}</span>
                    </span>:
                    {{ filteredEtudiants.length }} résultat{{ filteredEtudiants.length > 1 ? 's' : '' }}
                </p>
                <!-- Barre de recherche -->
                <div class="py-2">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Recherche par nom" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                        </svg>
                    </label>
                </div>
                <div class="flex flex-wrap gap-4 items-center justify-center py-5">
                    <div v-for="(etu, index) in filteredEtudiants" :key="index" v-if="filteredEtudiants && filteredEtudiants.length > 0" class="">
                        <template class="w-full md:w-1/3 lg:w-1/4 py-2" v-if="etu.acc_id">
                            <RouterLink :to="{ name: 'Profile', params: { acc_id: etu.acc_id }}">
                                <div class="bg-base-300 shadow-lg rounded-lg p-4 hover:scale-105 transform transition-transform duration-200 h-full flex flex-col"
                                    :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">
                                    <div class="flex-1">
                                        <h5 class="text-xl font-bold mb-2 truncate min-w-72">{{ etu.acc_fullname }}</h5>
                                        <h6 class="text-gray-600 mb-2 truncate">
                                            {{ etu.acc_id }} 
                                            <span v-if="etu.department" :style="{color: etu.department.dept_color}">({{ etu.department.dept_shortname }})</span>
                                            <span v-else>(Aucun département)</span>
                                        </h6>
                                    </div>
                                    <div class="mt-4">
                                        <p class="text-sm text-gray-700">
                                            <strong>Nombre de vœux:</strong> {{ etu.wishes ? etu.wishes.count : 0 }}<br>
                                            <strong>Dernière connexion:</strong> {{ etu.acc_lastlogin }}
                                        </p>
                                    </div>
                                </div>
                            </RouterLink>
                        </template>
                    </div>
                    <div v-else>
                        <p>Aucun résultat</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <LoadingComp></LoadingComp>
        </div>    
    </div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { ref, onMounted, computed } from 'vue';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import LoadingComp from '../../components/utils/LoadingComp.vue';

const accountStore = useAccountStore();
const etudiants = ref([]);
const account = ref([]);
const components = ref([]);
const isLoaded = ref(false);
const searchQuery = ref('');

const selectedDepartment = ref([]);
const selectedVoeux = ref([]);
const isOpen = ref({
    voeux: true,
    departments: true,
});
function toggleCollapse(section) {
    isOpen.value[section] = !isOpen.value[section];
}

const filteredEtudiants = computed(() => {
    return etudiants.value.accounts
        .filter(etu => {
            const matchesDepartments = selectedDepartment.value.length === 0 || (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname));
            
            const hasAccess = etu.access === null;

            const matchesVoeux = selectedVoeux.value.length === 0 || 
                (selectedVoeux.value.includes('Aucun') && etu.wishes.count === 0) ||
                (selectedVoeux.value.includes('Mid') && etu.wishes.count > 0 && etu.wishes.count < 6) ||
                (selectedVoeux.value.includes('Tous') && etu.wishes.count === 6);

            // Filtrer par nom d'étudiant s'il y a une recherche en cours
            const matchesSearchQuery = !searchQuery.value || etu.acc_fullname.toLowerCase().includes(searchQuery.value.toLowerCase());

            return matchesDepartments && hasAccess && matchesVoeux && matchesSearchQuery;
        })
        .sort((a, b) => {
            // Trier les étudiants par leur nom complet
            return a.acc_fullname.localeCompare(b.acc_fullname);
        });
});


async function fetch() {
    await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
    if (account.value.access != null && account.value.access.acs_accounttype == 1) {
        await request('GET', false, etudiants, config.apiUrl + 'api/account');
    } else if (account.value.access != null && account.value.department != null) {
        await request('GET', false, etudiants, config.apiUrl + 'api/account/getbydept/' + account.value.department.dept_id);
    }
    await request('GET', false, components, config.apiUrl + 'api/component');
    isLoaded.value = true;
}

onMounted(fetch);
</script>
