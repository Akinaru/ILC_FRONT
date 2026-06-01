<template>
    <div>
        <div v-if="isLoaded">

        <div class="flex justify-between">
            <p class="text-xl font-bold">Accord</p>
            <div class="flex *:mx-1">
                <button class="btn btn-error" @click="openConfirmModalDeleteAll">
                    <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        width="20px" height="20px" viewBox="0 0 408.483 408.483"
                        xml:space="preserve">
                        <g>
                            <g>
                                <path d="M87.748,388.784c0.461,11.01,9.521,19.699,20.539,19.699h191.911c11.018,0,20.078-8.689,20.539-19.699l13.705-289.316
                                    H74.043L87.748,388.784z M247.655,171.329c0-4.61,3.738-8.349,8.35-8.349h13.355c4.609,0,8.35,3.738,8.35,8.349v165.293
                                    c0,4.611-3.738,8.349-8.35,8.349h-13.355c-4.61,0-8.35-3.736-8.35-8.349V171.329z M189.216,171.329
                                    c0-4.61,3.738-8.349,8.349-8.349h13.355c4.609,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.737,8.349-8.349,8.349h-13.355
                                    c-4.61,0-8.349-3.736-8.349-8.349V171.329L189.216,171.329z M130.775,171.329c0-4.61,3.738-8.349,8.349-8.349h13.356
                                    c4.61,0,8.349,3.738,8.349,8.349v165.293c0,4.611-3.738,8.349-8.349,8.349h-13.356c-4.61,0-8.349-3.736-8.349-8.349V171.329z"/>
                                <path d="M343.567,21.043h-88.535V4.305c0-2.377-1.927-4.305-4.305-4.305h-92.971c-2.377,0-4.304,1.928-4.304,4.305v16.737H64.916
                                    c-7.125,0-12.9,5.776-12.9,12.901V74.47h304.451V33.944C356.467,26.819,350.692,21.043,343.567,21.043z"/>
                            </g>
                        </g>
                    </svg>


                    Supprimer tous les accords
                </button>
                <ImportAccordComp texte="Importer des accords en csv" @csv-imported="importCsv"></ImportAccordComp>
                <ExportComp texte="Exporter des accords en csv" :link="config.apiUrl+'api/agreement/export'"></ExportComp>
            </div>
        </div>
          <!-- Partie ajout d'un accord -->
          <div class="my-20 px-4">
            <!-- En-tête inspiré de la DA d'accueil -->
            <div class="w-full max-w-3xl mx-auto pb-6 pt-8">
              <div class="relative">
                <!-- Fond décoratif -->
                <div class="absolute -left-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>

                <!-- Conteneur -->
                <div class="relative z-10">
                  <!-- Badge -->
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-xs font-medium mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6M9 16h6M8 8h8" />
                    </svg>
                    ADMINISTRATION
                  </div>

                  <!-- Titre -->
                  <div class="flex items-center gap-3 mb-3">
                    <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Ajouter un accord</h2>
                  </div>

                  <!-- Texte explicatif -->
                  <p class="text-base-content/60 text-sm max-w-lg mb-4">
                    Créez un nouvel accord international avec ses composantes, son université partenaire et toutes les informations nécessaires.
                  </p>

                  <!-- Séparateur -->
                </div>
              </div>
            </div>

            <!-- Formulaire -->
            <div class="max-w-3xl mx-auto card bg-base-100 shadow-xl p-6 rounded-2xl">
              <form @submit.prevent="addAgreement" class="space-y-4">
                <!-- ISCED -->
                <div>
                  <label class="label-text font-semibold">ISCED</label>
                  <select class="select select-bordered w-full select-primary" id="isced_select" v-model="newAgreement.isced">
                    <option disabled selected>Selectionnez un isced</option>
                    <option value="addNew"> + Créer un isced</option>
                    <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{isced.isc_code}}) {{ isced.isc_name }}</option>
                  </select>
                  <div v-if="newAgreement.isced === 'addNew'" class="mt-2 space-y-2">
                    <input type="number" placeholder="Code (ex: 061)" v-model="newAgreement.newisced.code" class="input input-bordered w-full" />
                    <input type="text" placeholder="Nom (ex: Information and Communication Technologies)" v-model="newAgreement.newisced.name" class="input input-bordered w-full" />
                  </div>
                </div>

                <!-- Composante -->
                <div>
                  <label class="label-text font-semibold">Composante</label>
                  <select class="select select-bordered w-full select-primary" id="compo_select" v-model="newAgreement.compo">
                    <option disabled selected>Selectionnez une composante</option>
                    <option value="addNew"> + Créer une composante</option>
                    <option v-if="composantes?.components" v-for="(compo, index) in composantes.components" :key="index" :value="compo.comp_id">{{ compo.comp_name }} ({{ compo.comp_shortname }})</option>
                  </select>
                  <div v-if="newAgreement.compo === 'addNew'" class="mt-2 space-y-2">
                    <input type="text" placeholder="Nom (ex: IUT Annecy)" v-model="newAgreement.newcompo.name" class="input input-bordered w-full" />
                    <input type="text" placeholder="Nom raccourci (ex: IUT-A)" v-model="newAgreement.newcompo.shortname" class="input input-bordered w-full" />
                  </div>
                </div>

                <!-- Université -->
                <div>
                  <label class="label-text font-semibold">Université</label>
                  <select class="select select-bordered w-full select-primary" id="univ_select" v-model="newAgreement.univ">
                    <option disabled selected>Selectionnez une université</option>
                    <option value="addNew"> + Créer une université</option>
                    <option v-if="universites?.length" v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">
                      ({{ univ.partnercountry?.parco_name || 'Pays inconnu' }}) {{ univ.univ_name }} à {{ univ.univ_city }}
                    </option>
                  </select>

                  <div v-if="newAgreement.univ === 'addNew'" class="mt-2 space-y-2">
                    <input type="text" placeholder="Nom (ex: Université Savoie Mont Blanc)" v-model="newAgreement.newuniv.name" class="input input-bordered w-full" />
                    <input type="text" placeholder="Ville (ex: Annecy)" v-model="newAgreement.newuniv.city" class="input input-bordered w-full" />
                    <select class="select select-bordered w-full select-primary" id="partnercountry_select" v-model="newAgreement.newuniv.partnercountry">
                      <option disabled selected>Selectionnez un pays</option>
                      <option value="addNew"> + Créer un pays</option>
                      <option v-for="(parco, index) in partnercountry" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                    </select>
                    <div v-if="newAgreement.newuniv.partnercountry === 'addNew'" class="space-y-2">
                      <input type="text" placeholder="Nouveau pays (ex: France)" v-model="newAgreement.newuniv.newpartnercountry" class="input input-bordered w-full" />
                      <input type="text" placeholder="Code pays (ex: fr, de, it)" v-model="newAgreement.newuniv.newpartnercountrycode" class="input input-bordered w-full" />
                    </div>
                  </div>
                </div>

                <!-- Type d'accord -->
                <div>
                  <label class="label-text font-semibold">Type d'accord</label>
                  <select class="select select-bordered w-full select-primary" id="typeaccord_select" v-model="newAgreement.typeaccord">
                    <option disabled selected>Selectionnez un type d'accord</option>
                    <option>Bilatéral</option>
                    <option>Erasmus</option>
                  </select>
                </div>

                <!-- Nombre de places -->
                <div>
                  <label class="label-text font-semibold">Nombre de places</label>
                  <input type="number" class="input input-bordered w-full" v-model="newAgreement.nbplace" />
                </div>

                <!-- Lien -->
                <div>
                  <label class="label-text font-semibold">Lien (facultatif)</label>
                  <input type="text" placeholder="Lien vers le site correspondant à l'accord" class="input input-bordered w-full" v-model="newAgreement.lien" />
                </div>

                <!-- Description -->
                <div>
                  <label class="label-text font-semibold">Description (facultatif)</label>
                  <input type="text" placeholder="Description de l'accord" class="input input-bordered w-full" v-model="newAgreement.description" />
                </div>

                <!-- Bouton -->
                <div class="pt-4 flex justify-center">
                  <button class="btn btn-primary btn-wide hover:scale-105 transition-transform">Ajouter l'accord</button>
                </div>
              </form>
            </div>
          </div>

            <!-- Partie liste des accords -->
            <div>
                <p class="font-bold text-xl mb-5">Liste des accords:</p>

                <!-- Partie filtre -->
                <div class="bg-base-100 rounded-lg shadow-lg w-full overflow-hidden border border-base-300" v-if="accords && accords.agreements">

                  <!-- En-tête -->
                  <div class="bg-base-300 p-4">
                  <h3 class="font-bold text-lg select-none">Filtres des Accords</h3>
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
                      Tout désélectionner
                    </button>
                    <p class="text-sm select-none">
                      {{ filteredAccords.length }} résultats
                      <span v-if="selectedDepartments.length + selectedCountries.length + selectedComponent.length > 0">
                        ({{ selectedDepartments.length + selectedCountries.length + selectedComponent.length }}
                        filtre{{ selectedCountries.length + selectedDepartments.length + selectedComponent.length > 1 ? 's' : '' }})
                      </span>
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
                        <span v-if="selectedCountries.length" class="badge badge-sm">{{ selectedCountries.length }}</span>
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
                        Tout désélectionner
                      </button>

                      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div
                          v-for="(country, index) in partnercountry"
                          :key="index"
                          class="flex items-center"
                        >
                          <label
                            :for="'filt_pays_' + index"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                          >
                            <input
                              :id="'filt_pays_' + index"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              :value="country.parco_name"
                              v-model="selectedCountries"
                            />
                            <span class="fi mr-2" :class="'fi-' + country.parco_code"></span>
                            <span class="text-sm select-none">{{ country.parco_name }}</span>
                          </label>
                        </div>
                      </div>
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
                        <span v-if="selectedDepartments.length" class="badge badge-sm">{{ selectedDepartments.length }}</span>
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
                        Tout désélectionner
                      </button>

                      <div v-for="(comp, index) in composantes.components" :key="index" class="mb-4">
                        <p class="font-medium text-sm mb-2 select-none">{{ comp.comp_name }}</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                          <div
                            v-for="(dept, deptIndex) in comp.departments"
                            :key="deptIndex"
                          >
                            <label
                              :for="'filt_dept_' + deptIndex"
                              class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                            >
                              <input
                                :id="'filt_dept_' + deptIndex"
                                type="checkbox"
                                class="checkbox checkbox-sm mr-2"
                                :value="dept.dept_shortname"
                                v-model="selectedDepartments"
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

                  <!-- Section Composante -->
                  <div class="border-b border-base-300">
                    <div
                      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                      @click="toggleCollapse('component')"
                    >
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        <span class="font-medium select-none">Composante</span>
                        <span v-if="selectedComponent.length" class="badge badge-sm">{{ selectedComponent.length }}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-transform duration-200"
                        :class="isOpen.component ? 'rotate-180' : ''"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.component">
                      <button
                        class="btn btn-xs btn-ghost mb-3"
                        @click="deselectAllComp"
                      >
                        Tout désélectionner
                      </button>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div
                          v-for="(compo, index) in composantes.components"
                          :key="index"
                          class="flex items-center"
                        >
                          <label
                            :for="'filt_compo_' + index"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              :id="'filt_compo_' + index"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              :value="compo.comp_name"
                              v-model="selectedComponent"
                            />
                            <span class="text-sm select-none">{{ compo.comp_name }}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Section Champs vides -->
                  <div>
                    <div
                      class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
                      @click="toggleCollapse('unknown')"
                    >
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <span class="font-medium select-none">Champs vides</span>
                        <span v-if="selectedUnknowns.length" class="badge badge-sm">{{ selectedUnknowns.length }}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 transition-transform duration-200"
                        :class="isOpen.unknown ? 'rotate-180' : ''"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    <div class="p-4 pt-0 bg-base-100" v-show="isOpen.unknown">
                      <button
                        class="btn btn-xs btn-ghost mb-3"
                        @click="deselectAllUnkn"
                      >
                        Tout désélectionner
                      </button>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_1"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_1"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="component.comp_id"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Composante</span>
                          </label>
                        </div>
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_2"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_2"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="university.univ_id"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Université</span>
                          </label>
                        </div>
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_3"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_3"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="departments"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Départements</span>
                          </label>
                        </div>
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_4"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_4"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="isced.isc_id"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Isced</span>
                          </label>
                        </div>
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_5"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_5"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="agree_lien"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Lien</span>
                          </label>
                        </div>
                        <div class="flex items-center">
                          <label
                            for="filt_unknown_6"
                            class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                          >
                            <input
                              id="filt_unknown_6"
                              type="checkbox"
                              class="checkbox checkbox-sm mr-2"
                              value="agree_description"
                              v-model="selectedUnknowns"
                            />
                            <span class="text-sm select-none">Description</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Liste -->
                <div>
                  <div v-if="filteredAccords.length > 0" class="grid gap-6">
                    <div
                      v-for="(accord, indexAccord) in filteredAccords"
                      :key="indexAccord"
                      class="bg-base-100 shadow-md rounded-xl p-5 border border-base-300"
                    >
                      <!-- En-tête Accord -->
                      <div class="flex items-start gap-4 mb-3">
                        <!-- Drapeau ou fallback -->
                        <span class="tooltip" :data-tip="accord.partnercountry?.parco_name || 'Introuvable'">
                          <span class="relative inline-block">
                            <span class="fi text-4xl" :class="'fi-' + (accord.partnercountry?.parco_code || '')"></span>
                            <template v-if="!accord.partnercountry?.parco_code">
                              <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">?</span>
                            </template>
                          </span>
                        </span>

                        <!-- Infos principales -->
                        <div class="flex-1">
                          <p class="font-bold text-lg">
                            {{ accord.university?.univ_name || 'Université non disponible' }}
                          </p>
                          <p class="text-sm text-base-content/70">
                            à {{ accord.university?.univ_city || 'Ville non disponible' }} – {{ accord.partnercountry?.parco_name || 'Pays non disponible' }}
                          </p>
                          <p class="text-sm mt-1">
                            <strong>Type :</strong> {{ accord.agree_typeaccord || 'Non spécifié' }},
                            <strong>Places :</strong> {{ accord.agree_nbplace ?? 'Non spécifié' }}
                          </p>
                          <p class="text-sm text-base-content/70 mt-1">
                            [{{ accord.isced?.isc_code || 'ISCED manquant' }} - {{ accord.isced?.isc_name || 'Nom ISCED manquant' }}]
                            – Composante : {{ accord.component?.comp_name || 'Non disponible' }} (ID: {{ accord.agree_id }})
                          </p>
                        </div>

                        <!-- Actions accord -->
                        <div class="flex gap-2">
                          <!-- Modifier -->
                          <label @click="ModifAccord(accord)" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3 rounded">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                              <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                          </label>

                          <!-- Supprimer -->
                          <button @click="openConfirmModal(accord)" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Lien vers université -->
                      <div v-if="accord.agree_lien" class="mt-1">
                        <a :href="accord.agree_lien" target="_blank" class="text-primary hover:underline text-sm">
                          🌐 Site de l’université
                        </a>
                      </div>

                      <!-- Description + Note -->
                      <div class="mt-2 text-sm text-base-content/80">
                        <p><strong>Description :</strong> {{ accord.agree_description || 'Aucune' }}</p>
                        <p v-if="accord.agree_note"><strong>Note :</strong> {{ accord.agree_note }}</p>
                      </div>

                      <!-- Départements -->
                      <div class="mt-4 justify-between flex">
                        <div>
                          <p class="text-sm font-medium mb-1">Départements :</p>
                          <div class="flex flex-wrap gap-2">
                            <div
                              v-for="(dept, indexDept) in accord.departments"
                              :key="indexDept"
                              class="flex items-center gap-2 px-2 py-1 rounded select-none"
                              :class="{ 'opacity-50': dept.pivot?.deptagree_valide === 0 }"
                              :style="{ backgroundColor: dept.dept_color || '#ddd' }"
                              :data-tip="(dept.pivot?.deptagree_valide === 0 ? '(INVISIBLE) ' : '') + dept.dept_name"
                            >
                              <span class="font-bold text-xs">{{ dept.dept_shortname }}</span>
                              <!-- Œil (visibilité) -->
                              <button class="hover:opacity-60 hover:cursor-pointer flex items-center justify-center ml-2"
                                @click="changeVisibility(accord.agree_id, dept.dept_id, dept.pivot?.deptagree_valide, dept.dept_shortname)">
                                <svg v-if="dept.pivot?.deptagree_valide === 1" class="stroke-current shrink-0 h-5 w-5" fill="currentColor" height="24px" width="24px"
                                  version="1.1" viewBox="0 0 488.85 488.85">
                                  <g>
                                    <path d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1
                                      c62.5,83.1,147.2,134.2,240.6,134.2s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1
                                      C422.525,149.825,337.825,98.725,244.425,98.725z
                                      M251.125,347.025c-62,3.9-113.2-47.2-109.3-109.3
                                      c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
                                      C343.725,302.225,302.225,343.725,251.125,347.025z
                                      M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8
                                      c1.7-27.6,24.1-49.9,51.7-51.7c33.4-2.1,61,25.4,58.8,58.8
                                      C297.925,275.625,275.525,297.925,248.025,299.625z"/>
                                  </g>
                                </svg>
                                <svg v-else class="stroke-current shrink-0 h-5 w-5" fill="currentColor" height="24px" width="24px" viewBox="0 0 488.85 488.85">
                                  <g>
                                    <path d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1
                                      c62.5,83.1,147.2,134.2,240.6,134.2s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1
                                      C422.525,149.825,337.825,98.725,244.425,98.725z
                                      M251.125,347.025c-62,3.9-113.2-47.2-109.3-109.3
                                      c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
                                      C343.725,302.225,302.225,343.725,251.125,347.025z
                                      M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8
                                      c1.7-27.6,24.1-49.9,51.7-51.7c33.4-2.1,61,25.4,58.8,58.8
                                      C297.925,275.625,275.525,297.925,248.025,299.625z"/>
                                    <line x1="100" y1="100" x2="400" y2="400" style="stroke:currentColor;stroke-width:40"/>
                                  </g>
                                </svg>
                              </button>

                              <!-- Supprimer le département -->
                              <button class="hover:opacity-60 hover:cursor-pointer  flex items-center justify-center ml-1"
                                @click="removeDeptFromAgreement(accord.agree_id, dept.dept_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <span class="bg-base-200 text-sm px-3 py-1 rounded hover:cursor-pointer hover:opacity-70" @click="showForm(accord.agree_id)">
                              ➕ Ajouter un département
                            </span>
                          </div>
                        </div>
                        <div class="self-end">
                          <label @click="modifAccordDocuments(accord)" for="modal_doc" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" 
                            viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 3.76196C11.6821 3.76196 11.3643 3.70213 11.0659 3.58246C10.3824 3.30825 9.44765 3 8.7 3C7.74623 3 6.48805 3.50164 5.83514 3.79431C5.54597 3.92393 5.23384 3.99513 4.91731 4.01038C3.35289 4.0857 3 4.59602 3 6.39995V18.6C3 20.4039 3.35289 20.9142 4.91729 20.9896C5.23383 21.0048 5.54598 20.924 5.83516 20.7943C6.48807 20.5017 7.74624 20 8.7 20C9.44764 20 10.3823 20.3083 11.0659 20.5825C11.3642 20.7022 11.6821 20.762 12 20.762V3.76196Z"/> 
                            <path d="M3 6.39995C3 4.59602 3.35289 4.0857 4.91731 4.01038C5.23384 3.99513 5.54597 3.92393 5.83515 3.79431C6.48805 3.50164 7.74623 3 8.7 3C9.44765 3 10.3824 3.30825 11.0659 3.58246C11.6626 3.8218 12.3374 3.8218 12.9341 3.58246C13.6176 3.30825 14.5523 3 15.3 3C16.2538 3 17.512 3.50164 18.1649 3.79431C18.454 3.92393 18.7662 3.99513 19.0827 4.01038C20.6471 4.0857 21 4.59602 21 6.39995V18.6C21 20.4039 20.6471 20.9142 19.0827 20.9896C18.7662 21.0048 18.454 20.924 18.1648 20.7943C17.5119 20.5017 16.2538 20 15.3 20C14.5524 20 13.6177 20.3083 12.9341 20.5825C12.3374 20.8218 11.6626 20.8218 11.0659 20.5825C10.3823 20.3083 9.44764 20 8.7 20C7.74624 20 6.48807 20.5017 5.83516 20.7943C5.54598 20.924 5.23383 21.0048 4.91729 20.9896C3.35289 20.9142 3 20.4039 3 18.6V6.39995Z" stroke="#323232" stroke-width="2"/>
                          </svg>
                          </label>
                        </div>
                      </div>

                      <!-- Formulaire pour ajouter un département -->
                      <div v-if="showForms[accord.agree_id]" class="mt-4">
                        <form @submit.prevent="submitForm(accord.agree_id)" class="flex items-center gap-2 flex-wrap">
                          <select
                              class="select select-bordered w-full max-w-xs"
                              v-model="selectedDepartment[accord.agree_id]"
                          >
                            <option disabled selected>Selectionnez un département</option>
                            <option
                                v-for="(dept, indexDept) in filteredDepartments(accord)"
                                :key="indexDept"
                                :value="dept.dept_id"
                                :style="{ color: dept.dept_color + ' !important' }"
                            >
                              ({{ dept.component?.comp_name || 'Non disponible' }}) {{ dept.dept_shortname }}
                            </option>
                          </select>
                          <button class="btn btn-sm btn-primary" type="submit">Ajouter</button>
                          <button class="btn btn-sm btn-neutral" @click="showForm(accord.agree_id)">Annuler</button>
                        </form>
                      </div>
                    </div>
                  </div>
                
                  <div v-else>
                    <p class="text-center py-20">Aucun accord trouvé.</p>
                  </div>
                </div>

                <!-- MODAL CONFIRMATION SUPPRESSION TOUS LES ACCORDS -->
                <Teleport to="body">
                  <dialog id="confirmModalDeleteAll" ref="confirmModalDeleteAll" class="modal">
                    <div class="modal-box max-w-full w-150 rounded-2xl border border-base-300 shadow-xl">
                      <h3 class="text-xl font-bold">Confirmer la suppression ?</h3>
                      <p class="text-sm text-base-content/70 mt-2">Cette action supprimera tous les accords, l’arbitrage en cours ainsi que tous les vœux étudiants.</p>
                      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

                      <p>Confirmez vous la suppression de tous les accords ?</p>
                      <p>Cela entraînera la suppression de l'arbitrage actuel ainsi que de tous les vœux des étudiants.</p>
                      <p v-if="isConfirmDisabled.bool">Veuillez patienter {{ isConfirmDisabled.time }} secondes avant de confirmer.</p>

                      <div class="modal-action mt-6">
                        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
                        <button class="btn btn-error" @click="deleteAll()" :disabled="isConfirmDisabled.bool">Supprimer</button>
                      </div>
                    </div>
                  </dialog>
                </Teleport>

                <!-- MODAL MODIFICATION ACCORD -->
                <Teleport to="body">
                  <dialog id="modifAccordModal" ref="modifAccordModal" class="modal">
                    <div class="modal-box max-w-full w-150 rounded-2xl border border-base-300 shadow-xl">
                      <h3 class="text-xl font-bold">Modification de l'accord</h3>
                      <p class="text-sm text-base-content/70 mt-2">Modifiez les informations liées à cet accord d’échange.</p>
                      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

                      <!-- Affichage accord -->
                      <div class="bg-base-300 flex items-center justify-center h-20 w-full select-none rounded-md">
                        <span class="tooltip mr-2" :data-tip="currentAccordModif?.accord?.partnercountry?.parco_name || 'Introuvable'">
                          <span class="relative inline-block">
                            <span class="fi text-5xl" :class="'fi-' + (currentAccordModif?.accord?.partnercountry?.parco_code || '')"></span>
                            <template v-if="!currentAccordModif?.accord?.partnercountry?.parco_code">
                              <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white">?</span>
                            </template>
                          </span>
                        </span>
                        <div class="flex flex-col w-full">
                          <p><strong>{{ currentAccordModif?.accord?.university?.univ_name || 'Université indisponible' }}</strong> à {{ currentAccordModif?.accord?.university?.univ_city || 'Ville indisponible' }} ({{ currentAccordModif?.accord?.partnercountry?.parco_name || 'Pays indisponible' }})</p>
                          <p>[{{ currentAccordModif?.accord?.isced?.isc_code || 'Code ISCED non disponible' }} - {{ currentAccordModif?.accord?.isced?.isc_name || 'Nom ISCED non disponible' }}] Composante: {{ currentAccordModif?.accord?.component?.comp_name || 'Indisponible' }}</p>
                        </div>
                      </div>

                      <!-- Formulaire -->
                      <form class="w-full space-y-3 mt-4">
                        <label class="form-control w-full">
                          <div class="label"><span class="label-text">Isced</span></div>
                          <select class="select select-bordered w-full select-primary" v-model="currentAccordModif.isc_id">
                            <option :value="null">Aucun isced</option>
                            <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{ isced.isc_code }}) {{ isced.isc_name }}</option>
                          </select>
                        </label>

                        <div class="flex gap-4">
                          <label class="form-control w-full">
                            <div class="label"><span class="label-text">Composante</span></div>
                            <select class="select select-bordered w-full select-primary" v-model="currentAccordModif.comp_id">
                              <option :value="null">Aucune composante</option>
                              <option v-for="(compo, index) in composantes.components" :key="index" :value="compo.comp_id">{{ compo.comp_name }} ({{ compo.comp_shortname }})</option>
                            </select>
                          </label>
                          <label class="form-control w-full">
                            <div class="label"><span class="label-text">Type accord</span></div>
                            <select class="select select-bordered w-full select-primary" v-model="currentAccordModif.agree_typeaccord">
                              <option :value="null">Aucun type d'accord</option>
                              <option>Bilatéral</option>
                              <option>Erasmus</option>
                            </select>
                          </label>
                          <label class="form-control w-full">
                            <div class="label"><span class="label-text">Nombre de places</span></div>
                            <input type="number" class="input input-bordered w-full" v-model="currentAccordModif.agree_nbplace" />
                          </label>
                        </div>

                        <label class="form-control w-full">
                          <div class="label"><span class="label-text">Université</span></div>
                          <select class="select select-bordered w-full select-primary" v-model="currentAccordModif.univ_id">
                            <option :value="null">Aucune université</option>
                            <option v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }} ({{ univ.univ_city }} - {{ univ.partnercountry.parco_name }})</option>
                          </select>
                        </label>

                        <label class="form-control w-full">
                          <div class="label"><span class="label-text">Lien (facultatif)</span></div>
                          <input type="text" class="input input-bordered w-full" v-model="currentAccordModif.agree_lien" />
                        </label>

                        <label class="form-control w-full">
                          <div class="label"><span class="label-text">Description (facultatif)</span></div>
                          <input type="text" class="input input-bordered w-full" v-model="currentAccordModif.agree_description" />
                        </label>

                        <label class="form-control w-full">
                          <div class="label"><span class="label-text">Note (facultatif & invisible)</span></div>
                          <input type="text" class="input input-bordered w-full" v-model="currentAccordModif.agree_note" />
                        </label>
                      </form>

                      <div class="modal-action mt-6">
                        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
                        <button class="btn btn-primary" @click="ConfirmModifAccord()">Modifier</button>
                      </div>
                    </div>
                  </dialog>
                </Teleport>

                <!-- Modal de confirmation suppression d'accord -->
                <Teleport to="body">
                  <dialog id="confirmModal" ref="confirmModal" class="modal">
                    <div class="modal-box max-w-full w-150 rounded-2xl border border-base-300 shadow-xl">
                      <h3 class="text-xl font-bold">Confirmer la suppression ?</h3>
                      <p class="text-sm text-base-content/70 mt-2">Cette action supprimera définitivement l’accord sélectionné.</p>
                      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

                      <div class="bg-base-300 flex items-center justify-center h-20 w-full select-none rounded-md mt-4">
                        <span class="tooltip mr-2" :data-tip="confirmDeleteAccord.partnercountry?.parco_name || 'Introuvable'">
                          <span class="relative inline-block">
                            <span class="fi text-5xl" :class="'fi-' + (confirmDeleteAccord.partnercountry?.parco_code || '')"></span>
                            <template v-if="!confirmDeleteAccord.partnercountry?.parco_code">
                              <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white">?</span>
                            </template>
                          </span>
                        </span>
                        <div class="flex flex-col w-full">
                          <p class="font-semibold">{{ confirmDeleteAccord?.university?.univ_name || 'Université indisponible' }}</p>
                          <p>{{ confirmDeleteAccord?.university?.univ_city || 'Ville indisponible' }} ({{ confirmDeleteAccord?.partnercountry?.parco_name || 'Pays indisponible' }})</p>
                          <p>[{{ confirmDeleteAccord?.isced?.isc_code || 'Code ISCED non dispo' }} - {{ confirmDeleteAccord?.isced?.isc_name || 'Nom ISCED non dispo' }}] Composante : {{ confirmDeleteAccord?.component?.comp_name || 'Indisponible' }}</p>
                        </div>
                      </div>

                      <div class="modal-action mt-6">
                        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
                        <button class="btn btn-error" @click="deleteAgreement(confirmDeleteAccord.university?.univ_name || 'Université indisponible', confirmDeleteAccord.agree_id)">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </dialog>
                </Teleport>


                <!-- Modal d'import d'accord -->
                <Teleport to="body">
                  <dialog id="modalAjoutAccords" ref="modalAjoutAccords" class="modal">
                    <div class="modal-box max-w-full w-150 rounded-2xl border border-base-300 shadow-xl">
                      <h3 class="text-xl font-bold">Import d'accord</h3>
                      <p class="text-sm text-base-content/70 mt-2">Ajoutez plusieurs accords à partir d’un fichier CSV exporté.</p>
                      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

                      <p class="mb-2">Note : les problèmes d'accent, comme le symbole "�", pourraient venir du format du fichier CSV.</p>
                      <p>Choisissez le format <strong>CSV UTF-8 (délimité par des virgules)</strong>.</p>
                      <p class="mt-2">Nombre d'accords sélectionnés : <strong>{{ exportModal.filter(accord => accord.add).length }}</strong></p>

                      <div class="my-4">
                        <button class="hover:opacity-70 underline" @click="selectAll">Tout sélectionner</button>
                        <button class="hover:opacity-70 ml-2 underline" @click="deselectAll">Tout désélectionner</button>
                      </div>

                      <div>
                        <div v-for="(accord, index) in exportModal" :key="index"
                            :class="{ 'bg-base-200': !accord.add, 'bg-base-300': accord.add }"
                            class="flex select-none my-2 items-center cursor-pointer rounded-md px-2 py-1"
                            @click="accord.add = !accord.add">
                          <input type="checkbox" v-model="accord.add"
                                class="opacity-70 checkbox checkbox-sm m-2 hover:opacity-50 hover:scale-110 transition-all" />
                          <span class="mr-2 flex items-center justify-center">
                            <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out"
                                  :class="'fi-'+ getCountryCode(accord.Pays)"></span>
                          </span>
                          <div class="flex flex-col">
                            <p class="font-bold">({{ accord.Pays }}) {{ accord.Ville || 'Aucune ville' }} - {{ accord.Universite || 'Aucune université' }}</p>
                            <p>({{ accord.Isced || 'Aucun ISCED' }}) {{ accord.Composante || 'Aucune composante' }} - {{ accord.Departements || 'Aucun départements' }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="modal-action mt-6">
                        <button class="btn btn-ghost" @click="closeModalImport">Annuler</button>
                        <button class="btn btn-success" @click="confirmImportAccord">Confirmer</button>
                      </div>
                    </div>
                  </dialog>
                </Teleport>

                <!-- MODAL GESTION DOCUMENTS ACCORD -->
                <Teleport to="body">
                  <input type="checkbox" id="modal_doc" class="modal-toggle" />
                  <div class="modal" role="dialog">
                    <div class="modal-box max-w-full w-150 rounded-2xl border border-base-300 shadow-xl">
                      <h3 class="text-xl font-bold">Modification de l'accord n° {{ currentAccordModif.agree_id }}</h3>
                      <p class="text-sm text-base-content/70 mt-2">Modifiez les documents liées à cet accord d’échange.</p>
                      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

                      <!-- Documents de l'université -->
                      <div class="bg-base-300 h-300 w-full select-none rounded-md">
                        <h4 class="mb-2 font-bold">Documents de l'université</h4>
                        <div class="flex items-center justify-center mb-2">
                          <span class="tooltip mr-2" :data-tip="currentAccordModif?.partnercountry?.parco_name || 'Introuvable'">
                            <span class="relative inline-block">
                              <span class="fi text-5xl" :class="'fi-' + (currentAccordModif?.partnercountry?.parco_code || '')"></span>
                              <template v-if="!currentAccordModif?.partnercountry?.parco_code">
                                <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white">?</span>
                              </template>
                            </span>
                          </span>
                          <div class="flex flex-col w-full">
                            <p><strong>{{ currentAccordModif?.university?.univ_name || 'Université indisponible' }}</strong> à {{ currentAccordModif?.university?.univ_city || 'Ville indisponible' }} ({{ currentAccordModif?.partnercountry?.parco_name || 'Pays indisponible' }})</p>
                            <p>[{{ currentAccordModif?.isced?.isc_code || 'Code ISCED non disponible' }} - {{ currentAccordModif?.isced?.isc_name || 'Nom ISCED non disponible' }}] Composante: {{ currentAccordModif?.component?.comp_name || 'Indisponible' }}</p>
                          </div>
                        </div>
                      
                        <div class="flex items-center justify-center">
                          <select v-model="modifiedArticleFiles" class="select select-bordered w-5/6 select-primary mb-2" id="file_select" multiple>
                          <div v-for="(document, index) in currentAgreeUnivDoc.documents" class="flex justify-between">
                            <p>{{ document.doc_name }}</p>
                          </div> 
                        </select>
                        </div>
                      </div>

                      <!-- Formulaire -->
                      <form @submit.prevent="addDocuments" class="space-y-4" enctype="multipart/form-data">
                        <!--Formulaire rajouté pour ajout de documents-->
                        <p class="font-semibold text-md mb-2 text-start w-full pt-3 pl-3">Importer de nouveaux fichiers</p>
                        <div class="flex w-full">
                            <input type="file" accept=".pdf, .xls, .xlsx, .pptx, .docx, .odt" @change="handleFileInputChangeDocument($event)" class="file-input file-input-bordered min-w-2xl w-full" id="file_add" multiple/>
                        </div>

                        <p class="text-md mb-2 text-start w-full pt-3 pl-3">Nouveaux documents importés / documents à écraser : </p>
                        <div class="w-full mb-4 pl-3">
                            <span v-for="file in recapNewDoc">{{ file }}, </span>
                        </div>

                        <p class="font-semibold text-md mb-2 text-start w-full pt-3 pl-3">Fichiers de l'accord : </p>
                        <select v-model="modifiedArticleFiles" class="select select-bordered w-full select-primary h-200px" id="file_select" multiple>
                          <div v-for="(document, index) in currentAgreeDoc.documents" class="flex justify-between">
                            <p>{{ document.doc_name }}</p>
                            
                            <button
                              @click="deleteDocument(document)" type="button"
                              class="btn btn-xs btn-circle btn-ghost text-error hover:bg-error hover:text-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>

                          </div> 
                        </select>

                        <div class="modal-action mt-6">
                          <label for="modal_doc" class="btn btn-ghost" @click="resetModifDocuments">Retour</label>
                          <button type="submit">
                            <label for="" class="btn btn-primary">Modifier documents</label>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Teleport>

            </div>
            
        </div>
        <LoadingComp v-else></LoadingComp>
    </div>
</template>

<script setup>
  import { ref, onMounted, computed, nextTick, watch  } from 'vue';
  import config from '../../config'
  import { request } from '../../composables/httpRequest';
  import { useAccountStore } from '../../stores/accountStore';
  import { addAlert } from '../../composables/addAlert';
  import LoadingComp from '../../components/utils/LoadingComp.vue';
  import ImportAccordComp from '../../components/impexp/ImportAccordComp.vue';
  import ExportComp from '../../components/impexp/ExportComp.vue';
  import { addAction } from '../../composables/actionType';
  const accountStore = useAccountStore();
  const response = ref([]);

  const accords = ref([]);
  const selectedDepartments = ref([]);
  const selectedComponent = ref([]);
  const selectedCountries = ref([]);
  const selectedUnknowns = ref([]);

  const currentAccordModif = ref([]);

  const confirmDeleteAccord = ref([])
  
  const exportModal = ref([])
  const importFinalAccord = ref([])
  const isConfirmDisabled = ref({
    time: 0,
    bool: true,
    countdown: null
  });

  const isLoaded = ref(false)
  const isceds = ref([]);
  const composantes = ref([]);
  const universites = ref([]);
  const departments = ref([]);
  const partnercountry = ref([]);
  const newAgreement = ref({ 
    isced: '', //Si addNew = nouveau isced
    compo: '', //Si addNew = nouveau composante
    univ: '', //Si addNew = nouveau univiserte
    typeaccord: '',
    nbplace: 0,
    lien: null,
    description: null,

    newisced: {code: 0, name: ''},
    newcompo: {name: '', shortname: ''},
    newuniv: {
      partnercountry: '', //Si addNew = nouveau pays partenaire
      name: '', 
      city: '', 
      newpartnercountry: '',
      newpartnercountrycode: ''
    },
  });
  const isOpen = ref({
    pays: false,
    departments: false,
    component: false,
    unknown: false,
  });

  const currentAgreeDoc = ref([]);
  const currentAgreeUnivDoc = ref([]);
  const recapNewDoc = ref([]);
  const newfiles = ref([]);

    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(accord) {
        confirmDeleteAccord.value = accord;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }

    // Modification d'accord et ouverture modal
    function ModifAccord(accord){
        currentAccordModif.value.accord = accord;
        currentAccordModif.value.agree_id = accord.agree_id || null;
        currentAccordModif.value.parco_id = accord.partnercountry ? accord.partnercountry.parco_id : null; 
        currentAccordModif.value.univ_id = accord.university ? accord.university.univ_id : null; 
        currentAccordModif.value.isc_id = accord.isced ? accord.isced.isc_id : null; 
        currentAccordModif.value.comp_id = accord.component ? accord.component.comp_id : null;
        currentAccordModif.value.agree_typeaccord = accord.agree_typeaccord || null;
        currentAccordModif.value.agree_description = accord.agree_description || null;
        currentAccordModif.value.agree_note = accord.agree_note || null;
        currentAccordModif.value.agree_nbplace = accord.agree_nbplace != null ? accord.agree_nbplace : 0;
        currentAccordModif.value.agree_lien = accord.agree_lien || null;

        const modal = document.getElementById('modifAccordModal')
        modal.showModal();
    }
    
    //Confirmation de modification du modal
    async function ConfirmModifAccord(){
        const requestData = {
            agree_typeaccord: currentAccordModif.value.agree_typeaccord,
            agree_nbplace: currentAccordModif.value.agree_nbplace,
        };

        // Vérification du nombre de places
        if (currentAccordModif.value.agree_nbplace < 0) {
            addAlert('error', { data: { error: 'Le nombre de places doit être supérieur ou égal à zéro.', message: 'Modification de l\'accord annulée.' } });
            return;
        }

        if (currentAccordModif.value.agree_lien != null) {
            requestData.agree_lien = currentAccordModif.value.agree_lien;
        }
        if (currentAccordModif.value.agree_description != null) {
            requestData.agree_description = currentAccordModif.value.agree_description;
        }

        if (currentAccordModif.value.agree_note != null) {
            requestData.agree_note = currentAccordModif.value.agree_note;
        }

        requestData.isc_id = currentAccordModif.value.isc_id;
        requestData.comp_id = currentAccordModif.value.comp_id;
        requestData.univ_id = currentAccordModif.value.univ_id;

        // Effectuer la requête PUT pour mettre à jour l'accord
        await request('PUT', true, response, config.apiUrl + 'api/agreement/' + currentAccordModif.value.agree_id, requestData);
        fetchAccords();
        closeModal();

    }

    //ouvrir le modal de confirmation de suppression
    function openConfirmModalDeleteAll() {
        const modal = document.getElementById('confirmModalDeleteAll')
        modal.showModal()
        isConfirmDisabled.value.bool = true;
        isConfirmDisabled.value.time = 3;

        isConfirmDisabled.value.countdown = setInterval(() => {
            isConfirmDisabled.value.time -= 1;

            if (isConfirmDisabled.value.time <= 0) {
                clearInterval(isConfirmDisabled.value.countdown);
                isConfirmDisabled.value.bool = false;
            }
        }, 1000);
    }

    //Fermer les modals
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
        const modal2 = document.getElementById('confirmModalDeleteAll')
        modal2.close()
        const modal3 = document.getElementById('modifAccordModal')
        modal3.close()
        clearInterval(isConfirmDisabled.value.countdown)
    }

    //Fermer le modal d'importation
    function closeModalImport() {
        const modal = document.getElementById('modalAjoutAccords')
        exportModal.value = [];
        modal.close()
    }

    // Fonction d'importation CSV
    const importCsv = (data) => {
        exportModal.value = data.map(accord => ({
            ...accord,
            add: accord.add !== undefined ? accord.add : true // Assurez-vous que 'add' est défini
        }));
        const modal = document.getElementById('modalAjoutAccords');
        modal.showModal();
    };

    // Confirmer l'import d'accords
    async function confirmImportAccord() {
        const newAccords = exportModal.value.filter(accord => accord.add);

        const existingUniversities = universites.value.reduce((acc, uni) => {
            acc[uni.univ_name.trim().toLowerCase()] = uni.univ_id;
            return acc;
        }, {});

        const existingIsceds = isceds.value.reduce((acc, isc) => {
            acc[isc.isc_code.trim().toLowerCase()] = acc[isc.isc_code.trim().toLowerCase()] || [];
            acc[isc.isc_code.trim().toLowerCase()].push(isc);
            return acc;
        }, {});

        const existingComponents = composantes.value.components.reduce((acc, comp) => {
            acc[comp.comp_shortname.trim().toLowerCase()] = comp;
            return acc;
        }, {});

        const existingPartnerCountries = partnercountry.value.reduce((acc, country) => {
            acc[country.parco_name.trim().toLowerCase()] = country.parco_id;
            return acc;
        }, {});

        const existingDepartments = departments.value.departments.reduce((acc, dept) => {
            acc[dept.dept_shortname.trim().toLowerCase()] = dept;
            return acc;
        }, {});

        function isSimilar(a, b) {
            if (!a || !b) return false;
            const normalizedA = a.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            const normalizedB = b.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            return normalizedA === normalizedB;
        }

        importFinalAccord.value = {
            agreements: newAccords.map(newAccord => {
                const extractedIscedParts = (newAccord.Isced || '').split(' - ');
                const extractedIscedCode = extractedIscedParts[0]?.trim().toLowerCase();

                const existingUniId = existingUniversities[newAccord.Universite?.trim().toLowerCase()] || null;
                const existingIscedId = existingIsceds[extractedIscedCode]?.[0]?.isc_id || null;

                let existingCompId = null;
                const existingComp = Object.values(existingComponents).find(comp =>
                    isSimilar(newAccord.Composante?.trim().toLowerCase(), comp.comp_shortname.trim().toLowerCase())
                );

                if (existingComp) {
                    existingCompId = existingComp.comp_id;
                }

                const existingCountryId = existingPartnerCountries[newAccord.Pays?.trim().toLowerCase()] || null;

                // Traitement des départements
                const extractedDepartments = (newAccord.Departements || '').split(' - ').map(dept => dept.trim().toLowerCase());
                const departmentList = extractedDepartments.map(deptShortname => {
                    const existingDept = Object.values(existingDepartments).find(department =>
                        isSimilar(deptShortname, department.dept_shortname.trim().toLowerCase())
                    );

                    if (existingDept) {
                        return { dept_id: existingDept.dept_id }; // Utiliser l'ID existant
                    } else {
                        return { dept_id: null, dept_shortname: deptShortname }; // Nouveau département
                    }
                });

                return {
                    agree_lien: newAccord.Lien || null,
                    agree_nbplace: parseInt(newAccord.Nombre_de_place, 10) || 0,
                    agree_typeaccord: newAccord.Type_accord || null,
                    agree_description: newAccord.Description || null,
                    isced: { isc_id: existingIscedId, isc_code: extractedIscedCode, isc_name: extractedIscedParts[1]?.trim() || null },
                    university: { univ_id: existingUniId, univ_name: newAccord.Universite, univ_city: newAccord.Ville, parco_id: existingCountryId },
                    component: { comp_id: existingCompId || null, comp_shortname: newAccord.Composante },
                    partnercountry: { parco_id: existingCountryId, parco_name: newAccord.Pays },
                    departments: departmentList // Liste des départements formatée
                };
            })
        };

        console.log(importFinalAccord.value);
        await request('POST', true, response, config.apiUrl + 'api/agreementexp', importFinalAccord.value);
        if (response.value.status === 201) {
            addAction(accountStore.account.acc_id, 'agreement', response, 'Importation de ' + importFinalAccord.value.agreements.length + ' accords.');
            
        }
        closeModalImport();
        fetchAll();
    }

    // Fonction pour charger les filtres depuis sessionStorage sous acc_dashboard
    function loadFilters() {
        const accDashboardFilters = sessionStorage.getItem('acc_dashboard');
        
        if (accDashboardFilters) {
            const filters = JSON.parse(accDashboardFilters);

            if (filters.selectedDepartment) {
                selectedDepartment.value = filters.selectedDepartment;
                if(selectedDepartment.value != '')
                    isOpen.value.departments = true; 
            }
            if (filters.selectedComponent) {
                selectedComponent.value = filters.selectedComponent;
                if(selectedComponent.value != '')
                    isOpen.value.component = true; 
            }
            if (filters.selectedCountries) {
                selectedCountries.value = filters.selectedCountries;
                if(selectedCountries.value != '')
                    isOpen.value.pays = true;
            }
            if (filters.selectedUnknowns) {
                selectedUnknowns.value = filters.selectedUnknowns;
                if(selectedUnknowns.value != '')
                    isOpen.value.unknown = true; 
            }
        }
    }

    // Fonction pour sauvegarder les filtres dans sessionStorage sous acc_dashboard
    function saveFilters() {
        const filters = {
            selectedDepartment: selectedDepartment.value,
            selectedComponent: selectedComponent.value,
            selectedCountries: selectedCountries.value,
            selectedUnknowns: selectedUnknowns.value
        };

        sessionStorage.setItem('acc_dashboard', JSON.stringify(filters));
    }

    // Sélectionner tous les accords dans l'importation
    const selectAll = () => {
        exportModal.value.forEach(accord => {
            accord.add = true;
        });
    };

    // Désélectionner tous les accords dans l'importation
    const deselectAll = () => {
        exportModal.value.forEach(accord => {
            accord.add = false;
        });
    };

    // Fonction pour trouver le pays
    function getCountryCode(pays) {
        const country = partnercountry.value.find(country => country.parco_name === pays);
        return country ? country.parco_code : 'Code non disponible';
    }

    const filteredAccords = computed(() => {
    return accords.value.agreements
        .filter(accord => {
            const matchesDepartments = selectedDepartments.value.length === 0 || 
                accord.departments.some(dept => selectedDepartments.value.includes(dept.dept_shortname));

            const matchesCountries = selectedCountries.value.length === 0 || 
                selectedCountries.value.includes(accord.partnercountry.parco_name);

            const matchesComponents = selectedComponent.value.length === 0 || 
                (accord.component && selectedComponent.value.includes(accord.component.comp_name));

            // Filtre unknowns pour les champs vides
            const matchesUnknowns = selectedUnknowns.value.every(unknown => {
                if (unknown.includes('.')) {
                    const keys = unknown.split('.');
                    return keys.reduce((obj, key) => obj && obj[key], accord) === null;
                } else {
                    if (unknown === 'departments') {
                        return accord.departments.length === 0;
                    }
                    return accord[unknown] === null;
                }
            });

            return matchesDepartments && matchesCountries && matchesComponents && matchesUnknowns;
        })
        .sort((a, b) => {
            // Premier niveau : tri par pays
            const countryA = a.partnercountry?.parco_name || '';
            const countryB = b.partnercountry?.parco_name || '';

            if (countryA !== countryB) {
                return countryA.localeCompare(countryB);
            }

            // Deuxième niveau : tri par université
            const univA = a.university?.univ_name || '';
            const univB = b.university?.univ_name || '';
            return univA.localeCompare(univB);
        });
});

    // Ajouter un accord
    async function addAgreement() {
        const requestData = { 
            agree_typeaccord: newAgreement.value.typeaccord,
            agree_nbplace: newAgreement.value.nbplace,
        };

        // Vérification du Nombre de placess
        if (newAgreement.value.nbplace < 0) {
            addAlert('error', { data: { error: 'Le nombre de places doit être supérieur ou égal à zéro.', message: 'Ajout de l\'accord annulé.' } });
            return;
        }

        if (newAgreement.value.lien != null) {
            requestData.agree_lien = newAgreement.value.lien;
        }
        if (newAgreement.value.description != null) {
            requestData.agree_description = newAgreement.value.description;
        }

        // Gestion du nouveau isced
        if (newAgreement.value.isced !== 'addNew') {
            requestData.isc_id = newAgreement.value.isced;
        } else {
            requestData.newisced = {
                isc_code: '0' + newAgreement.value.newisced.code.toString(),
                isc_name: newAgreement.value.newisced.name
            };
        }

        // Gestion de la nouvelle composante
        if (newAgreement.value.compo !== 'addNew') {
            requestData.comp_id = newAgreement.value.compo;
        } else {
            requestData.newcompo = {
                comp_name: newAgreement.value.newcompo.name,
                comp_shortname: newAgreement.value.newcompo.shortname.toUpperCase()
            };
        }

        // Gestion de la nouvelle université
        if (newAgreement.value.univ !== 'addNew') {
            requestData.univ_id = newAgreement.value.univ;
        } else {
            requestData.newuniv = {
                univ_name: newAgreement.value.newuniv.name,
                univ_city: newAgreement.value.newuniv.city,
            };
            if (newAgreement.value.newuniv.partnercountry !== 'addNew') {
                requestData.newuniv.parco_id = newAgreement.value.newuniv.partnercountry;
            } else {
                requestData.newuniv.parco_name = newAgreement.value.newuniv.newpartnercountry;
                requestData.newuniv.parco_code = newAgreement.value.newuniv.newpartnercountrycode;
            }
        }

        // Vérification du type d'accord
        if (requestData.typeaccord === 'Selectionnez un type d\'accord') {
            addAlert('error', { data: { error: 'Vous devez choisir un type d\'accord.', message: 'Ajout de l\'accord annulé.' } });
            return;
        }

        // Effectuer la requête POST pour ajouter l'accord

        await request("POST", true, response, config.apiUrl + 'api/agreement', requestData);

        // Vérification de la réponse et ajout d'une action si nécessaire
        if (response.value.status === 201) {
            addAction(accountStore.account.acc_id, 'agreement', response, 'Ajout de l\'accord avec ' + response.value.agreement.university.univ_name + ' (' + response.value.agreement.partnercountry.parco_name + ').');
            await fetchAll();
        }

        
    }

    //Récupération des données et tri des universités par ordre alphabétique (Nom pays puis Nom univ)
    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, isceds, config.apiUrl+'api/isced');
        await request('GET', false, composantes, config.apiUrl+'api/component');
        await request('GET', false, universites, config.apiUrl+'api/university');
        await request('GET', false, departments, config.apiUrl+'api/department');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        universites.value.sort((a, b) => {
            // Comparer parco_name en premier
            const comparisonParco = a.partnercountry.parco_name.localeCompare(b.partnercountry.parco_name, undefined, { sensitivity: 'base' });
            if (comparisonParco !== 0) {
                return comparisonParco;
            }

            // Si parco_name est identique, comparer univ_name
            return a.univ_name.localeCompare(b.univ_name, undefined, { sensitivity: 'base' });
        });
        isLoaded.value = true;

        await nextTick()
        //On cache tous les formulaires
        showForms.value = Array(accords.value.length).fill(false);
        selectedDepartment.value = Array(accords.value.length).fill('');
        resetInput();
    }

    async function fetchAccords(){
        await request('GET', false, accords, config.apiUrl+'api/agreement');
    }

    // Supprimer un département d'un accord
    async function removeDeptFromAgreement(agree_id, dept_id){
        await request('DELETE', true, response, config.apiUrl+'api/departmentagreement/delete/'+agree_id+'/'+dept_id);
        fetchAccords();
    }

    // Supprimer tous les accords
    async function deleteAll(){
        await request('DELETE', true, response, config.apiUrl+'api/agreement/deleteall');
        if(response.value.status == 202){
            addAction(accountStore.account.acc_id, 'agreement', response, 'Suppression de tous les accords');
        }
        fetchAll();
        closeModal();
    }
    

    // Supprimer un accord
    async function deleteAgreement(univ_name, agree_id){
        await request('DELETE', true, response, config.apiUrl+'api/agreement/deletebyid/'+agree_id);
        if(response.value.status == 202){
            addAction(accountStore.account.acc_id, 'agreement', response, 'Suppression de l\'accord avec '+univ_name+'.');
        }
        fetchAccords();
        closeModal();

    }

    // renvoie les départements d'un accord filtré dans l'ordre alphabétique
    function filteredDepartments(accord) {
        if (accord.departments.length > 0) {
            const accordDepartmentIds = accord.departments.map(dept => dept.dept_id);
            
            // Filtrer et trier par dept_shortname
            return departments.value.departments
                .filter(dept => !accordDepartmentIds.includes(dept.dept_id))
                .sort((a, b) => a.dept_shortname.localeCompare(b.dept_shortname));
        } else {
            // Trier directement si aucun department dans accord
            return departments.value.departments
                .sort((a, b) => a.dept_shortname.localeCompare(b.dept_shortname));
        }
    }


    function resetInput(){
        newAgreement.value.isced = document.querySelector('#isced_select').options[0].value;
        newAgreement.value.compo = document.querySelector('#compo_select').options[0].value;
        newAgreement.value.univ = document.querySelector('#univ_select').options[0].value;
        newAgreement.value.typeaccord = document.querySelector('#typeaccord_select').options[0].value;  
        newAgreement.value.nbplace = 0;
        newAgreement.value.newuniv.name = '';
        newAgreement.value.newuniv.city = '';
        newAgreement.value.newuniv.newpartnercountry = '';
        newAgreement.value.newuniv.newpartnercountrycode = '';
        newAgreement.value.description = null;
        newAgreement.value.lien = null;
    }

    //Changer la visibilité d'un département dans un accord
    async function changeVisibility(accordId, deptId, deptagree_valide, deptShortName) {
        const newVisibility = deptagree_valide === 0 ? 1 : 0;

        const requestData = {
            dept_id: deptId,
            agree_id: accordId,
            deptagree_valide: newVisibility,
            dept_shortname: deptShortName
        }

        await request('PUT', true, response, config.apiUrl+'api/departmentagreement/changevisibility', requestData);
        if(response.value.status == 200){
            const accord = accords.value.agreements.find(accord => accord.agree_id == accordId);
            const dept = accord.departments.find(dept => dept.dept_id == deptId);
            dept.pivot.deptagree_valide = newVisibility;
        }
    }


        /**
     * Pour les deux:
     * agree_id: valeur
     */
    const showForms = ref([]);
    const selectedDepartment = ref([]);
    async function showForm(agree_id) {
        showForms.value[agree_id] = !showForms.value[agree_id];
    }

    //Ajout d'un département à un accord
    async function submitForm(agree_id) {
        showForms.value[agree_id] = false;
        const requestData = {
            agree_id: agree_id,
            dept_id: selectedDepartment.value[agree_id],
            deptagree_valide: true
        }
        await request('POST', true, response, config.apiUrl+'api/departmentagreement', requestData);
        if(response.value.status == 201){
            addAction(accountStore.account.acc_id, 'agreement', response, `Ajout du département ${response.value.department?.dept_shortname || 'Inconnu'} à l'accord ${response.value.agreement?.university?.univ_name || 'Inconnu'} (${response.value.agreement?.partnercountry?.parco_name || 'Inconnu'}).`);
        }
        fetchAccords();
    }

    function deselectAllDept() {
        selectedDepartments.value = [];
    }
    function deselectAllCountry() {
        selectedCountries.value = [];
    }
    function deselectAllComp() {
        selectedComponent.value = [];
    }
    function deselectAllUnkn() {
        selectedUnknowns.value = [];
    }

    // Surveiller les changements et sauvegarder les filtres
    watch(selectedDepartment, saveFilters);
    watch(selectedComponent, saveFilters);
    watch(selectedCountries, saveFilters);
    watch(selectedUnknowns, saveFilters);

  onMounted(() => {
    fetchAll();
    loadFilters();
  });

  function resetModifDocuments(){
    const fileadd = document.querySelector("#file_add");
    fileadd.value = null;
    recapNewDoc.value = [];
    newfiles.value = [];
  }

  async function modifAccordDocuments(accord){
    currentAccordModif.value = accord;

    await request('GET', false, currentAgreeUnivDoc, config.apiUrl+'api/documents/university/' + accord.university.univ_id);
    await request('GET', false, currentAgreeDoc, config.apiUrl+'api/documents/agreement/' + accord.agree_id);
  }

  const handleFileInputChangeDocument = (event) => {
    //Récupère les fichiers sélectionnées par l'utilisateur
    const filesadded = event.target.files;
    recapNewDoc.value = [];

    //Stocke les fichiers (créé un objet à chaque fois)
    if (filesadded.count != 0) {
      for (var i = 0; i < event.target.files.length; ++i) {
        const file = event.target.files.item(i)
        recapNewDoc.value.push(file.name);

        newfiles.value[i] = {
          file: file,
          name: file.name,
        };
      }
    } else {
      newfiles.value = [];
    }
  };

  // Ajout de deocuments
  async function addDocuments(){
    if(newfiles.value != null){ //Permet d'enregistrer de nouveaux documents et de les associer à l'univ
      for(const doc of newfiles.value) {
        try{
          const formDataNewDoc = new FormData();
          formDataNewDoc.append('file', doc.file);
          formDataNewDoc.append('title', doc.name);
          formDataNewDoc.append('folder', '/admin/agreement/agree_' + currentAccordModif.value.agree_id);
          formDataNewDoc.append('agree_id', currentAccordModif.value.agree_id);

          await request('POST', true, response, config.apiUrl + 'api/documents/agreement', formDataNewDoc)
          if(response.value.status != 200) return;
        } catch (error){
          console.log("Erreur ajout document: "+error);
        }
      };
      addAction(accountStore.account.acc_id, 'agreement', response, 'Ajout de documents à l\'accord '+ currentAccordModif.value.agree_id +'.');
      await request('GET', false, currentAgreeDoc, config.apiUrl+'api/documents/agreement/' + currentAccordModif.value.agree_id);
      const fileadd = document.querySelector("#file_add");
      fileadd.value = null;
      recapNewDoc.value = [];
    }
  }

  async function deleteDocument(document){
    const requestData = { 
      agree_id: currentAccordModif.value.agree_id,
      doc_id: document.doc_id,
    };

    await request('DELETE', true, response, config.apiUrl+'api/documents/agreement', requestData);
    if(response.value.status == 200){
      await request('GET', false, currentAgreeDoc, config.apiUrl+'api/documents/agreement/' + currentAccordModif.value.agree_id);
      addAction(accountStore.account.acc_id, 'agreement', response, 'Supression d\'un document à l\'accord '+ currentAccordModif.value.agree_id +'.');
    }
    
  }

</script>
