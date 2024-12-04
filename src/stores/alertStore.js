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
    removeAlert(id) {
      const index = this.alerts.findIndex(alert => alert.id === id);
      if (index !== -1) {
        this.alerts.splice(index, 1);
      }
    }
  },
});