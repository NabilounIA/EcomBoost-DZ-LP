import React from 'react';

const testimonials = [
  {
    quote: "En 3 mois, mes ventes sont passées de 150.000 DA à 380.000 DA par mois. Le robot WhatsApp répond même la nuit et prend les commandes pendant que je dors. Plus jamais de clients perdus !",
    name: "Karim B.",
    business: "Boutique de vêtements",
    location: "Oran",
    result: "+153% de ventes"
  },
  {
    quote: "Avant, je créais mes pubs avec Canva et ça ne marchait pas. Maintenant avec leurs visuels pros, j'ai 5x plus de clics et mes coûts pub ont baissé de 40%. ROI incroyable !",
    name: "Yasmine M.",
    business: "Cosmétiques naturels",
    location: "Alger",
    result: "5x plus de clics"
  },
  {
    quote: "Je vendais 20 produits par semaine maximum. Avec l'automatisation complète, je gère maintenant 80+ commandes par semaine sans stress. Mon chiffre d'affaires a triplé en 4 mois.",
    name: "Ahmed L.",
    business: "Électronique & accessoires",
    location: "Constantine",
    result: "4x plus de commandes"
  }
];

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const QuoteIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} width="48" height="34" viewBox="0 0 48 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.84 33.42C15.84 33.42 13.11 32.43 10.65 30.45C8.19 28.47 6.42 25.92 5.34 22.8L0 23.94C1.35 28.89 4.14 32.43 8.37 34.56C8.19 32.22 8.1 30.24 8.1 28.62C8.1 23.4 9.63 18.75 12.69 14.67L18.45 15.93C15.03 20.34 13.32 24.36 13.32 27.99C13.32 29.88 13.86 31.62 14.94 33.18C15.0601 33.284 15.1923 33.3712 15.333 33.4383L18.84 33.42Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M47.88 33.42C44.88 33.42 42.15 32.43 39.69 30.45C37.23 28.47 35.46 25.92 34.38 22.8L29.04 23.94C30.39 28.89 33.18 32.43 37.41 34.56C37.23 32.22 37.14 30.24 37.14 28.62C37.14 23.4 38.67 18.75 41.73 14.67L47.49 15.93C44.07 20.34 42.36 24.36 42.36 27.99C42.36 29.88 42.9 31.62 43.98 33.18C44.1 33.284 44.2323 33.3712 44.373 33.4383L47.88 33.42Z" fill="url(#paint1_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="9.42" y1="14.67" x2="9.42" y2="34.56" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0.01"/>
            <stop offset="1" stop-color="white" stop-opacity="0.1"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="38.46" y1="14.67" x2="38.46" y2="34.56" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" stop-opacity="0.01"/>
            <stop offset="1" stop-color="white" stop-opacity="0.1"/>
            </linearGradient>
        </defs>
    </svg>
)

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Ce que nos clients disent de nous</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white/5 p-8 rounded-2xl shadow-lg text-left relative border border-white/10 backdrop-blur-xl">
              <QuoteIcon className="absolute top-6 right-6" />
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
              </div>
              <p className="text-gray-300 italic mb-6 relative z-10">"{testimonial.quote}"</p>
              <div className="mb-3">
                <div className="font-bold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.business} • {testimonial.location}</div>
              </div>
              <div className="inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                {testimonial.result}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;