<template>
    <input type="checkbox" :id="'my_modal_' + dept.dept_id" class="modal-toggle" />
    <div class="modal modal-bottom sm:modal-middle" role="dialog">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Modification du département n° {{ dept.dept_id }}</h3>


            <form @submit.prevent="addDepartment" class="w-full *:my-2">
                <div class="w-full flex items-center justify-between">
                    <label for="colorPicker" class="label-text">Couleur</label> 
                    <input type="color" id="colorPicker" v-model="newDep.color">
                </div>
                <input type="text" placeholder="Nom" v-model="newDep.name" class="input input-bordered w-full " />
                <input type="text" placeholder="Nom raccourci" v-model="newDep.shortname" class="input input-bordered w-full" />
            </form>


            <div class="modal-action">
                <label :for="'my_modal_' + dept.dept_id" class="btn ">Annuler</label>
                <label :for="'my_modal_' + dept.dept_id" class="btn btn-success" @click="editDepartment(dept.dept_id)">Enregistrer</label>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref} from 'vue';
    
    const props = defineProps({
        dept: Object,
    })
    
    const newDep = ref({ 
        name: '',
        shortname: '',
        color: ''
    });
    async function editDepartment(dept_id){
        console.log("modification apportée au départment",dept_id)
    }

</script>