<template>
    <div class="" v-if="isLoaded">
        <div v-if="accord && accord.agree_id">
            <div class="flex justify-end pb-20">

                <div v-if="accountStore.isLogged() && accountStore.isStudent()" @click="toggleFavoris(accord.agree_id)" class="w-fit group p-2 flex items-center justify-center  hover:cursor-pointer hover:scale-150 scale-120 transition-all" :class="{'hover:opacity-60' : isFavorited(accord.agree_id)}">
                    <svg 
                    class="md:w-5 w-4 md:h-5 h-4 transition-all duration-100 ease-in-out  " 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path 
                    :class="{'fill-current': isFavorited(accord.agree_id), 'group-hover:fill-current': !isFavorited(accord.agree_id)}" 
                    :fill="isFavorited(accord.agree_id) ? 'currentColor' : 'none'" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z" />
                </svg>
            </div>
        </div>


            <div class="flex items-center flex-col text-xl md:text-2xl">
                <!-- Drapeau -->
                <div class="bg-base-300 w-fit flex justify-start items-center flex-col p-10 rounded-xl">
                    <span class="fi text-10xl transition-all duration-100 ease-in-out" :class="'fi-'+accord.partnercountry.parco_code "></span>
                </div>
                <!-- Informations -->
                <div class="flex items-center flex-col py-10">
                    <p><span class="font-bold ">{{ accord.university.univ_name }}</span> à {{ accord.university.univ_city }} en ({{ accord.partnercountry.parco_name }})</p>

                    <!-- Departement -->
                    <p class="pt-5">Les départements disponibles pour cet accord:</p>
                    <div class="flex items-center flex-wrap">
                        <div v-if="accord.departments.length > 0" class="flex flex-row items-center transition-all duration-100 ease-in-out pt-3">
                            <div v-for="(dept, index) in accord.departments" :key="index">
                                <p v-if="dept.pivot.deptagree_valide" class="transition-all duration-100 ease-in-out md:p-3 min-w-11 p-1 ml-0 m-1 font-bold drop-shadow-lg select-none text-lg" :style="{backgroundColor: dept.dept_color}">{{ dept.dept_shortname }}</p>
                            </div>
                        </div>
                        <div v-else>
                            <p class="p-3 m-1">Aucun département</p>
                        </div>
                    </div>

                    <p class="pt-5">{{ accord.isced.isc_code }} - {{ accord.isced.isc_name }}</p>
                    <a v-if="accord.agree_lien" :href="accord.agree_lien" class="pt-5 hover:opacity-80 text-blue-700 hover:cursor-pointer hover:underline">Cliquez ici pour acceder au site de l'université</a>
                </div>

                <!-- Autres accords -->
                <p class="flex items-start w-full py-2">Autres accords qui pourraient vous plaire:</p>
                <div class="bg-base-300 w-full h-64 overflow-x-auto whitespace-nowrap flex items-center text-sm">
                    <!-- Afficher les autres accords ici -->
                    <RouterLink :to="{name: 'Accord', params: {agree_id: item.agree_id}}" v-for="(item, index) in accords.agreements" :key="index" class="relative group hover:opacity-60 hover:cursor-pointer bg-base-100 rounded-lg p-4 m-2 min-w-80 w-80 h-52 drop-shadow-lg flex flex-col justify-between transition-all hover:scale-102">
                        <div class="flex justify-between">
                            <div>
                                <span class="fi text-5xl transition-all duration-100 ease-in-out" :class="'fi-'+item.partnercountry.parco_code "></span>
                            </div>
                            <div class=" flex items-start justify-start flex-wrap ml-2" v-if="item.departments.length > 0">
                                <div class="font-bold text-xxs p-1"  :style="{backgroundColor: dept.dept_color}" v-for="(dept, index) in item.departments" :key="index">
                                    {{ dept.dept_shortname }}
                                </div>
                            </div>
                            <div v-else>
                                <p>Aucun département</p>
                            </div>
                        </div>
                        <div>
                            <p class="font-bold break-words whitespace-normal text-xl">{{ item.university.univ_name }}</p>
                            <p>{{ item.university.univ_city }} ({{ item.partnercountry.parco_name }}) - {{ item.isced.isc_code }}</p>
                        </div>
                        <span class="absolute inset-0 flex items-center justify-center text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-opacity-75">Voir plus</span>
                    </RouterLink>

                </div>

            </div>
        </div>
        <div v-else>
            <p class="flex font-bold items-center justify-center py-64">Accord introuvable...</p>
        </div>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import LoadingComp from '../components/utils/LoadingComp.vue';
    import { useAccountStore } from '../stores/accountStore';
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
        apiUrl += requestData.dept_id ? 'agree_id=' + accord.value.agree_id + '&' : '';
        apiUrl += requestData.dept_id ? 'univ_id=' + accord.value.university.univ_id : '';

        await request('GET', true, accords, apiUrl);
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
    
</script>
