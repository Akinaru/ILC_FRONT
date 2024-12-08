<template>
    <div>
        <div v-if="isLoaded">
            <div class="m-5 my-20">
                <p class="text-lg font-bold text-center mb-10">Témoignages des utilisateurs</p>

                <!-- Liste des témoignages -->
                <div class="flex flex-wrap justify-center gap-4">
                    <div v-for="(account, index) in filteredAccounts" :key="index" 
                         class="bg-base-300 p-5 rounded-lg shadow-lg min-w-80 max-w-96">
                        <div class="flex items-center gap-3 mb-4">
                            <!-- Avatar avec couleur du rôle -->
                            <div class="w-12 h-12 rounded-full flex items-center justify-center"
                                 :style="{ backgroundColor: account.role?.color || '#666666' }">
                                <span class="text-lg text-white font-bold">
                                    {{ getInitials(account.acc_fullname) }}
                                </span>
                            </div>
                            <!-- Nom et rôle -->
                            <div class="flex-1">
                                <p class="font-bold">{{ account.acc_fullname }}</p>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm" 
                                          :style="{ color: account.role?.color || '#666666' }">
                                        {{ account.role?.role || 'Rôle non défini' }}
                                    </span>
                                    <span class="text-sm opacity-70">
                                        - {{ account.acc_anneemobilite || 'Année non définie' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="p-2 mt-1  rounded w-72" :class="account.arbitrage ? 'bg-base-200' : 'bg-base-300 opacity-60'">
                                        <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: account.arbitrage.agree_id}}" v-if="account.arbitrage" class="text-sm select-none hover:opacity-60">
                                            <div class="flex items-center">
                                                <span class="relative inline-block mr-2">
                                                    <!-- Drapeau -->
                                                    <span class="fi" :class="'fi-' + (account.arbitrage.partnercountry?.parco_code)"></span>

                                                    <!-- Point d'interrogation si pas de drapeau -->
                                                    <span v-if="!account.arbitrage.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white select-none">
                                                        ?
                                                    </span>
                                                </span>

                                                <div class="flex flex-col flex-1 overflow-hidden">
                                                    <span class="font-medium truncate">{{ account.arbitrage.university?.univ_name || 'Université indisponible' }}</span>
                                                    <span class="text-gray-500 truncate">
                                                        {{ account.arbitrage.university?.univ_city || 'Ville indisponible' }} - 
                                                        {{ account.arbitrage.partnercountry?.parco_name || 'Pays indisponible' }}
                                                        <span class="text-xs">({{ account.arbitrage.isced?.isc_code || 'Code ISCED ?' }})</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </RouterLink>
                                        <div v-else class="text-sm text-gray-400 italic flex items-center justify-center w-full min-h-12">
                                            Pas de destination
                                        </div>
                                    </div>
                        <!-- Témoignage -->
                        <div class="prose">
                            <blockquote class="italic">
                                "{{ account.acc_temoignage }}"
                            </blockquote>
                        </div>
                    </div>
                </div>

                <!-- Message si aucun témoignage -->
                <div v-if="filteredAccounts.length === 0" class="text-center mt-10">
                    <p class="text-lg opacity-70">Aucun témoignage n'a encore été publié.</p>
                </div>
            </div>
        </div>
        <LoadingComp v-else></LoadingComp>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import config from '../../config';
import { request } from '../../composables/httpRequest';
import LoadingComp from '../../components/utils/LoadingComp.vue';

const isLoaded = ref(false);
const accounts = ref([]);

// Filtre uniquement les comptes avec des témoignages
const filteredAccounts = computed(() => {
    return accounts.value.accounts
        ?.filter(account => account.acc_temoignage && account.acc_temoignage.trim() !== '')
        .sort((a, b) => {
            const nameA = a.acc_fullname || '';
            const nameB = b.acc_fullname || '';
            return nameA.localeCompare(nameB);
        }) || [];
});

// Fonction pour obtenir les initiales à partir du nom complet
function getInitials(fullName) {
    if (!fullName) return '';
    const nameParts = fullName.split(' ');
    if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
}

async function fetchAccounts() {
    isLoaded.value = false;
    await request('GET', false, accounts, config.apiUrl + 'api/account');
    isLoaded.value = true;
}

onMounted(fetchAccounts);
</script>