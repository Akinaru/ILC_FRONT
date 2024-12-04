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
  import { onMounted, onUnmounted } from 'vue';
  import { useAccountStore } from './stores/accountStore';
  import HeaderComp from './components/utils/HeaderComp.vue';
  import FooterComp from './components/utils/FooterComp.vue';
  import AlertContainer from './components/utils/AlertContainer.vue';
  import config from './config';
  import router from './router';
import { addAlert } from './composables/addAlert';

// Fonction pour vérifier l'état de connexion
async function checkUserLogin() {
    try {
        const accountStore = useAccountStore();
        const response = await fetch(config.apiUrl + 'cas.php' + '?check_login=true');
        
        if (response.ok) {
            const data = await response.json();
            const isLogged = data.logged_in;
            const userLogin = data.login;
            
            if (!isLogged) {
                accountStore.logoutAccount();
                // Vérifie si la route actuelle nécessite une authentification
                if (router.currentRoute.value.meta?.requiresAuth) {
                  
                    addAlert('error', {
                      data: { 
                          error: 'Vous avez été déconnecté automatiquement.', 
                          message: 'Vous avez été redirigé vers la page d\'accueil.' 
                      }
                    }, null);
                    router.push({ name: 'Accueil' });
                }
            }

            return [isLogged, userLogin];
        } else {
            console.error("Erreur lors de la vérification de l'état de connexion.");
            return [false, null];
        }
    } catch (error) {
        console.error('Erreur réseau :', error);
        return [false, null];
    }
}

  // Déclenche la vérification toutes les 5 minutes
  let intervalId;
  onMounted(() => {
    checkUserLogin(); // Appelle une fois la fonction au montage du composant
    intervalId = setInterval(checkUserLogin, 1 * 30 * 1000); // Répète toutes les 5 minutes
  });

  onUnmounted(() => {
    clearInterval(intervalId); // Nettoie l'intervalle au démontage
  });
</script>


<style>

html, body {
  overscroll-behavior-y: contain; /* Empêche le scroll au-delà des limites de la page */
  overflow-x: hidden; /* Empêche le scroll horizontal */
}

#content {
  position: relative;
  z-index: 1;
}

header {
  position: relative;
}

.modal-box{
  z-index: 1001;
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