// Lead Capture Service
export interface LeadData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Business Information
  businessName: string;
  businessType: 'dropshipping' | 'retail' | 'wholesale' | 'services' | 'other';
  monthlyRevenue: 'under-10k' | '10k-50k' | '50k-100k' | '100k-500k' | 'over-500k';
  currentPlatforms: string[];
  
  // Pain Points & Goals
  mainChallenges: string[];
  primaryGoals: string[];
  timelineToStart: 'immediate' | 'within-month' | 'within-quarter' | 'exploring';
  
  // Technical Information
  currentTools: string[];
  techComfort: 'beginner' | 'intermediate' | 'advanced';
  teamSize: 'solo' | '2-5' | '6-20' | '20+';
  
  // Marketing Information
  marketingBudget: 'under-5k' | '5k-20k' | '20k-50k' | '50k-100k' | 'over-100k';
  currentMarketingChannels: string[];
  
  // Metadata
  source: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  sessionId: string;
  timestamp: number;
  leadScore: number;
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation: (data: Partial<LeadData>) => string[];
  isOptional?: boolean;
}

export interface FormField {
  id: keyof LeadData;
  type: 'text' | 'email' | 'tel' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'textarea';
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  required: boolean;
  validation?: (value: any) => string | null;
}

class LeadCaptureService {
  private isEnabled: boolean;
  private leadData: Partial<LeadData> = {};
  private currentStep = 0;
  private steps: FormStep[] = [];

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_LEAD_CAPTURE !== 'false';
    this.initializeSteps();
  }

  private initializeSteps(): void {
    this.steps = [
      {
        id: 'personal',
        title: 'Informations Personnelles',
        description: 'Commençons par apprendre à vous connaître',
        fields: [
          {
            id: 'firstName',
            type: 'text',
            label: 'Prénom',
            placeholder: 'Votre prénom',
            required: true,
            validation: (value) => value?.length < 2 ? 'Le prénom doit contenir au moins 2 caractères' : null
          },
          {
            id: 'lastName',
            type: 'text',
            label: 'Nom',
            placeholder: 'Votre nom',
            required: true,
            validation: (value) => value?.length < 2 ? 'Le nom doit contenir au moins 2 caractères' : null
          },
          {
            id: 'email',
            type: 'email',
            label: 'Adresse Email',
            placeholder: 'votre@email.com',
            required: true,
            validation: (value) => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return !emailRegex.test(value) ? 'Veuillez entrer une adresse email valide' : null;
            }
          },
          {
            id: 'phone',
            type: 'tel',
            label: 'Numéro de Téléphone',
            placeholder: '+213 XXX XXX XXX',
            required: true,
            validation: (value) => {
              const phoneRegex = /^(\+213|0)[5-7][0-9]{8}$/;
              return !phoneRegex.test(value?.replace(/\s/g, '')) ? 'Veuillez entrer un numéro de téléphone algérien valide' : null;
            }
          }
        ],
        validation: (data) => {
          const errors: string[] = [];
          if (!data.firstName) errors.push('Le prénom est requis');
          if (!data.lastName) errors.push('Le nom est requis');
          if (!data.email) errors.push('L\'email est requis');
          if (!data.phone) errors.push('Le téléphone est requis');
          return errors;
        }
      },
      {
        id: 'business',
        title: 'Votre Entreprise',
        description: 'Parlez-nous de votre activité commerciale',
        fields: [
          {
            id: 'businessName',
            type: 'text',
            label: 'Nom de votre entreprise',
            placeholder: 'Ma Boutique DZ',
            required: true
          },
          {
            id: 'businessType',
            type: 'radio',
            label: 'Type d\'activité',
            required: true,
            options: [
              { value: 'dropshipping', label: 'Dropshipping', description: 'Vente sans stock' },
              { value: 'retail', label: 'Commerce de détail', description: 'Vente directe aux consommateurs' },
              { value: 'wholesale', label: 'Commerce de gros', description: 'Vente aux revendeurs' },
              { value: 'services', label: 'Services', description: 'Prestations de services' },
              { value: 'other', label: 'Autre', description: 'Autre type d\'activité' }
            ]
          },
          {
            id: 'monthlyRevenue',
            type: 'radio',
            label: 'Chiffre d\'affaires mensuel (DZD)',
            required: true,
            options: [
              { value: 'under-10k', label: 'Moins de 100 000 DZD' },
              { value: '10k-50k', label: '100 000 - 500 000 DZD' },
              { value: '50k-100k', label: '500 000 - 1 000 000 DZD' },
              { value: '100k-500k', label: '1 000 000 - 5 000 000 DZD' },
              { value: 'over-500k', label: 'Plus de 5 000 000 DZD' }
            ]
          },
          {
            id: 'currentPlatforms',
            type: 'multiselect',
            label: 'Plateformes actuelles',
            required: false,
            options: [
              { value: 'facebook', label: 'Facebook' },
              { value: 'instagram', label: 'Instagram' },
              { value: 'whatsapp', label: 'WhatsApp Business' },
              { value: 'website', label: 'Site Web' },
              { value: 'marketplace', label: 'Places de marché' },
              { value: 'physical', label: 'Magasin physique' },
              { value: 'other', label: 'Autre' }
            ]
          }
        ],
        validation: (data) => {
          const errors: string[] = [];
          if (!data.businessName) errors.push('Le nom de l\'entreprise est requis');
          if (!data.businessType) errors.push('Le type d\'activité est requis');
          if (!data.monthlyRevenue) errors.push('Le chiffre d\'affaires est requis');
          return errors;
        }
      },
      {
        id: 'challenges',
        title: 'Défis & Objectifs',
        description: 'Aidez-nous à comprendre vos besoins',
        fields: [
          {
            id: 'mainChallenges',
            type: 'multiselect',
            label: 'Principaux défis actuels',
            required: true,
            options: [
              { value: 'lead-generation', label: 'Génération de leads', description: 'Difficulté à attirer de nouveaux clients' },
              { value: 'order-management', label: 'Gestion des commandes', description: 'Processus de commande complexe' },
              { value: 'customer-service', label: 'Service client', description: 'Réponse aux clients chronophage' },
              { value: 'marketing-automation', label: 'Automatisation marketing', description: 'Campagnes manuelles inefficaces' },
              { value: 'inventory-management', label: 'Gestion des stocks', description: 'Suivi des produits difficile' },
              { value: 'analytics', label: 'Analyse des performances', description: 'Manque de données exploitables' },
              { value: 'scaling', label: 'Croissance', description: 'Difficulté à faire grandir l\'activité' }
            ]
          },
          {
            id: 'primaryGoals',
            type: 'multiselect',
            label: 'Objectifs prioritaires',
            required: true,
            options: [
              { value: 'increase-sales', label: 'Augmenter les ventes', description: 'Booster le chiffre d\'affaires' },
              { value: 'save-time', label: 'Gagner du temps', description: 'Automatiser les tâches répétitives' },
              { value: 'improve-customer-experience', label: 'Améliorer l\'expérience client', description: 'Satisfaction client optimale' },
              { value: 'reduce-costs', label: 'Réduire les coûts', description: 'Optimiser les dépenses' },
              { value: 'expand-reach', label: 'Élargir la portée', description: 'Toucher plus de clients' },
              { value: 'better-analytics', label: 'Meilleures analyses', description: 'Données et insights précis' }
            ]
          },
          {
            id: 'timelineToStart',
            type: 'radio',
            label: 'Quand souhaitez-vous commencer ?',
            required: true,
            options: [
              { value: 'immediate', label: 'Immédiatement', description: 'Je veux commencer dès maintenant' },
              { value: 'within-month', label: 'Dans le mois', description: 'D\'ici 30 jours' },
              { value: 'within-quarter', label: 'Dans le trimestre', description: 'D\'ici 3 mois' },
              { value: 'exploring', label: 'J\'explore', description: 'Je me renseigne pour l\'instant' }
            ]
          }
        ],
        validation: (data) => {
          const errors: string[] = [];
          if (!data.mainChallenges?.length) errors.push('Veuillez sélectionner au moins un défi');
          if (!data.primaryGoals?.length) errors.push('Veuillez sélectionner au moins un objectif');
          if (!data.timelineToStart) errors.push('Veuillez indiquer votre timeline');
          return errors;
        }
      },
      {
        id: 'technical',
        title: 'Profil Technique',
        description: 'Évaluons votre niveau technique',
        fields: [
          {
            id: 'techComfort',
            type: 'radio',
            label: 'Niveau de confort avec la technologie',
            required: true,
            options: [
              { value: 'beginner', label: 'Débutant', description: 'Je préfère les solutions simples' },
              { value: 'intermediate', label: 'Intermédiaire', description: 'Je me débrouille bien' },
              { value: 'advanced', label: 'Avancé', description: 'Je maîtrise les outils techniques' }
            ]
          },
          {
            id: 'teamSize',
            type: 'radio',
            label: 'Taille de votre équipe',
            required: true,
            options: [
              { value: 'solo', label: 'Solo', description: 'Je travaille seul(e)' },
              { value: '2-5', label: '2-5 personnes', description: 'Petite équipe' },
              { value: '6-20', label: '6-20 personnes', description: 'Équipe moyenne' },
              { value: '20+', label: '20+ personnes', description: 'Grande équipe' }
            ]
          },
          {
            id: 'currentTools',
            type: 'multiselect',
            label: 'Outils actuellement utilisés',
            required: false,
            options: [
              { value: 'excel', label: 'Excel/Sheets' },
              { value: 'crm', label: 'CRM (Salesforce, HubSpot...)' },
              { value: 'email-marketing', label: 'Email Marketing' },
              { value: 'social-media-tools', label: 'Outils réseaux sociaux' },
              { value: 'analytics', label: 'Google Analytics' },
              { value: 'ecommerce-platform', label: 'Plateforme e-commerce' },
              { value: 'automation-tools', label: 'Outils d\'automatisation' },
              { value: 'none', label: 'Aucun outil spécialisé' }
            ]
          }
        ],
        validation: (data) => {
          const errors: string[] = [];
          if (!data.techComfort) errors.push('Le niveau technique est requis');
          if (!data.teamSize) errors.push('La taille d\'équipe est requise');
          return errors;
        }
      },
      {
        id: 'marketing',
        title: 'Marketing & Budget',
        description: 'Dernières informations sur votre stratégie',
        isOptional: true,
        fields: [
          {
            id: 'marketingBudget',
            type: 'radio',
            label: 'Budget marketing mensuel (DZD)',
            required: false,
            options: [
              { value: 'under-5k', label: 'Moins de 50 000 DZD' },
              { value: '5k-20k', label: '50 000 - 200 000 DZD' },
              { value: '20k-50k', label: '200 000 - 500 000 DZD' },
              { value: '50k-100k', label: '500 000 - 1 000 000 DZD' },
              { value: 'over-100k', label: 'Plus de 1 000 000 DZD' }
            ]
          },
          {
            id: 'currentMarketingChannels',
            type: 'multiselect',
            label: 'Canaux marketing actuels',
            required: false,
            options: [
              { value: 'facebook-ads', label: 'Publicités Facebook' },
              { value: 'google-ads', label: 'Google Ads' },
              { value: 'instagram-ads', label: 'Publicités Instagram' },
              { value: 'influencer-marketing', label: 'Marketing d\'influence' },
              { value: 'email-marketing', label: 'Email marketing' },
              { value: 'seo', label: 'Référencement naturel (SEO)' },
              { value: 'content-marketing', label: 'Marketing de contenu' },
              { value: 'word-of-mouth', label: 'Bouche-à-oreille' },
              { value: 'none', label: 'Aucun canal payant' }
            ]
          }
        ],
        validation: () => [] // Optional step, no required validation
      }
    ];
  }

  public getSteps(): FormStep[] {
    return this.steps;
  }

  public getCurrentStep(): number {
    return this.currentStep;
  }

  public getTotalSteps(): number {
    return this.steps.length;
  }

  public getStepData(stepIndex: number): FormStep | null {
    return this.steps[stepIndex] || null;
  }

  public updateStepData(stepData: Partial<LeadData>): void {
    this.leadData = { ...this.leadData, ...stepData };
  }

  public validateStep(stepIndex: number, data: Partial<LeadData>): string[] {
    const step = this.steps[stepIndex];
    if (!step) return ['Étape invalide'];

    return step.validation(data);
  }

  public canProceedToNextStep(stepIndex: number, data: Partial<LeadData>): boolean {
    const errors = this.validateStep(stepIndex, data);
    return errors.length === 0;
  }

  public nextStep(): boolean {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      return true;
    }
    return false;
  }

  public previousStep(): boolean {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  public calculateLeadScore(data: Partial<LeadData>): number {
    let score = 0;

    // Revenue scoring (0-30 points)
    const revenueScores = {
      'under-10k': 5,
      '10k-50k': 10,
      '50k-100k': 20,
      '100k-500k': 25,
      'over-500k': 30
    };
    score += revenueScores[data.monthlyRevenue as keyof typeof revenueScores] || 0;

    // Timeline scoring (0-25 points)
    const timelineScores = {
      'immediate': 25,
      'within-month': 20,
      'within-quarter': 10,
      'exploring': 5
    };
    score += timelineScores[data.timelineToStart as keyof typeof timelineScores] || 0;

    // Business type scoring (0-15 points)
    const businessTypeScores = {
      'dropshipping': 15,
      'retail': 12,
      'wholesale': 10,
      'services': 8,
      'other': 5
    };
    score += businessTypeScores[data.businessType as keyof typeof businessTypeScores] || 0;

    // Team size scoring (0-10 points)
    const teamSizeScores = {
      'solo': 5,
      '2-5': 7,
      '6-20': 9,
      '20+': 10
    };
    score += teamSizeScores[data.teamSize as keyof typeof teamSizeScores] || 0;

    // Marketing budget scoring (0-20 points)
    const budgetScores = {
      'under-5k': 2,
      '5k-20k': 8,
      '20k-50k': 15,
      '50k-100k': 18,
      'over-100k': 20
    };
    score += budgetScores[data.marketingBudget as keyof typeof budgetScores] || 0;

    return Math.min(score, 100); // Cap at 100
  }

  public async submitLead(finalData: Partial<LeadData>): Promise<{ success: boolean; leadId?: string; error?: string }> {
    try {
      // Merge all collected data
      const completeData: LeadData = {
        ...this.leadData,
        ...finalData,
        source: 'landing-page',
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
        leadScore: this.calculateLeadScore({ ...this.leadData, ...finalData })
      } as LeadData;

      // Add UTM parameters if available
      const urlParams = new URLSearchParams(window.location.search);
      completeData.utm_source = urlParams.get('utm_source') || undefined;
      completeData.utm_medium = urlParams.get('utm_medium') || undefined;
      completeData.utm_campaign = urlParams.get('utm_campaign') || undefined;

      // In a real implementation, send to your CRM/database
      console.log('Submitting lead:', completeData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Track conversion in analytics
      if (window.gtag) {
        window.gtag('event', 'lead_submission', {
          lead_score: completeData.leadScore,
          business_type: completeData.businessType,
          monthly_revenue: completeData.monthlyRevenue,
          timeline: completeData.timelineToStart,
          session_id: completeData.sessionId
        });
      }

      // Reset form data
      this.leadData = {};
      this.currentStep = 0;

      return {
        success: true,
        leadId: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

    } catch (error) {
      console.error('Failed to submit lead:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      };
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getLeadData(): Partial<LeadData> {
    return { ...this.leadData };
  }

  public resetForm(): void {
    this.leadData = {};
    this.currentStep = 0;
  }

  public isServiceEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create singleton instance
const leadCaptureService = new LeadCaptureService();

export default leadCaptureService;