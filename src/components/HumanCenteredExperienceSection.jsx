import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const HUMAN_CENTERED_AUDIENCES = [
  {
    id: 'students',
    number: '01',
    title: 'STUDENTS',
    focus: 'Friction-Free Academic Living',
    description:
      'Digital experiences that simplify everyday academic workflows and help students access information, services and support with less friction.',
    coreAreas: [
      'Student self-service',
      'Digital academic workflows',
      'Mobile-first experiences',
      'Simplified access to information'
    ]
  },
  {
    id: 'creators',
    number: '02',
    title: 'CREATORS',
    focus: 'Developer-First Toolchains',
    description:
      'Tools, platforms and digital workflows designed to help creators and developers build, experiment and deliver faster.',
    coreAreas: [
      'Developer workflows',
      'Digital tools',
      'Product experimentation',
      'Modern web technologies'
    ]
  },
  {
    id: 'professionals',
    number: '03',
    title: 'PROFESSIONALS',
    focus: 'Institutional Clarity & Speed',
    description:
      'Digital systems designed to reduce operational friction and help teams work with greater clarity, consistency and efficiency.',
    coreAreas: [
      'Operational workflows',
      'Digital processes',
      'Information access',
      'Team productivity'
    ]
  }
];

export default function HumanCenteredExperienceSection() {
  const [activeAudience, setActiveAudience] = useState(HUMAN_CENTERED_AUDIENCES[0]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#07111F] text-white border-y border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 lg:mb-14">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#60A5FA]">05 &mdash;</span>
            <span className="text-[#CBD5E1]">HUMAN-CENTERED EXPERIENCE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#F8FAFC] tracking-[-0.03em] leading-[1.08] mb-5 break-words">
            DESIGNED AROUND<br />
            PEOPLE.
          </h2>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-normal max-w-2xl">
            We design digital experiences around the people who use them &mdash; students, creators, professionals and teams &mdash; making complex workflows simpler, faster and more intuitive.
          </p>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left: Typographic Interactive Selectors */}
          <div className="lg:col-span-6 divide-y divide-slate-800 border-y border-slate-800">
            {HUMAN_CENTERED_AUDIENCES.map((item) => {
              const isSelected = activeAudience.id === item.id;
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onMouseEnter={() => setActiveAudience(item)}
                  onClick={() => setActiveAudience(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveAudience(item);
                    }
                  }}
                  className={`py-7 sm:py-9 cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                    isSelected ? 'pl-2 text-[#F8FAFC]' : 'text-slate-500 hover:text-[#F8FAFC] hover:pl-2'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#60A5FA] font-semibold">{item.number}</span>
                      <span className="text-slate-700">&mdash;</span>
                      <span className="font-mono text-xs text-[#94A3B8]">{item.focus}</span>
                    </div>
                    <h3 className={`text-2xl sm:text-4xl lg:text-[42px] font-bold tracking-tight transition-colors ${
                      isSelected ? 'text-[#F8FAFC]' : 'text-slate-500 group-hover:text-[#F8FAFC]'
                    }`}>
                      {item.title}
                    </h3>
                  </div>

                  <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                    isSelected 
                      ? 'text-[#60A5FA] translate-x-1.5' 
                      : 'text-slate-700 group-hover:text-[#F8FAFC] group-hover:translate-x-1'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Context Panel */}
          <div className="lg:col-span-6">
            <div className="p-7 sm:p-9 border border-slate-800 rounded-[16px] bg-slate-950/90 backdrop-blur-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-[#60A5FA] font-semibold block mb-3">
                FOCUS AUDIENCE &bull; {activeAudience.title}
              </span>

              <h4 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-4">
                {activeAudience.focus}
              </h4>

              <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed font-normal mb-7">
                {activeAudience.description}
              </p>

              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="text-xs font-mono uppercase text-[#94A3B8] font-semibold tracking-wider">
                  Core Focus Areas
                </div>
                {activeAudience.coreAreas.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-mono text-[#CBD5E1]">
                    <span className="text-[#60A5FA] font-bold">&mdash;</span>
                    <span>{area}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Experience Paradigm: Human &bull; Intuitive &bull; Fast
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
