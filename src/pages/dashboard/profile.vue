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
        <p class="text-xl font-bold py-5 bg-base-200 flex items-center justify-center">{{ account.acc_fullname }}<span v-if="account.department != null" :style="{backgroundColor: account.department.dept_color}" class="p-3 mx-3">{{ account.department.dept_shortname }}</span> </p>
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
                    <div class="w-3/5 flex items-center justify-center flex-col">
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
                            <input type="text" :value="account.acc_mail" class="input input-bordered w-full " disabled/>
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
                            <input type="text" :value="account.acc_toeic" class="input input-bordered w-full " disabled/>
                        </label>
                        <!-- Boutton de modification -->
                        <label for="my_modal_6" class="btn btn-primary w-full max-w-sm my-10" @click="resetModif">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                            <p>Modifier</p>
                        </label>

                        <!-- Modal de modification des informations -->
                        <input type="checkbox" id="my_modal_6" class="modal-toggle" />
                        <div class="modal" role="dialog">
                            <div class="modal-box">
                                <h3 class="text-lg font-bold">Modification des informations</h3>
                                

                                <form @submit.prevent="confirmModifCompte" class="w-full">
                                    <!-- Mail -->
                                    <label class="form-control w-full">
                                        <div class="label">
                                            <span class="label-text">Mail</span>
                                        </div>
                                        <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_mail"/>
                                    </label>
                                    <!-- Numéro étudiant -->
                                    <label class="form-control w-full">
                                        <div class="label">
                                            <span class="label-text">Numéro étudiant</span>
                                        </div>
                                        <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_studentnum"/>
                                    </label>
                                    <!-- Département -->
                                    <label class="form-control w-full">
                                        <div class="label">
                                            <span class="label-text">Département</span>
                                        </div>
                                        <select 
                                        :disabled="accountStore.access !== 1"
                                        class="select select-bordered w-full" 
                                        v-model="modifCompte.dept_id"
                                        >
                                            <option value="no_dept">Aucun département</option>
                                            <option v-for="department in department.departments" :key="department.dept_id" :value="department.dept_id">
                                                {{ department.dept_shortname }}
                                            </option>
                                        </select>
                                        <p v-if="accountStore.access != 1">Seul les administrateurs peuvent modifier ce champ.</p>
                                    </label>
                                    <!-- Toeic -->
                                    <label class="form-control w-full">
                                        <div class="label">
                                            <span class="label-text">Toeic</span>
                                        </div>
                                        <input type="text"  class="input input-bordered w-full" v-model="modifCompte.acc_toeic"/>
                                    </label>
                                    <div class="modal-action">
                                        <button type="submit">
                                            <label for="my_modal_6" class="btn btn-success">Enregistrer</label>
                                        </button>
                                        <label for="my_modal_6" class="btn">Annuler</label>
                                    </div>
                                </form>
                            </div>
                        </div>
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
    import { useAccountStore } from '../../stores/accountStore';
 
    const accountStore = useAccountStore();
    const route = useRoute();
    const acc_id = route.params.acc_id;
    const account = ref([]);
    const department = ref([]);
    const wishes = ref([])
    const response = ref([])
    const destination = ref([])
    const labels = ref(['agree_one', 'agree_two', 'agree_three', 'agree_four', 'agree_five', 'agree_six']);

    const modifCompte = ref([])

    async function fetchAll(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        resetModif();
        await request('GET', false, wishes, config.apiUrl+'api/wishagreement/getbylogin/'+acc_id);
        await request('GET', false, destination, config.apiUrl + 'api/arbitrage/getbyid/'+account.value.acc_id);
        await request('GET', false, department, config.apiUrl+'api/department');
    }


    async function confirmModifCompte(){
        const requestData = {
            acc_id: account.value.acc_id,
            acc_studentnum: modifCompte.value.acc_studentnum != '' ? modifCompte.value.acc_studentnum : 0,
            dept_id: modifCompte.value.dept_id != 'no_dept' ? modifCompte.value.dept_id : null,
            acc_mail: modifCompte.value.acc_mail != '' ? modifCompte.value.acc_mail : 'Aucun mail' ,
            acc_toeic: modifCompte.value.acc_toeic != '' ? modifCompte.value.acc_toeic : 0, 
        }
        await request('PUT', true, response, config.apiUrl+'api/account/modif', requestData);
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        resetModif();
    }

    function resetModif(){
        modifCompte.value.acc_studentnum = account.value.acc_studentnum;
        modifCompte.value.acc_mail = account.value.acc_mail;
        modifCompte.value.acc_toeic = account.value.acc_toeic;
        modifCompte.value.dept_id = account.value.department ? account.value.department.dept_id : 'no_dept' 
    }

    onMounted(fetchAll)

</script>