<template>
    <div class="m-5">
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
        <div class="flex">
            <!-- Conteneur des accords favoris -->
            <div class="flex-1 border-r pr-4">
                <h2 class="text-lg font-semibold mb-4">Accords Favoris</h2>
                <div class="bg-gray-200 p-4 rounded-lg" @dragover.prevent>
                    <div v-for="(accord, index) in accords.agreements" :key="index" class="bg-white shadow-sm rounded-lg mb-2 cursor-pointer" @dragstart="dragStart(accord)" draggable>
                        <span class="p-2">{{ accord.university.univ_name }}</span>
                    </div>
                </div>
            </div>
            <!-- Conteneur des nouveaux favoris à glisser et déposer -->
            <div class="flex-1 pl-4">
                <h2 class="text-lg font-semibold mb-4">Nouveaux Favoris</h2>
                <div class="bg-gray-200 p-4 rounded-lg" @dragover.prevent @drop="drop">
                    <p class="text-center text-gray-600" v-if="nouveauxFavoris.length === 0">Glissez vos nouveaux favoris ici</p>
                    <div v-for="(nouveauFavori, index) in nouveauxFavoris" :key="'nouveauFavori_' + index" class="bg-white shadow-sm rounded-lg mb-2" @dragstart="dragStart(nouveauFavori)" draggable>
                        <span class="p-2">{{ nouveauFavori.name }}</span>
                    </div>
                </div>
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
    const nouveauxFavoris = ref([]) // Référence pour les nouveaux favoris à glisser et déposer
    const accountStore = useAccountStore();

    async function fetch(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login)
        await request('GET', false, accords, config.apiUrl+'api/favoris/getfavbylogin/'+accountStore.login)
    }

    onMounted(fetch)

    let draggedItem = null;

    function dragStart(nouveauFavori) {
        draggedItem = nouveauFavori;
    }

    function drop() {
        // Ajouter le nouvel accord aux favoris
        nouveauxFavoris.value.push(draggedItem);
        draggedItem = null;
    }
</script>
