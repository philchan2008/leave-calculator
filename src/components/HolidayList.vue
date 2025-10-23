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
        {{ formatDate(item.dtstart[0]) }}
      </template>

      <template #item.dtend="{ item }">
        {{ formatDate(item.dtend[0]) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

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

onMounted(() => {
  axios.get("http://localhost:3001/holidays")
    .then(res => {
      holidays.value = res.data.vcalendar[0].vevent.map(h => ({
        dtstart: h.dtstart,
        dtend: h.dtend,
        summary: h.summary
      }))
      /**
       * vcalendar: [
          {
            dtstart: ["20240101", { value: "DATE" }],
            dtend: ["20240102", { value: "DATE" }],
            summary: "The first day of January"
          },
          {
            dtstart: ["20240210", { value: "DATE" }],
            dtend: ["20240211", { value: "DATE" }],
            summary: "Lunar New Year’s Day"
          }
        */
    })
    .catch(err => {
      showMsg('Error',err.message)
    });
})

</script>
