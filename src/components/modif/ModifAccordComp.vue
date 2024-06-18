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
                        <option disabled value="">Sélectionnez un isced</option>
                        <option v-for="(isced, index) in isceds" :key="index" :value="isced.isc_id">({{ isced.isc_code }}) {{ isced.isc_name }}</option>
                        <option value="addNew">Créer un isced</option>
                    </select>
                    <label class="form-control w-5/6 my-1" v-if="newAgreement.isced === 'addNew'">
                        <div class="label">
                            <span class="label-text">Créer un Isced</span>
                        </div>
                        <input type="number" placeholder="Code (ex: 061)" v-model="newAgreement.newisced.code" class="input input-bordered w-full" />
                        <input type="text" placeholder="Nom (ex: Information and Communication Technologies)" v-model="newAgreement.newisced.name" class="input input-bordered w-full" />
                    </label>
                </label>
                <!-- Formulaire composante -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Composante</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="compo_select" v-model="newAgreement.compo">
                        <option disabled value="">Sélectionnez une composante</option>
                        <option v-for="(compo, index) in composantes" :key="index" :value="compo.comp_id">{{ compo.comp_name }} ({{ compo.comp_shortname }})</option>
                        <option value="addNew">Créer une composante</option>
                    </select>
                    <label class="form-control w-5/6 my-1" v-if="newAgreement.compo === 'addNew'">
                        <div class="label">
                            <span class="label-text">Créer une composante</span>
                        </div>
                        <input type="text" placeholder="Nom (ex: IUT Annecy)" v-model="newAgreement.newcompo.name" class="input input-bordered w-full" />
                        <input type="text" placeholder="Nom raccourci (ex: IUT-A)" v-model="newAgreement.newcompo.shortname" class="input input-bordered w-full" />
                    </label>
                </label>
                <!-- Formulaire université -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Université</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="univ_select" v-model="newAgreement.univ">
                        <option disabled value="">Sélectionnez une université</option>
                        <option v-for="(univ, index) in universites" :key="index" :value="univ.univ_id">{{ univ.univ_name }} ({{ univ.univ_city }} - {{ univ.partnercountry.parco_name }})</option>
                        <option value="addNew">Créer une université</option>
                    </select>
                    <label class="form-control w-5/6 my-1" v-if="newAgreement.univ === 'addNew'">
                        <div class="label">
                            <span class="label-text">Créer une université</span>
                        </div>
                        <span class="my-1">
                            <input type="text" placeholder="Nom (ex: Université Savoie Mont Blanc)" v-model="newAgreement.newuniv.name" class="input input-bordered w-full" />
                            <input type="text" placeholder="Ville (ex: Annecy)" v-model="newAgreement.newuniv.city" class="input input-bordered w-full" />
                        </span>
                        <select class="select select-bordered w-full select-primary" id="partnercountry_select" v-model="newAgreement.newuniv.partnercountry">
                            <option disabled value="">Sélectionnez un pays</option>
                            <option v-for="(parco, index) in partnercountrys" :key="index" :value="parco.parco_id">{{ parco.parco_name }}</option>
                            <option value="addNew">Créer un pays</option>
                        </select>
                        <span class="flex items-center justify-center">
                            <input v-if="newAgreement.newuniv.partnercountry === 'addNew'" type="text" placeholder="Nouveau pays (ex: France)" v-model="newAgreement.newuniv.newpartnercountry" class="input input-bordered w-5/6 my-1" />
                        </span>
                    </label>
                </label>
                <!-- Formulaire Typeaccord -->
                <label class="form-control w-full items-center justify-center">
                    <div class="label">
                        <span class="label-text">Type accord</span>
                    </div>
                    <select class="select select-bordered w-full select-primary" id="typeaccord_select" v-model="newAgreement.typeaccord">
                        <option disabled value="">Sélectionnez un type d'accord</option>
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
import { ref, onMounted, defineEmits } from 'vue';
import { request } from '../../composables/httpRequest';
import config from '../../config';

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

    if (newAgreement.value.lien != null) {
        requestData.agree_lien = newAgreement.value.lien;
    }
    if (newAgreement.value.description != null) {
        requestData.agree_description = newAgreement.value.description;
    }

    // Gestion du nouveau isced
    if (newAgreement.value.isced !== 'addNew') {
        requestData.isc_id = newAgreement.value.isced;
    } else {
        requestData.newisced = {
            isc_code: '0' + newAgreement.value.newisced.code.toString(),
            isc_name: newAgreement.value.newisced.name
        };
    }

    // Gestion de la nouvelle composante
    if (newAgreement.value.compo !== 'addNew') {
        requestData.comp_id = newAgreement.value.compo;
    } else {
        requestData.newcompo = {
            comp_name: newAgreement.value.newcompo.name,
            comp_shortname: newAgreement.value.newcompo.shortname.toUpperCase()
        };
    }

    // Gestion de la nouvelle université
    if (newAgreement.value.univ !== 'addNew') {
        requestData.univ_id = newAgreement.value.univ;
    } else {
        requestData.newuniv = {
            univ_name: newAgreement.value.newuniv.name,
            univ_city: newAgreement.value.newuniv.city,
        };
        if (newAgreement.value.newuniv.partnercountry !== 'addNew') {
            requestData.newuniv.parco_id = newAgreement.value.newuniv.partnercountry;
        } else {
            requestData.newuniv.parco_name = newAgreement.value.newuniv.newpartnercountry;
            requestData.newuniv.parco_code = newAgreement.value.newuniv.newpartnercountrycode;
        }
    }
    await request('PUT', true, response, config.apiUrl + 'api/agreement/' + props.accord.agree_id, requestData);
    emit('agreementUpdated');
}

onMounted(init);
</script>