<template>
    <div >
        <p class="text-2xl font-bold flex items-center justify-center py-3">Articles</p>

        <!-- Formulaire d'ajout d'article -->
        <div class="m-5 flex justify-center items-center flex-col">
            <p class="text-lg font-bold" id="page_title">{{ isEditing ? 'Modifier l\'article' : 'Ajout un article' }}</p>
            <form @submit.prevent="addArticle" class="w-4/5 *:my-2" enctype="multipart/form-data">
                <!-- Affichage de l'image conditionnel -->
                <div class="flex items-center justify-center">
                     <div :style="{ backgroundImage: `url(${isEditing ? backgroundImageModif : backgroundImage})` }" class="bg-cover bg-center w-3/5 h-72 mb-4"></div>
                </div>
                <input type="file" @change="handleFileInputChange" name="image" accept="image/*" class="file-input file-input-bordered w-full mb-4" />
                <input type="text" placeholder="Titre" v-model="newArticle.title" class="input input-bordered w-full mb-4" />
                <TextEditor ref="editorRef" v-model="newArticle.art_description"></TextEditor>

                <!--Formulaire rajouté pour ajout de documents-->
                <div class="mb-6 w-3/4 flex items-center justify-center flex-col shadow-lg rounded-lg bg-base-300 p-1 w-full">
                    <p class="font-semibold text-md mb-2 text-start w-full p-3">Formulaire d'ajout de pièces jointes</p>

                    <p class="font-semibold text-md mb-2 text-start w-full pt-3 pl-3">Sélectionner des fichiers existants (CTRL + Clic pour sélectionner plusieurs)</p>
                    <select v-model="modifiedArticleFiles" class="select select-bordered w-full select-primary h-200px" id="file_select" @change="handleFileInputChangeDocument($event, 'existingFiles')" multiple>
                        <option v-for="(document, index) in existingDocuments.documents" :key="index" :value="document.doc_id">{{ document.doc_name }}</option>
                    </select>
                    <p class="font-semibold text-md mb-2 text-start w-full pt-3 pl-3">Importer de nouveaux fichiers</p>
                    <div class="flex w-full">
                        <input type="file" accept=".pdf, .xls, .xlsx, .pptx, .docx, .odt" @change="handleFileInputChangeDocument($event, 'newFiles')" class="file-input file-input-bordered min-w-2xl w-full" id="file_add" multiple/>
                    </div>

                    <p class="text-md mb-2 text-start w-full pt-3 pl-3">Nouveaux documents importés / documents à écraser : </p>
                    <div class="w-full mb-4 pl-3">
                        <span v-for="file in recapNewDoc">{{ file }}, </span>
                    </div>
                </div>

                <label class="label cursor-pointer justify-start w-fit">
                    <input type="checkbox" class="checkbox mr-2" v-model="newArticle.pinned" />
                    <span class="label-text">Épinglé ?</span> 
                </label>
                
                <div class="flex flex-row items-center gap-4">
                    <label class="label cursor-pointer justify-start w-fit">
                        <input type="checkbox" class="checkbox mr-2" v-model="newArticle.datesortiebool" />
                        <span class="label-text">Date sortie différée ?</span>
                    </label>
                    
                    <label v-if="newArticle.datesortiebool" class="label cursor-pointer justify-start w-fit">
                        <input type="datetime-local" class="input input-bordered w-fit" v-model="newArticle.datesortie" />
                    </label>
                </div>
                <div class="flex items-center justify-center *:mx-1 ">
                    <button v-if="!isEditing" class="btn btn-primary hover:scale-105 transition-all hover:opacity-70" type="submit">Ajouter l'article</button>
                    <div v-else>
                        <button class="btn btn-success mr-1" type="button" @click="confirmModifArticle">Enregistrer les modifications</button>
                        <button class="btn btn-neutral ml-1" type="button" @click="cancelModifArticle">Annuler les modifications</button>
                    </div>
                </div>
            </form>
        </div>
        <!-- Liste des articles -->
        <div>
            <p class="text-xl font-bold flex items-center justify-center py-3">Liste article</p>
            <div v-if="articles && articles.articles" class="flex justify-center items-center flex-col py-5">
                <div v-if="articles.count > 0" class="flex flex-wrap justify-center gap-5 mx-auto">
                    <div v-for="(article, index) in articles.articles" :key="index" class="relative bg-base-300 w-80 md:w-110 h-96 transition-all duration-100 ease-in-out drop-shadow-lg hover:scale-105">
                        <!-- Modification / Suppression -->
                        <div class="flex absolute top-0 right-0 ">
                            <!-- Bouton de modification -->
                            <label class="hover:opacity-70 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifArticle(article)">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                </svg>
                            </label>
                            <!-- Bouton de suppression -->
                            <button class="hover:opacity-70 p-5 hover:cursor-pointer bg-base-300" @click="openConfirmModal(article)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Affichage -->
                        <RouterLink :to="{name: 'Article', params: {art_id: article.art_id}}">
                            <div class="p-2">
                                <div :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl+'images/no_image.jpg'})` }" class="bg-cover bg-center w-full h-48"></div>
                            </div>
                            <span v-if="article.art_pin" class="badge badge-primary absolute top-1 left-1">📌Épinglé</span>
                            <div class="p-4 flex flex-col justify-start h-52">
                                <div class="mb-2">
                                    <p class="font-bold text-xl">{{ article.art_title }}</p>
                                    <p class="text-gray-600 text-sm">Date sortie: {{ article.art_datesortie }} passé : {{ getDateSortieStatus(article.art_datesortie) }}</p>
                                    <p class="text-gray-600 text-sm">Dernière modif: {{ article.art_lastmodif }}</p>
                                </div>
                                <!-- Limitation de la hauteur de la description avec overflow et ellipsis -->
                                <div class="overflow-hidden text-sm text-gray-700" style="max-height: 4rem; text-overflow: ellipsis; white-space: nowrap;" v-html="article.art_description"></div>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500">Aucun article disponible.</div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
        <!-- Modal de confirmation suppression -->
        <dialog id="confirmModal" ref="confirmModal" class="modal">
            <div class="modal-box">
                <h3 class="text-lg font-bold">Confirmer la suppression ?</h3>
                <div class="py-3">
                    <p>Confirmez vous la supression de l'article:</p>
                    <!-- Affichage -->
                    <div>
                        <div class="p-2">
                            <div :style="{ backgroundImage: `url(${confirmDeleteArticle.art_image ? config.apiUrl + 'api/article/image/' + confirmDeleteArticle.art_id : config.apiUrl+'images/no_image.jpg'})` }" class="bg-cover bg-center w-full h-48"></div>
                        </div>
                        <span v-if="confirmDeleteArticle.art_pin" class="badge badge-primary absolute top-1 left-1">📌Épinglé</span>
                        <div class="p-4 flex flex-col justify-start h-52">
                            <div class="mb-2">
                                <p class="font-bold text-xl">{{ confirmDeleteArticle.art_title }}</p>
                                <p class="text-gray-600 text-sm">Dernière modif: {{ confirmDeleteArticle.art_lastmodif }}</p>
                            </div>
                            <!-- Limitation de la hauteur de la description avec overflow et ellipsis -->
                            <div class="overflow-hidden text-sm text-gray-700" style="max-height: 4rem; text-overflow: ellipsis; white-space: nowrap;" v-html="confirmDeleteArticle.art_description"></div>
                        </div>
                    </div>
                </div>
            <div class="modal-action">
                <button class="btn" @click="closeModal">Annuler</button>
                <button class="btn btn-success" @click="removeArticle(confirmDeleteArticle.art_title, confirmDeleteArticle.art_id)">Confirmer</button>
            </div>
            </div>
        </dialog>

    </div>

</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { onMounted, ref, computed, nextTick } from 'vue';
import config from '../../config';
import TextEditor from '../../components/utils/TextEditor.vue';
import { useAccountStore } from '../../stores/accountStore';
import { addAlert } from '../../composables/addAlert';
import { addAction } from '../../composables/actionType';

const accountStore = useAccountStore();
const response = ref([]);
const articles = ref([]);
const newArticle = ref({ title: null, description: null, pinned: false, image: null, date: '', datesortiebool: false    });
const isEditing = ref(false)
const confirmDeleteArticle = ref([])
const editorRef = ref(null);

const currentArticleModif = ref([]);
const imagePreview = ref(null);
const imagePreviewModif = ref(null);

// Gestion du changement d'image dans le formulaire
const handleFileInputChange = (event) => {
    if(isEditing.value){
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            imagePreviewModif.value = e.target.result;
            };
            reader.readAsDataURL(file);
            currentArticleModif.value.art_image = file;
        } else {
            imagePreviewModif.value = null;
            currentArticleModif.value.art_image = null;
        }
    }else{
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.value = e.target.result;
            };
            reader.readAsDataURL(file);
            newArticle.value.image = file;
        } else {
            imagePreview.value = null;
            newArticle.value.image = null;
        }
    }
};


// Variable qui contient l'url de l'image qu'on a choisit pour ajouter un article
const backgroundImage = computed(() => {
    return imagePreview.value ? imagePreview.value : `${config.apiUrl}images/no_image.jpg`;
});

// Variable qui contient l'url de l'image qu'on a choisit pour ajouter un article dans le modal de modification
const backgroundImageModif = computed(() => {
    return imagePreviewModif.value ? imagePreviewModif.value : 
        currentArticleModif.value.art_image
        ? `${config.apiUrl}api/article/image/${currentArticleModif.value.art_id}`
        : `${config.apiUrl}images/no_image.jpg`;
});

function getDateSortieStatus(date) {
    // Si la date est nulle, on considère que c'est publié immédiatement
    if (date === null) {
        return '✅';
    }
    
    const dateSortie = new Date(date);
    const now = new Date();

    // Si la date de sortie est passée ou égale à maintenant
    if (dateSortie <= now) {
        return '✅';
    }
    
    // Si la date est future
    return '❌';
}

//ouvrir le modal de confirmation de suppression
function openConfirmModal(article) {
  
    confirmDeleteArticle.value = article;
    const modal = document.getElementById('confirmModal')
    modal.showModal()
}

//Fermer le modal de confirmation de suppression
function closeModal() {
    const modal = document.getElementById('confirmModal')
    modal.close()
}

// Ajout d'article
async function addArticle(){
   if(newArticle.value.title == '' || newArticle.value.title == null){
       addAlert('error', {data:{error: 'Vous devez mettre un titre à votre article.', message:'Ajout de l\'article annulé.'}})
       return;
   }
   if(newArticle.value.art_description == '' || newArticle.value.art_description == null){
       addAlert('error', {data:{error: 'Vous devez mettre une description à votre article.', message:'Ajout de l\'article annulé.'}})
       return;
   }
   // Vérification de la date de sortie si elle est activée
   if(newArticle.value.datesortiebool && (newArticle.value.datesortie == '' || newArticle.value.datesortie == null)) {
       addAlert('error', {data:{error: 'Vous devez définir une date de sortie (ou décocher la case).', message:'Ajout de l\'article annulé.'}})
       return;
   }

   // Enlever les couleurs de fond dans la description
   const cleanedDescription = removeBackgroundColors(newArticle.value.art_description);

   const requestData = {
       art_title: newArticle.value.title,
       art_description: cleanedDescription,
       art_pin: newArticle.value.pinned,
   };

   // Ajout de la date de sortie au requestData si activée
   if(newArticle.value.datesortiebool) {
       requestData.art_datesortie = newArticle.value.datesortie;
   }

   var rep = ref();
   await request("POST", true, rep, config.apiUrl+'api/article', requestData);

   if(rep.value.status == 201){
       if(newArticle.value.image != null){
           try{
               const formData = new FormData();
               formData.append('image', newArticle.value.image);
               formData.append('fileName', 'img_art_' + rep.value.article.art_id);
               formData.append('filePath', 'private/images/articles');
               formData.append('articleId', rep.value.article.art_id);
               
               await request('POST', true, response, config.apiUrl+'api/image/uploadarticle', formData)        
           } catch (error){
               console.log("Erreur ajout image: "+error)
           }
       }
        if(files.value.newFiles != null){ //Permet d'enregistrer de nouveau document et de les associer au nouvel article
            for(const doc in files.value.newFiles) {
                try{
                    const formDataNewDoc = new FormData();
                    formDataNewDoc.append('file', files.value.newFiles[doc].file);
                    formDataNewDoc.append('title', files.value.newFiles[doc].name);
                    formDataNewDoc.append('folder', '/admin/article');
                    formDataNewDoc.append('articleId', rep.value.article.art_id);
                    formDataNewDoc.append('isNewOrOverride', "true");

                    console.log("post new")
                    await request('POST', true, response, config.apiUrl + 'api/documents/article', formDataNewDoc)
                } catch (error){
                    console.log("Erreur ajout image: "+error)
                }
            };
        }
       if(files.value.existingFiles != null){ //Permet d'associer des doucments pré-existant au nouvel article 
            for(const doc in files.value.existingFiles) {
                try{                    
                    const formDataExistingDoc = new FormData();
                    formDataExistingDoc.append('fileId', files.value.existingFiles[doc].file_id);
                    formDataExistingDoc.append('articleId', rep.value.article.art_id);
                    formDataExistingDoc.append('isNewOrOverride', "false");

                    await request('POST', true, response, config.apiUrl + 'api/documents/article', formDataExistingDoc)                  
                } catch (error){
                    console.log("Erreur ajout image: "+error)
                }
            };
        }
       addAction(accountStore.account.acc_id, 'article', response, 'Ajout de l\'article '+rep.value.article.art_title+'.');
       await fetchAll();
       resetInput();
   }
}

function removeBackgroundColors(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.getElementsByTagName('*');
    
    function extractRGB(color) {
        
        // Si la couleur est au format rgb() ou rgba()
        const matches = color.match(/\d+/g);
        if (matches && !color.startsWith('#')) {
            const rgb = {
                r: parseInt(matches[0]),
                g: parseInt(matches[1]),
                b: parseInt(matches[2])
            };
            return rgb;
        }
        
        // Si la couleur est au format hexadécimal
        if (color.startsWith('#')) {
            const hex = color.slice(1); // Enlève le #
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            
            const rgb = { r, g, b };
            return rgb;
        }
        
        return null;
    }

    function isNearBlackOrWhite(rgb) {
        if (!rgb || rgb.r === undefined || rgb.g === undefined || rgb.b === undefined) {
            return { isBlack: false, isWhite: false };
        }

        const { r, g, b } = rgb;
        const blackThreshold = 30;
        const whiteThreshold = 225;

        const isBlack = r <= blackThreshold && g <= blackThreshold && b <= blackThreshold;
        const isWhite = r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold;

        return { isBlack, isWhite };
    }

    
    for (let element of elements) {
        // Traitement des balises <font> avec attribut color
        if (element.tagName === 'FONT' && element.hasAttribute('color')) {
            const fontColor = element.getAttribute('color');
            const rgb = extractRGB(fontColor);
            if (rgb) {
                const { isBlack, isWhite } = isNearBlackOrWhite(rgb);
                if (isBlack || isWhite) {
                    element.removeAttribute('color');
                }
            }
        }

        // Le reste du code reste identique...
        if (element.style.backgroundColor) {
            element.style.backgroundColor = '';
        }

        if (element.style.color) {
            const rgb = extractRGB(element.style.color);
            if (rgb) {
                const { isBlack, isWhite } = isNearBlackOrWhite(rgb);
                if (isBlack || isWhite) {
                    element.style.color = '';
                }
            }
        }

        const computedStyle = window.getComputedStyle(element);
        const computedColor = computedStyle.color;
        
        if (computedColor) {
            const rgb = extractRGB(computedColor);
            if (rgb) {
                const { isBlack, isWhite } = isNearBlackOrWhite(rgb);
                if (isBlack || isWhite) {
                    element.style.color = '';
                }
            }
        }
    }

    const finalHTML = doc.body.innerHTML;
    return finalHTML;
}

function resetInput(){
    // Reset du formulaire
    newArticle.value.title = '';
    newArticle.value.art_description = '';
    newArticle.value.pinned = false;
    newArticle.value.image = null;
    newArticle.value.datesortie = '';
    imagePreview.value = null;
    editorRef.value.clear();

    files.value.existingFiles = {};
    files.value.newFiles = {};
    recapNewDoc.value = [];
    modifiedArticleFiles.value = [];
    const fileselect = document.querySelector("#file_select");
    const fileadd = document.querySelector("#file_add");
    fileselect.value = null;
    fileadd.value = null;
}

// Suppression d'article
async function removeArticle(title, id){
    closeModal()
    await request('DELETE', true, response, config.apiUrl+'api/article/deletebyid/'+id);
    if(response.value.status == 202){
        addAction(accountStore.account.acc_id, 'article', response, 'Suppression de l\'article '+title+'.');
    }
    await fetchAll();
}

// Gestion de la modification d'article
// Modifie la ref par l'article qu'on veut modifier
// pour afficher les bonnes informations dans le form de modif
function modifArticle(article) {
    currentArticleModif.value.art_id = article.art_id;
    currentArticleModif.value.art_title = article.art_title;
    currentArticleModif.value.art_description = article.art_description;
    currentArticleModif.value.art_pin = article.art_pin;
    currentArticleModif.value.art_image = article.art_image;
    currentArticleModif.value.art_datesortiebool = true;
    currentArticleModif.value.art_datesortie = article.art_datesortie;
    currentArticleModif.value.documents = article.documents;
    
    const editor = document.querySelector('.editor-content');
    editor.innerHTML = currentArticleModif.value.art_description;
    isEditing.value = true;

    newArticle.value.title = currentArticleModif.value.art_title;
    newArticle.value.pinned = currentArticleModif.value.art_pin;
    newArticle.value.datesortie = currentArticleModif.value.art_datesortie;
    newArticle.value.datesortiebool = currentArticleModif.value.art_datesortiebool;
    const element = document.getElementById('page_title');
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth'
        });
    }
    // Mettre à jour l'image de prévisualisation pour la modification
    if (article.art_image) {
        imagePreviewModif.value = `${config.apiUrl}api/article/image/${article.art_id}`;
    } else {
        imagePreviewModif.value = `${config.apiUrl}images/no_image.jpg`;
    }

    //Récupère les fichiers de l'article pour pouvoir les sélectionner parmis les fichiers existants
    files.value.existingFiles = {};
    for(const file in currentArticleModif.value.documents){
        const id = currentArticleModif.value.documents[file].doc_id;
        modifiedArticleFiles.value.push(id)
        files.value.existingFiles[id] = {
            file_id: id,
        };
    }
    files.value.newFiles = {};
    const fileadd = document.querySelector("#file_add");
    fileadd.value = null;
    recapNewDoc.value = [];
}

// Annulation de la modification d'article, remise a 0 des valeurs
function cancelModifArticle() {
    isEditing.value = false;
    // Réinitialiser les valeurs
    currentArticleModif.value = {};
    newArticle.value.title = '';
    newArticle.value.art_description = '';
    newArticle.value.pinned = false;
    newArticle.value.image = null;
    newArticle.value.datesortie = '';
    newArticle.value.datesortiebool = false;
    imagePreview.value = null;
    imagePreviewModif.value = null;
    const editor = document.querySelector('.editor-content');
    editor.innerHTML = '';

    files.value.existingFiles = {};
    files.value.newFiles = {};
    recapNewDoc.value = [];
    modifiedArticleFiles.value = [];
    const fileselect = document.querySelector("#file_select");
    const fileadd = document.querySelector("#file_add");
    fileselect.value = null;
    fileadd.value = null;
}

// confirmation de modification d'article
async function confirmModifArticle() {

    if(currentArticleModif.value.art_title == '' || currentArticleModif.value.art_title == null){
       addAlert('error', {data:{error: 'Vous devez mettre un titre à votre article.', message:'Ajout de l\'article annulé.'}})
       return;
    }
    if(currentArticleModif.value.art_description == '' || currentArticleModif.value.art_description == null){
        addAlert('error', {data:{error: 'Vous devez mettre une description à votre article.', message:'Ajout de l\'article annulé.'}})
        return;
    }
    // Vérification de la date de sortie si elle est activée
    if(currentArticleModif.value.art_datesortiebool && (currentArticleModif.value.art_datesortie == '' || currentArticleModif.value.art_datesortie == null)) {
        addAlert('error', {data:{error: 'Vous devez définir une date de sortie (ou décocher la case).', message:'Ajout de l\'article annulé.'}})
        return;
    }

    const editor = document.querySelector('.editor-content');
    const cleanedDescription = removeBackgroundColors(editor.innerHTML);

    const requestData = { 
        art_id: currentArticleModif.value.art_id,
        art_title: newArticle.value.title,
        art_pin: newArticle.value.pinned,
        art_description: cleanedDescription
    };

       // Ajout de la date de sortie au requestData si activée
   if(newArticle.value.datesortiebool) {
       requestData.art_datesortie = newArticle.value.datesortie;
   }
   console.log(requestData);
    await request('PUT', true, response, config.apiUrl + 'api/article', requestData);
    if (response.value.status === 200) {
        if(currentArticleModif.value.art_image){
            try {
                if (currentArticleModif.value.art_image instanceof File) {
                    const formData = new FormData();
                    formData.append('image', currentArticleModif.value.art_image);
                    formData.append('fileName', 'img_art_' + currentArticleModif.value.art_id);
                    formData.append('filePath', 'private/images/articles');
                    formData.append('articleId', currentArticleModif.value.art_id);
                    await request('POST', true, response, config.apiUrl + 'api/image/uploadarticle', formData);
                }
                else{
                }
            } catch (error) {
                console.log("Erreur ajout image: " + error);
            }
        }

        await request('GET', false, response, config.apiUrl + 'api/article/unlinkdocuments/'+currentArticleModif.value.art_id)

        if(files.value.newFiles != null){ //Permet d'enregistrer de nouveau document et de les associer au nouvel article
            for(const doc in files.value.newFiles) {
                try{
                    const formDataNewDoc = new FormData();
                    formDataNewDoc.append('file', files.value.newFiles[doc].file);
                    formDataNewDoc.append('title', files.value.newFiles[doc].name);
                    formDataNewDoc.append('folder', '/admin/article');
                    formDataNewDoc.append('articleId', currentArticleModif.value.art_id);
                    formDataNewDoc.append('isNewOrOverride', "true");

                    console.log("post new")
                    await request('POST', true, response, config.apiUrl + 'api/documents/article', formDataNewDoc)
                } catch (error){
                    console.log("Erreur ajout image: "+error)
                }
            };
        }
       if(files.value.existingFiles != null){ //Permet d'associer des doucments pré-existant au nouvel article 
            for(const doc in files.value.existingFiles) {
                try{                    
                    const formDataExistingDoc = new FormData();
                    formDataExistingDoc.append('fileId', files.value.existingFiles[doc].file_id);
                    formDataExistingDoc.append('articleId', currentArticleModif.value.art_id);
                    formDataExistingDoc.append('isNewOrOverride', "false");

                    console.log(formDataExistingDoc)
                    await request('POST', true, response, config.apiUrl + 'api/documents/article', formDataExistingDoc)                  
                } catch (error){
                    console.log("Erreur ajout image: "+error)
                }
            };
        }

        addAction(accountStore.account.acc_id, 'article', response, 'Modification de l\'article ' + currentArticleModif.value.art_title + '.');
        cancelModifArticle();
        await nextTick();
        await fetchAll();
        resetInput();
    }
}

// récupération des données
async function fetchAll(){
    await request('GET', false, articles, config.apiUrl+'api/article');
    await request('GET', false, existingDocuments, config.apiUrl+'api/documents/article');
    isEditing.value = false;
}

//Partie Ajout de fichiers
const existingDocuments = ref({});
const modifiedArticleFiles=ref([]);
const recapNewDoc=ref([]);
const files = ref({
        existingFiles: ref([]),
        newFiles: {}
    });

    const handleFileInputChangeDocument = (event, fileType) => {

        //Supression doc enregistrés pour écraser les données
        files.value[fileType] = {};

        if (fileType == "existingFiles"){
            //Créé un array avec les valeurs sélectionnées par l'utilisateur
            const selectedOptions = Array.from(event.target.selectedOptions);
            const idFilesAdded = selectedOptions.map(option => option.value);

            //Stocke les ids (créé un objet à chaque fois)
            if (idFilesAdded.count != 0) {
                for(const id of idFilesAdded){
                files.value.existingFiles[id] = {
                    file_id: id,
                };
                }
            } else {
                files.value[fileType] = {};
            }
        }
        else{
            //Récupère les fichiers sélectionnées par l'utilisateur
            const filesadded = event.target.files;
            recapNewDoc.value = [];

            //Stocke les fichiers (créé un objet à chaque fois)
            if (filesadded.count != 0) {

                for (var i = 0; i < event.target.files.length; ++i) {
                    const file = event.target.files.item(i)
                    recapNewDoc.value.push(file.name);

                    files.value.newFiles[i] = {
                        file: file,
                        name: file.name,
                    };
                }
            } else {
                files.value[fileType] = {};
            }
        }
    };
onMounted(fetchAll);
</script>
