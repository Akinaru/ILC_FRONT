<template>
  <div class="flex flex-col" v-if="isLoaded">
    <div class="flex items-center justify-center">
      <!-- Titre de section Bienvenue -->
      <div class="w-full max-w-6xl pb-6 pt-8">
        <div class="relative">
          <!-- Fond décoratif avec gradient subtil -->
          <div class="absolute -left-6 -top-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>

          <!-- Conteneur principal -->
          <div class="relative z-10">
            <!-- Badge catégorie -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              PROFIL ÉTUDIANT
            </div>

            <!-- Titre principal -->
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">Bienvenue sur votre espace</h2>

            <!-- Texte descriptif -->
            <div class="max-w-lg space-y-2">
              <p class="text-base-content/60 text-sm">
                Retrouvez ici toutes vos informations liées aux <span class="text-primary font-medium">relations internationales</span>, à vos vœux, documents, mobilités, et plus encore.
              </p>
              <p class="text-sm text-base-content/70">
                Besoin d’aide ? <RouterLink :to="{ name: 'Aide' }" class="link text-primary">Consultez notre guide étudiant</RouterLink>
              </p>
            </div>

            <!-- Séparateur -->
            <div class="w-full h-px bg-gradient-to-r from-primary/30 via-primary/20 to-transparent mt-4"></div>
          </div>
        </div>
      </div>
    </div>


    <!-- Etapes -->
    <div class="w-full flex items-center justify-center flex-col py-4 md:py-10">
      <p class="py-4">Avancement des étapes actuelles:</p>
      <ul class="steps steps-vertical sm:steps-horizontal max-w-lg">
        <li class="step step-primary">Inscription</li>
        <li class="step step-primary">Choix des vœux</li>
        <li
          class="step"
          :class="{
            'step-primary':
              destination.agree_id || joursRestants(accountStore.account.datelimite) < 0,
          }"
        >
          Arbitrage
        </li>
        <li class="step" :class="{ 'step-primary': destination.agree_id }">
          Validation
        </li>
      </ul>
    </div>

    <!-- Destination finale -->
    <div
      v-if="destination.agreement"
      class="flex items-center justify-center flex-col bg-base-100 rounded-lg shadow-md py-6 mb-8 mt-4 max-w-6xl mx-auto w-full"
    >
      <div class="flex items-center justify-between w-full mb-4">
        <h2 class="text-lg font-bold text-primary">Destination finale</h2>
        <div v-if="destination.status" class="badge badge-warning">
          En attente de validation
        </div>
        <div v-else class="badge badge-success">Validée</div>
      </div>

      <div class="select-none flex flex-col justify-between items-center w-full transition-all duration-200 ease-in-out">
        <RouterLink
          :to="{
            name: 'Accord',
            params: { agree_id: destination.agreement.agree_id },
          }"
          class="group hover:opacity-80 relative w-full"
        >
          <div
            :class="[
              'border-2 rounded-lg p-4 flex items-center w-full select-none bg-base-200 shadow-sm hover:shadow-md transition-all duration-200',
              destination.status ? 'border-warning' : 'border-success',
            ]"
          >
            <div class="flex items-center space-x-4">
              <span
                class="tooltip tooltip-right"
                :data-tip="destination.agreement.partnercountry.parco_name"
              >
                <span
                  class="fi text-3xl md:text-5xl"
                  :class="
                    'fi-' + destination.agreement.partnercountry.parco_code
                  "
                ></span>
              </span>
              <div class="flex flex-col">
                <span class="text-sm text-base-content/70">{{
                  destination.agreement.partnercountry.parco_name
                }}</span>
                <span class="font-bold text-lg"
                  >{{ destination.agreement.university.univ_city }} -
                  {{ destination.agreement.university.univ_name }}</span
                >
                <span class="text-sm badge badge-neutral mt-1">{{
                  destination.agreement.isced.isc_code
                }}</span>
              </div>
            </div>

            <div class="ml-auto">
              <button class="btn btn-circle btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </RouterLink>
        <p v-if="destination.status" class="text-sm italic mt-2 text-warning">
          Cette destination n'est pas définitive et pourra être modifiée avant
          la validation finale.
        </p>
      </div>
    </div>

    <!-- Partie Informations -->
    <div
      v-if="account && account.acc_id"
      class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto mb-12"
    >
      <!-- Informations personnelles -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-primary border-b pb-2 mb-4">
            Vos informations
          </h2>
          <p class="text-sm mb-6">
            Certaines de vos informations ne peuvent pas être modifiées.
            Renseignez-vous auprès d'ILC si besoin.
          </p>

          <div class="space-y-4">
            <!-- Fullname -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Identité</span>
              </label>
              <input
                type="text"
                :value="account.acc_fullname"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Email</span>
              </label>
              <input
                type="text"
                :value="account.acc_mail"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Numéro étudiant -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Numéro étudiant</span>
              </label>
              <input
                type="text"
                :value="account.acc_studentnum"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Choix Cours -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Choix cours</span>
              </label>
              <input
                type="text"
                :value="
                  account.acc_validechoixcours
                    ? 'Validé ✅'
                    : 'Pas encore validé ❌'
                "
                class="input input-bordered bg-base-200"
                :class="
                  account.acc_validechoixcours ? 'text-success' : 'text-error'
                "
                disabled
              />
            </div>

            <!-- Département -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Département</span>
              </label>
              <input
                type="text"
                :value="
                  account.department
                    ? account.department.dept_shortname
                    : 'Aucun'
                "
                class="input input-bordered bg-base-200"
                :style="{
                  borderBottom:
                    '2px solid ' +
                    (account.department && account.department.dept_color
                      ? account.department.dept_color
                      : 'grey'),
                }"
                disabled
              />
            </div>

            <!-- Parcours -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium"
                  >Parcours de BUT envisagé</span
                >
              </label>
              <input
                type="text"
                :value="account.acc_parcours"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Score toeic -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Score TOEIC</span>
              </label>
              <input
                type="text"
                :value="account.acc_toeic"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Années mobilite -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Année de mobilité</span>
              </label>
              <input
                type="text"
                :value="account.acc_anneemobilite"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

            <!-- Periode de mobilite -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Periode de mobilité</span>
              </label>
              <input
                type="text"
                :value="account.acc_periodemobilite === 1 ? '🍂 Mobilité d\'automne' : 
                        account.acc_periodemobilite === 2 ? '🌱 Mobilité de printemps' : 'Aucune'"
                class="input input-bordered bg-base-200"
                disabled
              />
            </div>

          </div>

          <label
            for="modal_modif"
            class="btn btn-primary w-full mt-6"
            @click="modifEtu(account)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Modifier
          </label>
        </div>
      </div>

      <!-- Documents -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-primary border-b pb-2 mb-4">
            Vos documents
          </h2>

          <!-- Choix de cours -->
          <div class="mb-6">
            <h3 class="font-medium text-base-content mb-2">Choix de cours</h3>
            <div class="space-y-2">
              <button
                v-if="files.choixCours.exist"
                @click="openFileInNewTab(files.choixCours.path)"
                class="btn btn-outline btn-success btn-block justify-start"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  class="mr-2"
                >
                  <path
                    d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <polyline
                    points="7.9 12.3 12 16.3 16.1 12.3"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    x2="12"
                    y1="2.7"
                    y2="14.2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Télécharger le fichier
              </button>
              <button v-else class="btn btn-disabled btn-block justify-start">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2"
                >
                  <path
                    d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <polyline
                    points="7.9 12.3 12 16.3 16.1 12.3"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    x2="12"
                    y1="2.7"
                    y2="14.2"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Aucun fichier disponible
              </button>

              <div class="form-control">
                <input
                  accept=".pdf, .xls, .xlsx"
                  @change="handleFileInputChange($event, 'choixCours')"
                  type="file"
                  class="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              <button
                v-if="files.choixCours.file != null"
                @click="
                  saveFile(
                    'choix_cours_' + accountStore.account.acc_id,
                    'documents/etu/choix_cours',
                    files.choixCours.file
                  )
                "
                class="btn btn-primary btn-block justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 10V3l9 9-9 9v-7H3V10h10z"
                  />
                </svg>
                Envoyer votre fichier
              </button>

              <div v-if="myfiles.choixCours.exist" class="flex flex-col gap-2">
                <button
                  class="btn btn-outline btn-warning btn-block justify-start"
                  @click="openMyFileInNewTab(myfiles.choixCours.path)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z"
                    />
                  </svg>
                  Voir votre fichier
                </button>

                <button
                  class="btn btn-outline btn-error btn-block justify-start"
                  @click="openConfirmModal('choix_cours', 'choixCours')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Supprimer votre fichier
                </button>
              </div>
            </div>
          </div>

          <!-- Contrat pédagogique -->
          <div class="mb-6">
            <h3 class="font-medium text-base-content mb-2">
              Contrat pédagogique
            </h3>
            <div class="space-y-2">
              <button
                v-if="files.contratPeda.exist"
                @click="openFileInNewTab(files.contratPeda.path)"
                class="btn btn-outline btn-success btn-block justify-start"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  class="mr-2"
                >
                  <path
                    d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <polyline
                    points="7.9 12.3 12 16.3 16.1 12.3"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    x2="12"
                    y1="2.7"
                    y2="14.2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Télécharger le fichier
              </button>
              <button v-else class="btn btn-disabled btn-block justify-start">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  class="mr-2"
                >
                  <path
                    d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <polyline
                    points="7.9 12.3 12 16.3 16.1 12.3"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <line
                    x1="12"
                    x2="12"
                    y1="2.7"
                    y2="14.2"
                    fill="none"
                    stroke="#777777"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                Aucun fichier disponible
              </button>

              <div class="form-control">
                <input
                  accept=".pdf, .xls, .xlsx"
                  @change="handleFileInputChange($event, 'contratPeda')"
                  type="file"
                  class="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              <button
                v-if="files.contratPeda.file != null"
                @click="
                  saveFile(
                    'contrat_peda_' + accountStore.account.acc_id,
                    'documents/etu/contrat_peda',
                    files.contratPeda.file
                  )
                "
                class="btn btn-primary btn-block justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 10V3l9 9-9 9v-7H3V10h10z"
                  />
                </svg>
                Envoyer votre fichier
              </button>

              <div v-if="myfiles.contratPeda.exist" class="flex flex-col gap-2">
                <button
                  class="btn btn-outline btn-warning btn-block justify-start"
                  @click="openMyFileInNewTab(myfiles.contratPeda.path)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z"
                    />
                  </svg>
                  Voir votre fichier
                </button>

                <button
                  class="btn btn-outline btn-error btn-block justify-start"
                  @click="openConfirmModal('contrat_peda', 'contratPeda')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Supprimer votre fichier
                </button>
              </div>
            </div>
          </div>

          <!-- Relevé de notes -->
          <div>
            <h3 class="font-medium text-base-content mb-2">
              Relevé des notes de la mobilité
            </h3>
            <div class="space-y-2">
              <div class="form-control">
                <input
                  accept=".pdf, .xls, .xlsx"
                  @change="handleFileInputChange($event, 'releveNote')"
                  type="file"
                  class="file-input file-input-bordered file-input-primary w-full"
                />
              </div>

              <button
                v-if="files.releveNote.file != null"
                @click="
                  saveFile(
                    'releve_note_' + accountStore.account.acc_id,
                    'documents/etu/releve_note',
                    files.releveNote.file
                  )
                "
                class="btn btn-primary btn-block justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13 10V3l9 9-9 9v-7H3V10h10z"
                  />
                </svg>
                Envoyer votre fichier
              </button>

              <div v-if="myfiles.releveNote.exist" class="flex flex-col gap-2">
                <button
                  class="btn btn-outline btn-warning btn-block justify-start"
                  @click="openMyFileInNewTab(myfiles.releveNote.path)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.02.079-.046.155-.07.232C20.268 16.057 16.478 19 12 19c-4.478 0-8.268-2.943-9.542-7 .024-.077.05-.153.07-.232z"
                    />
                  </svg>
                  Voir votre fichier
                </button>

                <button
                  class="btn btn-outline btn-error btn-block justify-start"
                  @click="openConfirmModal('releve_note', 'releveNote')"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Supprimer votre fichier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal modification -->
    <input type="checkbox" id="modal_modif" class="modal-toggle" />
    <div class="modal modal-bottom sm:modal-middle" role="dialog">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Modification de vos informations</h3>
        <form @submit.prevent="confirmModifEtu" class="w-full space-y-4">
          <!-- Mail -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <input
              type="text"
              placeholder="ex: maxime.gallotta@etu.univ-smb.fr"
              class="input input-bordered w-full"
              v-model="currentUnivEtu.acc_mail"
            />
          </div>

          <!-- Numéro étudiant -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Numéro étudiant (INE)</span>
            </label>
            <input
              type="text"
              placeholder="XXXXXXXX"
              class="input input-bordered w-full"
              v-model="currentUnivEtu.acc_studentnum"
            />
          </div>

          <!-- Parcours  -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium"
                >Parcours de BUT envisagé</span
              >
            </label>
            <input
              type="text"
              placeholder="(Parcours lors de la mobilité)"
              class="input input-bordered w-full"
              v-model="currentUnivEtu.acc_parcours"
            />
          </div>

          <div class="modal-action">
            <label for="modal_modif" class="btn btn-ghost">Annuler</label>
            <button type="submit">
              <label for="modal_modif" class="btn btn-success"
                >Enregistrer</label
              >
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation suppression de document -->
    <dialog id="confirmModalDoc" ref="confirmModalDoc" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold mb-4">Confirmer la suppression ?</h3>
        <div class="py-3">
          <p>
            Confirmez-vous la suppression du fichier:
            <strong>{{ confirmDeleteDocument.title }}</strong>
          </p>
        </div>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="closeModal">Annuler</button>
          <button
            class="btn btn-error"
            @click="
              deleteFile(
                confirmDeleteDocument.folder,
                confirmDeleteDocument.title,
                confirmDeleteDocument.type
              )
            "
          >
            Confirmer
          </button>
        </div>
      </div>
    </dialog>
    <!-- Modif voeux si temps pas écoulé -->
    <div
      v-if="joursRestants(accountStore.account.datelimite) >= 0"
      class="px-5 xl:px-20 transition-all duration-100 ease-in-out"
    >
      <!-- Partie voeux -->
      <div class="hidden md:block pt-8">
          <!-- Section d'en-tête avec informations -->
          <div class="bg-base-100 rounded-lg shadow-md p-6 mb-8 max-w-6xl mx-auto">
              <div class="flex flex-col items-center gap-2">
                  <div class="stats shadow">
                      <div class="stat place-items-center">
                          <div class="stat-title">Favoris</div>
                          <div class="stat-value">{{ localFavoris.length }}</div>
                      </div>
                      <div class="stat place-items-center">
                          <div class="stat-title">Vœux</div>
                          <div class="stat-value">{{ nbVoeuLocal() }}</div>
                      </div>
                  </div>
                  <p class="text-center mt-2">Ajoutez des accords aux favoris pour ensuite les choisir comme vœux.</p>
                  <div class="alert shadow-lg mt-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <div>
                          <p>Date limite: <span class="font-bold">{{ formatDate(accountStore.account.datelimite) }}</span></p>
                          <p class="text-sm">{{ joursRestants(accountStore.account.datelimite) }} jour{{ joursRestants(accountStore.account.datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(accountStore.account.datelimite) > 1 ? 's' : '' }}</p>
                      </div>
                  </div>
              </div>
          </div>
          
          <div class="flex justify-center gap-6 py-4">
              <!-- Partie de gauche avec liste des favoris -->
              <div class="flex flex-col w-1/2">
                  <div class="flex items-center justify-between mb-4">
                      <h2 class="text-2xl font-bold flex items-center gap-2">
                          <span>Vos favoris</span>
                          <svg class="text-warning" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path fill="currentColor" stroke="currentColor" stroke-width="2" d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"/>
                          </svg>
                      </h2>
                      <span class="badge badge-lg">{{ localFavoris.length }}</span>
                  </div>
                  
                  <div id="left" class="bg-base-200 rounded-lg shadow-md p-4 w-full">
                      <!-- Liste des favoris -->
                      <div v-if="localFavoris.length > 0" class="space-y-2">
                          <div v-for="(accord, index) in localFavoris" :key="index" :draggable="true" :id="'accord_wish_'+accord.agree_id" class="elementDrag h-20 select-none flex justify-between items-center hover:cursor-move hover:shadow-md transition-all duration-200 ease-in-out">
                              <div class="bg-base-100 flex items-center justify-center w-full h-20 select-none rounded-lg border border-base-300">
                                  <span class="relative inline-block mx-3">
                                      <!-- Drapeau -->
                                      <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (accord.partnercountry?.parco_code)"></span>

                                      <!-- Point d'interrogation si pas de drapeau -->
                                      <span v-if="!accord.partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none rounded-full">
                                          ?
                                      </span>
                                  </span>

                                  <div class="w-full flex items-center">
                                      <div class="flex flex-col w-full select-none text-xs xl:text-sm">
                                          <span class="text-xs opacity-75">{{ accord.partnercountry?.parco_name || 'Pays indisponible' }}</span>
                                          <span class="font-bold">{{accord.university?.univ_city || 'Ville indisponible'}} - {{ accord.university?.univ_name || 'Université indisponible' }}</span>
                                          <span class="badge badge-sm badge-neutral mt-1">{{ accord.isced?.isc_code || 'Code ISCED indisponible' }}</span>
                                      </div>
                                      
                                      <!-- Ouvrir le profil -->
                                      <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: accord.agree_id}}" class="tooltip" data-tip="Afficher l'accord">
                                          <button class="btn btn-ghost btn-sm">
                                              <svg height="20px" width="20px" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor">
                                                  <g>
                                                      <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                      <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                      <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                          237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                  </g>
                                              </svg>
                                          </button>
                                      </RouterLink>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div v-else class="flex items-center justify-center h-40 bg-base-100 rounded-lg border-2 border-dashed border-base-300">
                          <div class="text-center opacity-60">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <p>Aucun favoris dans la liste</p>
                          </div>
                      </div>
                  </div>
              </div>
              
              <!-- Partie de droite avec les voeux -->
              <div class="flex flex-col w-1/2">
                  <div class="flex items-center justify-between mb-4">
                      <h2 class="text-2xl font-bold flex items-center gap-2">
                          <span>Vos vœux</span>
                          <svg class="text-error" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                      </h2>
                      <span class="badge badge-lg">{{ nbVoeuLocal() }}/6</span>
                  </div>
                  
                  <div id="right" class="bg-base-200 rounded-lg shadow-md p-4 w-full space-y-4">
                      <div class="flex items-center w-full" v-for="(i, index) in 6" :key="index">
                          <div class="badge badge-lg badge-primary mr-4">{{ i }}</div>
                          <div :id="'voeu'+i" class="voeuxDrop bg-base-100 h-20 w-full flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out">
                              <div v-if="localVoeux[i]" :draggable="true" :id="'accord_wish_'+localVoeux[i].agree_id" class="select-none flex justify-between items-center elementDrag w-full h-20 hover:cursor-move hover:shadow-md transition-all duration-200 ease-in-out rounded-lg">
                                  <div :class="[
                                      'flex items-center justify-center h-20 select-none w-full rounded-lg',
                                      (destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id)
                                          ? (destination.status ? 'border-2 border-warning bg-warning bg-opacity-10' : 'border-2 border-success bg-success bg-opacity-10')
                                          : 'bg-base-100'
                                  ]">
                                      <span class="relative inline-block mx-3">
                                          <!-- Drapeau -->
                                          <span class="fi text-xl xl:text-5xl transition-all duration-100 ease-in-out" :class="'fi-' + (localVoeux[i].partnercountry?.parco_code)"></span>

                                          <!-- Point d'interrogation si pas de drapeau -->
                                          <span v-if="!localVoeux[i].partnercountry?.parco_code" class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white select-none rounded-full">
                                              ?
                                          </span>
                                      </span>
                                      <div class="flex flex-col w-full select-none text-xs xl:text-sm">
                                          <span class="text-xs opacity-75">{{ localVoeux[i].partnercountry?.parco_name || 'Pays indisponible' }}</span>
                                          <span class="font-bold">{{localVoeux[i].university?.univ_city || 'Ville indisponible'}} - {{ localVoeux[i].university?.univ_name || 'Université indisponible' }}</span>
                                          <span class="badge badge-sm badge-neutral mt-1">{{ localVoeux[i].isced?.isc_code || 'Code ISCED indisponible' }}</span>
                                      </div>
                                  </div>
                                  <div class="flex h-full items-center px-1">
                                      <RouterLink target="_blank" :to="{name: 'Accord', params: {agree_id: localVoeux[i].agree_id}}" class="tooltip flex items-center" data-tip="Afficher l'accord">
                                          <button class="btn btn-ghost btn-sm">
                                              <svg height="20px" width="20px" viewBox="0 0 512 512" xml:space="preserve" fill="currentColor">
                                                  <g>
                                                      <path class="st0" d="M96,0v416h416V0H96z M472,376H136V40h336V376z"/>
                                                      <polygon class="st0" points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"/>
                                                      <polygon class="st0" points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                          237.594,166.688 322.39,166.688 204.531,284.547 	"/>
                                                  </g>
                                              </svg>
                                          </button>
                                      </RouterLink>
                                      <button @click="removeVoeu(localVoeux[i].agree_id, i)" class="btn btn-ghost btn-sm text-error flex items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                          </svg>
                                      </button>
                                  </div>
                              </div>
                              <div v-else class="flex items-center justify-center h-full w-full opacity-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                  <p>Glissez un favori ici</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Partie voeux téléphone -->
      <div class="md:hidden block pt-6">
        <!-- Section d'en-tête avec informations pour mobile -->
        <div class="bg-base-100 rounded-lg shadow-md p-4 mb-4 mx-2">
            <!-- Section temps restant - mise en évidence -->
            <div class="flex flex-col items-center border-b border-base-200 pb-3 mb-3">
                <div class="flex items-center justify-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="font-medium">Date limite: <span class="font-bold">{{ formatDate(accountStore.account.datelimite) }}</span></div>
                </div>
                
                <div class="badge badge-lg font-semibold {{ joursRestants(accountStore.account.datelimite) < 3 ? 'badge-error' : (joursRestants(accountStore.account.datelimite) < 7 ? 'badge-warning' : 'badge-primary') }}">
                    {{ joursRestants(accountStore.account.datelimite) }} jour{{ joursRestants(accountStore.account.datelimite) > 1 ? 's' : '' }} restant{{ joursRestants(accountStore.account.datelimite) > 1 ? 's' : '' }}
                </div>
            </div>
            
            <!-- Section statistiques -->
            <div class="grid grid-cols-2 gap-2 mb-3">
                <div class="flex flex-col items-center p-2 bg-base-200 rounded-lg">
                    <div class="text-xs opacity-70">Favoris</div>
                    <div class="text-2xl font-bold">{{ localFavoris.length }}</div>
                </div>
                
                <div class="flex flex-col items-center p-2 bg-base-200 rounded-lg">
                    <div class="text-xs opacity-70">Vœux</div>
                    <div class="text-2xl font-bold">{{ nbVoeuLocal() }}<span class="text-sm opacity-50">/6</span></div>
                </div>
            </div>
            
            <!-- Message d'information -->
            <p class="text-center text-xs opacity-70">Ajoutez des accords aux favoris pour ensuite les choisir comme vœux.</p>
        </div>

        <!-- Liste des accords en favoris -->
        <div class="bg-base-100 rounded-lg shadow-md mx-2 mb-6">
          <div
            class="flex items-center justify-between bg-primary text-primary-content p-3 rounded-t-lg"
          >
            <h2 class="font-bold text-lg flex items-center gap-2">
                <svg
                  class="text-warning"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="2"
                    d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"
                  />
                </svg>
              <span>Favoris</span>
            </h2>
            <span class="badge badge-lg">{{
              localFavoris.length
            }}</span>
          </div>

          <div class="p-2">
            <button
              @click="toggleCollapse('favoris')"
              class="w-full flex justify-between items-center bg-base-200 p-3 rounded-md hover:bg-base-300 transition-colors duration-200"
            >
              <span class="font-medium"
                >Liste des accords ({{ localFavoris.length }})</span
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="[
                  isOpen.favoris ? 'rotate-180' : '',
                  'transform transition-transform duration-200',
                ]"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <div
              class="mt-2 space-y-2 overflow-hidden transition-all duration-200 ease-in-out"
              v-show="isOpen.favoris"
            >
              <!-- Liste des favoris -->
              <div
                v-if="localFavoris.length > 0"
                v-for="(accord, index) in localFavoris"
                :key="index"
                :draggable="true"
                :id="'accord_wish_' + accord.agree_id"
                class="elementDrag select-none flex items-center w-full rounded-md bg-base-200 hover:bg-base-300 transition-all duration-200 ease-in-out hover:cursor-move hover:shadow-md"
              >
                <div class="h-18 w-full flex items-center p-2">
                  <span class="relative flex-shrink-0 mr-2">
                    <!-- Drapeau -->
                    <span
                      class="fi text-2xl"
                      :class="'fi-' + (accord.partnercountry?.parco_code || '')"
                    ></span>

                    <!-- Point d'interrogation si pas de drapeau -->
                    <span
                      v-if="!accord.partnercountry?.parco_code"
                      class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white select-none rounded-full"
                    >
                      ?
                    </span>
                  </span>

                  <div class="w-full flex flex-col">
                    <span class="text-xs opacity-75">{{
                      accord.partnercountry?.parco_name || "Pays indisponible"
                    }}</span>
                    <span class="font-bold text-xs"
                      >{{
                        accord.university?.univ_city || "Ville indisponible"
                      }}
                      -
                      {{
                        accord.university?.univ_name ||
                        "Université indisponible"
                      }}</span
                    >
                    <span class="badge badge-xs badge-neutral mt-1">{{
                      accord.isced?.isc_code || "Code ISCED indisponible"
                    }}</span>
                  </div>

                  <RouterLink
                    target="_blank"
                    :to="{
                      name: 'Accord',
                      params: { agree_id: accord.agree_id },
                    }"
                    class="tooltip tooltip-left"
                    data-tip="Afficher l'accord"
                  >
                    <button class="btn btn-ghost btn-xs">
                      <svg
                        height="16px"
                        width="16px"
                        viewBox="0 0 512 512"
                        xml:space="preserve"
                        fill="currentColor"
                      >
                        <g>
                          <path
                            class="st0"
                            d="M96,0v416h416V0H96z M472,376H136V40h336V376z"
                          />
                          <polygon
                            class="st0"
                            points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"
                          />
                          <polygon
                            class="st0"
                            points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                    237.594,166.688 322.39,166.688 204.531,284.547 	"
                          />
                        </g>
                      </svg>
                    </button>
                  </RouterLink>
                </div>
              </div>

              <div
                v-else
                class="flex items-center justify-center bg-base-200 p-4 rounded-md"
              >
                <div class="text-center opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <p>Aucun favori dans la liste</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section des vœux -->
        <div class="mx-2 mb-6">
          <div
            class="flex items-center justify-between bg-primary text-primary-content p-3 rounded-t-lg"
          >
            <h2 class="font-bold text-lg flex items-center gap-2">
                <svg
                  class="text-error"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              <span>Vos vœux</span>
            </h2>
            <span class="badge badge-lg"
              >{{ nbVoeuLocal() }}/6</span
            >
          </div>

          <div class="bg-base-100 p-3 rounded-b-lg shadow-md space-y-3">
            <div v-for="(i, index) in 6" :key="index" class="flex flex-col">
              <div class="flex items-center mb-1">
                <div class="badge badge-lg badge-primary mr-2">{{ i }}</div>
                <span class="text-sm font-medium">Vœu n°{{ i }}</span>
              </div>

              <div :id="'voeu' + i" class="voeuxDrop w-full">
                <!-- Si un accord est présent -->
                <div
                  v-if="localVoeux[i]"
                  :draggable="true"
                  :id="'accord_wish_' + localVoeux[i].agree_id"
                  class="elementDrag select-none flex justify-between items-center rounded-md overflow-hidden transition-all duration-200 ease-in-out hover:shadow-md bg-base-200"
                >
                  <div
                    :class="[
                      'flex items-center w-full rounded-l-md p-2',
                      destination.agreement &&
                      destination.agreement.agree_id == localVoeux[i].agree_id
                        ? destination.status
                          ? 'bg-warning bg-opacity-20 border-l-4 border-warning'
                          : 'bg-success bg-opacity-20 border-l-4 border-success'
                        : 'bg-base-200',
                    ]"
                  >
                    <span class="relative flex-shrink-0 mr-2">
                      <!-- Drapeau -->
                      <span
                        class="fi text-2xl"
                        :class="
                          'fi-' +
                          (localVoeux[i].partnercountry?.parco_code || '')
                        "
                      ></span>

                      <!-- Point d'interrogation si pas de drapeau -->
                      <span
                        v-if="!localVoeux[i].partnercountry?.parco_code"
                        class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white select-none rounded-full"
                      >
                        ?
                      </span>
                    </span>

                    <div class="w-full flex flex-col">
                      <span class="text-xs opacity-75">{{
                        localVoeux[i].partnercountry?.parco_name ||
                        "Pays indisponible"
                      }}</span>
                      <span class="font-bold text-xs"
                        >{{
                          localVoeux[i].university?.univ_city ||
                          "Ville indisponible"
                        }}
                        -
                        {{
                          localVoeux[i].university?.univ_name ||
                          "Université indisponible"
                        }}</span
                      >
                      <span class="badge badge-xs badge-neutral mt-1">{{
                        localVoeux[i].isced?.isc_code ||
                        "Code ISCED indisponible"
                      }}</span>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <RouterLink
                      target="_blank"
                      :to="{
                        name: 'Accord',
                        params: { agree_id: localVoeux[i].agree_id },
                      }"
                      class="tooltip tooltip-left"
                      data-tip="Afficher l'accord"
                    >
                      <button
                        class="btn btn-ghost btn-sm h-full rounded-none bg-base-200"
                      >
                        <svg
                          height="16px"
                          width="16px"
                          viewBox="0 0 512 512"
                          xml:space="preserve"
                          fill="currentColor"
                        >
                          <g>
                            <path
                              class="st0"
                              d="M96,0v416h416V0H96z M472,376H136V40h336V376z"
                            />
                            <polygon
                              class="st0"
                              points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"
                            />
                            <polygon
                              class="st0"
                              points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                        237.594,166.688 322.39,166.688 204.531,284.547 	"
                            />
                          </g>
                        </svg>
                      </button>
                    </RouterLink>

                    <button
                      @click="removeVoeu(localVoeux[i].agree_id, i)"
                      class="btn btn-ghost btn-sm text-error h-full rounded-r-md bg-base-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Pas d'accord dans la case -->
                <label
                  for="modal_ajout_accord"
                  @click="changeVoeuLocal(i)"
                  v-else
                  class="flex items-center justify-center bg-base-200 p-4 rounded-md hover:bg-base-300 transition-colors duration-200 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <div class="text-center">
                    <p class="font-medium">Ajouter un accord</p>
                    <p class="text-xs opacity-60">Vœu n°{{ i }}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal pour ajouter un accord -->
        <input type="checkbox" id="modal_ajout_accord" class="modal-toggle" />
        <div class="modal" role="dialog">
          <div class="modal-box max-w-md">
            <h3 class="font-bold text-lg pb-3 flex items-center gap-2">
              <svg
                class="h-5 w-5 text-primary"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
              Choisir un accord pour le vœu n°{{ selectedChangeVoeu }}
            </h3>

            <div class="space-y-2 max-h-60 overflow-y-auto py-2">
              <!-- Liste des favoris -->
              <div
                @click="setAccordToVoeu(accord.agree_id)"
                v-if="localFavoris.length > 0"
                v-for="(accord, index) in localFavoris"
                :key="index"
                class="select-none flex items-center p-2 rounded-md bg-base-200 hover:bg-base-300 transition-all duration-200 ease-in-out cursor-pointer"
              >
                <span class="relative flex-shrink-0 mr-2">
                  <!-- Drapeau -->
                  <span
                    class="fi text-2xl"
                    :class="'fi-' + (accord.partnercountry?.parco_code || '')"
                  ></span>

                  <!-- Point d'interrogation si pas de drapeau -->
                  <span
                    v-if="!accord.partnercountry?.parco_code"
                    class="absolute inset-0 flex items-center justify-center text-black text-xl font-bold bg-white select-none rounded-full"
                  >
                    ?
                  </span>
                </span>

                <div class="w-full flex flex-col">
                  <span class="text-xs opacity-75">{{
                    accord.partnercountry?.parco_name || "Pays indisponible"
                  }}</span>
                  <span class="font-bold text-xs"
                    >{{
                      accord.university?.univ_city || "Ville indisponible"
                    }}
                    -
                    {{
                      accord.university?.univ_name || "Université indisponible"
                    }}</span
                  >
                  <span class="badge badge-xs badge-neutral mt-1">{{
                    accord.isced?.isc_code || "Code ISCED indisponible"
                  }}</span>
                </div>

                <RouterLink
                  target="_blank"
                  :to="{
                    name: 'Accord',
                    params: { agree_id: accord.agree_id },
                  }"
                  class="tooltip tooltip-left"
                  data-tip="Afficher l'accord"
                  @click.stop
                >
                  <button class="btn btn-ghost btn-xs">
                    <svg
                      height="16px"
                      width="16px"
                      viewBox="0 0 512 512"
                      xml:space="preserve"
                      fill="currentColor"
                    >
                      <g>
                        <path
                          class="st0"
                          d="M96,0v416h416V0H96z M472,376H136V40h336V376z"
                        />
                        <polygon
                          class="st0"
                          points="40,472 40,296 40,136 40,96 0,96 0,512 416,512 416,472 376,472 	"
                        />
                        <polygon
                          class="st0"
                          points="232.812,312.829 350.671,194.969 350.671,279.766 390.671,279.766 390.671,126.688 237.594,126.688 
                                                237.594,166.688 322.39,166.688 204.531,284.547 	"
                        />
                      </g>
                    </svg>
                  </button>
                </RouterLink>
              </div>

              <!-- Aucun favoris -->
              <div
                v-if="localFavoris.length === 0"
                class="flex items-center justify-center bg-base-200 p-4 rounded-md"
              >
                <div class="text-center opacity-60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <p>Aucun favori disponible</p>
                  <p class="text-xs mt-1">
                    Ajoutez d'abord des accords à vos favoris
                  </p>
                </div>
              </div>
            </div>

            <div class="modal-action">
              <label for="modal_ajout_accord" class="btn">Annuler</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Affichage des vœux lorsque la date limite est dépassée -->
    <div v-else class="flex flex-col items-center pt-6">
        <!-- En-tête section -->
        <div class="flex items-center justify-center gap-2 mb-4">
            <h2 class="font-bold text-2xl">Vos vœux</h2>
            <svg class="text-error" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        </div>

        <!-- Message d'information -->
         <div class="w-full max-w-6xl p-4">
          <div class="bg-base-200 rounded-lg p-4 mb-6 w-full text-center">
              <div class="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p class="font-medium">Vous ne pouvez plus modifier vos vœux car la date limite a été atteinte.</p>
              </div>
              <p class="text-sm">Si votre destination finale correspond à un de vos vœux, alors la case sera entourée en jaune.</p>
          </div>
        </div>

        <!-- Liste des voeux -->
        <div class="bg-base-100 rounded-lg shadow-md w-full max-w-6xl">
            <div class="divide-y divide-base-200">
                <div v-for="(i, index) in 6" :key="index" class="flex items-center p-3 sm:p-4">
                    <div class="badge badge-lg badge-primary mr-3 sm:mr-4">{{ i }}</div>
                    
                    <div class="flex-1 min-h-20 bg-base-200 rounded-lg overflow-hidden">
                        <!-- Si un vœu existe -->
                        <RouterLink
                            v-if="localVoeux[i]"
                            target="_blank"
                            :to="{name: 'Accord', params: {agree_id: localVoeux[i].agree_id}}"
                            class="block cursor-pointer hover:opacity-90 transition-opacity duration-200"
                        >
                            <div :class="[
                                'flex items-center p-3 h-full',
                                destination.agreement && destination.agreement.agree_id == localVoeux[i].agree_id
                                    ? destination.status
                                        ? 'border-2 border-warning bg-warning bg-opacity-10'
                                        : 'border-2 border-success bg-success bg-opacity-10'
                                    : 'border border-base-300'
                            ]">
                                <span class="flex-shrink-0 mr-3 tooltip" :data-tip="localVoeux[i].partnercountry.parco_name">
                                    <span class="fi text-2xl sm:text-4xl" :class="'fi-' + localVoeux[i].partnercountry.parco_code"></span>
                                </span>
                                
                                <div class="flex flex-col">
                                    <span class="text-xs text-opacity-70">{{ localVoeux[i].partnercountry.parco_name }}</span>
                                    <span class="font-bold text-sm sm:text-base">
                                        {{ localVoeux[i].university.univ_city }} - {{ localVoeux[i].university.univ_name }}
                                    </span>
                                    <span class="badge badge-sm mt-1">{{ localVoeux[i].isced.isc_code }}</span>
                                </div>
                            </div>
                        </RouterLink>
                        
                        <!-- Si aucun vœu n'existe -->
                        <div v-else class="flex items-center justify-center h-20 bg-base-200 opacity-60">
                            <p class="text-sm">Emplacement vide</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Partie témoignage -->
    <div class="w-full flex justify-center my-10">
    <div class="w-full max-w-6xl bg-base-100 rounded-lg shadow-md p-6">
        <div class="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <h2 class="text-xl font-bold">Votre témoignage</h2>
        </div>
        
        <p class="text-sm opacity-75 mb-4">
        Partagez votre expérience à l'étranger avec les autres étudiants. Vos conseils et retours sont précieux pour ceux qui préparent leur mobilité, ainsi que pour l'amélioration de nos services.
        </p>
        
        <div class="form-control w-full">
        <textarea
            class="textarea textarea-bordered w-full min-h-40 focus:textarea-primary transition-all duration-200"
            placeholder="Décrivez votre expérience, vos conseils, vos découvertes..."
            v-model="account.acc_temoignage"
        ></textarea>
        
        <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
            <div class="flex items-center text-sm">
            <span :class="account.acc_temoignage?.length > CHAR_LIMIT ? 'text-error' : 'opacity-70'">
                {{ account.acc_temoignage?.length || 0 }} / {{ CHAR_LIMIT }} caractères
            </span>
            <div class="w-32 h-2 bg-base-200 rounded-full ml-3">
              <div 
  class="h-full rounded-full transition-all duration-300"
  :class="{
    'bg-success': (account.acc_temoignage?.length || 0) <= CHAR_LIMIT * 0.9,
    'bg-warning': (account.acc_temoignage?.length || 0) > CHAR_LIMIT * 0.9 && (account.acc_temoignage?.length || 0) <= CHAR_LIMIT,
    'bg-error': (account.acc_temoignage?.length || 0) > CHAR_LIMIT
  }"
  :style="{ width: Math.min(100, (account.acc_temoignage?.length || 0) / CHAR_LIMIT * 100) + '%' }"
></div>
            </div>
            </div>
            
            <button @click="modifTemoignage" class="btn btn-primary w-full sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Enregistrer
            </button>
        </div>
        </div>
    </div>
    </div>

    <!-- Partie suppression du compte -->
    <div class="w-full flex justify-center mb-10">
    <div class="w-full max-w-6xl bg-base-100 rounded-lg shadow-md p-6">
        <div class="flex items-center gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <h2 class="text-xl font-bold">Suppression du compte</h2>
        </div>
        
        <div class="alert mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
            <h3 class="font-bold">Attention !</h3>
            <p class="text-sm">Cette action est définitive et entraînera la suppression de toutes vos données. Cette opération ne peut pas être annulée.</p>
        </div>
        </div>
        
        <div class="flex justify-end">
        <button @click="openConfirmDeleteModal" class="btn btn-outline btn-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer mon compte
        </button>
        </div>
    </div>
    </div>

    <!-- Modal de confirmation suppression de compte -->
    <dialog id="confirmModalAccount" ref="confirmModalAccount" class="modal">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Confirmer la suppression du compte?</h3>
        <div class="py-3">
          <p>Confirmez vous la suppression de votre compte ?</p>
          <p>
            Cette action est irréversible et vos informations seront supprimées.
          </p>
        </div>
        <div class="modal-action">
          <button class="btn" @click="closeModal">Annuler</button>
          <button class="btn btn-success" @click="deleteAccount">
            Confirmer
          </button>
        </div>
      </div>
    </dialog>
  </div>
  <div v-else>
    <LoadingComp></LoadingComp>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick, initCustomFormatter } from "vue";
import { request } from "../../composables/httpRequest";
import config from "../../config";
import { useAccountStore } from "../../stores/accountStore";
import LoadingComp from "../../components/utils/LoadingComp.vue";
import { addAlert } from "../../composables/addAlert";
import { useRouter } from "vue-router";

const router = useRouter();
const response = ref([]);
const account = ref([]);
const favoris = ref([]);
const accords = ref([]);
const destination = ref([]);
const CHAR_LIMIT = 1500;
const admin = ref([]);
const isLoaded = ref(false);
const accountStore = useAccountStore();
const localFavoris = ref([]);
const currentUnivEtu = ref([]);
const localVoeux = ref({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
});
const isOpen = ref({
  favoris: false,
});
const files = ref({
  choixCours: {
    file: null,
    exist: false,
    path: "",
  },
  contratPeda: {
    file: null,
    exist: false,
    path: "",
  },
  releveNote: {
    file: null,
    exist: false,
    path: "",
  },
});
const myfiles = ref({
  choixCours: {
    exist: false,
    path: "",
  },
  contratPeda: {
    exist: false,
    path: "",
  },
  releveNote: {
    exist: false,
    path: "",
  },
});
const confirmDeleteDocument = ref({
  folder: "",
  title: "",
  type: "",
});

const selectedChangeVoeu = ref(null);

function toggleCollapse(section) {
  isOpen.value[section] = !isOpen.value[section];
}

function changeVoeuLocal(voeu) {
  selectedChangeVoeu.value = voeu;
}

async function modifTemoignage() {
  // Définir une limite de caractères (par exemple 500)

  if (
    account.value.acc_temoignage &&
    account.value.acc_temoignage.length > CHAR_LIMIT
  ) {
    addAlert("error", {
      data: {
        error: `Le témoignage est trop long. Maximum ${CHAR_LIMIT} caractères.`,
      },
    });
    return;
  }

  const requestData = {
    acc_id: accountStore.account.acc_id,
    acc_temoignage: account.value.acc_temoignage,
  };
  await request(
    "PUT",
    true,
    response,
    config.apiUrl + "api/account/temoignage",
    requestData
  );
}

// Modal modif etu
function modifEtu(account) {
  currentUnivEtu.value.acc_id = account.acc_id || null;
  currentUnivEtu.value.acc_mail = account.acc_mail || null;
  currentUnivEtu.value.acc_studentnum = account.acc_studentnum || null;
  currentUnivEtu.value.acc_parcours = account.acc_parcours || null;
}

function setAccordToVoeu(agree_id) {
  const dropZoneId = `voeu${selectedChangeVoeu.value}`;
  const dropZone = document.getElementById(dropZoneId);

  if (dropZone) {
    // Supprimez l'accord existant s'il y en a un
    if (localVoeux.value[selectedChangeVoeu.value]) {
      removeFavoris(localVoeux.value[selectedChangeVoeu.value].agree_id);
    }

    // Ajoutez l'accord sélectionné au voeu spécifié
    localVoeux.value[selectedChangeVoeu.value] = getAccord(agree_id);

    // Supprimez l'accord des favoris
    removeFavoris(agree_id);

    // Rafraîchissez l'interface après avoir mis à jour les données
    refreshDrag();
    saveWishes();

    // Fermez le modal en désélectionnant le checkbox
    const modalCheckbox = document.getElementById("modal_ajout_accord");
    if (modalCheckbox) {
      modalCheckbox.checked = false; // Désélectionne le checkbox pour fermer le modal
    }
  }
}

// Confirm modification etu
async function confirmModifEtu() {
  if (currentUnivEtu.value.acc_studentnum == "") {
    addAlert("error", {
      data: {
        error: "Vous devez renseigner votre numéro étudiant.",
        message: "Modification du dossier annulée.",
      },
    });
    return;
  }
  if (currentUnivEtu.value.acc_mail == "") {
    addAlert("error", {
      data: {
        error: "Vous devez renseigner votre mail.",
        message: "Modification du dossier annulée.",
      },
    });
    return;
  }

  const requestData = {
    acc_id: currentUnivEtu.value.acc_id,
    acc_mail: currentUnivEtu.value.acc_mail,
    acc_studentnum: currentUnivEtu.value.acc_studentnum,
    acc_parcours: currentUnivEtu.value.acc_parcours,
  };
  await request(
    "PUT",
    true,
    response,
    config.apiUrl + "api/account/modifetu",
    requestData
  );
  await request(
    "GET",
    false,
    account,
    config.apiUrl + "api/account/getbylogin/" + accountStore.account.acc_id
  );
}

async function initPage() {
  localFavoris.value = favoris.value.favoris
    .filter((favori) => !estVoeu(favori.agree_id))
    .map((favori) => {
      return accords.value.agreements.find(
        (accord) => accord.agree_id === favori.agree_id
      );
    });

  let index = 1;
  if (nbVoeu() > 0) {
    Object.keys(account.value.wishes).forEach((key) => {
      if (key.startsWith("wsha_")) {
        // Modifier cette ligne pour inclure uniquement les clés de voeux
        const accordId = account.value.wishes[key];
        if (accordId != null) {
          const accord = accords.value.agreements.find(
            (accord) => accord.agree_id === accordId
          );
          if (accord) {
            localVoeux.value[index] = accord;
          }
        }
        index++;
      }
    });
  }

  await nextTick();

  let dropZones = document.getElementsByClassName("voeuxDrop");

  refreshDrag();

  for (let dropZone of dropZones) {
    dropZone.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    dropZone.addEventListener("drop", function (e) {
      e.preventDefault();
      let id = e.dataTransfer.getData("text/plain");
      let selected = document.getElementById(id);
      if (selected) {
        const accordId = selected.id.replace("accord_wish_", "");
        const dropZoneId = dropZone.id.replace("voeu", "");
        if (estVoeuLocal(accordId)) {
          // Cas 1: Accord est deja un voeu
          const currentVoeuNum = getCurrentVoeuNum(accordId);
          const currentDropZone = document.getElementById(
            `voeu${currentVoeuNum}`
          );
          if (currentVoeuNum !== null && currentDropZone.id !== dropZone.id) {
            if (VoeuExist(dropZoneId)) {
              // Il y a deja un voeu dans l'emplacement souhaité
              const existingAccord = getAccord(
                localVoeux.value[dropZoneId].agree_id
              );
              const currentDropZoneId = currentDropZone.id.replace("voeu", "");
              localVoeux.value[dropZoneId] = getAccord(accordId);
              localVoeux.value[currentDropZoneId] = existingAccord;
              refreshDrag();
              saveWishes();
            } else {
              // Pas de voeu dans l'emplacement
              localVoeux.value[getCurrentVoeuNum(accordId)] = null;
              localVoeux.value[dropZoneId] = getAccord(accordId);
              refreshDrag();
              saveWishes();
            }
          }
        } else {
          // Cas 2: Accord est uniquement un favori
          if (VoeuExist(dropZoneId)) {
            // Il y a un deja un voeu dans l'emplacement souhaité
            if (estFavoris(localVoeux.value[dropZoneId].agree_id)) {
              addFavoris(localVoeux.value[dropZoneId].agree_id);
            }
            removeFavoris(accordId);
            localVoeux.value[dropZoneId] = getAccord(accordId);
            refreshDrag();
            saveWishes();
          } else {
            // Pas de voeu dans l'emplacement
            removeFavoris(accordId);
            localVoeux.value[dropZoneId] = getAccord(accordId);
            refreshDrag();
            saveWishes();
          }
        }
      }
    });
  }
}

async function refreshDrag() {
  await nextTick();
  let elementsDraggable = document.getElementsByClassName("elementDrag");

  // Parcourir tous les éléments
  for (let element of elementsDraggable) {
    if (!element.hasListener) {
      element.addEventListener("dragstart", dragStartHandler);
      element.hasListener = true;
    }
  }
}

function dragStartHandler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

async function fetch() {
  await request(
    "GET",
    false,
    account,
    config.apiUrl + "api/account/getbylogin/" + accountStore.account.acc_id
  );
  await request("GET", false, accords, config.apiUrl + "api/agreement/home/"+accountStore.account.acc_id);
  await request(
    "GET",
    false,
    favoris,
    config.apiUrl + "api/favoris/getbylogin/" + accountStore.account.acc_id
  );
  await request("GET", false, admin, config.apiUrl + "api/admin");
  await request(
    "GET",
    false,
    destination,
    config.apiUrl + "api/arbitrage/getbyid/" + accountStore.account.acc_id
  );
  await request(
    "GET",
    false,
    response,
    config.apiUrl +
      "api/documents/checkexist/admin/choix_cours" +
      (account.value.department != null
        ? `_${account.value.department.dept_id}`
        : "")
  );
  if (response.value.status == 200) {
    files.value.choixCours.exist = true;
    files.value.choixCours.path = response.value.path;
  }
  await request(
    "GET",
    false,
    response,
    config.apiUrl + "api/documents/checkexist/admin/contrat_peda"
  );
  if (response.value.status == 200) {
    files.value.contratPeda.exist = true;
    files.value.contratPeda.path = response.value.path;
  }
  await request(
    "GET",
    false,
    response,
    config.apiUrl +
      "api/documents/checkexistperso/etu/choix_cours/" +
      accountStore.account.acc_id
  );
  if (response.value.status == 200) {
    myfiles.value.choixCours.exist = true;
    myfiles.value.choixCours.path = response.value.path;
  }
  await request(
    "GET",
    false,
    response,
    config.apiUrl +
      "api/documents/checkexistperso/etu/contrat_peda/" +
      accountStore.account.acc_id
  );
  if (response.value.status == 200) {
    myfiles.value.contratPeda.exist = true;
    myfiles.value.contratPeda.path = response.value.path;
  }
  await request(
    "GET",
    false,
    response,
    config.apiUrl +
      "api/documents/checkexistperso/etu/releve_note/" +
      accountStore.account.acc_id
  );
  if (response.value.status == 200) {
    myfiles.value.releveNote.exist = true;
    myfiles.value.releveNote.path = response.value.path;
  }
  isLoaded.value = true;

  initPage();
}

// Vérifie si l'accord est dans la liste des favoris
function estFavoris(agree_id) {
  return favoris.value.favoris.some((favori) => favori.agree_id === agree_id);
}

// Renvoi un boolean true si l'accord est un voeu
function estVoeuLocal(agree_id) {
  const voeuIds = Object.values(localVoeux.value).map((accord) =>
    accord ? accord.agree_id.toString() : null
  );
  const agreeIdStr = agree_id.toString();
  return voeuIds.includes(agreeIdStr);
}

// Nombre de voeu en base
function nbVoeu() {
  if (account.value.wishes && account.value.wishes.acc_id) {
    const one = account.value.wishes.wsha_one != null ? 1 : 0;
    const two = account.value.wishes.wsha_two != null ? 1 : 0;
    const three = account.value.wishes.wsha_three != null ? 1 : 0;
    const four = account.value.wishes.wsha_four != null ? 1 : 0;
    const five = account.value.wishes.wsha_five != null ? 1 : 0;
    const six = account.value.wishes.wsha_six != null ? 1 : 0;
    return one + two + three + four + five + six;
  }
}

// Nombre de voeu en local
function nbVoeuLocal() {
  const one = localVoeux.value["1"] != null ? 1 : 0;
  const two = localVoeux.value["2"] != null ? 1 : 0;
  const three = localVoeux.value["3"] != null ? 1 : 0;
  const four = localVoeux.value["4"] != null ? 1 : 0;
  const five = localVoeux.value["5"] != null ? 1 : 0;
  const six = localVoeux.value["6"] != null ? 1 : 0;
  return one + two + three + four + five + six;
}

// Renvoi un boolean true si l'accord est un voeu
// Utilisé uniquement au chargement des données
function estVoeu(agree_id) {
  if (nbVoeu() > 0) {
    const wishKeys = Object.keys(account.value.wishes).filter((key) =>
      key.startsWith("wsha_")
    );
    const wishValues = wishKeys.map((key) => account.value.wishes[key]);
    return wishValues.includes(agree_id);
  }
}

// Renvoie le numéro du voeu de l'accord
function getCurrentVoeuNum(agree_id) {
  for (const [num, accord] of Object.entries(localVoeux.value)) {
    if (accord && accord.agree_id == agree_id) {
      return parseInt(num);
    }
  }
  return null;
}

// Renvoie un booleen true si a la position donné il y a un voeu
function VoeuExist(position) {
  if (position >= 1 && position <= Object.keys(localVoeux.value).length) {
    return localVoeux.value[position.toString()] !== null;
  } else {
    return false;
  }
}

// Ouvrir le modal de confirmation de suppression de document
function openConfirmModal(fileFolder, fileTitle, fileType) {
  confirmDeleteDocument.value.folder = fileFolder;
  confirmDeleteDocument.value.title = fileTitle;
  confirmDeleteDocument.value.type = fileType;
  const modal = document.getElementById("confirmModalDoc");
  modal.showModal();
}

// Ouvrir le modal de confirmation de suppression du compte
function openConfirmDeleteModal() {
  const modal = document.getElementById("confirmModalAccount");
  modal.showModal();
}

// Fermer le modal de confirmation de suppression
function closeModal() {
  const modal = document.getElementById("confirmModalDoc");
  modal.close();
  const modal2 = document.getElementById("confirmModalAccount");
  modal2.close();
}

// Supprimer un fichier
async function deleteFile(fileFolder, fileTitle, fileType) {
  closeModal();
  await request(
    "GET",
    true,
    response,
    `${config.apiUrl}api/documents/deleteperso/${fileFolder}/${fileFolder}_${accountStore.account.acc_id}`
  );

  if (response.value.status == 200) {
    myfiles.value[fileTitle].exist = false;
    myfiles.value[fileTitle].path = "";
    fetch();
  }
}

//Gérer la séléction d'un fichier en fonction du nom
const handleFileInputChange = (event, fileType) => {
  const file = event.target.files[0];
  if (file) {
    files.value[fileType].file = file;
  } else {
    files.value[fileType].file = null;
  }
};

// Ouvrir le fichier ou le télécharger
function openFileInNewTab(filePath) {
  // Diviser le chemin du fichier en segments et obtenir le dernier segment (nom du fichier)
  const segments = filePath.split("/");
  const fileName = segments[segments.length - 1];

  // Construire l'URL complète pour accéder au fichier
  const fileUrl = config.apiUrl + `api/documents/get/admin/${fileName}`;

  // Ouvrir le fichier dans un nouvel onglet si c'est un PDF
  if (fileName.toLowerCase().endsWith(".pdf")) {
    window.open(fileUrl, "_blank");
  } else {
    // Si ce n'est pas un PDF, forcer le téléchargement du fichier
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Propose le téléchargement avec le nom du fichier
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

async function openMyFileInNewTab(filePath) {
  // Diviser le chemin du fichier en segments pour obtenir le nom du fichier
  const segments = filePath.split("/");
  const fileName = segments[segments.length - 1]; // Dernier segment est le nom du fichier

  // Obtenir le dossier (suppressions des derniers segments pour obtenir le dossier parent)
  const folder = segments[2]; // Supposons que "etu" est toujours à l'index 2
  const username = fileName.split("_")[2].split(".")[0]; // Obtenir le login depuis le nom de fichier

  // Construire l'URL complète pour accéder au fichier
  const fileUrl = `${config.apiUrl}api/documents/getperso/etu/${folder}/${fileName}`;

  // Ouvrir le fichier dans un nouvel onglet si c'est un PDF
  if (fileName.toLowerCase().endsWith(".pdf")) {
    window.open(fileUrl, "_blank");
  } else {
    // Si ce n'est pas un PDF, forcer le téléchargement du fichier
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName; // Propose le téléchargement avec le nom du fichier
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Enregistrer un fichier
async function saveFile(title, folder, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("folder", folder);

  await request(
    "POST",
    true,
    response,
    config.apiUrl + "api/documents",
    formData
  );
  if (response.value.status == 200) {
    // Réinitialiser les états des fichiers
    files.value.choixCours.file = null;
    files.value.contratPeda.file = null;
    files.value.releveNote.file = null;
    myfiles.value.choixCours.file = null;
    myfiles.value.contratPeda.file = null;
    myfiles.value.releveNote.file = null;

    // Réinitialiser les champs de fichier HTML
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  }
  fetch();
}

async function deleteAccount() {
  closeModal();
  const requestData = {
    acc_id: accountStore.account.acc_id,
  };
  await request(
    "DELETE",
    true,
    response,
    config.apiUrl + "api/account/selfdelete",
    requestData
  );
  if (response.value.status == 202) {
    // Nettoyage localStorage
    localStorage.removeItem("login");
    localStorage.removeItem("auth");
    localStorage.removeItem("token");

    router.push({ name: "Accueil" });
    window.open(config.apiUrl + "cas.php?logout=true", "_blank");
    accountStore.logoutAccount();
  }
}

// Supprime de la liste des favoris l'accord passé en param
function removeFavoris(agree_id) {
  const index = localFavoris.value.findIndex(
    (accord) => accord.agree_id == agree_id
  );
  if (index !== -1) {
    localFavoris.value.splice(index, 1);
  }
}

// Ajoute a la liste des favoris l'accord passé en param
function addFavoris(agree_id) {
  const accord = accords.value.agreements.find(
    (accord) => accord.agree_id === agree_id
  );

  if (accord) {
    localFavoris.value.push(accord);
  }
}

// Renvoi l'accord qui correspond à l'id
function getAccord(agree_id) {
  for (const accord of Object.values(accords.value.agreements)) {
    if (accord && accord.agree_id == agree_id) {
      return accord;
    }
  }
  return null;
}

function removeVoeu(agree_id, position) {
  localVoeux.value[position] = null;
  if (estFavoris(agree_id)) {
    addFavoris(agree_id);
    refreshDrag();
  }
  saveWishes();
}

function joursRestants(date) {
  const dateLimite = new Date(date);
  const currentDate = new Date();
  const timeDifference = dateLimite - currentDate;
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Les mois commencent à 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function saveWishes() {
  const requestData = {
    acc_id: accountStore.account.acc_id,
    wsha_one: localVoeux.value[1] != null ? localVoeux.value[1].agree_id : null,
    wsha_two: localVoeux.value[2] != null ? localVoeux.value[2].agree_id : null,
    wsha_three:
      localVoeux.value[3] != null ? localVoeux.value[3].agree_id : null,
    wsha_four:
      localVoeux.value[4] != null ? localVoeux.value[4].agree_id : null,
    wsha_five:
      localVoeux.value[5] != null ? localVoeux.value[5].agree_id : null,
    wsha_six: localVoeux.value[6] != null ? localVoeux.value[6].agree_id : null,
  };
  await request(
    "POST",
    true,
    response,
    config.apiUrl + "api/wishagreement",
    requestData
  );
}

onMounted(fetch);
</script>
