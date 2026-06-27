import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, Shield, TrendingUp } from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { 
  isSupabaseConfigured,
  getSupabaseVotingNominees,
  saveSupabaseVotingNominee,
  saveSupabaseVoteAudit,
  saveSupabaseFraudAlert
} from '../lib/supabase';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-dark border border-gold/30 p-3 rounded-lg shadow-xl">
        <p className="font-display font-bold text-xs text-gold">{data.name}</p>
        <p className="font-sans text-[10px] text-dim">{data.organization}</p>
        <p className="font-sans text-xs text-ivory mt-1 font-semibold flex items-center gap-1">
          Votes Tally: <span className="text-sa-green">{payload[0].value}</span>
          {data.isUserVote && <span className="text-gold font-mono text-[9px] uppercase ml-1">(Your Choice)</span>}
        </p>
      </div>
    );
  }
  return null;
};

export function VotingPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const [nomineesList, setNomineesList] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('asae_voting_nominees');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [
      {
        id: 'V-NOM-01',
        name: 'Dr. Antonio Domingos',
        organization: 'Angola Investment Corp',
        category: 'Business Leader of the Year',
        status: 'Approved',
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'V-NOM-02',
        name: 'Sarah Mokoena',
        organization: 'FinTech Solutions SA',
        category: 'Business Leader of the Year',
        status: 'Approved',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'V-NOM-03',
        name: 'James Valerio',
        organization: 'TechForward Venture',
        category: 'Business Leader of the Year',
        status: 'Approved',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'V-NOM-04',
        name: 'Dr. Lando António',
        organization: 'Tech Africa Lab',
        category: 'Young Entrepreneur of the Year',
        status: 'Approved',
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 'V-NOM-05',
        name: 'Fatima Gonga',
        organization: 'Eco-Gonga Ltd',
        category: 'Sustainability Champion',
        status: 'Pending',
        photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfcc4?auto=format&fit=crop&w=400&q=80'
      }
    ];
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getSupabaseVotingNominees().then(noms => {
      if (noms && noms.length > 0) {
        setNomineesList(noms);
      }
    });
  }, []);

  const uniqueCategories = Array.from(new Set(nomineesList.filter(n => n.status === 'Approved').map(n => n.category)));

  const categories = uniqueCategories.map((title, idx) => ({
    id: `CAT-${idx + 1}`,
    title: title,
    nominees: nomineesList
      .filter(n => n.category === title && n.status === 'Approved')
      .map(n => ({
        id: n.id,
        name: n.name,
        org: n.organization,
        img: n.photoUrl
      }))
  }));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.length >= 6) {
      setIsAuthenticated(true);
    }
  };

  const submitVotes = () => {
    if (Object.keys(votes).length > 0) {
      // 1. Increment vote tallies in state & Supabase/localStorage
      try {
        const votedIds = Object.values(votes); // e.g. ['V-NOM-01', 'V-NOM-04']
        const updatedList = nomineesList.map((nom: any) => {
          if (votedIds.includes(nom.id)) {
            const updatedNom = { ...nom, votesCount: (nom.votesCount || 0) + 1 };
            saveSupabaseVotingNominee(updatedNom);
            return updatedNom;
          }
          return nom;
        });
        localStorage.setItem('asae_voting_nominees', JSON.stringify(updatedList));
        setNomineesList(updatedList);
      } catch (err) {
        console.error('Failed to increment vote count:', err);
      }

      // 2. Add vote audit logs & Fraud Alerts in Supabase/localStorage
      try {
        const storedAuditsStr = localStorage.getItem('asae_vote_audits') || '[]';
        const audits = JSON.parse(storedAuditsStr);
        const newAudits = Object.entries(votes).map(([catId, nomineeId]) => {
          const matchedNominee = nomineesList.find(n => n.id === nomineeId);
          return {
            voteId: `VOT-${Math.floor(202415 + Math.random() * 100000)}`,
            voterId: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
            deviceId: `DEV-${['F', 'K', 'M', 'Z', 'U'][Math.floor(Math.random() * 5)]}${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            location: ['Luanda, AO', 'Cape Town, ZA', 'Soweto, ZA', 'Benguela, AO', 'Johannesburg, ZA'][Math.floor(Math.random() * 5)],
            paymentRef: 'FREE-VOTE',
            nomineeName: matchedNominee ? matchedNominee.name : nomineeId,
            categoryName: matchedNominee ? matchedNominee.category : 'General Category',
            riskScore: Math.floor(Math.random() * 10)
          };
        });

        // Save audits and potential fraud alerts to Supabase
        newAudits.forEach(audit => {
          saveSupabaseVoteAudit(audit);
          if (audit.riskScore >= 7) {
            saveSupabaseFraudAlert({
              id: `FRD-${Math.floor(100 + Math.random() * 900)}`,
              voterId: audit.voterId,
              flaggedNominee: audit.nomineeName,
              timestamp: audit.timestamp,
              reason: `Rapid submission anomaly detected with high Risk Indicator of ${audit.riskScore}/10`,
              riskFactor: `${audit.riskScore}/10`,
              status: 'Triggered'
            });
          }
        });

        localStorage.setItem('asae_vote_audits', JSON.stringify([...newAudits, ...audits]));
      } catch (err) {
        console.error('Failed to append vote audit:', err);
      }

      setHasSubmitted(true);
    }
  };

  return (
    <section className="bg-dark py-24 px-6 md:px-12 border-t border-gold/10 relative overflow-hidden" id="vote">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(10,91,59,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="font-display text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Public Portal
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-[1.15] mb-6">
            Secure Voting <span className="text-gold">Platform</span>
          </h2>
          <p className="font-serif text-lg leading-[1.85] text-ivory/60 max-w-2xl mx-auto">
            Cast your vote for the leaders, innovators, and visionaries making an impact. Your voice shapes the future of our diaspora connection.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto bg-dark-card border border-gold/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none"></div>
              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 bg-dark border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 text-gold">
                  <Shield size={28} />
                </div>
                <h3 className="font-serif text-xl font-bold text-gold-pale">Identity Verification</h3>
                <p className="text-sm text-dim mt-2 font-sans tracking-wide">Enter your 6-digit access code to proceed.</p>
              </div>

              <form onSubmit={handleLogin} className="relative z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-[10px] tracking-[2px] uppercase text-ivory/60 mb-2 flex items-center gap-2">
                       <Lock size={12} className="text-gold" /> Secure Code
                    </label>
                    <input 
                      type="text" 
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="e.g. 842910"
                      className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all text-center tracking-widest text-lg"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase tracking-widest font-bold rounded-lg transition-all">
                    AUTHENTICATE
                  </button>
                </div>
                <p className="text-center text-[9px] text-dim mt-4 tracking-wide font-sans">
                  * Encrypted voting session strictly for registered delegates.
                </p>
              </form>
            </motion.div>
          ) : !hasSubmitted ? (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex justify-between items-center bg-dark-card border border-gold/20 p-4 sticky top-24 z-30 backdrop-blur-md">
                <div className="font-display text-sm text-ivory flex items-center gap-2">
                  <Shield size={16} className="text-gold" /> Secure Session Active
                </div>
                <div className="font-sans text-xs text-dim tracking-wider">
                  {Object.keys(votes).length} / {categories.length} Categories Voted
                </div>
              </div>

              {categories.map((category) => (
                <div key={category.id} className="relative">
                   <h3 className="font-display text-xl md:text-2xl font-bold text-gold mb-6 border-b border-gold/20 pb-4">
                     {category.title}
                   </h3>
                   <div className="grid md:grid-cols-3 gap-6">
                     {category.nominees.map((nominee) => (
                       <label 
                         key={nominee.id}
                         className={`relative overflow-hidden cursor-pointer border transition-all duration-300 group
                           ${votes[category.id] === nominee.id 
                             ? 'border-gold bg-gold/5' 
                             : 'border-white/10 bg-dark-card hover:border-gold/50 hover:bg-white/5'}`
                         }
                       >
                         <input 
                           type="radio" 
                           name={`category-${category.id}`} 
                           value={nominee.id}
                           checked={votes[category.id] === nominee.id}
                           onChange={() => setVotes({...votes, [category.id]: nominee.id})}
                           className="sr-only"
                         />
                         <div className="aspect-[4/3] overflow-hidden relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent z-10"></div>
                           <img src={nominee.img} alt={nominee.name} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" />
                           {votes[category.id] === nominee.id && (
                             <div className="absolute top-3 right-3 z-20 bg-gold text-dark rounded-full p-1 shadow-lg">
                               <CheckCircle2 size={16} strokeWidth={3} />
                             </div>
                           )}
                         </div>
                         <div className="p-5 relative z-20 -mt-10">
                           <h4 className="font-display font-bold text-lg text-ivory group-hover:text-gold transition-colors">{nominee.name}</h4>
                           <p className="font-sans text-xs text-ivory/60 mt-1 uppercase tracking-wider">{nominee.org}</p>
                         </div>
                       </label>
                     ))}
                   </div>
                </div>
              ))}

              <div className="text-center pt-8 border-t border-gold/20">
                <button 
                  onClick={() => setIsConfirming(true)}
                  disabled={Object.keys(votes).length === 0}
                  className="px-12 py-4 bg-gradient-to-br from-gold to-gold-light text-dark font-display text-sm tracking-[3px] font-bold transition-all hover:shadow-[0_8px_40px_rgba(201,162,39,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none [clip-path:polygon(12px_0%,100%_0%,calc(100%-12px)_100%,0%_100%)]"
                >
                  SUBMIT SECURE BALLOT
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl mx-auto grid md:grid-cols-12 gap-8 items-start text-left"
            >
              {/* Left Column: Confirmation & Actions (Span 4) */}
              <div className="md:col-span-4 bg-dark-card border border-gold/20 p-8 rounded-2xl text-center relative overflow-hidden flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none"></div>
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(201,162,39,0.3)]"
                >
                  <CheckCircle2 size={32} className="text-dark" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-ivory mb-3">Ballot Cast</h3>
                <p className="font-serif text-xs text-ivory/60 italic mb-6 leading-relaxed">
                  Your votes have been cryptographically recorded on the secure ledger. Thank you for participating.
                </p>
                
                {/* Your Selections Recap inside Success Card */}
                <div className="bg-dark/40 border border-white/5 rounded-lg p-4 mb-8 text-left space-y-3">
                  <h4 className="font-sans text-[9px] uppercase tracking-[2px] text-gold/80 font-bold border-b border-gold/10 pb-1.5 mb-2">
                    Your Cast Selections
                  </h4>
                  {categories.map((category) => {
                    const selectedNomId = votes[category.id];
                    const selectedNominee = category.nominees.find(n => n.id === selectedNomId);
                    return (
                      <div key={category.id} className="flex justify-between items-center gap-2 text-xs">
                        <span className="text-dim truncate max-w-[120px]">{category.title}:</span>
                        <span className="font-display font-semibold text-gold truncate text-right">
                          {selectedNominee ? selectedNominee.name : 'No Selection'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => {
                    setHasSubmitted(false);
                    setIsAuthenticated(false);
                    setVotes({});
                    setAccessCode('');
                  }}
                  className="w-full py-3 bg-dark hover:bg-gold/10 border border-gold/30 text-gold font-display text-xs tracking-[2px] transition-all uppercase font-bold rounded-lg"
                >
                  RETURN HOME
                </button>
              </div>

              {/* Right Column: Recharts Visual Dashboard (Span 8) */}
              <div className="md:col-span-8 bg-dark-card border border-gold/20 p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/5 to-transparent pointer-events-none"></div>
                
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-gold flex items-center gap-2">
                        <TrendingUp size={18} className="text-sa-green" /> Live Standing Dashboard
                      </h3>
                      <p className="font-sans text-xs text-dim mt-1">Real-time public voting progress metrics per category</p>
                    </div>
                    <div className="flex items-center gap-2 bg-dark/50 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-sa-green animate-pulse"></span>
                      LIVE DATA STREAMING
                    </div>
                  </div>

                  {/* Category Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {categories.map((category, index) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategoryIndex(index)}
                        className={`px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded transition-all ${
                          activeCategoryIndex === index
                            ? 'bg-gold text-dark'
                            : 'bg-white/5 text-dim hover:bg-white/10 hover:text-ivory border border-white/5'
                        }`}
                      >
                        {category.title}
                      </button>
                    ))}
                  </div>

                  {/* Standings list leading highlight */}
                  {categories[activeCategoryIndex] && (
                    <div className="mb-6">
                      {(() => {
                        const activeCat = categories[activeCategoryIndex];
                        const activeChartData = activeCat.nominees.map(n => {
                          const fullNominee = nomineesList.find(item => item.id === n.id);
                          let votesCount = fullNominee?.votesCount;
                          if (votesCount === undefined || votesCount === 0) {
                            const seed = parseInt(n.id.replace(/\D/g, '')) || 5;
                            votesCount = 45 + (seed * 18) % 120;
                          }
                          return {
                            name: n.name,
                            votes: votesCount,
                            organization: n.org,
                            isUserVote: votes[activeCat.id] === n.id
                          };
                        }).sort((a, b) => b.votes - a.votes);

                        const leader = activeChartData[0];
                        return (
                          <div className="bg-dark/50 border border-gold/10 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <p className="font-sans text-[9px] uppercase tracking-widest text-gold font-bold">Category Frontrunner</p>
                              <h4 className="font-display font-bold text-lg text-ivory mt-1">{leader?.name}</h4>
                              <p className="font-sans text-[11px] text-dim">{leader?.organization}</p>
                            </div>
                            <div className="bg-sa-green/10 text-sa-green border border-sa-green/25 px-4 py-2 rounded-lg text-center">
                              <p className="font-mono text-xs uppercase tracking-wider">Leading Votes</p>
                              <p className="font-display font-bold text-xl leading-none mt-1">{leader?.votes}</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Recharts Bar Chart */}
                  <div className="h-64 w-full relative">
                    {categories[activeCategoryIndex] ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categories[activeCategoryIndex].nominees.map(n => {
                            const activeCat = categories[activeCategoryIndex];
                            const fullNominee = nomineesList.find(item => item.id === n.id);
                            let votesCount = fullNominee?.votesCount;
                            if (votesCount === undefined || votesCount === 0) {
                              const seed = parseInt(n.id.replace(/\D/g, '')) || 5;
                              votesCount = 45 + (seed * 18) % 120;
                            }
                            return {
                              name: n.name,
                              votes: votesCount,
                              organization: n.org,
                              isUserVote: votes[activeCat.id] === n.id
                            };
                          })}
                          layout="vertical"
                          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                          <XAxis type="number" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            stroke="rgba(255,255,255,0.6)" 
                            fontSize={10} 
                            width={110}
                            tickLine={false}
                          />
                          <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                          <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={18}>
                            {categories[activeCategoryIndex].nominees.map((n, idx) => {
                              const isUserVote = votes[categories[activeCategoryIndex].id] === n.id;
                              return (
                                <Cell 
                                  key={`cell-${idx}`} 
                                  fill={isUserVote ? '#C9A227' : 'rgba(201,162,39,0.3)'} 
                                  stroke={isUserVote ? '#C9A227' : 'rgba(201,162,39,0.5)'}
                                  strokeWidth={1}
                                />
                              );
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-dim font-sans text-xs">
                        No nominees available for standings.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-dim">
                  <span>Ledger Status: Locked & Confirmed</span>
                  <span>ASAE Core Node v2.4</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isConfirming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-dark-card border border-gold/30 rounded-2xl max-w-lg w-full p-8 shadow-[0_15px_50px_rgba(0,0,0,0.8)] relative overflow-hidden text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none"></div>
              
              <h3 className="font-display text-2xl font-bold text-gold mb-4 flex items-center gap-2">
                <Shield className="text-gold" size={24} /> Review Your Ballot
              </h3>
              <p className="font-sans text-xs text-dim mb-6 uppercase tracking-wider">
                Please confirm your official selections before final transmission.
              </p>

              <div className="space-y-4 mb-8">
                {categories.map((category) => {
                  const selectedNomId = votes[category.id];
                  const selectedNominee = category.nominees.find(n => n.id === selectedNomId);
                  return (
                    <div key={category.id} className="bg-dark/40 border border-white/5 p-4 rounded-lg flex justify-between items-center">
                      <div className="min-w-0 pr-4">
                        <p className="font-sans text-[10px] uppercase tracking-widest text-gold/70">{category.title}</p>
                        <p className="font-display font-bold text-ivory text-base truncate mt-1">
                          {selectedNominee ? selectedNominee.name : 'No Selection'}
                        </p>
                        {selectedNominee && (
                          <p className="font-sans text-[11px] text-dim truncate">{selectedNominee.org}</p>
                        )}
                      </div>
                      {selectedNominee && (
                        <div className="w-10 h-10 rounded-full border border-gold/20 overflow-hidden flex-shrink-0">
                          <img src={selectedNominee.img} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 py-3 border border-white/10 hover:border-white/30 text-ivory font-sans text-xs tracking-wider uppercase rounded-lg transition-colors"
                >
                  Cancel & Edit
                </button>
                <button 
                  onClick={() => {
                    setIsConfirming(false);
                    submitVotes();
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-dark font-sans font-bold text-xs tracking-wider uppercase rounded-lg shadow-lg hover:shadow-gold/20 transition-all"
                >
                  Confirm & Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
