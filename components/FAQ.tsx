import React, { useState } from 'react';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

const faqData = [
  {
    category: "Général",
    questions: [
      {
        question: "Comment fonctionne exactement le robot WhatsApp ?",
        answer: "Notre IA se connecte à votre WhatsApp Business via l'API officielle. Elle répond automatiquement selon des scénarios que nous configurons ensemble : présentation des produits, prise de commandes, collecte d'adresses, confirmation de livraison. Vous gardez le contrôle total et pouvez intervenir à tout moment."
      },
      {
        question: "Combien de temps faut-il pour voir des résultats ?",
        answer: "Les premiers résultats sont visibles dès la première semaine : réduction du temps passé sur WhatsApp et amélioration de la qualité des visuels. Pour les ventes, comptez 2-4 semaines pour voir une augmentation significative, le temps que vos clients s'habituent au nouveau système."
      },
      {
        question: "Mes données et celles de mes clients sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire et respectons le RGPD. Vos données restent en Algérie et ne sont jamais partagées. Vous pouvez demander leur suppression à tout moment."
      }
    ]
  },
  {
    category: "Technique",
    questions: [
      {
        question: "Dois-je changer mon numéro WhatsApp actuel ?",
        answer: "Non ! Nous travaillons avec votre numéro WhatsApp Business existant. Si vous n'en avez pas encore, nous vous aidons à le créer gratuitement. Vos clients continuent de vous contacter sur le même numéro."
      },
      {
        question: "Que se passe-t-il si le robot ne comprend pas une question ?",
        answer: "Le robot transfère automatiquement la conversation vers vous avec un résumé de la demande. Vous pouvez aussi configurer des mots-clés spécifiques qui déclenchent un transfert immédiat (ex: 'réclamation', 'problème')."
      },
      {
        question: "Puis-je personnaliser les réponses du robot ?",
        answer: "Oui, entièrement ! Nous configurons le ton, le vocabulaire et les réponses selon votre marque. Vous pouvez utiliser du darija, du français, ou un mélange. Les réponses évoluent selon vos retours."
      },
      {
        question: "Comment intégrez-vous mon catalogue de produits ?",
        answer: "Nous créons un catalogue interactif directement dans WhatsApp avec photos, prix et descriptions. Les clients peuvent naviguer par catégories et ajouter des produits à leur commande. Mise à jour en temps réel quand vous modifiez vos stocks."
      }
    ]
  },
  {
    category: "Tarifs & Engagement",
    questions: [
      {
        question: "Y a-t-il un engagement de durée ?",
        answer: "Non, nos contrats sont sans engagement. Vous pouvez arrêter à tout moment avec un préavis de 30 jours. Nous préférons vous garder par la qualité de notre service, pas par des contraintes contractuelles."
      },
      {
        question: "Que comprend exactement chaque forfait ?",
        answer: "Chaque forfait inclut la configuration initiale, la formation, le support technique et les mises à jour. Les différences portent sur le nombre de visuels, les fonctionnalités avancées et le niveau d'automatisation. Pas de frais cachés."
      },
      {
        question: "Proposez-vous une garantie ?",
        answer: "Oui ! Garantie satisfait ou remboursé pendant 30 jours. Si vous n'êtes pas convaincu par les résultats, nous vous remboursons intégralement. De plus, nous offrons 7 jours d'essai gratuit pour tester le système."
      },
      {
        question: "Comment se passe la facturation ?",
        answer: "Paiement mensuel en dinars algériens par virement bancaire ou CCP. Pas de prélèvement automatique. Vous recevez votre facture le 1er de chaque mois et avez 10 jours pour régler."
      }
    ]
  },
  {
    category: "Support & Formation",
    questions: [
      {
        question: "Quelle formation recevrai-je ?",
        answer: "Formation complète en 3 étapes : 1) Session de configuration (2h), 2) Formation à l'utilisation (1h), 3) Suivi personnalisé pendant 2 semaines. Tout se fait en visio ou à distance, selon votre préférence."
      },
      {
        question: "Le support est-il inclus ?",
        answer: "Oui, support technique illimité par WhatsApp et email du lundi au samedi, 9h-18h. Temps de réponse garanti sous 2h en semaine. Pour les urgences, numéro d'astreinte disponible."
      },
      {
        question: "Puis-je avoir une démonstration personnalisée ?",
        answer: "Bien sûr ! Nous proposons des démos gratuites de 30 minutes adaptées à votre secteur d'activité. Vous verrez exactement comment le système fonctionnerait avec vos produits et vos clients."
      }
    ]
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions Fréquentes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Toutes les réponses aux questions que vous vous posez sur nos services. 
            Une question spécifique ? Contactez-nous directement !
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h3 className="text-2xl font-bold text-green-400 mb-6 border-b border-green-400/30 pb-2">
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const itemId = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.includes(itemId);
                  
                  return (
                    <div key={itemIndex} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                      >
                        <span className="font-semibold text-white pr-4">{item.question}</span>
                        <ArrowUpIcon 
                          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="border-t border-white/10 pt-4">
                            <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA at the bottom */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Vous avez d'autres questions ?</h3>
            <p className="text-gray-300 mb-6">
              Notre équipe est là pour vous répondre et vous accompagner dans votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/213555123456?text=J'ai%20une%20question%20sur%20vos%20services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                💬 Poser une question
              </a>
              <a
                href="https://wa.me/213555123456?text=Je%20souhaite%20une%20d%C3%A9mo%20personnalis%C3%A9e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🎯 Demander une démo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;