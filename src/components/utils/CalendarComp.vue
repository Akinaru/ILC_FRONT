<template>
    <div class="bg-base-300 w-fit p-5 drop-shadow-lg">
      <div class="py-3 w-4/5 flex w-full">
        
        <div class="flex items-center justify-center font-bold  w-full *:mx-2">
          <svg @click="previousMonth()" class="select-none hover:opacity-60 hover:cursor-pointer " xmlns="http://www.w3.org/2000/svg" fill="black" width="36" height="36" viewBox="0 0 24 24">
            <path d="M5 12l7-8v6h9v4h-9v6z"/>
          </svg>
        </div>

        <select id="month" v-model="selectedMonth" class="hover:opacity-60 hover:cursor-pointer select-none p-2 mx-1 w-full font-bold drop-shadow-lg">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
  
        <select id="year" v-model="selectedYear" class="hover:opacity-60 hover:cursor-pointer select-none p-2 mx-1 w-full font-bold drop-shadow-lg">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <div class="flex items-center justify-center font-bold  w-full *:mx-2">
          <svg @click="nextMonth()" class="select-none hover:opacity-60 hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="black" width="36" height="36" viewBox="0 0 24 24">
            <path d="M19 12l-7 8v-6H3v-4h9v-6z"/>
          </svg>  
        </div>

      </div>
      
      <table>
        <thead>
          <tr>
            <th class="p-2"  v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="week in calendar" :key="week">
            <td 
                class="font-bold hover:cursor-pointer select-none hover:bg-base-200 hover:opacity-80 relative hover:drop-shadow-lg" 
                v-for="day in week" 
                :key="day.date"
                :class="{ 'font-normal': day.isNotMonth, 'bg-error drop-shadow-lg': day.isToday, 'bg-base-200 drop-shadow-lg': dayHasEvent(day) }"
            >
                <RouterLink 
                    :to="{ 
                        name: 'Evenement', 
                        query: { 
                            date: formatDayQuery(day) 
                        } 
                    }"
                    class="flex items-center justify-center p-3 lg:p-6 transition-all duration-200 ease-in-out"
                >
                    {{ day.date }}
                </RouterLink>
                <span class="scale-70 badge badge-accent absolute top-0 right-0 md:opacity-100 opacity-70" v-if="dayHasEvent(day)">
                    {{ countEventsOnDay(day) }}
                </span>
            </td>
        </tr>

        </tbody>
      </table>
    </div>
  </template>
  
<script setup>
  import { createPinia } from 'pinia';
  import { ref, computed } from 'vue';
  const props = defineProps({
    events: Object,
  });

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

  
  // Retourne la liste correspondante au calendrier avec le mois et l"année séléctionné
  const calendar = computed(() => {
    let year = selectedYear.value;
    let month = selectedMonth.value;
    let numDays = daysInMonth(year, month);
    let startDay = firstDayOfMonth(year, month);

    let daysArray = [];
    
    // Days from previous month
    let prevMonthDays = startDay;
    let prevMonth = month === 0 ? 11 : month - 1;
    let prevMonthYear = month === 0 ? year - 1 : year;
    let prevMonthNumDays = daysInMonth(prevMonthYear, prevMonth);
    for (let i = prevMonthNumDays - prevMonthDays + 1; i <= prevMonthNumDays; i++) {
      daysArray.push({ date: i, isNotMonth: true, monthBefore: true, monthAfter: false, isToday: false });
    }

    // Days of the current month
    for (let i = 1; i <= numDays; i++) {
      let isToday = year === currentYear && month === currentMonth && i === currentDate;
      daysArray.push({ date: i, isNotMonth: false, monthBefore: false, monthAfter: false, isToday });
    }

    // Days from next month
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