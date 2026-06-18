import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-400 border-b ${
          scrolled 
            ? 'bg-dark/95 backdrop-blur-md py-3 px-6 md:px-12 border-gold/25' 
            : 'bg-gradient-to-b from-dark/95 to-transparent backdrop-blur-[8px] py-5 px-6 md:px-12 border-gold/10'
        }`}
      >
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <img 
              src={asaeLogo} 
              alt="ASAE Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border border-gold/30 shadow-lg shadow-gold/10"
              referrerPolicy="no-referrer"
            />
            <div className="font-serif text-xl tracking-widest text-gold-pale font-bold uppercase leading-none text-left">
              ASAE Awards
              <span className="block font-sans text-[10px] tracking-[0.2em] text-gold/60 mt-1 font-normal uppercase">Excellence Beyond Borders</span>
            </div>
          </div>

          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            {['About', 'Live', 'Nominate', 'Vote', 'Venue', 'FAQ'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className="font-sans text-xs tracking-[2px] uppercase text-ivory/70 hover:text-gold transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <a href="#vote" className="px-6 py-2.5 bg-gradient-to-br from-gold to-gold-light text-dark font-display text-xs tracking-[2px] font-bold transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(201,162,39,0.5)] [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]">
              Vote Now
            </a>
            <a href="#tickets" className="px-6 py-2.5 bg-transparent border border-gold/50 text-gold font-display text-xs tracking-[2px] transition-all hover:bg-gold/10 hover:border-gold">
              Buy Tickets
            </a>
          </div>

          <button 
            className="lg:hidden text-gold focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col"
          >
            <ul className="flex flex-col gap-6 text-center mt-10">
              {['About', 'Live', 'Nominate', 'Vote', 'Venue', 'FAQ'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-xl tracking-[4px] uppercase text-ivory/80 hover:text-gold transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-4">
               <a href="#vote" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-6 py-4 bg-gradient-to-br from-gold to-gold-light text-dark font-display text-sm tracking-[2px] font-bold">
                Vote Now
              </a>
              <a href="#tickets" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-6 py-4 bg-transparent border border-gold/50 text-gold font-display text-sm tracking-[2px]">
                Buy Tickets
              </a>
            </div>
            <button 
              className="absolute top-6 right-6 text-gold focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
