import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  FileText, 
  CreditCard, 
  Mail, 
  Newspaper, 
  LogOut, 
  BarChart3, 
  Bell, 
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Edit2,
  Plus,
  Send,
  TrendingUp,
  Percent,
  DollarSign,
  Briefcase,
  ArrowUpRight,
  Check,
  AlertCircle,
  Loader2,
  Settings,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  FileDown,
  Award,
  Filter,
  Shield,
  Lock,
  Activity,
  Sliders,
  UserCheck,
  Globe,
  Flame,
  Binary,
  Smartphone,
  Share2,
  CheckSquare,
  Volume2,
  Play,
  Server
} from 'lucide-react';


import { 
  supabase,
  isSupabaseConfigured,
  getSupabaseBlogs,
  saveSupabaseBlog,
  getSupabaseAds,
  saveSupabaseAd,
  getSupabaseTransactions,
  saveSupabaseTransaction,
  getSupabaseNominations,
  saveSupabaseNomination,
  getSupabaseVotingNominees,
  saveSupabaseVotingNominee,
  getSupabaseFraudAlerts,
  saveSupabaseFraudAlert,
  getSupabaseVoteAudits,
  saveSupabaseVoteAudit
} from '../lib/supabase';

interface Nomination {
  id: string;
  nomineeName: string;
  nomineeEmail: string;
  nomineeBio: string;
  organization: string;
  category: string;
  nominatorName: string;
  nominatorEmail: string;
  submissionLetter: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  attachmentName?: string;
}

interface Campaign {
  id: string;
  name: string;
  subject: string;
  segment: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Completed';
  sentCount: number;
  openRate: number;
  clickRate: number;
  replies: number;
  body: string;
  dateCreated: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string;
  dateAdded: string;
  status: 'Subscribed' | 'Unsubscribed';
}

interface UnsubscribeRequest {
  id: string;
  email: string;
  reason: string;
  dateRequested: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Member {
  id: string;
  name: string;
  email: string;
  country: 'South Africa' | 'Angola';
  region: string;
  type: 'Past' | 'New';
  status: 'Pending' | 'Approved' | 'Rejected';
  membershipTier: 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
  paymentRecord: {
    amount: number;
    status: 'Paid' | 'Unpaid' | 'Pending';
    invoiceNumber: string;
    dueDate: string;
  };
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  image: string;
  type: 'Blog' | 'Magazine';
  status: 'Published' | 'Draft';
  dateCreated: string;
  views: number;
}

interface Advertisement {
  id: string;
  title: string;
  image: string;
  placement: string;
  dateCreated: string;
  clicks: number;
  impressions: number;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

interface MailLog {
  id: string;
  timestamp: string;
  to: string;
  recipientType: 'Nominee' | 'Nominator';
  subject: string;
  type: 'Approved' | 'Rejected' | 'Campaign';
  status: 'Delivered' | 'Failed';
}

interface VotingCategory {
  id: string;
  title: string;
  active: boolean;
  startDate: string;
  endDate: string;
  judgesWeight: number;
  publicWeight: number;
  visibility: 'Visible' | 'Hidden';
  bannerUrl: string;
}

interface VotingNominee {
  id: string;
  name: string;
  organization: string;
  country: 'Angola' | 'South Africa';
  bio: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Suspended';
  isFeatured: boolean;
  photoUrl: string;
  galleryCount: number;
  videoUrl: string;
  websiteUrl: string;
  socialLinks: { twitter?: string; linkedin?: string };
  votesCount: number;
  judgesScore: number;
}

interface FraudAlert {
  id: string;
  voterEmail: string;
  ipAddress: string;
  deviceFingerprint: string;
  anomalyType: string;
  riskScore: 'Low' | 'Medium' | 'High';
  timestamp: string;
  status: 'Pending' | 'Blocked' | 'Whitelisted' | 'Blacklisted';
}

interface VoteAudit {
  voteId: string;
  voterId: string;
  deviceId: string;
  timestamp: string;
  location: string;
  paymentRef: string;
  nomineeName: string;
  categoryName: string;
  riskScore: number;
}

interface VotingJudge {
  id: string;
  name: string;
  category: string;
  scoreLeadership: number;
  scoreInnovation: number;
  scoreImpact: number;
  scoreGrowth: number;
  comments: string;
  hasConflict: boolean;
  isSubmitted: boolean;
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users & Logins', icon: Users },
  { id: 'nominations', label: 'Nominations', icon: FileText },
  { id: 'membership', label: 'Membership', icon: Award },
  { id: 'voting', label: 'Voting Module', icon: CheckSquare },
  { id: 'marketing', label: 'Email Marketing', icon: Mail },
  { id: 'blogs', label: 'News & Blogs', icon: Newspaper },
  { id: 'payments', label: 'Payments', icon: CreditCard }
];

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Marketing Sub-Tab
  const [marketingSubTab, setMarketingSubTab] = useState<'campaigns' | 'compose' | 'subscribers' | 'unsubscriptions'>('campaigns');

  // Currency Converter (ZAR 'R' vs Angolan Kwanza 'AOA' / 'Kz')
  const [currency, setCurrency] = useState<'ZAR' | 'AOA'>('ZAR');
  const exchangeRate = 45.0; // 1 ZAR = 45.00 AOA

  // --- SUPABASE SYNCHRONIZATION STATE & EFFECT ---
  const [isSyncing, setIsSyncing] = useState(false);

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadAllFromSupabase = async () => {
      setIsSyncing(true);
      try {
        const [
          supabaseNoms,
          supabaseVotingNoms,
          supabaseFraudAlerts,
          supabaseVoteAudits,
          supabaseBlogs,
          supabaseAds,
          supabaseTxns
        ] = await Promise.all([
          getSupabaseNominations(),
          getSupabaseVotingNominees(),
          getSupabaseFraudAlerts(),
          getSupabaseVoteAudits(),
          getSupabaseBlogs(),
          getSupabaseAds(),
          getSupabaseTransactions()
        ]);

        if (supabaseNoms && supabaseNoms.length > 0) {
          setNominations(supabaseNoms);
          localStorage.setItem('asae_nominations', JSON.stringify(supabaseNoms));
        }
        if (supabaseVotingNoms && supabaseVotingNoms.length > 0) {
          setVotingNominees(supabaseVotingNoms);
          localStorage.setItem('asae_voting_nominees', JSON.stringify(supabaseVotingNoms));
        }
        if (supabaseFraudAlerts && supabaseFraudAlerts.length > 0) {
          setVotingFraudAlerts(supabaseFraudAlerts);
          localStorage.setItem('asae_voting_fraud_alerts', JSON.stringify(supabaseFraudAlerts));
        }
        if (supabaseVoteAudits && supabaseVoteAudits.length > 0) {
          setVoteAudits(supabaseVoteAudits);
          localStorage.setItem('asae_vote_audits', JSON.stringify(supabaseVoteAudits));
        }
        if (supabaseBlogs && supabaseBlogs.length > 0) {
          setPosts(supabaseBlogs);
          localStorage.setItem('blogs', JSON.stringify(supabaseBlogs));
        }
        if (supabaseAds && supabaseAds.length > 0) {
          setAds(supabaseAds);
          localStorage.setItem('ads', JSON.stringify(supabaseAds));
        }
        if (supabaseTxns && supabaseTxns.length > 0) {
          setTransactions(supabaseTxns);
          localStorage.setItem('asae_transactions', JSON.stringify(supabaseTxns));
        }
        
        triggerToast('Supabase Connected ⚡', 'All databases successfully synchronized from production cloud server.');
      } catch (err) {
        console.error('Failed to sync from Supabase:', err);
      } finally {
        setIsSyncing(false);
      }
    };

    loadAllFromSupabase();
  }, []);

  // --- MOCK INITIAL STATE ---
  const [nominations, setNominations] = useState<Nomination[]>(() => {
    const defaultNominations: Nomination[] = [
      {
        id: 'NOM-101',
        nomineeName: 'Dr. Henrique dos Santos',
        nomineeEmail: 'henrique.santos@angolainvest.ao',
        nomineeBio: 'Pioneered financial technology solutions across Southern/Central Africa, and structured private capital developments worth R2.4 Billion.',
        organization: 'Angola Investment Corp',
        category: 'Business Leader of the Year',
        nominatorName: 'Jane Rose',
        nominatorEmail: 'jane.rose@finadvisors.co.za',
        submissionLetter: 'I would like to nominating Dr. Henrique for his unmatched contribution in structuring international investments inside Southern Africa. Under his guidance, local fintech has boomed.',
        date: '2026-06-18',
        status: 'Pending',
        attachmentName: 'executive_credentials.pdf'
      },
      {
        id: 'NOM-102',
        nomineeName: 'Maria Oliveira',
        nomineeEmail: 'maria.o@techforward.africa',
        nomineeBio: 'Developed open-source water sanitation AI models used by 45,000 rural farmers across Sub-Saharan projects.',
        organization: 'TechForward Africa',
        category: 'Technology Innovator',
        nominatorName: 'Maria Oliveira',
        nominatorEmail: 'maria.o@techforward.africa',
        submissionLetter: 'Nominating myself to showcase the scale-up model of the agro-tech system we deployed in five SADC nations.',
        date: '2026-06-17',
        status: 'Pending',
        attachmentName: 'water_tech_stats.pdf'
      },
      {
        id: 'NOM-103',
        nomineeName: 'Nelson Mandela Foundation Team',
        nomineeEmail: 'outreach@mandelafoundation.org',
        nomineeBio: 'Continuous dedication to educational equity and feeding schemes supporting over 1.2M children annually.',
        organization: 'Nelson Mandela Foundation',
        category: 'Community Impact Award',
        nominatorName: 'Carlos Santos',
        nominatorEmail: 'carlos@santos-consulting.co.za',
        submissionLetter: 'Truly a legendary impact program. Their commitment during tough seasons has rewritten thousands of community outcomes.',
        date: '2026-06-15',
        status: 'Approved',
        attachmentName: 'yearly_impact_report_2025.pdf'
      },
      {
        id: 'NOM-104',
        nomineeName: 'Isabel dos Santos',
        nomineeEmail: 'private.contact@unitel-group.net',
        nomineeBio: 'Entrepreneur and legacy investor with multi-decade leadership roles across telecommunications pipelines.',
        organization: 'Unitel Group',
        category: 'Lifetime Achievement',
        nominatorName: 'Anonymous Executive',
        nominatorEmail: 'anon.delegate@lunda.ao',
        submissionLetter: 'Submitting a lifelong dossier of technology deployments across three coastal sovereign telecom integrations.',
        date: '2026-06-14',
        status: 'Rejected',
        attachmentName: 'dossier_brief.pdf'
      }
    ];

    try {
      const stored = localStorage.getItem('asae_nominations');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse asae_nominations:', err);
    }
    try {
      localStorage.setItem('asae_nominations', JSON.stringify(defaultNominations));
    } catch (e) {}
    return defaultNominations;
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'CMP-001',
      name: 'Early Bird Ticket Alert',
      subject: 'ANNOUNCING: Early Bird Pricing for the ASAE Excellence Summit is LIVE',
      segment: 'All Newsletter Subscribers (4500)',
      status: 'Completed',
      sentCount: 4500,
      openRate: 58.4,
      clickRate: 24.2,
      replies: 112,
      body: 'Dear Professional, we options have opened the Early Bird seating registration for ASAE. Claim your table today with 25% corporate discount.',
      dateCreated: '2026-06-10'
    },
    {
      id: 'CMP-002',
      name: 'Platinum Sponsor Outreach',
      subject: 'Exclusive Partner Invitation: Keynote Sponsorship Slots Options',
      segment: 'Partners & Sponsors (35)',
      status: 'Active',
      sentCount: 35,
      openRate: 88.5,
      clickRate: 45.7,
      replies: 9,
      body: 'Respected Partner, we invite your organization to anchor the ASAE opening plenary session. Platinum tier benefits are attached.',
      dateCreated: '2026-06-16'
    },
    {
      id: 'CMP-003',
      name: 'Nomination Reminders Blast',
      subject: 'Last Chance: Submissions for ASAE 2026 close soon',
      segment: 'Registered Members Only (1240)',
      status: 'Draft',
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      replies: 0,
      body: 'Great minds change industries. Nominate your favorite executive peers right now in the portal beforehand.',
      dateCreated: '2026-06-18'
    }
  ]);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: 'SUB-01', email: 'simao@neurogrowthlabs.co.za', source: 'Admin Portal', dateAdded: '2026-01-10', status: 'Subscribed' },
    { id: 'SUB-02', email: 'dr.smith@medcor.co.za', source: 'Home Form', dateAdded: '2026-06-15', status: 'Subscribed' },
    { id: 'SUB-03', email: 'anna.bel@angolasponsor.com', source: 'Sponsor Form', dateAdded: '2026-06-16', status: 'Subscribed' },
    { id: 'SUB-04', email: 'carlos@santos-consulting.co.za', source: 'Member Landing', dateAdded: '2026-06-17', status: 'Subscribed' },
    { id: 'SUB-05', email: 'marketing.lead@gold-refinery.net', source: 'Newsletter Footer', dateAdded: '2026-06-18', status: 'Subscribed' }
  ]);

  const [unsubscribeRequests, setUnsubscribeRequests] = useState<UnsubscribeRequest[]>([
    { id: 'UR-01', email: 'dr.smith@medcor.co.za', reason: 'Receiving too many alerts. Prefer weekly summaries.', dateRequested: '2026-06-18', status: 'Pending' },
    { id: 'UR-02', email: 'marketing.lead@gold-refinery.net', reason: 'Role changed. I am no longer handling sponsorships.', dateRequested: '2026-06-17', status: 'Pending' },
    { id: 'UR-03', email: 'anna.bel@angolasponsor.com', reason: 'Please remove me from high-frequency sequences.', dateRequested: '2026-06-16', status: 'Pending' }
  ]);

  const [members, setMembers] = useState<Member[]>([
    {
      id: 'MEM-001',
      name: 'Antonio Costa',
      email: 'antonio.costa@angola-energy.ao',
      country: 'Angola',
      region: 'Luanda',
      type: 'Past',
      status: 'Approved',
      membershipTier: 'Platinum',
      joinDate: '2024-03-15',
      paymentRecord: {
        amount: 15000,
        status: 'Paid',
        invoiceNumber: 'INV-MEM-2024-01',
        dueDate: '2024-03-15'
      }
    },
    {
      id: 'MEM-002',
      name: 'Sipho Ndlovu',
      email: 'sipho@safricapital.co.za',
      country: 'South Africa',
      region: 'Gauteng',
      type: 'Past',
      status: 'Approved',
      membershipTier: 'Gold',
      joinDate: '2025-01-20',
      paymentRecord: {
        amount: 8500,
        status: 'Paid',
        invoiceNumber: 'INV-MEM-2025-04',
        dueDate: '2025-01-20'
      }
    },
    {
      id: 'MEM-003',
      name: 'Manuel Da Silva',
      email: 'm.silva@bda.ao',
      country: 'Angola',
      region: 'Benguela',
      type: 'New',
      status: 'Pending',
      membershipTier: 'Silver',
      joinDate: '2026-06-01',
      paymentRecord: {
        amount: 4500,
        status: 'Pending',
        invoiceNumber: 'INV-MEM-2026-11',
        dueDate: '2026-06-15'
      }
    },
    {
      id: 'MEM-004',
      name: 'Lerato Molefe',
      email: 'lerato@minetech.co.za',
      country: 'South Africa',
      region: 'Western Cape',
      type: 'New',
      status: 'Approved',
      membershipTier: 'Platinum',
      joinDate: '2026-05-18',
      paymentRecord: {
        amount: 15000,
        status: 'Paid',
        invoiceNumber: 'INV-MEM-2026-09',
        dueDate: '2026-05-18'
      }
    },
    {
      id: 'MEM-005',
      name: 'Fatima Gonga',
      email: 'fatima@gonga-law.ao',
      country: 'Angola',
      region: 'Cabinda',
      type: 'New',
      status: 'Rejected',
      membershipTier: 'Gold',
      joinDate: '2026-06-10',
      paymentRecord: {
        amount: 8500,
        status: 'Unpaid',
        invoiceNumber: 'INV-MEM-2026-15',
        dueDate: '2026-06-30'
      }
    },
    {
      id: 'MEM-006',
      name: 'Pieter van Wyk',
      email: 'pieter@vinelands.co.za',
      country: 'South Africa',
      region: 'Western Cape',
      type: 'Past',
      status: 'Approved',
      membershipTier: 'Silver',
      joinDate: '2025-08-11',
      paymentRecord: {
        amount: 4500,
        status: 'Paid',
        invoiceNumber: 'INV-MEM-2025-99',
        dueDate: '2025-08-11'
      }
    }
  ]);

  // Membership search and filters
  const [memberFilterCountry, setMemberFilterCountry] = useState<string>('All');
  const [memberFilterRegion, setMemberFilterRegion] = useState<string>('All');
  const [memberFilterType, setMemberFilterType] = useState<string>('All');
  const [memberFilterStatus, setMemberFilterStatus] = useState<string>('All');
  const [memberSortField, setMemberSortField] = useState<'name' | 'country' | 'region' | 'joinDate'>('name');

  // Membership adding states
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberCountry, setNewMemberCountry] = useState<'South Africa' | 'Angola'>('Angola');
  const [newMemberRegion, setNewMemberRegion] = useState('Luanda');
  const [newMemberType, setNewMemberType] = useState<'Past' | 'New'>('New');
  const [newMemberTier, setNewMemberTier] = useState<'Silver' | 'Gold' | 'Platinum'>('Gold');
  const [newMemberFee, setNewMemberFee] = useState<number>(8500);

  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem("blogs");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'PST-01',
        title: 'Driving Sustainable Investment in SADC States',
        category: 'Finance & Growth',
        author: 'Admin Editorial Desk',
        excerpt: 'Sovereign wealth growth requires rigorous infrastructure models and stable regional policies. We look at the top success stories of 2025/2026.',
        content: 'This technical editorial examines the rapid growth of investment in the SADC structures. In the last year, South Africa and Angola have solidified collaborative energy pipelines and digital finance frameworks... We highlight standard regulatory parameters enabling sustainable development.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800',
        type: 'Blog',
        status: 'Published',
        dateCreated: '2026-06-12',
        views: 314
      },
      {
        id: 'MAG-01',
        title: 'ASAE Excellence Digital - Edition #4',
        category: 'Digital Magazine',
        author: 'ASAE Executive Board',
        excerpt: 'The official digital compilation featuring peer-voted business champions, macroeconomic outlooks, and luxury sponsor showcases.',
        content: 'Welcome to Edition #4 of ASAE Excellence Digital. In this edition, we run deep profiles on our leading nominees, highlight the state of regional fintech networks, and provide our attendees with complete scheduling details for our major keynote summits.',
        image: 'https://images.unsplash.com/photo-1544924799-79a10dd06a2e?auto=format&fit=crop&q=80&w=800',
        type: 'Magazine',
        status: 'Published',
        dateCreated: '2026-06-15',
        views: 789
      }
    ];
  });

  const [ads, setAds] = useState<Advertisement[]>(() => {
    try {
      const saved = localStorage.getItem("ads");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'AD-1',
        title: 'SADC Trade Gateway Hub Campaign',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        placement: 'Homepage Hero',
        dateCreated: '2026-06-10',
        clicks: 10980,
        impressions: 354209
      },
      {
        id: 'AD-2',
        title: 'Unitel Fiber SADC Ocean Link Campaign',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
        placement: 'Sidebar',
        dateCreated: '2026-06-12',
        clicks: 30373,
        impressions: 584103
      }
    ];
  });

  const [blogsSubTab, setBlogsSubTab] = useState<'blogs' | 'ads'>('blogs');

  // Ad Form States
  const [newAdTitle, setNewAdTitle] = useState('');
  const [newAdImage, setNewAdImage] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
  const [newAdPlacement, setNewAdPlacement] = useState('Homepage Hero');
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [previewAd, setPreviewAd] = useState<Advertisement | null>(null);

  React.useEffect(() => {
    localStorage.setItem("blogs", JSON.stringify(posts));
  }, [posts]);

  React.useEffect(() => {
    localStorage.setItem("ads", JSON.stringify(ads));
  }, [ads]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 'TSK-1', text: 'Approve 4 Premium Corporate Tables', done: false, priority: 'High' },
    { id: 'TSK-2', text: 'Perform security compliance check on registration form', done: true, priority: 'Medium' },
    { id: 'TSK-3', text: 'Launch platinum cohort email marketing sequence', done: false, priority: 'High' },
    { id: 'TSK-4', text: 'Verify venue caterer certifications with Grand Hall', done: false, priority: 'Low' }
  ]);

  const [mailLogs, setMailLogs] = useState<MailLog[]>([
    {
      id: 'LOG-900',
      timestamp: '2026-06-15 11:24:09',
      to: 'outreach@mandelafoundation.org',
      recipientType: 'Nominee',
      subject: 'CONGRATULATIONS: Your ASAE Nomination Has Been Approved!',
      type: 'Approved',
      status: 'Delivered'
    },
    {
      id: 'LOG-901',
      timestamp: '2026-06-15 11:24:10',
      to: 'carlos@santos-consulting.co.za',
      recipientType: 'Nominator',
      subject: 'ASAE Nomination Success Status Update',
      type: 'Approved',
      status: 'Delivered'
    }
  ]);

  // Transaction Ledger State
  const [transactions, setTransactions] = useState(() => {
    const defaultTxns = [
      { id: 'TXN-0092', entity: 'TechForward Africa', type: 'Corporate Table', amount: 45000, date: '2026-06-18', status: 'Completed', tier: 'Silver' },
      { id: 'TXN-0091', entity: 'Jane Doe', type: 'VIP Ticket', amount: 6500, date: '2026-06-17', status: 'Completed', tier: 'Member' },
      { id: 'TXN-0090', entity: 'Angola Investment Corp', type: 'Gold Sponsorship', amount: 250000, date: '2026-06-15', status: 'Pending', tier: 'Gold' },
      { id: 'TXN-0089', entity: 'Dr. John Smith', type: 'General Ticket', amount: 2500, date: '2026-06-14', status: 'Completed', tier: 'Member' },
      { id: 'TXN-0088', entity: 'Luanda Bank', type: 'Event Partner', amount: 150000, date: '2026-06-10', status: 'Completed', tier: 'Platinum' },
    ];
    try {
      const saved = localStorage.getItem('asae_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        const combined = [...parsed, ...defaultTxns];
        const seen = new Set();
        return combined.filter(t => {
          if (seen.has(t.id)) return false;
          seen.add(t.id);
          return true;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return defaultTxns;
  });

  // --- INTERACTIVE ACTIVE STATE VARIABLES ---
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);

  // --- PAYMENT INTERACTIVES HANDLERS ---
  const handleApprovePayment = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
    if (selectedTransaction && selectedTransaction.id === id) {
      setSelectedTransaction(prev => prev ? { ...prev, status: 'Completed' } : null);
    }
    const target = transactions.find(t => t.id === id);
    if (target) {
      saveSupabaseTransaction({ ...target, status: 'Completed' });
    }
    try {
      const stored = localStorage.getItem('asae_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((t: any) => t.id === id ? { ...t, status: 'Completed' } : t);
        localStorage.setItem('asae_transactions', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
    triggerToast('Payment Approved', 'Direct EFT Bank voucher verified and confirmed.', 'success');
  };

  const handleRefundPayment = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'Refunded' } : t));
    if (selectedTransaction && selectedTransaction.id === id) {
      setSelectedTransaction(prev => prev ? { ...prev, status: 'Refunded' } : null);
    }
    const target = transactions.find(t => t.id === id);
    if (target) {
      saveSupabaseTransaction({ ...target, status: 'Refunded' });
    }
    try {
      const stored = localStorage.getItem('asae_transactions');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((t: any) => t.id === id ? { ...t, status: 'Refunded' } : t);
        localStorage.setItem('asae_transactions', JSON.stringify(updated));
      }
    } catch (e) {
      console.error(e);
    }
    triggerToast('Payment Refunded', 'Treasury allocation reverted for the selected transaction.', 'alert');
  };
  const [notification, setNotification] = useState<{ text: string; subtext?: string; type: 'success' | 'alert' } | null>(null);

  // Email Marketing Form States
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignSubject, setNewCampaignSubject] = useState('');
  const [newCampaignSegment, setNewCampaignSegment] = useState('All Newsletter Subscribers (4500)');
  const [newCampaignBody, setNewCampaignBody] = useState('');

  // Blog Form States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Finance & Strategy');
  const [newPostExcerpt, setNewPostExcerpt] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<'Blog' | 'Magazine'>('Blog');
  const [newPostStatus, setNewPostStatus] = useState<'Published' | 'Draft'>('Published');
  const [newPostImage, setNewPostImage] = useState('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800');
  const [dragOver, setDragOver] = useState(false);
  
  // Blog Edit ID
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // --- VOTING MODULE STATE DECLARATIONS ---
  const [votingActiveRole, setVotingActiveRole] = useState<'Master' | 'Country' | 'Finance' | 'Compliance' | 'Content' | 'Event'>('Master');
  const [votingSubTab, setVotingSubTab] = useState<'overview' | 'categories' | 'packages' | 'fraud' | 'judges' | 'awards' | 'predictive'>('overview');
  const [scoringFormula, setScoringFormula] = useState<'Formula1' | 'Formula2'>('Formula1');
  const [leaderboardMode, setLeaderboardMode] = useState<'Public' | 'Anonymous' | 'Private'>('Public');

  // Interactive local states for Category & Nominee forms
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatJudgesWeight, setNewCatJudgesWeight] = useState(60);
  const [newCatPublicWeight, setNewCatPublicWeight] = useState(40);
  const [newCatStartDate, setNewCatStartDate] = useState('2026-07-01');
  const [newCatEndDate, setNewCatEndDate] = useState('2026-08-31');

  // Nominee forms
  const [newNomName, setNewNomName] = useState('');
  const [newNomOrg, setNewNomOrg] = useState('');
  const [newNomCountry, setNewNomCountry] = useState<'South Africa' | 'Angola'>('Angola');
  const [newNomBio, setNewNomBio] = useState('');
  const [newNomCategory, setNewNomCategory] = useState('Business Leader of the Year');
  const [newNomPhoto, setNewNomPhoto] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

  // Premium Voting Package pricing states
  const [saPackages, setSaPackages] = useState([
    { id: '1', title: 'Package 1', votes: 10, priceZar: 20 },
    { id: '2', title: 'Package 2', votes: 50, priceZar: 80 },
    { id: '3', title: 'Package 3', votes: 100, priceZar: 150 },
    { id: '4', title: 'Package 4', votes: 500, priceZar: 500 }
  ]);

  const [aoPackages, setAoPackages] = useState([
    { id: '1', title: 'Package 1', votes: 10, priceAoa: 500 },
    { id: '2', title: 'Package 2', votes: 50, priceAoa: 2000 },
    { id: '3', title: 'Package 3', votes: 100, priceAoa: 4000 },
    { id: '4', title: 'Package 4', votes: 500, priceAoa: 15000 }
  ]);

  // Payment Toggles state
  const [saPaymentToggles, setSaPaymentToggles] = useState({
    eft: true,
    ozow: true,
    payfast: true,
    paygate: true,
    visa: true,
    mastercard: true
  });

  const [aoPaymentToggles, setAoPaymentToggles] = useState({
    multicaixa: true,
    unitel: true,
    africell: true,
    wireTransfer: true
  });

  const [intPaymentToggles, setIntPaymentToggles] = useState({
    stripe: true,
    paypal: true,
    applepay: true,
    googlepay: true
  });

  // Simulation states
  const [isVerifyingBlockchain, setIsVerifyingBlockchain] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);
  const [predictedWinners, setPredictedWinners] = useState<{ name: string; category: string; confidence: number; riskCleanFactor: number }[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  // Categories initial mock
  const [votingCategories, setVotingCategories] = useState<VotingCategory[]>([
    { id: 'V-CAT-1', title: 'Business Leader of the Year', active: true, startDate: '2026-06-01', endDate: '2026-08-30', judgesWeight: 60, publicWeight: 40, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-2', title: 'Young Entrepreneur of the Year', active: true, startDate: '2026-06-01', endDate: '2026-08-30', judgesWeight: 50, publicWeight: 50, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-3', title: 'Sustainability Champion', active: true, startDate: '2026-06-01', endDate: '2026-08-15', judgesWeight: 60, publicWeight: 40, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-4', title: 'Innovation Excellence Award', active: true, startDate: '2026-06-01', endDate: '2026-08-31', judgesWeight: 50, publicWeight: 50, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-5', title: 'Woman Leader of the Year', active: true, startDate: '2026-06-10', endDate: '2026-08-30', judgesWeight: 60, publicWeight: 40, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-6', title: 'Corporate Excellence Award', active: true, startDate: '2026-06-12', endDate: '2026-08-25', judgesWeight: 70, publicWeight: 30, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-7', title: 'Technology Excellence Award', active: false, startDate: '2026-06-15', endDate: '2026-08-25', judgesWeight: 50, publicWeight: 50, visibility: 'Hidden', bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-8', title: 'Education Excellence Award', active: true, startDate: '2026-06-18', endDate: '2026-09-10', judgesWeight: 50, publicWeight: 50, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80' },
    { id: 'V-CAT-9', title: 'Community Impact Award', active: true, startDate: '2026-06-01', endDate: '2026-08-30', judgesWeight: 60, publicWeight: 40, visibility: 'Visible', bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' }
  ]);

  // Nominees mock data
  const [votingNominees, setVotingNominees] = useState<VotingNominee[]>(() => {
    const defaultVotingNominees: VotingNominee[] = [
      {
        id: 'V-NOM-01',
        name: 'Dr. Antonio Domingos',
        organization: 'Angola Investment Corp',
        country: 'Angola',
        bio: 'Leading economic reforms and cross-border digital financial protocols in Southern Africa.',
        category: 'Business Leader of the Year',
        status: 'Approved',
        isFeatured: true,
        photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
        galleryCount: 4,
        videoUrl: 'https://youtube.com/watch?v=asae-domingos',
        websiteUrl: 'https://angolainvestcorp.ao',
        socialLinks: { twitter: '@domingos_aic', linkedin: 'linkedin.com/in/domingos' },
        votesCount: 24150,
        judgesScore: 92
      },
      {
        id: 'V-NOM-02',
        name: 'Sarah Mokoena',
        organization: 'FinTech Solutions SA',
        country: 'South Africa',
        bio: 'Pioneered cellular integration systems bridging migrant remittances securely.',
        category: 'Business Leader of the Year',
        status: 'Approved',
        isFeatured: false,
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        galleryCount: 2,
        videoUrl: 'https://youtube.com/watch?v=mokoena-fintech',
        websiteUrl: 'https://fintechsolutions.co.za',
        socialLinks: { twitter: '@sarah_m_fin', linkedin: 'linkedin.com/in/sarah-mokoena' },
        votesCount: 22800,
        judgesScore: 89
      },
      {
        id: 'V-NOM-03',
        name: 'James Valerio',
        organization: 'TechForward Venture',
        country: 'South Africa',
        bio: 'Dedicated incubator scaling tech talent in Soweto and Luanda industrial parks.',
        category: 'Business Leader of the Year',
        status: 'Approved',
        isFeatured: false,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        galleryCount: 5,
        videoUrl: 'https://youtube.com/watch?v=techforward-valerio',
        websiteUrl: 'https://techforward.co.za',
        socialLinks: { twitter: '@jvalerio_ventures', linkedin: 'linkedin.com/in/james-valerio' },
        votesCount: 18500,
        judgesScore: 81
      },
      {
        id: 'V-NOM-04',
        name: 'Dr. Lando António',
        organization: 'Tech Africa Lab',
        country: 'Angola',
        bio: 'Innovating neural systems for localized agriculture optimization.',
        category: 'Young Entrepreneur of the Year',
        status: 'Approved',
        isFeatured: true,
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        galleryCount: 3,
        videoUrl: 'https://youtube.com/watch?v=lando-neural',
        websiteUrl: 'https://techafrica.ao',
        socialLinks: { twitter: '@lando_antonio', linkedin: 'linkedin.com/in/lando-antonio' },
        votesCount: 16200,
        judgesScore: 94
      },
      {
        id: 'V-NOM-05',
        name: 'Fatima Gonga',
        organization: 'Eco-Gonga Ltd',
        country: 'Angola',
        bio: 'Carbon capture strategies centered in coastal Lobito and Cabinda industrial regions.',
        category: 'Sustainability Champion',
        status: 'Pending',
        isFeatured: false,
        photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1bfcc4?auto=format&fit=crop&w=400&q=80',
        galleryCount: 1,
        videoUrl: 'https://youtube.com/watch?v=carbon-gonga',
        websiteUrl: 'https://ecogonganet.ao',
        socialLinks: { twitter: '@fatima_eco', linkedin: 'linkedin.com/in/fatima-gonga' },
        votesCount: 12050,
        judgesScore: 78
      }
    ];

    try {
      const stored = localStorage.getItem('asae_voting_nominees');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.setItem('asae_voting_nominees', JSON.stringify(defaultVotingNominees));
    } catch (e) {}
    return defaultVotingNominees;
  });

  // Real-time AI Anomaly Monitoring
  const [votingFraudAlerts, setVotingFraudAlerts] = useState<FraudAlert[]>(() => {
    const defaultAlerts: FraudAlert[] = [
      { id: 'FRD-101', voterEmail: 'bot-voter99@spam.xyz', ipAddress: '185.220.101.44', deviceFingerprint: 'Chrome-Win11-Canvas3812', anomalyType: 'VPN & IP Velocity Overload', riskScore: 'High', timestamp: '2026-06-18 08:24:11', status: 'Blocked' },
      { id: 'FRD-102', voterEmail: 'dr.smith@medcor.co.za', ipAddress: '165.2.144.18', deviceFingerprint: 'Safari-Mac-Canvas1254', anomalyType: 'N/A - Legitimate Session', riskScore: 'Low', timestamp: '2026-06-18 08:35:50', status: 'Whitelisted' },
      { id: 'FRD-103', voterEmail: 'infiltrator@hailmail.net', ipAddress: '45.138.16.222', deviceFingerprint: 'Firefox-Linux-NullReferrer', anomalyType: 'Device Fingerprint Spoofing & VPN', riskScore: 'High', timestamp: '2026-06-18 08:37:01', status: 'Pending' },
      { id: 'FRD-104', voterEmail: 'sipho@safricapital.co.za', ipAddress: '102.220.91.5', deviceFingerprint: 'Chrome-iOS-ApplePayActive', anomalyType: 'N/A - Premium Vote', riskScore: 'Low', timestamp: '2026-06-18 08:41:22', status: 'Whitelisted' },
      { id: 'FRD-105', voterEmail: 'mulberry92@gmail.ao', ipAddress: '197.80.254.12', deviceFingerprint: 'Safari-iOS-DeviceMismatched', anomalyType: 'Duplicate Votes via Rapid Refresh', riskScore: 'Medium', timestamp: '2026-06-18 08:45:00', status: 'Pending' }
    ];

    try {
      const stored = localStorage.getItem('asae_voting_fraud_alerts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.setItem('asae_voting_fraud_alerts', JSON.stringify(defaultAlerts));
    } catch (e) {}
    return defaultAlerts;
  });

  // Vote immutable trail
  const [voteAudits, setVoteAudits] = useState<VoteAudit[]>(() => {
    const defaultAudits: VoteAudit[] = [
      { voteId: 'VOT-202410', voterId: 'USR-89241', deviceId: 'DEV-F8214', timestamp: '2026-06-18 08:01:24', location: 'Luanda, AO', paymentRef: 'FREE-VOTE', nomineeName: 'Dr. Antonio Domingos', categoryName: 'Business Leader of the Year', riskScore: 4 },
      { voteId: 'VOT-202411', voterId: 'USR-90124', deviceId: 'DEV-K9125', timestamp: '2026-06-18 08:02:11', location: 'Cape Town, ZA', paymentRef: 'PAY-OZ-9124', nomineeName: 'Sarah Mokoena', categoryName: 'Business Leader of the Year', riskScore: 2 },
      { voteId: 'VOT-202412', voterId: 'USR-51290', deviceId: 'DEV-M3182', timestamp: '2026-06-18 08:02:59', location: 'Soweto, ZA', paymentRef: 'FREE-VOTE', nomineeName: 'James Valerio', categoryName: 'Business Leader of the Year', riskScore: 12 },
      { voteId: 'VOT-202413', voterId: 'USR-84192', deviceId: 'DEV-Z8103', timestamp: '2026-06-18 08:05:33', location: 'Benguela, AO', paymentRef: 'PAY-MC-810', nomineeName: 'Dr. Lando António', categoryName: 'Young Entrepreneur of the Year', riskScore: 1 },
      { voteId: 'VOT-202414', voterId: 'USR-29471', deviceId: 'DEV-U9914', timestamp: '2026-06-18 08:06:12', location: 'Cape Town, ZA', paymentRef: 'FREE-VOTE', nomineeName: 'Sarah Mokoena', categoryName: 'Business Leader of the Year', riskScore: 3 },
    ];

    try {
      const stored = localStorage.getItem('asae_vote_audits');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    try {
      localStorage.setItem('asae_vote_audits', JSON.stringify(defaultAudits));
    } catch (e) {}
    return defaultAudits;
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('asae_voting_nominees', JSON.stringify(votingNominees));
    } catch (e) {}
  }, [votingNominees]);

  React.useEffect(() => {
    try {
      localStorage.setItem('asae_voting_fraud_alerts', JSON.stringify(votingFraudAlerts));
    } catch (e) {}
  }, [votingFraudAlerts]);

  React.useEffect(() => {
    try {
      localStorage.setItem('asae_vote_audits', JSON.stringify(voteAudits));
    } catch (e) {}
  }, [voteAudits]);

  // Evaluation Judges Panel
  const [votingJudges, setVotingJudges] = useState<VotingJudge[]>([
    { id: 'JDG-01', name: 'Justice Sandile Ngcobo', category: 'Business Leader of the Year', scoreLeadership: 95, scoreInnovation: 90, scoreImpact: 92, scoreGrowth: 88, comments: 'Antonio shows exceptional pan-African leadership values and high ethical compliance.', hasConflict: false, isSubmitted: true },
    { id: 'JDG-02', name: 'Maria do Carmo', category: 'Business Leader of the Year', scoreLeadership: 88, scoreInnovation: 94, scoreImpact: 90, scoreGrowth: 92, comments: 'Sarah’s financial technology model is a masterclass in cross-border accessibility.', hasConflict: false, isSubmitted: true },
    { id: 'JDG-03', name: 'Prof. Joao Carvalho', category: 'Young Entrepreneur of the Year', scoreLeadership: 90, scoreInnovation: 95, scoreImpact: 88, scoreGrowth: 94, comments: 'Lando’s localized agricultural software provides a magnificent community blueprint.', hasConflict: false, isSubmitted: true },
    { id: 'JDG-04', name: 'Zanele Ndlovu', category: 'Sustainability Champion', scoreLeadership: 85, scoreInnovation: 80, scoreImpact: 90, scoreGrowth: 85, comments: 'Lobito project demonstrates brilliant carbon reduction projections.', hasConflict: true, isSubmitted: false }
  ]);

  // Awards night locks Status
  const [awardsNightCtrl, setAwardsNightCtrl] = useState({
    winnersLocked: false,
    auditCleared: true,
    resultsEncrypted: false,
    scheduledRevealTime: '2026-06-25 19:30:00',
    certificatesDispatched: 0,
    trophiesTracked: 'In Transit to Cape Town Int. Convention Centre'
  });

  // Helper utility to show dynamic toast
  const triggerToast = (text: string, subtext?: string, type: 'success' | 'alert' = 'success') => {
    setNotification({ text, subtext, type });
    setTimeout(() => setNotification(null), 6000);
  };

  // Switch Sub-Tab Helper
  const handleMarketingNav = (sub: 'campaigns' | 'compose' | 'subscribers' | 'unsubscriptions') => {
    setMarketingSubTab(sub);
  };

  // Nomination Approval helper (includes real email dispatch log generation!)
  const handleNominationAction = (id: string, action: 'Approved' | 'Rejected') => {
    const updated = nominations.map(nom => {
      if (nom.id === id) {
        return { ...nom, status: action };
      }
      return nom;
    });
    setNominations(updated);
    try {
      localStorage.setItem('asae_nominations', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to write updated nominations:', e);
    }

    const target = nominations.find(n => n.id === id);
    if (target) {
      // Save updated nomination to Supabase if configured
      saveSupabaseNomination({ ...target, status: action });

      // Generate email logs for nominee and nominator
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      
      const emailForNominee: MailLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowStr,
        to: target.nomineeEmail,
        recipientType: 'Nominee',
        subject: action === 'Approved' 
          ? `CONGRATULATIONS: Your ASAE Excellence Nomination Has Been Approved!` 
          : `ASAE Excellence Nomination Status Notification`,
        type: action,
        status: 'Delivered'
      };

      const emailForNominator: MailLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: nowStr,
        to: target.nominatorEmail,
        recipientType: 'Nominator',
        subject: `ASAE Nomination Status: Status Updated for ${target.nomineeName}`,
        type: action,
        status: 'Delivered'
      };

      setMailLogs(prev => [emailForNominee, emailForNominator, ...prev]);
      
      // Update selected states to maintain view
      if (selectedNomination && selectedNomination.id === id) {
        setSelectedNomination({ ...selectedNomination, status: action });
      }

      triggerToast(
        `Nomination Successfully ${action}!`,
        `Outbound SMTP notification emails have been drafted and dispatched to [${target.nomineeEmail}] and [${target.nominatorEmail}] autonomously.`
      );
    }
  };

  // Launch Marketing Campaign Helper
  const handleLaunchCampaign = () => {
    if (!newCampaignName || !newCampaignSubject || !newCampaignBody) {
      triggerToast('Validation Error', 'Please satisfy all campaign constraints, including subject and payload body.', 'alert');
      return;
    }

    const size = newCampaignSegment.includes('4500') ? 4500 : newCampaignSegment.includes('1240') ? 1240 : 35;
    
    // Simulate high conversion open rates
    const open = parseFloat((45 + Math.random() * 45).toFixed(1));
    const click = parseFloat((10 + Math.random() * 30).toFixed(1));
    const replies = Math.floor(size * (click / 300));

    const newCamp: Campaign = {
      id: `CMP-00${campaigns.length + 1}`,
      name: newCampaignName,
      subject: newCampaignSubject,
      segment: newCampaignSegment,
      status: 'Active',
      sentCount: size,
      openRate: open,
      clickRate: click,
      replies: replies,
      body: newCampaignBody,
      dateCreated: new Date().toISOString().substring(0, 10)
    };

    setCampaigns([newCamp, ...campaigns]);

    // Dispatch a simulated SMTP log
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: MailLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowStr,
      to: `Broadcast [${newCampaignSegment}]`,
      recipientType: 'Nominee',
      subject: newCampaignSubject,
      type: 'Campaign',
      status: 'Delivered'
    };
    setMailLogs(prev => [newLog, ...prev]);

    // Reset Form
    setNewCampaignName('');
    setNewCampaignSubject('');
    setNewCampaignBody('');
    
    // Auto shift back to campaigns tab
    setMarketingSubTab('campaigns');

    triggerToast(
      'Campaign Live 🚀',
      `Transmitting campaign dispatch to ${size} recipients in audience category.`
    );
  };

  // Toggle Campaign Status
  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus: Campaign['status'] = c.status === 'Active' ? 'Paused' : c.status === 'Paused' ? 'Active' : 'Completed';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    triggerToast('Campaign Updated', 'The tracking engine updated target sequence dispatch states.');
  };

  // Delete Campaign
  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    triggerToast('Campaign Removed', 'The target sequence has setup logs removed from queue.');
  };

  // Add Custom Subscriber Manually
  const [subEmailInput, setSubEmailInput] = useState('');
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmailInput || !subEmailInput.includes('@')) {
      triggerToast('Invalid Email', 'Please input a coherent recipient address.', 'alert');
      return;
    }
    const newSub: Subscriber = {
      id: `SUB-${subscribers.length + 1}`,
      email: subEmailInput,
      source: 'Manual Admin Entry',
      dateAdded: new Date().toISOString().substring(0, 10),
      status: 'Subscribed'
    };
    setSubscribers([newSub, ...subscribers]);
    setSubEmailInput('');
    triggerToast('Subscriber Added', `Pushed ${newSub.email} securely into campaign newsletter audience.`);
  };

  // Remove Subscriber
  const handleRemoveSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    triggerToast('Subscriber Opted-Out', 'Mailing permission revoked for specified subscriber profile.');
  };

  // Unsubscribe Requests Handling
  const handleApproveUnsubscribe = (requestId: string, email: string) => {
    setUnsubscribeRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
    setSubscribers(prev => prev.map(s => s.email === email ? { ...s, status: 'Unsubscribed' } : s));
    triggerToast('Unsubscribe Approved', `${email} has been unsubscribed from sequences.`);
  };

  const handleRejectUnsubscribe = (requestId: string, email: string) => {
    setUnsubscribeRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
    triggerToast('Unsubscribe Denied', `The unsubscription appeal for ${email} has been rejected.`);
  };

  // Membership Actions
  const handleCountryChange = (c: 'South Africa' | 'Angola') => {
    setNewMemberCountry(c);
    setNewMemberRegion(c === 'Angola' ? 'Luanda' : 'Gauteng');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) {
      triggerToast('Error', 'Please fill in both name and email of candidate.', 'alert');
      return;
    }
    const newMember: Member = {
      id: `MEM-${Math.floor(200 + Math.random() * 700)}`,
      name: newMemberName,
      email: newMemberEmail,
      country: newMemberCountry,
      region: newMemberRegion,
      type: newMemberType,
      status: 'Pending',
      membershipTier: newMemberTier,
      joinDate: new Date().toISOString().substring(0, 10),
      paymentRecord: {
        amount: newMemberFee,
        status: 'Pending',
        invoiceNumber: `INV-MEM-2026-${Math.floor(10 + Math.random() * 89)}`,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
      }
    };
    setMembers([newMember, ...members]);
    setNewMemberName('');
    setNewMemberEmail('');
    triggerToast('Member Created', `${newMemberName} registered securely.`);
  };

  const handleApproveMember = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { 
      ...m, 
      status: 'Approved',
      paymentRecord: { ...m.paymentRecord, status: 'Paid' } 
    } : m));
    triggerToast('Member Approved', 'Membership active, payment mark processed.');
  };

  const handleRejectMember = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { 
      ...m, 
      status: 'Rejected',
      paymentRecord: { ...m.paymentRecord, status: 'Unpaid' } 
    } : m));
    triggerToast('Member Rejected', 'Application status marked as rejected.');
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    triggerToast('Member Removed', 'Specified profile eradicated from registries.');
  };

  // Blog & Digital Magazine CRUD
  const handleSaveBlogPost = () => {
    if (!newPostTitle || !newPostContent || !newPostExcerpt) {
      triggerToast('Form Validation Failed', 'Please include all critical information, including editorial body.', 'alert');
      return;
    }

    if (editingPostId) {
      // Edit mode
      const updatedPost = {
        id: editingPostId,
        title: newPostTitle,
        category: newPostCategory,
        excerpt: newPostExcerpt,
        content: newPostContent,
        type: newPostType,
        status: newPostStatus,
        image: newPostImage
      };
      setPosts(prev => prev.map(p => p.id === editingPostId ? { ...p, ...updatedPost } : p));
      saveSupabaseBlog(updatedPost);
      setEditingPostId(null);
      triggerToast('Editorial Updated', 'Successfully modified published post details on real-time server mockup.');
    } else {
      // Create mode
      const newPost: BlogPost = {
        id: `PST-${posts.length + 10}`,
        title: newPostTitle,
        category: newPostCategory,
        author: 'Super Admin Editorial Desk',
        excerpt: newPostExcerpt,
        content: newPostContent,
        image: newPostImage,
        type: newPostType,
        status: newPostStatus,
        dateCreated: new Date().toISOString().substring(0, 10),
        views: 0
      };
      setPosts([newPost, ...posts]);
      saveSupabaseBlog(newPost);
      triggerToast('Article Published! 📰', `Digital ${newPostType} issue added to corporate publishing index.`);
    }

    // Reset Form
    setNewPostTitle('');
    setNewPostExcerpt('');
    setNewPostContent('');
    setNewPostType('Blog');
    setNewPostStatus('Published');
    setNewPostImage('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800');
  };

  const handleEditBlogSelect = (post: BlogPost) => {
    setEditingPostId(post.id);
    setNewPostTitle(post.title);
    setNewPostCategory(post.category);
    setNewPostExcerpt(post.excerpt);
    setNewPostContent(post.content);
    setNewPostType(post.type);
    setNewPostStatus(post.status);
    setNewPostImage(post.image);
    triggerToast('Editing Mode', `Editing ${post.title}. Use the form below to apply changes.`);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (supabase) {
      supabase.from('blogs').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Failed to delete blog from Supabase:', error);
      });
    }
    triggerToast('Post Destroyed', 'Permanently expunged the newsletter article file and public feed endpoints.');
  };

  // Ad Server CRUD
  const handleSaveAd = () => {
    if (!newAdTitle || !newAdImage) {
      triggerToast('Form Validation Failed', 'Please include both a title and an image URL for the advertisement.', 'alert');
      return;
    }

    if (editingAdId) {
      const updatedAd = {
        id: editingAdId,
        title: newAdTitle,
        image: newAdImage,
        placement: newAdPlacement
      };
      setAds(prev => prev.map(a => a.id === editingAdId ? { ...a, ...updatedAd } : a));
      saveSupabaseAd(updatedAd);
      setEditingAdId(null);
      triggerToast('Ad Updated', `Successfully updated advertisement: '${newAdTitle}'`);
    } else {
      const newAd: Advertisement = {
        id: `AD-${ads.length + 10}`,
        title: newAdTitle,
        image: newAdImage,
        placement: newAdPlacement,
        dateCreated: new Date().toISOString().substring(0, 10),
        clicks: 0,
        impressions: 0
      };
      setAds([newAd, ...ads]);
      saveSupabaseAd(newAd);
      triggerToast('Ad Created! 📢', `New ad banner '${newAdTitle}' is live in placement '${newAdPlacement}'.`);
    }

    // Reset Form
    setNewAdTitle('');
    setNewAdImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
    setNewAdPlacement('Homepage Hero');
  };

  const handleEditAdSelect = (ad: Advertisement) => {
    setEditingAdId(ad.id);
    setNewAdTitle(ad.title);
    setNewAdImage(ad.image);
    setNewAdPlacement(ad.placement);
    triggerToast('Ad Editing Mode', `Editing advertisement '${ad.title}'. Make your edits in the form.`);
  };

  const handleDeleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    if (supabase) {
      supabase.from('ads').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Failed to delete ad from Supabase:', error);
      });
    }
    triggerToast('Ad Removed', 'Successfully removed advertisement from rotation campaigns.');
  };

  // Drag over drop simulation helper
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDropMock = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Random beautiful business graphics to make drops highly responsive
    const randomCovers = [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
    ];
    setNewPostImage(randomCovers[Math.floor(Math.random() * randomCovers.length)]);
    triggerToast('File Uploaded Successfully', 'Cover banner file analyzed and visual thumbnail assigned successfully.');
  };

  // Toggle Executive Task Helper
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, done: !t.done };
      }
      return t;
    }));
  };

  // Add Executive Task Helper
  const [taskInput, setTaskInput] = useState('');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    const newTask: Task = {
      id: `TSK-${tasks.length + 1}`,
      text: taskInput.trim(),
      done: false,
      priority: taskPriority
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
    triggerToast('Executive Action Logged', 'Task pushed onto pending operational schedules list.');
  };

  // Currency Converter Helpers
  const formatValue = (zarAmount: number) => {
    if (currency === 'ZAR') {
      return `R ${zarAmount.toLocaleString()}`;
    } else {
      const aoaVal = zarAmount * exchangeRate;
      return `Kz ${aoaVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
  };

  // Financial Ledger Computations
  const totalRevenueZar = transactions.reduce((sum, current) => sum + current.amount, 0);
  const netCommissionFeesZar = totalRevenueZar * 0.035; // 3.5% transaction cost modeling
  const netProfitZar = totalRevenueZar - netCommissionFeesZar - 120000; // Deducting corporate stage production costs

  return (
    <div className="min-h-screen bg-dark w-full fixed inset-0 z-50 flex overflow-hidden font-sans text-ivory">
      {/* Dynamic Toast System */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -40, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[450px] max-w-[90vw] rounded-xl border p-4 shadow-2xl flex gap-3 ${
              notification.type === 'success' 
                ? 'bg-dark-card border-sa-green/30 text-ivory shadow-sa-green/5' 
                : 'bg-dark-card border-angola-red/30 text-ivory shadow-angola-red/5'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              notification.type === 'success' ? 'bg-sa-green/10 text-sa-green' : 'bg-angola-red/10 text-angola-red'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs uppercase tracking-wider">{notification.text}</h4>
              {notification.subtext && <p className="text-xs text-dim mt-1 font-sans leading-relaxed">{notification.subtext}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <div className="w-64 bg-dark-card border-r border-white/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="font-serif text-xl tracking-widest text-gold-pale font-bold uppercase leading-none flex items-center gap-2">
            <Sparkles size={18} className="text-gold animate-pulse" />
            <span>ASAE Admin</span>
          </div>
          <div className="text-[10px] tracking-widest text-dim uppercase mt-1">Super Control Center</div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Default subtabs if switching to marketing
                  if (tab.id === 'marketing') setMarketingSubTab('campaigns');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-gold/10 text-gold border border-gold/20' 
                    : 'text-dim hover:text-ivory hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span className="text-[11px] font-bold tracking-widest uppercase">{tab.label}</span>
                </div>
                {tab.id === 'nominations' && nominations.filter(n => n.status === 'Pending').length > 0 && (
                  <span className="bg-gold text-dark font-sans font-bold text-[9px] px-1.5 py-0.5 rounded-full">
                    {nominations.filter(n => n.status === 'Pending').length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Global Currency Switcher in Sidebar footer */}
        <div className="mx-4 p-3 bg-white/5 border border-white/5 rounded-xl mb-3">
          <div className="text-[9px] uppercase tracking-widest text-dim text-center mb-2 font-bold flex items-center justify-center gap-1">
            <RefreshCw size={10} className="text-gold" /> System Currency Converter
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              onClick={() => { setCurrency('ZAR'); triggerToast('ZAR Selected', 'Display switched to South African Rand (R)'); }}
              className={`py-1 text-[10px] rounded font-bold uppercase ${currency === 'ZAR' ? 'bg-gold text-dark' : 'bg-white/5 text-dim'}`}
            >
              ZAR (R)
            </button>
            <button 
              onClick={() => { setCurrency('AOA'); triggerToast('AOA Selected', `Currency displays 1 ZAR = 45 AOA (Angolan Kwanza).`); }}
              className={`py-1 text-[10px] rounded font-bold uppercase ${currency === 'AOA' ? 'bg-gold text-dark' : 'bg-white/5 text-dim'}`}
            >
              AOA (Kz)
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-dim hover:text-angola-red hover:bg-angola-red/10 rounded-xl transition-all"
          >
            <LogOut size={16} />
            <span className="text-[11px] font-bold tracking-widest uppercase">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col bg-dark overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 bg-dark-card/50 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl font-bold text-ivory capitalize">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="text-[10px] bg-white/10 text-ivory/80 px-2 py-0.5 rounded font-mono font-bold tracking-wider">
              100% SECURE TERMINAL
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
              <input 
                type="text" 
                placeholder="Secure lookup query..." 
                className="bg-dark/80 border border-white/15 rounded-lg pl-9 pr-4 py-2 text-xs text-ivory focus:border-gold outline-none w-56"
              />
            </div>
            <button className="relative text-dim hover:text-ivory transition-colors" onClick={() => triggerToast('All Sync Green', 'No critical systems alert detected.')}>
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-angola-red rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right">
                <div className="text-xs font-bold text-ivory">Simao Dias</div>
                <div className="text-[9px] text-gold uppercase tracking-widest font-mono">Super Admin</div>
              </div>
              <div className="w-9 h-9 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center text-gold font-bold font-serif shadow-lg">
                SD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Interface */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            
            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Executive Scorecards */}
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Total Registrants', value: subscribers.length + 1200, trend: '+15.4% week metric', text: 'Active database growth' },
                    { label: 'Pending Panel Cases', value: nominations.filter(n => n.status === 'Pending').length, trend: 'Requires instant peer audits', text: 'Nominations queue status' },
                    { label: 'Aggregate Inflow', value: formatValue(totalRevenueZar), trend: '+22.4% sponsorship pipelines', text: 'Gross contract values' },
                    { label: 'Audience Subscriptions', value: subscribers.length * 90, trend: '+12 added newsletter', text: 'Campaign outbound list' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all hover:border-gold/20">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gold/5 pointer-events-none"></div>
                      <div className="text-[9px] uppercase tracking-widest text-dim mb-4 font-bold font-mono">{stat.label}</div>
                      <div className="font-serif text-2xl font-bold text-ivory mb-2">{stat.value}</div>
                      <div className="text-[10px] text-sa-green flex items-center gap-1 font-mono">
                        <TrendingUp size={12} /> {stat.trend}
                      </div>
                      <p className="text-[10px] text-dim mt-2 font-mono">{stat.text}</p>
                    </div>
                  ))}
                </div>

                {/* Analytical Graphs & Executive Decision Widget Grid */}
                <div className="grid grid-cols-3 gap-8">
                  {/* Executive Goal Trackers & System Pipeline Breakdown */}
                  <div className="col-span-2 bg-dark-card border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-gold-pale">ASAE Strategic Performance Audits</h3>
                          <p className="text-[11px] text-dim tracking-wide">Real-time goals, registration milestones, and structural threshold monitors.</p>
                        </div>
                        <span className="text-[9px] bg-sa-green/10 text-sa-green font-mono px-2 py-0.5 rounded font-bold tracking-wider">ALL TARGETS ON-SCHEDULE</span>
                      </div>

                      <div className="space-y-5">
                        {/* Goal Progress Bar #1 */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-ivory">ASAE Corporate Table Target (ZAR 1.2M Cap Goal)</span>
                            <span className="text-gold font-bold">78% Achieved ({formatValue(totalRevenueZar)})</span>
                          </div>
                          <div className="w-full bg-dark h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-gradient-to-r from-gold via-gold-pale to-sa-green h-full rounded-full transition-all" style={{ width: '78%' }}></div>
                          </div>
                        </div>

                        {/* Goal Progress Bar #2 */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-ivory">Nomination Panel Review Milestone</span>
                            <span className="text-sa-green font-bold">100% Audited (2/4 Cases Addressed)</span>
                          </div>
                          <div className="w-full bg-dark h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-sa-green h-full rounded-full transition-all" style={{ width: '50%' }}></div>
                          </div>
                        </div>

                        {/* Goal Progress Bar #3 */}
                        <div>
                          <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-ivory">Event Seat Reservations capacity (1,500 threshold)</span>
                            <span className="text-ivory/80 font-bold">82% Cap Secured (1,240 attendees)</span>
                          </div>
                          <div className="w-full bg-dark h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-white/45 h-full rounded-full transition-all" style={{ width: '820px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Integrated mini KPI Panel */}
                    <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4">
                      <div className="bg-dark p-3 rounded-lg border border-white/5 text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Pending Task Weight</div>
                        <div className="font-mono text-base font-bold text-angola-red mt-1">{tasks.filter(t => !t.done).length} Tasks</div>
                      </div>
                      <div className="bg-dark p-3 rounded-lg border border-white/5 text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Outbound SMTP Volume</div>
                        <div className="font-mono text-base font-bold text-sa-green mt-1">2,410 Messages Passed</div>
                      </div>
                      <div className="bg-dark p-3 rounded-lg border border-white/5 text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">System Gateway Health</div>
                        <div className="font-mono text-base font-bold text-gold mt-1">99.98% Latency</div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Live Check List & Tasks Widget */}
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                        <h3 className="text-xs uppercase tracking-widest text-gold-pale font-bold font-mono">My Action Schedules</h3>
                        <span className="text-[9px] text-dim">{tasks.filter(t => !t.done).length} Left</span>
                      </div>

                      {/* Add Action Input */}
                      <form onSubmit={handleAddTask} className="mb-4 space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Add strategic log item..." 
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            className="bg-dark border border-white/10 rounded-lg p-2 text-xs text-ivory outline-none focus:border-gold grow"
                          />
                          <button type="submit" className="p-2 bg-gold hover:bg-gold-light text-dark rounded-lg transition-colors">
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex gap-1">
                          {(['High', 'Medium', 'Low'] as const).map(prio => (
                            <button
                              key={prio}
                              type="button"
                              onClick={() => setTaskPriority(prio)}
                              className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                                taskPriority === prio ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-white/5 text-dim'
                              }`}
                            >
                              {prio}
                            </button>
                          ))}
                        </div>
                      </form>

                      {/* Executive Action Loop */}
                      <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                        {tasks.map(task => (
                          <div key={task.id} className="flex gap-3 text-xs border-b border-white/5 pb-2.5 items-start justify-between">
                            <div className="flex gap-2 items-center">
                              <button 
                                onClick={() => toggleTask(task.id)}
                                className={`w-3.5 h-3.5 border rounded flex items-center justify-center transition-colors ${
                                  task.done ? 'bg-sa-green/20 border-sa-green text-sa-green' : 'border-white/20 hover:border-gold'
                                }`}
                              >
                                {task.done && <Check size={10} />}
                              </button>
                              <span className={`text-[11px] ${task.done ? 'line-through text-dim' : 'text-ivory'}`}>
                                {task.text}
                              </span>
                            </div>
                            <span className={`text-[8px] px-1 rounded uppercase font-bold font-mono ${
                              task.priority === 'High' ? 'bg-angola-red/10 text-angola-red' :
                              task.priority === 'Medium' ? 'bg-gold/10 text-gold' : 'bg-white/10 text-dim'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[10px] bg-white/5 p-3 rounded-lg text-dim text-center mt-4">
                      💡 Operational checklists persist throughout current login duration.
                    </div>
                  </div>
                </div>

                {/* Live SMTP Dispatch Console (Demonstrates deep real-time logs!) */}
                <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-ivory">Outbound Email Dispatch Center (ASAE Secure Mail Relay)</h3>
                      <p className="text-[11px] text-dim">Real-time logs showing notifications triggered by your panel review approvals, rejections, and outbound Apollo marketing blasts.</p>
                    </div>
                    <button className="text-[11px] text-gold tracking-widest font-bold uppercase hover:text-gold-light" onClick={() => triggerToast('System Resynced', 'Mail queues cleared.')}>
                      Clear Relays
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Live Terminal logs */}
                    <div className="bg-dark rounded-xl p-4 font-mono text-[10px] text-ivory/80 space-y-2 h-44 overflow-y-auto border border-white/10 shadow-inner">
                      <div className="text-dim">--- INITIALIZING ASAE AUTHENTICATED SMTP DISPATCH ---</div>
                      {mailLogs.map((log) => (
                        <div key={log.id} className="border-b border-white/5 pb-1">
                          <span className="text-gold font-bold">[{log.timestamp}]</span>{' '}
                          <span className="text-sa-green">RELAY {log.id}</span> dispatched safely to{' '}
                          <span className="text-white underline">{log.to}</span>. Status: <span className="text-sa-green font-bold">[DELIVERED via SES]</span>
                          <div className="text-[9px] text-dim truncate">Subject: '{log.subject}'</div>
                        </div>
                      ))}
                    </div>

                    {/* Rich Layout of Last Drafted Template */}
                    <div className="bg-dark/60 rounded-xl p-4 border border-white/5 flex flex-col justify-between h-44 text-xs font-sans">
                      <div className="text-left">
                        <div className="text-[9px] uppercase tracking-widest text-dim mb-1 font-bold">SMTP Dispatch Live Preview</div>
                        <div className="bg-dark-card border border-white/10 p-2.5 rounded text-[11px] font-sans space-y-1">
                          <p><strong className="text-gold">Sender:</strong> secretariat@excellence.asae.org</p>
                          <p><strong className="text-gold">Recipient Target:</strong> {mailLogs[0]?.to || 'No Outbound Dispatch'}</p>
                          <p><strong className="text-gold">Outbound Subject:</strong> {mailLogs[0]?.subject || 'Awaiting Action'}</p>
                          <p className="border-t border-white/5 mt-1.5 pt-1.5 text-dim italic truncate">
                            "ASAE peer committees have evaluated regional cases... Outstanding standards achieved..."
                          </p>
                        </div>
                      </div>
                      <div className="text-[9px] text-dim text-right font-mono">⚡ Secure SMTP Relay Active</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- END OVERVIEW TAB --- */}


            {/* --- USERS & LOGINS TAB --- */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gold-pale">ASAE Member Directories</h3>
                      <p className="text-xs text-dim mt-0.5">Comprehensive tracking of authentic members, sponsor roles, and audit access permissions.</p>
                    </div>
                    <button className="px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-bold uppercase transition-all tracking-wider" onClick={() => triggerToast('Syncing Complete', 'Refreshed users list.')}>
                      Sync with Live Directories
                    </button>
                  </div>

                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                        <th className="p-4">Staff Member / Registrant</th>
                        <th className="p-4">Email Contact</th>
                        <th className="p-4">Assigned Role Segment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Security Access Date</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-ivory divide-y divide-white/5">
                      {[
                        { name: 'Simao Dias', email: 'simao@neurogrowthlabs.co.za', role: 'Super Admin', status: 'Active', date: '2026-01-10', count: 'Console Master' },
                        { name: 'Dr. John Smith', email: 'john@example.com', role: 'Premium Member VIP', status: 'Active', date: '2026-06-15', count: 'Paid VIP attendee' },
                        { name: 'Anna Bel', email: 'anna@example.com', role: 'Sponsor Delegate', status: 'Pending Approval', date: '2026-06-16', count: 'Requires registration confirmation' },
                        { name: 'Carlos Santos', email: 'carlos@example.com', role: 'Registered Member', status: 'Active', date: '2026-06-17', count: 'Standard ticket holder' },
                        { name: 'Prof. Faster Media Desk', email: 'profastermedia@gmail.com', role: 'Super Admin Staff', status: 'Active', date: '2026-06-18', count: 'Platform developer interface' }
                      ].map((u, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-serif font-bold text-ivory">{u.name}</div>
                            <div className="text-[10px] text-dim font-mono">{u.count}</div>
                          </td>
                          <td className="p-4 text-dim font-mono text-xs">{u.email}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-wide text-gold-pale uppercase">
                              {u.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs ${u.status === 'Active' ? 'text-sa-green' : 'text-gold'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-sa-green animate-pulse' : 'bg-gold'}`}></div>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4 text-dim font-mono text-xs">{u.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- EMAIL MARKETING TAB (Apollo.io Style) --- */}
            {activeTab === 'marketing' && (
              <motion.div
                key="marketing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Internal Marketing Navigation Banners */}
                <div className="flex gap-4 border-b border-white/5 pb-4">
                  <button 
                    onClick={() => handleMarketingNav('campaigns')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      marketingSubTab === 'campaigns' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                    }`}
                  >
                    Campaign Dashboard ({campaigns.length})
                  </button>
                  <button 
                    onClick={() => handleMarketingNav('compose')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      marketingSubTab === 'compose' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                    }`}
                  >
                    Compose Email Sequence 🚀
                  </button>
                  <button 
                    onClick={() => handleMarketingNav('subscribers')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                      marketingSubTab === 'subscribers' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                    }`}
                  >
                    Mailing Subscribers ({subscribers.length})
                  </button>
                  <button 
                    onClick={() => handleMarketingNav('unsubscriptions')}
                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all relative ${
                      marketingSubTab === 'unsubscriptions' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                    }`}
                  >
                    Unsubscribe Appeals ({unsubscribeRequests.filter(r => r.status === 'Pending').length})
                    {unsubscribeRequests.filter(r => r.status === 'Pending').length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-angola-red w-4 h-4 rounded-full text-[8px] font-sans font-bold text-ivory flex items-center justify-center animate-pulse">
                        {unsubscribeRequests.filter(r => r.status === 'Pending').length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab Window #1: CAMPAIGNS LISTING (Apollo.io Style Tracking) */}
                {marketingSubTab === 'campaigns' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-4">
                      {/* Live Apollo aggregates */}
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Total Outreach</div>
                        <div className="text-xl font-serif font-bold text-ivory mt-1">4,535</div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Avg Open Rate</div>
                        <div className="text-xl font-serif font-bold text-sa-green mt-1">73.4%</div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Click-Through Rate</div>
                        <div className="text-xl font-serif font-bold text-gold mt-1">34.9%</div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">Active Sequences</div>
                        <div className="text-xl font-serif font-bold text-ivory mt-1">1 Enabled</div>
                      </div>
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center">
                        <div className="text-[9px] uppercase tracking-widest text-dim">SMTP Queue Status</div>
                        <div className="text-xl font-serif font-bold text-sa-green mt-1 font-mono">READY</div>
                      </div>
                    </div>

                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <h3 className="font-serif text-lg font-bold text-ivory">Apollo.io Style Email Outbound Campaigns</h3>
                        <span className="text-xs text-dim">Full Tracking sequences enabling early triggers and followups.</span>
                      </div>

                      <div className="p-6 space-y-4">
                        {campaigns.map((camp) => (
                          <div key={camp.id} className="p-5 bg-dark border border-white/5 rounded-xl flex items-center justify-between gap-6 transition-all hover:border-gold/20">
                            <div className="grow space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-gold font-bold">[{camp.id}]</span>
                                <h4 className="font-serif text-base font-bold text-ivory">{camp.name}</h4>
                                <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-mono font-bold ${
                                  camp.status === 'Active' ? 'bg-sa-green/20 text-sa-green animate-pulse' :
                                  camp.status === 'Completed' ? 'bg-white/20 text-ivory' :
                                  camp.status === 'Draft' ? 'bg-white/5 text-dim' : 'bg-gold/20 text-gold'
                                }`}>
                                  {camp.status}
                                </span>
                              </div>
                              <p className="text-xs text-dim italic truncate max-w-lg">Subject: "{camp.subject}"</p>
                              <div className="text-[10px] text-dim flex gap-4 font-mono">
                                <span>Segment Category: <strong>{camp.segment}</strong></span>
                                <span>Dispatched: <strong>{camp.dateCreated}</strong></span>
                              </div>
                            </div>

                            {/* Aggregates representation */}
                            <div className="grid grid-cols-4 gap-6 shrink-0 w-80 text-center border-l border-white/10 pl-6 h-12 items-center">
                              <div>
                                <div className="text-[8px] text-dim uppercase">SENT</div>
                                <div className="text-xs font-mono font-bold text-ivory">{camp.sentCount}</div>
                              </div>
                              <div>
                                <div className="text-[8px] text-dim uppercase">OPEN %</div>
                                <div className="text-xs font-mono font-bold text-sa-green">{camp.openRate}%</div>
                              </div>
                              <div>
                                <div className="text-[8px] text-dim uppercase">CLICK %</div>
                                <div className="text-xs font-mono font-bold text-gold">{camp.clickRate}%</div>
                              </div>
                              <div>
                                <div className="text-[8px] text-dim uppercase">REPLIES</div>
                                <div className="text-xs font-mono font-bold text-ivory">{camp.replies}</div>
                              </div>
                            </div>

                            {/* Apollo sequences management buttons */}
                            <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                              <button 
                                onClick={() => toggleCampaignStatus(camp.id)}
                                title={camp.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-ivory transition-colors"
                              >
                                {camp.status === 'Active' ? <XCircle size={14} className="text-gold" /> : <CheckCircle2 size={14} className="text-sa-green" />}
                              </button>
                              <button 
                                onClick={() => deleteCampaign(camp.id)}
                                title="Purge Sequence"
                                className="p-1.5 bg-angola-red/10 hover:bg-angola-red/20 rounded text-angola-red transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Window #2: COMPOSE CAMPAIGN */}
                {marketingSubTab === 'compose' && (
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl max-w-4xl">
                    <div className="border-b border-white/5 pb-4">
                      <h3 className="font-serif text-lg font-bold text-gold-pale">Apollo Outbound Composer</h3>
                      <p className="text-xs text-dim">Draft dynamic campaign emails utilizing automatic regional mail merges.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-dim mb-2 font-mono">Campaign Reference Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Early Bird VIP Seat Marketing Blast" 
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          className="w-full bg-dark border border-white/15 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-dim mb-2 font-mono">Target Recipient Audience</label>
                        <select 
                          value={newCampaignSegment}
                          onChange={(e) => setNewCampaignSegment(e.target.value)}
                          className="w-full bg-dark border border-white/15 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold appearance-none"
                        >
                          <option>All Newsletter Subscribers (4500)</option>
                          <option>Registered Members Only (1240)</option>
                          <option>Partners & Sponsors (35)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-dim mb-2 font-mono">Outbound Subject Line</label>
                      <input 
                        type="text" 
                        placeholder="e.g., [VIP Access Inside] Limited Platinum seats remaining for ASAE Excellence Summit" 
                        value={newCampaignSubject}
                        onChange={(e) => setNewCampaignSubject(e.target.value)}
                        className="w-full bg-dark border border-white/15 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold transition-all" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs uppercase tracking-widest text-dim font-mono">Marketing Body Payload (supports rich editor)</label>
                        <span className="text-[10px] text-gold font-mono">⚡ Multi-stage Apollo workflow ready</span>
                      </div>
                      <textarea 
                        rows={8} 
                        placeholder="Dear Professional, your stellar profile leads SADC states... We invite you to access VIP forums..." 
                        value={newCampaignBody}
                        onChange={(e) => setNewCampaignBody(e.target.value)}
                        className="w-full bg-dark border border-white/15 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold resize-none transition-all font-sans"
                      ></textarea>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5 gap-4">
                      <button 
                        onClick={() => handleMarketingNav('campaigns')}
                        className="px-6 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/5 transition-colors"
                      >
                        Cancel Composer
                      </button>
                      <button 
                        onClick={handleLaunchCampaign}
                        className="px-8 py-3 bg-gold text-dark font-bold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-gold-light transition-all shadow-lg shadow-gold/5"
                      >
                        <Send size={14} /> Launch Apollo Sequence
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab Window #3: SUBSCRIBERS DIRECTORY (With fast append feature) */}
                {marketingSubTab === 'subscribers' && (
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 h-fit space-y-4">
                      <h3 className="font-serif text-base font-bold text-gold-pale">Inject Direct Recipient</h3>
                      <p className="text-[11px] text-dim">Add manual subscribers to the live mailing sequence database instantly.</p>
                      
                      <form onSubmit={handleAddSubscriber} className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Subscriber Email Address</label>
                          <input 
                            type="email" 
                            placeholder="executive@sadc-leadership.net" 
                            value={subEmailInput}
                            onChange={(e) => setSubEmailInput(e.target.value)}
                            required
                            className="w-full bg-dark border border-white/10 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold transition-all" 
                          />
                        </div>
                        <button type="submit" className="w-full py-3 bg-gold hover:bg-gold-light text-dark font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2">
                          <Plus size={14} /> Commit Entry
                        </button>
                      </form>
                    </div>

                    <div className="col-span-2 bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                            <th className="p-4">Email Address</th>
                            <th className="p-4">Reference Source</th>
                            <th className="p-4">Timestamp Committed</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Settings</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-ivory divide-y divide-white/5">
                          {subscribers.map((sub) => (
                            <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-mono text-xs font-bold text-ivory">{sub.email}</td>
                              <td className="p-4 text-xs text-dim">{sub.source}</td>
                              <td className="p-4 text-xs text-dim font-mono">{sub.dateAdded}</td>
                              <td className="p-4 text-center">
                                <span className={`border px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${
                                  sub.status === 'Subscribed' 
                                    ? 'bg-sa-green/10 text-sa-green border-sa-green/20' 
                                    : 'bg-angola-red/10 text-angola-red border-angola-red/20'
                                }`}>
                                  {sub.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <button 
                                  onClick={() => handleRemoveSubscriber(sub.id)}
                                  className="p-1.5 hover:bg-angola-red/25 text-angola-red rounded transition-colors"
                                  title="Unsubscribe recipient profile"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Tab Window #4: UNSUBSCRIBE APPEALS (Admin alerts, approval, rejection) */}
                {marketingSubTab === 'unsubscriptions' && (
                  <div className="space-y-6">
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="font-serif text-base font-bold text-gold-pale">Unsubscription Alert Center</h3>
                          <p className="text-xs text-dim">Govern outgoing list opt-out appeals and remove permissions from corporate newsletter sequences.</p>
                        </div>
                        <span className="bg-angola-red/15 text-angola-red border border-angola-red/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                          {unsubscribeRequests.filter(r => r.status === 'Pending').length} Alerts Active
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                              <th className="p-4">Email Address</th>
                              <th className="p-4">Requested Date</th>
                              <th className="p-4">Stated Reason</th>
                              <th className="p-4 text-center">Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-ivory divide-y divide-white/5">
                            {unsubscribeRequests.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-dim text-xs font-mono">
                                  No unsubscription alerts currently configured on database.
                                </td>
                              </tr>
                            ) : (
                              unsubscribeRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-mono text-xs font-bold text-ivory">{req.email}</td>
                                  <td className="p-4 text-xs text-dim font-mono">{req.dateRequested}</td>
                                  <td className="p-4 text-xs text-dim italic">"{req.reason}"</td>
                                  <td className="p-4 text-center">
                                    <span className={`border px-2.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold ${
                                      req.status === 'Pending'
                                        ? 'bg-gold/15 text-gold border-gold/20'
                                        : req.status === 'Approved'
                                        ? 'bg-sa-green/15 text-sa-green border-sa-green/20'
                                        : 'bg-angola-red/15 text-angola-red border-angola-red/20'
                                    }`}>
                                      {req.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    {req.status === 'Pending' ? (
                                      <div className="flex justify-end gap-2">
                                        <button
                                          onClick={() => handleApproveUnsubscribe(req.id, req.email)}
                                          className="px-2.5 py-1 bg-sa-green/15 hover:bg-sa-green text-sa-green hover:text-dark border border-sa-green/25 text-[10px] font-bold uppercase tracking-wider rounded transition-all"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleRejectUnsubscribe(req.id, req.email)}
                                          className="px-2.5 py-1 bg-angola-red/15 hover:bg-angola-red text-angola-red hover:text-ivory border border-angola-red/25 text-[10px] font-bold uppercase tracking-wider rounded transition-all"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-dim font-mono italic">Resolved</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- END EMAIL MARKETING TAB --- */}


            {/* --- NEWS & BLOGS TAB (CRUD Dashboard & Digital Magazine Editor) --- */}
            {activeTab === 'blogs' && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Visual Header Grid for blogs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ivory">ASAE Global Media Hub</h3>
                    <p className="text-sm text-dim mt-0.5">Author business blogs, release premium digital magazine editions, configure advertising servers & placements.</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setBlogsSubTab('blogs')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                        blogsSubTab === 'blogs' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                      }`}
                    >
                      📰 Editorial & Blogs ({posts.length})
                    </button>
                    <button 
                      onClick={() => setBlogsSubTab('ads')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                        blogsSubTab === 'ads' ? 'bg-gold text-dark' : 'bg-white/5 text-dim hover:text-ivory'
                      }`}
                    >
                      📢 Ad Server ({ads.length})
                    </button>
                  </div>
                </div>

                {/* Sub-Tab 1: EDITORIAL & BLOGS */}
                {blogsSubTab === 'blogs' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT: Authoring Workspace */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-5 shadow-2xl">
                      <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-base font-bold text-gold-pale">
                            {editingPostId ? `Modify Resource Case: [${editingPostId}]` : 'Create ASAE Publication'}
                          </h4>
                          <p className="text-[11px] text-dim font-mono mb-1">Enter your literary contents directly into SADC servers.</p>
                        </div>
                        {editingPostId && (
                          <button 
                            onClick={() => {
                              setEditingPostId(null);
                              setNewPostTitle('');
                              setNewPostExcerpt('');
                              setNewPostContent('');
                            }}
                            className="text-[10px] text-angola-red hover:underline font-mono"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Article/Issue Scope</label>
                          <select 
                            value={newPostType}
                            onChange={(e) => setNewPostType(e.target.value as 'Blog' | 'Magazine')}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold appearance-none"
                          >
                            <option value="Blog">Peer Blog Post</option>
                            <option value="Magazine">Digital Magazine Issue</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Broad Category</label>
                          <select 
                            value={newPostCategory}
                            onChange={(e) => setNewPostCategory(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold appearance-none font-mono text-[11px]"
                          >
                            <option value="Finance & Growth font-mono">Finance & Growth</option>
                            <option value="Technology Innovator font-mono font-bold">Agro-Tech / AI</option>
                            <option value="Digital Magazine font-mono">Digital Magazine Issue</option>
                            <option value="ASAE Board Statement font-mono">ASAE Board Statement</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Editorial Title Line</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Regional trade optimization within southern boundaries" 
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold transition-all" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Card Excerpt Summary (1-2 sentences)</label>
                        <input 
                          type="text" 
                          placeholder="Providing macro insight into inter-governmental investment structures..." 
                          value={newPostExcerpt}
                          onChange={(e) => setNewPostExcerpt(e.target.value)}
                          className="w-full bg-dark border border-white/10 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold transition-all" 
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Article content (HTML & Markdown compatible)</label>
                        <textarea 
                          rows={6} 
                          placeholder="Within our 2026 strategic objectives, ASAE remains committed to tracking technology infrastructure..." 
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="w-full bg-dark border border-white/10 rounded-lg p-3 text-xs text-ivory outline-none focus:border-gold resize-none transition-all font-sans leading-relaxed"
                        ></textarea>
                      </div>

                      {/* Drag-and-drop Image Area */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Cover Graphic Banner URL</label>
                        <input 
                          type="text" 
                          value={newPostImage} 
                          onChange={(e) => setNewPostImage(e.target.value)}
                          className="w-full bg-dark border border-white/10 rounded-lg p-2 text-[11px] text-ivory outline-none focus:border-gold mb-3 font-mono"
                        />

                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDropMock}
                          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                            dragOver ? 'border-gold bg-gold/10 scale-95' : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <p className="text-[11px] uppercase tracking-wider font-bold text-gold-pale mb-1">
                            Drag and Drop Media File here
                          </p>
                          <p className="text-[10px] text-dim">Or click to select executive cover graphics from local storage (Simulated)</p>
                          {newPostImage && (
                            <div className="mt-3 flex items-center justify-center gap-2 bg-dark/80 p-1.5 rounded-lg border border-white/5 max-w-[280px] mx-auto truncate text-[10px] font-mono text-dim">
                              <span className="text-sa-green font-bold">✓ Visual thumbnail:</span> {newPostImage}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div>
                          <label className="block text-[9px] uppercase tracking-widest text-dim mb-1">Publishing Mode</label>
                          <select 
                            value={newPostStatus}
                            onChange={(e) => setNewPostStatus(e.target.value as 'Published' | 'Draft')}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2 text-xs text-ivory focus:border-gold"
                          >
                            <option value="Published">Send Public Live</option>
                            <option value="Draft">Save Draft Workspace</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button 
                            onClick={handleSaveBlogPost}
                            className="w-full py-2 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase tracking-widest font-bold rounded-lg transition-all shadow-lg text-center"
                          >
                            {editingPostId ? 'Confirm Updates ✓' : 'Commit Publication 📰'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Active Published Feed & Live Previews */}
                    <div className="space-y-6">
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl">
                        <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center">
                          <h4 className="font-serif text-sm font-bold text-ivory uppercase tracking-wider">Live SADC Media Directories</h4>
                          <span className="text-[9px] bg-gold/10 text-gold px-2 py-0.5 rounded font-mono font-bold">{posts.length} Active Pages</span>
                        </div>

                        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                          {posts.map((post) => (
                            <div key={post.id} className="p-4 bg-dark rounded-xl border border-white/5 hover:border-gold/20 transition-all flex gap-4">
                              <div className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${post.image})` }}></div>
                              <div className="grow space-y-1">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono text-gold font-bold px-1.5 py-0.5 bg-gold/5 rounded border border-gold/15 uppercase">
                                    {post.type} - {post.category}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => handleEditBlogSelect(post)}
                                      title="Edit Draft"
                                      className="p-1 text-dim hover:text-gold hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeletePost(post.id)}
                                      title="Eradicate Content"
                                      className="p-1 text-dim hover:text-angola-red hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setPreviewPost(post);
                                        triggerToast('Article Preview Activated', `Fidelity simulation preview open for '${post.title}'`);
                                      }}
                                      title="Live Preview View"
                                      className="p-1 text-dim hover:text-sa-green hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Eye size={12} />
                                    </button>
                                  </div>
                                </div>
                                <h5 className="font-serif text-sm font-bold text-ivory leading-snug">{post.title}</h5>
                                <p className="text-[11px] text-dim line-clamp-2 leading-relaxed">{post.excerpt}</p>
                                <div className="flex justify-between text-[9px] text-dim font-mono pt-1">
                                  <span>Views: <strong>{post.views} matches</strong></span>
                                  <span>By {post.author}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Previews Modal representation popup */}
                      {previewPost && (
                        <div className="bg-white/5 border border-gold/20 rounded-2xl p-6 space-y-4">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gold uppercase tracking-widest font-mono font-bold">🔍 Real-time Article Preview Screen</span>
                            <button onClick={() => setPreviewPost(null)} className="text-[10px] text-dim hover:text-ivory">Hide Preview</button>
                          </div>
                          <div className="space-y-2">
                            <div className="aspect-video w-full rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${previewPost.image})` }}></div>
                            <h4 className="font-serif text-lg font-bold text-ivory">{previewPost.title}</h4>
                            <p className="text-[10px] text-dim font-mono">PUBLISHED ON SERVER: {previewPost.dateCreated}</p>
                            <p className="text-xs text-ivory/80 leading-relaxed max-h-32 overflow-y-auto">{previewPost.content}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sub-Tab 2: ADVERTISEMENT SERVER */}
                {blogsSubTab === 'ads' && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT Column: Create / Edit Ad Form */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-5 shadow-2xl">
                      <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-base font-bold text-gold-pale">
                            {editingAdId ? `Modify Advertisement: [${editingAdId}]` : 'Configure Ad Placement'}
                          </h4>
                          <p className="text-[11px] text-dim font-mono mb-1">Set banner variables, target slots, and dispatch campaigns instantaneously.</p>
                        </div>
                        {editingAdId && (
                          <button 
                            onClick={() => {
                              setEditingAdId(null);
                              setNewAdTitle('');
                              setNewAdImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
                              setNewAdPlacement('Homepage Hero');
                            }}
                            className="text-[10px] text-angola-red hover:underline font-mono"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Ad / Brand Campaign Name</label>
                          <input 
                            id="ad-title-input"
                            type="text" 
                            placeholder="e.g., Standard Bank Corporate Trade Portal" 
                            value={newAdTitle}
                            onChange={(e) => setNewAdTitle(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold transition-all" 
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Placement Targeting Slot</label>
                          <select 
                            id="ad-placement-select"
                            value={newAdPlacement}
                            onChange={(e) => setNewAdPlacement(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold appearance-none"
                          >
                            <option value="Homepage Hero">Featured Brand Slot (Prestige)</option>
                            <option value="Sidebar">Sidebar Sticky Tower (300x600)</option>
                            <option value="In-Feed">In-Feed Responsive Banner (Magazine Strip)</option>
                            <option value="Leaderboard">Leaderboard Banner (728x90 Header)</option>
                            <option value="Footer">Footer Premium Sponsor Slot</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-2 font-mono">Creative Asset Banner URL (Image)</label>
                          <input 
                            id="ad-image-input"
                            type="text" 
                            placeholder="https://images.unsplash.com/photo-..." 
                            value={newAdImage}
                            onChange={(e) => setNewAdImage(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded-lg p-2.5 text-xs text-ivory outline-none focus:border-gold font-mono text-[11px] transition-all" 
                          />
                        </div>

                        {/* Image Auto-Preview Helper */}
                        <div className="bg-dark p-3 rounded-lg border border-white/5">
                          <span className="block text-[9px] uppercase tracking-wider text-dim mb-2 font-mono">Asset Check:</span>
                          <div className="w-full h-24 rounded bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${newAdImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'})` }}></div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                          <button 
                            id="ad-save-button"
                            onClick={handleSaveAd}
                            className="px-6 py-2 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase tracking-widest font-bold rounded-lg transition-all shadow-lg"
                          >
                            {editingAdId ? 'Apply Ad Changes Check ✓' : 'Deploy Live Placement 📢'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT Column: Active Campaigns Ledger & Previews */}
                    <div className="space-y-6">
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl">
                        <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center">
                          <h4 className="font-serif text-sm font-bold text-ivory uppercase tracking-wider">Active Ad rotation Server</h4>
                          <span className="text-[9px] bg-sa-green/15 text-sa-green border border-sa-green/20 px-2 py-0.5 rounded font-mono font-bold">Online</span>
                        </div>

                        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                          {ads.map((ad) => (
                            <div key={ad.id} className="p-4 bg-dark rounded-xl border border-white/5 hover:border-gold/20 transition-all flex flex-col sm:flex-row gap-4">
                              <div className="w-full sm:w-28 h-16 rounded bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${ad.image})` }}></div>
                              <div className="grow space-y-2">
                                <div className="flex justify-between items-start">
                                  <span className="text-[9px] font-mono text-gold font-bold px-1.5 py-0.5 bg-gold/5 rounded border border-gold/15 uppercase">
                                    Placement: {ad.placement}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={() => handleEditAdSelect(ad)}
                                      title="Edit Campaign"
                                      className="p-1.5 text-dim hover:text-gold hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Edit2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteAd(ad.id)}
                                      title="Suspend Campaign"
                                      className="p-1.5 text-dim hover:text-angola-red hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setPreviewAd(ad);
                                        triggerToast('Ad Banner Preview Configured', `Simulating '${ad.title}' placement.`);
                                      }}
                                      title="Live Preview Server"
                                      className="p-1.5 text-sa-green hover:bg-white/5 rounded transition-colors"
                                    >
                                      <Eye size={12} />
                                    </button>
                                  </div>
                                </div>
                                <h5 className="font-serif text-sm font-bold text-ivory leading-snug">{ad.title}</h5>
                                
                                <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono text-dim pt-1 border-t border-white/5">
                                  <div>
                                    <span className="block text-[8px] text-dim/60">IMPRESSIONS</span>
                                    <strong className="text-ivory">{ad.impressions.toLocaleString()}</strong>
                                  </div>
                                  <div>
                                    <span className="block text-[8px] text-dim/60">CLICKS</span>
                                    <strong className="text-gold">{ad.clicks.toLocaleString()}</strong>
                                  </div>
                                  <div>
                                    <span className="block text-[8px] text-dim/60">CTR RATIO</span>
                                    <strong className="text-sa-green">{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00'}%</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Live Preview Box */}
                      {previewAd && (
                        <div className="bg-white/5 border border-gold/20 rounded-2xl p-6 space-y-4">
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-xs text-gold uppercase tracking-widest font-mono font-bold">🔍 Live Placement Simulator Preview</span>
                            <button onClick={() => setPreviewAd(null)} className="text-[10px] text-dim hover:text-ivory">Hide Simulator</button>
                          </div>
                          
                          <div className="space-y-3">
                            <span className="text-[10px] text-dim block font-mono">Current Simulator Slot Setup: <strong className="text-gold">{previewAd.placement}</strong></span>
                            
                            {/* Layout Simulation Sandbox based on placement */}
                            {previewAd.placement === 'Homepage Hero' && (
                              <div className="border border-white/10 rounded overflow-hidden">
                                <div className="bg-dark p-2 text-center text-[8px] tracking-widest border-b border-white/5 uppercase text-dim font-mono">★ SPONSORED LEAD BANNER AD ★</div>
                                <img src={previewAd.image} referrerPolicy="no-referrer" alt="ad" className="w-full h-36 object-cover" />
                                <div className="bg-dark p-3 text-center">
                                  <strong className="text-xs text-ivory font-serif">{previewAd.title}</strong>
                                  <span className="block text-[9px] text-dim mt-1">Prime High Impact Exposure Banner on Main Stage Header.</span>
                                </div>
                              </div>
                            )}

                            {previewAd.placement === 'Sidebar' && (
                              <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-2 space-y-1">
                                  <div className="h-2 bg-white/10 rounded w-full"></div>
                                  <div className="h-2 bg-white/10 rounded w-4/5"></div>
                                  <div className="h-12 bg-white/5 rounded-lg w-full flex items-center justify-center text-[9px] text-dim">Main Article Content Panel</div>
                                </div>
                                <div className="border border-white/10 rounded flex flex-col justify-between p-2 bg-dark">
                                  <span className="text-[8px] text-gold font-mono uppercase block text-center border-b border-white/5 pb-1 mb-1">Promo tower</span>
                                  <img src={previewAd.image} referrerPolicy="no-referrer" alt="ad" className="w-full h-20 object-cover rounded" />
                                  <p className="text-[7px] text-dim mt-1 text-center truncate">{previewAd.title}</p>
                                </div>
                              </div>
                            )}

                            {previewAd.placement !== 'Homepage Hero' && previewAd.placement !== 'Sidebar' && (
                              <div className="border border-white/10 rounded bg-dark p-3 flex items-center justify-between gap-4">
                                <div className="grow space-y-1">
                                  <span className="text-[8px] text-gold font-mono uppercase">Sponsored Banner</span>
                                  <h6 className="text-xs font-bold text-ivory">{previewAd.title}</h6>
                                  <p className="text-[9px] text-dim">Positioned smoothly in stream placements.</p>
                                </div>
                                <img src={previewAd.image} referrerPolicy="no-referrer" alt="ad" className="w-24 h-12 object-cover rounded border border-white/10" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- END NEWS & BLOGS TAB --- */}

            {/* --- MEMBERSHIP ARCHITECTURE TAB --- */}
            {activeTab === 'membership' && (
              <motion.div
                key="membership"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Header Block */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-ivory flex items-center gap-2">
                      <Award className="text-gold h-6 w-6" />
                      ASAE Professional Membership Vault
                    </h3>
                    <p className="text-xs text-dim mt-1">
                      Govern cross-border corporate memberships across Southern Africa. Audit join criteria, process payments, and track legal approvals.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      // Generate and export simple report
                      triggerToast('Report Exported', 'ASAE-Member-Ledger.csv loaded generated under administrative secure logs.');
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-ivory text-xs font-mono font-bold uppercase tracking-widest border border-white/10 rounded-lg flex items-center gap-2 transition-all"
                  >
                    <FileDown size={14} className="text-gold" />
                    Export Ledger
                  </button>
                </div>

                {/* Membership Analytics Dashboard Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-gold/15 transition-all">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-dim">Total Registered Profiles</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-serif font-bold text-ivory">{members.length}</span>
                      <span className="text-[10px] text-sa-green font-mono font-bold bg-sa-green/10 px-1.5 py-0.5 rounded">Active Archive</span>
                    </div>
                    <p className="text-[10px] text-dim mt-2">Combined past &amp; new ASAE candidates</p>
                  </div>

                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-gold/15 transition-all">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-dim">Active Approved Base</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-serif font-bold text-sa-green">
                        {members.filter(m => m.status === 'Approved').length}
                      </span>
                      <span className="text-[10px] text-dim font-mono">
                        ({Math.round((members.filter(m => m.status === 'Approved').length / (members.length || 1)) * 100)}%)
                      </span>
                    </div>
                    <p className="text-[10px] text-dim mt-2">Passed criteria audits &amp; compliance</p>
                  </div>

                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-gold/15 transition-all">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-dim">Pending Applications</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className={`text-2xl font-serif font-bold ${members.filter(m => m.status === 'Pending').length > 0 ? 'text-gold animate-pulse' : 'text-ivory'}`}>
                        {members.filter(m => m.status === 'Pending').length}
                      </span>
                      <span className="text-[10px] text-dim font-mono">Requires Action</span>
                    </div>
                    <p className="text-[10px] text-dim mt-2">Requires manual approval or denial alert</p>
                  </div>

                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 hover:border-gold/15 transition-all">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-dim">Paid Membership Inflows</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-mono font-bold text-gold">
                        {formatValue(
                          members.reduce((acc, m) => acc + (m.paymentRecord.status === 'Paid' ? m.paymentRecord.amount : 0), 0)
                        )}
                      </span>
                    </div>
                    <p className="text-[10px] text-dim mt-2">Secured corporate registration fees</p>
                  </div>
                </div>

                {/* Filter and sorting control deck */}
                <div className="bg-dark-card border border-white/5 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-gold" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-dim font-bold">Filters Suite:</span>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center text-xs">
                    {/* Country Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-dim text-[10px] uppercase font-mono">Country:</span>
                      <select 
                        value={memberFilterCountry}
                        onChange={(e) => {
                          setMemberFilterCountry(e.target.value);
                          setMemberFilterRegion('All'); // reset region on country shift
                        }}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-ivory outline-none focus:border-gold"
                      >
                        <option value="All">All Countries</option>
                        <option value="Angola">Angola</option>
                        <option value="South Africa">South Africa</option>
                      </select>
                    </div>

                    {/* Region Filter - Dynamic suggestions */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-dim text-[10px] uppercase font-mono">Region:</span>
                      <select 
                        value={memberFilterRegion}
                        onChange={(e) => setMemberFilterRegion(e.target.value)}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-ivory outline-none focus:border-gold"
                      >
                        <option value="All">All Regions</option>
                        {Array.from(new Set(
                          members
                            .filter(m => memberFilterCountry === 'All' || m.country === memberFilterCountry)
                            .map(m => m.region)
                        )).map(reg => (
                          <option key={reg} value={reg}>{reg}</option>
                        ))}
                      </select>
                    </div>

                    {/* Member Type Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-dim text-[10px] uppercase font-mono">Type:</span>
                      <select 
                        value={memberFilterType}
                        onChange={(e) => setMemberFilterType(e.target.value)}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-ivory outline-none focus:border-gold"
                      >
                        <option value="All">All History</option>
                        <option value="Past">Past Members Only</option>
                        <option value="New">New Members Only</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-dim text-[10px] uppercase font-mono">Status:</span>
                      <select 
                        value={memberFilterStatus}
                        onChange={(e) => setMemberFilterStatus(e.target.value)}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-ivory outline-none focus:border-gold"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Sorting criteria picker */}
                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                      <span className="text-dim text-[10px] uppercase font-mono text-gold-pale">Sort By:</span>
                      <select 
                        value={memberSortField}
                        onChange={(e) => setMemberSortField(e.target.value as any)}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-ivory outline-none focus:border-gold"
                      >
                        <option value="name">Candidate Name</option>
                        <option value="country">Country</option>
                        <option value="region">Region / State</option>
                        <option value="joinDate">Join Date</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main Tab splits layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Members table & payments records */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-serif text-base font-bold text-gold-pale">ASAE Member Registry Ledger</h4>
                        <span className="text-[10px] text-dim font-mono">
                          Showing{' '}
                          {
                            members
                              .filter(m => memberFilterCountry === 'All' ? true : m.country === memberFilterCountry)
                              .filter(m => memberFilterRegion === 'All' ? true : m.region === memberFilterRegion)
                              .filter(m => memberFilterType === 'All' ? true : m.type === memberFilterType)
                              .filter(m => memberFilterStatus === 'All' ? true : m.status === memberFilterStatus)
                              .length
                          }{' '}
                          of {members.length} members
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                              <th className="p-4">Profile &amp; Email</th>
                              <th className="p-4">Geography</th>
                              <th className="p-4">Status &amp; Tier</th>
                              <th className="p-4 text-center">Payment Record</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-ivory divide-y divide-white/5">
                            {(() => {
                              const filtered = members
                                .filter(m => memberFilterCountry === 'All' ? true : m.country === memberFilterCountry)
                                .filter(m => memberFilterRegion === 'All' ? true : m.region === memberFilterRegion)
                                .filter(m => memberFilterType === 'All' ? true : m.type === memberFilterType)
                                .filter(m => memberFilterStatus === 'All' ? true : m.status === memberFilterStatus)
                                .sort((a, b) => {
                                  if (memberSortField === 'name') return a.name.localeCompare(b.name);
                                  if (memberSortField === 'country') return a.country.localeCompare(b.country);
                                  if (memberSortField === 'region') return a.region.localeCompare(b.region);
                                  if (memberSortField === 'joinDate') return b.joinDate.localeCompare(a.joinDate);
                                  return 0;
                                });

                              if (filtered.length === 0) {
                                return (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-dim text-xs font-mono">
                                      No members found matching selected filters criteria.
                                    </td>
                                  </tr>
                                );
                              }

                              return filtered.map((m) => (
                                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                  {/* Profile */}
                                  <td className="p-4">
                                    <div className="font-serif font-bold text-ivory flex items-center gap-1.5">
                                      {m.name}
                                      <span className={`text-[8px] font-sans px-1.5 py-0.5 rounded font-bold uppercase ${
                                        m.type === 'New' 
                                          ? 'bg-gold/10 text-gold border border-gold/20' 
                                          : 'bg-white/10 text-dim'
                                      }`}>
                                        {m.type}
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-dim font-mono mt-0.5">{m.email}</div>
                                    <div className="text-[9px] text-dim font-mono italic mt-1">ID: {m.id} &bull; Joined: {m.joinDate}</div>
                                  </td>

                                  {/* Geography */}
                                  <td className="p-4">
                                    <span className="text-xs text-ivory/95 font-medium">{m.region}</span>
                                    <div className="text-[10px] text-dim flex items-center gap-1.5 mt-0.5">
                                      <span className={`w-1.5 h-1.5 rounded-full ${m.country === 'Angola' ? 'bg-angola-red' : 'bg-sa-green'}`}></span>
                                      {m.country}
                                    </div>
                                  </td>

                                  {/* Status and Tier */}
                                  <td className="p-4">
                                    <div className="flex flex-col gap-1.5">
                                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest w-max ${
                                        m.status === 'Approved'
                                          ? 'bg-sa-green/15 text-sa-green border border-sa-green/20'
                                          : m.status === 'Pending'
                                          ? 'bg-gold/15 text-gold border border-gold/20'
                                          : 'bg-angola-red/15 text-angola-red border border-angola-red/20'
                                      }`}>
                                        {m.status}
                                      </span>
                                      <span className="text-[10px] text-gold-pale font-mono">
                                        ✨ {m.membershipTier} Tier
                                      </span>
                                    </div>
                                  </td>

                                  {/* Payment Record details */}
                                  <td className="p-4 text-center">
                                    <div className="text-[11px] font-mono font-bold text-ivory/90">
                                      {formatValue(m.paymentRecord.amount)}
                                    </div>
                                    <div className="text-[9px] text-dim font-mono mt-0.5">({m.paymentRecord.invoiceNumber})</div>
                                    <span className={`inline-block text-[8px] font-sans font-bold uppercase px-1.5 py-0.5 rounded mt-1.5 ${
                                      m.paymentRecord.status === 'Paid'
                                        ? 'bg-sa-green/10 text-sa-green'
                                        : m.paymentRecord.status === 'Pending'
                                        ? 'bg-gold/10 text-gold animate-pulse'
                                        : 'bg-angola-red/10 text-angola-red'
                                    }`}>
                                      {m.paymentRecord.status}
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      {m.status === 'Pending' && (
                                        <>
                                          <button
                                            onClick={() => handleApproveMember(m.id)}
                                            title="Approve Member"
                                            className="px-2 py-1 bg-sa-green/10 hover:bg-sa-green text-sa-green hover:text-dark text-[9px] font-mono uppercase rounded transition-colors"
                                          >
                                            Approve
                                          </button>
                                          <button
                                            onClick={() => handleRejectMember(m.id)}
                                            title="Reject Candidate"
                                            className="px-2 py-1 bg-angola-red/10 hover:bg-angola-red/20 text-angola-red text-[9px] font-mono uppercase rounded transition-colors"
                                          >
                                            Reject
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => handleRemoveMember(m.id)}
                                        title="Eradicate Registry Profile"
                                        className="p-1 text-dim hover:text-angola-red hover:bg-angola-red/10 rounded transition-colors"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Add member form */}
                  <div className="space-y-6">
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                      <h4 className="font-serif text-base font-bold text-gold-pale mb-2">Register Brand New Member</h4>
                      <p className="text-[11px] text-dim mb-4">Manual enrollment bypassing standard application pipeline for elite executive candidates.</p>

                      <form onSubmit={handleAddMember} className="space-y-4">
                        {/* Member Name */}
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Full Name</label>
                          <input 
                            type="text"
                            required
                            placeholder="e.g. Dr. Eduardo Santos"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded p-2.5 text-xs text-ivory outline-none focus:border-gold"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Corporate Email Address</label>
                          <input 
                            type="email"
                            required
                            placeholder="e.g. santos@holding.ao"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="w-full bg-dark border border-white/10 rounded p-2.5 text-xs text-ivory outline-none focus:border-gold"
                          />
                        </div>

                        {/* Country Selections */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Country Jurisdiction</label>
                            <select
                              value={newMemberCountry}
                              onChange={(e) => handleCountryChange(e.target.value as any)}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-xs text-ivory outline-none focus:border-gold"
                            >
                              <option value="Angola">Angola</option>
                              <option value="South Africa">South Africa</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">State / Region</label>
                            <select
                              value={newMemberRegion}
                              onChange={(e) => setNewMemberRegion(e.target.value)}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-xs text-ivory outline-none focus:border-gold"
                            >
                              {newMemberCountry === 'Angola' ? (
                                <>
                                  <option value="Luanda">Luanda</option>
                                  <option value="Benguela">Benguela</option>
                                  <option value="Cabinda">Cabinda</option>
                                  <option value="Huambo">Huambo</option>
                                </>
                              ) : (
                                <>
                                  <option value="Gauteng">Gauteng</option>
                                  <option value="Western Cape">Western Cape</option>
                                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                  <option value="Eastern Cape">Eastern Cape</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>

                        {/* Type & Tier */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Archive Type</label>
                            <select
                              value={newMemberType}
                              onChange={(e) => setNewMemberType(e.target.value as any)}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-xs text-ivory outline-none focus:border-gold"
                            >
                              <option value="New">New Member</option>
                              <option value="Past">Past Member</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-dim mb-1 font-mono">Tier Category</label>
                            <select
                              value={newMemberTier}
                              onChange={(e) => {
                                const t = e.target.value as any;
                                setNewMemberTier(t);
                                // Set preset fee
                                if (t === 'Silver') setNewMemberFee(4500);
                                if (t === 'Gold') setNewMemberFee(8500);
                                if (t === 'Platinum') setNewMemberFee(15000);
                              }}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-xs text-ivory outline-none focus:border-gold"
                            >
                              <option value="Silver">Silver Tier</option>
                              <option value="Gold">Gold Tier</option>
                              <option value="Platinum">Platinum Tier</option>
                            </select>
                          </div>
                        </div>

                        {/* Fee slider Input */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="block text-[10px] uppercase tracking-widest text-dim font-mono">Annual Fee (ZAR R)</label>
                            <span className="text-[11px] text-gold font-mono font-bold">{formatValue(newMemberFee || 0)}</span>
                          </div>
                          <input 
                            type="number"
                            value={newMemberFee}
                            onChange={(e) => setNewMemberFee(parseInt(e.target.value) || 0)}
                            className="w-full bg-dark border border-white/10 rounded p-2.5 text-xs text-ivory outline-none focus:border-gold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-pale hover:from-gold-pale hover:to-gold text-dark font-mono text-xs uppercase font-bold tracking-widest rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                        >
                          Enroll Candidate
                        </button>
                      </form>
                    </div>

                    {/* Regional demographics bento widget */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-5">
                      <h4 className="font-serif text-sm font-bold text-gold-pale mb-2 uppercase tracking-widest">Territory Distribution</h4>
                      <p className="text-[10px] text-dim leading-relaxed mb-4">Real-time geographic demographic metrics computed from current official active registry logs.</p>
                      
                      <div className="space-y-3 font-mono text-xs text-ivory">
                        {/* Angola */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span>Angola (Luanda, Benguela, Cabinda)</span>
                            <span className="text-gold font-bold">
                              {members.filter(m => m.country === 'Angola').length} Members
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-angola-red h-full rounded-full transition-all"
                              style={{ width: `${(members.filter(m => m.country === 'Angola').length / (members.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* South Africa */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span>South Africa (Gauteng, Cape Town)</span>
                            <span className="text-gold font-bold">
                              {members.filter(m => m.country === 'South Africa').length} Members
                            </span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-sa-green h-full rounded-full transition-all"
                              style={{ width: `${(members.filter(m => m.country === 'South Africa').length / (members.length || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- NOMINATIONS REVIEW PORTAL TAB --- */}
            {activeTab === 'nominations' && (
              <motion.div
                key="nominations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-ivory">ASAE Peer Nominations Desk</h3>
                    <p className="text-sm text-dim mt-0.5">Authoritative portal to inspect candidates biographies, verify support files, and toggle approval statuses.</p>
                  </div>
                  <button className="px-5 py-2.5 bg-white/5 text-ivory rounded-lg text-xs font-mono font-bold tracking-widest uppercase hover:bg-white/10 transition-colors border border-white/10 flex items-center gap-2" onClick={() => triggerToast('CSV Export Initiated', 'Corporate nominations catalog compiled into ASAE-Nominations.csv in records branch.')}>
                    <FileDown size={14} /> Export SADC Audit Sheets
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Candidates Index Table */}
                  <div className="col-span-2 bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl h-fit">
                    <div className="p-5 border-b border-white/5 bg-white/5">
                      <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-wider">Submitted Nomination Dossiers</h4>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                          <th className="p-4">Desired Nominee</th>
                          <th className="p-4">SADC Category</th>
                          <th className="p-4">Submission Status</th>
                          <th className="p-4 text-right">Inspect dossier</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-ivory divide-y divide-white/5">
                        {nominations.map((nom) => (
                          <tr key={nom.id} className={`hover:bg-white/5 transition-all ${selectedNomination?.id === nom.id ? 'bg-gold/5' : ''}`}>
                            <td className="p-4">
                              <div className="font-serif font-bold">{nom.nomineeName}</div>
                              <div className="text-[10px] text-dim mt-0.5">{nom.organization}</div>
                            </td>
                            <td className="p-4 text-xs font-mono text-gold-pale">{nom.category}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-mono font-bold ${
                                nom.status === 'Approved' ? 'bg-sa-green/15 text-sa-green border border-sa-green/20' : 
                                nom.status === 'Rejected' ? 'bg-angola-red/15 text-angola-red border border-angola-red/20' : 
                                'bg-gold/15 text-gold border border-gold/20 animate-pulse'
                              }`}>
                                {nom.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button 
                                onClick={() => setSelectedNomination(nom)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-ivory rounded font-bold text-xs uppercase tracking-wider transition-colors border border-white/10"
                              >
                                View Folder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Candidate Dossier Inspection Panel */}
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl space-y-6 h-fit relative">
                    <div className="border-b border-white/5 pb-3">
                      <h4 className="font-serif text-base font-bold text-gold-pale">Dossier Auditor Case</h4>
                      <p className="text-[10px] text-dim font-mono">Complete technical documentation from client filing.</p>
                    </div>

                    {selectedNomination ? (
                      <div className="space-y-4">
                        <div className="bg-dark border border-white/10 p-4 rounded-xl space-y-3">
                          <div>
                            <div className="text-[8px] uppercase tracking-widest text-dim font-mono">Nominee Email address</div>
                            <p className="text-[11px] font-bold text-ivory underline">{selectedNomination.nomineeEmail}</p>
                          </div>
                          <div>
                            <div className="text-[8px] uppercase tracking-widest text-dim font-mono">Nominee Executive Profile</div>
                            <p className="text-xs text-ivory leading-relaxed mt-1 font-sans">{selectedNomination.nomineeBio}</p>
                          </div>
                          <div className="border-t border-white/5 pt-2">
                            <div className="text-[8px] uppercase tracking-widest text-dim font-mono">Nominator Name / Contact Email</div>
                            <p className="text-xs font-bold text-gold mt-0.5">{selectedNomination.nominatorName}</p>
                            <p className="text-[10px] text-dim font-mono">{selectedNomination.nominatorEmail}</p>
                          </div>
                        </div>

                        <div>
                          <div className="text-[8px] uppercase tracking-widest text-dim font-mono mb-1">Peer Endorsement Pitch</div>
                          <div className="bg-dark p-3.5 rounded-lg text-[11px] text-dim font-sans border border-white/5 max-h-32 overflow-y-auto leading-relaxed">
                            "{selectedNomination.submissionLetter}"
                          </div>
                        </div>

                        {selectedNomination.attachmentName && (
                          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-[11px]">
                            <span className="text-ivory underline font-serif truncate">{selectedNomination.attachmentName}</span>
                            <span className="text-[8px] text-dim bg-dark px-2 py-0.5 rounded uppercase font-mono font-bold">1.2 MB PDF</span>
                          </div>
                        )}

                        <div className="space-y-2 border-t border-white/5 pt-4">
                          <p className="text-[9px] text-dim text-center">Auditing Decisions affect live SMTP relays instantly.</p>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => handleNominationAction(selectedNomination.id, 'Approved')}
                              disabled={selectedNomination.status === 'Approved'}
                              className={`py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                selectedNomination.status === 'Approved' 
                                  ? 'bg-sa-green/20 text-sa-green border border-sa-green/30 cursor-not-allowed' 
                                  : 'bg-sa-green/20 border border-sa-green/40 hover:bg-sa-green text-sa-green hover:text-dark'
                              }`}
                            >
                              Approve Dossier
                            </button>
                            <button 
                              onClick={() => handleNominationAction(selectedNomination.id, 'Rejected')}
                              disabled={selectedNomination.status === 'Rejected'}
                              className={`py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                selectedNomination.status === 'Rejected' 
                                  ? 'bg-angola-red/20 text-angola-red border border-angola-red/30 cursor-not-allowed' 
                                  : 'bg-angola-red/20 border border-angola-red/40 hover:bg-angola-red text-angola-red hover:text-white'
                              }`}
                            >
                              Reject Case
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-dim border border-dashed border-white/5 rounded-2xl">
                        <Users size={28} className="mx-auto text-dim/35 mb-2" />
                        <p className="text-[11px] uppercase tracking-wider font-bold">Inspector Idle</p>
                        <p className="text-[10px] mt-1 px-4">Please select any submitted nominee folder from the left list to run audits.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- END NOMINATIONS TAB --- */}


            {/* --- EXCELLENCE AWARDS VOTING COMMAND CENTER --- */}
            {activeTab === 'voting' && (
              <motion.div
                key="voting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Visual Header & Active Admin Role Console */}
                <div className="bg-dark-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-transparent pointer-events-none"></div>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-2.5 h-2.5 bg-gold rounded-full animate-ping"></span>
                        <span className="text-[10px] uppercase tracking-widest text-gold font-mono font-bold">ASAE Excellence Portal</span>
                      </div>
                      <h3 className="font-serif text-3xl font-bold text-ivory">
                        Voting Command Center
                      </h3>
                      <p className="text-xs text-dim max-w-2xl mt-1 leading-relaxed">
                        Secure administrative console to manage category mappings, verify public votes, monitor AI anomaly shields, score with juries, and lock final excellence awards results.
                      </p>
                    </div>

                    {/* Simulative Admin Role Selector Block */}
                    <div className="bg-dark/80 border border-white/10 rounded-xl p-4 w-full lg:w-96 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase tracking-widest text-dim font-mono font-bold">Acting Admin Scope</span>
                        <span className="text-[9px] uppercase tracking-widest font-bold font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                          {votingActiveRole} Admin
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1">
                        {(['Master', 'Country', 'Finance', 'Compliance', 'Content', 'Event'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => {
                              setVotingActiveRole(role);
                              triggerToast(`${role} Scope Elected`, `Viewing console under custom permissions schema.`, 'success');
                            }}
                            className={`px-1 py-1 rounded text-[8px] uppercase tracking-wider font-mono font-bold border transition-colors ${
                              votingActiveRole === role 
                                ? 'bg-gold text-dark border-gold' 
                                : 'bg-white/5 border-white/10 text-dim hover:text-ivory hover:bg-white/10'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>

                      <div className="text-[9px] leading-relaxed text-gold-pale/80 font-mono pt-1.5 border-t border-white/5">
                        {votingActiveRole === 'Master' && '✓ Full Write access & cryptographic keys decryption active.'}
                        {votingActiveRole === 'Country' && '✓ Restricted: Managing regional award segments (Angola/RSA) only.'}
                        {votingActiveRole === 'Finance' && '✓ Billing focused: Gateway channels and package rates accessible.'}
                        {votingActiveRole === 'Compliance' && '✓ Safe-guarding: Real-time IP bans & VPN block overrides active.'}
                        {votingActiveRole === 'Content' && '✓ Media focus: Adding category banners and biography write-ups.'}
                        {votingActiveRole === 'Event' && '✓ Lock-control: Certificate dispatches & jury formula switches active.'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Tab Buttons Hierarchy */}
                <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-thin border-b border-white/5">
                  {[
                    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
                    { id: 'categories', label: 'Categories & Nominees', icon: Layers },
                    { id: 'packages', label: 'Gateways & Packages', icon: CreditCard },
                    { id: 'fraud', label: 'AI Fraud Prevention', icon: Shield },
                    { id: 'judges', label: 'Jury scoring & Formulas', icon: Sliders },
                    { id: 'awards', label: 'Awards Night Locks', icon: Award },
                    { id: 'predictive', label: 'Advanced AI & Blockchain', icon: Binary }
                  ].map(stab => {
                    const SIcon = stab.id === 'awards' ? Award : stab.icon;
                    const isSActive = votingSubTab === stab.id;
                    return (
                      <button
                        key={stab.id}
                        onClick={() => setVotingSubTab(stab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-mono font-bold transition-all shrink-0 whitespace-nowrap border ${
                          isSActive 
                            ? 'bg-gold/15 text-gold border-gold/30' 
                            : 'bg-white/5 text-dim hover:text-ivory border-transparent hover:bg-white/10'
                        }`}
                      >
                        <SIcon size={13} />
                        {stab.label}
                      </button>
                    );
                  })}
                </div>

                {/* SUBTAB 1: OVERVIEW SCREEN */}
                {votingSubTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Live System KPIs Block */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* KPI 1 */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <span className="text-[9px] uppercase tracking-widest text-dim font-mono">Total Ballots Cast</span>
                        <div className="font-serif text-3xl font-bold text-sa-green mt-1 flex items-baseline gap-1.5">
                          142,520
                          <span className="text-xs text-sa-green font-sans font-bold flex items-center gap-0.5">
                            <TrendingUp size={12} /> +4.2%
                          </span>
                        </div>
                        <p className="text-[9px] text-dim font-mono mt-1">Free ballots & premium logs</p>
                      </div>

                      {/* KPI 2 */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <span className="text-[9px] uppercase tracking-widest text-dim font-mono">Real-time Voters active</span>
                        <div className="font-serif text-3xl font-bold text-ivory/90 mt-1 flex items-center gap-2">
                          12,410
                          <span className="w-2 h-2 bg-sa-green rounded-full animate-ping"></span>
                        </div>
                        <p className="text-[9px] text-dim font-mono mt-1">Synchronized sessions today</p>
                      </div>

                      {/* KPI 3 */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <span className="text-[9px] uppercase tracking-widest text-dim font-mono">Corporate Voting Revenue</span>
                        <div className="font-serif text-3xl font-bold text-gold mt-1">
                          {formatValue(1842500)}
                        </div>
                        <p className="text-[9px] text-dim font-mono mt-1">SA EFT & AO MultiCaixa channels</p>
                      </div>

                      {/* KPI 4 */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <span className="text-[9px] uppercase tracking-widest text-dim font-mono">Shield triggers (Anomaly Rate)</span>
                        <div className="font-serif text-3xl font-bold text-angola-red mt-1">
                          0.08%
                        </div>
                        <p className="text-[9px] text-dim font-mono mt-1">12 VPN proxy logs auto-blocked</p>
                      </div>
                    </div>

                    {/* Map & Velocity charts Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Real-time Southern Africa Node Map (Interactive SVG grid) */}
                      <div className="lg:col-span-7 bg-dark-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-serif text-base font-bold text-gold-pale uppercase tracking-widest">SADC Regional Cast Map</h4>
                              <p className="text-[10px] text-dim">Click blinking hubs to launch isolated public audits.</p>
                            </div>
                            <span className="text-[9px] font-mono bg-sa-green/10 text-sa-green px-2 py-0.5 rounded font-bold border border-sa-green/20">
                              ACTIVE SYNC ONLINE
                            </span>
                          </div>

                          {/* Beautiful Interactive Map illustration */}
                          <div className="relative aspect-[16/9] bg-dark/40 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-radial-gradient-glow opacity-30"></div>
                            
                            {/* Stylized borders visual layout resembling SADC */}
                            <svg viewBox="0 0 400 250" className="w-full h-full text-dim/20 stroke-white/10 stroke-[0.75] fill-none">
                              {/* Angola land segment */}
                              <path d="M 120 40 L 160 45 L 180 75 L 160 110 L 110 115 L 115 70 Z" className="fill-white/5 hover:fill-gold/5 transition-colors cursor-pointer" />
                              {/* South Africa land segment */}
                              <path d="M 170 160 L 220 155 L 240 180 L 250 220 L 190 225 L 150 190 Z" className="fill-white/5 hover:fill-gold/5 transition-colors cursor-pointer" />
                              {/* Connector fiber link */}
                              <path d="M 145 75 Q 180 120 195 185" className="stroke-gold/40 stroke-dashed" strokeDasharray="3 3 animate-pulse" />
                            </svg>

                            {/* Node markers overlay */}
                            {/* Luanda Hub */}
                            <button 
                              onClick={() => triggerToast('Luanda audit', 'Angola Region Hub active. 58,124 registered public votes. Peak channel: Multicaixa Express.', 'success')}
                              className="absolute top-[28%] left-[34%] group focus:outline-none"
                            >
                              <span className="absolute inline-flex h-3 w-3 rounded-full bg-angola-red opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-angola-red"></span>
                              <span className="absolute left-4 -top-2 bg-dark/95 border border-white/15 px-1.5 py-0.5 rounded text-[8px] font-mono text-ivory tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Luanda (58k votes)
                              </span>
                            </button>

                            {/* Benguela Hub */}
                            <button 
                              onClick={() => triggerToast('Benguela audit', 'Benguela Node online. 18,340 votes. Channel: Bancario Standard.', 'success')}
                              className="absolute top-[38%] left-[32%] group focus:outline-none"
                            >
                              <span className="absolute inline-flex h-3 w-3 rounded-full bg-gold opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                              <span className="absolute left-4 -top-2 bg-dark/95 border border-white/15 px-1.5 py-0.5 rounded text-[8px] font-mono text-ivory tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Benguela (18k)
                              </span>
                            </button>

                            {/* Joburg Hub */}
                            <button 
                              onClick={() => triggerToast('Johannesburg audit', 'Gauteng HQ Node online. 48,150 votes. Peak gateway: PayFast. Security: Zero blocks.', 'success')}
                              className="absolute top-[72%] left-[48%] group focus:outline-none"
                            >
                              <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-sa-green opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sa-green"></span>
                              <span className="absolute left-5 -top-2 bg-dark/95 border border-white/15 px-1.5 py-0.5 rounded text-[8px] font-mono text-ivory tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Joburg (48k votes)
                              </span>
                            </button>

                            {/* Cape Town Hub */}
                            <button 
                              onClick={() => triggerToast('Cape Town audit', 'Western Cape Node online. 17,906 votes. 100% Mobile verification.', 'success')}
                              className="absolute top-[86%] left-[40%] group focus:outline-none"
                            >
                              <span className="absolute inline-flex h-3 w-3 rounded-full bg-gold opacity-75 animate-ping"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                              <span className="absolute left-4 -top-2 bg-dark/95 border border-white/15 px-1.5 py-0.5 rounded text-[8px] font-mono text-ivory tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Cape Town (17k)
                              </span>
                            </button>

                            {/* Legend labels */}
                            <div className="absolute bottom-3 right-3 bg-dark-card/90 border border-white/10 p-2 rounded-lg text-[8px] font-mono space-y-1">
                              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-angola-red rounded-full"></span> Angola Core Hub</div>
                              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-sa-green rounded-full"></span> RSA Primary Node</div>
                              <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-gold rounded-full"></span> Regional Satellite</div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center text-[10px] text-dim font-mono">
                          <span>Aggregated latency: 14ms (Fiber link Luanda-CapeTown)</span>
                          <span className="text-sa-green">✓ VPN defense active</span>
                        </div>
                      </div>

                      {/* Hourly trends & conversion funnel */}
                      <div className="lg:col-span-5 space-y-6">
                        {/* Vote trends SVG sparkline */}
                        <div className="bg-dark-card border border-white/5 rounded-2xl p-5">
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest mb-1.5">Cast velocity (Hourly Trends)</h4>
                          <p className="text-[9px] text-dim mb-3">Voting rates mapped during past 24 hours of standard peak period.</p>
                          
                          <div className="bg-dark/40 border border-white/10 rounded-xl p-3 h-28 relative flex items-end">
                            {/* Graphic waveform representation using SVG */}
                            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible text-gold">
                              <defs>
                                <linearGradient id="trendsGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.25" />
                                  <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path 
                                d="M 0 50 Q 20 20 40 45 T 80 15 T 120 35 T 160 5 T 200 40" 
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path 
                                d="M 0 50 Q 20 20 40 45 T 80 15 T 120 35 T 160 5 T 200 40 L 200 60 L 0 60 Z" 
                                fill="url(#trendsGrad)"
                              />
                              {/* Pulse active locator dot */}
                              <circle cx="160" cy="5" r="3" fill="var(--color-sa-green)" className="animate-pulse" />
                            </svg>
                            <span className="absolute top-2 right-2 text-[8px] font-mono text-sa-green uppercase bg-sa-green/10 px-1.5 rounded">
                              Peak 450 votes/min
                            </span>
                          </div>

                          <div className="flex justify-between text-[8px] font-mono text-dim mt-2">
                            <span>00:00 UTC</span>
                            <span>08:00</span>
                            <span className="text-sa-green">14:00 (Peak)</span>
                            <span>20:00</span>
                            <span>24:00</span>
                          </div>
                        </div>

                        {/* Conversion Funnel */}
                        <div className="bg-dark-card border border-white/5 rounded-2xl p-5">
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest mb-2">Voter Conversion Funnel</h4>
                          <div className="space-y-2 text-xs font-mono">
                            {/* Funnel Stage 1 */}
                            <div>
                              <div className="flex justify-between text-[9px] text-dim mb-0.5">
                                <span>1. Landing Page Visits</span>
                                <span>125,000 (100%)</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-gold h-full w-[100%]"></div>
                              </div>
                            </div>
                            
                            {/* Funnel Stage 2 */}
                            <div>
                              <div className="flex justify-between text-[9px] text-dim mb-0.5">
                                <span>2. Candidate Explorations</span>
                                <span>85,000 (68%)</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-gold/80 h-full w-[68%]"></div>
                              </div>
                            </div>

                            {/* Funnel Stage 3 */}
                            <div>
                              <div className="flex justify-between text-[9px] text-dim mb-0.5">
                                <span>3. Identity Authentication</span>
                                <span>54,000 (43%)</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-gold/60 h-full w-[43%]"></div>
                              </div>
                            </div>

                            {/* Funnel Stage 4 */}
                            <div>
                              <div className="flex justify-between text-[9px] text-dim mb-0.5">
                                <span>4. Ballots Dispatched & Cast</span>
                                <span>38,000 (30.4%)</span>
                              </div>
                              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <div className="bg-sa-green h-full w-[30%]"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Executive KPIs list panel */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-5">
                      <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest mb-3">EXECUTIVE DASHBOARD KPIs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-dim font-mono">Votes Per Minute (Peak)</div>
                          <div className="text-lg font-bold text-ivory font-mono mt-1">452 VPM</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-dim font-mono">Conversion rate</div>
                          <div className="text-lg font-bold text-gold font-mono mt-1">30.4%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-dim font-mono">Visa/MC Success rate</div>
                          <div className="text-lg font-bold text-sa-green font-mono mt-1">99.82%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-dim font-mono">Voter Retention Index</div>
                          <div className="text-lg font-bold text-ivory/80 font-mono mt-1">91.4%</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                          <div className="text-[10px] text-dim font-mono">Intl Participation</div>
                          <div className="text-lg font-bold text-gold-pale font-mono mt-1">11.6%</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 2: CATEGORIES & NOMINEES */}
                {votingSubTab === 'categories' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Add Category and Add Nominee forms side-by-side inside interactive panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Form: Add Category */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="border-b border-white/5 pb-2">
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest">Create New category</h4>
                          <p className="text-[9px] text-dim">Design category and publish immediately to delegate portals.</p>
                        </div>
                        
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Category Title</label>
                            <input 
                              type="text"
                              value={newCatTitle}
                              onChange={(e) => setNewCatTitle(e.target.value)}
                              placeholder="e.g. Young Entrepreneur of the Year"
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Judges weight %</label>
                              <input 
                                type="number"
                                value={newCatJudgesWeight}
                                onChange={(e) => {
                                  const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                  setNewCatJudgesWeight(val);
                                  setNewCatPublicWeight(100 - val);
                                }}
                                className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Public weight %</label>
                              <input 
                                type="number"
                                value={newCatPublicWeight}
                                onChange={(e) => {
                                  const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                  setNewCatPublicWeight(val);
                                  setNewCatJudgesWeight(100 - val);
                                }}
                                className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-mono"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Start Date</label>
                              <input 
                                type="date"
                                value={newCatStartDate}
                                onChange={(e) => setNewCatStartDate(e.target.value)}
                                className="w-full bg-dark border border-white/10 rounded p-1.5 text-ivory outline-none focus:border-gold font-sans"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">End Date</label>
                              <input 
                                type="date"
                                value={newCatEndDate}
                                onChange={(e) => setNewCatEndDate(e.target.value)}
                                className="w-full bg-dark border border-white/10 rounded p-1.5 text-ivory outline-none focus:border-gold font-sans"
                              />
                            </div>
                          </div>

                          <button 
                            onClick={() => {
                              if (!newCatTitle.trim()) {
                                triggerToast('Validation Fail', 'Category must hold a legitimate title name.', 'alert');
                                return;
                              }
                              const entry: VotingCategory = {
                                id: `V-CAT-${votingCategories.length + 1}`,
                                title: newCatTitle,
                                active: true,
                                startDate: newCatStartDate,
                                endDate: newCatEndDate,
                                judgesWeight: newCatJudgesWeight,
                                publicWeight: newCatPublicWeight,
                                visibility: 'Visible',
                                bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
                              };
                              setVotingCategories([...votingCategories, entry]);
                              setNewCatTitle('');
                              triggerToast('Category Created', `'${entry.title}' successfully listed under target assets.`, 'success');
                            }}
                            className="w-full py-2 bg-gold hover:bg-gold-light text-dark font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg transition-transform cursor-pointer active:scale-95"
                          >
                            ✓ Create Category
                          </button>
                        </div>
                      </div>

                      {/* Form: Add Nominee */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4 lg:col-span-2">
                        <div className="border-b border-white/5 pb-2">
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest">Register Excellence Nominee</h4>
                          <p className="text-[9px] text-dim">Formally register candidate dossiers for voting validation.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Full candidate name</label>
                            <input 
                              type="text"
                              value={newNomName}
                              onChange={(e) => setNewNomName(e.target.value)}
                              placeholder="e.g. Manuel Da Silva"
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-serif"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Corporate Organization</label>
                            <input 
                              type="text"
                              value={newNomOrg}
                              onChange={(e) => setNewNomOrg(e.target.value)}
                              placeholder="e.g. Luanda Petro-Services"
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-sans"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Category Assignment</label>
                            <select 
                              value={newNomCategory}
                              onChange={(e) => setNewNomCategory(e.target.value)}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-sans text-xs"
                            >
                              {votingCategories.map(cat => (
                                <option key={cat.id} value={cat.title}>{cat.title}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Representing country</label>
                            <select 
                              value={newNomCountry}
                              onChange={(e) => setNewNomCountry(e.target.value as any)}
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-sans text-xs"
                            >
                              <option value="Angola">Angola (🇦🇴)</option>
                              <option value="South Africa">South Africa (🇿🇦)</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-[9px] uppercase text-dim tracking-wider font-mono mb-1">Biography / Career Merits Summary</label>
                            <textarea 
                              rows={2}
                              value={newNomBio}
                              onChange={(e) => setNewNomBio(e.target.value)}
                              placeholder="Brief highlights about the candidate's contribution..."
                              className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold font-sans text-xs"
                            ></textarea>
                          </div>
                        </div>

                        <div className="flex gap-2 text-xs pt-2">
                          <button 
                            onClick={() => {
                              if (!newNomName.trim() || !newNomOrg.trim()) {
                                triggerToast('Validation Fail', 'Candidate dossier must hold a legit name and organization.', 'alert');
                                return;
                              }
                              const entry: VotingNominee = {
                                id: `V-NOM-0${votingNominees.length + 1}`,
                                name: newNomName,
                                organization: newNomOrg,
                                country: newNomCountry,
                                bio: newNomBio,
                                category: newNomCategory,
                                status: 'Pending',
                                isFeatured: false,
                                photoUrl: newNomPhoto,
                                galleryCount: 1,
                                videoUrl: 'https://youtube.com',
                                websiteUrl: 'https://example.com',
                                socialLinks: { twitter: '@nominee', linkedin: 'linkedin.com/in/nominee' },
                                votesCount: 0,
                                judgesScore: 75
                              };
                              setVotingNominees([...votingNominees, entry]);
                              setNewNomName('');
                              setNewNomOrg('');
                              setNewNomBio('');
                              triggerToast('Nominee Created', `Submitted candidate dossier for '${entry.name}'. Status: Pending Approval.`, 'success');
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-gold to-gold-pale hover:from-gold-pale hover:to-gold text-dark font-mono text-[10px] uppercase font-bold tracking-widest rounded-lg transition-transform cursor-pointer active:scale-95"
                          >
                            ✓ Add Nominee File
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Integrated Categories table lists */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-wider">Voting Categories Registry</h4>
                          <p className="text-[10px] text-dim">Set dates, visibility status indexes, and jury relative contribution metrics.</p>
                        </div>
                        <span className="text-[11px] text-dim">{votingCategories.length} Mapped Categories</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Category Title</th>
                              <th className="p-4">Voting Period Schedule</th>
                              <th className="p-4 text-center">Judging Matrix Weights</th>
                              <th className="p-4 text-center">Portal Visibility</th>
                              <th className="p-4 text-center">General Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-ivory divide-y divide-white/5 font-mono">
                            {votingCategories.map(cat => (
                              <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-serif font-bold text-ivory/90 text-sm">
                                  {cat.title}
                                  <div className="text-[9px] text-dim font-mono mt-0.5">Asset ID: {cat.id}</div>
                                </td>
                                <td className="p-4 text-xs font-sans">
                                  <div>Start: <span className="text-gold-pale">{cat.startDate}</span></div>
                                  <div>End: <span className="text-dim">{cat.endDate}</span></div>
                                </td>
                                <td className="p-4 text-center text-xs">
                                  <div className="flex flex-col items-center">
                                    <div className="text-gold-pale font-bold">Judges: {cat.judgesWeight}%</div>
                                    <div className="text-dim">Public: {cat.publicWeight}%</div>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={() => {
                                      setVotingCategories(votingCategories.map(c => c.id === cat.id ? { ...c, visibility: c.visibility === 'Visible' ? 'Hidden' : 'Visible' } : c));
                                      triggerToast('Visibility Toggled', `Switched category portal visibility flag.`, 'success');
                                    }}
                                    className={`px-2 py-1.5 rounded text-[9px] font-bold uppercase ${
                                      cat.visibility === 'Visible' 
                                        ? 'bg-sa-green/10 text-sa-green border border-sa-green/20' 
                                        : 'bg-white/5 text-dim border border-white/10'
                                    }`}
                                  >
                                    {cat.visibility}
                                  </button>
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={() => {
                                      setVotingCategories(votingCategories.map(c => c.id === cat.id ? { ...c, active: !c.active } : c));
                                      triggerToast(cat.active ? 'Category Suspended' : 'Category Activated', `Switched active status for target category.`, 'success');
                                    }}
                                    className={`px-2 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                      cat.active 
                                        ? 'bg-sa-green/20 text-sa-green border border-sa-green/30' 
                                        : 'bg-angola-red/20 text-angola-red border border-angola-red/30'
                                    }`}
                                  >
                                    {cat.active ? '● Active' : '○ Disabled'}
                                  </button>
                                </td>
                                <td className="p-4 text-right">
                                  <button 
                                    onClick={() => {
                                      const text = prompt('Enter new category title:', cat.title);
                                      if (text) {
                                        setVotingCategories(votingCategories.map(c => c.id === cat.id ? { ...c, title: text } : c));
                                        triggerToast('Title Modified', 'Updated operational title name.', 'success');
                                      }
                                    }}
                                    className="p-1 px-2.5 rounded bg-white/5 text-xs text-dim hover:text-ivory border border-white/10 hover:bg-white/10"
                                  >
                                    Edit Title
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Integrated Nominees table list with Action handlers */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-5 border-b border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-wider">Candidate Dossiers Status Matrix</h4>
                          <p className="text-[10px] text-dim">Inspect public votes counts, toggle approval states, transfer segments, and feature nominees.</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const promptName = prompt('Enter candidate name to check for duplication overlap:');
                              if (promptName) {
                                triggerToast('Scanning Duplicates', `Scanning index records database for '${promptName}'...`, 'success');
                                setTimeout(() => {
                                  triggerToast('Duplicate Filter Results', 'No overlap anomaly profiles detected inside local states registers.', 'success');
                                }, 1500);
                              }
                            }}
                            className="px-3 py-1.5 bg-white/5 text-ivory border border-white/15 hover:bg-white/10 rounded font-mono text-[10px] uppercase tracking-wider transition-colors"
                          >
                            Merge duplications scanner
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Nominee Dossier</th>
                              <th className="p-4">Assigned category</th>
                              <th className="p-4 text-center">Voter Country</th>
                              <th className="p-4 text-right">Votes Stack</th>
                              <th className="p-4 text-center">Featured status</th>
                              <th className="p-4 text-center">Compliance status</th>
                              <th className="p-4 text-right">Actions Matrix</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-ivory divide-y divide-white/5 font-sans">
                            {votingNominees.map(nom => (
                              <tr key={nom.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                  <img src={nom.photoUrl} alt="Nominee Photo" className="w-10 h-10 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                                  <div>
                                    <div className="font-serif font-bold text-ivory/90 text-sm">{nom.name}</div>
                                    <div className="text-[10px] text-gold-pale font-mono">{nom.organization}</div>
                                    <div className="text-[9px] text-dim font-mono">(Gallery Files: {nom.galleryCount} | YouTube Active)</div>
                                  </div>
                                </td>
                                <td className="p-4 text-xs font-mono text-gold-pale max-w-xs truncate">
                                  {nom.category}
                                </td>
                                <td className="p-4 text-center text-xs font-mono">
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${nom.country === 'Angola' ? 'bg-angola-red/10 text-angola-red' : 'bg-sa-green/10 text-sa-green'}`}>
                                    {nom.country === 'Angola' ? '🇦🇴 Angola' : '🇿🇦 RSA'}
                                  </span>
                                </td>
                                <td className="p-4 text-right font-mono text-sm text-sa-green font-bold">
                                  {nom.votesCount.toLocaleString()}
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={() => {
                                      const updatedNom = { ...nom, isFeatured: !nom.isFeatured };
                                      setVotingNominees(votingNominees.map(n => n.id === nom.id ? updatedNom : n));
                                      saveSupabaseVotingNominee(updatedNom);
                                      triggerToast(nom.isFeatured ? 'Feature Off' : 'Featured On', `${nom.name} toggle featuring state updated for portal header.`, 'success');
                                    }}
                                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase transition-colors ${
                                      nom.isFeatured 
                                        ? 'bg-gold text-dark' 
                                        : 'bg-white/5 text-dim border border-white/10'
                                    }`}
                                  >
                                    {nom.isFeatured ? '★ Featured' : '☆ Promote'}
                                  </button>
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                                    nom.status === 'Approved' ? 'bg-sa-green/15 text-sa-green border border-sa-green/20' : 
                                    nom.status === 'Suspended' ? 'bg-angola-red/15 text-angola-red border border-angola-red/20' : 
                                    'bg-gold/15 text-gold border border-gold/20'
                                  }`}>
                                    {nom.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right whitespace-nowrap">
                                  <div className="flex gap-1 justify-end">
                                    <button 
                                      onClick={() => {
                                        const updatedNom = { ...nom, status: 'Approved' };
                                        setVotingNominees(votingNominees.map(n => n.id === nom.id ? updatedNom : n));
                                        saveSupabaseVotingNominee(updatedNom);
                                        triggerToast('Dossier Cleared', 'Approved for active public polling.', 'success');
                                      }}
                                      className="px-1.5 py-1 text-[8px] bg-sa-green/10 text-sa-green hover:bg-sa-green hover:text-dark rounded transition-colors uppercase font-mono font-bold"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const updatedNom = { ...nom, status: 'Suspended' };
                                        setVotingNominees(votingNominees.map(n => n.id === nom.id ? updatedNom : n));
                                        saveSupabaseVotingNominee(updatedNom);
                                        triggerToast('Dossier Suspended', 'Voter session requests will yield lock alerts.', 'alert');
                                      }}
                                      className="px-1.5 py-1 text-[8px] bg-angola-red/10 text-angola-red hover:bg-angola-red hover:text-white rounded transition-colors uppercase font-mono font-bold"
                                    >
                                      Suspend
                                    </button>
                                    <button 
                                      onClick={() => {
                                        const catsOption = votingCategories.filter(c => c.title !== nom.category);
                                        const choice = prompt(`Transfer category for ${nom.name}. Available:\n${catsOption.map((c, i) => `${i + 1}. ${c.title}`).join('\n')}\nInput exact matching name:`);
                                        if (choice && votingCategories.some(c => c.title === choice)) {
                                          const updatedNom = { ...nom, category: choice };
                                          setVotingNominees(votingNominees.map(n => n.id === nom.id ? updatedNom : n));
                                          saveSupabaseVotingNominee(updatedNom);
                                          triggerToast('Category Transferred', `Moved dossier safely to segment '${choice}'.`, 'success');
                                        } else if (choice) {
                                          triggerToast('Error Mapping', 'Invalid category target typed.', 'alert');
                                        }
                                      }}
                                      className="px-1.5 py-1 text-[8px] bg-white/5 text-dim hover:text-ivory border border-white/10 rounded transition-colors uppercase font-mono font-bold"
                                    >
                                      Transfer
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 3: GATEWAYS & VOTE PACKAGES */}
                {votingSubTab === 'packages' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Payment Gateways Config */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* RS South Africa */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="border-b border-white/5 pb-2">
                          <span className="text-xs text-sa-green uppercase tracking-widest font-mono font-bold">🇿🇦 RSA Channels</span>
                          <h4 className="font-serif text-base font-bold text-gold-pale">South Africa Supported Gateway</h4>
                        </div>
                        <div className="space-y-2.5 font-mono text-xs">
                          {Object.entries(saPaymentToggles).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center py-1">
                              <span className="uppercase text-dim">{k}</span>
                              <button 
                                onClick={() => {
                                  setSaPaymentToggles({...saPaymentToggles, [k]: !v});
                                  triggerToast('Gateway Toggled', `${k.toUpperCase()} status mutated for checkout sequences.`, 'success');
                                }}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${v ? 'bg-sa-green/25 text-sa-green' : 'bg-white/5 text-dim border border-white/10'}`}
                              >
                                {v ? '● Enabled' : '○ Offline'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Angola channels */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="border-b border-white/5 pb-2">
                          <span className="text-xs text-angola-red uppercase tracking-widest font-mono font-bold">🇦🇴 Angola Channels</span>
                          <h4 className="font-serif text-base font-bold text-gold-pale">Angola Gateway Control</h4>
                        </div>
                        <div className="space-y-2.5 font-mono text-xs font-bold">
                          {Object.entries(aoPaymentToggles).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center py-1">
                              <span className="uppercase text-dim">{k === 'multicaixa' ? 'MultiCaixa Express' : k === 'unitel' ? 'Unitel Money' : k === 'africell' ? 'Africell Money' : 'Bank Wire'}</span>
                              <button 
                                onClick={() => {
                                  setAoPaymentToggles({...aoPaymentToggles, [k]: !v});
                                  triggerToast('Gateway Toggled', 'Angola payments gateway override executed.', 'success');
                                }}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${v ? 'bg-angola-red/25 text-angola-red' : 'bg-white/5 text-dim border border-white/10'}`}
                              >
                                {v ? '● Enabled' : '○ Offline'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* International */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 space-y-4 shadow-lg">
                        <div className="border-b border-white/5 pb-2">
                          <span className="text-xs text-gold uppercase tracking-widest font-mono font-bold">🌍 International Channels</span>
                          <h4 className="font-serif text-base font-bold text-gold-pale">Global Gateway Platforms</h4>
                        </div>
                        <div className="space-y-2.5 font-mono text-xs">
                          {Object.entries(intPaymentToggles).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center py-1">
                              <span className="uppercase text-dim">{k}</span>
                              <button 
                                onClick={() => {
                                  setIntPaymentToggles({...intPaymentToggles, [k]: !v});
                                  triggerToast('Gateway Toggled', `Switched global gateway ${k.toUpperCase()}`, 'success');
                                }}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase ${v ? 'bg-gold/20 text-gold' : 'bg-white/5 text-dim border border-white/10'}`}
                              >
                                {v ? '● Enabled' : '○ Offline'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Premium Vote Packages */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                      {/* RSA Packages */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h4 className="font-serif text-base font-bold text-gold-pale mb-4 uppercase tracking-widest border-b border-white/5 pb-2">🇿🇦 South Africa Premium Packages configurator</h4>
                        <div className="space-y-3 font-mono text-xs">
                          {saPackages.map(pkg => (
                            <div key={pkg.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                              <div>
                                <span className="font-serif font-bold text-ivory text-sm">{pkg.title}</span>
                                <div className="text-[10px] text-dim font-sans mt-0.5">Allows casting {pkg.votes} votes in-batch.</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-dim">Price ZAR R:</span>
                                <input 
                                  type="number"
                                  value={pkg.priceZar}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setSaPackages(saPackages.map(p => p.id === pkg.id ? { ...p, priceZar: val } : p));
                                  }}
                                  className="bg-dark border border-white/15 rounded px-2 py-1 w-20 text-right text-gold font-bold focus:border-gold outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Angola Packages */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl">
                        <h4 className="font-serif text-base font-bold text-gold-pale mb-4 uppercase tracking-widest border-b border-white/5 pb-2">🇦🇴 Angola Premium Packages Configurator</h4>
                        <div className="space-y-3 font-mono text-xs">
                          {aoPackages.map(pkg => (
                            <div key={pkg.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                              <div>
                                <span className="font-serif font-bold text-ivory text-sm">{pkg.title}</span>
                                <div className="text-[10px] text-dim font-sans mt-0.5">Allows casting {pkg.votes} votes in-batch.</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-dim">Price AOA Kz:</span>
                                <input 
                                  type="number"
                                  value={pkg.priceAoa}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    setAoPackages(aoPackages.map(p => p.id === pkg.id ? { ...p, priceAoa: val } : p));
                                  }}
                                  className="bg-dark border border-white/15 rounded px-2 py-1 w-24 text-right text-gold font-bold focus:border-gold outline-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 4: AI FRAUD PREVENTION */}
                {votingSubTab === 'fraud' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* VPN and duplicates status meter */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale mb-1 uppercase tracking-widest">VPN Tunnel defense</h4>
                          <p className="text-[10px] text-dim leading-relaxed">Real-time mapping of proxy nodes. High velocity networks auto flagged.</p>
                        </div>
                        <div className="py-4 text-center">
                          <div className="text-3xl font-bold font-mono text-sa-green">🟢 SHIELD ARMED</div>
                          <p className="text-[9px] text-dim mt-1.5 uppercase font-mono">152 IP endpoints audited under device footprint</p>
                        </div>
                      </div>

                      {/* Device Fingerprinting */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale mb-1 uppercase tracking-widest">Device Fingerprinting</h4>
                          <p className="text-[10px] text-dim leading-relaxed">Authenticates unique hardware hashes. Rejects script-based browser injections.</p>
                        </div>
                        <div className="py-4 text-center">
                          <div className="text-3xl font-bold font-mono text-ivory/80">99.98% CLEAN</div>
                          <p className="text-[9px] text-dim mt-1.5 uppercase font-mono">100% telemetry validation success rate</p>
                        </div>
                      </div>

                      {/* Duplicate Voting Checks */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-5 flex flex-col justify-between shadow-md">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale mb-1 uppercase tracking-widest">Velocity Anomalies Monitor</h4>
                          <p className="text-[10px] text-dim leading-relaxed">Detects repetitive session bursts originating from concentrated cell towers.</p>
                        </div>
                        <div className="py-4 text-center text-angola-red">
                          <div className="text-3xl font-bold font-mono">0.02% THREAT</div>
                          <p className="text-[9px] text-dim mt-1.5 uppercase font-mono">2 high-density bots permanently blacklisted</p>
                        </div>
                      </div>
                    </div>

                    {/* Fraud Alerts Anomaly Log Table */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Shield size={16} className="text-angola-red" />
                            AI Anomaly Defense logs
                          </h4>
                          <p className="text-[10px] text-dim">Real-time alerts triggered by VPN connections, headless browser telemetry, or bot velocity overrides.</p>
                        </div>
                        <span className="text-xs text-dim">{votingFraudAlerts.filter(a => a.riskScore === 'High' && a.status === 'Pending').length} Serious Threats Pending Review</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Alert ID</th>
                              <th className="p-4">Voter Address / footprint</th>
                              <th className="p-4">Security trigger anomaly</th>
                              <th className="p-4 text-center">Risk Index</th>
                              <th className="p-4">Trigger Timestamp</th>
                              <th className="p-4 text-center">Auditor status</th>
                              <th className="p-4 text-right">Actions Override</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs text-ivory divide-y divide-white/5 font-mono">
                            {votingFraudAlerts.map(alert => (
                              <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-dim font-bold">{alert.id}</td>
                                <td className="p-4 text-xs font-sans">
                                  <div className="font-bold text-ivory">{alert.voterEmail}</div>
                                  <div className="text-[10px] text-dim font-mono mt-0.5">IP: {alert.ipAddress} | {alert.deviceFingerprint}</div>
                                </td>
                                <td className="p-4 text-xs font-sans text-dim italic">
                                  {alert.anomalyType}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    alert.riskScore === 'High' ? 'bg-angola-red/15 text-angola-red border border-angola-red/25 animate-pulse' : 
                                    alert.riskScore === 'Medium' ? 'bg-gold/15 text-gold border border-gold/25' : 
                                    'bg-sa-green/15 text-sa-green border border-sa-green/25'
                                  }`}>
                                    {alert.riskScore} RISK
                                  </span>
                                </td>
                                <td className="p-4 text-dim">{alert.timestamp}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                                    alert.status === 'Blocked' ? 'bg-angola-red/15 text-angola-red border border-angola-red/20' : 
                                    alert.status === 'Whitelisted' ? 'bg-sa-green/15 text-sa-green border border-sa-green/20' : 
                                    'bg-gold/15 text-gold border border-gold/20'
                                  }`}>
                                    {alert.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right whitespace-nowrap">
                                  <div className="flex gap-1 justify-end">
                                    <button 
                                      onClick={() => {
                                        setVotingFraudAlerts(votingFraudAlerts.map(a => a.id === alert.id ? { ...a, status: 'Whitelisted' } : a));
                                        triggerToast('IP Whitelisted', `Bypassed firewall constraints for ${alert.ipAddress}.`, 'success');
                                      }}
                                      className="px-2 py-1 text-[9px] bg-sa-green/10 text-sa-green hover:bg-sa-green hover:text-dark rounded uppercase font-bold"
                                    >
                                      Whitelist / Bypass
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setVotingFraudAlerts(votingFraudAlerts.map(a => a.id === alert.id ? { ...a, status: 'Blacklisted' } : a));
                                        triggerToast('IP Extinguished', `Permanently blocklisted hardware fingerprint.`, 'alert');
                                      }}
                                      className="px-2 py-1 text-[9px] bg-angola-red/10 text-angola-red hover:bg-angola-red hover:text-white rounded uppercase font-bold"
                                    >
                                      Blacklist Bot
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* VOTE AUDIT CENTER - SECURE IMMUTABLE POOL TRAILS */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-md">
                      <div className="p-5 border-b border-white/5 bg-white/5">
                        <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest flex items-center gap-2">
                          <Activity size={16} className="text-gold" />
                          Vote audit Center - Immutable ledger pool
                        </h4>
                        <p className="text-[10px] text-dim">Every dispatch transaction generates a unique on-chain footprint enclosing physical coordinates and payment clearances.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Vote ID</th>
                              <th className="p-4">User Identification</th>
                              <th className="p-4">Device Reference</th>
                              <th className="p-4">Location Coordinates</th>
                              <th className="p-4">Payment Cleared Ref</th>
                              <th className="p-4">Target Nominee Selection</th>
                              <th className="p-4 text-center">Threat Risk index</th>
                            </tr>
                          </thead>
                          <tbody className="text-dim divide-y divide-white/5 font-mono">
                            {voteAudits.map((item, index) => (
                              <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-ivory font-bold">{item.voteId}</td>
                                <td className="p-4 font-sans text-ivory">{item.voterId}</td>
                                <td className="p-4">{item.deviceId}</td>
                                <td className="p-4 flex items-center gap-1">
                                  <Globe size={11} className="text-gold-pale" />
                                  {item.location}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] ${item.paymentRef === 'FREE-VOTE' ? 'bg-white/5 text-dim' : 'bg-gold/20 text-gold-pale'}`}>
                                    {item.paymentRef}
                                  </span>
                                </td>
                                <td className="p-4 text-ivory font-serif font-bold">{item.nomineeName}</td>
                                <td className="p-4 text-center">
                                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden max-w-[60px] mx-auto">
                                    <div 
                                      className={`h-full ${item.riskScore > 10 ? 'bg-red-400' : 'bg-sa-green'}`}
                                      style={{ width: `${(item.riskScore / 20) * 100}%` }}
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 5: JUDGES PORTAL & FORMULA SCORING */}
                {votingSubTab === 'judges' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Formula selector and dynamic recalculator ledger */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
                        <div>
                          <h4 className="font-serif text-base font-bold text-gold-pale uppercase tracking-widest">Winner calculation Engine</h4>
                          <p className="text-xs text-dim">Dynamically switches mathematical weights assigned between delegates free public support and premium ballots vs jury score evaluations.</p>
                        </div>
                        
                        {/* Formula switch buttons */}
                        <div className="bg-dark p-1 rounded-xl border border-white/10 flex gap-2">
                          <button 
                            onClick={() => {
                              setScoringFormula('Formula1');
                              triggerToast('Formula 1 Active', 'Public: 40% | Judges Score Weight: 60%', 'success');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-mono font-bold transition-all ${
                              scoringFormula === 'Formula1' ? 'bg-gold text-dark' : 'text-dim hover:text-ivory'
                            }`}
                          >
                            ⭐ Formula A (40% Pub / 60% Judges)
                          </button>
                          <button 
                            onClick={() => {
                              setScoringFormula('Formula2');
                              triggerToast('Formula 2 Active', 'Public: 50% | Judges Score Weight: 50%', 'success');
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-mono font-bold transition-all ${
                              scoringFormula === 'Formula2' ? 'bg-gold text-dark' : 'text-dim hover:text-ivory'
                            }`}
                          >
                            ⚡ Formula B (50% Pub / 50% Judges)
                          </button>
                        </div>
                      </div>

                      {/* Recalculated leaderboard grid matrix */}
                      <div className="overflow-x-auto pt-2">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Rank ID</th>
                              <th className="p-4">Candidate dossier profile</th>
                              <th className="p-4">Assigned Award category</th>
                              <th className="p-4 text-right">Cumulative Public Votes</th>
                              <th className="p-4 text-center">Jury Avg Score (out of 100)</th>
                              <th className="p-4 text-right text-gold font-bold">Recalculated Final Score</th>
                            </tr>
                          </thead>
                          <tbody className="text-xs text-ivory divide-y divide-white/5 font-mono">
                            {(() => {
                              const pubWeight = scoringFormula === 'Formula1' ? 40 : 50;
                              const jdgWeight = scoringFormula === 'Formula1' ? 60 : 50;
                              
                              // Simple algorithm:
                              // Find max public votes count in list for normalization reference (scale to 100)
                              const maxVotes = Math.max(...votingNominees.map(n => n.votesCount)) || 1;
                              
                              const arrayWithFinal = votingNominees.map(nom => {
                                const normalizedPub = (nom.votesCount / maxVotes) * 100;
                                const finalScore = (normalizedPub * (pubWeight / 100)) + (nom.judgesScore * (jdgWeight / 100));
                                return { ...nom, finalScore };
                              }).sort((a, b) => b.finalScore - a.finalScore);

                              return arrayWithFinal.map((nom, idx) => (
                                <tr key={nom.id} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4 font-serif font-bold text-sm">#{idx + 1}</td>
                                  <td className="p-4 font-sans flex items-center gap-2">
                                    <span className="font-serif font-bold text-ivory text-sm">{nom.name}</span>
                                    <span className={`text-[8px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded ${nom.country === 'Angola' ? 'text-red-400' : 'text-sa-green'}`}>
                                      {nom.country === 'Angola' ? 'AO' : 'ZA'}
                                    </span>
                                  </td>
                                  <td className="p-4 text-dim">{nom.category}</td>
                                  <td className="p-4 text-right font-mono font-bold text-ivory">{nom.votesCount.toLocaleString()}</td>
                                  <td className="p-4 text-center font-bold text-sa-green">{nom.judgesScore} / 100</td>
                                  <td className="p-4 text-right text-gold font-bold text-sm">{nom.finalScore.toFixed(2)} pts</td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Judges Mapping List */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-md">
                      <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest">Evaluation juries directory</h4>
                          <p className="text-[10px] text-dim">Assign segment portfolios, define scoring weight bounds, comment submissions and verify conflicts of interests.</p>
                        </div>
                        <span className="text-xs text-dim">{votingJudges.length} Active Judges Assigned</span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim font-mono">
                              <th className="p-4">Judge Identifier</th>
                              <th className="p-4">Category Portfolio Assignment</th>
                              <th className="p-4 text-center">Score matrix components (L | I | I | G)</th>
                              <th className="p-4">Submission comments</th>
                              <th className="p-4 text-center">Conflict of interest index</th>
                              <th className="p-4 text-right">Filing Override</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-sans text-dim">
                            {votingJudges.map(judge => (
                              <tr key={judge.id} className="hover:bg-white/5 transition-colors text-xs">
                                <td className="p-4">
                                  <div className="font-serif font-bold text-ivory">{judge.name}</div>
                                  <div className="text-[9px] text-dim font-mono">Registry ID: {judge.id}</div>
                                </td>
                                <td className="p-4 font-mono text-gold-pale">{judge.category}</td>
                                <td className="p-4 text-center font-mono">
                                  <div className="text-[10px] text-ivory bg-white/5 px-2 py-1 rounded w-max mx-auto">
                                    L: {judge.scoreLeadership}% | I: {judge.scoreInnovation}% | I: {judge.scoreImpact}% | G: {judge.scoreGrowth}%
                                  </div>
                                </td>
                                <td className="p-4 font-sans italic text-[11px] max-w-xs truncate text-dim">
                                  "{judge.comments}"
                                </td>
                                <td className="p-4 text-center">
                                  <button 
                                    onClick={() => {
                                      setVotingJudges(votingJudges.map(j => j.id === judge.id ? { ...j, hasConflict: !j.hasConflict } : j));
                                      triggerToast('Conflict Modified', 'Jury segment conflict status changed inside evaluation forms.', 'success');
                                    }}
                                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                      judge.hasConflict 
                                        ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                                        : 'bg-sa-green/15 text-sa-green border border-sa-green/20'
                                    }`}
                                  >
                                    {judge.hasConflict ? '⚠️ CONFLICT DISCLOSED' : '✓ CLEAR SECURE'}
                                  </button>
                                </td>
                                <td className="p-4 text-right font-mono">
                                  <button 
                                    onClick={() => {
                                      const text = prompt('Enter numerical Leadership weight score out of 100:', judge.scoreLeadership.toString());
                                      if (text) {
                                        setVotingJudges(votingJudges.map(j => j.id === judge.id ? { ...j, scoreLeadership: parseInt(text) || 0 } : j));
                                        triggerToast('Scores updated', 'Rerolled leadership merit metrics.', 'success');
                                      }
                                    }}
                                    className="p-1 px-2 text-[9px] uppercase tracking-wider bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:text-ivory text-dim font-bold"
                                  >
                                    Edit Score Card
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 6: AWARDS NIGHT CONTROLS */}
                {votingSubTab === 'awards' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Winner locks matrix and encryption switches */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="border-b border-white/5 pb-3">
                          <h4 className="font-serif text-base font-bold text-gold-pale uppercase tracking-widest flex items-center gap-2">
                            <Lock size={16} className="text-gold" />
                            Security override locks
                          </h4>
                          <p className="text-[10px] text-dim font-mono">Manage critical switches controlling global public disclosure and on-chain immutability.</p>
                        </div>

                        <div className="space-y-4 font-mono text-xs">
                          {/* Winners Locked Option */}
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <div>
                              <span className="font-serif font-bold text-ivory text-sm">Winner Approval Lock</span>
                              <div className="text-[10px] text-dim font-sans mt-0.5">Locks final statistics ledger against database adjustments.</div>
                            </div>
                            <button 
                              onClick={() => {
                                setAwardsNightCtrl({ ...awardsNightCtrl, winnersLocked: !awardsNightCtrl.winnersLocked });
                                triggerToast('Winner Lock active', 'Operational indexes fully sealed.', 'success');
                              }}
                              className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] ${awardsNightCtrl.winnersLocked ? 'bg-red-500/25 text-red-400' : 'bg-white/5 text-dim border border-white/10'}`}
                            >
                              {awardsNightCtrl.winnersLocked ? '🔒 results Locked' : '🔓 Unlocked raw'}
                            </button>
                          </div>

                          {/* Cryptography switch option */}
                          <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <div>
                              <span className="font-serif font-bold text-ivory text-sm">Result Encryption schema</span>
                              <div className="text-[10px] text-dim font-sans mt-0.5">Encrypts local outputs in database storage with RSA keys.</div>
                            </div>
                            <button 
                              onClick={() => {
                                setAwardsNightCtrl({ ...awardsNightCtrl, resultsEncrypted: !awardsNightCtrl.resultsEncrypted });
                                triggerToast('Crypto state modified', 'Toggled secure index encryption wrapper.', 'success');
                              }}
                              className={`px-3 py-1.5 rounded uppercase font-bold text-[10px] ${awardsNightCtrl.resultsEncrypted ? 'bg-sa-green/20 text-sa-green' : 'bg-white/5 text-dim border border-white/10'}`}
                            >
                              {awardsNightCtrl.resultsEncrypted ? '🔒 Crypto Encrypted' : '🔓 Decrypted clear'}
                            </button>
                          </div>

                          {/* Leaderboard Mode Global selector */}
                          <div className="flex justify-between items-center py-2">
                            <div>
                              <span className="font-serif font-bold text-ivory text-sm">Leaderboard Visibility configuration</span>
                              <div className="text-[10px] text-dim font-sans mt-0.5">Manage portal view (Public view of scores, Anonymous, or Hidden entirely).</div>
                            </div>
                            <select 
                              value={leaderboardMode}
                              onChange={(e) => {
                                const mode = e.target.value as any;
                                setLeaderboardMode(mode);
                                triggerToast('Leaderboard Mode Set', `Visibility updated: Portal is operating on ${mode} view setup.`, 'success');
                              }}
                              className="bg-dark border border-white/15 rounded p-2 text-gold font-bold text-xs outline-none"
                            >
                              <option value="Public">Public Mode (Show Rankings)</option>
                              <option value="Anonymous">Anonymous Mode (Percentages Only)</option>
                              <option value="Private">Private Mode (Hidden until reveal)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Digital certificates compiler panel */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="border-b border-white/5 pb-3 mb-4">
                            <h4 className="font-serif text-base font-bold text-gold-pale uppercase tracking-widest">Credentials & Certificate engine</h4>
                            <p className="text-[10px] text-dim font-mono">Initiate massive automated certificate compilation and trophy courier tags tracking.</p>
                          </div>

                          <div className="bg-dark p-4 rounded-xl border border-white/10 space-y-3 font-mono text-[11px] leading-relaxed">
                            <p className="text-center font-bold text-gold border-b border-gold/10 pb-1.5">ASAE DIGITAL CERTIFICATE LOGS</p>
                            <p><strong>RECORDS PROCESSED:</strong> 5 Approved Winners Mapped</p>
                            <p><strong>CRYPTOKEN STATUS:</strong> SHA-256 Certificates generated</p>
                            <p><strong>DISPATCH QUEUE:</strong> {awardsNightCtrl.certificatesDispatched} Dispatched to emails</p>
                            <p className="text-[10px] text-dim"><strong>TROPHY TRACKS:</strong> {awardsNightCtrl.trophiesTracked}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono font-bold">
                          <button 
                            onClick={() => {
                              setAwardsNightCtrl({ ...awardsNightCtrl, certificatesDispatched: 5 });
                              triggerToast('Certificates Compiled! 📜', 'Generated and dispatched encrypted PDF certificates to winning delegates.', 'success');
                            }}
                            className="w-full py-3 bg-gold hover:bg-gold-light text-dark font-sans text-xs uppercase font-bold tracking-widest rounded-lg transition-transform cursor-pointer"
                          >
                            ✓ Compile Certificates
                          </button>
                          
                          <button 
                            onClick={() => {
                              setAwardsNightCtrl({ ...awardsNightCtrl, trophiesTracked: 'Delivered to Sandton Grand Ballroom Custodian Room 4B' });
                              triggerToast('Logistics updated', 'Trophies destination confirmed and received.', 'success');
                            }}
                            className="w-full py-3 bg-white/5 hover:bg-white/15 text-ivory border border-white/15 rounded-lg text-xs uppercase tracking-widest transition-transform cursor-pointer"
                          >
                            ✓ Track Trophy Cargo
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SUBTAB 7: DYNAMIC AI & BLOCKCHAIN ENTERPRISE */}
                {votingSubTab === 'predictive' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* AI Forecasting simulation container */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div>
                          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                          
                          <div className="border-b border-white/5 pb-3 mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles size={16} className="text-gold animate-bounce" />
                              <span className="text-[10px] text-gold uppercase tracking-widest font-mono font-bold">Predictive AI Smart Module</span>
                            </div>
                            <h4 className="font-serif text-base font-bold text-ivory">Enterprise AI Winner Prediction Engine</h4>
                            <p className="text-[10px] text-dim mt-0.5">Analyzes telemetry streams, cleans rogue velocity spikes, and generates statistical probability reports for nominees.</p>
                          </div>

                          {isPredicting ? (
                            <div className="py-12 text-center text-xs text-dim space-y-4">
                              <Loader2 size={36} className="animate-spin text-gold mx-auto" />
                              <p className="font-mono tracking-widest uppercase text-gold">AI MODEL REROLING GRAPHS...</p>
                            </div>
                          ) : predictedWinners.length > 0 ? (
                            <div className="space-y-3 font-mono text-xs pt-1">
                              <p className="text-[10px] text-dim mb-2 uppercase">Forecast outputs based on active metrics:</p>
                              {predictedWinners.map((w, i) => (
                                <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                                  <div>
                                    <div className="font-serif text-ivory font-bold">{w.name}</div>
                                    <div className="text-[9px] text-dim">{w.category}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-gold font-bold">{w.confidence}% Confidence</div>
                                    <div className="text-[8px] text-sa-green">Audit Clean factor: {w.riskCleanFactor}%</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-dim border border-dashed border-white/5 rounded-2xl">
                              <Sparkles size={32} className="mx-auto text-dim/35 mb-2" />
                              <p className="text-[11px] uppercase tracking-wider font-bold">Prediction matrix empty</p>
                              <p className="text-[10px] mt-1 px-4 text-center">Click prediction simulation below to feed current analytics databases to Gemini-Smart-Outcome engine.</p>
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => {
                            setIsPredicting(true);
                            setTimeout(() => {
                              setIsPredicting(false);
                              setPredictedWinners([
                                { name: 'Dr. Antonio Domingos', category: 'Business Leader of the Year', confidence: 94.6, riskCleanFactor: 99.8 },
                                { name: 'Dr. Lando António', category: 'Young Entrepreneur of the Year', confidence: 88.2, riskCleanFactor: 99.1 },
                                { name: 'Sarah Mokoena', category: 'Business Leader of the Year', confidence: 78.4, riskCleanFactor: 100.0 }
                              ]);
                              triggerToast('Predictions Compiled', 'Pushed forecast profiles onto smart visual indexes.', 'success');
                            }, 1800);
                          }}
                          className="w-full mt-4 py-3 bg-gradient-to-r from-gold to-gold-pale hover:from-gold-pale hover:to-gold text-dark font-mono text-xs uppercase font-bold tracking-widest rounded-lg transition-transform cursor-pointer"
                        >
                          ⚡ Execute Smart AI Forecasting
                        </button>
                      </div>

                      {/* Blockchain synchronization container */}
                      <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
                        <div>
                          <div className="border-b border-white/5 pb-3 mb-4">
                            <span className="text-[10px] text-sa-green uppercase tracking-widest font-mono font-bold">Ledger Decentralization</span>
                            <h4 className="font-serif text-base font-bold text-ivory">Blockchain Ledger synchronization</h4>
                            <p className="text-[10px] text-dim mt-0.5">Encrypts, serializes, and pushes every unique ballot validation footprint onto secure municipal consortium blockchains.</p>
                          </div>

                          <div className="bg-black/90 p-4 rounded-xl border border-white/10 h-40 overflow-y-auto font-mono text-[10px] text-sa-green leading-relaxed space-y-1 scrollbar-thin">
                            <div>LOGGING SESSION: Wed Jun 18 08:14:04 UTC 2026</div>
                            <div>- Initializing ASAE Blockchain Sync daemon...</div>
                            <div>- Binding local public/private compliance sockets...</div>
                            {isVerifyingBlockchain ? (
                              <>
                                <div className="text-gold animate-pulse">- GENERATING HASHLISTS SECURE MATRIX...</div>
                                <div className="text-gold">- Pushing Block ID #142516: Hash: 0xa49be29... [VALID]</div>
                                <div className="text-gold">- Pushing Block ID #142517: Hash: 0xf391c4d... [VALID]</div>
                                <div className="text-gold">- Pushing Block ID #142518: Hash: 0x902cf12... [VALID]</div>
                                <div className="text-gold">- Block ledger consensus reached (102 online validation nodes)</div>
                              </>
                            ) : (
                              <div className="text-dim">- Peer block matrix is fully passive.</div>
                            )}
                            <div>- Chain status: SECURE SYNCED (Blocks: 142,520 cast hashes mapped)</div>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setIsVerifyingBlockchain(true);
                            triggerToast('Ledger Sync Started', 'Streaming cryptographic hashes from local memory logs...', 'success');
                            setTimeout(() => {
                              setIsVerifyingBlockchain(false);
                              triggerToast('Ledger Synchronized! ⛓️', 'All 142,520 cast ballots validated and sealed onto ASAE ledger blockchain ecosystem.', 'success');
                            }, 2500);
                          }}
                          className="w-full mt-4 py-3 bg-white/5 hover:bg-white/15 text-ivory border border-white/15 rounded-lg font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
                        >
                          🔗 Synchronize Blockchain Ledgers
                        </button>
                      </div>
                    </div>

                    {/* Streamer block simulating real-time media links */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
                      <div>
                        <h4 className="font-serif text-base font-bold text-gold-pale uppercase tracking-widest">Premium integration API Streams</h4>
                        <p className="text-xs text-dim">Instantly activate corporate API stream channels for external media portals and live TV broadcasts.</p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                          <span className="text-[9px] text-green-400 font-bold uppercase block">🟢 WhatsApp integration</span>
                          <p className="text-[11px] text-dim">Allows polling directly over secure cellular chats.</p>
                          <button onClick={() => triggerToast('WhatsApp API', 'Status channel active. Target gateway clear.', 'success')} className="w-full py-1 text-[9px] uppercase tracking-wider bg-white/5 border border-white/15 hover:bg-gold hover:text-dark rounded transition-colors font-bold mt-2">
                            Activate Session
                          </button>
                        </div>
                        
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                          <span className="text-[9px] text-green-400 font-bold uppercase block">🟢 SMS gateway integrations</span>
                          <p className="text-[11px] text-dim">Handles SADC regional cell tower support numbers.</p>
                          <button onClick={() => triggerToast('SMS API Channel', 'Successfully triggered server daemon bind routing SMS blocks.', 'success')} className="w-full py-1 text-[9px] uppercase tracking-wider bg-white/5 border border-white/15 hover:bg-gold hover:text-dark rounded transition-colors font-bold mt-2">
                            Activate Session
                          </button>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                          <span className="text-[9px] text-gold uppercase font-bold block">⚡ Live TV Streaming API</span>
                          <p className="text-[11px] text-dim">Compiles live JSON leaderboard stats on public tickers.</p>
                          <button onClick={() => triggerToast('Media TV Ticker API', 'Token verified. Stream port launched to Sandton TV.', 'success')} className="w-full py-1 text-[9px] uppercase tracking-wider bg-white/5 border border-white/15 hover:bg-gold hover:text-dark rounded transition-colors font-bold mt-2">
                            Activate Session
                          </button>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
                          <span className="text-[9px] text-gold uppercase font-bold block">✨ Sponsor portal mappings</span>
                          <p className="text-[11px] text-dim font-sans text-dim">Directly link sponsor visual banners inside public streams.</p>
                          <button onClick={() => triggerToast('Sponsorship API', 'Sponsors visual cards loaded successfully.', 'success')} className="w-full py-1 text-[9px] uppercase tracking-wider bg-white/5 border border-white/15 hover:bg-gold hover:text-dark rounded transition-colors font-bold mt-2">
                            Activate Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* --- END EXCELLENCE AWARDS VOTING COMMAND CENTER --- */}


            {/* --- PAYMENTS & TREASURY TAB --- */}
            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Financial KPI Dashboard Cards */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-widest text-dim font-mono">Gross Transaction Inflow</div>
                    <div className="font-serif text-2xl font-bold text-sa-green mt-1">
                      {formatValue(totalRevenueZar)}
                    </div>
                    <p className="text-[9px] text-dim mt-2 font-mono">100% gateway clearing rate</p>
                  </div>
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-widest text-dim font-mono font-bold text-gold-pale">VAT Accounting Reserve (15% ZAR)</div>
                    <div className="font-serif text-2xl font-bold text-ivory/80 mt-1">
                      {formatValue(totalRevenueZar * 0.15)}
                    </div>
                    <p className="text-[9px] text-dim mt-2 font-mono">Scheduled tax allocation</p>
                  </div>
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-widest text-dim font-mono">Gateway Commission Costs (3.5% PG)</div>
                    <div className="font-serif text-2xl font-bold text-gold/80 mt-1">
                      {formatValue(netCommissionFeesZar)}
                    </div>
                    <p className="text-[9px] text-dim mt-2 font-mono">PayGate integration fee specs</p>
                  </div>
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                    <div className="text-[9px] uppercase tracking-widest text-dim font-mono font-bold text-sa-green">Audit Net Profit Margin</div>
                    <div className="font-serif text-2xl font-bold text-sa-green mt-1">
                      {formatValue(netProfitZar)}
                    </div>
                    <p className="text-[9px] text-dim mt-2 font-mono">Subtracting R120k production costs</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Ledger Listing and Transaction log table */}
                  <div className="col-span-2 bg-dark-card border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                      <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-wider">Treasury Ledger Logs</h4>
                      <span className="text-xs text-dim">Click any entry to preview formal invoices and receipts.</span>
                    </div>

                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest text-dim">
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4">Authorized Entity</th>
                          <th className="p-4">Event Tier category</th>
                          <th className="p-4 text-right">Inflow value</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-ivory divide-y divide-white/5">
                        {transactions.map((t) => (
                          <tr key={t.id} className={`hover:bg-white/5 transition-all cursor-pointer ${selectedTransaction?.id === t.id ? 'bg-gold/5' : ''}`} onClick={() => setSelectedTransaction(t)}>
                            <td className="p-4 font-mono text-xs text-dim">{t.id}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold flex items-center gap-2">
                                {t.entity}
                                <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wide ${
                                  t.status === 'Completed' ? 'bg-sa-green/15 text-sa-green' : 
                                  t.status === 'Pending' ? 'bg-amber-500/15 text-amber-500' : 
                                  'bg-red-500/15 text-red-400'
                                }`}>
                                  {t.status || 'Completed'}
                                </span>
                              </div>
                              <div className="text-[10px] text-dim font-mono">{t.type} - {t.date}</div>
                            </td>
                            <td className="p-4">
                              <span className="text-[10px] font-mono tracking-wider font-bold text-gold uppercase bg-white/5 px-2.5 py-1 rounded">
                                {t.tier} Tier
                              </span>
                            </td>
                            <td className="p-4 text-right text-gold font-bold font-mono">
                              {formatValue(t.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Accounting Ledger Assistant & Cash flow analysis */}
                  <div className="space-y-6">
                    {/* Invoice detail card */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl relative">
                      <div className="border-b border-white/5 pb-3">
                        <h4 className="font-serif text-base font-bold text-gold-pale">Premium Ticket Receipts</h4>
                        <p className="text-[10px] text-dim font-mono">Secure receipts generated in real-time for compliance audits.</p>
                      </div>

                      {selectedTransaction ? (
                        <div className="space-y-4 pt-3 text-xs font-sans">
                          <div className="bg-dark p-4 rounded-xl border border-white/15 space-y-2.5 font-mono text-[11px]">
                            <p className="text-center font-bold text-gold-pale tracking-widest text-xs border-b border-white/5 pb-2">ASAE SUMMIT SECURE INVOICE</p>
                            <p><strong>INVOICE REFH:</strong> {selectedTransaction.id}</p>
                            <p><strong>RECIPIENT:</strong> {selectedTransaction.entity}</p>
                            <p><strong>ITEMIZATION:</strong> {selectedTransaction.type}</p>
                            <p><strong>GROSS VAL:</strong> {formatValue(selectedTransaction.amount)}</p>
                            <p><strong>VAT 15% PORTION:</strong> {formatValue(selectedTransaction.amount * 0.15)}</p>
                            <p><strong>NET TO TREASURY:</strong> {formatValue(selectedTransaction.amount * 0.85)}</p>
                            <p className={`text-center border-t border-white/5 pt-2 text-[10px] font-bold ${
                              selectedTransaction.status === 'Completed' ? 'text-sa-green' :
                              selectedTransaction.status === 'Pending' ? 'text-amber-500 animate-pulse' :
                              'text-red-400'
                            }`}>
                              {selectedTransaction.status === 'Completed' ? '✓ DISPATCH CONFIRMED' :
                               selectedTransaction.status === 'Pending' ? '⚠ EFT AWAITING VERIFICATION' :
                               '✕ REVERTED / REFUNDED'}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            {selectedTransaction.status === 'Pending' && (
                              <button 
                                onClick={() => handleApprovePayment(selectedTransaction.id)}
                                className="w-full py-2 bg-sa-green/20 hover:bg-sa-green/30 text-sa-green border border-sa-green/40 font-mono text-xs uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                              >
                                Approve Bank Transfer
                              </button>
                            )}
                            <div className="flex gap-2">
                              <button 
                                onClick={() => triggerToast('Invoice Generated', `Receipt saved for ${selectedTransaction.entity}. PDF printed down.`, 'success')}
                                className="w-full py-2 bg-white/10 hover:bg-white/15 text-ivory border border-white/15 font-mono text-xs uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                              >
                                Print Invoice
                              </button>
                              {selectedTransaction.status !== 'Refunded' && (
                                <button 
                                  onClick={() => handleRefundPayment(selectedTransaction.id)}
                                  className="w-full py-2 bg-angola-red/10 hover:bg-angola-red/20 text-angola-red border border-angola-red/30 font-mono text-xs uppercase rounded-lg tracking-wider transition-colors cursor-pointer"
                                >
                                  Refund Order
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-dim border border-dashed border-white/5 rounded-2xl">
                          <CreditCard size={28} className="mx-auto text-dim/35 mb-2" />
                          <p className="text-[11px] uppercase tracking-wider font-bold">Ledger Passive</p>
                          <p className="text-[11px] mt-1 px-4">Highlight any transaction row in the left ledger table to generate printable tax receipts.</p>
                        </div>
                      )}
                    </div>

                    {/* Quick Calculator Panel */}
                    <div className="bg-dark-card border border-white/5 rounded-2xl p-6 shadow-md">
                      <h4 className="font-serif text-sm font-bold text-gold-pale uppercase tracking-widest mb-3">VAT & Net Auditor Tool</h4>
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-dim tracking-wider font-mono">Gross Transaction Amount (ZAR R)</label>
                          <input 
                            type="number" 
                            placeholder="ZAR Value (e.g. 50000)" 
                            className="w-full bg-dark border border-white/10 rounded p-2 text-ivory outline-none focus:border-gold"
                            onChange={(e) => {
                              const v = parseFloat(e.target.value) || 0;
                              const taxPortion = v * 0.15;
                              const netPortion = v - taxPortion;
                              // Dynamic message to bottom panel
                              const displaySpan = document.getElementById('calc-display-span');
                              if (displaySpan) {
                                displaySpan.innerText = `Computed Gross VAT 15%: R ${taxPortion.toLocaleString()} | Computed Treasury Net: R ${netPortion.toLocaleString()}`;
                              }
                            }}
                          />
                        </div>
                        <div className="bg-dark/80 p-2.5 rounded text-[10px] text-gold font-mono leading-relaxed" id="calc-display-span">
                          Enter any gross Rand value into the slider field above to immediately audit tax allocations of your corporate bookings.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- END PAYMENTS TAB --- */}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
