import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Calendar, Sparkles, MapPin, Users, Globe, ChevronRight } from 'lucide-react';
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

const timelineData = [
  {
    year: '2024',
    title: 'The Inaugural Gala Assembly',
    theme: 'Uniting Diaspora Wealth',
    venue: 'Sandton Convention Centre, Johannesburg',
    description: 'The historic launch of the ASAE awards, uniting over 300 business leaders, diplomats, and young visionaries to establish the first formal economic and cultural bridge between Angola and South Africa.',
    highlights: [
      { category: 'Diaspora Leadership', winner: 'Dr. Manuel Castelo', detail: 'Honored for pioneering bilateral SADC capital investments and facilitating corporate relocations.' },
      { category: 'Youth Empowerment', winner: 'Cape Town Angolan Student Coalition', detail: 'Awarded for structuring career transition frameworks for foreign graduates.' },
      { category: 'Bilateral Trade', winner: 'Standard Bank Sovereign Corridor', detail: 'Recognized for launching customized multi-currency business accounts.' }
    ],
    stats: { attendees: '320+', categories: '12', satisfaction: '96%' },
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2025',
    title: 'Accelerating Digital Growth',
    theme: 'Fintech and Cross-Border SADC Corridors',
    venue: 'Epic Sana, Luanda & One&Only, Cape Town',
    description: 'ASAE expanded into a prestigious dual-hub format, introducing advanced mobile payment standardizations and highlighting technology and female business innovators.',
    highlights: [
      { category: 'Fintech Pioneer', winner: 'Isabel dos Santos Neto', detail: 'Built real-time multi-currency settlement APIs for small-to-medium diaspora enterprises.' },
      { category: 'Enterprise Catalyst', winner: 'Kwanza Invest Fund', detail: 'Distributed seed capital to 12 promising Angolan-led technology startups based in South Africa.' },
      { category: 'Strategic Alliance', winner: 'Angola-SA Chamber of Commerce Task Force', detail: 'Streamlined customs advisory procedures for cross-border logistics.' }
    ],
    stats: { attendees: '450+', categories: '16', satisfaction: '98%' },
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  }
];

export function About() {
  const [selectedTimelineYear, setSelectedTimelineYear] = useState('2025');

  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12" id="about">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Main About Section Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
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

        {/* ⏳ TIMELINE SECTION (Previous Years & Winners) */}
        <div className="pt-12 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="font-sans text-[9px] tracking-[4px] uppercase text-gold flex items-center justify-center gap-3 mb-3">
              <Sparkles size={12} /> RETROSPECTIVE OF EXCELLENCE
            </div>
            <h3 className="font-serif text-2xl md:text-4xl font-bold text-ivory">
              ASAE <span className="text-gold">Historical Milestones</span>
            </h3>
            <p className="font-sans text-xs text-dim mt-3 leading-relaxed">
              Explore the legacy of our community, tracing the winners, strategic themes, and regional highlights that shaped previous awards seasons.
            </p>

            {/* Year Selector Tabs */}
            <div className="flex justify-center gap-2 mt-8">
              {timelineData.map((data) => (
                <button
                  key={data.year}
                  onClick={() => setSelectedTimelineYear(data.year)}
                  className={`px-6 py-2.5 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all cursor-pointer ${
                    selectedTimelineYear === data.year
                      ? 'bg-gold text-dark font-black shadow-[0_4px_20px_rgba(201,162,39,0.3)]'
                      : 'bg-dark-card hover:bg-white/5 text-dim hover:text-ivory border border-white/5'
                  }`}
                >
                  {data.year} Edition
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {timelineData.map((data) => {
              if (data.year !== selectedTimelineYear) return null;
              return (
                <motion.div
                  key={data.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid lg:grid-cols-12 gap-8 items-stretch"
                >
                  {/* Left Column: Details & Stats (7 of 12) */}
                  <div className="lg:col-span-7 bg-dark-card border border-gold/15 p-8 md:p-10 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.05),transparent_70%) pointer-events-none"></div>
                    
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 px-3 py-1 rounded-full text-gold font-mono uppercase text-[10px]">
                          <Calendar size={12} className="text-gold" /> {data.year} theme
                        </div>
                        <div className="flex items-center gap-1.5 text-dim">
                          <MapPin size={12} className="text-sa-green" /> {data.venue}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-serif text-2xl md:text-3xl font-black text-ivory tracking-tight">
                          {data.title}
                        </h4>
                        <p className="font-sans text-xs text-gold/80 uppercase tracking-widest font-bold">
                          "{data.theme}"
                        </p>
                      </div>

                      <p className="font-serif text-sm leading-relaxed text-dim italic">
                        {data.description}
                      </p>

                      {/* Winners Grid */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <h5 className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                          <Award size={14} className="text-gold" /> Key Laureates & Highlights
                        </h5>
                        
                        <div className="grid sm:grid-cols-3 gap-4">
                          {data.highlights.map((hl, idx) => (
                            <div key={idx} className="bg-dark/40 border border-white/5 p-4 rounded-xl space-y-2 hover:border-gold/20 transition-all group/hl">
                              <p className="font-sans text-[9px] uppercase tracking-wide text-dim font-bold">{hl.category}</p>
                              <p className="font-display font-bold text-xs text-gold group-hover/hl:text-gold-light transition-colors">{hl.winner}</p>
                              <p className="font-sans text-[10px] text-dim/80 leading-normal">{hl.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5 text-center">
                      <div className="bg-dark/50 p-3 rounded-lg border border-white/5">
                        <p className="font-sans text-[9px] uppercase text-dim tracking-wider">Delegates</p>
                        <p className="font-display font-bold text-lg text-sa-green mt-1">{data.stats.attendees}</p>
                      </div>
                      <div className="bg-dark/50 p-3 rounded-lg border border-white/5">
                        <p className="font-sans text-[9px] uppercase text-dim tracking-wider">Award Trophies</p>
                        <p className="font-display font-bold text-lg text-gold mt-1">{data.stats.categories}</p>
                      </div>
                      <div className="bg-dark/50 p-3 rounded-lg border border-white/5">
                        <p className="font-sans text-[9px] uppercase text-dim tracking-wider">Approval Rate</p>
                        <p className="font-display font-bold text-lg text-angola-red mt-1">{data.stats.satisfaction}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase (5 of 12) */}
                  <div className="lg:col-span-5 relative group overflow-hidden rounded-2xl border border-white/5 min-h-[300px] lg:min-h-auto">
                    <img
                      src={data.image}
                      alt={data.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent flex flex-col justify-end p-8">
                      <span className="font-sans text-[9px] uppercase tracking-widest text-gold font-bold">ASAE MEMORIES</span>
                      <h4 className="font-serif text-lg font-bold text-ivory mt-1">Strengthening Regional Ties</h4>
                      <p className="font-sans text-xs text-dim mt-1.5 leading-relaxed">
                        Dual economic corridors drive deep SADC integrations, accelerating cooperative entrepreneurship structures.
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

