import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { JMG_COMPANIES } from '../../data/jmgEcosystem';

export default function WorkingDivisionsSection() {
  return (
    <section id="divisions" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>JMG OPERATING DIVISIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-4">
            Different Expertise. <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">One Shared Direction.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Our multi-disciplinary strength lies in specialized companies working together under unified leadership. Learn about the working environments across our operating divisions.
          </p>
        </div>

        {/* 6 Operating Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {JMG_COMPANIES.map((company, index) => {
            const accent = company.accentColor || '#2563EB';

            return (
              <div
                key={company.id}
                className="group p-7 sm:p-8 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-[#E2E8F0] hover:border-blue-200 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  {/* Top domain pill & number */}
                  <div className="flex items-center justify-between mb-5">
                    <span 
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider"
                      style={{ color: accent, backgroundColor: `${accent}15` }}
                    >
                      {company.domainName}
                    </span>

                    <span className="font-mono text-xs text-slate-400 font-bold">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Company Name */}
                  <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-2">
                    {company.name}
                  </h3>

                  {/* Subtitle / Category */}
                  <p className="text-xs font-mono text-[#64748B] mb-4 uppercase tracking-wider">
                    {company.subtitle || company.category}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                    {company.shortDescription || company.description}
                  </p>

                  {/* Services / Focus Tags */}
                  {company.services && company.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {company.services.slice(0, 3).map((srv, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-600"
                        >
                          {typeof srv === 'string' ? srv : srv.title || srv.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explore Company Link */}
                <div className="pt-4 border-t border-slate-200/80">
                  <Link
                    to={company.route || company.path}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] group-hover:text-[#2563EB] transition-colors"
                  >
                    <span>Explore Company Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

