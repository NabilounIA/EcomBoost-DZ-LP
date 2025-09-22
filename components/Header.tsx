import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WHATSAPP_LINK } from '../constants';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '#problem', label: 'Le Problème' },
    { href: '#solution', label: 'La Solution' },
    { href: '#demo', label: 'Démo Chatbot' },
    { href: '#ad-creator', label: 'Créateur IA' },
    { href: '#social-automation', label: 'Posts Auto' },
    { href: '#analytics', label: 'Dashboard' },
    { href: '#services', label: 'Services' },
    { href: '#testimonials', label: 'Témoignages' },
    { href: '#pricing', label: 'Tarifs' },
  ];

  const routeLinks = [
    { to: '/blog', label: 'Blog' },
  ];

  const isHomePage = location.pathname === '/';

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);


  const HamburgerIcon = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden relative z-[100] h-8 w-8 text-white focus:outline-none"
      aria-label="Ouvrir le menu"
      aria-expanded={isOpen}
    >
      <div className="absolute top-1/2 left-1/2 w-7 -translate-x-1/2 -translate-y-1/2 transform">
        <span
          aria-hidden="true"
          className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${
            isOpen ? 'rotate-45' : '-translate-y-2'
          }`}
        ></span>
        <span
          aria-hidden="true"
          className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : ''
          }`}
        ></span>
        <span
          aria-hidden="true"
          className={`block absolute h-0.5 w-7 transform bg-current transition duration-300 ease-in-out ${
            isOpen ? '-rotate-45' : 'translate-y-2'
          }`}
        ></span>
      </div>
    </button>
  );

  const MobileMenu = () => (
     <div className={`fixed inset-0 z-[90] bg-gray-900/90 backdrop-blur-xl transition-opacity duration-300 ease-in-out md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center justify-center h-full gap-y-8">
            {isHomePage && navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)} 
                className="text-gray-300 hover:text-white transition-colors text-2xl font-medium"
              >
                {link.label}
              </a>
            ))}
            {routeLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={() => setIsOpen(false)} 
                className="text-gray-300 hover:text-white transition-colors text-2xl font-medium"
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle showLabel={true} size="md" className="mt-4" />
             <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors w-64"
            >
              <WhatsAppIcon className="w-5 h-5 mr-3" />
              Contactez-nous
            </a>
        </nav>
      </div>
  )

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 transition-transform hover:scale-105">
            EcomBoost DZ
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {isHomePage && navLinks.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            {routeLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="text-gray-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-all text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden md:flex" size="sm" />
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center bg-green-500 hover:bg-green-400 text-gray-900 font-bold py-2 px-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-500/20"
            >
              <WhatsAppIcon className="w-5 h-5 mr-2" />
              Contactez-nous
            </a>
            <HamburgerIcon />
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;