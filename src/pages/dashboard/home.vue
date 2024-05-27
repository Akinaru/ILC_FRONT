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
            <p>Vous avez {{ favoris.count }} favoris et {{ nbVoeux(account.wishes) }} voeux</p>
            <div class="flex *:mr-5">
                <div id="left" class="flex flex-col bg-base-300 min-w-96 p-5">
                    <div v-for="(accord, index) in filteredAccords" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class="bg-base-200 flex justify-between items-center elementDrag w-96">
                        <p class="w-full p-5">{{accord.university.univ_city}} - {{ accord.university.univ_name }} ({{ accord.isced.isc_code }})</p>
                        <button v-if="isVoeux(accord.agree_id)" class="hover:opacity-60 p-5 hover:cursor-pointer bg-base-200" @click="removeVoeu(accord.agree_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
                <div id="right" class="bg-base-300 h-96 flex flex-col *:m-3">
                    <span class="flex h-full items-center">
                        <p>Voeu 1</p>
                        <div id="voeu1" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                    </span>
                    <span class="flex h-full items-center">
                        <p>Voeu 2</p>
                        <div id="voeu2" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                    </span>
                    <span class="flex h-full items-center">
                        <p>Voeu 3</p>
                        <div id="voeu3" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                    </span>
                    <span class="flex h-full items-center">
                        <p>Voeu 4</p>
                        <div id="voeu4" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                    </span>
                    <span class="flex h-full items-center">
                        <p>Voeu 5</p>
                        <div id="voeu5" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center justify-center my-20 py-72 flex-col">
        <p class="p-5 font-bold select-none">Chargement des données en cours...</p>
        <span class="loading loading-dots loading-lg"></span>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { request } from '../../composables/httpRequest';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';

const account = ref([]);
const favoris = ref([]);
const accords = ref([]);
const isLoaded = ref(false);
const accountStore = useAccountStore();

async function fetch(){
    await request('GET', false, account, config.apiUrl + 'api/account/getbylogin/' + accountStore.login);
    await request('GET', false, accords, config.apiUrl + 'api/agreement');
    await request('GET', false, favoris, config.apiUrl + 'api/favoris/getbylogin/' + accountStore.login);
    isLoaded.value = true;

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
        dropZone.addEventListener("dragover", function(e) {
            e.preventDefault();
        });
        dropZone.addEventListener("drop", function(e) {
            e.preventDefault();
            let id = e.dataTransfer.getData("text/plain");
            let selected = document.getElementById(id);
            if (selected) {
                e.preventDefault();
                dropZone.appendChild(selected);
                const accordId = selected.id.replace('accord_wish_', '');
                const accord = filteredAccords.value.find(accord => accord.agree_id == accordId);
                console.log("Déplacement de " + accord.agree_id + " vers " + dropZone.id)
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

    function nbVoeux(account){
        const one = account.wsha_one == null ? 0 : 1;
        const two = account.wsha_two == null ? 0 : 1;
        const three = account.wsha_three == null ? 0 : 1;
        const four = account.wsha_four == null ? 0 : 1;
        const five = account.wsha_five == null ? 0 : 1;
        return one + two + three + four + five
    }

    const filteredAccords = computed(() => {
        return accords.value.agreements.filter(accord => {
            const estFavori = favoris.value.favoris.some(favori => favori.agree_id === accord.agree_id && favori.acc_id === accountStore.login);
            return estFavori || isVoeux(accord.agree_id);
        });
    });

    function isVoeux(agree_id){
        const wishIds = account.value.wishes ? Object.values(account.value.wishes) : [];
        return wishIds.includes(agree_id)
    }

    function removeVoeu(agree_id){
        console.log("suppression voeu " + agree_id);
        
    }

    onMounted(fetch);
</script>
