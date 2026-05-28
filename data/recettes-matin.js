// ─── RECETTES MATIN ───────────────────────────────────────────────────────────
// Pour ajouter / modifier une recette : éditer ce fichier uniquement.
// L'UI se met à jour automatiquement.

export const recettesMatin = [
  {
    id: "egg-oats",
    icon: "🍳",
    titre: "Egg Oats",
    description: "Protéines + glucides complexes — le combo parfait pour bien démarrer.",
    macros: { calories: 430, proteines: 32, glucides: 45, lipides: 12 },
    temps: "10 min",
    ingredients: [
      { quantite: "60g", nom: "Flocons d'avoine" },
      { quantite: "3", nom: "Œufs entiers" },
      { quantite: "200ml", nom: "Lait demi-écrémé" },
      { quantite: "1 c.à.c", nom: "Miel" },
      { quantite: "1 pincée", nom: "Sel" },
      { quantite: "Optionnel", nom: "Cannelle, fruits rouges" },
    ],
    etapes: [
      "Mélanger les flocons d'avoine avec le lait dans une casserole.",
      "Chauffer à feu moyen en remuant jusqu'à épaississement (3–4 min).",
      "Dans un bol, battre les œufs avec le sel.",
      "Hors du feu, incorporer les œufs battus aux flocons en mélangeant vite.",
      "Remettre 1 min sur feu doux en remuant. Retirer avant que ça sèche.",
      "Servir avec miel et fruits rouges.",
    ],
    astuce: "Prépare les flocons la veille, ajoute les œufs le matin — 5 min.",
  },
  {
    id: "cottage-bowl",
    icon: "🧀",
    titre: "Cottage Bowl",
    description: "Froid, rapide, zéro cuisson. Idéal quand tu manques de temps.",
    macros: { calories: 380, proteines: 35, glucides: 38, lipides: 8 },
    temps: "5 min",
    ingredients: [
      { quantite: "200g", nom: "Cottage cheese" },
      { quantite: "40g", nom: "Flocons d'avoine" },
      { quantite: "100g", nom: "Fruits rouges (frais ou surgelés décongelés)" },
      { quantite: "1 c.à.s", nom: "Graines de chia" },
      { quantite: "1 c.à.c", nom: "Miel ou sirop d'érable" },
    ],
    etapes: [
      "Verser le cottage cheese dans un bol.",
      "Ajouter les flocons d'avoine directement (pas de cuisson nécessaire).",
      "Déposer les fruits rouges par-dessus.",
      "Parsemer les graines de chia.",
      "Finir avec un filet de miel.",
    ],
    astuce: "Les graines de chia gonflent si tu prépares ça 10 min à l'avance — texture améliorée.",
  },
  {
    id: "overnight-oats",
    icon: "🫙",
    titre: "Overnight Oats",
    description: "Prépare le soir, mange le matin. Le meal prep ultime.",
    macros: { calories: 410, proteines: 28, glucides: 52, lipides: 9 },
    temps: "5 min (la veille)",
    ingredients: [
      { quantite: "60g", nom: "Flocons d'avoine" },
      { quantite: "150ml", nom: "Lait végétal ou demi-écrémé" },
      { quantite: "100g", nom: "Yaourt grec 0%" },
      { quantite: "1 c.à.s", nom: "Graines de chia" },
      { quantite: "1 c.à.c", nom: "Extrait de vanille" },
      { quantite: "1 c.à.c", nom: "Miel" },
      { quantite: "Au choix", nom: "Topping : banane, beurre de cacahuète, fruits secs" },
    ],
    etapes: [
      "Dans un bocal ou un tupperware : mélanger les flocons, le lait, le yaourt, les graines de chia, la vanille et le miel.",
      "Bien mélanger. Fermer.",
      "Laisser au frigo toute la nuit (minimum 4h).",
      "Le matin : ajouter les toppings de ton choix et manger froid.",
    ],
    astuce: "Se conserve 3 jours au frigo. Prépare-en plusieurs le dimanche pour toute la semaine.",
  },
];
