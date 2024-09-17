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
  import AlertContainer from './components/utils/AlertContainer.vue'
  import { useAccountStore } from './stores/accountStore';
  import { onMounted } from 'vue';

  const accountStore = useAccountStore();

// Subscribe to store changes and save to localStorage
accountStore.$subscribe((mutation, state) => {
  localStorage.setItem("account", JSON.stringify(state));
});

// Function to check if last_login is more than 24 hours ago
function checkLoginExpiry() {
  const currentTime = new Date().getTime();
  const lastLoginTime = new Date(accountStore.last_login).getTime();

  // 24 hours in milliseconds
  const hours24 = 24 * 60 * 60 * 1000;

  if (currentTime - lastLoginTime > hours24) {
    accountStore.logoutAccount();
    localStorage.removeItem('account'); // Optionally clear localStorage
  }
}

onMounted(() => {
  const accountStorage = localStorage.getItem('account');
  
  if (accountStorage) {
    accountStore.$patch(JSON.parse(accountStorage));
    checkLoginExpiry();
  }
});
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