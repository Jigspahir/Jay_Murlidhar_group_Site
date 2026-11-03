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
  FileSpreadsheet,
  FileText,
  HeartHandshake,
  ShieldPlus,
  Shield,
  Car,
  Plane,
  Briefcase,
  Award,
  Receipt,
  Compass,
  Ticket,
  Headphones,
  Cpu
} from 'lucide-react';

/**
 * JAY MURLIDHAR GROUP (JMG) — OUR BUSINESSES UNIFIED DIRECTORY DATA
 * 
 * Consolidates all SIX official business domains, their operating companies,
 * and verified service offerings into a single authoritative source of truth.
 * 
 * 01. Technology — Jay Murlidhar Tech Solutions
 * 02. Jan Suvidha — Jay Murlidhar Computer
 * 03. Insurance — Jay Murlidhar Insurance
 * 04. Business Services — Jay Murlidhar Business Services
 * 05. Travel — Jay Murlidhar Tours
 * 06. Retail — Jay Murlidhar Mobile & Accessories
 */

export const JMG_BUSINESS_DOMAINS = [
  {
    id: 'technology',
    number: '01',
    name: 'Technology',
    shortName: 'Technology',
    categoryTitle: 'TECHNOLOGY & DIGITAL',
    domainRoute: '/technology',
    accentColor: '#2563EB',
    tagline: 'Custom software engineering, modern web applications, and intelligent automation systems.',
    company: {
      id: 'jay-murlidhar-tech-solutions',
      name: 'Jay Murlidhar Tech Solutions',
      legalName: 'Jay Murlidhar Tech Solutions Pvt. Ltd.',
      slug: 'jay-murlidhar-tech-solutions',
      route: '/technology/jay-murlidhar-tech-solutions',
      description: 'The technological innovation engine of Jay Murlidhar Group, engineering bespoke cloud applications, enterprise automation pipelines, ERP/CRM portals, and digital public platforms for institutions and businesses.',
      established: '2020',
      badge: 'Software & Cloud Engineering'
    },
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
    domainRoute: '/jan-suvidha',
    accentColor: '#0284C7',
    tagline: 'Authorized Common Services Centre (CSC), digital public kiosk, and government e-governance delivery.',
    company: {
      id: 'jay-murlidhar-computer',
      name: 'Jay Murlidhar Computer',
      legalName: 'Jay Murlidhar Computer (CSC & Jan Suvidha Kendra)',
      slug: 'jay-murlidhar-computer',
      route: '/jan-suvidha/jay-murlidhar-computer',
      description: 'Authorized Common Services Centre (CSC) and Jan Suvidha Kendra delivering essential government e-services, public utility assistance, digital documentation, and citizen verification directly to local communities.',
      established: '1998',
      badge: 'Authorized CSC Public Kendra'
    },
    services: [
      {
        id: 'csc-government-services',
        name: 'CSC & Government Services',
        description: 'Direct citizen delivery of central and state e-governance schemes, Ayushman Bharat health cards, PM Kisan registrations, and official certificates.',
        icon: Building2,
        tags: ['Aadhaar Services', 'Ayushman Card', 'State & Central Schemes']
      },
      {
        id: 'rto-transport-services',
        name: 'RTO & Transport Documentation',
        description: 'End-to-end assistance with learner license applications, permanent driving license renewals, RC transfers, and vehicle permit documentation.',
        icon: Car,
        tags: ['Driving License', 'RC Transfer', 'Vehicle Permits']
      },
      {
        id: 'digital-citizen-documents',
        name: 'Digital Citizen Documentation',
        description: 'Income certificates, caste and domicile certificates, non-creamy layer verification, affidavit assistance, and digital documentation archiving.',
        icon: FileText,
        tags: ['Income Certificate', 'Domicile / Caste', 'Affidavit Support']
      },
      {
        id: 'utility-bill-banking-kiosk',
        name: 'Utility Payments & Banking Kiosk',
        description: 'Friction-free electricity, water, and broadband bill payments alongside micro-ATM cash withdrawals, DMT transfers, and insurance premium deposits.',
        icon: Receipt,
        tags: ['Electricity & Gas', 'Micro-ATM / DMT', 'Premium Collection']
      },
      {
        id: 'student-academic-forms',
        name: 'Student Online Admissions & Forms',
        description: 'Guided submission for university entrance exams, board examination registrations, scholarship applications, and competitive exam hall tickets.',
        icon: Users,
        tags: ['Scholarships', 'University Admissions', 'Exam Applications']
      }
    ]
  },
  {
    id: 'insurance',
    number: '03',
    name: 'Insurance',
    shortName: 'Insurance',
    categoryTitle: 'RISK MANAGEMENT & ADVISORY',
    domainRoute: '/insurance',
    accentColor: '#059669',
    tagline: 'Comprehensive risk management, policy comparisons, and dedicated claims settlement support.',
    company: {
      id: 'jay-murlidhar-insurance',
      name: 'Jay Murlidhar Insurance',
      legalName: 'Jay Murlidhar Insurance Services',
      slug: 'jay-murlidhar-insurance',
      route: '/insurance/jay-murlidhar-insurance',
      description: 'Independent insurance and risk mitigation advisory offering unbiased policy comparisons, institutional underwriting coordination, and an industry-leading claims advocacy desk across life, health, and commercial sectors.',
      established: '2008',
      badge: 'IRDAI-Compliant Advisory'
    },
    services: [
      {
        id: 'general-insurance',
        name: 'General & Motor Insurance',
        description: 'Comprehensive motor insurance for two-wheelers, private vehicles, and commercial transport fleets, safeguarding assets against accidental damage.',
        icon: Shield,
        tags: ['Zero-Depreciation', 'Fleet Coverage', 'Third-Party & Comprehensive']
      },
      {
        id: 'life-insurance',
        name: 'Life & Term Insurance',
        description: 'Tailored financial security portfolios including pure term plans, endowment savings, child education funds, and retirement annuity solutions.',
        icon: HeartHandshake,
        tags: ['Term Protection', 'Child Future Plans', 'Retirement Annuities']
      },
      {
        id: 'health-mediclaim',
        name: 'Health & Family Mediclaim',
        description: 'Individual and family health coverage featuring cashless hospital access across top-tier network hospitals, pre-existing disease riders, and ICU protection.',
        icon: ShieldPlus,
        tags: ['Cashless Hospitalization', 'Family Floater', 'Critical Illness Riders']
      },
      {
        id: 'corporate-commercial-insurance',
        name: 'Corporate & Commercial Insurance',
        description: 'Institutional group mediclaim policies, workmen compensation, director & officer liability, transit marine, and cyber risk coverage.',
        icon: Briefcase,
        tags: ['Group Mediclaim', 'Fire & Property', 'Workmen Compensation']
      },
      {
        id: 'claims-advocacy',
        name: 'Claims Settlement Advocacy',
        description: 'A dedicated assistance desk managing claim documentation, hospital desk coordination, insurer disputes, and prompt disbursement tracking.',
        icon: Award,
        tags: ['98.6% Settlement Track', 'Fast-Track Processing', 'Direct TPA Liaising']
      }
    ]
  },
  {
    id: 'business-services',
    number: '04',
    name: 'Business Services',
    shortName: 'Business Services',
    categoryTitle: 'CORPORATE COMPLIANCE & LEGAL',
    domainRoute: '/business-services',
    accentColor: '#7C3AED',
    tagline: 'End-to-end statutory registrations, tax compliance, corporate filings, and commercial legal documentation.',
    company: {
      id: 'jay-murlidhar-business-services',
      name: 'Jay Murlidhar Business Services',
      legalName: 'Jay Murlidhar Business Services',
      slug: 'jay-murlidhar-business-services',
      route: '/business-services/jay-murlidhar-business-services',
      description: 'Dedicated corporate operations and statutory advisory removing procedural friction for entrepreneurs, enterprises, and educational institutions through corporate compliance, tax filings, and legal licensing.',
      established: '2015',
      badge: 'Corporate Advisory & Statutory Desk'
    },
    services: [
      {
        id: 'business-registration',
        name: 'Business Registration & Incorporation',
        description: 'End-to-end legal formation of Private Limited companies, LLPs, One Person Companies, partnership firms, and MSME/Udyam registrations.',
        icon: Building2,
        tags: ['Pvt Ltd & LLP', 'MSME / Udyam', 'Partnership Deeds']
      },
      {
        id: 'gst-compliance-filings',
        name: 'GST Registration & Return Filings',
        description: 'New GST number allocations, monthly GSTR-1 and GSTR-3B filings, input tax credit (ITC) reconciliation, and notice resolution.',
        icon: FileSpreadsheet,
        tags: ['New GST Allotment', 'Monthly GSTR Filings', 'ITC Reconciliation']
      },
      {
        id: 'taxation-accounting-support',
        name: 'Corporate Accounting & Bookkeeping',
        description: 'Structured ledger accounting, financial statement preparation, TDS reconciliation, and audit documentation support for enterprises.',
        icon: Receipt,
        tags: ['Day-to-Day Ledgers', 'TDS & TCS Returns', 'Audit Preparation']
      },
      {
        id: 'trademark-ip-filings',
        name: 'Trademark & Intellectual Property',
        description: 'Brand name search, trademark registration filings, copyright documentation, objection responses, and intellectual property monitoring.',
        icon: Award,
        tags: ['Brand Protection', 'TM Search & Filing', 'Copyright Registration']
      },
      {
        id: 'statutory-licensing',
        name: 'Trade & Regulatory Licenses',
        description: 'FSSAI food licenses, Shop & Establishment Gumastadhara licenses, import-export codes (IEC), and local municipal commercial permits.',
        icon: FileCheck2,
        tags: ['FSSAI Food License', 'Shop Act / Gumasta', 'Import-Export Code (IEC)']
      }
    ]
  },
  {
    id: 'travel',
    number: '05',
    name: 'Travel',
    shortName: 'Travel',
    categoryTitle: 'INSTITUTIONAL & LEISURE TRAVEL',
    domainRoute: '/travel',
    accentColor: '#EA580C',
    tagline: 'Curated institutional study tours, university delegations, and corporate travel logistics.',
    company: {
      id: 'jay-murlidhar-tours',
      name: 'Jay Murlidhar Tours',
      legalName: 'Jay Murlidhar Tours & Travels',
      slug: 'jay-murlidhar-tours',
      route: '/travel/jay-murlidhar-tours',
      description: 'Specialized institutional travel logistics and curated holiday management coordinating university student excursions, faculty conferences, corporate retreats, and bespoke family travel experiences.',
      established: '2012',
      badge: 'Institutional Travel Coordinator'
    },
    services: [
      {
        id: 'institutional-study-tours',
        name: 'Institutional & Academic Study Tours',
        description: 'End-to-end coordination for university student delegations, faculty field expeditions, and educational heritage tours across India.',
        icon: Compass,
        tags: ['Educational Itineraries', 'Campus Group Logistics', 'Faculty Expeditions']
      },
      {
        id: 'corporate-travel-management',
        name: 'Corporate Travel Management',
        description: 'Dedicated business travel itineraries, leadership retreats, corporate conferences, hotel bookings, and chartered transport coordination.',
        icon: Briefcase,
        tags: ['Executive Retreats', 'Corporate Offsites', 'Hotel & Flight Blocks']
      },
      {
        id: 'holiday-tour-packages',
        name: 'Domestic & International Holidays',
        description: 'Bespoke holiday packages covering cultural, wildlife, spiritual, and adventure circuits across Gujarat, Rajasthan, Kerala, and international destinations.',
        icon: Plane,
        tags: ['Custom Itineraries', 'Family Vacations', 'Sightseeing & Stays']
      },
      {
        id: 'ticketing-transit-logistics',
        name: 'Flight, Train & Transit Ticketing',
        description: 'Hassle-free airline bookings, group railway reservations, luxury coach rentals, and airport transfer coordination with 24/7 travel desk support.',
        icon: Ticket,
        tags: ['Air & Rail Bookings', 'Luxury Coach Hire', '24/7 Journey Support']
      }
    ]
  },
  {
    id: 'retail',
    number: '06',
    name: 'Retail',
    shortName: 'Retail',
    categoryTitle: 'SMART MOBILITY & HARDWARE',
    domainRoute: '/retail',
    accentColor: '#E11D48',
    tagline: 'Smart hardware retail, mobile accessories, student computing devices, and certified servicing.',
    company: {
      id: 'jay-murlidhar-mobile-accessories',
      name: 'Jay Murlidhar Mobile & Accessories',
      legalName: 'Jay Murlidhar Mobile & Accessories',
      slug: 'jay-murlidhar-mobile-accessories',
      route: '/retail/jay-murlidhar-mobile-accessories',
      description: 'Community tech hardware and smart mobility destination providing genuine consumer electronics, student computing devices, certified smartphone accessories, and rapid hardware servicing.',
      established: '2016',
      badge: 'Certified Mobility Hardware Store'
    },
    services: [
      {
        id: 'smartphones-hardware',
        name: 'Smartphones & Smart Devices',
        description: 'Genuine brand-certified smartphones, 5G mobility devices, and digital tablets configured for students, professionals, and commercial teams.',
        icon: Smartphone,
        tags: ['Top Brand Mobiles', 'Official Warranty', 'Data Transfer & Setup']
      },
      {
        id: 'mobile-peripherals-accessories',
        name: 'Certified Peripherals & Accessories',
        description: 'Premium wireless audio earbuds, heavy-duty power banks, GaN fast chargers, tempered screen shields, and rugged protective phone cases.',
        icon: Headphones,
        tags: ['Fast Chargers & Cables', 'Wireless Audio', 'Tempered Glass & Cases']
      },
      {
        id: 'device-servicing-repair',
        name: 'Technical Repair & Screen Replacement',
        description: 'Quick-turnaround display repairs, genuine battery replacements, charging port fixes, and micro-soldering diagnostics by certified technicians.',
        icon: Cpu,
        tags: ['Original Displays', 'Battery Swaps', 'Same-Day Diagnostics']
      },
      {
        id: 'student-computing-hardware',
        name: 'Student Computing & Hardware Bundles',
        description: 'Value-oriented student laptops, study tablets, Bluetooth typing accessories, and peripheral setups optimized for digital learning and remote education.',
        icon: ShoppingBag,
        tags: ['Student Tablet Kits', 'Study Peripherals', 'Affordable Packages']
      }
    ]
  }
];

export const OUR_BUSINESSES_HERO = {
  eyebrow: 'ONE GROUP. SIX BUSINESS DOMAINS.',
  headline: 'OUR BUSINESSES',
  description: 'Explore the companies and services that bring Jay Murlidhar Group together across technology, citizen services, insurance, business operations, institutional travel, and mobility retail.',
  stats: [
    { value: '6', label: 'Business Domains' },
    { value: '6', label: 'Operating Companies' },
    { value: '30+', label: 'Verified Services' },
    { value: '100%', label: 'Connected Group' }
  ]
};

export function getBusinessByDomainId(id) {
  return JMG_BUSINESS_DOMAINS.find(d => d.id === id) || JMG_BUSINESS_DOMAINS[0];
}
