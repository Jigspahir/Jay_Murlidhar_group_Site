import React, { useEffect } from 'react';
import { useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';
import { JMG_DOMAINS, JMG_COMPANIES, getDomainById, getCompanyBySlug } from '../data/jmgEcosystem';
import { resolveRedirect } from '../data/jmgRedirects';
import { useCanonical } from '../utils/seo';
import NotFoundPage from './NotFoundPage';
import TechnologySection from '../components/TechnologySection';
import { JMGDomainGlyph } from '../components/ecosystem/glyphs';

export default function DomainDetailPage({ domainId: propDomainId, onOpenContact }) {
  const { domain: paramDomain } = useParams();
  const location = useLocation();
  const domainId = propDomainId || paramDomain;

  // Resolve domain by id or domainRoute
  const domain = JMG_DOMAINS.find(
    (d) => d.id === domainId || d.domainRoute === `/${domainId}` || d.domainRoute === domainId
  );

  // Set canonical link for SEO
  useCanonical(domain?.domainRoute);

  // Set page metadata for Technology domain
  useEffect(() => {
    if (domain?.id === 'technology') {
      const prevTitle = document.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';

      document.title = "Super Intelligence & Digital Technology | Jay Murlidhar Group";
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          "Jay Murlidhar Group explores next-generation intelligence, intelligent automation, software, cloud and data-driven digital experiences."
        );
      }

      return () => {
        document.title = prevTitle;
        if (metaDesc && prevDesc) {
          metaDesc.setAttribute('content', prevDesc);
        }
      };
    }
  }, [domain?.id]);

  // Scroll to top on load or domain change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [domainId]);

  // 1. Check centralized redirect rule for this path first (preserves query params)
  const redirectInfo = resolveRedirect(location.pathname);
  if (redirectInfo) {
    return <Navigate to={`${redirectInfo.target}${location.search}`} replace />;
  }

  if (!domain) {
    return <NotFoundPage domainHint={domainId} />;
  }

  // Resolve operating companies under this domain
  const operatingCompanies = domain.companySlugs
    .map((slug) => getCompanyBySlug(slug) || JMG_COMPANIES.find((c) => c.slug === slug))
    .filter(Boolean);

  // Other domains for ecosystem cross-linking
  const otherDomains = JMG_DOMAINS.filter((d) => d.id !== domain.id);

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#FAFAFA]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* BREADCRUMB                                                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#111827] transition-colors">JMG</Link>
          <span>/</span>
          <Link to="/ecosystem" className="hover:text-[#111827] transition-colors">Ecosystem</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-semibold">{domain.categoryTitle || domain.name}</span>
        </div>

        {/* ========================================================================= */}
        {/* DOMAIN HEADER                                                             */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mb-16 lg:mb-20">
          <div className="flex items-center gap-2.5 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: `${domain.accent}12`,
                borderColor: `${domain.accent}30`,
                color: domain.accent
              }}
              aria-hidden="true"
            >
              <JMGDomainGlyph domainId={domain.id} className="w-4 h-4" strokeWidth={1.85} />
            </div>
            <span 
              className="px-2.5 py-0.5 rounded text-white font-mono text-[11px]"
              style={{ backgroundColor: domain.accent }}
            >
              DOMAIN {domain.number}
            </span>
            <span className="text-[#94A3B8]">&bull;</span>
            <span className="text-[#1E293B]">{domain.shortCategory}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6 break-words">
            {domain.categoryTitle || domain.name}
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-3xl">
            {domain.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-colors duration-200"
            >
              <span>Inquire with {domain.name} Division</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/ecosystem"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-white border border-[#E2E8F0] hover:border-[#111827] text-[#111827] text-xs sm:text-sm font-semibold transition-colors duration-200"
            >
              <span>View Full Ecosystem</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ENGINEERING PHILOSOPHY SECTION (ONLY FOR TECHNOLOGY DOMAIN)               */}
      {/* ========================================================================= */}
      {domain.id === 'technology' && (
        <TechnologySection />
      )}

      <div className={`max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 ${domain.id === 'technology' ? 'pt-14 sm:pt-16 lg:pt-20' : ''}`}>

        {/* ========================================================================= */}
        {/* OPERATING COMPANIES SECTION (CANONICAL DISPLAY)                           */}
        {/* ========================================================================= */}
        <div className="mb-20">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2E8F0]">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block">
                Operating Entities
              </span>
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">
                Businesses under {domain.name}
              </h2>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">
              {operatingCompanies.length} Canonical {operatingCompanies.length === 1 ? 'Entity' : 'Entities'}
            </span>
          </div>

          <div className="space-y-6">
            {operatingCompanies.map((company, idx) => (
              <div
                key={company.id || company.slug}
                className="p-6 sm:p-8 rounded-[16px] bg-white border border-[#E2E8F0] shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-400 transition-all duration-200 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                  <div className="max-w-2xl">
                    {company.logo && (
                      <div className="mb-4 inline-flex items-center p-2 rounded-lg bg-[#FAFAFA] border border-[#E2E8F0] max-h-12 max-w-[180px]">
                        <img
                          src={company.logo}
                          alt={`${company.name} Logo`}
                          className="max-h-8 w-auto object-contain"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold text-[#94A3B8]">
                      <span>{String(idx + 1).padStart(2, '0')}</span>
                      <span>&bull;</span>
                      <span className="text-[#2563EB]">{company.subtitle}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                      {company.name}
                    </h3>

                    <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
                      {company.shortDescription || company.description || company.tagline}
                    </p>
                  </div>

                  <Link
                    to={company.route || company.path}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111827] group-hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0 self-start shadow-sm"
                  >
                    <span>{company.name}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* Services preview if available */}
                {company.services && (
                  <div className="pt-6 border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-mono text-xs uppercase tracking-wider text-[#2563EB] font-semibold">
                        Services by {company.name}
                      </div>
                      <Link
                        to={company.route || company.path}
                        className="text-xs font-semibold text-[#64748B] hover:text-[#2563EB] transition-colors"
                      >
                        View Full Service Scope &rarr;
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {company.services.map((srv, sIdx) => (
                        <div 
                          key={srv.id || sIdx} 
                          className="p-4 sm:p-5 rounded-xl bg-[#FAFAFA] border border-[#E2E8F0] hover:border-slate-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-[#2563EB]">
                              0{sIdx + 1} &mdash;
                            </span>
                            <span className="text-sm font-bold text-[#111827] uppercase tracking-wide">
                              {srv.title}
                            </span>
                            {srv.tagline && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                                {srv.tagline}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-3">
                            {srv.description}
                          </p>
                          {srv.items && srv.items.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              {srv.items.map((item, itemIdx) => (
                                <span
                                  key={itemIdx}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium bg-white text-[#334155] border border-[#E2E8F0]"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
                                  <span>{item}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OTHER ECOSYSTEM DOMAINS                                                   */}
        {/* ========================================================================= */}
        <div className="pt-12 border-t border-[#E2E8F0]">
          <div className="mb-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block">
              Connected Architecture
            </span>
            <h3 className="text-xl font-bold text-[#111827] tracking-tight">
              Explore Other JMG Domains
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {otherDomains.map((od) => (
              <Link
                key={od.id}
                to={od.domainRoute}
                className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#94A3B8]">
                    {od.number}
                  </span>
                  <span 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: od.accent }}
                  />
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                  {od.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RELEVANT TECHNOLOGY CTA                                                   */}
        {/* ========================================================================= */}
        {domain.id === 'technology' && (
          <div className="mt-14 sm:mt-16 lg:mt-20 p-6 sm:p-8 lg:p-10 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="font-mono text-xs uppercase tracking-wider text-[#2563EB] font-semibold block mb-1">
                Technology Inquiries
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Architecting your next digital initiative?
              </h3>
              <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                Connect directly with our engineering division to discuss modern web platforms, enterprise systems, and intelligent digital workflows.
              </p>
            </div>
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0"
            >
              <span>Contact Engineering Team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
