<template>
  <div >
    <HeaderComp/>
    <div id="content" class="m-5">
      <RouterView />
    </div>
    <AlertContainer />
  </div>
</template>

<script setup>
  import HeaderComp from './components/HeaderComp.vue';
  import AlertContainer from './components/utils/AlertContainer.vue'
</script>