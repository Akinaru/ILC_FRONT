<template>


  <!-- ILC -->
  <!-- Luc DAMAS -->
  <!-- Maxime GALLOTTA -->

  <div>
    <HeaderComp/>
    <div id="content" class="m-5 min-h-screen">
      <RouterView  />
    </div>
    <AlertContainer />
    <FooterComp></FooterComp>
  </div>
</template>

<script setup>

import HeaderComp from './components/utils/HeaderComp.vue';
import FooterComp from './components/utils/FooterComp.vue';
import AlertContainer from './components/utils/AlertContainer.vue';

</script>


<style>

html {
  overflow-x: hidden;
}

#content {
  position: relative;
  z-index: 1;
}

header {
  position: relative;
  z-index: 1000;
}

.notification-container {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 2000;
}

#alert-container {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1500; 
}

footer {
  position: relative;
}
</style>