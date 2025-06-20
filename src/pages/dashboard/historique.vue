<template>
    <div v-if="isLoaded" class="overflow-x-auto min-h-screen">
      <div class="flex w-full justify-between">
        <p class="font-bold text-xl">Historique</p>
        <label for="delete" class="btn btn-error">Supprimer l'historique</label>
      </div>
  
      <div class="py-4">
        <p class="mb-4">
          Filtres :
          <span>
            {{ totalItems }} résultat{{ totalItems > 1 ? 's' : '' }} avec
            {{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) }}
            filtre{{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) > 1 ? 's' : '' }}
          </span>
        </p>
  
        <!-- Filtres -->
        <div class="space-y-4">
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
  
          <div class="flex flex-col md:flex-row w-full gap-4 items-center">
            <div class="w-full md:w-3/4">
              <label class="input input-bordered flex items-center gap-2 w-full">
                <input type="text" class="grow" placeholder="Recherche par login ou nom" v-model="searchQuery">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                  <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                </svg>
              </label>
            </div>
            <div class="flex items-center gap-2 whitespace-nowrap">
              <span>Éléments par page :</span>
              <select v-model="perPage" class="select select-bordered" @change="changePerPage">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Modal -->
        <Teleport to="body">
        <input type="checkbox" id="delete" class="modal-toggle" />
        <div class="modal" role="dialog">
          <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
            <h3 class="text-xl font-bold">Confirmation requise</h3>
            <p class="text-sm text-base-content/70 mt-2">Cette action supprimera définitivement l’historique.</p>
            <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

            <p>Confirmez-vous la suppression de l'historique ?</p>

            <div class="modal-action mt-6">
              <label for="delete" class="btn btn-ghost">Annuler</label>
              <label for="delete" @click="deleteHistory()" class="btn btn-error">Supprimer</label>
            </div>
          </div>
        </div>
      </Teleport>

      </div>
  
      <!-- Table -->
      <table class="table table-zebra" v-if="actions.length > 0">
        <thead>
          <tr class="select-none">
            <th>n°</th>
            <th>Utilisateur</th>
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
            <th class="text-center">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(act, index) in sortedActions" :key="index">
            <th>{{ act.act_id }}</th>
            <td class="min-w-64">{{ act.acc_fullname }}</td>
            <td class="w-full">{{ act.act_description }}</td>
            <td class="min-w-56 text-center">{{ formatDate(act.act_date) }}</td>
            <td class="text-center">
              <template v-if="getType(act.act_type)">
                <span class="badge" :class="getType(act.act_type).color">
                  {{ getType(act.act_type).name }}
                </span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Pagination -->
      <div class="flex justify-center gap-2 my-4">
        <button class="btn" :disabled="currentPage === 1" @click="currentPage--">Précédent</button>
        <template v-for="page in pagesToShow" :key="page">
          <template v-if="page === '...'">
            <span class="flex items-center px-4 select-none">...</span>
          </template>
          <button v-else class="btn" :class="{ 'btn-active': page === currentPage }" @click="currentPage = page">
            {{ page }}
          </button>
        </template>
        <button class="btn" :disabled="currentPage === totalPages" @click="currentPage++">Suivant</button>
      </div>
  
      <div v-if="actions.length === 0" class="flex items-center justify-center p-44">
        <p>Aucune action n'a été trouvée.</p>
      </div>
    </div>
  
    <div v-else>
      <LoadingComp />
    </div>
  </template>
  
  <script setup>
  import { request } from '../../composables/httpRequest';
  import LoadingComp from '../../components/utils/LoadingComp.vue';
  import { onMounted, ref, computed, watch } from 'vue';
  import { addAction, getType, types } from '../../composables/actionType';
  import config from '../../config';
  import { useAccountStore } from '../../stores/accountStore';
  
  const accountStore = useAccountStore();
  const actions = ref([]);
  const selectedTypes = ref([]);
  const searchQuery = ref('');
  const isLoaded = ref(false);
  const response = ref([]);
  const sortByDateAsc = ref(false);
  
  // Pagination
  const currentPage = ref(1);
  const perPage = ref(25);
  const totalItems = ref(0);
  const lastPage = ref(1);
  
  async function fetchActions() {
  try {
    const params = new URLSearchParams();
    params.append('page', currentPage.value);
    params.append('per_page', perPage.value);

    if (searchQuery.value.trim()) params.append('search', searchQuery.value.trim());
    selectedTypes.value.forEach(type => params.append('types[]', type));

    await request('GET', false, response, `${config.apiUrl}api/action/paginate?${params.toString()}`);

    if (response.value?.data) {
      actions.value = response.value.data;
      totalItems.value = response.value.pagination.total;
      lastPage.value = response.value.pagination.last_page;
      currentPage.value = response.value.pagination.current_page;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  } finally {
    isLoaded.value = true; // ✅ Ici maintenant
  }
}
  
  watch([searchQuery, selectedTypes], () => {
    currentPage.value = 1;
    fetchActions();
  });
  
  watch(currentPage, () => fetchActions());
  
  function changePerPage() {
    currentPage.value = 1;
    fetchActions();
  }
  
  const pagesToShow = computed(() => {
    const total = lastPage.value;
    const current = currentPage.value;
    const pages = [];
  
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current <= 4) {
        pages.push(2, 3, 4, 5);
        pages.push('...', total);
      } else if (current >= total - 3) {
        pages.push('...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push('...', current - 1, current, current + 1, '...', total);
      }
    }
  
    return pages;
  });
  
  const totalPages = computed(() => lastPage.value);
  
  const sortedActions = computed(() => {
    return [...actions.value].sort((a, b) => {
      const dA = new Date(a.act_date);
      const dB = new Date(b.act_date);
      return sortByDateAsc.value ? dA - dB : dB - dA;
    });
  });
  
  async function deleteHistory() {
    await request('DELETE', true, response, `${config.apiUrl}api/action`);
    if (response.value.status === 202) {
      addAction(accountStore.account.acc_id, 'admin', response, 'Suppression de l\'historique des actions.');
    }
    fetchActions();
  }
  
  function formatDate(date) {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} à ${d.getHours().toString().padStart(2, '0')}h${d.getMinutes().toString().padStart(2, '0')}`;
  }
  
  onMounted(fetchActions);
  </script>