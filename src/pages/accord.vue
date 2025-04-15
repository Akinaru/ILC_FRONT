<template>
  <div v-if="isLoaded">
    <div v-if="accord && accord.agreement?.agree_id">
      <div class="flex justify-end pb-20">
        <!-- Favoris -->
        <div
          v-if="accountStore.isLogged() && accountStore.isStudent() && accountStore.getAccountValidate()"
          @click="toggleFavoris(accord.agreement.agree_id)"
          class="w-fit group p-2 flex items-center justify-center hover:cursor-pointer hover:scale-105 transition-all"
          :class="{ 'hover:opacity-60': isFavorited(accord.agree_id) }"
        >
          <button class="btn btn-primary">
            <svg
              class="md:w-5 w-4 md:h-5 h-4 transition-all duration-100 ease-in-out"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                :class="{
                  'fill-current': isFavorited(accord.agreement.agree_id),
                  'group-hover:fill-current': !isFavorited(
                    accord.agreement.agree_id
                  ),
                }"
                :fill="
                  isFavorited(accord.agreement.agree_id)
                    ? 'currentColor'
                    : 'none'
                "
                stroke="currentColor"
                stroke-width="2"
                d="M12 .587l3.668 7.429L24 9.753l-6 5.847 1.417 8.265L12 18.896l-7.417 3.969L6 15.6 0 9.753l8.332-1.737L12 .587z"
              />
            </svg>
            <p v-if="!isFavorited(accord.agreement.agree_id)">
              Ajouter aux favoris
            </p>
            <p v-else>Supprimer des favoris</p>
          </button>
        </div>
      </div>
      <div class="flex items-center flex-col text-xl md:text-2xl">
        <div
          class="card bg-base-100 shadow-2xl rounded-2xl overflow-hidden max-w-4xl mx-auto mb-10"
        >
          <!-- En-tête avec drapeau -->
          <div class="card-body items-center text-center p-8">
            <div class="bg-base-300 p-6 rounded-xl shadow-inner mb-8 relative">
              <span class="relative inline-block">
                <span
                  class="fi text-8xl transition-all duration-300 hover:scale-110"
                  :class="
                    'fi-' + (accord.agreement?.partnercountry?.parco_code || '')
                  "
                >
                </span>
                <span
                  v-if="!accord.agreement?.partnercountry?.parco_code"
                  class="absolute inset-0 flex items-center justify-center text-black text-2xl font-bold bg-white rounded-full"
                  >?</span
                >
              </span>
            </div>

            <!-- Informations université -->
            <h2
              class="card-title text-2xl md:text-3xl font-bold text-primary mb-2"
            >
              {{
                accord.agreement?.university?.univ_name ||
                "Université indisponible"
              }}
            </h2>
            <p class="text-2xl mb-6">
              {{
                accord.agreement?.university?.univ_city || "Ville indisponible"
              }}
              <span class="font-semibold"
                >({{
                  accord.agreement?.partnercountry?.parco_name ||
                  "Pays indisponible"
                }})</span
              >
            </p>

            <!-- Départements -->
            <div class="divider text-xl">Départements disponibles</div>
            <div class="flex flex-wrap justify-center gap-2 mb-6">
              <div
                v-if="accord.agreement?.departments?.length > 0"
                class="flex flex-wrap justify-center"
              >
                <div
                  v-for="(dept, index) in accord.agreement?.departments"
                  :key="index"
                >
                  <div
                    v-if="dept.pivot.deptagree_valide"
                    class="badge badge-lg font-bold text-base m-1 shadow-md"
                    :style="{ backgroundColor: dept.dept_color }"
                  >
                    {{ dept.dept_shortname }}
                  </div>
                </div>
              </div>
              <div v-else class="badge badge-outline badge-lg">
                Aucun département
              </div>
            </div>

            <!-- ISCED code -->
            <p
              class="badge badge-secondary badge-outline p-4 font-semibold mb-6"
            >
              {{
                accord.agreement?.isced?.isc_code || "Code ISCED indisponible"
              }}
              -
              {{
                accord.agreement?.isced?.isc_name || "Nom ISCED indisponible"
              }}
            </p>

            <!-- Description -->
            <div
              v-if="accord.agreement && accord.agreement.agree_description"
              class="bg-base-200 p-6 rounded-lg max-w-2xl mx-auto mb-6 italic"
            >
              {{ accord.agreement.agree_description }}
            </div>

            <!-- Lien externe -->
            <a
              v-if="accord.agreement?.agree_lien"
              target="_blank"
              :href="accord.agreement?.agree_lien"
              class="btn btn-outline btn-primary mt-2"
            >
              Visiter le site de l'université
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Autres accords -->
        <p class="flex items-start w-full py-2">
          Autres accords qui pourraient vous plaire:
        </p>
        <div
          class=" w-full h-64 overflow-x-auto whitespace-nowrap flex items-center text-sm"
        >
          <!-- Afficher les autres accords ici -->
          <RouterLink
  :to="{ name: 'Accord', params: { agree_id: item.agree_id } }"
  v-for="(item, index) in accords.agreements"
  :key="index"
  class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 m-2 min-w-80 w-80 h-52 overflow-hidden"
>
  <div class="card-body p-4 flex flex-col justify-between relative">
    <!-- Header with flag and departments -->
    <div class="flex justify-between items-start">
      <!-- Flag or placeholder -->
      <div class="badge badge-lg p-3 bg-base-100">
        <span
          class="fi text-2xl"
          :class="'fi-' + (item.partnercountry?.parco_code || '')"
        ></span>
        <span
          v-if="!item.partnercountry?.parco_code"
          class="text-xl font-bold"
        >?</span>
      </div>
      
      <!-- Departments -->
      <div class="flex flex-wrap gap-1 justify-end max-w-[70%]" v-if="item.departments.length > 0">
        <div
          v-for="(dept, index) in item.departments"
          :key="index"
          class="badge badge-sm font-semibold text-xs"
          :style="{ backgroundColor: dept.dept_color }"
        >
          {{ dept.dept_shortname }}
        </div>
      </div>
      <div v-else class="badge badge-outline badge-sm">
        Aucun département
      </div>
    </div>
    
    <!-- Main content -->
    <div class="mt-2">
      <h2 class="card-title text-lg font-bold line-clamp-2">
        {{ item.university?.univ_name || "Université indisponible" }}
      </h2>
      <p class="text-sm opacity-80">
        {{ item.university?.univ_city || "Ville indisponible" }}
        <span class="font-medium">({{ item.partnercountry?.parco_name || "Pays indisponible" }})</span>
        <span v-if="item.isced?.isc_code" class="badge badge-outline ml-1">{{ item.isced?.isc_code }}</span>
      </p>
    </div>
    
    <!-- Hover overlay -->
    <div class="absolute inset-0 bg-base-300 opacity-0 hover:opacity-80 flex items-center justify-center transition-opacity duration-300">
      <span class="btn btn-ghost btn-circle text-lg">
        <i class="fas fa-arrow-right"></i>
        <span class="ml-2">Voir plus</span>
      </span>
    </div>
  </div>
</RouterLink>
        </div>
      </div>
    </div>
    <div
      v-else
      class="h-full min-h-screen flex flex-col justify-center items-center"
    >
      <p
        class="flex font-bold items-center justify-center text-xl md:text-2xl pb-10"
      >
        Accord introuvable...
      </p>
      <RouterLink
        :to="{ name: 'Accueil' }"
        class="hover:opacity-80 transition-all hover:scale-105"
      >
        <button class="btn btn-primary">Revenir à l'accueil</button>
      </RouterLink>
      <div class="flex flex-col items-center space-y-4">
        <Vue3Lottie
          :animationData="notfound"
          :height="animationWidth"
          :width="animationWidth"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <LoadingComp></LoadingComp>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { request } from "../composables/httpRequest";
import config from "../config";
import LoadingComp from "../components/utils/LoadingComp.vue";
import { useAccountStore } from "../stores/accountStore";
import { Vue3Lottie } from "vue3-lottie";
import notfound from "../animations/notfound.json";
const accountStore = useAccountStore();

const route = useRoute();
const accord = ref([]);
const isLoaded = ref(false);
const accords = ref([]);
const account = ref([]);
const favoris = ref([]);
const response = ref([]);

async function fetchAll() {
  isLoaded.value = false;
  await request(
    "GET",
    false,
    accord,
    config.apiUrl + "api/agreement/getbyid/" + route.params.agree_id
  );
  const requestData = {};
  if (accountStore.isLogged()) {
    await request(
      "GET",
      false,
      favoris,
      config.apiUrl + "api/favoris/getbylogin/" + accountStore.login
    );
    await request(
      "GET",
      false,
      account,
      config.apiUrl + "api/account/getbylogin/" + accountStore.login
    );
    requestData.dept_id = account.value.department
      ? account.value.department.dept_id
      : null;
  }

  let apiUrl = config.apiUrl + "api/agreement/random?";
  if (requestData.dept_id) {
    apiUrl += "dept_id=" + requestData.dept_id + "&";
  }
  if (requestData.dept_id) {
    if (accord.value.agree_id) {
      apiUrl += "agree_id=" + accord.value.agree_id + "&";
    }
    if (accord.value.university && accord.value.university.univ_id) {
      apiUrl += "univ_id=" + accord.value.university.univ_id;
    }
  }

  await request("GET", true, accords, apiUrl);
  document.title = `ILC - ${
    accord.value.agreement?.university?.univ_name ?? "Université indisponible"
  } (${
    accord.value.agreement?.partnercountry?.parco_name ?? "Pays indisponible"
  } [${accord.value.agreement?.isced?.isc_code ?? "??"} - ${
    accord.value.agreement?.isced?.isc_name ?? "Isced indisponible"
  }])`;

  isLoaded.value = true;
}
function isFavorited(agree_id) {
  return favoris.value.favoris.some((favori) => favori.agree_id === agree_id);
}

async function toggleFavoris(agree_id) {
  if (!isFavorited(agree_id)) {
    const requestData = {
      acc_id: accountStore.login,
      agree_id: agree_id,
    };
    await request(
      "post",
      true,
      response,
      config.apiUrl + "api/favoris",
      requestData
    );
    if (response.value.status == 201) {
      favoris.value.favoris.push({
        acc_id: accountStore.login,
        agree_id: agree_id,
      });
    }
  } else {
    await request(
      "delete",
      true,
      response,
      config.apiUrl +
        "api/favoris/delete/" +
        accountStore.login +
        "/" +
        agree_id
    );
    favoris.value.favoris = favoris.value.favoris.filter(
      (favori) =>
        !(favori.acc_id === accountStore.login && favori.agree_id === agree_id)
    );
  }
}
onMounted(fetchAll);

watch(
  () => route.params.agree_id,
  () => {
    fetchAll();
  }
);

//Animations

const screenWidth = ref(window.innerWidth);

const updateDimensions = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateDimensions);
  // Initial calculation
  updateDimensions();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateDimensions);
});

const animationWidth = computed(() => {
  // Ajuste la largeur en fonction de la taille de l'écran, avec une largeur minimale et maximale
  return Math.min(Math.max(screenWidth.value * 0.6, 200), 500);
});
</script>
