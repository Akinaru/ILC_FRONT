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
            <div class="bg-base-100 rounded-lg shadow-lg w-full overflow-hidden border border-base-300 max-w-80 min-w-72 h-fit min-h-screen">
  <!-- En-tête -->
  <div class="bg-base-300 p-4">
    <h3 class="font-bold text-lg select-none">Filtres</h3>
    <div class="flex justify-between items-center mt-2">
      <button 
        class="btn btn-sm btn-ghost text-xs" 
        @click="deselectAll"
      >
        <span class="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <span class="select-none">Tout désélectionner</span>
      </button>
    </div>
  </div>

  <!-- Section Départements (seulement visible pour les comptes de type 1) -->
  <div class="border-b border-base-300" v-if="account.access.acs_accounttype == 1">
    <div
      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
      @click="toggleCollapse('departments')"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
        <span class="font-medium select-none">Départements</span>
        <span v-if="selectedDepartment.length" class="badge badge-sm select-none">{{ selectedDepartment.length }}</span>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5 transition-transform duration-200"
        :class="isOpen.departments ? 'rotate-180' : ''"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.departments">
      <button
        class="btn btn-xs btn-ghost mb-3"
        @click="deselectAllDept"
      >
        <span class="select-none">Tout désélectionner</span>
      </button>

      <div class="mb-3">
        <label
          for="filt_dept_zero"
          class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
        >
          <input
            id="filt_dept_zero"
            type="checkbox"
            class="checkbox checkbox-sm mr-2"
            value="Aucun"
            v-model="selectedDepartment"
          />
          <div
            class="w-4 h-4 rounded-full mr-2"
            style="background-color: #aaaaaa"
          ></div>
          <span class="text-sm select-none">Aucun</span>
        </label>
      </div>

      <div v-for="(comp, index) in components.components" :key="index" class="mb-4">
        <p class="font-medium text-sm mb-2 select-none">{{ comp.comp_name }}</p>
        <div class="grid grid-cols-1 gap-2 pl-2">
          <div
            v-for="(dept, deptIndex) in comp.departments"
            :key="deptIndex"
          >
            <label
              :for="'filt_dept_' + deptIndex"
              class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
            >
              <input
                :id="'filt_dept_' + deptIndex"
                type="checkbox"
                class="checkbox checkbox-sm mr-2"
                :value="dept.dept_shortname"
                v-model="selectedDepartment"
              />
              <div
                class="w-4 h-4 rounded-full mr-2"
                :style="{ backgroundColor: dept.dept_color }"
              ></div>
              <span class="text-sm select-none">{{ dept.dept_shortname }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Section Voeux -->
  <div class="border-b border-base-300">
    <div
      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
      @click="toggleCollapse('voeux')"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <span class="font-medium select-none">Voeux</span>
        <span v-if="selectedVoeux.length" class="badge badge-sm select-none">{{ selectedVoeux.length }}</span>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5 transition-transform duration-200"
        :class="isOpen.voeux ? 'rotate-180' : ''"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.voeux">
      <button
        class="btn btn-xs btn-ghost mb-3"
        @click="deselectAllVoeux"
      >
        <span class="select-none">Tout désélectionner</span>
      </button>

      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center">
          <label
            for="filt_voeux_1"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_voeux_1"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="Aucun"
              v-model="selectedVoeux"
            />
            <span class="text-sm select-none">Aucun</span>
          </label>
        </div>
        <div class="flex items-center">
          <label
            for="filt_voeux_2"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_voeux_2"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="AuMoinsUn"
              v-model="selectedVoeux"
            />
            <span class="text-sm select-none">Au moins un</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Section Documents -->
  <div class="border-b border-base-300">
    <div
      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
      @click="toggleCollapse('document')"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span class="font-medium select-none">Documents</span>
        <span v-if="selectedDocument.length" class="badge badge-sm select-none">{{ selectedDocument.length }}</span>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5 transition-transform duration-200"
        :class="isOpen.document ? 'rotate-180' : ''"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.document">
      <button
        class="btn btn-xs btn-ghost mb-3"
        @click="deselectAllDocuments"
      >
        <span class="select-none">Tout désélectionner</span>
      </button>

      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center">
          <label
            for="filt_document_4"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_document_4"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="ChoixCoursValide"
              v-model="selectedDocument"
            />
            <span class="text-sm select-none">Choix cours validés</span>
          </label>
        </div>
        <div class="flex items-center">
          <label
            for="filt_document_0"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_document_0"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="0"
              v-model="selectedDocument"
            />
            <span class="text-sm select-none">0</span>
          </label>
        </div>
        <div class="flex items-center">
          <label
            for="filt_document_1"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_document_1"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="1"
              v-model="selectedDocument"
            />
            <span class="text-sm select-none">1</span>
          </label>
        </div>
        <div class="flex items-center">
          <label
            for="filt_document_2"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_document_2"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="2"
              v-model="selectedDocument"
            />
            <span class="text-sm select-none">2</span>
          </label>
        </div>
        <div class="flex items-center">
          <label
            for="filt_document_3"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_document_3"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="3"
              v-model="selectedDocument"
            />
            <span class="text-sm select-none">3</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Section Année de mobilité -->
  <div class="border-b border-base-300">
    <div
      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
      @click="toggleCollapse('anneemobilite')"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span class="font-medium select-none">Année de mobilité</span>
        <span v-if="selectedAnneeMobilite.length" class="badge badge-sm select-none">{{ selectedAnneeMobilite.length }}</span>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5 transition-transform duration-200"
        :class="isOpen.anneemobilite ? 'rotate-180' : ''"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.anneemobilite">
      <button
        class="btn btn-xs btn-ghost mb-3"
        @click="deselectAllAnneeMobilite"
      >
        <span class="select-none">Tout désélectionner</span>
      </button>

      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="(annee, index) in anneesmobilite"
          :key="index"
          class="flex items-center"
        >
          <label
            :for="'filt_annee_' + index"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              :id="'filt_annee_' + index"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              :value="annee"
              v-model="selectedAnneeMobilite"
            />
            <span class="text-sm select-none">{{ annee }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>

  <!-- Section Destination -->
  <div>
    <div
      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
      @click="toggleCollapse('destination')"
    >
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
        <span class="font-medium select-none">Destination</span>
        <span v-if="selectedDestination.length" class="badge badge-sm select-none">{{ selectedDestination.length }}</span>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        class="w-5 h-5 transition-transform duration-200"
        :class="isOpen.destination ? 'rotate-180' : ''"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>

    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.destination">
      <button
        class="btn btn-xs btn-ghost mb-3"
        @click="deselectAllDestination"
      >
        <span class="select-none">Tout désélectionner</span>
      </button>

      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center">
          <label
            for="filt_dest_none"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              id="filt_dest_none"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              value="null"
              v-model="selectedDestination"
            />
            <span class="text-sm select-none">Aucune destination</span>
          </label>
        </div>

        <div
          v-for="(dest, index) in destinations"
          :key="index"
          class="flex items-center"
        >
          <label
            :for="'filt_dest_' + index"
            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
          >
            <input
              :id="'filt_dest_' + index"
              type="checkbox"
              class="checkbox checkbox-sm mr-2"
              :value="dest.agree_id"
              v-model="selectedDestination"
            />
            <span class="relative inline-block mr-2">
              <!-- Drapeau -->
              <span class="fi" :class="'fi-' + (dest.partnercountry?.parco_code)"></span>

              <!-- Point d'interrogation si pas de drapeau -->
              <span v-if="!dest.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xs font-bold bg-white select-none">
                ?
              </span>
            </span>
            <span class="text-sm select-none">{{ dest.university?.univ_name || 'Université indisponible' }} à {{ dest.university?.univ_city || 'Ville indisponible' }} - {{ dest.isced?.isc_code || 'Code ISCED ?' }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>
            <!-- Liste des étudiants -->
            <div v-if="account && account.acc_id && etudiants && etudiants.accounts" class="w-full px-2">
                <!-- Infos -->
                <div class="w-full flex items-center justify-between flex-col md:flex-row">
                    <p class="text-lg font-semibold">Liste des étudiants 
                        <span v-if="account.access.acs_accounttype == 2">dans le département 
                            <span :style="{color: account.department.dept_color}">{{ account.department.dept_shortname }}</span>
                        </span>:
                        {{ filteredEtudiants.length }} résultat{{ filteredEtudiants.length > 1 ? 's' : '' }}
                    </p>
                    <div class="flex items-center justify-center">
                        <!--  Bulle information -->
                        <div class="dropdown dropdown-end mx-2">
                            <div tabindex="0" role="button" class="btn btn-circle btn-ghost btn-xs text-info">
                                <svg
                                    tabindex="0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    class="h-4 w-4 stroke-current text-current">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div
                                tabindex="0"
                                class="card compact dropdown-content bg-base-100 rounded-box z-[1] w-64 shadow">
                                <div tabindex="0" class="card-body">
                                <h2 class="card-title">⚠️ Information</h2>
                                <p>Les étudiants exportés correspondent aux résultats des filtres.</p>
                                </div>
                            </div>
                        </div>
                        <ExportComp texte="Exporter tous les étudiants en csv" :link="exportUrl"></ExportComp>
                    </div>

                </div>
                <!-- Barre de recherche -->
                <div class="py-2">
                    <label class="input input-bordered flex items-center gap-2">
                        <input type="text" class="grow" placeholder="Recherche par nom et prénom" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                        </svg>
                    </label>
                </div>
                <!-- Liste des etudiants -->
                <div class="flex flex-wrap gap-1 items-center justify-center py-5">
                    <div v-for="(etu, index) in filteredEtudiants" :key="index" v-if="filteredEtudiants && filteredEtudiants.length > 0" class="">
                        <template class="w-full md:w-1/3 lg:w-1/4 py-2" v-if="etu.acc_id">
                                <div class="bg-base-300 shadow-lg rounded-lg p-4 transform transition-transform duration-200 h-full flex flex-col"
                                    :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">
                                    <!-- Bouton de suppression -->
                                    <button class="hover:opacity-70 p-3 hover:cursor-pointer absolute top-0 right-0 hover:scale-120 scale-100 transition-all duration-100 ease-in-out" @click="openConfirmModal(etu)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                    <div class="flex-1">
                                        <h5 class="text-lg font-bold mb-2 truncate min-w-72">{{ etu.acc_fullname }}</h5>
                                        <h6 class="text-gray-600 mb-2 truncate">
                                            {{ etu.acc_id }} 
                                            <span v-if="etu.department" :style="{color: etu.department.dept_color}">({{ etu.department.dept_shortname }})</span>
                                            <span v-else>(Aucun département)</span>
                                        </h6>
                                    </div>
                                    <div class="mt-4">
                                        <p class="text-sm text-gray-400">
                                            <strong>Nombre de vœux:</strong> {{ etu.wishes ? etu.wishes.count : 0 }}<br>
                                            <strong>Documents ajouté(s):</strong> {{ etu.documents?.count || 0 }}/{{ etu.documents?.countmax }}<br>
                                            <strong>Année de mobilité:</strong> {{ etu.acc_anneemobilite ? etu.acc_anneemobilite : 'Inconnu' }}<br>
                                            <strong>Dernière connexion:</strong> {{ formatDate(etu.acc_lastlogin) }}<br>
                                            <strong>Aménagement aux éxams:</strong> {{ etu.acc_amenagement == true ? 'Oui' : 'Non' }}<br>
                                            <strong>Validation choix de cours:</strong> {{ etu.acc_validechoixcours ? '✅' : '❌' }}
                                        </p>
                                    </div>

                                    
                                    <div class="p-2 mt-1  rounded w-72" :class="etu.arbitrage ? 'bg-base-200' : 'bg-base-300 opacity-60'">
                                        <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: etu.arbitrage.agree_id}}" v-if="etu.arbitrage" class="text-sm select-none hover:opacity-60">
                                            <div class="flex items-center">
                                                <span class="relative inline-block mr-2">
                                                    <!-- Drapeau -->
                                                    <span class="fi" :class="'fi-' + (etu.arbitrage.partnercountry?.parco_code)"></span>

                                                    <!-- Point d'interrogation si pas de drapeau -->
                                                    <span v-if="!etu.arbitrage.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                        ?
                                                    </span>
                                                </span>

                                                <div class="flex flex-col flex-1 overflow-hidden">
                                                    <span class="font-medium truncate">{{ etu.arbitrage.university?.univ_name || 'Université indisponible' }}</span>
                                                    <span class="text-gray-500 truncate">
                                                        {{ etu.arbitrage.university?.univ_city || 'Ville indisponible' }} - 
                                                        {{ etu.arbitrage.partnercountry?.parco_name || 'Pays indisponible' }}
                                                        <span class="text-xs">({{ etu.arbitrage.isced?.isc_code || 'Code ISCED ?' }})</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </RouterLink>
                                        <div v-else class="text-sm text-gray-400 italic flex items-center justify-center w-full min-h-12">
                                            Pas de destination
                                        </div>
                                    </div>
                                <RouterLink :to="{ name: 'Profile', params: { acc_id: etu.acc_id }}" class="mt-3">
                                    <button class="btn w-full">Voir le profil</button>
                                </RouterLink>

                                </div>
                        </template>
                    </div>

                    <div v-else>
                        <p>Aucun résultat</p>
                    </div>
                </div>
                <!-- Modal de confirmation suppression -->
                <dialog id="confirmModal" ref="confirmModal" class="modal">
                    <div class="modal-box">
                        <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                        <div class="py-3">
                            <p>Confirmez vous la supression de l'étudiant:</p>
                            <p>Cela entraînera la suppression de ses vœux et de son emplacement dans l'arbitrage.</p>
                            <div class="w-full py-2">
                                
                                    <div class="bg-base-300 shadow-lg rounded-lg p-4 h-full flex flex-col"
                                        :style="{ borderBottom: `4px solid ${confirmDeleteEtu.department ? confirmDeleteEtu.department.dept_color : '#aaaaaa'}` }">
                                        <div class="flex-1">
                                            <h5 class="text-xl font-bold mb-2 truncate min-w-72">{{ confirmDeleteEtu.acc_fullname }}</h5>
                                            <h6 class="text-gray-600 mb-2 truncate">
                                                {{ confirmDeleteEtu.acc_id }} 
                                                <span v-if="confirmDeleteEtu.department" :style="{color: confirmDeleteEtu.department.dept_color}">({{ confirmDeleteEtu.department.dept_shortname }})</span>
                                                <span v-else>(Aucun département)</span>
                                            </h6>
                                        </div>
                                        <div class="mt-4">
                                            <p class="text-sm text-gray-400">
                                                <strong>Nombre de vœux:</strong> {{ confirmDeleteEtu.wishes ? confirmDeleteEtu.wishes.count : 0 }}<br>
                                                <strong>Documents ajouté(s):</strong> {{ confirmDeleteEtu.documents?.count || 0 }}/{{ confirmDeleteEtu.documents?.countmax }}<br>
                                                <strong>Dernière connexion:</strong> {{ formatDate(confirmDeleteEtu.acc_lastlogin) }}
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    <div class="modal-action">
                        <button class="btn" @click="closeModal">Annuler</button>
                        <button class="btn btn-success" @click="deleteEtu(confirmDeleteEtu.acc_id, confirmDeleteEtu.acc_fullname, confirmDeleteEtu.department?.dept_shortname || 'Aucun département')">Confirmer</button>
                    </div>
                    </div>
                </dialog>
            </div>
        </div>
        <div v-else>
            <LoadingComp></LoadingComp>
        </div>    
    </div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { ref, onMounted, computed, watch } from 'vue';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import LoadingComp from '../../components/utils/LoadingComp.vue';
import ExportComp from '../../components/impexp/ExportComp.vue';
import { addAction } from '../../composables/actionType';

const accountStore = useAccountStore();
const etudiants = ref([]);
const account = ref([]);
const components = ref([]);
const isLoaded = ref(false);
const searchQuery = ref('');
const confirmDeleteEtu = ref([])
const response = ref([])
const anneesmobilite = ref([])
const destinations = ref([]);

const selectedDepartment = ref([]);
const selectedVoeux = ref([]);
const selectedDocument = ref([]);
const selectedAnneeMobilite = ref([]);
const selectedDestination = ref([]);
const isOpen = ref({
    voeux: true,
    departments: true,
    document: true,
    anneemobilite: true,
    destination: true,
});

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    const filteredEtudiants = computed(() => {
    return etudiants.value.accounts
        .filter(etu => {
            const matchesDepartments = selectedDepartment.value.length === 0 || 
                (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname)) ||
                (selectedDepartment.value.includes('Aucun') && !etu.department);
            
            const hasAccess = etu.access === null;

            const matchesVoeux = selectedVoeux.value.length === 0 || 
                (selectedVoeux.value.includes('Aucun') && etu.wishes.count === 0) ||
                (selectedVoeux.value.includes('AuMoinsUn') && etu.wishes.count > 0);

            const matchesSearchQuery = !searchQuery.value || 
                [etu.acc_fullname, etu.acc_id.toString()].some(field => 
                field.toLowerCase().includes(searchQuery.value.toLowerCase())
            );

            const matchesAnneeMobilite = selectedAnneeMobilite.value.length === 0 || 
                selectedAnneeMobilite.value.includes(etu.acc_anneemobilite);

            const documentCount = etu.documents.count || 0;
            const matchesDocuments = selectedDocument.value.length === 0 || 
                selectedDocument.value.includes(documentCount.toString()) ||
                (selectedDocument.value.includes('ChoixCoursValide') && etu.acc_validechoixcours == true);

            const matchesDestination = selectedDestination.value.length === 0 || 
                (selectedDestination.value.includes('null') && !etu.arbitrage) ||
                (etu.arbitrage?.agree_id && selectedDestination.value.includes(etu.arbitrage.agree_id));

            return matchesDepartments && hasAccess && matchesVoeux && 
                   matchesSearchQuery && matchesDocuments && 
                   matchesAnneeMobilite && matchesDestination;
        })
        .sort((a, b) => {
            return a.acc_fullname.localeCompare(b.acc_fullname);
        });
});

// Fonction pour extraire les destinations uniques des arbitrages
function extractDestinations() {
    if (!etudiants.value.accounts) return;
    
    const destinationsMap = new Map();
    
    etudiants.value.accounts.forEach(account => {
        if (account.arbitrage?.agree_id) {
            destinationsMap.set(account.arbitrage.agree_id, account.arbitrage);
        }
    });
    
    destinations.value = Array.from(destinationsMap.values()).sort((a, b) => {
        // Compare les noms de pays d'abord
        const countryCompare = a.partnercountry?.parco_name?.localeCompare(b.partnercountry?.parco_name) || 0;
        
        // Si les pays sont identiques, compare les noms d'universités
        if (countryCompare === 0) {
            return a.university?.univ_name?.localeCompare(b.university?.univ_name) || 0;
        }
        
        return countryCompare;
    });
}

    async function fetch() {
        await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
        if (account.value.access != null && account.value.access.acs_accounttype == 1) {
            await request('GET', false, etudiants, config.apiUrl + 'api/account');
        } else if (account.value.access != null && account.value.department != null) {
            await request('GET', false, etudiants, config.apiUrl + 'api/account/getbydept/' + account.value.department.dept_id);
        }
        await request('GET', false, components, config.apiUrl + 'api/component');

        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 4; i++) {
            const startYear = currentYear + i;
            const endYear = startYear + 1;
            anneesmobilite.value.push(`${startYear}-${endYear}`);
        }

        extractDestinations();
        isLoaded.value = true;
    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(etu) {
        
        confirmDeleteEtu.value = etu;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
    }

    // Supprimer un étudiant
    async function deleteEtu(acc_id, acc_fullname, dept_shortname){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/account/deletebyid/'+acc_id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'admin', response, 'Suppression de l\'étudiant '+acc_fullname+' (' + dept_shortname + ').');
        }
        fetch();
    }

    function formatDate(date) {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} à ${hours}h${minutes}`;
    }

const exportUrl = computed(() => {
    const ids = filteredEtudiants.value.map(etu => etu.acc_id);
    const queryString = new URLSearchParams({ ids: JSON.stringify(ids) }).toString();
    return `${config.apiUrl}api/account/export?${queryString}`;
});

    // Fonction pour charger les filtres depuis sessionStorage pour la page d'accueil
    function loadFilters() {
        const savedDepartments = sessionStorage.getItem('etu_dashboard.selectedDepartment');
        const savedDocument = sessionStorage.getItem('etu_dashboard.selectedDocument');
        const savedVoeux = sessionStorage.getItem('etu_dashboard.selectedVoeux');
        const savedAnneeMobilite = sessionStorage.getItem('etu_dashboard.selectedAnneeMobilite');
        const savedDestination = sessionStorage.getItem('etu_dashboard.selectedDestination');



        if (savedDepartments) {
            selectedDepartment.value = JSON.parse(savedDepartments);

        }
        if (savedVoeux) {
            selectedVoeux.value = JSON.parse(savedVoeux);

        }
        if (savedDocument) {
            selectedDocument.value = JSON.parse(savedDocument);

        }
        if (savedAnneeMobilite) {
            selectedAnneeMobilite.value = JSON.parse(savedAnneeMobilite);

        }

        if(savedDestination){
            selectedDestination.value = JSON.parse(savedDestination);
        }

    }

    function saveFilters() {
        sessionStorage.setItem('etu_dashboard.selectedDepartment', JSON.stringify(selectedDepartment.value));
        sessionStorage.setItem('etu_dashboard.selectedVoeux', JSON.stringify(selectedVoeux.value));
        sessionStorage.setItem('etu_dashboard.selectedDocument', JSON.stringify(selectedDocument.value));
        sessionStorage.setItem('etu_dashboard.selectedAnneeMobilite', JSON.stringify(selectedAnneeMobilite.value));
        sessionStorage.setItem('etu_dashboard.selectedDestination', JSON.stringify(selectedDestination.value));
    }

    watch(selectedDepartment, saveFilters);
    watch(selectedVoeux, saveFilters);
    watch(selectedAnneeMobilite, saveFilters);
    watch(selectedDocument, saveFilters);
    watch(selectedDestination, saveFilters);

onMounted(() => {
    fetch();
    loadFilters();
});

    function deselectAll() {
        selectedDepartment.value = [];
        selectedVoeux.value = [];
        selectedDocument.value = [];
        selectedAnneeMobilite.value = [];
        selectedDestination.value = [];
    }
    function deselectAllDept() {
        selectedDepartment.value = [];
    }
    function deselectAllVoeux() {
        selectedVoeux.value = [];
    }
    function deselectAllDocuments() {
        selectedDocument.value = [];
    }
    function deselectAllAnneeMobilite() {
        selectedAnneeMobilite.value = [];
    }
    function deselectAllDestination() {
        selectedDestination.value = [];
    }
</script>
