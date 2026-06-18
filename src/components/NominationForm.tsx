import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle2, UserCircle, Briefcase, FileText } from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';

export function NominationForm() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'signin' && email === 'simao@neurogrowthlabs.co.za' && password === 'ASAExcellence') {
      setIsSuperAdmin(true);
    } else {
      setIsAuthenticated(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
  };

  return (
    <section className="bg-dark-soft py-24 px-6 md:px-12 border-t border-white/5 relative overflow-hidden" id="nominate">
      {isSuperAdmin && (
        <AdminDashboard onLogout={() => {
          setIsSuperAdmin(false);
          setEmail('');
          setPassword('');
          setIsAuthenticated(false);
        }} />
      )}
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-angola-red/5 to-transparent rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="font-sans font-bold text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Official Application
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15] text-ivory">
            Professional <span className="text-gold">Nomination</span>
          </h2>
          <p className="font-sans text-dim mt-4 max-w-2xl mx-auto">
            Submit a candidate for consideration by our independent Jury Panel. Ensure all fields are filled accurately to reflect the nominee's true excellence and impact.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isInitializing ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8"
            >
              <div className="space-y-6">
                <div className="h-6 w-48 bg-white/5 rounded-md animate-pulse"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-3 w-24 bg-white/5 rounded mt-1 mb-3 animate-pulse"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 w-32 bg-white/5 rounded mt-1 mb-3 animate-pulse"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="h-6 w-56 bg-white/5 rounded-md animate-pulse"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="h-3 w-40 bg-white/5 rounded mt-1 mb-3 animate-pulse"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                  <div>
                    <div className="h-3 w-28 bg-white/5 rounded mt-1 mb-3 animate-pulse"></div>
                    <div className="h-12 w-full bg-white/5 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="h-6 w-40 bg-white/5 rounded-md animate-pulse"></div>
                <div>
                  <div className="h-3 w-64 bg-white/5 rounded mt-1 mb-3 animate-pulse"></div>
                  <div className="h-32 w-full bg-white/5 rounded-lg animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="h-6 w-48 bg-white/5 rounded-md animate-pulse"></div>
                <div className="h-40 w-full bg-white/10 rounded-xl animate-pulse"></div>
              </div>

              <div className="pt-6">
                <div className="h-14 w-full bg-white/10 rounded-lg animate-pulse"></div>
              </div>
            </motion.div>
          ) : !isAuthenticated ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-8"
            >
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-bold text-ivory mb-2">
                  {authMode === 'signin' ? 'Sign In' : 'Create an Account'}
                </h3>
                 <p className="font-sans text-sm text-dim">
                  {authMode === 'signin' 
                    ? 'Welcome back. Enter your credentials to proceed to the nomination form.' 
                    : 'Register to submit professional nominations.'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                {authMode === 'signup' && (
                  <div>
                    <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Full Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                  </div>
                )}
                <div>
                  <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Email Address</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                </div>
                <button type="submit" className="w-full py-4 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase tracking-widest font-bold rounded-lg transition-all shadow-lg">
                  {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  type="button"
                  className="font-sans text-xs text-dim hover:text-gold transition-colors"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.div>
          ) : !hasSubmitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="bg-dark-card border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Personal Info */}
                <div className="space-y-6 md:col-span-2 border-b border-white/5 pb-8">
                  <h3 className="font-serif font-bold text-xl text-gold-pale flex items-center gap-3">
                    <UserCircle className="text-gold" size={20} /> Nominee Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Full Name *</label>
                      <input required type="text" placeholder="Dr. Henrique dos Santos" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Email Address *</label>
                      <input required type="email" placeholder="henrique@example.com" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                    </div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="space-y-6 md:col-span-2 border-b border-white/5 pb-8">
                  <h3 className="font-serif font-bold text-xl text-gold-pale flex items-center gap-3">
                    <Briefcase className="text-gold" size={20} /> Professional Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Organization / Company *</label>
                      <input required type="text" placeholder="Angola Investment Corp" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all"/>
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Award Category *</label>
                      <div className="relative">
                        <select required defaultValue="" className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all appearance-none">
                          <option value="" disabled>Select Category</option>
                          <option>Business Leader of the Year</option>
                          <option>Technology Innovator</option>
                          <option>Community Impact Award</option>
                          <option>Arts & Culture</option>
                          <option>Lifetime Achievement</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold">
                           <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="space-y-6 md:col-span-2 border-b border-white/5 pb-8">
                  <h3 className="font-serif font-bold text-xl text-gold-pale flex items-center gap-3">
                    <FileText className="text-gold" size={20} /> Impact Statement
                  </h3>
                  <div>
                    <label className="block font-sans text-[10px] font-bold tracking-widest uppercase text-ivory/60 mb-2">Career Summary & Achievement Details *</label>
                    <textarea required rows={5} placeholder="Provide a concise overview of the nominee's career, key milestones, and their profound impact on the Pan-African community..." className="w-full bg-dark/50 border border-white/10 rounded-lg text-ivory font-sans px-4 py-3 outline-none focus:border-gold/50 transition-all resize-none"></textarea>
                    <p className="text-right text-[10px] text-dim mt-2 font-sans tracking-wide">Max 500 words</p>
                  </div>
                </div>

                {/* Evidence Upload */}
                <div className="space-y-6 md:col-span-2">
                  <h3 className="font-serif font-bold text-xl text-gold-pale flex items-center gap-3">
                    <UploadCloud className="text-gold" size={20} /> Supporting Evidence
                  </h3>
                  <label className="block w-full border-2 border-dashed border-white/10 hover:border-gold/40 hover:bg-gold/5 transition-all rounded-xl p-8 text-center cursor-pointer group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                    />
                    <div className="w-12 h-12 rounded-full bg-dark border border-white/10 flex items-center justify-center mx-auto mb-4 text-dim group-hover:text-gold transition-colors">
                      <UploadCloud size={24} />
                    </div>
                    {fileName ? (
                      <p className="font-sans text-sm font-bold text-gold">{fileName}</p>
                    ) : (
                      <>
                        <p className="font-sans text-sm font-bold text-ivory mb-1">Click to upload or drag and drop</p>
                        <p className="font-sans text-[10px] text-dim tracking-widest uppercase">Support: PDF, DOC, DOCX (Max 10MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase tracking-widest font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                  Submit Official Nomination
                </button>
                <p className="text-center text-[10px] text-dim mt-4 uppercase tracking-widest font-sans">
                  * By submitting, you agree to the ASAE terms and conditions.
                </p>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-card border border-white/10 p-16 text-center rounded-2xl shadow-2xl"
            >
              <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)] border border-gold/30">
                <CheckCircle2 size={40} className="text-gold" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-ivory mb-4">Nomination Received</h3>
              <p className="font-sans text-dim mb-8 max-w-sm mx-auto leading-relaxed">
                Thank you for your submission. Our vetting committee will review the nominee's credentials and respond within 7 business days.
              </p>
              <button 
                onClick={() => setHasSubmitted(false)}
                className="px-8 py-3 bg-dark border border-white/10 text-ivory font-sans text-xs font-bold tracking-widest uppercase rounded-lg transition-all hover:bg-white/5 hover:border-gold/30"
              >
                Submit Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
