import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    login: null,
    fullname: null,
    logged: false,
    last_login: null,
    access: 0,
    acc_validateacc: false
  }),
  actions: {
    loginAccount(data) {
      this.login = data.acc_id;
      this.fullname = data.acc_fullname;
      this.last_login = data.acc_lastlogin;
      this.logged = true;
      this.acc_validateacc = data.acc_validateacc;
      this.access = data.acc_access;
    },
    setAccess(level){
      this.access = level;
    },
    setValidate(val){
      this.acc_validateacc = val;
    },

    logoutAccount() {
      this.login = null;
      this.fullname = null;
      this.last_login = null;
      this.logged = false;
      this.acc_validateacc = false;
      this.access = 0;
    },

    isLogged() {
      return this.logged;
    },
    isStudent(){
      return this.access == 0;
    },

    getAccessLevel(){
      return this.access;
    },

    getAccountValidate(){
      return this.acc_validateacc;
    }
  },
});
