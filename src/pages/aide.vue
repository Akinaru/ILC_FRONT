<template>
  <div class="container max-w-6xl mx-auto px-4 py-10 space-y-8">
    <!-- Titre principal -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-primary mb-2">🧭 Guide de votre espace étudiant</h1>
      <p class="text-base-content">Tout ce qu’il faut savoir pour bien gérer vos démarches de mobilité internationale.</p>
    </div>

    <!-- Aperçu des sections -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Choix de mobilité -->
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-primary">📋 Vos choix de mobilité</h2>
          <p>
            Pour faire vos vœux de mobilité, suivez ces étapes :
          </p>
          <ol class="list-decimal list-inside mt-2 space-y-1 text-sm">
            <li>Ajoutez des destinations en favoris (depuis la page d’accueil ou la fiche d’une destination).</li>
            <li>Rendez-vous sur <RouterLink :to="{ name: 'Dashboard' }" class="link text-primary">votre profil</RouterLink> et déplacez vos favoris dans les cases dédiées aux vœux.</li>
          </ol>
        </div>
      </div>

      <!-- Pays et Universités -->
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-primary">🌍 Pays, universités et accords</h2>
          <p>Accédez aux destinations partenaires, explorez les universités et visualisez les accords disponibles en fonction de votre parcours.</p>
        </div>
      </div>

      <!-- Documents et témoignages -->
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-primary">📄 Documents et témoignages</h2>
          <p>Accédez aux documents utiles et partagez votre expérience à travers un témoignage une fois la mobilité effectuée.</p>
        </div>
      </div>

      <!-- TOEIC et validation -->
      <div class="card bg-base-100 shadow-md border border-base-300">
        <div class="card-body">
          <h2 class="card-title text-primary">🧪 TOEIC et validations</h2>
          <p>Le passage du TOEIC et la validation des cours sont nécessaires pour finaliser votre dossier de mobilité.</p>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div>
      <h2 class="text-2xl font-bold text-primary mb-4">❓ Questions fréquentes</h2>

      <div class="space-y-3">
        <!-- FAQ 1 -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title font-medium">
            Comment indiquer mes choix de mobilité ?
          </div>
          <div class="collapse-content">
            <p>Ajoutez d’abord des destinations en favoris, puis glissez-les dans vos vœux depuis la page <RouterLink :to="{ name: 'Dashboard' }" class="link text-primary">Mon profil</RouterLink>.</p>
          </div>
        </div>

        <!-- FAQ 2 -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title font-medium">
            Où voir la date limite pour faire mes vœux ?
          </div>
          <div class="collapse-content">
            <p>Elle est visible dans votre profil étudiant, au niveau de la section “Gestion des vœux”, ou en cliquant sur votre nom en haut de la page.</p>
          </div>
        </div>

        <!-- FAQ 3 -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title font-medium">
            Que se passe-t-il si aucun de mes vœux n’est validé ?
          </div>
          <div class="collapse-content">
            <p>L’équipe ILC prendra directement contact avec vous pour proposer une alternative ou un nouvel arbitrage.</p>
          </div>
        </div>

        <!-- FAQ 4 -->
        <div class="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div class="collapse-title font-medium">
            Le TOEIC est-il obligatoire ?
          </div>
          <div class="collapse-content">
            <p>Oui, un score minimum est requis pour certains accords. L’inscription au TOEIC est disponible depuis votre espace étudiant.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer pratique -->
    <div class="mt-10 text-center text-sm text-base-content/70">
      Une question ? Rendez-vous au bureau ILC ou contactez-nous :<br />
      <span class="font-medium">📧</span> <a href="mailto:ilc-admin.iut-acy@univ-smb.fr" class="link">ilc-admin.iut-acy@univ-smb.fr</a><br />
      <span class="font-medium">📞</span> <a href="tel:+33450092210" class="link">+33 (0)4 50 09 22 10</a>
    </div>
  </div>
</template>