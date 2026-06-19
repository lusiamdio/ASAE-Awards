import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Target, Users, Scale, Star, ChevronRight } from 'lucide-react';

const tabs = [
  { id: 'history', label: 'History & Significance', icon: History },
  { id: 'mission', label: 'Mission & Vision', icon: Target },
  { id: 'committee', label: 'Organizing Committee', icon: Users },
  { id: 'judging', label: 'Judging Criteria', icon: Scale },
];

export function AboutDetails() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12 border-t border-white/5" id="about-details">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            The Foundation
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15] text-ivory">
            About the <span className="text-gold">Awards</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Tabs Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 font-sans tracking-wide border ${
                    isActive
                      ? 'bg-gold/10 border-gold/30 text-gold shadow-lg shadow-gold/5'
                      : 'bg-dark border-transparent text-dim hover:bg-white/5 hover:text-ivory'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-gold' : 'text-dim'} />
                    <span className={`text-sm font-bold uppercase tracking-widest ${isActive ? 'text-gold' : ''}`}>
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-gold' : 'text-transparent'}`} />
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-dark border border-white/5 rounded-2xl p-8 lg:p-12 shadow-2xl relative min-h-[400px]">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-tr-2xl pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-3xl font-bold text-gold-pale mb-6">History & Significance</h3>
                    <div className="space-y-6 text-dim leading-relaxed font-sans text-sm md:text-base">
                      <p>
                        Established to bridge the dynamic connection between Angola and South Africa, the ASAE Awards have become the premier platform for recognizing diaspora excellence. Our history is rooted in the shared economic, cultural, and political ties that bind these two vibrant nations.
                      </p>
                      <p>
                        The significance of the ASAE Awards extends beyond mere recognition; it serves as a beacon of inspiration for the next generation of Pan-African leaders. By highlighting those who have overcome borders to achieve greatness, we showcase the profound impact of Cross-border collaboration.
                      </p>
                      <div className="bg-black/40 border border-white/5 p-6 rounded-xl mt-8">
                        <div className="flex items-start gap-4">
                          <Star className="text-gold shrink-0 mt-1" size={20} />
                          <p className="text-ivory/80 italic font-serif text-lg">
                            "Celebrating the pioneers, innovators, and leaders shaping the economic and cultural bridge between Luanda and Cape Town."
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'mission' && (
                  <motion.div
                    key="mission"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-3xl font-bold text-gold-pale mb-6">Mission & Vision</h3>
                    <div className="space-y-8">
                      <div>
                        <h4 className="font-sans font-bold uppercase tracking-widest text-gold text-xs mb-3">Our Mission</h4>
                        <p className="text-dim leading-relaxed font-sans text-sm md:text-base">
                          To identify, honor, and elevate Angolan professionals, entrepreneurs, and community champions who are making extraordinary contributions to the socio-economic and cultural landscape of South Africa.
                        </p>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>
                      <div>
                        <h4 className="font-sans font-bold uppercase tracking-widest text-gold text-xs mb-3">Our Vision</h4>
                        <p className="text-dim leading-relaxed font-sans text-sm md:text-base">
                          To foster a united, empowered, and highly collaborative Pan-African diaspora that continuously drives innovation, trade, and cultural exchange across the continent, setting a global standard for cross-border excellence.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'committee' && (
                  <motion.div
                    key="committee"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-3xl font-bold text-gold-pale mb-6">The Organizing Committee</h3>
                    <p className="text-dim leading-relaxed font-sans text-sm md:text-base mb-8">
                      The ASAE Excellence Committee comprises distinguished leaders, diplomats, and industry experts dedicated to maintaining the integrity, transparency, and prestige of the awards.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {[
                        { name: 'H.E. Ambassador', role: 'Honorary Chair' },
                        { name: 'Executive Board', role: 'Strategic Direction' },
                        { name: 'Jury Panel', role: 'Independent Evaluators' },
                        { name: 'Secretariat', role: 'Event Operations' }
                      ].map((member, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center border border-gold/20">
                            <Users size={16} className="text-gold" />
                          </div>
                          <div>
                            <h5 className="font-serif font-bold text-ivory text-lg leading-tight">{member.name}</h5>
                            <span className="font-sans text-[10px] uppercase tracking-widest text-dim">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'judging' && (
                  <motion.div
                    key="judging"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-3xl font-bold text-gold-pale mb-6">Judging Criteria</h3>
                    <p className="text-dim leading-relaxed font-sans text-sm md:text-base mb-8">
                      Our independent Jury Panel conducts a rigorous, transparent evaluation process. Nominees are assessed against comprehensive criteria tailored to showcase true excellence and sustainable impact.
                    </p>
                    <div className="space-y-4">
                      {[
                        { title: 'Measurable Impact', desc: 'Demonstrable positive effect on the community, industry, or economy.' },
                        { title: 'Innovation & Leadership', desc: 'Pioneering new approaches and inspiring others to achieve greatness.' },
                        { title: 'Cross-Border Collaboration', desc: 'Strengthening ties and fostering cooperation between Angola and South Africa.' },
                        { title: 'Integrity & Ethics', desc: 'Upholding the highest standards of professional and personal conduct.' }
                      ].map((criteria, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30 shrink-0 mt-1">
                            <span className="font-sans font-bold text-[10px] text-gold">{i + 1}</span>
                          </div>
                          <div>
                            <h5 className="font-serif font-bold text-ivory text-lg">{criteria.title}</h5>
                            <p className="font-sans text-sm text-dim mt-1">{criteria.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
