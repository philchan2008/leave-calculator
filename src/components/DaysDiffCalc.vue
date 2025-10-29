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
            placeholder="Start Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.leaveStartSession"
            :items="['am', 'pm']"
            placeholder="Start Session"
            label="am/pm"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.leaveEndDate"
            label="Resumption Date (exclusive)"
            placeholder="Resumption Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.leaveEndSession"
            :items="['am', 'pm']"
            label="am/pm"
            placeholder="End Session"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>

        <v-row justify="space-around">
          <v-col>
            <v-text-field
              id="daysCount"
              v-model="form.daysCount"
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
              id="daysOfHolidays"
              v-model="form.daysOfHolidays"
              class="text-center m-1"
              hide-spin-buttons
              label="Holiday Days"
              readonly
              variant="outlined"
            />
          </v-col>
          <v-col>
            <v-text-field
              id="daysTaken"
              v-model="form.daysTaken"
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
import { computed, ref, watch, watchEffect, reactive } from 'vue'
import { useDialogStore } from '../../stores/useDialogStore'
import { getHolidays } from '../utils/leaveUtils'
import { useDayDiffStore } from '/stores/daysCalcStore'

const dialog = useDialogStore()

const rules = {
  required: (v) => !!v || 'This field is required',
}

const formRef = ref()
const isFormValid = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = useDayDiffStore()

if (!form.leaveStartDate) form.leaveStartDate = today
if (!form.leaveEndDate) form.leaveEndDate = today

// const form = reactive({
//   leaveStartDate: today,
//   leaveStartSession: "am",
//   leaveEndDate: today,
//   leaveEndSession: "am",
//   daysCount: 0,
//   daysOfHolidays: 0,
//   daysTaken: 0,
// })

function validateLeaveDates() {
  const {
    leaveStartDate, leaveStartSession,
    leaveEndDate, leaveEndSession,
  } = form

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

/**
 * Old System Logic
 *  def day = DateUtils.getStartToEndDateDays(dtLeaveResump, dtLeaveStart)
    if (sessLeaveStart == 'AM' && sessLeaveResump == 'PM') {
        day = day + 0.5
    } else if (sessLeaveStart == 'PM' && sessLeaveResump == 'AM') {
        day = day - 0.5
    }
    if (termsCode == 'L' || json.termsDesc == 'Local Terms') {
        sql = 'select ' + inOpen + '+' + '(' + '(' + day + '-' + daysTaken + ')' + '*' + tempEarningRate + '/' + '365.00' + ')' + '-' + daysTaken
    } else {
        sql = 'select ' + inOpen + '+' + '(' + day + '*' + tempEarningRate + '/' + '365.00' + ')' + '-' + daysTaken
    }
 *
 */


async function calculateLeaveDetails(formData) {
  const start = new Date(formData.leaveStartDate)
  const end = new Date(formData.leaveEndDate)
  const startSess = formData.leaveStartSession
  const endSess = formData.leaveEndSession

  const diffInMs = end.getTime() - start.getTime()
  const countOfDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
    + ((startSess == 'am' && endSess == 'pm') ? +0.5 : 0)
    + ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)

  let countOfHolidays = 0
  const holidays = await getHolidays()
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay()
    const dateStr = d.toISOString().split('T')[0].replaceAll("-","")
    const isWeekend = (day === 0 || day === 6)
    const isCustomHoliday = holidays.some(range =>
      dateStr >= range.dtstart && dateStr <= range.dtend
    )
    if (isWeekend || isCustomHoliday) {
      countOfHolidays++
    }
    //console.log(`Date: ${d}, isWeekend: ${isWeekend}, isCustomHoliday: ${isCustomHoliday}`)
  }

  if (countOfHolidays > countOfDays) {
    countOfHolidays = countOfDays
  }

  formData.daysCount = countOfDays
  formData.daysOfHolidays = countOfHolidays
  formData.daysTaken = countOfDays - countOfHolidays
}

watchEffect(async () => {
  await calculateLeaveDetails(form)
})

</script>

