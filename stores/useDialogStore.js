// stores/useDialogStore.ts
import { defineStore } from 'pinia';

export const useDialogStore = defineStore('dialog', {
  state: () => ({
    showModal: false,
    showHolidayList: false,
    msg: {
      title: '',
      text: ''
    }
  }),
  actions: {
    openModal(title, text) {
      this.msg = { title, text };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openHolidayList() {
      this.showHolidayList = true;
    },
    closeHolidayList() {
      this.showHolidayList = false;
    }
  }
});
