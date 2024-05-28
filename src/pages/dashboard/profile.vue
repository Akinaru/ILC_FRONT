<template>
    <div v-if="account && account.acc_id">
        <p class="text-xl font-bold py-5 bg-red-600 flex items-center justify-center">{{ account.acc_fullname }}</p>
        <div v-if="wishes.count > 0 ">
            <p>{{ account.acc_fullname }} possède {{ wishes.count }} voeux.</p>
            <p>Voeu 1: 
                <span class="font-bold" v-if="wishes.wishes && wishes.wishes.agree_one">{{ wishes.wishes.agree_one.university.univ_name }} {{ wishes.wishes.agree_one.isced.isc_code }} - {{ wishes.wishes.agree_one.partnercountry.parco_name }}</span>
                <span v-else>Pas de voeu</span> 
            </p>
            <p>
                Voeu 2: <span class="font-bold" v-if="wishes.wishes && wishes.wishes.agree_two">{{ wishes.wishes.agree_two.university.univ_name }} {{ wishes.wishes.agree_two.isced.isc_code }} - {{ wishes.wishes.agree_two.partnercountry.parco_name }}</span>
                <span v-else>Pas de voeu</span> 
            </p>
            <p>
                Voeu 3: <span class="font-bold" v-if="wishes.wishes && wishes.wishes.agree_three">{{ wishes.wishes.agree_three.university.univ_name }} {{ wishes.wishes.agree_three.isced.isc_code }} - {{ wishes.wishes.agree_three.partnercountry.parco_name }}</span>
                <span v-else>Pas de voeu</span> 
            </p>
            <p>
                Voeu 4: <span class="font-bold" v-if="wishes.wishes && wishes.wishes.agree_four">{{ wishes.wishes.agree_four.university.univ_name }} {{ wishes.wishes.agree_four.isced.isc_code }} - {{ wishes.wishes.agree_four.partnercountry.parco_name }}</span>
                <span v-else>Pas de voeu</span> 
            </p>
            <p>
                Voeu 5: <span class="font-bold" v-if="wishes.wishes && wishes.wishes.agree_five">{{ wishes.wishes.agree_five.university.univ_name }} {{ wishes.wishes.agree_five.isced.isc_code }} - {{ wishes.wishes.agree_five.partnercountry.parco_name }}</span>
                <span v-else>Pas de voeu</span> 
            </p>

        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { request } from '../../composables/httpRequest';
    import config from '../../config';
 
    const route = useRoute();
    const acc_id = route.params.acc_id;
    const account = ref([]);
    const wishes = ref([])

    async function fetchAll(){
        await request('GET', false, account, config.apiUrl+'api/account/getbylogin/'+acc_id);
        await request('GET', false, wishes, config.apiUrl+'api/wishagreement/getbylogin/'+acc_id);
    }


    onMounted(fetchAll)

</script>