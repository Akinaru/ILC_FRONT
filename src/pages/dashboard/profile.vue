<template>
    <div v-if="account && account.acc_id">
        {{ account }}
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
 
    const route = useRoute();
    const acc_id = route.params.acc_id;
    const account = ref([]);

    async function fetchAll(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
    }

    onMounted(fetchAll)

</script>