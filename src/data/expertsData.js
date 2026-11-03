import {
  Cpu,
  Building2,
  Shield,
  FileCheck2,
  Compass,
  Smartphone,
  Code2,
  Bot,
  Globe,
  Users,
  FileText,
  HeartHandshake,
  ShieldPlus,
  Briefcase,
  Plane,
  Headphones,
  ShoppingBag
} from 'lucide-react';

/**
 * JAY MURLIDHAR GROUP (JMG) — OFFICIAL DOMAIN EXPERT TEAMS
 * 
 * Strict 6-Domain Structure:
 * 01. Technology Experts
 * 02. Jan Suvidha Experts
 * 03. Insurance Experts
 * 04. Business Services Experts
 * 05. Travel Experts
 * 06. Retail Experts
 * 
 * Configurable architecture connected with JMG canonical data and employee registry.
 */
export const JMG_EXPERT_TEAMS = [
  {
    id: 'technology',
    number: '01',
    name: 'Technology',
    teamTitle: 'Technology Experts',
    operatingCompany: 'Jay Murlidhar Tech Solutions',
    companySlug: 'jay-murlidhar-tech-solutions',
    domainRoute: '/technology',
    icon: Cpu,
    accentColor: '#2563EB',
    tagline: 'Enterprise software engineers, web platform architects, and automation specialists.',
    specialistRoles: [
      {
        title: 'Software Developers',
        description: 'Backend architecture, clean API engineering, database schema modeling, and scalable microservices.',
        icon: Code2
      },
      {
        title: 'Web & App Development Specialists',
        description: 'Responsive user interfaces, cross-platform mobile apps (iOS & Android), and modern React web applications.',
        icon: Globe
      },
      {
        title: 'AI & Automation Specialists',
        description: 'Intelligent automation pipelines, autonomous agent integration, and workflow optimization systems.',
        icon: Bot
      }
    ],
    // Only verified employee records are displayed. If empty, the component renders a polished "Team information coming soon" state.
    verifiedProfiles: []
  },
  {
    id: 'jan-suvidha',
    number: '02',
    name: 'Jan Suvidha',
    teamTitle: 'Jan Suvidha Experts',
    operatingCompany: 'Jay Murlidhar Computer',
    companySlug: 'jay-murlidhar-computer',
    domainRoute: '/jan-suvidha',
    icon: Building2,
    accentColor: '#0284C7',
    tagline: 'Authorized CSC kiosk operators and digital public service navigators.',
    specialistRoles: [
      {
        title: 'CSC Service Specialists',
        description: 'Central and state government portal operations, citizen authentication, and direct e-governance delivery.',
        icon: Building2
      },
      {
        title: 'Government & Citizen Service Specialists',
        description: 'RTO vehicle services, Aadhaar/PAN coordination, public scheme applications, and institutional kiosk administration.',
        icon: Users
      },
      {
        title: 'Digital Documentation Support',
        description: 'Affidavits, certified utility applications, digital certificates, and citizen records verification.',
        icon: FileText
      }
    ],
    verifiedProfiles: []
  },
  {
    id: 'insurance',
    number: '03',
    name: 'Insurance',
    teamTitle: 'Insurance Experts',
    operatingCompany: 'Jay Murlidhar Insurance',
    companySlug: 'jay-murlidhar-insurance',
    domainRoute: '/insurance',
    icon: Shield,
    accentColor: '#059669',
    tagline: 'Certified insurance advisors, risk analysts, and dedicated claims settlement advocates.',
    specialistRoles: [
      {
        title: 'Life Insurance Specialists',
        description: 'Term life plans, family financial security coverage, retirement planning, and endowment portfolio advisory.',
        icon: HeartHandshake
      },
      {
        title: 'Health Insurance Specialists',
        description: 'Individual and family mediclaim policies, critical illness protection, and cashless hospitalization coordination.',
        icon: ShieldPlus
      },
      {
        title: 'Motor & General Insurance Specialists',
        description: 'Comprehensive commercial vehicle fleets, private car and two-wheeler coverage, and transit asset protection.',
        icon: Shield
      },
      {
        title: 'Corporate Insurance Specialists',
        description: 'Group employee health benefits, fire & property coverage, director liability, and industrial risk mitigation.',
        icon: Briefcase
      }
    ],
    verifiedProfiles: []
  },
  {
    id: 'business-services',
    number: '04',
    name: 'Business Services',
    teamTitle: 'Business Services Experts',
    operatingCompany: 'Jay Murlidhar Business Services',
    companySlug: 'jay-murlidhar-business-services',
    domainRoute: '/business-services',
    icon: FileCheck2,
    accentColor: '#7C3AED',
    tagline: 'Statutory compliance officers, corporate documentation executives, and GST filing advisors.',
    specialistRoles: [
      {
        title: 'Business Registration Specialists',
        description: 'Company incorporation (Pvt Ltd, LLP, OPC), MSME / Udyam registration, and commercial trade licensing.',
        icon: Building2
      },
      {
        title: 'GST & Compliance Support',
        description: 'Monthly/quarterly GST return filings (GSTR-1, GSTR-3B), reconciliation audits, and statutory documentation.',
        icon: FileCheck2
      },
      {
        title: 'Business Documentation Specialists',
        description: 'Partnership deeds, legal drafting support, digital signature certificates (DSC), and corporate record keeping.',
        icon: FileText
      }
    ],
    verifiedProfiles: []
  },
  {
    id: 'travel',
    number: '05',
    name: 'Travel',
    teamTitle: 'Travel Experts',
    operatingCompany: 'Jay Murlidhar Tours',
    companySlug: 'jay-murlidhar-tours',
    domainRoute: '/travel',
    icon: Compass,
    accentColor: '#EA580C',
    tagline: 'Institutional travel coordinators, expedition planners, and commercial transit specialists.',
    specialistRoles: [
      {
        title: 'Travel Planning Specialists',
        description: 'Bespoke itinerary design, academic group logistics, corporate retreat planning, and travel risk assessments.',
        icon: Compass
      },
      {
        title: 'Domestic & International Travel Specialists',
        description: 'Flight bookings, visa documentation support, curated holiday packages, and international conference mobility.',
        icon: Plane
      },
      {
        title: 'Tour Management Specialists',
        description: 'On-ground expedition coordination, chartered institutional coaches, hotel reservations, and emergency support.',
        icon: Users
      }
    ],
    verifiedProfiles: []
  },
  {
    id: 'retail',
    number: '06',
    name: 'Retail',
    teamTitle: 'Retail Experts',
    operatingCompany: 'Jay Murlidhar Mobile & Accessories',
    companySlug: 'jay-murlidhar-mobile-accessories',
    domainRoute: '/retail',
    icon: Smartphone,
    accentColor: '#E11D48',
    tagline: 'Smart hardware technicians, mobility product specialists, and client support advocates.',
    specialistRoles: [
      {
        title: 'Mobile Product Specialists',
        description: 'Smartphone recommendations, hardware specification guidance, device configuration, and warranty support.',
        icon: Smartphone
      },
      {
        title: 'Accessories & Retail Specialists',
        description: 'Certified audio gear, power accessories, protective gear, student computing peripherals, and inventory guidance.',
        icon: ShoppingBag
      },
      {
        title: 'Customer Support Specialists',
        description: 'Post-purchase assistance, device troubleshooting, repair status tracking, and prompt customer query resolution.',
        icon: Headphones
      }
    ],
    verifiedProfiles: []
  }
];
