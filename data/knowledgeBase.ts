// Base de connaissances complète pour EcomBoost DZ
export interface KnowledgeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  context?: string;
}

export const COMPANY_INFO = {
  name: "EcomBoost DZ",
  description: "Spécialiste de l'automatisation e-commerce pour le marché algérien",
  mission: "Aider les vendeurs algériens à automatiser et professionnaliser leur business en ligne",
  target: "Vendeurs en ligne, boutiques e-commerce, entrepreneurs algériens",
  experience: "Plus de 500 vendeurs algériens nous font déjà confiance",
  location: "Algérie",
  support: "Support 7j/7 avec équipe locale"
};

export const SERVICES_DETAILS = {
  "automatisation_whatsapp": {
    name: "Automatisation WhatsApp",
    description: "Chatbot intelligent qui gère le processus de commande de A à Z",
    features: [
      "Réponses instantanées 24/7",
      "Catalogue de produits interactif", 
      "Collecte automatique des adresses",
      "Réduction des erreurs de saisie",
      "Confirmation de commandes automatique",
      "Intégration WhatsApp, Messenger et SMS"
    ],
    benefits: [
      "Ne ratez plus jamais un prospect",
      "Réduction du temps de gestion client",
      "Augmentation du taux de conversion",
      "Disponibilité 24h/24"
    ]
  },
  "creation_contenu": {
    name: "Création de Contenu Publicitaire",
    description: "Visuels et vidéos professionnels pour maximiser vos conversions",
    features: [
      "Designs professionnels et modernes",
      "Textes publicitaires (copywriting) inclus",
      "Formats adaptés (Story, Reel, Post)",
      "Mise en avant de vos produits",
      "Vidéos courtes TikTok/Reels automatisées"
    ],
    benefits: [
      "Image professionnelle instantanée",
      "Contenu qui arrête le scroll",
      "Optimisé pour les conversions",
      "Adapté au marché algérien"
    ]
  },
  "planification_ia": {
    name: "Planification de Contenu IA",
    description: "Maintenez une présence active sur les réseaux sociaux automatiquement",
    features: [
      "Calendrier de publication automatisé",
      "Génération d'idées de posts",
      "Contenu adapté à votre marque",
      "Analyse de performance simple",
      "Publication multi-réseaux (Facebook, Instagram, TikTok)"
    ],
    benefits: [
      "Présence constante sans effort",
      "Contenu cohérent et professionnel",
      "Gain de temps considérable",
      "Engagement client amélioré"
    ]
  }
};

export const PRICING_PLANS = {
  "starter": {
    name: "Starter Social",
    price: "9.900 DA/mois (~65 €)",
    target: "Petit vendeur qui débute ou qui a 1-3 produits",
    includes: [
      "10 visuels produits optimisés",
      "5 textes publicitaires prêts",
      "Formats adaptés Facebook & Instagram"
    ],
    excludes: [
      "Pas de robot WhatsApp",
      "Pas de calendrier éditorial"
    ],
    goal: "Image professionnelle avec petit budget"
  },
  "intelligent": {
    name: "Vendeur Intelligent",
    price: "19.900 DA/mois (~130 €)",
    target: "Vendeur actif avec plusieurs produits, veut automatiser",
    includes: [
      "20 visuels produits/mois",
      "10 vidéos courtes TikTok/Reels",
      "10 légendes publicitaires optimisées",
      "Robot WhatsApp/Messenger IA 24h/24",
      "Collecte infos clients automatique",
      "Confirmation commandes COD"
    ],
    excludes: [
      "Pas de calendrier automatique"
    ],
    goal: "Augmenter les ventes sans rater de prospects",
    popular: true
  },
  "topseller": {
    name: "Top Seller DZ",
    price: "39.900 DA/mois (~260 €)",
    target: "Gros vendeur ou boutique multi-produits",
    includes: [
      "50 visuels produits/mois",
      "20 vidéos promo TikTok/Reels",
      "Textes multi-réseaux",
      "Chatbot IA avancé (WhatsApp + Messenger + SMS)",
      "Calendrier automatique 30 posts/mois",
      "Dashboard ventes simple",
      "Publication auto ou notification"
    ],
    goal: "Professionnalisation complète - boutique autonome"
  }
};

export const GUARANTEES = {
  satisfaction: {
    title: "Satisfait ou Remboursé",
    description: "30 jours pour tester. Pas convaincu ? Remboursement intégral, sans questions."
  },
  results: {
    title: "Résultats Garantis", 
    description: "Si vous ne voyez pas d'amélioration après 60 jours, nous travaillons gratuitement jusqu'aux résultats."
  },
  flexibility: {
    title: "Sans Engagement",
    description: "Arrêtez quand vous voulez avec 30 jours de préavis. Pas de frais cachés, pas de piège."
  },
  trial: {
    title: "Essai Gratuit 7 Jours",
    description: "Testez notre système complet pendant une semaine, sans engagement."
  }
};

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // Questions sur l'entreprise
  {
    id: "company_1",
    category: "entreprise",
    question: "Qui êtes-vous ?",
    answer: `Nous sommes EcomBoost DZ, spécialistes de l'automatisation e-commerce pour le marché algérien. Notre mission est d'aider les vendeurs algériens à automatiser et professionnaliser leur business en ligne. Plus de 500 vendeurs nous font déjà confiance !`,
    keywords: ["qui", "entreprise", "ecomboost", "présentation", "société"]
  },
  {
    id: "company_2", 
    category: "entreprise",
    question: "Où êtes-vous basés ?",
    answer: `Nous sommes basés en Algérie avec une équipe locale qui comprend parfaitement le marché algérien. Notre support est disponible 7j/7 en français et arabe.`,
    keywords: ["où", "basé", "algérie", "local", "équipe", "localisation"]
  },
  
  // Questions sur les services
  {
    id: "services_1",
    category: "services",
    question: "Quels sont vos services ?",
    answer: `Nous proposons 3 services principaux :

🤖 **Automatisation WhatsApp** : Chatbot intelligent qui gère vos commandes 24h/24
🎨 **Création de Contenu Publicitaire** : Visuels et vidéos pros pour vos réseaux sociaux  
📅 **Planification de Contenu IA** : Calendrier automatisé pour vos publications

Tout est conçu spécifiquement pour le marché algérien !`,
    keywords: ["services", "offre", "que", "faites", "proposez"]
  },
  {
    id: "services_2",
    category: "services", 
    question: "Comment fonctionne le chatbot WhatsApp ?",
    answer: `Notre chatbot WhatsApp est très intelligent :

✅ Répond instantanément 24h/24 aux questions clients
✅ Présente votre catalogue de produits de façon interactive
✅ Collecte automatiquement les infos de livraison (nom, adresse, téléphone)
✅ Confirme les commandes et vous les transmet
✅ Réduit les erreurs de saisie
✅ Fonctionne aussi sur Messenger et SMS (selon le pack)

Résultat : vous ne ratez plus jamais un prospect, même la nuit !`,
    keywords: ["chatbot", "whatsapp", "robot", "automatisation", "comment", "fonctionne"]
  },
  {
    id: "services_3",
    category: "services",
    question: "Que comprend la création de contenu ?",
    answer: `Notre service de création de contenu inclut :

🎨 **Visuels professionnels** : Photos produits optimisées, designs modernes
📝 **Copywriting inclus** : Textes publicitaires qui convertissent
📱 **Formats adaptés** : Stories, Reels, Posts pour chaque réseau
🎬 **Vidéos courtes** : TikTok/Reels automatisées à partir de vos photos
🎯 **Optimisé conversions** : Conçu pour arrêter le scroll et vendre

Tout est adapté au marché algérien et à votre marque !`,
    keywords: ["contenu", "création", "visuels", "vidéos", "design", "publicité"]
  },

  // Questions sur les tarifs
  {
    id: "pricing_1",
    category: "tarifs",
    question: "Quels sont vos tarifs ?",
    answer: `Nous avons 3 packs adaptés à chaque niveau :

💚 **Starter Social** - 9.900 DA/mois (~65€)
Pour débuter : 10 visuels + 5 textes publicitaires

🔥 **Vendeur Intelligent** - 19.900 DA/mois (~130€) *LE PLUS POPULAIRE*
Contenu + Robot WhatsApp complet

⭐ **Top Seller DZ** - 39.900 DA/mois (~260€)  
Solution complète : Contenu + Robot + Calendrier auto + Dashboard

🎁 **Bonus** : Essai gratuit 7 jours pour tous les packs !`,
    keywords: ["tarifs", "prix", "coût", "combien", "packs", "abonnement"]
  },
  {
    id: "pricing_2",
    category: "tarifs",
    question: "Quel pack me conseillez-vous ?",
    answer: `Cela dépend de votre situation :

🟢 **Starter Social (9.900 DA)** si vous :
- Débutez ou avez 1-3 produits seulement
- Voulez juste une image plus pro

🔥 **Vendeur Intelligent (19.900 DA)** si vous :
- Avez plusieurs produits
- Recevez déjà des messages clients
- Voulez automatiser pour ne rien rater
*C'est notre pack le plus populaire !*

⭐ **Top Seller DZ (39.900 DA)** si vous :
- Avez une grosse activité
- Voulez une solution 100% automatisée
- Gérez plusieurs réseaux sociaux

Besoin d'aide pour choisir ? Je peux vous poser quelques questions !`,
    keywords: ["conseiller", "choisir", "quel", "pack", "recommandation", "mieux"]
  },

  // Questions sur les garanties
  {
    id: "guarantees_1",
    category: "garanties",
    question: "Avez-vous des garanties ?",
    answer: `Oui, nous avons plusieurs garanties solides :

🛡️ **Satisfait ou Remboursé** : 30 jours pour tester, remboursement intégral si pas convaincu
🎯 **Résultats Garantis** : Si pas d'amélioration après 60 jours, on travaille gratuitement jusqu'aux résultats
🔒 **Sans Engagement** : Arrêt possible avec 30 jours de préavis, pas de frais cachés
🎁 **Essai Gratuit** : 7 jours d'essai complet avant de payer

Plus de 500 vendeurs algériens nous font confiance !`,
    keywords: ["garanties", "remboursement", "satisfait", "engagement", "essai", "gratuit"]
  },

  // Questions techniques
  {
    id: "technical_1",
    category: "technique",
    question: "Comment ça marche techniquement ?",
    answer: `C'est très simple pour vous :

1️⃣ **Setup initial** : On configure tout pour vous (WhatsApp Business, comptes réseaux sociaux)
2️⃣ **Formation** : On vous montre comment utiliser le dashboard en 30 minutes
3️⃣ **Automatisation** : Tout fonctionne en arrière-plan
4️⃣ **Suivi** : Vous recevez les commandes directement, on s'occupe du reste

Pas besoin d'être technique, notre équipe gère tout !`,
    keywords: ["comment", "marche", "technique", "installation", "setup", "configuration"]
  },
  {
    id: "technical_2",
    category: "technique", 
    question: "Faut-il des compétences techniques ?",
    answer: `Absolument pas ! Notre solution est conçue pour être ultra-simple :

✅ **Installation** : Notre équipe configure tout pour vous
✅ **Formation** : 30 minutes suffisent pour tout comprendre  
✅ **Utilisation** : Interface simple, tout est automatisé
✅ **Support** : Équipe locale disponible 7j/7 pour vous aider

Si vous savez utiliser WhatsApp et Facebook, vous savez utiliser nos outils !`,
    keywords: ["compétences", "techniques", "difficile", "simple", "formation", "aide"]
  },

  // Questions sur le ROI
  {
    id: "roi_1",
    category: "roi",
    question: "Quel retour sur investissement puis-je espérer ?",
    answer: `Nos clients voient généralement :

📈 **+40% de conversions** grâce au chatbot qui ne rate aucun prospect
⏰ **-80% de temps** passé à répondre aux messages
💰 **ROI positif dès le 1er mois** pour la plupart des vendeurs
🎯 **+60% d'engagement** avec le contenu professionnel

Exemple concret : Si vous vendez pour 100.000 DA/mois, le pack Vendeur Intelligent (19.900 DA) peut vous faire gagner 40.000 DA supplémentaires, soit un ROI de +100% !

Voulez-vous qu'on calcule votre ROI personnalisé ?`,
    keywords: ["roi", "retour", "investissement", "rentabilité", "bénéfices", "gains"]
  },

  // Questions sur la concurrence
  {
    id: "competition_1",
    category: "concurrence",
    question: "Quelle est votre différence avec la concurrence ?",
    answer: `Ce qui nous rend uniques :

🇩🇿 **Spécialisés Algérie** : On comprend le marché local (COD, dialecte, habitudes)
🤖 **IA vraiment intelligente** : Pas juste des réponses automatiques, mais de la vraie compréhension
💰 **Tarifs transparents** : Pas de frais cachés, tout est inclus
🛡️ **Garanties solides** : 30 jours satisfait ou remboursé + résultats garantis
👥 **Support local** : Équipe algérienne, support 7j/7 en français/arabe
🎁 **Essai gratuit** : 7 jours pour tester sans risque

La plupart de nos concurrents sont étrangers et ne comprennent pas le marché algérien !`,
    keywords: ["différence", "concurrence", "pourquoi", "choisir", "unique", "avantages"]
  }
];

// Fonction pour rechercher dans la base de connaissances
export function searchKnowledge(query: string): KnowledgeItem[] {
  const searchTerms = query.toLowerCase().split(' ');
  
  return KNOWLEDGE_BASE.filter(item => {
    const searchText = `${item.question} ${item.answer} ${item.keywords.join(' ')}`.toLowerCase();
    return searchTerms.some(term => searchText.includes(term));
  }).sort((a, b) => {
    // Prioriser les correspondances exactes dans les mots-clés
    const aScore = a.keywords.filter(keyword => 
      searchTerms.some(term => keyword.toLowerCase().includes(term))
    ).length;
    const bScore = b.keywords.filter(keyword => 
      searchTerms.some(term => keyword.toLowerCase().includes(term))
    ).length;
    return bScore - aScore;
  });
}

// Fonction pour obtenir des suggestions de questions
export function getSuggestedQuestions(category?: string): string[] {
  const questions = category 
    ? KNOWLEDGE_BASE.filter(item => item.category === category)
    : KNOWLEDGE_BASE;
  
  return questions.slice(0, 5).map(item => item.question);
}