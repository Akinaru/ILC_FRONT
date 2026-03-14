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

| Environnement      | Front (SPA)                              | API (Laravel)                                 |
| ------------------ | ---------------------------------------- | --------------------------------------------- |
| **Production**     | https://ilc.iut-acy.univ-smb.fr/         | https://ilc.iut-acy.univ-smb.fr/BACK/         |
| **Pré-production** | https://ilc.iut-acy.univ-smb.fr/preprod/ | https://ilc.iut-acy.univ-smb.fr/preprod/BACK/ |
| **Dev (local)**    | http://localhost:5173/                   | http://localhost:8000/                        |

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

> Pensez à configurer les 3 .env `.env`, `.env.staging`, `.env.production`

### 2) Backend (Laravel)

Cloner puis installer :

```bash
git clone https://github.com/Akinaru/ILC_BACK.git
cd ILC_BACK
composer install
cp .env.example .env
```

## 🛠️ Déploiement

> Il est important de lire le package.json pour comprendre les différentes commandes à éxécuter en fonction de l'environnement ciblé.
> Assurez vous que vos fichier .env ont bien été configurés au préalable pour permettre au site déployé de bénéficier de l'url de l'API ainsi que des autres paramètres.

### Déployer sur la preprod (staging)

```
npm run build:staging
```

### Déployer sur la production

```-
npm run build
```

---

## 📦 Compléments

> Cette section complète la documentation existante pour une reprise par un autre développeur, sans remplacer les parties ci-dessus.

### 1) Structure globale à transmettre

- Repo front : `ILC_FRONT` (Vue 3 + Vite + Pinia + Tailwind + PrimeVue).
- Repo back : `ILC_BACK` (Laravel 10 + Sanctum + phpCAS + MySQL).
- Le front consomme l’API Laravel via `VITE_API_URL`.
- Le front est en `hash routing` (`createWebHashHistory`) et build avec `base: './'` (déploiement compatible sous-répertoire).

### 2) Prérequis techniques

- Front
  - Node.js (recommandé LTS 18+ ou 20+)
  - npm
- Back
  - PHP `^8.1` (composer.json)
  - Composer
  - MySQL
  - Extensions PHP usuelles Laravel + `ldap` (utilisée par `ldap.php`)

### 3) Configuration des environnements

#### Front (`ILC_FRONT`)

Fichiers fournis :
- `.env.example` (local)
- `.env.staging.example` (préprod)
- `.env.production.example` (prod)

Variables utilisées :
- `VITE_API_URL`
- `VITE_ALERT_TIME`

Exemples :
- Local : `VITE_API_URL=http://localhost:8000/`
- Préprod : `VITE_API_URL=https://ilc.iut-acy.univ-smb.fr/preprod/BACK/`
- Prod : `VITE_API_URL=https://ilc.iut-acy.univ-smb.fr/BACK/`

#### Back (`ILC_BACK`)

Fichiers fournis :
- `.env.example`
- `.env.staging.example`
- `.env.production.example`

Variables clés :
- `APP_ENV`, `APP_URL`
- `DB_*`
- `ADMIN_PASSWORD` (connexion admin locale via `cas.php`)

Important :
- Le back utilise aussi le fichier racine `.version` pour exposer une version de type `<version>-<APP_ENV>`.

### 4) Démarrage local complet

#### Back

```bash
cd ILC_BACK
composer install
cp .env.example .env
php artisan key:generate
php artisan serve
```

API locale : `http://localhost:8000/`

#### Front

```bash
cd ILC_FRONT
npm install
cp .env.example .env
npm run dev
```

Front local : `http://localhost:5173/`

### 5) Base de données : point critique de reprise

- Le code métier manipule des tables legacy (`t_e_*`, `t_j_*`) via les modèles Eloquent.
- Les migrations présentes dans `database/migrations` ne couvrent que les tables Laravel de base (users, tokens, sessions, etc.), pas le schéma métier complet.
- Pour une reprise fonctionnelle, transmettre aussi :
  - un dump SQL du schéma métier
  - un jeu de données minimum (ou dump anonymisé) pour dev/test
  - la procédure d’import DB utilisée dans votre infra

### 6) Authentification et accès

- Prod/préprod :
  - Auth CAS via `ILC_BACK/cas.php`
  - Le front lance le flow CAS puis récupère le login et appelle `POST /api/login` pour obtenir un token Sanctum
- Local/admin :
  - Page front `/#/admin`
  - Redirection vers `cas.php?admin=true`
  - Login local admin actuellement codé en dur côté `cas.php` (username + vérification de `ADMIN_PASSWORD`)

Rôles API :
- `admin` (accès complet)
- `chefdept`
- étudiant / utilisateur standard

Middleware principal :
- `auth:sanctum`
- `role:admin` / `role:chefdept`

### 7) Endpoints/diagnostic utiles pour reprise

- Voir les routes : `php artisan route:list`
- Logs Laravel : `storage/logs/laravel.log`
- Nettoyage cache config/routes/views :
  - `php artisan optimize:clear`
- Vérifier CORS : `config/cors.php` (actuellement `allowed_origins: ['*']`)

### 8) Build et déploiement

#### Front

- Préprod : `npm run build:staging`
- Prod : `npm run build`

Le résultat est dans `ILC_FRONT/dist`.

#### Back

Étapes Laravel standard :
- `composer install --no-dev --optimize-autoloader`
- config du `.env` cible
- `php artisan key:generate` (si nécessaire)
- `php artisan optimize`

### 9) Sécurité / dette technique à transmettre explicitement

- `ILC_BACK/ldap.php` contient une connexion LDAP en clair (hôte + bind) : à externaliser dans `.env`.
- `ILC_BACK/cas.php` contient des paramètres CAS et une logique admin locale spécifiques au contexte actuel.