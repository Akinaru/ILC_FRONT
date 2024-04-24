import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    login: null,
    nom: null,
    prenom: null,
    logged: false,
    last_login: null,
  }),
  actions: {
    loginAccount(login, nom, prenom) {
      this.login = login;
      this.nom = nom;
      this.prenom = prenom;
      this.logged = true;
      var currentDate = new Date();
      currentDate.setUTCHours(currentDate.getUTCHours() + 2);
      this.last_login = currentDate.toUTCString();
    },
    updateLogin(newLogin) {
      this.login = newLogin;
    },
    updateNom(newNom) {
      this.nom = newNom;
    },
    updatePrenom(newPrenom) {
      this.prenom = newPrenom;
    },
    logoutAccount() {
      this.login = null;
      this.nom = null;
      this.prenom = null;
      this.logged = false;
    },
    isLogged() {
      return this.logged;
    },
  },
});
