import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    logged: false,
    account: null,

  }),
  persist: true,
  actions: {
    async loginAccount(data) {
      this.logged = true;
      this.account = data.account;

      this.saveAccountToLocal();

    },
    setAccount(val){
      this.account = val;
      this.saveAccountToLocal();
    },
    
    logoutAccount() {
      this.logged = false;
      this.account = null;

      localStorage.removeItem('account');
    },
    dateLimitePasse() {
      const dateLimite = this.account?.datelimite;
      if (!dateLimite) return true;
    
      const today = new Date();
      const limite = new Date(dateLimite);
    
      today.setHours(0, 0, 0, 0);
      limite.setHours(0, 0, 0, 0);
    
      return limite < today;
    },

    isLogged() {
      return this.logged;
    },
    isStudent() {
      return this.account?.access?.count === 0;
    },

    isAdmin() {
      return this.account?.access?.count > 0 && this.account.access.access.acs_accounttype === 1;
    },
    
    isChefDept() {
      return this.account?.access?.count > 0 && this.account.access.access.acs_accounttype === 2;
    },    

    getAccessLevel() {
      return this.account?.access?.count > 0 ? this.account.access.access.acs_accounttype : 0;
    },
    
    getAccountValidate() {
      return this.account?.acc_validateacc ?? false;
    },
    
    getAccount(){
      return this.account;
    },

    toString() {
      if (!this.account) return 'No account connected.';
    
      return `Account Info:
      - Logged In: ${this.logged ? 'Yes' : 'No'}
      - Login: ${this.account.acc_id || 'N/A'}
      - Fullname: ${this.account.acc_fullname || 'N/A'}
      - Email: ${this.account.acc_mail || 'N/A'}
      - Last Login: ${this.account.acc_lastlogin || 'N/A'}
      - Validated: ${this.account.acc_validateacc ? 'Yes' : 'No'}
      - Access Level: ${this.account.access?.count > 0 ? this.account.access.access?.acs_accounttype ?? 'Inconnu' : 'Student'}
      - Role: ${this.account.role?.role || 'N/A'}
      - Department: ${this.account.department?.dept_name || 'N/A'}
      - Mobility: ${this.account.acc_anneemobilite ? `${this.account.acc_anneemobilite} (période ${this.account.acc_periodemobilite || '?'})` : 'None'}`;
    },
    
    
    saveAccountToLocal() {
      const accountData = {
        logged: this.logged,
        account: this.account
      };
      localStorage.setItem('account', JSON.stringify(accountData));
    },
  
    loadAccountFromLocal() {
      const accountData = localStorage.getItem('account');
      if (accountData) {
        const data = JSON.parse(accountData);
        this.logged = data.logged;
        this.account = data.account;
      }
    },
  },
});
