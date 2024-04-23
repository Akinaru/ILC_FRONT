<template>
    <div class="bg-base-300 w-full my-2 p-2">

        <div class="flex justify-between items-center">
            <div class="flex items-center justify-center">
                <p v-if="article.art_pin" class="">
                    <div class="badge badge-primary mx-2">Épinglé</div>
                </p>
                <p class="text-lg font-bold">{{ article.art_title }}</p>
            </div>

            <p>{{ article.art_datetime }}</p>

        </div>
        <p>{{ article.art_description }}</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        article: Object
    })
</script>