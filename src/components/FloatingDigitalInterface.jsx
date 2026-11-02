import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JMG_CATEGORIES, JMG_COMPANIES } from '../data/jmgEcosystem';

export default function FloatingDigitalInterface({ onCategoryHover }) {
  const [selectedCompany, setSelectedCompany] = useState(
    JMG_COMPANIES.find((c) => c.id === 'jay-murlidhar-tech-solutions') || JMG_COMPANIES[0]
  );

  const getCompanyById = (id) => JMG_COMPANIES.find((c) => c.id === id);

  const handleCompanyHover = (company) => {
    setSelectedCompany(company);
    if (onCategoryHover) {
      onCategoryHover(company.categoryId);
    }
  };

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none">
      
      {/* Subtle Ambient Back Glow under the panel */}
      <div 
        className="absolute -inset-1 rounded-[24px] blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: selectedCompany.accentColor }}
      />

      {/* Main Glass Digital Panel */}
      <div className="relative rounded-[20px] bg-[#0A1628]/85 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.55)] text-white overflow-hidden transition-all duration-300">
        
        {/* Subtle Light-Catch Specular Sheen across Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-wider text-white">
                JAY MURLIDHAR GROUP
              </span>
              <span className="text-white/40">&bull;</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#38BDF8] font-semibold">
                GROUP COMPANIES
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Centralized Operating System &bull; 10 Entities
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE SYNC</span>
          </div>
        </div>

        {/* Two-Column Internal Composition: Left Directory List + Right Active Business Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Numbered Category Verticals & Companies (7 cols) */}
          <div className="md:col-span-7 space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scroll">
            {JMG_CATEGORIES.map((cat) => {
              const categoryCompanies = cat.companyIds
                .map((id) => getCompanyById(id))
                .filter(Boolean);

              const isCatActive = selectedCompany.categoryId === cat.id;

              return (
                <div key={cat.id} className="space-y-1.5">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 font-mono text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-0.5">
                    <span style={{ color: cat.accent }}>{cat.number}</span>
                    <span>&mdash;</span>
                    <span className={isCatActive ? 'text-white' : 'text-slate-400'}>
                      {cat.name}
                    </span>
                  </div>

                  {/* Company Rows */}
                  <div className="space-y-0.5">
                    {categoryCompanies.map((comp) => {
                      const isSelected = selectedCompany.id === comp.id;

                      return (
                        <div
                          key={comp.id}
                          onMouseEnter={() => handleCompanyHover(comp)}
                          onClick={() => handleCompanyHover(comp)}
                          className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                            isSelected
                              ? 'bg-white/15 text-white pl-3.5 shadow-sm'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                          style={{
                            borderLeft: isSelected ? `3px solid ${comp.accentColor}` : '3px solid transparent'
                          }}
                        >
                          <div className="flex-1 pr-2 truncate">
                            <span className="text-xs font-semibold block truncate">
                              {comp.name}
                            </span>
                          </div>

                          <span 
                            className={`text-xs font-mono transition-transform duration-200 ${
                              isSelected ? 'translate-x-0.5 text-white' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                          >
                            &rarr;
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Active Business Hologram/Preview Card (5 cols) */}
          <div className="md:col-span-5 bg-white/5 rounded-[14px] border border-white/10 p-4 flex flex-col justify-between h-full min-h-[330px]">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#38BDF8]">
                  {selectedCompany.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedCompany.number}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                {selectedCompany.name}
              </h4>

              <p className="text-[11px] text-slate-300 leading-relaxed font-normal mb-3 line-clamp-3">
                {selectedCompany.shortDescription}
              </p>

              {/* Core Capabilities Preview */}
              <div className="space-y-1.5 pt-3 border-t border-white/10 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Core Focus
                </span>
                {selectedCompany.services.slice(0, 3).map((serv, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-200 leading-tight">
                    <span style={{ color: selectedCompany.accentColor }}>&bull;</span>
                    <span className="truncate">{serv.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Action Link to Company Dedicated Page */}
            <div className="pt-3 border-t border-white/10">
              <Link
                to={selectedCompany.path}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
                style={{
                  backgroundColor: selectedCompany.accentColor,
                  color: '#ffffff'
                }}
              >
                <span>Explore {selectedCompany.name.replace('Jay Murlidhar ', '')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* Panel Footer Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Interaction Mode: Real-Time Preview</span>
          <Link to="/ecosystem" className="text-[#38BDF8] hover:underline flex items-center gap-0.5">
            <span>Explore All 10 Entities</span>
            <span>&rarr;</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
