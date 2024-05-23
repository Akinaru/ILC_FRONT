<template>
    <div class="overflow-x-auto">
    <table class="table table-zebra" v-if="actions && actions.length > 0">
        <!-- head -->
        <thead>
        <tr>
            <th>n°</th>
            <th>Login</th>
            <th>Description</th>
            <th>Date</th>
            <th>Type</th>
        </tr>
        </thead>
        <tbody>
        <!-- row 1 -->
        <tr v-for="(act, index) in actions" :key="index">
            <th>{{ act.act_id }}</th>
            <td>{{ act.acc_id }}</td>
            <td>{{ act.act_description }}</td>
            <td>{{ act.act_date }}</td>
            <td>
                <span v-if="act.dept_id !== null" class="badge badge-primary">Département</span>
                <span v-else-if="act.agree_id !== null" class="badge badge-neutral">Accord</span>
                <span v-else-if="act.art_id !== null" class="badge badge-accent">Article</span>
                <span v-else-if="act.evt_id !== null" class="badge">Evenement</span>
                <span v-else class="badge">No Category</span>
            </td>

        </tr>
        </tbody>
    </table>
    </div>
</template>

<script setup>
    import { request } from '../../composables/httpRequest';
    import { onMounted, ref } from 'vue';
    import config from '../../config';

    const actions = ref([])

    async function fetch(){
        await request('GET', false, actions, config.apiUrl+'api/action');
    }

    onMounted(fetch)

</script>