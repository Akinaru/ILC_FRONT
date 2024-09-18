<template>
    <div class="m-5">
        <p class="font-bold text-lg mb-4">Documents</p>
        <!-- Liste des documents -->
        <div class="flex justify-center items-center flex-col">

            <!-- Formulaire Autorisation Affichage -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col">
                <p class="font-semibold text-md mb-2 text-start w-full">Formulaire autorisation affichage dans les anciens étudiants</p>
                <div class="flex w-full">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'anciensEtudiants')" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.anciensEtudiants.file != null" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile('auto_ancien_etu', 'documents/admin', files.anciensEtudiants.file)">Envoyer le fichier</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.anciensEtudiants.path)">Voir le fichier actuel</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal('auto_ancien_etu', 'anciensEtudiants')">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70">Aucun fichier</button>
                </div>
            </div>

            <!-- Tableau choix des cours -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col">
                <p class="font-semibold text-md mb-2 text-start w-full">Tableau excel des choix des cours</p>
                <div class="flex w-full">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'choixCours')" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.choixCours.file != null" class="btn btn-success mx-2 hover:scale-105 transition-all hover:opacity-70" @click="saveFile('choix_cours', 'documents/admin', files.choixCours.file)">Envoyer le fichier</button>
                    <button v-if="files.choixCours.exist" class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70" @click="openFileInNewTab(files.choixCours.path)">Voir le fichier actuel</button>
                    <button v-if="files.choixCours.exist" class="btn btn-error mx-2 min-w-32 hover:scale-105 transition-all hover:opacity-70" @click="openConfirmModal('choix_cours', 'choixCours')">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44 hover:scale-105 transition-all hover:opacity-70">Aucun fichier</button>
                </div>
            </div>

            <!-- Contrat pédagogique -->
            <div class="mb-6 w-3/4 flex items-center justify-center flex-col">
                <p class="font-semibold text-md mb-2 text-start w-full">Contrat pédagogique</p>
                <div class="flex w-full ">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange($event, 'contratPeda')" class="file-input file-input-bordered min-w-2xl w-full" />
                    <button v-if="files.contratPeda.file != null" class="btn btn-success mx-2" @click="saveFile('contrat_peda', 'documents/admin', files.contratPeda.file)">Envoyer le fichier</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-primary mx-2 min-w-44" @click="openFileInNewTab(files.contratPeda.path)">Voir le fichier actuel</button>
                    <button v-if="files.contratPeda.exist" class="btn btn-error mx-2 min-w-32" @click="openConfirmModal('contrat_peda', 'contratPeda')">Supprimer</button>
                    <button v-else disabled class="btn btn-primary mx-2 min-w-44">Aucun fichier</button>
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
</template>

<script setup>

    import { onMounted, ref } from 'vue'
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    import { useAccountStore } from '../../stores/accountStore';
    const accountStore = useAccountStore();

    const response = ref([]);
    const confirmDeleteDocument = ref({
        title: '',
        type: ''
    });
    
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
