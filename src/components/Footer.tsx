import React from 'react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

export function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5 py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={asaeLogo} 
                alt="ASAE Logo" 
                className="w-12 h-12 object-cover rounded-full border border-gold/30 shadow-lg shadow-gold/10"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-serif text-xl font-bold tracking-widest text-gold leading-none uppercase">ASAE Awards</h3>
                <div className="font-serif italic text-[11px] text-ivory/40 uppercase mt-1">Excellence Beyond Borders</div>
              </div>
            </div>
            <p className="font-sans text-sm leading-relaxed text-ivory/50">
              Celebrating the outstanding achievements of Angolans living and thriving in South Africa — and inspiring the next generation of Pan-African leaders.
            </p>
          </div>
          
          <div>
            <h4 className="font-sans font-bold text-[10px] tracking-[3px] uppercase text-gold mb-6">Navigate</h4>
            <div className="flex flex-col gap-3">
              {['About ASAE', 'Conference', 'Award Categories', 'Nominate', 'Partners', 'Tickets'].map(link => (
                <a key={link} href="#" className="font-sans text-sm text-ivory/50 hover:text-gold transition-colors">{link}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold text-[10px] tracking-[3px] uppercase text-gold mb-6">Contact</h4>
            <div className="flex flex-col gap-3 font-sans text-sm text-ivory/50">
              <a href="mailto:info@asae.co.za" className="hover:text-gold transition-colors">info@asae.co.za</a>
              <span>Johannesburg, South Africa</span>
              <a href="#" className="hover:text-gold transition-colors">Media Enquiries</a>
              <a href="#" className="hover:text-gold transition-colors">Sponsorship Team</a>
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold text-[10px] tracking-[3px] uppercase text-gold mb-6">Newsletter</h4>
            <p className="font-sans text-sm text-ivory/50 mb-4 tracking-wide">
              Get exclusive updates, speaker announcements, and early access.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-ivory/5 border border-r-0 border-white/10 px-4 py-3 outline-none text-sm text-ivory w-full focus:border-gold transition-colors rounded-l-lg"
              />
              <button className="bg-gold hover:bg-gold-light text-dark font-sans font-bold text-[10px] tracking-[2px] px-5 transition-colors rounded-r-lg">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-ivory/40">
            © 2026 ASAE Awards. All rights reserved. | Privacy Policy | Terms
          </p>
          <div className="flex gap-4">
            {['in', '𝕏', 'f', '▶'].map(social => (
              <a key={social} href="#" className="w-9 h-9 border border-white/10 rounded flex items-center justify-center text-gold/60 font-sans text-sm hover:border-gold hover:text-gold hover:bg-gold/10 transition-all">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
