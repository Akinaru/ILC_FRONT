<template>
  <div >
    <HeaderComp/>
    <div id="content" class="m-5">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
  import HeaderComp from './components/HeaderComp.vue';
</script>