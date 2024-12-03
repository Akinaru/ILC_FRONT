<template>
    <div class="m-5" v-if="isLoaded">
        <p class="font-bold text-lg mb-4">Documents</p>
        <!-- Liste des documents -->
        <div class="flex justify-center items-center flex-col">

            <!-- Formulaire Autorisation Affichage -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col shadow-lg rounded-lg bg-base-300 p-1">
                <p class="font-semibold text-md mb-2 text-start w-full p-3">Formulaire autorisation affichage dans les anciens étudiants</p>
                <div class="flex w-full">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'anciensEtudiants', null)" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.anciensEtudiants.file != null" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile('auto_ancien_etu', 'documents/admin', files.anciensEtudiants.file)">Envoyer le fichier</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.anciensEtudiants.path)">Voir le fichier actuel</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal('auto_ancien_etu', 'anciensEtudiants', null)">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70">Aucun fichier</button>
                </div>
            </div>

            <!-- Contrat pédagogique -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col shadow-lg rounded-lg bg-base-300 p-1">
                <p class="font-semibold text-md mb-2 text-start w-full p-3">Contrat pédagogique</p>
                <div class="flex w-full ">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'contratPeda', null)" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.contratPeda.file != null" class="btn btn-success mx-2" @click="saveFile('contrat_peda', 'documents/admin', files.contratPeda.file)">Envoyer le fichier</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-primary mx-2 min-w-44" @click="openFileInNewTab(files.contratPeda.path)">Voir le fichier actuel</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-error mx-2 min-w-32" @click="openConfirmModal('contrat_peda', 'contratPeda', null)">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44">Aucun fichier</button>
                </div>
            </div>

            <!-- Tableau choix des cours -->

            <div class="mb-6 w-3/4 flex items-center justify-center flex-col">
                <p class="font-semibold text-md mb-2 text-start w-full">Tableau excel des choix des cours</p>
                <div v-for="(compo, index) in components.components" :key="index" class="w-full flex items-center justify-center flex-col mx-10 my-3">

                    <!-- Titre de la composante -->
                     <div class="hover:opacity-60 cursor-pointer bg-base-300 p-3 w-full flex items-center justify-between" @click="toggleCollapse(`component-${index}`)">
                         <p class="select-none font-semibold text-md text-start ">{{ compo.comp_name ? compo.comp_name : 'Nom introuvable' }}</p>
                         <span :class="isOpen[`component-${index}`] ? 'rotate-180' : ''" class="transform transition-transform text-xl select-none">&#9662;</span>
                    </div>

                    <!-- Affichage des form documents par départements -->
                    <div v-show="isOpen[`component-${index}`]" class="w-full bg-base-200 flex items-center justify-center flex-col">
                        <div v-for="(dept, index) in compo.departments" :key="index" class="bg-base-300 shadow-lg rounded-lg my-3 p-1 w-4/5 flex items-start justify-center flex-col" :style="{borderBottom: `4px solid ${dept.dept_color ? dept.dept_color : '#aaaaaa'}`}">
                            <p class="select-none p-3 w-full my-1 font-bold" :style="{ color: `${dept.dept_color ? dept.dept_color : '#aaaaaa'}` }">({{ dept.dept_shortname ? dept.dept_shortname : 'Nom Introuvable' }}) {{ dept.dept_name ? dept.dept_name : 'Nom Introuvable' }}</p>
                            <div class="flex w-full">
                                <!-- Utilisation du dept_id pour accéder au bon fichier choixCours -->
                                <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'choixCours', dept.dept_id)" class="file-input file-input-bordered min-w-2xl w-full" />
                                <button v-if="files.choixCours[dept.dept_id]?.file" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile(`choix_cours_${dept.dept_id}`, 'documents/admin', files.choixCours[dept.dept_id].file, dept.dept_id)">Envoyer le fichier</button>
                                <button v-if="files.choixCours[dept.dept_id]?.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.choixCours[dept.dept_id].path)">Voir le fichier actuel</button>
                                <button v-if="files.choixCours[dept.dept_id]?.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal(`choix_cours_${dept.dept_id}`, 'choixCours', dept)">Supprimer</button>
                                <button v-else disabled class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70">Aucun fichier</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
        <!-- Modal de confirmation suppression -->
        <dialog id="confirmModal" ref="confirmModal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                <div class="py-3">
                    <p>Confirmez vous la suppression du fichier: <strong>{{ confirmDeleteDocument.title }}</strong></p>
                    <span v-if="confirmDeleteDocument.dept != null" :style="{backgroundColor: confirmDeleteDocument.dept.dept_color ? confirmDeleteDocument.dept.dept_color : '#aaaaaa'}" class="badge">{{ confirmDeleteDocument.dept.dept_shortname }}</span>
                </div>
                <div class="modal-action">
                    <button class="btn" @click="closeModal">Annuler</button>
                    <button class="btn btn-success" @click="deleteFile(confirmDeleteDocument.title, confirmDeleteDocument.type, confirmDeleteDocument.dept ? confirmDeleteDocument.dept.dept_id : null)">Confirmer</button>
                </div>
            </div>
        </dialog>
    </div>
    <div v-else>
        <LoadingComp></LoadingComp>
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue'
    import { request } from '../../composables/httpRequest';
    import LoadingComp from '../../components/utils/LoadingComp.vue';
    import config from '../../config';

    import { useAccountStore } from '../../stores/accountStore';
    const accountStore = useAccountStore();

    const isLoaded = ref(false);

    const components = ref([])
    const response = ref([]);
    const confirmDeleteDocument = ref({
        title: '',
        type: '',
        dept: null
    });

    const isOpen = ref({});

    // Fonction pour basculer l'état du menu déroulant
    function toggleCollapse(section) {
        isOpen.value[section] = !isOpen.value[section]; // Inverse l'état de la section
    }

    const files = ref({
        anciensEtudiants: {
            file: null,
            exist: false,
            path: ''
        },
        choixCours: {},
        contratPeda: {
            file: null,
            exist: false,
            path: ''
        }
    });

    // Ouvrir le modal de confirmation de suppression
    function openConfirmModal(fileTitle, fileType, dept) {
        confirmDeleteDocument.value.title = fileTitle;
        confirmDeleteDocument.value.type = fileType;
        confirmDeleteDocument.value.dept = dept;
        const modal = document.getElementById('confirmModal');
        modal.showModal();
    }

    // Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal');
        modal.close();
    }

    // Gérer la sélection d'un fichier en fonction du nom
    const handleFileInputChange = (event, fileType, dept_id) => {
        const file = event.target.files[0];

        if (fileType === 'choixCours') {
            // Vérifiez si l'entrée pour ce dept_id existe, sinon, initialisez-la
            if (!files.value.choixCours[dept_id]) {
                files.value.choixCours[dept_id] = {
                    file: null,
                    exist: false,
                    path: ''
                };
            }

            // Mettre à jour le fichier pour le dept_id spécifié
            files.value.choixCours[dept_id].file = file;
        } else {
            // Pour les autres types de fichiers, la logique d'origine
            if (file) {
                files.value[fileType].file = file;
            } else {
                files.value[fileType].file = null;
            }
        }
    };

    // Enregistrer un fichier
    async function saveFile(title, folder, file, deptId = null) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('folder', folder);

        await request('POST', true, response, config.apiUrl + 'api/documents', formData);
        if (response.value.status == 200) {
            files.value.anciensEtudiants.file = null;
            files.value.choixCours[deptId].file = null; // Réinitialiser le fichier spécifique
            files.value.contratPeda.file = null;
            
            const requestDataAction = {
                act_description: 'Modification du document: ' + folder + '/' + title + '.',
                acc_id: accountStore.login,
                admin: 1
            };
            await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
        }
        fetch();
    }

    // Supprimer un fichier
    async function deleteFile(fileTitle, fileType, deptId = null) {
        closeModal();

        // Construire l'URL en fonction du type de fichier et de l'ID du département
        let deleteUrl = `${config.apiUrl}api/documents/delete/admin/${fileTitle}`;

        await request('GET', true, response, deleteUrl);
        if (response.value.status == 200) {
            if (fileType === 'choixCours') {
                // Réinitialiser le fichier pour l'ID de département spécifique
                if (files.value[fileType][deptId]) {
                    files.value[fileType][deptId].exist = false;
                    files.value[fileType][deptId].file = null;
                    files.value[fileType][deptId].path = '';
                }
            } else {
                files.value[fileType].exist = false;
                files.value[fileType].file = null;
                files.value[fileType].path = '';
            }
        }
        fetch();
    }

    // récupération des données et traitements
    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, components, config.apiUrl+'api/component')
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/auto_ancien_etu')
        if(response.value.status == 200){
            files.value.anciensEtudiants.exist = true;
            files.value.anciensEtudiants.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/contrat_peda')
        if(response.value.status == 200){
            files.value.contratPeda.exist = true;
            files.value.contratPeda.path = response.value.path;
        }

        // Boucle sur les composants
        for (const component of components.value.components) {
            // Boucle sur les départements de la composante
            for (const department of component.departments) {
                const dept_id = department.dept_id;

                const response = ref({});
                await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/choix_cours_'+ dept_id)
                // Vérifier la réponse
                if (response.value.status == 200) {
                    // Initialiser si nécessaire
                    if (!files.value.choixCours[dept_id]) {
                        files.value.choixCours[dept_id] = {
                            file: null,
                            exist: false,
                            path: ''
                        };
                    }
                    
                    // Mettre à jour l'état pour le choixCours de ce département
                    files.value.choixCours[dept_id].exist = true;
                    files.value.choixCours[dept_id].path = response.value.path;
                }
            }
        }

        resetInput();
        // Initialisation de l'état pour chaque composant
        components.value.components.forEach((_, index) => {
            isOpen.value[`component-${index}`] = true;
        });
        isLoaded.value = true;
    }
    
    // Suppression des fichiers chargés sur les inputs
    function resetInput() {
        files.value.anciensEtudiants.file = null;

        // Réinitialisation des fichiers choixCours pour chaque département
        for (const deptId in files.value.choixCours) {
            if (files.value.choixCours[deptId] != null) {
                files.value.choixCours[deptId].file = null;
            }
        }

        // Réinitialisation des fichiers contratPeda
        files.value.contratPeda.file = null;

        // Réinitialisation des inputs de fichier dans le DOM
        const inputs = document.querySelectorAll('.file-input');
        inputs.forEach(input => {
            input.value = '';
        });
    }

    // Ouvrir le fichier ou le télécharger
    function openFileInNewTab(filePath) {
        // Diviser le chemin du fichier en segments et obtenir le dernier segment (nom du fichier)
        const segments = filePath.split('/');
        const fileName = segments[segments.length - 1];

        // Construire l'URL complète pour accéder au fichier
        const fileUrl = config.apiUrl + `api/documents/get/admin/${fileName}`;

        // Ouvrir le fichier dans un nouvel onglet si c'est un PDF
        if (fileName.toLowerCase().endsWith('.pdf')) {
            window.open(fileUrl, '_blank');
        } else {
            // Si ce n'est pas un PDF, forcer le téléchargement du fichier
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;  // Propose le téléchargement avec le nom du fichier
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }


    onMounted(fetch)


</script>
