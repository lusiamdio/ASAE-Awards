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

  const ticketPackages = [
    {
      id: 'student',
      name: 'Student Delegate',
      price: 'R500',
      description: 'Undergraduate/Postgraduate individuals',
      benefits: [
        'Access to Plenary Address',
        'Academic Networking Hub',
        'Digital Certificate of Attendance',
        'Exhibition Area Pass'
      ],
      isPopular: false,
      ctaLabel: 'BOOK STUDENT TICKET',
      isEnquiry: false
    },
    {
      id: 'professional',
      name: 'Professional Delegate',
      price: 'R2,500',
      description: 'Individual professional practitioner',
      benefits: [
        'Full 3-Day Plenary & Workshops',
        'Welcome Cocktails Invitation',
        'Earn CPD Points Certificate',
        'Sovereign Trade Materials Packet'
      ],
      isPopular: true,
      ctaLabel: 'BOOK PROFESSIONAL TICKET',
      isEnquiry: false
    },
    {
      id: 'vip',
      name: 'VIP Delegate',
      price: 'R5,000',
      description: 'Outside Africa / Executive access and lounge privileges',
      benefits: [
        'Bilateral Executive Lounge Pass',
        'Fast-Track Registry Privileges',
        'VIP Seating at General Sessions',
        'Sponsorship Gala Networking Dinner'
      ],
      isPopular: false,
      ctaLabel: 'BOOK VIP DELEGATE TICKET',
      isEnquiry: false
    },
    {
      id: 'virtual',
      name: 'Virtual Delegate',
      price: 'R1,500',
      description: 'Online attendance with access to full live streams',
      benefits: [
        'Real-time Plenary Streams',
        'Virtual Breakout Interactivity',
        'PDF Package Presentation slides',
        'Digital Delegate Entry Badge'
      ],
      isPopular: false,
      ctaLabel: 'BOOK VIRTUAL TICKET',
      isEnquiry: false
    },
    {
      id: 'corporate',
      name: 'Corporate Table',
      price: 'R45,000',
      description: 'Company Representative & delegation (Table of 10)',
      benefits: [
        '10 × All-Access VIP Passes',
        'Corporate Profile Panel Banner',
        'Guaranteed Premier Seating Table',
        'Company Logo in Summit brochure'
      ],
      isPopular: false,
      ctaLabel: 'ENQUIRE NOW',
      isEnquiry: true
    }
  ];

  return (
    <section className="bg-dark py-24 px-6 md:px-12 border-t border-white/5" id="tickets">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <div className="font-sans text-[10px] tracking-[5px] uppercase text-gold flex items-center justify-center gap-4 mb-5">
            <span className="w-8 h-px bg-gold"></span>
            Access
            <span className="w-8 h-px bg-gold"></span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.15]">
            Ticket <span className="text-gold">Packages</span>
          </h2>
          <p className="text-sm text-dim mt-4 max-w-xl mx-auto leading-relaxed">
            Select the delegate seating tier tailored to your delegation's objectives for the ASAE Sustainability Summit 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {ticketPackages.map((pkg, index) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`flex flex-col justify-between h-full bg-dark-card border rounded-2xl p-6 lg:p-7 shadow-xl relative transition-all ${
                pkg.isPopular ? 'border-gold ring-2 ring-gold/10 scale-[1.02]' : 'border-white/5 hover:border-white/10'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark font-sans text-[8px] tracking-[2px] px-3 py-1 font-bold shadow-md rounded-full uppercase">
                  Featured
                </div>
              )}
              
              <div>
                <div className="font-sans text-[9px] font-bold tracking-[3px] text-gold-pale uppercase mb-3 text-center">
                  {pkg.name}
                </div>
                <div className="text-center mb-5 border-b border-white/5 pb-5">
                  <div className="font-serif text-3xl font-black text-ivory tracking-tight">{pkg.price}</div>
                  <div className="text-[10px] text-dim mt-1 font-mono">{pkg.id === 'corporate' ? 'table of 10' : 'per delegate'}</div>
                </div>
                <p className="text-xs text-dim mb-6 text-center leading-relaxed h-10 line-clamp-2">
                  {pkg.description}
                </p>
                
                <div className="space-y-3.5 mb-8">
                  {pkg.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-ivory/80">
                      <span className="text-gold mt-0.5 shrink-0 font-bold">✓</span>
                      <span className="leading-tight">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {pkg.isEnquiry ? (
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full py-2.5 bg-dark hover:bg-gold/10 border border-gold/30 hover:border-gold rounded-lg text-gold font-sans text-[10px] tracking-[1.5px] font-bold transition-all cursor-pointer"
                  >
                    {pkg.ctaLabel}
                  </button>
                ) : (
                  <button 
                    onClick={() => onBook(pkg.id)}
                    className={`w-full py-2.5 rounded-lg font-sans text-[10px] tracking-[1.5px] font-bold transition-all cursor-pointer ${
                      pkg.isPopular 
                        ? 'bg-gold hover:bg-gold-light text-dark shadow-md shadow-gold/5' 
                        : 'bg-white/5 hover:bg-white/10 text-ivory border border-white/10'
                    }`}
                  >
                    {pkg.ctaLabel}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
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

