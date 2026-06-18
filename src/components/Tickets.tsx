import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Check, Copy, X, ExternalLink } from 'lucide-react';

interface TicketsProps {
  onBook: (category: string) => void;
}

export function Tickets({ onBook }: TicketsProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailTarget = 'simao@neurogrowthlabs.co.za';
  const emailSubject = 'ASAE Sustainability Summit 2026 - Corporate Table Reservation';
  const emailBody = `Dear ASAE Team,

I am interested in reserving a Corporate Table (Table of 10) for the ASAE Sustainability Summit 2026. Please send us the booking invoice and delegation forms.

Thank you.

Kind regards,`;

  // Encode values for URLs
  const encodedTo = encodeURIComponent(emailTarget);
  const encodedSubject = encodeURIComponent(emailSubject);
  const encodedBody = encodeURIComponent(emailBody);

  // Link preps
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  const outlookLink = `https://outlook.office.com/mail/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
  const defaultMailto = `mailto:${emailTarget}?subject=${encodedSubject}&body=${encodedBody}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailTarget);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="bg-dark py-24 px-6 md:px-12 border-t border-white/5" id="tickets">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
           <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Access
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15]">
            Ticket <span className="text-gold">Packages</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-2">
          {/* General */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-dark border border-white/5 p-10 lg:p-12 text-center rounded-2xl shadow-xl"
          >
            <div className="font-sans text-[10px] font-bold tracking-[3px] text-dim mb-5">GENERAL</div>
            <div className="font-serif text-4xl lg:text-5xl font-black text-ivory leading-none">R2,500</div>
            <div className="text-sm text-dim mt-2 mb-10">per person</div>
            
            <div className="text-left space-y-4 mb-10">
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ Awards Ceremony</div>
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ Welcome Cocktails</div>
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ Gala Dinner</div>
              <div className="pb-3 text-sm text-ivory/25">✗ VIP Lounge Access</div>
            </div>
            
            <button 
              onClick={() => onBook('professional')}
              className="w-full px-6 py-3 border border-white/10 rounded-lg text-gold font-sans text-xs font-bold tracking-[2px] transition-all hover:bg-gold/10 hover:border-gold cursor-pointer"
            >
              BOOK TICKET
            </button>
          </motion.div>

          {/* VIP */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-dark-card border-2 border-gold p-10 lg:p-12 text-center relative z-10 md:scale-[1.05] shadow-2xl rounded-2xl"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark font-sans text-[9px] tracking-[2px] px-4 py-1.5 font-bold shadow-lg rounded-full">MOST POPULAR</div>
            <div className="font-sans text-[10px] font-bold tracking-[3px] text-gold mb-5">VIP</div>
            <div className="font-serif text-4xl lg:text-5xl font-black text-gold leading-none">R6,500</div>
            <div className="text-sm text-gold/60 mt-2 mb-10">per person</div>
            
            <div className="text-left space-y-4 mb-10">
              <div className="pb-3 border-b border-gold/10 text-sm text-ivory/80">✓ All General Access</div>
              <div className="pb-3 border-b border-gold/10 text-sm text-ivory/80">✓ VIP Lounge Access</div>
              <div className="pb-3 border-b border-gold/10 text-sm text-ivory/80">✓ Premium Seating</div>
              <div className="pb-3 text-sm text-ivory/80">✓ Networking Breakfast</div>
            </div>
            
            <button 
              onClick={() => onBook('vip')}
              className="w-full px-6 py-3.5 bg-gold hover:bg-gold-light rounded-lg text-dark font-sans text-xs tracking-[2px] font-bold transition-all shadow-lg cursor-pointer"
            >
              BOOK VIP
            </button>
          </motion.div>

           {/* Corporate */}
           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-dark border border-white/5 p-10 lg:p-12 text-center rounded-2xl shadow-xl"
          >
            <div className="font-sans text-[10px] tracking-[3px] font-bold text-dim mb-5">CORPORATE TABLE</div>
            <div className="font-serif text-4xl lg:text-5xl font-black text-ivory leading-none">R45,000</div>
            <div className="text-sm text-dim mt-2 mb-10">table of 10</div>
            
            <div className="text-left space-y-4 mb-10">
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ 10 VIP Seats</div>
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ Branded Table</div>
              <div className="pb-3 border-b border-ivory/5 text-sm text-ivory/60">✓ Speaking Opportunity</div>
              <div className="pb-3 text-sm text-ivory/60">✓ Media Coverage</div>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              className="block w-full text-center px-6 py-3 border border-white/10 rounded-lg text-gold font-sans text-xs tracking-[2px] font-bold transition-all hover:bg-gold/10 hover:border-gold cursor-pointer"
            >
              ENQUIRE NOW
            </button>
          </motion.div>

        </div>
      </div>

      {/* Choose Email client option modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/90 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-dim hover:text-ivory transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ivory tracking-wide">Corporate Table Seating</h3>
                <p className="text-xs text-dim mt-2 max-w-sm mx-auto leading-relaxed">
                  Submit booking enquiry for Corporate Table seating tiers directly to <strong className="text-gold-pale">{emailTarget}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <a 
                  href={gmailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-dark border border-white/5 hover:border-gold/30 rounded-xl hover:bg-white/5 transition-all text-ivory group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EA4335] shrink-0" />
                    <div>
                      <span className="font-serif text-sm font-bold block">Draft in Gmail Web</span>
                      <span className="text-[10px] text-dim block mt-0.5">Launches secure custom message form</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-dim group-hover:text-gold transition-colors" />
                </a>

                <a 
                  href={outlookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-dark border border-white/5 hover:border-gold/30 rounded-xl hover:bg-white/5 transition-all text-ivory group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0078D4] shrink-0" />
                    <div>
                      <span className="font-serif text-sm font-bold block">Draft in Outlook Web</span>
                      <span className="text-[10px] text-dim block mt-0.5">Redirects to Microsoft Outlook Webmail</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-dim group-hover:text-gold transition-colors" />
                </a>

                <a 
                  href={defaultMailto}
                  className="flex items-center justify-between p-4 bg-dark border border-white/5 hover:border-gold/30 rounded-xl hover:bg-white/5 transition-all text-ivory group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-sa-green shrink-0" />
                    <div>
                      <span className="font-serif text-sm font-bold block">System Email Client</span>
                      <span className="text-[10px] text-dim block mt-0.5">Triggers standard mail app (Apple Mail / Win)</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-dim group-hover:text-gold transition-colors" />
                </a>

                <button 
                  onClick={handleCopyEmail}
                  className="w-full flex items-center justify-between p-4 bg-dark border border-white/5 hover:border-gold/30 rounded-xl hover:bg-white/5 transition-all text-left text-ivory cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <div>
                      <span className="font-serif text-sm font-bold block">Copy Email Address</span>
                      <span className="text-[10px] text-dim block mt-0.5">{emailTarget}</span>
                    </div>
                  </div>
                  {copied ? (
                    <Check className="w-4 h-4 text-sa-green" />
                  ) : (
                    <Copy className="w-4 h-4 text-dim hover:text-gold transition-colors" />
                  )}
                </button>
              </div>

              {copied && (
                <p className="text-center text-[10px] font-mono text-sa-green mt-4 animate-pulse uppercase tracking-wider">
                  ✓ Copied email destination safely to Clipboard!
                </p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

