<template>
  <div >
    <HeaderComp/>
    <div id="content" class="m-5">
      <RouterView />
    </div>
    <div id="alert-container" class="fixed bottom-0 right-0 w-full flex flex-col items-end">
    </div>
  </div>
</template>

<script setup>
  import HeaderComp from './components/HeaderComp.vue';
</script>