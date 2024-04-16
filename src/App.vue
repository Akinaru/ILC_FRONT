<template>
    <HeaderComp/>
    <div id="content" class="m-5">
      <RouterView />
    </div>
</template>

<script setup>
  import { RouterView } from 'vue-router'
  import HeaderComp from './components/HeaderComp.vue';
</script>