import React from 'react';
import { BookOpen, Users, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WHY_JMG_PILLARS } from '../../data/careersData';

const ICONS = {
  'growth-learning': BookOpen,
  'collaboration': Users,
  'innovation': Cpu,
  'responsibility': ShieldCheck,
};

export default function WhyJMGSection() {
  return (
    <section id="why-jmg" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-4">
            <span>WHY WORK WITH JMG</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-5">
            More Than a Workplace.<br />
            <span className="text-[#2563EB]">A Place to Grow.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Jay Murlidhar Group brings together diverse capabilities across enterprise engineering, insurance risk advisory, citizen documentation, and commerce. We believe in work that makes a measurable, authentic difference to our regional community.
          </p>
        </div>

        {/* 4 Feature Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {WHY_JMG_PILLARS.map((pillar) => {
            const IconComponent = ICONS[pillar.id] || BookOpen;

            return (
              <div
                key={pillar.id}
                className="group relative p-8 sm:p-10 rounded-2xl bg-[#FAFAFA] hover:bg-white border border-[#E2E8F0] hover:border-blue-200 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  {/* Card Header with Step and Icon */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono text-sm shadow-sm"
                        style={{ backgroundColor: pillar.accent }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#64748B]">
                        PILLAR {pillar.number}
                      </span>
                    </div>

                    <span 
                      className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md"
                      style={{ color: pillar.accent, backgroundColor: `${pillar.accent}12` }}
                    >
                      {pillar.tagline}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-3 group-hover:text-[#2563EB] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#475569] leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>
                </div>

                {/* Practical Highlights List */}
                <div className="pt-5 border-t border-[#E2E8F0]/80">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#94A3B8] font-bold mb-3">
                    Core Principles
                  </div>
                  <ul className="space-y-2">
                    {pillar.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            );
          })}
        </div>

        {/* Footnote on Authenticity */}
        <div className="mt-12 p-6 rounded-xl bg-blue-50/60 border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            <p className="text-xs sm:text-sm text-[#1E293B] font-medium">
              We stand for transparent expectations, genuine learning curves, and respect for individual craft.
            </p>
          </div>
          <a
            href="#recruitment-process"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 whitespace-nowrap"
          >
            See Our Hiring Process &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
