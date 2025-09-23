import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  image: string;
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Comment l\'IA Révolutionne le E-commerce en Algérie',
    excerpt: 'Découvrez comment l\'intelligence artificielle transforme le paysage du commerce électronique algérien et booste les ventes.',
    content: 'L\'intelligence artificielle révolutionne le e-commerce en Algérie...',
    author: 'Ahmed Benali',
    date: '2024-01-15',
    category: 'IA & Technologie',
    tags: ['IA', 'E-commerce', 'Algérie', 'Innovation'],
    readTime: '5 min',
    image: '/api/placeholder/400/250',
    featured: true
  },
  {
    id: '2',
    title: 'Stratégies de Marketing Digital pour PME Algériennes',
    excerpt: 'Les meilleures pratiques de marketing digital adaptées au marché algérien pour maximiser votre ROI.',
    content: 'Le marketing digital en Algérie nécessite une approche spécifique...',
    author: 'Fatima Zohra',
    date: '2024-01-12',
    category: 'Marketing Digital',
    tags: ['Marketing', 'PME', 'Stratégie', 'ROI'],
    readTime: '7 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: '3',
    title: 'Automatisation des Réseaux Sociaux : Guide Complet',
    excerpt: 'Apprenez à automatiser vos publications sur les réseaux sociaux tout en maintenant l\'engagement de votre audience.',
    content: 'L\'automatisation des réseaux sociaux est devenue essentielle...',
    author: 'Karim Messaoud',
    date: '2024-01-10',
    category: 'Réseaux Sociaux',
    tags: ['Automatisation', 'Social Media', 'Engagement', 'Productivité'],
    readTime: '6 min',
    image: '/api/placeholder/400/250',
    featured: true
  },
  {
    id: '4',
    title: 'Chatbots IA : L\'Avenir du Service Client',
    excerpt: 'Comment les chatbots alimentés par l\'IA améliorent l\'expérience client et réduisent les coûts opérationnels.',
    content: 'Les chatbots IA représentent une révolution dans le service client...',
    author: 'Amina Khelifi',
    date: '2024-01-08',
    category: 'Service Client',
    tags: ['Chatbot', 'IA', 'Service Client', 'Automatisation'],
    readTime: '4 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: '5',
    title: 'Analytics E-commerce : Mesurer pour Réussir',
    excerpt: 'Les métriques essentielles à suivre pour optimiser votre boutique en ligne et augmenter vos conversions.',
    content: 'L\'analyse des données est cruciale pour le succès en e-commerce...',
    author: 'Youcef Brahimi',
    date: '2024-01-05',
    category: 'Analytics',
    tags: ['Analytics', 'Métriques', 'Conversion', 'Optimisation'],
    readTime: '8 min',
    image: '/api/placeholder/400/250',
    featured: false
  },
  {
    id: '6',
    title: 'Tendances E-commerce 2024 en Afrique du Nord',
    excerpt: 'Les tendances émergentes qui façonneront le e-commerce en Afrique du Nord cette année.',
    content: 'Le e-commerce en Afrique du Nord connaît une croissance exceptionnelle...',
    author: 'Leila Benhadj',
    date: '2024-01-03',
    category: 'Tendances',
    tags: ['Tendances', '2024', 'Afrique du Nord', 'Croissance'],
    readTime: '6 min',
    image: '/api/placeholder/400/250',
    featured: true
  }
];

const categories = ['Tous', 'IA & Technologie', 'Marketing Digital', 'Réseaux Sociaux', 'Service Client', 'Analytics', 'Tendances'];

const Blog: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePostClick = (postId: string, postTitle: string) => {
    // Post click handled
  };

  const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured = false }) => (
    <article 
      className={`
        group cursor-pointer transition-all duration-300 hover:transform hover:scale-105
        ${featured 
          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700' 
          : 'bg-white dark:bg-gray-800'
        }
        rounded-xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-600
        ${theme === 'dark' ? 'card-dark' : ''}
      `}
      onClick={() => handlePostClick(post.id, post.title)}
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.category}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
              ⭐ À la Une
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{post.author}</span>
          <span>{post.readTime}</span>
        </div>
        
        <h3 className={`font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${featured ? 'text-xl' : 'text-lg'} text-gray-900 dark:text-white`}>
          {post.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.date).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </article>
  );

  return (
    <section id="blog" className={`py-20 ${theme === 'dark' ? 'section-gradient' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Blog & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {' '}Ressources
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez nos derniers articles, guides et conseils pour optimiser votre présence digitale et booster vos ventes en ligne.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Articles à la Une</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map(post => (
                <BlogCard key={post.id} post={post} featured={true} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Tous les Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Aucun article trouvé</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tous');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className={`mt-20 p-8 rounded-2xl ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} border border-gray-200 dark:border-gray-600`}>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Restez Informé 📧
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Recevez nos derniers articles, conseils et tendances directement dans votre boîte mail. 
              Pas de spam, que du contenu de qualité !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;