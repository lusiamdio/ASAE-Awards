import React from 'react';
import { motion } from 'motion/react';

const winners = [
  {
    year: '2026',
    name: 'Leila Lopes',
    category: 'Beauty, Fashion & Social Advocacy',
    description: 'Former Miss Universe 2011, beauty pageants, brand ambassadorship, philanthropy, HIV/AIDS awareness, and pageant administration. She currently leads the Miss Angola organization.',
    img: 'https://media.licdn.com/dms/image/v2/D4E03AQESfuS86PazTg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704560155347?e=1783555200&v=beta&t=YJHFIXyjte6nWcAl3J7HyBzwKe2VAV59cVzaLS4ooSY'
  },
  {
    year: '2026',
    name: 'Maria Borges',
    category: 'Fashion & Modeling',
    description: "International fashion model, luxury brand ambassador, runway modeling, fashion campaigns, and media. She has worked with major global fashion houses and was a Victoria's Secret model.",
    img: 'https://s3.r29static.com/bin/entry/148/x/1786645/image.png'
  },
  {
    year: '2026',
    name: 'Paulo Flores',
    category: 'Music & Entertainment',
    description: "Musician, singer, songwriter, cultural ambassador, and one of Angola's most influential Semba artists.",
    img: 'https://bordalo.observador.pt/v2/q:60/rs:fill:940/c:1844:2129:nowe:122:111/plain/https://s3.observador.pt/wp-content/uploads/2026/02/27145021/pauloflores-045.jpg'
  },
  {
    year: '2026',
    name: 'Ivanilson Machado',
    category: 'Media, Journalism & Broadcasting',
    description: 'Chief Executive Officer of Pumangol. Television, radio, journalism, media production, communications, and public engagement.',
    img: 'https://media.licdn.com/dms/image/v2/D4D03AQHU81SJsA5a8Q/profile-displayphoto-shrink_400_400/B4DZOncLDpGUAg-/0/1733681007801?e=1783555200&v=beta&t=NwvXcJNHuuAoDUn-PkbsVLeDk4Byi7CDGijbsdV3Akw'
  },
  {
    year: '2026',
    name: 'Isabel dos Santos',
    category: 'Business, Investment & Telecommunications',
    description: "Investments, banking, telecommunications, energy, retail, finance, and venture capital. She is widely known as one of Africa's most prominent business figures.",
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Isabel_dos_Santos_%28cropped%29.jpg'
  },
  {
    year: '2026',
    name: 'Jean-Claude Bastos de Morais',
    category: 'Investment Management, Finance & Venture Capital',
    description: 'Entrepreneur, private equity, infrastructure investment, asset management, innovation funding, and strategic investment across Africa through Quantum Global.',
    img: 'https://media.licdn.com/dms/image/v2/C5603AQE41VEeuECAKg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1517514971318?e=1783555200&v=beta&t=mEstAk-EUotoXBdyulkaojDvo2dph70722JEmGrT4wo'
  },
  {
    year: '2026',
    name: 'Agostinho Kapaia',
    category: 'Chairman of the Board and CEO of OPAIA Group SA',
    description: 'Entrepreneur, private equity, Automotive and Distibution, asset management, innovation funding, and strategic investment across Africa through Quantum Global.',
    img: 'https://clubofmozambique.com/wp-content/uploads/2026/06/kapaya.fb_.jpg'
    }
];

export function Gallery() {
  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12 border-t border-gold/10" id="gallery">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="font-display text-[11px] tracking-[5px] uppercase text-gold/80 flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-gold"></span>
              LEGACY & EXCELLENCE
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.15] text-ivory">
              Hall of <span className="text-gold">Fame</span>
            </h2>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="#all" 
            className="inline-flex items-center gap-2 text-gold font-sans text-xs tracking-[2px] uppercase opacity-70 hover:opacity-100 transition-opacity"
          >
            Explore Complete Archive →
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map((winner, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="group relative overflow-hidden bg-dark-card rounded-xl border border-white/5 transition-all duration-300 hover:border-gold/30"
             >
               <div className="aspect-[4/5] overflow-hidden relative">
                 {/* Dark overlay that deepens on hover to keep description text highly legible */}
                 <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent z-10 opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
                 <img src={winner.img} alt={winner.name} className="w-full h-full object-cover transform duration-750 opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all" />
                 
                 <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-dark/80 backdrop-blur-sm border border-white/10 text-gold font-sans text-[10px] tracking-widest leading-none">
                   {winner.year}
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-1">{winner.category}</p>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ivory mb-2 leading-tight">{winner.name}</h3>
                    <p className="text-xs text-dim leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-4 line-clamp-4">
                      {winner.description}
                    </p>
                    <div className="w-8 h-[2px] bg-gold transition-all duration-300 group-hover:w-16"></div>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
