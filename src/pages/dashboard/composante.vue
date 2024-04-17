<template>
    <div>
        <p>Composante</p>
        {{ composantes }}
    </div>
</template>

<script setup>

    import { onMounted, ref } from 'vue';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    const composantes = ref([]);

    async function fetchAll(){
        await request('GET', composantes, config.apiUrl+'component');
    }

    onMounted(fetchAll);

</script>