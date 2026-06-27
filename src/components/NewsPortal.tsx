import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Calendar, Clock, ArrowRight, User, Eye, Target, Sparkles, Search,
  Building, ChevronRight, Check, Copy, Download, DollarSign, BarChart2, 
  Globe, Laptop, HelpCircle, AlertCircle, Share2, Award, Megaphone, 
  FileText, ExternalLink, RefreshCw, Send, CheckCircle2, TrendingDown,
  Lock, Landmark
} from 'lucide-react';
import asaeLogo from '../assets/images/asae_logo_1781797572399.jpg';
import { 
  isSupabaseConfigured,
  getSupabaseBlogs,
  getSupabaseAds
} from '../lib/supabase';

// Define Article interface
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: 'Awards' | 'Business' | 'Innovation' | 'Leadership' | 'Africa' | 'Interviews' | 'Conference and Awards';
  author: string;
  role: string;
  date: string;
  readTime: string;
  image: string;
  isSponsored?: boolean;
  sponsorName?: string;
  sponsorLogo?: string;
  views: number;
  ctr: string;
}

// Simulated High-Quality Editorial Database
const ARTICLES: Article[] = [
  {
    id: 'art-1',
    category: 'Innovation',
    title: 'Angolan Tech Ecosystem Sees 40% Surge in South African Venture Capital Inflows',
    excerpt: 'How collaborative investment frameworks in Cape Town and Johannesburg tech hubs are fueling seed rounds for Luanda\'s emerging fintech and logistics startups.',
    content: [
      'The corridor between South Africa and Angola is rapidly solidifying into one of Africa\'s most lucrative digital finance trade routes. In the first half of 2026, tech startup seed investments from Southern African funds into Angolan enterprises climbed by an unprecedented 40% year-on-year, indicating robust bilateral confidence.',
      'This investment highway is propelled by a convergence of Angolan entrepreneurial talent and sophisticated South African venture capital. Key sectors benefiting from this influx include hyper-local mobile payment processors, automated logistics networks servicing the Luanda-Huambo-Lobito corridors, and agricultural data platforms designed for Sub-Saharan soil metrics.',
      'Fintech startups, in particular, remain the primary magnets. Angolan developers have displayed remarkable skill in building offline-first systems to support merchants outside coastal city centers, a model South African networks like Nedbank and Standard Bank find extremely ripe for cross-border scalability.',
      'Leading investors suggest that the next twelve months will usher in broader regulatory alignments. With SADC working towards harmonized digital passporting, startups in Luanda can soon capture larger markets across South Africa with minimal friction, creating a truly unified economic playground.',
      'Ultimately, this digital bridge isn\'t just about capital exchange; it represents a mutual transfer of technology. While South African funds provide scale, Angolan innovators supply deep cultural mastery of local consumer preferences, paving the way for a highly integrated SADC tech landscape.'
    ],
    author: 'ASAE Editorial',
    role: 'SADC Senior Tech Analyst',
    date: 'June 18, 2026',
    readTime: '6 min read',
    image: 'https://media.cnn.com/api/v1/images/stellar/prod/angotic-2.jpg?q=w_1110,c_fill',
    views: 18450,
    ctr: '3.8%'
  },
  {
    id: 'art-2',
    category: 'Business',
    title: 'Luanda-Cape Town Maritime Corridors Reshaping Southern Atlantic Logistics',
    excerpt: 'Exclusive inspection of the updated maritime routes and port agreements aiming to slash ocean transit times by 48 hours for general dry cargo.',
    content: [
      'Logistics frameworks are receiving a major upgrade as maritime hubs in Luanda and Cape Town execute deeper trade alignment pacts. By streamlining custom compliance checks and installing priority docking slots for regional shipping lines, transit lag is set to drop dramatically.',
      'Previously, shipping dry goods between South Africa and Angola was plagued by bureaucratic delays at multiple ports of entry. This forced manufacturers to rely on expensive overland freight options that were subject to highway checkpoints and changing regional tariffs.',
      'The modern port upgrades leverage digital tracking grids powered by unified SADC compliance codes. Now, freight loads leaving the Port of Cape Town are pre-cleared for entry into Luanda via cloud-based declarations, allowing ships to discharge cargo almost immediately.',
      'This efficiency represents a substantial victory for manufacturers, particularly in the agricultural and heavy industrial sectors. Reducing oceanic transport wait times directly preserves shelf lives and eliminates thousands of dollars in refrigeration overheads.',
      'SADC economic researchers estimate that maritime volume could spike by 25% by late 2026. This bodes exceptionally well for small and medium enterprises which previously found cross-border shipping cost-prohibitive.'
    ],
    author: 'ASAE Ediorial',
    role: 'Logistics Architecture Lead',
    date: 'June 17, 2026',
    readTime: '4 min read',
    image: 'https://issafrica.s3.amazonaws.com/site/images/banners/1777454604568-2026-04-29-iss-today-banner.jpg',
    views: 12110,
    ctr: '2.9%'
  },
  {
    id: 'art-3',
    category: 'Business',
    title: 'Fintech Borderlands: Addressing SADC Regulatory Multiplicity',
    excerpt: 'Key policy makers from Angola and South Africa gather in Cape Town to propose single-license frameworks for regional payment processors.',
    content: [
      'Financial regulators from Angola\'s BNA and South Africa\'s SARB are initiating historic discussions to create an emergency single-license gateway. This will allow micro-payment operators to cross borders under one central regulatory compliance card.',
      'For years, the SADC tech corridor has been hindered by complex legislative differences. A fintech startup validated in Pretoria has historically had to restart its entire compliance roadmap from scratch when attempting to service clients in Luanda.',
      'The proposed framework centers around standardizing digital KYC (Know Your Customer) systems. By sharing secure credential pools, SADC financial hubs can instantly verify the identities of merchants and end-users without duplicating local background assessments.',
      'Industry experts describe this unified license as the holy grail of regional trade. Reducing entry hurdles will not only stimulate fintech scaling but will also drive consumer remittance costs down to record lows.',
      'If the Cape Town discussions yield a signed protocol, initial pilot tests could launch as early as December 2026, forever changing SADC monetary mobility.'
    ],
    author: 'ASAE Ediorial',
    role: 'Macro Finance Analyst',
    date: 'June 15, 2026',
    readTime: '5 min read',
    image: 'https://web-assets.bcg.com/12/39/634c39b3427892fde8f2eb2f5f5c/hero-edit.jpg',
    views: 9340,
    ctr: '3.1%'
  },
  {
    id: 'art-4',
    category: 'Conference and Awards',
    title: 'The Golden Gala: ASAE Celebration Anchored in Cape Town maritime Elegance',
    excerpt: 'Detailed review of the upcoming awards evening celebrating Angolans thriving in South Africa, from enterprise pioneers to cultural trendsetters.',
    content: [
      'As the date of the 26-27 November 2026 ASAE Gala moves closer, preparations have accelerated around the prestigious V&A Waterfront venue in Cape Town. The selection highlights the region\'s oceanic beauty as a backdrop for celebrating Pan-African triumph.',
      'This year\'s nominee files demonstrate the extraordinary diversity of the Angolan diaspora. From innovators managing multi-million dollar finance structures to visionary visual artists and academic leaders, the breadth of cross-border excellence is breathtaking.',
      'Beyond simple celebration, the gala serves as a premier engine of high-level diplomatic networking. Business summits matching South African infrastructure funds with Angolan development opportunities will run parallel to the red-carpet receptions.',
      'Organizing teams have confirmed that visual themes will marry modern architectural aesthetics with traditional Angolan Samba history, creating an unforgettable cultural environment for delegates.',
      'Tickets continue to see record-breaking volumes from Luanda, Johannesburg, and Durban, establishing the 2026 gala as the defining networking gala of the season.'
    ],
    author: 'ASAE Editorial',
    role: 'Arts & Culture Lead Advocate',
    date: 'June 14, 2026',
    readTime: '4 min read',
    image: 'https://images.squarespace-cdn.com/content/v1/6441f90ef5769311158053d2/7eb48472-af3e-4fca-b217-6d0bbd2b8356/250813_Noel+Leeming+D2-65.jpg?format=1500w',
    views: 14204,
    ctr: '4.5%'
  },
  {
    id: 'art-5',
    category: 'Leadership',
    title: 'Sovereign Wealth Alignment: Developing Shared SADC Resource Capital',
    excerpt: 'Strategic review of state-backed sovereign funds seeking infrastructure alliances across energy, rail grids, and regional deepwater shipping hubs.',
    content: [
      'State financial officers are evaluating historic opportunities to co-invest national sovereign wealth into high-yield SADC infrastructure blocks. Strategic discussions highlight renewable energy networks and freight rail links as prime targets.',
      'Coordinating resource infrastructure is widely seen as critical to maintaining industrial advantages across Southern Africa. Establishing faster supply corridors will allow domestic products to reach global markets far more competitively.',
      'The initial focus points center on building state-of-the-art logistics depots near maritime borders. These projects are mathematically designed to absorb supply shocks and establish durable cross-border warehousing reserves.',
      'Environmental parameters also play a main role. Funding packages require developers to commit to rigorous soil preservation and low-emission building techniques, aligning with global sustainable development indexes.',
      'Success in these state alliances would establish a robust blueprint for other regional economic blocks on the continent, showing how sovereign reserves can drive collective prosperity.'
    ],
    author: 'ASAE Editorial',
    role: 'Macroeconomic Council Advisor',
    date: 'June 11, 2026',
    readTime: '7 min read',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPHR1at0_6cAHBeY3mY44vs9sxVHuSIE-hdg&s',
    views: 8900,
    ctr: '2.2%'
  },
  {
    id: 'art-6',
    category: 'Interviews',
    title: 'Diaspora Architecture: Translating Luanda’s Real Estate Boom through SADC Networks',
    excerpt: 'An exclusive conversation detailing why South African real estate firms are funneling expertise and capital into Angola\'s high-end urban spaces.',
    content: [
      'In this detailed interview, we consult with architectural and real estate directors who are helping shape the modern skyline of Luanda. Collaborative projects are rising rapidly, indicating deep cross-border investment interest.',
      'For decades, Luanda\'s premium property markets existed in isolation due to language and regulatory barriers. Today, highly integrated investment networks are bypassing these hurdles, providing secure pathways for South African developers.',
      'The design philosophies focus heavily on combining energy-saving technology with durable local materials. Building towers capable of self-ventilating under Atlantic breezes severely lowers electricity needs while establishing striking visual structures.',
      'Developers report that urban populations are extremely eager for mixed-use neighborhoods. Combining commercial offices, residential blocks, and green community spaces directly boosts social interactions and local retail economies.',
      'As financial channels become more transparent, experts predict that SADC investment into major developments will double over the next three years, cementing real estate as a primary pillar of regional growth.'
    ],
    author: 'ASAE Editorial',
    role: 'Urban Planning Correspondent',
    date: 'June 09, 2026',
    readTime: '8 min read',
    image: 'https://cdn.ca.emap.com/wp-content/uploads/sites/12/2017/05/angola.jpg',
    views: 11250,
    ctr: '3.4%'
  },
  {
    id: 'art-7',
    category: 'Africa',
    title: 'SADC Academic Networks: Cultivating Key Bilateral Research Initiatives',
    excerpt: 'Universities in Angola and South Africa sign treaties targeting cross-border climate science, oceanography, and linguistic diaspora history.',
    content: [
      'Universities across Angola and South Africa are launching joint doctoral programs to explore SADC oceanic ecosystems and bilingual heritage. These collaborations will build durable reservoirs of localized scientific insight.',
      'Historically, research projects on Southern African oceanography were lead-funded and managed by institutions in the global north. This often meant data and policy recommendations lacked deep understanding of local coastal communities.',
      'The new academic coalition places regional universities in complete control of research direction. Programs will emphasize sustainable marine management, tracking coastal ecosystem changes, and documenting SADC oral histories.',
      'Linguistic studies will also explore the fascinating cross-pollenation of Portuguese, English, and Bantu languages across SADC hubs, highlighting centuries of cultural trade.',
      'Funding grants supported by private sponsors guarantee that research outputs are open-access, ensuring policy makers and local school grids can freely benefit from this knowledge.'
    ],
    author: 'ASAE Editorial',
    role: 'Bilateral Science Council Chair',
    date: 'June 06, 2026',
    readTime: '5 min read',
    image: 'https://hsrc.ac.za/wp-content/uploads/2025/03/Article-10-Image-7.jpg',
    views: 10400,
    ctr: '2.5%'
  }
];

// Sponsored Article Insertions
const SPONSORED_ARTICLES: Object[] = [
  {
    id: 'spons-1',
    category: 'Business',
    isSponsored: true,
    sponsorName: 'Unitel Angola',
    sponsorLogo: 'U',
    title: 'Connecting SADC: Unitel Deploys Strategic High-Speed Subsurface Fiber Link',
    excerpt: 'Discover how Unitel\'s massive multi-million dollar ocean fiber project is delivering enterprise-grade latency standards across SADC tech corridors.',
    content: [
      'Unitel has completed the initial testing phases of its high-speed ocean fiber network linking Luanda directly to major data centers in Cape Town. This landmark infrastructure project severely reduces digital transport delays for SADC enterprises.',
      'Historically, regional data traffic was routed through European servers, adding substantial lag and raising operational expenses. Unitel\'s direct subsurface path cuts out this middleman route entirely.',
      'SADC businesses can now enjoy rapid, low-latency data replication, secure cloud systems, and pristine real-time video communications. This is a game-changer for high-frequency financial platforms and shipping networks.',
      'By offering customizable bandwidth pricing packages and robust disaster-recovery protocols, Unitel ensures that small business owners and massive corporations alike can comfortably scale in the digital sector.'
    ],
    author: 'ASAE Editorial',
    role: 'Corporate Communications',
    date: 'Sponsored Feature',
    readTime: '3 min read',
    image: 'https://techafricanews.com/wp-content/uploads/2026/06/UNitel-.png',
    views: 24100,
    ctr: '5.2%'
  },
  {
    id: 'spons-2',
    category: 'Business',
    isSponsored: true,
    sponsorName: 'Standard Bank',
    sponsorLogo: 'S',
    title: 'The SADC Trade Gateway: Streamlining Corporate Capital Across Maritime Borders',
    excerpt: 'Providing seamless corporate escrow, hedging services, and multi-currency business accounts tailored specifically for Angolan-SA exporters.',
    content: [
      'Standard Bank continues to expand its specialized corporate trade desks to support businesses operating in South Africa and Angola. By simplifying cross-border funds transfers, the bank elimates weeks of banking lag.',
      'Exporters frequently experience transaction blockages due to volatile exchange regimes. Standard Bank\'s customized hedging services allow trade managers to lock in rates and shield businesses from economic shifts.',
      'To make transactions even simpler, the corporate trade portal integrates digital invoice loading and automated customs tax tracking. This provides logistics managers with real-time tracking of financial clearance statuses.',
      'Standard Bank remains dedicated to fueling SADC commercial integration, linking ambitious firms with capital reserves, operational expertise, and powerful cross-border trade networks.'
    ],
    author: 'Standard Bank Group',
    role: 'Trade Desk Insights',
    date: 'Sponsored Feature',
    readTime: '3 min read',
    image: 'https://www.moneyweb.co.za/wp-content/uploads/2014/07/Standard-Bank-7-1024x683.jpg',
    views: 19800,
    ctr: '4.8%'
  }
];

const mapBlogToArticle = (blog: any): Article => {
  let paragraphs: string[] = [];
  if (Array.isArray(blog.content)) {
    paragraphs = blog.content;
  } else if (typeof blog.content === 'string') {
    paragraphs = blog.content.split('\n').filter((p: string) => p.trim().length > 0);
  }
  return {
    id: blog.id || `blog-${Math.random()}`,
    title: blog.title || '',
    excerpt: blog.excerpt || '',
    content: paragraphs,
    category: blog.category || 'Business',
    author: blog.author || 'ASAE Editorial',
    role: blog.role || 'Contributor',
    date: blog.date || new Date().toLocaleDateString(),
    readTime: blog.readTime || '3 min read',
    image: blog.image || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    views: blog.views || 0,
    ctr: '2.5%'
  };
};

export function NewsPortal() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [showAdvertisePortal, setShowAdvertisePortal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load articles state (combining localStorage 'blogs' with ARTICLES)
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const storedBlogs = localStorage.getItem('blogs');
      if (storedBlogs) {
        const blogsList = JSON.parse(storedBlogs);
        const publishedArticles = blogsList
          .filter((b: any) => b.status === 'Published')
          .map(mapBlogToArticle);
        return [...publishedArticles, ...ARTICLES];
      }
    } catch (e) {
      console.error('Failed to load dynamic blogs:', e);
    }
    return ARTICLES;
  });

  // Load sponsored articles state (combining localStorage 'ads' with default)
  const [sponsoredArticles, setSponsoredArticles] = useState<Article[]>(() => {
    const defaultSponsored = [
      {
        id: 'spon-1',
        category: 'Business' as const,
        title: 'Connecting Diaspora Wealth: Standard Bank Sovereign Corridor Initiatives',
        excerpt: 'Standard Bank unveils localized treasury solutions designed explicitly for high-net-worth Angolan operators expanding inside SADC industries.',
        content: [
          'High-net-worth Angolan investors looking south have historically navigated highly fragmented regional banking standards. Standard Bank\'s latest private wealth corridors eliminate these friction points by uniting SADC corporate accounts under a unified relationship desk.',
          'With dedicated specialists residing in both Luanda and Johannesburg, clients receive real-time currency risk hedging and immediate offshore portfolio routing guidance. This structural transparency simplifies cross-border commercial acquisitions, allowing capital to flow efficiently to high-impact developments.'
        ],
        author: 'Standard Bank Group',
        role: 'Exclusive Banking Sponsor',
        date: 'Sponsored Feature',
        readTime: '3 min read',
        image: 'https://www.moneyweb.co.za/wp-content/uploads/2014/07/Standard-Bank-7-1024x683.jpg',
        views: 19800,
        ctr: '4.8%',
        isSponsored: true,
        sponsorName: 'Standard Bank'
      }
    ];

    try {
      const storedAds = localStorage.getItem('ads');
      if (storedAds) {
        const adsList = JSON.parse(storedAds);
        const activeSponsorPosts = adsList
          .filter((ad: any) => ad.category === 'sponsored-post' && ad.status === 'Active')
          .map((ad: any, idx: number) => ({
            id: ad.id || `spon-dyn-${idx}`,
            category: 'Business' as const,
            title: `Brought to you by ${ad.brand}: Premium Industry Partnerships`,
            excerpt: `Exclusive business insights and services tailored for the SADC region in collaboration with ${ad.brand}.`,
            content: [
              `As part of ASAE's strategic alliance program, we are proud to highlight ${ad.brand}'s contributions to facilitating economic cooperation and development between South Africa and Angola.`,
              `Stay tuned for localized support channels and enterprise incentives curated to optimize growth and connectivity.`
            ],
            author: ad.brand,
            role: 'Enterprise Partner',
            date: 'Sponsored Feature',
            readTime: '2 min read',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
            views: ad.impressions || 0,
            ctr: ad.ctr || '2.0%',
            isSponsored: true,
            sponsorName: ad.brand
          }));
        return [...activeSponsorPosts, ...defaultSponsored];
      }
    } catch (e) {}
    return defaultSponsored;
  });

  // Re-sync blogs/ads from localStorage whenever user focuses or returns
  useEffect(() => {
    const syncData = async () => {
      if (isSupabaseConfigured) {
        try {
          const [supabaseBlogs, supabaseAds] = await Promise.all([
            getSupabaseBlogs(),
            getSupabaseAds()
          ]);
          if (supabaseBlogs && supabaseBlogs.length > 0) {
            const publishedArticles = supabaseBlogs
              .filter((b: any) => b.status === 'Published')
              .map(mapBlogToArticle);
            setArticles([...publishedArticles, ...ARTICLES]);
            localStorage.setItem('blogs', JSON.stringify(supabaseBlogs));
          }
          if (supabaseAds && supabaseAds.length > 0) {
            const activeSponsorPosts = supabaseAds
              .filter((ad: any) => ad.category === 'sponsored-post' && ad.status === 'Active')
              .map((ad: any, idx: number) => ({
                id: ad.id || `spon-dyn-${idx}`,
                category: 'Business' as const,
                title: `Brought to you by ${ad.brand}: Premium Industry Partnerships`,
                excerpt: `Exclusive business insights and services tailored for the SADC region in collaboration with ${ad.brand}.`,
                content: [
                  `As part of ASAE's strategic alliance program, we are proud to highlight ${ad.brand}'s contributions to facilitating economic cooperation and development between South Africa and Angola.`,
                  `Stay tuned for localized support channels and enterprise incentives curated to optimize growth and connectivity.`
                ],
                author: ad.brand,
                role: 'Enterprise Partner',
                date: 'Sponsored Feature',
                readTime: '2 min read',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
                views: ad.impressions || 0,
                ctr: ad.ctr || '2.0%',
                isSponsored: true,
                sponsorName: ad.brand
              }));
            const defaultSponsored = [
              {
                id: 'spon-1',
                category: 'Business' as const,
                title: 'Connecting Diaspora Wealth: Standard Bank Sovereign Corridor Initiatives',
                excerpt: 'Standard Bank unveils localized treasury solutions designed explicitly for high-net-worth Angolan operators expanding inside SADC industries.',
                content: [
                  'High-net-worth Angolan investors looking south have historically navigated highly fragmented regional banking standards. Standard Bank\'s latest private wealth corridors eliminate these friction points by uniting SADC corporate accounts under a unified relationship desk.',
                  'With dedicated specialists residing in both Luanda and Johannesburg, clients receive real-time currency risk hedging and immediate offshore portfolio routing guidance. This structural transparency simplifies cross-border commercial acquisitions, allowing capital to flow efficiently to high-impact developments.'
                ],
                author: 'Standard Bank Group',
                role: 'Exclusive Banking Sponsor',
                date: 'Sponsored Feature',
                readTime: '3 min read',
                image: 'https://www.moneyweb.co.za/wp-content/uploads/2014/07/Standard-Bank-7-1024x683.jpg',
                views: 19800,
                ctr: '4.8%',
                isSponsored: true,
                sponsorName: 'Standard Bank'
              }
            ];
            setSponsoredArticles([...activeSponsorPosts, ...defaultSponsored]);
            localStorage.setItem('ads', JSON.stringify(supabaseAds));
          }
          return; // Skip fallback
        } catch (e) {
          console.error('Failed to sync from Supabase in NewsPortal:', e);
        }
      }

      try {
        const storedBlogs = localStorage.getItem('blogs');
        if (storedBlogs) {
          const blogsList = JSON.parse(storedBlogs);
          const publishedArticles = blogsList
            .filter((b: any) => b.status === 'Published')
            .map(mapBlogToArticle);
          setArticles([...publishedArticles, ...ARTICLES]);
        }
      } catch (e) {}
      try {
        const storedAds = localStorage.getItem('ads');
        if (storedAds) {
          const adsList = JSON.parse(storedAds);
          const activeSponsorPosts = adsList
            .filter((ad: any) => ad.category === 'sponsored-post' && ad.status === 'Active')
            .map((ad: any, idx: number) => ({
              id: ad.id || `spon-dyn-${idx}`,
              category: 'Business' as const,
              title: `Brought to you by ${ad.brand}: Premium Industry Partnerships`,
              excerpt: `Exclusive business insights and services tailored for the SADC region in collaboration with ${ad.brand}.`,
              content: [
                `As part of ASAE's strategic alliance program, we are proud to highlight ${ad.brand}'s contributions to facilitating economic cooperation and development between South Africa and Angola.`,
                `Stay tuned for localized support channels and enterprise incentives curated to optimize growth and connectivity.`
              ],
              author: ad.brand,
              role: 'Enterprise Partner',
              date: 'Sponsored Feature',
              readTime: '2 min read',
              image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
              views: ad.impressions || 0,
              ctr: ad.ctr || '2.0%',
              isSponsored: true,
              sponsorName: ad.brand
            }));
          const defaultSponsored = [
            {
              id: 'spon-1',
              category: 'Business' as const,
              title: 'Connecting Diaspora Wealth: Standard Bank Sovereign Corridor Initiatives',
              excerpt: 'Standard Bank unveils localized treasury solutions designed explicitly for high-net-worth Angolan operators expanding inside SADC industries.',
              content: [
                'High-net-worth Angolan investors looking south have historically navigated highly fragmented regional banking standards. Standard Bank\'s latest private wealth corridors eliminate these friction points by uniting SADC corporate accounts under a unified relationship desk.',
                'With dedicated specialists residing in both Luanda and Johannesburg, clients receive real-time currency risk hedging and immediate offshore portfolio routing guidance. This structural transparency simplifies cross-border commercial acquisitions, allowing capital to flow efficiently to high-impact developments.'
              ],
              author: 'Standard Bank Group',
              role: 'Exclusive Banking Sponsor',
              date: 'Sponsored Feature',
              readTime: '3 min read',
              image: 'https://www.moneyweb.co.za/wp-content/uploads/2014/07/Standard-Bank-7-1024x683.jpg',
              views: 19800,
              ctr: '4.8%',
              isSponsored: true,
              sponsorName: 'Standard Bank'
            }
          ];
          setSponsoredArticles([...activeSponsorPosts, ...defaultSponsored]);
        }
      } catch (e) {}
    };

    syncData();

    window.addEventListener('focus', syncData);
    return () => window.removeEventListener('focus', syncData);
  }, []);

  const getCombinedArticles = () => {
    const result: any[] = [];
    let sponsoredCounter = 0;
    
    articles.forEach((art, index) => {
      result.push(art);
      if ((index + 1) % 3 === 0 && sponsoredCounter < sponsoredArticles.length) {
        result.push(sponsoredArticles[sponsoredCounter]);
        sponsoredCounter++;
      }
    });
    return result;
  };

  // States for dynamic, AI Search-Grounded breaking news ticker
  const [breakingNews, setBreakingNews] = useState<string[]>([
    "ANGOLA SA AWARDS EXCELLENCE 2026: Official nomination windows remain open for global submissions",
    "PARTNERSHIPS LOCKED: Southern Africa's major financial channels support brand growth networks",
    "SUMMIT UPDATE: Cape Town's V&A Waterfront venue finalized for major SADC economic development assemblies",
    "LIVE ROADCAST SYSTEM: Full High-Definition video streams integrated securely for global audiences",
    "AUDIT STATUS: Over 48,150 voter logs sealed in secure blockchain transaction records"
  ]);
  const [newsLoading, setNewsLoading] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<Date | null>(null);

  const fetchBreakingNews = async () => {
    setNewsLoading(true);
    try {
      const response = await fetch('/api/breaking-news');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Received non-JSON response from server");
      }
      const data = await response.json();
      if (data && Array.isArray(data.items)) {
        const cleaned = data.items.map((item: string) => item.replace(/^\s*✦\s*/, ''));
        setBreakingNews(cleaned);
        setLastUpdatedTime(new Date());
      }
    } catch (err) {
      console.warn('Failed to load real-time breaking news from server, using local fallback:', err);
    } finally {
      setNewsLoading(false);
    }
  };

  useEffect(() => {
    fetchBreakingNews();
    const interval = setInterval(fetchBreakingNews, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, []);

  // Advertise Form state
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState('');
  const [selectedAdTier, setSelectedAdTier] = useState<'leaderboard' | 'sidebar' | 'infeed' | 'sponsored-post'>('leaderboard');
  const [adDurationMonths, setAdDurationMonths] = useState<number>(3);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Advertiser mock analytics metrics
  const [selectedAnalyticsBrand, setSelectedAnalyticsBrand] = useState<'Standard Bank' | 'Unitel Angola' | 'Banco de Fomento Angola'>('Standard Bank');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to custom window scroll-to-news event or hash change
    const checkHash = () => {
      if (window.location.hash === '#news-portal') {
        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (window.location.hash === '#advertise') {
        setShowAdvertisePortal(true);
        window.location.hash = ''; // reset so user can click again
      }
    };
    window.addEventListener('hashchange', checkHash);
    checkHash(); // check on initialization
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const categories = ['All', 'Awards', 'Business', 'Innovation', 'Leadership', 'Africa', 'Interviews'];

  const filteredArticles = getCombinedArticles().filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesQuery = searchQuery.trim() === '' || 
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.sponsorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(art.content) && art.content.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      art.author?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Grab the absolute featured article (usually the first regular article)
  const mainFeaturedArticle = ARTICLES[0];
  const sideTrendingArticles = ARTICLES.slice(1, 3);

  // Pricing calculations
  const priceList = {
    leaderboard: { name: 'Premium Leaderboard Banner (728x90)', dpm: 120000, value: 450 },
    sidebar: { name: 'Sidebar Sticky Rectangle (300x250 or 300x600)', dpm: 85000, value: 300 },
    infeed: { name: 'In-Feed Native Ad Card', dpm: 60000, value: 200 },
    'sponsored-post': { name: 'Full Sponsored ASAE-Style Editorial Article', dpm: 150000, value: 850 }
  };

  const calculatedCost = priceList[selectedAdTier].value * adDurationMonths;
  const calculatedTraffic = priceList[selectedAdTier].dpm * adDurationMonths;

  const handleAdFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !brandEmail) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setBrandName('');
      setBrandEmail('');
    }, 5000);
  };

  const getSponsorCampaignStats = () => {
    switch(selectedAnalyticsBrand) {
      case 'Standard Bank':
        return {
          bannerName: 'SADC Trade Gateway Hub Campaign',
          impressions: '354,209',
          impressionsDelta: '+12.4%',
          clicks: '10,980',
          clicksDelta: '+8.1%',
          ctr: '3.1%',
          ctrStatus: 'High Performing',
          conversions: '412 text leads',
          daysActive: 45,
          daysRemaining: 15,
          activeAdFormat: 'Full Sponsored Editorial Article & Sidebar Slot',
          totalSpent: '$1,350',
          estimatedRoi: '3.4x SADC Conversion Weight'
        };
      case 'Unitel Angola':
        return {
          bannerName: 'Unitel Fiber SADC Ocean Link Campaign',
          impressions: '584,103',
          impressionsDelta: '+18.7%',
          clicks: '30,373',
          clicksDelta: '+15.2%',
          ctr: '5.2%',
          ctrStatus: 'Excellent Peak Reach',
          conversions: '984 signups',
          daysActive: 28,
          daysRemaining: 62,
          activeAdFormat: 'Premium Leaderboard Banner & In-Feed Native Card',
          totalSpent: '$2,400',
          estimatedRoi: '4.8x Enterprise Value Engagement'
        };
      case 'Banco de Fomento Angola':
        return {
          bannerName: 'BFA Horizon Private Banking Campaign',
          impressions: '194,150',
          impressionsDelta: '+4.3%',
          clicks: '5,047',
          clicksDelta: '+2.8%',
          ctr: '2.6%',
          ctrStatus: 'Niche Elite CTR',
          conversions: '89 private consulting slots booked',
          daysActive: 12,
          daysRemaining: 48,
          activeAdFormat: 'Sidebar Sticky Rectangle (300x250) Only',
          totalSpent: '$1,200',
          estimatedRoi: '5.1x High-Net-Worth Advisory ROI'
        };
    }
  };

  const campaignStats = getSponsorCampaignStats();

  return (
    <div ref={containerRef} id="news-portal" className="bg-dark pt-24 pb-32 px-6 md:px-12 border-t border-gold/10 relative overflow-hidden">
      
      {/* Decorative Accent Lights */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-angola-red/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* FIXED ADVERTISE TRIGGER ON SCROLL: ALWAYS VISIBLE AS REQUIRED */}
      <div className="fixed bottom-8 right-8 z-[45] pointer-events-auto">
        <motion.button
          onClick={() => setShowAdvertisePortal(true)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-6 py-4 bg-gradient-to-br from-gold to-gold-light text-dark font-sans text-xs font-black tracking-[2.5px] uppercase shadow-[0_8px_30px_rgba(201,162,39,0.45)] hover:shadow-[0_12px_40px_rgba(201,162,39,0.6)] cursor-pointer border border-gold-light/40 [clip-path:polygon(8px_0%,100%_0%,calc(100%-8px)_100%,0%_100%)]"
        >
          <Megaphone size={14} className="animate-bounce" />
          <span>ADVERTISE WITH US</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-angola-red"></span>
          </span>
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* 🔥 TOP STRIP (Breaking News Ticker) */}
        <div className="relative mb-12 bg-dark-card border-y border-gold/15 py-3.5 overflow-hidden flex items-center pr-40">
          <div className="absolute left-0 top-0 bottom-0 px-4 bg-gold text-dark font-sans text-[10px] font-black uppercase tracking-[2px] flex items-center z-20 shadow-[8px_0_15px_rgba(0,0,0,0.5)] gap-1">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-angola-red"></span>
            </span>
            BREAKING NEWS
          </div>
          
          <div className="flex-1 overflow-hidden relative select-none pl-36 whitespace-nowrap">
            <div className="inline-block animate-marquee font-mono text-xs tracking-wider text-gold-pale/80 space-x-12">
              {/* Duplicate list items to create infinite loop effect seamlessly combining with transform keyframes */}
              {[...breakingNews, ...breakingNews].map((news, idx) => (
                <span key={idx} className="inline-block">✦ {news}</span>
              ))}
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 px-3 bg-dark/90 border-l border-white/5 backdrop-blur-md text-[9px] font-mono text-gold-pale/60 flex items-center gap-1.5 z-20 shadow-[-8px_0_15px_rgba(0,0,0,0.5)]">
            <Sparkles size={10} className="text-gold animate-pulse" />
            <span className="hidden sm:inline">AI Grounded</span>
            {lastUpdatedTime && (
              <span className="text-sa-green font-bold">
                ({lastUpdatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
            <button 
              onClick={fetchBreakingNews} 
              disabled={newsLoading} 
              title="Refresh breaking news via AI Search Grounding"
              className="hover:text-gold transition-colors ml-1 p-0.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={10} className={newsLoading ? "animate-spin text-gold" : "text-dim hover:text-gold"} />
            </button>
          </div>
        </div>

        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left">
            <span className="text-[10px] font-mono tracking-[4px] text-gold uppercase block mb-1">
              🏆 Layer 2 & 3: MEDIA & SPONSOR HUB
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-black text-ivory tracking-tight leading-tight">
              African ASAE-Style <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-pale via-gold to-gold-light">Awards Media Platform</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAdvertisePortal(true)}
              className="px-6 py-3 bg-white/5 hover:bg-gold/10 text-gold hover:text-gold border border-gold/20 hover:border-gold/50 rounded flex items-center gap-2 font-sans text-xs font-bold tracking-widest transition-all uppercase cursor-pointer"
            >
              <Megaphone size={14} />
              <span>Advertise With Us</span>
            </button>
            <a 
              href="#vote" 
              className="px-6 py-3 bg-gradient-to-br from-gold to-gold-light text-dark font-sans text-xs font-black tracking-widest hover:shadow-[0_4px_20px_rgba(201,162,39,0.5)] rounded transition-all uppercase"
            >
              Nominate Now
            </a>
          </div>
        </div>

        {/* 🧭 NEWS CATEGORIES & SEARCH (Filter Tabs & Search Input) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-8 border-b border-white/5">
          <div className="flex items-center overflow-x-auto gap-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-gold text-dark font-black' 
                    : 'bg-dark-card hover:bg-white/5 text-dim hover:text-ivory border border-white/5'
                }`}
              >
                {cat === 'All' ? '⚡ All Platform News' : cat}
              </button>
            ))}
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full lg:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-dim">
              <Search size={14} className="text-gold/70" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news & sponsor features..."
              className="w-full bg-dark-card border border-white/10 hover:border-gold/30 focus:border-gold rounded-full text-xs text-ivory font-sans pl-10 pr-10 py-2.5 outline-none transition-all placeholder-dim"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-dim hover:text-gold text-xs font-bold transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 📰 SECTION 2: FEATURED NEWS (HIGH VALUE - NO ADS HERE - CLEAN AND PRESTIGIOUS) */}
        {selectedCategory === 'All' && searchQuery.trim() === '' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Featured Article (Large Left Card) */}
            <div className="lg:col-span-8 flex flex-col group h-full">
              <div 
                onClick={() => setActiveArticle(mainFeaturedArticle)}
                className="bg-dark-card border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer hover:border-gold/40 transition-all shadow-xl hover:shadow-2xl hover:shadow-gold/5"
              >
                {/* Image panel with category label */}
                <div className="relative h-96 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent z-10"></div>
                  <img 
                    src={mainFeaturedArticle.image} 
                    alt={mainFeaturedArticle.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-gold text-dark font-sans text-[9px] font-black tracking-widest uppercase rounded">
                    ★ FEATURED {mainFeaturedArticle.category.toUpperCase()}
                  </div>
                  
                  {/* Bottom Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-left">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-gold mb-3">
                      <span className="flex items-center gap-1"><User size={12} /> {mainFeaturedArticle.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {mainFeaturedArticle.date}</span>
                    </div>
                    <h3 className="font-serif text-2xl md:text-3.5xl font-bold text-ivory tracking-wide leading-tight group-hover:text-gold transition-colors">
                      {mainFeaturedArticle.title}
                    </h3>
                  </div>
                </div>

                {/* Card Excerpt Body */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-dark-card leading-relaxed text-left">
                  <p className="text-sm text-dim leading-relaxed mb-6">
                    {mainFeaturedArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] uppercase text-gold tracking-widest font-black">
                      {mainFeaturedArticle.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-sans text-xs tracking-widest text-gold hover:text-white font-bold transition-all uppercase">
                      Read Full Story <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Smaller Trending Stories (Right Column) */}
            <div className="lg:col-span-4 flex flex-col gap-6 text-left">
              <div className="bg-gradient-to-br from-gold/5 via-transparent to-transparent border border-white/5 px-6 py-4 rounded-xl flex items-center justify-between">
                <span className="font-serif font-black text-sm text-gold-pale flex items-center gap-2">
                  <TrendingUp size={16} /> TRENDING ON PORTAL
                </span>
                <span className="text-[10px] font-mono text-dim">UPDATED LIVE</span>
              </div>

              {sideTrendingArticles.map((art, index) => (
                <div 
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="bg-dark-card border border-white/5 rounded-xl p-5 hover:border-gold/30 cursor-pointer h-full flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-gold">
                      <span className="uppercase font-bold">Category: {art.category}</span>
                      <span className="bg-white/5 text-dim px-2 py-0.5 rounded">#{index + 1} TRENDING</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-ivory group-hover:text-gold leading-snug transition-colors line-clamp-3">
                      {art.title}
                    </h4>
                    <p className="text-xs text-dim mt-2 line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-dim">{art.readTime}</span>
                    <span className="flex items-center gap-1 text-[10px] font-sans font-bold tracking-widest text-gold group-hover:translate-x-1 transition-transform uppercase">
                      Open <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              ))}

              {/* Instant Newsletter ad capture inside news container */}
              <div className="bg-gradient-to-tr from-dark-card via-dark-card to-gold/10 p-6 rounded-xl border border-gold/15 space-y-4">
                <div className="flex items-center gap-2 text-gold">
                  <Sparkles size={16} />
                  <span className="font-sans text-[10px] font-black uppercase tracking-[2px] block">VIP ASAE SADC List</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-ivory">Receive SADC Corporate Briefs</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter business email" 
                    className="flex-1 bg-black border border-white/10 rounded px-3 py-1.5 font-sans text-xs focus:border-gold focus:outline-none"
                  />
                  <button className="bg-gold hover:bg-gold-light text-dark px-3 py-1.5 rounded font-sans text-xs font-bold uppercase transition-colors cursor-pointer">
                    Join
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 💰 SECTION 3: FIRST AD PLACEMENT (HEADER BANNER - DEFINED LEADERBOARD RESERVED FOR PREMIUM BRAND PARTNERS) */}
        <div className="w-full mb-12">
          <div className="relative bg-dark-card border border-white/5 rounded-2xl overflow-hidden p-6 md:py-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-gold/5 max-w-5xl mx-auto">
            {/* Top gold banner thread */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-angola-red via-gold to-sa-green"></div>
            
            <div className="text-left space-y-1.5">
              <span className="inline-flex items-center gap-1 bg-gold/10 text-gold px-2.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-[2px] font-bold">
                🔒 PREMIUM SPONSOR PLACEMENT · LEADERBOARD 728X90
              </span>
              <h4 className="font-serif text-lg font-bold text-ivory tracking-wide leading-tight">
                Advertise Your Brand to Over 50,000 Pan-African Executive Leaders
              </h4>
              <p className="font-sans text-xs text-dim">
                Highly targeted placements across SADC tech corridors. Average CTR of 3.8% across industries.
              </p>
            </div>

            <div className="flex gap-3 shrink-0">
              <button 
                onClick={() => setShowAdvertisePortal(true)}
                className="px-6 py-2.5 bg-gradient-to-br from-gold to-gold-light text-dark font-sans text-xs font-black tracking-widest rounded shadow-md hover:-translate-y-0.5 transition-all uppercase cursor-pointer"
              >
                BOOK THIS BANNER
              </button>
            </div>
          </div>
        </div>

        {/* 🧱 SECTION 4: LATEST NEWS GRID PARTNERED WITH SECTION 5: SIDEBAR COMPONENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LATEST NEWS COLUMN (8 of 12) */}
          <div className="lg:col-span-8 text-left space-y-8">
            <h3 className="font-serif text-2xl font-black text-ivory border-b border-white/5 pb-3 flex items-center gap-2">
              <span className="text-gold">✦</span> Latest SADC Insights & Editorials
            </h3>

            {filteredArticles.length === 0 ? (
              <div className="bg-dark-card border border-white/5 rounded-2xl p-12 text-center space-y-4">
                <p className="text-gold font-serif text-lg font-bold">No SADC Insights Found</p>
                <p className="text-dim text-xs max-w-md mx-auto">
                  We couldn't find any articles or partner features matching your search query: <span className="text-ivory">"{searchQuery}"</span>. Try adjusting your keywords or category filters.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 bg-white/5 hover:bg-gold/10 text-gold border border-gold/20 hover:border-gold rounded font-sans text-xs uppercase font-bold tracking-wider transition-all cursor-pointer"
                >
                  Clear Search Query
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((art) => {
                  const isSpons = art.isSponsored;

                  return (
                    <div 
                      key={art.id}
                      onClick={() => setActiveArticle(art)}
                      className={`rounded-xl border flex flex-col justify-between h-full group overflow-hidden transition-all duration-300 cursor-pointer ${
                        isSpons 
                          ? 'bg-gradient-to-b from-gold/5 to-transparent border-gold/25 hover:border-gold/60 shadow-[0_4px_25px_rgba(201,162,39,0.06)]' 
                          : 'bg-dark-card border-white/5 hover:border-gold/30'
                      }`}
                    >
                      <div>
                        {/* Card Cover */}
                        <div className="h-44 overflow-hidden relative">
                          <img 
                            src={art.image} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          {isSpons ? (
                            <span className="absolute top-4 left-4 z-10 bg-gold text-dark text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow">
                              ★ Sponsored Editorial By {art.sponsorName}
                            </span>
                          ) : (
                            <span className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur text-gold text-[8px] font-mono uppercase tracking-wider px-2 py-0.5 rounded">
                              {art.category}
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center justify-between text-[10px] font-mono text-dim">
                            <span className="flex items-center gap-1"><User size={10} /> {art.author}</span>
                            <span>{art.date}</span>
                          </div>
                          
                          <h4 className={`font-serif text-base font-bold leading-snug group-hover:text-gold transition-colors ${
                            isSpons ? 'text-gold-pale' : 'text-ivory'
                          }`}>
                            {art.title}
                          </h4>

                          <p className="text-xs text-dim line-clamp-3 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-dim tracking-wider">{art.readTime}</span>
                        <span className="flex items-center gap-1 font-sans text-xs font-black tracking-wider text-gold group-hover:translate-x-1.5 transition-transform uppercase">
                          {isSpons ? 'View Offer' : 'Read Article'} <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 📊 SECTION 5: SIDEBAR (VERY IMPORTANT FOR AD REVENUE) (4 of 12) */}
          <div className="lg:col-span-4 space-y-8 text-left">
            <h3 className="font-serif text-xl font-bold text-ivory border-b border-white/5 pb-3.5 flex items-center gap-2">
              <span>✦</span> Corporate Sponsor Board
            </h3>

            {/* Ad Space 1: Medium Rectangle 300x250 */}
            <div className="bg-dark-card border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-gold/30 duration-300 transition-all">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gold"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono bg-white/5 text-dim px-2 py-0.5 rounded uppercase tracking-widest leading-none font-bold">
                    📢 SPONSORED ADS (300X250)
                  </span>
                  <span className="text-[8px] font-mono text-gold-pale/50">PLATFORM SPACE AD-300</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif text-base font-bold text-gold-pale tracking-wide">
                    Banco de Fomento Angola
                  </h4>
                  <p className="text-xs text-dim leading-relaxed">
                    Connecting premium investors with sovereign venture channels. Tap here to consult our private banking wealth advisors in Cape Town and Luanda.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-sans text-dim uppercase tracking-wider">Premium Placement BFA</span>
                <button 
                  onClick={() => setShowAdvertisePortal(true)}
                  className="bg-gold text-dark text-[10px] font-sans font-black tracking-widest px-3 py-1.5 rounded uppercase hover:bg-gold-light transition-all cursor-pointer"
                >
                  VISIT WEB
                </button>
              </div>
            </div>

            {/* 🔥 Trending Now Widget */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
              <span className="font-serif text-sm font-bold text-gold flex items-center gap-2">
                <TrendingUp size={14} /> METRICS: REAL-TIME TRAFFIC
              </span>
              
              <div className="space-y-4 font-sans text-xs">
                {[
                  { title: 'Standard Bank Multi-Currency Desks', cat: 'Finance', trend: '+14% spike' },
                  { title: 'Luanda Tech Seed Venture Allocations', cat: 'Venture Capital', trend: '+35% surge' },
                  { title: 'SADC Unified Digital Maritime Logistics', cat: 'Logistics', trend: 'Trending Fast' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-dark p-3 rounded-lg border border-white/5">
                    <div>
                      <span className="text-[10px] text-dim block font-black uppercase text-gold/80">{item.cat}</span>
                      <span className="font-bold text-ivory block mt-0.5">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono bg-sa-green/10 text-sa-green px-2 py-1 rounded font-bold">{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🏆 Featured Sponsors Box with Corporate Logos */}
            <div className="bg-dark-card border border-white/5 rounded-2xl p-6 space-y-4">
              <span className="font-serif text-sm font-bold text-ivory flex items-center gap-2">
                <Building size={14} /> FEATURED BRANDS
              </span>
              
              <div className="grid grid-cols-2 gap-3 font-sans text-[10px]">
                {[
                  { name: 'Unitel AO', desc: 'Enterprise SADC Fiber' },
                  { name: 'Standard Bank', desc: 'Global Trade Hub' },
                  { name: 'Banco Fomento', desc: 'Secure Private Wealth' },
                  { name: 'TAAG Airlines', desc: 'Bilateral Aviation' }
                ].map((item) => (
                  <div key={item.name} className="bg-dark border border-white/5 p-3 rounded-xl flex flex-col justify-between group hover:border-gold/25 transition-all text-center">
                    <div className="w-8 h-8 rounded bg-gold/10 text-gold flex items-center justify-center font-serif text-sm font-black mx-auto mb-2">
                      {item.name[0]}
                    </div>
                    <span className="font-bold text-ivory block font-mono">{item.name}</span>
                    <span className="text-[8px] text-dim block mt-0.5">{item.desc}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setShowAdvertisePortal(true)}
                className="w-full text-center block text-[10px] font-sans font-bold text-gold hover:text-white transition-colors uppercase pt-2"
              >
                Become Featured Brand Partner ➔
              </button>
            </div>

            {/* Large Sidebar Space: 300x600 Display banner slot */}
            <div className="bg-dark-card border border-white/10 rounded-2xl p-6 relative overflow-hidden h-[400px] flex flex-col justify-between shadow-lg">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=500&q=80')] bg-cover bg-center opacity-10"></div>
              
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-angola-red to-gold"></div>

              <div className="space-y-3 z-10">
                <span className="text-[8px] font-mono bg-gold/20 text-gold px-2 py-0.5 rounded uppercase tracking-widest font-black">
                  📢 SPONSOR BLOCK CONTAINER (300X600)
                </span>
                <h4 className="font-serif text-xl font-bold text-ivory leading-tight pt-2">
                  Build Cross-Border Authority Across SADC Regions
                </h4>
                <p className="text-xs text-dim leading-relaxed">
                  Lock premium placements in our high-traffic sidebar. Present your company directly to sovereign investment desks and corporate decision makers.
                </p>
              </div>

              <div className="z-10 space-y-3">
                <div className="p-3 bg-[#111111] rounded border border-white/5 font-mono text-[9px] text-gold text-center">
                  SECURE HIGH-IMPACT PLACEMENT ACTIVE NOW
                </div>
                <button 
                  onClick={() => setShowAdvertisePortal(true)}
                  className="w-full py-3 bg-gradient-to-br from-gold to-gold-light text-dark font-sans text-xs font-black tracking-widest rounded uppercase cursor-pointer"
                >
                  ADVERTISE HERE
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 📰 SECTION 6: NEWS ARTICLE COMPREHENSIVE MODAL READER LAYOUT */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/95 backdrop-blur-md flex justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-dark-card border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 h-[90vh]"
            >
              
              {/* Dynamic Header accent line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-angola-red via-gold to-sa-green z-30"></div>

              {/* Back / Close Trigger */}
              <button 
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-dim hover:text-ivory bg-dark/50 z-30 cursor-pointer"
              >
                ✕
              </button>

              {/* Reader Scaffold Scroll container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 text-left bg-[#111111]">
                
                {/* ARTICLE HEADER DETAILS */}
                <div className="max-w-4xl mx-auto space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-mono uppercase tracking-wider">
                      {activeArticle.isSponsored ? 'SPONSORED FEATURE' : activeArticle.category}
                    </span>
                    <span className="text-[10px] font-mono text-dim">| Published Editorial Desk</span>
                  </div>

                  <h1 className="font-serif text-2xl md:text-4.5xl font-bold leading-tight text-ivory tracking-wide">
                    {activeArticle.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-y border-white/5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/25 border border-gold/40 flex items-center justify-center font-bold font-serif text-gold text-lg shrink-0">
                        {activeArticle.author[0]}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-ivory block">{activeArticle.author}</span>
                        <span className="text-[10px] text-dim block font-mono uppercase tracking-wider">{activeArticle.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-dim">
                      <span>✦ {activeArticle.date}</span>
                      <span>✦ {activeArticle.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="max-w-4xl mx-auto mb-8 rounded-2xl overflow-hidden border border-white/5 max-h-[400px]">
                  <img 
                    src={activeArticle.image} 
                    alt={activeArticle.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* LAYOUT: 70% CONTENT | 30% SIDEBAR */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT CONTENT COLUMN 70% */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Paragraph 1 */}
                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {activeArticle.content[0] || 'Loading...'}
                    </p>

                    {/* Paragraph 2 */}
                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {activeArticle.content[1] || ''}
                    </p>

                    {/* 💰 INTEGRATED AD PLACEMENT: IN-CONTENT BANNER AFTER PARAGRAPH 2 */}
                    <div className="my-8 p-5 bg-dark border border-gold/15 rounded-xl text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-gold/10 text-gold text-[7px] font-mono tracking-widest uppercase font-bold rounded-bl border-l border-b border-gold/15">
                        In-Article Display AD
                      </div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-dim block uppercase tracking-[2px]">SPONSORED PLACEMENT</span>
                        <h4 className="font-serif text-sm font-bold text-go-pale text-gold-pale">Standard Bank Multi-Currency Desks</h4>
                        <p className="text-[11px] text-dim leading-relaxed">
                          Opening corporate SADC trade corridors with zero remittance delay. Consult our cross-border private specialists instantly.
                        </p>
                        <button 
                          onClick={() => setShowAdvertisePortal(true)} 
                          className="text-[10px] text-gold font-bold uppercase tracking-wider flex items-center gap-1 hover:text-white transition-colors cursor-pointer pt-1"
                        >
                          Access SADC Corridors ➔
                        </button>
                      </div>
                    </div>

                    {/* Paragraph 3 */}
                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {activeArticle.content[2] || ''}
                    </p>

                    {/* Paragraph 4 */}
                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {activeArticle.content[3] || ''}
                    </p>

                    {/* 💰 INTEGRATED AD PLACEMENT: MID-ARTICLE SPONSORED MESSAGE BOX */}
                    <div className="my-8 p-5 bg-gradient-to-r from-dark to-white/5 border-l-4 border-angola-red rounded-r-xl text-left bg-dark/60">
                      <div className="text-xs font-mono text-dim flex items-center gap-2 mb-1.5 uppercase font-bold tracking-wider">
                        <InfoIcon size={12} className="text-angola-red" /> SPONSORED MESSAGE BOX
                      </div>
                      <p className="font-serif italic text-xs leading-relaxed text-gold-pale">
                        "Connect your brand directly with corporate decision-makers and sovereign investment managers on this exact screen. This high-focus mid-article ad segment achieves an average CTR of 4.2% among executive delegates."
                      </p>
                      <button 
                        onClick={() => {
                          setActiveArticle(null);
                          setShowAdvertisePortal(true);
                        }}
                        className="mt-2 text-[10px] font-sans font-bold text-gold uppercase tracking-[1.5px] hover:text-white cursor-pointer"
                      >
                        RESERVE THIS POSITION NOW ➔
                      </button>
                    </div>

                    {/* Concluding Paragraph */}
                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {activeArticle.content[4] || ''}
                    </p>

                    {/* 💰 CONCLUSION CTA AD */}
                    <div className="mt-12 p-6 rounded-2xl bg-dark-card border border-white/5 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-2">
                        <Megaphone size={20} />
                      </div>
                      <h4 className="font-serif text-lg font-bold text-ivory">Want to Position Your Enterprise Here?</h4>
                      <p className="text-xs text-dim max-w-md mx-auto leading-relaxed">
                        We offer specialized bespoke sponsorships, corporate profile articles, and sticky leaderboard ads to put your brand in front of regional African leadership.
                      </p>
                      <button 
                        onClick={() => {
                          setActiveArticle(null);
                          setShowAdvertisePortal(true);
                        }}
                        className="px-6 py-2.5 bg-gold text-dark font-sans text-xs font-black tracking-widest rounded uppercase hover:bg-gold-light transition-all cursor-pointer"
                      >
                        ADVERTISE WITH US
                      </button>
                    </div>

                  </div>

                  {/* RIGHT SIDEBAR COLUMN 30% */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-dark p-5 rounded-xl border border-white/5 space-y-4">
                      <span className="font-serif text-xs font-black text-gold uppercase tracking-wider block border-b border-white/5 pb-2">
                        ★ ADVERTISER SPONSOR
                      </span>

                      <div className="space-y-4 text-xs">
                        <div className="bg-dark-card p-4 rounded border border-white/5 text-left relative overflow-hidden">
                          <span className="text-[7px] font-mono text-dim block uppercase mb-1">CAMPAIGN ACTIVE</span>
                          <span className="font-bold text-ivory">Unitel Enterprise Fibre</span>
                          <p className="text-[10px] text-dim mt-1">Connecting SADC regions through physical ocean fibre links.</p>
                          <a href="#" className="text-[10px] text-gold font-bold block mt-3 uppercase">Visit Portal</a>
                        </div>

                        <div className="bg-dark-card p-4 rounded border border-white/5 text-left relative overflow-hidden">
                          <span className="text-[7px] font-mono text-dim block uppercase mb-1">PARTNERSHIP DISCLOSURE</span>
                          <span className="font-bold text-ivory">ASAE Corporate Desk</span>
                          <p className="text-[10px] text-dim mt-1">This publication is supported by strategic regional business partners.</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveArticle(null)}
                      className="w-full py-3 bg-white/5 hover:bg-white/10 text-ivory border border-white/10 rounded font-sans text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                    >
                      RETURN TO HOME SHEETS
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🚀 UPGRADE: INTERACTIVE ADVERTISING MEDIA & STRATEGY PORTAL MODAL */}
      <AnimatePresence>
        {showAdvertisePortal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-dark/95 backdrop-blur-md flex justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative w-full max-w-5xl bg-dark-card border border-gold/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 h-[90vh]"
            >
              {/* Top corporate decoration bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-angola-red via-gold to-sa-green z-30"></div>

              {/* Close Button Anchor */}
              <button
                onClick={() => setShowAdvertisePortal(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-dim hover:text-ivory bg-dark/50 z-30 cursor-pointer"
              >
                ✕
              </button>

              {/* Content hub scrollable container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 text-left bg-[#111111]">
                
                {/* BANNER PROMO HEADER */}
                <div className="max-w-4xl mx-auto space-y-4 mb-12">
                  <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[9px] font-mono uppercase tracking-wider inline-block">
                    ★ Bespoke Enterprise Monetization
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-black text-ivory tracking-tight leading-tight">
                    Position Your Brand Before <span className="text-gold">SADC Leaders</span>
                  </h2>
                  <p className="text-sm text-dim leading-relaxed max-w-3xl">
                    The Angola South Africa Awards Excellence (ASAE) platform aggregates elite venture capitalists, sovereign wealth fund executives, government officials, and entrepreneurs across South Africa and Angola. Customize your outreach campaign with our interactive ad engine below.
                  </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                  
                  {/* LEFT: INTERACTIVE PACKAGES & BUDGET CALCULATOR */}
                  <div className="space-y-6 bg-dark p-6 rounded-2xl border border-white/5">
                    <h3 className="font-serif text-lg font-bold text-gold flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <DollarSign size={18} /> Ad Space Traffic & Cost Estimator
                    </h3>

                    <form onSubmit={handleAdFormSubmit} className="space-y-4">
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-dim uppercase tracking-wider block">1. Selected Placement Slot</label>
                        <select 
                          value={selectedAdTier}
                          onChange={(e) => setSelectedAdTier(e.target.value as any)}
                          className="w-full bg-dark-card border border-white/10 hover:border-gold/30 rounded px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                        >
                          <option value="leaderboard">Premium Leaderboard Banner (728x90) - Top Position</option>
                          <option value="sidebar">Sidebar Sticky Rectangle (300x250 or 300x600)</option>
                          <option value="infeed">In-Feed Native Ad Premium Card</option>
                          <option value="sponsored-post">Full ASAE-Style Editorial Profile (Highly Recommended)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-dim uppercase tracking-wider block">2. Campaign Lifespan (Months)</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 3, 6, 12].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setAdDurationMonths(m)}
                              className={`py-2 rounded font-sans text-xs font-bold transition-all ${
                                adDurationMonths === m 
                                  ? 'bg-gold text-dark font-black' 
                                  : 'bg-dark-card text-dim hover:text-ivory border border-white/5'
                              }`}
                            >
                              {m} {m === 1 ? 'Month' : 'Months'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display calculations box */}
                      <div className="p-4 bg-dark-card border border-gold/10 rounded-lg space-y-3">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-dim">Est. Monthly Impressions:</span>
                          <span className="text-ivory font-bold">{priceList[selectedAdTier].dpm.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-dim">Total Est. Audience Impressions:</span>
                          <span className="text-sa-green font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> {calculatedTraffic.toLocaleString()}+ SADC views
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                          <span className="font-serif font-bold text-ivory">Estimated Sponsorship Cost:</span>
                          <span className="text-gold font-bold font-mono text-lg">${calculatedCost.toLocaleString()} USD</span>
                        </div>
                      </div>

                      {/* Brief Book Form */}
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Your Brand or Corporate Name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                            className="bg-dark-card border border-white/10 rounded px-3 py-2 text-xs focus:border-gold focus:outline-none text-ivory"
                          />
                          <input 
                            type="email" 
                            placeholder="Contact Business Email"
                            value={brandEmail}
                            onChange={(e) => setBrandEmail(e.target.value)}
                            required
                            className="bg-dark-card border border-white/10 rounded px-3 py-2 text-xs focus:border-gold focus:outline-none text-ivory"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-br from-gold to-gold-light text-dark font-sans text-xs font-black tracking-widest rounded uppercase hover:shadow-lg transition-transform cursor-pointer"
                        >
                          SUBMIT SECURE CAMPAIGN INQUIRY
                        </button>
                      </div>

                    </form>

                    <AnimatePresence>
                      {formSubmitted && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="p-4 bg-sa-green/10 border border-sa-green/20 rounded-lg text-sa-green text-xs text-center font-sans space-y-1 block"
                        >
                          <div className="font-bold flex items-center justify-center gap-1.5 justify-items-center">
                            <CheckCircle2 size={14} /> Campaign Pitch Submitted
                          </div>
                          <p>Our global SADC Media Desk in Cape Town will connect via business email with customizable contract documentation within 24 hours.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>

                  {/* RIGHT: LIVE SPONSOR CAMPAIGN METRICS PANEL */}
                  <div className="space-y-6 bg-dark p-6 rounded-2xl border border-white/5">
                    <h3 className="font-serif text-lg font-bold text-sa-green flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <BarChart2 size={16} /> Live Advertiser Analytics Desk
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono text-dim uppercase tracking-wider block mb-2">Select Active Brand Campaign</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['Standard Bank', 'Unitel Angola', 'Banco de Fomento Angola'].map((brand) => (
                            <button
                              key={brand}
                              onClick={() => setSelectedAnalyticsBrand(brand as any)}
                              className={`py-2 px-1.5 rounded font-mono text-[9px] font-bold transition-all uppercase whitespace-nowrap overflow-hidden text-ellipsis ${
                                selectedAnalyticsBrand === brand 
                                  ? 'bg-sa-green text-dark' 
                                  : 'bg-dark-card text-dim hover:text-ivory border border-white/5'
                              }`}
                            >
                              {brand.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-dark-card border border-white/5 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-dim uppercase">Selected Reach Core</span>
                          <span className="text-gold font-mono text-xs font-bold">{campaignStats.activeAdFormat}</span>
                        </div>

                        {/* Interactive Data Nodes */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-dark p-3 rounded-lg border border-white/5 relative">
                            <span className="text-[8px] font-mono text-dim block uppercase">IMPRESSIONS REGISTERED</span>
                            <span className="text-base font-bold text-ivory block mt-1 font-mono">{campaignStats.impressions}</span>
                            <span className="text-[9px] text-sa-green font-mono absolute top-2 right-2">{campaignStats.impressionsDelta}</span>
                          </div>

                          <div className="bg-dark p-3 rounded-lg border border-white/5 relative">
                            <span className="text-[8px] font-mono text-dim block uppercase">CLICKS CAPTURED</span>
                            <span className="text-base font-bold text-ivory block mt-1 font-mono">{campaignStats.clicks}</span>
                            <span className="text-[9px] text-sa-green font-mono absolute top-2 right-2">{campaignStats.clicksDelta}</span>
                          </div>
                        </div>

                        {/* Additional Metrics */}
                        <div className="space-y-2.5 text-xs font-mono pt-1">
                          <div className="flex justify-between">
                            <span className="text-dim">Campaign Status:</span>
                            <span className="text-gold font-bold">{campaignStats.ctrStatus} ({campaignStats.ctr} CTR)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dim">Mock Conversion Output:</span>
                            <span className="text-ivory font-bold">{campaignStats.conversions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dim">Total Funds Disbursed:</span>
                            <span className="text-sa-green font-bold">{campaignStats.totalSpent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-dim">Calculated SADC weight ROI:</span>
                            <span className="text-ivory font-bold">{campaignStats.estimatedRoi}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* MEDIA KIT DOWNLOAD SUMMARY (HIGH UPGRADE VALUE) */}
                <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl bg-gradient-to-tr from-[#161616] to-[#202020] border border-gold/15 flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Decorative Left Logo container */}
                  <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-2xl border border-gold/25 shrink-0 shadow shadow-gold/20">
                    <FileText size={28} />
                  </div>

                  <div className="flex-1 text-left space-y-1.5">
                    <span className="text-[9px] font-mono text-gold-pale block uppercase tracking-widest font-black">
                      ✦ ASAE Official Media Intelligence Block
                    </span>
                    <h4 className="font-serif text-xl font-bold text-ivory">ASAE 2026 Demographics & Media Kit (PDF)</h4>
                    <p className="text-xs text-dim leading-relaxed">
                      Review comprehensive readers dashboards: 64% Angolan Diaspora residing in Western Cape & Gauteng, 36% Elite Luanda enterprise officers. Average household income weighting over $145,000 USD.
                    </p>
                  </div>

                  <div className="shrink-0">
                    <button 
                      onClick={() => handleCopy('https://asae.co.za/assets/media-kit-2026.pdf', 'media-kit')}
                      className="px-6 py-3.5 bg-gold hover:bg-gold-light text-dark font-sans text-xs font-black tracking-widest rounded uppercase flex items-center gap-2 transition-transform cursor-pointer shadow shadow-gold/10"
                    >
                      <Download size={14} />
                      <span>{copiedText === 'media-kit' ? 'Copied Download Link!' : 'COPY MEDIA KIT LINK'}</span>
                    </button>
                    <span className="block text-[8px] font-mono text-dim text-center mt-2.5 uppercase tracking-widest">
                      Validated PDF Format · 4.8MB File
                    </span>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Dummy small sub-icon to resolve manual SVG needs without custom library clutter
function InfoIcon({ size = 16, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
