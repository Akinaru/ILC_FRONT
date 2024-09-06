<template>
    <RouterLink
        class="hover:opacity-60 sm:w-4/5 w-full bg-base-300 my-2 flex overflow-hidden scale-100 hover:scale-105 transition-all"
        :to="{name: 'EvenementDetail', params: {evt_id: event.evt_id}}"
    >
        <p class="font-bold md:text-xl text-xxxs flex items-center justify-center md:p-5 p-2 ">{{ formatDate(event.evt_datetime) }}</p>
        <div class="flex flex-col w-5/6 items-start justify-center md:py-5 p-2">
            <div class="flex md:items-center items-start justify-start w-full md:flex-row flex-col">
                <span class="badge badge-warning min-w-fit md:badge-md badge-xs md:text-md text-xxxs">{{ event.theme.evthm_name }}</span>
                <p class="font-bold md:mx-3 md:text-base text-xxs">{{ event.evt_name }}</p>
            </div>
            <p class="truncate overflow-hidden w-full whitespace-nowrap md:text-md text-xxs">{{ event.evt_description }}</p>
        </div>
    </RouterLink>
</template>

<script setup>
  const props = defineProps({
    event: Object,
  });

  function formatDate(date) {
        if (!date) return '';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }
</script>