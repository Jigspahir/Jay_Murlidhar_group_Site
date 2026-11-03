import React, { useState, useEffect } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Send,
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Layers
} from 'lucide-react';
import { 
  JMG_BUSINESS_DOMAINS, 
  OUR_BUSINESSES_HERO 
} from '../data/businessesData';
import { JMGDomainGlyph } from '../components/ecosystem/glyphs';

export default function Businesses() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;
  const location = useLocation();

  const [activeDomainFilter, setActiveDomainFilter] = useState('all');

  // Check URL hash for direct domain anchor (e.g., #domain-technology)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#domain-', '').replace('#', '');
      const matchedDomain = JMG_BUSINESS_DOMAINS.find(d => d.id === targetId);
      if (matchedDomain) {
        setActiveDomainFilter(matchedDomain.id);
        const el = document.getElementById(`domain-${matchedDomain.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location.hash]);

  const handleInquireService = (domain, service) => {
    if (onOpenContact) {
      onOpenContact({
        interest: domain.company.name,
        message: `Inquiry for ${service.name} under ${domain.name} domain (${domain.company.name})`
      });
    }
  };

  const handleScrollToDirectory = () => {
    const el = document.getElementById('businesses-directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedDomains = activeDomainFilter === 'all'
    ? JMG_BUSINESS_DOMAINS
    : JMG_BUSINESS_DOMAINS.filter(d => d.id === activeDomainFilter);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      
      {/* 1. Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Our Businesses</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] py-16 sm:py-20 lg:py-24">
        {/* Soft Background Accents */}
        <div 
          className="absolute -top-24 left-1/4 w-[640px] h-[480px] rounded-full bg-gradient-to-br from-blue-100/50 via-sky-50/40 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(#DBEAFE_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-4xl lg:max-w-5xl">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              {OUR_BUSINESSES_HERO.eyebrow}
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A] mb-6 max-w-3xl">
              {OUR_BUSINESSES_HERO.headline}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed font-normal mb-8 max-w-3xl">
              {OUR_BUSINESSES_HERO.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                type="button"
                onClick={handleScrollToDirectory}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Businesses &amp; Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenContact && onOpenContact({ interest: 'Jay Murlidhar Group', message: 'General business inquiry' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Inquire With Us</span>
              </button>
            </div>

            {/* Key Group Metrics */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
              {OUR_BUSINESSES_HERO.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#64748B] font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Six Business Domains Interactive Selector */}
      <section id="businesses-directory" className="py-8 bg-white border-b border-[#E2E8F0] sticky top-[57px] sm:top-[65px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            
            {/* All Domains Tab */}
            <button
              type="button"
              onClick={() => setActiveDomainFilter('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                activeDomainFilter === 'all'
                  ? 'bg-[#0F172A] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              <span>All 6 Domains</span>
            </button>

            {/* 6 Official Domains */}
            {JMG_BUSINESS_DOMAINS.map((domain) => {
              const isSelected = activeDomainFilter === domain.id;

              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setActiveDomainFilter(domain.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 flex-shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#2563EB] text-[#0F172A] shadow-md ring-2 ring-blue-100'
                      : 'bg-slate-50 border-slate-200/80 text-[#64748B] hover:text-[#0F172A] hover:bg-white'
                  }`}
                >
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: `${domain.accentColor}12`,
                      borderColor: `${domain.accentColor}30`,
                      color: domain.accentColor
                    }}
                    aria-hidden="true"
                  >
                    <JMGDomainGlyph domainId={domain.id} className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[#2563EB]">{domain.number}</span>
                  <span>{domain.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Companies & Verified Services Showcase */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {displayedDomains.map((domain) => (
            <div 
              key={domain.id} 
              id={`domain-${domain.id}`}
              className="scroll-mt-32 p-6 sm:p-8 lg:p-10 rounded-[24px] bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Domain Header & Operating Company */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-8 border-b border-slate-200">
                <div className="max-w-3xl">
                  {/* Domain Tag */}
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span 
                      className="font-mono text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-2"
                      style={{
                        backgroundColor: `${domain.accentColor}10`,
                        borderColor: `${domain.accentColor}30`,
                        color: domain.accentColor
                      }}
                    >
                      <JMGDomainGlyph domainId={domain.id} className="w-3.5 h-3.5" />
                      DOMAIN {domain.number} &bull; {domain.name.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8] uppercase">
                      {domain.categoryTitle}
                    </span>
                  </div>

                  {/* Company Name */}
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight mb-2">
                    {domain.company.name}
                  </h2>

                  {/* Legal Name & Badge */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-4">
                    <span className="font-semibold text-[#0F172A]">{domain.company.legalName}</span>
                    <span>&bull;</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-medium border border-blue-100">
                      {domain.company.badge}
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Est. {domain.company.established}
                    </span>
                  </div>

                  {/* Company Description */}
                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                    {domain.company.description}
                  </p>
                </div>

                {/* Company Action Button */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0">
                  <Link
                    to={domain.company.route}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-[#2563EB] text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                  >
                    <span>View Company Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => onOpenContact && onOpenContact({ interest: domain.company.name, message: `General inquiry for ${domain.company.name}` })}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-[#0F172A] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    <span>Inquire Company</span>
                    <Send className="w-3.5 h-3.5 text-[#2563EB]" />
                  </button>
                </div>
              </div>

              {/* Verified Services Section */}
              <div className="pt-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2563EB]" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                      Verified Services ({domain.services.length})
                    </h3>
                  </div>
                  <span className="text-xs text-[#64748B]">
                    Delivered directly by {domain.company.name}
                  </span>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {domain.services.map((service) => {
                    const ServiceIcon = service.icon;

                    return (
                      <div
                        key={service.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform duration-200 group-hover:scale-105"
                              style={{
                                backgroundColor: `${domain.accentColor}12`,
                                borderColor: `${domain.accentColor}30`,
                                color: domain.accentColor
                              }}
                            >
                              <ServiceIcon className="w-5 h-5" />
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                                {service.name}
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed mb-4">
                            {service.description}
                          </p>
                        </div>

                        <div>
                          {/* Tags */}
                          {service.tags && (
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 mb-4">
                              {service.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => handleInquireService(domain, service)}
                            className="w-full py-2.5 px-3 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[#0F172A] hover:text-[#2563EB] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>Inquire Service</span>
                            <Send className="w-3 h-3 text-[#2563EB]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 5. Final CTA Section */}
      <section className="bg-white border-t border-slate-200 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
            ONE GROUP &bull; ALL CAPABILITIES
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight mb-4">
            FIND THE RIGHT BUSINESS OR SERVICE.
          </h2>

          <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed mb-8">
            Need custom technology development, government citizen services, insurance coverage, corporate compliance, institutional travel, or retail electronics? Our dedicated specialist teams are ready to assist you.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenContact && onOpenContact({ interest: 'Jay Murlidhar Group', message: 'Group inquiry from Our Businesses directory' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <span>Connect With Our Group</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-[#0F172A] font-semibold text-sm transition-all"
            >
              <span>About Jay Murlidhar Group</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
