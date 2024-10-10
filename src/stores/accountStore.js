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
      this.last_login = new Date().toISOString(); // Met à jour last_login lors de la connexion
      this.logged = true;
      this.acc_validateacc = data.acc_validateacc;
      this.access = data.acc_access;

      this.saveAccountToLocal();
    },
    setAccess(level) {
      this.access = level;
    },
    setValidate(val) {
      this.acc_validateacc = val;
    },
    
    logoutAccount() {
      this.login = null;
      this.fullname = null;
      this.last_login = null;
      this.logged = false;
      this.acc_validateacc = false;
      this.access = 0;

      localStorage.removeItem('account');
    },

    isLogged() {
      return this.logged;
    },
    isStudent() {
      return this.access === 0;
    },

    getAccessLevel() {
      return this.access;
    },

    getAccountValidate() {
      return this.acc_validateacc;
    },

    // Nouvelle méthode pour mettre à jour last_login
    updateLastLogin() {
      this.last_login = new Date().toISOString(); // Met à jour avec le timestamp actuel
    },
    toString() {
      return `Account Info: 
        Login: ${this.login || 'N/A'}, 
        Fullname: ${this.fullname || 'N/A'}, 
        Last Login: ${this.last_login || 'N/A'}, 
        Logged In: ${this.logged ? 'Yes' : 'No'}, 
        Access Level: ${this.access}, 
        Account Validated: ${this.acc_validateacc ? 'Yes' : 'No'}`;
    },
    saveAccountToLocal() {
      const accountData = {
        login: this.login,
        fullname: this.fullname,
        logged: this.logged,
        last_login: this.last_login,
        access: this.access,
        acc_validateacc: this.acc_validateacc
      };
      localStorage.setItem('account', JSON.stringify(accountData));
    },
  
    loadAccountFromLocal() {
      const accountData = localStorage.getItem('account');
      if (accountData) {
        const data = JSON.parse(accountData);
        this.login = data.login;
        this.fullname = data.fullname;
        this.logged = data.logged;
        this.last_login = data.last_login;
        this.access = data.access;
        this.acc_validateacc = data.acc_validateacc;
      }
    },
  },
});
