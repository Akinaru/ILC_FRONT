<template>
    <div v-if="isLoaded">
      <!-- Breadcrumbs -->
      <div class="text-sm breadcrumbs font-medium mb-6">
        <ul>
          <li><RouterLink :to="{name: 'Dashboard'}" class="hover:text-primary">Dashboard</RouterLink></li> 
          <li><RouterLink :to="{name: 'EtudiantsDash'}" class="hover:text-primary">Étudiants</RouterLink></li> 
          <li v-if="account && account.acc_id" class="text-primary">{{ account.acc_fullname }}</li>
          <li v-else class="text-error">Utilisateur inconnu</li>
        </ul>
      </div>
  
      <div v-if="account && account.acc_id" class="space-y-8">
        <!-- Header with student info -->
        <div class="bg-base-200 rounded-lg shadow-md overflow-hidden">
          <div class="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-16">
                  <span class="text-xl">{{ account.acc_fullname.charAt(0) }}</span>
                </div>
              </div>
              <div>
                <h1 class="text-2xl font-bold">{{ account.acc_fullname }}</h1>
                <p class="text-sm opacity-75">{{ account.acc_mail }}</p>
              </div>
            </div>
            <div v-if="account.department" class="badge badge-lg" :style="{backgroundColor: account.department.dept_color, color: 'white'}">
              {{ account.department.dept_shortname }}
            </div>
          </div>
        </div>
  
        <!-- Main content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left column - Destination and wishes -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Final Destination -->
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title flex justify-between">
                  Destination finale
                  <label for="my_modal_dest" class="btn btn-sm btn-circle btn-ghost" @click="resetModif">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                  </label>
                </h2>
                
                <div v-if="destination.agreement" class="mt-2">
                  <RouterLink :to="{name: 'Accord', params: {agree_id: destination.agreement.agree_id}}" class="group hover:opacity-90">
                    <div :class="[
                      'bg-base-200 rounded-lg p-4 flex items-center gap-4 transition-all border-l-4',
                      destination.status ? 'border-warning' : 'border-success'
                    ]">
                      <span class="relative inline-block tooltip" :data-tip="destination.agreement?.partnercountry?.parco_name || 'Introuvable'">
                        <span class="fi text-3xl" :class="'fi-' + (destination.agreement?.partnercountry?.parco_code || '')"></span>
                        <span v-if="!destination.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white rounded-full select-none">?</span>
                      </span>
                      
                      <div class="flex-1">
                        <div class="font-bold">{{destination.agreement.university?.univ_name || 'Université indisponible'}}</div>
                        <div class="text-sm opacity-75">
                          {{destination.agreement.university?.univ_city || 'Ville indisponible'}}, 
                          {{destination.agreement.partnercountry?.parco_name || 'Pays indisponible'}}
                        </div>
                        <div class="text-xs mt-1 badge badge-sm">
                          ISCED: {{destination.agreement.isced?.isc_code || 'N/A'}}
                        </div>
                      </div>
                    </div>
                  </RouterLink>
                </div>
                
                <div v-else class="alert mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Aucune destination finale</span>
                </div>
              </div>
            </div>
  
            <!-- Wishes List -->
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title">Liste des voeux</h2>
                
                <div class="space-y-3 mt-4">
                  <div v-for="(label, index) in labels" :key="index" class="bg-base-200 rounded-lg overflow-hidden"
                    :class="[
                      (destination.agreement && wishes?.count > 0 && wishes.wishes[label] && destination.agreement.agree_id === wishes.wishes[label].agree_id)
                        ? (destination.status ? 'border-l-4 border-warning' : 'border-l-4 border-success')
                        : ''
                    ]">
                    <div class="bg-base-300 px-4 py-2 font-medium flex items-center gap-2">
                      <div class="badge badge-sm">{{ index + 1 }}</div>
                      <span>Voeu n° {{ index + 1 }}</span>
                    </div>
                    
                    <RouterLink target="_blank" 
                      :to="{ name: 'Accord', params: { agree_id: wishes.wishes[label]?.agree_id }}" 
                      v-if="wishes && wishes.count > 0 && wishes.wishes[label]" 
                      class="p-4 block hover:bg-base-300 transition-colors">
                      <div class="flex items-center gap-3">
                        <span class="relative inline-block">
                          <span class="fi text-2xl" :class="'fi-' + (wishes.wishes[label].partnercountry?.parco_code)"></span>
                          <span v-if="!wishes.wishes[label].partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white rounded-full select-none">?</span>
                        </span>
                        <div class="flex-1">
                          <div class="font-bold">{{ wishes.wishes[label].university?.univ_name || 'Université indisponible' }}</div>
                          <div class="text-sm opacity-75">
                            {{ wishes.wishes[label].university?.univ_city || 'Ville indisponible' }}, 
                            {{ wishes.wishes[label].partnercountry?.parco_name || 'Pays indisponible' }}
                          </div>
                          <div class="text-xs mt-1 badge badge-sm">
                            ISCED: {{ wishes.wishes[label].isced?.isc_code || 'N/A' }}
                          </div>
                        </div>
                      </div>
                    </RouterLink>
                    
                    <div v-else class="p-4 bg-base-100">
                      <div class="alert bg-base-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Pas de voeu sélectionné</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Documents -->
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title">Documents</h2>
                
                <div class="divider"></div>
                
                <!-- Choix de cours -->
                <div class="mb-4">
                  <div class="flex justify-between items-center mb-2">
                    <h3 class="font-bold">Choix de cours</h3>
                    <div class="flex gap-2">
                      <div v-if="account.acc_validechoixcours" class="badge badge-success gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Validé
                      </div>
                      <div v-else class="badge badge-error gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Non validé
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="myfiles.choixCours.exist" class="flex flex-wrap gap-2">
                    <button class="btn btn-sm btn-outline" @click="openMyFileInNewTab(myfiles.choixCours.path)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                      </svg>
                      Voir
                    </button>
                    
                    <button class="btn btn-sm btn-outline btn-error" @click="openConfirmModal('choix_cours', 'choixCours')">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Supprimer
                    </button>
                    
                    <button class="btn btn-sm" 
                      :class="account.acc_validechoixcours ? 'btn-error' : 'btn-success'"
                      @click="validateChoixCours">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="!account.acc_validechoixcours" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {{ account.acc_validechoixcours ? 'Annuler validation' : 'Valider' }}
                    </button>
                  </div>
                  <div v-else class="alert ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Aucun fichier uploadé</span>
                  </div>
                </div>
                
                <!-- Contrat pédagogique -->
                <div class="mb-4">
                  <h3 class="font-bold mb-2">Contrat pédagogique</h3>
                  <div v-if="myfiles.contratPeda.exist" class="flex flex-wrap gap-2">
                    <button class="btn btn-sm btn-outline" @click="openMyFileInNewTab(myfiles.contratPeda.path)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                      </svg>
                      Voir
                    </button>
                    
                    <button class="btn btn-sm btn-outline btn-error" @click="openConfirmModal('contrat_peda', 'contratPeda')">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                  <div v-else class="alert ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Aucun fichier uploadé</span>
                  </div>
                </div>
                
                <!-- Relevé de notes -->
                <div>
                  <h3 class="font-bold mb-2">Relevé des notes de la mobilité</h3>
                  <div v-if="myfiles.releveNote.exist" class="flex flex-wrap gap-2">
                    <button class="btn btn-sm btn-outline" @click="openMyFileInNewTab(myfiles.releveNote.path)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z" />
                      </svg>
                      Voir
                    </button>
                    
                    <button class="btn btn-sm btn-outline btn-error" @click="openConfirmModal('releve_note', 'releveNote')">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                  <div v-else class="alert ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Aucun fichier uploadé</span>
                  </div>
                </div>
              </div>
            </div>

<!-- Suppression du compte -->
<div class="card bg-base-100 shadow-md mb-10">
  <div class="card-body">
    <h2 class="card-title text-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Suppression du compte
    </h2>

    <div class="divider"></div>

    <div class="alert mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <h3 class="font-bold">Attention !</h3>
        <p class="text-sm">Cette action est <strong>définitive</strong> et entraînera la suppression de toutes vos données. Cette opération ne peut pas être annulée.</p>
      </div>
    </div>

    <div class="flex justify-end">
      <button @click="openConfirmDeleteModal" class="btn btn-outline btn-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Supprimer mon compte
      </button>
    </div>
  </div>
</div>





          </div>
  
          <!-- Right column - Information -->
          <div class="space-y-6">

            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <div class="flex justify-between items-center">
                  <h2 class="card-title">Informations</h2>
                  <label for="my_modal_6" class="btn btn-sm btn-primary" @click="resetModif">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                      <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                    </svg>
                    Modifier
                  </label>
                </div>
                
                <div class="divider"></div>
                
                <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Identité</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_fullname || 'Inconnu' }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Email</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_mail || 'Aucun' }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">N° étudiant</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_studentnum || 'Aucun' }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Année mobilité</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_anneemobilite || 'Aucune' }}</div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Periode de mobilité</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ 
                        account.acc_periodemobilite === 1 ? '🍂 Mobilité d\'automne' : 
                        account.acc_periodemobilite === 2 ? '🌱 Mobilité de printemps' : 
                        'Aucune' 
                      }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Département</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md" 
                      :style="{ borderLeft: `4px solid ${account.department ? account.department.dept_color : '#aaaaaa'}` }">
                      {{ account.department ? account.department.dept_shortname : 'Aucun' }}
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Parcours</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_parcours || 'Aucun' }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Score TOEIC</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ account.acc_toeic || 'Inconnu' }}</div>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Dernière connexion</div>
                    <div class="col-span-2 bg-base-200 p-2 rounded-md">{{ formatDate(account.acc_lastlogin) || 'Jamais' }}</div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 items-center">
                    <div class="text-sm font-medium">Aménagement aux examens</div>
                    <div class="col-span-2">
                      <div v-if="account.acc_amenagement" class="bg-success bg-opacity-10 p-2 rounded-md flex items-center">
                        <div class="badge badge-success mr-2">Oui</div>
                        <span v-if="account.acc_amenagemendesc" class="text-sm">{{ account.acc_amenagemendesc }}</span>
                      </div>
                      <div v-else class="bg-base-200 p-2 rounded-md">
                        <div class="badge badge-neutral">Non</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Témoignage -->
            <div class="card bg-base-100 shadow-md">
              <div class="card-body">
                <h2 class="card-title">Témoignage</h2>
                <div class="divider"></div>

                <div v-if="account.acc_temoignage && account.acc_temoignage.trim() !== ''">
                  <!-- Contenu du témoignage -->
                  <blockquote class="border-l-4 border-primary pl-4 italic text-sm leading-relaxed whitespace-pre-line break-words">
                    {{ account.acc_temoignage }}
                  </blockquote>

                  <!-- Bouton supprimer -->
                  <div class="mt-4 flex justify-end">
                    <button class="btn btn-sm btn-outline btn-error" @click="openConfirmDeleteTemoignageModal()">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>

                <!-- Si pas de témoignage -->
                <div v-else class="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Aucun témoignage renseigné</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="min-h-screen flex items-center justify-center">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body">
            <div class="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="font-bold text-xl mt-4">Étudiant introuvable...</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
    <div v-else>
      <LoadingComp></LoadingComp>
    </div>
  
    <!-- Modal de modification de la destination -->
    <Teleport to="body">
  <input type="checkbox" id="my_modal_dest" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box w-11/12 max-w-3xl rounded-2xl border border-base-300 shadow-xl">
      <h3 class="text-xl font-bold">Modification de la destination</h3>
      <p class="text-sm text-base-content/70 mt-1">Choisissez une nouvelle destination parmi les accords disponibles.</p>
      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

      <!-- Accord sélectionné -->
      <div v-if="selectedNewDestination" class="bg-base-200 rounded-lg p-4 flex items-center gap-4 mb-6">
        <span class="relative inline-block tooltip" :data-tip="selectedNewDestination.partnercountry?.parco_name || 'Introuvable'">
          <span class="fi text-3xl" :class="'fi-' + (selectedNewDestination.partnercountry?.parco_code || '')"></span>
          <span v-if="!selectedNewDestination.partnercountry?.parco_code"
                class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white rounded-full select-none">?</span>
        </span>
        <div class="flex-1">
          <div class="font-bold">{{ selectedNewDestination.university?.univ_name || 'Université indisponible' }}</div>
          <div class="text-sm text-base-content/70">{{ selectedNewDestination.university?.univ_city || 'Ville' }}, {{ selectedNewDestination.partnercountry?.parco_name || 'Pays' }}</div>
          <div class="text-xs mt-1 flex gap-2">
            <span class="badge badge-sm">ISCED: {{ selectedNewDestination.isced?.isc_code || 'N/A' }}</span>
            <span class="badge badge-sm badge-outline">{{ selectedNewDestination.isced?.isc_name || 'Nom ISCED indisponible' }}</span>
          </div>
        </div>
      </div>

      <!-- Liste des accords -->
      <div class="border border-base-300 rounded-lg max-h-96 overflow-y-auto">
        <div class="bg-base-200 p-2 sticky top-0 z-10">
          <input type="text" placeholder="Rechercher un accord..." class="input input-sm w-full" />
        </div>
        <div class="p-2 space-y-2">
          <div v-for="(accord, index) in accords.agreements" :key="index"
               @click="changeDestination(accord)"
               :class="['bg-base-100 rounded-lg p-3 cursor-pointer hover:bg-base-200 transition-all', 
                        selectedNewDestination?.agree_id === accord.agree_id ? 'border-l-4 border-primary' : 'opacity-75']">
            <div class="flex items-center gap-3">
              <span class="relative inline-block">
                <span class="fi text-2xl" :class="'fi-' + (accord.partnercountry?.parco_code || '')"></span>
                <span v-if="!accord.partnercountry?.parco_code"
                      class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white rounded-full select-none">?</span>
              </span>
              <div class="flex-1">
                <div class="font-bold">{{ accord.university?.univ_name || 'Université' }}</div>
                <div class="text-sm text-base-content/70">{{ accord.university?.univ_city || 'Ville' }}, {{ accord.partnercountry?.parco_name || 'Pays' }}</div>
                <div class="text-xs mt-1 flex gap-2">
                  <span class="badge badge-sm">ISCED: {{ accord.isced?.isc_code || 'N/A' }}</span>
                  <span class="badge badge-sm badge-outline">{{ accord.isced?.isc_name || 'Nom ISCED' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <form @submit.prevent="confirmModifDest" class="mt-6">
        <div class="modal-action">
          <label for="my_modal_dest" @click="resetModifDest" class="btn btn-ghost">Annuler</label>
          <button type="submit">
            <label for="my_modal_dest" class="btn btn-primary">Enregistrer</label>
          </button>
        </div>
      </form>
    </div>
  </div>
</Teleport>

  
    <!-- Modal de modification des informations -->
    <Teleport to="body">
  <input type="checkbox" id="my_modal_6" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box w-11/12 max-w-xl rounded-2xl border border-base-300 shadow-xl">
      <h3 class="text-xl font-bold">Modification des informations</h3>
      <p class="text-sm text-base-content/70 mt-1">Mettez à jour les données administratives et académiques de l'étudiant.</p>
      <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

      <form @submit.prevent="confirmModifCompte" class="space-y-4">
        <!-- Tous les champs -->
        <label class="form-control w-full" v-for="(label, key) in {
          acc_mail: 'Mail',
          acc_studentnum: 'Numéro étudiant',
          acc_parcours: 'Parcours',
          acc_toeic: 'Score TOEIC'
        }" :key="key">
          <div class="label">
            <span class="label-text font-medium">{{ label }}</span>
          </div>
          <input :type="key === 'acc_mail' ? 'email' : 'text'" class="input input-bordered w-full" v-model="modifCompte[key]" />
        </label>

        <!-- Sélecteurs -->
        <label class="form-control w-full">
          <div class="label"><span class="label-text font-medium">Années de mobilité</span></div>
          <select class="select select-bordered w-full" v-model="modifCompte.acc_anneemobilite">
            <option disabled value="">Sélectionnez une paire d'années</option>
            <option v-for="(annee, index) in anneesmobilite" :key="index" :value="annee">{{ annee }}</option>
          </select>
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text font-medium">Période de mobilité</span></div>
          <select class="select select-bordered w-full" v-model="modifCompte.acc_periodemobilite">
            <option disabled value="">Sélectionnez une période</option>
            <option value="1">🍂 Mobilité d'automne</option>
            <option value="2">🌱 Mobilité de printemps</option>
          </select>
        </label>

        <label class="form-control w-full">
          <div class="label"><span class="label-text font-medium">Département</span></div>
          <select :disabled="!accountStore.isAdmin()" class="select select-bordered w-full" v-model="modifCompte.dept_id">
            <template v-for="(compo, index) in components.components" :key="index">
              <optgroup :label="compo.comp_name">
                <option v-for="(dept, index) in compo.departments" :key="index" :value="dept.dept_id" :style="{ color: dept.dept_color }">
                  ({{ dept.dept_shortname }}) {{ dept.dept_name }}
                </option>
              </optgroup>
            </template>
          </select>
          <div v-if="!accountStore.isAdmin()" class="label">
            <span class="label-text-alt text-error">Seuls les administrateurs peuvent modifier ce champ</span>
          </div>
        </label>

        <div class="modal-action">
          <label for="my_modal_6" class="btn btn-ghost">Annuler</label>
          <button type="submit">
            <label for="my_modal_6" class="btn btn-primary">Enregistrer</label>
          </button>
        </div>
      </form>
    </div>
  </div>
</Teleport>

  
    <!-- Modal de confirmation suppression -->
    <Teleport to="body">
  <dialog id="confirmModalDoc" ref="confirmModalDoc" class="modal">
    <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
      <h3 class="text-xl font-bold">Confirmer la suppression</h3>
      <p class="text-sm text-base-content/70 mt-1">Cette action est irréversible.</p>
      <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

      <div class="py-2">
        <p>Voulez-vous vraiment supprimer le fichier : <strong>{{ confirmDeleteDocument.title }}</strong> ?</p>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeModal">Annuler</button>
        <button class="btn btn-error" @click="deleteFile(confirmDeleteDocument.folder, confirmDeleteDocument.title, confirmDeleteDocument.type)">
          Supprimer
        </button>
      </div>
    </div>
  </dialog>
</Teleport>


    <!-- Modal de confirmation suppression de compte -->
    <Teleport to="body">
      <dialog id="confirmModalAccount" ref="confirmModalAccount" class="modal">
        <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
          <h3 class="text-xl font-bold">Suppression du compte</h3>
          <p class="text-sm text-base-content/70 mt-1">Les données liées seront supprimées de façon définitive.</p>
          <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

          <div class="py-3">
            <p>Confirmez-vous la suppression du compte ?</p>
          </div>

          <div class="modal-action">
            <button class="btn btn-ghost" @click="closeModal">Annuler</button>
            <button class="btn btn-error" @click="deleteAccount">Supprimer</button>
          </div>
        </div>
      </dialog>
    </Teleport>

    <!-- Modal de confirmation suppression de temoignage -->
    <Teleport to="body">
      <dialog id="confirmModalTemoignage" ref="confirmModalTemoignage" class="modal">
        <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
          <h3 class="text-xl font-bold">Suppression du témoignage</h3>
          <p class="text-sm text-base-content/70 mt-1">Cette action est irréversible et entraînera la suppression définitive du témoignage.</p>
          <div class="w-full h-px bg-gradient-to-r from-error/30 via-error/20 to-transparent my-4"></div>

          <div class="py-3">
            <p>Souhaitez-vous vraiment supprimer le témoignage ?</p>
          </div>

          <div class="modal-action">
            <button class="btn btn-ghost" @click="closeModal">Annuler</button>
            <button class="btn btn-error" @click="supprimerTemoignage">Supprimer</button>
          </div>
        </div>
      </dialog>
    </Teleport>

  </template>

<script setup>
    import { ref, onMounted, nextTick } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { addAction } from '../../composables/actionType';
    import { useRouter } from "vue-router";

    const router = useRouter();
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
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/choix_cours')
        if(response.value.status == 200){
            myfiles.value.choixCours.exist = true;
            myfiles.value.choixCours.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/contrat_peda')
        if(response.value.status == 200){
            myfiles.value.contratPeda.exist = true;
            myfiles.value.contratPeda.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/releve_note')
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

    // Ouvrir le modal de confirmation de suppression du compte
  function openConfirmDeleteModal() {
    const modal = document.getElementById("confirmModalAccount");
    modal.showModal();
  }

  function openConfirmDeleteTemoignageModal() {
    const modal = document.getElementById("confirmModalTemoignage");
    modal.showModal();
  }

    // Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModalDoc');
        modal.close();
        const modal2 = document.getElementById('confirmModalDoc');
        modal2.close();
        const modal3 = document.getElementById("confirmModalAccount");
        modal3.close();
        const modal4 = document.getElementById("confirmModalTemoignage");
        modal4.close();
    }

    async function deleteAccount() {
      closeModal();
      await request("DELETE", true, response, config.apiUrl + "api/account/deletebyid/" + acc_id);
      if (response.value.status == 202) {

        router.push({ name: "EtudiantsDash" });
      }
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

    async function validateChoixCours(){
        await request('PUT', true, response, `${config.apiUrl}api/account/validatechoixcours/${acc_id}`);
        if(response.value.status == 200){
            account.value.acc_validechoixcours = !account.value.acc_validechoixcours;
        }
    }

    async function supprimerTemoignage() {
      closeModal();
      if (!account.value.acc_temoignage) {
        addAlert("error", {
          data: {
            error: `Il n'y a pas de témoignage à supprimer.`,
          },
        });
        return;
      }

      const requestData = {
        acc_id: account.value.acc_id,
      };
      await request(
        "DELETE",
        true,
        response,
        config.apiUrl + "api/account/temoignage",
        requestData
      );
      addAction(accountStore.account.acc_id, 'other', response, 'Suppression du témoignage de '+ account.value.acc_id +'.');
      fetchAll();
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
            acc_periodemobilite: modifCompte.value.acc_periodemobilite != null ? modifCompte.value.acc_periodemobilite : null,
            acc_mail: modifCompte.value.acc_mail != null ? modifCompte.value.acc_mail : 'Aucun mail' ,
            acc_toeic: modifCompte.value.acc_toeic != null ? modifCompte.value.acc_toeic : 0, 
            acc_parcours: modifCompte.value.acc_parcours != null ? modifCompte.value.acc_parcours : null, 
        }
        await request('PUT', true, response, config.apiUrl+'api/account/modif', requestData);
        if (response.value.status === 200) {
            
            // Rafraîchir les données après l'ajout
            addAction(accountStore.account.acc_id, 'admin', response, 'Modification des informations de '+ account.value.acc_fullname +'.');
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
            addAction(accountStore.account.acc_id, 'admin', response, 'Modification de la destination de '+ account.value.acc_fullname +'.');
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
        modifCompte.value.acc_periodemobilite = account.value.acc_periodemobilite;
        modifCompte.value.acc_parcours = account.value.acc_parcours;
        modifCompte.value.dept_id = account.value.department ? account.value.department.dept_id : 'no_dept' 

    }  

    function resetModifDest(){
        selectedNewDestination.value = destination.value.agreement;
    }

    onMounted(fetchAll)

</script>