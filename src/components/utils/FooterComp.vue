<template>
    <footer class="footer footer-center bg-base-300 text-base-content rounded p-10">
    <nav class="grid grid-flow-col gap-4">
        <RouterLink :to="{name: 'Evenement'}" class="link link-hover">Événements</RouterLink>
        <RouterLink :to="{name: 'Articles'}" class="link link-hover">Articles</RouterLink>
        <RouterLink v-if="!accountStore.isLogged()" :to="{name: 'Login'}" class="link link-hover">Connexion</RouterLink>
        <RouterLink v-else :to="{name: 'Dashboard'}" class="link link-hover">Profil</RouterLink>
    </nav>
    <nav>
        <div class="grid grid-flow-col gap-4">
            <RouterLink :to="{ name: 'Accueil' }" class="hover:opacity-80 transition-all hover:scale-105">
                <img :src="config.apiUrl + 'images/LOGOS/Logo_ILC_couleur_complet.png'" alt="ILC" class="h-16">
            </RouterLink>
            <a href="https://www.univ-smb.fr/iut-annecy/" class="hover:opacity-80 transition-all hover:scale-105">
                <img :src="config.apiUrl + 'images/LOGOS/Logo_IUT_Annecy_Bleu.png'" alt="ILC" class="h-14">
            </a>
        </div>
    </nav>
    <aside>
        <p>Copyright © {{ date }} ILC - Tous droits réservés. <span class="link link-hover">Mentions légales</span></p>
    </aside>
    </footer>
</template>
    
<script setup>
    import config from '../../config'
    import {ref} from 'vue'
    import { useAccountStore } from '../../stores/accountStore';
    const accountStore = useAccountStore();

    const date = ref('')
    date.value = new Date().getFullYear();
</script>