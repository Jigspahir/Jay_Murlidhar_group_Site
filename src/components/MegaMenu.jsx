import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Send,
  Layers
} from 'lucide-react';
import { JMG_BUSINESS_DOMAINS } from '../data/businessesData';
import { JMGDomainGlyph } from './ecosystem/glyphs';

export default function MegaMenu({ isOpen, onClose, onOpenContact }) {
  const [selectedDomainId, setSelectedDomainId] = useState(JMG_BUSINESS_DOMAINS[0].id);

  if (!isOpen) return null;

  const currentDomain = JMG_BUSINESS_DOMAINS.find(d => d.id === selectedDomainId) || JMG_BUSINESS_DOMAINS[0];

  const handleServiceInquiry = (service) => {
    if (onClose) onClose();
    if (onOpenContact) {
      onOpenContact({
        interest: currentDomain.company.name,
        message: `Inquiry regarding ${service.name} (${currentDomain.name} domain)`
      });
    }
  };

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 w-[980px] max-w-[calc(100vw-32px)] pt-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
      onMouseLeave={onClose}
    >
      <div className="bg-white border border-[#E2E8F0] rounded-[20px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] overflow-hidden text-[#0F172A]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              OUR BUSINESSES
            </span>
            <span className="text-xs text-[#64748B] hidden sm:inline">
              Six Official Business Domains &bull; Operating Companies &bull; Verified Services
            </span>
          </div>

          <Link
            to="/businesses"
            onClick={onClose}
            className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 inline-flex items-center gap-1 group"
          >
            <span>View All Businesses Directory</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] min-h-[460px]">
          
          {/* LEFT PANEL: 6 Domains Selector (Width: 4 cols) */}
          <div className="col-span-12 md:col-span-4 p-3 bg-[#F8FAFC]/60 space-y-1.5 overflow-y-auto max-h-[520px]">
            <div className="px-3 py-1.5 font-mono text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Select Business Domain
            </div>

            {JMG_BUSINESS_DOMAINS.map((domain) => {
              const isSelected = domain.id === selectedDomainId;

              return (
                <button
                  key={domain.id}
                  type="button"
                  onMouseEnter={() => setSelectedDomainId(domain.id)}
                  onClick={() => setSelectedDomainId(domain.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-[0_2px_10px_rgba(37,99,235,0.08)] border border-blue-200 text-[#0F172A]'
                      : 'hover:bg-white/80 border border-transparent text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all ${
                        isSelected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'
                      }`}
                      style={{
                        backgroundColor: `${domain.accentColor}12`,
                        color: domain.accentColor
                      }}
                      aria-hidden="true"
                    >
                      <JMGDomainGlyph domainId={domain.id} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-[#2563EB]">
                          {domain.number}
                        </span>
                        <span className="text-xs font-bold text-[#0F172A] truncate">
                          {domain.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] block truncate font-medium">
                        {domain.company.name}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${
                    isSelected 
                      ? 'text-[#2563EB] translate-x-0.5 opacity-100' 
                      : 'text-slate-300 opacity-0 group-hover:opacity-100'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL: Operating Company & Verified Services (Width: 8 cols) */}
          <div className="col-span-12 md:col-span-8 p-6 flex flex-col justify-between overflow-y-auto max-h-[520px]">
            <div className="space-y-5">
              
              {/* Domain & Operating Company Header Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#2563EB]">
                      DOMAIN {currentDomain.number}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="font-mono text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                      {currentDomain.categoryTitle}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Est. {currentDomain.company.established}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <h4 className="text-base font-bold text-[#0F172A]">
                      {currentDomain.company.name}
                    </h4>
                    <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                      {currentDomain.company.description}
                    </p>
                  </div>

                  <Link
                    to={currentDomain.company.route}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] shadow-sm flex-shrink-0 transition-colors"
                  >
                    <span>Company Detail</span>
                    <ExternalLink className="w-3 h-3 text-[#2563EB]" />
                  </Link>
                </div>
              </div>

              {/* Verified Services Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                    Verified Services ({currentDomain.services.length})
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B]">
                  Click inquire to submit direct CRM requirement
                </span>
              </div>

              {/* Services Grid (2 Columns, Complete Details without truncation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentDomain.services.map((service) => {
                  const ServiceIcon = service.icon;

                  return (
                    <div
                      key={service.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start gap-2.5 mb-1.5">
                          <div 
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100 mt-0.5"
                            style={{
                              backgroundColor: `${currentDomain.accentColor}10`,
                              color: currentDomain.accentColor
                            }}
                          >
                            <ServiceIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                              {service.name}
                            </h5>
                          </div>
                        </div>

                        <p className="text-[11px] text-[#475569] leading-relaxed mb-2 font-normal">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                        <div className="flex flex-wrap gap-1">
                          {service.tags && service.tags[0] && (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {service.tags[0]}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleServiceInquiry(service)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <span>Inquire</span>
                          <Send className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Bar inside Right Panel */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-[#64748B]">
              <span className="font-mono text-[11px]">
                Domain {currentDomain.number} &bull; {currentDomain.name} &bull; {currentDomain.company.name}
              </span>
              <Link
                to={`/businesses#domain-${currentDomain.id}`}
                onClick={onClose}
                className="font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Domain Specifications</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
