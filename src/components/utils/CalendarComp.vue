<template>
    <div class="bg-base-300 w-fit p-5 drop-shadow-lg">
      <div class="py-3 w-4/5 flex">
        <select id="month" v-model="selectedMonth" class="p-2 mx-1 w-full font-bold drop-shadow-lg">
          <option v-for="(month, index) in months" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
  
        <select id="year" v-model="selectedYear" class="p-2 mx-1 w-full font-bold drop-shadow-lg">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
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
              class="p-3 lg:p-5 font-bold hover:cursor-pointer transition-opacity  select-none hover:opacity-60 hover:bg-base-200 " 
              v-for="day in week" 
              :key="day.date" 
              :class="{ 'font-normal opacity-60 ': day.isNotMonth, 'bg-base-100 drop-shadow-lg': day.isToday }"
            >
              {{ day.date }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
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
  
      const calendar = computed(() => {
        const year = selectedYear.value;
        const month = selectedMonth.value;
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
  
        const daysArray = [];
        
        // Days from previous month
        const prevMonthDays = startDay;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const prevMonthNumDays = daysInMonth(prevMonthYear, prevMonth);
        for (let i = prevMonthNumDays - prevMonthDays + 1; i <= prevMonthNumDays; i++) {
          daysArray.push({ date: i, isNotMonth: true, isToday: false });
        }
  
        // Days of the current month
        for (let i = 1; i <= numDays; i++) {
          const isToday = year === currentYear && month === currentMonth && i === currentDate;
          daysArray.push({ date: i, isNotMonth: false, isToday });
        }
  
        // Days from next month
        const nextMonthDays = (42 - daysArray.length);
        for (let i = 1; i <= nextMonthDays; i++) {
          daysArray.push({ date: i, isNotMonth: true, isToday: false });
        }
  
        const weeks = [];
        while (daysArray.length > 0) {
          weeks.push(daysArray.splice(0, 7));
        }
  
        return weeks;
      });
  
      return {
        months,
        days,
        years,
        selectedMonth,
        selectedYear,
        calendar
      };
    }
  };
  </script>

  