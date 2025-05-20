<template>
    <div>
      <div v-if="isLoaded">
        <div class="m-5 my-20">
          <p class="text-lg font-bold text-center mb-10">Témoignages des utilisateurs</p>
  
  
            <!-- Sélecteur d'année avec design DaisyUI -->
            <div class="flex justify-center items-center mb-8">
            <div class="join">
                <button @click="decrementYear" class="join-item btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                <div class="join-item btn px-6 pointer-events-none">
                {{ selectedYear }}-{{ selectedYear + 1 }}
                </div>
                <button @click="incrementYear" class="join-item btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </div>
            </div>

          <!-- Liste des témoignages -->
          <div class="columns-1 md:columns-2 gap-6 space-y-6">
            <div
              v-for="(account, index) in filteredAccounts"
              :key="index"
              class="bg-base-300 p-5 rounded-lg shadow-lg break-inside-avoid"
            >
              <div class="flex items-center gap-3 mb-4">
                <!-- Avatar avec couleur du rôle -->
                <div class="w-12 h-12 rounded-full flex items-center justify-center"
                     :style="{ backgroundColor: account.role?.color || '#666666' }">
                  <span class="text-lg text-white font-bold">
                    {{ getInitials(account.acc_fullname) }}
                  </span>
                </div>
                <!-- Nom et rôle -->
                <div class="flex-1">
                    <RouterLink
                    target="_blank"
                    :to="{ name: 'Profile', params: { acc_id: account.acc_id } }"
                    class="font-bold transition-colors duration-200  hover:opacity-75 opacity-100"
                    >
                    {{ account.acc_fullname }}
                    </RouterLink>

                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-sm" :style="{ color: account.role?.color || '#666666' }">
                      {{ account.role?.role || 'Rôle non défini' }}
                    </span>
                    <span v-if="account.acc_anneemobilite" class="text-sm opacity-70">{{ account.acc_anneemobilite }}</span>
                  </div>
                </div>
                <!-- Bouton suppression -->
                <button class="btn btn-square btn-ghost"
                  @click="supprimerTemoignage(account.acc_id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                      stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
  
              <!-- Accord / destination -->
              <div class="p-2 mt-1 rounded w-full" :class="account.arbitrage ? 'bg-base-200' : 'bg-base-300 opacity-60'">
                <RouterLink
                  target="_blank"
                  :to="{ name: 'Accord', params: { agree_id: account.arbitrage.agree_id } }"
                  v-if="account.arbitrage"
                  class="text-sm select-none hover:opacity-60"
                >
                  <div class="flex items-center">
                    <!-- Drapeau -->
                    <span class="relative inline-block mr-2">
                      <span class="fi" :class="'fi-' + (account.arbitrage.partnercountry?.parco_code)"></span>
                      <span v-if="!account.arbitrage.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">?</span>
                    </span>
  
                    <!-- Infos -->
                    <div class="flex flex-col flex-1 overflow-hidden">
                      <span class="font-medium truncate">
                        {{ account.arbitrage.university?.univ_name || 'Université indisponible' }}
                      </span>
                      <span class="text-gray-500 truncate">
                        {{ account.arbitrage.university?.univ_city || 'Ville indisponible' }} -
                        {{ account.arbitrage.partnercountry?.parco_name || 'Pays indisponible' }}
                        <span class="text-xs">
                          ({{ account.arbitrage.isced?.isc_code || 'Code ISCED ?' }})
                        </span>
                      </span>
                    </div>
                  </div>
                </RouterLink>
                <div v-else class="text-sm text-gray-400 italic flex items-center justify-center w-full min-h-12">
                  Pas de destination
                </div>
              </div>
  
              <!-- Témoignage -->
              <div class="mt-6 break-words whitespace-pre-line text-sm leading-relaxed">
                {{ account.acc_temoignage }}
              </div>
            </div>
          </div>
  
          <!-- Message si aucun témoignage -->
          <div v-if="filteredAccounts.length === 0" class="text-center mt-10">
            <p class="text-lg opacity-70">Aucun témoignage n'a encore été publié.</p>
          </div>
        </div>
      </div>
      <LoadingComp v-else />
    </div>
  </template>
  

<script setup>
import { ref, onMounted, computed } from 'vue';
import config from '../../config';
import { request } from '../../composables/httpRequest';
import LoadingComp from '../../components/utils/LoadingComp.vue';

const isLoaded = ref(false);
const accounts = ref([]);
const response = ref([]);

  // Année académique actuelle (par défaut)
  const currentYear = new Date().getFullYear();
  const selectedYear = ref(currentYear);
  
  // Fonction pour diminuer l'année
  const decrementYear = () => {
    selectedYear.value--;
  };
  
  // Fonction pour augmenter l'année
  const incrementYear = () => {
    selectedYear.value++;
  };

// Filtre uniquement les comptes avec des témoignages
const filteredAccounts = computed(() => {
  const selectedAcademicYear = `${selectedYear.value}-${selectedYear.value + 1}`;
  const currentAcademicYear = `${currentYear}-${currentYear + 1}`;

  return accounts.value.accounts
    ?.filter(account => {
      const hasTemoignage = account.acc_temoignage && account.acc_temoignage.trim() !== '';
      const isMatchingYear = account.acc_anneemobilite === selectedAcademicYear;
      const isNoYearButCurrent = !account.acc_anneemobilite && selectedAcademicYear === currentAcademicYear;
      return hasTemoignage && (isMatchingYear || isNoYearButCurrent);
    })
    .sort((a, b) => {
      const nameA = a.acc_fullname || '';
      const nameB = b.acc_fullname || '';
      return nameA.localeCompare(nameB);
    }) || [];
});


async function supprimerTemoignage(acc_id) {

      const requestData = {
        acc_id: acc_id,
      };
      await request(
        "DELETE",
        true,
        response,
        config.apiUrl + "api/account/temoignage",
        requestData
      );
      fetchAccounts();
    }


// Fonction pour obtenir les initiales à partir du nom complet
function getInitials(fullName) {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
}

async function fetchAccounts() {
    isLoaded.value = false;
    await request('GET', false, accounts, config.apiUrl + 'api/account');
    isLoaded.value = true;
}

onMounted(fetchAccounts);
</script>