<template>
    <div class="m-5 flex items-center justify-center md:flex-row flex-col">
        <div class="md:w-1/2 w-4/5 flex items-center flex-col">
            <p class="text-lg font-bold">Liste des utilisateurs</p>
            <div v-if="access && access.count" class="w-full my-2">
                <div v-if="access && access.count > 0">
                    <p>RI (Relations Internationales)</p>
                    <div class="md:m-5 m-1">
                        <div v-for="(acc, index) in access.access[1]" :key="index" class="flex *:my-1">
                            <p class="bg-base-300 p-2 w-full flex items-center"><span class="font-bold mr-1">{{ acc.acc_id }}</span>  <span v-if="acc.account">({{ acc.account.acc_fullname }})</span></p>
                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeAccess(acc.acc_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    <p>Dept (Département)</p>
                    <div class="md:m-5 m-1">
                        <div v-for="(acc, index) in access.access[2]" :key="index" class="flex *:my-1">
                            <p class="bg-base-300 p-2 w-full flex items-center"><span class="font-bold mr-1">{{ acc.acc_id }}</span>  <span v-if="acc.account">({{ acc.account.acc_fullname }})</span></p>
                            <button class="hover:opacity-60 hover:cursor-pointer bg-base-300 flex items-center justify-center p-5" @click="removeAccess(acc.acc_id)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p>Aucun accès n'a été trouvé.</p>
                </div>
            </div>
            <div v-else class="flex items-center justify-center my-20">
                <span class="loading loading-dots loading-lg"></span>
            </div>
        </div>
        <div class="md:w-1/2 w-full flex items-center flex-col">
            <p class="text-lg font-bold">Ajouter un utilisateur</p>
            <form @submit.prevent="addAccess" class="w-2/5 *:my-2">
                <input type="text" placeholder="Login" v-model="newAccess.login" class="input input-bordered w-full " />
                <select class="select select-bordered w-full" v-model="newAccess.access">
                    <option disabled selected>Selectionnez un niveau d'accès</option>
                    <option value="1">1 (Relations Internationales)</option>
                    <option value="2">2 (Département)</option>
                </select>
                <div class="flex items-center justify-center">
                    <button class="btn btn-primary" type="submit">Ajouter l'accès</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

    import { ref, onMounted } from 'vue';
    import { request } from '../../composables/httpRequest.js'
    import config from '../../config'

    const access = ref([]);
    const newAccess = ref({ login: '', access: ''});
    const response = ref([]);


    async function addAccess(){
        const requestData = { 
            acc_id: newAccess.value.login,
            acs_accounttype: newAccess.value.access,
        };
        await request("POST", true, response, config.apiUrl+'api/access', requestData);
        await fetch();
        resetInput();

    }

    async function removeAccess(acc_id){
        await request('DELETE', true, response, config.apiUrl+'api/access/deletebylogin/'+acc_id);
        fetch();
    }

    function resetInput(){
        newAccess.value.login = '';
        newAccess.value.access = document.querySelector('.select').options[0].value;
    }

    async function fetch(){
        await request('GET', false, access, config.apiUrl+'api/access/filtered');
        resetInput();
    }

    onMounted(fetch)
</script>