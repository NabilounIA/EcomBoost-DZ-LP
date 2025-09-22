import React from 'react';
import { Link } from 'react-router-dom';
import { usePrivacySEO } from '../hooks/useSEO';

const PrivacyPolicy: React.FC = () => {
  usePrivacySEO();
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-4xl text-gray-300">
        <h1 className="text-4xl font-bold text-white mb-8">Politique de Confidentialité</h1>
        
        <p className="mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p className="mb-6">
          EcomBoost DZ ("nous", "notre" ou "nos") s'engage à protéger vos informations personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons les informations que nous recevons des utilisateurs de nos services.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Informations que nous collectons</h2>
        <p className="mb-4">
          Nous pouvons collecter les types d'informations suivants :
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li><strong>Informations de contact :</strong> Votre nom, numéro de téléphone WhatsApp, et adresse e-mail.</li>
          <li><strong>Informations sur l'entreprise :</strong> Le nom de votre boutique en ligne, les produits que vous vendez.</li>
          <li><strong>Données de transaction :</strong> Informations sur les commandes passées via notre service (sans inclure les détails de paiement sensibles).</li>
          <li><strong>Données d'utilisation :</strong> Informations sur la manière dont vous interagissez avec nos services, y compris les conversations via notre chatbot.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Comment nous utilisons vos informations</h2>
        <p className="mb-4">
          Nous utilisons les informations collectées pour :
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Fournir, exploiter et maintenir nos services.</li>
          <li>Améliorer, personnaliser et développer nos services.</li>
          <li>Comprendre et analyser comment vous utilisez nos services.</li>
          <li>Communiquer avec vous, soit directement, soit par l'intermédiaire de l'un de nos partenaires, y compris pour le service client, pour vous fournir des mises à jour et d'autres informations relatives au service, et à des fins de marketing et de promotion.</li>
          <li>Traiter vos transactions et gérer vos commandes.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Partage de vos informations</h2>
        <p className="mb-6">
          Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations dans les cas suivants :
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Avec des prestataires de services tiers pour faciliter nos services (par exemple, des hébergeurs).</li>
          <li>Pour nous conformer à des obligations légales.</li>
          <li>Pour protéger et défendre nos droits ou notre propriété.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Sécurité des données</h2>
        <p className="mb-6">
          La sécurité de vos données est importante pour nous, mais rappelez-vous qu'aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est sûre à 100 %. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos informations personnelles, nous ne pouvons garantir leur sécurité absolue.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Modifications de cette politique de confidentialité</h2>
        <p className="mb-6">
          Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous notifierons de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
        </p>
        
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contactez-nous</h2>
        <p className="mb-6">
          Si vous avez des questions sur cette politique de confidentialité, veuillez nous contacter via le numéro WhatsApp fourni sur notre site.
        </p>

        <div className="mt-12 text-center">
            <Link to="/" className="text-green-400 hover:text-green-300 font-semibold">
                &larr; Retour à l'accueil
            </Link>
        </div>

      </div>
    </section>
  );
};

export default PrivacyPolicy;
