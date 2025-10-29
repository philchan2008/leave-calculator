import { defineStore } from 'pinia'

export const useDayDiffStore = defineStore('form', {
  state: () => ({
    leaveStartDate: null,
    leaveStartSession: "am",
    leaveEndDate: null,
    leaveEndSession: "am",
    daysCount: 0,
    daysOfHolidays: 0,
    daysTaken: 0,
  })
})
