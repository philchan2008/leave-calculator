<template>
  <v-toolbar>
      <v-toolbar-title>Leave Calculator</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="() => dialog.openHolidayList()">
        <v-icon>mdi-calendar-star</v-icon>
      </v-btn>
      <v-btn icon :to="'/daydiff'" router>
        <v-icon>mdi-calendar-expand-horizontal</v-icon>
      </v-btn>
      <v-btn icon :to="'/about'" router>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-toolbar>
  <v-container class="fill-height" max-width="900">
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
                id="submitBtn"
                class="m-1"
                color="primary"
                style="width: 120px"
                variant="outlined"
                @click="submitFrom"
                :disabled="!isFormComplete"
              >
                Calculate
              </v-btn>
            </v-row>
            <v-row>
              <v-btn
                id="continueBtn"
                class="m-1"
                color="secondary"
                style="width: 120px"
                variant="outlined"
                @click="continueFrom"
                :disabled="!isResultReady"
              >
                Continue
              </v-btn>
              <v-btn
                id="resetBtn"
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
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { formatToNumeric10_2 } from '../utils/leaveUtils'
import { useDialogStore } from '../../stores/useDialogStore'
import { useFormStore } from '/stores/formStore';


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

// const form = ref({
//   termType: "New",
//   pensionType: "NA",
//   earningRate: 14,
//   accuLimit: 28,
//   lastBal: 10,
//   lastBalDate: "2025-01-01",
//   lastBalSession: "am",
//   openingBal: 0,
//   closingBal: 0,
//   leaveStartDate: "2025-01-01",
//   leaveResumeDate: "2025-01-01",
//   daysTaken: 0.5,
//   leaveStartSession: "am",
//   leaveResumeSession: "pm"
// })

const form = useFormStore()

const dialog = useDialogStore();

const rules = {
  required: (v) => !!v || 'This field is required',
}

const formRef = ref()
const isFormValid = ref(false)

// const isFormComplete = computed(() => {
//   return Object.values(form.value).every(val => {
//     // Accept 0 as valid, reject null, undefined, and empty string
//     return val !== null && val !== undefined && val !== '';
//   });
// });

const isFormComplete = computed(() => {
  if (!form) {
    return false; // Safely handle case where form data might not be loaded yet
  }

  // Check if every value in the form is valid
  return Object.values(form).every(val => {
    // Accept 0 as valid, reject null, undefined, and empty string
    return val !== null && val !== undefined && val !== '';
  });
});


//TODO: Complete the checking logic after having the result
const isResultReady = computed(() => {
  if (!form) {
    return false; // Safely handle case where form data might not be loaded yet
  }

  // Check if every value in the form is valid
  return Object.values(form).map(field => {
    return {
      leaveResumeDate: field?.leaveResumeDate,
      leaveResumeSession: field?.leaveResumeSession,
      leaveStartDate: field?.leaveStartDate,
      leaveStartSession: field?.leaveStartSession,
      openingBal: field?.openingBal,
      closingBal: field?.closingBal
    }
  }).every(val => {
    // Accept 0 as valid, reject null, undefined, and empty string
    return val !== null && val !== undefined && val !== '';
  });
});

const earningDaysBeforeLeave = computed(() => {
  if (!form.lastBalDate || !form.lastBalSession
    || !form.leaveStartDate || !form.leaveStartSession
  ) return 0
  const startSess = form.lastBalSession
  const endSess = form.leaveStartSession
  const start = new Date(form.lastBalDate)
  const end = new Date(form.leaveStartDate)
  const daysDiff = Math.ceil( (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  const earningDays = daysDiff +
    ((startSess == 'am' && endSess == 'pm') ? 0.5 : 0) +
    ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)
  return earningDays
})

const earningDays = computed(() => {
  if (!form.leaveStartDate || !form.leaveStartSession
    || !form.leaveResumeDate || !form.leaveResumeSession
  ) return 0
  const startSess = form.leaveStartSession
  const endSess = form.leaveResumeSession
  const start = new Date(form.leaveStartDate)
  const end = new Date(form.leaveResumeDate)
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
  //TODO: to be filtered by lookup API in future, currently list all to let user select
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
  switch (form.termType) {
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

function resetFields(expectFields) {
  for (const key in form) {
    if (!expectFields.includes(key)) {
      if (typeof form[key] === 'number') {
        form[key] = 0
      } else {
        form[key] = null
      }
    }
  }
}

function resetForm() {
  resetFields(["termType","pensionType","earningRate","accuLimit"])
}

function submitFrom() {
  const { lastBal, earningRate, daysTaken
  } = form
  const earnedLeaveBeforeLeave = earningDaysBeforeLeave.value * earningRate / 365
  form.openingBal = Math.min(formatToNumeric10_2(lastBal + earnedLeaveBeforeLeave), form.accuLimit)
  const earnedLeave = earningDays.value * earningRate / 365
  form.closingBal = Math.min(formatToNumeric10_2(form.openingBal - daysTaken + earnedLeave), form.accuLimit)
}

function continueFrom() {
  const lastBal = form.closingBal
  const lastBalDate = form.leaveResumeDate
  const lastBalSession = form.leaveResumeSession
  resetFields(["termType", "pensionType", "earningRate", "accuLimit"])
  form.lastBal = lastBal
  form.lastBalDate = lastBalDate
  form.lastBalSession = lastBalSession
}

function validateLeaveDates() {
  const {
    lastBalDate, lastBalSession,
    leaveStartDate, leaveStartSession,
    leaveResumeDate, leaveResumeSession,
  } = form

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
    if (lastBalSession == 'pm' && leaveStartSession == 'am') {
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

// Rounding the value to min 0.5 day unit
watch(() => form.daysTaken, (val) => {
  const rounded = Math.round(val * 2) / 2;
  if (val !== rounded) {
    form.daysTaken = rounded;
  }
})

</script>

