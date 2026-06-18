import React from 'react';
import { motion } from 'motion/react';
import asaeMapEmblem from '../assets/images/asae_map_emblem_1781798602123.jpg';

const stats = [
  { number: '500+', label: 'Attendees' },
  { number: '20+', label: 'Award Categories' },
  { number: '30+', label: 'Sponsors' },
  { number: '2', label: 'Day Experience' },
];

export function Stats() {
  return (
    <div className="bg-dark/80 border-y border-white/5 py-10 px-6 lg:px-16" id="stats">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-transparent md:divide-white/5 md:divide-x">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center px-5 relative"
          >
            <div className="font-display text-4xl md:text-5xl font-black bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent leading-none">
              {stat.number}
            </div>
            <div className="font-sans text-[11px] tracking-[2px] uppercase text-dim mt-2">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12" id="about">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="w-full aspect-[4/5] bg-dark-card border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60 z-10 pointer-events-none"></div>
            <img 
              src={asaeMapEmblem}
              alt="ASAE Angola & South Africa Map of Excellence"
              className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none"></div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold rounded-full flex flex-col items-center justify-center shadow-lg shadow-gold/10">
            <span className="font-serif text-xl font-bold text-dark leading-none">2026</span>
            <span className="font-sans text-[8px] tracking-[2px] text-dark-soft uppercase mt-1">EST</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold flex items-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Our Story
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold leading-[1.15] mb-6">
            What is <span className="text-gold">ASAE Awards?</span>
          </h2>
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="px-3 py-1.5 border border-white/10 rounded-lg font-sans text-[10px] tracking-[2px] text-gold uppercase bg-black/20 flex items-center gap-2">
              <img src="https://flagcdn.com/w40/ao.png" alt="Angola Flag" className="w-[18px] h-[12px] object-cover rounded-[1px]" referrerPolicy="no-referrer" />
              Angola
            </div>
            <div className="px-3 py-1.5 border border-white/10 rounded-lg font-sans text-[10px] tracking-[2px] text-gold uppercase bg-black/20 flex items-center gap-2">
              <img src="https://flagcdn.com/w40/za.png" alt="South Africa Flag" className="w-[18px] h-[12px] object-cover rounded-[1px]" referrerPolicy="no-referrer" />
              South Africa
            </div>
            <div className="px-3 py-1.5 border border-white/10 rounded-lg font-sans text-[10px] tracking-[2px] text-gold uppercase bg-black/20 flex items-center gap-2">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=40&h=40&q=80" alt="Pan-African" className="w-[14px] h-[14px] object-cover rounded-full" referrerPolicy="no-referrer" />
              Pan-African
            </div>
          </div>
          <p className="font-serif text-lg md:text-xl leading-[1.85] text-ivory/75 mb-5">
            The Angolan in South Africa Excellence Awards (ASAE) celebrates, connects, and empowers Angolan professionals, entrepreneurs, and community leaders who are shaping the future of Southern Africa.
          </p>
          <p className="font-serif text-lg md:text-xl leading-[1.85] text-ivory/75 mb-8">
            Born from the vision of a united Pan-African leadership platform, ASAE bridges two great nations — honoring those who embody excellence, resilience, and the spirit of progress across borders.
          </p>
          <a href="#conference" className="inline-block px-8 py-3 bg-gradient-to-br from-gold to-gold-light text-dark font-display text-xs tracking-[2px] font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(201,162,39,0.5)] [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]">
            Discover the Experience
          </a>
        </motion.div>
      </div>
    </section>
  );
}
