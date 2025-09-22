import React from 'react';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const problems = [
  {
    icon: <WhatsAppIcon className="w-12 h-12 text-green-400" />,
    title: "Gestion WhatsApp Chronophage",
    description: "Répondre aux mêmes questions, noter les commandes, confirmer les adresses... Vous perdez des heures chaque jour sur WhatsApp au lieu de développer votre activité."
  },
  {
    icon: <PaintBrushIcon className="w-12 h-12 text-blue-400" />,
    title: "Publicités Peu Efficaces",
    description: "Créer des visuels attractifs et des textes percutants est un métier. Sans expertise, vos publicités coûtent cher et ne rapportent pas assez de clients."
  },
  {
    icon: <SparklesIcon className="w-12 h-12 text-purple-400" />,
    title: "Présence Incohérente",
    description: "Poster de manière irrégulière avec des visuels amateurs nuit à votre crédibilité et fait fuir les clients potentiels qui recherchent une marque de confiance."
  }
];

const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Vous vous reconnaissez ?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12">Le e-commerce en Algérie est plein d'opportunités, mais aussi de défis quotidiens.</p>
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform">
              <div className="flex justify-center mb-6">{problem.icon}</div>
              <h3 className="text-xl font-bold mb-4">{problem.title}</h3>
              <p className="text-gray-400">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;