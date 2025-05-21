<template>
  <div v-if="isLoaded" class="relative">
    <p class="font-bold text-xl text-center py-5">Arbitrage</p>
    <div class="flex">
      <!-- Gauche -->
      <div class="min-h-screen flex flex-col items-center">
        <p class="text-center">Liste des étudiants</p>

        <!-- Partie filtre étudiants -->
        <div class="flex items-center justify-center pt-5">
          <div class="bg-base-100 rounded-lg shadow-lg w-96 overflow-hidden border border-base-300" v-if="accords && accords.agreements">
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
                <p class="text-sm select-none">
                  {{ filteredEtus.length }} résultats
                </p>
              </div>
            </div>

            <!-- Section Départements -->
            <div class="border-b border-base-300">
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
                      v-for="(dept, index) in comp.departments"
                      :key="index"
                    >
                      <label
                        :for="'filt_dept_' + dept.dept_id"
                        class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                      >
                        <input
                          :id="'filt_dept_' + dept.dept_id"
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

            <!-- Section Nombre de voeux -->
            <div class="border-b border-base-300">
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('voeux')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span class="font-medium select-none">Nombre de voeux</span>
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
                  <div
                    v-for="(voeu, index) in voeuxNoms"
                    :key="index"
                    class="flex items-center"
                  >
                    <label
                      :for="'filt_voeux_' + index"
                      class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                    >
                      <input
                        :id="'filt_voeux_' + index"
                        type="checkbox"
                        class="checkbox checkbox-sm mr-2"
                        :value="voeu.val"
                        v-model="selectedVoeux"
                      />
                      <span class="text-sm select-none">{{ voeu.name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Accords (voeux) -->
            <div class="border-b border-base-300">
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('accords')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span class="font-medium select-none">Accords (voeux)</span>
                  <span v-if="selectedAccord.length" class="badge badge-sm select-none">{{ selectedAccord.length }}</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform duration-200"
                  :class="isOpen.accords ? 'rotate-180' : ''"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div class="p-4 pt-0 bg-base-100" v-show="isOpen.accords">
                <button
                  class="btn btn-xs btn-ghost mb-3"
                  @click="deselectAllAccord"
                >
                  <span class="select-none">Tout désélectionner</span>
                </button>

                <div class="grid grid-cols-1 gap-2">
                  <div
                    v-for="(accord, index) in accords.agreements"
                    :key="index"
                    class="flex items-center"
                  >
                    <label
                      :for="'filt_accord_' + index"
                      class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                    >
                      <input
                        :id="'filt_accord_' + index"
                        type="checkbox"
                        class="checkbox checkbox-sm mr-2"
                        :value="accord.agree_id"
                        v-model="selectedAccord"
                      />
                      <span class="relative inline-block mr-2">
                        <!-- Drapeau -->
                        <span class="fi" :class="'fi-' + accord.partnercountry?.parco_code"></span>

                        <!-- Point d'interrogation si pas de drapeau -->
                        <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xs font-bold bg-white select-none">
                          ?
                        </span>
                      </span>
                      <span class="text-sm select-none">{{ accord.university?.univ_name || 'Université indisponible' }} - {{ accord.isced?.isc_code || 'Code ISCED ?' }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Années de mobilité -->
            <div>
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('anneemobilite')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span class="font-medium select-none">Années de mobilité</span>
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
          </div>
        </div>

        <!-- Affichage des étudiants -->
        <div class="flex flex-col items-center justify-start w-full">
          <div class="w-full flex items-center justify-between mb-4">
            <button
              class="btn btn-ghost btn-sm"
              @click="watchAllWish"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="select-none">Ouvrir tous les voeux</span>
            </button>
          </div>

          <!-- Barre de recherche -->
          <label
            class="input input-bordered flex items-center gap-2 w-full my-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="w-4 h-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              type="text"
              class="grow"
              placeholder="Recherche par nom et prénom"
              v-model="searchQuery"
            />
          </label>

          <div class="w-full">
            <div
              class="elementDrag bg-base-100 w-96 mb-2 rounded-md shadow-sm hover:shadow transition-all duration-200 select-none cursor-move border border-base-200"
              :draggable="true"
              :id="'etu_drag_' + etu.acc_id"
              v-for="(etu, index) in filteredEtus"
              :key="index"
              :style="{
                borderLeft: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}`,
              }"
            >
              <!-- En-tête avec informations de l'étudiant -->
              <div class="flex items-center justify-between w-full p-2 bg-base-200/50">
                <div class="flex items-center">
                  <div 
                    class="badge badge-md mr-2" 
                    :style="{ backgroundColor: etu.department ? etu.department.dept_color : '#aaaaaa', color: 'white' }"
                  >
                    {{ etu.department ? etu.department.dept_shortname : 'N/A' }}
                  </div>
                  <h3 class="font-medium text-base select-none">{{ etu.acc_fullname }}</h3>
                </div>

                <button 
                  @click="openEtuModal(etu)" 
                  class="btn btn-circle btn-xs btn-ghost"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

              <!-- Section des voeux s'il y en a -->
              <div v-if="etu.wishes && etu.wishes.count > 0">
                <div
                  class="bg-base-100 p-2 mt-1 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors"
                  @click="toggleCollapseEtu(etu.acc_id)"
                >
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <span class="text-sm font-medium select-none">Voir les voeux</span>
                    <span class="badge badge-sm badge-primary ml-2">{{ etu.wishes.count }}</span>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    class="w-4 h-4 transition-transform duration-200"
                    :class="isOpen.etudiants[etu.acc_id] ? 'rotate-180' : ''"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                <!-- Affichage des voeux -->
                <div class="p-2 bg-base-100 border-t border-base-200 overflow-visible" v-show="isOpen.etudiants[etu.acc_id]">
                  <div
                    v-for="(accord, index) in getFilteredAgreements(etu)"
                    :key="index"
                    class="flex justify-between p-2 hover:bg-base-200/50 rounded transition-colors"
                  >
                    <div class="min-w-fit flex items-start justify-center">
                      <span class="badge badge-sm badge-outline badge-primary">Voeu {{ accord.place }}</span>
                    </div>
                    <div class="flex w-full items-start justify-start ml-2">
                      <span class="relative inline-block mr-1">
                        <!-- Drapeau -->
                        <span
                          class="fi"
                          :class="'fi-' + accord.agreement?.partnercountry?.parco_code"
                        ></span>

                        <!-- Point d'interrogation si pas de drapeau -->
                        <span
                          v-if="!accord.agreement?.partnercountry?.parco_code"
                          class="absolute inset-0 flex items-center justify-center text-black text-sm font-bold bg-white select-none"
                        >
                          ?
                        </span>
                      </span>

                      <div class="text-sm">
                        <span class="font-medium">{{ accord.agreement.university?.univ_name || "Université indisponible" }}</span>
                        <span class="text-xs text-base-content/70 ml-1">{{ accord.agreement.isced?.isc_code || "Code ISCED ?" }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Droite -->
      <div class="min-h-screen flex flex-col items-center w-full">
        <p class="text-center w-full">Liste des accords</p>

        <!-- Partie filtre accords -->
        <div class="flex items-center justify-center py-5 w-full">
          <div class="bg-base-100 rounded-lg shadow-lg w-11/12 overflow-hidden border border-base-300" v-if="accords && accords.agreements">
            <!-- En-tête -->
            <div class="bg-base-300 p-4">
              <h3 class="font-bold text-lg select-none">Filtres</h3>
              <div class="flex justify-between items-center mt-2">
                <button 
                  class="btn btn-sm btn-ghost text-xs" 
                  @click="deselectAllArb"
                >
                  <span class="">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </span>
                  <span class="select-none">Tout désélectionner</span>
                </button>
                <p class="text-sm select-none">
                  {{ filteredArbitrage.length }} résultats
                </p>
              </div>
            </div>

            <!-- Section Pays -->
            <div class="border-b border-base-300">
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('pays')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span class="font-medium select-none">Pays</span>
                  <span class="badge badge-sm select-none">
                    {{ selectedCountries.length }}/{{ partnercountry.length }}
                  </span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform duration-200"
                  :class="isOpen.pays ? 'rotate-180' : ''"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div class="p-4 pt-0 bg-base-100" v-show="isOpen.pays">
                <button
                  class="btn btn-xs btn-ghost mb-3"
                  @click="deselectAllCountry"
                >
                  <span class="select-none">Tout désélectionner</span>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2">
                  <div
                    v-for="(country, index) in partnercountry"
                    :key="index"
                    class="flex items-center"
                  >
                  <label
                      :for="'filt_pays_' + index"
                      class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                      :class="{ 'opacity-50 pointer-events-none': disabledCountries.has(country.parco_name) }"
                    >
                      <input
                        :id="'filt_pays_' + index"
                        type="checkbox"
                        class="checkbox checkbox-sm mr-2"
                        :value="country.parco_name"
                        v-model="selectedCountries"
                        :disabled="disabledCountries.has(country.parco_name)"
                      />
                      <span class="fi mr-2" :class="'fi-' + country.parco_code"></span>
                      <span class="text-sm select-none">{{ country.parco_name }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section ISCED -->
            <div class="border-b border-base-300">
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('isced')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span class="font-medium select-none">ISCED</span>
<span class="badge badge-sm select-none">
  {{ selectedIsced.length }}/{{ availableIsceds.length }}
</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform duration-200"
                  :class="isOpen.isced ? 'rotate-180' : ''"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div class="p-4 pt-0 bg-base-100" v-show="isOpen.isced">
                <button
                  class="btn btn-xs btn-ghost mb-3"
                  @click="deselectAllIsced"
                >
                  <span class="select-none">Tout désélectionner</span>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                  <div
                    v-for="(isced, index) in availableIsceds"
                    :key="index"
                    class="flex items-center"
                  >
                  <label
  :for="'filt_isced_' + index"
  class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
  :class="{ 'opacity-50 pointer-events-none': disabledIsceds.has(isced.isc_id) }"
>
  <input
    :id="'filt_isced_' + index"
    type="checkbox"
    class="checkbox checkbox-sm mr-2"
    :value="isced.isc_id"
    v-model="selectedIsced"
    :disabled="disabledIsceds.has(isced.isc_id)"
  />
  <span class="text-sm select-none">{{ isced.isc_code || "XX" }} - {{ isced.isc_name || "Sans code" }}</span>
</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Universités -->
            <div class="border-b border-base-300">
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('university')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                  <span class="font-medium select-none">Universités</span>
<span class="badge badge-sm select-none">
  {{ selectedUniversity.length }}/{{ availableUniversities.length }}
</span>
</div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform duration-200"
                  :class="isOpen.university ? 'rotate-180' : ''"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div class="p-4 pt-0 bg-base-100" v-show="isOpen.university">
                <button
                  class="btn btn-xs btn-ghost mb-3"
                  @click="deselectAllUniversity"
                >
                  <span class="select-none">Tout désélectionner</span>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div
                    v-for="(univ, index) in availableUniversities"
                    :key="index"
                    class="flex items-center"
                  >
                  <label
  :for="'filt_univ_' + index"
  class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
  :class="{ 'opacity-50 pointer-events-none': disabledUniversities.has(univ.univ_id) }"
>
  <input
    :id="'filt_univ_' + index"
    type="checkbox"
    class="checkbox checkbox-sm mr-2"
    :value="univ.univ_id"
    v-model="selectedUniversity"
    :disabled="disabledUniversities.has(univ.univ_id)"
  />
  <span class="relative inline-block mr-2">
    <span class="fi" :class="'fi-' + univ.partnercountry?.parco_code"></span>
    <span
      v-if="!univ.partnercountry?.parco_code"
      class="absolute inset-0 flex items-center justify-center text-black text-xs font-bold bg-white select-none"
    >
      ?
    </span>
  </span>
  <span class="text-sm select-none">
    {{ univ.univ_name || "Université indisponible" }}
    <span class="text-gray-500">({{ univ.univ_city }})</span>
  </span>
</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section Arbitrage -->
            <div>
              <div
                class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                @click="toggleCollapse('arbitrage')"
              >
                <div class="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <span class="font-medium select-none">Arbitrage</span>
                  <span v-if="selectedArbitrage.length" class="badge badge-sm select-none">{{ selectedArbitrage.length }}</span>
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  class="w-5 h-5 transition-transform duration-200"
                  :class="isOpen.arbitrage ? 'rotate-180' : ''"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>

              <div class="p-4 pt-0 bg-base-100" v-show="isOpen.arbitrage">
                <button
                  class="btn btn-xs btn-ghost mb-3"
                  @click="deselectAllArbitrage"
                >
                  <span class="select-none">Tout désélectionner</span>
                </button>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div class="flex items-center">
                    <label
                      for="filt_arbitrage_1"
                      class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                    >
                      <input
                        id="filt_arbitrage_1"
                        type="checkbox"
                        class="checkbox checkbox-sm mr-2"
                        value="aucun"
                        v-model="selectedArbitrage"
                      />
                      <span class="text-sm select-none">Aucun étudiant</span>
                    </label>
                  </div>
                  <div class="flex items-center">
                    <label
                      for="filt_arbitrage_2"
                      class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                    >
                      <input
                        id="filt_arbitrage_2"
                        type="checkbox"
                        class="checkbox checkbox-sm mr-2"
                        value="aumoinsun"
                        v-model="selectedArbitrage"
                      />
                      <span class="text-sm select-none">Au moins un étudiant</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Partie rendu accord -->
        <div class="flex flex-col items-center w-full flex-grow relative" style="min-height: 1000px;">
          <div class="flex flex-col items-center justify-start w-full select-none overflow-auto absolute inset-0">
            <div
              v-for="(arbitrage, accordIndex) in filteredArbitrage"
              :key="'accord-' + accordIndex"
              class="bg-base-300 w-11/12 mb-4 p-4 rounded-lg"
            >
              <div class="flex items-center justify-center mb-2">
                <span class="relative inline-block mr-2">
                  <!-- Drapeau -->
                  <span
                    class="fi md:text-3xl text-xl transition-all duration-200 ease-in-out"
                    :class="
                      'fi-' + arbitrage.agreement?.partnercountry?.parco_code
                    "
                  ></span>

                  <!-- Point d'interrogation si pas de drapeau -->
                  <span
                    v-if="!arbitrage.agreement?.partnercountry?.parco_code"
                    class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none"
                  >
                    ?
                  </span>
                </span>

                <p class="font-bold text-lg">
                  {{
                    arbitrage.agreement.partnercountry?.parco_name ||
                    "Pays indisponible"
                  }}
                </p>
              </div>
              <p class="text-center mb-3">
                {{
                  arbitrage.agreement.university?.univ_name ||
                  "Université indisponible"
                }}
                -
                {{
                  arbitrage.agreement.isced?.isc_code || "Code ISCED indisponible"
                }}
                {{
                  arbitrage.agreement.isced?.isc_name || "Nom ISCED indisponible"
                }}
              </p>

              <div class="w-full flex justify-center">
                <div class="flex flex-wrap gap-4 justify-center w-full">
                  <!-- Rendu des cases -->
                  <div
                    :id="
                      'drop_' + arbitrage.agreement.agree_id + '_' + placeIndex
                    "
                    v-for="(place, placeIndex) in getNumberOfPlace(
                      arbitrage.agreement.agree_id
                    )"
                    :key="'place-' + placeIndex"
                    class="dropZones bg-base-200 m-1 h-20 w-72 relative flex items-center justify-center"
                  >
                    <div
                      v-if="
                        arbitrage.accounts[placeIndex] &&
                        arbitrage.accounts[placeIndex].account
                      "
                      draggable="true"
                      :id="
                        'etu_drag_' +
                        arbitrage.accounts[placeIndex].account.acc_id
                      "
                      class="h-full w-full flex items-center justify-center elementDrag cursor-move hover:opacity-60"
                      :style="{
                        borderBottom: `4px solid ${
                          arbitrage.accounts[placeIndex]?.account?.department
                            ?.dept_color || '#aaaaaa'
                        }`,
                      }"
                    >
                      <p>
                        {{ arbitrage.accounts[placeIndex].account.acc_fullname }}
                      </p>
                      <button
                        @click="
                          removeEtuFromPlace(
                            arbitrage.agreement.agree_id,
                            placeIndex
                          )
                        "
                        class="hover:cursor-pointer hover:opacity-60 absolute top-0 right-0 p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="stroke-current shrink-0 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <p v-else class="">Aucun étudiant</p>
                  </div>
                  <div
                    class="w-72 h-20 m-1 flex items-center justify-center border-8 border-base-200 bg-base-100 hover:opacity-60 cursor-pointer"
                    @click="addPlace(arbitrage.agreement.agree_id)"
                  >
                    <p class="text-lg font-bold">+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton d'archivage -->
      <div class="fixed bottom-0 right-0 p-4">
        <button
          class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70"
          @click="openConfirmModal"
        >
          Archiver l'arbitrage
        </button>
      </div>

      <!-- Modal confirmation d'archivage -->
      <Teleport to="body">
  <dialog id="archivageModal" ref="archivageModal" class="modal">
    <div class="modal-box max-w-3xl rounded-2xl border border-base-300 shadow-xl">
      <h3 class="text-xl font-bold">Archiver l'arbitrage</h3>
      <p class="text-sm text-base-content/70 mt-2">Cette action est définitive et ne pourra pas être annulée.</p>
      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

      <div class="py-3" v-if="!archivageEnCours">
        <p>Souhaitez-vous vraiment archiver l’arbitrage ?</p>
      </div>

      <div class="py-6 flex flex-col items-center justify-center" v-else>
        <span class="loading loading-spinner loading-lg text-success mb-2"></span>
        <p>Archivage en cours...</p>
      </div>

      <div class="modal-action mt-4" v-if="!archivageEnCours">
        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
        <button class="btn btn-primary" @click="confirmArchivage">Archiver</button>
      </div>
    </div>
  </dialog>
</Teleport>


      <!-- Modal Informations étudiant -->
      <Teleport to="body">
  <dialog id="infoEtu" ref="infoEtu" class="modal">
    <div class="modal-box max-w-3xl rounded-2xl border border-base-300 shadow-xl">
      <form method="dialog">
        <label for="modal_info_etu" @click="closeModal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
      </form>

      <!-- Identité -->
      <div class="flex items-center mb-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3"
             :style="{ backgroundColor: infoetudiant.department ? infoetudiant.department.dept_color : '#aaaaaa' }">
          {{ infoetudiant.acc_fullname?.charAt(0).toUpperCase() || 'N' }}
        </div>
        <div>
          <h3 class="text-xl font-bold">{{ infoetudiant.acc_fullname || "Inconnu" }}</h3>
          <p class="text-sm text-base-content/70">ID: {{ infoetudiant.acc_id || "Inconnu" }}</p>
        </div>
      </div>

      <!-- Grilles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Infos principales -->
        <div class="bg-base-200 p-3 rounded-md">
          <h4 class="font-bold text-md mb-2">Informations</h4>
          <div class="space-y-1">
            <div class="flex justify-between"><span>Nombre de vœux:</span><span>{{ infoetudiant.wishes?.count || 0 }}</span></div>
            <div class="flex justify-between"><span>Documents ajoutés:</span><span>{{ infoetudiant.documents?.count || 0 }}/{{ infoetudiant.documents?.countmax }}</span></div>
            <div class="flex justify-between"><span>Dernière connexion:</span><span>{{ formatDate(infoetudiant.acc_lastlogin) }}</span></div>
            <div class="flex justify-between"><span>Aménagement aux examens:</span><span>{{ infoetudiant.acc_amenagement ? "Oui" : "Non" }}</span></div>
          </div>
        </div>

        <!-- Coordonnées -->
        <div class="bg-base-200 p-3 rounded-md">
          <h4 class="font-bold text-md mb-2">Coordonnées</h4>
          <div class="space-y-1">
            <div class="flex justify-between"><span>Email:</span><span class="truncate">{{ infoetudiant.acc_mail || "Aucun" }}</span></div>
            <div class="flex justify-between"><span>Numéro étudiant:</span><span>{{ infoetudiant.acc_studentnum || "Aucun" }}</span></div>
            <div class="flex justify-between"><span>Année de mobilité:</span><span>{{ infoetudiant.acc_anneemobilite || "Aucune" }}</span></div>
            <div class="flex justify-between"><span>Score TOEIC:</span><span>{{ infoetudiant.acc_toeic || "Aucun" }}</span></div>
          </div>
        </div>
      </div>

      <!-- Académique -->
      <div class="bg-base-200 p-3 rounded-md mt-3">
        <h4 class="font-bold text-md mb-2">Information académique</h4>
        <div class="space-y-1">
          <div class="flex justify-between"><span>Département:</span><span>{{ infoetudiant.department?.dept_name || "Aucun" }}</span></div>
          <div class="flex justify-between"><span>Parcours:</span><span>{{ infoetudiant.acc_parcours || "Aucun" }}</span></div>
        </div>
      </div>

      <!-- Voeux -->
      <div class="bg-base-200 p-3 rounded-md mt-3">
        <h4 class="font-bold text-md mb-2">Vœux</h4>
        <p v-if="infoetudiant.wishes?.count == 0" class="text-center text-base-content/70 italic">
          Aucun vœu enregistré
        </p>
        <div v-for="(accord, index) in getFilteredAgreements(infoetudiant)" :key="index"
             class="flex justify-between p-2 hover:bg-base-100 rounded">
          <div class="min-w-fit">
            <span class="badge badge-sm badge-primary">Vœu {{ accord.place }}</span>
          </div>
          <div class="flex w-full items-center justify-start ml-2">
            <span class="relative inline-block mr-1">
              <span class="fi" :class="'fi-' + accord.agreement?.partnercountry?.parco_code"></span>
              <span v-if="!accord.agreement?.partnercountry?.parco_code"
                    class="absolute inset-0 flex items-center justify-center text-black text-xs font-bold bg-white select-none">?</span>
            </span>
            <div class="text-sm flex justify-center items-center gap-3">
              <span class="font-medium">{{ accord.agreement.university?.univ_name || "Université indisponible" }}</span>
              <span class="text-xs text-base-content/70">{{ accord.agreement.isced?.isc_code || "Code ISCED ?" }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lien profil -->
      <div class="mt-4" v-if="infoetudiant && infoetudiant.acc_id">
        <a :href="$router.resolve({ name: 'Profile', params: { acc_id: infoetudiant.acc_id }}).href" target="_blank">
          <button class="btn btn-primary w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975M15 9.75a3 3 0 11-6 0 3 3 0 016 0zM12 21a8.966 8.966 0 01-5.982-2.275" />
            </svg>
            Voir le profil complet
          </button>
        </a>
      </div>
    </div>
  </dialog>
</Teleport>

    </div>
  </div>
  <div v-else>
    <LoadingComp></LoadingComp>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import { request } from "../../composables/httpRequest";
import config from "../../config";
import LoadingComp from "../../components/utils/LoadingComp.vue";
import { useAccountStore } from "../../stores/accountStore";
import { addAction } from "../../composables/actionType";

const response = ref([]);
const accords = ref([]);
const university = ref([]);
const etudiants = ref([]);
const isceds = ref([]);
const components = ref([]);
const partnercountry = ref([]);
const isLoaded = ref(false);
const searchQuery = ref("");

const selectedDepartment = ref([]);
const selectedIsced = ref([]);
const selectedAccord = ref([]);
const selectedUniversity = ref([]);
const selectedAccordArbitrage = ref([]);
const selectedArbitrage = ref([]);
const selectedVoeux = ref([]);
const selectedCountries = ref([]);
const selectedAnneeMobilite = ref([]);

const accountStore = useAccountStore();

const infoetudiant = ref([]);

const arbitrage = ref([]);

const anneesmobilite = ref([]);

const localEtus = ref([]);
const localArbitrage = ref([]);

const archivageEnCours = ref(false);

const voeuxNoms = [
  { val: 0, name: "Aucun voeux" },
  { val: 1, name: "1 voeu" },
  { val: 2, name: "2 voeux" },
  { val: 3, name: "3 voeux" },
  { val: 4, name: "4 voeux" },
  { val: 5, name: "5 voeux" },
  { val: 6, name: "6 voeux" },
];

const isOpen = ref({
  pays: false,
  departments: false,
  accords: false,
  university: false,
  accordsarbitrage: false,
  arbitrage: false,
  isced: false,
  voeux: false,
  anneemobilite: false,
  etudiants: [],
});

//Changer l'état d'un menu de filtre
function toggleCollapse(section) {
  isOpen.value[section] = !isOpen.value[section];
}

//Changer l'état d'un menu de filtre partie étudiant
const toggleCollapseEtu = (acc_id) => {
  isOpen.value.etudiants[acc_id] = !isOpen.value.etudiants[acc_id];
};

// Récupération des données
async function fetch() {
  isLoaded.value = false;
  await request("GET", false, accords, config.apiUrl + "api/agreement");
  await request("GET", false, university, config.apiUrl + "api/university");
  await request("GET", false, components, config.apiUrl + "api/component");
  await request(
    "GET",
    false,
    partnercountry,
    config.apiUrl + "api/partnercountry"
  );
  await request("GET", false, isceds, config.apiUrl + "api/isced");
  await request(
    "GET",
    false,
    etudiants,
    config.apiUrl + "api/account/students/actuel"
  );
  await request("GET", false, arbitrage, config.apiUrl + "api/arbitrage/actuel");
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 4; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    anneesmobilite.value.push(`${startYear}-${endYear}`);
  }

  isLoaded.value = true;
  init();
  if (etudiants.value && etudiants.value.accounts) {
    isOpen.value.etudiants = etudiants.value.accounts.reduce((acc, student) => {
      acc[student.acc_id] = false;
      return acc;
    }, {});
  }
}

// Fermer le modal de confirmation de suppression
function closeModal() {
  const modal = document.getElementById("archivageModal");
  modal.close();
  const modal2 = document.getElementById("infoEtu");
  modal2.close();
}

function openConfirmModal() {
  const modal = document.getElementById("archivageModal");
  modal.showModal();
}

function openEtuModal(etu) {
  infoetudiant.value = etu;
  const modal = document.getElementById("infoEtu");
  modal.showModal();
}

async function confirmArchivage() {
  archivageEnCours.value = true;
  await request(
    "POST",
    true,
    response,
    config.apiUrl + "api/arbitrage/archiver"
  );
  if (response.value.status == 200) fetch();
  archivageEnCours.value = false;
  closeModal();

}

// Initialisation des données et mise en place des drops
async function init() {
  // Initialiser localEtus avec les étudiants qui ne sont pas dans arbitrage
  localEtus.value = etudiants.value.accounts
    .filter(
      (etu) =>
        !arbitrage.value.some(
          (arbitre) => arbitre.account.acc_id === etu.acc_id
        )
    )
    .reduce((acc, etu) => {
      acc[etu.acc_id] = etu;
      return acc;
    }, {});

  // Initialiser localArbitrage avec les accords et les informations sur les étudiants correspondants
  localArbitrage.value = accords.value.agreements.reduce((acc, accord) => {
    // Obtenir toutes les positions possibles pour l'accord actuel
    const allPositions = getNumberOfPlace(accord.agree_id);

    // Chercher les étudiants correspondants dans arbitrage
    const matchingArbitrages = arbitrage.value.filter(
      (arbitre) => arbitre.agreement.agree_id === accord.agree_id
    );

    // Créer l'objet pour l'accord actuel
    acc[accord.agree_id] = {
      agreement: accord,
      accounts: allPositions.map((pos) => {
        // Chercher les arbitrages qui correspondent à la position actuelle
        const matchingArbitrage = matchingArbitrages.find(
          (arbitre) => arbitre.arb_pos === pos + 1
        );
        return {
          arb_pos: pos + 1, // Les positions doivent être basées sur 1
          account: matchingArbitrage ? matchingArbitrage.account : null, // Mettre account à null si matchingArbitrage n'existe pas
        };
      }),
    };

    return acc;
  }, {});

  // Attendre le prochain "tick" pour assurer que les changements sont appliqués
  await nextTick();

  // Rafraîchir les éléments de drag and drop
  refreshDrag();
  refreshDrop();
}


// Renvoie la date formatée
function formatDate(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} à ${hours}h${minutes}`;
}

// Enregistrement de l'arbitrage
async function saveArbitrage() {
  // Sauvegarder l'état précédent pour comparaison
  const previousState = arbitrage.value.map((arb) => ({
    acc_id: arb.account.acc_id,
    agree_id: arb.agreement.agree_id,
    arb_pos: arb.arb_pos,
  }));

  const extractedData = Object.values(localArbitrage.value).reduce(
    (acc, arbitrage) => {
      arbitrage.accounts.forEach((accountInfo) => {
        if (accountInfo.account) {
          acc.push({
            acc_id: accountInfo.account.acc_id,
            agree_id: arbitrage.agreement.agree_id,
            arb_pos: accountInfo.arb_pos,
          });
        }
      });
      return acc;
    },
    []
  );

  await request(
    "POST",
    true,
    response,
    config.apiUrl + "api/arbitrage",
    extractedData
  );

  if (response.value.status == 200) {
    // Créer une map des positions précédentes par étudiant et accord
    const previousPositions = new Map(
      previousState.map((state) => [
        `${state.acc_id}-${state.agree_id}`,
        state.arb_pos,
      ])
    );

    // Créer une map des nouvelles positions
    const newPositions = new Map(
      extractedData.map((data) => [
        `${data.acc_id}-${data.agree_id}`,
        data.arb_pos,
      ])
    );

    // Trouver les suppressions (étudiants qui ne sont plus sur le même accord)
    const removals = previousState.filter((prevData) => {
      const key = `${prevData.acc_id}-${prevData.agree_id}`;
      const hasKey = !newPositions.has(key);
      return hasKey;
    });

    // Trouver les changements (nouveaux placements ou modifications de position)
    const changes = extractedData.filter((newData) => {
      const key = `${newData.acc_id}-${newData.agree_id}`;
      const previousPos = previousPositions.get(key);
      return !previousPos || previousPos !== newData.arb_pos;
    });

    // Créer une entrée dans l'historique pour les changements
    for (const data of changes) {
      addAction(
        accountStore.account.acc_id,
        "arbitrage",
        response,
        `Changement de l'arbitrage pour ${data.acc_id} sur l'accord ${data.agree_id} à la position ${data.arb_pos}.`
      );
    }

    // Créer une entrée dans l'historique pour les suppressions
    for (const data of removals) {
      addAction(
        accountStore.account.acc_id,
        "arbitrage",
        response,
        `Suppression de l'arbitrage pour ${data.acc_id} (précédemment sur l'accord ${data.agree_id}).`
      );
    }
  }
}

const disabledUniversities = computed(() => {
  if (selectedCountries.value.length === 0) return new Set();
  return new Set(
    university.value
      .filter((univ) => {
        const isLinked = accords.value.agreements.some(
          (a) =>
            a.university?.univ_id === univ.univ_id &&
            selectedCountries.value.includes(a.partnercountry?.parco_name)
        );
        return !isLinked;
      })
      .map((u) => u.univ_id)
  );
});

const disabledIsceds = computed(() => {
  if (selectedUniversity.value.length === 0) return new Set();
  return new Set(
    isceds.value
      .filter((isced) => {
        const isLinked = accords.value.agreements.some(
          (a) =>
            a.isced?.isc_id === isced.isc_id &&
            selectedUniversity.value.includes(a.university?.univ_id)
        );
        return !isLinked;
      })
      .map((i) => i.isc_id)
  );
});

const disabledCountries = computed(() => {
  if (selectedUniversity.value.length === 0) return new Set();
  return new Set(
    partnercountry.value
      .filter((country) => {
        const isLinked = accords.value.agreements.some(
          (a) =>
            a.partnercountry?.parco_name === country.parco_name &&
            selectedUniversity.value.includes(a.university?.univ_id)
        );
        return !isLinked;
      })
      .map((c) => c.parco_name)
  );
});

// Liste des étudiants après filtres
const filteredEtus = computed(() => {
  return Object.values(localEtus.value)
    .filter((etu) => {
      // Filtre par défaut: prend uniquement les étudiants avec acc_validateacc à true
      return etu.acc_validateacc === true;
    })
    .filter((etu) => {
      // Filtre par département avec possibilité de filtrer par "Aucun"
      const matchesDepartments =
        selectedDepartment.value.length === 0 ||
        (etu.department &&
          selectedDepartment.value.includes(etu.department.dept_shortname)) ||
        (selectedDepartment.value.includes("Aucun") && !etu.department);

      // Filtre par recherche
      const matchesSearchQuery =
        !searchQuery.value ||
        [etu.acc_fullname, etu.acc_id.toString()].some((field) =>
          field.toLowerCase().includes(searchQuery.value.toLowerCase())
        );

      return matchesDepartments && matchesSearchQuery;
    })
    .filter((etu) => {
      // Filtre par accords
      const filteredAgreements = getFilteredAgreements(etu).map(
        (item) => item.agreement.agree_id
      );
      return (
        selectedAccord.value.length === 0 ||
        selectedAccord.value.some((accord) =>
          filteredAgreements.includes(accord)
        )
      );
    })
    .filter((etu) => {
      // Filtre par nombre de vœux
      const voeuxCount = etu.wishes.count;
      return (
        selectedVoeux.value.length === 0 ||
        selectedVoeux.value.includes(voeuxCount)
      );
    })
    .filter((etu) => {
      // Filtre par année de mobilité
      return (
        selectedAnneeMobilite.value.length === 0 ||
        selectedAnneeMobilite.value.includes(etu.acc_anneemobilite)
      );
    })
    .sort((a, b) => {
      // Tri par position du vœu et alphabétiquement
      const aMinPlace = Math.min(
        ...getFilteredAgreements(a)
          .filter((item) =>
            selectedAccord.value.includes(item.agreement.agree_id)
          )
          .map((item) => item.place)
      );
      const bMinPlace = Math.min(
        ...getFilteredAgreements(b)
          .filter((item) =>
            selectedAccord.value.includes(item.agreement.agree_id)
          )
          .map((item) => item.place)
      );
      if (aMinPlace !== bMinPlace) {
        return aMinPlace - bMinPlace;
      }
      return a.acc_fullname.localeCompare(b.acc_fullname);
    });
});

// Liste des accords avec arbitrage après filtres
const filteredArbitrage = computed(() => {
  return Object.values(localArbitrage.value)
    .filter((arbitrage) => {
      const countryFilter =
        selectedCountries.value.length === 0 ||
        selectedCountries.value.includes(
          arbitrage.agreement.partnercountry.parco_name
        );

      const allAccountsNull = arbitrage.accounts.every(
        (account) => account.account === null
      );
      const atLeastOneAccountNotNull = arbitrage.accounts.some(
        (account) => account.account !== null
      );

      const arbitrageFilter =
        selectedArbitrage.value.length === 0 ||
        (selectedArbitrage.value.includes("aucun") && allAccountsNull) ||
        (selectedArbitrage.value.includes("aumoinsun") &&
          atLeastOneAccountNotNull);

      const iscedFilter =
        selectedIsced.value.length === 0 ||
        (arbitrage.agreement.isced &&
          selectedIsced.value.includes(arbitrage.agreement.isced.isc_id));

      const universityFilter =
        selectedUniversity.value.length === 0 ||
        (arbitrage.agreement.university &&
          selectedUniversity.value.includes(
            arbitrage.agreement.university.univ_id
          ));

      return (
        countryFilter && arbitrageFilter && iscedFilter && universityFilter
      );
    })
    .sort((a, b) => {
      const countryComparison =
        a.agreement.partnercountry.parco_name.localeCompare(
          b.agreement.partnercountry.parco_name
        );
      if (countryComparison !== 0) {
        return countryComparison;
      }
      const universityA = a.agreement.university
        ? a.agreement.university.univ_name
        : "";
      const universityB = b.agreement.university
        ? b.agreement.university.univ_name
        : "";
      return universityA.localeCompare(universityB);
    });
});

// renvoie les voeux d'un étudiant
function getFilteredAgreements(etu) {
  if (!etu || !etu.wishes) {
    return [];
  }
  const wishes = etu.wishes;
  const wishIds = [
    { place: 1, id: wishes.wsha_one },
    { place: 2, id: wishes.wsha_two },
    { place: 3, id: wishes.wsha_three },
    { place: 4, id: wishes.wsha_four },
    { place: 5, id: wishes.wsha_five },
    { place: 6, id: wishes.wsha_six },
  ].filter((wsha) => wsha !== null);
  return wishIds
    .map((wsha) => {
      const agreement = accords.value.agreements.find(
        (agreement) => agreement.agree_id === wsha.id
      );
      return { place: wsha.place, agreement };
    })
    .filter((item) => item.agreement !== undefined);
}

// Enlever un étudiant d'un accord
function removeEtuFromPlace(agree_id, pos) {
  const etu = localArbitrage.value[agree_id].accounts[pos].account;
  localEtus.value[etu.acc_id] = etu;
  localArbitrage.value[agree_id].accounts[pos].account = null;
  refreshDrag();
  saveArbitrage();
}

// Fonction pour ajouter une place temporaire
async function addPlace(agreeId) {
  // Trouver l'accord correspondant par son ID
  let foundAgreement = accords.value.agreements.find(
    (agreement) => agreement.agree_id === agreeId
  );
  let currentPlaces = getNumberOfPlace(agreeId).length;

  if (foundAgreement) {
    // Synchroniser les places si elles sont différentes
    if (foundAgreement.agree_nbplace !== currentPlaces) {
      foundAgreement.agree_nbplace = currentPlaces;
    }

    // Ajouter temporairement une place en incrémentant agree_nbplace
    foundAgreement.agree_nbplace += 1;

    // Ajouter temporairement une place dans localArbitrage
    if (!localArbitrage.value[agreeId]) {
      localArbitrage.value[agreeId] = { accounts: [] };
    }
    if (!localArbitrage.value[agreeId].accounts) {
      localArbitrage.value[agreeId].accounts = [];
    }
    localArbitrage.value[agreeId].accounts.push({
      arb_pos: localArbitrage.value[agreeId].accounts.length + 1,
      account: null,
    });

    await nextTick();
    refreshDrop();
  }
}

// Renvoie le nombre de place d'un accord
function getNumberOfPlace(agreeId) {
  const agreements = accords.value.agreements;

  const agreement = agreements.find(
    (agreement) => agreement.agree_id === agreeId
  );

  if (!agreement) {
    console.error(`Accord avec agreeId ${agreeId} non trouvé.`);
    return [];
  }

  const numberOfPlaces = agreement.agree_nbplace;

  const studentPositions = arbitrage.value.filter(
    (entry) => entry.agree_id === agreeId
  );

  const maxPosition = studentPositions.reduce((max, student) => {
    return student.arb_pos > max ? student.arb_pos : max;
  }, numberOfPlaces - 1);

  const totalPlaces = Math.max(numberOfPlaces, maxPosition);

  const places = Array.from({ length: totalPlaces }, (v, k) => k);

  return places;
}

// Quand on change un filtre, permet d'actualiser les drag et drop
async function handleFiltreEtu() {
  await nextTick();
  refreshDrag();
  refreshDrop();
}

const availableIsceds = computed(() => {
  if (!selectedUniversity.value || !isceds.value || !accords.value) {
    return [];
  }

  const uniqueIscedIds = new Set();

  if (selectedUniversity.value.length === 0) {
    // Si aucune université n'est sélectionnée, retourner tous les ISCED disponibles
    accords.value.agreements.forEach((accord) => {
      if (accord.isced) {
        uniqueIscedIds.add(accord.isced.isc_id);
      }
    });
    return isceds.value.filter((isced) => uniqueIscedIds.has(isced.isc_id));
  }

  // Récupérer tous les ISCED des accords des universités sélectionnées
  accords.value.agreements
    .filter((accord) =>
      selectedUniversity.value.includes(accord.university?.univ_id)
    )
    .forEach((accord) => {
      if (accord.isced) {
        uniqueIscedIds.add(accord.isced.isc_id);
      }
    });

  return isceds.value.filter((isced) => uniqueIscedIds.has(isced.isc_id));
});

// Computed property pour obtenir les universités avec le compte des ISCED

const availableUniversities = computed(() => {
  if (!selectedIsced.value || !university.value || !accords.value) {
    return [];
  }

  let universities;

  if (selectedIsced.value.length === 0) {
    universities = university.value;
  } else {
    const validUnivIds = new Set();
    accords.value.agreements
      .filter(
        (accord) =>
          accord.isced && selectedIsced.value.includes(accord.isced.isc_id)
      )
      .forEach((accord) => {
        if (accord.university) {
          validUnivIds.add(accord.university.univ_id);
        }
      });
    universities = university.value.filter((univ) =>
      validUnivIds.has(univ.univ_id)
    );
  }

  // Ajouter le compte des ISCED pour chaque université
  return universities.map((univ) => {
    // Obtenir tous les ISCED uniques pour cette université
    const uniqueIsceds = new Set(
      accords.value.agreements
        .filter(
          (accord) =>
            accord.university &&
            accord.university.univ_id === univ.univ_id &&
            accord.isced
        )
        .map((accord) => accord.isced.isc_id)
    );
    // Retourner l'université avec les ISCED uniques
    return {
      ...univ,
      uniqueIsceds: Array.from(uniqueIsceds),
    };
  });
});

watch(selectedDepartment, handleFiltreEtu);
watch(selectedAccord, handleFiltreEtu);
watch(selectedVoeux, handleFiltreEtu);
watch(selectedCountries, () => {
  applyCrossFilters();
  handleFiltreEtu();
});
watch(selectedIsced, () => {
  applyCrossFilters();
  handleFiltreEtu();
});
watch(selectedAnneeMobilite, handleFiltreEtu);
watch(selectedAccordArbitrage, handleFiltreEtu);
watch(selectedArbitrage, handleFiltreEtu);
watch(selectedUniversity, () => {
  applyCrossFilters();
  handleFiltreEtu();
});

// définit les drop zones
async function refreshDrop() {
  let dropZones = document.getElementsByClassName("dropZones");
  for (let dropZone of dropZones) {
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      let id = e.dataTransfer.getData("text/plain");
      let selected = document.getElementById(id);
      if (selected) {
        const etuId = selected.id.replace("etu_drag_", "");
        const idMatch = dropZone.id.match(/^drop_(\d+)_(\d+)$/);
        if (idMatch) {
          const agree_id = parseInt(idMatch[1]); // Convertir en entier si nécessaire
          const pos = parseInt(idMatch[2]); // Convertir en entier si nécessaire

          let etu = localEtus.value[etuId];

          if (etu) {
            // Vérifier si l'étudiant est déjà dans localArbitrage.value
            const existingStudent =
              localArbitrage.value[agree_id].accounts[pos];
            if (existingStudent && existingStudent.account != null) {
              // Échanger les étudiants si celui en cours de drag n'est pas déjà dans la dropzone
              const currentEtuId = existingStudent.account.acc_id;
              if (currentEtuId !== etu.acc_id) {
                // Remettre l'étudiant existant dans localEtus.value
                localEtus.value[currentEtuId] = existingStudent.account;
              }
            }

            // Supprimer l'étudiant de localEtus.value s'il est là
            if (localEtus.value[etuId]) {
              delete localEtus.value[etuId];
            }

            // Mettre l'étudiant dans la dropzone actuelle de l'arbitrage
            localArbitrage.value[agree_id].accounts[pos].account = etu;
            refreshDrag();
            saveArbitrage();
            // Si l'étudiant n'est pas trouvé dans localEtus.value, chercher dans localArbitrage.value
          } else if (!etu) {
            etu = findStudentInArbitrage(etuId);
            if (
              findStudentPositionInArbitrage(etuId) - 1 != pos ||
              getCurrentAgreeIdByAccId(etuId) != agree_id
            ) {
              const existingStudent =
                localArbitrage.value[agree_id].accounts[pos];
              if (existingStudent && existingStudent.account != null) {
                localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[
                  findStudentPositionInArbitrage(etuId) - 1
                ].account = existingStudent.account;
                localArbitrage.value[agree_id].accounts[pos].account = etu;
                refreshDrag();
                saveArbitrage();
              } else {
                localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[
                  findStudentPositionInArbitrage(etuId) - 1
                ].account = null;
                localArbitrage.value[agree_id].accounts[pos].account = etu;
                refreshDrag();
                saveArbitrage();
              }
              //Verifier si il y a deja un étudiant dans la dropzone
            }
          } else {
            console.error(
              "Étudiant non trouvé dans localEtus.value ou localArbitrage.value avec etuId :",
              etuId
            );
          }
        } else {
          console.error("ID de dropZone non valide :", dropZone.id);
        }
      }
    });
  }
}

// Trouver un étudiant si il fait partie d'un accord ou non
function findStudentInArbitrage(etuId) {
  for (let agreementId in localArbitrage.value) {
    const accounts = localArbitrage.value[agreementId].accounts;
    for (let accountInfo of accounts) {
      if (accountInfo.account && accountInfo.account.acc_id == etuId) {
        return accountInfo.account;
      }
    }
  }
  return null;
}

//Trouver la position d'un étudiant dans l'accord
function findStudentPositionInArbitrage(accId) {
  for (let agreementId in localArbitrage.value) {
    const accounts = localArbitrage.value[agreementId].accounts;
    for (let i = 0; i < accounts.length; i++) {
      const accountInfo = accounts[i];
      if (accountInfo.account && accountInfo.account.acc_id === accId) {
        return i + 1; // Return arb_pos (adjusted to 1-based index)
      }
    }
  }
  return null; // Return null if student not found
}

// Renvoie l'accord de l'étudiant (id) passé en param
function getCurrentAgreeIdByAccId(accId) {
  for (let agreementId in localArbitrage.value) {
    const accounts = localArbitrage.value[agreementId].accounts;
    for (let accountInfo of accounts) {
      if (accountInfo.account && accountInfo.account.acc_id === accId) {
        return parseInt(agreementId);
      }
    }
  }
  console.error("Aucun accord trouvé pour l'acc_id :", accId);
  return null;
}

// Refresh les drag zone
async function refreshDrag() {
  await nextTick();
  let elementsDraggable = document.getElementsByClassName("elementDrag");
  // Parcourir tous les éléments
  for (let element of elementsDraggable) {
    if (!element.hasListener) {
      element.addEventListener("dragstart", dragStartHandler);
      element.hasListener = true;
    }
  }
}

// Permet de définir le handler d'un drag
function dragStartHandler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

// voir tous les filtres
function watchAllWish() {
  filteredEtus.value.forEach((etu) => {
    isOpen.value.etudiants[etu.acc_id] = true;
  });
}

// déséléctionner les filtres
function deselectAll() {
  selectedDepartment.value = [];
  selectedVoeux.value = [];
  selectedAnneeMobilite.value = [];
  selectedAccord.value = [];
}

// déséléctionner les filtres arbitrage
function deselectAllArb() {
  selectedCountries.value = [];
  selectedIsced.value = [];
  selectedAccordArbitrage.value = [];
  selectedArbitrage.value = [];
  selectedUniversity.value = [];
}

function deselectAllDept() {
  selectedDepartment.value = [];
}
function deselectAllAccord() {
  selectedAccord.value = [];
}
function deselectAllCountry() {
  selectedCountries.value = [];
}
function deselectAllVoeux() {
  selectedVoeux.value = [];
}
function deselectAllIsced() {
  selectedIsced.value = [];
}
function deselectAllAnneeMobilite() {
  selectedAnneeMobilite.value = [];
}
function deselectAllAccordArbitrage() {
  selectedAccordArbitrage.value = [];
}
function deselectAllArbitrage() {
  selectedArbitrage.value = [];
}
function deselectAllUniversity() {
  selectedUniversity.value = [];
}
onMounted(fetch);
</script>

// Cross-filtering logic for arbitrage filters (Pays, Universités, ISCED, Arbitrage)
function applyCrossFilters() {
  // Pays → Universités
  if (selectedCountries.value.length > 0) {
    const allowedUnivIds = new Set(
      accords.value.agreements
        .filter((a) =>
          selectedCountries.value.includes(a.partnercountry?.parco_name)
        )
        .map((a) => a.university?.univ_id)
        .filter(Boolean)
    );
    selectedUniversity.value = selectedUniversity.value.filter((id) =>
      allowedUnivIds.has(id)
    );
  }

  // Universités → ISCED
  if (selectedUniversity.value.length > 0) {
    const allowedIscedIds = new Set(
      accords.value.agreements
        .filter((a) =>
          selectedUniversity.value.includes(a.university?.univ_id)
        )
        .map((a) => a.isced?.isc_id)
        .filter(Boolean)
    );
    selectedIsced.value = selectedIsced.value.filter((id) =>
      allowedIscedIds.has(id)
    );
  }
}