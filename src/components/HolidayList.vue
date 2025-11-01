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
          {{ item.dtstart }}
        </div>
      </template>

      <template #item.dtend="{ item }">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ item.dtend }}
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getHolidays } from '@/utils/leaveUtils';

const holidays = ref([]);
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
})

</script>
