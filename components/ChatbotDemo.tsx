import React from 'react';
import { WHATSAPP_LINK } from '../constants';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

const ChatbotDemo: React.FC = () => {
  return (
    <section id="demo" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Voyez notre IA en Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Découvrez comment notre assistant WhatsApp transforme une simple conversation en une vente confirmée, 24/7.</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Phone Mockup */}
          <div className="mb-12 lg:mb-0 px-4">
            <div className="max-w-sm mx-auto bg-gray-800 border-8 border-gray-700 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="w-full h-8 bg-gray-800 flex justify-center items-center">
                <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
              </div>
              <div className="bg-gray-900" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231a202c\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
                {/* WhatsApp Header */}
                <div className="bg-gray-800 p-3 flex items-center shadow-md">
                   <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-inner">B</div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-white">Votre Boutique</h3>
                    <p className="text-xs text-green-400">en ligne</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 h-[32rem] overflow-y-auto">
                  {/* Message from Bot */}
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-3 rounded-2xl rounded-bl-lg max-w-xs shadow-md">
                      <p>Salam ! Bienvenue. Comment puis-je vous aider ?</p>
                      <div className="mt-2 border-t border-gray-600 pt-2">
                        <button className="w-full text-left p-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-sm transition-colors">1. Voir les produits</button>
                        <button className="w-full text-left p-2 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-sm transition-colors mt-1">2. Suivre ma commande</button>
                      </div>
                    </div>
                  </div>

                  {/* Message from User */}
                  <div className="flex justify-end">
                    <div className="bg-green-800 text-white p-3 rounded-2xl rounded-br-lg max-w-xs shadow-md">
                      <p>1</p>
                    </div>
                  </div>

                  {/* Message from Bot with product */}
                   <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-2 rounded-2xl rounded-bl-lg max-w-xs shadow-md">
                       <img src="https://i.imgur.com/ABkSo4k.png" alt="Product" className="rounded-lg" />
                       <div className="p-2">
                         <p className="font-bold">Super T-shirt DZ</p>
                         <p className="text-sm text-gray-300">Disponible en M, L, XL. Qualité supérieure.</p>
                         <p className="font-bold mt-1 text-lg">2500 DA</p>
                         <button className="w-full text-center mt-2 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition-colors">Commander</button>
                       </div>
                    </div>
                  </div>
                  
                   {/* Message from User */}
                  <div className="flex justify-end">
                    <div className="bg-green-800 text-white p-3 rounded-2xl rounded-br-lg max-w-xs shadow-md">
                      <p>Je veux commander, taille L svp</p>
                    </div>
                  </div>

                  {/* Message from Bot */}
                   <div className="flex justify-start">
                    <div className="bg-gray-700 text-white p-3 rounded-2xl rounded-bl-lg max-w-xs shadow-md">
                      <p>Excellent choix ! Pour finaliser, veuillez me donner votre nom, adresse complète et numéro de téléphone.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Explanation */}
          <div className="text-left">
            <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Un processus de vente sans friction</h3>
            <ul className="space-y-6">
                <li className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-5 ring-1 ring-white/10">
                        <span className="text-green-400 font-bold text-xl">1</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white">Accueil & Présentation</h4>
                        <p className="text-gray-400">Le client est accueilli instantanément et peut consulter vos produits directement dans WhatsApp, comme un catalogue interactif.</p>
                    </div>
                </li>
                <li className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-5 ring-1 ring-white/10">
                        <span className="text-green-400 font-bold text-xl">2</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white">Prise d'Information Automatique</h4>
                        <p className="text-gray-400">Le bot pose les bonnes questions pour collecter toutes les informations nécessaires à la livraison (nom, adresse, etc.) sans erreur.</p>
                    </div>
                </li>
                 <li className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-5 ring-1 ring-white/10">
                        <span className="text-green-400 font-bold text-xl">3</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-white">Validation & Confirmation</h4>
                        <p className="text-gray-400">La commande est résumée et vous recevez une notification claire. Le client est rassuré, vous n'avez plus qu'à expédier.</p>
                    </div>
                </li>
            </ul>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg shadow-green-500/20"
            >
              <WhatsAppIcon className="w-6 h-6 mr-3" />
              Testez-le vous-même
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatbotDemo;
