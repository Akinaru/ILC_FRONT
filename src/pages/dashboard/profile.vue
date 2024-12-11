<template>
    <div v-if="isLoaded">

        <div class="text-sm breadcrumbs font-bold">
            <ul>
                <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
                <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
                <li v-if="account && account.acc_id">{{ account.acc_fullname }}</li>
                <li v-else>?</li>
            </ul>
        </div>
        <div v-if="account && account.acc_id">
            <p class="text-xl font-bold py-5 bg-base-200 flex items-center justify-center">{{ account.acc_fullname }}<span v-if="account.department != null" :style="{backgroundColor: account.department.dept_color}" class="p-3 mx-3">{{ account.department.dept_shortname }}</span> </p>
            <div>
                <!-- Destination finale -->
                <p v-if="destination.agreement" class="font-bold text-xl py-5">Destination finale</p>
                <div v-if="destination.agreement" class="flex items-center justify-start">
                    <div class="select-none flex justify-between items-center elementDrag h-20 transition-all duration-100 ease-in-out">
                        <RouterLink :to="{name: 'Accord', params: {agree_id: destination.agreement.agree_id}}" class="group hover:opacity-60 relative">

                            <div :class="[
                                'border-2 bg-base-300 p-1 flex items-center justify-center w-full h-20 select-none',
                                destination.status ? 'border-warning' : 'border-green-400'
                                ]">
                                <span class="relative inline-block tooltip mr-2" :data-tip="destination.agreement?.partnercountry?.parco_name || 'Introuvable'">
                                    <!-- Drapeau -->
                                    <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-' + (destination.agreement?.partnercountry?.parco_code || '')"></span>

                                    <!-- Point d'interrogation si pas de drapeau -->
                                    <span v-if="!destination.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                        ?
                                    </span>
                                </span>

                                <p class="w-full select-none">({{ destination.agreement.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{destination.agreement.university?.univ_city || 'Ville indisponible'}} - {{ destination.agreement.university?.univ_name || 'Université indisponible' }}</span> ({{ destination.agreement.isced?.isc_code || 'Code ISCED indisponible' }})</p>    
                            </div>
                        </RouterLink>
                        
                        <label for="my_modal_dest" class="cursor-pointer bg-base-300 ml-1 h-20 w-20 hover:opacity-70 flex items-center justify-center" @click="resetModif">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                    </div>
                </div>
                <!-- Modal de modification de la destination -->
                <input type="checkbox" id="my_modal_dest" class="modal-toggle" />
                <div class="modal fixed inset-0 z-50" role="dialog">
                    <div class="modal-box fixed w-170 max-w-full"> 
                        <h3 class="text-lg font-bold">Modification de la destination</h3>
                        <div class="my-10">
                            <p class="">Accord séléctionné:</p>
                            <div v-if="selectedNewDestination != null" class=" cursor-pointer my-1 select-none flex justify-between items-center elementDrag h-20 transition-all duration-100 ease-in-out w-full">
                                <div class="group w-full relative">
                                    <div class="bg-base-300 p-1 flex items-center justify-center w-full h-20 select-none">
                                        <span class="relative inline-block tooltip mr-2">
                                            <!-- Drapeau -->
                                            <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-' + (selectedNewDestination?.partnercountry?.parco_code || '')"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!selectedNewDestination?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>

                                        <p class="w-full select-none">({{ selectedNewDestination.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{selectedNewDestination.university?.univ_city || 'Ville indisponible'}} - {{ selectedNewDestination.university?.univ_name || 'Université indisponible' }}</span> [({{ selectedNewDestination.isced?.isc_code || 'Code ISCED indisponible' }}) {{ selectedNewDestination.isced?.isc_name || 'Nom ISCED indisponible' }}]</p>    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="border-2 border-neutral w-full flex flex-col max-h-96 overflow-y-scroll my-5" >
                            <div v-for="(accord, index) in accords.agreements" :key="index" 
                            @click="changeDestination(accord)" 
                            class=" cursor-pointer my-1 select-none flex justify-between items-center elementDrag h-20 transition-all duration-100 ease-in-out w-full"
                            :class="{ 'opacity-100': selectedNewDestination && selectedNewDestination.agree_id == accord.agree_id, 'opacity-60': selectedNewDestination && selectedNewDestination.agree_id != accord.agree_id}">
                                <div class="group w-full relative">
                                    <div class="bg-base-300 p-1 flex items-center justify-center w-full h-20 select-none">
                                        <span class="relative inline-block tooltip mr-2">
                                            <!-- Drapeau -->
                                            <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord?.partnercountry?.parco_code || '')"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!accord?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>

                                        <p class="w-full select-none">({{ accord.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{accord.university?.univ_city || 'Ville indisponible'}} - {{ accord.university?.univ_name || 'Université indisponible' }}</span> [({{ accord.isced?.isc_code || 'Code ISCED indisponible' }}) {{ accord.isced?.isc_name || 'Nom ISCED indisponible' }}]</p>    
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form @submit.prevent="confirmModifDest" class="w-full">
                            <div class="modal-action">
                                <label for="my_modal_dest" @click="resetModifDest" class="btn">Annuler</label>
                                <button type="submit">
                                    <label for="my_modal_dest" class="btn btn-success">Enregistrer</label>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Voeux & Informations -->
                <div class="flex md:flex-row flex-col justify-between w-full pt-5">
                    <!-- Liste des voeux -->
                    <div class="w-full flex items-center justify-start flex-col">
                        <p class="font-bold text-xl py-5 flex justify-start items-center">Liste des voeux:</p>
                        <div v-for="(label, index) in labels" :key="index">
                            <div class="w-fit flex items-center justify-start my-1 bg-base-300 border-2"
   :class="[
       (destination.agreement && wishes?.count > 0 && wishes.wishes[label] && destination.agreement.agree_id == wishes.wishes[label].agree_id)
           ? (destination.status ? 'border-warning' : 'border-green-400')
           : 'border-base-300'
   ]">
                                <p class="font-bold text-sm xl:text-lg min-w-fit p-5 transition-all duration-100 ease-in-out">Voeu n° {{ index+1 }}</p>
                                <RouterLink target="_blank" :to="{ name: 'Accord', params: { agree_id: wishes.wishes[label].agree_id }}" v-if="wishes && wishes.count > 0 && wishes.wishes[label]" class="bg-base-300 cursor-pointer hover:opacity-50 select-none flex justify-between items-center elementDrag w-96 h-20">
                                    <div class=" flex items-center justify-center h-20 select-none">
                                        <span class="relative inline-block mr-2">
                                                <!-- Drapeau -->
                                                <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (wishes.wishes[label].partnercountry?.parco_code)"></span>

                                                <!-- Point d'interrogation si pas de drapeau -->
                                                <span v-if="!wishes.wishes[label].partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                    ?
                                                </span>
                                            </span>
                                        <p class="w-full select-none">({{ wishes.wishes[label].partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{wishes.wishes[label].university?.univ_city || 'Ville indisponible'}} - {{ wishes.wishes[label].university?.univ_name || 'Université indisponible' }}</span> ({{ wishes.wishes[label].isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                        
                                    </div>
                                </RouterLink>
                                <div v-else class="w-96 flex items-center justify-center">
                                    <p class="select-none">Pas de voeu séléctionné</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Informations -->
                    <div class="w-full flex items-center justify-start flex-col ">
                        <div class="w-3/5 flex items-center justify-center flex-col">
                            <p class="font-bold text-xl py-5 w-full flex items-center justify-center">Informations:</p>
                            
                            <!-- Idéntitée -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Identité</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_fullname || 'Inconnu' }}</p>
                            </label>

                            <!-- Mail -->
                            <label class="form-control w-full" >
                                <div class="label">
                                    <span class="label-text">Email</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_mail || 'Aucun' }}</p>
                            </label>

                            <!-- numéro étudiant -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Numéro étudiant</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_studentnum || 'Aucun' }}</p>
                            </label>

                            <!-- Années de mobilités -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Année de mobilité</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_anneemobilite || 'Aucune' }}</p>
                            </label>

                            <!-- Département -->
                            <label class="form-control w-full " >
                                <div class="label">
                                    <span class="label-text">Département</span>
                                </div>
                                <p class="w-full bg-base-300 p-3"
                                :style="{ borderBottom: `4px solid ${account.department ? account.department.dept_color : '#aaaaaa'}` }"
                                >{{ account.department ? account.department.dept_shortname : 'Aucun' }}</p>
                            </label>

                            <!-- Parcours -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Parcours</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_parcours || 'Aucun' }}</p>
                            </label>

                            <!-- TOEIC -->
                            <label class="form-control w-full" >
                                <div class="label">
                                    <span class="label-text">Score TOEIC</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ account.acc_toeic || 'Inconnu' }}</p>
                            </label>

                        <!-- Dernière connexion -->
                        <label class="form-control w-full" >
                                <div class="label">
                                    <span class="label-text">Dernière connexion</span>
                                </div>
                                <p class="w-full bg-base-300 p-3">{{ formatDate(account.acc_lastlogin) || 'Jamais' }}</p>
                            </label>

                            <!-- Boutton de modification -->
                            <label for="my_modal_6" class="btn btn-primary w-full max-w-sm my-10" @click="resetModif">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                                <p>Modifier</p>
                            </label>

                            <!-- Modal de modification des informations -->
                            <input type="checkbox" id="my_modal_6" class="modal-toggle" />
                            <div class="modal" role="dialog">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Modification des informations</h3>
                                    

                                    <form @submit.prevent="confirmModifCompte" class="w-full">
                                        <!-- Mail -->
                                        <label class="form-control w-full">
                                            <div class="label">
                                                <span class="label-text">Mail</span>
                                            </div>
                                            <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_mail"/>
                                        </label>
                                        <!-- Numéro étudiant -->
                                        <label class="form-control w-full">
                                            <div class="label">
                                                <span class="label-text">Numéro étudiant</span>
                                            </div>
                                            <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_studentnum"/>
                                        </label>
                                        <!-- Années mobilité -->
                                        <label class="form-control w-full max-w-lg">
                                            <div class="label">
                                                <span class="label-text">Années de mobilité</span>
                                            </div>
                                            <select class="select select-bordered" v-model="modifCompte.acc_anneemobilite">
                                                <option disabled selected value="">Séléctionnez une paire d'années</option>
                                                        <option v-for="(annee, index) in anneesmobilite" :key="index" :value="annee">{{ annee }}</option>
                                            </select>
                                        </label>
                                        <!-- Département -->
                                        <label class="form-control w-full">
                                            <div class="label">
                                                <span class="label-text">Département</span>
                                            </div>
                                            <select
                                            :disabled="accountStore.access !== 1"
                                            class="select select-bordered w-full" 
                                            v-model="modifCompte.dept_id">
                                                
                                                <template v-for="(compo, index) in components.components" :key="index">
                                                    <optgroup :label="compo.comp_name">
                                                        <option v-for="(dept, index) in compo.departments" :key="index" :value="dept.dept_id" :style="{ color: dept.dept_color }">({{ dept.dept_shortname }}) {{ dept.dept_name }} </option>
                                                    </optgroup>
                                                </template>
                                            </select>
                                            <p v-if="accountStore.access != 1">Seul les administrateurs peuvent modifier ce champ.</p>
                                        </label>
                                        <!-- Parcours -->
                                        <label class="form-control w-full">
                                            <div class="label">
                                                <span class="label-text">Parcours</span>
                                            </div>
                                            <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_parcours"/>
                                        </label>
                                        <!-- Toeic -->
                                        <label class="form-control w-full">
                                            <div class="label">
                                                <span class="label-text">Toeic</span>
                                            </div>
                                            <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_toeic"/>
                                        </label>
                                        <div class="modal-action">
                                            <label for="my_modal_6" class="btn">Annuler</label>
                                            <button type="submit">
                                                <label for="my_modal_6" class="btn btn-success">Enregistrer</label>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Documents -->
                <div class="w-full flex items-center justify-center flex-col">
                    <div class="w-1/2">
                        <p class="text-xl font-bold w-full">Documents</p>


                            <!-- Choix de cours -->
                            <div class="form-control w-full py-3">
                                <div class="label">
                                    <span class="label-text">Choix de cours</span>
                                </div>
                                <div class="w-full flex flex-col" v-if="myfiles.choixCours.exist">
                                    <button class="btn btn-neutral mb-1" @click="openMyFileInNewTab(myfiles.choixCours.path)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span class="text-warning">Voir votre fichier</span>
                                    </button>
                                    
                                    <button class="btn btn-neutral mb-1" @click="openConfirmModal('choix_cours', 'choixCours')">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span class="text-error">Supprimer le fichier</span>
                                    </button>
                                </div>
                                <button class="btn btn-neutral mb-1" v-else disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span >Aucun fichier</span>
                                    </button>
                            </div>
                            <!-- Contrat pédagogique -->
                            <div class="form-control w-full py-3">
                                <div class="label">
                                    <span class="label-text">Contrat pédagogique</span>
                                </div>
                                <div class="w-full flex flex-col" v-if="myfiles.contratPeda.exist">
                                    <button class="btn btn-neutral mb-1" @click="openMyFileInNewTab(myfiles.contratPeda.path)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span class="text-warning">Voir votre fichier</span>
                                    </button>
                                    
                                    <button class="btn btn-neutral mb-1" @click="openConfirmModal('contrat_peda', 'contratPeda')">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span class="text-error">Supprimer le fichier</span>
                                    </button>
                                </div>
                                <button class="btn btn-neutral mb-1" v-else disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span >Aucun fichier</span>
                                    </button>
                            </div>
                            <!-- Relevé de notes -->
                            <div class="form-control w-full py-3">
                                <div class="label">
                                    <span class="label-text">Relevé des notes de la mobilité</span>
                                </div>
                                <div class="w-full flex flex-col" v-if="myfiles.releveNote.exist">
                                    <button class="btn btn-neutral mb-1" @click="openMyFileInNewTab(myfiles.releveNote.path)">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span class="text-warning">Voir votre fichier</span>
                                    </button>
                                    
                                    <button class="btn btn-neutral mb-1" @click="openConfirmModal('releve_note', 'releveNote')">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span class="text-error">Supprimer le fichier</span>
                                    </button>
                                </div>
                                <button class="btn btn-neutral mb-1" v-else disabled>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                                        </svg>
                                        <span >Aucun fichier</span>
                                    </button>
                            </div>
                    </div>
                            <!-- Modal de confirmation suppression -->
                            <dialog id="confirmModalDoc" ref="confirmModalDoc" class="modal">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                    <div class="py-3">
                                        <p>Confirmez vous la suppression du fichier: <strong>{{ confirmDeleteDocument.title }}</strong></p>
                                    </div>
                                    <div class="modal-action">
                                        <button class="btn btn-error" @click="closeModal">Annuler</button>
                                        <button class="btn btn-success" @click="deleteFile(confirmDeleteDocument.folder, confirmDeleteDocument.title, confirmDeleteDocument.type)">Confirmer</button>
                                    </div>
                                </div>
                            </dialog>
                </div>


            </div>
        </div>
        <div v-else>
            <p class="flex font-bold items-center justify-center p-52">Étudiant introuvable...</p>
        </div>
    </div>

    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { ref, onMounted, nextTick } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
import { addAction } from '../../composables/actionType';
 
    const accountStore = useAccountStore();
    const route = useRoute();
    const acc_id = route.params.acc_id;
    const account = ref([]);
    const accords = ref([])
    const department = ref([]);
    const components = ref([]);
    const wishes = ref([])
    const response = ref([])
    const destination = ref([])
    const labels = ref(['agree_one', 'agree_two', 'agree_three', 'agree_four', 'agree_five', 'agree_six']);
    const anneesmobilite = ref([]);
    const selectedNewDestination = ref([]);
    const isLoaded = ref(false);


    const myfiles = ref({
        choixCours: {
            exist: false,
            path: ''
        },
        contratPeda: {
            exist: false,
            path: ''
        },
        releveNote: {
            exist: false,
            path: ''
        },
    });
    const confirmDeleteDocument = ref({
        folder: '',
        title: '',
        type: ''
    });

    const modifCompte = ref([])

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

    // Récupère toutes les informations
    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        resetModif();
        await request('GET', false, wishes, config.apiUrl+'api/wishagreement/getbylogin/'+acc_id);
        await request('GET', false, destination, config.apiUrl + 'api/arbitrage/getbyid/'+account.value.acc_id);
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, accords, config.apiUrl+'api/agreement');
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/choix_cours/'+acc_id)
        if(response.value.status == 200){
            myfiles.value.choixCours.exist = true;
            myfiles.value.choixCours.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/contrat_peda/'+acc_id)
        if(response.value.status == 200){
            myfiles.value.contratPeda.exist = true;
            myfiles.value.contratPeda.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/releve_note/'+acc_id)
        if(response.value.status == 200){
            myfiles.value.releveNote.exist = true;
            myfiles.value.releveNote.path = response.value.path;
        }

        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 3; i++) {
            const startYear = currentYear + i;
            const endYear = startYear + 1;
            anneesmobilite.value.push(`${startYear}-${endYear}`);
        }
        await nextTick();
        selectedNewDestination.value = destination.value.agreement;
        isLoaded.value = true;
    }

    // Ouvrir le modal de confirmation de suppression
    function openConfirmModal(fileFolder, fileTitle, fileType) {
        confirmDeleteDocument.value.folder = fileFolder;
        confirmDeleteDocument.value.title = fileTitle;
        confirmDeleteDocument.value.type = fileType;
        const modal = document.getElementById('confirmModalDoc');
        modal.showModal();
    }

    // Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModalDoc');
        modal.close();
        const modal2 = document.getElementById('confirmModalDoc');
        modal2.close();
    }


    // Supprimer un fichier
    async function deleteFile(fileFolder, fileTitle, fileType) {
        closeModal();
        await request('GET', true, response, `${config.apiUrl}api/documents/deleteperso/${fileFolder}/${fileFolder}_${acc_id}`);
        
        if (response.value.status == 200) {
            myfiles.value[fileTitle].exist = false;
            myfiles.value[fileTitle].path = '';
        }
    }

    function changeDestination(accord){
        selectedNewDestination.value = accord;
    }

    async function openMyFileInNewTab(filePath) {
        // Diviser le chemin du fichier en segments pour obtenir le nom du fichier
        const segments = filePath.split('/');
        const fileName = segments[segments.length - 1]; // Dernier segment est le nom du fichier

        // Obtenir le dossier (suppressions des derniers segments pour obtenir le dossier parent)
        const folder = segments[2]; // Supposons que "etu" est toujours à l'index 2
        const username = fileName.split('_')[2].split('.')[0]; // Obtenir le login depuis le nom de fichier

        // Construire l'URL complète pour accéder au fichier
        const fileUrl = `${config.apiUrl}api/documents/getperso/etu/${folder}/${fileName}`;

        // Ouvrir le fichier dans un nouvel onglet si c'est un PDF
        if (fileName.toLowerCase().endsWith('.pdf')) {
            window.open(fileUrl, '_blank');
        } else {
            // Si ce n'est pas un PDF, forcer le téléchargement du fichier
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;  // Propose le téléchargement avec le nom du fichier
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    async function confirmModifCompte(){
        const requestData = {
            acc_id: account.value.acc_id,
            acc_studentnum: modifCompte.value.acc_studentnum != null ? modifCompte.value.acc_studentnum : 0,
            dept_id: modifCompte.value.dept_id != 'no_dept' ? modifCompte.value.dept_id : null,
            acc_anneemobilite: modifCompte.value.acc_anneemobilite != null ? modifCompte.value.acc_anneemobilite : null,
            acc_mail: modifCompte.value.acc_mail != null ? modifCompte.value.acc_mail : 'Aucun mail' ,
            acc_toeic: modifCompte.value.acc_toeic != null ? modifCompte.value.acc_toeic : 0, 
            acc_parcours: modifCompte.value.acc_parcours != null ? modifCompte.value.acc_parcours : null, 
        }
        await request('PUT', true, response, config.apiUrl+'api/account/modif', requestData);
        if (response.value.status === 200) {
            
            // Rafraîchir les données après l'ajout
            addAction(accountStore.login, 'admin', response, 'Modification des informations de '+ account.value.acc_fullname +'.');
        }
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        resetModif();
    }

    async function confirmModifDest(){
        const arbitrage = ref([]);
        await request('GET', false, arbitrage, config.apiUrl+'api/arbitrage');
        const agreeArbitrages = arbitrage.value.filter(item => item.agree_id === selectedNewDestination.value.agree_id);
    
        // Trouver la plus petite valeur disponible pour arb_pos
        let arb_pos = 1;
        while (agreeArbitrages.some(item => item.arb_pos === arb_pos)) {
            arb_pos++;
        }
        const requestData = {
            acc_id: account.value.acc_id,
            agree_id: selectedNewDestination.value.agree_id,
            arb_pos: arb_pos
        }
        console.log(requestData)
        await request('PUT', true, response, config.apiUrl+'api/arbitrage', requestData);
        if (response.value.status === 200) {
            
            // Rafraîchir les données après l'ajout
            addAction(accountStore.login, 'admin', response, 'Modification de la destination de '+ account.value.acc_fullname +'.');
        }
        await request('GET', false, destination, config.apiUrl + 'api/arbitrage/getbyid/'+account.value.acc_id);
        await nextTick();
        resetModif();
        resetModifDest();
    }

    function resetModif(){
        modifCompte.value.acc_studentnum = account.value.acc_studentnum;
        modifCompte.value.acc_mail = account.value.acc_mail;
        modifCompte.value.acc_toeic = account.value.acc_toeic;
        modifCompte.value.acc_anneemobilite = account.value.acc_anneemobilite;
        modifCompte.value.dept_id = account.value.department ? account.value.department.dept_id : 'no_dept' 

    }  

    function resetModifDest(){
        selectedNewDestination.value = destination.value.agreement;
    }

    onMounted(fetchAll)

</script>