/**
 * JAY MURLIDHAR GROUP — MULTI-COMPANY ARCHITECTURE CONTRACTS
 * 
 * Phase 1 Architectural Definitions for Canonical Companies & Domains.
 * Single source of reference for future Multi-Company Management features.
 */

/**
 * Canonical Domains in the JMG Ecosystem
 */
export const CANONICAL_DOMAINS = Object.freeze({
  TECHNOLOGY: 'technology',
  JAN_SUVIDHA: 'jan-suvidha',
  INSURANCE: 'insurance',
  BUSINESS_SERVICES: 'business-services',
  TRAVEL: 'travel',
  RETAIL: 'retail'
});

/**
 * Metadata for Canonical Domains
 */
export const DOMAIN_DEFINITIONS = Object.freeze([
  {
    id: CANONICAL_DOMAINS.TECHNOLOGY,
    name: 'Technology',
    shortCategory: 'Technology & Digital Systems',
    domainRoute: '/technology',
    color: '#2563EB'
  },
  {
    id: CANONICAL_DOMAINS.JAN_SUVIDHA,
    name: 'Jan Suvidha',
    shortCategory: 'Citizen & Public Services',
    domainRoute: '/jan-suvidha',
    color: '#10B981',
    note: 'Common Services Centre (CSC) / Digital Public Kiosk'
  },
  {
    id: CANONICAL_DOMAINS.INSURANCE,
    name: 'Insurance',
    shortCategory: 'Risk & Claims Advocacy',
    domainRoute: '/insurance',
    color: '#0284C7'
  },
  {
    id: CANONICAL_DOMAINS.BUSINESS_SERVICES,
    name: 'Business Services',
    shortCategory: 'Corporate Workflow & Statutory Compliance',
    domainRoute: '/business-services',
    color: '#EA580C'
  },
  {
    id: CANONICAL_DOMAINS.TRAVEL,
    name: 'Travel',
    shortCategory: 'Institutional Study Tours & Corporate Delegations',
    domainRoute: '/travel',
    color: '#D97706'
  },
  {
    id: CANONICAL_DOMAINS.RETAIL,
    name: 'Retail',
    shortCategory: 'Smart Mobility & Electronics Provisioning',
    domainRoute: '/retail',
    color: '#DB2777'
  }
]);

/**
 * Six Canonical JMG Companies
 * Note: Jay Murlidhar Computer strictly belongs to Jan Suvidha, NOT Technology.
 */
export const CANONICAL_COMPANIES = Object.freeze([
  {
    id: 'jay-murlidhar-tech-solutions',
    code: 'JMTS',
    name: 'Jay Murlidhar Tech Solutions',
    domainId: CANONICAL_DOMAINS.TECHNOLOGY,
    domainName: 'Technology',
    publicRoute: '/technology/jay-murlidhar-tech-solutions',
    description: 'Custom software engineering, cloud infrastructure, web apps, and intelligent automation.'
  },
  {
    id: 'jay-murlidhar-computer',
    code: 'JMC',
    name: 'Jay Murlidhar Computer',
    domainId: CANONICAL_DOMAINS.JAN_SUVIDHA,
    domainName: 'Jan Suvidha',
    publicRoute: '/jan-suvidha/jay-murlidhar-computer',
    description: 'Neighbourhood digital services kiosk, CSC citizen services, statutory docs, and basic IT education.'
  },
  {
    id: 'jay-murlidhar-insurance',
    code: 'JMI',
    name: 'Jay Murlidhar Insurance',
    domainId: CANONICAL_DOMAINS.INSURANCE,
    domainName: 'Insurance',
    publicRoute: '/insurance/jay-murlidhar-insurance',
    description: 'Corporate underwriting, institutional liability risk mitigation, and claims advocacy.'
  },
  {
    id: 'jay-murlidhar-business-services',
    code: 'JMBS',
    name: 'Jay Murlidhar Business Services',
    domainId: CANONICAL_DOMAINS.BUSINESS_SERVICES,
    domainName: 'Business Services',
    publicRoute: '/business-services/jay-murlidhar-business-services',
    description: 'Corporate workflow assistance, statutory filings, legal certifications, and operational management.'
  },
  {
    id: 'jay-murlidhar-tours',
    code: 'JMT',
    name: 'Jay Murlidhar Tours',
    domainId: CANONICAL_DOMAINS.TRAVEL,
    domainName: 'Travel',
    publicRoute: '/travel/jay-murlidhar-tours',
    description: 'Institutional study tours, university delegations, faculty expeditions, and corporate itineraries.'
  },
  {
    id: 'jay-murlidhar-mobile-accessories',
    code: 'JMMA',
    name: 'Jay Murlidhar Mobile & Accessories',
    domainId: CANONICAL_DOMAINS.RETAIL,
    domainName: 'Retail',
    publicRoute: '/retail/jay-murlidhar-mobile-accessories',
    description: 'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.'
  }
]);

/**
 * Constant representing all companies consolidated view
 */
export const ALL_COMPANIES_ID = 'ALL';
