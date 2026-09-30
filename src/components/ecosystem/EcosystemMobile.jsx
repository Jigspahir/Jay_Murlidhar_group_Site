import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, Cpu } from 'lucide-react';
import { JMG_DOMAINS, JMG_COMPANIES } from '../../data/jmgEcosystem';

export default function EcosystemMobile() {
  const [expandedDomainId, setExpandedDomainId] = useState('technology');

  const toggleDomain = (domainId) => {
    setExpandedDomainId(expandedDomainId === domainId ? null : domainId);
  };

  return (
    <div className="w-full lg:hidden space-y-6">
      
      {/* Mobile Branding Core Header */}
      <div className="p-4 rounded-xl bg-[#09111E] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-xs font-bold uppercase text-white tracking-wide">
            JAY MURLIDHAR GROUP
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          10 VENTURES
        </span>
      </div>

      {/* Accordion List of Domains (Section 19) */}
      <div className="divide-y divide-slate-800 border-y border-slate-800">
        {JMG_DOMAINS.map((domain) => {
          const isExpanded = expandedDomainId === domain.id;
          const companies = domain.companySlugs
            .map(slug => JMG_COMPANIES.find(c => c.slug === slug))
            .filter(Boolean);

          return (
            <div key={domain.id} className="py-2">
              
              {/* Domain Trigger Row */}
              <button
                onClick={() => toggleDomain(domain.id)}
                className={`w-full py-3.5 px-3 flex items-center justify-between text-left rounded-lg transition-colors ${
                  isExpanded ? 'bg-[#0B1424]' : 'hover:bg-white/5'
                }`}
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: domain.accent }}
                  >
                    {domain.number}
                  </span>
                  <span className="text-sm font-bold text-white uppercase tracking-tight">
                    {domain.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {companies.length}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-white' : ''
                    }`} 
                  />
                </div>
              </button>

              {/* Expanded Companies Panel */}
              {isExpanded && (
                <div className="mt-2 mb-3 pl-3 pr-2 space-y-2.5">
                  <p className="text-xs text-slate-400 font-normal leading-relaxed mb-3">
                    {domain.description}
                  </p>

                  <div className="space-y-2">
                    {companies.map((comp) => (
                      <Link
                        key={comp.id}
                        to={comp.route || comp.path}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#070E1A] border border-slate-800 hover:border-slate-700 transition-colors group"
                      >
                        <div className="flex flex-col pr-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                            {comp.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {comp.subtitle}
                          </span>
                        </div>
                        <ArrowRight 
                          className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-1" 
                          style={{ color: domain.accent }}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
