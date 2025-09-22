import { useEffect } from 'react';
import seoService, { SEOMetaData } from '../services/seo';

export function useSEO(meta: Partial<SEOMetaData>) {
  useEffect(() => {
    seoService.updateMetaTags(meta);
  }, [meta]);
}

// Specific hooks for different page types
export function useHomepageSEO() {
  useSEO({
    title: 'EcomBoost DZ - Automatisez votre E-commerce en Algérie | Solutions WhatsApp & Marketing',
    description: 'Boostez vos ventes e-commerce en Algérie avec nos solutions d\'automatisation WhatsApp, publicités ciblées et outils marketing. +500 boutiques automatisées. Démarrez maintenant !',
    keywords: [
      'e-commerce algérie',
      'automatisation whatsapp algérie',
      'marketing digital algérie',
      'vente en ligne algérie',
      'publicité facebook algérie',
      'chatbot whatsapp business',
      'dropshipping algérie',
      'boutique en ligne automatisée',
      'ecomboost dz',
      'automation marketing algérie',
      'vendre sur whatsapp',
      'solution e-commerce algérie'
    ],
    structuredData: [
      seoService.generateOrganizationStructuredData(),
      seoService.generateServiceStructuredData(),
      seoService.generateLocalBusinessStructuredData()
    ]
  });
}

export function useServicesSEO() {
  useSEO({
    title: 'Nos Services E-commerce | Automatisation WhatsApp & Marketing Digital - EcomBoost DZ',
    description: 'Découvrez nos services d\'automatisation e-commerce : WhatsApp Business, publicités Facebook/Instagram, chatbots, et optimisation de boutiques en ligne en Algérie.',
    keywords: [
      'services e-commerce algérie',
      'automatisation whatsapp business',
      'publicité facebook algérie',
      'chatbot whatsapp',
      'optimisation boutique en ligne',
      'marketing automation algérie'
    ]
  });
}

export function usePricingSEO() {
  useSEO({
    title: 'Tarifs & Plans E-commerce | Solutions Abordables pour Entrepreneurs Algériens - EcomBoost DZ',
    description: 'Plans tarifaires transparents pour automatiser votre e-commerce en Algérie. Starter, Pro, Enterprise. Essai gratuit disponible. Investissement rentable garanti.',
    keywords: [
      'prix e-commerce algérie',
      'tarif automatisation whatsapp',
      'plan marketing digital algérie',
      'coût publicité facebook algérie',
      'abonnement e-commerce'
    ]
  });
}

export function useBlogSEO(article?: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  useSEO({
    title: article ? `${article.title} | Blog EcomBoost DZ` : 'Blog E-commerce Algérie | Conseils & Stratégies Marketing - EcomBoost DZ',
    description: article?.description || 'Conseils experts en e-commerce pour entrepreneurs algériens. Stratégies WhatsApp, marketing digital, automatisation et croissance des ventes.',
    keywords: [
      'blog e-commerce algérie',
      'conseils marketing digital',
      'stratégie whatsapp business',
      'tips vente en ligne algérie',
      'guide e-commerce'
    ],
    ...(article && {
      structuredData: seoService.generateArticleStructuredData(article)
    })
  });
}

export function useContactSEO() {
  useSEO({
    title: 'Contactez-nous | Support E-commerce 24/7 - EcomBoost DZ',
    description: 'Contactez notre équipe d\'experts e-commerce en Algérie. Support WhatsApp, consultation gratuite, devis personnalisé. Réponse rapide garantie.',
    keywords: [
      'contact ecomboost dz',
      'support e-commerce algérie',
      'consultation gratuite',
      'aide whatsapp business algérie'
    ]
  });
}

export function usePrivacySEO() {
  useSEO({
    title: 'Politique de Confidentialité | Protection des Données - EcomBoost DZ',
    description: 'Notre politique de confidentialité détaille comment nous protégeons vos données personnelles et respectons votre vie privée selon les standards internationaux.',
    keywords: [
      'politique confidentialité',
      'protection données',
      'vie privée',
      'rgpd algérie'
    ]
  });
}

export default useSEO;