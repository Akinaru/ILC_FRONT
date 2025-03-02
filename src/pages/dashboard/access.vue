<template>
    <div v-if="isLoaded" class="container mx-auto px-4 py-6">
      <!-- En-tête avec bannière -->
      <div class="bg-base-200 rounded-xl shadow-lg mb-8 p-6">
        <h1 class="text-2xl font-bold text-center">Gestion des Accès</h1>
        <div class="divider"></div>
        <p class="text-center opacity-75">Gérez les accès administratifs et étudiants au site</p>
      </div>
  
      <!-- SECTION 1: ACCÈS SENSIBLES (ADMIN/CHEF DE DÉPARTEMENT) -->
      <div class="card bg-base-100 shadow-xl mb-10">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Accès Administratifs
          </h2>
          
          <div class="flex items-center mb-6">
            <div class="badge badge-lg p-3 bg-primary text-primary-content">Relations Internationales (RI)</div>
          </div>
  
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Liste des accès -->
            <div class="space-y-4">
              <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Relations Internationales (RI)
              </h3>
              
              <div v-if="access && access.count > 0" class="space-y-3">
                <div v-for="(acc, index) in access.access[1]" :key="index" 
                  class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="card-body p-4">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-3">
                        <!-- Avatar -->
                        <div class="avatar">
                          <div v-if="acc.account" 
                            :style="{ backgroundColor: getColorFromName(acc.account.acc_fullname) }"
                            class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                            <span class="flex items-center justify-center w-full h-full">
                                {{ getInitials(acc.account.acc_fullname) }}
                            </span>
                          </div>
                          <div v-else class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                            <span class="flex items-center justify-center w-full h-full">ILC</span>
                          </div>
                        </div>
                        
                        <!-- Infos utilisateur -->
                        <div>
                          <p class="font-bold">{{ acc.acc_id }}</p>
                          <p class="text-sm opacity-80" v-if="acc.account">{{ acc.account.acc_fullname }}</p>
                          <p class="text-sm opacity-80" v-else>(Nom introuvable)</p>
                        </div>
                      </div>
                      
                      <!-- Dernière connexion -->
                       <div class="flex items-center justify-center">
                        <div class="text-right">
                            <p class="text-xs opacity-70">Dernière connexion:</p>
                            <p class="text-sm" v-if="acc.account && acc.account.acc_lastlogin">
                            {{ formatDate(acc.account.acc_lastlogin) }}
                            </p>
                            <p class="text-sm" v-else>Jamais</p>
                        </div>
                        
                        <!-- Bouton suppression -->
                        <button class="btn btn-circle btn-sm btn-ghost ml-2" @click="openConfirmModal(acc)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Aucun accès n'a été trouvé.</span>
              </div>
            </div>
            
            <!-- Formulaire d'ajout -->
            <div class="card bg-base-200 shadow-sm">
              <div class="card-body">
                <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Ajouter un accès administratif
                </h3>
                
                <form @submit.prevent="addAccess" class="space-y-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Login</span>
                    </label>
                    <input type="text" placeholder="Identifiant utilisateur" v-model="newAccess.login" 
                      class="input input-bordered w-full" />
                  </div>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Niveau d'accès</span>
                    </label>
                    <select class="select select-bordered w-full" v-model="newAccess.access">
                      <option disabled selected>Sélectionnez un niveau d'accès</option>
                      <option value="1">1 (Relations Internationales)</option>
                      <option value="2">2 (Département)</option>
                    </select>
                  </div>
                  
                  <div class="form-control mt-6">
                    <button type="submit" class="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajouter l'accès
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <!-- Section Départements -->
          <div class="mt-8">
            <h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Accès Départements
            </h3>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4" v-if="access && access.count > 0">
              <div v-for="(acc, index) in access.access[2]" :key="index" 
                class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4">
                  <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                      <!-- Avatar -->
                      <div class="avatar">
                        <div class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                            <span class="flex items-center justify-center w-full h-full">
                                {{ getInitials(acc.account?.acc_fullname) }}
                            </span>
                        </div>
                      </div>
                      
                      <!-- Infos utilisateur -->
                      <div>
                        <p class="font-bold">{{ acc.acc_id }}</p>
                        <p class="text-sm opacity-80" v-if="acc.account">{{ acc.account.acc_fullname }}</p>
                        <p class="text-sm opacity-80" v-else>(Inconnu ou non enregistré)</p>
                        <p class="text-xs mt-1 opacity-70">Dernière connexion: 
                          <span v-if="acc.account && acc.account.acc_lastlogin">
                            {{ formatDate(acc.account.acc_lastlogin) }}
                          </span>
                          <span v-else>Jamais</span>
                        </p>
                      </div>
                    </div>
                    
                    <!-- Bouton suppression -->
                    <button class="btn btn-circle btn-sm btn-ghost" @click="openConfirmModal(acc)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Département -->
                  <div class="mt-3 border-t pt-3">
                    <div v-if="acc.account && acc.account.department && acc.account.department.dept_shortname" 
                      class="flex items-center">
                      <div class="badge p-3"
                        :style="{backgroundColor: acc.account.department.dept_color}">
                        {{ acc.account.department.dept_shortname }}
                      </div>
                      <button class="btn btn-circle btn-xs btn-ghost ml-2" 
                        @click="removeDept(acc.acc_id)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div v-else>
                      <button class="btn btn-sm btn-outline" 
                        v-if="!showForms[acc.acc_id]" 
                        @click="showForm(acc.account.acc_id)"
                        :disabled="!acc.account">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Sélectionner un département
                      </button>
                    </div>
                    
                    <!-- Formulaire pour ajouter un département -->
                    <div v-if="showForms[acc.acc_id]" class="mt-3 p-3 bg-base-300 rounded-lg">
                      <form @submit.prevent="submitForm(acc.account.acc_id)" class="space-y-2">
                        <select class="select select-bordered w-full text-sm" v-model="selectedDepartment[acc.account.acc_id]">
                          <option disabled selected>Sélectionnez un département</option>
                          <template v-for="(compo, index) in components.components" :key="index">
                            <optgroup :label="compo.comp_name">
                              <option v-for="(dept, index) in compo.departments" 
                                :key="index" 
                                :value="dept.dept_id" 
                                :style="{ color: dept.dept_color }">
                                ({{ dept.dept_shortname }}) {{ dept.dept_name }}
                              </option>
                            </optgroup>
                          </template>
                        </select>
                        
                        <div class="flex gap-2 justify-end">
                          <button class="btn btn-sm btn-ghost" type="button" @click="showForm(acc.account.acc_id)">Annuler</button>
                          <button class="btn btn-sm btn-primary" type="submit">Valider</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- SECTION 2: ACCÈS ÉTUDIANTS -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-xl font-bold flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            Accès Étudiants
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Liste des accès étudiants -->
            <div>
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-semibold text-lg flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Liste des étudiants autorisés
                </h3>
                <div class="badge badge-primary">{{ filteredEtudiants.length }} étudiants</div>
              </div>
              
              <!-- Barre de recherche -->
              <div class="form-control mb-4">
                <div class="input-group">
                  <input type="text" placeholder="Recherche par nom ou login" 
                    v-model="searchQuery" class="input input-bordered w-full" />
                  <button class="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Tableau des étudiants -->
              <div class="bg-base-200 rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto" v-if="filteredEtudiants.length > 0">
                  <table class="table table-zebra w-full">
                    <thead class="bg-base-300">
                      <tr>
                        <th class="px-4 py-3">#</th>
                        <th class="px-4 py-3">Login</th>
                        <th class="px-4 py-3">Nom</th>
                        <th class="px-4 py-3 text-center">Département</th>
                        <th class="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(acc, index) in filteredEtudiants" :key="index" class="hover">
                        <td class="px-4 py-3 font-medium">{{ index + 1 }}</td>
                        <td class="px-4 py-3 font-mono text-sm">{{ acc.acc_id }}</td>
                        <td class="px-4 py-3" v-if="acc.account">{{ acc.account.acc_fullname }}</td>
                        <td class="px-4 py-3" v-else>
                          <span class="italic opacity-60">Nom introuvable</span>
                        </td>
                        <td class="px-4 py-3 text-center">
                          <div v-if="acc.department" class="badge p-2" 
                            :style="{backgroundColor: acc.department.dept_color}">
                            {{ acc.department.dept_shortname }}
                          </div>
                          <div v-else-if="acc.account" class="badge badge-ghost p-2">Aucun</div>
                          <div v-else class="badge badge-ghost p-2">Introuvable</div>
                        </td>
                        <td class="px-4 py-3">
                          <div class="flex justify-center gap-2">
                            <RouterLink target="_blank" :to="{name: 'Profile', params: {acc_id: acc.acc_id}}" 
                              class="btn btn-circle btn-xs btn-ghost tooltip flex items-center justify-center" data-tip="Afficher le profil">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </RouterLink>
                            <button @click="openConfirmModalAccepted(acc)" 
                              class="btn btn-circle btn-xs btn-ghost tooltip flex items-center justify-center" data-tip="Supprimer">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div v-else class="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto opacity-30 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>Aucun étudiant trouvé pour cette recherche.</p>
                </div>
              </div>
            </div>
            
            <!-- Formulaire d'ajout et importation -->
            <div class="space-y-6">
              <!-- Formulaire d'ajout -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body">
                  <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Ajouter un étudiant
                  </h3>
                  
                  <form @submit.prevent="addAccepted" class="space-y-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text">Login étudiant</span>
                      </label>
                      <input type="text" placeholder="Identifiant étudiant" v-model="newAccepted.login" 
                        class="input input-bordered w-full" />
                    </div>
                    
                    <div class="form-control mt-4">
                      <button type="submit" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Ajouter l'étudiant
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <!-- Importation CSV -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body">
                  <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Importer des étudiants
                  </h3>
                  
                  <ImportComp text="Importer des étudiants en CSV" @csv-imported="handleCsvImported" class="w-full"></ImportComp>
                  
                  <div class="mt-4">
                    <div class="alert alert-info">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>Format du CSV requis: une colonne "login" (sans majuscule)</span>
                    </div>
                    
                    <div class="overflow-x-auto mt-4 bg-base-300 rounded-lg p-3">
                      <table class="table table-compact w-full">
                        <thead>
                          <tr>
                            <th class="text-center">login</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td class="text-center font-mono">sbouc</td></tr>
                          <tr><td class="text-center font-mono">ldama</td></tr>
                          <tr><td class="text-center font-mono">gallottm</td></tr>
                          <tr><td class="text-center font-mono">taillezb</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- MODALS DE CONFIRMATION -->
      <!-- Modal de confirmation suppression accès administratif -->
      <dialog id="confirmModal" ref="confirmModal" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Confirmer la suppression</h3>
          <div class="py-4">
            <p>Voulez-vous vraiment supprimer l'accès pour :</p>
            <div class="mt-3 p-3 bg-base-200 rounded-lg">
              <div v-if="confirmDeleteAccess.account" class="flex items-center gap-2">
                <span class="badge p-2" 
                  :style="{ backgroundColor: `${confirmDeleteAccess.account.role.color ? confirmDeleteAccess.account.role.color : '#aaaaaa'}` }">
                  {{ confirmDeleteAccess.account.role.role }}
                </span>
                <span class="font-bold">{{ confirmDeleteAccess.account.acc_fullname }}</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="badge badge-neutral p-2">Introuvable</span>
                <span class="font-bold">{{ confirmDeleteAccess.acc_id }}</span>
              </div>
            </div>
          </div>
          <div class="modal-action">
            <button class="btn btn-ghost" @click="closeModal">Annuler</button>
            <button class="btn btn-error" @click="removeAccess(confirmDeleteAccess.acc_id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </dialog>
      
      <!-- Modal de confirmation suppression accès étudiant -->
      <dialog id="confirmModalAccepted" ref="confirmModalAccepted" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Confirmer la suppression</h3>
          <div class="py-4">
            <p>Voulez-vous vraiment supprimer l'accès étudiant pour :</p>
            <div class="mt-3 p-3 bg-base-200 rounded-lg">
              <div v-if="confirmDeleteAccepted.account" class="flex items-center gap-2">
                <span v-if="confirmDeleteAccepted.department" class="badge p-2" 
                  :style="{backgroundColor: confirmDeleteAccepted.department.dept_color}">
                  {{ confirmDeleteAccepted.department.dept_shortname }}
                </span>
                <span v-else class="badge badge-neutral p-2">Aucun département</span>
                <span class="font-bold">{{ confirmDeleteAccepted.account.acc_fullname }}</span>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="badge badge-neutral p-2">Introuvable</span>
                <span class="font-bold">{{ confirmDeleteAccepted.acc_id }}</span>
              </div>
            </div>
          </div>
          <div class="modal-action">
            <button class="btn btn-ghost" @click="closeModal">Annuler</button>
            <button class="btn btn-error" @click="removeAccepted(confirmDeleteAccepted.acc_id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </dialog>
    </div>
    <div v-else>
      <LoadingComp></LoadingComp>
    </div>
  </template>

<script setup>

    import { ref, onMounted, nextTick, computed } from 'vue';
    import { request } from '../../composables/httpRequest.js'
    import config from '../../config'
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { addAlert } from '../../composables/addAlert';
    import ImportComp from '../../components/impexp/ImportComp.vue';
    import { decomposeDN } from '../../composables/destructLDAP';
import { addAction } from '../../composables/actionType.js';

    const accountStore = useAccountStore();
    const access = ref([]);
    const account = ref([]);
    const accepted = ref([]);
    const newAccess = ref({ login: '', access: ''});
    const newAccepted = ref({ login: ''});
    const response = ref([]);
    const components = ref([]);
    const confirmDeleteAccess = ref([])
    const confirmDeleteAccepted = ref([])

    const isLoaded = ref(false);
    
    const showForms = ref([]);
    const selectedDepartment = ref([]);

    const searchQuery = ref('');


    function getInitials(fullname) {
        if (!fullname) {
            return 'ILC';
        }
        const names = fullname.split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    function getColorFromName(name) {
        // Créez un hachage simple basé sur le nom
        const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Utilisez le hachage pour déterminer une couleur
        const hue = hash % 360; // Choisissez une teinte entre 0 et 359
        return `hsl(${hue}, 70%, 50%)`; // Utilisez HSL pour une couleur vibrante
    }


    //ouvrir le modal de confirmation de suppression
    function openConfirmModal(acc) {
    
        confirmDeleteAccess.value = acc;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    function openConfirmModalAccepted(acc) {
    
        confirmDeleteAccepted.value = acc;
        const modal = document.getElementById('confirmModalAccepted')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
        const modal2 = document.getElementById('confirmModalAccepted')
        modal2.close()
    }

    async function addAccess(){
        if(newAccess.value.login == ''){
            addAlert('error', {data:{error: 'Vous devez entrer un login.', message:'L\'ajout de l\'accès a été annulé.'}})
            return;
        }
        if(newAccess.value.access == "Selectionnez un niveau d'accès"){
            addAlert('error', {data:{error: 'Vous devez choisir un niveau d\'accès.', message:'L\'ajout de l\'accès a été annulé.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccess.value.login,
            acs_accounttype: newAccess.value.access,
        }; 

        const accountExists = account.value.accounts.some(acc => acc.acc_id === requestData.acc_id);
        
        try {
            if (!accountExists) {
                const decomposedInfo = ref([]);
                
                // Requête LDAP
                try {
                    await request('GET', false, response, config.apiUrl + 'ldap.php/?login=' + newAccess.value.login);
                    await nextTick();
                    decomposedInfo.value = decomposeDN(newAccess.value.login, response.value[0].dn);
                } catch (ldapError) {
                    console.error('Erreur lors de la requête LDAP:', ldapError);
                    throw new Error('Impossible de récupérer les informations LDAP de l\'utilisateur');
                }

                // Création de l'utilisateur
                try {
                    const requestData = {
                        acc_id: decomposedInfo.value.login,
                        acc_fullname: decomposedInfo.value.fullname,
                    };
                    await request('POST', false, response, config.apiUrl + 'api/account', requestData);
                } catch (createError) {
                    console.error('Erreur lors de la création du compte:', createError);
                    throw new Error('Impossible de créer le compte utilisateur');
                }
            }
        } catch (error) {
            addAlert('error', { data: { error: 'Impossible de récupéer les informations.', message: "Le login que vous avez fournis n'est pas reconnu." } });
        }

        await request("POST", true, response, config.apiUrl+'api/access', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'access', response, 'Ajout de l\'access pour '+newAccess.value.login+'. (Accès de niveau '+ newAccess.value.access +')');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        resetInput();
    }
    async function removeAccess(acc_id){
        closeModal();
        const requestData = {
            acc_id: acc_id,
            acc_id_action: accountStore.login
        }
        await request('DELETE', true, response, config.apiUrl+'api/access/delete', requestData);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression de l\'access pour '+acc_id+'.');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
    }


    async function addAccepted(){
        if(newAccepted.value.login == ''){
            addAlert('error', {data:{error: 'Vous devez entrer un login.', message:'L\'ajout de l\'autorisation a été annulée.'}})
            return;
        }
        const requestData = { 
            acc_id: newAccepted.value.login,
        };
        await request("POST", true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 201){
            addAction(accountStore.login, 'access', response, 'Ajout de l\'autorisation pour l\'utilisateur '+requestData.acc_id+'.');
        }
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        resetInput();
    }
    async function removeAccepted(acc_id){
        const requestData = {
            acc_id: acc_id,
        }
        await request('DELETE', true, response, config.apiUrl+'api/acceptedaccount', requestData);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression de l\'autorisation pour l\'utilisateur '+acc_id+'.');
        }
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        closeModal();
    }



    const filteredEtudiants = computed(() => {
        if (!searchQuery.value) {
            return accepted.value.accounts;
        }
        return accepted.value.accounts.filter(acc => {
            const fullNameMatch = acc.account?.acc_fullname?.toLowerCase().includes(searchQuery.value.toLowerCase());
            const idMatch = acc.acc_id?.toString().includes(searchQuery.value.toLowerCase());
            return fullNameMatch || idMatch;
        });
    });





    function resetInput(){
        newAccess.value.login = '';
        newAccess.value.access = document.querySelector('.select').options[0].value;
        newAccepted.value.login = '';
    }

    // Partie gestion du département d'un accès

    async function removeDept(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/account/removedept/'+acc_id);
        if(response.value.status == 202){
            addAction(accountStore.login, 'access', response, 'Suppression du département pour l\'access de '+acc_id+'.');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
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

    async function showForm(acc_id) {
        showForms.value[acc_id] = !showForms.value[acc_id];
    }

    
    // Changer departement d'un utilisateur
    async function submitForm(acc_id) {
        showForms.value[acc_id] = false;
        await request('put', true, response, config.apiUrl+'api/account/changedept/'+acc_id+'/'+selectedDepartment.value[acc_id]);
        if(response.value.status == 200){
            addAction(accountStore.login, 'access', response, 'Changement du département dans l\'access pour '+acc_id+' (Nouveau: '+ selectedDepartment.value[acc_id] +').');
        }
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
    }


    // Partie récupération des données

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        await request('GET', false, accepted, config.apiUrl+'api/acceptedaccount');
        await request('GET', false, components, config.apiUrl+'api/component');
        await request('GET', false, account, config.apiUrl+'api/account');
        isLoaded.value = true;
        if(access.value.access && access.value.access[2]){
            showForms.value = Array(access.value.access[2].length).fill(false);
            selectedDepartment.value = Array(access.value.access[2].length).fill('');
        }
        await nextTick()
        resetInput();
    }

    const handleCsvImported = async (csvData) => {
        const requestData = csvData.map(item => ({
            acc_id: item.login,
        }));

        await request("POST", true, response, config.apiUrl+'api/acceptedaccount/import', requestData);
        if (response.value && response.value.status === 201) {
            addAction(accountStore.login, 'access', response, `Importation de ${response.value.added_accounts.length} étudiants.`);
        }
        
        fetch();
    };


    onMounted(fetch)
</script>