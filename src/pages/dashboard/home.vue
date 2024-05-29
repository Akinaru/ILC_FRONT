<template>
    <div class="m-5" v-if="isLoaded">
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
        <div>
            <p>Vous avez x favoris et x voeux</p>
            <p class="py-5">1 {{ localVoeux[1] }}</p>
            <p class="py-5">2 {{ localVoeux[2] }}</p>
            <p class="py-5">3 {{ localVoeux[3] }}</p>
            <p class="py-5">4 {{ localVoeux[4] }}</p>
            <p class="py-5">5 {{ localVoeux[5] }}</p>
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
                                        <p class="w-full select-none">id:{{localVoeux[i].agree_id}}({{ localVoeux[i].partnercountry.parco_name }}) <span class="font-bold">{{localVoeux[i].university.univ_city}} - {{ localVoeux[i].university.univ_name }}</span> ({{ localVoeux[i].isced.isc_code }})</p>
                                        
                                    </div>
                                    <button class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
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
            .filter(favori => favori.acc_id === accountStore.login)
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
                    console.log("1")
                    const accordId = selected.id.replace('accord_wish_', '');
                    const dropZoneId = dropZone.id.replace('voeu', '');
                    if (estVoeu(accordId)) {
                        console.log("2")
                        const currentVoeuNum = getCurrentVoeuNum(accordId);
                        if (currentVoeuNum !== null) {
                            console.log("3")
                            const currentDropZone = document.getElementById(`voeu${currentVoeuNum}`);
                            if (currentDropZone.id !== dropZone.id) {
                                console.log("4")
                                if(VoeuExist(dropZoneId)){
                                    // Il y a deja un voeu dans l'emplacement souhaité

                                }
                                else{
                                    console.log("5")
                                    // Pas de voeu dans l'emplacement
                                    localVoeux.value[getCurrentVoeuNum(accordId)] = null;
                                    localVoeux.value[dropZoneId] = getAccord(accordId); 
                                    refreshDrag();
                                }
                            }
                        }
                    } else {
                        // Cas 2: Accord est uniquement un favori
                        const selectedVoeu = localVoeux.value[dropZoneId];
                        if (selectedVoeu) {
                            // S'il y a déjà un accord dans la dropZone, le remettre dans les favoris si nécessaire
                            if (estFavoris(selectedVoeu.agree_id)) {
                                // Remettre l'accord dans les favoris
                                // Ajouter la logique pour remettre l'accord dans les favoris si nécessaire
                            }
                        }
                        // Mettre l'accord dans la dropZone
                        localVoeux.value[dropZoneId] = selected; // Déplacer l'accord dans la nouvelle dropZone
                        // Échanger les ID pour que les éléments HTML soient à la bonne place dans le DOM
                        selected.id = `accord_wish_${dropZoneId}`;
                        dropZone.appendChild(selected);
                    }

                }
            });
        }
    }

    function refreshDrag() {
        let elementsDraggable = document.getElementsByClassName("elementDrag");
        
        // Parcourir tous les éléments
        for (let element of elementsDraggable) {
            console.log(element.id)
            element.innerHTML = 'd' + element.innerHTML;
            if (!element.hasListener) {
                element.addEventListener("dragstart", dragStartHandler);
                element.hasListener = true;
            }
        }
    }

    function dragStartHandler(e) {
        e.dataTransfer.setData("text/plain", e.target.id);
        console.log("d")
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

    function estVoeu(agree_id) {
        const voeuIds = Object.values(localVoeux.value)
            .map(accord => accord ? accord.agree_id.toString() : null);
        const agreeIdStr = agree_id.toString();
        return voeuIds.includes(agreeIdStr);
    }

    function getCurrentVoeuNum(agree_id) {
        for (const [num, accord] of Object.entries(localVoeux.value)) {
            if (accord && accord.agree_id == agree_id) {
                return parseInt(num); 
            }
        }
        return null;
    }

    function VoeuExist(position) {
        if (position >= 1 && position <= Object.keys(localVoeux.value).length) {
            return localVoeux.value[position.toString()] !== null;
        } else {
            return false;
        }
    }

    function getAccord(agree_id) {
        for (const accord of Object.values(accords.value.agreements)) {
            if (accord && accord.agree_id == agree_id) {
                return accord; 
            }
        }
        return null;
    }



    //===================================================== 
    //===================================================== HANDLER 
    //===================================================== 




    onMounted(fetch)
</script>