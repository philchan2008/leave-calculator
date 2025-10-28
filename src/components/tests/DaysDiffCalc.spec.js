import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from "vitest"
import DaysDiffCalc from "../DaysDiffCalc.vue"
import { vuetify } from './vuetify-test-plugin'
import { beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'  // NOTE: not needed with `globals: true`
import testCases from './DaysDiffCalcTestCases.json'

describe('DaysDiffCalc', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(DaysDiffCalc, {
      global: {
        plugins: [
          vuetify,
          //NOTE: Details see https://pinia.vuejs.org/cookbook/testing.html#Specifying-the-createSpy-function
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
            initialState: {
              dialog: {
                showModal: false,
                showHolidayList: false,
                msg: {
                  title: '',
                  text: ''
                }
               }
            },
          })
        ],
        stubs: ['v-date-input'],
      }
    })
  })

  // test('computes days diff (basic)', async () => {
  //   // Set form values
  //   Object.assign(wrapper.vm.form, {
  //     leaveStartDate: '2025-01-01',
  //     leaveStartSession: 'am',
  //     leaveEndDate: '2025-01-06',
  //     leaveEndSession: 'pm'
  //   })

  //   await wrapper.vm.calculateLeaveDetails(wrapper.vm.form)
  //   //await nextTick()

  //   const { daysCount, daysOfHolidays, daysTaken } = wrapper.vm.form;
  //   expect(daysCount).toBe(5.5)
  //   expect(daysOfHolidays).toBe(3)
  //   expect(daysTaken).toBe(2.5)
  // })

  describe('# Earning calculation test cases', async () => {
    // Set form values
    testCases.forEach(async (t) => {
      it(`Test Case ${t.caseNo}: ${t.caseDesc}`, async () => {
        //NOTE: Object.assign no longer work, use wrapper.vm.form = {...t.input} instead
        //Object.assign(wrapper.vm.form, t)
        Object.assign(wrapper.vm.form, {
          leaveStartDate: t.input.leaveStartDate,
          leaveStartSession: t.input.leaveStartSession,
          leaveEndDate: t.input.leaveEndDate,
          leaveEndSession: t.input.leaveEndSession,
        })

        //HACK: Since it is unable to test updated values with watchEffect or watch
        await wrapper.vm.calculateLeaveDetails(wrapper.vm.form)

        const { daysCount, daysOfHolidays, daysTaken } = wrapper.vm.form;
        expect(daysCount).toBe(t.expected.daysCount)
        expect(daysOfHolidays).toBe(t.expected.daysOfHolidays)
        expect(daysTaken).toBe(t.expected.daysTaken)
      })

    })
  })


})
