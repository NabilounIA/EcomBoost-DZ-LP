import React, { useState, useEffect, useRef } from 'react';
import { analytics } from '../services/analytics';
import { searchKnowledge, getSuggestedQuestions, KNOWLEDGE_BASE, COMPANY_INFO, SERVICES_DETAILS, PRICING_PLANS } from '../data/knowledgeBase';
import { findSimilarConversations, detectSentiment, EXPERT_RESPONSES, ConversationExample } from '../data/trainingData';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  type?: 'text' | 'options' | 'whatsapp';
  options?: string[];
}

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  currentStep: string;
  userInfo: {
    name?: string;
    business?: string;
    phone?: string;
    interest?: string;
  };
}

const IntelligentChatbot: React.FC = () => {
  const [state, setState] = useState({
    messages: [] as Message[],
    currentStep: 'welcome',
    userInfo: {},
    conversationContext: {
      topics: [] as string[],
      userInterests: [] as string[],
      lastQuestions: [] as string[]
    }
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Réponses intelligentes basées sur le contexte
  const responses = {
    welcome: {
      text: "👋 Bonjour ! Je suis votre assistant EcomBoost DZ. Je suis là pour vous aider à automatiser votre e-commerce en Algérie. Comment puis-je vous aider aujourd'hui ?",
      options: [
        "🚀 Découvrir nos services",
        "💰 Calculer mon ROI",
        "📞 Parler à un expert",
        "❓ Poser une question"
      ]
    },
    solutions: {
      text: "Parfait ! Nos solutions d'automatisation incluent :",
      options: [
        "🤖 Chatbots WhatsApp intelligents",
        "📊 Analytics et suivi avancé",
        "🎯 Publicités automatisées",
        "📱 Gestion réseaux sociaux",
        "🔄 Retour au menu principal"
      ]
    },
    roi: {
      text: "Excellent choix ! Pour calculer votre ROI potentiel, j'ai besoin de quelques informations :",
      type: 'form'
    },
    expert: {
      text: "Je vais vous connecter avec un de nos experts ! Pouvez-vous me donner votre nom et numéro WhatsApp ?",
      type: 'contact'
    },
    question: {
      text: "Je suis là pour répondre à toutes vos questions ! Que souhaitez-vous savoir ?",
      type: 'open'
    }
  };

  // Système intelligent de réponse basé sur la base de connaissances et le contexte
  const getIntelligentResponse = (message: string): { response: string; suggestions?: string[]; updateContext?: any } => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Détection du sentiment pour adapter le ton
    const sentiment = detectSentiment(message);
    
    // Recherche d'exemples de conversations similaires
    const similarConversations = findSimilarConversations(message);
    
    // Rechercher dans la base de connaissances
    const knowledgeResults = searchKnowledge(message);
    
    // Détection d'intentions spécifiques pour les cas non couverts
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') ||
        lowerMessage.includes('bonsoir') || lowerMessage.includes('hey')) {
      
      // Personnaliser la salutation selon l'historique
      let greeting = `👋 Bonjour ! Je suis votre assistant ${COMPANY_INFO.name}. ${COMPANY_INFO.description}.`;
      
      if (state.conversationContext.topics.length > 0) {
        greeting += " Content de vous revoir ! ";
      }
      
      greeting += " Comment puis-je vous aider aujourd'hui ?";
      
      return {
        response: greeting,
        suggestions: ["Quels sont vos services ?", "Quels sont vos tarifs ?", "Comment fonctionne le chatbot WhatsApp ?"]
      };
    }
    
    if (lowerMessage.includes('merci') || lowerMessage.includes('thank')) {
      return {
        response: "De rien ! Je suis là pour vous aider. Avez-vous d'autres questions ?",
        suggestions: ["Voir les tarifs", "Parler à un expert", "Calculer mon ROI"]
      };
    }
    
    // Utiliser les exemples de conversation si disponibles
    if (similarConversations.length > 0) {
      const bestExample = similarConversations[0];
      let response = bestExample.expertResponse;
      
      // Adapter la réponse selon le sentiment
      if (sentiment === 'negative') {
        response = "Je comprends vos préoccupations. " + response;
      } else if (sentiment === 'hesitant') {
        response = "C'est normal d'avoir des questions ! " + response;
      } else if (sentiment === 'positive') {
        response = "Excellent ! " + response;
      }
      
      return {
        response,
        suggestions: bestExample.followUpQuestions || getSuggestedQuestions(bestExample.category).slice(0, 3),
        updateContext: {
          topics: [...new Set([...state.conversationContext.topics, bestExample.category])],
          userInterests: [...new Set([...state.conversationContext.userInterests, ...bestExample.keywords])],
          lastQuestions: [...state.conversationContext.lastQuestions, message].slice(-5)
        }
      };
    }
    
    // Si on trouve une correspondance forte, utiliser cette réponse
    if (knowledgeResults.length > 0) {
      const bestMatch = knowledgeResults[0];
      
      // Personnaliser la réponse selon le contexte de conversation
      let personalizedResponse = bestMatch.answer;
      
      // Adapter selon le sentiment
      if (sentiment === 'negative') {
        personalizedResponse = "Je comprends vos préoccupations. " + personalizedResponse;
      } else if (sentiment === 'hesitant') {
        personalizedResponse = "Laissez-moi vous éclairer ! " + personalizedResponse;
      }
      
      // Si l'utilisateur a déjà posé des questions sur les tarifs, ajouter des infos contextuelles
      if (state.conversationContext.topics.includes('tarifs') && bestMatch.category === 'services') {
        personalizedResponse += "\n\n💡 Puisque vous vous intéressez aux tarifs, sachez que nous avons des packs adaptés à chaque budget !";
      }
      
      // Si l'utilisateur a déjà parlé de ROI, mentionner les résultats
      if (state.conversationContext.topics.includes('roi') && bestMatch.category === 'services') {
        personalizedResponse += "\n\n📈 Nos clients voient en moyenne +40% d'augmentation de leurs ventes !";
      }
      
      // Ajouter des suggestions contextuelles intelligentes
      let suggestions = getSuggestedQuestions(bestMatch.category).slice(0, 3);
      
      // Éviter de répéter les questions déjà posées
      suggestions = suggestions.filter(q => 
        q !== bestMatch.question && 
        !state.conversationContext.lastQuestions.includes(q)
      );
      
      // Ajouter des suggestions cross-catégories si pertinent
      if (bestMatch.category === 'services' && !state.conversationContext.topics.includes('tarifs')) {
        suggestions.push("Quels sont vos tarifs ?");
      }
      if (bestMatch.category === 'tarifs' && !state.conversationContext.topics.includes('roi')) {
        suggestions.push("Quel retour sur investissement puis-je espérer ?");
      }
      
      return {
        response: personalizedResponse,
        suggestions: suggestions.slice(0, 3),
        updateContext: {
          topics: [...new Set([...state.conversationContext.topics, bestMatch.category])],
          lastQuestions: [...state.conversationContext.lastQuestions, bestMatch.question].slice(-5)
        }
      };
    }
    
    // Réponse par défaut adaptée au sentiment
    let defaultResponse = `Je ne suis pas sûr de bien comprendre votre question. Voici ce que je peux vous expliquer sur ${COMPANY_INFO.name} :`;
    
    if (sentiment === 'negative') {
      defaultResponse = EXPERT_RESPONSES.encouragement.hesitant;
    } else if (sentiment === 'positive') {
      defaultResponse = EXPERT_RESPONSES.encouragement.interested;
    } else if (sentiment === 'hesitant') {
      defaultResponse = EXPERT_RESPONSES.encouragement.hesitant;
    }
    
    // Adapter les suggestions selon l'historique
    let defaultSuggestions = ["Quels sont vos services ?", "Quels sont vos tarifs ?", "Quelle est votre différence avec la concurrence ?"];
    
    if (state.conversationContext.topics.includes('services')) {
      defaultSuggestions = ["Quels sont vos tarifs ?", "Calculer mon ROI", "Parler à un expert"];
    }
    if (state.conversationContext.topics.includes('tarifs')) {
      defaultSuggestions = ["Calculer mon ROI", "Comment fonctionne le chatbot WhatsApp ?", "Parler à un expert"];
    }
    
    return {
      response: defaultResponse,
      suggestions: defaultSuggestions
    };
  };

  const smartResponses = {
    greeting: "👋 Bonjour ! Je suis l'assistant virtuel d'EcomBoost DZ. Je suis là pour vous aider à découvrir comment notre plateforme peut transformer votre e-commerce. Que puis-je faire pour vous ?",
    pricing: "💰 Nos tarifs sont très compétitifs ! Nous proposons des formules à partir de 15,000 DA/mois. Voulez-vous que je vous connecte avec un expert pour un devis personnalisé ?",
    whatsapp: "🤖 Nos chatbots WhatsApp peuvent automatiser jusqu'à 80% de vos conversations clients ! Ils gèrent les commandes, répondent aux questions fréquentes et transfèrent les cas complexes à votre équipe.",
    question: "🤔 Excellente question ! Je suis là pour vous éclairer sur tous les aspects d'EcomBoost DZ. Pouvez-vous être plus précis sur ce que vous aimeriez savoir ?",
    analytics: "📊 Notre système d'analytics vous donne une vision complète : taux de conversion, sources de trafic, comportement clients, ROI des campagnes. Tout en temps réel !",
    ads: "🎯 Nous automatisons vos publicités Facebook/Instagram avec de l'IA. Optimisation automatique des audiences, budgets et créatifs pour maximiser vos ventes !",
    contact: "📞 Parfait ! Je vais vous connecter avec un expert. Donnez-moi votre numéro WhatsApp et nous vous contacterons dans les 30 minutes !",
    roi: "📈 En moyenne, nos clients voient une augmentation de 150% de leurs ventes en 3 mois ! Voulez-vous calculer votre ROI potentiel ?",
    general: "🤔 Intéressant ! Pouvez-vous me donner plus de détails ? Je suis là pour vous aider avec tous vos besoins d'automatisation e-commerce."
  };

  // Ajouter un message avec animation de frappe
  const addMessage = (text: string, isBot: boolean = true, type: 'text' | 'options' | 'whatsapp' = 'text', options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      type,
      options
    };

    if (isBot) {
      setIsTyping(true);
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));
        setIsTyping(false);
      }, 1000 + Math.random() * 1000); // Délai réaliste
    } else {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));
    }
  };

  // Gérer les réponses utilisateur
  const handleUserMessage = (message: string) => {
    // Ajouter le message utilisateur
    addMessage(message, false);

    // Gérer les conversations contextuelles selon l'étape actuelle
    if (state.currentStep === 'roi_calculation') {
      handleROICalculation(message);
      return;
    }

    if (state.currentStep === 'contact_expert') {
      handleContactExpert(message);
      return;
    }

    // Obtenir une réponse intelligente basée sur la base de connaissances
    const intelligentResponse = getIntelligentResponse(message);
    
    // Mettre à jour le contexte de conversation si nécessaire
    if (intelligentResponse.updateContext) {
      setState(prev => ({
        ...prev,
        conversationContext: {
          ...prev.conversationContext,
          ...intelligentResponse.updateContext
        }
      }));
    }
    
    // Répondre intelligemment
    setTimeout(() => {
      addMessage(intelligentResponse.response, true);

      // Proposer des suggestions contextuelles si disponibles
      if (intelligentResponse.suggestions && intelligentResponse.suggestions.length > 0) {
        setTimeout(() => {
          addMessage(
            "Voici quelques questions que vous pourriez avoir :",
            true,
            'options',
            intelligentResponse.suggestions
          );
        }, 2000);
      }
    }, 1500);

    // Analytics
    analytics.trackEvent('chatbot_interaction', {
      message: message.substring(0, 50), // Limiter pour la confidentialité
      hasKnowledgeMatch: intelligentResponse.suggestions ? intelligentResponse.suggestions.length > 0 : false,
      conversationTopics: state.conversationContext.topics
    });
  };

  // Gérer le calcul de ROI étape par étape
  const handleROICalculation = (message: string) => {
    const cleanMessage = message.trim().toLowerCase();
    
    // Vérifier si c'est un nombre (chiffre d'affaires)
    const revenue = parseFloat(cleanMessage.replace(/[^\d.,]/g, '').replace(',', '.'));
    
    if (!isNaN(revenue) && revenue > 0) {
      // Calculer le ROI potentiel
      const potentialIncrease = revenue * 1.5; // 150% d'augmentation moyenne
      const monthlyGain = potentialIncrease - revenue;
      const yearlyGain = monthlyGain * 12;
      
      setTimeout(() => {
        addMessage(`💰 Excellent ! Avec un CA de ${revenue.toLocaleString('fr-FR')} DA/mois, voici votre potentiel :\n\n📈 CA potentiel : ${potentialIncrease.toLocaleString('fr-FR')} DA/mois\n💵 Gain mensuel : +${monthlyGain.toLocaleString('fr-FR')} DA\n🎯 Gain annuel : +${yearlyGain.toLocaleString('fr-FR')} DA\n\nCes résultats sont basés sur la moyenne de nos clients. Voulez-vous une analyse personnalisée ?`, true, 'options', [
          "📞 Analyse personnalisée gratuite",
          "💬 Parler à un expert",
          "🔄 Retour au menu"
        ]);
        setState(prev => ({ ...prev, currentStep: null }));
      }, 1500);
    } else {
      // Message non reconnu comme un chiffre
      setTimeout(() => {
        addMessage("🤔 Je n'ai pas bien compris votre chiffre d'affaires. Pouvez-vous me donner un montant en dinars algériens ? Par exemple : 150000 ou 1500000");
      }, 1000);
    }
  };

  // Gérer le contact expert
  const handleContactExpert = (message: string) => {
    const cleanMessage = message.trim().toLowerCase();
    
    // Vérifier si l'utilisateur veut annuler ou poser une autre question
    if (cleanMessage.includes('non') || cleanMessage.includes('pas') || cleanMessage.includes('annuler') || 
        cleanMessage.includes('retour') || cleanMessage.includes('menu') || cleanMessage.includes('services') ||
        cleanMessage.includes('quels') || cleanMessage.includes('que') || cleanMessage.includes('comment')) {
      
      setState(prev => ({ ...prev, currentStep: null }));
      
      // Si c'est une question sur les services, répondre directement
      if (cleanMessage.includes('services') || cleanMessage.includes('quels') || cleanMessage.includes('que')) {
        setTimeout(() => {
          addMessage("🚀 Nos services EcomBoost DZ :\n\n🤖 **Chatbots WhatsApp intelligents**\n- Automatisation des conversations\n- Gestion des commandes\n- Support client 24/7\n\n📊 **Analytics avancés**\n- Suivi des performances\n- Rapports détaillés\n- Optimisation ROI\n\n🎯 **Publicités automatisées**\n- Campagnes Facebook/Instagram\n- Optimisation IA\n- Ciblage intelligent\n\n📱 **Gestion réseaux sociaux**\n- Publication automatique\n- Engagement client\n- Croissance organique", true, 'options', [
            "💰 Voir les tarifs",
            "📊 Calculer mon ROI", 
            "📞 Parler à un expert",
            "🔄 Retour au menu"
          ]);
        }, 1500);
      } else {
        setTimeout(() => {
          addMessage("Pas de problème ! Je reste à votre disposition pour toute question. Que souhaitez-vous savoir ?", true, 'options', [
            "🚀 Découvrir nos services",
            "💰 Voir les tarifs",
            "📊 Calculer mon ROI",
            "🔄 Retour au menu"
          ]);
        }, 1000);
      }
      return;
    }
    
    // Vérifier si c'est un numéro de téléphone
    if (/[\d\s\-\+\(\)]{8,}/.test(cleanMessage)) {
      setTimeout(() => {
        addMessage(`📞 Parfait ! J'ai noté votre numéro : ${cleanMessage}\n\nUn expert EcomBoost DZ va vous contacter dans les 30 minutes pour :\n\n✅ Analyser vos besoins spécifiques\n✅ Vous proposer une solution sur mesure\n✅ Répondre à toutes vos questions\n\nMerci pour votre confiance ! 🚀`, true, 'whatsapp');
        setState(prev => ({ ...prev, currentStep: null }));
      }, 1500);
    } else {
      setTimeout(() => {
        addMessage("📱 Pour vous contacter, j'ai besoin de votre numéro WhatsApp. Pouvez-vous me le donner ? (ex: 0555123456 ou +213555123456)\n\n💡 Ou tapez 'retour' pour revenir au menu principal.");
      }, 1000);
    }
  };

  // Gérer les options prédéfinies
  const handleOptionClick = (option: string) => {
    addMessage(option, false);

    setTimeout(() => {
      switch (option) {
        case "🚀 Découvrir nos services":
        case "🚀 Découvrir nos solutions":
          addMessage("🚀 Nos services EcomBoost DZ :\n\n🤖 **Chatbots WhatsApp intelligents**\n- Automatisation des conversations\n- Gestion des commandes\n- Support client 24/7\n\n📊 **Analytics avancés**\n- Suivi des performances\n- Rapports détaillés\n- Optimisation ROI\n\n🎯 **Publicités automatisées**\n- Campagnes Facebook/Instagram\n- Optimisation IA\n- Ciblage intelligent\n\n📱 **Gestion réseaux sociaux**\n- Publication automatique\n- Engagement client\n- Croissance organique", true, 'options', [
            "🤖 En savoir plus sur les chatbots",
            "📊 Analytics et suivi avancé", 
            "💰 Voir les tarifs",
            "🔄 Retour au menu"
          ]);
          break;
        case "💰 Calculer mon ROI":
          addMessage("📊 Parfait ! Pour calculer votre ROI, j'ai besoin de connaître votre chiffre d'affaires mensuel actuel. Pouvez-vous me le dire ?");
          setState(prev => ({ ...prev, currentStep: 'roi_calculation' }));
          break;
        case "📞 Parler à un expert":
          addMessage(responses.expert.text);
          setState(prev => ({ ...prev, currentStep: 'contact_expert' }));
          break;
        case "❓ Poser une question":
          addMessage(responses.question.text);
          setState(prev => ({ ...prev, currentStep: 'open_question' }));
          break;
        case "🤖 Chatbots WhatsApp intelligents":
        case "🤖 En savoir plus sur les chatbots":
          addMessage("🤖 Nos chatbots WhatsApp révolutionnent votre service client ! Ils peuvent :\n\n✅ Répondre 24h/24 aux questions\n✅ Prendre des commandes automatiquement\n✅ Envoyer des confirmations\n✅ Gérer les réclamations\n✅ Proposer des produits personnalisés\n\nVoulez-vous voir une démonstration ?", true, 'options', ["👀 Voir la démo", "💬 Parler à un expert", "🔄 Retour au menu"]);
          break;
        case "📊 Analytics et suivi avancé":
          addMessage("📊 Notre dashboard analytics vous donne une vision 360° :\n\n📈 Ventes en temps réel\n👥 Comportement des visiteurs\n💰 ROI des campagnes\n🎯 Taux de conversion\n📱 Performance mobile vs desktop\n\nTout est automatisé et mis à jour en temps réel !", true, 'options', ["📞 Demander une démo", "💰 Voir les tarifs", "🔄 Retour au menu"]);
          break;
        case "💬 Parler à un expert":
        case "📞 Analyse personnalisée gratuite":
        case "📞 Demander une démo":
          addMessage("👨‍💼 Parfait ! Un expert EcomBoost DZ va vous contacter pour :\n\n✅ Analyser vos besoins spécifiques\n✅ Vous proposer une solution sur mesure\n✅ Répondre à toutes vos questions\n\nPour cela, j'ai besoin de votre numéro WhatsApp :", true);
          setState(prev => ({ ...prev, currentStep: 'contact_expert' }));
          break;
        case "💰 Voir les tarifs":
          addMessage("💰 Nos formules sont adaptées à tous les budgets :\n\n🥉 **Starter** : 15,000 DA/mois\n- Chatbot WhatsApp basique\n- Analytics essentiels\n- Support email\n\n🥈 **Pro** : 35,000 DA/mois\n- Chatbot IA avancé\n- Analytics complets\n- Publicités automatisées\n- Support prioritaire\n\n🥇 **Enterprise** : Sur mesure\n- Solution complète\n- Intégrations personnalisées\n- Account manager dédié\n\nVoulez-vous plus de détails ?", true, 'options', ["📞 Parler à un expert", "📊 Calculer mon ROI", "🔄 Retour au menu"]);
          break;
        default:
          if (option.includes("Retour au menu")) {
            addMessage(responses.welcome.text, true, 'options', responses.welcome.options);
          }
      }
    }, 1000);
  };

  // Gérer l'envoi WhatsApp
  const handleWhatsAppTransfer = () => {
    const message = encodeURIComponent(
      `Bonjour ! Je viens de votre site EcomBoost DZ. Je suis intéressé(e) par vos solutions d'automatisation e-commerce. Pouvez-vous me contacter ?`
    );
    window.open(`https://wa.me/213XXXXXXXXX?text=${message}`, '_blank');
    
    analytics.trackEvent('whatsapp_transfer', {
      source: 'chatbot'
    });
  };

  // Initialiser le chatbot
  useEffect(() => {
    if (state.isOpen && state.messages.length === 0) {
      setTimeout(() => {
        addMessage(responses.welcome.text, true, 'options', responses.welcome.options);
      }, 500);
    }
  }, [state.isOpen]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isTyping]);

  // Gérer l'envoi du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleUserMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      {/* Bouton d'ouverture */}
      {!state.isOpen && (
        <button
          onClick={() => setState(prev => ({ ...prev, isOpen: true }))}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            {/* Robot head */}
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
            {/* Robot body */}
            <path d="M21 9V7L15 7.5V9C15 9.5 14.5 10 14 10H10C9.5 10 9 9.5 9 9V7.5L3 7V9C3 10.1 3.9 11 5 11V16C5 17.1 5.9 18 7 18H9C9 19.1 9.9 20 11 20H13C14.1 20 15 19.1 15 18H17C18.1 18 19 17.1 19 16V11C20.1 11 21 10.1 21 9Z"/>
            {/* Robot eyes */}
            <circle cx="9.5" cy="13" r="1"/>
            <circle cx="14.5" cy="13" r="1"/>
            {/* AI brain indicator */}
            <path d="M12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5S10.5 9.8 10.5 9S11.2 7.5 12 7.5Z" opacity="0.7"/>
          </svg>
        </button>
      )}

      {/* Interface du chatbot */}
      {state.isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border-2 border-gray-300">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-white">Assistant EcomBoost DZ</h3>
                <p className="text-xs text-blue-300 font-medium">En ligne • Répond en ~30s</p>
              </div>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, isOpen: false }))}
              className="text-blue-300 hover:text-blue-100 font-bold text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg border-2 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-900 border-gray-400 font-medium'
                      : 'bg-blue-600 text-white border-blue-400 font-medium'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line font-medium">{message.text}</p>
                  
                  {/* Options */}
                  {message.type === 'options' && message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left p-2 text-xs bg-blue-50 text-blue-900 border-2 border-blue-200 rounded font-medium hover:bg-blue-100 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bouton WhatsApp */}
                  {message.type === 'whatsapp' && (
                    <button
                      onClick={handleWhatsAppTransfer}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs font-bold border-2 border-green-400 hover:bg-green-600 transition-colors flex items-center space-x-1"
                    >
                      <span>📱</span>
                      <span>Continuer sur WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 border-2 border-gray-400 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t-2 border-gray-300">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tapez votre message..."
                className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 font-medium bg-white"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg border-2 border-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default IntelligentChatbot;