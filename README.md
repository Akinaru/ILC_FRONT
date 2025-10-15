# ILC — Gestion des vœux de mobilité (IUT d’Annecy)

Plateforme utilisée par les étudiant·e·s (liste blanche) pour **déposer 1→6 vœux** de mobilité internationale et par les **admins / chefs de département** pour **arbitrer manuellement** les affectations (drag & drop par accord avec nombre de places).  
**Front : Vue.js + Tailwind** · **API : Laravel + MySQL**.

---

## 🧭 Vue d’ensemble

- **Étudiants**
  - Auth via SSO établissement (LCAS) en prod/préprod ; **whitelist** par import Excel.
  - Gestion des **vœux (1→6, sans doublon)**, **favoris (illimités)**.
  - Consultation du **résultat d’affectation**.

- **Admins / Chefs de département**
  - **Arbitrage** par glisser-déposer des étudiants vers les accords (capacités X).
  - Filtres par **département / ISCED / composante / période**.
  - **Historique** des actions (admins).

- **Contenu public**
  - **Articles**, **documents**, **événements** (thématiques, dates), accessibles côté front.

---

## 🏗️ Architecture & Repo

- **Backend (Laravel)** : https://github.com/Akinaru/ILC_BACK
- **Frontend (Vue.js + Tailwind)** : ce dépôt (aucun `.env` requis côté front).

Base de données MySQL (tables principales : `t_e_account_acc`, `t_e_wishagreement_wsha`, `t_e_favoris_fav`, `t_e_arbitrage_arb`, `t_e_agreement_agree`, `t_j_deptagreement_deptagree`, etc.).

---

## 🚦 Environnements & URLs

| Environnement | Front (SPA)                                   | API (Laravel)                                      |
|---|---|---|
| **Production**    | https://ilc.iut-acy.univ-smb.fr/              | https://ilc.iut-acy.univ-smb.fr/BACK/               |
| **Pré-production**| https://ilc.iut-acy.univ-smb.fr/preprod/      | https://ilc.iut-acy.univ-smb.fr/preprod/BACK/       |
| **Dev (local)**   | http://localhost:5173/                        | http://localhost:8000/                               |

> En prod/préprod, l’API est servie via le **sous-répertoire `BACK/`**.  
> En local, le **front écoute sur `5173`** (Vite) et le **back sur `8000`** (`php artisan serve`).

---

## 🛠️ Installation locale (dev)

### 1) Front (Vuejs)

Cloner puis installer :
```bash
git clone https://github.com/Akinaru/ILC_FRONT.git
cd ILC_FRONT
npm install
```

### 2) Backend (Laravel)

Cloner puis installer :
```bash
git clone https://github.com/Akinaru/ILC_BACK.git
cd ILC_BACK
composer install
cp .env.example .env
```