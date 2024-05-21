export function getCountryFlag(countryName) {
    const countryFlags = {
        "Allemagne": "🇩🇪",
        "Autriche": "🇦🇹",
        "Argentine": "🇦🇷",
        "Belgique": "🇧🇪",
        "Brésil": "🇧🇷",
        "Canada": "🇨🇦",
        "Chili": "🇨🇱",
        "Chine": "🇨🇳",
        "Colombie": "🇨🇴",
        "République de Corée": "🇰🇷",
        "Danemark": "🇩🇰",
        "Espagne": "🇪🇸",
        "Etats-Unis": "🇺🇸",
        "Finlande": "🇫🇮",
        "Irlande": "🇮🇪",
        "Italie": "🇮🇹",
        "Japon": "🇯🇵",
        "Lituanie": "🇱🇹",
        "Norvège": "🇳🇴",
        "Pays-Bas": "🇳🇱",
        "Pérou": "🇵🇪",
        "Pologne": "🇵🇱",
        "Portugal": "🇵🇹",
        "République-Tchèque": "🇨🇿",
        "Roumanie": "🇷🇴",
        "Suède": "🇸🇪",
        "Turquie": "🇹🇷"
      };
      

  return countryFlags[countryName] || "🏳️";
}