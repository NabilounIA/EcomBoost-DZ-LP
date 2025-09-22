import React from 'react';
import Blog from './Blog';
import { useBlogSEO } from '../hooks/useSEO';
import { usePagePerformance } from '../hooks/usePerformanceMonitoring';

const BlogPage: React.FC = () => {
  // SEO optimization for blog page
  useBlogSEO();
  
  // Performance monitoring for blog page
  usePagePerformance('blog');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Blog Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog EcomBoost DZ
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez les dernières tendances, conseils et stratégies pour faire grandir votre e-commerce en Algérie
          </p>
        </div>
      </section>

      {/* Blog Content */}
      <Blog />
    </div>
  );
};

export default BlogPage;