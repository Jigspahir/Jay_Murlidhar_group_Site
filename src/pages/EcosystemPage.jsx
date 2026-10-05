import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, ChevronRight, Layers } from 'lucide-react';
import { JMG_CATEGORIES, JMG_COMPANIES, getCompanyById } from '../data/jmgEcosystem';
import JmgEcosystemExplorer from '../components/JmgEcosystemExplorer';

export default function EcosystemPage({ onOpenContact }) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [hoveredCompany, setHoveredCompany] = useState(JMG_COMPANIES[0]);

  const filteredCategories = activeCategoryFilter === 'all'
    ? JMG_CATEGORIES
    : JMG_CATEGORIES.filter((c) => c.id === activeCategoryFilter);

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#FAFAFA]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* BREADCRUMB                                                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] mb-8">
          <Link to="/" className="hover:text-[#111827] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-semibold">Ecosystem</span>
        </div>

        {/* ========================================================================= */}
        {/* HEADER SECTION                                                            */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mb-14 lg:mb-18">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#2563EB]">PARENT ARCHITECTURE</span>
            <span className="text-[#94A3B8]">&bull;</span>
            <span className="text-[#1E293B]">6 SPECIALIZED ENTITIES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[64px] font-bold text-[#111827] tracking-[-0.035em] leading-[1.05] mb-6 break-words">
            THE JAY MURLIDHAR GROUP<br />
            ECOSYSTEM.
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-3xl">
            One group connecting multiple businesses, services and opportunities. Explore our operating companies spanning technology, jan suvidha, insurance, business services, travel, and retail.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* HIERARCHICAL ARCHITECTURE STATEMENT BAR                                   */}
        {/* ========================================================================= */}
        <div className="mb-14 p-6 sm:p-8 rounded-[16px] bg-white border border-[#E2E8F0] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold text-lg">
                JMG
              </div>
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block">
                  Parent Holding Brand
                </span>
                <span className="text-base sm:text-lg font-bold text-[#111827]">
                  Jay Murlidhar Group
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-[#64748B]">
              <span className="px-3 py-1.5 rounded-md bg-[#FAFAFA] border border-[#E2E8F0] text-[#111827]">Technology</span>
              <span>&bull;</span>
              <span className="px-3 py-1.5 rounded-md bg-[#FAFAFA] border border-[#E2E8F0] text-[#111827]">Jan Suvidha</span>
              <span>&bull;</span>
              <span className="px-3 py-1.5 rounded-md bg-[#FAFAFA] border border-[#E2E8F0] text-[#111827]">Insurance</span>
              <span>&bull;</span>
              <span className="px-3 py-1.5 rounded-md bg-[#FAFAFA] border border-[#E2E8F0] text-[#111827]">Business Services</span>
              <span>&bull;</span>
              <span className="px-3 py-1.5 rounded-md bg-[#FAFAFA] border border-[#E2E8F0] text-[#111827]">Travel &amp; Retail</span>
            </div>

            <div className="text-xs font-mono text-[#94A3B8]">
              Governance: Unified Standards &bull; Multi-Industry Scope
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Interactive Ecosystem Explorer */}
      <div className="mb-16">
        <JmgEcosystemExplorer />
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================= */}
        {/* CATEGORY FILTER PILLS                                                     */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 text-xs font-mono">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeCategoryFilter === 'all'
                ? 'bg-[#111827] text-white shadow-sm'
                : 'bg-white text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
            }`}
          >
            All Domains (6)
          </button>
          {JMG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
              }`}
            >
              {cat.number} &bull; {cat.name} ({cat.companyIds.length})
            </button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* MASTER INTERACTIVE EDITORIAL LAYOUT (NO CARD GRIDS)                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Grouped Numbered Category Rows */}
          <div className="lg:col-span-7 space-y-14">
            {filteredCategories.map((cat) => {
              const companies = cat.companyIds
                .map((id) => getCompanyById(id))
                .filter(Boolean);

              return (
                <div key={cat.id} className="space-y-4">
                  {/* Category Title Header */}
                  <div className="pb-3 border-b border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold">
                      <span className="text-[#2563EB]">{cat.number}</span>
                      <span className="text-[#94A3B8]">&mdash;</span>
                      <span className="text-[#111827] uppercase tracking-wider">{cat.name}</span>
                    </div>
                    <span className="text-xs text-[#94A3B8] font-mono">
                      {companies.length} Operating Entities
                    </span>
                  </div>

                  {/* 84-100px Interactive Company Rows */}
                  <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[12px] border overflow-hidden">
                    {companies.map((company) => {
                      const isHovered = hoveredCompany?.id === company.id;

                      return (
                        <div
                          key={company.id}
                          onMouseEnter={() => setHoveredCompany(company)}
                          className={`p-5 sm:p-6 transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                            isHovered ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'
                          }`}
                        >
                          <Link to={company.route || company.path} className="flex-1 pr-4">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono text-xs text-[#2563EB] font-semibold">
                                {company.number}
                              </span>
                              <h3 className="text-lg sm:text-xl font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors">
                                {company.name}
                              </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-[#64748B] font-normal line-clamp-1">
                              {company.subtitle} &bull; {company.tagline}
                            </p>
                          </Link>

                          <Link
                            to={company.route || company.path}
                            className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:border-[#2563EB] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all flex-shrink-0"
                            aria-label={`Open ${company.name} page`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Live Company Preview Area */}
          <div className="lg:col-span-5 sticky top-28">
            {hoveredCompany && (
              <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                
                {/* Visual Header */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-900 border-b border-[#E2E8F0]">
                  <img
                    src={hoveredCompany.image}
                    alt={hoveredCompany.name}
                    className="w-full h-full object-cover object-center transition-opacity duration-300"
                  />
                  {hoveredCompany.id !== 'jay-murlidhar-insurance' ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white text-[#111827] shadow-sm">
                          {hoveredCompany.number} &bull; {hoveredCompany.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="font-mono text-xs text-blue-200 block mb-0.5">
                          {hoveredCompany.subtitle}
                        </span>
                        <h4 className="text-xl font-bold">
                          {hoveredCompany.name}
                        </h4>
                      </div>
                    </>
                  ) : (
                    <div className="absolute top-4 left-4">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white text-[#111827] shadow-sm">
                        {hoveredCompany.number} &bull; {hoveredCompany.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#2563EB] block mb-2">
                      About Entity
                    </span>
                    <p className="text-sm text-[#64748B] leading-relaxed font-normal">
                      {hoveredCompany.about}
                    </p>
                  </div>

                  {/* Core Services Preview */}
                  <div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111827] block mb-2.5">
                      Key Capabilities &amp; Services
                    </span>
                    <div className="space-y-2">
                      {hoveredCompany.services.slice(0, 3).map((serv, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2 text-xs text-[#1E293B]">
                          <span className="text-[#2563EB] font-bold">&bull;</span>
                          <span className="font-medium">{serv.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E2E8F0]">
                    {hoveredCompany.stats.map((st, idx) => (
                      <div key={idx} className="bg-[#FAFAFA] p-2.5 rounded-lg border border-[#E2E8F0]">
                        <div className="text-[10px] font-mono text-[#94A3B8] uppercase">{st.label}</div>
                        <div className="text-xs sm:text-sm font-bold text-[#111827] mt-0.5">{st.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link to Dedicated Page */}
                  <div className="pt-2">
                    <Link
                      to={hoveredCompany.route || hoveredCompany.path}
                      className="w-full py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      <span>Open Dedicated {hoveredCompany.name} Page</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </div>
            )}
          </div>

        </div>

        
        {/* COLLABORATION INQUIRY CTA AT BOTTOM */}
        
        <div className="mt-24 pt-16 border-t border-[#E2E8F0]">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] block mb-3">
              Institutional &amp; Commercial Partnerships
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              Need Multi-Vertical Collaboration?
            </h3>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6 font-normal">
              Jay Murlidhar Group can assemble cross-disciplinary teams spanning digital software, hardware provisioning, insurance, and business services for turnkey projects.
            </p>
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <span>Connect with Parent Leadership</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
