import React from 'react';

export default function HowWeWork() {
  const steps = [
    {
      step: '01',
      title: 'Discover',
      description: 'We analyze real operational bottlenecks, interview administrators and users, and establish exact technical objectives before writing code.'
    },
    {
      step: '02',
      title: 'Design',
      description: 'Architecting relational schemas, data governance protocols, and intuitive layouts with high clarity and low cognitive friction.'
    },
    {
      step: '03',
      title: 'Build',
      description: 'Developing modular, production-ready software using modern web frameworks, secure API gateways, and automated validation tests.'
    },
    {
      step: '04',
      title: 'Launch',
      description: 'Executing smooth migrations, hands-on user orientation, reliable backups, and continuous real-world performance monitoring.'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
            <span>Process &amp; Methodology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-4">
            HOW WE WORK.
          </h2>

          <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-normal">
            A disciplined, developer-crafted methodology that prioritizes usability, code health, and predictable delivery over superficial complexity.
          </p>
        </div>

        {/* Process Timeline with Line Connections */}
        <div className="relative">
          
          {/* Subtle horizontal connecting line on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[1px] bg-line-border -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((item, idx) => (
              <div 
                key={item.step}
                className="bg-surface-bg border border-line-border rounded-xl p-6 shadow-subtle flex flex-col justify-between hover:border-line-hover transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-brand-blue bg-white border border-line-border px-2 py-0.5 rounded">
                      Phase {item.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-content-muted" />
                  </div>

                  <h3 className="text-lg font-bold text-content-primary mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line-border text-[11px] text-content-muted font-mono">
                  Milestone &bull; {idx === 3 ? 'Production Release' : 'Validation Gate'}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
