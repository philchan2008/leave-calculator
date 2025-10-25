<template>
  <v-toolbar>
      <v-toolbar-title>Days Counter</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="() => dialog.openHolidayList()">
        <v-icon>mdi-calendar-star</v-icon>
      </v-btn>
      <v-btn icon :to="'/calc'" router>
        <v-icon>mdi-calculator</v-icon>
      </v-btn>
      <v-btn icon :to="'/about'" router>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-toolbar>
  <v-container class="fill-height" max-width="900">
    <v-form ref="formRef" v-model="isFormValid">
      <v-container>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.leaveStartDate"
            label="Start Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.leaveStartSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.leaveEndDate"
            label="End Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.leaveEndSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>

        <v-row justify="space-around">
          <v-col>
            <v-text-field
              v-model="daysCount"
              class="text-center m-1"
              hide-spin-buttons
              label="Days Count"
              readonly
              type="number"
              variant="outlined"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="daysOfHolidays"
              class="text-center m-1"
              hide-spin-buttons
              label="Holiday Days"
              readonly
              variant="outlined"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="daysTaken"
              class="text-center m-1"
              hide-spin-buttons
              label="Duty Days"
              readonly
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useDialogStore } from '../../stores/useDialogStore'
import { getHolidays } from '@/utils/leaveUtils'

const dialog = useDialogStore()

const rules = {
  required: (v) => !!v || 'This field is required',
}

const formRef = ref()
const isFormValid = ref(false)
const daysOfHolidays = ref(0)

const form = ref({
  leaveStartDate: '2025-01-01',
  leaveEndDate: '2025-01-01',
  leaveStartSession: 'am',
  leaveEndSession: 'pm',
})


function validateLeaveDates() {
  const {
    leaveStartDate, leaveStartSession,
    leaveEndDate, leaveEndSession,
  } = form.value

  if (!leaveStartDate || !leaveStartSession
    || !leaveEndDate || !leaveEndSession
  ) return true // Skip if incomplete

  const start = new Date(leaveStartDate)
  const end = new Date(leaveEndDate)

  if (start > end) {
    return 'Start date must be before end date'
  }


  if (start.getTime() === end.getTime()) {
    if (leaveStartSession == 'pm' && leaveEndSession == 'am') {
      return 'If last balance and leave start dates are the same, session must be from AM to PM'
    }
  }

  //TODO: Add the following checkings later:-
  // 1. contract terms days diff <= days taken,
  // 2. end date to resume duty should not longer than then duty pattern max length

  return true
}

const daysCount = computed(() => {
  try {
    const start = new Date(form.value.leaveStartDate)
    const end = new Date(form.value.leaveEndDate)
    const startSess = form.value.leaveStartSession
    const endSess = form.value.leaveEndSession

    const diffInMs = end.getTime() - start.getTime()
    const dayDiff = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      + ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)
      + ((startSess == 'am' && endSess == 'pm') ?  0.5 : 0)

    return dayDiff
  } catch (err) {
    console.log(err.message)
  }
  return 0
})

const daysTaken = computed(() => {
  return daysCount.value - daysOfHolidays.value
})

watchEffect(async () => {
  const start = new Date(form.value.leaveStartDate)
  const end = new Date(form.value.leaveEndDate)
  let count = 0
  const holidays = await getHolidays()
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    const dateStr = d.toISOString().split('T')[0]
    const isWeekend = (day === 0 || day === 6)
    const isCustomHoliday = holidays.some(range => {
        return dateStr >= range.dtstart && dateStr <= range.dtend
    })
    if (isWeekend || isCustomHoliday) {
      count++
    }
  }
  daysOfHolidays.value = count
})

</script>

