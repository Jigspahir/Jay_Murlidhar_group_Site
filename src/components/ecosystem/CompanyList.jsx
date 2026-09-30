import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function CompanyList({ 
  activeDomain, 
  companies, 
  hoveredCompanySlug, 
  onCompanyHover 
}) {
  return (
    <div className="w-full">
      {/* Active Domain Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to={activeDomain.domainRoute}
          className="flex items-center gap-3 group focus:outline-none"
          title={`View ${activeDomain.categoryTitle} Domain Page`}
        >
          <span 
            className="font-mono text-xs font-bold px-2.5 py-1 rounded text-white"
            style={{ backgroundColor: activeDomain.accent }}
          >
            DOMAIN {activeDomain.number}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#38BDF8] transition-colors flex items-center gap-2">
            <span>{activeDomain.categoryTitle}</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </h3>
        </Link>
        <Link
          to={activeDomain.domainRoute}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          {companies.length} Operating Entities &rarr;
        </Link>
      </div>

      <p className="text-sm text-slate-400 mb-8 max-w-xl leading-relaxed">
        {activeDomain.description}
      </p>

      {/* Large Typography Company Rows (82px+ height, NO CARDS) */}
      <div 
        className="border-y border-slate-800 divide-y divide-slate-800"
        role="list"
        aria-label={`${activeDomain.name} companies`}
      >
        {companies.map((company, index) => {
          const isHovered = company.slug === hoveredCompanySlug;
          const formattedNumber = String(index + 1).padStart(2, '0');

          return (
            <Link
              key={company.id}
              to={company.route || company.path}
              role="listitem"
              onMouseEnter={() => onCompanyHover(company.slug)}
              onFocus={() => onCompanyHover(company.slug)}
              tabIndex={0}
              className={`min-h-[82px] py-5 px-4 cursor-pointer transition-all duration-200 flex items-center justify-between group focus:outline-none focus:bg-[#0B1424] ${
                isHovered ? 'bg-[#0B1424]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-5 sm:gap-7">
                <span 
                  className="font-mono text-sm sm:text-base font-bold transition-colors"
                  style={{ color: isHovered ? activeDomain.accent : '#64748B' }}
                >
                  {formattedNumber}
                </span>

                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-white tracking-tight">
                    {company.name}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium block mt-0.5">
                    {company.subtitle}
                  </span>
                </div>
              </div>

              <div
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all focus:outline-none"
                style={{
                  color: isHovered ? activeDomain.accent : '#94A3B8',
                  backgroundColor: isHovered ? `${activeDomain.accent}15` : 'transparent'
                }}
                aria-label={`Explore ${company.name} page`}
              >
                <span className="hidden sm:inline">Explore &rarr;</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 sm:hidden" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Link to Dedicated Ecosystem Page */}
      <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
        <span>All 10 companies operate under unified JMG governance</span>
        <Link 
          to="/ecosystem" 
          className="text-[#38BDF8] hover:underline flex items-center gap-1 font-semibold focus:outline-none focus:ring-1 focus:ring-[#38BDF8]"
        >
          <span>View Full Architecture Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
