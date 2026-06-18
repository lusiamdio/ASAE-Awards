import React from 'react';
import { motion } from 'motion/react';

const categories = [
  { img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80', title: 'Business Leader' },
  { img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=200&h=200&q=80', title: 'Entrepreneur' },
  { img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=200&h=200&q=80', title: 'Community Impact' },
  { img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=200&h=200&q=80', title: 'Technology Innovator' },
  { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&h=200&q=80', title: 'Education Excellence' },
  { img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=200&h=200&q=80', title: 'Healthcare Champion' },
  { img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=200&h=200&q=80', title: 'Arts & Culture' },
  { img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=200&h=200&q=80', title: 'Legal & Advocacy' },
  { img: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=200&h=200&q=80', title: 'Trade & Investment' },
  { img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&h=200&q=80', title: 'Youth Excellence' }
];

export function ConferenceAndAwards() {
  return (
    <section className="bg-dark-soft border-t border-white/5 py-24 px-6 md:px-12" id="awards">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold flex items-center gap-4 mb-5">
              <span className="w-8 h-px bg-gold"></span>
              Recognition
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15]">
              Award <span className="text-gold">Categories</span>
            </h2>
          </motion.div>
          <motion.a 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="#vote" 
            className="inline-block px-8 py-3 bg-gold hover:bg-gold-light text-dark font-sans text-xs tracking-[2px] font-bold transition-all rounded-lg shadow-lg"
          >
            VOTE NOW
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-dark-card border border-white/5 rounded-xl p-6 md:p-8 text-center transition-all duration-300 hover:border-gold/40 hover:-translate-y-2 relative group overflow-hidden shadow-xl"
            >
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden mx-auto mb-4 border border-gold/20 flex items-center justify-center p-0.5 bg-dark group-hover:scale-115 group-hover:border-gold transition-all duration-300 shadow-lg">
                <img 
                  src={cat.img} 
                  alt={cat.title} 
                  className="w-full h-full object-cover rounded-full" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-serif text-[15px] tracking-[1px] text-ivory leading-relaxed">{cat.title}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
