import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Mail, Phone, Clock, Shield, FileText, CheckCircle2, 
  MessageSquare, Share2, Scale, Layers, ChevronRight, Copy, Check 
} from 'lucide-react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

type ModalTab = 'media' | 'sponsorship' | 'privacy' | 'terms';

export function Footer() {
  const [activeTab, setActiveTab] = useState<ModalTab | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Awards', href: '#live' },
    { label: 'Nominees', href: '#nominate' },
    { label: 'News & Blogs', href: '#news-portal' },
    { label: 'Sponsors', href: '#news-portal' },
    { label: 'Advertise With Us', href: '#advertise' },
    { label: 'Contact', href: 'mailto:info@asae.co.za' }
  ];

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 3000);
  };

  return (
    <footer className="bg-dark border-t border-white/5 py-20 px-6 md:px-12 relative z-40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Brand */}
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
              Celebrating the outstanding achievements of Angolans living and thriving in between Angola and South Africa — and inspiring the next generation of Pan-African leaders.
            </p>
          </div>
          
          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-sans font-bold text-[10px] tracking-[3px] uppercase text-gold mb-6">Navigate</h4>
            <div className="flex flex-col gap-3">
              {navLinks.map(link => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="font-sans text-sm text-ivory/50 hover:text-gold transition-colors block w-fit"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Custom Enquiry Access */}
          <div>
            <h4 className="font-sans font-bold text-[10px] tracking-[3px] uppercase text-gold mb-6">Company & Legal</h4>
            <div className="flex flex-col gap-3 font-sans text-sm text-ivory/50">
              <a 
                href="#media"
                className="hover:text-gold text-left transition-colors font-sans text-sm w-fit cursor-pointer"
              >
                Media & Press
              </a>
              <a 
                href="#sponsorship"
                className="hover:text-gold text-left transition-colors font-sans text-sm w-fit cursor-pointer"
              >
                Sponsorship Team
              </a>
              <a 
                href="#privacy"
                className="hover:text-gold text-left transition-colors font-sans text-sm w-fit cursor-pointer"
              >
                Privacy Policy
              </a>
              <a 
                href="#terms"
                className="hover:text-gold text-left transition-colors font-sans text-sm w-fit cursor-pointer"
              >
                Terms of Service
              </a>
            </div>
          </div>

          {/* Column 4: Newsletter */}
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

        {/* Footer Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-ivory/40">
            © 2026 ASAE Awards. All rights reserved. | {''}
            <a 
              href="#privacy" 
              className="hover:text-gold transition-colors cursor-pointer"
            >
              Privacy Policy
            </a>
            {' '} | {' '}
            <a 
              href="#terms" 
              className="hover:text-gold transition-colors cursor-pointer"
            >
              Terms of Service
            </a>
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

