import React, { useEffect } from 'react';
import { useParams, Link, useLocation, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { JMG_COMPANIES, getCompanyBySlug } from '../data/jmgEcosystem';
import { resolveRedirect } from '../data/jmgRedirects';
import { useCanonical } from '../utils/seo';
import NotFoundPage from './NotFoundPage';

export default function CompanyDetailPage({ companySlug, onOpenContact }) {
  const { domain, slug } = useParams();
  const location = useLocation();

  // Determine target slug: companySlug prop, or :slug param, or :domain param
  const targetSlug = companySlug || slug || domain;

  // Find company by slug
  const company = getCompanyBySlug(targetSlug);

  // Set canonical link for SEO
  useCanonical(company?.route);

  // Scroll to top whenever slug or domain changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [targetSlug, domain]);

  // 1. Check centralized redirect rule for this path first (preserves query params)
  const redirectInfo = resolveRedirect(location.pathname);
  if (redirectInfo) {
    return <Navigate to={`${redirectInfo.target}${location.search}`} replace />;
  }

  // If company not found, or if domain was provided in path and does NOT match company domain
  // e.g. /technology/jay-murlidhar-business-services redirects; an unknown company shows 404.
  const isInvalidDomainMatch = domain && slug && (
    domain !== company?.domain && 
    `/${domain}` !== company?.domainRoute
  );

  if (!company || isInvalidDomainMatch) {
    return <NotFoundPage domainHint={domain} />;
  }

  // Look up related companies
  const relatedCompanies = company.relatedSlugs
    ?.map((s) => getCompanyBySlug(s) || JMG_COMPANIES.find((c) => c.slug === s))
    .filter(Boolean) || [];

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#FAFAFA]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* BREADCRUMB                                                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#111827] transition-colors">JMG</Link>
          <span>/</span>
          <Link to="/ecosystem" className="hover:text-[#111827] transition-colors">Our Companies</Link>
          <span>/</span>
          <Link 
            to={company.domainRoute || `/${company.domain}`} 
            className="hover:text-[#111827] transition-colors"
          >
            {company.domainName || company.category}
          </Link>
          <span>/</span>
          <Link 
            to={company.route || company.path} 
            className="text-[#2563EB] font-semibold hover:underline"
          >
            {company.name}
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* 1. COMPANY HEADER                                                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20 lg:mb-28">
          
          {/* Left Details */}
          <div className="lg:col-span-7">
            {/* Authentic Company Logo */}
            {company.logo && (
              <div className="mb-6 inline-flex items-center p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm max-w-[220px] max-h-16">
                <img
                  src={company.logo}
                  alt={`${company.name} Logo`}
                  className="max-h-12 w-auto object-contain"
                />
              </div>
            )}

            {/* Parent Brand Badge */}
            <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">A JAY MURLIDHAR GROUP COMPANY</span>
              <span className="text-[#94A3B8]">&bull;</span>
              <span className="text-[#1E293B]">{company.category}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-4 break-words">
              {company.name}
            </h1>

            <div className="text-lg sm:text-xl font-semibold text-[#1E293B] mb-6">
              {company.subtitle}
            </div>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal mb-8 max-w-2xl">
              {company.shortDescription || company.description}
            </p>

            {/* Key Metrics */}
            {company.stats && (
              <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
                {company.stats.map((st, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-[10px] border border-[#E2E8F0] shadow-sm">
                    <div className="text-[10px] font-mono uppercase text-[#94A3B8]">{st.label}</div>
                    <div className="text-base sm:text-lg font-bold text-[#111827] mt-0.5">{st.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-colors duration-200"
              >
                <span>Inquire with {company.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to={company.domainRoute || '/ecosystem'}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[10px] bg-white border border-[#E2E8F0] hover:border-[#111827] text-[#111827] text-xs sm:text-sm font-semibold transition-colors duration-200"
              >
                <span>Explore {company.domainName || 'Domain'}</span>
              </Link>
            </div>
          </div>

          {/* Right Image Visual */}
          <div className="lg:col-span-5">
            <div className="rounded-[16px] overflow-hidden bg-slate-900 border border-[#E2E8F0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] aspect-[4/3] relative">
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-full object-cover object-center"
              />
              {company.id !== 'jay-murlidhar-insurance' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="font-mono text-xs uppercase tracking-wider text-blue-300 block mb-1">
                      Operating Division
                    </span>
                    <div className="text-xl font-bold">{company.name}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ABOUT THIS BUSINESS                                                    */}
        {/* ========================================================================= */}
        <div className="mb-20 lg:mb-28 pt-12 border-t border-[#E2E8F0]">
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] block mb-3">
              ABOUT THE BUSINESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-6">
              Strategic Role in Jay Murlidhar Group
            </h2>
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
              {company.about}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. CORE SERVICES (STRUCTURED EDITORIAL LISTS)                             */}
        {/* ========================================================================= */}
        {company.services && (
          <div className="mb-20 lg:mb-28 space-y-12">
            <div className="max-w-3xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] block mb-3">
                SERVICES &amp; CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] tracking-tight mb-4">
                Services
              </h2>
              <p className="text-base text-[#64748B]">
                Comprehensive service offerings managed directly by {company.name} with dedicated execution, transparent turnaround, and complete lifecycle support.
              </p>
            </div>

            {company.services[0]?.items ? (
              <div className="space-y-10">
                {company.services.map((categoryGroup, catIdx) => {
                  const isAcademy = categoryGroup.id === 'academy-services' || categoryGroup.title?.toLowerCase().includes('academy');

                  return (
                    <div 
                      key={categoryGroup.id || catIdx}
                      className={`rounded-[18px] border transition-all ${
                        isAcademy 
                          ? 'bg-[#0B1528] text-white border-slate-800 p-6 sm:p-10 shadow-lg' 
                          : 'bg-white border-[#E2E8F0] shadow-sm p-6 sm:p-8'
                      }`}
                    >
                      {/* Category Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-6 border-b border-inherit/20">
                        <div>
                          {isAcademy ? (
                            <>
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold mb-3">
                                <span>{categoryGroup.tagline || 'Learn. Build. Grow.'}</span>
                              </div>
                              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
                                {categoryGroup.title}
                              </h3>
                            </>
                          ) : (
                            <>
                              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block mb-1">
                                {categoryGroup.subtitle || `Category ${String(catIdx + 1).padStart(2, '0')}`}
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight uppercase">
                                {categoryGroup.title}
                              </h3>
                            </>
                          )}
                          <p className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed ${isAcademy ? 'text-slate-300' : 'text-[#64748B]'}`}>
                            {categoryGroup.description}
                          </p>
                        </div>

                        <button
                          onClick={onOpenContact}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 self-start sm:self-center ${
                            isAcademy 
                              ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                              : 'bg-[#111827] hover:bg-[#2563EB] text-white'
                          }`}
                        >
                          <span>Inquire with {categoryGroup.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Interactive Numbered Service Rows */}
                      {categoryGroup.items && categoryGroup.items.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryGroup.items.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              onClick={onOpenContact}
                              className={`p-4 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                                isAcademy
                                  ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 hover:border-blue-500/50 text-slate-200 hover:text-white'
                                  : 'bg-[#FAFAFA] hover:bg-white border-[#E2E8F0] hover:border-[#2563EB]/40 hover:shadow-sm text-[#1E293B] hover:text-[#2563EB]'
                              }`}
                            >
                              <div className="flex items-center gap-3.5">
                                <span className="font-mono text-xs font-bold text-[#2563EB] tracking-wider w-6">
                                  {String(itemIdx + 1).padStart(2, '0')}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold tracking-tight">
                                  {item}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[18px] bg-white border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.services.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      onClick={onOpenContact}
                      className="p-5 rounded-xl border border-[#E2E8F0] bg-[#FAFAFA] hover:bg-white hover:border-[#2563EB]/40 hover:shadow-sm transition-all duration-150 cursor-pointer group flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-mono text-xs font-bold text-[#2563EB] tracking-wider">
                            {String(itemIdx + 1).padStart(2, '0')}
                          </span>
                          <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                            {item.title}
                          </h4>
                        </div>
                        {item.description && (
                          <p className="text-xs text-[#64748B] leading-relaxed pl-7">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] transition-transform group-hover:translate-x-1 flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. WHY CHOOSE THIS BUSINESS                                               */}
        {/* ========================================================================= */}
        {company.whyThisBusiness && (
          <div className="mb-20 lg:mb-28 p-8 sm:p-12 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm">
            <div className="max-w-2xl mb-8">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] block mb-3">
                THE ADVANTAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                Why Choose {company.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.whyThisBusiness.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAFA] border border-[#E2E8F0]">
                  <CheckCircle2 className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. RELATED JMG BUSINESSES                                                 */}
        {/* ========================================================================= */}
        {relatedCompanies.length > 0 && (
          <div className="mb-20 lg:mb-28">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2E8F0]">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block">
                  Connected Businesses
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#111827]">
                  Related Entities in Jay Murlidhar Group
                </h3>
              </div>
              <Link to="/ecosystem" className="text-xs font-semibold text-[#2563EB] hover:underline">
                View All Companies &rarr;
              </Link>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[12px] border overflow-hidden">
              {relatedCompanies.map((rel) => (
                <Link
                  key={rel.id || rel.slug}
                  to={rel.route || rel.path}
                  className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                        {rel.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#94A3B8]">&bull; {rel.category}</span>
                    </div>
                    <span className="text-xs text-[#64748B] block mt-0.5">
                      {rel.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CONTACT / CTA FOR THIS BUSINESS                                        */}
        {/* ========================================================================= */}
        <div className="pt-16 border-t border-[#E2E8F0]">
          <div className="p-8 sm:p-12 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] block mb-3">
                DIRECT CONSULTATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
                Connect with {company.name}
              </h3>
              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-8 font-normal">
                Looking for solutions or partnerships with {company.name}? Our specialized operational team is available to assist you.
              </p>
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-colors duration-200"
              >
                <span>Start Direct Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
