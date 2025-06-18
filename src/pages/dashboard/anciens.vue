<template>
  <div>
    <div v-if="isLoaded" class="relative">
      <!-- Breadcrumbs -->
      <div class="text-sm breadcrumbs font-medium mb-6">
        <ul>
          <li><RouterLink :to="{ name: 'Dashboard' }" class="hover:text-primary">Dashboard</RouterLink></li>
          <li class="text-primary">Anciens Étudiants</li>
        </ul>
      </div>

      <!-- Sélecteur d'année -->
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

      <!-- Message si aucune destination -->
      <div v-if="filteredDestinations.length === 0" class="alert shadow-md mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Aucun compte archivé trouvé pour l'année de mobilité {{ selectedYear }}-{{ selectedYear + 1 }}.</span>
      </div>

      <!-- Liste des destinations -->
      <div v-else class="grid grid-cols-1 gap-8">
        <div v-for="destination in filteredDestinations" :key="destination.agree_id" class="card bg-base-100 shadow-md">
          <div class="card-body">
            <!-- En-tête -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 class="card-title text-xl font-bold flex items-center gap-3">
                <span class="relative inline-block tooltip" :data-tip="destination.partnercountry?.parco_name || 'Pays indisponible'">
                  <span class="fi text-3xl" :class="destination.partnercountry?.parco_code ? 'fi-' + destination.partnercountry.parco_code : ''"></span>
                  <span v-if="!destination.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full select-none">?</span>
                </span>
                {{ destination.university?.univ_name || 'Université indisponible' }}
              </h2>

              <div class="flex flex-wrap gap-2">
                <div class="badge badge-outline" v-if="destination.isced?.isc_name">
                  {{ destination.isced.isc_name }}
                </div>
                <div class="badge badge-neutral">
                  {{ destination.agree_typeaccord || 'Type non spécifié' }}
                </div>
                <div class="badge badge-info" v-if="destination.agree_nbplace">
                  {{ destination.agree_nbplace }} place{{ destination.agree_nbplace > 1 ? 's' : '' }}
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Infos supplémentaires -->
            <div class="mb-4">
              <div class="flex flex-wrap gap-4">
                <div v-if="destination.university?.univ_city">
                  <span class="font-medium">Ville:</span> {{ destination.university.univ_city }}
                </div>
                <div v-if="destination.partnercountry?.parco_name">
                  <span class="font-medium">Pays:</span> {{ destination.partnercountry.parco_name }}
                </div>
                <div v-if="destination.isced?.isc_code">
                  <span class="font-medium">Code ISCED:</span> {{ destination.isced.isc_code }}
                </div>
              </div>
            </div>

            <!-- Étudiants -->
            <div class="bg-base-200 rounded-box p-4">
              <h3 class="font-medium mb-4">
                Étudiants affectés ({{ destination.students?.length || 0 }})
              </h3>
              <div v-if="destination.students?.length" class="overflow-x-auto">
                <table class="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Département</th>
                      <th>Année de mobilité</th>
                      <th v-if="canShowTemoignage">Témoignage</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in destination.students" :key="student.acc_id">
                      <td>{{ student.acc_fullname || 'Nom indisponible' }}</td>
                      <td>
                        <template v-if="student.department">
                          <span class="badge" :style="{ backgroundColor: student.department.dept_color, color: 'white' }">
                            {{ student.department.dept_shortname }}
                          </span>
                        </template>
                        <template v-else-if="student.acc_json_department">
                          <span class="badge" :style="{ backgroundColor: JSON.parse(student.acc_json_department).dept_color, color: 'white' }">
                            {{ JSON.parse(student.acc_json_department).dept_shortname }}
                          </span>
                        </template>
                        <template v-else>
                          <span class="badge badge-ghost">N/A</span>
                        </template>
                      </td>
                      <td>{{ student.acc_anneemobilite || 'Non spécifiée' }}</td>
                      <td v-if="canShowTemoignage">
                        <div v-if="student.acc_temoignage" class="tooltip" :data-tip="student.acc_temoignage">
                          <span class="badge badge-accent badge-outline cursor-help">Voir</span>
                        </div>
                        <span v-else class="text-opacity-50 text-sm">Aucun</span>
                      </td>
                      <td class="flex gap-2">
                        <RouterLink target="_blank" :to="{ name: 'Profile', params: { acc_id: student.acc_id } }" class="btn btn-circle btn-xs btn-ghost tooltip flex justify-center items-center" data-tip="Afficher le profil">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </RouterLink>
                        <button @click="desarchiverEtudiant(student.acc_id)" class="btn btn-circle btn-xs btn-ghost tooltip text-success" data-tip="Désarchiver l'étudiant">
                          <svg fill="#000000" class="h-4 w-4" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                            <path d="M960 0v112.941c467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059-467.125 0-847.059-379.934-847.059-847.059 0-267.106 126.607-515.915 338.824-675.727v393.374h112.94V112.941H0v112.941h342.89C127.058 407.38 0 674.711 0 960c0 529.355 430.645 960 960 960s960-430.645 960-960S1489.355 0 960 0" fill-rule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Aucun étudiant associé à cette destination.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <LoadingComp />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { request } from "../../composables/httpRequest";
import config from "../../config";
import LoadingComp from "../../components/utils/LoadingComp.vue";
import { useAccountStore } from "../../stores/accountStore";
import { addAction } from "../../composables/actionType";


const accountStore = useAccountStore();
const accounts = ref([]);
const isLoaded = ref(false);
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

// Récupération sécurisée du département depuis JSON si nécessaire
const getDept = (student) => {
  return student.department || (student.acc_json_department ? JSON.parse(student.acc_json_department) : null);
};

// Récupération sécurisée de l'accord depuis JSON si nécessaire
const getAgreement = (student) => {
  return student.acc_json_agreement ? JSON.parse(student.acc_json_agreement) : null;
};

// Computed property pour filtrer les destinations par année académique
const filteredDestinations = computed(() => {
  if (!groupedAccounts.value.length) return [];

  return groupedAccounts.value.map(destination => {
    const filteredStudents = destination.students.filter(student => {
      return student.acc_anneemobilite === `${selectedYear.value}-${selectedYear.value + 1}`;
    });

    if (filteredStudents.length > 0) {
      return {
        ...destination,
        students: filteredStudents
      };
    }
    return null;
  }).filter(Boolean);
});

// Computed property pour regrouper les comptes par destination JSON
const groupedAccounts = computed(() => {
  if (!accounts.value || !accounts.value.accounts) return [];

  const arbitragedAccounts = accounts.value.accounts.filter(account => 
    account.acc_ancienetu === true || account.acc_ancienetu === 1
  );

  const destinationMap = new Map();

  arbitragedAccounts.forEach(account => {
    const destination = getAgreement(account);
    if (!destination) return;

    const destId = destination.agree_id;

    if (!destinationMap.has(destId)) {
      destinationMap.set(destId, {
        ...destination,
        students: []
      });
    }

    destinationMap.get(destId).students.push({
      ...account,
      department: getDept(account),
      destination: destination
    });
  });

  return Array.from(destinationMap.values())
    .sort((a, b) => a.university.univ_name.localeCompare(b.university.univ_name));
});

async function fetchAccounts() {
  isLoaded.value = false;
  try {
    await request("GET", false, accounts, config.apiUrl + "api/account");
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes:", error);
  } finally {
    isLoaded.value = true;
  }
}

async function desarchiverEtudiant(acc_id) {
  const requestData = { acc_id };
  await request("POST", true, response, config.apiUrl + "api/arbitrage/desarchiver", requestData);
  if (response.value.status === 200) fetchAccounts();
  addAction(accountStore.account.acc_id, 'arbitrage', response, 'Désarchivage de l\'étudiant '+ acc_id +'.');
}

onMounted(() => {
  fetchAccounts();
});
</script>