<template>
    <div>
        <div v-if="isLoaded">

            <p class="font-bold text-xl mb-5">Liste des Universités:</p>
            <div class="flex flex-wrap justify-center gap-2">
                <div v-for="(univ, index) in filteredUniversities" :key="index" class="bg-base-300 min-h-40 p-3 my-2 min-w-96 max-w-96 relative">
                    <span class="relative flex items—center justify-between">
                        <div class="flex items-center">

                            <!-- Drapeau -->
                            <span class="fi text-2xl" :class="'fi-' + (univ.partnercountry?.parco_code || '')"></span>
                            
                            <!-- Point d'interrogation si pas de drapeau -->
                            <template v-if="!univ.partnercountry?.parco_code">
                                <span class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">
                                    ?
                                </span>
                            </template>
                            
                            
                            <p class="ml-2">{{ univ.partnercountry?.parco_name ?? 'Pays indisponible' }}</p>
                        </div>
                        <div class="flex">
                        <!-- Bouton de modification -->
                        <label class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-3" @click="modifUniv(univ)">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-70 p-3 hover:cursor-pointer bg-base-300 " @click="openConfirmModal(univ)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    </span>
                    <p class="mt-1"><strong>{{ univ.univ_name ? univ.univ_name : 'Nom université indisponible'  }}</strong> à {{ univ.univ_city ? univ.univ_city : 'Nom ville indisponible' }}</p>
                

                </div>
            </div>
            <!-- Modal de confirmation suppression -->
            <dialog id="confirmModal" ref="confirmModal" class="modal">
                <div class="modal-box">
                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                    <div class="py-3">
                        <p>Confirmez vous la supression de l'université: <strong>{{confirmDeleteUniv}}</strong></p>
                    </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success">Confirmer</button>
                </div>
                </div>
            </dialog>
        </div>
        <LoadingComp v-else></LoadingComp>
    </div>
</template> 

<script setup>
import { ref, onMounted, computed } from 'vue';
import config from '../../config'
import { request } from '../../composables/httpRequest';
import LoadingComp from '../../components/utils/LoadingComp.vue';

const isLoaded = ref(false);
const universites = ref([]);
const confirmDeleteUniv = ref([])

// Méthode pour filtrer et trier les universités
const filteredUniversities = computed(() => {
    return universites.value
        .filter(univ => univ.partnercountry) // Filtre pour s'assurer que partnercountry existe
        .sort((a, b) => {
            const nameA = a.partnercountry.parco_name || '';
            const nameB = b.partnercountry.parco_name || '';
            return nameA.localeCompare(nameB); // Trie par nom
        });
});

//ouvrir le modal de confirmation de suppression
function openConfirmModal(univ) {
  
  confirmDeleteUniv.value = univ;
  const modal = document.getElementById('confirmModal')
  modal.showModal()
}
//Fermer le modal de confirmation de suppression
function closeModal() {
  const modal = document.getElementById('confirmModal')
  modal.close()
}

async function fetchAll(){
    isLoaded.value = false;
    await request('GET', false, universites, config.apiUrl + 'api/university');
    isLoaded.value = true;
}

onMounted(fetchAll)
</script>