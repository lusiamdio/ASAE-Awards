import { motion } from 'motion/react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" id="home">
      {/* Background with Angola/SA Theme gradients */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-angola-red to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sa-green to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold/5 rounded-full"></div>
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(0deg,transparent,transparent_80px,rgba(245,158,11,0.5)_80px,rgba(245,158,11,0.5)_81px),repeating-linear-gradient(90deg,transparent,transparent_80px,rgba(245,158,11,0.5)_80px,rgba(245,158,11,0.5)_81px)]"></div>

      <div className="relative z-10 text-center max-w-4xl px-8 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mb-6"
        >
          <img 
            src={asaeLogo} 
            alt="ASAE Awards Logo" 
            className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-2 border-gold/40 shadow-2xl shadow-gold/20"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-[12px] font-bold tracking-[0.3em] uppercase text-gold flex items-center justify-center gap-4 mb-8 w-full"
        >
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-gold"></span>
          Cape Town · 2026
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-gold"></span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem] leading-[1.15] mb-6 max-w-5xl"
        >
          <span className="block text-ivory">Celebrating Angolan</span>
          <span className="block bg-gradient-to-r from-gold-pale to-gold bg-clip-text text-transparent pb-2">
            Excellence in South Africa
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-sans text-sm md:text-base leading-relaxed text-dim max-w-xl mx-auto mt-7 mb-12"
        >
          A premier leadership conference and awards ceremony honoring impact, innovation, and leadership across the Angolan diaspora.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a href="#vote" className="px-10 py-4 bg-gradient-to-br from-gold to-gold-light text-dark font-display text-xs tracking-[3px] font-bold transition-all hover:shadow-[0_8px_40px_rgba(201,162,39,0.6)] hover:-translate-y-0.5 [clip-path:polygon(12px_0%,100%_0%,calc(100%-12px)_100%,0%_100%)]">
            VOTING PORTAL
          </a>
          <a href="#gallery" className="px-10 py-4 bg-transparent border border-ivory/30 text-ivory font-display text-xs tracking-[3px] transition-all hover:border-gold hover:text-gold">
            VIEW HALL OF FAME
          </a>
        </motion.div>
      </div>
    </section>
  );
}
