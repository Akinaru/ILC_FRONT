import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    login: null,
    fullname: null,
    logged: false,
    last_login: null,
    access: 0,
  }),
  actions: {
    loginAccount(data) {
      this.login = data.acc_id;
      this.fullname = data.acc_fullname;
      this.last_login = data.acc_lastlogin;
      this.logged = true;
    },
    setAccess(level){
      this.access = level;
    },

    logoutAccount() {
      this.login = null;
      this.fullname = null;
      this.last_login = null;
      this.logged = false;
      this.access = 0;
    },

    isLogged() {
      return this.logged;
    },

    getAccessLevel(){
      return this.access;
    }
  },
});
