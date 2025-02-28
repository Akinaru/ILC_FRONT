<template>
  <div v-if="isLoaded">
    <!-- Partie accord -->
    <div>
      <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
        <img
          v-if="images.find((img) => img.nom === 'banner_dest').exists"
          :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_dest`"
          alt="Bannière"
          className="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center">
            <span class="text-3xl font-bold">Destinations</span>
          </div>
        </div>
      </div>
      <div class="block lg:flex my-5">
        <!-- Partie filtre -->
        <div
          class="bg-base-200 drop-shadow-lg lg:w-96 w-full lg:my-0 my-5 z-10"
          v-if="accords && accords.agreements"
        >
          <p
            class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg"
          >
            Filtres des Accords
          </p>
          <p>
            {{ filteredAccords.length }} résultats ({{
              selectedDepartment.length + selectedCountries.length
            }}
            filtre{{
              selectedCountries.length + selectedDepartment.length > 1
                ? "s"
                : ""
            }})
          </p>
          <button class="hover:opacity-70 underline" @click="deselectAll">
            Tout désélectionner
          </button>

          <!-- Pays -->
          <div>
            <div
              class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer"
              @click="toggleCollapse('pays')"
            >
              <p>
                Pays ({{ selectedCountries.length }} séléctionné{{
                  selectedCountries.length > 1 ? "s" : ""
                }})
              </p>
              <span
                :class="isOpen.pays ? 'rotate-180' : ''"
                class="transform transition-transform text-xl select-none"
                >&#9662;</span
              >
            </div>
            <div class="p-1" v-show="isOpen.pays">
              <button
                class="hover:opacity-70 underline"
                @click="deselectAllCountry"
              >
                Tout désélectionner
              </button>

              <div class="lg:block flex flex-wrap">
                <div
                  v-for="(country, index) in partnercountry"
                  :key="index"
                  class="flex items-center hover:opacity-60 my-1 w-1/2 sm:w-1/3 lg:w-full"
                >
                  <input
                    :id="'filt_pays_' + index"
                    type="checkbox"
                    class="checkbox"
                    :value="country.parco_name"
                    v-model="selectedCountries"
                  />
                  <label
                    :for="'filt_pays_' + index"
                    class="flex w-full hover:cursor-pointer pl-2"
                  >
                    <span
                      class="fi mr-1"
                      :class="'fi-' + country.parco_code"
                    ></span>
                    <label
                      :for="'filt_pays_' + index"
                      class="select-none w-full cursor-pointer"
                      >{{ country.parco_name }}</label
                    >
                  </label>
                </div>
              </div>
            </div>
          </div>
          <!-- Départements -->
          <div>
            <div
              class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer"
              @click="toggleCollapse('departments')"
            >
              <p>
                Départements ({{ selectedDepartment.length }} séléctionné{{
                  selectedDepartment.length > 1 ? "s" : ""
                }})
              </p>
              <span
                :class="isOpen.departments ? 'rotate-180' : ''"
                class="transform transition-transform text-xl select-none"
                >&#9662;</span
              >
            </div>
            <div class="p-1" v-show="isOpen.departments">
              <button
                class="hover:opacity-70 underline"
                @click="deselectAllDept"
              >
                Tout désélectionner
              </button>

              <div v-for="(comp, index) in components.components" :key="index">
                <div class="lg:block flex flex-wrap">
                  <p>{{ comp.comp_name }}</p>
                  <div
                    v-for="(dept, index) in comp.departments"
                    :key="index"
                    class="flex items-center hover:opacity-60 my-1"
                  >
                    <input
                      :id="'filt_dept_' + index"
                      type="checkbox"
                      class="checkbox"
                      :value="dept.dept_shortname"
                      v-model="selectedDepartment"
                    />
                    <label
                      :for="'filt_dept_' + index"
                      class="hover:cursor-pointer flex items-center justify-center w-full pl-2"
                    >
                      <div
                        class="lg:w-3 w-6 lg:h-3 h-3 mr-2"
                        :style="{ backgroundColor: dept.dept_color }"
                      ></div>
                      <label
                        :for="'filt_dept_' + index"
                        class="select-none w-full hover:cursor-pointer"
                        >{{ dept.dept_shortname }}</label
                      >
                    </label>
                  </div>
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
                        <div
                          class="flex items-center justify-start md:justify-end mt-2 md:mt-0 w-full md:w-auto"
                        >
                          <div
                            v-if="countVisibleDepartments(accord)"
                            class="flex flex-wrap w-full md:justify-end"
                          >
                            <div
                              v-for="(dept, index) in accord.departments"
                              :key="index"
                              class="flex-shrink-0"
                            >
                              <p
                                v-if="dept.pivot?.deptagree_valide"
                                class="transition-all duration-100 ease-in-out mx-1 px-2 py-1 md:px-3 md:py-2 min-w-[2.5rem] font-bold text-xs text-center select-none rounded"
                                :style="{ backgroundColor: dept.dept_color }"
                              >
                                {{ dept.dept_shortname }}
                              </p>
                            </div>
                          </div>
                          <div
                            v-else
                            class="hidden md:block text-sm text-base-content/70"
                          >
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
                          accountStore.isLogged() && accountStore.isStudent()
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

                <div class="flex items-center justify-center my-6">
                  <button
                    @click="showMore"
                    v-if="canShowMore"
                    class="btn btn-primary btn-outline gap-2"
                  >
                    Voir plus d'accords
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
                  </button>
                </div>
              </div>
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
      <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
        <img
          v-if="images.find((img) => img.nom === 'banner_art').exists"
          :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_art`"
          alt="Bannière"
          className="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center">
            <span class="text-3xl font-bold">Articles</span>
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
            v-for="(article, index) in articles.articles
              .filter((article) => {
                if (!article.art_datesortie) return true; // si pas de date, on affiche
                return new Date(article.art_datesortie) <= new Date(); // sinon on compare avec maintenant
              })
              .slice(0, 6)"
            :key="index"
            :to="{ name: 'Article', params: { art_id: article.art_id } }"
            class="card bg-base-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102 w-full overflow-hidden"
          >
            <!-- Image de couverture -->
            <figure class="relative">
              <div
                :style="{
                  backgroundImage: `url(${
                    article.art_image
                      ? config.apiUrl + 'api/article/image/' + article.art_id
                      : config.apiUrl + 'images/no_image.jpg'
                  })`,
                }"
                class="bg-cover bg-center w-full h-56"
              ></div>
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

      <!-- Agenda -->
      <div className="w-full h-24 sm:h-32 md:h-36 lg:h-44">
        <img
          v-if="images.find((img) => img.nom === 'banner_evt').exists"
          :src="`${config.apiUrl}api/image?path=private/images/site&name=banner_evt`"
          alt="Bannière"
          className="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <div class="text-center">
            <span class="text-3xl font-bold">Evenements</span>
          </div>
        </div>
      </div>

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
                    class="relative h-full flex flex-col bg-base-100 rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-4px]"
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
                          <div class="text-sm font-medium">
                            {{
                              new Date(event.evt_datetime).toLocaleTimeString(
                                "fr-FR",
                                { hour: "2-digit", minute: "2-digit" }
                              )
                            }}
                          </div>
                          <div class="text-xs opacity-70">
                            {{ new Date(event.evt_datetime).getFullYear() }}
                          </div>
                        </div>
                      </div>
                      <!-- Badge sur une ligne séparée -->
                      <div>
                        <span class="badge badge-md badge-warning">{{
                          event.theme.evthm_name
                        }}</span>
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
                        <div class="text-sm font-medium">--:--</div>
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
const images = ref([
  {
    vrainom: "Destinations Accueil",
    nom: "banner_dest",
    path: "private/images/site",
    exists: false,
  },
  {
    vrainom: "Articles Accueil",
    nom: "banner_art",
    path: "private/images/site",
    exists: false,
  },
  {
    vrainom: "Evenements Accueil",
    nom: "banner_evt",
    path: "private/images/site",
    exists: false,
  },
]);

const itemsToShow = ref(12);

const isLoaded = ref(false);

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

async function fetchAll() {
  await request("GET", false, articles, config.apiUrl + "api/article");
  await request("GET", false, accords, config.apiUrl + "api/agreement");
  await request(
    "GET",
    false,
    partnercountry,
    config.apiUrl + "api/partnercountry"
  );
  await request("GET", false, components, config.apiUrl + "api/component");
  await request("GET", false, events, config.apiUrl + "api/event");
  await request("GET", false, eventspf, config.apiUrl + "api/event/pfonly");
  for (const image of images.value) {
    await request(
      "GET",
      false,
      response,
      `${config.apiUrl}api/image?path=${image.path}&name=${image.nom}`
    );
    if (!response?.value?.error) {
      image.exists = true;
    } else {
      image.exists = false;
    }
  }
  if (accountStore.isLogged()) {
    await request(
      "GET",
      false,
      favoris,
      config.apiUrl + "api/favoris/getbylogin/" + accountStore.login
    );
  }
  isLoaded.value = true;
}

// Renvoie la date formatée
function formatDate(date) {
  const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
  return new Date(date).toLocaleDateString("fr-FR", options);
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
      favori.acc_id === accountStore.login && favori.agree_id === agree_id
  );
}

async function toggleFavoris(agree_id) {
  if (!isFavorited(agree_id)) {
    const requestData = {
      acc_id: accountStore.login,
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
        acc_id: accountStore.login,
        agree_id: agree_id,
      });
    }
  } else {
    await request(
      "delete",
      true,
      response,
      config.apiUrl +
        "api/favoris/delete/" +
        accountStore.login +
        "/" +
        agree_id
    );
    favoris.value.favoris = favoris.value.favoris.filter(
      (favori) =>
        !(favori.acc_id === accountStore.login && favori.agree_id === agree_id)
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
</script>
