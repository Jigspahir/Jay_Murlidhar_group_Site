/**
 * JAY MURLIDHAR GROUP — CENTRALIZED BUSINESS ECOSYSTEM DATA
 * 
 * Single source of truth for:
 * - Navbar Ecosystem mega-menu
 * - Ecosystem Page (/ecosystem)
 * - Domain Detail Pages (e.g. /business-services)
 * - Footer Ecosystem sections
 * - Company Detail Pages (/:domain/:slug)
 * - Related Businesses
 * - Breadcrumbs & Search
 */

export const JMG_CATEGORIES = [
  {
    id: 'technology',
    number: '01',
    name: 'TECHNOLOGY',
    shortName: 'Technology',
    description: 'Custom software engineering, cloud infrastructure, modern web platforms, and intelligent automation.',
    accent: '#2563EB',
    domainRoute: '/technology',
    companyIds: ['jay-murlidhar-tech-solutions']
  },
  {
    id: 'jan-suvidha',
    number: '02',
    name: 'JAN SUVIDHA',
    shortName: 'Jan Suvidha',
    description: 'A trusted local service centre helping people access essential digital, government and citizen services.',
    accent: '#10B981',
    domainRoute: '/jan-suvidha',
    companyIds: ['jay-murlidhar-computer']
  },
  {
    id: 'insurance',
    number: '03',
    name: 'INSURANCE',
    shortName: 'Insurance',
    description: 'Corporate underwriting, institutional liability risk mitigation, and comprehensive claims advocacy.',
    accent: '#0284C7',
    domainRoute: '/insurance',
    companyIds: ['jay-murlidhar-insurance']
  },
  {
    id: 'business-services',
    number: '04',
    name: 'BUSINESS SERVICES',
    shortName: 'Business Services',
    description: 'End-to-end corporate workflow assistance, statutory compliance filings, legal certifications, and operational management.',
    accent: '#EA580C',
    domainRoute: '/business-services',
    companyIds: ['jay-murlidhar-business-services']
  },
  {
    id: 'travel',
    number: '05',
    name: 'TRAVEL',
    shortName: 'Travel',
    description: 'Curated institutional study tours, university student delegations, faculty expeditions, and seamless corporate itineraries.',
    accent: '#D97706',
    domainRoute: '/travel',
    companyIds: ['jay-murlidhar-tours']
  },
  {
    id: 'retail',
    number: '06',
    name: 'RETAIL',
    shortName: 'Retail',
    description: 'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.',
    accent: '#DB2777',
    domainRoute: '/retail',
    companyIds: ['jay-murlidhar-mobile-accessories']
  }
];

export const JMG_DOMAINS = [
  {
    id: 'technology',
    number: '01',
    name: 'TECHNOLOGY',
    categoryTitle: 'TECHNOLOGY & DIGITAL',
    shortCategory: 'Technology & Digital Systems',
    description: 'Custom software engineering, scalable cloud infrastructure, modern web platforms, and intelligent automation.',
    domainRoute: '/technology',
    accent: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.28)',
    iconName: 'Cpu',
    coords: { x: 25, y: 35 },
    companySlugs: ['jay-murlidhar-tech-solutions']
  },
  {
    id: 'jan-suvidha',
    number: '02',
    name: 'JAN SUVIDHA',
    categoryTitle: 'JAN SUVIDHA / CITIZEN SERVICES',
    shortCategory: 'Citizen & Public Services',
    description: 'A trusted local service centre helping people access essential digital, government and citizen services.',
    domainRoute: '/jan-suvidha',
    accent: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.28)',
    iconName: 'Landmark',
    coords: { x: 50, y: 12 },
    companySlugs: ['jay-murlidhar-computer']
  },
  {
    id: 'insurance',
    number: '03',
    name: 'INSURANCE',
    categoryTitle: 'INSURANCE & RISK',
    shortCategory: 'Enterprise Risk & Underwriting',
    description: 'Comprehensive general, corporate, and individual insurance consulting designed to safeguard operational assets.',
    domainRoute: '/insurance',
    accent: '#06B6D4',
    glowColor: 'rgba(6, 182, 212, 0.28)',
    iconName: 'ShieldCheck',
    coords: { x: 75, y: 35 },
    companySlugs: ['jay-murlidhar-insurance']
  },
  {
    id: 'business-services',
    number: '04',
    name: 'BUSINESS SERVICES',
    categoryTitle: 'BUSINESS SERVICES',
    shortCategory: 'Corporate Governance & Compliance',
    description: 'End-to-end corporate workflow assistance, statutory compliance filings, legal certifications, and operational management.',
    domainRoute: '/business-services',
    accent: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.28)',
    iconName: 'Briefcase',
    coords: { x: 75, y: 75 },
    companySlugs: ['jay-murlidhar-business-services']
  },
  {
    id: 'travel',
    number: '05',
    name: 'TRAVEL',
    categoryTitle: 'MOBILITY & TOURS',
    shortCategory: 'Educational & Corporate Mobility',
    description: 'Curated institutional study tours, university student delegations, faculty expeditions, and seamless corporate itineraries.',
    domainRoute: '/travel',
    accent: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.28)',
    iconName: 'Plane',
    coords: { x: 50, y: 88 },
    companySlugs: ['jay-murlidhar-tours']
  },
  {
    id: 'retail',
    number: '06',
    name: 'RETAIL',
    categoryTitle: 'SMART DEVICES & HARDWARE',
    shortCategory: 'Smart Devices & Mobility Hardware',
    description: 'High-performance computing devices, campus smart equipment, mobility accessories, and institutional device procurement.',
    domainRoute: '/retail',
    accent: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.28)',
    iconName: 'Smartphone',
    coords: { x: 25, y: 75 },
    companySlugs: ['jay-murlidhar-mobile-accessories']
  }
];

export const JMG_COMPANIES = [
  {
    id: 'jay-murlidhar-computer',
    slug: 'jay-murlidhar-computer',
    domain: 'jan-suvidha',
    domainName: 'Jan Suvidha',
    domainRoute: '/jan-suvidha',
    route: '/jan-suvidha/jay-murlidhar-computer',
    path: '/jan-suvidha/jay-murlidhar-computer',
    name: 'Jay Murlidhar Computer',
    subtitle: 'CSC / Jan Suvidha Kendra',
    category: 'JAN SUVIDHA / CITIZEN SERVICES',
    categoryId: 'jan-suvidha',
    number: '01',
    description: 'Common Services Centres (CSCs) provide Government-to-Citizen (G2C) and Business-to-Citizen (B2C) e-Services, helping people access essential digital and public services through a trusted local service centre.',
    tagline: 'Your Trusted Neighbourhood Kiosk for All Digital Services',
    shortDescription: 'A trusted local service centre helping people access essential digital, government and citizen services.',
    about: 'Common Services Centres (CSCs) provide Government-to-Citizen (G2C) and Business-to-Citizen (B2C) e-Services, helping people access essential digital and public services through a trusted local service centre. Jay Murlidhar Computer helps bridge the gap between people and essential digital, government and business services through a convenient neighbourhood service centre.',
    editorialStatement: 'Digital access, closer to home.',
    editorialSupporting: 'Jay Murlidhar Computer helps bridge the gap between people and essential digital, government and business services through a convenient neighbourhood service centre.',
    image: '/assets/hero.jpg',
    logo: '/assets/jay-murlidhar-computer-logo-jpg.jpg',
    accentColor: '#10B981',
    active: true,
    services: [
      {
        id: 'government-citizen-services',
        number: '01',
        title: 'Government / Citizen Services (G2C)',
        subtitle: 'Aadhaar, Banking, Bill Payments, Government Schemes & RTO',
        tagline: 'G2C e-Services',
        description: 'Direct citizen service assistance for online government portals, utility payments, and statutory citizen documentation.',
        details: 'Assistance delivered through government and digital service channels to help citizens access public documentation, scheme registrations, and daily utility services.',
        items: [
          'Aadhaar Services',
          'Banking Services',
          'Bill Payments',
          'Government Schemes',
          'Online Documentation',
          'RTO Services'
        ]
      },
      {
        id: 'business-documentation-services',
        number: '02',
        title: 'Business & Documentation Services (B2C)',
        subtitle: 'GST, MSME, PAN/TAN, Shop Act, FSSAI, IT Filing, DSC & Udyam',
        tagline: 'B2C Business Support',
        description: 'Comprehensive commercial documentation, statutory business registrations, tax filings, and enterprise certifications.',
        details: 'Digital and business services helping individuals, traders, and local enterprises secure essential business licenses and compliance filings.',
        items: [
          'GST Registration & Filing',
          'MSME Registration',
          'PAN / TAN',
          'Shop Act',
          'FSSAI',
          'Income Tax Filing',
          'DSC',
          'Udyam',
          'Business Registration'
        ]
      },
      {
        id: 'academy-services',
        number: '03',
        title: 'Academy / Digital Skills',
        subtitle: 'Computer Courses, Tally, Basic IT & Skill Development',
        tagline: 'Learn. Build. Grow.',
        description: 'Practical computer education, IT training, and skill development programs tailored for students, job aspirants, and local entrepreneurs.',
        details: 'Hands-on learning covering computer fundamentals, Tally accounting, web basics, spoken English, and competitive exam preparation.',
        items: [
          'Computer Courses',
          'Tally',
          'Basic IT',
          'Digital Marketing Training',
          'Web Development Course',
          'Spoken English',
          'Government Exam Preparation'
        ]
      }
    ],
    whyThisBusiness: [
      'Convenient local access — easily accessible neighbourhood service centre.',
      'Digital assistance — guided hands-on support for online applications and portals.',
      'Multiple services in one place — citizen schemes, RTO, business licenses, and digital skills.',
      'Simple service experience — clear, step-by-step assistance without confusion.'
    ],
    stats: [
      { label: 'Service Scope', value: 'G2C & B2C' },
      { label: 'Citizen Access', value: 'Neighbourhood Kiosk' },
      { label: 'Service Model', value: 'Guided Assistance' }
    ],
    relatedSlugs: ['jay-murlidhar-tech-solutions', 'jay-murlidhar-business-services', 'jay-murlidhar-mobile-accessories']
  },

  {
    id: 'jay-murlidhar-tech-solutions',
    slug: 'jay-murlidhar-tech-solutions',
    domain: 'technology',
    domainName: 'Technology & Digital',
    domainRoute: '/technology',
    route: '/technology/jay-murlidhar-tech-solutions',
    path: '/technology/jay-murlidhar-tech-solutions',
    name: 'Jay Murlidhar Tech Solutions',
    subtitle: 'Technology & Software Solutions',
    category: 'TECHNOLOGY & DIGITAL',
    categoryId: 'technology',
    number: '01',
    description: 'Technology & Software Solutions',
    tagline: 'Enterprise digital architectures, education ERPs, and modern web platforms.',
    shortDescription: 'High-performance web development, custom software engineering, cloud infrastructure, and intelligent institutional automation.',
    about: 'Jay Murlidhar Tech Solutions represents the primary digital engineering division of Jay Murlidhar Group. We architect unified administrative ERP systems, scalable cloud platforms, responsive web applications, and event-driven automation engines designed to eliminate organizational paperwork and manual delays.',
    image: '/assets/jay murlidhar tech.jpg',
    logo: '/assets/jay murlidhar tech.jpg',
    accentColor: '#7C3AED',
    active: true,
    services: [
      {
        id: 'technology-services',
        number: '01',
        title: 'Technology Services',
        subtitle: 'Web Development, Application Engineering & Digital Marketing',
        description: 'Professional technology services including website development, application development, social media marketing, and modern website design — tailored to grow your business.',
        details: 'Website development, application development, social media marketing and modern web design engineered for reliability, responsiveness, and business growth.',
        items: [
          'Website Design',
          'Website Development',
          'App Development',
          'Software Development',
          'Digital Marketing',
          'Social Media Marketing',
          'Graphic Design',
          'SEO Services',
          'WhatsApp API Solutions',
          'Bulk SMS Services',
          'Hosting & Domain',
          'AI Chatbot Development'
        ]
      }
    ],
    whyThisBusiness: [
      'Proven in production across live institutions handling thousands of concurrent users.',
      'Clean developer-crafted codebases without third-party template bloat or security vulnerabilities.',
      'Direct synchronization with JMG hardware and business operational services.',
      'Ongoing dedicated engineering maintenance and automated telemetry monitoring.'
    ],
    stats: [
      { label: 'Active Users', value: '45,000+' },
      { label: 'System Uptime', value: '99.98%' },
      { label: 'Daily Records', value: '250K+' }
    ],
    relatedSlugs: ['jay-murlidhar-computer', 'jay-murlidhar-business-services', 'jay-murlidhar-mobile-accessories']
  },

  {
    id: 'jay-murlidhar-insurance',
    slug: 'jay-murlidhar-insurance',
    domain: 'insurance',
    domainName: 'Insurance',
    domainRoute: '/insurance',
    route: '/insurance/jay-murlidhar-insurance',
    path: '/insurance/jay-murlidhar-insurance',
    name: 'Jay Murlidhar Insurance',
    subtitle: 'Insurance & Advisory Services',
    category: 'INSURANCE',
    categoryId: 'insurance',
    number: '02',
    description: 'Insurance & Advisory Services',
    tagline: 'Comprehensive asset protection, corporate indemnity, and claims advocacy.',
    shortDescription: 'General insurance, corporate risk management, employee medical coverage, property protection, and claims support.',
    about: 'Jay Murlidhar Insurance protects commercial enterprises, institutions, and individuals against unforeseen operational and personal liabilities. We analyze risk exposures, structure cost-effective coverage, and provide decisive claims advocacy when it matters most.',
    image: '/assets/jay-murlidhar-insurance-card.png',
    logo: '/assets/jay murlidhar insurance.svg',
    accentColor: '#0284C7',
    active: true,
    services: [
      {
        id: 'insurance-services',
        number: '01',
        title: 'Insurance Services',
        subtitle: 'Comprehensive Life, Health, Motor, Business & Personal Protection',
        description: 'We offer a complete range of insurance services including Life, Health, Motor, Business, and Personal Insurance with expert support and hassle-free processing.',
        details: 'Life, Health, Motor, Business and Personal Insurance support with unbiased policy comparisons across IRDAI-approved insurance providers and dedicated claims settlement assistance.',
        items: [
          'Life Insurance',
          'Health Insurance',
          'Motor Insurance',
          'Bike Insurance',
          'Car Insurance',
          'Commercial Vehicle Insurance',
          'Business Insurance',
          'Corporate Insurance',
          'Shop Insurance',
          'Factory Insurance',
          'Marine Insurance',
          'Fire Insurance',
          'Travel Insurance',
          'Crop Insurance',
          'Cyber Insurance'
        ]
      }
    ],
    whyThisBusiness: [
      'Unbiased policy comparisons across India’s leading IRDAI-approved insurance providers.',
      'Dedicated claims desk ensuring zero paperwork friction during emergencies.',
      'Customized risk assessments preventing under-insurance or expensive duplicate coverage.',
      'Seamless insurance synergy with JMG Tours and institutional partners.'
    ],
    stats: [
      { label: 'Policies Managed', value: '4,200+' },
      { label: 'Claims Settlement Rate', value: '98.6%' },
      { label: 'Assets Covered', value: '₹250Cr+' }
    ],
    relatedSlugs: ['jay-murlidhar-business-services', 'jay-murlidhar-tours', 'jay-murlidhar-tech-solutions']
  },

  {
    id: 'jmbs',
    name: 'Jay Murlidhar Business Services',
    domain: 'business-services',
    domainName: 'Business Services',
    domainRoute: '/business-services',
    slug: 'jay-murlidhar-business-services',
    route: '/business-services/jay-murlidhar-business-services',
    path: '/business-services/jay-murlidhar-business-services',
    description: 'Business Services',
    subtitle: 'Digital & Business Support Services',
    category: 'BUSINESS SERVICES',
    categoryId: 'business-services',
    number: '03',
    tagline: 'Operational management consulting, corporate documentation, and workflow modernization.',
    shortDescription: 'Digital & business support services, regulatory compliance documentation, licensing assistance, and administrative streamlining.',
    about: 'Jay Murlidhar Business Services operates as an independent business domain dedicated to removing procedural friction and administrative burden for commercial companies and academic institutions. We coordinate regulatory compliance, business registrations, documentation preparation, and operational workflow digitization so leaders can focus on execution.',
    image: '/assets/hero.jpg',
    accentColor: '#EA580C',
    active: true,
    services: [
      {
        title: 'Business Registration & Licensing Assistance',
        description: 'End-to-end guidance through commercial registrations, trade licenses, MSME certifications, and institutional permits.'
      },
      {
        title: 'Regulatory Compliance & Filings',
        description: 'Periodic statutory filing coordination, tax documentation organization, and corporate governance records.'
      },
      {
        title: 'Administrative Workflow Digitization',
        description: 'Transitioning manual paper documentation into structured digital document vaults and searchable archives.'
      },
      {
        title: 'Corporate Secretarial Support',
        description: 'Meeting minutes recording, resolution drafting, institutional compliance checklists, and verification support.'
      },
      {
        title: 'Contract & Legal Documentation Coordination',
        description: 'Drafting commercial non-disclosure agreements, vendor service level agreements, and partnership contracts.'
      },
      {
        title: 'Institutional Audit Preparation',
        description: 'Preparing rigorous documentary records and compliance binders ahead of statutory and accreditation audits.'
      }
    ],
    whyThisBusiness: [
      'Comprehensive understanding of regional business laws and regulatory filing cycles.',
      'Zero-error documentation methodology that avoids costly penalties and delays.',
      'Integrated handoff with JMG Insurance and Technology divisions.',
      'Confidential and secure handling of critical corporate records.'
    ],
    stats: [
      { label: 'Entities Assisted', value: '350+' },
      { label: 'Filings Completed', value: '1,800+' },
      { label: 'Compliance Rate', value: '100%' }
    ],
    relatedSlugs: ['jay-murlidhar-insurance', 'jay-murlidhar-tech-solutions', 'jay-murlidhar-computer']
  },

  {
    id: 'jay-murlidhar-tours',
    slug: 'jay-murlidhar-tours',
    domain: 'travel',
    domainName: 'Travel',
    domainRoute: '/travel',
    route: '/travel/jay-murlidhar-tours',
    path: '/travel/jay-murlidhar-tours',
    name: 'Jay Murlidhar Tours',
    subtitle: 'Travel & Tour Services',
    category: 'TRAVEL',
    categoryId: 'travel',
    number: '04',
    description: 'Travel & Tour Services',
    tagline: 'Curated educational study tours, corporate expeditions, and travel planning.',
    shortDescription: 'Educational field trips, university industrial visits, corporate travel logistics, and domestic travel experiences.',
    about: 'Jay Murlidhar Tours delivers meticulously planned, safe, and enriching travel experiences. We specialize in student industrial visits, university research excursions, corporate conferences, and domestic cultural expeditions designed with uncompromising traveler safety.',
    image: '/assets/jay murlidhar tech.jpg',
    accentColor: '#D97706',
    active: true,
    services: [
      {
        title: 'Student Industrial Visits & Field Tours',
        description: 'Curated technical visits to industrial manufacturing plants, technology centers, and national scientific institutes.'
      },
      {
        title: 'Corporate Travel Management & Offsites',
        description: 'End-to-end coordination for company annual summits, team-building retreats, and leadership conferences.'
      },
      {
        title: 'Domestic Cultural & Heritage Circuits',
        description: 'Guided historical, spiritual, and discovery expeditions across India’s rich cultural destinations.'
      },
      {
        title: 'Group Air & Rail Ticketing Coordination',
        description: 'Seamless group seat reservations, bulk fare negotiations, and itinerary change assistance.'
      },
      {
        title: 'Verified Hospitality & Luxury Fleet Logistics',
        description: 'Handpicked verified hotels, sanitized AC coach fleets, and healthy catering coordination.'
      },
      {
        title: '24/7 On-Tour Safety & Medical Escort',
        description: 'Dedicated tour managers accompanying groups with full medical first-response coordination and emergency backup.'
      }
    ],
    whyThisBusiness: [
      'Safety-first philosophy with zero compromises on transport or lodging standards.',
      'Deep pedagogical understanding of student learning outcomes during field expeditions.',
      'Backed by JMG Insurance for comprehensive travel and accidental indemnity coverage.',
      'Transparent, all-inclusive package pricing with no hidden charges.'
    ],
    stats: [
      { label: 'Tours Conducted', value: '180+' },
      { label: 'Students Traveled', value: '9,500+' },
      { label: 'Safety Rating', value: '100%' }
    ],
    relatedSlugs: ['jay-murlidhar-insurance', 'jay-murlidhar-business-services', 'jay-murlidhar-mobile-accessories']
  },

  {
    id: 'jay-murlidhar-mobile-accessories',
    slug: 'jay-murlidhar-mobile-accessories',
    domain: 'retail',
    domainName: 'Retail',
    domainRoute: '/retail',
    route: '/retail/jay-murlidhar-mobile-accessories',
    path: '/retail/jay-murlidhar-mobile-accessories',
    name: 'Jay Murlidhar Mobile & Accessories',
    subtitle: 'Mobile Devices & Accessories',
    category: 'RETAIL',
    categoryId: 'retail',
    number: '05',
    description: 'Mobile Devices & Accessories',
    tagline: 'Smart mobile devices, student computing gear, and certified accessories.',
    shortDescription: 'Smart devices, genuine mobile accessories, campus student devices, certified peripherals, and technical support.',
    about: 'Jay Murlidhar Mobile & Accessories brings authentic connectivity products, modern smartphones, tablets, and certified mobility peripherals to students, professionals, and institutions with honest pricing and brand-backed warranties.',
    image: '/assets/LUCES GAMER.jpeg',
    accentColor: '#DB2777',
    active: true,
    services: [
      {
        title: 'Smartphones & Tablet Retail',
        description: 'Authorized distribution of leading smartphone brands and tablets for academic and personal productivity.'
      },
      {
        title: 'Institutional Student Device Provisioning',
        description: 'Bulk procurement of pre-configured tablets and portable laptops for digital classroom initiatives.'
      },
      {
        title: 'Certified Mobility Accessories',
        description: 'High-speed fast chargers, braided cables, tempered protection, ergonomic cases, and power storage banks.'
      },
      {
        title: 'Audio Gear & Wearable Tech',
        description: 'Active noise-cancelling headphones, wireless earbuds, smartwatches, and voice recording tools.'
      },
      {
        title: 'Quick Hardware Screen & Battery Service',
        description: 'Precision on-site display repairs, certified battery replacements, and diagnostic resets.'
      },
      {
        title: 'Device Protection & Extended Warranty',
        description: 'Guaranteed accidental damage protection plans in partnership with JMG Insurance.'
      }
    ],
    whyThisBusiness: [
      '100% genuine guaranteed inventory sourced directly from authorized brand distributors.',
      'Special academic discounts and transparent trade-in exchange bonuses.',
      'Immediate technical support and prompt warranty claim coordination.',
      'Direct hardware support synergy with Jay Murlidhar Computer.'
    ],
    stats: [
      { label: 'Devices Delivered', value: '18,000+' },
      { label: 'Genuine Brands', value: '25+' },
      { label: 'Customer Satisfaction', value: '4.9 / 5' }
    ],
    relatedSlugs: ['jay-murlidhar-computer', 'jay-murlidhar-tech-solutions', 'jay-murlidhar-tours']
  }
];

export const JMG_ECOSYSTEM_STATS = {
  totalCompanies: '6',
  sectorsCovered: '6 Canonical Domains',
  ecosystemFoundation: 'Est. Long-Term Vision',
  governance: 'Centralized Parent Leadership'
};

export const JMG_ECOSYSTEM_NAV = {
  about: [
    { label: 'About JMG', href: '/about' },
    { label: 'Our Story', href: '/about' },
    { label: 'Leadership', href: '/about' }
  ],
  ecosystem: [
    { label: 'All Companies', href: '/ecosystem' },
    { label: 'Technology', href: '/technology' },
    { label: 'Jan Suvidha', href: '/jan-suvidha' },
    { label: 'Insurance', href: '/insurance' },
    { label: 'Business Services', href: '/business-services' },
    { label: 'Travel', href: '/travel' },
    { label: 'Retail', href: '/retail' }
  ],
  solutions: [
    { label: 'Technology Solutions', href: '/technology/jay-murlidhar-tech-solutions' },
    { label: 'Education Solutions', href: '/solutions' },
    { label: 'Business Services', href: '/business-services/jay-murlidhar-business-services' }
  ],
  company: [
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/about' },
    { label: 'Terms & Conditions', href: '/about' }
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'YouTube', href: 'https://youtube.com' }
  ]
};

// Robust helper functions ensuring backwards compatibility and canonical lookups
export const getCompanyById = (id) => {
  if (!id) return undefined;
  return JMG_COMPANIES.find(c => 
    c.id === id || 
    c.slug === id ||
    (id === 'jmbs' && (c.id === 'jmbs' || c.slug === 'jay-murlidhar-business-services')) ||
    (id === 'jay-murlidhar-business-services' && (c.id === 'jmbs' || c.slug === 'jay-murlidhar-business-services')) ||
    (id === 'jay-murlidhar-mobile' && (c.id === 'jay-murlidhar-mobile-accessories' || c.slug === 'jay-murlidhar-mobile-accessories'))
  );
};

export const getCompanyBySlug = (slug) => {
  if (!slug) return undefined;
  return JMG_COMPANIES.find(c => 
    c.slug === slug || 
    c.id === slug ||
    (slug === 'jay-murlidhar-mobile' && c.slug === 'jay-murlidhar-mobile-accessories') ||
    (slug === 'jmbs' && c.slug === 'jay-murlidhar-business-services')
  );
};

export const getDomainById = (id) => {
  if (!id) return undefined;
  return JMG_DOMAINS.find(d => 
    d.id === id || 
    d.domainRoute === `/${id}` || 
    d.domainRoute === id
  );
};

/**
 * OPTION C — CENTRALIZED BUSINESS ROUTE CONFIGURATION
 * Single source of truth for canonical domain and business routes across the JMG ecosystem.
 */
export const businessRoutes = {
  technology: {
    id: 'technology',
    name: 'Technology & Digital',
    route: '/technology',
    businesses: [
      {
        id: 'jay-murlidhar-tech-solutions',
        name: 'Jay Murlidhar Tech Solutions',
        route: '/technology/jay-murlidhar-tech-solutions',
        slug: 'jay-murlidhar-tech-solutions',
      },
    ],
  },

  janSuvidha: {
    id: 'jan-suvidha',
    name: 'Jan Suvidha',
    route: '/jan-suvidha',
    businesses: [
      {
        id: 'jay-murlidhar-computer',
        name: 'Jay Murlidhar Computer',
        route: '/jan-suvidha/jay-murlidhar-computer',
        slug: 'jay-murlidhar-computer',
      },
    ],
  },

  insurance: {
    id: 'insurance',
    name: 'Insurance',
    route: '/insurance',
    businesses: [
      {
        id: 'jay-murlidhar-insurance',
        name: 'Jay Murlidhar Insurance',
        route: '/insurance/jay-murlidhar-insurance',
        slug: 'jay-murlidhar-insurance',
      },
    ],
  },

  businessServices: {
    id: 'business-services',
    name: 'Business Services',
    route: '/business-services',
    businesses: [
      {
        id: 'jmbs',
        name: 'Jay Murlidhar Business Services',
        route: '/business-services/jay-murlidhar-business-services',
        slug: 'jay-murlidhar-business-services',
      },
    ],
  },

  travel: {
    id: 'travel',
    name: 'Travel',
    route: '/travel',
    businesses: [
      {
        id: 'jay-murlidhar-tours',
        name: 'Jay Murlidhar Tours',
        route: '/travel/jay-murlidhar-tours',
        slug: 'jay-murlidhar-tours',
      },
    ],
  },

  retail: {
    id: 'retail',
    name: 'Retail',
    route: '/retail',
    businesses: [
      {
        id: 'jay-murlidhar-mobile-accessories',
        name: 'Jay Murlidhar Mobile & Accessories',
        route: '/retail/jay-murlidhar-mobile-accessories',
        slug: 'jay-murlidhar-mobile-accessories',
      },
    ],
  },
};
