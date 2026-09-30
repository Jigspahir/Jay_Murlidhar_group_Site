/**
 * JAY MURLIDHAR GROUP — CENTRALIZED CLIENT SERVICES DATA
 * 
 * CANONICAL COMPANY OWNERSHIP MAPPING (Single Source of Truth)
 * Driven strictly by client website logo/service verification.
 * 
 * HIERARCHY:
 * JAY MURLIDHAR GROUP
 * │
 * ├── TECHNOLOGY
 * │   │
 * │   ├── Jay Murlidhar Computer
 * │   │   ├── RTO SERVICES (5)
 * │   │   ├── CSC & BUSINESS SERVICES (13)
 * │   │   ├── BUSINESS REGISTRATION (5)
 * │   │   └── ACADEMY (7) [Tagline: "Learn. Build. Grow."]
 * │   │
 * │   └── Jay Murlidhar Tech Solutions
 * │       └── TECHNOLOGY SERVICES (12)
 * │
 * └── INSURANCE
 *     │
 *     └── Jay Murlidhar Insurance
 *         └── INSURANCE SERVICES (15)
 * 
 * JAY MURLIDHAR BUSINESS SERVICES
 * └── Remains independent. No screenshot-derived services assigned.
 */

// ============================================================================
// 1. CANONICAL SERVICE ITEM ARRAYS
// ============================================================================

// RTO Services (Jay Murlidhar Computer)
export const RTO_SERVICES = [
  "Vehicle Registration",
  "Ownership Transfer",
  "Driving Licence Assistance",
  "Online Documentation",
  "RTO Support"
];

// CSC & Business Services (Jay Murlidhar Computer)
export const CSC_BUSINESS_SERVICES = [
  "GST Registration & Filing",
  "MSME Registration",
  "PAN / TAN Card",
  "Shop Act License",
  "FSSAI Registration",
  "Income Tax Filing",
  "Digital Signature (DSC)",
  "Udyam Registration",
  "Online Documentation",
  "Government Schemes",
  "Banking Services",
  "Bill Payments",
  "Aadhaar Services"
];

// Business Registration (Jay Murlidhar Computer)
export const BUSINESS_REGISTRATION_SERVICES = [
  "GST Registration & Filing",
  "MSME Registration",
  "Shop Act License",
  "FSSAI Certification",
  "Business Documentation"
];

// Academy (Jay Murlidhar Computer)
export const ACADEMY_SERVICES = [
  "Computer Courses",
  "Tally Course",
  "Basic IT Training",
  "Digital Marketing Training",
  "Web Development Course",
  "Spoken English",
  "Government Exam Preparation"
];

// Technology Services (Jay Murlidhar Tech Solutions - renamed from old "Freelance Services")
export const TECH_SERVICES = [
  "Website Design",
  "Website Development",
  "App Development",
  "Software Development",
  "Digital Marketing",
  "Social Media Marketing",
  "Graphic Design",
  "SEO Services",
  "WhatsApp API Solutions",
  "Bulk SMS Services",
  "Hosting & Domain",
  "AI Chatbot Development"
];

// Insurance Services (Jay Murlidhar Insurance)
export const INSURANCE_SERVICES = [
  "Life Insurance",
  "Health Insurance",
  "Motor Insurance",
  "Bike Insurance",
  "Car Insurance",
  "Commercial Vehicle Insurance",
  "Business Insurance",
  "Corporate Insurance",
  "Shop Insurance",
  "Factory Insurance",
  "Marine Insurance",
  "Fire Insurance",
  "Travel Insurance",
  "Crop Insurance",
  "Cyber Insurance"
];

// ============================================================================
// 2. CENTRALIZED SERVICE DATA MODEL (EXPLICIT CANONICAL OWNERSHIP)
// ============================================================================
export const JMG_SERVICES = [
  {
    id: "rto-services",
    companyId: "jay-murlidhar-computer",
    category: "rto",
    title: "RTO Services",
    subtitle: "Vehicle Registration, Ownership Transfer & Licensing",
    companyName: "Jay Murlidhar Computer",
    companyRoute: "/technology/jay-murlidhar-computer",
    domainId: "technology",
    domainName: "Technology & Digital",
    domainRoute: "/technology",
    description: "Complete RTO services including vehicle registration, ownership transfer, driving license assistance, and online documentation with fast and reliable support.",
    items: RTO_SERVICES,
    logo: "/assets/jay-murlidhar-computer-logo-jpg.jpg",
    accent: "#2563EB",
    exploreRoute: "/technology/jay-murlidhar-computer"
  },
  {
    id: "csc-business-services",
    companyId: "jay-murlidhar-computer",
    category: "csc-business",
    title: "CSC & Business Services",
    subtitle: "Government Filings, Licensing & Citizen Support",
    companyName: "Jay Murlidhar Computer",
    companyRoute: "/technology/jay-murlidhar-computer",
    domainId: "technology",
    domainName: "Technology & Digital",
    domainRoute: "/technology",
    description: "End-to-end business solutions with GST registration & filing, MSME registration, Shop Act license, FSSAI registration, and expert support for smooth operations.",
    items: CSC_BUSINESS_SERVICES,
    logo: "/assets/jay-murlidhar-computer-logo-jpg.jpg",
    accent: "#2563EB",
    exploreRoute: "/technology/jay-murlidhar-computer"
  },
  {
    id: "business-registration",
    companyId: "jay-murlidhar-computer",
    category: "business-registration",
    title: "Business Registration",
    subtitle: "GST, MSME, Shop Act & FSSAI Business Documentation",
    companyName: "Jay Murlidhar Computer",
    companyRoute: "/technology/jay-murlidhar-computer",
    domainId: "technology",
    domainName: "Technology & Digital",
    domainRoute: "/technology",
    description: "Official business registration support including GST, MSME, Shop Act, FSSAI certification, and commercial documentation.",
    items: BUSINESS_REGISTRATION_SERVICES,
    logo: "/assets/jay-murlidhar-computer-logo-jpg.jpg",
    accent: "#2563EB",
    exploreRoute: "/technology/jay-murlidhar-computer"
  },
  {
    id: "academy",
    companyId: "jay-murlidhar-computer",
    category: "academy",
    title: "Academy",
    subtitle: "Computer, Tally, IT & Professional Training",
    tagline: "Learn. Build. Grow.",
    companyName: "Jay Murlidhar Computer",
    companyRoute: "/technology/jay-murlidhar-computer",
    domainId: "technology",
    domainName: "Technology & Digital",
    domainRoute: "/technology",
    description: "Practical computer education, IT training, and skill development programs tailored for students, job aspirants, and local entrepreneurs.",
    items: ACADEMY_SERVICES,
    logo: "/assets/jay-murlidhar-computer-logo-jpg.jpg",
    accent: "#2563EB",
    exploreRoute: "/technology/jay-murlidhar-computer"
  },
  {
    id: "technology-services",
    companyId: "jay-murlidhar-tech-solutions",
    category: "technology",
    title: "Technology Services",
    subtitle: "Web Development, Application Engineering & Digital Marketing",
    companyName: "Jay Murlidhar Tech Solutions",
    companyRoute: "/technology/jay-murlidhar-tech-solutions",
    domainId: "technology",
    domainName: "Technology & Digital",
    domainRoute: "/technology",
    description: "Professional technology services including website development, application development, social media marketing, and modern website design — tailored to grow your business.",
    items: TECH_SERVICES,
    logo: "/assets/jay murlidhar tech.jpg",
    accent: "#7C3AED",
    exploreRoute: "/technology/jay-murlidhar-tech-solutions"
  },
  {
    id: "insurance-services",
    companyId: "jay-murlidhar-insurance",
    category: "insurance",
    title: "Insurance Services",
    subtitle: "Comprehensive Life, Health, Motor, Business & Corporate Protection",
    companyName: "Jay Murlidhar Insurance",
    companyRoute: "/insurance/jay-murlidhar-insurance",
    domainId: "insurance",
    domainName: "Insurance",
    domainRoute: "/insurance",
    description: "We offer a complete range of insurance services including Life, Health, Motor, Business, Corporate, and Personal Insurance with expert support and hassle-free processing.",
    items: INSURANCE_SERVICES,
    logo: "/assets/jay murlidhar insurance.svg",
    accent: "#0284C7",
    exploreRoute: "/insurance/jay-murlidhar-insurance"
  }
];

// ============================================================================
// 3. STRUCTURED SERVICE CATEGORIES PER OPERATING COMPANY
// ============================================================================
export const JMG_SERVICE_CATEGORIES = JMG_SERVICES.map((service) => ({
  id: service.id,
  title: service.title,
  subtitle: service.subtitle,
  tagline: service.tagline,
  companyId: service.companyId,
  companySlug: service.companyId,
  companyName: service.companyName,
  companyRoute: service.companyRoute,
  domainId: service.domainId,
  description: service.description,
  items: service.items
}));

// ============================================================================
// 4. PREVIEW SUITES (FOR HOME PAGE PREVIEW SECTION)
// ============================================================================
export const JMG_PREVIEW_SUITES = [
  {
    ...JMG_SERVICES.find((s) => s.id === "insurance-services"),
    number: "01"
  },
  {
    ...JMG_SERVICES.find((s) => s.id === "rto-services"),
    number: "02"
  },
  {
    ...JMG_SERVICES.find((s) => s.id === "csc-business-services"),
    number: "03"
  },
  {
    ...JMG_SERVICES.find((s) => s.id === "technology-services"),
    number: "04"
  },
  {
    ...JMG_SERVICES.find((s) => s.id === "academy"),
    number: "05"
  }
];

export const JMG_SERVICE_SUITES = JMG_PREVIEW_SUITES;

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================
export const getServicesByCompany = (companyId) => {
  return JMG_SERVICES.filter(
    (s) => s.companyId === companyId || s.companySlug === companyId
  );
};

export const getServiceCategoriesByCompany = (companyId) => {
  return JMG_SERVICE_CATEGORIES.filter(
    (c) => c.companyId === companyId || c.companySlug === companyId
  );
};

export const getServicesByDomain = (domainId) => {
  return JMG_SERVICES.filter((s) => s.domainId === domainId);
};

export const getServiceById = (id) => {
  return JMG_SERVICES.find((s) => s.id === id);
};

export const getAllServices = () => JMG_SERVICES;
