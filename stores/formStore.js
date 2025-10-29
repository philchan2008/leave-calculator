import { defineStore } from 'pinia'

export const useFormStore = defineStore('form', {
  state: () => ({
    accuLimit: 0,
    closingBal: 0,
    daysTaken: 0,
    earningRate: 0,
    lastBal: 0,
    lastBalDate: null,
    lastBalSession: null,
    leaveResumeDate: null,
    leaveResumeSession: null,
    leaveStartDate: null,
    leaveStartSession: null,
    openingBal: 0,
    pensionType: null,
    termType: null,
  })
})
