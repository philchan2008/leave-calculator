import { mount, shallowMount } from '@vue/test-utils'
import { describe, expect, it, test } from "vitest"
import Calculator from "../Calculator.vue"
import { vuetify } from './vuetify-test-plugin'
import { beforeEach } from 'vitest'
import testCases from './CalculatorTestCases.json'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { vi } from 'vitest' // NOTE: not needed with `globals: true`

describe('Calculator', () => {
  let wrapper
  let form
  let submitBtn
  let continueBtn
  let resetBtn

  beforeEach(() => {
    wrapper = mount(Calculator, {
      global: {
        plugins: [
          vuetify,
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
    form = wrapper.vm.form
    submitBtn = wrapper.find('#submitBtn')
    continueBtn = wrapper.find('#continueBtn')
    resetBtn = wrapper.find('#resetBtn')
  })

  test('renders dialog', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('computes earning days (basic)', async () => {
    // Set form values
    Object.assign(form, {
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
    Object.assign(form, {
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
    Object.assign(form, {
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
    Object.assign(form, {
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
    expect(form).toMatchObject({
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
    expect(form).toMatchObject({
      accuLimit: 28,     // <-- should not be reset
      daysTaken: 0,
      earningRate: 14,   // <-- should not be reset
      lastBal: 0,
      lastBalDate: null,
      lastBalSession: null,
      leaveResumeDate: null,
      leaveResumeSession: null,
      leaveStartDate: null,
      leaveStartSession: null,
      pensionType: 'NA', // <-- should not be reset
      termType: 'New',   // <-- should not be reset
    })
  })

  test('continue button test', async () => {
    Object.assign(form, {
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

    const lastBal = form.closingBal
    const lastBalDate = form.leaveResumeDate
    const lastBalSession = form.leaveResumeSession
    await continueBtn.trigger('click')
    await nextTick()

    expect(form.lastBal).toBeCloseTo(lastBal, 0.001)
    expect(form.lastBalDate).toBe(lastBalDate)
    expect(form.lastBalSession).toBe(lastBalSession)
  })

  describe('Earning calculator muplitple test cases', async () => {
    // Set form values
    testCases.forEach(async (t) => {
      it(`Test Case ${t.caseNo}: ${t.caseDesc}`, async () => {
        //NOTE: Somehow Object.assign() no longer works #LESSONLEARNED
        //Object.assign(wrapper.vm.form, t.input)
        //form = { ...t.input } //NOTE: It doesn't work in pinia
        Object.assign(form, { ...t.input })
        await nextTick()

        await submitBtn.trigger('click')
        await nextTick()

        //console.log(`Test Case ${t.caseNo}: ${t.caseDesc}`, form)

        expect(form.openingBal)
         .toBeCloseTo(t.expected.openingBal, t.expected.tolerance)
        expect(form.closingBal)
         .toBeCloseTo(t.expected.closingBal, t.expected.tolerance)
      })

    })
  })


})
