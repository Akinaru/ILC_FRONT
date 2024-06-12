<template>
    <div>
        <p class="font-bold text-xl">Imports/Exports</p>
        <div>

            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Accords</span>
                </div>
                <a class="btn btn-success" :href="config.apiUrl+'api/agreement/export'">Exporter les accords en csv</a>

            </label>

            <label class="form-control w-full max-w-xs">
                <div class="label">
                    <span class="label-text">Départements</span>
                </div>
                <a class="btn btn-success" :href="config.apiUrl+'api/department/export'">Exporter les départements en csv</a>
            </label>
        </div>
    </div>
</template>

<script setup>

    import config from '../../config';

</script>
