import React from 'react';
import { motion } from 'motion/react';

const winners = [
  { year: '2025', name: 'Julio da Costa', category: 'Entrepreneur of the Year', img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80' },
  { year: '2025', name: 'Ana Beatriz', category: 'Arts & Culture', img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=600&q=80' },
  { year: '2024', name: 'Dr. Samuel Nzinga', category: 'Lifetime Achievement', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80' },
  { year: '2024', name: 'Luanda Tech Hub', category: 'Technology Innovator', img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' },
  { year: '2023', name: 'Maria Santos', category: 'Community Impact', img: 'https://images.unsplash.com/photo-1531123414704-0b13d282ee0a?auto=format&fit=crop&w=600&q=80' },
  { year: '2023', name: 'Paulo Silva', category: 'Business Leader', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' }
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
               className="group relative overflow-hidden bg-dark-card rounded-xl border border-white/5 transition-colors"
             >
               <div className="aspect-[4/5] overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity"></div>
                 <img src={winner.img} alt={winner.name} className="w-full h-full object-cover transform duration-700 opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105" />
                 
                 <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-dark/80 backdrop-blur-sm border border-white/10 text-gold font-sans text-[10px] tracking-widest leading-none">
                   {winner.year}
                 </div>

                 <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="font-sans text-[10px] tracking-[3px] uppercase text-gold mb-2">{winner.category}</p>
                    <h3 className="font-serif text-2xl font-bold text-ivory mb-2">{winner.name}</h3>
                    <div className="w-0 h-px bg-gold transition-all duration-500 group-hover:w-16"></div>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
