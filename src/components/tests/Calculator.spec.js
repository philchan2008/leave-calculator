import { mount } from '@vue/test-utils'
import { describe, expect, test } from "vitest"
import Calculator from "../Calculator.vue"
import { vuetify } from './vuetify-test-plugin'



describe('Calculator', () => {
  test('renders dialog', () => {
    const wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify]
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  test('computes leaveEarningDays correctly - basic', async () => {
    const wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify],
        stubs: ['v-date-input']
      }
    })
    // Set form values
    wrapper.vm.form.lastBalDate = '2025-01-01';
    wrapper.vm.form.lastBalSession = 'am';
    wrapper.vm.form.leaveResumeDate = '2025-01-03';
    wrapper.vm.form.leaveResumeSession = 'pm';

    //Access computeed property
    const result = wrapper.vm.leaveEarningDays;
    expect(result).toBe(2.5);
  })

  test('earning days same dates', async () => {
    const wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify],
        stubs: ['v-date-input']
      }
    })
    // Set form values
    wrapper.vm.form.lastBalDate = '2025-01-01';
    wrapper.vm.form.lastBalSession = 'am';
    wrapper.vm.form.leaveResumeDate = '2025-01-01';
    wrapper.vm.form.leaveResumeSession = 'pm';

    //Access computeed property
    const result = wrapper.vm.leaveEarningDays;
    expect(result).toBe(0.5);
  })

  test('earning days from pm to next date am', async () => {
    const wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify],
        stubs: ['v-date-input']
      }
    })
    // Set form values
    wrapper.vm.form.lastBalDate = '2025-01-01';
    wrapper.vm.form.lastBalSession = 'pm';
    wrapper.vm.form.leaveResumeDate = '2025-01-02';
    wrapper.vm.form.leaveResumeSession = 'am';

    //Access computeed property
    const result = wrapper.vm.leaveEarningDays;
    expect(result).toBe(0.5);
  })
})
