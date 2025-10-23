<template>
  <v-container class="fill-height" max-width="900">
    <v-toolbar>
      <v-toolbar-title>Leave Calculator</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
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
          <v-select
            v-model="form.earningRate"
            class="w-50"
            :items="earningRateOptions"
            label="Earning Rate"
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
                label="Opening Balance"
                :precision="2"
                readonly
                variant="outlined"
              />
            </v-row>
            <v-row>
              <v-text-field
                v-model="form.closingBal"
                class="text-center m-1"
                label="Closing Balance"
                :precision="2"
                readonly
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


  const form = ref({
    termType: null,
    pensionType: null,
    earningRate: 0,
    lastBal: 0,
    lastBalDate: null,
    lastBalSession: null,
    openingBal: 0,
    closingBal: 0,
    leaveStartDate: null,
    leaveEndDate: null,
    leaveResumeDate: null,
    daysTaken: 0,
    leaveStartSession: null,
    leaveEndSession: null,
    leaveResumeSession: null
  })

  const leaveEarningDays = computed(() => {
    if (!form.value.lastBalDate || !form.value.lastBalSession
      || !form.value.leaveResumeDate || !form.value.leaveResumeSession
    ) return 0
    const startSess = form.value.lastBalSession
    const endSess = form.value.leaveResumeSession
    const start = new Date(form.value.lastBalDate)
    const end = new Date(form.value.leaveResumeDate)
    const daysDiff = Math.ceil( (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    debugger
    const earningDays = daysDiff +
      ((startSess == 'am' && endSess == 'pm') ? 0.5 : 0) +
      ((startSess == 'pm' && endSess == 'am') ? -0.5 : 0)
    return earningDays
  })

  const earningRateNew = [26, 22, 18, 14]
  const earningRateCommon = [34,27,21,14]
  const earningRateLocal = [40.5, 31, 22, 12.5]
  const earningRateContract = [28,14]

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

  function submitFrom() {
    const { leaveStartDate, leaveEndDate, leaveResumeDate, leaveStartSession, leaveEndSession, leaveResumeSession,
      openingBal, closingBal, lastBal,
     } = form.value
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
    const { termType, lastBalDate, lastBalSession,
      leaveStartDate, leaveEndDate, leaveStartSession,
      leaveEndSession, leaveResumeDate, leaveResumeSession,
      daysTaken } = form.value

    if (!leaveStartDate || !leaveEndDate
      || !leaveStartSession || !leaveEndSession
      || !leaveResumeDate || !leaveResumeSession
      || !lastBalDate || !lastBalSession
    ) return true // Skip if incomplete

    const start = new Date(leaveStartDate)
    const end = new Date(leaveEndDate)
    const resume = new Date(leaveResumeDate)

    if (start > end) {
      return 'Start date must be before end date'
    }

    if (resume < end) {
      return 'Resumption date must be after end date'
    }

    if (start.getTime() === end.getTime()) {
      if (leaveStartSession !== 'am' || leaveEndSession !== 'pm') {
        return 'If start and end dates are the same, session must be AM to PM'
      }
    }

    if (end.getTime() === resume.getTime()) {
      if (leaveEndSession !== 'am' || leaveResumeSession !== 'pm') {
        return 'If end date and resumption date are the same, session must be AM to PM'
      }
    }

    //TODO: Add the following checkings later:-
    // 1. contract terms days diff <= days taken,
    // 2. end date to resume duty should not longer than then duty pattern max length

    return true
  }




  // watch(() => form.value.lastBal, (newVal, oldVal) => {
  //   console.log(`lastBal changed: ${oldVal} → ${newVal}`)
  // })

  watch(() => form.value.leaveStartDate, (newVal, oldVal) => {
    //console.log(`leaveStartDate changed: ${oldVal} → ${newVal}`)
    console.log(`leaveEarningDays changed: ${leaveEarningDays.value}`)
  })

  // watch(() => form.value.leaveEndDate, (newVal, oldVal) => {
  //   //console.log(`leaveEndDate changed: ${oldVal} → ${newVal}`)
  //   console.log(`leaveEarningDays changed: ${leaveEarningDays.value}`)
  // })

  watch(() => form.value.leaveResumeDate, (newVal, oldVal) => {
    //console.log(`leaveEndDate changed: ${oldVal} → ${newVal}`)
    console.log(`leaveEarningDays changed: ${leaveEarningDays.value}`)
  })

</script>

