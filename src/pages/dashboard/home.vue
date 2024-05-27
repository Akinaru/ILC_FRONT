<template>
    <div class="m-5">
        {{ account }}
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
        <p>Vous avez {{ accords.count }} favoris.</p>
        <div class="flex *:mr-5">
            <div id="left" class="flex flex-col max-w-xs bg-base-300 p-5">
                <div v-for="(accord, index) in accords.agreements" :key="index" :draggable="true" :id="accord.agree_id" class="btn btn-warning elementDrag w-full">{{accord.university.univ_city}} - {{ accord.university.univ_name }}</div>
            </div>
            <div id="right" class="bg-base-300 h-96 flex flex-col *:m-3">
                <span class="flex h-full items-center">
                    <p>Voeux 1</p>
                    <div id="voeux1" class="voeuxDrop bg-base-200 h-full w-96 flex items-center justify-center"></div>
                </span>
                <span class="flex h-full items-center">
                    <p>Voeux 2</p>
                    <div id="voeux2" class="voeuxDrop bg-base-200 h-full w-96"></div>
                </span>
                <span class="flex h-full items-center">
                    <p>Voeux 3</p>
                    <div id="voeux3" class="voeuxDrop bg-base-200 h-full w-96"></div>
                </span>
                <span class="flex h-full items-center">
                    <p>Voeux 4</p>
                    <div id="voeux4" class="voeuxDrop bg-base-200 h-full w-96"></div>
                </span>
                <span class="flex h-full items-center">
                    <p>Voeux 5</p>
                    <div id="voeux5" class="voeuxDrop bg-base-200 h-full w-96"></div>
                </span>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted, ref } from 'vue'
import { request } from '../../composables/httpRequest';
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';

const account = ref([])
const accords = ref([])
const accountStore = useAccountStore();

async function fetch(){
    await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login)
    await request('GET', false, accords, config.apiUrl+'api/favoris/getfavbylogin/'+accountStore.login)
    
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
                dropZone.appendChild(selected);
                const accord = accords.value.agreements.find(accord => accord.agree_id == selected.id)
                console.log(accord)
            }
        });
    }
    const wishes = account.value.wishes;
    const wishKeys = ['wsha_one', 'wsha_two', 'wsha_three', 'wsha_four', 'wsha_five'];
    
    wishKeys.forEach((wishKey, index) => {
        const accordId = wishes[wishKey];
        console.log(wishes)
        if (accordId) {
            const accordElement = document.getElementById(accordId);
            if (accordElement) {
                const dropZone = document.getElementById(`voeux${index + 1}`);
                if (dropZone) {
                    dropZone.appendChild(accordElement);
                }
            }
        }
    });

}

onMounted(fetch)
</script>

