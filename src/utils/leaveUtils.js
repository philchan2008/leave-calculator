// leaveUtils.js

export function calcDayDiff(startDate, startSession, endDate, endSession) {
  const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) +
    ((startSession === 'am' && endSession === 'pm') ? 0.5 : 0)
  return dayDiff
}

export function formatLeaveDate(date) {
  return new Date(date).toLocaleDateString();
}

export function formatToNumeric10_2(value) {
  const num = Number.parseFloat(value)
  if (Number.isNaN(num)) return null

  const [intPart, decPart = ''] = num.toFixed(2).split('.')
  if (intPart.length > 8) return null // 10 digits total minus 2 decimals
  return `${intPart}.${decPart}`
}
