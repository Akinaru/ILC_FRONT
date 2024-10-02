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
import { useAccountStore } from './stores/accountStore';
import { onMounted } from 'vue';

const accountStore = useAccountStore();

// Subscribe to store changes and save to localStorage
accountStore.$subscribe((mutation, state) => {
  const simplifiedState = {
    last_login: state.last_login,
    // Ajoutez ici d'autres propriétés que vous souhaitez stocker
  };
  localStorage.setItem("account", JSON.stringify(simplifiedState));
});

// Function to check if last_login is more than the specified duration
function checkLoginExpiry() {
  const currentTime = new Date().getTime();
  const lastLoginTime = new Date(accountStore.last_login).getTime();

  // 1 hour in milliseconds
  const oneHour = 24 * 60 * 1000; // Corrected to 3600000

  // Calculate the elapsed time
  const elapsedTime = currentTime - lastLoginTime;

  // Debugging logs
  console.log("last: " + lastLoginTime);
  console.log("current: " + currentTime);
  console.log("elapsed: " + elapsedTime);
  console.log("oneHour: " + oneHour);

  if (elapsedTime > oneHour) {
    accountStore.logoutAccount();
    localStorage.removeItem('account'); // Optionally clear localStorage
  } else {
    // Calculate remaining time
    const remainingTime = oneHour - elapsedTime;
    const remainingMinutes = Math.floor(remainingTime / (60 * 1000));
    const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

    console.log(`Temps restant avant déconnexion: ${remainingMinutes} min ${remainingSeconds} s`);
  }
}

onMounted(() => {
  const accountStorage = localStorage.getItem('account');
  
  if (accountStorage) {
    const parsedAccount = JSON.parse(accountStorage);
    console.log(parsedAccount)
    accountStore.$patch(parsedAccount); // Utilisez uniquement les propriétés nécessaires
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