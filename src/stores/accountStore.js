import { defineStore } from 'pinia';

export const useAccountStore = defineStore("account", {
  state: () => ({
    login: null,
    nom: null,
    prenom: null,
    logged: false
  }),
  actions: {
    loginAccount(login, nom, prenom) {
      this.login = login;
      this.nom = nom;
      this.prenom = prenom;
      this.logged = true;
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
