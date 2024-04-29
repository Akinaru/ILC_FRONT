<template>
    <input type="checkbox" :id="'my_modal_' + article.art_id" class="modal-toggle" />
    <div class="modal modal-bottom sm:modal-middle" role="dialog">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Modification de l'article n° {{ article.art_id }}</h3>
            <form @submit.prevent="editArticle" class="w-full *:my-2">
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Titre</span>
                    </div>
                    <input type="text"  class="input input-bordered w-full" v-model="currentArticle.art_title"/>
                </label>
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Description</span>
                    </div>
                    <textarea class="textarea w-full textarea-bordered h-96" v-model="currentArticle.art_description"></textarea>
                </label>
            </form>
            <div class="modal-action">
                <label :for="'my_modal_' + article.art_id" class="btn ">Annuler</label>
                <label :for="'my_modal_' + article.art_id" class="btn btn-success" @click="editArticle(article.art_id)">Enregistrer</label>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref} from 'vue';
    
    const props = defineProps({
        article: Object,
    })

    const currentArticle = ref({
        art_title: props.article.art_title,
        art_description: props.article.art_description,
    })

    async function saveArticle(){
        
    }

    async function editArticle(art_id){
        console.log("modification apportée à l'article",art_id)
    }

</script>