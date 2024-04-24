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
  import HeaderComp from './components/utils/HeaderComp.vue';
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