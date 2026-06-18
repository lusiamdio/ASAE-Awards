import React from 'react';
import { motion } from 'motion/react';

const speakers = [
  { name: 'Dr. A. Domingos', title: 'CEO · Angola Investment Corp', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Ms. C. Fernandes', title: 'Director · Pan-African Trade', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Prof. M. da Silva', title: 'Chair · Innovation Council', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dr. L. António', title: 'Founder · Tech Africa', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
];

export function Speakers() {
  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12 border-t border-white/5" id="speakers">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Visionaries
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15]">
            Featured <span className="text-gold">Speakers</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {speakers.map((speaker, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: idx * 0.1 }}
               className="group overflow-hidden bg-dark-card border border-white/5 rounded-xl hover:border-gold/30 transition-colors shadow-2xl"
             >
               <div className="w-full aspect-[3/4] bg-dark relative overflow-hidden">
                 <img 
                   src={speaker.img} 
                   alt={speaker.name} 
                   className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent pointer-events-none"></div>
               </div>
               <div className="p-6 relative text-center">
                 <h4 className="font-serif font-bold text-lg text-ivory mb-1">{speaker.name}</h4>
                 <p className="font-sans text-[10px] text-dim tracking-widest uppercase">{speaker.title}</p>
                 <div className="absolute bottom-0 left-0 right-0 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
