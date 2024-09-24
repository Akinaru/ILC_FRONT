<template>
    <input type="checkbox" :id="'my_modal_' + accord.agree_id" class="modal-toggle" />
    <div class="modal modal-bottom sm:modal-middle" role="dialog">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Modification de l'accord n° {{ accord.agree_id }}</h3>
            <form @submit.prevent="editAgreement(accord.agree_id)" class="w-full *:my-2">
                <!-- Formulaire Isced -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Isced</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="isced_select" v-model="newAgreement.isced">
                        <option value="">Aucun isced</option>
                        <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{ isced.isc_code }}) {{ isced.isc_name }}</option>
                    </select>
                </label>
                <!-- Formulaire composante -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Composante</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="compo_select" v-model="newAgreement.compo">
                        <option value="">Aucune composante</option>
                        <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }} ({{ compo.comp_shortname }})</option>
                    </select>
                </label>
                <!-- Formulaire université -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Université</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="univ_select" v-model="newAgreement.univ">
                        <option value="">Aucune université</option>
                        <option v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }} ({{ univ.univ_city }} - {{ univ.partnercountry.parco_name }})</option>
                    </select>
                </label>
                <!-- Formulaire Typeaccord -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Type accord</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="typeaccord_select" v-model="newAgreement.typeaccord">
                        <option value="">Aucun type d'accord</option>
                        <option>Bilatéral</option>
                        <option>Erasmus</option>
                    </select>
                </label>
                <!-- Formulaire Nombre de place -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Nombre de place</span>
                    </div>
                    <input type="number" class="input input-bordered w-full" v-model="newAgreement.nbplace" />
                </label>
                <!-- Formulaire Lien -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Lien (facultatif)</span>
                    </div>
                    <input type="text" class="input input-bordered w-full" v-model="newAgreement.lien" />
                </label>
                <!-- Formulaire Description -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Description (facultatif)</span>
                    </div>
                    <input type="text" class="input input-bordered w-full" v-model="newAgreement.description" />
                </label>
            </form>
            <div class="modal-action">
                <label :for="'my_modal_' + accord.agree_id" class="btn ">Annuler</label>
                <label :for="'my_modal_' + accord.agree_id" class="btn btn-success" @click="editAgreement(accord.agree_id)">Enregistrer</label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { request } from '../../composables/httpRequest';
import config from '../../config';

import { addAlert } from '../../composables/addAlert';

const emit = defineEmits(['agreementUpdated']);


const props = defineProps({
    accord: Object,
    isceds: Array,
    composantes: Array,
    universites: Array,
    partnercountrys: Array
});

const response = ref([]);

const newAgreement = ref({ 
    isced: '', //Si addNew = nouveau isced
    compo: '', //Si addNew = nouveau composante
    univ: '', //Si addNew = nouveau université
    typeaccord: '',
    nbplace: 0,
    lien: null,
    description: null,

    newisced: {code: 0, name: ''},
    newcompo: {name: '', shortname: ''},
    newuniv: {
        partnercountry: '', //Si addNew = nouveau pays partenaire
        name: '', 
        city: '', 
        newpartnercountry: ''
    },
});

function init(){
    newAgreement.value.isced = props.accord.isced?.isc_id ?? '';
    newAgreement.value.compo = props.accord.component?.comp_id ?? '';
    newAgreement.value.univ = props.accord.university?.univ_id ?? '';
    newAgreement.value.typeaccord = props.accord.agree_typeaccord ?? '';
    newAgreement.value.nbplace = props.accord.agree_nbplace ?? 0;
    newAgreement.value.lien = props.accord.agree_lien ?? '';
    newAgreement.value.description = props.accord.agree_description ?? '';
}

async function editAgreement(agree_id) {
    const requestData = {
        agree_typeaccord: newAgreement.value.typeaccord,
        agree_nbplace: newAgreement.value.nbplace,
    };

    // Vérification du nombre de places
    if (newAgreement.value.nbplace <= 0) {
        addAlert('error', { data: { error: 'Le nombre de places doit être supérieur à zéro.', message: 'Modification de l\'accord annulée.' } });
        return;
    }

    if (newAgreement.value.lien != null) {
        requestData.agree_lien = newAgreement.value.lien;
    }
    if (newAgreement.value.description != null) {
        requestData.agree_description = newAgreement.value.description;
    }

    // Gestion du nouveau isced
    requestData.isc_id = newAgreement.value.isced;

    // Gestion de la nouvelle composante
        requestData.comp_id = newAgreement.value.compo;

    // Gestion de la nouvelle université
        requestData.univ_id = newAgreement.value.univ;

    // Effectuer la requête PUT pour mettre à jour l'accord
    await request('PUT', true, response, config.apiUrl + 'api/agreement/' + props.accord.agree_id, requestData);

    // Émettre l'événement agreementUpdated pour rafraîchir les données
    emit('agreementUpdated');
}



onMounted(init);
</script>