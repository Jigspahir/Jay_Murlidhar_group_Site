import { 
  Globe, 
  Layout, 
  Smartphone, 
  Database, 
  Bot, 
  ShoppingBag, 
  Palette, 
  Code2, 
  Building2, 
  Users, 
  FileCheck2, 
  FileText, 
  HeartHandshake, 
  ShieldPlus, 
  Shield, 
  Car, 
  Plane, 
  Briefcase, 
  FileSpreadsheet, 
  Award, 
  Receipt, 
  Compass, 
  MapPin, 
  Ticket, 
  Headphones, 
  Watch,
  Cpu
} from 'lucide-react';

export const SERVICES_PAGE_HERO = {
  label: "OUR SERVICES",
  mainHeading: "SERVICES THAT MOVE YOU FORWARD.",
  description: "Technology, essential services and business solutions — connected through one group.",
  stats: [
    { value: "6", label: "Core Domains" },
    { value: "30+", label: "Verified Services" },
    { value: "100%", label: "Integrated Delivery" }
  ]
};

export const HOW_WE_HELP_STEPS = [
  {
    number: "01",
    label: "EXPLORE",
    title: "Discover services across JMG domains.",
    description: "Browse our connected capabilities across technology, citizen services, risk management, corporate compliance, institutional travel and smart mobility hardware."
  },
  {
    number: "02",
    label: "SELECT",
    title: "Choose the service that matches your needs.",
    description: "Review our verified service scope, technical prerequisites, and operational standards tailored to institutions, enterprises and individuals."
  },
  {
    number: "03",
    label: "CONNECT",
    title: "Send an inquiry to the relevant JMG team.",
    description: "Connect directly with our specialized business unit for prompt consultation, structured scope definition, and dedicated ongoing execution."
  }
];

export const JMG_SERVICE_DOMAINS = [
  {
    id: 'technology',
    number: '01',
    name: 'Technology',
    shortName: 'Technology',
    categoryTitle: 'TECHNOLOGY & DIGITAL',
    operatingCompany: 'Jay Murlidhar Tech Solutions',
    companySlug: 'jay-murlidhar-tech-solutions',
    domainRoute: '/technology',
    companyRoute: '/technology/jay-murlidhar-tech-solutions',
    accentColor: '#2563EB',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentText: 'text-[#2563EB]',
    badgeBg: 'bg-blue-600',
    domainIcon: Cpu,
    tagline: 'Custom software engineering, modern web applications, and intelligent automation systems.',
    services: [
      {
        id: 'website-development',
        name: 'Website Development',
        description: 'Modern, high-performance responsive websites engineered with clean typography, high Core Web Vitals, and conversion-focused architectures.',
        icon: Globe,
        tags: ['Responsive UI', 'Modern Stacks', 'SEO & Performance']
      },
      {
        id: 'web-application-development',
        name: 'Web Application Development',
        description: 'Interactive cloud portals, real-time client dashboards, and custom SaaS platforms built with React, robust APIs, and resilient data layers.',
        icon: Layout,
        tags: ['React & TypeScript', 'Cloud Architecture', 'Real-Time APIs']
      },
      {
        id: 'mobile-application-development',
        name: 'Mobile Application Development',
        description: 'Native and cross-platform iOS & Android mobile applications engineered for fluid user touch experiences, offline access, and push notifications.',
        icon: Smartphone,
        tags: ['iOS & Android', 'Cross-Platform', 'Fluid Touch UX']
      },
      {
        id: 'erp-crm-solutions',
        name: 'ERP & CRM Solutions',
        description: 'Tailored enterprise resource planning, student administration portals, inventory control, and structured customer relationship workflows.',
        icon: Database,
        tags: ['Enterprise Workflows', 'Role-Based Access', 'Data Integration']
      },
      {
        id: 'ai-agents-automation',
        name: 'AI Agents & Automation',
        description: 'Intelligent automation pipelines, autonomous agent workflows, customer support chatbots, and WhatsApp Business API integration systems.',
        icon: Bot,
        tags: ['Autonomous AI', 'WhatsApp API', 'Automated Pipelines']
      },
      {
        id: 'ecommerce-development',
        name: 'E-commerce Development',
        description: 'Secure digital storefronts featuring friction-free checkout flows, automated payment gateways, order management, and catalog synchronization.',
        icon: ShoppingBag,
        tags: ['Payment Gateways', 'Inventory Sync', 'Frictionless Checkout']
      },
      {
        id: 'ui-ux-design',
        name: 'UI/UX Design',
        description: 'Human-centered user experience design, editorial interface layouts, clickable wireframes, design tokens, and scalable component systems.',
        icon: Palette,
        tags: ['Design Systems', 'Figma Prototyping', 'Accessibility (a11y)']
      },
      {
        id: 'software-development',
        name: 'Software Development',
        description: 'Scalable backend architectures, clean modular codebases, automated validation pipelines, and resilient cloud infrastructure services.',
        icon: Code2,
        tags: ['Clean Architecture', 'Automated QA', 'Scalable Microservices']
      }
    ]
  },
  {
    id: 'jan-suvidha',
    number: '02',
    name: 'Jan Suvidha',
    shortName: 'Jan Suvidha',
    categoryTitle: 'CITIZEN & PUBLIC SERVICES',
    operatingCompany: 'Jay Murlidhar Computer',
    companySlug: 'jay-murlidhar-computer',
    domainRoute: '/jan-suvidha',
    companyRoute: '/jan-suvidha/jay-murlidhar-computer',
    accentColor: '#10B981',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-600',
    badgeBg: 'bg-emerald-600',
    domainIcon: Building2,
    tagline: 'A trusted local service centre helping citizens access essential digital, government and public services.',
    services: [
      {
        id: 'csc-g2c-services',
        name: 'CSC G2C Services',
        description: 'Government-to-Citizen online services through certified Common Services Centres, facilitating statutory civic applications and citizen records.',
        icon: Building2,
        tags: ['Government Portals', 'Aadhaar Kiosk', 'Citizen Verification']
      },
      {
        id: 'csc-b2c-services',
        name: 'CSC B2C Services',
        description: 'Business-to-Citizen utility services including digital electricity and water bill payments, banking services, and online verification assistance.',
        icon: Users,
        tags: ['Utility Payments', 'Kiosk Banking', 'Community Support']
      },
      {
        id: 'government-online-services',
        name: 'Government Online Services',
        description: 'Application processing for central and state government schemes, student scholarships, digital certificates, and welfare portal submissions.',
        icon: FileCheck2,
        tags: ['Welfare Schemes', 'Scholarship Portals', 'Online Certificates']
      },
      {
        id: 'digital-service-assistance',
        name: 'Digital Service Assistance',
        description: 'Direct citizen assistance with PAN/TAN card issuance, digital signature certificates (DSC), RTO documentation, and online paperwork.',
        icon: FileText,
        tags: ['PAN & TAN Cards', 'Digital Signatures', 'RTO Documentation']
      }
    ]
  },
  {
    id: 'insurance',
    number: '03',
    name: 'Insurance',
    shortName: 'Insurance',
    categoryTitle: 'RISK MANAGEMENT & INSURANCE',
    operatingCompany: 'Jay Murlidhar Insurance',
    companySlug: 'jay-murlidhar-insurance',
    domainRoute: '/insurance',
    companyRoute: '/insurance/jay-murlidhar-insurance',
    accentColor: '#0284C7',
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText: 'text-[#0284C7]',
    badgeBg: 'bg-sky-600',
    domainIcon: Shield,
    tagline: 'Comprehensive individual, family, property and corporate risk protection policies with dedicated claims assistance.',
    services: [
      {
        id: 'life-insurance',
        name: 'Life Insurance',
        description: 'Term protection plans, endowment policies, and retirement financial security options sourced across IRDAI-approved insurance providers.',
        icon: HeartHandshake,
        tags: ['Term Protection', 'Guaranteed Returns', 'Family Security']
      },
      {
        id: 'health-insurance',
        name: 'Health Insurance',
        description: 'Cashless medical hospitalization coverage, family floater plans, critical illness policies, and senior citizen health protection.',
        icon: ShieldPlus,
        tags: ['Cashless Hospitalization', 'Family Floater', 'Critical Illness']
      },
      {
        id: 'general-insurance',
        name: 'General Insurance',
        description: 'Commercial property risk mitigation, retail shop protection, factory insurance, and fire peril safeguards for business assets.',
        icon: Shield,
        tags: ['Commercial Asset Risk', 'Shop & Factory', 'Fire & Perils']
      },
      {
        id: 'motor-insurance',
        name: 'Motor Insurance',
        description: 'Instant insurance issuance and renewals for two-wheelers, private passenger vehicles, commercial fleets, and heavy goods vehicles.',
        icon: Car,
        tags: ['Two-Wheelers & Cars', 'Commercial Fleets', 'Zero-Depreciation']
      },
      {
        id: 'travel-insurance',
        name: 'Travel Insurance',
        description: 'Comprehensive domestic and overseas travel coverage protecting against medical emergencies, baggage loss, and flight cancellations.',
        icon: Plane,
        tags: ['Overseas Travel', 'Baggage Protection', 'Emergency Medical']
      },
      {
        id: 'corporate-insurance',
        name: 'Corporate Insurance',
        description: 'Institutional group mediclaim policies, workmen compensation, director & officer liability, transit marine, and cyber risk coverage.',
        icon: Briefcase,
        tags: ['Group Mediclaim', 'Workmen Compensation', 'Cyber Liability']
      }
    ]
  },
  {
    id: 'business-services',
    number: '04',
    name: 'Business Services',
    shortName: 'Business Services',
    categoryTitle: 'CORPORATE COMPLIANCE & SUPPORT',
    operatingCompany: 'Jay Murlidhar Business Services',
    companySlug: 'jay-murlidhar-business-services',
    domainRoute: '/business-services',
    companyRoute: '/business-services/jay-murlidhar-business-services',
    accentColor: '#EA580C',
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-[#EA580C]',
    badgeBg: 'bg-orange-600',
    domainIcon: FileSpreadsheet,
    tagline: 'End-to-end commercial registrations, statutory compliance filings, and administrative workflow streamlining.',
    services: [
      {
        id: 'business-registration-assistance',
        name: 'Business Registration Assistance',
        description: 'Complete guidance through company incorporation, partnership deed registration, LLP formation, and local municipal trade licenses.',
        icon: FileSpreadsheet,
        tags: ['Company Incorporation', 'LLP & Partnerships', 'Trade Licensing']
      },
      {
        id: 'msme-udyam-assistance',
        name: 'MSME / Udyam Assistance',
        description: 'Official Udyam registration processing enabling small enterprises to access government subsidies, lower interest loans, and tender benefits.',
        icon: Award,
        tags: ['Udyam Portal', 'MSME Subsidies', 'Priority Credit Access']
      },
      {
        id: 'gst-registration-compliance',
        name: 'GST Registration & Compliance Assistance',
        description: 'New GST number procurement, monthly GSTR-1 & 3B return filing, input tax credit reconciliation, and statutory notices handling.',
        icon: Receipt,
        tags: ['New GST Filing', 'Monthly Returns', 'Input Credit Audit']
      },
      {
        id: 'business-documentation',
        name: 'Business Documentation',
        description: 'Shop Act certificates, FSSAI food business licenses, Digital Signature Certificates (DSC), commercial NDAs, and contract drafting.',
        icon: FileText,
        tags: ['Shop Act License', 'FSSAI Food Certificate', 'Contracts & NDAs']
      },
      {
        id: 'professional-business-support',
        name: 'Professional Business Support',
        description: 'Corporate secretarial documentation, resolution drafting, statutory audit readiness, and structured digital document vaulting.',
        icon: Compass,
        tags: ['Corporate Secretarial', 'Audit Readiness', 'Document Archiving']
      }
    ]
  },
  {
    id: 'travel',
    number: '05',
    name: 'Travel',
    shortName: 'Travel',
    categoryTitle: 'TOURS & FIELD MOBILITY',
    operatingCompany: 'Jay Murlidhar Tours',
    companySlug: 'jay-murlidhar-tours',
    domainRoute: '/travel',
    companyRoute: '/travel/jay-murlidhar-tours',
    accentColor: '#D97706',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    accentText: 'text-amber-600',
    badgeBg: 'bg-amber-600',
    domainIcon: Plane,
    tagline: 'Curated institutional study tours, university industrial expeditions, and seamless corporate group travel itineraries.',
    services: [
      {
        id: 'domestic-travel',
        name: 'Domestic Travel',
        description: 'Guided discovery, heritage, and cultural expeditions across India’s prominent regional circuits with verified hospitality and sanitized coach fleets.',
        icon: MapPin,
        tags: ['Cultural Expeditions', 'Verified Hotels', 'Pan-India Circuits']
      },
      {
        id: 'international-travel',
        name: 'International Travel',
        description: 'Global university student delegations, international academic conference trips, overseas travel logistics, and visa processing coordination.',
        icon: Compass,
        tags: ['Global Delegations', 'Academic Conferences', 'Visa Coordination']
      },
      {
        id: 'tour-packages',
        name: 'Tour Packages',
        description: 'All-inclusive student study tours, institutional educational excursions, corporate team retreats, and customized family holiday packages.',
        icon: Users,
        tags: ['Industrial Visits', 'Corporate Retreats', 'All-Inclusive Packages']
      },
      {
        id: 'travel-booking-assistance',
        name: 'Travel Booking Assistance',
        description: 'Group airfare negotiation, confirmed rail reservations, sanitized luxury AC coach charter, and round-the-clock on-tour safety support.',
        icon: Ticket,
        tags: ['Group Air & Rail', 'Luxury Coach Charter', '24/7 Tour Coordination']
      }
    ]
  },
  {
    id: 'retail',
    number: '06',
    name: 'Retail',
    shortName: 'Retail',
    categoryTitle: 'SMART DEVICES & MOBILITY HARDWARE',
    operatingCompany: 'Jay Murlidhar Mobile & Accessories',
    companySlug: 'jay-murlidhar-mobile-accessories',
    domainRoute: '/retail',
    companyRoute: '/retail/jay-murlidhar-mobile-accessories',
    accentColor: '#DB2777',
    accentBg: 'bg-pink-50',
    accentBorder: 'border-pink-200',
    accentText: 'text-[#DB2777]',
    badgeBg: 'bg-pink-600',
    domainIcon: Smartphone,
    tagline: 'Authorized smartphones, student learning tablets, certified mobile accessories, and hardware repair services.',
    services: [
      {
        id: 'mobile-phones',
        name: 'Mobile Phones',
        description: 'Authorized retail distribution of latest brand-certified smartphones and student computing tablets for academic and professional productivity.',
        icon: Smartphone,
        tags: ['Authorized Brands', 'Student Tablets', 'Official Warranty']
      },
      {
        id: 'mobile-accessories',
        name: 'Mobile Accessories',
        description: 'Certified high-speed charging adapters, braided cables, tempered screen protection, rugged protective cases, and high-capacity power banks.',
        icon: Headphones,
        tags: ['Fast Charging', 'Durable Protection', 'High-Capacity Power']
      },
      {
        id: 'retail-products',
        name: 'Retail Products',
        description: 'Wearable smart tech, smartwatches, wireless active noise-cancelling earphones, memory storage, and digital audio equipment.',
        icon: Watch,
        tags: ['Smart Wearables', 'Wireless Audio', 'Computing Peripherals']
      }
    ]
  }
];

