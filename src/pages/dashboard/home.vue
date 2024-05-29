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
            <p>Vous avez {{ favoris.count }} favoris et {{ nbVoeux }} voeux</p>
            <div class="flex *:mr-5 py-5">
                <div class="flex flex-col justify-center items-center">
                    <p class="font-bold text-xl flex *:mx-1 py-2  items-center">
                        <span>Vos favoris</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#000000" stroke="#000000" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                        </svg>
                    </p>
                    <div id="left" class="flex flex-col bg-base-200 min-w-96 p-5 *:my-1 h-full">
                        <div v-for="(accord, index) in filteredAccords" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class="flex justify-between items-center elementDrag w-96 h-20 hover:cursor-move hover:opacity-80">
                            <div class="bg-base-300 flex items-center justify-center h-20">
                                <span class="tooltip mr-2" :data-tip="accord.partnercountry.parco_name">
                                    <span class="fi text-5xl" :class="'fi-'+accord.partnercountry.parco_code "></span>
                                </span>
                                <p class="w-full">({{ accord.partnercountry.parco_name }}) <span class="font-bold">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</span> ({{ accord.isced.isc_code }})</p>
                            </div>
                            <button v-if="isVoeuxLocal(accord.agree_id)" class="h-20 bg-base-300 hover:opacity-60 p-5 hover:cursor-pointer" @click="removeVoeu(accord.agree_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    
                        

                </div>
                <div class="flex flex-col items-center justify-center">
                    <p class="font-bold text-xl flex *:mx-1 py-2 items-center">
                        <span>Vos voeux</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#000000" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>



                    </p>
                    <div id="right" class="bg-base-200 flex flex-col *:m-3">
                        <span class="flex items-center min-h-20">
                            <p class="font-bold p-5 text-lg">Voeu n°1</p>
                            <div id="voeu1" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center"></div>
                        </span>
                        <span class="flex items-center min-h-20">
                            <p class="font-bold p-5 text-lg">Voeu n°2</p>
                            <div id="voeu2" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center"></div>
                        </span>
                        <span class="flex items-center min-h-20">
                            <p class="font-bold p-5 text-lg">Voeu n°3</p>
                            <div id="voeu3" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center"></div>
                        </span>
                        <span class="flex items-center min-h-20">
                            <p class="font-bold p-5 text-lg">Voeu n°4</p>
                            <div id="voeu4" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center"></div>
                        </span>
                        <span class="flex items-center min-h-20">
                            <p class="font-bold p-5 text-lg">Voeu n°5</p>
                            <div id="voeu5" class="voeuxDrop bg-base-100 h-full w-96 flex items-center justify-center"></div>
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
import { onMounted, ref, computed, nextTick } from 'vue'
import { request } from '../../composables/httpRequest';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
import  LoadingComp  from '../../components/utils/LoadingComp.vue'

const response = ref([]);
const account = ref([]);
const favoris = ref([]);
const accords = ref([]);
const isLoaded = ref(false);
const updatedWishes = ref({});
const accountStore = useAccountStore();

async function fetch(){
    await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
    await request('GET', false, accords, config.apiUrl + 'api/agreement');
    await request('GET', false, favoris, config.apiUrl + 'api/favoris/getbylogin/' + accountStore.login);
    isLoaded.value = true;

    updatedWishes.value = { ...account.value.wishes };

    await nextTick();

    let lists = document.getElementsByClassName("elementDrag");
    let dropZones = document.getElementsByClassName('voeuxDrop');


    for (let list of lists) {
        list.setAttribute("draggable", true);
        list.addEventListener("dragstart", function(e) {
            e.dataTransfer.setData("text/plain", e.target.id);
        });
    }

    for (let dropZone of dropZones) {
        dropZone.innerHTML = '';
        dropZone.addEventListener("dragover", function(e) {
            e.preventDefault();
        });
        dropZone.addEventListener("drop", function(e) {
            e.preventDefault();
            let id = e.dataTransfer.getData("text/plain");
            let selected = document.getElementById(id);
            if (selected) {
                const accordId = selected.id.replace('accord_wish_', '');
                if (dropZone.innerHTML == '') {
    e.preventDefault();
    dropZone.appendChild(selected);
    const accord = filteredAccords.value.find(accord => accord.agree_id == accordId);
    updateLocalWishes(accord.agree_id, dropZone.id);
} else {
    console.log("case déjà remplie");
    const existingAccordElement = dropZone.firstChild;
    const existingAccordId = existingAccordElement.id.replace('accord_wish_', '');

    // L'accord qu'on glisse est deja un voeu
    if (isVoeuxLocal(accordId)) {
        // Trouver la zone de voeu actuelle de l'accord glissé
        const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];
        let currentDropZoneId;
        for (let i = 0; i < wishKeys.length; i++) {
            if (updatedWishes.value[wishKeys[i]] == accordId) {
                currentDropZoneId = `voeu${i + 1}`;
                break;
            }
        }

        const currentDropZone = document.getElementById(currentDropZoneId);

        // Permuter les accords
        dropZone.appendChild(selected);
        currentDropZone.appendChild(existingAccordElement);

        // Mettre à jour les voeux locaux
        updateLocalWishes(accordId, dropZone.id);
        updateLocalWishes(existingAccordId, currentDropZone.id);
    } else {
        // L'accord qu'on glisse n'est pas un voeu
        const leftContainer = document.getElementById('left');
        
        // Si l'accord existant est un favori, le remettre à gauche
        if (favoris.value.favoris.some(favori => favori.agree_id == existingAccordId && favori.acc_id == accountStore.login)) {
            leftContainer.appendChild(existingAccordElement);
        } else {
            existingAccordElement.remove();
        }

        // Ajouter le nouvel accord dans la drop zone et mettre à jour les voeux locaux
        dropZone.appendChild(selected);
        updateLocalWishes(accordId, dropZone.id);
    }
}

            }
        });
    }

    const wishes = account.value.wishes;
    const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];
    const addedAccordIds = new Set();

    wishKeys.forEach((wishKey, index) => {
        const accordId = wishes[wishKey];
        if (accordId && !addedAccordIds.has(accordId)) {
            const accordElement = document.getElementById('accord_wish_' + accordId);
            if (accordElement) {
                const dropZone = document.getElementById(`voeu${index + 1}`);
                if (dropZone && !dropZone.contains(accordElement)) {
                    dropZone.innerHTML = '';
                    dropZone.appendChild(accordElement);
                    addedAccordIds.add(accordId);
                }
            }
        }
    });
}

const nbVoeux = computed(() => {
    const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];
    return wishKeys.reduce((count, key) => count + (updatedWishes.value[key] ? 1 : 0), 0);
});

const filteredAccords = computed(() => {
    return accords.value.agreements.filter(accord => {
        const estFavori = favoris.value.favoris.some(favori => favori.agree_id === accord.agree_id && favori.acc_id === accountStore.login);
        return estFavori || isVoeuxLocal(accord.agree_id);
    });
});

function isVoeuxLocal(agree_id) {
    const wishIds = updatedWishes.value ? Object.values(updatedWishes.value) : [];
    const agreeIdStr = agree_id.toString();
    return wishIds.map(id => id?.toString()).includes(agreeIdStr);
}

function updateLocalWishes(agree_id, dropZoneId) {
    const voeuNumber = parseInt(dropZoneId.replace('voeu', ''));
    const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];

    for (let i = 0; i < wishKeys.length; i++) {
        if (updatedWishes.value[wishKeys[i]] === agree_id) {
            updatedWishes.value[wishKeys[i]] = null;
            break;
        }
    }

    updatedWishes.value[wishKeys[voeuNumber - 1]] = agree_id;
}


function removeVoeu(agree_id){
    const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];
    for (let i = 0; i < wishKeys.length; i++) {
        if (updatedWishes.value[wishKeys[i]] === agree_id) {
            updatedWishes.value[wishKeys[i]] = null;
            break;
        }
    }

    const accordElement = document.getElementById('accord_wish_' + agree_id);
    if (accordElement) {
        const isFavori = favoris.value.favoris.some(favori => favori.agree_id === agree_id && favori.acc_id === accountStore.login);
        if (isFavori) {
            const leftContainer = document.getElementById('left');
            if (!leftContainer.contains(accordElement)) {
                leftContainer.appendChild(accordElement);
            }
        } else {
            accordElement.remove();
        }
    }
}

async function saveWishes() {
    await request('POST', true, response, config.apiUrl+'api/wishagreement', updatedWishes.value);
}

onMounted(fetch);
</script>
