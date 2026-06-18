import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  X, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Building, 
  Briefcase, 
  IdCard, 
  Coffee, 
  Upload, 
  ArrowLeft, 
  ArrowRight, 
  CreditCard,
  QrCode,
  Calendar,
  Ticket,
  Clock,
  Download,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Percent,
  Search,
  BookOpen
} from 'lucide-react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';

interface Category {
  id: string;
  name: string;
  description: string;
  priceZar: number;
  priceUsd: number;
}

const CATEGORIES: Category[] = [
  { id: 'student', name: 'Student Delegate', description: 'Undergraduate/Postgraduate individuals', priceZar: 500, priceUsd: 30 },
  { id: 'professional', name: 'Professional Delegate', description: 'Individual professional practitioner', priceZar: 2500, priceUsd: 150 },
  { id: 'corporate', name: 'Corporate Table', description: 'Company Representative & delegation (Table of 10)', priceZar: 45000, priceUsd: 2600 },
  { id: 'vip', name: 'VIP Delegate', description: 'Outside Africa / Executive access and lounge privileges', priceZar: 45000, priceUsd: 2600 },
  { id: 'virtual', name: 'Virtual Delegate', description: 'Online attendance with access to full live streams', priceZar: 1500, priceUsd: 90 },
];

interface RegistrationWizardProps {
  initialCategory?: string; // matching 'student' | 'professional' | 'corporate' | 'vip' | 'virtual'
  onClose: () => void;
}

export function RegistrationWizard({ initialCategory, onClose }: RegistrationWizardProps) {
  // Wizard state: 1, 2, 3, 4, 5 (Dashboard)
  const [step, setStep] = useState<number>(1);
  const [selectedCatId, setSelectedCatId] = useState<string>('professional');

  // Step 2 Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('South Africa');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [passportId, setPassportId] = useState('');
  const [diet, setDiet] = useState('None');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [profilePicName, setProfilePicName] = useState<string>('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'momo' | 'intel'>('card');
  const [processingState, setProcessingState] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Bank Transfer states
  const [popFile, setPopFile] = useState<string | null>(null);
  const [popFileName, setPopFileName] = useState('');

  // Mobile Money states
  const [momoCountry, setMomoCountry] = useState('South Africa');
  const [momoProvider, setMomoProvider] = useState('MTN MoMo');
  const [momoPhone, setMomoPhone] = useState('');

  // Credit Card details
  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [ccName, setCcName] = useState('');

  // Created IDs for success rendering
  const [transactionId, setTransactionId] = useState('');
  const [delegateId, setDelegateId] = useState('');
  const [receiptDate, setReceiptDate] = useState('');

  // Dashboard Tab state
  const [dashboardTab, setDashboardTab] = useState<'my-registration' | 'sessions' | 'certificates'>('my-registration');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [cpdUnlocked, setCpdUnlocked] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const popFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Category on Mount
  useEffect(() => {
    if (initialCategory) {
      const normalized = initialCategory.toLowerCase();
      if (normalized.includes('vip')) {
        setSelectedCatId('vip');
      } else if (normalized.includes('corporate')) {
        setSelectedCatId('corporate');
      } else if (normalized.includes('student')) {
        setSelectedCatId('student');
      } else if (normalized.includes('virtual')) {
        setSelectedCatId('virtual');
      } else {
        setSelectedCatId('professional');
      }
    }
  }, [initialCategory]);

  const selectedCategory = CATEGORIES.find(c => c.id === selectedCatId) || CATEGORIES[1];

  // Random generator on success
  const handlePaymentSuccess = (confirmedStatus: 'Paid' | 'Pending') => {
    const txn = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const del = 'DEL-' + Math.floor(1000 + Math.random() * 9000);
    setTransactionId(txn);
    setDelegateId(del);
    setReceiptDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

    // Persist to local storage so AdminDashboard can list it dynamically
    const newTransaction = {
      id: txn,
      entity: `${firstName} ${lastName}`,
      type: selectedCategory.name,
      amount: selectedCategory.priceZar,
      date: new Date().toISOString().substring(0, 10),
      status: confirmedStatus === 'Paid' ? 'Completed' : 'Pending',
      tier: selectedCatId === 'vip' ? 'Platinum' : selectedCatId === 'corporate' ? 'Gold' : 'Member',
      country: country,
      delegateId: del,
      email: email
    };

    try {
      const existingTxnsStr = localStorage.getItem('asae_transactions') || '[]';
      const existingTxns = JSON.parse(existingTxnsStr);
      localStorage.setItem('asae_transactions', JSON.stringify([newTransaction, ...existingTxns]));
    } catch (err) {
      console.error('Failed to persist transaction', err);
    }

    setStep(5); // Success state page
  };

  const startStripeFlow = () => {
    if (!ccNumber || !ccExpiry || !ccCvv || !ccName) {
      alert('Please fill out all credit card credentials.');
      return;
    }
    setIsProcessing(true);
    const states = [
      'Creating Secure Checkout Intent...',
      'Redirecting to ISO 3D Secure Webhook...',
      'Verifying Card Limit & Multi-Gateway Route...',
      'Completing Bank Authentication Plenary...',
      'Payment Processed Successfully!'
    ];

    let current = 0;
    setProcessingState(states[0]);

    const interval = setInterval(() => {
      current++;
      if (current < states.length) {
        setProcessingState(states[current]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        handlePaymentSuccess('Paid');
      }
    }, 1300);
  };

  const startMomoFlow = () => {
    if (!momoPhone) {
      alert('Please input your Mobile Money registration telephone contact.');
      return;
    }
    setIsProcessing(true);
    const states = [
      `Initializing STK Push via ${momoProvider} Network...`,
      'Awaiting network Handshake Confirmation...',
      'User PIN requested on Mobile Device...',
      'Validating ledger ledger ledger...',
      'Mobile Wallet payment confirmed!'
    ];

    let current = 0;
    setProcessingState(states[0]);

    const interval = setInterval(() => {
      current++;
      if (current < states.length) {
        setProcessingState(states[current]);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        handlePaymentSuccess('Paid');
      }
    }, 1300);
  };

  const handInBankPop = () => {
    if (!popFile) {
      alert('Please compile and upload your formal EFT bank voucher/POP image first.');
      return;
    }
    setIsProcessing(true);
    setProcessingState('Uploading Transaction Voucher payload...');
    setTimeout(() => {
      setIsProcessing(false);
      handlePaymentSuccess('Pending');
    }, 1500);
  };

  const proceedToSummary = () => {
    if (!firstName || !lastName || !email || !mobile || !organization || !position || !passportId) {
      alert('Please populate all the mandated fields.');
      return;
    }
    setStep(3);
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setProfilePic(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPopFileName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPopFile(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMomoCountryChange = (c: string) => {
    setMomoCountry(c);
    const provs: Record<string, string[]> = {
      'South Africa': ['MTN MoMo', 'Vodacom m-pesa'],
      'Kenya': ['Safaricom M-Pesa', 'Airtel Money'],
      'Ghana': ['MTN MoMo', 'Vodafone Cash'],
      'Uganda': ['MTN MoMo', 'Airtel Money'],
      'Angola': ['BayQi Wallet', 'Unitel Money']
    };
    setMomoProvider(provs[c]?.[0] || 'MTN MoMo');
  };

  // Agenda list
  const SESSIONS = [
    { id: 's1', day: 'Day 1', time: '09:00 - 10:30', title: 'Plenary Address: Sustainable SADC Industrial Pipelines', location: 'Grand Ballroom A' },
    { id: 's2', day: 'Day 1', time: '11:00 - 12:30', title: 'Panel Discussion: Angolan Infrastructure Investment Outlook 2026', location: 'Meeting Room 4' },
    { id: 's3', day: 'Day 1', time: '14:00 - 15:30', title: 'Workshop: Digital Remittance & Cross-Border Compliance Protocols', location: 'Tech Annex B' },
    { id: 's4', day: 'Day 2', time: '09:00 - 11:00', title: 'Keynote Panel: Financing Green Energy Projects in Southern Africa', location: 'Grand Ballroom A' },
    { id: 's5', day: 'Day 2', time: '11:30 - 13:00', title: 'Workshop: Bilateral Trade Opportunities SA & Angola', location: 'Conference Hall C' },
    { id: 's6', day: 'Day 2', time: '14:30 - 16:00', title: 'Roundtable: Technological Cooperation and STEM Mentorship Programs', location: 'Meeting Room 2' },
    { id: 's7', day: 'Day 3', time: '10:00 - 12:00', title: 'Workshop Academic Focus: Undergraduate Tech Innovation Proposals', location: 'Tech Annex B' }
  ];

  const handleToggleSession = (id: string) => {
    setSelectedSessions(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CPD Certification Quiz
  const QUIZ_QUESTIONS = [
    {
      q: 'Which treaty governs regional trading and regulatory compliance within the SADC?',
      options: ['Southern African Development Community Trade Protocol', 'Lome Convention', 'AfCFTA Tariffs Code', 'Southern Atlantic Commerce Treaty'],
      answer: 'Southern African Development Community Trade Protocol'
    },
    {
      q: 'What is the primary bilateral trade focus areas highlighted inside the 2026 ASAE Plenary?',
      options: ['Agricultural exports and steel pipelines', 'Sustainable investment, energy transition, and tech integration', 'Deep ocean marine mining registries', 'Aviation airspace deregulation'],
      answer: 'Sustainable investment, energy transition, and tech integration'
    }
  ];

  const submitQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answer) score++;
    });
    setQuizScore(score);
    if (score === QUIZ_QUESTIONS.length) {
      setCpdUnlocked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/95 backdrop-blur-md flex items-center justify-center p-4">
      {/* Container wrapper */}
      <div className="relative w-full max-w-5xl bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left side bar describing summit progress */}
        <div className="w-full md:w-80 bg-dark-card border-r border-white/5 opacity-90 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={asaeLogo} alt="ASAE Logo" className="w-10 h-10 object-cover rounded-full border border-gold/30" />
              <div>
                <h4 className="font-serif text-sm font-bold tracking-wider text-gold-pale uppercase leading-none">ASAE Awards</h4>
                <span className="text-[10px] text-dim font-sans tracking-wider">REGISTRATION PORTAL</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 1 ? 'bg-gold text-dark ring-4 ring-gold/20' : step > 1 ? 'bg-sa-green text-white' : 'bg-white/10 text-dim'}`}>
                    {step > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${step === 1 ? 'text-gold' : 'text-dim'}`}>Seating Tier</p>
                    <span className="text-[10px] text-dim/75 block mt-1 font-mono">{selectedCategory.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 2 ? 'bg-gold text-dark ring-4 ring-gold/20' : step > 2 ? 'bg-sa-green text-white' : 'bg-white/10 text-dim'}`}>
                    {step > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${step === 2 ? 'text-gold' : 'text-dim'}`}>Delegate Details</p>
                    <span className="text-[10px] text-dim/75 block mt-1 font-mono">
                      {firstName ? `${firstName} ${lastName}`.substring(0, 18) : 'Not Specified'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 3 ? 'bg-gold text-dark ring-4 ring-gold/20' : step > 3 ? 'bg-sa-green text-white' : 'bg-white/10 text-dim'}`}>
                    {step > 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${step === 3 ? 'text-gold' : 'text-dim'}`}>Summary Review</p>
                    <span className="text-[10px] text-dim/75 block mt-1 font-mono">
                      {`Total: R${selectedCategory.priceZar.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 4 ? 'bg-gold text-dark ring-4 ring-gold/20' : step > 4 ? 'bg-sa-green text-white' : 'bg-white/10 text-dim'}`}>
                    {step > 4 ? <Check className="w-4 h-4" /> : '4'}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${step === 4 ? 'text-gold' : 'text-dim'}`}>Gateway Checkout</p>
                    <span className="text-[10px] text-dim/75 block mt-1 font-mono">{step === 4 ? 'Awaiting Payment' : 'Locked'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 5 ? 'bg-gold text-dark ring-4 ring-gold/20' : 'bg-white/10 text-dim'}`}>
                    '5'
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-none ${step === 5 ? 'text-gold' : 'text-dim'}`}>Delegate Dashboard</p>
                    <span className="text-[10px] text-dim/75 block mt-1 font-mono">Unlocks tickets & CPD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <span className="text-[9px] font-mono uppercase tracking-wider text-dim block mb-1">Summit Host Venue</span>
            <p className="text-xs text-gold/80 font-serif font-bold">Johannesburg JICC 2026</p>
          </div>
        </div>

        {/* Right main panel */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[85vh] md:max-h-[90vh] flex flex-col justify-between">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gold-pale leading-none uppercase">
                {step === 5 ? 'Welcome back! Delegate Suite' : 'Onboarding & Checkout'}
              </h2>
              <p className="text-xs text-dim mt-1.5 font-sans">
                {step === 5 
                  ? 'Access your registration details, schedule agenda, and download certificates' 
                  : `Step ${step} of 4: Populate requested information below.`}
              </p>
            </div>
            {step < 5 && (
              <button 
                onClick={onClose} 
                className="w-8 h-8 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full flex items-center justify-center text-dim hover:text-ivory transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Core Forms based on step */}
          <div className="flex-1 py-2">
            
            {/* Step 1: Seating Tier / Selections */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {CATEGORIES.map((cat) => (
                    <label 
                      key={cat.id}
                      className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${selectedCatId === cat.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-dark-card'}`}
                    >
                      <input 
                        type="radio" 
                        name="category" 
                        value={cat.id} 
                        checked={selectedCatId === cat.id}
                        onChange={() => setSelectedCatId(cat.id)}
                        className="sr-only"
                      />
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedCatId === cat.id ? 'border-gold text-gold' : 'border-dim'}`}>
                            {selectedCatId === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>}
                          </div>
                          <span className="font-serif font-bold text-sm text-ivory tracking-wide uppercase">{cat.name}</span>
                        </div>
                        <p className="text-xs text-dim mt-1 font-sans leading-relaxed">{cat.description}</p>
                      </div>
                      <div className="text-right mt-3 sm:mt-0">
                        <div className="font-serif font-black text-gold text-lg">R{cat.priceZar.toLocaleString()}</div>
                        <span className="text-[10px] font-mono text-dim block mt-0.5">~ USD {cat.priceUsd}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end pt-6">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-dark text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg shadow-lg shadow-gold/10 transition-all font-semibold"
                  >
                    Proceed to Registration <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Account Creation Information */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="text" 
                        placeholder="e.g., John"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="text" 
                        placeholder="e.g., Doe"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="email" 
                        placeholder="e.g., john.doe@mail.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="tel" 
                        placeholder="e.g., +27 71 894 1234"
                        value={mobile}
                        onChange={e => setMobile(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Country *</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <select 
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold transition-all appearance-none"
                      >
                        <option>South Africa</option>
                        <option>Angola</option>
                        <option>Kenya</option>
                        <option>Nigeria</option>
                        <option>Democratic Republic of Congo</option>
                        <option>Mozambique</option>
                        <option>Namibia</option>
                        <option>Ghana</option>
                        <option>United Kingdom</option>
                        <option>United States</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Organization *</label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="text" 
                        placeholder="e.g., Africa Development Corp"
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Position / Role *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="text" 
                        placeholder="e.g., Executive Director"
                        value={position}
                        onChange={e => setPosition(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Passport / ID Number *</label>
                    <div className="relative">
                      <IdCard className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <input 
                        type="text" 
                        placeholder="e.g., AR90284824"
                        value={passportId}
                        onChange={e => setPassportId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory placeholder-dim focus:outline-none focus:border-gold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Dietary Requirements</label>
                    <div className="relative">
                      <Coffee className="absolute left-3.5 top-3.5 w-4 h-4 text-dim" />
                      <select 
                        value={diet}
                        onChange={e => setDiet(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-dark-card border border-white/5 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold transition-all appearance-none"
                      >
                        <option>None</option>
                        <option>Vegetarian</option>
                        <option>Halaal</option>
                        <option>Kosher</option>
                        <option>Vegan</option>
                        <option>Gluten-Free</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-dim tracking-wider block mb-1">Profile Photo (Passport Style)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-white/10 hover:border-gold/40 bg-dark-card py-2.5 px-4 rounded-lg flex items-center gap-3 cursor-pointer transition-all hover:bg-white/5"
                    >
                      <Upload className="w-4 h-4 text-gold-pale" />
                      <div className="text-left">
                        <span className="text-xs text-ivory font-bold block">
                          {profilePicName ? profilePicName.substring(0, 22) + '...' : 'Upload Avatar'}
                        </span>
                        <span className="text-[10px] text-dim block">PNG, JPG up to 5MB</span>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePicChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 text-dim hover:text-ivory text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    onClick={proceedToSummary}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-dark text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg shadow-lg shadow-gold/10 transition-all font-semibold"
                  >
                    Create Account <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Registration Billing Summary */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gold-pale border-b border-white/5 pb-3">
                    REGISTRATION DOSSIER REPORT
                  </h4>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <span className="text-[10px] font-mono text-dim uppercase tracking-wider block">Delegation Nominee</span>
                      <strong className="text-ivory font-serif text-base">{firstName} {lastName}</strong>
                      <span className="text-[11px] text-dim block mt-0.5">{position} @ {organization}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-dim uppercase tracking-wider block">Onboarding Tier</span>
                      <strong className="text-gold tracking-wide uppercase font-serif text-sm">{selectedCategory.name}</strong>
                      <span className="text-[11px] text-dim block mt-0.5">{country} Delegate Pool</span>
                    </div>

                    <div className="col-span-2 border-t border-white/5 pt-4 mt-2">
                       <h5 className="text-[10px] font-mono text-dim uppercase tracking-wider mb-2">FEE AND TAX RECOGNITION</h5>
                       <div className="space-y-2 font-mono text-xs text-ivory/80">
                         <div className="flex justify-between">
                           <span>Seating Conference Fee</span>
                           <span className="font-bold">R{selectedCategory.priceZar.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between">
                           <span>Regulatory VAT (0%)</span>
                           <span>R0</span>
                         </div>
                         <div className="flex justify-between text-base font-serif font-black text-gold border-t border-white/5 pt-3">
                           <span>NET TRANSACTION TOTAL</span>
                           <span>R{selectedCategory.priceZar.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between text-[11px] text-dim font-sans">
                           <span>Foreign Exchange Equivalent</span>
                           <span>~ USD {selectedCategory.priceUsd.toLocaleString()}</span>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end pt-6 border-t border-white/5">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 text-dim hover:text-ivory text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button 
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-light text-dark text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg shadow-lg shadow-gold/10 transition-all font-semibold"
                  >
                    Proceed to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Selective Payment Gateways */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {isProcessing ? (
                  <div className="py-16 text-center space-y-6">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto"
                    />
                    <div className="space-y-2">
                      <h4 className="font-serif text-lg font-bold text-gold-pale uppercase tracking-wider">Gateway Orchestration Active</h4>
                      <p className="text-sm font-mono text-dim animate-pulse">{processingState}</p>
                    </div>
                    <p className="text-xs text-dim/70 max-w-sm mx-auto">Please do not close or reload this browser tab while we securely transact your delegate registration across Southern African pipelines.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Method List Left Column */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-mono text-dim uppercase tracking-wider block mb-2">Gateways Available</h5>
                      
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'card' ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-dark-card text-ivory/60 hover:text-ivory'}`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <span className="font-serif font-bold text-xs block uppercase">Stripe / Credit</span>
                          <span className="text-[9px] text-dim block mt-0.5">Global cards standard</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('bank')}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'bank' ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-dark-card text-ivory/60 hover:text-ivory'}`}
                      >
                        <Building className="w-5 h-5" />
                        <div>
                          <span className="font-serif font-bold text-xs block uppercase">Bank Transfer (EFT)</span>
                          <span className="text-[9px] text-dim block mt-0.5">Direct sovereign invoice</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('momo')}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'momo' ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-dark-card text-ivory/60 hover:text-ivory'}`}
                      >
                        <Phone className="w-5 h-5" />
                        <div>
                          <span className="font-serif font-bold text-xs block uppercase">Mobile Money Wallet</span>
                          <span className="text-[9px] text-dim block mt-0.5">SADC & East Africa telecom</span>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('intel')}
                        className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all ${paymentMethod === 'intel' ? 'border-gold bg-gold/5 text-gold' : 'border-white/5 bg-dark-card text-ivory/60 hover:text-ivory'}`}
                      >
                        <Globe className="w-5 h-5" />
                        <div>
                          <span className="font-serif font-bold text-xs block uppercase">International Gate</span>
                          <span className="text-[9px] text-dim block mt-0.5">Wise, PayPal, Flutterwave</span>
                        </div>
                      </button>
                    </div>

                    {/* Method Options Right Column */}
                    <div className="md:col-span-2 bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <h5 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">Debit / Credit Cards</h5>
                            <span className="text-[9px] text-dim font-mono bg-white/5 px-2 py-1 rounded">Stripe Engine</span>
                          </div>

                          <p className="text-xs text-dim leading-relaxed">Direct clearing supporting premium global processors including Visa, Mastercard, and American Express.</p>

                          <div className="space-y-3 pt-2">
                            <div>
                              <label className="text-[9px] font-mono uppercase text-dim block mb-1">Name on Credit Card</label>
                              <input 
                                type="text"
                                placeholder="e.g. John Doe"
                                value={ccName}
                                onChange={e => setCcName(e.target.value)}
                                className="w-full bg-dark px-3.5 py-2 border border-white/10 rounded-lg text-xs placeholder-dim text-ivory focus:outline-none focus:border-gold"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] font-mono uppercase text-dim block mb-1">Mastercard/Visa Card Number</label>
                              <input 
                                type="text"
                                placeholder="4000 1234 5678 9010"
                                maxLength={16}
                                value={ccNumber}
                                onChange={e => setCcNumber(e.target.value)}
                                className="w-full bg-dark px-3.5 py-2 border border-white/10 rounded-lg text-xs placeholder-dim text-ivory focus:outline-none focus:border-gold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[9px] font-mono uppercase text-dim block mb-1">Expiry Date (MM/YY)</label>
                                <input 
                                  type="text"
                                  placeholder="09/28"
                                  maxLength={5}
                                  value={ccExpiry}
                                  onChange={e => setCcExpiry(e.target.value)}
                                  className="w-full bg-dark px-3.5 py-2 border border-white/10 rounded-lg text-xs placeholder-dim text-ivory focus:outline-none focus:border-gold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-mono uppercase text-dim block mb-1">CVV / Security Code</label>
                                <input 
                                  type="password"
                                  placeholder="123"
                                  maxLength={3}
                                  value={ccCvv}
                                  onChange={e => setCcCvv(e.target.value)}
                                  className="w-full bg-dark px-3.5 py-2 border border-white/10 rounded-lg text-xs placeholder-dim text-ivory focus:outline-none focus:border-gold"
                                />
                              </div>
                            </div>
                          </div>

                          <button 
                            onClick={startStripeFlow}
                            className="w-full py-3 mt-4 bg-gold hover:bg-gold-light text-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg"
                          >
                            Pay R{selectedCategory.priceZar.toLocaleString()} Now
                          </button>
                        </div>
                      )}

                      {paymentMethod === 'bank' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <h5 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">Direct EFT / Sworn Transfer</h5>
                            <span className="text-[9px] text-dim font-mono bg-white/5 px-2 py-1 rounded">Sovereign Wire</span>
                          </div>

                          <div className="p-4 bg-dark rounded-xl border border-white/5 space-y-2 font-mono text-xs">
                            <div className="flex justify-between"><span className="text-dim">Banker:</span> <strong className="text-ivory">First National Bank (FNB) SA</strong></div>
                            <div className="flex justify-between"><span className="text-dim">Recipient:</span> <strong className="text-gold-pale">ASAE Awards Group Ltd</strong></div>
                            <div className="flex justify-between"><span className="text-dim">Account Number:</span> <strong className="text-ivory">6289 4832 9013</strong></div>
                            <div className="flex justify-between"><span className="text-dim">SWIFT Protocol:</span> <strong className="text-ivory">FIRNZAJJ</strong></div>
                            <div className="flex justify-between border-t border-white/10 pt-2 text-gold"><span className="font-bold">Required Reference:</span> <strong className="font-mono">ASAE-DEL-26-902</strong></div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-mono uppercase text-dim block mb-1">Transmission Proof Upload (POP)</label>
                            <div 
                              onClick={() => popFileInputRef.current?.click()}
                              className="border border-dashed border-white/10 hover:border-gold bg-dark py-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/5"
                            >
                              <Upload className="w-6 h-6 text-gold mb-2" />
                              <span className="text-xs text-ivory font-bold">{popFileName || 'Select POP PDF / Image'}</span>
                              <span className="text-[9px] text-dim block mt-1">EFT receipts are reviewed within 4 hours</span>
                              <input 
                                ref={popFileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handlePopFileChange}
                              />
                            </div>
                          </div>

                          <button 
                            onClick={handInBankPop}
                            className="w-full py-3 bg-white/5 border border-white/10 hover:border-gold hover:text-gold text-ivory font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                          >
                            Submit Proof of Payment
                          </button>
                        </div>
                      )}

                      {paymentMethod === 'momo' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <h5 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">Mobile Money Networks</h5>
                            <span className="text-[9px] text-dim font-mono bg-white/5 px-2 py-1 rounded">Pan-African Telecoms</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="text-[9px] font-mono uppercase text-dim block mb-1">Select Country</label>
                              <select 
                                value={momoCountry}
                                onChange={e => handleMomoCountryChange(e.target.value)}
                                className="w-full bg-dark text-xs p-2 rounded-lg border border-white/10 text-ivory focus:outline-none focus:border-gold"
                              >
                                <option>South Africa</option>
                                <option>Kenya</option>
                                <option>Ghana</option>
                                <option>Uganda</option>
                                <option>Angola</option>
                              </select>
                            </div>

                            <div>
                              <label className="text-[9px] font-mono uppercase text-dim block mb-1">Momo Network Provider</label>
                              <select 
                                value={momoProvider}
                                onChange={e => setMomoProvider(e.target.value)}
                                className="w-full bg-dark text-xs p-2 rounded-lg border border-white/10 text-ivory focus:outline-none"
                              >
                                {momoCountry === 'South Africa' && (
                                  <>
                                    <option>MTN MoMo</option>
                                    <option>Vodacom m-pesa</option>
                                  </>
                                )}
                                {momoCountry === 'Kenya' && (
                                  <>
                                    <option>Safaricom M-Pesa</option>
                                    <option>Airtel Money</option>
                                  </>
                                )}
                                {momoCountry === 'Ghana' && (
                                  <>
                                    <option>MTN MoMo</option>
                                    <option>Vodafone Cash</option>
                                  </>
                                )}
                                {momoCountry === 'Uganda' && (
                                  <>
                                    <option>MTN MoMo</option>
                                    <option>Airtel Money</option>
                                  </>
                                )}
                                {momoCountry === 'Angola' && (
                                  <>
                                    <option>BayQi Wallet</option>
                                    <option>Unitel Money</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[9px] font-mono uppercase text-dim block mb-1">Wallet Registered Phone Contact</label>
                            <input 
                              type="tel"
                              placeholder="+254 712 345678"
                              value={momoPhone}
                              onChange={e => setMomoPhone(e.target.value)}
                              className="w-full bg-dark px-3.5 py-2 border border-white/10 rounded-lg text-xs placeholder-dim text-ivory focus:outline-none focus:border-gold"
                            />
                            <p className="text-[9px] text-dim mt-1.5 leading-relaxed">System compiles direct API push to your phone. Review screen prompt on your device, type your security code, & accept.</p>
                          </div>

                          <button 
                            onClick={startMomoFlow}
                            className="w-full py-3 bg-gold hover:bg-gold-light text-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg"
                          >
                            Send STK Push Request
                          </button>
                        </div>
                      )}

                      {paymentMethod === 'intel' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b border-white/5 pb-3">
                            <h5 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">International Pipelines</h5>
                            <span className="text-[9px] text-dim font-mono bg-white/5 px-2 py-1 rounded">Wise / Flutterwave</span>
                          </div>

                          <p className="text-xs text-dim leading-relaxed">Integrated API pipeline backing Wise transfers with low commission friction, plus Flutterwave localized clearing gateways inside 14 African nations.</p>

                          <div className="p-4 bg-dark rounded-xl border border-white/5 space-y-3">
                            <h6 className="font-serif text-xs text-gold-pale uppercase font-semibold">Redirect Handshake Details</h6>
                            <p className="text-[11px] text-dim leading-relaxed">Clicking below opens a secure Flutterwave window representing R{selectedCategory.priceZar.toLocaleString()} (~ USD {selectedCategory.priceUsd}). Upon completion, the secure tokens return to confirm your delegate badge.</p>
                          </div>

                          <button 
                            onClick={() => {
                              setIsProcessing(true);
                              setProcessingState('Awaiting handshake from multi-gateway clearing engine...');
                              setTimeout(() => {
                                setIsProcessing(false);
                                handlePaymentSuccess('Paid');
                              }, 1800);
                            }}
                            className="w-full py-3 bg-gold hover:bg-gold-light text-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
                          >
                            Pay Internationally <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="mt-4 border-t border-white/5 pt-3 flex items-center justify-between">
                        <span className="text-[10px] text-dim">Secure checkout layered with 256-bit encryption.</span>
                        <div className="flex gap-1">
                          <ShieldCheck className="w-4 h-4 text-sa-green" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isProcessing && (
                  <div className="flex justify-start pt-6 border-t border-white/5">
                    <button 
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 text-dim hover:text-ivory text-xs uppercase font-sans font-bold tracking-[2px] rounded-lg transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Delegate Dashboard Suite */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                {/* Dashboard Tabs header */}
                <div className="flex border-b border-white/5 mb-4">
                  <button 
                    onClick={() => { setDashboardTab('my-registration'); setShowBadge(false); setShowReceipt(false); }}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs uppercase font-sans tracking-wide font-bold transition-all ${dashboardTab === 'my-registration' ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-dim hover:text-ivory'}`}
                  >
                    <IdCard className="w-4 h-4" /> My Registration
                  </button>
                  <button 
                    onClick={() => { setDashboardTab('sessions'); setShowBadge(false); setShowReceipt(false); }}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs uppercase font-sans tracking-wide font-bold transition-all ${dashboardTab === 'sessions' ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-dim hover:text-ivory'}`}
                  >
                    <Calendar className="w-4 h-4" /> Conference Sessions
                  </button>
                  <button 
                    onClick={() => { setDashboardTab('certificates'); setShowBadge(false); setShowReceipt(false); }}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 text-xs uppercase font-sans tracking-wide font-bold transition-all ${dashboardTab === 'certificates' ? 'border-gold text-gold bg-gold/5' : 'border-transparent text-dim hover:text-ivory'}`}
                  >
                    <Award className="w-4 h-4" /> PDF Certificates
                  </button>
                </div>

                {/* Tab content 1: ID Card / Overview */}
                {dashboardTab === 'my-registration' && !showBadge && !showReceipt && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      
                      <div className="md:col-span-2 bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gold-pale">
                            DELEGATION CREDENTIALS PORTFOLIO
                          </h4>
                          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded font-bold ${paymentMethod === 'bank' ? 'bg-amber-500/10 text-amber-400' : 'bg-sa-green/10 text-sa-green'}`}>
                            {paymentMethod === 'bank' ? 'Pending Approval' : 'Confirmed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Delegate</span>
                            <span className="text-ivory font-bold">{firstName} {lastName}</span>
                          </div>
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Delegate ID</span>
                            <span className="text-gold font-bold">{delegateId || 'DEL-10492'}</span>
                          </div>
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Registered Category</span>
                            <span className="text-ivory font-bold">{selectedCategory.name}</span>
                          </div>
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Global Affiliation</span>
                            <span className="text-ivory font-bold">{organization}</span>
                          </div>
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Assigned Ref Number</span>
                            <span className="text-ivory font-bold">{transactionId || 'TXN-082412'}</span>
                          </div>
                          <div>
                            <span className="text-dim uppercase text-[10px] block">Host Location Seating</span>
                            <span className="text-gold font-bold">VIP Hall Plenary B</span>
                          </div>
                        </div>

                        {paymentMethod === 'bank' && (
                          <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-3 mt-4">
                            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <h5 className="font-serif font-bold text-amber-400">Direct EFT Under Review</h5>
                              <p className="text-dim mt-1 text-[11px] leading-relaxed">Our finance board is evaluating your Proof of Payment voucher. You have access to configure workshops and schedulers in the mean time.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Side Badging / printable launcher */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center justify-between">
                        <QrCode className="w-20 h-20 text-gold-pale mb-2" />
                        <h4 className="font-serif font-bold text-sm text-ivory">Conference Pass & Receipt</h4>
                        <p className="text-xs text-dim mt-1.5 leading-relaxed">Secure credentials for check-in audits and entry gate plenteous scanners.</p>
                        
                        <div className="w-full space-y-2 mt-4">
                          <button 
                            onClick={() => setShowBadge(true)}
                            className="w-full py-2 bg-gold hover:bg-gold-light text-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <Ticket className="w-3.5 h-3.5" /> Print/View Badge
                          </button>
                          <button 
                            onClick={() => setShowReceipt(true)}
                            className="w-full py-2 bg-white/5 border border-white/15 hover:border-gold hover:text-gold text-ivory font-sans font-semibold text-xs uppercase tracking-wider rounded-lg transition-all"
                          >
                            Print Receipt Invoice
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Sub UI: Detailed Printable Badge */}
                {dashboardTab === 'my-registration' && showBadge && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <button 
                      onClick={() => setShowBadge(false)}
                      className="flex items-center gap-1.5 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </button>

                    <div className="max-w-sm mx-auto bg-gradient-to-b from-dark-card to-dark border-2 border-gold rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col items-center text-center relative">
                      {/* Logo and header */}
                      <div className="flex items-center gap-2.5 mb-4 border-b border-gold/20 pb-3 w-full justify-center">
                        <img src={asaeLogo} alt="ASAE Logo" className="w-8 h-8 rounded-full border border-gold/30" />
                        <div>
                          <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-gold leading-none">ASAE AWARDS</h4>
                          <span className="text-[8px] font-sans text-dim tracking-[2px] block mt-0.5">EXCELLENCE BEYOND BORDERS</span>
                        </div>
                      </div>

                      {/* Profile Pic space */}
                      <div className="relative w-28 h-28 rounded-full border-2 border-gold/40 shadow-xl overflow-hidden bg-white/5 mb-4">
                        {profilePic ? (
                          <img src={profilePic} alt="Delegate Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gold bg-gold/5">
                            <User className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gold/90 text-dark font-sans text-[8px] font-black uppercase tracking-widest py-0.5">
                          SECURED
                        </div>
                      </div>

                      {/* Delegate Info */}
                      <h3 className="font-serif text-xl font-bold font-black text-ivory leading-tight uppercase tracking-wide">
                        {firstName} {lastName}
                      </h3>
                      <p className="text-xs text-dim mt-1.5 leading-none max-w-xs">{position}</p>
                      <span className="text-[10px] text-gold/80 mt-1 font-mono">{organization}</span>

                      {/* Spacer bar & delegation */}
                      <div className="w-full border-t border-dashed border-white/10 my-4 text-center">
                        <span className="bg-gold text-dark px-4 py-1.5 rounded-full font-mono font-black text-xs uppercase tracking-widest inline-block -translate-y-3 shadow-lg">
                          {selectedCategory.name}
                        </span>
                      </div>

                      {/* QR and IDs */}
                      <div className="flex justify-between items-center w-full bg-white/5 p-3.5 rounded-xl border border-white/5">
                        <div className="text-left font-mono text-[9px] text-dim space-y-1">
                          <div>ID: <strong className="text-ivory">{delegateId || 'DEL-10492'}</strong></div>
                          <div>SECURE ROUTE: <strong className="text-gold font-bold">SA-AN-26</strong></div>
                          <div>GATE ACCESS: <strong className="text-sa-green">APPROVED</strong></div>
                        </div>
                        <QrCode className="w-14 h-14 text-gold-pale" />
                      </div>

                      {/* Footer banner */}
                      <div className="mt-4 text-[9px] font-mono text-dim">
                        June 2026 · Johannesburg Summit Centre
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sub UI: Digital Printable Receipt */}
                {dashboardTab === 'my-registration' && showReceipt && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <button 
                      onClick={() => setShowReceipt(false)}
                      className="flex items-center gap-1.5 text-xs text-gold border border-gold/20 px-3 py-1.5 rounded-lg hover:bg-gold/5 transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                    </button>

                    <div className="max-w-2xl mx-auto bg-dark-card border border-white/5 rounded-2xl p-8 shadow-2xl space-y-6 text-xs text-ivory/80 font-mono">
                      
                      <div className="flex justify-between items-start border-b border-white/10 pb-4">
                        <div className="flex gap-2.5">
                          <img src={asaeLogo} alt="ASAE Logo" className="w-10 h-10 rounded-full border border-gold/20" />
                          <div>
                            <h3 className="font-serif text-sm font-bold text-gold uppercase font-semibold leading-none">ASAE Excellence Awards</h3>
                            <span className="text-[9px] text-dim mt-1 block">Reg No: 2026/839/SA</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <h4 className="font-serif text-xs font-bold text-gold uppercase">OFFICIAL TAX INVOICE</h4>
                          <span className="text-dim text-[10px] block mt-1">Receipt Date: {receiptDate}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-dim block text-[10px] mb-1">BILLING CLIENT:</span>
                          <strong>{firstName} {lastName}</strong>
                          <div className="text-dim mt-1">{organization}</div>
                          <div className="text-dim">{country} Delegate Pool</div>
                          <div className="text-dim">E-mail: {email}</div>
                        </div>
                        <div>
                          <span className="text-dim block text-[10px] mb-1">INVOICE SPECIFICS:</span>
                          <div>Invoice No: <strong>INV-{transactionId}</strong></div>
                          <div>Transaction ID: <strong>{transactionId}</strong></div>
                          <div>Delegate Ref: <strong>{delegateId}</strong></div>
                          <div>Method: <strong>{paymentMethod.toUpperCase()} GATEWAY</strong></div>
                        </div>
                      </div>

                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-white/10 text-dim text-[10px]">
                            <th className="py-2">SUMMIT PACKAGE SEATING DESCRIPTION</th>
                            <th className="py-2 text-right">TOTAL (ZAR)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-white/5 text-ivory">
                            <td className="py-3">
                              ASAE Excellence Summit Seating — {selectedCategory.name} Full Seating Pack
                              <p className="text-[10px] text-dim font-sans mt-1">Includes Plenary Hall access, catering breakfasts, VIP lounge check-ins, and printed credentials.</p>
                            </td>
                            <td className="py-3 text-right font-bold">R{selectedCategory.priceZar.toLocaleString()}</td>
                          </tr>
                          <tr className="text-dim text-[11px]">
                            <td className="py-2 text-right">Seating Subtotal:</td>
                            <td className="py-2 text-right">R{selectedCategory.priceZar.toLocaleString()}</td>
                          </tr>
                          <tr className="text-dim text-[11px] border-b border-white/10">
                            <td className="py-2 text-right">VAT (0% Exempt Category):</td>
                            <td className="py-2 text-right">R0</td>
                          </tr>
                          <tr className="text-gold font-bold text-sm">
                            <td className="py-3 text-right">TOTAL INFLOW PAID:</td>
                            <td className="py-3 text-right font-black">R{selectedCategory.priceZar.toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="flex justify-between items-center border-t border-white/10 pt-4 text-[9px] text-dim uppercase leading-relaxed text-center">
                        <div>Verified cryptographic blockchain hash payload receipt signed by audit panel.</div>
                        <QrCode className="w-12 h-12 text-gold opacity-80" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Tab content 2: Agenda timeline / session additions */}
                {dashboardTab === 'sessions' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">Summit Plenary Timeline Planner</h4>
                      <span className="text-xs text-dim font-mono">{selectedSessions.length} active sessions selected</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Left: Interactive Timetable */}
                      <div className="md:col-span-2 space-y-3">
                        {SESSIONS.map((ses) => (
                          <label 
                            key={ses.id}
                            className={`p-4 border rounded-xl flex items-start gap-4 cursor-pointer hover:bg-white/5 transition-all ${selectedSessions.includes(ses.id) ? 'border-gold bg-gold/5' : 'border-white/5 bg-dark-card'}`}
                          >
                            <input 
                              type="checkbox"
                              checked={selectedSessions.includes(ses.id)}
                              onChange={() => handleToggleSession(ses.id)}
                              className="w-4 h-4 rounded border-white/10 text-gold bg-dark mt-1 focus:ring-0"
                            />
                            <div className="flex-1">
                              <div className="flex gap-2.5 items-center">
                                <span className="text-[9px] font-mono uppercase bg-white/5 text-gold-pale px-2 py-0.5 rounded font-bold">{ses.day}</span>
                                <span className="text-[10px] text-dim font-mono">{ses.time}</span>
                                <span className="text-[10px] text-gold font-mono block pl-2 border-l border-white/5">{ses.location}</span>
                              </div>
                              <h5 className="font-serif font-bold text-sm text-ivory mt-1.5">{ses.title}</h5>
                            </div>
                          </label>
                        ))}
                      </div>

                      {/* Right: Schedulers instructions */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 space-y-4 h-fit">
                        <BookOpen className="w-8 h-8 text-gold" />
                        <h4 className="font-serif text-sm font-bold text-ivory">Workshop Seating Allocations</h4>
                        <p className="text-xs text-dim leading-relaxed">Simply check sessions to add them onto your electronic printable badge checklist card. Double checks on seating guarantees are finalized 24 hours prior to plenteous assemblies.</p>

                        <div className="border-t border-white/5 pt-4">
                          <h5 className="text-[10px] font-mono text-dim uppercase tracking-wider mb-2">My Configured Agenda</h5>
                          {selectedSessions.length === 0 ? (
                            <span className="text-xs text-dim italic block">No active selections</span>
                          ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {selectedSessions.map((id) => {
                                const matched = SESSIONS.find(s => s.id === id);
                                return matched ? (
                                  <div key={id} className="text-xs font-mono text-gold-pale border-l-2 border-gold pl-2">
                                    {matched.day} - {matched.title.substring(0, 24)}...
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab content 3: Certificate unlocks */}
                {dashboardTab === 'certificates' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
                        <Award className="w-10 h-10 text-gold" />
                        <h4 className="font-serif text-sm font-bold text-ivory">Conference Attendance Certificate</h4>
                        <p className="text-xs text-dim leading-relaxed">Officially signed digital credential certifying 24 contact hours of bilateral trade, policy panels, and economic research participation.</p>
                        
                        <div className="pt-2">
                          <button 
                            onClick={() => alert(`Attendance Certificate Generated! Downloading PDF for ${firstName} ${lastName}...`)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gold hover:bg-gold-light text-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                          >
                            <Download className="w-3.5 h-3.5" /> Download PDF Certificate
                          </button>
                        </div>
                      </div>

                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
                        <Award className="w-10 h-10 text-sa-green" />
                        <h4 className="font-serif text-sm font-bold text-ivory">Bilateral CPD Credit Certificate</h4>
                        <p className="text-xs text-dim leading-relaxed">Earn 8 Continuing Professional Development (CPD) credits recognized by the board of regional economists and trade consultants. Unlocked upon satisfying validation quiz constraints.</p>

                        {cpdUnlocked ? (
                          <div className="pt-2">
                            <span className="text-xs font-bold text-sa-green block mb-2 font-mono">✅ Verification Passed (Score: {quizScore}/2)</span>
                            <button 
                              onClick={() => alert(`CPD Credit Certificate Issued! Downloading PDF for ${firstName} ${lastName}...`)}
                              className="flex items-center gap-2 px-6 py-2.5 bg-sa-green hover:bg-emerald-600 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> Download CPD Certificate
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 border-t border-white/5 pt-4">
                            <h5 className="text-[10px] font-mono text-dim uppercase tracking-wider mb-2">CPD CONTINENTAL COMPLIANCE QUIZ</h5>
                            
                            {QUIZ_QUESTIONS.map((q, idx) => (
                              <div key={idx} className="space-y-1.5">
                                <p className="text-xs text-ivory leading-relaxed font-bold">{idx + 1}. {q.q}</p>
                                <div className="space-y-1">
                                  {q.options.map((opt, oIdx) => (
                                    <label key={oIdx} className="flex items-center gap-2 text-xs text-dim hover:text-ivory cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`q-${idx}`} 
                                        value={opt}
                                        checked={quizAnswers[idx] === opt}
                                        onChange={() => setQuizAnswers(prev => ({ ...prev, [idx]: opt }))}
                                        className="w-3.5 h-3.5 bg-dark border-white/10 text-gold focus:ring-0"
                                      />
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className="pt-2 flex items-center justify-between">
                              <button 
                                onClick={submitQuiz}
                                className="px-5 py-2 hover:bg-gold/10 hover:text-gold border border-gold/30 text-gold-pale font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                              >
                                Submit Answers
                              </button>
                              {quizScore !== null && quizScore < QUIZ_QUESTIONS.length && (
                                <span className="text-[10px] font-mono text-amber-500 font-bold">Incorrect answers. Try again!</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* Return button */}
                <div className="flex justify-end pt-6 border-t border-white/5">
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-white/5 border border-white/15 hover:border-gold hover:text-gold text-white font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                  >
                    Close Portal Suite
                  </button>
                </div>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
