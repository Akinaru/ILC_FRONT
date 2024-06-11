<template>
    <div class="m-5">
        <p class="font-bold text-lg mb-4">Documents</p>
        <div class="flex justify-center items-start">

            <!-- Formulaire Autorisation Affichage -->
            <div class="mb-6 w-2/3 ">
                <p class="font-semibold text-md mb-2">Formulaire autorisation affichage dans les anciens étudiants</p>
                <div class="flex w-full">
                    <input type="file" accept=".pdf, .xls, .xlsx" @change="handleFileInputChange" class="file-input file-input-bordered max-w-2xl w-full" />
                    <button v-if="files.anciensEtudiants.file != null" class="btn btn-success mx-2" @click="saveFile('auto_ancien_etu', 'documents/admin', files.anciensEtudiants.file)">Envoyer le fichier</button>
                    <button v-if="files.anciensEtudiants.exist" class="btn btn-primary mx-2" @click="openFileInNewTab(files.anciensEtudiants.path)">Voir le fichier actuel</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue'
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    const response = ref([]);
    
    const files = ref({
        anciensEtudiants: {
            file: null,
            exist: false,
            path: ''
        }
    });

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            files.value.anciensEtudiants.file = file;
        } else {
            files.value.anciensEtudiants.file = null;
        }
    };

    async function saveFile(title, folder, file){

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('folder', folder);

        await request('POST', true, response, config.apiUrl+'api/documents', formData)
        fetch();
    }

    async function fetch(){
        await request('GET', false, response, config.apiUrl+'api/documents/checkexist/admin/auto_ancien_etu')
        if(response.value.status == 200){
            files.value.anciensEtudiants.exist = true;
            files.value.anciensEtudiants.path = response.value.path;
        }
        resetInput();

    }
    
    function resetInput(){
        files.value.anciensEtudiants.file = null;
        const inputs = document.querySelectorAll('.file-input');
        inputs.forEach(input => {
            input.value = '';
        });
    }


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
            console.log("Le fichier n'est pas un PDF.");
        }
    }

    onMounted(fetch)


</script>
