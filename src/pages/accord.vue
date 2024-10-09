<template>
    <div v-if="isLoaded">
        <div v-if="accord && accord.agreement?.agree_id">
            <div class="flex justify-end pb-20">
                <!-- Favoris -->
                <div v-if="accountStore.isLogged() && accountStore.isStudent()" @click="toggleFavoris(accord.agree_id)" class="w-fit group p-2 flex items-center justify-center hover:cursor-pointer hover:scale-105 transition-all" :class="{'hover:opacity-60' : isFavorited(accord.agree_id)}">
                    <button class="btn btn-primary">
                        <!-- SVG pour le bouton -->
                    </button>
                </div>
            </div>
            <div class="flex items-center flex-col text-xl md:text-2xl">
                <div class="bg-base-300 max-w-lg flex justify-start items-center flex-col p-10 rounded-xl">
                    <span class="relative inline-block">
                        <!-- Drapeau -->
                        <span class="fi text-8xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.agreement?.partnercountry?.parco_code || '')"></span>
                        <span v-if="!accord.agreement?.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">?</span>
                    </span>
                </div>

                <!-- Informations -->
                <div class="flex items-center flex-col my-20 px-4">
                    <p class="text-center">
                        <span class="font-bold">{{ accord.agreement?.university?.univ_name || 'Université indisponible' }}</span> à {{ accord.agreement?.university?.univ_city || 'Ville indisponible' }} en ({{ accord.agreement?.partnercountry?.parco_name || 'Pays indisponible' }})
                    </p>

                    <!-- Départements -->
                    <p class="pt-5">Les départements disponibles pour cet accord:</p>
                    <div class="flex items-center flex-wrap">
                        <div v-if="accord.agreement?.departments?.length > 0" class="flex flex-row items-center transition-all duration-100 ease-in-out pt-3 overflow-x-auto">
                            <div v-for="(dept, index) in accord.agreement?.departments" :key="index">
                                <p v-if="dept.pivot.deptagree_valide" class="transition-all duration-100 ease-in-out md:p-3 min-w-11 p-1 ml-0 m-1 font-bold drop-shadow-lg select-none text-lg" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                            </div>
                        </div>
                        <div v-else>
                            <p class="p-3 m-1">Aucun département</p>
                        </div>
                    </div>
                    <p class="pt-5 text-center">{{ accord.agreement?.isced?.isc_code || 'Code ISCED indisponible' }} - {{ accord.agreement?.isced?.isc_name || 'Nom ISCED indisponible' }}</p>
                    <p v-if="accord.agreement && accord.agreement.agree_description" class="my-5 w-full max-w-150 text-center">{{ accord.agreement.agree_description }}</p>
                    <a v-if="accord.agreement?.agree_lien" target="_blank" :href="accord.agreement?.agree_lien" class="pt-5 hover:opacity-80 text-blue-700 hover:cursor-pointer hover:underline">Cliquez ici pour accéder au site de l'université</a>
                    
                </div>

                <!-- Autres accords -->
                <p class="flex items-start w-full py-2">Autres accords qui pourraient vous plaire:</p>
                <div class="bg-base-300 w-full h-64 overflow-x-auto whitespace-nowrap flex items-center text-sm">
                    <!-- Afficher les autres accords ici -->
                    <RouterLink :to="{name: 'Accord', params: {agree_id: item.agree_id}}" v-for="(item, index) in accords.agreements" :key="index" class="relative group hover:opacity-60 hover:cursor-pointer bg-base-100 rounded-lg p-4 m-2 min-w-80 w-80 h-52 drop-shadow-lg flex flex-col justify-between transition-all hover:scale-102">
                        <div class="flex justify-between">
                            <div>
                                <span class="relative inline-block">
                                    <!-- Drapeau -->
                                    <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (item.partnercountry?.parco_code || '')"></span>
                                    <span v-if="!item.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none">?</span>
                                </span>
                            </div>
                            <div class="flex items-start justify-start flex-wrap ml-2" v-if="item.departments.length > 0">
                                <div class="font-bold text-xxs p-1" :style="{backgroundColor: dept.dept_color}" v-for="(dept, index) in item.departments" :key="index">
                                    {{ dept.dept_shortname }}
                                </div>
                            </div>
                            <div v-else>
                                <p>Aucun département</p>
                            </div>
                        </div>
                        <div>
                            <p class="font-bold break-words whitespace-normal text-xl">{{ item.university?.univ_name || 'Université indisponible' }}</p>
                            <p>{{ item.university?.univ_city || 'Ville indisponible' }} ({{ item.partnercountry?.parco_name || 'Pays indisponible' }}) {{ item.isced?.isc_code ? ' - ' : '' }} {{ item.isced?.isc_code || '' }}</p>
                        </div>
                        <span class="absolute inset-0 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-opacity-75">Voir plus</span>
                    </RouterLink>
                </div>
            </div>
        </div>
        <div v-else class="h-full min-h-screen flex flex-col justify-center items-center">
            <p class="flex font-bold items-center justify-center text-xl md:text-2xl pb-10">Accord introuvable...</p>
            <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-80 transition-all hover:scale-105">
                <button class="btn btn-primary">Revenir à l'accueil</button>
            </RouterLink>
            <div class="flex flex-col items-center space-y-4">
                <Vue3Lottie :animationData="notfound" :height="animationWidth" :width="animationWidth" />
            </div>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>


<script setup>
    import { ref, onMounted, watch,onBeforeUnmount, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import LoadingComp from '../components/utils/LoadingComp.vue';
    import { useAccountStore } from '../stores/accountStore';
    import { Vue3Lottie } from 'vue3-lottie'
    import notfound from '../animations/notfound.json'
    const accountStore = useAccountStore();

    const route = useRoute();
    const accord = ref([]);
    const isLoaded = ref(false);
    const accords = ref([])
    const account = ref([])
    const favoris = ref([])
    const response = ref([])

    async function fetchAll(){
        isLoaded.value = false;
        await request('GET', false, accord, config.apiUrl+'api/agreement/getbyid/'+route.params.agree_id);
        if(accountStore.isLogged)
            await request('GET', false, favoris, config.apiUrl+'api/favoris/getbylogin/'+accountStore.login)
        const requestData = {}
        if(accountStore.isLogged()){
            await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+accountStore.login); 
            requestData.dept_id = account.value.department ? account.value.department.dept_id : null;
        }

        let apiUrl = config.apiUrl + 'api/agreement/random?';
        if (requestData.dept_id) {
            apiUrl += 'dept_id=' + requestData.dept_id + '&';
        }
        if (requestData.dept_id) {
            if (accord.value.agree_id) {
                apiUrl += 'agree_id=' + accord.value.agree_id + '&';
            }
            if (accord.value.university && accord.value.university.univ_id) {
                apiUrl += 'univ_id=' + accord.value.university.univ_id;
            }
        }

        await request('GET', true, accords, apiUrl);
        document.title = `ILC - ${accord.value.agreement?.university?.univ_name ?? 'Université indisponible'} (${accord.value.agreement?.partnercountry?.parco_name ?? 'Pays indisponible'} [${accord.value.agreement?.isced?.isc_code ?? '??'} - ${accord.value.agreement?.isced?.isc_name ?? 'Isced indisponible'}])`

        isLoaded.value = true;
    }
    function isFavorited(agree_id) {
      return favoris.value.favoris.some(
        favori => favori.acc_id === accountStore.login && favori.agree_id === agree_id
      );
    }


    async function toggleFavoris(agree_id) {
        if(!isFavorited(agree_id)){
            const requestData = {
                acc_id: accountStore.login,
                agree_id: agree_id
            }
            await request('post', true, response, config.apiUrl+'api/favoris', requestData);
            if(response.value.status == 201){
                favoris.value.favoris.push({
                    acc_id: accountStore.login,
                    agree_id: agree_id
                });
            }
        }
        else{
            await request('delete', true, response, config.apiUrl+'api/favoris/delete/'+accountStore.login+'/'+agree_id);
            favoris.value.favoris = favoris.value.favoris.filter(favori => !(favori.acc_id === accountStore.login && favori.agree_id === agree_id));
            
        }
    }
    onMounted(fetchAll)

    watch(() => route.params.agree_id, () => {
        fetchAll();
    });


    //Animations

  
  const screenWidth = ref(window.innerWidth)
  
  const updateDimensions = () => {
    screenWidth.value = window.innerWidth
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateDimensions)
    // Initial calculation
    updateDimensions()
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateDimensions)
  })
  
  const animationWidth = computed(() => {
    // Ajuste la largeur en fonction de la taille de l'écran, avec une largeur minimale et maximale
    return Math.min(Math.max(screenWidth.value * 0.6, 200), 500)
  })
    
</script>
