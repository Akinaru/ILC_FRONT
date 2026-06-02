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
        <li class="step">Archivé</li>
      </ul>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="confirmCompl" class="m-5 md:w-4/6 w-full flex items-center justify-center flex-col mt-10">
      <p>Formulaire</p>

      <!-- Numéro étudiant -->
      <label class="form-control w-full max-w-lg" for="ine">
        <div class="label">
          <span class="label-text">Numéro étudiant (INE)</span>
        </div>
        <input
          id="ine"
          name="ine"
          type="text"
          placeholder="XXXXXXXX"
          class="input input-bordered w-full max-w-lg"
          v-model="complDossier.ine"
          required
        />
      </label>

      <!-- Email -->
      <label class="form-control w-full max-w-lg" for="email">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ex: maxime.gallotta@etu.univ-smb.fr"
          class="input input-bordered w-full max-w-lg"
          v-model="complDossier.email"
          required
        />
      </label>

      <!-- Département -->
      <label class="form-control w-full max-w-lg" for="department">
        <div class="label">
          <span class="label-text">Département</span>
        </div>
        <select
          id="department"
          name="department"
          class="select select-bordered"
          v-model="complDossier.department"
          required
        >
          <option disabled selected value="">Séléctionnez un département</option>
          <template v-for="(compo, index) in components.components" :key="index">
            <optgroup :label="compo.comp_name">
              <option
                v-for="(dept, index) in compo.departments"
                :key="index"
                :value="dept.dept_id"
                :style="{ color: dept.dept_color }"
              >
                ({{ dept.dept_shortname }}) {{ dept.dept_name }}
              </option>
            </optgroup>
          </template>
        </select>
      </label>

      <!-- Parcours -->
      <label class="form-control w-full max-w-lg" for="parcours">
        <div class="label">
          <span class="label-text">Parcours</span>
        </div>
        <input
          id="parcours"
          name="parcours"
          type="text"
          placeholder="(Parcours lors de la mobilité)"
          class="input input-bordered w-full max-w-lg"
          v-model="complDossier.parcours"
        />
      </label>

      <!-- Années mobilité -->
      <label class="form-control w-full max-w-lg" for="anneesmobilite">
        <div class="label flex flex-col items-start sm:flex-row sm:items-center gap-1 text-left">
          <span class="label-text">Années de mobilité</span>
          <span class="label-text text-xs">L'année universitaire de votre semestre à l'étranger.</span>
        </div>

        <select
          id="anneesmobilite"
          name="anneesmobilite"
          class="select select-bordered"
          v-model="complDossier.anneesmobilite"
          required
        >
          <option disabled selected value="">Séléctionnez une paire d'années</option>
          <option v-for="(annee, index) in anneesmobilite" :key="index" :value="annee">{{ annee }}</option>
        </select>
      </label>

      <!-- Periode de mobilité -->
      <label class="form-control w-full max-w-lg" for="periodemobilite">
        <div class="label">
          <span class="label-text">Début de la periode de mobilité</span>
        </div>
        <select
          id="periodemobilite"
          name="periodemobilite"
          class="select select-bordered"
          v-model="complDossier.periodemobilite"
          required
        >
          <option disabled selected value="">Séléctionnez le début de votre periode de mobilité</option>
          <option value="1">🍂 Mobilité d'automne (semestre 5)</option>
          <option value="2">🌱 Mobilité de printemps (semestre 4 ou 6)</option>
        </select>
      </label>

      <!-- Consentement image -->
      <div class="form-control w-full max-w-lg">
        <label class="label cursor-pointer" for="consent">
          <span class="label-text">Consentez-vous à l'utilisation de votre image selon notre politique de confidentialité et de protection des données ?</span>
          <input
            id="consent"
            name="consent"
            type="checkbox"
            class="checkbox"
            v-model="complDossier.consent"
            required
          />
        </label>
      </div>

      <p class="text-xs italic">Vos données personnelles sont coservées uniquement pendant votre scolarité à l'IUT.</p>

      <div class="flex items-center justify-center mt-10">
        <button class="btn btn-primary" type="button" @click="openConfirmModal">Valider</button>
      </div>
    </form>

    <!-- Modal de confirmation -->
    <Teleport to="body">
      <dialog id="confirmModal" ref="confirmModal" class="modal">
        <div class="modal-box rounded-2xl border border-base-300 shadow-xl">
          <h3 class="text-xl font-bold">Confirmer les informations</h3>
          <p class="text-sm text-base-content/70 mt-1">Merci de vérifier les informations suivantes avant validation définitive.</p>
          <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent my-4"></div>

          <div class="space-y-4">
            <!-- Étudiant -->
            <div class="bg-base-200 p-3 rounded-md">
              <h4 class="font-semibold text-md mb-2">Étudiant</h4>
              <div class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between"><span>Numéro étudiant :</span><strong>{{ complDossier.ine || 'Aucun' }}</strong></div>
                <div class="flex justify-between"><span>Email :</span><strong>{{ complDossier.email || 'Aucun' }}</strong></div>
                <div class="flex justify-between"><span>Parcours :</span><strong>{{ complDossier.parcours || 'Aucun' }}</strong></div>
              </div>
            </div>

            <!-- Mobilité -->
            <div class="bg-base-200 p-3 rounded-md">
              <h4 class="font-semibold text-md mb-2">Mobilité</h4>
              <div class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between"><span>Années :</span><strong>{{ complDossier.anneesmobilite || 'Aucune' }}</strong></div>
                <div class="flex justify-between">
                  <span>Début de mobilité :</span>
                  <strong>
                    {{
                      complDossier.periodemobilite === '1'
                        ? "🍂 Mobilité d'automne (semestre 5)"
                        : complDossier.periodemobilite === '2'
                        ? "🌱 Mobilité de printemps (semestre 4 ou 6)"
                        : "Aucune"
                    }}
                  </strong>
                </div>

              </div>
            </div>

            <!-- Département -->
            <div class="bg-base-200 p-3 rounded-md">
              <h4 class="font-semibold text-md mb-2">Département</h4>
              <div class="flex items-center justify-between text-sm">
                <span class="text-base-content/80">Département associé :</span>
                <template v-if="complDossier.department">
                  <span class="flex items-center gap-2">
                    <span class="badge p-2" :style="{ backgroundColor: getDeptColor(complDossier.department) }">
                      {{ getDeptShortname(complDossier.department) }}
                    </span>
                    <strong>{{ getDeptName(complDossier.department) }}</strong>
                  </span>
                </template>
                <template v-else>
                  <strong>Aucun</strong>
                </template>
              </div>
            </div>

            <!-- Consentements -->
            <div class="bg-base-200 p-3 rounded-md">
              <h4 class="font-semibold text-md mb-2">Consentements & Aménagements</h4>
              <div class="flex flex-col gap-1 text-sm">
                <div class="flex justify-between"><span>Utilisation d’image :</span><strong>{{ complDossier.consent ? 'Oui' : 'Non' }}</strong></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-action mt-6">
            <button class="btn" @click="closeModal">Annuler</button>
            <button class="btn btn-primary" @click="confirmCompl">Confirmer</button>
          </div>
        </div>
      </dialog>
    </Teleport>
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
    consent: false,
  })
  
  
  async function confirmCompl() {
    if (!complDossier.value.ine || complDossier.value.ine === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner le numéro étudiant (INE).' } })
      closeModal();
      return
    } else if (!complDossier.value.email || complDossier.value.email === '') {
      addAlert('error', { data: { error: 'Veuillez renseigner votre email.' } })
      closeModal()
      return
    } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(complDossier.value.email)) {
      addAlert('error', { data: { error: 'Le format de l’email est invalide.' } })
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
      addAlert('error', { data: { error: 'Veuillez renseigner votre début de periode de mobilité.' } })
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
      acc_mail: complDossier.value.email,
      acc_anneemobilite: complDossier.value.anneesmobilite,
      acc_periodemobilite: complDossier.value.periodemobilite,
      acc_parcours: complDossier.value.parcours,
      acc_consent: complDossier.value.consent
    }
  
    await request('PUT', false, response, config.apiUrl + 'api/account/compldossier', requestData)
    if (!response.value.response) {
      accountStore.setAccount(response.value.account);
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
    complDossier.value.consent = false
    complDossier.value.anneesmobilite = ''
    complDossier.value.periodemobilite = ''
    complDossier.value.department = document.querySelector('.select').options[0].value
  }
  
  onMounted(fetch)
</script>