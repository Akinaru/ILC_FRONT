<template>
    <div v-if="isLoaded" class="overflow-x-auto min-h-screen">
        <div class="flex w-full justify-between">
            <p class="font-bold text-xl">Historique</p>
            <label for="delete" class="btn btn-error">Supprimer l'historique</label>
        </div>
        <div class="py-4">
  <p class="mb-4">
    Filtres: <span>{{ filteredActions.length }} résultat{{ filteredActions.length > 1 ? 's' : '' }} 
    avec {{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) }} 
    filtre{{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) > 1 ? 's' : '' }}</span>
  </p>
  
  <div class="space-y-4">
    <!-- Ligne 1: Types à cocher -->
    <div class="flex flex-wrap gap-2">
      <label 
        v-for="(type, index) in types" 
        :key="index" 
        :for="'filt_type_'+index" 
        class="flex items-center justify-center cursor-pointer mb-1"
      >
        <input 
          type="checkbox" 
          :id="'filt_type_'+index" 
          class="checkbox mr-1" 
          :value="type.condition" 
          v-model="selectedTypes"
        >
        <span class="badge select-none min-w-[120px]" :class="type.color">
          {{ type.name }}
        </span>
      </label>
    </div>
    
    <!-- Ligne 2: Barre de recherche et pagination côte à côte -->
    <div class="flex flex-col md:flex-row w-full gap-4 items-center">
      <div class="w-full md:w-3/4">
        <label class="input input-bordered flex items-center gap-2 w-full">
          <input type="text" class="grow" placeholder="Recherche par login" v-model="searchQuery">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
          </svg>
        </label>
      </div>
      
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span>Éléments par page:</span>
        <select v-model="perPage" class="select select-bordered" @change="changePerPage">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Ligne 3 (supprimée et fusionnée avec la ligne 2) -->
  </div>

  <!-- modal -->
  <input type="checkbox" id="delete" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirmation requise</h3>
      <p class="py-4">Confirmez vous la suppression de l'historique ?</p>
      <div class="modal-action">
        <label for="delete" class="btn">Annuler</label>
        <label for="delete" @click="deleteHistory()" class="btn btn-success">Valider</label>
      </div>
    </div>
  </div>
</div>



        <table class="table table-zebra" v-if="paginatedActions.length > 0">
            <thead>
                <tr class="select-none">
                    <th>n°</th>
                    <th>Login</th>
                    <th>Description</th>
                    <th @click="sortByDateAsc = !sortByDateAsc" class="cursor-pointer hover:opacity-70">
                        <div class="flex items-center justify-between cursor-pointer">
                            Date
                            <span class="ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" :style="{ transform: sortByDateAsc ? 'rotate(0deg)' : 'rotate(180deg)' }">
                                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v15.69l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 011.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" v-if="sortByDateAsc"></path>
                                    <path fill-rule="evenodd" d="M12 20.25a.75.75 0 01-.75-.75V3.81l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 01-1.06 1.06L12.75 3.81v15.69a.75.75 0 01-.75.75z" clip-rule="evenodd" v-else></path>
                                </svg>
                            </span>
                        </div>
                    </th>
                    <th class="flex items-center justify-center">Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(act, actIndex) in paginatedActions" :key="actIndex">
                    <th>{{ act.act_id }}</th>
                    <td class="min-w-64">{{ getFullName(act.acc_id) }}</td>
                    <td class="w-full">{{ act.act_description }}</td>
                    <td class="min-w-56 flex items-center justify-center">{{ formatDate(act.act_date) }}</td>
                    <td>
                        <span class="flex items-center justify-center min-w-36">
                            <template v-if="getType(act.act_type)">
                                <span class="min-w-32" :class="['badge', getType(act.act_type).color]">{{ getType(act.act_type).name }}</span>
                            </template>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex justify-center gap-2 my-4">
            <button 
                class="btn" 
                :disabled="currentPage === 1"
                @click="currentPage--"
            >
                Précédent
            </button>
            
            <template v-for="page in pagesToShow" :key="page">
                <template v-if="page === '...'">
                    <span class="flex items-center px-4">...</span>
                </template>
                <button 
                    v-else
                    class="btn"
                    :class="{ 'btn-active': page === currentPage }"
                    @click="currentPage = page"
                >
                    {{ page }}
                </button>
            </template>
            
            <button 
                class="btn" 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
            >
                Suivant
            </button>
        </div>

        <div v-if="filteredActions.length === 0" class="flex items-center justify-center p-44">
            <p>Aucune action n'a été trouvée.</p>
        </div>
    </div>

    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import LoadingComp from '../../components/utils/LoadingComp.vue';
import { onMounted, ref, computed } from 'vue';
import { addAction, getType } from '../../composables/actionType';
import { types } from '../../composables/actionType';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import { watch } from 'vue';

const accountStore = useAccountStore();
const actions = ref([]);
const accounts = ref([]);
const selectedTypes = ref([]);
const searchQuery = ref('');
const isLoaded = ref(false);
const response = ref([]);
const sortByDateAsc = ref(false);
const actionsResponse = ref([]);

// Pagination
const currentPage = ref(1);
const perPage = ref(25);
const totalItems = ref(0);
const lastPage = ref(1);

async function fetchActions(){
    try{
        await request('GET', false, actionsResponse, `${config.apiUrl}api/action/paginate/${perPage.value}?page=${currentPage.value}`);
        if (actionsResponse.value && actionsResponse.value.data) {
            actions.value = actionsResponse.value.data;
            totalItems.value = actionsResponse.value.pagination.total;
            lastPage.value = actionsResponse.value.pagination.last_page;
            currentPage.value = actionsResponse.value.pagination.current_page;
            console.log(actions.value)
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    } 
}

async function fetch() {
    isLoaded.value = false;
    try {
        await request('GET', false, actionsResponse, `${config.apiUrl}api/action/paginate/${perPage.value}?page=${currentPage.value}`);
        if (actionsResponse.value && actionsResponse.value.data) {
            actions.value = actionsResponse.value.data;
            totalItems.value = actionsResponse.value.pagination.total;
            lastPage.value = actionsResponse.value.pagination.last_page;
            currentPage.value = actionsResponse.value.pagination.current_page;
            console.log(actions.value)
        }
        
        const accountsResponse = await request('GET', false, accounts, config.apiUrl + 'api/account');
        if (accountsResponse) {
            accounts.value = accountsResponse;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    } finally {
        isLoaded.value = true;
    }
}

watch(currentPage, () => {
    fetchActions();
});

const pagesToShow = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    let pages = [];

    // Always show first page
    pages.push(1);

    if (total <= 7) {
        // If total pages is 7 or less, show all pages
        for (let i = 2; i < total; i++) {
            pages.push(i);
        }
        if (total > 1) pages.push(total);
    } else {
        if (current <= 4) {
            // Near the start
            pages.push(2, 3, 4, 5, 6);
            pages.push('...');
            pages.push(total);
        } else if (current >= total - 3) {
            // Near the end
            pages.push('...');
            pages.push(total - 4, total - 3, total - 2, total - 1, total);
        } else {
            // In the middle
            pages.push('...');
            pages.push(current - 2, current - 1, current, current + 1, current + 2);
            pages.push('...');
            pages.push(total);
        }
    }

    return pages;
});


function changePerPage() {
    currentPage.value = 1;
    fetch();
}

function getFullName(acc_id) {
    const account = accounts.value.accounts.find(acc => acc.acc_id === acc_id);
    return account ? account.acc_fullname : null;
}

const filteredActions = computed(() => {
    if (!actions.value || !Array.isArray(actions.value)) {
        return [];
    }

    let filtered = [...actions.value];

    if (selectedTypes.value.length > 0) {
        filtered = filtered.filter(action => {
            return selectedTypes.value.some(selectedType => {
                return action.act_type === selectedType;
            });
        });
    }

    if (searchQuery.value.trim() !== '') {
        const searchTerm = searchQuery.value.trim().toLowerCase();
        filtered = filtered.filter(action => {
            return (action.acc_id?.toLowerCase().includes(searchTerm)) || 
                (getFullName(action.acc_id)?.toLowerCase().includes(searchTerm));
        });
    }

    filtered.sort((a, b) => {
        const dateA = new Date(a.act_date);
        const dateB = new Date(b.act_date);
        return sortByDateAsc.value ? dateA - dateB : dateB - dateA;
    });

    return filtered;
});

const totalPages = computed(() => {
    return lastPage.value;
});

// Les actions sont déjà paginées par le serveur
const paginatedActions = computed(() => {
    return filteredActions.value;
});

async function deleteHistory(){
    await request('DELETE', true, response, config.apiUrl+'api/action');
    if(response.value.status == 202){
        addAction(accountStore.login, 'admin', response, 'Suppression de l\'historique des actions.');
    }
    fetch();
}

function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}h${minutes}`;
}

onMounted(fetch);
</script>