// SEO Service for EcomBoost DZ
export interface SEOMetaData {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

class SEOService {
  private defaultMeta: SEOMetaData = {
    title: 'EcomBoost DZ - Automatisez votre E-commerce en Algérie',
    description: 'Boostez vos ventes e-commerce en Algérie avec nos solutions d\'automatisation WhatsApp, publicités ciblées et outils marketing. Vendez plus, travaillez moins.',
    keywords: [
      'e-commerce algérie',
      'automatisation whatsapp',
      'marketing digital algérie',
      'vente en ligne algérie',
      'publicité facebook algérie',
      'chatbot whatsapp',
      'dropshipping algérie',
      'boutique en ligne',
      'ecomboost',
      'automation marketing'
    ],
    ogTitle: 'EcomBoost DZ - Automatisez votre E-commerce en Algérie',
    ogDescription: 'Solutions complètes d\'automatisation e-commerce pour entrepreneurs algériens. WhatsApp Business, publicités performantes, et outils marketing.',
    ogImage: '/images/og-image.jpg',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'EcomBoost DZ - Automatisez votre E-commerce',
    twitterDescription: 'Boostez vos ventes e-commerce en Algérie avec nos solutions d\'automatisation.',
    twitterImage: '/images/twitter-image.jpg'
  };

  // Update page meta tags
  updateMetaTags(meta: Partial<SEOMetaData>): void {
    const finalMeta = { ...this.defaultMeta, ...meta };

    // Update title
    document.title = finalMeta.title;

    // Update or create meta tags
    this.updateMetaTag('description', finalMeta.description);
    
    if (finalMeta.keywords) {
      this.updateMetaTag('keywords', finalMeta.keywords.join(', '));
    }

    // Canonical URL
    if (finalMeta.canonical) {
      this.updateLinkTag('canonical', finalMeta.canonical);
    }

    // Open Graph tags
    this.updateMetaTag('og:title', finalMeta.ogTitle || finalMeta.title, 'property');
    this.updateMetaTag('og:description', finalMeta.ogDescription || finalMeta.description, 'property');
    this.updateMetaTag('og:type', finalMeta.ogType || 'website', 'property');
    this.updateMetaTag('og:url', window.location.href, 'property');
    
    if (finalMeta.ogImage) {
      this.updateMetaTag('og:image', finalMeta.ogImage, 'property');
      this.updateMetaTag('og:image:alt', finalMeta.title, 'property');
    }

    // Twitter Card tags
    this.updateMetaTag('twitter:card', finalMeta.twitterCard || 'summary_large_image');
    this.updateMetaTag('twitter:title', finalMeta.twitterTitle || finalMeta.title);
    this.updateMetaTag('twitter:description', finalMeta.twitterDescription || finalMeta.description);
    
    if (finalMeta.twitterImage) {
      this.updateMetaTag('twitter:image', finalMeta.twitterImage);
    }

    // Structured data
    if (finalMeta.structuredData) {
      this.updateStructuredData(finalMeta.structuredData);
    }
  }

  // Generate structured data for organization
  generateOrganizationStructuredData(): any {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "EcomBoost DZ",
      "description": "Solutions d'automatisation e-commerce pour entrepreneurs algériens",
      "url": "https://ecomboost-dz.com",
      "logo": "https://ecomboost-dz.com/images/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+213-XXX-XXX-XXX",
        "contactType": "customer service",
        "availableLanguage": ["French", "Arabic"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "DZ",
        "addressLocality": "Alger"
      },
      "sameAs": [
        "https://facebook.com/ecomboost-dz",
        "https://instagram.com/ecomboost_dz",
        "https://linkedin.com/company/ecomboost-dz"
      ]
    };
  }

  // Generate structured data for service
  generateServiceStructuredData(): any {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Automatisation E-commerce",
      "description": "Services d'automatisation pour boutiques en ligne en Algérie",
      "provider": {
        "@type": "Organization",
        "name": "EcomBoost DZ"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Algeria"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Services E-commerce",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Automatisation WhatsApp Business"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Création de Publicités Facebook/Instagram"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Optimisation de Boutique en Ligne"
            }
          }
        ]
      }
    };
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{question: string, answer: string}>): any {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(items: BreadcrumbItem[]): any {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    };
  }

  // Generate article structured data for blog posts
  generateArticleStructuredData(article: {
    title: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
  }): any {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description,
      "author": {
        "@type": "Person",
        "name": article.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "EcomBoost DZ",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ecomboost-dz.com/images/logo.png"
        }
      },
      "datePublished": article.datePublished,
      "dateModified": article.dateModified || article.datePublished,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": article.url
      },
      ...(article.image && {
        "image": {
          "@type": "ImageObject",
          "url": article.image
        }
      })
    };
  }

  // Generate local business structured data
  generateLocalBusinessStructuredData(): any {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EcomBoost DZ",
      "description": "Agence spécialisée en automatisation e-commerce en Algérie",
      "url": "https://ecomboost-dz.com",
      "telephone": "+213-XXX-XXX-XXX",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rue Example",
        "addressLocality": "Alger",
        "addressCountry": "DZ"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.7538",
        "longitude": "3.0588"
      },
      "openingHours": "Mo-Fr 09:00-18:00",
      "priceRange": "$$",
      "servedCuisine": "E-commerce Services"
    };
  }

  // Helper methods
  private updateMetaTag(name: string, content: string, attribute: string = 'name'): void {
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  }

  private updateLinkTag(rel: string, href: string): void {
    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    
    element.setAttribute('href', href);
  }

  private updateStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Generate sitemap data
  generateSitemapData(): Array<{url: string, lastmod: string, priority: number, changefreq: string}> {
    const baseUrl = 'https://ecomboost-dz.com';
    const today = new Date().toISOString().split('T')[0];

    return [
      {
        url: baseUrl,
        lastmod: today,
        priority: 1.0,
        changefreq: 'weekly'
      },
      {
        url: `${baseUrl}/services`,
        lastmod: today,
        priority: 0.9,
        changefreq: 'monthly'
      },
      {
        url: `${baseUrl}/pricing`,
        lastmod: today,
        priority: 0.8,
        changefreq: 'monthly'
      },
      {
        url: `${baseUrl}/blog`,
        lastmod: today,
        priority: 0.7,
        changefreq: 'weekly'
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: today,
        priority: 0.6,
        changefreq: 'monthly'
      },
      {
        url: `${baseUrl}/privacy`,
        lastmod: today,
        priority: 0.3,
        changefreq: 'yearly'
      }
    ];
  }

  // Initialize default SEO
  initializeDefaultSEO(): void {
    this.updateMetaTags({});
    
    // Add organization structured data
    this.updateStructuredData([
      this.generateOrganizationStructuredData(),
      this.generateServiceStructuredData()
    ]);

    // Add viewport meta tag
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    
    // Add charset
    let charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      charsetMeta = document.createElement('meta');
      charsetMeta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charsetMeta, document.head.firstChild);
    }

    // Add language
    document.documentElement.setAttribute('lang', 'fr');
  }
}

// Create singleton instance
export const seoService = new SEOService();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  seoService.initializeDefaultSEO();
}

export default seoService;