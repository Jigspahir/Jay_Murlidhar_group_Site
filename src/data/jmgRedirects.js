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

  // 2. Single-segment legacy routes for all 10 companies
  '/jay-murlidhar-computer': '/technology/jay-murlidhar-computer',
  '/jay-murlidhar-tech-solutions': '/technology/jay-murlidhar-tech-solutions',
  '/jay-murlidhar-finance': '/finance/jay-murlidhar-finance',
  '/jay-murlidhar-insurance': '/insurance/jay-murlidhar-insurance',
  '/jay-murlidhar-business-services': '/business-services/jay-murlidhar-business-services',
  '/jay-murlidhar-infra': '/infrastructure/jay-murlidhar-infra',
  '/jay-murlidhar-tours': '/travel/jay-murlidhar-tours',
  '/jay-murlidhar-trade': '/trade-export/jay-murlidhar-trade-solutions',
  '/jay-murlidhar-trade-solutions': '/trade-export/jay-murlidhar-trade-solutions',
  '/jay-murlidhar-exports': '/trade-export/jay-murlidhar-exports',
  '/jay-murlidhar-mobile': '/retail/jay-murlidhar-mobile-accessories',
  '/jay-murlidhar-mobile-accessories': '/retail/jay-murlidhar-mobile-accessories',

  // 3. Trade domain legacy & alternate routes
  '/trade': '/trade-export',
  '/trade/jay-murlidhar-trade': '/trade-export/jay-murlidhar-trade-solutions',
  '/trade/jay-murlidhar-trade-solutions': '/trade-export/jay-murlidhar-trade-solutions',
  '/trade/jay-murlidhar-exports': '/trade-export/jay-murlidhar-exports',

  // 4. Retail legacy alternate route
  '/retail/jay-murlidhar-mobile': '/retail/jay-murlidhar-mobile-accessories',
};

// All valid canonical paths in JMG application
export const JMG_CANONICAL_ROUTES = new Set([
  '/',
  '/ecosystem',
  '/business-services',
  '/technology',
  '/finance',
  '/insurance',
  '/infrastructure',
  '/travel',
  '/trade-export',
  '/retail',
  '/technology/jay-murlidhar-computer',
  '/technology/jay-murlidhar-tech-solutions',
  '/finance/jay-murlidhar-finance',
  '/insurance/jay-murlidhar-insurance',
  '/business-services/jay-murlidhar-business-services',
  '/infrastructure/jay-murlidhar-infra',
  '/travel/jay-murlidhar-tours',
  '/trade-export/jay-murlidhar-trade-solutions',
  '/trade-export/jay-murlidhar-exports',
  '/retail/jay-murlidhar-mobile-accessories',
]);

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
