import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, CheckCircle2, Shield } from 'lucide-react';

const categories = [
  {
    id: 1,
    title: 'Business Leader of the Year',
    nominees: [
      { id: 'n1', name: 'Dr. A. Domingos', org: 'Angola Investment Corp', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
      { id: 'n2', name: 'Ms. C. Fernandes', org: 'Pan-African Trade', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
      { id: 'n3', name: 'James Valerio', org: 'TechForward', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 2,
    title: 'Technology Innovator',
    nominees: [
      { id: 'n4', name: 'Dr. L. António', org: 'Tech Africa', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' },
      { id: 'n5', name: 'Sarah Mokoena', org: 'FinTech Solutions SA', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfcc4?auto=format&fit=crop&w=400&q=80' }
    ]
  }
];

export function VotingPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [votes, setVotes] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.length >= 6) {
      setIsAuthenticated(true);
    }
  };

  const submitVotes = () => {
    // Check if at least one vote is cast
    if (Object.keys(votes).length > 0) {
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
                  onClick={submitVotes}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto bg-dark-card border border-gold/20 p-12 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(201,162,39,0.4)]"
              >
                <CheckCircle2 size={40} className="text-dark" />
              </motion.div>
              <h3 className="font-display text-3xl font-bold text-ivory mb-4">Ballot Cast Successfully</h3>
              <p className="font-serif text-lg text-ivory/70 italic mb-8">
                Your votes have been securely recorded. Thank you for participating in the ASAE Awards.
              </p>
              <button 
                onClick={() => {
                  setHasSubmitted(false);
                  setIsAuthenticated(false);
                  setVotes({});
                  setAccessCode('');
                }}
                className="px-8 py-3 border border-gold/30 text-gold font-display text-xs tracking-[2px] transition-all hover:bg-gold/10 hover:border-gold"
              >
                RETURN HOME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
