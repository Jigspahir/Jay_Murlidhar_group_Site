/**
 * JAY MURLIDHAR GROUP — CENTRALIZED REDIRECT CONFIGURATION
 * 
 * Strict 1-to-1 canonical redirect map.
 * Enforces:
 * - Single canonical URL per business
 * - No redirect chains
 * - Direct 301-style permanent client redirects
 * - Preservation of query parameters
 */

export const JMG_REDIRECTS = {
  // 1. Legacy Business Services route under Technology (Crucial requirement)
  '/technology/jay-murlidhar-business-services': '/business-services/jay-murlidhar-business-services',

  // 2. Legacy Jay Murlidhar Computer route under Technology -> Redirect to Jan Suvidha
  '/technology/jay-murlidhar-computer': '/jan-suvidha/jay-murlidhar-computer',

  // 3. Single-segment legacy routes for all companies
  '/jay-murlidhar-computer': '/jan-suvidha/jay-murlidhar-computer',
  '/jay-murlidhar-tech-solutions': '/technology/jay-murlidhar-tech-solutions',
  '/jay-murlidhar-finance': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-insurance': '/insurance/jay-murlidhar-insurance',
  '/jay-murlidhar-business-services': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-infra': '/technology/jay-murlidhar-tech-solutions',
  '/jay-murlidhar-tours': '/travel/jay-murlidhar-tours',
  '/jay-murlidhar-trade': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-trade-solutions': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-exports': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-mobile': '/retail/jay-murlidhar-mobile-accessories',
  '/jay-murlidhar-mobile-accessories': '/retail/jay-murlidhar-mobile-accessories',

  // 4. Trade domain legacy & alternate routes
  '/trade': '/business-services',
  '/trade/jay-murlidhar-trade': '/business-services/jay-murlidhar-business-services',
  '/trade/jay-murlidhar-trade-solutions': '/business-services/jay-murlidhar-business-services',
  '/trade/jay-murlidhar-exports': '/business-services/jay-murlidhar-business-services',
  '/trade-export': '/business-services',
  '/trade-export/jay-murlidhar-trade-solutions': '/business-services/jay-murlidhar-business-services',
  '/trade-export/jay-murlidhar-exports': '/business-services/jay-murlidhar-business-services',

  // 5. Retail legacy alternate route
  '/retail/jay-murlidhar-mobile': '/retail/jay-murlidhar-mobile-accessories',

  // 6. Legacy pre-V2 static HTML and old insurance pages
  '/general-insurance.html': '/insurance',
  '/general-insurance': '/insurance',
  '/health-insurance.html': '/insurance',
  '/health-insurance': '/insurance',
  '/life-insurance.html': '/insurance',
  '/life-insurance': '/insurance',
  '/term-insurance.html': '/insurance',
  '/term-insurance': '/insurance',
  '/other-insurance.html': '/insurance',
  '/other-insurance': '/insurance',

  // 7. Legacy investment, finance, infrastructure & legal pages
  '/investment.html': '/business-services',
  '/investment': '/business-services',
  '/finance': '/business-services',
  '/finance/jay-murlidhar-finance': '/business-services/jay-murlidhar-business-services',
  '/infrastructure': '/technology',
  '/infrastructure/jay-murlidhar-infra': '/technology/jay-murlidhar-tech-solutions',
  '/terms.html': '/about',
  '/terms': '/about',

  // 8. Legacy service-detail base routes
  '/service-detail.html': '/solutions',
  '/service-detail': '/solutions',

  // 9. Legacy subfolder deployment routes (Jay_Murlidhar_group_Site/)
  '/jay_murlidhar_group_site/general-insurance.html': '/insurance',
  '/jay_murlidhar_group_site/health-insurance.html': '/insurance',
  '/jay_murlidhar_group_site/life-insurance.html': '/insurance',
  '/jay_murlidhar_group_site/term-insurance.html': '/insurance',
  '/jay_murlidhar_group_site/other-insurance.html': '/insurance',
  '/jay_murlidhar_group_site/investment.html': '/business-services',
  '/jay_murlidhar_group_site/index.html': '/',
  '/jay_murlidhar_group_site': '/',
};

// All valid canonical paths in JMG application
export const JMG_CANONICAL_ROUTES = new Set([
  '/',
  '/about',
  '/ecosystem',
  '/solutions',
  '/services',
  '/projects',
  '/careers',
  '/careers/jobs',
  '/careers/internships',
  '/contact',
  '/technology',
  '/jan-suvidha',
  '/insurance',
  '/business-services',
  '/travel',
  '/retail',
  '/finance',
  '/infrastructure',
  '/trade-export',
  '/technology/jay-murlidhar-tech-solutions',
  '/jan-suvidha/jay-murlidhar-computer',
  '/insurance/jay-murlidhar-insurance',
  '/business-services/jay-murlidhar-business-services',
  '/travel/jay-murlidhar-tours',
  '/retail/jay-murlidhar-mobile-accessories',
  '/finance/jay-murlidhar-finance',
  '/infrastructure/jay-murlidhar-infra',
  '/trade-export/jay-murlidhar-trade-solutions',
  '/trade-export/jay-murlidhar-exports',
]);

/**
 * Resolves legacy service query parameters (e.g. ?service=Digital+Marketing)
 * to the appropriate modern section.
 */
export function resolveServiceDetailRedirect(serviceParam) {
  if (!serviceParam) return '/solutions';
  const s = serviceParam.toLowerCase();

  // Insurance services
  if (
    s.includes('insurance') ||
    s.includes('bima') ||
    s.includes('lic') ||
    s.includes('ayushman')
  ) {
    return '/insurance';
  }

  // Technology & digital services
  if (
    s.includes('marketing') ||
    s.includes('web') ||
    s.includes('app') ||
    s.includes('software') ||
    s.includes('tech') ||
    s.includes('seo') ||
    s.includes('sms') ||
    s.includes('hosting') ||
    s.includes('chatbot') ||
    s.includes('graphic')
  ) {
    return '/technology';
  }

  // CSC & Citizen services / Academy
  if (
    s.includes('aadhaar') ||
    s.includes('pan') ||
    s.includes('tan') ||
    s.includes('scheme') ||
    s.includes('csc') ||
    s.includes('computer') ||
    s.includes('course') ||
    s.includes('training') ||
    s.includes('banking') ||
    s.includes('bill') ||
    s.includes('documentation') ||
    s.includes('student') ||
    s.includes('english')
  ) {
    return '/jan-suvidha';
  }

  // Business & compliance services
  if (
    s.includes('gst') ||
    s.includes('msme') ||
    s.includes('tax') ||
    s.includes('fssai') ||
    s.includes('udyam') ||
    s.includes('license') ||
    s.includes('business') ||
    s.includes('signature')
  ) {
    return '/business-services';
  }

  return '/solutions';
}

/**
 * Resolves whether a given pathname requires redirection.
 * Normalizes trailing slashes and casing.
 * Returns { redirect: string } or null.
 */
export function resolveRedirect(pathname) {
  if (!pathname || pathname === '/') return null;

  // 1. Remove trailing slash if present
  const withoutTrailingSlash = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  // 2. Lowercase normalization
  const normalized = withoutTrailingSlash.toLowerCase();

  // 3. Check direct match in redirects map
  if (JMG_REDIRECTS[normalized]) {
    return { target: JMG_REDIRECTS[normalized] };
  }

  // 4. If path had uppercase or trailing slash and matches a canonical route when normalized
  if (normalized !== pathname && JMG_CANONICAL_ROUTES.has(normalized)) {
    return { target: normalized };
  }

  return null;
}
