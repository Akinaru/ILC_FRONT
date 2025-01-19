<template>
    <div class="flex flex-col" v-if="isLoaded">
        <p class="font-bold text-lg pb-5">Bienvenue sur votre profil étudiant lié aux relations internationales.</p>

        <!-- Etapes -->
        <div class="w-full flex items-center justify-center flex-col py-4 md:py-10">
            <p class="py-4">Avancement des étapes actuelles:</p>
            <ul class="steps steps-vertical sm:steps-horizontal max-w-lg">
                <li class="step step-primary">Inscription</li>
                <li class="step step-primary">Choix des vœux</li>
                <li class="step" :class="{'step-primary' : destination.agree_id || joursRestants(admin.adm_datelimite) < 0}">Arbitrage</li>
                <li class="step" :class="{'step-primary' : destination.agree_id}">Validation</li>
            </ul>
        </div>

        <!-- Destination finale -->
        <div v-if="destination.agreement" class="flex items-center justify-center flex-col">
            <p class="text-sm font-bold pb-2">Destination finale</p>
            <div class="select-none flex flex-col justify-between items-center elementDrag xl:w-120 md:w-105 w-96 h-20 transition-all duration-100 ease-in-out">
                <RouterLink :to="{name: 'Accord', params: {agree_id: destination.agreement.agree_id}}" class="group hover:opacity-60 relative">
                    
                    <div :class="[
                        'border-2 p-1 flex items-center justify-center w-full h-20 select-none',
                        destination.status ? 'border-warning' : 'border-green-400'
                    ]">
                        <span class="tooltip mr-2" :data-tip="destination.agreement.partnercountry.parco_name">
                            <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+destination.agreement.partnercountry.parco_code "></span>
                        </span>
                        <p class="w-full select-none">({{ destination.agreement.partnercountry.parco_name }}) <span class="font-bold">{{destination.agreement.university.univ_city}} - {{ destination.agreement.university.univ_name }}</span> ({{ destination.agreement.isced.isc_code }})</p>    
                    </div>
                </RouterLink>
                <p v-if="destination.status" class="text-sm italic mt-1">Cette destination n'est pas définitive et pourra être modifiée avant la validation finale.</p>
            </div>
        </div>

        <!-- Partie informations -->
        <div>
            <div v-if="account && account.acc_id" class="block md:flex w-full justify-center items-start">
                <!-- Informations -->
                 <div class="w-full md:w-1/2 pt-10 flex items-center justify-center flex-col">
                    <p class="text-lg font-bold w-full max-w-xl mb-5">Vos informations:</p>
                    <p class="w-full max-w-xl">Certaines de vos informations ne peuvent pas être modifiées. Renseignez-vous auprès d'ILC si besoin.</p>
                    <div class="w-full max-w-xl">

                        <!-- Fullname -->
                        <label class="form-control w-full items-center justify-center">
                            <div class="label w-full">
                                <span class="label-text">Identité</span>
                            </div>
                            <input type="text" :value="account.acc_fullname" class="input input-bordered w-full" disabled />
                        </label>

                        <!-- Email -->
                        <label class="form-control w-full items-center justify-center" >
                            <div class="label w-full">
                                <span class="label-text">Email</span>
                            </div>
                            <input type="text" :value="account.acc_mail" class="input input-bordered w-full " disabled/>
                        </label>

                        <!-- Numéro étudiant -->
                        <label class="form-control w-full items-center justify-center">
                            <div class="label w-full">
                                <span class="label-text">Numéro étudiant</span>
                            </div>
                            <input type="text" :value="account.acc_studentnum" class="input input-bordered w-full " disabled />
                        </label>

                         <!-- Choix Cours -->
                         <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Choix cours</span>
                                </div>
                                <input 
                                    type="text" 
                                    :value="account.acc_validechoixcours ? 'Validé ✅' : 'Pas encore validé ❌'" 
                                    class="input input-bordered w-full" 
                                    disabled
                                    />
                            </label>

                        <!-- Département -->
                        <label class="form-control w-full items-center justify-center " >
                            <div class="label w-full">
                                <span class="label-text">Département</span>
                            </div>
                            <input type="text" 
                                :value="account.department ? account.department.dept_shortname : 'Aucun'" 
                                class="input input-bordered w-full" 
                                :style="{ borderBottom: '2px solid ' + (account.department && account.department.dept_color ? account.department.dept_color : 'grey') }" 
                                disabled />

                        </label>

                        <!-- Parcours -->
                        <label class="form-control w-full items-center justify-center">
                            <div class="label w-full">
                                <span class="label-text">Parcours de BUT envisagé</span>
                            </div>
                            <input type="text" :value="account.acc_parcours" class="input input-bordered w-full" disabled />
                        </label>

                        <!-- Score toeic -->
                        <label class="form-control w-full items-center justify-center" >
                            <div class="label w-full">
                                <span class="label-text">Score TOEIC</span>
                            </div>
                            <input type="text" :value="account.acc_toeic" class="input input-bordered w-full " disabled/>
                        </label>

                        <!-- Années mobilite -->
                        <label class="form-control w-full items-center justify-center" >
                            <div class="label w-full">
                                <span class="label-text">Année de mobilité</span>
                            </div>
                            <input type="text" :value="account.acc_anneemobilite" class="input input-bordered w-full " disabled/>
                        </label>

                        <label for="modal_modif" class="btn btn-primary w-full mt-3" @click="modifEtu(account)">Modifier</label>
                    </div>
                </div>

                <!-- Modal modification -->
                <input type="checkbox" id="modal_modif" class="modal-toggle" />
                <div class="modal modal-bottom sm:modal-middle" role="dialog">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Modification de vos information</h3>
                        <form @submit.prevent="confirmModifEtu" class="w-full">

                            <!-- Mail -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Email</span>
                                </div>
                                <input type="text" placeholder="ex: maxime.gallotta@etu.univ-smb.fr" class="input input-bordered w-full" v-model="currentUnivEtu.acc_mail"/>
                            </label>

                            <!-- Numéro étudiant -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Numéro étudiant (INE)</span>
                                </div>
                                <input type="text" placeholder="XXXXXXXX" class="input input-bordered w-full" v-model="currentUnivEtu.acc_studentnum"/>
                            </label>

                            <!-- Parcours  -->
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Parcours de BUT envisagé</span>
                                </div>
                                <input type="text" placeholder="(Parcours lors de la mobilité)" class="input input-bordered w-full" v-model="currentUnivEtu.acc_parcours"/>
                            </label>

                            
                            <div class="modal-action">
                                <label for="modal_modif" class="btn ">Annuler</label>
                                <button type="submit">
                                    <label for="modal_modif" class="btn btn-success">Enregistrer</label>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Documents -->
                 <div class="w-full md:w-1/2 pt-10 flex items-center justify-center flex-col">
                    <p class="text-md font-bold">Vos documents:</p>
                    <div class="w-full max-w-xl">
                        <!-- Choix de cours -->
                        <div class="form-control w-full py-3">
                            <div class="label">
                                <span class="label-text">Choix de cours</span>
                            </div>
                            <div class="btn btn-neutral text-success mb-1" v-if="files.choixCours.exist" @click="openFileInNewTab(files.choixCours.path)">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                                Telecharger le fichier disponible
                            </div>
                            <div class="btn mb-1" disabled v-else>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>                                
                                    Aucun fichier disponible
                                </div>
                            <input accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'choixCours')" type="file" class="file-input file-input-bordered w-full mb-1"/>

                            <div v-if="files.choixCours.file != null" class="btn btn-neutral text-primary mb-1 flex items-center space-x-2" @click="saveFile('choix_cours_'+accountStore.login, 'documents/etu/choix_cours', files.choixCours.file)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3l9 9-9 9v-7H3V10h10z" />
                                </svg>
                                <span>Envoyer votre fichier</span>
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
                                    <span class="text-error">Supprimer votre fichier</span>
                                </button>
                            </div>
                        </div>
                        <!-- Contrat pédagogique -->
                        <div class="form-control w-full py-3">
                            <div class="label">
                                <span class="label-text">Contrat pédagogique</span>
                            </div>
                            <div class="btn btn-neutral text-success mb-1" v-if="files.contratPeda.exist" @click="openFileInNewTab(files.contratPeda.path)">
                                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                                Telecharger le fichier disponible
                            </div>
                            <div class="btn mb-1" disabled v-else>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>                                
                                    Aucun fichier disponible
                                </div>
                            <input accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'contratPeda')" type="file" class="file-input file-input-bordered w-full mb-1"/>

                            <div v-if="files.contratPeda.file != null" class="btn btn-neutral text-primary mb-1 flex items-center space-x-2" @click="saveFile('contrat_peda_'+accountStore.login, 'documents/etu/contrat_peda', files.contratPeda.file)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3l9 9-9 9v-7H3V10h10z" />
                                </svg>
                                <span>Envoyer votre fichier</span>
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
                                    <span class="text-error">Supprimer votre fichier</span>
                                </button>
                            </div>
                        </div>
                        <!-- Relevé de notes -->
                        <div class="form-control w-full py-3">
                            <div class="label">
                                <span class="label-text">Relevé des notes de la mobilité</span>
                            </div>
                            <input accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'releveNote')" type="file" class="file-input file-input-bordered w-full mb-1"/>

                            <div v-if="files.releveNote.file != null" class="btn btn-neutral text-primary mb-1 flex items-center space-x-2" @click="saveFile('releve_note_'+accountStore.login, 'documents/etu/releve_note', files.releveNote.file)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3l9 9-9 9v-7H3V10h10z" />
                                </svg>
                                <span>Envoyer votre fichier</span>
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
                                    <span class="text-error">Supprimer votre fichier</span>
                                </button>
                            </div>
                        </div>

                        <!-- Modal de confirmation suppression de document -->
                        <dialog id="confirmModalDoc" ref="confirmModalDoc" class="modal">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                <div class="py-3">
                                    <p>Confirmez vous la suppression du fichier: <strong>{{ confirmDeleteDocument.title }}</strong></p>
                                </div>
                                <div class="modal-action">
                                    <button class="btn" @click="closeModal">Annuler</button>
                                    <button class="btn btn-success" @click="deleteFile(confirmDeleteDocument.folder, confirmDeleteDocument.title, confirmDeleteDocument.type)">Confirmer</button>
                                </div>
                            </div>
                        </dialog>
                        


                    </div>
                </div>
            </div>
        </div>

        <!-- Modif voeux si temps pas écoulé -->
        <div v-if="joursRestants(admin.adm_datelimite) > 0" class="px-5 xl:px-20 transition-all duration-100 ease-in-out">

            <!-- Partie voeux -->
            <div class="md:block hidden pt-5" >
                <p class="text-center">Vous avez {{ localFavoris.length }} favoris et {{ nbVoeuLocal() }} vœux.</p>
                <p class="text-center">Ajoutez des accords aux favoris pour ensuite les choisir comme vœux.</p>
                <p class="text-center">Date limite avant la fermeture des vœux : <span class="font-bold">{{ formatDate(admin.adm_datelimite) }}</span> ({{ joursRestants(admin.adm_datelimite) }} jour{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }})</p>
                <div class="flex *:mr-5 py-5 justify-center">
                    
                    <!-- Partie de gauche avec liste des favoris -->
                    <div class="flex flex-col justify-center items-center w-2/5">
                        <p class="font-bold text-xl flex *:mx-1 py-2  items-center">
                            <span>Vos favoris</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" stroke="currentColor" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                            </svg>

                        </p>
                        <div id="left" class="flex flex-col bg-base-200 p-5 *:my-1 h-full w-full">
                            <!-- Liste des favoris -->
                            <div v-if="localFavoris.length > 0" v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class=" select-none flex justify-between items-center elementDrag h-20 hover:cursor-move hover:opacity-80 transition-all duration-100 ease-in-out">
                                <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none">
                                    <span class="relative inline-block mr-2">
                                        <!-- Drapeau -->
                                        <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.partnercountry?.parco_code)"></span>

                                        <!-- Point d'interrogation si pas de drapeau -->
                                        <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                            ?
                                        </span>
                                    </span>

                                    <div class="w-full flex">
                                        <p class="w-full select-none xl:text-base text-xs">({{ accord.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{accord.university?.univ_city || 'Ville indisponible'}} - {{ accord.university?.univ_name || 'Université indisponible' }}</span> ({{ accord.isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                            <!-- Ouvrir le profil -->
                                            <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: accord.agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <p class="flex items-center justify-center">Aucun favoris dans la liste</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Partie de droite avec les voeux -->
                    <div class="flex flex-col items-center justify-start w-3/5">
                        <p class="font-bold text-xl flex *:mx-1 py-2 items-center">
                            <span>Vos vœux</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </p>
                        <div id="right" class="bg-base-200 flex flex-col w-full">

                            <div class="flex items-center min-h-20 w-full px-5 xl:px-10 transition-all duration-100 ease-in-out m-3" v-for="(i, index) in 6" :key="index">
                                <p class="font-bold xl:pr-5 pr-3 xl:text-lg transition-all duration-100 ease-in-out min-w-fit">Vœu n°{{ i }}</p>
                                <div :id="'voeu'+i" class="voeuxDrop bg-base-100 h-20 w-full flex items-center justify-center transition-all duration-100 ease-in-out">
                                    <div v-if="localVoeux[i]" :draggable="true" :id="'accord_wish_'+localVoeux[i].agree_id" class="bg-base-300 select-none flex justify-between items-center elementDrag w-full transition-all duration-100 ease-in-out h-20 hover:cursor-move hover:opacity-80">
                                        <div :class="[
                                        'border-2 flex items-center justify-center h-20 select-none w-full',
                                        (destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id)
                                            ? (destination.status ? 'border-warning' : 'border-green-400')
                                            : 'border-base-300'
                                        ]">

                                            <span class="relative inline-block mr-2">
                                            <!-- Drapeau -->
                                            <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (localVoeux[i].partnercountry?.parco_code)"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!localVoeux[i].partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>
                                            <p class="w-full select-none xl:text-md text-sm transition-all duration-100 ease-in-out">({{ localVoeux[i].partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{localVoeux[i].university?.univ_city || 'Ville indisponible'}} - {{ localVoeux[i].university?.univ_name || 'Université indisponible' }}</span> ({{ localVoeux[i].isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                            
                                        </div>
                                        <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: localVoeux[i].agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                        <button @click="removeVoeu(localVoeux[i].agree_id, i)" class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <p v-else class="opacity-45 select-none flex items-center justify-center">Emplacement vœu n°{{ i }}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Partie voeux téléphone -->
            <div class="md:hidden btn-block pt-10">
                <p>Vous avez {{ localFavoris.length }} favoris et {{ nbVoeuLocal() }} vœux</p>
                <p>Ajoutez des accords aux favoris pour ensuite les choisir comme vœux.</p>
                <p>Date limite avant la fermeture des vœux : <span class="font-bold">{{ formatDate(admin.adm_datelimite) }}</span> ({{ joursRestants(admin.adm_datelimite) }} jour{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }})</p>            
                
                    <!-- Liste des accords -->
                    <div class="bg-base-200 drop-shadow-lg lg:w-96 w-full lg:my-0 my-5" v-if="accords && accords.agreements">
                        <p class="bg-base-300 p-3 flex items-center justify-center font-bold text-lg ">Favoris</p>
                        <div>
                            <div class="bg-base-300 p-2 mt-1 flex justify-between items-center hover:opacity-60 hover:cursor-pointer" @click="toggleCollapse('favoris')">
                                <p>Liste des accords ({{ localFavoris.length }})</p>
                                <span :class="isOpen.favoris ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                            </div>
                            <div class="p-1" v-show="isOpen.favoris">
                                <div class="lg:block flex flex-wrap">
                                    <!-- Liste des favoris -->
                                    <div v-if="localFavoris.length > 0" v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class=" select-none flex justify-between items-center w-full h-20 hover:cursor-move hover:opacity-80 transition-all duration-100 ease-in-out">
                                        <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none ">
                                            <span class="relative inline-block mr-1">
                                                <!-- Drapeau -->
                                                <span class="fi text-lg xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.partnercountry?.parco_code || '')"></span>

                                                <!-- Point d'interrogation si pas de drapeau -->
                                                <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white select-none">
                                                    ?
                                                </span>
                                            </span>
                                            <div class="w-full flex">
                                                <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: accord.agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                                <p class="w-full select-none text-xs">({{ accord.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{accord.university?.univ_city || 'Ville indisponible'}} - {{ accord.university?.univ_name || 'Université indisponible' }}</span> ({{ accord.isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div v-else class="w-full">
                                        <p class="flex items-center justify-center">Aucun favoris dans la liste</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Voeux -->
                    <span class="flex items-center min-h-20" v-for="(i, index) in 6" :key="index">
                        <div :id="'voeu'+i" class=" voeuxDrop bg-base-100 h-20 w-full flex items-center justify-center transition-all duration-100 ease-in-out">
                            <!-- Sil y a un accord -->
                            <div v-if="localVoeux[i]" :draggable="true" :id="'accord_wish_'+localVoeux[i].agree_id" class="bg-base-300  select-none flex justify-between items-center elementDrag w-full transition-all duration-100 ease-in-out h-20 hover:cursor-move hover:opacity-80">
                                <div class="border-2 bg-base-300 flex items-center justify-center h-20 select-none w-full"
                                    :class="[
                                        (destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id)
                                            ? (destination.status ? 'border-warning' : 'border-green-400')
                                            : 'border-base-300'
                                    ]">
                                <span class="relative inline-block mr-1">
                                                <!-- Drapeau -->
                                                <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (localVoeux[i].partnercountry?.parco_code || '')"></span>

                                                <!-- Point d'interrogation si pas de drapeau -->
                                                <span v-if="!localVoeux[i].partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white select-none">
                                                    ?
                                                </span>
                                            </span>
                                    <p class="w-full select-none text-xs">({{ localVoeux[i].partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{localVoeux[i].university?.univ_city || 'Ville indisponible'}} - {{ localVoeux[i].university?.univ_name || 'Université indisponible' }}</span> ({{ localVoeux[i].isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                </div>
                                <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: localVoeux[i].agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                <button @click="removeVoeu(localVoeux[i].agree_id, i)" class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <!-- Pas d'accord dans la case -->
                            <label for="modal_ajout_accord" @click="changeVoeuLocal(i)" v-else class="hover:opacity-80 select-none w-full flex flex-col items-center justify-center bg-base-300  p-2">
                                <p class="text-lg">Emplacement vœu n°{{ i }}</p>
                                <p class="opacity-50">Cliquez pour ajouter un accord</p>
                            </label>
                        </div>
                    </span>

                    <input type="checkbox" id="modal_ajout_accord" class="modal-toggle" />
                    <div class="modal" role="dialog">
                        <div class="modal-box">
                            <h3 class="font-bold text-lg pb-3">Choisissez un accord pour le vœu n°{{ selectedChangeVoeu }}</h3>
                            <!-- Liste des favoris -->
                            <div @click="setAccordToVoeu(accord.agree_id)" v-if="localFavoris.length > 0" v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class="my-1 select-none flex justify-between items-center w-full h-20 hover:cursor-move hover:opacity-80 transition-all duration-100 ease-in-out">
                                <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none">
                                    <span class="relative inline-block">
                                            <!-- Drapeau -->
                                            <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.partnercountry?.parco_code || '')"></span>

                                            <!-- Point d'interrogation si pas de drapeau -->
                                            <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                                ?
                                            </span>
                                        </span>
                                    <div class="w-full flex">
                                        <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: accord.agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                                <button class="hover:opacity-60 hover:cursor-pointer p-2">
                                                    <svg height="24px" width="24px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                                                        viewBox="0 0 512 512"  xml:space="preserve" fill="currentColor">
                                                        <g>
                                                            <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                            <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                            <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                                237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                        </g>
                                                    </svg>
                                                </button>
                                            </RouterLink>
                                        <p class="w-full select-none text-xs">({{ accord.partnercountry?.parco_name || 'Pays indisponible' }}) <span class="font-bold">{{accord.university?.univ_city || 'Ville indisponible'}} - {{ accord.university?.univ_name || 'Université indisponible' }}</span> ({{ accord.isced?.isc_code || 'Code ISCED indisponible' }})</p>
                                    </div>
                                </div>
                            </div>
                            <!-- Aucun favoris -->
                            <div v-else class="w-full">
                                <p class="flex items-center justify-center">Aucun favoris dans la liste</p>
                            </div>
                            <div class="modal-action">
                                <label for="modal_ajout_accord" class="btn">Annuler</label>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

        <!-- Affichage voeux si temps écoule -->
        <div v-else>
            <div class="flex flex-col items-center justify-start pt-10">
                <p class="font-bold text-xl flex *:mx-1 py-2 items-center">
                    <span>Vos vœux</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </p>
                <div class="py-5 text-center">
                    <p>Vous ne pouvez plus modifier vos vœux car la date limite a été atteinte.</p>
                    <p>Si votre destination finale correspond à un de vos vœux, alors la case sera entourée en jaune.</p>
                </div>

                <div id="right" class="bg-base-200 flex flex-col *:m-3">

                    <span class="flex items-center min-h-20" v-for="(i, index) in 6" :key="index">
                        <p class="font-bold xl:p-5 p-3 xl:text-lg text-sm transition-all duration-100 ease-in-out">Vœu n°{{ i }}</p>
                        <div class="bg-base-100 h-20 xl:w-130 w-105 flex items-center justify-center transition-all duration-100 ease-in-out">
                            <RouterLink target="_blank" :to="{ name: 'Accord', params: { agree_id: localVoeux[i].agree_id }}" v-if="localVoeux[i]" :draggable="true" class="cursor-pointer select-none flex justify-between items-center xl:w-150 w-120 transition-all duration-100 ease-in-out h-20 hover:opacity-80">
                                <div :class="[
                                    'border-2 bg-base-300 flex items-center justify-center h-20 select-none w-full',
                                    (destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id)
                                        ? (destination.status ? 'border-warning' : 'border-green-400')
                                        : 'border-base-300'
                                    ]">
                                    <span class="tooltip mr-2" :data-tip="localVoeux[i].partnercountry.parco_name">
                                        <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+localVoeux[i].partnercountry.parco_code "></span>
                                    </span>
                                    <p class="w-full select-none text-xs xl:text-base">({{ localVoeux[i].partnercountry.parco_name }}) <span class="font-bold">{{localVoeux[i].university.univ_city}} - {{ localVoeux[i].university.univ_name }}</span> ({{ localVoeux[i].isced.isc_code }})</p>
                                </div>
                            </RouterLink>
                            <p v-else class="opacity-45 select-none w-96 flex items-center justify-center text-xs xl:text-base">Emplacement vœu n°{{ i }} vide</p>
                        </div>
                    </span>

                </div>
            </div>
        </div>

        <!-- Partie témoignage -->
        <div class="w-full flex items-center justify-center mt-20">
            <div class="w-150 relative">
                <p class="text-xl font-bold">Témoignage</p>
                <p className="text-base-content/70 mb-4">
                    Écrivez un témoignage de vos expériences à l'étranger. N'hésitez pas à donner également un retour d'expériences sur le site et sur des possibles améliorations.
                </p>
                <textarea 
                    class="w-full min-h-96 textarea textarea-bordered" 
                    v-model="account.acc_temoignage"
                ></textarea>
                <div class="w-full flex justify-between items-center mt-3">
                    <span class="text-sm opacity-70">
                        {{ account.acc_temoignage?.length || 0 }} / {{ CHAR_LIMIT }} caractères
                    </span>
                    <label 
                        @click="modifTemoignage" 
                        class="btn btn-success"
                    >
                        Enregistrer
                    </label>
                </div>
            </div>
        </div>

        <!-- Partie suppression du compte -->
        <div class="w-full flex items-center justify-center mt-20">
            <div class="w-150 relative">
                <p class="text-xl font-bold">Suppression du compte</p>
                <p className="text-base-content/70 mb-4">
                    Vous pouvez supprimer votre compte. Attention, cette action est irréversible.
                </p>
                <label 
                    @click="openConfirmDeleteModal" 
                    class="btn btn-error"
                >
                    Supprimer le compte
                </label>
            </div>
         </div>

        <!-- Modal de confirmation suppression de compte -->
        <dialog id="confirmModalAccount" ref="confirmModalAccount" class="modal">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Confirmer la suppression du compte?</h3>
                                <div class="py-3">
                                    <p>Confirmez vous la suppression de votre compte ?</p>
                                    <p>Cette action est irréversible et vos informations seront supprimées.</p>
                                </div>
                                <div class="modal-action">
                                    <button class="btn" @click="closeModal">Annuler</button>
                                    <button class="btn btn-success" @click="deleteAccount">Confirmer</button>
                                </div>
                            </div>
        </dialog>

    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { onMounted, ref, computed, nextTick, initCustomFormatter } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import { addAlert } from '../../composables/addAlert';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const response = ref([]);
    const account = ref([]);
    const favoris = ref([]);
    const accords = ref([]);
    const destination = ref([])
    const CHAR_LIMIT = 1500;
    const admin = ref([]);
    const isLoaded = ref(false);
    const accountStore = useAccountStore();
    const localFavoris = ref([]);
    const currentUnivEtu = ref([]);
    const localVoeux = ref({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
        6: null,
    })
    const isOpen = ref({
        favoris: false,
    });
    const files = ref({
        choixCours: {
            file: null,
            exist: false,
            path: ''
        },
        contratPeda: {
            file: null,
            exist: false,
            path: ''
        },
        releveNote: {
            file: null,
            exist: false,
            path: ''
        }
    });
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

    const selectedChangeVoeu = ref(null);
    
    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    function changeVoeuLocal(voeu){
        selectedChangeVoeu.value = voeu;
    }

    async function modifTemoignage(){
        // Définir une limite de caractères (par exemple 500)
        
        if (account.value.acc_temoignage && account.value.acc_temoignage.length > CHAR_LIMIT) {
            addAlert('error', {data: {error: `Le témoignage est trop long. Maximum ${CHAR_LIMIT} caractères.`}})
            return;
        }

        const requestData = {
            acc_id: accountStore.login,
            acc_temoignage: account.value.acc_temoignage,
        }
        await request('PUT', true, response, config.apiUrl + 'api/account/temoignage', requestData);
    }

    // Modal modif etu
    function modifEtu(account){
        currentUnivEtu.value.acc_id = account.acc_id || null;
        currentUnivEtu.value.acc_mail = account.acc_mail || null;
        currentUnivEtu.value.acc_studentnum = account.acc_studentnum || null;
        currentUnivEtu.value.acc_parcours = account.acc_parcours || null;
    }

    function setAccordToVoeu(agree_id) {
        const dropZoneId = `voeu${selectedChangeVoeu.value}`;
        const dropZone = document.getElementById(dropZoneId);

        if (dropZone) {
            // Supprimez l'accord existant s'il y en a un
            if (localVoeux.value[selectedChangeVoeu.value]) {
                removeFavoris(localVoeux.value[selectedChangeVoeu.value].agree_id);
            }

            // Ajoutez l'accord sélectionné au voeu spécifié
            localVoeux.value[selectedChangeVoeu.value] = getAccord(agree_id);

            // Supprimez l'accord des favoris
            removeFavoris(agree_id);

            // Rafraîchissez l'interface après avoir mis à jour les données
            refreshDrag();
            saveWishes();

            // Fermez le modal en désélectionnant le checkbox
            const modalCheckbox = document.getElementById('modal_ajout_accord');
            if (modalCheckbox) {
                modalCheckbox.checked = false; // Désélectionne le checkbox pour fermer le modal
            }
        }
    }

    // Confirm modification etu
    async function confirmModifEtu(){

        if (currentUnivEtu.value.acc_studentnum == '') {
            addAlert('error', { data: { error: 'Vous devez renseigner votre numéro étudiant.', message: 'Modification du dossier annulée.' } });
            return;
        }
        if (currentUnivEtu.value.acc_mail == '') {
            addAlert('error', { data: { error: 'Vous devez renseigner votre mail.', message: 'Modification du dossier annulée.' } });
            return;
        }

        const requestData = { 
            acc_id: currentUnivEtu.value.acc_id,
            acc_mail: currentUnivEtu.value.acc_mail,
            acc_studentnum: currentUnivEtu.value.acc_studentnum,
            acc_parcours: currentUnivEtu.value.acc_parcours,

        };
        await request('PUT', true, response, config.apiUrl+'api/account/modifetu', requestData);
        await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
    }

    async function initPage(){
        localFavoris.value = favoris.value
            .filter(favori => favori.acc_id === accountStore.login && !estVoeu(favori.agree_id))
            .map(favori => {
                return accords.value.agreements.find(accord => accord.agree_id === favori.agree_id);
            });

        let index = 1;
        if(nbVoeu() > 0){

            Object.keys(account.value.wishes).forEach(key => {
                if(key.startsWith('wsha_')){  // Modifier cette ligne pour inclure uniquement les clés de voeux
                    const accordId = account.value.wishes[key];
                    if(accordId != null){
                        const accord = accords.value.agreements.find(accord => accord.agree_id === accordId);
                        if(accord){
                            localVoeux.value[index] = accord;
                        }   
                    }
                    index++;
                }
            });

        }

        await nextTick();

        let dropZones = document.getElementsByClassName('voeuxDrop');

        refreshDrag();

        
        for (let dropZone of dropZones) {
            dropZone.addEventListener("dragover", function(e) {
                e.preventDefault();
            });
            dropZone.addEventListener("drop", function(e) {
                e.preventDefault();
                let id = e.dataTransfer.getData("text/plain");
                let selected = document.getElementById(id);
                if (selected) {
                    const accordId = selected.id.replace('accord_wish_', '');
                    const dropZoneId = dropZone.id.replace('voeu', '');
                    if (estVoeuLocal(accordId)) {
                        // Cas 1: Accord est deja un voeu
                        const currentVoeuNum = getCurrentVoeuNum(accordId);
                        const currentDropZone = document.getElementById(`voeu${currentVoeuNum}`);
                        if (currentVoeuNum !== null && currentDropZone.id !== dropZone.id) {
                            if(VoeuExist(dropZoneId)){
                                // Il y a deja un voeu dans l'emplacement souhaité
                                const existingAccord = getAccord(localVoeux.value[dropZoneId].agree_id);
                                const currentDropZoneId = currentDropZone.id.replace('voeu', '');
                                localVoeux.value[dropZoneId] = getAccord(accordId);
                                localVoeux.value[currentDropZoneId] = existingAccord;
                                refreshDrag();
                                saveWishes();
                            }
                            else{
                                // Pas de voeu dans l'emplacement
                                localVoeux.value[getCurrentVoeuNum(accordId)] = null;
                                localVoeux.value[dropZoneId] = getAccord(accordId); 
                                refreshDrag();
                                saveWishes();
                            }
                        }
                    } else {
                        // Cas 2: Accord est uniquement un favori
                        if(VoeuExist(dropZoneId)){
                            // Il y a un deja un voeu dans l'emplacement souhaité
                            if(estFavoris(localVoeux.value[dropZoneId].agree_id)){
                                addFavoris(localVoeux.value[dropZoneId].agree_id)
                            }
                            removeFavoris(accordId)
                            localVoeux.value[dropZoneId] = getAccord(accordId);
                            refreshDrag();
                            saveWishes();

                        }else{
                            // Pas de voeu dans l'emplacement
                            removeFavoris(accordId)
                            localVoeux.value[dropZoneId] = getAccord(accordId); 
                            refreshDrag();
                            saveWishes();
                        }
                    }

                }
            });
        }
    }

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
    
    function dragStartHandler(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
    }

    async function fetch() {
        await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
        await request('GET', false, accords, config.apiUrl + 'api/agreement');
        await request('GET', false, favoris, config.apiUrl + 'api/favoris');
        await request('GET', false, admin, config.apiUrl + 'api/admin');
        await request('GET', false, destination, config.apiUrl + 'api/arbitrage/getbyid/'+accountStore.login);
        await request('GET', false, response, config.apiUrl + 'api/documents/checkexist/admin/choix_cours' + (account.value.department != null ? `_${account.value.department.dept_id}` : ''));
        if(response.value.status == 200){
            files.value.choixCours.exist = true;
            files.value.choixCours.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/contrat_peda')
        if(response.value.status == 200){
            files.value.contratPeda.exist = true;
            files.value.contratPeda.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/choix_cours/'+accountStore.login)
        if(response.value.status == 200){
            myfiles.value.choixCours.exist = true;
            myfiles.value.choixCours.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/contrat_peda/'+accountStore.login)
        if(response.value.status == 200){
            myfiles.value.contratPeda.exist = true;
            myfiles.value.contratPeda.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexistperso/etu/releve_note/'+accountStore.login)
        if(response.value.status == 200){
            myfiles.value.releveNote.exist = true;
            myfiles.value.releveNote.path = response.value.path;
        }
        isLoaded.value = true;

        initPage();
    }

    // Vérifie si l'accord est dans la liste des favoris
    function estFavoris(agree_id) {
        return favoris.value.some(favori => favori.agree_id === agree_id && favori.acc_id === accountStore.login);
    }

    // Renvoi un boolean true si l'accord est un voeu 
    function estVoeuLocal(agree_id) {
        const voeuIds = Object.values(localVoeux.value)
            .map(accord => accord ? accord.agree_id.toString() : null);
        const agreeIdStr = agree_id.toString();
        return voeuIds.includes(agreeIdStr);
    }

    // Nombre de voeu en base
    function nbVoeu(){
        if(account.value.wishes && account.value.wishes.acc_id){
            const one = account.value.wishes.wsha_one != null ? 1 : 0;
            const two = account.value.wishes.wsha_two != null ? 1 : 0;
            const three = account.value.wishes.wsha_three != null ? 1 : 0;
            const four = account.value.wishes.wsha_four != null ? 1 : 0;
            const five = account.value.wishes.wsha_five != null ? 1 : 0;
            const six = account.value.wishes.wsha_six != null ? 1 : 0;
            return one + two + three + four + five + six;
        }
    }

    // Nombre de voeu en local
    function nbVoeuLocal(){
        const one = localVoeux.value["1"] != null ? 1 : 0;
        const two = localVoeux.value["2"] != null ? 1 : 0;
        const three = localVoeux.value["3"] != null ? 1 : 0;
        const four = localVoeux.value["4"] != null ? 1 : 0;
        const five = localVoeux.value["5"] != null ? 1 : 0;
        const six = localVoeux.value["6"] != null ? 1 : 0;
        return one + two + three + four + five + six;
    }

    // Renvoi un boolean true si l'accord est un voeu 
    // Utilisé uniquement au chargement des données
    function estVoeu(agree_id) {
        if(nbVoeu() > 0 ){
            const wishKeys = Object.keys(account.value.wishes).filter(key => key.startsWith('wsha_'));
            const wishValues = wishKeys.map(key => account.value.wishes[key]);
            return wishValues.includes(agree_id);
        }
    }

    // Renvoie le numéro du voeu de l'accord
    function getCurrentVoeuNum(agree_id) {
        for (const [num, accord] of Object.entries(localVoeux.value)) {
            if (accord && accord.agree_id == agree_id) {
                return parseInt(num); 
            }
        }
        return null;
    }

    // Renvoie un booleen true si a la position donné il y a un voeu
    function VoeuExist(position) {
        if (position >= 1 && position <= Object.keys(localVoeux.value).length) {
            return localVoeux.value[position.toString()] !== null;
        } else {
            return false;
        }
    }

    // Ouvrir le modal de confirmation de suppression de document
    function openConfirmModal(fileFolder, fileTitle, fileType) {
        confirmDeleteDocument.value.folder = fileFolder;
        confirmDeleteDocument.value.title = fileTitle;
        confirmDeleteDocument.value.type = fileType;
        const modal = document.getElementById('confirmModalDoc');
        modal.showModal();
    }

    // Ouvrir le modal de confirmation de suppression du compte
    function openConfirmDeleteModal() {
        const modal = document.getElementById('confirmModalAccount');
        modal.showModal();
    }

    // Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModalDoc');
        modal.close();
        const modal2 = document.getElementById('confirmModalAccount');
        modal2.close();
    }

    // Supprimer un fichier
    async function deleteFile(fileFolder, fileTitle, fileType) {
        closeModal();
        await request('GET', true, response, `${config.apiUrl}api/documents/deleteperso/${fileFolder}/${fileFolder}_${accountStore.login}`);
        
        if (response.value.status == 200) {
            myfiles.value[fileTitle].exist = false;
            myfiles.value[fileTitle].path = '';
            fetch();
        }
    }

    //Gérer la séléction d'un fichier en fonction du nom
    const handleFileInputChange = (event, fileType) => {
        const file = event.target.files[0];
        if (file) {
            files.value[fileType].file = file;
        } else {
            files.value[fileType].file = null;
        }
    };
    
    // Ouvrir le fichier ou le télécharger
    function openFileInNewTab(filePath) {
        // Diviser le chemin du fichier en segments et obtenir le dernier segment (nom du fichier)
        const segments = filePath.split('/');
        const fileName = segments[segments.length - 1];

        // Construire l'URL complète pour accéder au fichier
        const fileUrl = config.apiUrl + `api/documents/get/admin/${fileName}`;

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

    // Enregistrer un fichier
    async function saveFile(title, folder, file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('folder', folder);

    await request('POST', true, response, config.apiUrl+'api/documents', formData);
    if(response.value.status == 200) {
        // Réinitialiser les états des fichiers
        files.value.choixCours.file = null;
        files.value.contratPeda.file = null;
        files.value.releveNote.file = null;
        myfiles.value.choixCours.file = null;
        myfiles.value.contratPeda.file = null;
        myfiles.value.releveNote.file = null;

        // Réinitialiser les champs de fichier HTML
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
            input.value = '';
        });
    }
    fetch();
}

    async function deleteAccount(){
        const requestData = {
            acc_id: accountStore.login,
        }
        await request('DELETE', true, response, config.apiUrl + 'api/account/selfdelete', requestData);
        if(response.value.status == 202){
  
            // Nettoyage localStorage
            localStorage.removeItem('login');
            localStorage.removeItem('auth');
            localStorage.removeItem('token');
            
            router.push({ name: 'Accueil' });
            window.open(config.apiUrl + 'cas.php?logout=true', '_blank');
            accountStore.logoutAccount();

        }
    }

    // Supprime de la liste des favoris l'accord passé en param
    function removeFavoris(agree_id) {
        const index = localFavoris.value.findIndex(accord => accord.agree_id == agree_id);
        if (index !== -1) {
            localFavoris.value.splice(index, 1);
        } 
    }

    // Ajoute a la liste des favoris l'accord passé en param
    function addFavoris(agree_id) {
        const accord = accords.value.agreements.find(accord => accord.agree_id === agree_id);
        
        if (accord) {
            localFavoris.value.push(accord);
        }
    }

    // Renvoi l'accord qui correspond à l'id
    function getAccord(agree_id) {
        for (const accord of Object.values(accords.value.agreements)) {
            if (accord && accord.agree_id == agree_id) {
                return accord; 
            }
        }
        return null;
    }

    function removeVoeu(agree_id, position){
        localVoeux.value[position] = null;
        if(estFavoris(agree_id)){
            addFavoris(agree_id);
            refreshDrag();
        }
        saveWishes();
    }

    function joursRestants(date) {
        const dateLimite = new Date(date);
        const currentDate = new Date();
        const timeDifference = dateLimite - currentDate;
        const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysRemaining;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    async function saveWishes() {
        const requestData = {
            acc_id: accountStore.login,
            wsha_one: localVoeux.value[1] != null ? localVoeux.value[1].agree_id : null,
            wsha_two: localVoeux.value[2] != null ? localVoeux.value[2].agree_id : null,
            wsha_three: localVoeux.value[3] != null ? localVoeux.value[3].agree_id : null,
            wsha_four: localVoeux.value[4] != null ? localVoeux.value[4].agree_id : null,
            wsha_five: localVoeux.value[5] != null ? localVoeux.value[5].agree_id : null,
            wsha_six: localVoeux.value[6] != null ? localVoeux.value[6].agree_id : null,
        }
        await request('POST', true, response, config.apiUrl + 'api/wishagreement', requestData);
    }






    onMounted(fetch)
</script>