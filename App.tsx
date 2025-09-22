import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import DemoVideo from './components/DemoVideo';
import ROICalculator from './components/ROICalculator';
import CaseStudies from './components/CaseStudies';
import ChatbotDemo from './components/ChatbotDemo';
import Services from './components/Services';
import AdGeneratorDemo from './components/AdGeneratorDemo';
import SocialMediaAutomationDemo from './components/SocialMediaAutomationDemo';
import AnalyticsDashboardDemo from './components/AnalyticsDashboardDemo';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';

import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import BlogPage from './components/BlogPage';
import AdminInterface from './components/AdminInterface';
import WhatsAppWidget from './components/WhatsAppWidget';
import ExitIntentPopup from './components/ExitIntentPopup';
import LazyLoad from './components/LazyLoad';

import AlertNotifications from './components/AlertNotifications';
import IntelligentChatbot from './components/IntelligentChatbot';
import { useAdvancedAnalytics } from './hooks/useAdvancedAnalytics';
import { useHomepageSEO, usePrivacySEO } from './hooks/useSEO';
import { usePagePerformance } from './hooks/usePerformanceMonitoring';
import { initSentry } from './services/monitoring';

const LandingPage: React.FC = () => {
  useHomepageSEO();
  usePagePerformance('homepage');
  
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <LazyLoad>
        <DemoVideo />
      </LazyLoad>
      <LazyLoad>
        <ROICalculator />
      </LazyLoad>
      <LazyLoad>
        <CaseStudies />
      </LazyLoad>
      <LazyLoad>
        <ChatbotDemo />
      </LazyLoad>
      <Services />
      <LazyLoad>
        <AdGeneratorDemo />
      </LazyLoad>
      <LazyLoad>
        <SocialMediaAutomationDemo />
      </LazyLoad>
      <LazyLoad>
        <AnalyticsDashboardDemo />
      </LazyLoad>
      <About />
      <LazyLoad>
        <Testimonials />
      </LazyLoad>
      <LazyLoad>
        <FAQ />
      </LazyLoad>
      <LazyLoad>
        <Pricing />
      </LazyLoad>
      <LazyLoad>
        <Contact />
      </LazyLoad>
      <FinalCTA />
    </>
  );
};

const App: React.FC = () => {
  // Initialize analytics tracking
  useAdvancedAnalytics();
  
  // Initialize performance monitoring
  usePagePerformance('app');

  // Initialize Sentry monitoring
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen font-sans transition-colors duration-300">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/admin" element={<AdminInterface />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppWidget />
      <ExitIntentPopup />
      <IntelligentChatbot />
      <AlertNotifications />
    </div>
  );
};

export default App;