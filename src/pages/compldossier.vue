<template>
    <div class="m-5 flex items-center justify-center flex-col">
        <p>Bienvenue sur votre accès personnel aux relations internationales.</p>
        <p>Votre dossier est incomplet,</p>
        <p>veuillez remplir les informations ci-dessous pour compléter votre dossier étudiant lié aux relations internationales.</p>


        <form @submit.prevent="confirmCompl" class="m-5 w-4/6 flex items-center justify-center flex-col">
            <p>Formulaire</p>
            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Numéro étudiant (INE)</span>
                </div>
                <input type="text" placeholder="XXXXXXXX" class="input input-bordered w-full max-w-xs" v-model="complDossier.ine"/>
            </label>
            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Département</span>
                </div>
                <select class="select select-bordered" v-model="complDossier.department">
                    <option disabled selected value="">Séléctionnez un département</option>
                    <template v-for="(compo, index) in components.components" :key="index">
                        <optgroup :label="compo.comp_name">
                            <option v-for="(dept, index) in compo.departments" :key="index" :value="dept.dept_id">{{ dept.dept_name }} ({{ dept.dept_shortname }})</option>
                        </optgroup>
                    </template>
                </select>
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Avez-vous des aménagements aux examens ?</span> 
                        <input type="checkbox" class="checkbox" v-model="complDossier.amenagement"/>
                    </label>
                </div>
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Consentez-vous à l'utilisation de votre image selon notre politique de confidentialité et de protection des données ?</span> 
                        <input type="checkbox" class="checkbox" v-model="complDossier.consent"/>
                    </label>
                </div>
                <div class="flex items-center justify-center">
                    <button class="btn btn-primary" type="submit">Valider</button>
                </div>
            </label>
        </form>
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue'
    import { request } from '../composables/httpRequest';
    import config from '../config';
    import { addAlert } from '../composables/addAlert';
    import { useAccountStore } from '../stores/accountStore';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const accountStore = useAccountStore();
    const components = ref([]);
    const response = ref([]);
    const complDossier = ref({ 
        ine: '', 
        department: '',
        amenagement: false,
        consent: false
    });

    async function confirmCompl(){
        if(!complDossier.value.ine || complDossier.value.ine === ''){
            addAlert(true,{data: {error: 'Veuillez renseigner le numéro étudiant (INE).'}});
            return;
        }
        else if(!complDossier.value.department || complDossier.value.department === ''){
            addAlert(true,{data: {error: 'Veuillez renseigner votre département.'}});
            return;
        }
        else if(!complDossier.value.consent){
            addAlert(true,{data: {error: 'Votre consentement au droit à l\'image est obligatoire.'}});
            return;
        }
        const requestData = {
            acc_id: accountStore.login,
            acc_studentnum: complDossier.value.ine,
            dept_id: complDossier.value.department,
            acc_amenagement: complDossier.value.amenagement,
            acc_consent: complDossier.value.consent,
        }

        await request('PUT', false, response, config.apiUrl+'api/account/compldossier', requestData);


        if(!response.value.response){
            accountStore.setValidate(true);
            console.log("compte enregistré, renvoie vers dashboard")
            router.push({ name: 'Home' });
        }
    }

    async function fetch(){
        await request('GET', false, components, config.apiUrl+'api/component'); 
        resetInput();
    }

    function resetInput(){
        complDossier.value.ine = '';
        complDossier.value.amenagement = false;
        complDossier.value.consent = false;
        complDossier.value.department = document.querySelector('.select').options[0].value;
    }

    onMounted(fetch)

</script>