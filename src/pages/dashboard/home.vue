<template>
    <div class="flex flex-col" v-if="isLoaded">
        <p class="font-bold text-xl pb-5">Bienvenue sur votre profil étudiant lié aux relations internationales.</p>

        <!-- Destination finale -->
        <div v-if="destination.agreement">
            <p class="text-sm font-bold pb-2">Destination finale</p>
            <div class="select-none flex justify-between items-center elementDrag xl:w-105 w-96 h-20 transition-all duration-100 ease-in-out">
                <RouterLink :to="{name: 'Accord', params: {agree_id: destination.agreement.agree_id}}" class="group hover:opacity-60 relative">

                    <div class="border-warning border-2 p-1 flex items-center justify-center w-full h-20 select-none">
                        <span class="tooltip mr-2" :data-tip="destination.agreement.partnercountry.parco_name">
                            <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+destination.agreement.partnercountry.parco_code "></span>
                        </span>
                        <p class="w-full select-none">({{ destination.agreement.partnercountry.parco_name }}) <span class="font-bold">{{destination.agreement.university.univ_city}} - {{ destination.agreement.university.univ_name }}</span> ({{ destination.agreement.isced.isc_code }})</p>    
                    </div>
                </RouterLink>
            </div>
        </div>

        <!-- Partie informations -->
        <div>
            <div v-if="account && account.acc_id" class="block md:flex w-full justify-center">
                <!-- Informations -->
                 <div class="w-full md:w-1/2 pt-10">
                    <p class="text-sm font-bold">Vos informations:</p>
                    <div>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Identitée</span>
                            </div>
                            <input type="text" :value="account.acc_fullname" class="input input-bordered w-full max-w-xl" disabled />
                        </label>
                        <label class="form-control w-full" >
                            <div class="label">
                                <span class="label-text">Email</span>
                            </div>
                            <input type="text" :value="account.acc_mail" class="input input-bordered w-full max-w-xl" disabled/>
                        </label>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Numéro étudiant</span>
                            </div>
                            <input type="text" :value="account.acc_studentnum" class="input input-bordered w-full max-w-xl" disabled />
                        </label>
                        <label class="form-control w-full " >
                            <div class="label">
                                <span class="label-text">Département</span>
                            </div>
                            <input type="text" :value="account.department ? account.department.dept_name : 'Aucun'" class="input input-bordered w-full max-w-xl" disabled/>
                        </label>
                        <label class="form-control w-full" >
                            <div class="label">
                                <span class="label-text">Score TOEIC</span>
                            </div>
                            <input type="text" :value="account.acc_toeic" class="input input-bordered w-full max-w-xl" disabled/>
                        </label>
                    </div>
                </div>

                <!-- Documents -->
                 <div class="w-fyll md:w-1/2 pt-10">
                    <p class="text-sm font-bold">Vos documents:</p>
                    <div>
                        <div class="form-control w-full py-3 max-w-xl">
                            <div class="label">
                                <span class="label-text">Choix de cours</span>
                            </div>
                                <div class="btn btn-success">
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>
                                    Telecharger le fichier disponible
                                </div>
                                <input type="file" class="file-input file-input-bordered w-full" />
                                <div class="btn btn-primary">
                                    Envoyer votre fichier
                                </div>
                            </div>
                        <div class="form-control w-full py-3 max-w-xl">
                            <div class="label">
                                <span class="label-text">Contrat pédagogique</span>
                            </div>
                                <div class="btn" disabled>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>                                
                                    Aucun fichier disponible
                                </div>
                                <input type="file" class="file-input file-input-bordered w-full" />
                        </div>
                        <div class="form-control w-full py-3 max-w-xl">
                            <div class="label">
                                <span class="label-text">Relevés de notes avant départ</span>
                            </div>
                                <div class="btn" disabled>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polyline points="7.9 12.3 12 16.3 16.1 12.3" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <line x1="12" x2="12" y1="2.7" y2="14.2" fill="none" stroke="#777777" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>
                                    Aucun fichier disponible
                                </div>
                                <input type="file" class="file-input file-input-bordered w-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modif voeux si temps pas écoulé -->
        <div v-if="joursRestants(admin.adm_datelimite) > 0">

            <!-- Partie voeux -->
            <div class="md:block hidden pt-5" >
                <p class="text-center">Vous avez {{ localFavoris.length }} favoris et {{ nbVoeuLocal() }} voeux</p>
                <p class="text-center">Ajoutez des accords en favoris pour ensuite les choisir comme voeux.</p>
                <p class="text-center">Date limite avant la fermeture des voeux: <span class="font-bold">{{ formatDate(admin.adm_datelimite) }}</span> ({{ joursRestants(admin.adm_datelimite) }} jour{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }})</p>
                <div class="flex *:mr-5 py-5 justify-center">
                    <!-- Partie de gauche avec liste des favoris -->
                    <div class="flex flex-col justify-center items-center">
                        <p class="font-bold text-xl flex *:mx-1 py-2  items-center">
                            <span>Vos favoris</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" stroke="currentColor" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                            </svg>

                        </p>
                        <div id="left" class="flex flex-col bg-base-200 p-5 *:my-1 h-full">
                            <!-- Liste des favoris -->
                            <div v-if="localFavoris.length > 0" v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class=" select-none flex justify-between items-center elementDrag xl:w-105 w-96 h-20 hover:cursor-move hover:opacity-80 transition-all duration-100 ease-in-out">
                                <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none">
                                    <span class="tooltip mr-2" :data-tip="accord.partnercountry.parco_name">
                                        <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code "></span>
                                    </span>
                                    <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</span> ({{ accord.isced.isc_code }})</p>
                                    
                                </div>
                            </div>
                            <div v-else>
                                <p class="w-105 flex items-center justify-center">Aucun favoris dans la liste</p>
                            </div>
                        </div>
                    </div>
                    <!-- Partie du millieu -->
                    <div class="flex items-center"></div>
                    <!-- Partie de droite avec les voeux -->
                    <div class="flex flex-col items-center justify-start">
                        <p class="font-bold text-xl flex *:mx-1 py-2 items-center">
                            <span>Vos voeux</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </p>
                        <div id="right" class="bg-base-200 flex flex-col *:m-3">

                            <span class="flex items-center min-h-20" v-for="(i, index) in 6" :key="index">
                                <p class="font-bold xl:p-5 p-3 xl:text-lg transition-all duration-100 ease-in-out">Voeu n°{{ i }}</p>
                                <div :id="'voeu'+i" class="voeuxDrop bg-base-100 h-20 xl:w-96 w-72 flex items-center justify-center transition-all duration-100 ease-in-out">
                                    <div v-if="localVoeux[i]" :draggable="true" :id="'accord_wish_'+localVoeux[i].agree_id" class="bg-base-300 select-none flex justify-between items-center elementDrag xl:w-96 w-72 transition-all duration-100 ease-in-out h-20 hover:cursor-move hover:opacity-80">
                                        <div :class="destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id ? 'border-warning' : 'border-base-300'" class="border-2 flex items-center justify-center h-20 select-none w-full">
                                            <span class="tooltip mr-2" :data-tip="localVoeux[i].partnercountry.parco_name">
                                                <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+localVoeux[i].partnercountry.parco_code "></span>
                                            </span>
                                            <p class="w-full select-none">({{ localVoeux[i].partnercountry.parco_name }}) <span class="font-bold">{{localVoeux[i].university.univ_city}} - {{ localVoeux[i].university.univ_name }}</span> ({{ localVoeux[i].isced.isc_code }})</p>
                                            
                                        </div>
                                        <button @click="removeVoeu(localVoeux[i].agree_id, i)" class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    <p v-else class="opacity-45 select-none w-96 flex items-center justify-center">Emplacement voeu n°{{ i }}</p>
                                </div>
                            </span>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Partie voeux téléphone -->
            <div class="md:hidden btn-block pt-10">
                <p>Vous avez {{ localFavoris.length }} favoris et {{ nbVoeuLocal() }} voeux</p>
                <p>Ajoutez des accords en favoris pour ensuite les choisir comme voeux.</p>
                <p>Date limite avant la fermeture des voeux: <span class="font-bold">{{ formatDate(admin.adm_datelimite) }}</span> ({{ joursRestants(admin.adm_datelimite) }} jour{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(admin.adm_datelimite) > 1 ? 's' : '' }})</p>            
                
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
                                            <span class="tooltip mr-2" :data-tip="accord.partnercountry.parco_name">
                                                <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code "></span>
                                            </span>
                                            <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</span> ({{ accord.isced.isc_code }})</p>
                                            
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
                                :class="destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id ? 'border-warning' : 'border-base-300'">
                                    <span class="tooltip mr-2" :data-tip="localVoeux[i].partnercountry.parco_name">
                                        <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+localVoeux[i].partnercountry.parco_code "></span>
                                    </span>
                                    <p class="w-full select-none">({{ localVoeux[i].partnercountry.parco_name }}) <span class="font-bold">{{localVoeux[i].university.univ_city}} - {{ localVoeux[i].university.univ_name }}</span> ({{ localVoeux[i].isced.isc_code }})</p>
                                </div>
                                <button @click="removeVoeu(localVoeux[i].agree_id, i)" class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            <!-- Pas d'accord dans la case -->
                            <label for="modal_ajout_accord" @click="changeVoeuLocal(i)" v-else class="hover:opacity-80 select-none w-full flex flex-col items-center justify-center bg-base-300  p-2">
                                <p class="text-lg">Emplacement voeu n°{{ i }}</p>
                                <p class="opacity-50">Cliquez pour ajouter un accord</p>
                            </label>
                        </div>
                    </span>

                    <input type="checkbox" id="modal_ajout_accord" class="modal-toggle" />
                    <div class="modal" role="dialog">
                        <div class="modal-box">
                            <h3 class="font-bold text-lg pb-3">Choisissez un accord pour le voeu n°{{ selectedChangeVoeu }}</h3>
                            <!-- Liste des favoris -->
                            <div @click="setAccordToVoeu(accord.agree_id)" v-if="localFavoris.length > 0" v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class="my-1 select-none flex justify-between items-center w-full h-20 hover:cursor-move hover:opacity-80 transition-all duration-100 ease-in-out">
                                <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none">
                                    <span class="tooltip mr-2" :data-tip="accord.partnercountry.parco_name">
                                        <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code "></span>
                                    </span>
                                    <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</span> ({{ accord.isced.isc_code }})</p>
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

        <!-- Affichage voeux si temps pas écoule -->
        <div v-else>
            <div class="flex flex-col items-center justify-start pt-10">
                <p class="font-bold text-xl flex *:mx-1 py-2 items-center">
                    <span>Vos voeux</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </p>
                <p class="text-center p-5">Vous ne pouvez plus modifier vos voeux car la date limite a été atteinte.</p>

                <div id="right" class="bg-base-200 flex flex-col *:m-3">

                    <span class="flex items-center min-h-20" v-for="(i, index) in 6" :key="index">
                        <p class="font-bold xl:p-5 p-3 xl:text-lg transition-all duration-100 ease-in-out">Voeu n°{{ i }}</p>
                        <div  class="bg-base-100 h-20 xl:w-96 w-72 flex items-center justify-center transition-all duration-100 ease-in-out">
                            <div v-if="localVoeux[i]" :draggable="true" class=" select-none flex justify-between items-center elementDrag xl:w-96 w-72 transition-all duration-100 ease-in-out h-20 hover:opacity-80">
                                <div class="bg-base-300 flex items-center justify-center h-20 select-none w-full">
                                    <span class="tooltip mr-2" :data-tip="localVoeux[i].partnercountry.parco_name">
                                        <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+localVoeux[i].partnercountry.parco_code "></span>
                                    </span>
                                    <p class="w-full select-none">({{ localVoeux[i].partnercountry.parco_name }}) <span class="font-bold">{{localVoeux[i].university.univ_city}} - {{ localVoeux[i].university.univ_name }}</span> ({{ localVoeux[i].isced.isc_code }})</p>
                                    
                                </div>
                            </div>
                            <p v-else class="opacity-45 select-none w-96 flex items-center justify-center">Emplacement voeu n°{{ i }} vide</p>
                        </div>
                    </span>

                </div>
            </div>
        </div>
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

    const response = ref([]);
    const account = ref([]);
    const favoris = ref([]);
    const accords = ref([]);
    const destination = ref([])
    const admin = ref([]);
    const isLoaded = ref(false);
    const accountStore = useAccountStore();
    const localFavoris = ref([]);
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
    const selectedChangeVoeu = ref(null);
    
    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section];
    }

    function changeVoeuLocal(voeu){
        selectedChangeVoeu.value = voeu;
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