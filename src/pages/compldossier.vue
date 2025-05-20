<template>
    <div class="m-5 flex items-center justify-center flex-col">

      <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="w-64 sm:w-72 transition-all duration-300 ease-in-out py-5">

      <p class="font-bold text-xl">Bienvenue sur votre espace personnel dédié aux relations internationales.</p>
      <p class="font-bold text-xl">Votre dossier est incomplet,</p>
      <p class="font-bold text-xl">veuillez remplir les informations ci-dessous pour compléter votre dossier.</p>

      <div class="w-full flex items-center justify-center flex-col py-3">
        <p class="py-4">Avancement des étapes actuelles:</p>
        <ul class="steps steps-vertical lg:steps-horizontal max-w-lg">
          <li class="step step-neutral">Inscription</li>
          <li class="step">Choix des vœux</li>
          <li class="step">Arbitrage</li>
          <li class="step">Validation</li>
        </ul>
      </div>

      
      <!-- Formulaire -->
      <form @submit.prevent="confirmCompl" class="m-5 md:w-4/6 w-full flex items-center justify-center flex-col mt-10">
              <p>Formulaire</p>

              <!-- Numéro étudiant -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Numéro étudiant (INE)</span>
                  </div>
                  <input type="text" placeholder="XXXXXXXX" class="input input-bordered w-full max-w-lg" v-model="complDossier.ine"/>
              </label>

              <!-- Email -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Email</span>
                  </div>
                  <input type="text" placeholder="ex: maxime.gallotta@etu.univ-smb.fr" class="input input-bordered w-full max-w-lg" v-model="complDossier.email"/>
              </label>

              <!-- Département -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Département</span>
                  </div>
                  <select class="select select-bordered" v-model="complDossier.department">
                      <option disabled selected value="">Séléctionnez un département</option>
                      <template v-for="(compo, index) in components.components" :key="index">
                          <optgroup :label="compo.comp_name">
                              <option v-for="(dept, index) in compo.departments" :key="index" :value="dept.dept_id" :style="{ color: dept.dept_color }">({{ dept.dept_shortname }}) {{ dept.dept_name }} </option>
                          </optgroup>
                      </template>
                  </select>
              </label>

              <!-- Parcours -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Parcours</span>
                  </div>
                  <input type="text" placeholder="(Parcours lors de la mobilité)" class="input input-bordered w-full max-w-lg" v-model="complDossier.parcours"/>
              </label>

              <!-- Années mobilité -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Années de mobilité</span>
                  </div>
                  <select class="select select-bordered" v-model="complDossier.anneesmobilite">
                      <option disabled selected value="">Séléctionnez une paire d'années</option>
                              <option v-for="(annee, index) in anneesmobilite" :key="index" :value="annee">{{ annee }}</option>
                  </select>
              </label>

              <!-- Periode de mobilité -->
              <label class="form-control w-full max-w-lg">
                  <div class="label">
                      <span class="label-text">Periode de mobilité</span>
                  </div>
                  <select class="select select-bordered" v-model="complDossier.periodemobilite">
                      <option disabled selected value="">Séléctionnez une periode de mobilité</option>
                              <option value="1">🍂 Mobilité d'automne</option>
                              <option value="2">🌱 Mobilité de printemps</option>
                  </select>
              </label>

              <!-- Aménagement -->
              <div class="form-control w-full max-w-lg">
                  <label class="label cursor-pointer">
                      <span class="label-text">Avez-vous des aménagements aux examens ?</span> 
                      <input type="checkbox" class="checkbox" v-model="complDossier.amenagement"/>
                  </label>
              </div>
              <label class="form-control w-full max-w-lg" v-if="complDossier.amenagement">
                  <div class="label">
                      <span class="label-text">Description (facultatif)</span>
                  </div>
                  <input type="text" placeholder="Description de l'aménagement" class="input input-bordered w-full max-w-lg" v-model="complDossier.amenagementdesc"/>
              </label>

              <!-- Consentement image -->
              <div class="form-control  w-full max-w-lg">
                  <label class="label cursor-pointer">
                      <span class="label-text">Consentez-vous à l'utilisation de votre image selon notre politique de confidentialité et de protection des données ?</span> 
                      <input type="checkbox" class="checkbox" v-model="complDossier.consent"/>
                  </label>
              </div>

              <!-- Annuaire des anciens -->
              <div class="form-control max-w-lg">
                  <label class="label cursor-pointer">
                      <span class="label-text">Acceptez-vous d’apparaître dans l’annuaire des anciens étudiants conformément à notre politique de confidentialité ?</span> 
                      <input type="checkbox" class="checkbox" v-model="complDossier.consentancien"/>
                  </label>
              </div>
              <div class="flex items-center justify-center mt-10">
                  <button class="btn btn-primary" type="button" @click="openConfirmModal">Valider</button>
              </div>
          </form>
  
      <!-- Modal de confirmation -->
      <dialog id="confirmModal" ref="confirmModal" class="modal">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Confirmer les informations</h3>
            <div class="py-3">
                <p>Numéro étudiant : <strong>{{ complDossier.ine ? complDossier.ine : 'Aucun' }}</strong></p>
                <p v-if="complDossier.department && complDossier.department != ''">
                    Département : 
                    <strong> 
                    <span  :style="{ backgroundColor: getDeptColor(complDossier.department) }" class="badge p-3">
                        {{ getDeptShortname(complDossier.department) }} 
                    </span>
                     {{ getDeptName(complDossier.department) }}</strong>
                </p>
                <p v-else>Département : <strong>Aucun</strong></p>
                <p>Années de mobilité : <strong>{{ complDossier.anneesmobilite ? complDossier.anneesmobilite : 'Aucune' }}</strong></p>
                <p>Periode de mobilité : <strong>{{ complDossier.periodemobilite ? complDossier.periodemobilite : 'Aucune' }}</strong></p>
                <p>Parcours : <strong>{{ complDossier.parcours ? complDossier.parcours : 'Aucun' }}</strong></p>
                <p>Email : <strong>{{ complDossier.email ? complDossier.email : 'Aucun' }}</strong></p>
                <p>Aménagements : <strong>{{ complDossier.amenagement ? 'Oui' : 'Non' }}</strong></p>
                <p>Consentement utilisation image : <strong>{{ complDossier.consent ? 'Oui' : 'Non' }}</strong></p>
                <p>Consentement liste anciens étudiants : <strong>{{ complDossier.consentancien ? 'Oui' : 'Non' }}</strong></p>
            </div>
          <div class="modal-action">
            <button class="btn btn-error" @click="closeModal">Annuler</button>
            <button class="btn btn-success" @click="confirmCompl">Confirmer</button>
          </div>
        </div>
      </dialog>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { request } from '../composables/httpRequest'
  import config from '../config'
  import { addAlert } from '../composables/addAlert'
  import { useAccountStore } from '../stores/accountStore'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const accountStore = useAccountStore()
  const components = ref([])
  const response = ref([])
  const anneesmobilite = ref([]);
  const complDossier = ref({
    ine: '',
    parcours: '',
    department: '',
    email: '',
    anneesmobilite: '',
    periodemobilite: '',
    amenagement: false,
    consent: false,
    consentancien: true,
    amenagementdesc: ''
  })
  
  
  async function confirmCompl() {
    if (!complDossier.value.ine || complDossier.value.ine === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner le numéro étudiant (INE).' } })
      closeModal()
      return
    } else if (!complDossier.value.email || complDossier.value.email === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner votre email.' } })
      closeModal()
      return
    } else if (!complDossier.value.department || complDossier.value.department === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner votre département.' } })
      closeModal()
      return
    } else if (!complDossier.value.anneesmobilite || complDossier.value.anneesmobilite === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner vos années de mobilité.' } })
      closeModal()
      return
    } else if (!complDossier.value.periodemobilite || complDossier.value.periodemobilite === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner votre periode de mobilité.' } })
      closeModal()
      return
    } else if (!complDossier.value.consent) {
      addAlert('error', { data: { error: 'Votre consentement au droit à l\'image est obligatoire.', message: 'Veuillez vous renseigner auprès du service ILC en cas de soucis.' } })
      closeModal()
      return
    }
  
    const requestData = {
      acc_id: accountStore.account.acc_id,
      acc_studentnum: complDossier.value.ine,
      dept_id: complDossier.value.department,
      acc_amenagement: complDossier.value.amenagement,
      acc_mail: complDossier.value.email,
      acc_anneemobilite: complDossier.value.anneesmobilite,
      acc_periodemobilite: complDossier.value.periodemobilite,
      acc_parcours: complDossier.value.parcours,
      acc_consent: complDossier.value.consent
    }
  
    if (complDossier.value.amenagement) {
      requestData.acc_amenagementdesc = complDossier.value.amenagementdesc
    }
  
    await request('PUT', false, response, config.apiUrl + 'api/account/compldossier', requestData)
    if (!response.value.response) {
      accountStore.setValidate(true)
      accountStore.setRole(response.value.account.role)
      router.push({ name: 'Dashboard' })
    }
  
    closeModal()
  }
  
  function openConfirmModal() {
  
    const modal = document.getElementById('confirmModal')
    modal.showModal()
  }

  function getDeptShortname(deptId) {
  const department = components.value.components.flatMap(comp => comp.departments).find(dept => dept.dept_id === deptId);
  return department ? department.dept_shortname : null;
}

function getDeptName(deptId) {
  const department = components.value.components.flatMap(comp => comp.departments).find(dept => dept.dept_id === deptId);
  return department ? department.dept_name : null;
}
function getDeptColor(deptId) {
  const department = components.value.components.flatMap(comp => comp.departments).find(dept => dept.dept_id === deptId);
  return department ? department.dept_color : null;
}
  
  function closeModal() {
    const modal = document.getElementById('confirmModal')
    modal.close()
  }
  
  async function fetch() {
    await request('GET', false, components, config.apiUrl + 'api/component')
    const currentYear = new Date().getFullYear();
  
    for (let i = 0; i < 3; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      anneesmobilite.value.push(`${startYear}-${endYear}`);
    }
    resetInput()
  }
  
  function resetInput() {
    complDossier.value.ine = ''
    complDossier.value.parcours = ''
    complDossier.value.amenagement = false
    complDossier.value.consent = false
    complDossier.value.anneesmobilite = ''
    complDossier.value.periodemobilite = ''
    complDossier.value.department = document.querySelector('.select').options[0].value
  }
  
  onMounted(fetch)
  </script>
  