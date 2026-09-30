import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JMG_PREVIEW_SUITES } from '../data/jmgServices';

/**
 * ServicesPreview Component
 * 
 * Concise, editorial preview of verified client services on the Home page.
 * Keeps the homepage clean and editorial without clunky, repetitive cards.
 */
export default function ServicesPreview() {
  return (
    <section id="services-preview" className="py-12 sm:py-14 lg:py-16 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">SERVICES</span>
              <span className="text-[#94A3B8]">&bull;</span>
              <span className="text-[#64748B]">OPERATIONAL CAPABILITIES</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.1] mb-3">
              What we help businesses and people accomplish.
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal">
              Practical, dependable solutions delivered across our operating entities with dedicated execution and transparent processing.
            </p>
          </div>

          <Link
            to="/technology"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group flex-shrink-0"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Concise Editorial Numbered Rows */}
        <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[16px] border shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          {JMG_PREVIEW_SUITES.map((service) => (
            <Link
              key={service.id}
              to={service.exploreRoute || service.companyRoute}
              className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 hover:bg-[#F8FAFC] transition-colors duration-150 group"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <span className="font-mono text-sm sm:text-base font-bold text-[#2563EB] w-8">
                  {service.number}
                </span>

                <div>
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[#111827] tracking-tight group-hover:text-[#2563EB] transition-colors">
                      {service.title}
                    </h3>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                      {service.companyName}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#64748B] line-clamp-1 max-w-2xl">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] group-hover:text-[#2563EB] transition-colors flex-shrink-0 self-end md:self-center">
                <span>View Details</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* Subtle Bottom Note */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#94A3B8] font-mono">
          <span>Centralized under Jay Murlidhar Group &bull; Operating across Gujarat &amp; India</span>
          <Link
            to="/ecosystem"
            className="text-[#2563EB] hover:underline"
          >
            Explore Full Group Ecosystem &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
