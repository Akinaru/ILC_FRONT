<template>
    <input type="checkbox" :id="'my_modal_' + art_id" class="modal-toggle" />
    <div class="modal modal-bottom sm:modal-middle" role="dialog">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Modification de l'article n° {{ art_id }}</h3>
            <form @submit.prevent="editArticle" class="w-full">
                <!-- Titre -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Titre</span>
                    </div>
                    <input type="text"  class="input input-bordered w-full" v-model="currentArticle.art_title"/>
                </label>
                <!-- Description -->
                <label class="form-control w-full">
                    <div class="label">
                        <span class="label-text">Description</span>
                    </div>
                    <textarea class="textarea w-full textarea-bordered h-96" v-model="currentArticle.art_description"></textarea>
                </label>
                <!-- Epingle -->
                <div class="form-control">
                    <label class="label cursor-pointer">
                        <span class="label-text">Épinglé ?</span> 
                        <input type="checkbox" class="checkbox" v-model="currentArticle.art_pin" />

                    </label>
                </div>
                <div class="modal-action">
                    <label :for="'my_modal_' + art_id" class="btn ">Annuler</label>
                    <button type="submit">
                        <label :for="'my_modal_' + art_id" class="btn btn-success">Enregistrer</label>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
    
    const emits = defineEmits(['articleUpdated']);
    const props = defineProps({
        art_id: Number
    })

    const response = ref([])
    const currentArticle = ref({})

    async function editArticle(){
        const requestData = { 
            art_id: props.art_id,
            art_title: currentArticle.value.art_title,
            art_description: currentArticle.value.art_description,
            art_pin: currentArticle.value.art_pin,
        };

        await request('put', response, config.apiUrl+'api/article', requestData);
        emits('articleUpdated');
    }

    async function fetchAll(){
        const article = ref([]);
        await request('GET', article, config.apiUrl+'api/article/getbyid/'+props.art_id);
        currentArticle.value = {
            art_title: article.value.art_title,
            art_description: article.value.art_description,
            art_pin: article.value.art_pin === 1 ? true : false
        }
    }

    onMounted(fetchAll);


</script>