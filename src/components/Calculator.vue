<template>
  <v-container class="fill-height" max-width="900">
    <v-toolbar>
      <v-toolbar-title>Leave Calculator</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="listHolidays">
        <v-icon>mdi-calendar</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form ref="formRef" v-model="isFormValid">
      <v-container>
        <v-row justify="space-around">
          <v-select
            v-model="form.termType"
            class="w-50"
            :items="['New', 'Common', 'Local', 'Contract']"
            label="Terms"
            :rules="[rules.required]"
            variant="outlined"
          />
          <v-select
            v-model="form.pensionType"
            class="w-50"
            :items="['100%', '90%', 'NA']"
            label="Pension"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-row>
        <v-row>
          <v-select
            v-model="form.earningRate"
            class="w-50"
            :items="earningRateOptions"
            label="Earning Rate"
            :rules="[rules.required]"
            variant="outlined"
          />
          <v-select
            v-model="form.accuLimit"
            class="w-50"
            :items="earningLimitOptions"
            label="Accumulative Limit"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.lastBalDate"
            label="Balance As Of Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.lastBalSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-number-input
            v-model="form.lastBal"
            label="Last Balance"
            :max="180.00"
            :min="0.00"
            :precision="2"
            :step="0.01"
            variant="outlined"
          />
        </v-row>
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
          <v-number-input
            v-model="form.daysTaken"
            label="Days Taken"
            :max="180.0"
            :min="0.0"
            :precision="1"
            :step="0.5"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.leaveResumeDate"
            label="Resumption Date"
            max-width="368"
            :rules="[rules.required, validateLeaveDates]"
          />
          <v-select
            v-model="form.leaveResumeSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[rules.required, validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-col>
            <v-row>
              <v-text-field
                v-model="form.openingBal"
                class="text-center m-1"
                hide-spin-buttons
                label="Opening Balance"
                readonly
                variant="outlined"
              />
            </v-row>
            <v-row>
              <v-text-field
                v-model="form.closingBal"
                class="text-center m-1"
                hide-spin-buttons
                label="Closing Balance"
                readonly
                type="number"
                variant="outlined"
              />
            </v-row>
          </v-col>
          <v-col class="m-1" cols="5">
            <v-row>
              <v-btn
                class="m-1"
                color="primary"
                style="width: 120px"
                variant="outlined"
                @click="submitFrom"
              >
                Calculate
              </v-btn>
            </v-row>
            <v-row>
              <v-btn
                class="m-1"
                color="secondary"
                style="width: 120px"
                variant="outlined"
                @click="continueFrom"
              >
                Continue
              </v-btn>
              <v-btn
                class="m-1"
                color="secondary"
                style="width: 120px"
                variant="outlined"
                @click="resetForm"
              >
                Reset
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
  <v-dialog v-model="showModal" max-width="400">
    <template #default>
      <v-card>
        <v-card-title class="text-h6">{{ msg.title }}</v-card-title>
        <v-card-text>
          {{ msg.text }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showModal = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
  import { computed, ref, shallowRef, watch } from 'vue'

  const showModal = ref(false)
  const msg = ref({
    title: '',
    text: ''
  })

  const rules = {
    required: (v) => !!v || 'This field is required',
  }

  const formRef = ref()
  const isFormValid = ref(false)

  // const form = ref({
  //   termType: null,
  //   pensionType: null,
  //   earningRate: 0,
  //   accuLimit: 0,
  //   lastBal: 0,
  //   lastBalDate: null,
  //   lastBalSession: null,
  //   openingBal: 0,
  //   closingBal: 0,
  //   leaveStartDate: null,
  //   leaveResumeDate: null,
  //   daysTaken: 0,
  //   leaveStartSession: null,
  //   leaveResumeSession: null
  // })

  const form = ref({
    termType: "New",
    pensionType: "NA",
    earningRate: 26,
    accuLimit: 180,
    lastBal: 10,
    lastBalDate: "2025-01-01",
    lastBalSession: "am",
    openingBal: 0,
    closingBal: 0,
    leaveStartDate: "2025-01-01",
    leaveResumeDate: "2025-01-01",
    daysTaken: 0.5,
    leaveStartSession: "am",
    leaveResumeSession: "pm"
  })

  const earningDaysBeforeLeave = computed(() => {
    if (!form.value.lastBalDate || !form.value.lastBalSession
      || !form.value.leaveStartDate || !form.value.leaveStartSession
    ) return 0
    const startSess = form.value.lastBalSession
    const endSess = form.value.leaveStartSession
    const start = new Date(form.value.lastBalDate)
    const end = new Date(form.value.leaveStartDate)
    const daysDiff = Math.ceil( (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const earningDays = daysDiff +
      ((startSess == 'am' && endSess == 'pm') ? 0.5 : 0) +
      ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)
    return earningDays
  })

  const earningDays = computed(() => {
    if (!form.value.leaveStartDate || !form.value.leaveStartSession
      || !form.value.leaveResumeDate || !form.value.leaveResumeSession
    ) return 0
    const startSess = form.value.leaveStartSession
    const endSess = form.value.leaveResumeSession
    const start = new Date(form.value.leaveStartDate)
    const end = new Date(form.value.leaveResumeDate)
    const daysDiff = Math.ceil( (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const earningDays = daysDiff +
      ((startSess == 'am' && endSess == 'pm') ? 0.5 : 0) +
      ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)
    return earningDays
  })

  const earningRateNew = [26, 22, 18, 14]
  const earningLimitNew = { 26: 78, 22: 66, 18: 54, 14: 28}
  const earningRateCommon = [34, 27, 21, 14]
  const earningLimitCommon = { 34: 102, 27: 81, 21: 63, 14: 28 }
  const earningRateLocal = [49.5, 40.5, 37, 31, 22, 12.5]
  const earningLimitLocal = { 49.5: 180, 40.5: 180, 37: 120, 31: 120, 22: 100, 14: 50 }
  const earningRateContract = [28, 14]
  const earningLimitContract = { 28: 28, 14: 14 }

  const earningLimitOptions = computed(() => {
    const allValues = [
      ...Object.values(earningLimitNew),
      ...Object.values(earningLimitCommon),
      ...Object.values(earningLimitLocal),
      ...Object.values(earningLimitContract)
    ]

    const uniqueSortedValues = [...new Set(allValues)].sort((b, a) => {
      // Numeric sort if values are numbers
      if (typeof a === 'number' && typeof b === 'number') return a - b

      // Lexical sort for strings
      return String(a).localeCompare(String(b))
    })

    return uniqueSortedValues

    //FIXME: This part have deadloop in the program, it needs to fix it later.
    //TODO: Lookup the earning limit base on selected earning rate.
    // if (!form.value.termType) {
    //   return allValues
    // } else {
    //   switch (form.value.termType) {
    //     case 'New':
    //       return earningLimitNew[form.value.earningRate]
    //     case 'Common':
    //       return earningLimitCommon[form.value.earningRate]
    //     case 'Local':
    //       return earningLimitLocal[form.value.earningRate]
    //     case 'Contract':
    //       return earningLimitContract[form.value.earningRate]
    //     default:
    //       return allValues
    //   }
    //}
  })

  const earningRateOptions = computed(() => {
    switch (form.value.termType) {
      case 'New':
        return earningRateNew
      case 'Common':
        return earningRateCommon
      case 'Local':
        return earningRateLocal
      case 'Contract':
        return earningRateContract
      default:
        return earningRateNew
    }
  })

  function showMsg(title, text) {
    msg.value.title = title
    msg.value.text = text
    showModal.value = true
  }

  async function listHolidays() {
    fetch("http://localhost:3001/holidays")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = response.json()
        // Assume `data` is the parsed JSON from the URL
        const holidays = data.vcalendar[0].vevent.map(event => ({
          date: event.dtstart[0],       // Format: YYYYMMDD
          name: event.summary           // Holiday name
        }));

        console.log(holidays);
      })
  }

  function resetForm() {
    for (const key in form.value) {
      if (key !== "termType" && key !== "pensionType" && key !== "earningRate") {
        if (typeof form.value[key] === 'number') {
          form.value[key] = 0
        } else {
          form.value[key] = null
        }
      }
    }
  }

  function formatToNumeric10_2(value) {
    const num = Number.parseFloat(value)
    if (Number.isNaN(num)) return null

    const [intPart, decPart = ''] = num.toFixed(2).split('.')
    if (intPart.length > 8) return null // 10 digits total minus 2 decimals
    return `${intPart}.${decPart}`
  }

  function submitFrom() {
    const { leaveStartDate, leaveResumeDate, leaveStartSession, leaveResumeSession, openingBal, closingBal, lastBal, earningRate, termType, daysTaken
    } = form.value
    const earnedLeaveBeforeLeave = earningDaysBeforeLeave.value * earningRate / 365
    form.value.openingBal = Math.min(formatToNumeric10_2(lastBal + earnedLeaveBeforeLeave), form.value.accuLimit)
    const earnedLeave = earningDays.value * earningRate / 365
    form.value.closingBal = Math.min(formatToNumeric10_2(form.value.openingBal - daysTaken + earnedLeave), form.value.accuLimit)
  }

  function continueFrom() {
    //alert('To be implemented')
    showMsg('Info', 'To be implemented.')
  }

  function calcDayDiff(startDate, startSession, endDate, endSession) {
    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
      ((startSession === 'am' && endSession === 'pm') ? 0.5: 0)
  }

  function validateLeaveDates() {
    const { termType,
      lastBalDate, lastBalSession,
      leaveStartDate, leaveStartSession,
      leaveResumeDate, leaveResumeSession,
      daysTaken } = form.value

    if (!leaveStartDate || !leaveStartSession
      || !leaveResumeDate || !leaveResumeSession
      || !lastBalDate || !lastBalSession
    ) return true // Skip if incomplete

    const start = new Date(lastBalDate)
    const end = new Date(leaveStartDate)
    const resume = new Date(leaveResumeDate)

    if (start > end) {
      return 'Last balance date must be before leave start date'
    }

    if (resume < end) {
      return 'Resumption date must be after leave start date'
    }

    if (start.getTime() === end.getTime()) {
      if (lastBalDate == 'pm' && leaveStartSession == 'am') {
        return 'If last balance and leave start dates are the same, session must be from AM to PM'
      }
    }

    if (end.getTime() === resume.getTime()) {
      if (leaveStartSession == 'pm' && leaveResumeSession == 'am') {
        return 'If leave start and resumption dates are the same, session must be from AM to PM'
      }
    }

    //TODO: Add the following checkings later:-
    // 1. contract terms days diff <= days taken,
    // 2. end date to resume duty should not longer than then duty pattern max length

    return true
  }

</script>

