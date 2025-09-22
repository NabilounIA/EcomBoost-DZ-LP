import React from 'react';
import { RobotIcon } from './icons/RobotIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { CalendarIcon } from './icons/CalendarIcon';

const services = [
  {
    icon: <RobotIcon className="w-10 h-10 mb-4 text-green-400" />,
    title: "Automatisation WhatsApp",
    description: "Un chatbot intelligent qui gère le processus de commande de A à Z : accueil, catalogue, prise d'informations, confirmation.",
    features: [
      "Réponses instantanées 24/7",
      "Catalogue de produits interactif",
      "Collecte automatique des adresses",
      "Réduction des erreurs de saisie"
    ]
  },
  {
    icon: <PaintBrushIcon className="w-10 h-10 mb-4 text-blue-400" />,
    title: "Création de Contenu Publicitaire",
    description: "Des visuels et vidéos qui arrêtent le scroll. Conçus par des experts pour maximiser vos conversions sur Facebook et Instagram.",
    features: [
      "Designs professionnels et modernes",
      "Textes publicitaires (copywriting) inclus",
      "Formats adaptés (Story, Reel, Post)",
      "Mise en avant de vos produits"
    ]
  },
  {
    icon: <CalendarIcon className="w-10 h-10 mb-4 text-purple-400" />,
    title: "Planification de Contenu IA",
    description: "Maintenez une présence active et professionnelle sur les réseaux sociaux sans y penser. Notre IA prépare et planifie vos publications.",
    features: [
      "Calendrier de publication automatisé",
      "Génération d'idées de posts",
      "Contenu adapté à votre marque",
      "Analyse de performance simple"
    ]
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Services en Détail</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Des outils puissants, conçus pour le marché algérien.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col">
              {service.icon}
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;