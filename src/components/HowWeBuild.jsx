import React, { useState } from 'react';

const STAGES = [
  {
    number: '01',
    name: 'DISCOVER',
    tagline: 'Understand the problem.',
    description: 'We audit active campus bottlenecks, map stakeholder dependencies, and define technical metrics before writing a single line of code.'
  },
  {
    number: '02',
    name: 'DESIGN',
    tagline: 'Define the experience.',
    description: 'Relational database schemas, API contracts, and intuitive editorial UI components crafted for low cognitive overhead and speed.'
  },
  {
    number: '03',
    name: 'BUILD',
    tagline: 'Turn the idea into a product.',
    description: 'Production-ready engineering using modern TypeScript, resilient serverless backends, and rigorous automated validation pipelines.'
  },
  {
    number: '04',
    name: 'LAUNCH',
    tagline: 'Release, learn and improve.',
    description: 'Zero-downtime deployment, user training workshops, automated backup verification, and continuous real-world telemetry monitoring.'
  }
];

export default function HowWeBuild() {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#2563EB]">07 —</span>
            <span className="text-[#1E293B]">ENGINEERING PROCESS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6">
            HOW WE BUILD.
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
            A disciplined, developer-crafted methodology that prioritizes usability, code health, and predictable delivery over superficial complexity.
          </p>
        </div>

        {/* Horizontal Process with Connecting Lines (NO CARDS) */}
        <div className="relative">
          
          {/* Horizontal connecting line across stages (Desktop) */}
          <div className="hidden lg:block absolute top-[22px] left-0 right-0 h-[1px] bg-[#E2E8F0] z-0" />

          {/* Vertical connecting line for mobile & tablet (Section 12 Requirement) */}
          <div className="lg:hidden absolute top-[22px] bottom-[22px] left-[21px] w-[2px] bg-gradient-to-b from-[#2563EB] via-[#6366F1] to-[#E2E8F0] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10">
            {STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div 
                  key={stage.number}
                  onMouseEnter={() => setActiveStage(idx)}
                  onClick={() => setActiveStage(idx)}
                  className="cursor-pointer group relative pl-14 lg:pl-0"
                >
                  {/* Step Marker */}
                  <div className="flex items-center gap-3 mb-3 lg:mb-6">
                    <span className={`absolute left-0 lg:static w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all border z-10 ${
                      isActive 
                        ? 'bg-[#111827] text-white border-[#111827]' 
                        : 'bg-white text-[#94A3B8] border-[#E2E8F0] group-hover:border-[#111827] group-hover:text-[#111827]'
                    }`}>
                      {stage.number}
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Phase {stage.number}
                    </span>
                  </div>

                  {/* Stage Title */}
                  <h3 className={`text-xl sm:text-2xl font-bold tracking-tight mb-2 transition-colors ${
                    isActive ? 'text-[#111827]' : 'text-[#64748B] group-hover:text-[#111827]'
                  }`}>
                    {stage.name}
                  </h3>

                  {/* Tagline */}
                  <div className="text-sm font-semibold text-[#1E293B] mb-2 sm:mb-3">
                    {stage.tagline}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
