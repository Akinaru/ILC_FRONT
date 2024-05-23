<template>
    <div class="overflow-x-auto min-h-screen">
        <div class="py-4">
            <p>Filtres: <span>{{ filteredActions.length }} résultat{{ filteredActions.length > 1 ? 's' : '' }} 
                avec {{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) }} 
                filtre{{ selectedTypes.length + (searchQuery !== '' ? 1 : 0) > 1 ? 's' : '' }}</span>
            </p>
            <div class="flex items-start flex-col w-fit ">
                <div class="flex py-3">
                    <div class="flex items-center justify-center mr-2" v-for="(type, index) in types" :key="index">
                        <input type="checkbox" :id="'filt_type_'+index" class="checkbox mx-1" :value="type.condition" v-model="selectedTypes">
                        <label :for="'filt_type_'+index" class="badge" :class="type.color">{{ type.name }}</label>
                    </div>
                </div>
                <label class="input input-bordered flex items-center gap-2 w-full">
                    <input type="text" class="grow" placeholder="Recherche par login" v-model="searchQuery" @input="filterActions">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
                </label>
            </div>
        </div>
        <table class="table table-zebra" v-if="filteredActions && filteredActions.length > 0">
            <thead>
                <tr>
                    <th>n°</th>
                    <th>Login</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(act, actIndex) in filteredActions" :key="actIndex">
                    <th>{{ act.act_id }}</th>
                    <td>{{ act.acc_id }}</td>
                    <td>{{ act.act_description }}</td>
                    <td>{{ act.act_date }}</td>
                    <td>
                        <span v-for="(type, typeIndex) in types" :key="typeIndex">
                            <template v-if="type && type.condition && checkCondition(type.condition, act)">
                                <span :class="['badge', type.color]">{{ type.name }}</span>
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
import config from '../../config';

const actions = ref([]);
const selectedTypes = ref([]);
const searchQuery = ref('');

const types = [
    { name: 'Départements', color: 'badge-primary', condition: 'dept_id' },
    { name: 'Accord', color: 'badge-neutral', condition: 'agree_id' },
    { name: 'Article', color: 'badge-accent', condition: 'art_id' },
    { name: 'Evenement', color: '', condition: 'evt_id' }
];

async function fetch() {
    await request('GET', false, actions, config.apiUrl + 'api/action');
}

const filteredActions = computed(() => {
    let filtered = actions.value;
    if (selectedTypes.value.length > 0) {
        filtered = filtered.filter(action => {
            return selectedTypes.value.some(selectedType => {
                return action[selectedType] !== null && action[selectedType] !== undefined;
            });
        });
    }
    if (searchQuery.value.trim() !== '') {
        filtered = filtered.filter(action => {
            return action.acc_id.includes(searchQuery.value.trim());
        });
    }
    return filtered;
});

function checkCondition(condition, act) {
    return act[condition] !== null && act[condition] !== undefined;
}

function filterActions() {
    // Trigger computed property recalculation
}

onMounted(fetch);
</script>
