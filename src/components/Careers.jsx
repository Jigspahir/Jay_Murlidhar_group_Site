import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Careers({ onOpenContact }) {
  return (
    <section id="careers" className="py-12 sm:py-14 lg:py-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Editorial Section (NO JOB CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-6 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">10 —</span>
              <span className="text-[#1E293B]">TALENT &amp; CULTURE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6">
              YOUR NEXT CHAPTER<br />
              STARTS HERE.
            </h2>

            <p className="text-xl sm:text-2xl font-semibold text-[#1E293B] mb-6">
              Learn. Build. Experiment. Grow.
            </p>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal max-w-xl mb-10">
              We work across software engineering, digital campus operations, and multi-industry commercial platforms. We are always interested in connecting with thoughtful problem-solvers who care about crafting clean, purposeful work.
            </p>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 text-base font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group"
            >
              <span>Explore Careers</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right: One Subtle Supporting Visual */}
          <div className="lg:col-span-5">
            <div className="p-8 border border-[#E2E8F0] rounded-[16px] bg-[#FAFAFA]">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#94A3B8] mb-6">
                Active Disciplines
              </div>

              <div className="space-y-4 text-sm font-medium text-[#111827]">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span>Software Development &amp; Cloud</span>
                  <span className="font-mono text-xs text-[#94A3B8]">Engineering</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span>Product UI &amp; Design Systems</span>
                  <span className="font-mono text-xs text-[#94A3B8]">Experience</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span>Applied AI &amp; Process Automation</span>
                  <span className="font-mono text-xs text-[#94A3B8]">Intelligence</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span>Campus Academic Operations</span>
                  <span className="font-mono text-xs text-[#94A3B8]">Education</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] font-mono">
                <span>Working Modes: Hybrid &amp; Onsite</span>
                <span className="text-[#2563EB] font-semibold">Open Inquiries</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
