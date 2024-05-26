<template>
    <div>
        <p class="text-xl font-bold">Articles</p>

        <!-- Formulaire d'ajout d'article -->
        <div class="m-5 flex justify-center items-center flex-col">
            <p class="text-lg font-bold">Ajout article</p>
            <form @submit.prevent="addArticle" class="w-2/5 *:my-2" enctype="multipart/form-data">
                <input type="file" @change="handleFileInputChange" name="image" accept="image/*" class="file-input file-input-bordered w-full" />
                <input type="text" placeholder="Titre" v-model="newArticle.title" class="input input-bordered w-full" />
                <div class="*:mr-2">
                    <label class="btn" @click="addElem(newArticle, 'link')">Ajouter lien</label>
                    <label class="btn" @click="addElem(newArticle, 'image')">Ajouter Image</label>
                </div>
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
                <div v-if="articles.count > 0">

                    <div v-for="(article, index) in articles.articles" :key="index" class="flex my-1 mx-10">
                        <RouterLink :to="{name: 'Article', params: {art_id: article.art_id}}" class="w-full">
                            <ArticleComp :article="article"></ArticleComp>
                        </RouterLink>
                        <!-- Bouton de modification -->
                        <label for="modal_modif" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="modifArticle(article)">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                                <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            </svg>
                        </label>
                        

                        <!-- Bouton de suppression -->
                        <button class="hover:opacity-60 p-5 hover:cursor-pointer bg-base-300" @click="removeArticle(article.art_title, article.art_id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
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
                <!-- Titre -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Titre</span>
                    </div>
                    <input type="text"  class="input input-bordered w-full" v-model="currentArticleModif.art_title"/>
                </label>
                <div class="*:mr-2 my-2">
                    <label class="btn" @click="addElem(currentArticleModif, 'link')">Ajouter lien</label>
                    <label class="btn" @click="addElem(currentArticleModif, 'image')">Ajouter Image</label>
                </div>
                <!-- Description -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Description</span>
                    </div>
                    <textarea class="textarea w-full textarea-bordered h-96" v-model="currentArticleModif.art_description"></textarea>
                </label>
                <!-- Epingle -->
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Épinglé ?</span> 
                        <input type="checkbox" class="checkbox" v-model="currentArticleModif.art_pin" />

                    </label>
                </div>
                <div class="modal-action">
                    <label for="modal_modif" class="btn ">Annuler</label>
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
    import { onMounted, ref } from 'vue';
    import config from '../../config';
    import axios from 'axios';
    import ArticleComp from '../../components/index/ArticleComp.vue';
    import { useAccountStore } from '../../stores/accountStore';

    const accountStore = useAccountStore();
    const response = ref([]);
    const articles = ref([]);
    const newArticle = ref({ title: '', description: '', pinned: false, image: null });

    const currentArticleModif = ref([]);

    // Gestion du changement d'image dans le formulaire
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        newArticle.value.image = file;
    };

    // Ajout d'article
    async function addArticle(){

        const requestData = {
            art_title: newArticle.value.title, 
            art_description: newArticle.value.art_description, 
            art_pin: newArticle.value.pinned, 
        }

        var rep = ref();
        await request("POST", true, rep, config.apiUrl+'api/article', requestData);
        await fetchAll();

        if(rep.value.status == 201){
            try{

                const formData = new FormData();
                formData.append('image', newArticle.value.image);
                formData.append('fileName', 'img_art_' + rep.value.article.art_id);
                formData.append('filePath', 'private/images/articles');
                formData.append('articleId', rep.value.article.art_id);
                
                await axios.post(config.apiUrl + 'api/image/upload', formData);
            } catch (error){
                console.log("Erreur ajout image: "+error)
            }
            const requestDataAction = {
                act_description: 'Ajout de l\'article '+rep.value.article.art_title+'.',
                acc_id: accountStore.login,
                art_id: rep.value.article.art_id
            }
            await request('POST', false, rep, config.apiUrl+'api/action', requestDataAction)
        }



        // Reset du formulaire
        newArticle.value.title = '';
        newArticle.value.art_description = '';
        newArticle.value.pinned = false;
        newArticle.value.image = null;

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
    }

    // Confirmer la modification
    async function confirmModifArticle(){
        const requestData = { 
            art_id: currentArticleModif.value.art_id,
            art_title: currentArticleModif.value.art_title,
            art_description: currentArticleModif.value.art_description,
            art_pin: currentArticleModif.value.art_pin,
        };
        await request('PUT', true, response, config.apiUrl+'api/article', requestData);
        if(response.value.status == 200){
            const requestDataAction = {
                act_description: 'Modification de l\'article '+currentArticleModif.value.art_title+'.',
                acc_id: accountStore.login,
                art_id: currentArticleModif.value.art_id
            }
            await request('POST', false, response, config.apiUrl+'api/action', requestDataAction)
        }
        fetchAll();
    }
    
    async function fetchAll(){
        await request('GET', false, articles, config.apiUrl+'api/article');
    }

    function addElem(element, type){
        let htmlContent = '';

        if(type === 'link'){
            htmlContent = `<a class='link' href='LIEN_ICI'>NOM_ICI</a>`;
        } else {
            htmlContent = `<img class='max-w-96' src='LIEN_ICI' />`;
        }

        if (element.art_description !== undefined) {
            element.art_description += htmlContent;
        } else {
            element.art_description = htmlContent;
        }
    }

    onMounted(fetchAll);
</script>
