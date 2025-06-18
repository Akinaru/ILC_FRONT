<template>
    <div>
        <div class="text-sm breadcrumbs font-bold">
            <ul>
                <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
                <li class="text-primary">Étudiants</li>
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
              <div class="border-b border-base-300" v-if="account.access.access.acs_accounttype == 1">
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

                    <div class="flex items-center">
                      <label
                        :for="'filt_annee_automne'"
                        class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                      >
                        <input
                          :id="'filt_annee_automne'"
                          type="checkbox"
                          class="checkbox checkbox-sm mr-2"
                          :value="1"
                          v-model="selectedPeriodeMobilite"
                        />
                        <span class="text-sm select-none">🍂 Mobilité d'automne</span>
                      </label>
                    </div>

                    <div class="flex items-center">
                      <label
                        :for="'filt_annee_printemps'"
                        class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                      >
                        <input
                          :id="'filt_annee_printemps'"
                          type="checkbox"
                          class="checkbox checkbox-sm mr-2"
                          :value="2"
                          v-model="selectedPeriodeMobilite"
                        />
                        <span class="text-sm select-none">🌱 Mobilité de printemps</span>
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
              <!-- En-tête de la liste des étudiants -->
              <div class="card bg-base-100 shadow p-4 mb-6">
                <!-- Section du titre et des contrôles -->
                <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                  <!-- Titre avec nombre de résultats -->
                  <div class="w-full md:w-auto">
                    <h2 class="text-lg font-bold flex flex-wrap items-center gap-1">
                      <span>Liste des étudiants</span>
                      <span v-if="account.access.access.acs_accounttype == 2" class="flex items-center">
                        <span class="px-1">dans le département</span>
                        <span class="badge badge-md" :style="{backgroundColor: account.department.dept_color, color: '#ffffff'}">
                          {{ account.department.dept_shortname }}
                        </span>
                      </span>
                      <span class="ml-1">:</span>
                    </h2>
                    <div class="badge badge-neutral mt-1">
                      {{ filteredEtudiants.length }} résultat{{ filteredEtudiants.length > 1 ? 's' : '' }}
                    </div>
                  </div>
                  
                  <!-- Contrôles: Infos et Export -->
                  <div class="flex items-center space-x-3">
                    <!-- Bulle d'information -->
                    <div class="dropdown dropdown-end">
                      <label tabindex="0" class="btn btn-circle btn-sm  btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-5 w-5 stroke-current">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </label>
                      <div tabindex="0" class="dropdown-content z-[10] card compact shadow bg-base-100 rounded-box w-72">
                        <div class="card-body">
                          <h3 class="card-title text-primary flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Information
                          </h3>
                          <p>Les étudiants exportés correspondent aux résultats des filtres.</p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Bouton d'export -->
                    <ExportComp 
                      texte="Exporter tous les étudiants en csv" 
                      :link="exportUrl" 
                      class="btn btn-sm btn-outline btn-primary">
                    </ExportComp>
                  </div>
                </div>
                
              <!-- Barre de recherche avec bouton texte à droite -->
              <form @submit.prevent="fetchFilteredStudents" class="form-control w-full flex flex-row">
                <label class="input input-bordered flex items-center gap-2 w-full">
                  <input 
                    type="text" 
                    class="grow focus:outline-none" 
                    placeholder="Recherche par nom et prénom..." 
                    v-model="searchQuery"
                    @keyup.enter.prevent="fetchFilteredStudents"
                  />
                </label>
                <button type="submit" class="btn btn-primary ml-2 px-4">
                    Rechercher
                </button>
              </form>


              </div>
                <!-- Liste des etudiants -->
                <div v-if="filteredEtudiants && filteredEtudiants.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div v-for="(etu, index) in filteredEtudiants" :key="index" class="w-full">
                    <template v-if="etu.acc_id">
                      <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative h-full"
                        :style="{ borderLeft: `6px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">
                        
                        <!-- Bouton de suppression - maintenant en dehors du RouterLink -->
                        <button class="absolute top-2 right-2 btn btn-circle btn-sm btn-ghost hover:bg-error hover:text-white transition-colors z-10" 
                              @click="openConfirmModal(etu)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                          </svg>
                        </button>

                        <!-- Le reste du contenu enveloppé dans le RouterLink -->
                        <RouterLink :to="{ name: 'Profile', params: { acc_id: etu.acc_id }}" class="block h-full">
                          <div class="card-body p-4 flex flex-col h-full cursor-pointer hover:bg-base-300 bg-base-200">
                            <!-- En-tête avec nom et ID -->
                            <div class="mb-3">
                              <h2 class="card-title text-lg font-bold truncate">{{ etu.acc_fullname }}</h2>
                              <div class="flex items-center gap-1 flex-wrap">
                                <span class="badge badge-neutral text-sm">{{ etu.acc_id }}</span>
                                <span v-if="etu.department" class="badge" :style="{backgroundColor: etu.department.dept_color, color: '#fff'}">
                                  {{ etu.department.dept_shortname }}
                                </span>
                                <span v-else class="badge badge-ghost">Aucun département</span>
                              </div>
                            </div>
                            
                            <!-- Informations en liste -->
                            <div class="space-y-1 text-sm mb-3">
                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Profil complété: {{ etu.acc_validateacc ? '✅' : '❌' }}</span>
                              </div>

                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Choix des cours validé: {{ etu.acc_validechoixcours ? '✅' : '❌' }}</span>
                              </div>

                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Arbitré: {{ etu.acc_arbitragefait ? '✅' : '❌' }}</span>
                              </div>

                                     
                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>Aménagement aux exams: {{ etu.acc_amenagement ? '✅' : '❌' }}</span>
                              </div>
                              
                     


                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Vœux: {{ etu.wishes ? etu.wishes.count : 0 }}</span>
                              </div>
                              
                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Documents: {{ etu.documents?.count || 0 }}/{{ etu.documents?.countmax }}</span>
                              </div>
                              
                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Année mobilité: {{ etu.acc_anneemobilite || 'Inconnu' }}</span>
                              </div>

                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Début de période: {{
                                    etu.acc_periodemobilite === 1 ? 'Mobilité d\'automne 🍂' : 
                                    etu.acc_periodemobilite === 2 ? 'Mobilité de printemps 🌱' : 
                                    'Aucune' 
                                  }}</span>
                              </div>
                              
                              <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="truncate">Connexion: {{ formatDate(etu.acc_lastlogin) }}</span>
                              </div>
                       
                              
                            </div>
                            
                          <!-- Destination (hauteur fixe) -->
                          <div class="card bg-base-200 h-20 transition-all flex flex-col justify-center overflow-hidden mt-auto">
                            <div v-if="etu.destination || etu.arbitrage" class="flex gap-2 items-center p-3 h-full">
                              <div v-if="(etu.destination || etu.arbitrage).partnercountry?.parco_code" class="relative overflow-hidden rounded">
                                <span class="fi" :class="'fi-' + (etu.destination || etu.arbitrage).partnercountry.parco_code"></span>
                              </div>
                              <div v-else class="relative overflow-hidden rounded">
                                <span class="absolute inset-0 flex items-center justify-center text-black text-xs font-bold bg-white">?</span>
                              </div>

                              <div class="flex-1 min-w-0">
                                <p class="font-medium truncate">
                                  {{ (etu.destination || etu.arbitrage).university?.univ_name || 'Université indisponible' }}
                                </p>
                                <p class="text-xs opacity-70 truncate">
                                  {{ (etu.destination || etu.arbitrage).university?.univ_city || 'Ville indisponible' }} -
                                  {{ (etu.destination || etu.arbitrage).partnercountry?.parco_name || 'Pays indisponible' }}
                                  <span class="badge badge-xs badge-outline ml-1">
                                    {{ (etu.destination || etu.arbitrage).isced?.isc_code || '?' }}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div v-else class="flex items-center justify-center p-3 h-full text-sm italic opacity-70">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                              </svg>
                              Pas de destination
                            </div>
                          </div>
                          </div>
                        </RouterLink>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-else class="w-full flex flex-col items-center justify-center text-center py-10 text-base-content/70">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                  <p class="text-lg font-semibold">Aucun résultat trouvé</p>
                  <p class="text-sm opacity-70">Aucun étudiant ne correspond à vos filtres.</p>
                </div>

                <!-- Modal de confirmation suppression -->
                <Teleport to="body">
                  <dialog id="confirmModal" ref="confirmModal" class="modal">
                    <div class="modal-box rounded-2xl border border-base-300 shadow-xl" v-if="confirmDeleteEtu">
                      <h3 class="text-xl font-bold">Confirmer la suppression</h3>
                      <p class="text-sm text-base-content/70 mt-2">Cette action supprimera les vœux et l’emplacement de l’étudiant dans l’arbitrage.</p>
                      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

                      <p class="mb-4">Confirmez-vous la suppression de l’étudiant suivant :</p>

                      <div class="bg-base-300 shadow-lg rounded-lg p-4 flex flex-col"
                          :style="{ borderBottom: `4px solid ${confirmDeleteEtu.department ? confirmDeleteEtu.department.dept_color : '#aaaaaa'}` }">
                        <div class="flex-1">
                          <h5 class="text-xl font-bold mb-2 truncate min-w-72">{{ confirmDeleteEtu.acc_fullname }}</h5>
                          <h6 class="text-gray-600 mb-2 truncate">
                            {{ confirmDeleteEtu.acc_id }} 
                            <span v-if="confirmDeleteEtu.department" :style="{color: confirmDeleteEtu.department.dept_color}">
                              ({{ confirmDeleteEtu.department.dept_shortname }})
                            </span>
                            <span v-else>(Aucun département)</span>
                          </h6>
                        </div>
                        <div class="mt-4 text-sm text-gray-500">
                          <p><strong>Nombre de vœux :</strong> {{ confirmDeleteEtu.wishes?.count || 0 }}</p>
                          <p><strong>Documents ajouté(s) :</strong> {{ confirmDeleteEtu.documents?.count || 0 }}/{{ confirmDeleteEtu.documents?.countmax }}</p>
                          <p><strong>Dernière connexion :</strong> {{ formatDate(confirmDeleteEtu.acc_lastlogin) }}</p>
                        </div>
                      </div>

                      <div class="modal-action mt-6">
                        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
                        <button class="btn btn-error"
                                @click="deleteEtu(confirmDeleteEtu.acc_id, confirmDeleteEtu.acc_fullname, confirmDeleteEtu.department?.dept_shortname || 'Aucun département')">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </dialog>
                </Teleport>

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
const etudiantsFiltered = ref([]);
const account = ref([]);
const components = ref([]);
const isLoaded = ref(false);
const searchQuery = ref('');
const confirmDeleteEtu = ref([])
const response = ref([])
const anneesmobilite = ref([])
const destinations = ref([]);
const departementFilter = ref("");

const selectedDepartment = ref([]);
const selectedVoeux = ref([]);
const selectedDocument = ref([]);
const selectedAnneeMobilite = ref([]);
const selectedPeriodeMobilite = ref([]);
const selectedDestination = ref([]);
const isOpen = ref({
    voeux: true,
    departments: true,
    document: true,
    anneemobilite: true,
    destination: true,
});

const currentPage = ref(1);
const perPage = ref(20);

  async function fetchFilteredStudents(){
      const params = new URLSearchParams();

    // Si l'utilisateur est chef de département, le filtre est forcé
    if (account.value.access?.access?.acs_accounttype === 2 && account.value.department?.dept_shortname) {
      params.append('departments[]', account.value.department.dept_shortname);
    } else if (selectedDepartment.value.length > 0) {
      selectedDepartment.value.forEach(dep => params.append('departments[]', dep));
    }

    if (selectedVoeux.value.length > 0) {
      params.append('voeux', selectedVoeux.value[0]); // "Aucun" ou "AuMoinsUn"
    }

    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }

    if (selectedAnneeMobilite.value.length > 0) {
      selectedAnneeMobilite.value.forEach(year => params.append('annees[]', year));
    }

    if (selectedPeriodeMobilite.value.length > 0) {
      selectedPeriodeMobilite.value.forEach(periode => params.append('periodes[]', periode));
    }

    if (selectedDocument.value.length > 0) {
      selectedDocument.value.forEach(doc => params.append('documents[]', doc));
    }

    if (selectedDestination.value.length > 0) {
      selectedDestination.value.forEach(dest => params.append('destinations[]', dest));
    }

    params.append('page', currentPage.value.toString());
    params.append('perPage', perPage.value.toString());

    await request('GET', false, etudiants, `${config.apiUrl}api/account/studentsFiltered?${params.toString()}`);
  }

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    const filteredEtudiants = computed(() => {
      // return etudiants.value.accounts
      //   .filter(etu => {
      //       const matchesDepartments = selectedDepartment.value.length === 0 || 
      //           (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname)) ||
      //           (selectedDepartment.value.includes('Aucun') && !etu.department);
            
      //       const hasAccess = etu.access.count === 0;

      //       const matchesVoeux = selectedVoeux.value.length === 0 || 
      //           (selectedVoeux.value.includes('Aucun') && etu.wishes.count === 0) ||
      //           (selectedVoeux.value.includes('AuMoinsUn') && etu.wishes.count > 0);

      //       const matchesSearchQuery = !searchQuery.value || 
      //           [etu.acc_fullname, etu.acc_id.toString()].some(field => 
      //           field.toLowerCase().includes(searchQuery.value.toLowerCase())
      //       );

      //       const matchesAnneeMobilite = selectedAnneeMobilite.value.length === 0 || 
      //           selectedAnneeMobilite.value.includes(etu.acc_anneemobilite);

      //       const documentCount = etu.documents.count || 0;
      //       const matchesDocuments = selectedDocument.value.length === 0 || 
      //           selectedDocument.value.includes(documentCount.toString()) ||
      //           (selectedDocument.value.includes('ChoixCoursValide') && etu.acc_validechoixcours == true);

      //       const matchesDestination = selectedDestination.value.length === 0 || 
      //           (selectedDestination.value.includes('null') && !etu.arbitrage) ||
      //           (etu.arbitrage?.agree_id && selectedDestination.value.includes(etu.arbitrage.agree_id));

      //                 const matchesPeriodeMobilite = selectedPeriodeMobilite.value.length === 0 ||
      //   selectedPeriodeMobilite.value.includes(etu.acc_periodemobilite);

      //       return matchesDepartments && hasAccess && matchesVoeux && 
      //              matchesSearchQuery && matchesDocuments && 
      //              matchesAnneeMobilite && matchesDestination && matchesPeriodeMobilite;
      //   })
      //   .sort((a, b) => {
      //       return a.acc_fullname.localeCompare(b.acc_fullname);
      //   });
      return etudiants.value.accounts;
    });

    // Fonction pour extraire les destinations uniques des arbitrages
function extractDestinations() {
  if (!etudiants.value.accounts) {
    return;
  }

  const destinationsMap = new Map();

  etudiants.value.accounts.forEach((account, index) => {

    const accords = [account.destination, account.arbitrage];

    accords.forEach((accord, i) => {
      if (!accord) {
        return;
      }


      if (accord.agree_id && !destinationsMap.has(accord.agree_id)) {
        destinationsMap.set(accord.agree_id, accord);
      } else if (accord.agree_id) {
      }
    });
  });

  destinations.value = Array.from(destinationsMap.values()).sort((a, b) => {
    const countryCompare = a.partnercountry?.parco_name?.localeCompare(b.partnercountry?.parco_name) || 0;

    if (countryCompare === 0) {
      return a.university?.univ_name?.localeCompare(b.university?.univ_name) || 0;
    }

    return countryCompare;
  });
}

    async function fetch() {
        await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.account.acc_id);
        if (account.value.access != null && account.value.department != null) {
          departementFilter.value = account.value.department.dept_shortname;
        }
        await fetchFilteredStudents();
        // if (account.value.access != null && account.value.access.access.acs_accounttype == 1) {
        //     await request('GET', false, etudiants, config.apiUrl + 'api/account/actuel');
        // } else if (account.value.access != null && account.value.department != null) {
        //     await request('GET', false, etudiants, config.apiUrl + 'api/account/actuel/getbydept/' + account.value.department.dept_id);
        // }
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
            addAction(accountStore.account.acc_id, 'admin', response, 'Suppression de l\'étudiant '+acc_fullname+' (' + dept_shortname + ').');
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

onMounted(() => {
    fetch();
});

    function deselectAll() {
        selectedDepartment.value = [];
        selectedVoeux.value = [];
        selectedDocument.value = [];
        selectedAnneeMobilite.value = [];
        selectedDestination.value = [];
        selectedPeriodeMobilite.value = [];
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
        selectedPeriodeMobilite.value = [];
    }
    function deselectAllDestination() {
        selectedDestination.value = [];
    }

    watch(
      [
        selectedDepartment,
        selectedVoeux,
        selectedDocument,
        selectedAnneeMobilite,
        selectedPeriodeMobilite,
        selectedDestination
      ],
      fetchFilteredStudents,
      { deep: true }
    )

</script>
