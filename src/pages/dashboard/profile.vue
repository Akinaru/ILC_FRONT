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
            <!-- Destination finale -->
            <div v-if="destination.agreement">
                <p class="font-bold text-xl py-5">Destination finale</p>
                <div class="select-none flex justify-between items-center elementDrag h-20 transition-all duration-100 ease-in-out">
                    <RouterLink :to="{name: 'Accord', params: {agree_id: destination.agreement.agree_id}}" class="group hover:opacity-60 relative">

                        <div class="border-warning border-2 bg-base-300 p-1 flex items-center justify-center w-full h-20 select-none">
                            <span class="tooltip mr-2" :data-tip="destination.agreement.partnercountry.parco_name">
                                <span class="fi xl:text-5xl text-xl transition-all duration-100 ease-in-out" :class="'fi-'+destination.agreement.partnercountry.parco_code "></span>
                            </span>
                            <p class="w-full select-none">({{ destination.agreement.partnercountry.parco_name }}) <span class="font-bold">{{destination.agreement.university.univ_city}} - {{ destination.agreement.university.univ_name }}</span> ({{ destination.agreement.isced.isc_code }})</p>    
                        </div>
                    </RouterLink>
                </div>
            </div>
            <!-- Page -->
            <div class="flex md:flex-row flex-col justify-between w-full pt-5">
                <!-- Liste des voeux -->
                <div class="w-fit">
                    <p class="font-bold text-xl py-5">Liste des voeux:</p>
                    <div v-for="(label, index) in labels" :key="index">
                        <div class="w-fit flex items-center justify-start my-1 bg-base-300 border-2 "
                        :class="destination.agreement && wishes.wishes[label] && destination.agreement.agree_id == wishes.wishes[label].agree_id ? ' border-warning' : 'border-base-300'">
                            <p class="font-bold text-sm xl:text-lg min-w-fit p-5 transition-all duration-100 ease-in-out">Voeu n° {{ index+1 }}</p>
                            <div v-if="wishes && wishes.count > 0 && wishes.wishes[label]" class=" select-none flex justify-between items-center elementDrag w-96 h-20">
                                <div class=" flex items-center justify-center h-20 select-none">
                                    <span class="tooltip mr-2" :data-tip="wishes.wishes[label].partnercountry.parco_name">
                                        <span class="fi text-3xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-'+wishes.wishes[label].partnercountry.parco_code "></span>
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
                <!-- Informations -->
                <div class="w-full flex items-center justify-center flex-col ">
                    <div class="w-3/5">

                        <p class="font-bold text-xl py-5 w-full">Informations:</p>
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Identitée</span>
                                </div>
                                <input type="text" :value="account.acc_fullname" class="input input-bordered w-full " disabled />
                            </label>
                            <label class="form-control w-full" >
                                <div class="label">
                                    <span class="label-text">Email</span>
                                </div>
                                <input type="text" :value="'mail'" class="input input-bordered w-full " disabled/>
                            </label>
                            <label class="form-control w-full">
                                <div class="label">
                                    <span class="label-text">Numéro étudiant</span>
                                </div>
                                <input type="text" :value="account.acc_studentnum" class="input input-bordered w-full " disabled />
                            </label>
                            <label class="form-control w-full " >
                                <div class="label">
                                    <span class="label-text">Département</span>
                                </div>
                                <input type="text" :value="account.department ? account.department.dept_shortname : 'Aucun'" class="input input-bordered w-full " disabled/>
                            </label>
                            <label class="form-control w-full" >
                                <div class="label">
                                    <span class="label-text">Score TOEIC</span>
                                </div>
                                <input type="text" :value="'0'" class="input input-bordered w-full " disabled/>
                            </label>
                            <button class="btn btn-primary w-full max-w-sm my-10">Modifier</button>
                    </div>

                </div>
            </div>
            <!-- Envoyer une notification -->

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
    const destination = ref([])
    const labels = ref(['agree_one', 'agree_two', 'agree_three', 'agree_four', 'agree_five', 'agree_six']);

    async function fetchAll(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        await request('GET', false, wishes, config.apiUrl+'api/wishagreement/getbylogin/'+acc_id);
        await request('GET', false, destination, config.apiUrl + 'api/arbitrage/getbyid/'+account.value.acc_id);
    }


    onMounted(fetchAll)

</script>