import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function IntroSection() {
  return (
    <section id="about" className="py-12 sm:py-14 lg:py-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-Width Editorial Layout (NO CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] mb-6">
              <span className="font-mono text-[#2563EB] font-bold">01 &mdash;</span>
              <span className="text-[#1E293B]">WHO WE ARE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-8">
              ONE GROUP.<br />
              <span className="text-[#1E293B]">MULTIPLE POSSIBILITIES.</span>
            </h2>

            <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-2xl mb-6">
              Jay Murlidhar Group brings together education, technology and diverse business initiatives under one growing ecosystem.
            </p>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal max-w-2xl mb-10">
              We operate with a long-term mindset, focusing on platforms and services that solve genuine institutional friction. By uniting educational domain knowledge with modern engineering methodologies, we create sustainable solutions built for scale.
            </p>

            <a
              href="#focus"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group"
            >
              <span>About Jay Murlidhar Group</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right Column: Subtle Architectural Interconnected Graphic */}
          <div className="lg:col-span-5 pt-4">
            <div className="p-8 border border-[#E2E8F0] rounded-[16px] bg-[#FAFAFA]">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-6">
                Ecosystem Architecture
              </div>

              {/* Minimal Line Diagram showing convergence */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#2563EB]">01</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Education Core</h3>
                    <p className="text-xs text-[#64748B] mt-0.5 font-normal">Campus governance, student automation &amp; institutional workflows.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#E2E8F0] w-full" />

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#7C3AED]">02</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Technology Layer</h3>
                    <p className="text-xs text-[#64748B] mt-0.5 font-normal">Custom software, API systems &amp; modern cloud infrastructure.</p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#E2E8F0] w-full" />

                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-[#10B981]">03</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827]">Commercial Services</h3>
                    <p className="text-xs text-[#64748B] mt-0.5 font-normal">Integrated insurance, travel, retail, and enterprise operations.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-[11px] text-[#94A3B8] font-mono">
                Unified Governance &bull; Pan-India Reach
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
