// alertStore.js
import { defineStore } from 'pinia';

export const useAlertStore = defineStore({
  id: 'alert',
  state: () => ({
    alerts: [],
  }),
  actions: {
    addAlert(alert) {
      this.alerts.push(alert);
    },
    removeAlert(alert) {
      const index = this.alerts.indexOf(alert);
      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    },
  },
});
