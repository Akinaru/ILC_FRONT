<template>
    <div v-if="events && events.count > 0">
        <CalendarComp :events="events"></CalendarComp>
        {{ events }}
    </div>
</template>

<script setup>
    import CalendarComp from '../../components/utils/CalendarComp.vue';
    import { onMounted, ref } from 'vue'
    import { request } from '../../composables/httpRequest';
    import config from '../../config';

    const events = ref([])

    async function fetch(){
        await request('GET', false, events, config.apiUrl+'api/event')
    }

    onMounted(fetch)
</script>