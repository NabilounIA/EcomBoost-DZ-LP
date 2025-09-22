// Données d'entraînement pour améliorer l'intelligence du chatbot
export interface ConversationExample {
  id: string;
  userMessage: string;
  context?: string;
  expertResponse: string;
  category: string;
  keywords: string[];
  followUpQuestions?: string[];
}

export const CONVERSATION_EXAMPLES: ConversationExample[] = [
  // Conversations sur les services
  {
    id: "service_1",
    userMessage: "Je vends des vêtements sur Facebook, comment vous pouvez m'aider ?",
    context: "Vendeur de vêtements sur Facebook",
    expertResponse: "Parfait ! Pour un vendeur de vêtements sur Facebook, nos solutions sont idéales :\n\n🤖 **Chatbot WhatsApp** : Vos clients pourront voir votre catalogue, choisir tailles/couleurs, et commander automatiquement\n🎨 **Visuels professionnels** : Photos produits optimisées qui donnent envie d'acheter\n📱 **Publication automatique** : Vos nouveautés postées automatiquement aux meilleures heures\n\nAvec le pack 'Vendeur Intelligent' (19.900 DA/mois), vous pourriez facilement doubler vos ventes !",
    category: "services",
    keywords: ["vêtements", "facebook", "vendre", "aide"],
    followUpQuestions: ["Quel est votre chiffre d'affaires actuel ?", "Combien de messages recevez-vous par jour ?", "Voulez-vous voir une démo ?"]
  },
  {
    id: "service_2", 
    userMessage: "J'ai une boutique de cosmétiques, est-ce que ça marche pour moi ?",
    context: "Boutique de cosmétiques",
    expertResponse: "Absolument ! Les cosmétiques sont parfaits pour nos solutions :\n\n✨ **Visuels attractifs** : Photos avant/après, tutoriels beauté automatisés\n🤖 **Chatbot spécialisé** : Conseils personnalisés selon le type de peau, recommandations produits\n📊 **Suivi client** : Rappels pour les réapprovisionnements, fidélisation\n\nNos clientes dans la beauté voient en moyenne +60% d'augmentation des ventes. Le secteur cosmétique répond très bien à l'automatisation !",
    category: "services",
    keywords: ["cosmétiques", "beauté", "boutique", "marche"],
    followUpQuestions: ["Vendez-vous en ligne ou en magasin ?", "Quels sont vos produits phares ?", "Calculer votre ROI potentiel ?"]
  },

  // Conversations sur les tarifs
  {
    id: "pricing_1",
    userMessage: "19.900 DA c'est cher pour moi, vous avez moins cher ?",
    context: "Budget limité",
    expertResponse: "Je comprends votre préoccupation ! Nous avons le pack 'Starter Social' à 9.900 DA/mois :\n\n✅ 10 visuels professionnels par mois\n✅ 5 textes publicitaires optimisés\n✅ Formats adaptés Facebook & Instagram\n\nC'est parfait pour commencer et avoir une image plus professionnelle. Et rappelez-vous :\n🎁 **7 jours d'essai gratuit** pour tester sans risque\n💰 **ROI rapide** : même avec 2-3 ventes supplémentaires, c'est rentabilisé !",
    category: "tarifs",
    keywords: ["cher", "moins cher", "budget", "prix"],
    followUpQuestions: ["Quel est votre budget mensuel marketing ?", "Combien vendez-vous par mois actuellement ?", "Voulez-vous essayer 7 jours gratuits ?"]
  },
  {
    id: "pricing_2",
    userMessage: "Pourquoi payer alors que je peux faire moi-même ?",
    context: "Questionnement sur la valeur",
    expertResponse: "Excellente question ! Voici pourquoi nos clients choisissent nos services :\n\n⏰ **Temps** : Créer 20 visuels pros = 40h de travail. Nous : 0h pour vous\n🎯 **Expertise** : Nos designs convertissent 3x mieux que la moyenne\n🤖 **Technologie** : Chatbot IA impossible à créer soi-même\n💰 **ROI** : Nos clients gagnent en moyenne 40.000 DA/mois supplémentaires\n\nQuestion : combien vaut votre temps ? Si vous gagnez 2.000 DA/heure, 40h = 80.000 DA. Notre pack coûte 19.900 DA...\n\n🎁 Testez 7 jours gratuits, vous verrez la différence !",
    category: "tarifs",
    keywords: ["faire moi-même", "pourquoi payer", "valeur"],
    followUpQuestions: ["Combien d'heures passez-vous sur votre marketing ?", "Quel est votre taux horaire ?", "Voulez-vous voir des exemples de résultats ?"]
  },

  // Conversations sur le ROI
  {
    id: "roi_1",
    userMessage: "Je vends pour 50.000 DA par mois, ça vaut le coup ?",
    context: "CA 50.000 DA/mois",
    expertResponse: "Avec 50.000 DA/mois, c'est PARFAIT pour commencer !\n\n📊 **Votre situation** :\n- CA actuel : 50.000 DA/mois\n- Pack recommandé : Starter Social (9.900 DA)\n- Coût : 20% de votre CA\n\n📈 **Potentiel réaliste** :\n- +30% de ventes = 65.000 DA/mois\n- Gain mensuel : +15.000 DA\n- ROI : +51% dès le 1er mois !\n\n🎯 **Pourquoi ça marche** : Image plus pro = plus de confiance = plus de ventes\n\nVoulez-vous essayer 7 jours gratuits ?",
    category: "roi",
    keywords: ["50000", "vaut le coup", "rentable"],
    followUpQuestions: ["Dans quel secteur vendez-vous ?", "Combien de prospects perdez-vous par manque de suivi ?", "Prêt pour l'essai gratuit ?"]
  },

  // Conversations techniques
  {
    id: "technical_1",
    userMessage: "Je ne suis pas doué en informatique, c'est compliqué ?",
    context: "Peur de la complexité technique",
    expertResponse: "Rassurez-vous, c'est conçu pour être ULTRA-SIMPLE !\n\n✅ **Installation** : Notre équipe fait tout pour vous (0 manipulation)\n✅ **Formation** : 30 minutes en visio, c'est tout !\n✅ **Utilisation** : Plus simple que WhatsApp\n✅ **Support** : Équipe algérienne disponible 7j/7\n\n👥 **Témoignage** : 'Je ne savais même pas créer un post Facebook, maintenant mon business tourne tout seul !' - Amina, vendeuse de bijoux\n\nSi vous savez envoyer un message WhatsApp, vous savez utiliser nos outils !",
    category: "technique",
    keywords: ["pas doué", "informatique", "compliqué", "difficile"],
    followUpQuestions: ["Utilisez-vous déjà WhatsApp Business ?", "Avez-vous une page Facebook ?", "Voulez-vous une démonstration ?"]
  },

  // Conversations sur la concurrence
  {
    id: "competition_1",
    userMessage: "J'ai vu d'autres entreprises qui font pareil, pourquoi vous ?",
    context: "Comparaison concurrence",
    expertResponse: "Excellente question ! Voici ce qui nous différencie :\n\n🇩🇿 **100% Algérien** : On comprend le marché local (COD, dialecte, habitudes)\n🤖 **IA vraiment intelligente** : Pas des réponses robotiques, mais de la vraie compréhension\n💰 **Transparence totale** : Prix fixes, pas de frais cachés\n🛡️ **Garanties uniques** : 30j satisfait ou remboursé + résultats garantis\n👥 **Support local** : Équipe à Alger, pas en France ou Inde\n📊 **Résultats prouvés** : +500 clients, +40% de ventes en moyenne\n\n🎁 **Test gratuit 7 jours** : Comparez par vous-même !\n\nLa différence ? Nous, on VEND en Algérie depuis 5 ans !",
    category: "concurrence",
    keywords: ["autres entreprises", "concurrence", "pourquoi vous", "différence"],
    followUpQuestions: ["Avec qui nous comparez-vous ?", "Qu'est-ce qui vous préoccupe le plus ?", "Voulez-vous voir nos témoignages clients ?"]
  },

  // Conversations sur les résultats
  {
    id: "results_1",
    userMessage: "Vous avez des preuves que ça marche vraiment ?",
    context: "Demande de preuves",
    expertResponse: "Bien sûr ! Voici des résultats concrets de nos clients :\n\n📊 **Statistiques globales** :\n- +500 clients actifs\n- +40% de ventes en moyenne\n- 96% de satisfaction client\n\n🏆 **Cas concrets** :\n- Boutique vêtements : 80.000 → 140.000 DA/mois en 3 mois\n- Vendeur cosmétiques : 45.000 → 75.000 DA/mois en 2 mois\n- Magasin électronique : 200.000 → 320.000 DA/mois en 4 mois\n\n💬 **Témoignages** :\n'Avant je ratais 50% des messages, maintenant 0% !' - Karim\n'Mon chiffre a doublé en 6 mois' - Fatima\n\n🎁 **Votre preuve** : Essai gratuit 7 jours, résultats visibles dès J+3 !",
    category: "résultats",
    keywords: ["preuves", "marche vraiment", "résultats", "témoignages"],
    followUpQuestions: ["Dans quel secteur êtes-vous ?", "Quel résultat vous convaincrait ?", "Prêt pour l'essai gratuit ?"]
  },

  // Conversations sur l'engagement
  {
    id: "engagement_1",
    userMessage: "Et si je veux arrêter après 1 mois ?",
    context: "Peur de l'engagement",
    expertResponse: "Aucun problème ! Nous sommes 100% flexibles :\n\n🔒 **Sans engagement** : Arrêt possible avec 30 jours de préavis\n💰 **Satisfait ou remboursé** : 30 jours pour tester, remboursement intégral si pas convaincu\n📞 **Arrêt simple** : Un appel ou message, c'est tout\n🎁 **Bonus** : 7 jours d'essai gratuit avant même de payer\n\n💡 **Pourquoi cette flexibilité ?**\nParce qu'on est sûrs de nos résultats ! 98% de nos clients restent après le 1er mois.\n\n🤝 **Notre philosophie** : On préfère des clients satisfaits que des clients forcés.\n\nVous risquez quoi avec 7 jours gratuits ?",
    category: "engagement",
    keywords: ["arrêter", "engagement", "flexible", "sortir"],
    followUpQuestions: ["Qu'est-ce qui vous inquiète le plus ?", "Avez-vous eu de mauvaises expériences ?", "Voulez-vous commencer par l'essai gratuit ?"]
  }
];

// Fonction pour trouver des exemples de conversation similaires
export function findSimilarConversations(userMessage: string, category?: string): ConversationExample[] {
  const searchTerms = userMessage.toLowerCase().split(' ');
  
  let examples = CONVERSATION_EXAMPLES;
  if (category) {
    examples = examples.filter(ex => ex.category === category);
  }
  
  return examples.filter(example => {
    const searchText = `${example.userMessage} ${example.keywords.join(' ')}`.toLowerCase();
    return searchTerms.some(term => searchText.includes(term));
  }).sort((a, b) => {
    // Prioriser les correspondances de mots-clés
    const aScore = a.keywords.filter(keyword => 
      searchTerms.some(term => keyword.toLowerCase().includes(term))
    ).length;
    const bScore = b.keywords.filter(keyword => 
      searchTerms.some(term => keyword.toLowerCase().includes(term))
    ).length;
    return bScore - aScore;
  });
}

// Réponses expertes pour situations complexes
export const EXPERT_RESPONSES = {
  objections: {
    price: "Je comprends votre préoccupation sur le prix. Regardons ensemble le retour sur investissement...",
    time: "C'est justement pour vous faire gagner du temps que nous existons ! Laissez-moi vous expliquer...",
    complexity: "Nos solutions sont conçues pour être ultra-simples. Voici comment...",
    results: "Excellente question ! Voici des preuves concrètes de nos résultats..."
  },
  
  encouragement: {
    hesitant: "Je comprends vos hésitations, c'est normal avant un investissement. Que puis-je clarifier ?",
    interested: "Je vois que nos solutions vous intéressent ! Voulez-vous qu'on regarde ensemble ce qui vous convient le mieux ?",
    ready: "Parfait ! Je sens que vous êtes prêt à passer à l'étape suivante. Commençons par..."
  },
  
  closing: {
    trial: "Le meilleur moyen de voir si ça marche pour vous, c'est l'essai gratuit 7 jours. Qu'en pensez-vous ?",
    demo: "Voulez-vous qu'on programme une démonstration personnalisée de 15 minutes ?",
    contact: "Souhaitez-vous parler directement avec un de nos experts pour approfondir ?"
  }
};

// Fonction pour détecter le sentiment et adapter la réponse
export function detectSentiment(message: string): 'positive' | 'negative' | 'neutral' | 'hesitant' {
  const lowerMessage = message.toLowerCase();
  
  // Sentiment positif
  if (lowerMessage.includes('intéressant') || lowerMessage.includes('bien') || 
      lowerMessage.includes('parfait') || lowerMessage.includes('génial') ||
      lowerMessage.includes('super') || lowerMessage.includes('excellent')) {
    return 'positive';
  }
  
  // Sentiment négatif
  if (lowerMessage.includes('cher') || lowerMessage.includes('compliqué') || 
      lowerMessage.includes('pas sûr') || lowerMessage.includes('doute') ||
      lowerMessage.includes('problème') || lowerMessage.includes('difficile')) {
    return 'negative';
  }
  
  // Hésitation
  if (lowerMessage.includes('peut-être') || lowerMessage.includes('je ne sais pas') || 
      lowerMessage.includes('hésiter') || lowerMessage.includes('réfléchir') ||
      lowerMessage.includes('voir') || lowerMessage.includes('mais')) {
    return 'hesitant';
  }
  
  return 'neutral';
}