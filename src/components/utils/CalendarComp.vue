<template>
  <div class="bg-gradient-to-br from-base-200 to-base-300 w-full max-w-3xl mx-auto p-3 sm:p-4 md:p-6 drop-shadow-xl rounded-xl border border-base-content/10">
    <!-- Header Section -->
    <div class="py-4 w-full flex items-center justify-between mb-4">
      
      <!-- Left Arrow -->
      <div class="flex items-center justify-center">
        <button @click="previousMonth()" class="btn btn-circle btn-ghost text-primary hover:bg-primary/10 transition-all duration-300 btn-sm sm:btn-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24" class="sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path d="M5 12l7-8v6h9v4h-9v6z"/>
          </svg>
        </button>
      </div>

      <!-- Month & Year Selectors -->
      <div class="flex flex-1 mx-2 gap-2">
        <select id="month" v-model="selectedMonth" class="select select-primary w-full font-bold bg-base-100/50 select-sm sm:select-md text-xs sm:text-sm md:text-base">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
    
        <select id="year" v-model="selectedYear" class="select select-primary w-full font-bold bg-base-100/50 select-sm sm:select-md text-xs sm:text-sm md:text-base">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      
      <!-- Right Arrow -->
      <div class="flex items-center justify-center">
        <button @click="nextMonth()" class="btn btn-circle btn-ghost text-primary hover:bg-primary/10 transition-all duration-300 btn-sm sm:btn-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24" class="sm:w-5 sm:h-5 md:w-6 md:h-6">
            <path d="M19 12l-7 8v-6H3v-4h9v-6z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Calendar Table -->
    <div class="overflow-hidden rounded-lg shadow-lg">
      <table class="w-full bg-base-100/50">
        <!-- Day Names Header -->
        <thead>
          <tr class="border-b border-base-300">
            <th v-for="day in days" :key="day" class="p-3 text-center font-bold text-base-content/70">
              {{ day }}
            </th>
          </tr>
        </thead>
        
        <!-- Calendar Days -->
        <tbody>
          <tr v-for="week in calendar" :key="week" class="border-b border-base-300 last:border-0">
            <!-- Day Cells -->
            <td 
              v-for="day in week" 
              :key="day.date"
              class="relative p-1 border-r border-base-300 last:border-0 transition-all duration-200"
              :class="{ 
                'opacity-40': day.isNotMonth, 
                'bg-primary text-primary-content': day.isToday,
                'bg-accent/10': dayHasEvent(day) && !day.isToday
              }"
            >
              <!-- Day Content with Link -->
              <RouterLink 
                :to="{ name: 'Evenement', query: { date: formatDayQuery(day) } }"
                @click="checkAndReload(formatDayQuery(day))"
                class="flex items-center justify-center aspect-square w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full transition-all duration-200"
                :class="day.isToday ? 'hover:bg-primary-focus' : 'hover:bg-base-300/50'"
              >
                <span class="text-xs sm:text-sm md:text-base lg:text-lg font-medium">{{ day.date }}</span>
              </RouterLink>
              
              <!-- Event Badge -->
              <div v-if="dayHasEvent(day)" class="absolute -top-1 -right-1 flex items-center justify-center">
                <span class="badge badge-accent badge-xs sm:badge-sm text-xs animate-pulse">
                  {{ countEventsOnDay(day) }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script setup>
  import { ref, computed } from 'vue';
  import { useRoute} from 'vue-router';
  const props = defineProps({
    events: Object,
  });


  const route = useRoute();
  const months = ref([
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]);
  const days = ref(['L', 'M', 'M', 'J', 'V', 'S', 'D']);
      
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const years = ref(Array.from({ length: 21 }, (_, i) => currentYear - 10 + i));

  const selectedMonth = ref(currentMonth);
  const selectedYear = ref(currentYear);

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (year, month) => {
    return (new Date(year, month, 1).getDay() + 6) % 7;
  };

  function formatDayQuery(day) {
    let year = selectedYear.value;
    let month = selectedMonth.value + 1; // Les mois sont de 0 à 11, donc ajoutez 1 pour obtenir 1 à 12

    if (day.monthBefore) {
        month -= 1;
        if (month < 1) {
            month = 12;
            year -= 1;
        }
    } else if (day.monthAfter) {
        month += 1;
        if (month > 12) {
            month = 1;
            year += 1;
        }
    }

    const dayOfMonth = String(day.date).padStart(2, '0');
    const monthFormatted = String(month).padStart(2, '0');
    return `${dayOfMonth}/${monthFormatted}/${year}`;
  }

  // S'assure de bien refresh la page lors de changement de date du calendrier
  function checkAndReload(path) {
    const queryDate = route.query.date; 
    if (path == queryDate) {
      console.log("same reload")
      window.location.reload();
    } 
  }
  
  // Retourne la liste correspondante au calendrier avec le mois et l"année séléctionné
  const calendar = computed(() => {
    let year = selectedYear.value;
    let month = selectedMonth.value;
    let numDays = daysInMonth(year, month);
    let startDay = firstDayOfMonth(year, month);
    let daysArray = [];
    let prevMonthDays = startDay;
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevMonthYear = month === 0 ? year - 1 : year;
    let prevMonthNumDays = daysInMonth(prevMonthYear, prevMonth);
    for (let i = prevMonthNumDays - prevMonthDays + 1; i <= prevMonthNumDays; i++) {
      daysArray.push({ date: i, isNotMonth: true, monthBefore: true, monthAfter: false, isToday: false });
    }
    for (let i = 1; i <= numDays; i++) {
      let isToday = year === currentYear && month === currentMonth && i === currentDate;
      daysArray.push({ date: i, isNotMonth: false, monthBefore: false, monthAfter: false, isToday });
    }
    let nextMonthDays = (42 - daysArray.length);
    for (let i = 1; i <= nextMonthDays; i++) {
      daysArray.push({ date: i, isNotMonth: true, monthBefore: false, monthAfter: true, isToday: false });
    }
    let weeks = [];
    while (daysArray.length > 0) {
      weeks.push(daysArray.splice(0, 7));
    }
    return weeks;
  });

  const dayHasEvent = (day) => {
    let year = selectedYear.value;
    let month = selectedMonth.value + 1; // Ajoute 1 car les mois dans JavaScript sont indexés à partir de 0

    // Si le jour appartient au mois précédent
    if (day.monthBefore) {
      month--; // Mois précédent
      if (month === 0) {
        month = 12; // Retourner à décembre de l'année précédente
        year--;
      }
    }
    // Si le jour appartient au mois suivant
    else if (day.monthAfter) {
      month++; // Mois suivant
      if (month === 13) {
        month = 1; // Retourner à janvier de l'année suivante
        year++;
      }
    }

    // Construire la date de l'événement
    let eventDate = `${year}-${month.toString().padStart(2, '0')}-${day.date.toString().padStart(2, '0')}`;

    // Vérifier si un événement se produit à cette date
    return props.events.events.some(event => {
      let eventDateTime = event.evt_datetime.split(' ')[0];
      return eventDateTime === eventDate;
    });
  };

  const countEventsOnDay = (day) => {
    let year = selectedYear.value;
    let month = selectedMonth.value + 1; // Ajoute 1 car les mois dans JavaScript sont indexés à partir de 0

    // Si le jour appartient au mois précédent
    if (day.monthBefore) {
      month--; // Mois précédent
      if (month === 0) {
        month = 12; // Retourner à décembre de l'année précédente
        year--;
      }
    }
    // Si le jour appartient au mois suivant
    else if (day.monthAfter) {
      month++; // Mois suivant
      if (month === 13) {
        month = 1; // Retourner à janvier de l'année suivante
        year++;
      }
    }

    // Construire la date de l'événement
    const eventDate = `${year}-${month.toString().padStart(2, '0')}-${day.date.toString().padStart(2, '0')}`;

    // Compter le nombre d'événements à cette date
    return props.events.events.filter(event => {
      const eventDateTime = event.evt_datetime.split(' ')[0];
      return eventDateTime === eventDate;
    }).length;
  };

  // Methode pour changer de mois avec la flèche gauche
  function previousMonth() {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11;
      selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
  }

  // Methode pour changer de mois avec la flèche droite
function nextMonth() {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
}

</script>