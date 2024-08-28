<template>
    <div class="overflow-x-auto min-h-screen">
        <p class="font-bold text-xl">Historique</p>
        <div class="py-4">
            <p>Filtres: <span>{{ filteredActions.length }} résultat{{ filteredActions.length > 1 ? 's' : '' }} 
                avec {{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) }} 
                filtre{{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) > 1 ? 's' : '' }}</span>
            </p>
            <div class="flex justify-between items-center">
                <!-- Partie gauche -->
                <div class="flex items-start flex-col w-fit ">
                    <!-- Type à cocher -->
                    <div class="flex py-3">
                        <label :for="'filt_type_'+index" class="flex items-center justify-center mr-2 hover:cursor-pointer" v-for="(type, index) in types" :key="index">
                            <input type="checkbox" :id="'filt_type_'+index" class="checkbox mx-1" :value="type.condition" v-model="selectedTypes">
                            <label :for="'filt_type_'+index" class="badge select-none min-w-32 cursor-pointer" :class="type.color">{{ type.name }}</label>
                        </label>
                    </div>
                    <!-- Barre de recherche -->
                    <label class="input input-bordered flex items-center gap-2 w-full">
                        <input type="text" class="grow" placeholder="Recherche par login" v-model="searchQuery">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                    </label>
                </div>

                <!-- bouton supprimer -->
                <label for="delete" class="btn btn-error">Supprimer l'historique</label>

                <!-- modal -->
                <input type="checkbox" id="delete" class="modal-toggle" />
                <div class="modal" role="dialog">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirmation requise</h3>
                        <p class="py-4">Confirmez vous la suppression de l'historique ?</p>
                        <div class="modal-action">
                            <label for="delete" @click="deleteHistory()" class="btn btn-success">Valider</label>
                            <label for="delete" class="btn">Annuler</label>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
        <table class="table table-zebra" v-if="filteredActions && filteredActions.length > 0">
            <thead>
                <tr class="select-none">
                    <th>n°</th>
                    <th>Login</th>
                    <th>Description</th>
                    <th @click="sortByDateAsc = !sortByDateAsc" class="cursor-pointer hover:opacity-70">
                        <div class="flex items-center justify-between cursor-pointer">

                            Date
                            <span class="ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" :style="{ transform: sortByDateAsc.value ? 'rotate(0deg)' : 'rotate(180deg)' }">
                                    <path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v15.69l5.47-5.47a.75.75 0 111.06 1.06l-6.75 6.75a.75.75 0 01-1.06 0l-6.75-6.75a.75.75 0 011.06-1.06l5.47 5.47V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" v-if="sortByDateAsc"></path>
                                    <path fill-rule="evenodd" d="M12 20.25a.75.75 0 01-.75-.75V3.81l-5.47 5.47a.75.75 0 01-1.06-1.06l6.75-6.75a.75.75 0 011.06 0l6.75 6.75a.75.75 0 01-1.06 1.06L12.75 3.81v15.69a.75.75 0 01-.75.75z" clip-rule="evenodd" v-else></path>
                                </svg>
                            </span>
                        </div>
                    </th>
                    <th class="flex items-center justify-center">Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(act, actIndex) in filteredActions" :key="actIndex">
                    <th>{{ act.act_id }}</th>
                    <td>{{ act.acc_id }}</td>
                    <td class="w-full">{{ act.act_description }}</td>
                    <td class="min-w-56 flex items-center justify-center">{{ formatDate(act.act_date) }}</td>
                    <td>
                        <span class="flex items-center justify-center min-w-36">
                            <template v-if="getType(act.act_type)">
                                <span class="min-w-32" :class="['badge', getType(act.act_type).color]">{{ getType(act.act_type).name }}</span>
                            </template>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-else class="flex items-center justify-center p-44">
            <p>Aucune action n'a été trouvée.</p>
        </div>
    </div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { onMounted, ref, computed } from 'vue';

import { getType } from '../../composables/actionType'
import { types } from '../../composables/actionType'
import config from '../../config';
import { useAccountStore } from '../../stores/accountStore';
const accountStore = useAccountStore();

const actions = ref([]);
const selectedTypes = ref([]);
const searchQuery = ref('');

const response = ref([]);


const sortByDateAsc = ref(false);

async function fetch() {
    await request('GET', false, actions, config.apiUrl + 'api/action');
}

const filteredActions = computed(() => {
    let filtered = actions.value;

    if (selectedTypes.value.length > 0) {
        filtered = filtered.filter(action => {
            return selectedTypes.value.some(selectedType => {
                return action.act_type === selectedType;
            });
        });
    }

    if (searchQuery.value.trim() !== '') {
        filtered = filtered.filter(action => {
            return action.acc_id.includes(searchQuery.value.trim());
        });
    }

    filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.act_date);
        const dateB = new Date(b.act_date);
        return sortByDateAsc.value ? dateA - dateB : dateB - dateA;
    });

    return filtered;
});



async function deleteHistory(){
    await request('DELETE', true, response, config.apiUrl+'api/action');
    if(response.value.status == 202){
        const requestDataAction = {
            act_description: 'Suppression de l\'historique.',
            acc_id: accountStore.login,
            admin: 1
        }
        await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
    }
    fetch();
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



onMounted(fetch);
</script>
