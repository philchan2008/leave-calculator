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

  test('computes leaveEarningDays correctly', async () => {
    const wrapper = mount(Calculator, {
      global: {
        plugins: [vuetify],
        stubs: ['v-date-input']
      }
    })
    debugger;
    // Set form values
    wrapper.vm.form.leaveStartDate = '2025-01-01';
    wrapper.vm.form.leaveStartSession = 'am';
    wrapper.vm.form.leaveEndDate = '2025-01-01';
    wrapper.vm.form.leaveEndSession = 'pm';
    wrapper.vm.form.leaveResumeDate = '2025-01-03';
    wrapper.vm.form.leaveResumeSession = 'pm';

    //Access computeed property
    const result = wrapper.vm.leaveEarningDays;
    expect(result).toBe(2.5);
  })
})
