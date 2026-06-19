import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Share2, Layers, Shield, FileText, Mail, 
  Clock, MessageSquare, Copy, Check, Info, Sparkles, AlertTriangle
} from 'lucide-react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

export type PageTab = 'media' | 'sponsorship' | 'privacy' | 'terms';

interface CompanyPageProps {
  initialTab: PageTab;
  onNavigateHome: () => void;
}

export function CompanyPage({ initialTab, onNavigateHome }: CompanyPageProps) {
  const [activeTab, setActiveTab] = useState<PageTab>(initialTab);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(identifier);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const navItems = [
    { id: 'media', label: 'Media & Press', icon: Share2, desc: 'Press Advisory and Media Liaison Desk' },
    { id: 'sponsorship', label: 'Sponsorship Team', icon: Layers, desc: 'Corporate Partnerships and Plenary Branding' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, desc: 'Information Privacy and Data Sovereignty' },
    { id: 'terms', label: 'Terms of Service', icon: FileText, desc: 'Institutional Legal Pacts and Entry Bylaws' }
  ] as const;

  const updateHashAndTab = (tab: PageTab) => {
    setActiveTab(tab);
    window.location.hash = `#${tab}`;
  };

  return (
    <div className="min-h-screen bg-dark text-ivory flex flex-col selection:bg-gold/30 selection:text-white">
      {/* Dynamic SADC & Flag color accent top strip */}
      <div className="h-[4px] w-full bg-gradient-to-r from-angola-red via-gold to-sa-green sticky top-0 z-50 shadow-md" />

      {/* Main navigation header */}
      <header className="border-b border-white/5 bg-dark/90 backdrop-blur-md sticky top-[4px] z-40 transition-all">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={asaeLogo} 
              alt="ASAE Logo" 
              className="w-10 h-10 object-cover rounded-full border border-gold/30"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <span className="font-serif text-lg font-bold tracking-wider text-gold block leading-none">ASAE Awards 2026</span>
              <span className="font-sans text-[9px] tracking-widest text-gold-pale/50 uppercase block mt-1">Official Document Repository</span>
            </div>
          </div>

          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-xs font-bold font-sans tracking-wider hover:border-gold hover:text-gold hover:bg-gold/5 transition-all cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            BACK TO HOME
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR NAVIGATION - Left 4 Columns */}
          <section className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-6">
              
              {/* Back to Home card */}
              <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl">
                <h3 className="font-serif text-base font-bold text-gold-pale mb-2">ASAE Information Centre</h3>
                <p className="text-xs text-dim leading-relaxed mb-4">
                  Welcome to our global communications desk. Access verified advisory releases, partner profiles, privacy provisions, and formal legal bounds.
                </p>
                <button 
                  onClick={onNavigateHome}
                  className="w-full py-3 bg-white/5 hover:bg-gold hover:text-dark text-xs font-bold tracking-wider rounded-lg border border-white/10 hover:border-gold transition-all text-center cursor-pointer font-sans"
                >
                  RETURN TO MAIN PORTAL
                </button>
              </div>

              {/* Sidebar Tabs */}
              <div className="bg-dark-card border border-white/5 rounded-2xl p-3 shadow-xl space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateHashAndTab(item.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-gold border-gold text-dark shadow-lg shadow-gold/10' 
                          : 'border-transparent text-dim hover:text-ivory hover:bg-white/5 hover:border-white/5'
                      }`}
                    >
                      <Icon size={18} className={`shrink-0 mt-0.5 ${isSelected ? 'text-dark' : 'text-gold'}`} />
                      <div>
                        <span className={`block font-serif text-sm font-bold ${isSelected ? 'text-dark font-black' : 'text-ivory'}`}>
                          {item.label}
                        </span>
                        <span className={`block text-[10px] ${isSelected ? 'text-dark/70 font-medium' : 'text-dim'} mt-0.5 leading-tight`}>
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Security Seal */}
              <div className="p-4 rounded-xl bg-gold/5 border border-gold/15 flex items-start gap-3">
                <Sparkles size={16} className="text-gold shrink-0 mt-0.5 animate-pulse" />
                <div className="text-left font-mono text-[9px] text-gold-pale/70 leading-relaxed">
                  <span className="font-bold text-gold block mb-1">OFFICIAL PUBLICATION SEAL</span>
                  Verified secure transmission hashes are finalized and signed under public SADC corporate registry guidelines.
                </div>
              </div>

            </div>
          </section>

          {/* MAIN DOCUMENT VIEW - Right 8 Columns */}
          <section className="lg:col-span-8 bg-dark-card border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl relative">
            {/* Top design accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/30 to-transparent" />

            <div className="doc-centre-scrollbar overflow-y-auto max-h-[80vh] pr-2">
              
              {/* PAGE 1: MEDIA & PRESS ENQUIRIES */}
              {activeTab === 'media' && (
                <article className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-mono uppercase tracking-wider mb-3">
                      <Share2 size={10} /> Media Advisory Office
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory tracking-wide leading-tight">
                      Media & Press Enquiries
                    </h2>
                    <p className="text-sm text-dim mt-4 leading-relaxed">
                      Welcome to the official Media Centre of the Angola South Africa Awards Excellence. We provide accurate records, press coverage updates, and exclusive releases regarding the continental leadership summits.
                    </p>
                    <p className="text-sm text-dim mt-2 leading-relaxed">
                      We facilitate streamlined engagements for journalists, broadcasters, bloggers, and strategic content creators covering our nominees, winners, and public assemblies.
                    </p>
                  </div>

                  {/* Section 1: Contact Desks */}
                  <div className="p-6 bg-dark border border-white/5 rounded-xl space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gold flex items-center gap-2">
                      <span>📣</span> Media Contact Desks
                    </h3>
                    <p className="text-xs text-ivory/80 leading-relaxed">
                      For interview pitches, photographic clearances, credential requests, or urgent quote briefs, please route messages to:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3 relative group">
                        <Mail className="text-gold shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-[10px] text-dim font-mono block">EMAIL LIASION</span>
                          <span className="text-xs text-ivory font-bold block mt-1">media@angolasawards.org</span>
                        </div>
                        <button 
                          onClick={() => handleCopy('media@angolasawards.org', 'media-email')}
                          className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded hover:text-gold transition-all text-dim cursor-pointer"
                          title="Copy Email"
                        >
                          {copiedText === 'media-email' ? <Check size={12} className="text-sa-green" /> : <Copy size={12} />}
                        </button>
                      </div>

                      <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3 relative">
                        <Clock className="text-gold shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-[10px] text-dim font-mono block">RESPONSE BOUND</span>
                          <span className="text-xs text-ivory font-bold block mt-1">24–48 Hours</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-start gap-3 relative group">
                      <MessageSquare className="text-sa-green shrink-0 mt-0.5" size={16} />
                      <div>
                        <span className="text-[10px] text-dim font-mono block">FAST-TRACK WHATSAPP SECURE SERVICE</span>
                        <span className="text-xs text-ivory font-bold block mt-1">+27 XXX XXX XXXX</span>
                      </div>
                      <button 
                        onClick={() => handleCopy('+27 XXXXXXXXX', 'media-whatsapp')}
                        className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded hover:text-gold transition-all text-dim cursor-pointer"
                        title="Copy Number"
                      >
                        {copiedText === 'media-whatsapp' ? <Check size={12} className="text-sa-green" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Press Resources & Interviews */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3.5">
                      <h3 className="font-serif text-base font-bold text-ivory flex items-center gap-2">
                        <span>📰</span> Press Resources
                      </h3>
                      <p className="text-xs text-dim">Authorized media partners can download:</p>
                      <ul className="space-y-2.5 text-xs text-ivory/80">
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Official Press Releases & Announcements</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> High-Resolution Vector Brand Packs</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Exclusive Award Gala Gallery Clearances</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Plenary Summit transcripts</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3.5">
                      <h3 className="font-serif text-base font-bold text-ivory flex items-center gap-2">
                        <span>🎤</span> Interview Streams
                      </h3>
                      <p className="text-xs text-dim">We arrange structured direct dialogues with:</p>
                      <ul className="space-y-2.5 text-xs text-ivory/80">
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Category Nominees & Final Winners</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> High-Council SADC Plenary Directors</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Keynote Speakers and Economic Experts</li>
                        <li className="flex items-center gap-2"><span className="text-gold">✓</span> Civic and Government Envoys</li>
                      </ul>
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                    <h3 className="font-serif text-sm font-bold text-dim uppercase tracking-wider flex items-center gap-2">
                      <span>⚠️</span> Press Ethics Guidelines
                    </h3>
                    <p className="text-xs text-dim">
                      All media professionals must adhere to official broadcasting codes:
                    </p>
                    <div className="space-y-2.5 text-xs text-ivory/70 pt-1">
                      <p className="flex items-start gap-2">
                        <span className="text-angola-red mt-1">•</span>
                        <span>Credit the entity as: <strong>Angola South Africa Awards Excellence (ASAE)</strong>.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-angola-red mt-1">•</span>
                        <span>Utilize official imagery and logo formats without modification.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-angola-red mt-1">•</span>
                        <span>Maintain ethical codes of factuality and unbiased coverage.</span>
                      </p>
                    </div>
                  </div>
                </article>
              )}

              {/* PAGE 2: SPONSORSHIP TEAM */}
              {activeTab === 'sponsorship' && (
                <article className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-[9px] font-mono uppercase tracking-wider mb-3">
                      <Layers size={10} /> Corporate Partnerships
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory tracking-wide leading-tight">
                      Corporate Sponsorship Team
                    </h2>
                    <p className="text-sm text-dim mt-4 leading-relaxed">
                      Sponsorship of the ASAE Awards represents a pivotal positioning milestone. Align your enterprise with key bilateral executives, regulatory actors, and market leaders in South Africa and Angola.
                    </p>
                    <p className="text-sm text-dim mt-2 leading-relaxed">
                      We offer multifaceted brand packaging that anchors your market presence across physical exhibitions, VIP receptions, digital broadcasts, and publications.
                    </p>
                  </div>

                  {/* Section 1: Tiers */}
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gold flex items-center gap-2">
                      <span>💼</span> Strategic Collaboration Tiers
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { num: '1', title: 'Main Title Lead partner', desc: 'Secure naming rights, paramount positioning, and high-level council seating during the central state banquets.' },
                        { num: '2', title: 'Key Category Sponsor', desc: 'Sponsor dedicated pillars: Bilateral Commerce, Innovative Tech, Energy Infrastructure, or Social Growth.' },
                        { num: '3', title: 'VIP Plenary Reception Sponsor', desc: 'Underwrite high-profile private networking forums, bilateral summits, and executive lounge spaces.' },
                        { num: '4', title: 'Global Broadcast & Digital Sponsor', desc: 'Gain premier logo placement and interactive promos on global live video streams and digital channels.' }
                      ].map(item => (
                        <div key={item.num} className="bg-dark border border-white/5 p-5 rounded-xl space-y-2">
                          <span className="text-[10px] font-mono bg-gold/10 text-gold px-2.5 py-0.5 rounded-full font-bold">LEVEL {item.num}</span>
                          <h4 className="font-serif text-sm font-bold text-ivory pt-1">{item.title}</h4>
                          <p className="text-xs text-dim leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 2: Why Sponsor & Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                      <h3 className="font-serif text-base font-bold text-ivory flex items-center gap-2">
                        <span>🌍</span> Bilateral Value Metrics
                      </h3>
                      <ul className="space-y-2.5 text-xs text-ivory/80 pt-1">
                        <li className="flex items-center gap-2"><span className="text-sa-green">✓</span> Unrivaled exposure in Angola and SA</li>
                        <li className="flex items-center gap-2"><span className="text-sa-green">✓</span> Strategic relationship building in SADC</li>
                        <li className="flex items-center gap-2"><span className="text-sa-green">✓</span> Front-row integration in trade policy forums</li>
                        <li className="flex items-center gap-2"><span className="text-sa-green">✓</span> Robust CSR positioning via support of young leaders</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-dark border border-gold/15 rounded-xl space-y-4">
                      <h3 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                        <span>📩</span> Partnership Contact
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="relative group bg-white/5 p-3.5 rounded border border-white/5">
                          <span className="text-[9px] font-mono text-dim block">DIRECT CORRESPONDENCE</span>
                          <span className="text-xs font-bold text-ivory block mt-0.5">partnerships@angolasawards.org</span>
                          <button 
                            onClick={() => handleCopy('partnerships@angolasawards.org', 'sponsor-email-2')}
                            className="absolute top-2 right-2 p-1 text-dim hover:text-gold transition-colors cursor-pointer"
                          >
                            {copiedText === 'sponsor-email-2' ? <Check size={12} className="text-sa-green" /> : <Copy size={12} />}
                          </button>
                        </div>

                        <div className="bg-white/5 p-3.5 rounded border border-white/5">
                          <span className="text-[9px] font-mono text-dim block">DIRECT OFFICE REGISTRY</span>
                          <span className="text-xs font-bold text-ivory block mt-0.5">+27 XXX XXX XXXX</span>
                        </div>

                        <div className="bg-white/5 p-3.5 rounded border border-white/5">
                          <span className="text-[9px] font-mono text-dim block">SUBJECT PROTOCOL REQUIRED</span>
                          <span className="text-xs font-bold text-gold block mt-0.5">Sponsorship Assembly – ASAE 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* PAGE 3: PRIVACY POLICY */}
              {activeTab === 'privacy' && (
                <article className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-[9px] font-mono uppercase tracking-wider mb-3">
                      <Shield size={10} /> Data Protection Registry
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory tracking-wide leading-tight">
                      Privacy Policy & Statement
                    </h2>
                    <p className="text-sm text-dim mt-4 leading-relaxed">
                      At ASAE, we hold user security, data integrity, and strict information transparency in high regard. This document discloses privacy parameters governing candidate nominations, public ticketing records, and secure voting.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Collect block */}
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                      <h3 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                        <span>📊</span> Data Points Collected
                      </h3>
                      <p className="text-xs text-dim font-sans">We collect select information to preserve voting audits and process secure nominations:</p>
                      <ul className="space-y-2 text-xs text-ivory/80 list-disc list-inside">
                        <li>Legal Name and authentic corporate credentials</li>
                        <li>Organization profiles, positions, and institutional contacts</li>
                        <li>Nominee backing documentation and trade files</li>
                        <li>Necessary session cookies and basic localized telemetry (strictly IP and browser metrics)</li>
                      </ul>
                    </div>

                    {/* Usage block */}
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                      <h3 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                        <span>🎯</span> Policy Utilization Bounds
                      </h3>
                      <ul className="space-y-2 text-xs text-ivory/80 list-disc list-inside col-span-1">
                        <li>Fulfilling audit confirmations for secure public voting results</li>
                        <li>Screening fake, robotic, or duplicated registry votes</li>
                        <li>Distributing critical summit change logs and ticket deliveries</li>
                        <li>Executing trade newsletter deliveries (explicitly opt-in only)</li>
                      </ul>
                    </div>

                    {/* Data Guard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-2">
                        <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-2">
                          <span>🔒</span> Security Cryptography
                        </h4>
                        <p className="text-xs text-dim leading-relaxed">
                          We employ encrypted databases, secure administrative access rights, and standard transmission layers to isolate user logs against unsanctioned leaks or tampering.
                        </p>
                      </div>

                      <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-2">
                        <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-2">
                          <span>🤝</span> Strategic Distribution
                        </h4>
                        <p className="text-xs text-dim leading-relaxed">
                          We do not sell, rent, or distribute candidate pools to marketing aggregators. Select data is transmitted solely to official auditing bodies to validate competition metrics.
                        </p>
                      </div>
                    </div>

                    {/* Cookies */}
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                      <h3 className="font-serif text-sm font-bold text-dim uppercase tracking-wider flex items-center gap-2">
                        <span>🍪</span> Cookie Registry
                      </h3>
                      <p className="text-xs text-dim leading-relaxed">
                        We use minimal operational cookies to persist your session tokens. You can configure or disable analytical trackers within your native web browser preferences at any time.
                      </p>
                    </div>

                    {/* Rights */}
                    <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-3">
                      <h3 className="font-serif text-base font-bold text-gold flex items-center gap-2">
                        <span>📩</span> Statutory Privacy Rights
                      </h3>
                      <p className="text-xs text-dim leading-relaxed">
                        Under regional SADC protections, you retain absolute authority to check, update, redact, or request complete removal of your personal and professional profile details immediately.
                      </p>
                    </div>

                    {/* Contact Desk */}
                    <div className="p-5 bg-dark-card border border-white/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-ivory">📬 Compliance Officer Desk</h4>
                        <p className="text-[10px] font-mono text-dim mt-0.5">COMPLIANCE REVIEW OFFICIAL REPRESENTATIVE</p>
                      </div>
                      <div className="flex items-center gap-3 bg-dark border border-white/5 px-4 py-3 rounded group relative">
                        <Mail size={14} className="text-gold shrink-0" />
                        <span className="text-xs font-bold text-ivory">privacy@angolasawards.org</span>
                        <button 
                          onClick={() => handleCopy('privacy@angolasawards.org', 'privacy-email-2')}
                          className="p-1 hover:text-gold transition-colors text-dim cursor-pointer ml-3"
                        >
                          {copiedText === 'privacy-email-2' ? <Check size={12} className="text-sa-green" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* PAGE 4: TERMS OF SERVICE */}
              {activeTab === 'terms' && (
                <article className="space-y-8 animate-fadeIn">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sa-green/10 text-sa-green rounded-full text-[9px] font-mono uppercase tracking-wider mb-3">
                      <FileText size={10} /> Institutional Legal Pact
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-ivory tracking-wide leading-tight">
                      Terms of Service
                    </h2>
                    <p className="text-sm text-dim mt-4 leading-relaxed">
                      By accessing, utilizing, voting on, or submitting candidacy files to the Angola South Africa Awards Excellence, you confirm complete acceptance of this legal accord. Please read all terms carefully.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-dark border border-white/5 rounded-xl space-y-2">
                        <span className="font-serif font-bold text-sm text-gold flex items-center gap-1.5">
                          <span>🧾</span> Web Conduct
                        </span>
                        <p className="text-[11px] text-dim leading-relaxed">
                          You agree to use this portal lawfully, avoiding fraudulent submissions, DDoS attempts, or bot-driven synthetic voting loops.
                        </p>
                      </div>

                      <div className="p-4 bg-dark border border-white/5 rounded-xl space-y-2">
                        <span className="font-serif font-bold text-sm text-gold flex items-center gap-1.5">
                          <span>🏆</span> Candidates
                        </span>
                        <p className="text-[11px] text-dim leading-relaxed">
                          Nominee files must represent genuine, verifiable events. False claims are subject to immediate council disqualification.
                        </p>
                      </div>

                      <div className="p-4 bg-dark border border-white/5 rounded-xl space-y-2">
                        <span className="font-serif font-bold text-sm text-gold flex items-center gap-1.5">
                          <span>🎟️</span> Event Admission
                        </span>
                        <p className="text-[11px] text-dim leading-relaxed">
                          Summit tickets are subject to vetting. Valid identification must match physical credentials at central event entry terminals.
                        </p>
                      </div>
                    </div>

                    {/* Intellectual Property */}
                    <div className="p-5 bg-dark border border-gold/10 rounded-xl space-y-2">
                      <h4 className="font-serif text-sm font-bold text-ivory flex items-center gap-1.5">
                        <span>📢</span> Intellectual Property Protect
                      </h4>
                      <p className="text-xs text-dim leading-relaxed">
                        All associated systems, logos, digital assets, video files, live feeds, text layouts, and database schemas belong exclusively to ASAE. Unauthorized duplication or framing of this source code is strictly prohibited.
                      </p>
                    </div>

                    {/* Liability */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-2">
                        <h4 className="font-serif text-xs font-bold text-dim uppercase tracking-wider flex items-center gap-1.5">
                          <span>⚠️</span> Limitation of Liability
                        </h4>
                        <p className="text-xs text-dim leading-relaxed">
                          We do not accept liability for accidental internet outages, hardware latency, data processing errors, or third-party web interface discrepancies.
                        </p>
                      </div>

                      <div className="p-5 bg-dark border border-white/5 rounded-xl space-y-2">
                        <h4 className="font-serif text-xs font-bold text-dim uppercase tracking-wider flex items-center gap-1.5">
                          <span>🔄</span> Pact Revisions
                        </h4>
                        <p className="text-xs text-dim leading-relaxed">
                          The ASAE executive council holds individual rights to update these service terms. Continued portal usage signals agreement to modified revisions.
                        </p>
                      </div>
                    </div>

                    {/* Contact desk */}
                    <div className="p-5 bg-dark-card border border-white/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-ivory">📩 Legal Advisory Desk</h4>
                        <p className="text-[10px] font-mono text-dim mt-0.5">FORMAL LEGAL COMPLIANCE INQUIRIES ONLY</p>
                      </div>
                      <div className="flex items-center gap-3 bg-dark border border-white/5 px-4 py-3 rounded group relative">
                        <Mail size={14} className="text-gold shrink-0" />
                        <span className="text-xs font-bold text-ivory">legal@angolasawards.org</span>
                        <button 
                          onClick={() => handleCopy('legal@angolasawards.org', 'legal-email-2')}
                          className="p-1 hover:text-gold transition-colors text-dim cursor-pointer ml-3"
                        >
                          {copiedText === 'legal-email-2' ? <Check size={12} className="text-sa-green" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              )}

            </div>
          </section>

        </div>
      </main>

      {/* Simplified, elegant, static document footer */}
      <footer className="border-t border-white/5 bg-dark-card py-10 px-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans text-dim">
          <p>© 2026 Angola South Africa Awards Excellence. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => updateHashAndTab('privacy')} className="hover:text-gold transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => updateHashAndTab('terms')} className="hover:text-gold transition-colors cursor-pointer">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
