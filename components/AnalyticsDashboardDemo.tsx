import React from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const kpiData = [
  {
    title: "Chiffre d'affaires (Mois)",
    value: "1,250,000 DA",
    change: "+15.2%",
    icon: <ChartBarIcon className="w-6 h-6 text-gray-400" />
  },
  {
    title: "Commandes via IA",
    value: "182",
    change: "+35 nouvelles",
    icon: <SparklesIcon className="w-6 h-6 text-gray-400" />
  },
];

const topProducts = [
  {
    name: "Miel de Jujubier Sidr",
    image: "https://i.imgur.com/2y3aY2R.png",
    sales: "78 ventes"
  },
  {
    name: "Super T-shirt DZ",
    image: "https://i.imgur.com/ABkSo4k.png",
    sales: "54 ventes"
  },
  {
    name: "Huile d'Olive Premium",
    image: "https://i.imgur.com/5gXJ0f5.png",
    sales: "41 ventes"
  }
]

const AnalyticsDashboardDemo: React.FC = () => {
  return (
    <section id="analytics" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilotez votre Business, Ne le Subissez Plus</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Notre tableau de bord centralise toutes vos données importantes. Prenez des décisions basées sur des faits, pas des suppositions.</p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Dashboard Mockup */}
            <div className="p-6 bg-gray-900/50 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Votre Dashboard de Performance</h3>
                 <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">Ce mois-ci</span>
               </div>
               {/* KPIs */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 {kpiData.map(kpi => (
                   <div key={kpi.title} className="bg-gray-800 p-4 rounded-lg border border-white/10">
                     <div className="flex items-center text-gray-400 text-sm mb-2">
                       {kpi.icon}
                       <span className="ml-2">{kpi.title}</span>
                     </div>
                     <p className="text-2xl font-bold text-white">{kpi.value}</p>
                     <div className="flex items-center text-xs text-green-400 mt-1">
                       <ArrowUpIcon className="w-3 h-3 mr-1" />
                       <span>{kpi.change}</span>
                     </div>
                   </div>
                 ))}
               </div>

                {/* Sales Chart Mockup */}
               <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Évolution des ventes</h4>
                    <div className="bg-gray-800 p-4 rounded-lg border border-white/10 h-48 flex items-end">
                        <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none" className="opacity-75">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5"/>
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M 0 100 Q 30 80, 60 90 T 120 70 T 180 80 T 240 50 T 300 60 L 300 120 L 0 120 Z" fill="url(#chartGradient)"/>
                            <path d="M 0 100 Q 30 80, 60 90 T 120 70 T 180 80 T 240 50 T 300 60" fill="none" stroke="#22c55e" strokeWidth="2"/>
                        </svg>
                    </div>
               </div>
               
               {/* Top Products */}
                <div>
                     <h4 className="text-lg font-semibold text-white mb-3">Produits les plus vendus</h4>
                     <div className="space-y-3">
                        {topProducts.map(product => (
                            <div key={product.name} className="flex items-center bg-gray-800 p-3 rounded-lg border border-white/10">
                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-white">{product.name}</p>
                                    <p className="text-sm text-gray-400">{product.sales}</p>
                                </div>
                                <span className="text-green-400 font-bold">Voir</span>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="text-left mt-12 lg:mt-0">
                <h3 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Une Vision à 360° de votre Activité</h3>
                <ul className="space-y-6">
                    <li className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 ring-1 ring-white/10">
                            <ChartBarIcon className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white">Suivi des Ventes en Temps Réel</h4>
                            <p className="text-gray-400">Sachez exactement combien vous vendez et quels produits sont les plus populaires, directement depuis un tableau de bord unique.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 ring-1 ring-white/10">
                            <SparklesIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white">Performance de l'IA</h4>
                            <p className="text-gray-400">Visualisez combien de commandes votre assistant IA traite pour vous, et comprenez l'impact direct de l'automatisation sur votre chiffre d'affaires.</p>
                        </div>
                    </li>
                    <li className="flex items-start">
                         <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 ring-1 ring-white/10">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-white">Prise de Décision Rapide</h4>
                            <p className="text-gray-400">Identifiez rapidement les tendances pour ajuster votre stratégie, lancer des promotions sur les bons produits et optimiser vos stocks.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboardDemo;