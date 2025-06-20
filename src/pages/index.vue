<template>
  <div v-if="isLoaded">
    <!-- Partie accord -->
    <div>
      <!-- Titre de section Destinations version plus aérienne -->
      <div class="w-full pb-6 pt-8">
        <div class="relative">
          <!-- Fond décoratif avec gradient subtil -->
          <div class="absolute -left-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
          
          <!-- Conteneur principal -->
          <div class="relative z-10">
            <!-- Badge catégorie -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-xs font-medium mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              INTERNATIONAL
            </div>
            
            <!-- Titre avec design plus aérien -->
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Destinations</h2>
              <!-- Icône globe avec animation plus subtile -->
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
            </div>
            
            <!-- Texte descriptif plus léger -->
            <div class="max-w-lg">
              <p class="text-base-content/60 text-sm">
                Découvrez nos <span class="text-primary font-medium">partenaires universitaires</span> à travers le monde
              </p>
            </div>
            
            <!-- Séparateur fin sur toute la longueur -->
            <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent mt-4"></div>
          </div>
        </div>
      </div>
      
      <div class="block lg:flex my-5">
        <!-- Partie filtres -->
        <div class="bg-base-100 rounded-lg shadow-lg lg:w-96 w-full lg:my-0 my-5 z-10 overflow-hidden border border-base-300"v-if="accords && accords.agreements">
          <!-- En-tête -->
          <div class="bg-base-300 p-4">
            <h3 class="font-bold text-lg select-none">Filtres des Accords</h3>
            <div class="flex justify-between items-center mt-2">
              <button 
                class="btn btn-sm btn-ghost text-xs select-none" 
                @click="deselectAll"
              >
                <span class="">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Tout désélectionner
              </button>
              <p class="text-sm">
                {{ filteredAccords.length }} résultats 
              </p>

            </div>
          </div>

          <!-- Section Pays -->
          <div class="border-b border-base-300">
            <div
              class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
              @click="toggleCollapse('pays')"
            >
              <div class="flex items-center gap-2 select-none">
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
                class="btn btn-xs btn-ghost mb-3 select-none"
                @click="deselectAllCountry"
              >
                Tout désélectionner
              </button>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <div
                  v-for="(country, index) in partnercountry"
                  :key="index"
                  class="flex items-center"
                >
                  <label
                    :for="'filt_pays_' + index"
                    class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150"
                  >
                    <input
                      :id="'filt_pays_' + index"
                      type="checkbox"
                      class="checkbox checkbox-sm  mr-2 select-none"
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
          <div>
            <div
              class="p-4 flex justify-between items-center hover:bg-base-200 cursor-pointer transition-colors duration-200"
              @click="toggleCollapse('departments')"
            >
              <div class="flex items-center gap-2 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
                <span class="font-medium">Départements</span>
                <span v-if="selectedDepartment.length" class="badge badge-sm">{{ selectedDepartment.length }}</span>
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
                class="btn btn-xs btn-ghost mb-3 select-none"
                @click="deselectAllDept"
               
              >
                Tout désélectionner
              </button>

              <div v-for="(comp, compIndex) in components.components" :key="compIndex" class="mb-4" >

                  <p class="font-medium text-sm mb-2 select-none">{{ comp.comp_name }}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pl-2" v-if="comp.departments  && comp.departments.length > 0">
                    <div
                      v-for="(dept, deptIndex) in comp.departments"
                      :key="deptIndex"
                    >
                      <label
                        :for="'filt_dept_' + compIndex + '_' + deptIndex"
                        class="flex items-center w-full p-2 rounded hover:bg-base-200 cursor-pointer transition-colors duration-150 select-none"
                      >
                        <input
                          :id="'filt_dept_' + compIndex + '_' + deptIndex"
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
                <div v-if="comp.departments.length == 0" class="text-sm text-gray-500 italic p-2 select-none">
                  Aucun département disponible
                </div>
              </div>
              

            </div>
          </div>
        </div>

        <!-- Partie rendu des accords -->
        <div class="w-full z-20">
          <div>
            <!-- Si il y a des accords -->
            <div v-if="filteredAccords && filteredAccords.length > 0">
              <div class="z-10 px-2 md:px-4">
                <div
                  v-for="(accord, index) in paginatedAccords"
                  :key="index"
                  class="mb-2 overflow-hidden transition-all duration-200 hover:scale-[1.02] rounded-lg shadow-sm"
                >
                  <div class="w-full bg-base-300 rounded-lg">
                    <div
                      class="flex flex-wrap md:flex-nowrap justify-between items-center"
                    >
                      <RouterLink
                        :to="{
                          name: 'Accord',
                          params: { agree_id: accord.agree_id },
                        }"
                        class="flex-1 flex flex-col md:flex-row w-full justify-between p-3 md:p-4 transition-all duration-100 ease-in-out relative group"
                      >
                        <div
                          class="flex items-start space-x-2 md:space-x-3 w-full md:w-auto mb-2 md:mb-0"
                        >
                          <div class="flex-shrink-0">
                            <!-- Drapeau -->
                            <span
                              class="fi text-2xl md:text-3xl lg:text-4xl xl:text-5xl transition-all duration-100 ease-in-out"
                              :class="
                                'fi-' +
                                (accord.partnercountry?.parco_code || '')
                              "
                            ></span>

                            <!-- Point d'interrogation si pas de drapeau -->
                            <span
                              v-if="!accord.partnercountry?.parco_code"
                              class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none"
                            >
                              ?
                            </span>
                          </div>

                          <div class="flex flex-col flex-1">
                            <!-- Premiere ligne -->
                            <p class="text-sm md:text-base lg:text-lg">
                              <span class="font-bold">{{
                                accord.university?.univ_name ||
                                "Université indisponible"
                              }}</span>
                              <span class="whitespace-normal">
                                à
                                {{
                                  accord.university?.univ_city ||
                                  "Ville indisponible"
                                }}</span
                              >
                              <span class="whitespace-normal"
                                > ({{
                                  accord.partnercountry?.parco_name ||
                                  "Pays indisponible"
                                }})</span
                              >
                            </p>
                            <!-- Deuxieme ligne -->
                            <p class="text-xs md:text-sm text-base-content/80">
                              [{{
                                accord.isced?.isc_code ||
                                "Code ISCED indisponible"
                              }}
                              {{
                                accord.isced?.isc_name ||
                                "Nom ISCED indisponible"
                              }}] pour
                              {{
                                accord.component?.comp_name ||
                                "Composante indisponible"
                              }}
                            </p>
                          </div>
                        </div>

                        <!-- Départements -->
                        <div class="flex items-center justify-start md:justify-end mt-2 md:mt-0 w-full md:w-auto">
                          <div
                            v-if="countVisibleDepartments(accord)"
                            class="flex flex-wrap w-full md:justify-end gap-2"
                          >
                            <div
                              v-for="(dept, index) in accord.departments.filter(d => d.pivot?.deptagree_valide)"
                              :key="index"
                              class="flex-shrink-0"
                            >
                              <p
                                class="transition-all duration-100 ease-in-out font-bold text-xs text-center select-none rounded min-w-[2.5rem] px-2 py-1"
                                :style="{
                                  backgroundColor: dept.dept_color,
                                  color: getTextColor(dept.dept_color)
                                }"
                              >
                                {{ dept.dept_shortname }}
                              </p>
                            </div>
                          </div>
                          <div v-else class="hidden md:block text-sm text-base-content/70">
                            <p class="px-3 py-2">Aucun département</p>
                          </div>
                        </div>



                        <div
                          class="absolute inset-0 bg-base-300/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <span class="text-base-content font-medium relative">
                            Voir plus
                            <span
                              class="absolute inset-x-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                            ></span>
                          </span>
                        </div>
                      </RouterLink>

                      <div
                        v-if="
                          accountStore.isLogged() && accountStore.isStudent() && accountStore.getAccountValidate() && !accountStore.dateLimitePasse
                        "
                        class="flex-shrink-0 pr-3 pl-2 py-2 md:py-0"
                      >
                        <div
                          @click="toggleFavoris(accord.agree_id)"
                          class="group p-2 flex items-center justify-center hover:cursor-pointer"
                          :class="{
                            'hover:opacity-60': isFavorited(accord.agree_id),
                          }"
                        >
                          <svg
                            class="w-5 h-5 md:w-6 md:h-6 transition-all duration-100 ease-in-out"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              :class="{
                                'fill-current': isFavorited(accord.agree_id),
                                'group-hover:fill-current': !isFavorited(
                                  accord.agree_id
                                ),
                              }"
                              :fill="
                                isFavorited(accord.agree_id)
                                  ? 'currentColor'
                                  : 'none'
                              "
                              stroke="currentColor"
                              stroke-width="2"
                              d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>


          <!-- Pagination -->
          <div v-if="filteredAccords && filteredAccords.length > 0" class="flex justify-center gap-2 my-4 pt-4">
            <button class="btn" :disabled="currentPage === 1 || isLoadingAccords" @click="currentPage--">Précédent</button>

            <template v-for="page in pagesToShow" :key="page">
              <template v-if="page === '...'">
                <span class="flex items-center px-4 select-none">...</span>
              </template>
              <button
                v-else
                class="btn"
                :class="{ 'btn-active': page === currentPage }"
                :disabled="isLoadingAccords"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </template>

            <button class="btn" :disabled="currentPage === totalPages || isLoadingAccords" @click="currentPage++">Suivant</button>
          </div>

            <!-- S'il n'y a pas d'accords -->
            <div
              v-else
              class="flex items-center justify-center min-h-[16rem] text-base-content/70"
            >
              <p class="my-12 md:my-24 text-center px-4">
                Aucun accord n'a été trouvé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Espace communication -->
    <div class="w-full">

      <!-- Titre de section Articles version aérienne -->
      <div class="w-full pb-6 pt-8">
        <div class="relative">
          <!-- Fond décoratif avec gradient subtil -->
          <div class="absolute -left-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
          
          <!-- Conteneur principal -->
          <div class="relative z-10">
            <!-- Badge catégorie -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-xs font-medium mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              ACTUALITÉS
            </div>
            
            <!-- Titre avec design plus aérien -->
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Articles</h2>
              <!-- Icône document avec animation plus subtile -->
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            
            <!-- Texte descriptif plus léger -->
            <div class="max-w-lg">
              <p class="text-base-content/60 text-sm">
                Informations et <span class="text-primary font-medium">actualités internationales</span> à ne pas manquer
              </p>
            </div>
            
            <!-- Séparateur fin sur toute la longueur -->
            <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Articles -->
      <div v-if="articles && articles.articles" class="py-8">
        <div
          v-if="articles.count > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto"
        >
          <!-- Carte d'article -->
          <RouterLink
            v-for="(article) in articles.articles
              .filter((article) => {
                if (!article.art_datesortie) return true; // si pas de date, on affiche
                return new Date(article.art_datesortie) <= new Date(); // sinon on compare avec maintenant
              })
              .slice(0, 6)"
            :key="article.art_id"
            :to="{ name: 'Article', params: { art_id: article.art_id } }"
            class="card bg-base-300 shadow-xl hover:shadow-2xl transition-transform duration-200 ease-out hover:scale-[1.02] w-full overflow-hidden transform-gpu will-change-transform"
          >
            <!-- Image de couverture optimisée avec fallback intégré -->
            <figure class="relative">
              <div
                v-if="article.art_image"
                :style="{
                  backgroundImage: `url(${config.apiUrl + 'api/article/image/' + article.art_id})`,
                }"
                class="bg-cover bg-center w-full h-56 transform-gpu will-change-transform backface-hidden bg-base-200"
              ></div>
              <!-- Fallback quand pas d'image disponible -->
              <div
                v-else
                class="w-full h-56 bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center transform-gpu will-change-transform backface-hidden"
              >
                <div class="text-base-content/50 flex flex-col items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-12 w-12 mb-2 opacity-60" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="1.5" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
              </div>
              <span
                v-if="article.art_pin"
                class="badge badge-primary badge-lg absolute top-3 left-3 shadow-md gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Épinglé
              </span>
            </figure>

            <!-- Contenu de la carte -->
            <div class="card-body p-4">
              <h2 class="card-title text-md line-clamp-2">
                {{ article.art_title }}
              </h2>
              <div
                class="text-sm text-base-content/70 mb-2 flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatDate(article.art_lastmodif) }}
              </div>
              <div
                class="overflow-hidden line-clamp-3 text-sm text-base-content/80"
                v-html="article.art_description"
              ></div>
            </div>
          </RouterLink>
        </div>

        <div
          v-else
          class="card bg-base-100 shadow-xl p-10 text-center max-w-lg mx-auto"
        >
          <div class="flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-base-content/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-lg font-medium">Aucun article n'a été trouvé.</p>
          </div>
        </div>

        <div v-if="articles.count > 0" class="flex justify-center mt-12">
          <RouterLink
            :to="{ name: 'Articles' }"
            class="btn btn-primary btn-outline gap-2"
          >
            Voir tous les articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </RouterLink>
        </div>
      </div>

      <!-- Titre de section Événements version aérienne -->
      <div class="w-full pb-6 pt-8">
        <div class="relative">
          <!-- Fond décoratif avec gradient subtil -->
          <div class="absolute -left-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
          
          <!-- Conteneur principal -->
          <div class="relative z-10">
            <!-- Badge catégorie -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-xs font-medium mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              AGENDA
            </div>
            
            <!-- Titre avec design plus aérien -->
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-3xl md:text-4xl font-bold tracking-tight">Événements</h2>
              <!-- Icône calendrier avec animation plus subtile -->
              <div class="relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <!-- Texte descriptif plus léger -->
            <div class="max-w-lg">
              <p class="text-base-content/60 text-sm">
                Calendrier des <span class="text-primary font-medium">rendez-vous</span> et manifestations à venir
              </p>
            </div>
            
            <!-- Séparateur fin sur toute la longueur -->
            <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent mt-4"></div>
          </div>
        </div>
      </div>

      <!-- Evenements -->
      <div class="m-5 flex items-center justify-center flex-col">
        <div
          class="flex h-full items-center justify-center flex-col pt-10"
          v-if="events && events.count > 0"
        >
          <!-- Calendrier -->
          <div class="flex flex-col items-center justify-center">
            <CalendarComp :events="events"></CalendarComp>
            <div class="flex items-center justify-center py-5 w-full">
              <RouterLink
                :to="{ name: 'Evenement' }"
                class="btn btn-primary btn-outline gap-2"
              >
                Voir tous les événements
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </RouterLink>
            </div>
          </div>

          <!-- Evenements -->
          <div class="p-5">
            <div v-if="events && events.count > 0" class="max-w-4xl mx-auto">
              <!-- Titre de la section -->
              <div class="flex items-center justify-center gap-2 mb-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h2 class="text-2xl font-bold">Prochains événements</h2>
              </div>

              <!-- Liste des événements -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Événements réels -->
                <RouterLink
                  v-for="(event, index) in eventspf.events.slice(0, 4)"
                  :key="index"
                  :to="{
                    name: 'EvenementDetail',
                    params: { evt_id: event.evt_id },
                  }"
                  class="group"
                >
                  <div
                    class="relative h-full flex flex-col bg-base-200 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-4px]"
                  >
                    <!-- Bande colorée en haut -->
                    <div
                      class="absolute top-0 left-0 w-full h-1 bg-primary"
                    ></div>

                    <!-- Date -->
                    <div class="p-4 border-b border-base-300">
                      <div class="flex items-center gap-3 mb-2">
                        <div
                          class="w-12 h-12 flex items-center justify-center text-primary"
                        >
                          <div class="text-center leading-none">
                            <div class="text-lg font-bold">
                              {{ new Date(event.evt_datetime).getDate() }}
                            </div>
                            <div class="text-xs">
                              {{
                                [
                                  "JAN",
                                  "FEV",
                                  "MAR",
                                  "AVR",
                                  "MAI",
                                  "JUN",
                                  "JUL",
                                  "AOU",
                                  "SEP",
                                  "OCT",
                                  "NOV",
                                  "DEC",
                                ][new Date(event.evt_datetime).getMonth()]
                              }}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div class="text-xs opacity-70">
                            {{ new Date(event.evt_datetime).getFullYear() }}
                          </div>
                        </div>
                      </div>
                      <!-- Badge sur une ligne séparée -->
                      <div>
                        <span :class="`badge badge-md badge-${event.theme.evthm_color || 'neutral'}`">
                          {{ event.theme.evthm_name }}
                        </span>
                      </div>
                    </div>

                    <!-- Contenu -->
                    <div class="p-4 flex-grow">
                      <h3
                        class="font-bold text-lg mb-2 group-hover:text-primary transition-colors"
                      >
                        {{ event.evt_name }}
                      </h3>
                      <p
                        class="text-sm opacity-80 overflow-hidden"
                        style="
                          display: -webkit-box;
                          -webkit-line-clamp: 2;
                          -webkit-box-orient: vertical;
                        "
                      >
                        {{ event.evt_description }}
                      </p>
                    </div>

                    <!-- Bouton en bas -->
                    <div
                      class="p-4 mt-auto border-t border-base-200 flex justify-end"
                    >
                      <div
                        class="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Voir les détails
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </RouterLink>

                <!-- Placeholders pour compléter jusqu'à 4 -->
                <!-- eventspf.events.length -->
                <div
                  v-for="(n, index) in 4 - eventspf.events.length"
                  :key="index"
                  v-if="eventspf.events.length < 4"
                  class="flex flex-col h-full bg-base-100 rounded-lg overflow-hidden shadow border border-dashed border-base-300 opacity-60"
                >
                  <div class="p-4 border-b border-base-300">
                    <div class="flex items-center gap-3 mb-2">
                      <div
                        class="w-12 h-12 flex items-center justify-center text-primary"
                      >
                        <div class="text-center leading-none">
                          <div class="text-lg font-bold">--</div>
                          <div class="text-xs">---</div>
                        </div>
                      </div>
                      <div>
                        <div class="text-xs opacity-70">----</div>
                      </div>
                    </div>
                    <div>
                      <span class="badge badge-md badge-ghost"
                        >Aucun thème</span
                      >
                    </div>
                  </div>

                  <div class="p-4 flex-grow">
                    <h3 class="font-bold text-lg mb-2">
                      Aucun événement programmé
                    </h3>
                    <p class="text-sm opacity-80">
                      Restez à l'écoute pour plus d'événements à venir
                      prochainement.
                    </p>
                  </div>

                  <div
                    class="p-4 mt-auto border-t border-base-200 flex justify-end"
                  >
                    <div
                      class="text-base-content/50 text-sm font-medium flex items-center gap-1"
                    >
                      Voir les détails
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bouton pour voir tous les événements -->
              <div class="flex justify-center mt-8">
                <RouterLink
                  :to="{ name: 'Evenement' }"
                  class="btn btn-primary btn-outline gap-2"
                >
                  Voir tous les événements
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <LoadingComp></LoadingComp>
  </div>
</template>

<style scoped>
.scale-102 {
  transform: scale(1.02);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 1280px) {
  .max-w-8xl {
    max-width: 90rem;
  }
}
</style>

<script setup>
import { onMounted } from "vue";
import { ref, computed, watch } from "vue";
import { request } from "../composables/httpRequest";
import config from "../config";

import CalendarComp from "../components/utils/CalendarComp.vue";
import { useAccountStore } from "../stores/accountStore";
import LoadingComp from "../components/utils/LoadingComp.vue";

import "/node_modules/flag-icons/css/flag-icons.min.css";

const accountStore = useAccountStore();

const response = ref([]);
const articles = ref([]);
const accords = ref([]);
const partnercountry = ref([]);
const components = ref([]);
const events = ref([]);
const eventspf = ref([]);
const favoris = ref([]);
const isLoadingAccords = ref(false);

const itemsToShow = ref(12);

const isLoaded = ref(false);

const currentPage = ref(1);
const perPage = ref(18);
const lastPage = ref(1);

const selectedDepartment = ref([]);
const selectedCountries = ref([]);
// Fonction pour charger les filtres depuis sessionStorage pour la page d'accueil
function loadFilters() {
  const savedDepartments = sessionStorage.getItem(
    "home_dashboard.selectedDepartment"
  );
  const savedCountries = sessionStorage.getItem(
    "home_dashboard.selectedCountries"
  );

  if (savedDepartments) {
    selectedDepartment.value = JSON.parse(savedDepartments);
  }
  if (savedCountries) {
    selectedCountries.value = JSON.parse(savedCountries);
  }
}

// Fonction pour sauvegarder les filtres dans sessionStorage pour la page d'accueil
function saveFilters() {
  sessionStorage.setItem(
    "home_dashboard.selectedDepartment",
    JSON.stringify(selectedDepartment.value)
  );
  sessionStorage.setItem(
    "home_dashboard.selectedCountries",
    JSON.stringify(selectedCountries.value)
  );
}

const isOpen = ref({
  pays: false,
  departments: false,
});

function toggleCollapse(section) {
  isOpen.value[section] = !isOpen.value[section];
}

  async function fetchFilteredAccords(){
    isLoadingAccords.value = true;
    const params = new URLSearchParams();

    if (selectedDepartment.value.length > 0) {
      selectedDepartment.value.forEach(dep => params.append('departments[]', dep));
    }

    if (selectedCountries.value.length > 0) {
      selectedCountries.value.forEach(country => params.append('countries[]', country));
    }

    params.append('page', currentPage.value.toString());
    params.append('perPage', perPage.value.toString());

    await request('GET', false, accords, `${config.apiUrl}api/agreement/filtered?${params.toString()}`);
    lastPage.value = accords.value.last_page;
    currentPage.value = accords.value.current_page;
    isLoadingAccords.value = false;
  }

watch(currentPage, () => fetchFilteredAccords());

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

async function fetchAll() {
  await request("GET", false, articles, config.apiUrl + "api/article");
  await fetchFilteredAccords();
  //await request("GET", false, accords, config.apiUrl + "api/agreement");
  await request(
    "GET",
    false,
    partnercountry,
    config.apiUrl + "api/partnercountry"
  );
  await request("GET", false, components, config.apiUrl + "api/component");
  await request("GET", false, events, config.apiUrl + "api/event");
  await request("GET", false, eventspf, config.apiUrl + "api/event/pfonly");
  if (accountStore.isLogged()) {
    await request("GET", false, favoris, config.apiUrl + "api/favoris/me");
  }
  isLoaded.value = true;
}

// Renvoie la date formatée
function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}

function getTextColor(bgColor) {
  // Nettoyage éventuel
  if (!bgColor) return '#000'

  // Extraction R, G, B
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calcul de la luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Retourne noir si fond clair, blanc si fond foncé
  return luminance > 0.6 ? '#000' : '#fff'
}


const filteredAccords = computed(() => {
  return accords.value.agreements
    .filter((accord) => {
      // Gestion des valeurs nulles ou undefined
      const departments = accord.departments || [];
      const partnercountry = accord.partnercountry || {};
      const component = accord.component || {};
      const deptShortnames = selectedDepartment.value || [];
      const countryNames = selectedCountries.value || [];

      // Les accords doivent être filtrés en fonction des départements, pays et composantes sélectionnés
      const matchesDepartments =
        deptShortnames.length === 0 ||
        departments.some(
          (dept) =>
            dept &&
            dept.dept_shortname &&
            deptShortnames.includes(dept.dept_shortname)
        );

      const matchesCountries =
        countryNames.length === 0 ||
        (partnercountry &&
          partnercountry.parco_name &&
          countryNames.includes(partnercountry.parco_name));

      // Assurez-vous que departments est un tableau et vérifiez sa longueur
      const hasDepartments =
        Array.isArray(departments) && departments.length > 0;

      // Retourner les accords qui correspondent aux filtres ou qui ont des départements
      return (
        matchesDepartments &&
        matchesCountries &&
        (hasDepartments || deptShortnames.length === 0)
      );
    })
    .sort((a, b) => {
      // Récupération des noms de pays avec gestion des undefined
      const countryA = a.partnercountry?.parco_name || "";
      const countryB = b.partnercountry?.parco_name || "";

      // Si les pays sont différents, on trie par pays
      if (countryA !== countryB) {
        return countryA.localeCompare(countryB);
      }

      // Si les pays sont identiques, on trie par nom d'université
      const univA = a.university?.univ_name || "";
      const univB = b.university?.univ_name || "";
      return univA.localeCompare(univB);
    });
});

const canShowMore = computed(() => {
  return itemsToShow.value < filteredAccords.value.length;
});
const paginatedAccords = computed(() => {
  return filteredAccords.value.slice(0, itemsToShow.value);
});

const showMore = () => {
  itemsToShow.value += 5;
};

function isFavorited(agree_id) {
  return favoris.value.favoris.some(
    (favori) =>
      favori.acc_id === accountStore.account.acc_id && favori.agree_id === agree_id
  );
}

async function toggleFavoris(agree_id) {
  if (!isFavorited(agree_id)) {
    const requestData = {
      agree_id: agree_id,
    };
    await request(
      "post",
      true,
      response,
      config.apiUrl + "api/favoris",
      requestData
    );
    if (response.value.status == 201) {
      favoris.value.favoris.push({
        acc_id: accountStore.account.acc_id,
        agree_id: agree_id,
      });
    }
  } else {
    await request(
      "delete",
      true,
      response,
      config.apiUrl +
        "api/favoris/delete/" + agree_id
    );
    favoris.value.favoris = favoris.value.favoris.filter(
      (favori) =>
        !(favori.acc_id === accountStore.account.acc_id && favori.agree_id === agree_id)
    );
  }
}

// renvoie le nombre de département visible d'un accord
function countVisibleDepartments(accord) {
  return (
    accord.departments?.filter((dept) => dept.pivot?.deptagree_valide).length ||
    0
  );
}

function deselectAll() {
  selectedDepartment.value = [];
  selectedCountries.value = [];
}
function deselectAllDept() {
  selectedDepartment.value = [];
}
function deselectAllCountry() {
  selectedCountries.value = [];
}
// Surveiller les changements et sauvegarder les filtres
watch(selectedDepartment, saveFilters);
watch(selectedCountries, saveFilters);

onMounted(() => {
  fetchAll();
  loadFilters();
});

watch(
  [selectedDepartment, selectedCountries],
  () => {
    currentPage.value = 1;
    fetchFilteredAccords();
  },
  { deep: true }
);
</script>
