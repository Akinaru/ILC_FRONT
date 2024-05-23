<template>
    <div class="bg-base-300 w-full p-2 hover:opacity-60 transition-opacity drop-shadow-lg">

        <div class="flex justify-between items-center">
            <div class="flex items-center justify-center">
                <p v-if="article.art_pin" class="">
                    <div class="badge badge-primary mx-2">Épinglé</div>
                </p>
                <p class="text-lg font-bold">{{ article.art_title }}</p>
            </div>

            <p>Dernière modif: {{ article.art_lastmodif }}</p>

        </div>
        <pre class="overflow-hidden whitespace-nowrap text-ellipsis">{{ article.art_description }}</pre>
    </div>
</template>

<script setup>
    const props = defineProps({
        article: Object
    })
</script>