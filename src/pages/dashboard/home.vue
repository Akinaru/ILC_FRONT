<template>
    <div class="m-5 flex justify-between" v-if="isLoaded">
        <div>
            <p>Bienvenue sur votre profil étudiant lié aux relations internationales.</p>
            <div v-if="account && account.acc_id">
                <form>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">Numéro étudiant (INE)</span>
                        </div>
                        <input type="text" :value="account.acc_studentnum" class="input input-bordered w-full max-w-xs" disabled />
                    </label>
                    <label class="form-control w-full max-w-xs">
                        <div class="label">
                            <span class="label-text">Département</span>
                        </div>
                        <input type="text" :value="account.department.dept_shortname" class="input input-bordered w-full max-w-xs" disabled />
                    </label>
                </form>
            </div>
        </div>

        <div>
            <p>Vous avez x favoris et x voeux</p>
            <div class="flex *:mr-5 py-5">
                <!-- Partie de gauche avec liste des favoris -->
                <div class="flex flex-col justify-center items-center">
                    <p class="font-bold text-xl flex *:mx-1 py-2  items-center">
                        <span>Vos favoris</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#000000" stroke="#000000" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                        </svg>
                    </p>
                    <div id="left" class="flex flex-col bg-base-200 min-w-96 p-5 *:my-1 h-full">
                        <!-- Liste des favoris -->
                        <div v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class=" select-none flex justify-between items-center elementDrag w-105 h-20 hover:cursor-move hover:opacity-80">
                            <div class="bg-base-300 flex items-center justify-center w-full h-20 select-none">
                                <span class="tooltip mr-2" :data-tip="accord.partnercountry.parco_name">
                                    <span class="fi text-5xl" :class="'fi-'+accord.partnercountry.parco_code "></span>
                                </span>
                                <p class="w-full select-none">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</span> ({{ accord.isced.isc_code }})</p>
                                
                            </div>
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
                            <path fill="#000000" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </p>
                    <div id="right" class="bg-base-200 flex flex-col *:m-3">

                        <span class="flex items-center min-h-20" v-for="i in 5">
                            <p class="font-bold p-5 text-lg">Voeu n°{{ i }}</p>
                            <div :id="'voeu'+i" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center">
                                <div v-if="localVoeux[i]" :draggable="true" :id="'accord_wish_'+localVoeux[i].agree_id" class=" select-none flex justify-between items-center elementDrag w-96 h-20 hover:cursor-move hover:opacity-80">
                                    <div class="bg-base-300 flex items-center justify-center h-20 select-none">
                                        <span class="tooltip mr-2" :data-tip="localVoeux[i].partnercountry.parco_name">
                                            <span class="fi text-5xl" :class="'fi-'+localVoeux[i].partnercountry.parco_code "></span>
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

                        <button class="btn btn-primary mt-5" @click="saveWishes">Sauvegarder</button>
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
    import { onMounted, ref, computed, nextTick, initCustomFormatter } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { useAccountStore } from '../../stores/accountStore';
    import LoadingComp from '../../components/utils/LoadingComp.vue';

    const response = ref([]);
    const account = ref([]);
    const favoris = ref([]);
    const accords = ref([]);
    const isLoaded = ref(false);
    const accountStore = useAccountStore();
    const localFavoris = ref([]);
    const localVoeux = ref({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
    })


    async function initPage(){
        localFavoris.value = favoris.value
            .filter(favori => favori.acc_id === accountStore.login && !estVoeu(favori.agree_id))
            .map(favori => {
                return accords.value.agreements.find(accord => accord.agree_id === favori.agree_id);
            });

        let index = 1;
        Object.keys(account.value.wishes).forEach(key => {
            if(key != 'acc_id'){
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
                            }
                            else{
                                // Pas de voeu dans l'emplacement
                                localVoeux.value[getCurrentVoeuNum(accordId)] = null;
                                localVoeux.value[dropZoneId] = getAccord(accordId); 
                                refreshDrag();
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

                        }else{
                            // Pas de voeu dans l'emplacement
                            removeFavoris(accordId)
                            localVoeux.value[dropZoneId] = getAccord(accordId); 
                            refreshDrag();
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

    // Renvoi un boolean true si l'accord est un voeu 
    // Utilisé uniquement au chargement des données
    function estVoeu(agree_id) {
        const wishKeys = Object.keys(account.value.wishes).filter(key => key.startsWith('wsha_'));
        const wishValues = wishKeys.map(key => account.value.wishes[key]);
        return wishValues.includes(agree_id);
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
    }

    async function saveWishes() {
        const requestData = {
            acc_id: accountStore.login,
            wsha_one: localVoeux.value[1] != null ? localVoeux.value[1].agree_id : null,
            wsha_two: localVoeux.value[2] != null ? localVoeux.value[2].agree_id : null,
            wsha_three: localVoeux.value[3] != null ? localVoeux.value[3].agree_id : null,
            wsha_four: localVoeux.value[4] != null ? localVoeux.value[4].agree_id : null,
            wsha_five: localVoeux.value[5] != null ? localVoeux.value[5].agree_id : null,
        }
        await request('POST', true, response, config.apiUrl + 'api/wishagreement', requestData);
    }



    //===================================================== 
    //===================================================== HANDLER 
    //===================================================== 




    onMounted(fetch)
</script>