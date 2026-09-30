import React from 'react';
import { ArrowRight, GraduationCap, Terminal, Briefcase } from 'lucide-react';

export default function NextGenerationSection() {
  const audiences = [
    {
      id: 'students',
      title: 'Students',
      icon: GraduationCap,
      description: 'Friction-free access to institutional schedules, verified credentials, and digital learning tools built for contemporary habits.',
      deliverables: ['Mobile-first portals', 'Instant attendance & fee ledgers', 'Direct academic feedback']
    },
    {
      id: 'creators',
      title: 'Creators & Builders',
      icon: Terminal,
      description: 'Developer-friendly APIs, robust modular toolchains, and modern design components designed to transform ambitious code into reality.',
      deliverables: ['Production-ready stacks', 'Open architectural documentation', 'Agile development pipelines']
    },
    {
      id: 'professionals',
      title: 'Professionals',
      icon: Briefcase,
      description: 'Enterprise systems that reduce clerical friction, accelerate decision cycles, and safeguard critical organizational compliance.',
      deliverables: ['Real-time operational auditing', 'Role-based access security', 'Predictive administrative insights']
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
            <span>Human-Centered Technology</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-4">
            BUILT FOR THE NEXT GENERATION.
          </h2>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed font-normal">
            Technology should feel intuitive, useful and human. We engineer software that respects user attention and solves real daily friction.
          </p>
        </div>

        {/* Three Focus Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-surface-bg border border-line-border rounded-container p-8 shadow-subtle flex flex-col justify-between hover:border-line-hover transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-line-border flex items-center justify-center text-content-primary mb-6 shadow-subtle">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-bold text-content-primary mb-3">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-normal mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-line-border">
                    {item.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="text-xs text-content-primary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-line-border">
                  <span className="text-xs font-semibold text-content-secondary">
                    Designed for everyday utility
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
