<template>
  <v-container class="fill-height" max-width="900">
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Leave Calculator</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-toolbar>
    <from ref="formRef">
      <v-container>
        <v-row justify="space-around">
          <v-select
            v-model="form.termType"
            class="w-50"
            :items="['New', 'Common', 'Local', 'Contract']"
            label="Terms"
            variant="outlined"
          />
          <v-select
            v-model="form.pensionType"
            class="w-50"
            :items="['100%', '90%', 'NA']"
            label="Pension"
            variant="outlined"
          />
          <v-select
            v-model="form.earningRate"
            class="w-50"
            :items="earningRateOptions"
            label="Earning Rate"
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
            :rules="[validateLeaveDates]"
          ></v-date-input>
          <v-select
            v-model="form.leaveStartSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[validateLeaveDates]"
            style="max-width: 100px"
            variant="outlined"
          />
        </v-row>
        <v-row justify="space-around">
          <v-date-input
            v-model="form.leaveEndDate"
            label="End Date"
            max-width="368"
            :rules="[validateLeaveDates]"
          ></v-date-input>
          <v-select
            v-model="form.leaveEndSession"
            :items="['am', 'pm']"
            label="am/pm"
            :rules="[validateLeaveDates]"
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
          <v-col cols="5" class="m-1" >
            <v-row>
              <v-btn color="primary" @click="submitFrom" variant="outlined" class="m-1" style="width: 120px">
                Calculate
              </v-btn>
            </v-row>
            <v-row>
              <v-btn color="secondary" @click="continueFrom" variant="outlined" class="m-1" style="width: 120px">
                Continue
              </v-btn>
              <v-btn color="secondary" @click="resetForm" variant="outlined" class="m-1" style="width: 120px">
                Reset
              </v-btn>
            </v-row>
         </v-col>
        </v-row>
       </v-container>
    </from>
  </v-container>
</template>

<script setup>
  import { computed, ref, shallowRef, watch } from 'vue'

  const formRef = ref()

  const form = ref({
    termType: null,
    pensionType: null,
    earningRate: 0,
    lastBal: 0,
    openingBal: 0,
    closingBal: 0,
    leaveStartDate: null,
    leaveEndDate: null
  })

  function resetForm() {
    for (const key in form.value) {
      if (typeof form.value[key] === 'number') {
        form.value[key] = 0
      } else {
        form.value[key] = null
      }
    }
  }

  function submitFrom() {
    // submit: function () {
    //     if (!this.checkBeforeSubmit()) return
    //     Promise.all([
    //       this.$http.post('elaps/getCalculatorResult', JSON.stringify(this.selectEntity)),
    //       this.$http({url: 'system/enquiryERALChangeHistory', data: JSON.stringify({userId: this.selectEntity.userId}), method: 'POST'})
    //     ]).then(res => {
    //       let [res1, res2] = res
    //       const data = res1.data
    //       this.selectEntity.openBal = data[0].openBal
    //       this.selectEntity.closeBal = data[0].closeBal
    //       // ====================================================================
    //       // ER收益率范围检查
    //       this.erChange = false
    //       this.eralList = []
    //       if (this.selectEntity.isAuto) {
    //         let list = res2.data
    //         list.forEach(it => {
    //           let changeDate = window.g.stringToDate(it.changeDate)
    //           let dtAsAt = window.g.stringToDate(this.selectEntity.dtAsAt)
    //           let dtLeaveResump = window.g.stringToDate(this.selectEntity.dtLeaveResump)
    //           if (changeDate <= dtLeaveResump) {
    //             if (changeDate <= dtAsAt) {
    //               this.eralList[0] = it
    //             } else {
    //               this.eralList.push(it)
    //             }
    //           }
    //         })
    //         if (this.eralList.length > 1) {
    //           this.erChange = true
    //         }
    //       }
    //       // ====================================================================
    //     }).catch((e) => {
    //       console.log('err of calculator')
    //     })
    //   }
    // }
  }

  function continueFrom() {
    // window.Vue.set(this, 'erChange', false)
    // window.Vue.set(this.selectEntity, 'dtAsAt', this.selectEntity.dtLeaveResump)
    // window.Vue.set(this.selectEntity, 'sessAsAt', this.selectEntity.sessLeaveResump)
    // window.Vue.set(this.selectEntity, 'lastBal', this.selectEntity.closeBal)
    // this.selectEntity.dtLeaveStart = null
    // this.selectEntity.sessLeaveStart = 'AM'
    // this.selectEntity.dtLeaveResump = null
    // this.selectEntity.sessLeaveResump = 'AM'
    // this.selectEntity.daysTaken = null
    // this.selectEntity.openBal = null
    // this.selectEntity.closeBal = null
  }

  function validateLeaveDates() {
    const { leaveStartDate, leaveEndDate, leaveStartSession, leaveEndSession } = form.value

    if (!leaveStartDate || !leaveEndDate || !leaveStartSession || !leaveEndSession) return true // Skip if incomplete

    const start = new Date(leaveStartDate)
    const end = new Date(leaveEndDate)

    if (start > end) {
      return 'Start date must be before end date'
    }

    if (start.getTime() === end.getTime()) {
      if (leaveStartSession !== 'am' || leaveEndSession !== 'pm') {
        return 'If dates are the same, session must be AM to PM'
      }
    }

    return true
  }



  const termType = ref('New')
  const pensionType = ref('100%')
  const lastBal = ref(0)

  const openingBal = ref(0)
  const closingBal = ref(0)


  const leaveStartDate = shallowRef(null)
  const leaveEndDate = shallowRef(null)

  const earningRateNew = [26, 22, 18, 14]
  const earningRateCommon = [34,27,21,14]
  const earningRateLocal = [40.5, 31, 22, 12.5]
  const earningRateContract = [28,14]

  const earningRateOptions = computed(() => {
    switch (termType.value) {
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


  watch(() => form.value.lastBal, (newVal, oldVal) => {
    console.log(`lastBal changed: ${oldVal} → ${newVal}`)
  })

  watch(() => form.value.leaveStartDate, (newVal, oldVal) => {
    console.log(`leaveStartDate changed: ${oldVal} → ${newVal}`)
  })

  watch(() => form.value.leaveEndDate, (newVal, oldVal) => {
    console.log(`leaveEndDate changed: ${oldVal} → ${newVal}`)
  })

</script>

