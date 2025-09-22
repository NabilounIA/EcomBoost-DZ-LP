import React from 'react';
import { WHATSAPP_LINK } from '../constants';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const FinalCTA: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-10 md:p-16 text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer votre e-commerce ?</h2>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8">
            Arrêtez de perdre du temps avec des tâches répétitives. Contactez-nous aujourd'hui et découvrez comment EcomBoost DZ peut vous aider à vendre plus, plus vite.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-white hover:bg-gray-200 text-gray-900 font-bold text-lg py-4 px-8 rounded-full transition-transform transform hover:scale-105"
          >
            <WhatsAppIcon className="w-6 h-6 mr-3" />
            Discutons de votre projet
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
