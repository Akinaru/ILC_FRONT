<template>
        <div class="m-5">
            <div class="m-5 flex justify-center items-center flex-col pt-72" >
                <p class="text-lg font-bold">Connexion</p>
                <form @submit.prevent="login" class="w-fit *:my-2">
                    <input type="text" placeholder="Login" v-model="newLogin.login" class="input input-bordered w-full " />
                    <div class="flex items-center justify-center">
                        <button class="btn btn-primary" type="submit">Se connecter</button>
                    </div>
                </form>
            </div>
        </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { authLogAccount } from '../composables/authGuard'
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const newLogin = ref({ login: ''});

    const validLogin = ['gallottm', 'ldama', 'martmate', 'vcout', 'sbouc'];

    async function login() {
        if (newLogin.value.login !== null && validLogin.includes(newLogin.value.login)) {
            await authLogAccount(newLogin.value.login, router);
        } else {
            console.log("Le login n'est pas valide.");
        }
    }
</script>
