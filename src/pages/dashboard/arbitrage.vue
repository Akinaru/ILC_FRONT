<template>
    <div v-if="isLoaded">
        <p class="font-bold text-xl text-center">Arbitrage</p>
        <div class="flex">
            <!-- Gauche -->
            <div class=" min-h-screen flex flex-col items-center">
                <p class="text-center py-5">Liste des étudiants</p>

                <!-- Partie filtre étudiants -->
                <div class="flex items-center justify-center pt-5">
                    <div class="bg-base-200 drop-shadow-lg w-96" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg select-none">Filtres</p>
                        <p class="select-none">{{ filteredEtus.length }} résultats</p>
                        <button class="hover:opacity-70 underline" @click="deselectAll">Tout désélectionner</button>

                        <!-- Départements -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('departments')">
                                <p class="select-none">Départements ({{ selectedDepartment.length }} séléctionné{{ selectedDepartment.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.departments ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.departments">
                                <button class="hover:opacity-70 underline" @click="deselectAllDept">Tout désélectionner</button>
                                <div class="flex items-center hover:opacity-60 my-1">
                                    <input id="filt_dept_zero" type="checkbox" class="checkbox " value="Aucun" v-model="selectedDepartment">
                                    <label for="filt_dept_zero" class="flex items-center justify-center w-full cursor-pointer pl-2">
                                        <div class="w-3 h-3 mr-1" :style="{backgroundColor: '#aaaaaa'}"></div>
                                        <label for="filt_dept_zero" class="select-none w-full cursor-pointer">Aucun</label>
                                    </label>
                                </div>
                                <div v-for="(comp, index) in components.components" :key="index">
                                    <div class="lg:block flex flex-wrap">
                                        <p>- {{ comp.comp_name }}</p>
                                        <div v-for="(dept,index) in comp.departments" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                            <input :id="'filt_dept_'+dept.dept_id" type="checkbox" class="checkbox" :value="dept.dept_shortname" v-model="selectedDepartment">
                                            <label :for="'filt_dept_'+dept.dept_id" class="w-full flex items-center justify-center cursor-pointer pl-2">
                                                <div class="lg:w-3 w-6 lg:h-3 h-3 mr-2" :style="{backgroundColor: dept.dept_color}"></div>
                                                <label :for="'filt_dept_'+dept.dept_id" class="select-none w-full hover:cursor-pointer">{{ dept.dept_shortname }}</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Voeux -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('voeux')">
                                <p class="select-none">Nombre de voeux ({{ selectedVoeux.length }} séléctionné{{ selectedVoeux.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.voeux ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.voeux">
                                <button class="hover:opacity-70 underline" @click="deselectAllVoeux">Tout désélectionner</button>
                                
                                <div v-for="(voeu,index) in voeuxNoms" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                    <input :id="'filt_voeux_'+index" type="checkbox" class="checkbox" :value="voeu.val" v-model="selectedVoeux">
                                    <label :for="'filt_voeux_'+index" class="cursor-pointer w-full pl-2">
                                        <label :for="'filt_voeux_'+index" class="select-none w-full hover:cursor-pointer">{{ voeu.name }}</label>
                                    </label>
                                </div>
                            </div>
                        </div>                        
                        <!-- Accords -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('accords')">
                                <p class="select-none">Accords (voeux) ({{ selectedAccord.length }} séléctionné{{ selectedAccord.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.accords ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.accords">
                                <button class="hover:opacity-70 underline" @click="deselectAllAccord">Tout désélectionner</button>

                                <div v-for="(accord,index) in accords.agreements" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                    <input :id="'filt_accord_'+index" type="checkbox" class="checkbox" :value="accord.agree_id" v-model="selectedAccord">
                                    <label :for="'filt_accord_'+index" class="cursor-pointer w-full pl-2">
                                        <span class="relative inline-block mr-1">
                                            <!-- Drapeau -->
                                            <span class="fi" :class="'fi-' + (accord.partnercountry?.parco_code)"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>

                                        <label :for="'filt_accord_'+index" class="select-none w-full hover:cursor-pointer">{{ accord.university?.univ_name || 'Université indisponible' }} - {{ accord.isced?.isc_code || 'Code ISCED ?' }}</label>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- Années de mobilité -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('anneemobilite')">
                                <p class="select-none">Années de mobilité ({{ selectedAnneeMobilite.length }} séléctionné{{ selectedAnneeMobilite.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.anneemobilite ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.anneemobilite">
                                <button class="hover:opacity-70 underline" @click="deselectAllAnneeMobilite">Tout désélectionner</button>
                                <div v-for="(annee, index) in anneesmobilite" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                    <input :id="'filt_annee_'+index" type="checkbox" class="checkbox" :value="annee" v-model="selectedAnneeMobilite">
                                    <label :for="'filt_annee_'+index" class="cursor-pointer w-full pl-2">
                                        <label :for="'filt_annee_'+index" class="select-none w-full hover:cursor-pointer">{{ annee }}</label>
                                    </label>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>

                <!-- Affichage des etudiants -->
                <div class="flex flex-col items-center justify-start w-full">
                    <div class="w-full flex items-center justify-start">
                        <button class="w-fit py-2 hover:opacity-70 underline text-start" @click="watchAllWish">Voir tous les voeux</button>
                    </div>

                    <!-- Barre de recherche -->
                    <label class="input input-bordered flex items-center gap-2 w-full my-2">
                        <input type="text" class="grow" placeholder="Recherche par nom et prénom" v-model="searchQuery" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70">
                            <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                        </svg>
                    </label>

                    <div class="elementDrag bg-base-300 w-96 mb-2 flex items-center justify-center cursor-move select-none hover:opacity-80 flex-col" 
                        :draggable="true" 
                        :id="'etu_drag_'+etu.acc_id"
                        v-for="(etu, index) in filteredEtus" :key="index"
                        :style="{ borderBottom: `4px solid ${etu.department ? etu.department.dept_color : '#aaaaaa'}` }">  

                        <div class="flex items-center justify-between w-full p-1">
                            <p v-if="etu.department" :style="{backgroundColor: etu.department.dept_color}" class="p-2 rounded-lg min-w-16 text-center">{{ etu.department.dept_shortname }}</p>
                            <p v-else class="bg-gray-500 p-2 rounded-lg min-w-16 text-center">Aucun</p>
                            <div class="flex flex-col w-full items-center justify-start">
                                <p class="w-full text-center">{{ etu.acc_fullname }}</p> 
                            </div>
                            <label for="modal_info_etu" class="px-2 hover:opacity-70 btn btn-neutral" @click="changeEtuInfo(etu)">
                                <svg class="stroke-current shrink-0 h-5 w-5" fill="currentColor" height="24px" width="24px"
                                    version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 488.85 488.85"
                                    xml:space="preserve">
                                    <g>
                                        <path d="M244.425,98.725c-93.4,0-178.1,51.1-240.6,134.1c-5.1,6.8-5.1,16.3,0,23.1c62.5,83.1,147.2,134.2,240.6,134.2
                                            s178.1-51.1,240.6-134.1c5.1-6.8,5.1-16.3,0-23.1C422.525,149.825,337.825,98.725,244.425,98.725z M251.125,347.025
                                            c-62,3.9-113.2-47.2-109.3-109.3c3.2-51.2,44.7-92.7,95.9-95.9c62-3.9,113.2,47.2,109.3,109.3
                                            C343.725,302.225,302.225,343.725,251.125,347.025z M248.025,299.625c-33.4,2.1-61-25.4-58.8-58.8c1.7-27.6,24.1-49.9,51.7-51.7
                                            c33.4-2.1,61,25.4,58.8,58.8C297.925,275.625,275.525,297.925,248.025,299.625z"/>
                                    </g>
                                </svg>
                            </label>
                        </div>
                        
                        <!-- Si létudiant a des voeux -->
                        <div v-if="etu.wishes.count > 0" class="bg-base-200 w-full p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapseEtu(etu.acc_id)">
                            <p>Voir les voeux</p>
                            <span :class="isOpen.etudiants[etu.acc_id] ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                        </div>

                        <!-- Affichage des voeux -->
                        <div class="p-1 w-full" v-show="isOpen.etudiants[etu.acc_id]">
                            <div>
                                <div>
                                    <div v-for="(accord, index) in getFilteredAgreements(etu)" :key="index" class="flex justify-between">
                                        <p class="min-w-fit flex items-start justify-center">Voeu {{ accord.place }}</p>
                                        <div class="flex w-full items-start justify-start ml-2">
                                            <span class="relative inline-block mr-1">
                                                <!-- Drapeau -->
                                                <span class="fi" :class="'fi-' + (accord.agreement?.partnercountry?.parco_code)"></span>

                                                <!-- Point d'interrogation si pas de drapeau -->
                                                <span v-if="!accord.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                    ?
                                                </span>
                                            </span>

                                            <p>{{accord.agreement.university?.univ_name || 'Université indisponible'}} {{ accord.agreement.isced?.isc_code || 'Code ISCED ?' }}</p>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>
                        </div>
   

                    </div>

                    <!-- Modal informations étudiant -->
                    <input type="checkbox" id="modal_info_etu" class="select-none modal-toggle" />
                    <div class="modal" role="dialog">
                        <div class="modal-box w-170 max-w-full" :style="{ borderBottom: `4px solid ${infoetudiant.department ? infoetudiant.department.dept_color : '#aaaaaa'}` }">
                            <form method="dialog">
                                <label for="modal_info_etu" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                            </form>
                            <h3 class="text-xl font-bold">{{ infoetudiant.acc_fullname ? infoetudiant.acc_fullname : 'Inconnu' }} <span class="text-sm">({{ infoetudiant.acc_id ? infoetudiant.acc_id : 'Inconnu' }})</span></h3>
                            
                            <div class="mt-3">
                                <div class="divider"></div>
                                <h4 class="font-bold text-lg mb-2">Informations</h4>
                                <div class="flex flex-col">
                                    <p class=" text-gray-400">
                                            <strong>Nombre de vœux:</strong> {{ infoetudiant.wishes ? infoetudiant.wishes.count : 0 }}<br>
                                            <strong>Documents ajouté(s):</strong> {{ infoetudiant.documents?.count || 0 }}/{{ infoetudiant.documents?.countmax }}<br>
                                            <strong>Dernière connexion:</strong> {{ formatDate(infoetudiant.acc_lastlogin) }}<br>
                                            <strong>Aménagement aux éxams:</strong> {{ infoetudiant.acc_amenagement == true ? 'Oui' : 'Non' }}
                                    </p>  
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="divider"></div>
                                <div class="flex flex-col">
                                    <p class=" text-gray-400">
                                            <strong>Email:</strong> {{ infoetudiant.acc_mail ? infoetudiant.acc_mail : 'Aucun' }}<br>
                                            <strong>Numéro étudiant:</strong> {{ infoetudiant.acc_studentnum ? infoetudiant.acc_studentnum : 'Aucun' }}<br>
                                            <strong>Années de mobilité:</strong> {{ infoetudiant.acc_anneemobilite ? infoetudiant.acc_anneemobilite : 'Aucune' }}<br>
                                            <strong>Score TOEIC:</strong> {{ infoetudiant.acc_toeic ? infoetudiant.acc_toeic : 'Aucun' }}<br>
                                            <strong>Département:</strong> {{ infoetudiant.department ? infoetudiant.department.dept_name : 'Aucun' }}<br>
                                            <strong>Parcours:</strong> {{ infoetudiant.acc_parcours ? infoetudiant.acc_parcours : 'Aucun' }}
                                    </p>  
                                </div>
                            </div>
                            <div class="mt-3">
                                <div class="divider"></div>
                                <h4 class="font-bold text-lg mb-2">Voeux</h4>
                                <p v-if="infoetudiant.wishes && infoetudiant.wishes.count == 0">Aucun :(</p>
                                <div v-for="(accord, index) in getFilteredAgreements(infoetudiant)" :key="index" class="flex justify-between">
                                    <p class="min-w-fit">Voeu {{ accord.place }}</p>
                                    <div class="flex w-full items-center justify-start ml-2">
                                        <span class="relative inline-block mr-1">
                                            <!-- Drapeau -->
                                            <span class="fi" :class="'fi-' + (accord.agreement?.partnercountry?.parco_code)"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!accord.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>

                                        <p>{{accord.agreement.university?.univ_name || 'Université indisponible'}} {{ accord.agreement.isced?.isc_code || 'Code ISCED ?' }}</p>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="mt-3" v-if="infoetudiant && infoetudiant.acc_id">
                                <div class="divider"></div>
                                <a :href="$router.resolve({ name: 'Profile', params: { acc_id: infoetudiant.acc_id }}).href" target="_blank">
                                    <button class="btn w-full">Voir le profil</button>
                                </a>
                            </div>
                        </div>
                        <label class="modal-backdrop" for="modal_info_etu">Close</label>
                    </div>

                </div>
            </div>

            <!-- Droite -->
            <div class=" min-h-screen flex flex-col items-center w-full">
                <p class="text-center py-5 w-full">Liste des accords</p>

                <!-- Partie filtre accords -->
                <div class="flex items-center justify-center py-5 w-full">
                    <div class="bg-base-200 drop-shadow-lg w-11/12" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg select-none">Filtres</p>
                        <p class="select-none">{{ filteredArbitrage.length }} résultats </p>
                        <button class="hover:opacity-70 underline" @click="deselectAllArb">Tout désélectionner</button>
                        <!-- Pays -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('pays')">
                                <p class="select-none">Pays ({{ selectedCountries.length }} séléctionné{{ selectedCountries.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.pays ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.pays">
                                <button class="hover:opacity-70 underline" @click="deselectAllCountry">Tout désélectionner</button>
                                <div class="flex flex-wrap items-center justify-start">

                                    <div v-for="(country,index) in partnercountry" :key="index" class="flex items-center hover:opacity-60 my-1 md:w-2/6 xl:w-1/6 hover:cursor-pointer">
                                        <input :id="'filt_pays_'+index" type="checkbox" class="checkbox mx-2 checkbox-sm" :value="country.parco_name" v-model="selectedCountries">
                                        <div class="flex w-full">
                                            <label :for="'filt_pays_'+index" class="w-full cursor-pointer">
                                                <span class="fi mr-1" :class="'fi-'+country.parco_code"></span>
                                                <label :for="'filt_pays_'+index" class="select-none w-full text-sm  hover:cursor-pointer">{{ country.parco_name }}</label>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <!-- Isced -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('isced')">
                                <p class="select-none">Isced ({{ selectedIsced.length }} séléctionné{{ selectedIsced.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.isced ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.isced">
                                <button class="hover:opacity-70 underline" @click="deselectAllIsced">Tout désélectionner</button>
                                <div class="flex flex-wrap items-center justify-start">
                                    <div v-for="(isced,index) in isceds" :key="index" class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer md:w-3/6 xl:w-2/6">
                                        <input :id="'filt_isced_'+index" type="checkbox" class="checkbox" :value="isced.isc_id" v-model="selectedIsced">
                                        <label :for="'filt_isced_'+index" class="cursor-pointer w-full pl-2">
                                            
                                            <label :for="'filt_isced_'+index" class="select-none w-full hover:cursor-pointer">{{ isced.isc_code || 'XX' }} - {{ isced.isc_name || 'Sans code' }}</label>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Accords -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('accordsarbitrage')">
                                <p class="select-none">Accords (voeux) ({{ selectedAccordArbitrage.length }} séléctionné{{ selectedAccordArbitrage.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.accordsarbitrage ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.accordsarbitrage">
                                <button class="hover:opacity-70 underline" @click="deselectAllAccordArbitrage">Tout désélectionner</button>
                                <div class="flex flex-wrap items-center justify-start">

                                    <div v-for="(accord,index) in accords.agreements" :key="index" class="flex items-center hover:opacity-60 my-1 md:w-4/6 xl:w-3/6 hover:cursor-pointer">
                                        <input :id="'filt_accordarbitrage_'+index" type="checkbox" class="checkbox" :value="accord.agree_id" v-model="selectedAccordArbitrage">
                                        <label :for="'filt_accordarbitrage_'+index" class="cursor-pointer w-full pl-2">
                                            <span class="relative inline-block mr-1">
                                                <!-- Drapeau -->
                                                <span class="fi" :class="'fi-' + (accord.partnercountry?.parco_code)"></span>

                                                <!-- Point d'interrogation si pas de drapeau -->
                                                <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                    ?
                                                </span>
                                            </span>

                                            <label :for="'filt_accordarbitrage_'+index" class="select-none w-full hover:cursor-pointer">{{ accord.university?.univ_name || 'Université indisponible' }} - {{ accord.isced?.isc_code || 'Code ISCED ?' }}</label>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Arbitrage -->
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('arbitrage')">
                                <p class="select-none">Arbitrage ({{ selectedArbitrage.length }} séléctionné{{ selectedArbitrage.length > 1 ? 's' : '' }})</p>
                                <span :class="isOpen.arbitrage ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>    
                            </div>
                            <div class="p-1" v-show="isOpen.arbitrage">
                                <button class="hover:opacity-70 underline" @click="deselectAllArbitrage">Tout désélectionner</button>
                                <div>
                                    <div class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                        <input id="filt_arbitrage_1" type="checkbox" class="checkbox" value="aucun" v-model="selectedArbitrage">
                                        <label for="filt_arbitrage_1" class="cursor-pointer w-full pl-2">
                                            <label for="filt_arbitrage_1" class="select-none w-full hover:cursor-pointer">Aucun étudiant</label>
                                        </label>
                                    </div>
                                    <div class="flex items-center hover:opacity-60 my-1 hover:cursor-pointer">
                                        <input id="filt_arbitrage_2" type="checkbox" class="checkbox" value="aumoinsun" v-model="selectedArbitrage">
                                        <label for="filt_arbitrage_2" class="cursor-pointer w-full pl-2">
                                            <label for="filt_arbitrage_2" class="select-none w-full hover:cursor-pointer">Au moins un étudiant</label>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
                <!-- Partie rendu accord -->
                <div class="flex flex-col items-center justify-start w-full select-none">
                    <div v-for="(arbitrage, accordIndex) in filteredArbitrage" :key="'accord-' + accordIndex" class="bg-base-300 w-11/12 mb-4 p-4 rounded-lg">
                        <div class="flex items-center justify-center mb-2">
                            <span class="relative inline-block mr-2">
                                <!-- Drapeau -->
                                <span class="fi md:text-3xl text-xl transition-all duration-200 ease-in-out" :class="'fi-' + (arbitrage.agreement?.partnercountry?.parco_code)"></span>

                                <!-- Point d'interrogation si pas de drapeau -->
                                <span v-if="!arbitrage.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                    ?
                                </span>
                            </span>

                            <p class="font-bold text-lg">{{ arbitrage.agreement.partnercountry?.parco_name || 'Pays indisponible' }}</p>
                        </div>
                        <p class="text-center mb-3">{{ arbitrage.agreement.university?.univ_name || 'Université indisponible' }} - {{ arbitrage.agreement.isced?.isc_code || 'Code ISCED indisponible' }} {{ arbitrage.agreement.isced?.isc_name || 'Nom ISCED indisponible' }} </p>

                        <div class="w-full flex justify-center">
                            <div class="flex flex-wrap gap-4 justify-center w-full">
                                <!-- Rendu des cases -->
                                <div :id="'drop_'+arbitrage.agreement.agree_id+'_'+placeIndex" v-for="(place, placeIndex) in getNumberOfPlace(arbitrage.agreement.agree_id)" :key="'place-' + placeIndex" 
                                    class="dropZones bg-base-200 m-1 h-20 w-72 relative flex items-center justify-center">
                                    <div v-if="arbitrage.accounts[placeIndex] && arbitrage.accounts[placeIndex].account"
                                    draggable="true"
                                    :id="'etu_drag_'+arbitrage.accounts[placeIndex].account.acc_id"
                                    class="h-full w-full flex items-center justify-center elementDrag cursor-move hover:opacity-60"
                                    :style="{borderBottom: `4px solid ${arbitrage.accounts[placeIndex]?.account?.department?.dept_color || '#aaaaaa'}`}">
                                        <p>{{ arbitrage.accounts[placeIndex].account.acc_fullname }}</p>
                                        <button @click="removeEtuFromPlace(arbitrage.agreement.agree_id, placeIndex)" class="hover:cursor-pointer hover:opacity-60 absolute top-0 right-0 p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <p v-else class="">Aucun étudiant</p>
                                </div>
                                <div class="w-72 h-20 m-1 flex items-center justify-center border-8 border-base-200 bg-base-100 hover:opacity-60 cursor-pointer"
                                    @click="addPlace(arbitrage.agreement.agree_id)">
                                    <p class="text-lg font-bold">+</p>
                                </div>
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

<script setup>

    import { ref, onMounted, computed, nextTick, watch } from 'vue'
    import { request } from '../../composables/httpRequest'
    import config from '../../config'
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { useAccountStore } from '../../stores/accountStore';

    const response = ref([])
    const accords = ref([])
    const etudiants = ref([])
    const isceds = ref([])
    const components = ref([])
    const partnercountry = ref([])
    const isLoaded = ref(false)
    const searchQuery = ref('');

    const selectedDepartment = ref([]);
    const selectedIsced = ref([]);
    const selectedAccord = ref([]);
    const selectedAccordArbitrage = ref([]);
    const selectedArbitrage = ref([]);
    const selectedVoeux = ref([]);
    const selectedCountries = ref([]);
    const selectedAnneeMobilite = ref([]);

    const accountStore = useAccountStore();

    const infoetudiant = ref([])

    const arbitrage = ref([])

    const anneesmobilite = ref([])

    const localEtus = ref([]);
    const localArbitrage = ref([])

    const voeuxNoms = [
        {val: 0, name: 'Aucun voeux'},
        {val: 1, name: '1 voeu'},
        {val: 2, name: '2 voeux'},
        {val: 3, name: '3 voeux'},
        {val: 4, name: '4 voeux'},
        {val: 5, name: '5 voeux'},
        {val: 6, name: '6 voeux'},
    ]

    const isOpen = ref({
        pays: false,
        departments: false,
        accords: false,
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
    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, partnercountry, config.apiUrl+'api/partnercountry');
        await request('GET', false, isceds, config.apiUrl+'api/isced');
        await request('GET', false, etudiants, config.apiUrl+'api/account/students');
        await request('GET', false, arbitrage, config.apiUrl+'api/arbitrage');
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

    // Initialisation des données et mise en place des drops
    async function init() {
        // Initialiser localEtus avec les étudiants qui ne sont pas dans arbitrage
        localEtus.value = etudiants.value.accounts
            .filter(etu => !arbitrage.value.some(arbitre => arbitre.account.acc_id === etu.acc_id))
            .reduce((acc, etu) => {
                acc[etu.acc_id] = etu;
                return acc;
        }, {});

        // Initialiser localArbitrage avec les accords et les informations sur les étudiants correspondants
        localArbitrage.value = accords.value.agreements.reduce((acc, accord) => {
            // Obtenir toutes les positions possibles pour l'accord actuel
            const allPositions = getNumberOfPlace(accord.agree_id);

            // Chercher les étudiants correspondants dans arbitrage
            const matchingArbitrages = arbitrage.value.filter(arbitre => arbitre.agreement.agree_id === accord.agree_id);

            // Créer l'objet pour l'accord actuel
            acc[accord.agree_id] = {
                agreement: accord,
                accounts: allPositions.map(pos => {
                    // Chercher les arbitrages qui correspondent à la position actuelle
                    const matchingArbitrage = matchingArbitrages.find(arbitre => arbitre.arb_pos === pos + 1);
                    return {
                        arb_pos: pos + 1, // Les positions doivent être basées sur 1
                        account: matchingArbitrage ? matchingArbitrage.account : null // Mettre account à null si matchingArbitrage n'existe pas
                    };
                })
            };

            return acc;
        }, {});

        // Attendre le prochain "tick" pour assurer que les changements sont appliqués
        await nextTick();

        // Rafraîchir les éléments de drag and drop
        refreshDrag();
        refreshDrop();
    }

    // Changer les informations de l'étudiant qu'on souhaite afficher
    function changeEtuInfo(etu){
        infoetudiant.value = etu;
    }

    // Renvoie la date formatée
    function formatDate(date) {
        const d = new Date(date);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} à ${hours}h${minutes}`;
    }

// Enregistrement de l'arbitrage
async function saveArbitrage() {

   // Sauvegarder l'état précédent pour comparaison
   const previousState = arbitrage.value.map(arb => ({
       acc_id: arb.account.acc_id,
       agree_id: arb.agreement.agree_id,
       arb_pos: arb.arb_pos
   }));
   

   const extractedData = Object.values(localArbitrage.value).reduce((acc, arbitrage) => {
       arbitrage.accounts.forEach(accountInfo => {
           if (accountInfo.account) {
               acc.push({
                   acc_id: accountInfo.account.acc_id,
                   agree_id: arbitrage.agreement.agree_id,
                   arb_pos: accountInfo.arb_pos
               });
           }
       });
       return acc;
   }, []);

   await request('POST', true, response, config.apiUrl+'api/arbitrage', extractedData);
   
   if(response.value.status == 200) {
       // Créer une map des positions précédentes par étudiant et accord
       const previousPositions = new Map(
           previousState.map(state => [`${state.acc_id}-${state.agree_id}`, state.arb_pos])
       );
       
       // Créer une map des nouvelles positions
       const newPositions = new Map(
           extractedData.map(data => [`${data.acc_id}-${data.agree_id}`, data.arb_pos])
       );

       // Trouver les suppressions (étudiants qui ne sont plus sur le même accord)
       const removals = previousState.filter(prevData => {
           const key = `${prevData.acc_id}-${prevData.agree_id}`;
           const hasKey = !newPositions.has(key);
           return hasKey;
       });

       // Trouver les changements (nouveaux placements ou modifications de position)
       const changes = extractedData.filter(newData => {
           const key = `${newData.acc_id}-${newData.agree_id}`;
           const previousPos = previousPositions.get(key);
           return !previousPos || previousPos !== newData.arb_pos;
       });

       // Créer une entrée dans l'historique pour les changements
       for (const data of changes) {
           const requestDataAction = {
               act_description: `Changement de l'arbitrage pour ${data.acc_id} sur l'accord ${data.agree_id} à la position ${data.arb_pos}.`,
               acc_id: accountStore.login,
               act_type: 'arbitrage'
           };
           await request('POST', false, response, config.apiUrl+'api/action', requestDataAction);
       }

       // Créer une entrée dans l'historique pour les suppressions
       for (const data of removals) {
           const requestDataAction = {
               act_description: `Suppression de l'arbitrage pour ${data.acc_id} (précédemment sur l'accord ${data.agree_id}).`,
               acc_id: accountStore.login,
               act_type: 'arbitrage'
           };
           await request('POST', false, response, config.apiUrl+'api/action', requestDataAction);
       }
   }
}


// Liste des étudiants après filtres
const filteredEtus = computed(() => {
    return Object.values(localEtus.value)
        .filter(etu => {
            // Filtre par département avec possibilité de filtrer par "Aucun"
            const matchesDepartments = selectedDepartment.value.length === 0 || 
                (etu.department && selectedDepartment.value.includes(etu.department.dept_shortname)) ||
                (selectedDepartment.value.includes('Aucun') && !etu.department);
            
            // Filtre par recherche
            const matchesSearchQuery = !searchQuery.value || 
                [etu.acc_fullname, etu.acc_id.toString()].some(field => 
                field.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
            
            return matchesDepartments && matchesSearchQuery;
        })
        .filter(etu => {
            // Filtre par accords
            const filteredAgreements = getFilteredAgreements(etu).map(item => item.agreement.agree_id);
            return selectedAccord.value.length === 0 || selectedAccord.value.some(accord => filteredAgreements.includes(accord));
        })
        .filter(etu => {
            // Filtre par nombre de vœux
            const voeuxCount = etu.wishes.count;
            return selectedVoeux.value.length === 0 || selectedVoeux.value.includes(voeuxCount);
        })
        .filter(etu => {
            // Filtre par année de mobilité
            return selectedAnneeMobilite.value.length === 0 || selectedAnneeMobilite.value.includes(etu.acc_anneemobilite);
        })
        .sort((a, b) => {
            // Tri par position du vœu et alphabétiquement
            const aMinPlace = Math.min(...getFilteredAgreements(a).filter(item => selectedAccord.value.includes(item.agreement.agree_id)).map(item => item.place));
            const bMinPlace = Math.min(...getFilteredAgreements(b).filter(item => selectedAccord.value.includes(item.agreement.agree_id)).map(item => item.place));
            if (aMinPlace !== bMinPlace) {
                return aMinPlace - bMinPlace;
            }
            return a.acc_fullname.localeCompare(b.acc_fullname);
        });
});


// Liste des accords avec arbitrage après filtres
const filteredArbitrage = computed(() => {
    return Object.values(localArbitrage.value)
        .filter(arbitrage => {
            const countryFilter = selectedCountries.value.length === 0 || 
                                selectedCountries.value.includes(arbitrage.agreement.partnercountry.parco_name);
            const iscedFilter = selectedIsced.value.length === 0 || 
                                (arbitrage.agreement.isced && selectedIsced.value.includes(arbitrage.agreement.isced.isc_id));
            const accordFilter = selectedAccordArbitrage.value.length === 0 || 
                                selectedAccordArbitrage.value.includes(arbitrage.agreement.agree_id);

            // Vérification si tous les comptes sont null
            const allAccountsNull = arbitrage.accounts.every(account => account.account === null);
            // Vérification s'il y a au moins un compte non null
            const atLeastOneAccountNotNull = arbitrage.accounts.some(account => account.account !== null);

            // Nouveau filtre pour selectedArbitrage
            const arbitrageFilter = (() => {
                if (selectedArbitrage.value.includes('aucun') && allAccountsNull) {
                    return true; // Correspond à 'aucun' (tous les comptes sont null)
                }
                if (selectedArbitrage.value.includes('aumoinsun') && atLeastOneAccountNotNull) {
                    return true; // Correspond à 'aumoinsun' (au moins un compte non null)
                }
                if (!selectedArbitrage.value.length) {
                    return true; // Aucun filtre appliqué si selectedArbitrage est vide
                }
                return false; // Ne correspond à aucun des filtres
            })();

            return countryFilter && iscedFilter && accordFilter && arbitrageFilter;
        })
        .sort((a, b) => {
            // Premier niveau de tri : par nom de pays partenaire
            const countryComparison = a.agreement.partnercountry.parco_name.localeCompare(b.agreement.partnercountry.parco_name);
            
            // Si les pays sont différents, retourne la comparaison des pays
            if (countryComparison !== 0) {
                return countryComparison;
            }
            
            // Deuxième niveau de tri : par nom d'université
            return a.agreement.university.univ_name.localeCompare(b.agreement.university.univ_name);
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
        { place: 6, id: wishes.wsha_six }
        ].filter(wsha => wsha !== null);
        return wishIds.map(wsha => {
        const agreement = accords.value.agreements.find(agreement => agreement.agree_id === wsha.id);
        return { place: wsha.place, agreement };
      }).filter(item => item.agreement !== undefined);
    }

    // Enlever un étudiant d'un accord
    function removeEtuFromPlace(agree_id, pos) {
        const etu = localArbitrage.value[agree_id].accounts[pos].account
        localEtus.value[etu.acc_id] = etu;
        localArbitrage.value[agree_id].accounts[pos].account = null;
        refreshDrag();
        saveArbitrage();
    }

    // Fonction pour ajouter une place temporaire
    async function addPlace(agreeId) {
        // Trouver l'accord correspondant par son ID
        let foundAgreement = accords.value.agreements.find(agreement => agreement.agree_id === agreeId);
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
                account: null
            });

            await nextTick();
            refreshDrop();
        }
    }

    // Renvoie le nombre de place d'un accord
    function getNumberOfPlace(agreeId) {
        const agreements = accords.value.agreements;
        
        const agreement = agreements.find(agreement => agreement.agree_id === agreeId);
        
        if (!agreement) {
            console.error(`Accord avec agreeId ${agreeId} non trouvé.`);
            return [];
        }
        
        const numberOfPlaces = agreement.agree_nbplace;
        
        const studentPositions = arbitrage.value.filter(entry => entry.agree_id === agreeId);
        
        
        const maxPosition = studentPositions.reduce((max, student) => {
            return student.arb_pos > max ? student.arb_pos : max;
        }, numberOfPlaces - 1);
        
        
        const totalPlaces = Math.max(numberOfPlaces, maxPosition );
        
        
        const places = Array.from({ length: totalPlaces }, (v, k) => k);
        
        return places;
    }

    // Quand on change un filtre, permet d'actualiser les drag et drop
    async function handleFiltreEtu() {
        await nextTick();
        refreshDrag();
        refreshDrop();
    }


    watch(selectedDepartment, handleFiltreEtu);
    watch(selectedAccord, handleFiltreEtu);
    watch(selectedVoeux, handleFiltreEtu);
    watch(selectedCountries, handleFiltreEtu);
    watch(selectedIsced, handleFiltreEtu);
    watch(selectedAnneeMobilite, handleFiltreEtu);
    watch(selectedAccordArbitrage, handleFiltreEtu);
    watch(selectedArbitrage, handleFiltreEtu);

    // définit les drop zones
    async function refreshDrop() {
        let dropZones = document.getElementsByClassName('dropZones');
        for (let dropZone of dropZones) {
            dropZone.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            dropZone.addEventListener("drop", function(e) {
                e.preventDefault();
                let id = e.dataTransfer.getData("text/plain");
                let selected = document.getElementById(id);
                if (selected) {
                    const etuId = selected.id.replace('etu_drag_', '');
                    const idMatch = dropZone.id.match(/^drop_(\d+)_(\d+)$/);
                    if (idMatch) {
                        const agree_id = parseInt(idMatch[1]); // Convertir en entier si nécessaire
                        const pos = parseInt(idMatch[2]); // Convertir en entier si nécessaire

                        let etu = localEtus.value[etuId];



                        if (etu) {
                            // Vérifier si l'étudiant est déjà dans localArbitrage.value
                            const existingStudent = localArbitrage.value[agree_id].accounts[pos];
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
                        }else if (!etu) {
                            etu = findStudentInArbitrage(etuId);
                            if((findStudentPositionInArbitrage(etuId)-1) != pos || getCurrentAgreeIdByAccId(etuId) != agree_id){
                                const existingStudent = localArbitrage.value[agree_id].accounts[pos];
                                if (existingStudent && existingStudent.account != null) {
                                    localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[findStudentPositionInArbitrage(etuId)-1].account = existingStudent.account 
                                    localArbitrage.value[agree_id].accounts[pos].account = etu
                                    refreshDrag();
                                    saveArbitrage();
                                }else{
                                    localArbitrage.value[getCurrentAgreeIdByAccId(etuId)].accounts[findStudentPositionInArbitrage(etuId)-1].account = null;
                                    localArbitrage.value[agree_id].accounts[pos].account = etu;                       
                                    refreshDrag();
                                    saveArbitrage();
                                }
                                //Verifier si il y a deja un étudiant dans la dropzone
                            }
                        } else {
                            console.error("Étudiant non trouvé dans localEtus.value ou localArbitrage.value avec etuId :", etuId);
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
        filteredEtus.value.forEach(etu => {
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
    function deselectAllAccordArbitrage(){
        selectedAccordArbitrage.value = [];
    }
    function deselectAllArbitrage(){
        selectedArbitrage.value = [];
    }
    onMounted(fetch)

</script>