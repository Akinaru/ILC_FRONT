import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    login: null,
    fullname: null,
    logged: false,
    last_login: null,
    access: 0
  }),
  actions: {
    loginAccount(login, fullname) {
      this.login = login;
      this.fullname = fullname;
      this.logged = true;
      var currentDate = new Date();
      currentDate.setUTCHours(currentDate.getUTCHours() + 2);
      this.last_login = currentDate.toUTCString();
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
