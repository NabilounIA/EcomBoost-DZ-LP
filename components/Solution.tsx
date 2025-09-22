import React from 'react';
import { RobotIcon } from './icons/RobotIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { CalendarIcon } from './icons/CalendarIcon';

const solutions = [
  {
    icon: <RobotIcon className="w-8 h-8 mr-4 text-green-400" />,
    title: "Un Robot WhatsApp qui vend pour vous",
    description: "Notre assistant IA prend les commandes, répond aux questions fréquentes et enregistre les informations des clients 24/7. Vous n'intervenez que pour valider."
  },
  {
    icon: <SparklesIcon className="w-8 h-8 mr-4 text-blue-400" />,
    title: "Des Publicités Qui Captivent",
    description: "Nous créons pour vous des visuels et des vidéos optimisés pour les réseaux sociaux. Attirez plus de clients qualifiés sans effort."
  },
  {
    icon: <CalendarIcon className="w-8 h-8 mr-4 text-purple-400" />,
    title: "Une Présence Sociale Active et Automatisée",
    description: "Programmez vos publications. Nous assurons une présence constante et professionnelle sur vos réseaux, même quand vous dormez."
  }
]

const Solution: React.FC = () => {
  return (
    <section id="solution" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">La Solution EcomBoost DZ</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Nous transformons vos défis en avantages compétitifs.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {solutions.map((solution, index) => (
             <div key={index} className="flex items-start mb-8">
              <div className="bg-white/10 p-3 rounded-full">{solution.icon}</div>
              <div className="ml-4">
                <h3 className="text-xl font-bold">{solution.title}</h3>
                <p className="text-gray-400 mt-1">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solution;