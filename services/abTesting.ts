// A/B Testing Service for EcomBoost DZ


export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // Percentage allocation (0-100)
  config: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: ABTestVariant[];
  startDate?: Date;
  endDate?: Date;
  targetAudience?: {
    percentage: number;
    conditions?: Record<string, any>;
  };
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: Date;
  converted?: boolean;
  conversionValue?: number;
}

class ABTestingService {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();
  private results: ABTestResult[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_AB_TESTING === 'true';
    this.loadFromStorage();
  }

  // Initialize A/B testing service
  initialize(): void {
    if (!this.isEnabled) return;

    // Set up default tests
    this.setupDefaultTests();
    

  }

  // Create a new A/B test
  createTest(test: ABTest): void {
    if (!this.isEnabled) return;

    // Validate test configuration
    if (!this.validateTest(test)) {
      throw new Error('Invalid test configuration');
    }

    this.tests.set(test.id, test);
    this.saveToStorage();


  }

  // Get variant for a user in a specific test
  getVariant(testId: string, userId: string): string | null {
    if (!this.isEnabled) return null;

    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user is already assigned
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }

    const userTests = this.userAssignments.get(userId)!;
    if (userTests.has(testId)) {
      return userTests.get(testId)!;
    }

    // Check if user qualifies for the test
    if (!this.userQualifiesForTest(test, userId)) {
      return null;
    }

    // Assign user to a variant
    const variantId = this.assignUserToVariant(test, userId);
    userTests.set(testId, variantId);
    this.saveToStorage();



    return variantId;
  }

  // Track conversion for A/B test
  trackConversion(testId: string, userId: string, conversionValue?: number): void {
    if (!this.isEnabled) return;

    const userTests = this.userAssignments.get(userId);
    if (!userTests || !userTests.has(testId)) return;

    const variantId = userTests.get(testId)!;
    const result: ABTestResult = {
      testId,
      variantId,
      userId,
      timestamp: new Date(),
      converted: true,
      conversionValue
    };

    this.results.push(result);
    this.saveToStorage();


  }

  // Get test results and statistics
  getTestResults(testId: string): any {
    if (!this.isEnabled) return null;

    const test = this.tests.get(testId);
    if (!test) return null;

    const testResults = this.results.filter(r => r.testId === testId);
    const stats: any = {};

    test.variants.forEach(variant => {
      const variantResults = testResults.filter(r => r.variantId === variant.id);
      const conversions = variantResults.filter(r => r.converted);
      
      stats[variant.id] = {
        name: variant.name,
        participants: variantResults.length,
        conversions: conversions.length,
        conversionRate: variantResults.length > 0 ? (conversions.length / variantResults.length) * 100 : 0,
        totalValue: conversions.reduce((sum, r) => sum + (r.conversionValue || 0), 0)
      };
    });

    return {
      test,
      stats,
      totalParticipants: testResults.length,
      startDate: test.startDate,
      endDate: test.endDate
    };
  }

  // Helper methods
  private validateTest(test: ABTest): boolean {
    if (!test.id || !test.name || !test.variants || test.variants.length < 2) {
      return false;
    }

    const totalWeight = test.variants.reduce((sum, v) => sum + v.weight, 0);
    return Math.abs(totalWeight - 100) < 0.01; // Allow for floating point precision
  }

  private userQualifiesForTest(test: ABTest, userId: string): boolean {
    // Check target audience percentage
    if (test.targetAudience?.percentage) {
      const hash = this.hashUserId(userId);
      if (hash > test.targetAudience.percentage) {
        return false;
      }
    }

    // Add more qualification logic here (device, location, etc.)
    return true;
  }

  private assignUserToVariant(test: ABTest, userId: string): string {
    const hash = this.hashUserId(userId);
    let cumulativeWeight = 0;

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (hash <= cumulativeWeight) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return test.variants[0].id;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }

  private setupDefaultTests(): void {
    // CTA Button Test
    this.createTest({
      id: 'hero-cta-test',
      name: 'Hero CTA Button Test',
      description: 'Test different CTA button texts and colors',
      status: 'running',
      variants: [
        {
          id: 'control',
          name: 'Control - Démarrer sur WhatsApp',
          weight: 50,
          config: {
            text: 'Démarrer sur WhatsApp',
            color: 'green',
            size: 'large'
          }
        },
        {
          id: 'variant-a',
          name: 'Variant A - Commencer Maintenant',
          weight: 50,
          config: {
            text: 'Commencer Maintenant',
            color: 'blue',
            size: 'large'
          }
        }
      ],
      startDate: new Date(),
      targetAudience: {
        percentage: 100 // Include all users
      }
    });

    // Pricing Test
    this.createTest({
      id: 'pricing-display-test',
      name: 'Pricing Display Test',
      description: 'Test different pricing presentation styles',
      status: 'running',
      variants: [
        {
          id: 'control',
          name: 'Control - Standard Pricing',
          weight: 50,
          config: {
            style: 'standard',
            highlight: 'popular'
          }
        },
        {
          id: 'variant-a',
          name: 'Variant A - Value Focused',
          weight: 50,
          config: {
            style: 'value-focused',
            highlight: 'savings'
          }
        }
      ],
      startDate: new Date(),
      targetAudience: {
        percentage: 100
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const testsData = localStorage.getItem('ab_tests');
      const assignmentsData = localStorage.getItem('ab_assignments');
      const resultsData = localStorage.getItem('ab_results');

      if (testsData) {
        const tests = JSON.parse(testsData);
        this.tests = new Map(Object.entries(tests));
      }

      if (assignmentsData) {
        const assignments = JSON.parse(assignmentsData);
        this.userAssignments = new Map(
          Object.entries(assignments).map(([userId, tests]) => [
            userId,
            new Map(Object.entries(tests as any))
          ])
        );
      }

      if (resultsData) {
        this.results = JSON.parse(resultsData);
      }
    } catch (error) {
      console.warn('Failed to load A/B testing data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      // Save tests
      const testsObj = Object.fromEntries(this.tests);
      localStorage.setItem('ab_tests', JSON.stringify(testsObj));

      // Save assignments
      const assignmentsObj: any = {};
      this.userAssignments.forEach((tests, userId) => {
        assignmentsObj[userId] = Object.fromEntries(tests);
      });
      localStorage.setItem('ab_assignments', JSON.stringify(assignmentsObj));

      // Save results
      localStorage.setItem('ab_results', JSON.stringify(this.results));
    } catch (error) {
      console.warn('Failed to save A/B testing data to storage:', error);
    }
  }

  // Generate a simple user ID based on browser fingerprint
  generateUserId(): string {
    const stored = localStorage.getItem('ab_user_id');
    if (stored) return stored;

    const userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('ab_user_id', userId);
    return userId;
  }
}

// Create singleton instance
export const abTesting = new ABTestingService();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  abTesting.initialize();
}

export default abTesting;