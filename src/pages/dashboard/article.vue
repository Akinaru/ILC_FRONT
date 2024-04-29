<template>
    <div>
        <p class="text-xl font-bold">Articles</p>

        <!-- Formulaire d'ajout d'article -->
        <div class="m-5 flex justify-center items-center flex-col">
            <p class="text-lg font-bold">Ajout article</p>
            <form @submit.prevent="addArticle" class="w-2/5 *:my-2">
                <input type="text" placeholder="Titre" v-model="newArticle.title" class="input input-bordered w-full " />
                <textarea class="textarea w-full textarea-bordered h-48" placeholder="Description" v-model="newArticle.description"></textarea>
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Épinglé ?</span> 
                        <input type="checkbox"  checked="checked" class="checkbox" v-model="newArticle.pinned" />
                    </label>
                </div>
                <div class="flex items-center justify-center">
                    <button class="btn btn-primary" type="submit">Ajouter l'article</button>
                </div>
            </form>
        </div>

        <div>
            <p class="text-lg font-bold">Liste article</p>
            <div v-if="articles && articles.length > 0" class="flex flex-col">
                <div v-for="(article, index) in articles" :key="index" class="flex my-1 mx-10">
                    <ArticleComp :article="article"></ArticleComp>
                    <!-- Bouton de modification -->
                    <label :for="'my_modal_'+ article.art_id" class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5">
                        <svg class="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                            <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                        </svg>
                    </label>
                    <!-- Modal de modification d'accord -->
                    
                    <ModifArticleComp :art_id="article.art_id" @articleUpdated="refresh"></ModifArticleComp>
                    

                    <!-- Bouton de suppression -->
                    <button class="hover:opacity-60 p-5 hover:cursor-pointer bg-base-300" @click="removeArticle(article.art_id)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref } from 'vue';
    import config from '../../config';
    import { useRouter } from 'vue-router'
    
    import ArticleComp from '../../components/index/ArticleComp.vue';
    import ModifArticleComp from '../../components/modif/ModifArticleComp.vue'

    const router = useRouter();
    const response = ref([]);
    const articles = ref([]);
    const newArticle = ref({ title: '', description: '', pinned: false });


    async function addArticle(){
        const requestData = { 
            art_title: newArticle.value.title,
            art_description: newArticle.value.description,
            art_pin: newArticle.value.pinned 
        };
        await request("POST", response, config.apiUrl+'api/article', requestData);

        await fetchAll();

        newArticle.value.title = '';
        newArticle.value.description = '';
        newArticle.value.pinned = false;

    }

    async function removeArticle(id){
        await request('DELETE', response, config.apiUrl+'api/article/deletebyid/'+id);
        await fetchAll();
    }

    async function fetchAll(){
        await request('GET', articles, config.apiUrl+'api/article');
    }
    function refresh(){
        router.go(0);
    }


    onMounted(fetchAll);
</script>
