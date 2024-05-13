<template>
    <div class="m-5">
         {{ accountStore }}
    </div>

</template>

<script setup>
    import { useAccountStore } from '../../stores/accountStore';
    import { storeToRefs } from 'pinia'


    const accountStore = useAccountStore();
    const { login } = storeToRefs(accountStore)

</script>