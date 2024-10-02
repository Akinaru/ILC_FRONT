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
import { onMounted, ref } from 'vue';
import config from './config';
import { request } from './composables/httpRequest';

const accountStore = useAccountStore();
const account = ref([])


async function checkUserLogin() {
  try {
    const response = await fetch(config.apiUrl+'cas.php'+'?check_login=true');
    if (response.ok) {
      const data = await response.json();
      const isLogged = data.logged_in; // Renommez cette variable pour correspondre à ce que vous voulez retourner
      const userLogin = data.login; // Renommez cette variable pour correspondre à ce que vous voulez retourner

      // Mettez à jour le store si nécessaire
      if (isLogged) {
        accountStore.$patch({ logged: true, login: userLogin });
      }

      return [isLogged, userLogin]; // Retournez un tableau avec isLogged et userLogin
    } else {
      console.error('Erreur lors de la vérification de l\'état de connexion.');
      return [false, null]; // Si la réponse n'est pas OK, retournez false et null
    }
  } catch (error) {
    console.error('Erreur réseau :', error);
    return [false, null]; // Si une erreur se produit, retournez false et null
  }
}


onMounted(async () => {
  const [isLogged, userLogin] = await checkUserLogin()
  if(isLogged && userLogin != null){
    await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+userLogin);
    const patchedValues = {
      login: account.value.acc_id,
      fullname: account.value.acc_fullname,
      logged: true,
      last_login: new Date().toISOString(),
      access: account.value.access ? account.value.access.acs_accounttype : 0,
      acc_validateacc: account.acc_validateacc
    }
    accountStore.$patch(patchedValues); // Utilisez uniquement les propriétés nécessaires
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