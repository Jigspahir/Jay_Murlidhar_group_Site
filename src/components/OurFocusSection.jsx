import React from 'react';
import { ArrowRight, BookOpen, Cpu, CheckCircle2, Plus } from 'lucide-react';

export default function OurFocusSection() {
  const educationPoints = [
    'Comprehensive institutional administration & ERP systems',
    'Real-time student lifecycle, attendance & fee processing',
    'Faculty grading workflows & conflict-free scheduling',
    'Modern digital campus experience for learners & staff'
  ];

  const technologyPoints = [
    'Modern web platforms and responsive web applications',
    'Modular cloud infrastructure with high availability',
    'Intelligent workflow automation and API integrations',
    'Robust role-based security and encrypted data records'
  ];

  return (
    <section id="focus" className="py-20 lg:py-28 bg-surface-bg border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
            <span>Core Pillars</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-4">
            OUR FOCUS.
          </h2>

          <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-normal">
            We focus our primary efforts on education and technology, where digital innovation creates the highest tangible impact for future generations.
          </p>
        </div>

        {/* Two-Column Focus Cards with Central Connection */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Subtle Connection Indicator in Center (Desktop) */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white border border-line-border shadow-subtle flex items-center justify-center text-content-primary font-bold text-sm">
              <Plus className="w-4 h-4 text-brand-blue" />
            </div>
          </div>

          {/* Left Column: EDUCATION */}
          <div className="bg-white border border-line-border rounded-container p-8 sm:p-10 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">
                  Pillar 01
                </span>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-content-primary mb-3">
                EDUCATION
              </h3>

              <p className="text-sm text-content-secondary leading-relaxed font-normal mb-8">
                Empowering colleges, schools, and educational institutions with unified digital management, so educators spend less time on administration and more time mentoring learners.
              </p>

              <div className="space-y-3 mb-8">
                {educationPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-content-primary">
                    <CheckCircle2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-line-border flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary">
                Designed for Institutions &amp; Students
              </span>
              <a 
                href="#solutions" 
                className="text-xs font-bold text-brand-blue hover:text-content-primary transition-colors flex items-center gap-1"
              >
                <span>View ERP Modules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: TECHNOLOGY */}
          <div className="bg-white border border-line-border rounded-container p-8 sm:p-10 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                  Pillar 02
                </span>
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-brand-purple flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-content-primary mb-3">
                TECHNOLOGY
              </h3>

              <p className="text-sm text-content-secondary leading-relaxed font-normal mb-8">
                Architecting reliable web platforms, intelligent automation workflows, and resilient cloud systems that translate strategic concepts into scalable digital solutions.
              </p>

              <div className="space-y-3 mb-8">
                {technologyPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-content-primary">
                    <CheckCircle2 className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-line-border flex items-center justify-between">
              <span className="text-xs font-bold text-content-secondary">
                Built for Scalability &amp; Reliability
              </span>
              <a 
                href="#solutions" 
                className="text-xs font-bold text-brand-purple hover:text-content-primary transition-colors flex items-center gap-1"
              >
                <span>Explore Tech Stacks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Core Direction Equation Banner */}
        <div className="mt-8 bg-white border border-line-border rounded-xl p-4 text-center">
          <p className="text-xs sm:text-sm font-semibold text-content-secondary">
            <span className="text-content-primary font-bold">Education</span> &times; <span className="text-content-primary font-bold">Technology</span> = <span className="text-brand-blue font-bold">The Core Direction of Jay Murlidhar Group</span>
          </p>
        </div>

      </div>
    </section>
  );
}
