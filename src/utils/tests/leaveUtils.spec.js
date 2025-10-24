import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { getHolidays, calcDayDiff, formatLeaveDate, formatToNumeric10_2 } from '../leaveUtils'

vi.mock('axios')

describe('calcDayDiff', () => {
  it('calculates full day difference without session bonus', () => {
    const start = new Date('2025-10-24')
    const end = new Date('2025-10-26')
    const result = calcDayDiff(start, 'am', end, 'am')
    expect(result).toBe(2)
  })

  it('adds 0.5 day for AM to PM session on same day', () => {
    const start = new Date('2025-10-24')
    const end = new Date('2025-10-24')
    const result = calcDayDiff(start, 'am', end, 'pm')
    expect(result).toBe(0.5)
  })

  it('adds 0.5 day for AM to PM session across multiple days', () => {
    const start = new Date('2025-10-24')
    const end = new Date('2025-10-26')
    const result = calcDayDiff(start, 'am', end, 'pm')
    expect(result).toBe(2.5)
  })

  it('does not add bonus for PM to AM session', () => {
    const start = new Date('2025-10-24')
    const end = new Date('2025-10-26')
    const result = calcDayDiff(start, 'pm', end, 'am')
    expect(result).toBe(2)
  })
})

describe('formatLeaveDate', () => {
  it('formats ISO date string to local format', () => {
    const input = '2025-10-24'
    const result = formatLeaveDate(input)

    // This will vary by locale — in UK it’s usually DD/MM/YYYY
    expect(result).toBe(new Date('2025-10-24').toLocaleDateString())
  })

  it('formats Date object correctly', () => {
    const input = new Date('2025-10-24')
    const result = formatLeaveDate(input)

    expect(result).toBe(input.toLocaleDateString())
  })

  it('handles invalid date input', () => {
    const result = formatLeaveDate('invalid-date')
    expect(result).toBe('Invalid Date') // or whatever your locale returns
  })
})

describe('formatToNumeric10_2', () => {
  it('formats valid number with 2 decimals', () => {
    expect(formatToNumeric10_2('1234.567')).toBe('1234.57')
    expect(formatToNumeric10_2(9876.543)).toBe('9876.54')
  })

  it('returns null for non-numeric input', () => {
    expect(formatToNumeric10_2('abc')).toBeNull()
    expect(formatToNumeric10_2(undefined)).toBeNull()
    expect(formatToNumeric10_2(null)).toBeNull()
  })

  it('returns null if integer part exceeds 8 digits', () => {
    expect(formatToNumeric10_2('123456789.99')).toBeNull()
    expect(formatToNumeric10_2('999999999.99')).toBeNull()
  })

  it('handles edge cases correctly', () => {
    expect(formatToNumeric10_2('0')).toBe('0.00')
    expect(formatToNumeric10_2('0.1')).toBe('0.10')
    expect(formatToNumeric10_2('99999999.99')).toBe('99999999.99') // exactly 8 digits
  })
})

describe('getHolidays', () => {
  it('returns parsed holidays from API', async () => {
    (axios.get).mockResolvedValue({
      data: {
        vcalendar: [
          {
            vevent: [
              {
                dtstart: ['20240101', { value: 'DATE' }],
                dtend: ['20240102', { value: 'DATE' }],
                summary: 'New Year’s Day'
              },
              {
                dtstart: ['20240210', { value: 'DATE' }],
                dtend: ['20240211', { value: 'DATE' }],
                summary: 'Lunar New Year’s Day'
              }
            ]
          }
        ]
      }
    })

    const result = await getHolidays()

    expect(result).toEqual([
      {
        dtstart: ['20240101', { value: 'DATE' }],
        dtend: ['20240102', { value: 'DATE' }],
        summary: 'New Year’s Day'
      },
      {
        dtstart: ['20240210', { value: 'DATE' }],
        dtend: ['20240211', { value: 'DATE' }],
        summary: 'Lunar New Year’s Day'
      }
    ])
  })

  it('returns empty array on error', async () => {
    (axios.get).mockRejectedValue(new Error('Network error'))

    const result = await getHolidays()

    expect(result).toEqual([])
  })
})
