'use client';

import React, { useState } from 'react';
// Commenté pour résoudre le problème de build (dépendance manquante)
// import { Plus, Edit, Trash2, Save, X, MessageSquare, Brain, Database, Activity } from 'lucide-react';
import MonitoringDashboard from './MonitoringDashboard';

interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

interface ConversationExample {
  id: string;
  userMessage: string;
  expertResponse: string;
  category: string;
  keywords: string[];
  followUpQuestions?: string[];
}

const AdminInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'conversations' | 'analytics' | 'monitoring'>('knowledge');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | ConversationExample | null>(null);
  
  // États pour la base de connaissances
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    {
      id: '1',
      question: 'Quels sont vos services ?',
      answer: 'Nous proposons des chatbots WhatsApp intelligents, des visuels professionnels et des campagnes publicitaires automatisées.',
      category: 'services',
      keywords: ['services', 'chatbot', 'visuels', 'publicité']
    }
  ]);
  
  // États pour les exemples de conversation
  const [conversationExamples, setConversationExamples] = useState<ConversationExample[]>([
    {
      id: '1',
      userMessage: 'Je vends des vêtements, comment vous pouvez m\'aider ?',
      expertResponse: 'Parfait ! Pour un vendeur de vêtements, nos solutions sont idéales...',
      category: 'services',
      keywords: ['vêtements', 'aide', 'vendre'],
      followUpQuestions: ['Quel est votre chiffre d\'affaires actuel ?', 'Voulez-vous voir une démo ?']
    }
  ]);

  const [newKnowledgeItem, setNewKnowledgeItem] = useState<Partial<KnowledgeItem>>({
    question: '',
    answer: '',
    category: 'services',
    keywords: []
  });

  const [newConversationExample, setNewConversationExample] = useState<Partial<ConversationExample>>({
    userMessage: '',
    expertResponse: '',
    category: 'services',
    keywords: [],
    followUpQuestions: []
  });

  const categories = ['services', 'tarifs', 'technique', 'roi', 'concurrence', 'résultats', 'engagement'];

  const handleAddKnowledgeItem = () => {
    if (newKnowledgeItem.question && newKnowledgeItem.answer) {
      const item: KnowledgeItem = {
        id: Date.now().toString(),
        question: newKnowledgeItem.question,
        answer: newKnowledgeItem.answer,
        category: newKnowledgeItem.category || 'services',
        keywords: newKnowledgeItem.keywords || []
      };
      setKnowledgeItems([...knowledgeItems, item]);
      setNewKnowledgeItem({ question: '', answer: '', category: 'services', keywords: [] });
    }
  };

  const handleAddConversationExample = () => {
    if (newConversationExample.userMessage && newConversationExample.expertResponse) {
      const example: ConversationExample = {
        id: Date.now().toString(),
        userMessage: newConversationExample.userMessage,
        expertResponse: newConversationExample.expertResponse,
        category: newConversationExample.category || 'services',
        keywords: newConversationExample.keywords || [],
        followUpQuestions: newConversationExample.followUpQuestions || []
      };
      setConversationExamples([...conversationExamples, example]);
      setNewConversationExample({ 
        userMessage: '', 
        expertResponse: '', 
        category: 'services', 
        keywords: [], 
        followUpQuestions: [] 
      });
    }
  };

  const handleDeleteKnowledgeItem = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id));
  };

  const handleDeleteConversationExample = (id: string) => {
    setConversationExamples(conversationExamples.filter(example => example.id !== id));
  };

  const exportData = () => {
    const data = {
      knowledgeBase: knowledgeItems,
      conversationExamples: conversationExamples,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-training-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interface d'Administration - Chatbot EcomBoost DZ
          </h1>
          <p className="text-gray-600">
            Gérez la base de connaissances et les exemples de conversation pour améliorer l'intelligence du chatbot
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'knowledge'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Database className="w-4 h-4 inline mr-2" />
                Base de Connaissances
              </button>
              <button
                onClick={() => setActiveTab('conversations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'conversations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Exemples de Conversations
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Brain className="w-4 h-4 inline mr-2" />
                Analytics & Performance
              </button>
              <button
                onClick={() => setActiveTab('monitoring')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monitoring'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Monitoring Système
              </button>
            </nav>
          </div>
        </div>

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            {/* Add New Knowledge Item */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Ajouter une nouvelle connaissance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newKnowledgeItem.question || ''}
                    onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, question: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Quels sont vos tarifs ?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={newKnowledgeItem.category || 'services'}
                    onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Réponse
                </label>
                <textarea
                  value={newKnowledgeItem.answer || ''}
                  onChange={(e) => setNewKnowledgeItem({...newKnowledgeItem, answer: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Réponse détaillée..."
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  value={newKnowledgeItem.keywords?.join(', ') || ''}
                  onChange={(e) => setNewKnowledgeItem({
                    ...newKnowledgeItem, 
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tarifs, prix, coût, abonnement"
                />
              </div>
              <button
                onClick={handleAddKnowledgeItem}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </button>
            </div>

            {/* Knowledge Items List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Base de Connaissances ({knowledgeItems.length} éléments)</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {knowledgeItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                          <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{item.answer}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteKnowledgeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversations Tab */}
        {activeTab === 'conversations' && (
          <div className="space-y-6">
            {/* Add New Conversation Example */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Ajouter un exemple de conversation</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message utilisateur
                  </label>
                  <input
                    type="text"
                    value={newConversationExample.userMessage || ''}
                    onChange={(e) => setNewConversationExample({...newConversationExample, userMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Je vends des vêtements, comment vous pouvez m'aider ?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réponse experte
                  </label>
                  <textarea
                    value={newConversationExample.expertResponse || ''}
                    onChange={(e) => setNewConversationExample({...newConversationExample, expertResponse: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Réponse experte détaillée avec émojis et structure..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={newConversationExample.category || 'services'}
                      onChange={(e) => setNewConversationExample({...newConversationExample, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mots-clés
                    </label>
                    <input
                      type="text"
                      value={newConversationExample.keywords?.join(', ') || ''}
                      onChange={(e) => setNewConversationExample({
                        ...newConversationExample, 
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="vêtements, aide, vendre"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Questions de suivi (une par ligne)
                  </label>
                  <textarea
                    value={newConversationExample.followUpQuestions?.join('\n') || ''}
                    onChange={(e) => setNewConversationExample({
                      ...newConversationExample, 
                      followUpQuestions: e.target.value.split('\n').filter(q => q.trim())
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quel est votre chiffre d'affaires actuel ?&#10;Voulez-vous voir une démo ?"
                  />
                </div>
              </div>
              <button
                onClick={handleAddConversationExample}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter l'exemple
              </button>
            </div>

            {/* Conversation Examples List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Exemples de Conversations ({conversationExamples.length} éléments)</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {conversationExamples.map((example) => (
                  <div key={example.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            {example.category}
                          </span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-600 mb-1">👤 Utilisateur :</p>
                          <p className="text-gray-900">{example.userMessage}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-600 mb-1">🤖 Assistant :</p>
                          <p className="text-gray-900 whitespace-pre-line">{example.expertResponse}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {example.keywords.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        {example.followUpQuestions && example.followUpQuestions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Questions de suivi :</p>
                            <ul className="text-sm text-gray-600">
                              {example.followUpQuestions.map((question, index) => (
                                <li key={index}>• {question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteConversationExample(example.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Performance du Chatbot</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900">Conversations Totales</h3>
                  <p className="text-3xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-blue-600">+12% ce mois</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-900">Taux de Résolution</h3>
                  <p className="text-3xl font-bold text-green-600">87%</p>
                  <p className="text-sm text-green-600">+5% ce mois</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-purple-900">Satisfaction Client</h3>
                  <p className="text-3xl font-bold text-purple-600">4.6/5</p>
                  <p className="text-sm text-purple-600">Stable</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Questions Fréquentes Non Résolues</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span>Comment intégrer le chatbot avec mon site e-commerce ?</span>
                  <span className="text-sm text-yellow-600">23 fois demandé</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span>Puis-je personnaliser les réponses automatiques ?</span>
                  <span className="text-sm text-yellow-600">18 fois demandé</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span>Quels sont les délais de mise en place ?</span>
                  <span className="text-sm text-yellow-600">15 fois demandé</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Monitoring Système</h2>
              <p className="text-gray-600 mb-6">
                Surveillez les performances en temps réel de votre application et du chatbot
              </p>
              <MonitoringDashboard embedded={true} />
            </div>
          </div>
        )}

        {/* Export Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Exporter les Données</h3>
              <p className="text-gray-600">Téléchargez toutes les données d'entraînement au format JSON</p>
            </div>
            <button
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInterface;