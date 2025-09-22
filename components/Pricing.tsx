import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { WHATSAPP_LINK } from '../constants';

const pricingPlans = [
  {
    name: "Starter Social",
    priceDA: "9.900 DA",
    priceEU: "~65 €",
    period: "/ mois",
    target: "Cible : petit vendeur qui débute ou qui a 1-3 produits.",
    services: [
      {
        category: "Visuels & pubs pros",
        features: [
          "10 visuels produits générés + optimisés (formats adaptés Facebook & Instagram).",
          "5 textes publicitaires simples prêts à poster (phrase vendeur + call-to-action)."
        ]
      },
      {
        category: "Exclusions",
        features: [
          "Pas de robot WhatsApp.",
          "Pas de calendrier éditorial."
        ]
      }
    ],
    goal: "Donner une image plus professionnelle rapidement avec un petit budget.",
    cta: "Je choisis ce pack",
    popular: false
  },
  {
    name: "Vendeur Intelligent",
    priceDA: "19.900 DA",
    priceEU: "~130 €",
    period: "/ mois",
    target: "Cible : vendeur actif avec plusieurs produits, veut automatiser sa relation client.",
    services: [
       {
        category: "Visuels & pubs pros",
        features: [
          "20 visuels produits / mois.",
          "10 vidéos courtes “TikTok/Reels” (automatisées à partir des photos produits).",
          "10 légendes publicitaires (optimisées vente)."
        ]
      },
      {
        category: "Robot WhatsApp/Messenger IA",
        features: [
          "Répond automatiquement 24h/24 aux questions fréquentes.",
          "Collecte infos clients (nom, adresse, produit choisi).",
          "Confirme commandes et envoie au vendeur (flux cash on delivery)."
        ]
      },
      {
        category: "Exclusions",
        features: [
            "Pas de calendrier auto (c’est le vendeur qui choisit quand poster)."
        ]
      }
    ],
    goal: "Augmenter les ventes sans rater de prospects → c’est le vrai game changer.",
    cta: "Je choisis ce pack",
    popular: true
  },
  {
    name: "Top Seller DZ",
    priceDA: "39.900 DA",
    priceEU: "~260 €",
    period: "/ mois",
    target: "Cible : gros vendeur ou boutique multi-produits.",
    services: [
      {
        category: "Visuels & pubs pros",
        features: [
          "50 visuels produits / mois.",
          "20 vidéos (promo produits TikTok/Reels).",
          "Textes publicitaires + templates multi-réseaux (Facebook/Insta/TikTok)."
        ]
      },
      {
        category: "Chatbot IA avancé (WhatsApp + Messenger + SMS)",
        features: [
          "Répond aux clients.",
          "Prend info livraison.",
          "Envoie rappels … même par SMS si WhatsApp n’est pas lu."
        ]
      },
      {
        category: "Calendrier automatique",
        features: [
          "30 posts / mois générés automatiquement.",
          "Adaptés à Facebook, Instagram & TikTok.",
          "Publication auto ou notification “prêt à poster”."
        ]
      },
      {
        category: "Dashboard ventes simple",
        features: [
            "Nombre de clients, commandes COD confirmées, produits les + vendus."
        ]
      }
    ],
    goal: "Professionnalisation complète → une boutique peut fonctionner presque “toute seule”.",
    cta: "Je choisis ce pack",
    popular: false
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Un tarif simple et transparent</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">Choisissez le plan qui correspond à votre ambition.</p>
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`bg-gray-900 rounded-2xl p-8 border ${plan.popular ? 'border-green-400 scale-105' : 'border-white/10'} relative flex flex-col h-full`}>
              {plan.popular && <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">Le plus populaire</span>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.target}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.priceDA}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
                <p className="text-gray-500 text-sm mt-1">{plan.priceEU}</p>
              </div>
              <div className="space-y-6 text-left mb-8 flex-grow">
                {plan.services.map((service, i) => (
                  <div key={i}>
                    <h4 className="font-semibold text-white mb-3 text-lg">{service.category === 'Exclusions' ? '' : service.category}</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-start">
                          {service.category === 'Exclusions' ? (
                            <XIcon className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                          ) : (
                            <CheckIcon className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                          )}
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
               <div className="bg-white/5 p-4 rounded-lg text-left mb-8">
                  <div className="flex items-start">
                    <SparklesIcon className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 font-semibold">{plan.goal}</p>
                  </div>
              </div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${plan.popular ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Guarantees Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">🛡️ Nos Garanties</h3>
              <p className="text-gray-300">Votre satisfaction est notre priorité absolue</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-semibold mb-2">Satisfait ou Remboursé</h4>
                <p className="text-gray-400 text-sm">30 jours pour tester. Pas convaincu ? Remboursement intégral, sans questions.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold mb-2">Résultats Garantis</h4>
                <p className="text-gray-400 text-sm">Si vous ne voyez pas d'amélioration après 60 jours, nous travaillons gratuitement jusqu'aux résultats.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="font-semibold mb-2">Sans Engagement</h4>
                <p className="text-gray-400 text-sm">Arrêtez quand vous voulez avec 30 jours de préavis. Pas de frais cachés, pas de piège.</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white/5 rounded-xl">
              <div className="flex items-start">
                <span className="text-2xl mr-4">🎁</span>
                <div>
                  <h4 className="font-semibold mb-2">Bonus Exclusif : Essai Gratuit 7 Jours</h4>
                  <p className="text-gray-300 text-sm">
                    Testez notre système complet pendant une semaine, sans engagement. 
                    Vous verrez les premiers résultats avant même de payer !
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-400 text-sm mb-4">
                Plus de 500 vendeurs algériens nous font déjà confiance
              </p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                <span>🔐 Paiement sécurisé</span>
                <span>•</span>
                <span>📞 Support 7j/7</span>
                <span>•</span>
                <span>🇩🇿 Équipe locale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;