<template>
  <div>
    <HeaderComp/>
    <div id="content" class="mt-37 m-5 min-h-screen">
      <RouterView  />
    </div>
    <AlertContainer />
    <FooterComp></FooterComp>
  </div>
</template>

<script setup>
  import HeaderComp from './components/utils/HeaderComp.vue';
  import FooterComp from './components/utils/FooterComp.vue';
  import AlertContainer from './components/utils/AlertContainer.vue'
  import { useAccountStore } from './stores/accountStore';
  import { onMounted } from 'vue';

  const accountStore = useAccountStore();

  accountStore.$subscribe(function(mutation, state){
    localStorage.setItem("account", JSON.stringify(state));
  });

  onMounted(function(){
    const accounStorage = localStorage.getItem('account');
    if(accounStorage){
      accountStore.$patch(JSON.parse(accounStorage));
    }
  })
</script>