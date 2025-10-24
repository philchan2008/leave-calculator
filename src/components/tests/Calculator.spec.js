import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, test } from "vitest"
import Calculator from "../Calculator.vue"
import { vuetify } from './vuetify-test-plugin'
import { beforeEach } from 'vitest'
import testCases from './CalculatorTestCases.json'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'

describe('Calculator', () => {

  let wrapper
  let submitBtn
  let continueBtn
  let resetBtn

  beforeEach(() => {
    wrapper = mount(Calculator, {
      global: {
        plugins: [
          vuetify,
          createTestingPinia({
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
            stubActions: false
          })
        ],
        stubs: ['v-date-input'],
      }
    })
    submitBtn = wrapper.find('#submitBtn')
    continueBtn = wrapper.find('#continueBtn')
    resetBtn = wrapper.find('#resetBtn')
  })

  test('renders dialog', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('computes earning days (basic)', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      leaveResumeDate: '2025-01-03',
      leaveResumeSession: 'pm',
    })

    //Access computeed property
    await nextTick()

    const result = (wrapper.vm.earningDaysBeforeLeave + wrapper.vm.earningDays)
    expect(result).toBe(2.5)
  })

  test('earning days same dates', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      leaveResumeDate: '2025-01-01',
      leaveResumeSession: 'pm',
    })

    //Access computeed property
    await nextTick()

    const result = (wrapper.vm.earningDaysBeforeLeave + wrapper.vm.earningDays);
    expect(result).toBe(0.5);
  })

  test('earning days from pm to next date am', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      lastBalDate: '2025-01-01',
      lastBalSession: 'pm',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'pm',
      leaveResumeDate: '2025-01-02',
      leaveResumeSession: 'am',
    })

    //Access computeed property
    await nextTick()

    const result = wrapper.vm.earningDaysBeforeLeave + wrapper.vm.earningDays;
    expect(result).toBe(0.5);
  })

  test('form reset test', async () => {
    Object.assign(wrapper.vm.form, {
      termType: 'New',
      pensionType: 'NA',
      earningRate: 14,
      accuLimit: 28,
      lastBal: 51.54,
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      daysTaken: 0.5,
      leaveResumeDate: '2025-01-01',
      leaveResumeSession: 'am',
    })

    // Ensure the values were set on the form
    expect(wrapper.vm.form).toMatchObject({
      termType: 'New',
      pensionType: 'NA',
      earningRate: 14,
      accuLimit: 28,
      lastBal: 51.54,
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      daysTaken: 0.5,
      leaveResumeDate: '2025-01-01',
      leaveResumeSession: 'am',
    })

    await resetBtn.trigger('click')

    // Ensure the values were set on the form
    expect(wrapper.vm.form).toMatchObject({
      termType: 'New',   // <-- should not be reset
      pensionType: 'NA', // <-- should not be reset
      earningRate: 14,   // <-- should not be reset
      accuLimit: 28,     // <-- should not be reset
      lastBal: 0,
      lastBalDate: null,
      lastBalSession: null,
      leaveStartDate: null,
      leaveStartSession: null,
      daysTaken: 0,
      leaveResumeDate: null,
      leaveResumeSession: null,
    })
  })

  test('continue button test', async () => {
    Object.assign(wrapper.vm.form, {
      termType: 'New',
      pensionType: 'NA',
      earningRate: 14,
      accuLimit: 28,
      lastBal: 10,
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveStartDate: '2025-01-01',
      leaveStartSession: 'am',
      daysTaken: 0.5,
      leaveResumeDate: '2025-01-01',
      leaveResumeSession: 'am',
    })
    await submitBtn.trigger('click')
    await nextTick()

    const lastBal = wrapper.vm.form.closingBal
    const lastBalDate = wrapper.vm.form.leaveResumeDate
    const lastBalSession = wrapper.vm.form.leaveResumeSession
    await continueBtn.trigger('click')
    await nextTick()

    expect(wrapper.vm.form.lastBal).toBeCloseTo(lastBal, 0.001)
    expect(wrapper.vm.form.lastBalDate).toBe(lastBalDate)
    expect(wrapper.vm.form.lastBalSession).toBe(lastBalSession)
  })

  describe('earning calculation test cases', async () => {
    // Set form values
    testCases.forEach(async (t) => {
      it(`Test Case ${t.caseNo}: ${t.caseDesc}`, async () => {
        //NOTE: Somehow Object.assign() no longer works #LESSONLEARNED
        //Object.assign(wrapper.vm.form, t.input)
        wrapper.vm.form = { ...t.input }
        await nextTick()

        await submitBtn.trigger('click')
        await nextTick()

        expect(wrapper.vm.form.openingBal)
         .toBeCloseTo(t.expected.openingBal, t.expected.tolerance)
        expect(wrapper.vm.form.closingBal)
         .toBeCloseTo(t.expected.closingBal, t.expected.tolerance)
      })

    })
  })


})
