import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from "vitest"
import DaysDiffCalc from "../DaysDiffCalc.vue"
import { vuetify } from './vuetify-test-plugin'
import { beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'  // NOTE: not needed with `globals: true`

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

  test('computes days diff (basic)', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      leaveEndDate: '2025-01-01',
      leaveEndSession: 'pm',
    })

    //Access computeed property
    const daysCount = wrapper.vm.daysCount
    const daysTaken = wrapper.vm.daysTaken
    expect(daysCount).toBe(0.5)
    expect(daysTaken).toBe(0.5)
  })

  //TODO: Complete the test cases for the days diff test.
  // describe('earning calculation test cases', async () => {
  //   // Set form values
  //   testCases.forEach(async (t) => {
  //     it(`Test Case ${t.caseNo}: ${t.caseDesc}`, async () => {
  //        Object.assign(wrapper.vm.form, t)

  //       await submitBtn.trigger('click')

  //       expect(wrapper.vm.form.openingBal)
  //        .toBeCloseTo(t.expectedOpeningBal, t.expectedTolerance)
  //       expect(wrapper.vm.form.closingBal)
  //        .toBeCloseTo(t.expectedClosingBal, t.expectedTolerance)
  //     })

  //   })
  // })


})
