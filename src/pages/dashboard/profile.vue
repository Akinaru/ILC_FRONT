<template>
    <div class="text-sm breadcrumbs font-bold">
        <ul>
            <li><RouterLink :to="{name: 'Dashboard'}">Dashboard</RouterLink></li> 
            <li><RouterLink :to="{name: 'EtudiantsDash'}">Étudiants</RouterLink></li> 
            <li v-if="account && account.acc_id">{{ account.acc_fullname }}</li>
            <li v-else>?</li>
        </ul>
    </div>
    <div v-if="account && account.acc_id">
        <p class="text-xl font-bold py-5 bg-base-300 flex items-center justify-center">{{ account.acc_fullname }}<span v-if="account.department != null" :style="{backgroundColor: account.department.dept_color}" class="p-3 mx-3">{{ account.department.dept_shortname }}</span> </p>
        <div>
            <p>Liste des voeux:</p>
            <div v-for="(label, index) in labels" :key="index">
                <div  class="bg-base-300 w-fit flex items-center justify-start my-1">
                    <p class="font-bold text-lg p-5">Voeu n° {{ index+1 }}</p>
                    <div v-if="wishes && wishes.count > 0 && wishes.wishes[label]" class=" select-none flex justify-between items-center elementDrag w-96 h-20">
                        <div class="bg-base-300 flex items-center justify-center h-20 select-none">
                            <span class="tooltip mr-2" :data-tip="wishes.wishes[label].partnercountry.parco_name">
                                <span class="fi text-5xl" :class="'fi-'+wishes.wishes[label].partnercountry.parco_code "></span>
                            </span>
                            <p class="w-full select-none">({{ wishes.wishes[label].partnercountry.parco_name }}) <span class="font-bold">{{wishes.wishes[label].university.univ_city}} - {{ wishes.wishes[label].university.univ_name }}</span> ({{ wishes.wishes[label].isced.isc_code }})</p>
                            
                        </div>
                    </div>
                    <div v-else class="w-96 flex items-center justify-center">
                        <p class="select-none">Pas de voeu séléctionné</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <p class="flex font-bold items-center justify-center p-52">Étudiant introuvable...</p>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
 
    const route = useRoute();
    const acc_id = route.params.acc_id;
    const account = ref([]);
    const wishes = ref([])
    const labels = ref(['agree_one', 'agree_two', 'agree_three', 'agree_four', 'agree_five']);

    async function fetchAll(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        await request('GET', false, wishes, config.apiUrl+'api/wishagreement/getbylogin/'+acc_id);
    }


    onMounted(fetchAll)

</script>