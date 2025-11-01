// leaveUtils.js
import axios from 'axios'

export function formatToNumeric10_2(value) {
  const num = Number.parseFloat(value)
  if (Number.isNaN(num)) return null

  const [intPart, decPart = ''] = num.toFixed(2).split('.')
  if (intPart.length > 8) return null // 10 digits total minus 2 decimals
  return `${intPart}.${decPart}`
}

export function calcDayDiff(startDate, startSession, endDate, endSession) {
  const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
    ((startSession === 'am' && endSession === 'pm') ? 0.5 : 0)
  return dayDiff
}

export function parseYYYYMMDD(dateStr) {
  const year = parseInt(dateStr.slice(0, 4), 10)
  const month = parseInt(dateStr.slice(4, 6), 10) - 1 // Month is 0-based
  const day = parseInt(dateStr.slice(6, 8), 10)
  const newDate = new Date(year, month, day)
  return newDate
}

export function formatLeaveDate(ymdDate) {
  //return new Date(date).toLocaleDateString();
  let newDate = null
  newDate = parseYYYYMMDD(ymdDate)
  newDate = newDate.toISOString().slice(0, 10) // "YYYY-MM-DD"
  return newDate
}

export async function getHolidays() {
  let holidays = []
  await axios.get("http://localhost:3001/holidays")
    .then(res => {
      const vevents = res.data.vcalendar?.[0]?.vevent || []
      holidays = vevents.map(h => ({
        dtstart: formatLeaveDate(h.dtstart[0]),
        dtend: formatLeaveDate(h.dtend[0]),
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
      console.error(err.message)
    });
    return holidays
}
