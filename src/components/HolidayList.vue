<template>
  <v-card title="Holiday List">
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>

    <v-data-table
      :headers="headers"
      :items="holidays"
      :search="search"
    >
      <template #item.dtstart="{ item }">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ formatDate(item.dtstart[0]) }}
        </div>
      </template>

      <template #item.dtend="{ item }">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ formatDate(item.dtend[0]) }}
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { getHolidays } from '@/utils/leaveUtils';

const holidays = ref([]);

function parseDate(yyyymmdd) {
  const year = yyyymmdd.slice(0, 4);
  const month = yyyymmdd.slice(4, 6);
  const day = yyyymmdd.slice(6, 8);
  return new Date(`${year}-${month}-${day}`);
}

function formatDate(yyyymmdd) {
  const date = parseDate(yyyymmdd);
  return date.toDateString(); // e.g. "01/01/2024" or "1 January 2024"
}

const search = ref('')
const headers = [
  {
    key: 'dtstart',
    title: 'Start Date',
  },
  { key: 'dtend', title: 'End Date' },
  { key: 'summary', title: 'Summary' },
]

onMounted(async () => {
  holidays.value = await getHolidays()
  console.log(holidays.value)
})

</script>
