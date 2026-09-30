import React, { useState } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

const TECH_ITEMS = [
  {
    id: 'web',
    title: 'WEB',
    fullName: 'Modern Web Engineering',
    tagline: 'Modern web experiences and applications.',
    description: 'High-performance interactive web portals, scalable frontend architectures, and responsive web applications built with React, Next.js, and modern TypeScript.',
    deliverables: ['Sub-second page rendering', 'Full mobile responsive fidelity', 'Accessibility & SEO built-in'],
    metrics: 'Fast & Lightweight'
  },
  {
    id: 'software',
    title: 'SOFTWARE',
    fullName: 'Enterprise Systems',
    tagline: 'Reliable, modular software architectures.',
    description: 'Core institutional engines and mission-critical enterprise systems designed for concurrent high-load processing, role-based workflows, and data consistency.',
    deliverables: ['Relational data models', 'Granular RBAC security', 'Fault-tolerant microservices'],
    metrics: 'Zero-downtime Deployments'
  },
  {
    id: 'ai',
    title: 'AI',
    fullName: 'Intelligent Automation',
    tagline: 'Intelligent automation and AI-powered experiences.',
    description: 'Practical machine intelligence that classifies incoming documents, detects academic scheduling conflicts, and provides conversational student guidance.',
    deliverables: ['Automated timetable optimization', 'Document verification parsing', 'Contextual student assistants'],
    metrics: 'Practical & Grounded'
  },
  {
    id: 'cloud',
    title: 'CLOUD',
    fullName: 'Cloud Infrastructure',
    tagline: 'Scalable digital infrastructure.',
    description: 'Elastic cloud backends, container orchestration, encrypted multi-region database backups, and secure serverless computing pipelines.',
    deliverables: ['Automated CI/CD pipelines', 'Multi-zone database failover', 'End-to-end data encryption'],
    metrics: 'High Availability'
  },
  {
    id: 'data',
    title: 'DATA',
    fullName: 'Analytics & Telemetry',
    tagline: 'Real-time operational reporting.',
    description: 'Unified administrative metrics, institutional fee reconciliation pipelines, live attendance telemetry, and exportable regulatory compliance summaries.',
    deliverables: ['Real-time telemetry dashboards', 'Instant CSV/PDF audit generation', 'Historical attendance radar'],
    metrics: 'Transparent Auditing'
  },
  {
    id: 'automation',
    title: 'AUTOMATION',
    fullName: 'Workflow Engine',
    tagline: 'Streamlined event-driven pipelines.',
    description: 'Eliminating manual administrative repetitive overhead through event-driven triggers, instant fee receipts, SMS/Email dispatches, and verification bots.',
    deliverables: ['Event-driven webhooks', 'Automated fee receipt generation', 'Instant hall ticket delivery'],
    metrics: '90% Less Clerical Overhead'
  }
];

export default function TechnologySection() {
  const [activeTech, setActiveTech] = useState(TECH_ITEMS[0]);

  return (
    <section id="technology-details" className="py-12 sm:py-14 lg:py-16 bg-[#07111F] text-white border-b border-slate-800">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] mb-4">
            <span className="font-mono text-[#60A5FA] font-bold">04 &mdash;</span>
            <span className="text-[#94A3B8]">ENGINEERING PHILOSOPHY</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#F8FAFC] tracking-[-0.03em] leading-[1.08] mb-6">
            TECHNOLOGY SHOULD<br />
            DISAPPEAR INTO THE EXPERIENCE.
          </h2>

          <p className="text-base sm:text-lg text-[#CBD5E1] leading-relaxed font-normal">
            Technology should feel natural, useful and intuitive. We design digital systems that do heavy operational lifting behind the scenes without overwhelming users.
          </p>
        </div>

        {/* Interactive Studio Split: Large Typographic List on Left, Live Studio Console on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Typographic Interactive List (NO CARDS) */}
          <div className="lg:col-span-6 divide-y divide-slate-800 border-y border-slate-800">
            {TECH_ITEMS.map((item) => {
              const isSelected = activeTech.id === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveTech(item)}
                  onClick={() => setActiveTech(item)}
                  className={`min-h-[52px] py-4 sm:py-6 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                    isSelected ? 'pl-2 text-[#F8FAFC]' : 'text-[#64748B] hover:text-[#F8FAFC] hover:pl-2'
                  }`}
                >
                  <span className={`text-2xl sm:text-4xl font-semibold tracking-tight transition-colors ${
                    isSelected ? 'text-[#F8FAFC]' : 'text-[#64748B] group-hover:text-[#F8FAFC]'
                  }`}>
                    {item.title}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
                      {item.tagline}
                    </span>
                    <ArrowRight className={`w-5 h-5 transition-transform ${
                      isSelected ? 'text-[#60A5FA] translate-x-1' : 'text-slate-700 group-hover:translate-x-1 group-hover:text-[#CBD5E1]'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Technical Studio Console / Architecture Preview */}
          <div className="lg:col-span-6 sticky top-28 w-full">
            <div className="border border-slate-800 rounded-[16px] bg-slate-950 p-6 sm:p-8 shadow-2xl">
              
              {/* Studio Window Chrome */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="ml-2 text-slate-300">stack.jmg.internal/{activeTech.id}</span>
                </div>
                <span className="text-[#60A5FA] font-bold">{activeTech.metrics}</span>
              </div>

              {/* Mobile Selected Indicator (Section 9) */}
              <div className="lg:hidden text-xs font-mono text-slate-400 mb-2">
                Selected: <span className="text-[#60A5FA] font-bold">{activeTech.title}</span>
              </div>

              {/* Dynamic Content Details */}
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#60A5FA] block mb-2">
                {activeTech.fullName}
              </span>

              <h3 className="text-xl sm:text-2xl font-semibold text-[#F8FAFC] mb-3">
                {activeTech.tagline}
              </h3>

              <p className="text-sm text-[#CBD5E1] leading-relaxed font-normal mb-8">
                {activeTech.description}
              </p>

              {/* Technical Specifications */}
              <div className="space-y-3 pt-6 border-t border-slate-800">
                <div className="text-xs font-mono uppercase text-[#94A3B8] font-semibold">
                  Core Engineering Capabilities
                </div>
                {activeTech.deliverables.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1]">
                    <span className="text-[#60A5FA]">&bull;</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>Status: Production Ready</span>
                <span>Type Safety: 100%</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
