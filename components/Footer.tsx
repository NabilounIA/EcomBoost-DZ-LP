import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-white/10">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              EcomBoost DZ
            </h3>
            <p className="text-gray-400 mt-1">Automatisez. Créez. Vendez.</p>
          </div>
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#services" className="text-gray-400 hover:text-white">Services</a>
            <a href="#pricing" className="text-gray-400 hover:text-white">Tarifs</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white">Témoignages</a>
          </div>
          <div>
            <Link to="/privacy" className="text-gray-400 hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} EcomBoost DZ. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
