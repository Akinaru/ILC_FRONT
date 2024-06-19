<template>
    <div>
        <p class="text-xl font-bold">Articles</p>

        <!-- Formulaire d'ajout d'article -->
        <div class="m-5 flex justify-center items-center flex-col">
            <p class="text-lg font-bold">Ajout article</p>
            <form @submit.prevent="addArticle" class="w-2/5 *:my-2" enctype="multipart/form-data">
                <div :style="{ backgroundImage: `url(${backgroundImage})` }" class="bg-cover bg-center w-full h-40"></div>
                <input type="file" @change="handleFileInputChange" name="image" accept="image/*" class="file-input file-input-bordered w-full" />
                <input type="text" placeholder="Titre" v-model="newArticle.title" class="input input-bordered w-full" />
                <textarea class="textarea w-full textarea-bordered h-48" placeholder="Description" v-model="newArticle.art_description"></textarea>
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Épinglé ?</span> 
                        <input type="checkbox"  checked="checked" class="checkbox" v-model="newArticle.pinned" />
                    </label>
                </div>
                <div class="flex items-center justify-center *:mx-1">
                    <label for="modal_apercu" class="btn">Aperçu</label>

                    <button class="btn btn-primary" type="submit">Ajouter l'article</button>
                </div>
            </form>
        </div>
        <!-- Modal aperçu -->
        <input type="checkbox" id="modal_apercu" class="modal-toggle" />
        <div class="modal w-full h-full" role="dialog">
            <div class="modal-box h-full">
                <h3 class="font-bold text-lg">Aperçu article</h3>
                <div class="text-2xl py-2" v-html="newArticle.title"></div>
                <pre v-html="newArticle.art_description"></pre>
                <div class="modal-action">
                    <label for="modal_apercu" class="btn">Fermer</label>
                </div>
            </div>
        </div>
        <!-- Liste des articles -->
        <div>
            <p class="text-lg font-bold">Liste article</p>
            <div v-if="articles && articles.articles" class="flex flex-col py-5">


                <div class="flex flex-wrap justify-start w-full bg-red-105 gap-5" v-if="articles.count > 0">


                    <div v-for="(article, index) in articles.articles" :key="index" class="relative bg-base-300 w-80 md:w-110 h-96 transition-all duration-100 ease-in-out drop-shadow-lg hover:scale-105">
                        <!-- Modification / Suppression -->
                        <div class="flex absolute top-0 right-0 ">
                                <!-- Bouton de modification -->
                                <label for="modal_modif" class="hover:opacity-90 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifArticle(article)">
                                    <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                        <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                    </svg>
                                </label>
                                <!-- Bouton de suppression -->
                                <button class="hover:opacity-90 p-5 hover:cursor-pointer bg-base-300" @click="removeArticle(article.art_title, article.art_id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        <!-- Affichage -->
                        <RouterLink  :to="{name: 'Article', params: {art_id: article.art_id}}" >
                            <div :style="{ backgroundImage: `url(${article.art_image ? config.apiUrl + 'api/article/image/' + article.art_id : config.apiUrl+'images/no_image.jpg'})` }" class="bg-cover bg-center w-full h-48"></div>
                            <span v-if="article.art_pin" class="badge badge-primary absolute top-1 left-1">📌Épinglé</span>
                            <div class="p-4 flex flex-col justify-start h-52">
                                <div class="mb-2">
                                    <p class="font-bold text-xl">{{ article.art_title }}</p>
                                    <p class="text-gray-600 text-sm">Dernière modif: {{ article.art_lastmodif }}</p>
                                </div>
                                <p class="overflow-hidden text-sm text-gray-700 max-h-24">{{ article.art_description }}{{ article.art_description }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div v-else>
                    <p>Aucun article trouvé.</p>
                </div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
    </div>
<!-- Modal de modification d'article -->
<input type="checkbox" id="modal_modif" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle" role="dialog">
    <div class="modal-box">
        <h3 class="font-bold text-lg">Modification de l'article {{ currentArticleModif.art_id }}</h3>
        <form @submit.prevent="confirmModifArticle" class="w-full">
            <!-- Image -->
            <div :style="{ backgroundImage: `url(${backgroundImageModif})` }" class="bg-cover bg-center w-full h-40"></div>
            <!-- Ajout Image -->
            <input type="file" @change="handleFileInputChangeModif" name="image" accept="image/*" class="file-input file-input-bordered w-full" />

            <!-- Titre -->
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Titre</span>
                </div>
                <input type="text"  class="input input-bordered w-full" v-model="currentArticleModif.art_title"/>
            </label>
            <!-- Description -->
            <label class="form-control w-full">
                <div class="label">
                    <span class="label-text">Description</span>
                </div>
                <textarea class="textarea w-full textarea-bordered h-80" v-model="currentArticleModif.art_description"></textarea>
            </label>
            <!-- Epingle -->
            <div class="form-control">
                <label class="flex items-center justify-start cursor-pointer py-1">
                    <input type="checkbox" class="checkbox" v-model="currentArticleModif.art_pin" />
                    <span class="label-text mx-2">Épinglé ?</span> 
                </label>
            </div>
            <div class="modal-action">
                <label for="modal_modif" class="btn">Annuler</label>
                <button type="submit">
                    <label for="modal_modif" class="btn btn-success">Enregistrer</label>
                </button>
            </div>
        </form>
    </div>
</div>
</template>

<script setup>
import { request } from '../../composables/httpRequest';
import { onMounted, ref, computed } from 'vue';
import config from '../../config';
import axios from 'axios';
import { useAccountStore } from '../../stores/accountStore';
import { addAlert } from '../../composables/addAlert';

const accountStore = useAccountStore();
const response = ref([]);
const articles = ref([]);
const newArticle = ref({ title: null, description: null, pinned: false, image: null });

const currentArticleModif = ref([]);
const imagePreview = ref(null);
const imagePreviewModif = ref(null);

// Gestion du changement d'image dans le formulaire
const handleFileInputChange = (event) => {
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
};

const backgroundImage = computed(() => {
    return imagePreview.value ? imagePreview.value : `${config.apiUrl}images/no_image.jpg`;
});
const backgroundImageModif = computed(() => {
    return imagePreviewModif.value ? imagePreviewModif.value : 
        currentArticleModif.value.art_image
        ? `${config.apiUrl}api/article/image/${currentArticleModif.value.art_id}`
        : `${config.apiUrl}images/no_image.jpg`;
});

const handleFileInputChangeModif = (event) => {
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
};

// Ajout d'article
async function addArticle(){

    if(newArticle.value.title == null){
        addAlert(true, {data:{error: 'Vous devez mettre un titre à votre article.', message:'Ajout de l\'article annulé.'}})
        return;
    }
    if(newArticle.value.art_description == null){
        addAlert(true, {data:{error: 'Vous devez mettre une description à votre article.', message:'Ajout de l\'article annulé.'}})
        return;
    }
    const requestData = {
        art_title: newArticle.value.title, 
        art_description: newArticle.value.art_description, 
        art_pin: newArticle.value.pinned, 
    }
    var rep = ref();
    await request("POST", true, rep, config.apiUrl+'api/article', requestData);

    if(rep.value.status == 201){
        try{
            const formData = new FormData();
            formData.append('image', newArticle.value.image);
            formData.append('fileName', 'img_art_' + rep.value.article.art_id);
            formData.append('filePath', 'private/images/articles');
            formData.append('articleId', rep.value.article.art_id);
            
            await request('POST', true, response, config.apiUrl+'api/image/upload', formData)        

        } catch (error){
            console.log("Erreur ajout image: "+error)
        }
        const requestDataAction = {
            act_description: 'Ajout de l\'article '+rep.value.article.art_title+'.',
            acc_id: accountStore.login,
            art_id: rep.value.article.art_id
        }
        await request('POST', false, rep, config.apiUrl+'api/action', requestDataAction);
        await fetchAll();

    }

    // Reset du formulaire
    newArticle.value.title = '';
    newArticle.value.art_description = '';
    newArticle.value.pinned = false;
    newArticle.value.image = null;
    imagePreview.value = null;
}

// Suppression d'article
async function removeArticle(title, id){
    await request('DELETE', true, response, config.apiUrl+'api/article/deletebyid/'+id);
    if(response.value.status == 202){
        const requestDataAction = {
            act_description: 'Suppression de l\'article '+title+'.',
            acc_id: accountStore.login,
            art_id: id
        }
        await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
    }
    await fetchAll();
}

// Gestion de la modification d'article
// Modifie la ref par l'article qu'on veut modifier
// pour afficher les bonnes informations dans le form de modif
function modifArticle(article){
    currentArticleModif.value.art_id = article.art_id;
    currentArticleModif.value.art_title = article.art_title;
    currentArticleModif.value.art_description = article.art_description;
    currentArticleModif.value.art_pin = article.art_pin;
    currentArticleModif.value.art_image = article.art_image;
}

async function confirmModifArticle() {
    const requestData = { 
        art_id: currentArticleModif.value.art_id,
        art_title: currentArticleModif.value.art_title,
        art_description: currentArticleModif.value.art_description,
        art_pin: currentArticleModif.value.art_pin,
    };

    await request('PUT', true, response, config.apiUrl + 'api/article', requestData);

    if (response.value.status === 200) {
        try {
            if (currentArticleModif.value.art_image instanceof File) {
                const formData = new FormData();
                formData.append('image', currentArticleModif.value.art_image);
                formData.append('fileName', 'img_art_' + currentArticleModif.value.art_id);
                formData.append('filePath', 'private/images/articles');
                formData.append('articleId', currentArticleModif.value.art_id);
                await request('POST', true, response, config.apiUrl + 'api/image/upload', formData);
            }
            else{
            }
        } catch (error) {
            console.log("Erreur ajout image: " + error);
        }

        const requestDataAction = {
            act_description: 'Modification de l\'article ' + currentArticleModif.value.art_title + '.',
            acc_id: accountStore.login,
            art_id: currentArticleModif.value.art_id
        };

        await request('POST', false, response, config.apiUrl + 'api/action', requestDataAction);
        await fetchAll();

    }
}



async function fetchAll(){
    await request('GET', false, articles, config.apiUrl+'api/article');
}


onMounted(fetchAll);
</script>
