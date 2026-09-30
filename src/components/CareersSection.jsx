import React from 'react';
import { ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { CAREER_ROLES } from '../data/ecosystemData';

export default function CareersSection({ onOpenContact }) {
  return (
    <section id="careers" className="py-20 lg:py-28 bg-surface-bg border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Section: Content on Left, Subtle Abstract Graphic on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
              <span>Talent &amp; Culture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-3">
              YOUR NEXT CHAPTER STARTS HERE.
            </h2>

            <p className="text-lg font-bold text-content-primary mb-3">
              Learn. Build. Experiment. Grow.
            </p>

            <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-normal max-w-xl mb-6">
              We work across software engineering, digital campus operations, and multidisciplinary business services. We welcome problem-solvers who care about crafting clean, purposeful solutions.
            </p>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-btn bg-content-primary hover:bg-brand-blue text-white font-semibold text-sm transition-colors duration-200 shadow-subtle"
            >
              <span>Explore Careers &amp; Open Roles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Subtle Abstract Engineering Visual (Not a giant 3D scene) */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-line-border rounded-container p-6 shadow-subtle relative overflow-hidden">
              <div className="text-xs font-mono font-bold text-content-secondary mb-3 uppercase tracking-wider">
                Engineering Values
              </div>
              <ul className="space-y-2.5 text-xs text-content-primary font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                  Pragmatic problem-solving over hype
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                  Collaborative code &amp; design reviews
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  Direct mentorship &amp; project ownership
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  Sustainable work-life balance
                </li>
              </ul>
              
              <div className="mt-6 pt-4 border-t border-line-border text-[11px] text-content-secondary font-mono">
                Location: Hybrid &bull; Gujarat &amp; Remote
              </div>
            </div>
          </div>

        </div>

        {/* Roles List */}
        <div className="bg-white border border-line-border rounded-container shadow-subtle divide-y divide-line-border overflow-hidden">
          {CAREER_ROLES.slice(0, 4).map((role) => (
            <div
              key={role.title}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-bg transition-colors"
            >
              <div>
                <h4 className="text-base font-bold text-content-primary mb-1">
                  {role.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-content-secondary">
                  <span>{role.team}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-content-muted" />
                    {role.location}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenContact}
                className="self-start sm:self-center px-4 py-1.5 rounded-md text-xs font-semibold border border-line-border hover:border-content-primary text-content-primary transition-colors flex items-center gap-1"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
