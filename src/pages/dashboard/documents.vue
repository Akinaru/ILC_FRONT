<template>
    <div class="m-5" v-if="isLoaded">
        <p class="font-bold text-lg mb-4">Documents</p>
        <!-- Liste des documents -->
        <div class="flex justify-center items-center flex-col">

            <!-- Formulaire Autorisation Affichage -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col shadow-lg rounded-lg bg-base-300 p-1">
                <p class="font-semibold text-md mb-2 text-start w-full p-3">Formulaire autorisation affichage dans les anciens étudiants</p>
                <div class="flex w-full">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'anciensEtudiants')" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.anciensEtudiants.file != null" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile('auto_ancien_etu', 'documents/admin', files.anciensEtudiants.file)">Envoyer le fichier</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.anciensEtudiants.path)">Voir le fichier actuel</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal('auto_ancien_etu', 'anciensEtudiants')">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70">Aucun fichier</button>
                </div>
            </div>

            <!-- Contrat pédagogique -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col shadow-lg rounded-lg bg-base-300 p-1">
                <p class="font-semibold text-md mb-2 text-start w-full p-3">Contrat pédagogique</p>
                <div class="flex w-full ">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'contratPeda')" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.contratPeda.file != null" class="btn btn-success mx-2" @click="saveFile('contrat_peda', 'documents/admin', files.contratPeda.file)">Envoyer le fichier</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-primary mx-2 min-w-44" @click="openFileInNewTab(files.contratPeda.path)">Voir le fichier actuel</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-error mx-2 min-w-32" @click="openConfirmModal('contrat_peda', 'contratPeda')">Supprimer</button>
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

                    <!-- Affichage des form documents par departments -->
                    <div v-show="isOpen[`component-${index}`]" class="w-full bg-base-200 flex items-center justify-center flex-col">
                        <div v-for="(dept, index) in compo.departments" :key="index" class="bg-base-300 shadow-lg rounded-lg my-3 p-1 w-4/5 flex items-start justify-center flex-col" :style="{borderBottom: `4px solid ${dept.dept_color ? dept.dept_color : '#aaaaaa'}`}">
                            <p class="select-none  p-3 w-full my-1 font-bold" :style="{ color: `${ dept.dept_color ? dept.dept_color : '#aaaaaa'}` }">({{ dept.dept_shortname ? dept.dept_shortname : 'Nom Introuvable' }}) {{ dept.dept_name ? dept.dept_name : 'Nom Introuvable' }}</p>
                            <div class="flex w-full">
                                <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'choixCours')" class="file-input file-input-bordered min-w-2xl w-full" />
                                <button v-if="files.choixCours.file != null" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile('choix_cours', 'documents/admin', files.choixCours.file)">Envoyer le fichier</button>
                                <button v-if="files.choixCours.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.choixCours.path)">Voir le fichier actuel</button>
                                <button v-if="files.choixCours.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal('choix_cours', 'choixCours')">Supprimer</button>
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
                </div>
                <div class="modal-action">
                    <button class="btn btn-error" @click="closeModal">Annuler</button>
                    <button class="btn btn-success" @click="deleteFile(confirmDeleteDocument.title, confirmDeleteDocument.type)">Confirmer</button>
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
        type: ''
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
        choixCours: {
            file: null,
            exist: false,
            path: ''
        },
        contratPeda: {
            file: null,
            exist: false,
            path: ''
        }
    });

    // Ouvrir le modal de confirmation de suppression
    function openConfirmModal(fileTitle, fileType) {
        confirmDeleteDocument.value.title = fileTitle;
        confirmDeleteDocument.value.type = fileType;
        const modal = document.getElementById('confirmModal');
        modal.showModal();
    }

    // Fermer le modal de confirmation de suppression
    function closeModal() {
        const modal = document.getElementById('confirmModal');
        modal.close();
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

    // Enregistrer un fichier
    async function saveFile(title, folder, file){
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('folder', folder);

        await request('POST', true, response, config.apiUrl+'api/documents', formData);
        if(response.value.status == 200){
            files.value.anciensEtudiants.file = null;
            files.value.choixCours.file = null;
            files.value.contratPeda.file = null;
            const requestDataAction = {
                act_description: 'Modification du document: '+folder+'/'+title+'.',
                acc_id: accountStore.login,
                admin: 1
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetch();
    }

    // Supprimer un fichier
    async function deleteFile(fileTitle, fileType) {
        closeModal();
        await request('GET', true, response, `${config.apiUrl}api/documents/delete/admin/${fileTitle}`);
        if (response.value.status == 200) {
            files.value[fileType].exist = false;
            files.value[fileType].file = null;
            files.value[fileType].path = '';
        }
    }

    async function fetch(){
        isLoaded.value = false;
        await request('GET', false, components, config.apiUrl+'api/component')
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/auto_ancien_etu')
        if(response.value.status == 200){
            files.value.anciensEtudiants.exist = true;
            files.value.anciensEtudiants.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/choix_cours')
        if(response.value.status == 200){
            files.value.choixCours.exist = true;
            files.value.choixCours.path = response.value.path;
        }
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/contrat_peda')
        if(response.value.status == 200){
            files.value.contratPeda.exist = true;
            files.value.contratPeda.path = response.value.path;
        }
        resetInput();
        // Initialisation de l'état pour chaque composant
        components.value.components.forEach((_, index) => {
            isOpen.value[`component-${index}`] = true;
        });
        isLoaded.value = true;
    }
    
    function resetInput(){
        files.value.anciensEtudiants.file = null;
        files.value.choixCours.file = null;
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
