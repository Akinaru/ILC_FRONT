<template>
    <div>
        <div class="flex justify-between">
            <p class="text-xl font-bold">Departement</p>
            <div class="flex *:mx-1">
                <ExportComp texte="Exporter des départements en csv" :link="config.apiUrl+'api/department/export'"></ExportComp>
            </div>
        </div>

        <!-- Formulaires -->
        <div class="w-full flex px-20 py-10">
            <!-- Ajout de composante -->
            <div class="m-5 w-full">
                <div class="m-5 flex justify-center items-center flex-col">
                    <p class="text-lg font-bold">Ajout composante</p>
                    <form @submit.prevent="addComposante" class=" *:my-2 flex flex-col justify-center items-center">
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom</span>
                            </div>
                            <input type="text" placeholder="Nom" v-model="newComp.name" class="input input-bordered w-full " />

                        </label>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Nom raccourci</span>
                            </div>
                            <input type="text" placeholder="Nom raccourci" v-model="newComp.shortname" class="input input-bordered w-full" />

                        </label>
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter la composante</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Ajout de département -->
            <div class="m-5 w-full">
                <div class="m-5 flex justify-center items-center flex-col">
                    <p class="text-lg font-bold">Ajout département</p>
                    <form @submit.prevent="addDepartment" class="w-3/5 *:my-2 flex flex-col justify-center items-center">
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Composante</span>
                            </div>
                            <select class="select select-bordered w-full" v-model="newDep.compo">
                                <option disabled selected>Selectionnez une composante</option>
                                <option v-for="(compo, index) in composantes.components" :key="index" :value="compo.comp_id">{{ compo.comp_name }}</option>
                            </select>
                        </label>
                        <label class="form-control w-5/6 my-1 flex flex-col justify-center items-center" v-if="newDep.compo === 'addNew'">
                            <div class="label">
                                <span class="label-text">Créer une composante</span>
                            </div>
                            <input type="text" placeholder="Nom (ex: IUT Annecy)" v-model="newDep.newcompo.name" class="input input-bordered w-full" />
                            <input type="text" placeholder="Nom raccourci (ex: IUT-A)" v-model="newDep.newcompo.shortname" class="input input-bordered w-full " />
                        </label>


                        <div class="w-full flex items-center justify-between">
                            <label for="colorPicker" class="label-text">Couleur</label> 
                            <input type="color" id="colorPicker" v-model="newDep.color">
                        </div>
                        <input type="text" placeholder="Nom" v-model="newDep.name" class="input input-bordered w-full " />
                        <input type="text" placeholder="Nom raccourci" v-model="newDep.shortname" class="input input-bordered w-full" />
                        <div class="flex items-center justify-center">
                            <button class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter le département</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>


        <!-- Liste de département -->
        <div>
            <p class="text-lg font-bold">Liste des composantes (et de leurs départements)</p>
            <div v-if="composantes && composantes.components" class="my-5">
                <div v-if="composantes.count > 0">
                    
                    <div v-for="(compo, index) in composantes.components" :key="index">
                        <div class="flex">

                            <p class="p-5 bg-base-300 w-full"><span class="font-bold">{{ compo.comp_name }}</span> ({{ compo.comp_shortname }})</p>
                            <!-- Bouton de modification composante -->
                            <label for="modal_modif_comp" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifComp(compo)">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>
                            
                            <!-- Bouton de suppression composante -->
                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="openConfirmModalCompo(compo)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div v-for="(dept, index) in compo.departments" :key="index" class="mx-10 flex m-1">
                            
                            <div class="bg-base-300 w-full p-5 flex items-center justify-center">
                                <div class="h-10 w-10 mx-5 tooltip hover:opacity-80 hover:cursor-pointer" :data-tip="`${dept.dept_color} Cliquez pour copier`" @click="copyColor(dept.dept_color)" :style="{backgroundColor: dept.dept_color}"></div>
                                <p class="w-full">{{ dept.dept_name }} ({{ dept.dept_shortname }})</p>
                            </div>
                            <!-- Bouton de modification departement -->
                            <label for="modal_modif" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifDept(dept)">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>

                            <!-- Bouton de suppression departement -->
                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="openConfirmModal(dept)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>


                        </div>
                        <p class="list-disc mx-10 my-5" v-if="compo.departments.length == 0">Aucun département</p>
                    </div>
                </div>
                <div v-else>
                    <p>Aucune composante trouvée.</p>
                </div>
                                            <!-- Modal de confirmation suppression composante -->
                                            <dialog id="confirmModalCompo" ref="confirmModalCompo" class="modal">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                    <div class="py-3">
                                        <p>Confirmez vous la supression de la composante:</p>
                                        <strong>
                                            {{ confirmDeleteComposante.comp_name }}
                                        </strong>
                                    </div>
                                <div class="modal-action">
                                    <button class="btn " @click="closeModal">Annuler</button>
                                    <button class="btn btn-success"  @click="removeComp(confirmDeleteComposante.comp_id)">Confirmer</button>
                                </div>
                                </div>
                            </dialog>
                            <!-- Modal de confirmation suppression departement -->
                            <dialog id="confirmModal" ref="confirmModal" class="modal">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                                    <div class="py-3">
                                        <p>Confirmez vous la supression du département:</p>
                                        <strong>
                                            <span class="badge p-3" :style="{backgroundColor: confirmDeleteDepartment.dept_color}">{{ confirmDeleteDepartment.dept_shortname }} </span> {{confirmDeleteDepartment.dept_name}}
                                        </strong>
                                    </div>
                                <div class="modal-action">
                                    <button class="btn " @click="closeModal">Annuler</button>
                                    <button class="btn btn-success"  @click="removeDepartment(confirmDeleteDepartment.dept_shortname, confirmDeleteDepartment.dept_id)">Confirmer</button>
                                </div>
                                </div>
                            </dialog>

            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
    </div>

    <!-- Modals de modifications -->
    <div>
        <!-- Modal de modification de departement -->
        <input type="checkbox" id="modal_modif" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Modification du département n° {{ currentDeptModif.dept_id }}</h3>
                <form @submit.prevent="confirmModifDept" class="w-full">
                    <!-- Nom -->
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nom</span>
                        </div>
                        <input type="text"  class="input input-bordered w-full" v-model="currentDeptModif.dept_name"/>
                    </label>
                    <!-- Nom raccourci -->
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nom raccourci</span>
                        </div>
                        <input type="text"  class="input input-bordered w-full" v-model="currentDeptModif.dept_shortname"/>
                    </label>
                    <!-- Couleur -->
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Couleur</span>
                        </div>
                        <input type="color" id="colorPicker" v-model="currentDeptModif.dept_color">
                    </label>
                    <div class="modal-action">
                        <label for="modal_modif" class="btn ">Annuler</label>
                        <button type="submit">
                            <label for="modal_modif" class="btn btn-success">Enregistrer</label>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Modal de modification de componant -->
        <input type="checkbox" id="modal_modif_comp" class="modal-toggle" />
        <div class="modal modal-bottom sm:modal-middle" role="dialog">
            <div class="modal-box">
                <h3 class="font-bold text-lg">Modification de la composante n° {{ currentCompModif.comp_id }}</h3>
                <form @submit.prevent="confirmModifComp" class="w-full">
                    <!-- Nom -->
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nom</span>
                        </div>
                        <input type="text"  class="input input-bordered w-full" v-model="currentCompModif.comp_name"/>
                    </label>
                    <!-- Nom raccourci -->
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nom raccourci</span>
                        </div>
                        <input type="text"  class="input input-bordered w-full" v-model="currentCompModif.comp_shortname"/>
                    </label>

                    <div class="modal-action">
                        <label for="modal_modif_comp" class="btn ">Annuler</label>
                        <button type="submit">
                            <label for="modal_modif_comp" class="btn btn-success">Enregistrer</label>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    import { addAlert } from '../../composables/addAlert';
    import { useAccountStore } from '../../stores/accountStore';
    import ExportComp from '../../components/impexp/ExportComp.vue';

    const accountStore = useAccountStore();

    const composantes = ref([]);
    const response = ref([]);
    const currentDeptModif = ref([]);
    const currentCompModif = ref([]);
    const confirmDeleteDepartment = ref([])
    const confirmDeleteComposante = ref([])

    const newDep = ref({ 
        name: '', 
        shortname: '', 
        color: '#9e9e9e', 
        compo: '', 
        newcompo: {
            name: null, 
            shortname: null
        } 
    });

    const newComp = ref({
        name: '',
        shortname: ''
    })

    // Ajouter un département
    async function addDepartment(){
        const requestData = { 
            dept_name: newDep.value.name,
            dept_shortname: newDep.value.shortname.toUpperCase(),
            dept_color: newDep.value.color,
        };

        // Gestion de la nouvelle composante
        if (newDep.value.compo == 'Selectionnez une composante'){
            addAlert('error', {data:{error: 'Vous devez choisir une composante.', message:'Ajout du département annulé.'}})
            return;
        }else if (newDep.value.compo !== 'addNew') {
            requestData.comp_id = newDep.value.compo;
        }
        
        if(newDep.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom à votre département.', message:'Ajout du département annulé.'}})
            return;
        }
        if(newDep.value.shortname == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom raccourci à votre département.', message:'Ajout du département annulé.'}})
            return;
        }
        
        await request("POST", true, response, config.apiUrl+'api/department', requestData);
        if(response.value.status == 201){
            const requestDataAction = {
                act_description: 'Ajout du département '+newDep.value.shortname+'.',
                acc_id: accountStore.login,
                dept_id: response.value.department.dept_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetchAll();
        resetInput();

    }

    // Ajouter une composante
    async function addComposante(){
        const requestData = { 
            comp_name: newComp.value.name,
            comp_shortname: newComp.value.shortname.toUpperCase(),
        };
        
        if(newComp.value.name == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom à votre composante.', message:'Ajout de la composante annulé.'}})
            return;
        }
        if(newComp.value.shortname == ''){
            addAlert('error', {data:{error: 'Vous devez mettre un nom raccourci à votre composante.', message:'Ajout de la composante annulé.'}})
            return;
        }
        
        await request("POST", true, response, config.apiUrl+'api/component', requestData);
        if(response.value.status == 201){
            const requestDataAction = {
                act_description: 'Ajout de la composante '+newComp.value.shortname+'.',
                acc_id: accountStore.login,
                dept_id: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        await fetchAll();
        resetInput();

    }

    //ouvrir le modal de confirmation de suppression des dept
    function openConfirmModal(dept) {
        confirmDeleteDepartment.value = dept;
        const modal = document.getElementById('confirmModal')
        modal.showModal()
    }
    //ouvrir le modal de confirmation de suppression des composantes
    function openConfirmModalCompo(compo) {
        confirmDeleteComposante.value = compo;
        const modal = document.getElementById('confirmModalCompo')
        modal.showModal()
    }
    //Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal')
        modal.close()
        const modal2 = document.getElementById('confirmModalCompo')
        modal2.close()
    }


    // Gestion de la modification de departement
    // Modifie la ref par departement qu'on veut modifier
    // pour afficher les bonnes informations dans le form de modif
    function modifDept(dept){
        currentDeptModif.value.dept_id = dept.dept_id;
        currentDeptModif.value.dept_name = dept.dept_name;
        currentDeptModif.value.dept_shortname = dept.dept_shortname;
        currentDeptModif.value.dept_color = dept.dept_color;
    }
    function modifComp(comp){
        currentCompModif.value.comp_id = comp.comp_id;
        currentCompModif.value.comp_name = comp.comp_name;
        currentCompModif.value.comp_shortname = comp.comp_shortname;
    }

    // Confirmer la modification
    async function confirmModifDept(){
        const requestData = { 
            dept_id: currentDeptModif.value.dept_id,
            dept_name: currentDeptModif.value.dept_name,
            dept_shortname: currentDeptModif.value.dept_shortname,
            dept_color: currentDeptModif.value.dept_color,
        };
        await request('PUT', true, response, config.apiUrl+'api/department', requestData);
        if(response.value.status == 200){
            const requestDataAction = {
                act_description: 'Modification du département '+requestData.dept_shortname+'.',
                acc_id: accountStore.login,
                dept_id: response.value.department.dept_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
    }
    // Confirmer la modification
    async function confirmModifComp(){
        const requestData = { 
            comp_id: currentCompModif.value.comp_id,
            comp_name: currentCompModif.value.comp_name,
            comp_shortname: currentCompModif.value.comp_shortname,
        };
        await request('PUT', true, response, config.apiUrl+'api/component', requestData);
        fetchAll();
    }

    // Supprimer un département
    async function removeDepartment(shortname, id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/department/deletebyid/'+id);
        if(response.value.status == 202){
            const requestDataAction = {
                act_description: 'Suppression du département '+shortname+'.',
                acc_id: accountStore.login,
                dept_id: id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
    }
    // Supprimer une composante
    async function removeComp(id){
        closeModal();
        await request('DELETE', true, response, config.apiUrl+'api/component/deletebyid/'+id);
        fetchAll();
    }


    async function fetchAll(){
        await request('GET',false, composantes, config.apiUrl+'api/component');

        resetInput();
    }

    function resetInput(){
        newDep.value.name = '';
        newDep.value.shortname = '';
        newDep.value.color = '#9e9e9e';
        newDep.value.compo = document.querySelector('.select').options[0].value;

        newDep.value.newcompo.shortname = '';
        newDep.value.newcompo.name = '';

        newComp.value.shortname = '';
        newComp.value.name = '';
    }

    function copyColor(color){
        navigator.clipboard.writeText(color);
    }

    onMounted(fetchAll);

</script>