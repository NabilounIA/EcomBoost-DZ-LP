import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { CheckIcon } from './icons/CheckIcon';

const socialPosts = [
  {
    image: "https://i.imgur.com/2y3aY2R.png",
    caption: "🍯 Miel de Jujubier Sidr Malaki disponible ! Qualité exceptionnelle et pureté garantie. Commandez maintenant.",
    hashtags: "#miel #sidr #dz #produitlocal",
    status: "Publié",
    statusColor: "bg-green-500/20 text-green-300",
    metrics: {
      likes: 152,
      comments: 12,
      shares: 8,
    }
  },
  {
    image: "https://i.imgur.com/ABkSo4k.png",
    caption: "✨ Le style qui vous démarque ! Nos nouveaux t-shirts sont arrivés. Stock limité.",
    hashtags: "#tshirt #dzfashion #alger",
    status: "Planifié : Demain 18h00",
    statusColor: "bg-blue-500/20 text-blue-300",
    metrics: null,
  },
];

const benefits = [
    {
      icon: <SparklesIcon className="w-8 h-8 mr-4 text-purple-400" />,
      title: "Génération de Contenu par IA",
      description: "Notre IA écrit des légendes captivantes et des descriptions de produits qui incitent à l'achat, adaptées au ton de votre marque."
    },
    {
      icon: <CalendarIcon className="w-8 h-8 mr-4 text-green-400" />,
      title: "Planification Intelligente",
      description: "Nous programmons vos publications aux heures de pointe pour maximiser la portée et l'engagement, sans que vous ayez à y penser."
    },
    {
      icon: <CheckIcon className="w-8 h-8 mr-4 text-blue-400" />,
      title: "Image de Marque Cohérente",
      description: "Une présence régulière et professionnelle sur les réseaux sociaux renforce la confiance de vos clients et construit une communauté fidèle."
    }
  ]

const SocialMediaAutomationDemo: React.FC = () => {
  return (
    <section id="social-automation" className="py-20 bg-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gardez vos Réseaux Sociaux Actifs, Sans Effort</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Notre IA crée et planifie des publications pour vous, assurant une présence constante qui rassure vos clients et booste votre visibilité.</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Explanation */}
            <div className="text-left mb-12 lg:mb-0">
                <h3 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Votre Community Manager Virtuel</h3>
                <div className="space-y-8">
                {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                        <div className="bg-white/10 p-3 rounded-full flex-shrink-0">{benefit.icon}</div>
                        <div className="ml-4">
                        <h3 className="text-xl font-bold">{benefit.title}</h3>
                        <p className="text-gray-400 mt-1">{benefit.description}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            {/* Social Media Feed Mockup */}
            <div className="p-4 bg-gray-900/50 border border-white/10 rounded-2xl">
              <div className="space-y-6 max-w-md mx-auto">
                {socialPosts.map((post, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-white/10">
                    {/* Post Header */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-9 h-9 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-lg text-white">B</div>
                        <span className="ml-3 font-semibold text-white text-sm">Votre Boutique</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${post.statusColor}`}>
                        {post.status}
                      </span>
                    </div>
                    {/* Post Image */}
                    <img src={post.image} alt="Social media post" className="w-full h-auto object-cover" />
                    {/* Post Content */}
                    <div className="p-4">
                      <p className="text-gray-300 text-sm mb-2">
                        {post.caption}
                      </p>
                      <p className="text-blue-400 text-sm font-semibold">{post.hashtags}</p>
                      {/* Metrics */}
                      {post.metrics && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center space-x-4 text-gray-400">
                          <div className="flex items-center text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-red-400/80" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            <span className="font-medium text-gray-300">{post.metrics.likes}</span>
                          </div>
                          <div className="flex items-center text-sm">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-400/80" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 0a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V5.5a.5.5 0 00-.5-.5h-11z" /><path d="M3 13.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5z" /></svg>
                            <span className="font-medium text-gray-300">{post.metrics.comments}</span>
                          </div>
                          <div className="flex items-center text-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-400/80" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                            <span className="font-medium text-gray-300">{post.metrics.shares}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaAutomationDemo;