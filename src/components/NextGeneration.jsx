import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const AUDIENCES = [
  {
    id: 'students',
    title: 'STUDENTS',
    focus: 'Friction-Free Academic Living',
    description: 'Real-time schedule notifications, one-tap mobile fee settlements, digital hall tickets, and direct academic feedback with zero administrative paperwork.',
    deliverables: ['Mobile student portal', 'Instant grade verification', 'Digital identity credentials']
  },
  {
    id: 'creators',
    title: 'CREATORS',
    focus: 'Developer-First Toolchains',
    description: 'Modern APIs, accessible UI component systems, and modular infrastructure built to let creative engineers build, experiment, and deploy rapidly.',
    deliverables: ['Production-ready TypeScript SDKs', 'Open architectural documentation', 'Agile deployment gates']
  },
  {
    id: 'professionals',
    title: 'PROFESSIONALS',
    focus: 'Institutional Clarity & Speed',
    description: 'Enterprise dashboards that eliminate redundant spreadsheet auditing, speed up compliance reviews, and protect institutional data integrity.',
    deliverables: ['Automated financial reconciliation', 'Role-based access security', 'Historical telemetry radar']
  }
];

export default function NextGeneration() {
  const [activeAudience, setActiveAudience] = useState(AUDIENCES[0]);

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#07111F] text-white border-b border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#60A5FA]">09 —</span>
            <span className="text-[#CBD5E1]">HUMAN-CENTERED DESIGN</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#F8FAFC] tracking-[-0.03em] leading-[1.08] mb-6 break-words">
            BUILT FOR THE<br />
            NEXT GENERATION.
          </h2>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-normal">
            Technology should feel intuitive, useful and human. We engineer software that respects user attention and solves real daily friction.
          </p>
        </div>

        {/* Large Typographic Navigation Items (NO CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Typographic Interactive Selectors */}
          <div className="lg:col-span-6 divide-y divide-slate-800 border-y border-slate-800">
            {AUDIENCES.map((item) => {
              const isSelected = activeAudience.id === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveAudience(item)}
                  onClick={() => setActiveAudience(item)}
                  className={`py-8 sm:py-10 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                    isSelected ? 'pl-2 text-[#F8FAFC]' : 'text-slate-500 hover:text-[#F8FAFC] hover:pl-2'
                  }`}
                >
                  <div>
                    <h3 className={`text-3xl sm:text-5xl font-bold tracking-tight transition-colors ${
                      isSelected ? 'text-[#F8FAFC]' : 'text-slate-500 group-hover:text-[#F8FAFC]'
                    }`}>
                      {item.title}
                    </h3>
                    <span className="font-mono text-xs text-[#94A3B8] mt-1 block">
                      {item.focus}
                    </span>
                  </div>

                  <ArrowRight className={`w-6 h-6 transition-transform ${
                    isSelected ? 'text-[#60A5FA] translate-x-1' : 'text-slate-700 group-hover:text-[#F8FAFC] group-hover:translate-x-1'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Context Panel */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 border border-slate-800 rounded-[16px] bg-slate-950">
              <span className="font-mono text-xs uppercase tracking-wider text-[#60A5FA] font-semibold block mb-3">
                Focus Demographic &bull; {activeAudience.title}
              </span>

              <h4 className="text-2xl font-bold text-[#F8FAFC] mb-4">
                {activeAudience.focus}
              </h4>

              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-normal mb-8">
                {activeAudience.description}
              </p>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="text-xs font-mono uppercase text-[#94A3B8] font-semibold">
                  Core Everyday Deliverables
                </div>
                {activeAudience.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#CBD5E1]">
                    <span className="text-[#60A5FA]">&mdash;</span>
                    <span>{del}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Audience Paradigm: Human &bull; Intuitive &bull; Fast
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
