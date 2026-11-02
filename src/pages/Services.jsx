import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Send,
  Building2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { 
  SERVICES_PAGE_HERO, 
  HOW_WE_HELP_STEPS, 
  JMG_SERVICE_DOMAINS 
} from '../data/servicesPageData';
import FinalCTA from '../components/FinalCTA';

export default function Services() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  const [activeDomainId, setActiveDomainId] = useState('technology');

  // Currently selected domain
  const activeDomain = JMG_SERVICE_DOMAINS.find(d => d.id === activeDomainId) || JMG_SERVICE_DOMAINS[0];

  const handleInquireService = (service) => {
    if (onOpenContact) {
      onOpenContact({
        interest: activeDomain.operatingCompany,
        message: `Inquiry for ${service.name} (${activeDomain.name} domain)`
      });
    }
  };

  const handleScrollToExplorer = () => {
    const el = document.getElementById('services-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* 1. Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Our Services</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Section (Editorial Style) */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] py-16 sm:py-20 lg:py-24">
        {/* Soft Background Radial Gradient & Dotted Texture */}
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
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              {SERVICES_PAGE_HERO.label}
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-[#0F172A] mb-6 max-w-3xl">
              SERVICES THAT MOVE<br />YOU FORWARD.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed font-normal mb-8 max-w-3xl">
              {SERVICES_PAGE_HERO.description}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <button
                onClick={handleScrollToExplorer}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenContact && onOpenContact({ interest: 'Jay Murlidhar Tech Solutions', message: 'General services inquiry' })}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Contact Us</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-slate-200/80 max-w-3xl lg:max-w-4xl">
              {SERVICES_PAGE_HERO.stats.map((stat, i) => (
                <div key={i} className="border-l-2 border-blue-600 pl-4">
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono uppercase font-bold text-slate-500 mt-1 tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Six-Domain Interactive Explorer */}
      <section 
        id="services-explorer" 
        className="py-16 sm:py-20 lg:py-24 bg-[#FAFAFA] border-b border-[#E2E8F0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
              <span>01 —</span>
              <span>COMPLETE SERVICE DIRECTORY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
              EXPLORE SERVICES BY DOMAIN.
            </h2>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              Select any of our six operating business verticals to explore specialized capabilities, technical standards and certified support.
            </p>
          </div>

          {/* Six Domains Navigation Bar */}
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
              {JMG_SERVICE_DOMAINS.map((domain) => {
                const isSelected = activeDomainId === domain.id;
                const DomainIcon = domain.domainIcon;

                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomainId(domain.id)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {domain.number}
                    </span>
                    <DomainIcon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    <span>{domain.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Domain Overview Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                  Domain {activeDomain.number} • {activeDomain.categoryTitle}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {activeDomain.operatingCompany}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                {activeDomain.name} Solutions &amp; Capabilities
              </h3>

              <p className="text-sm sm:text-base text-[#475569] max-w-2xl leading-relaxed">
                {activeDomain.tagline}
              </p>
            </div>

            <div className="flex-shrink-0">
              <Link
                to={activeDomain.companyRoute}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Company Overview</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Services Grid for Active Domain */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDomain.services.map((service) => {
              const ServiceIcon = service.icon;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon and Category Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <ServiceIcon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {activeDomain.shortName}
                      </span>
                    </div>

                    {/* Service Name */}
                    <h4 className="text-lg font-bold text-[#0F172A] tracking-tight mb-2 group-hover:text-[#2563EB] transition-colors">
                      {service.name}
                    </h4>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Capability Tags */}
                    {service.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {service.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action: Inquiry Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleInquireService(service)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-[#2563EB] text-white text-xs font-semibold transition-all shadow-sm group/btn"
                    >
                      <span>Inquire Service</span>
                      <Send className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    <Link
                      to={activeDomain.domainRoute}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      Domain Info
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. How We Help Section (Three Steps) */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB]">
              <span>02 —</span>
              <span>STRUCTURED ENGAGEMENT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
              THREE SIMPLE STEPS TO GET STARTED.
            </h2>

            <p className="text-base sm:text-lg text-[#475569] leading-relaxed">
              How we streamline onboarding, consultation, and delivery across every operating domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_WE_HELP_STEPS.map((step) => (
              <div 
                key={step.number}
                className="relative bg-[#F8FAFC] border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center gap-2 text-xs font-mono font-semibold text-[#2563EB]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Phase {step.label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Final CTA */}
      <FinalCTA 
        onOpenContact={() => onOpenContact && onOpenContact({ interest: activeDomain.operatingCompany, message: 'Inquiry regarding JMG services' })}
        sectionNumber="03"
        eyebrow="SERVICE INQUIRY & CONSULTATION"
        headline="FIND THE RIGHT SERVICE FOR YOUR NEEDS."
        description="Our specialized teams across all six business domains are ready to assist you. Submit an inquiry or consult our leadership directly."
        buttonText="Send Service Inquiry"
      />
    </div>
  );
}
