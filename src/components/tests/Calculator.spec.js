import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from "vitest"
import Calculator from "../Calculator.vue"
import { vuetify } from './vuetify-test-plugin'
import { beforeEach } from 'vitest'
import testCases from './CalculatorTestCases.json'


describe('Calculator', () => {

  let wrapper
  let submitBtn
  let continueBtn
  let resetBtn

  beforeEach(() => {
    wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify],
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
      leaveResumeDate: '2025-01-03',
      leaveResumeSession: 'pm',
    })

    //Access computeed property
    const result = wrapper.vm.earningDaysBeforeLeave + wrapper.vm.earningDays
    expect(result).toBe(2.5)
  })

  test('earning days same dates', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      lastBalDate: '2025-01-01',
      lastBalSession: 'am',
      leaveResumeDate: '2025-01-01',
      leaveResumeSession: 'pm',
    })

    //Access computeed property
    const result = wrapper.vm.earningDaysBeforeLeave + wrapper.vm.earningDays;
    expect(result).toBe(0.5);
  })

  test('earning days from pm to next date am', async () => {
    // Set form values
    Object.assign(wrapper.vm.form, {
      lastBalDate: '2025-01-01',
      lastBalSession: 'pm',
      leaveResumeDate: '2025-01-02',
      leaveResumeSession: 'am',
    })

    //Access computeed property
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

    const lastBal = wrapper.vm.form.closingBal
    const lastBalDate = wrapper.vm.form.leaveResumeDate
    const lastBalSession = wrapper.vm.form.leaveResumeSession
    await continueBtn.trigger('click')

    expect(wrapper.vm.form.lastBal).toBeCloseTo(lastBal, 0.001)
    expect(wrapper.vm.form.lastBalDate).toBe(lastBalDate)
    expect(wrapper.vm.form.lastBalSession).toBe(lastBalSession)
  })

  describe('earning calculation test cases', async () => {
    // Set form values
    testCases.forEach(async (t) => {
      it(`Test Case ${t.caseNo}: ${t.caseDesc}`, async () => {
         Object.assign(wrapper.vm.form, t)

        await submitBtn.trigger('click')

        expect(wrapper.vm.form.openingBal)
         .toBeCloseTo(t.expectedOpeningBal, t.expectedTolerance)
        expect(wrapper.vm.form.closingBal)
         .toBeCloseTo(t.expectedClosingBal, t.expectedTolerance)
      })

    })
  })


})
