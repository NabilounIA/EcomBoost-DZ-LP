import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { RobotIcon } from './icons/RobotIcon';

const teamMembers = [
  {
    name: "Yacine Benali",
    role: "Fondateur & Expert IA",
    description: "Ex-ingénieur chez Google, spécialisé en intelligence artificielle. Passionné par l'entrepreneuriat algérien.",
    expertise: "IA & Automatisation"
  },
  {
    name: "Amira Khelifi", 
    role: "Directrice Marketing Digital",
    description: "10 ans d'expérience en publicité digitale. A géré +50M DA de budgets publicitaires pour des marques algériennes.",
    expertise: "Publicité & Growth"
  },
  {
    name: "Sofiane Meziani",
    role: "Développeur Lead",
    description: "Expert en intégrations WhatsApp Business API. Ancien CTO d'une startup e-commerce à Alger.",
    expertise: "Développement & Intégrations"
  }
];

const stats = [
  {
    icon: <RobotIcon className="w-8 h-8 text-green-400" />,
    number: "500+",
    label: "Boutiques automatisées"
  },
  {
    icon: <ChartBarIcon className="w-8 h-8 text-blue-400" />,
    number: "2.5M DA",
    label: "Ventes générées/mois"
  },
  {
    icon: <SparklesIcon className="w-8 h-8 text-purple-400" />,
    number: "95%",
    label: "Clients satisfaits"
  }
];

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-800">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Qui sommes-nous ?</h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Une équipe d'experts algériens passionnés par l'innovation, dédiée à faire grandir l'e-commerce local grâce à l'intelligence artificielle.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-green-400">Notre Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              Démocratiser l'accès aux outils marketing avancés pour tous les entrepreneurs algériens. 
              Nous croyons que chaque boutique, même la plus petite, mérite d'avoir les mêmes armes 
              que les grandes entreprises pour réussir en ligne.
            </p>
          </div>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-4 text-blue-400">Pourquoi l'Algérie ?</h3>
            <p className="text-gray-300 leading-relaxed">
              Le marché algérien du e-commerce explose, mais les entrepreneurs manquent d'outils adaptés. 
              Nous comblons ce gap avec des solutions pensées pour les spécificités locales : 
              paiement à la livraison, WhatsApp Business, et culture commerciale algérienne.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-12">L'équipe derrière EcomBoost DZ</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                {/* Avatar placeholder */}
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                <div className="text-green-400 font-semibold mb-3">{member.role}</div>
                <p className="text-gray-400 text-sm mb-4">{member.description}</p>
                <div className="inline-block bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">
                  {member.expertise}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Nos engagements</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-green-400 font-semibold mb-2">🔒 Sécurité garantie</div>
                <p className="text-gray-400">Vos données et celles de vos clients sont protégées selon les standards internationaux.</p>
              </div>
              <div>
                <div className="text-blue-400 font-semibold mb-2">🇩🇿 Support local</div>
                <p className="text-gray-400">Une équipe algérienne qui comprend vos défis et parle votre langue.</p>
              </div>
              <div>
                <div className="text-purple-400 font-semibold mb-2">⚡ Innovation continue</div>
                <p className="text-gray-400">Nous améliorons constamment nos outils pour rester à la pointe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;