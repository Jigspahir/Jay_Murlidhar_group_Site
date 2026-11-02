import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { RECRUITMENT_STAGES } from '../../data/careersData';

export default function RecruitmentProcessSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStage = RECRUITMENT_STAGES[activeStepIndex];

  return (
    <section id="recruitment-process" className="py-16 sm:py-24 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>TRANSPARENT RECRUITMENT JOURNEY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-4">
            How We Connect.
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            We value your time. Our hiring process is structured to be transparent, respectful, and direct — giving you full insight into how we work and how you will fit into the group.
          </p>
        </div>

        {/* 5-Stage Interactive Progress Bar */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {RECRUITMENT_STAGES.map((stage, idx) => {
              const isActive = activeStepIndex === idx;
              const isPassed = idx < activeStepIndex;

              return (
                <button
                  key={stage.step}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 relative ${
                    isActive
                      ? 'bg-blue-50/80 border-[#2563EB] shadow-sm'
                      : isPassed
                      ? 'bg-slate-50 border-emerald-200 hover:bg-slate-100'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {/* Top indicator */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-mono text-xs font-bold ${
                      isActive ? 'text-[#2563EB]' : isPassed ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      STAGE {stage.step}
                    </span>
                    {isPassed && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>

                  <div className={`text-sm font-bold tracking-tight line-clamp-1 ${
                    isActive ? 'text-[#0F172A]' : 'text-slate-700'
                  }`}>
                    {stage.title}
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 mt-0.5 line-clamp-1">
                    {stage.subtitle}
                  </div>

                  {/* Active bottom accent line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2563EB] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Card */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#FAFAFA] border border-[#E2E8F0] shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Number & Stage Info */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#2563EB] text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                  {activeStage.step}
                </span>
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                    STAGE {activeStage.step} OF 05
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                    {activeStage.title} &mdash; <span className="text-[#2563EB]">{activeStage.subtitle}</span>
                  </h3>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal mb-6">
                {activeStage.description}
              </p>

              {/* Action Note Callout */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  <strong className="text-slate-900 font-semibold">What to expect:</strong> {activeStage.actionNote}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Navigation Controls */}
            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
              <div className="text-xs font-mono text-slate-400">
                Stage {activeStepIndex + 1} of {RECRUITMENT_STAGES.length}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(prev - 1, 0))}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  &larr; Previous Stage
                </button>

                <button
                  type="button"
                  disabled={activeStepIndex === RECRUITMENT_STAGES.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(prev + 1, RECRUITMENT_STAGES.length - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-sm"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href="#job-directory"
                className="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] hover:text-blue-700 mt-2"
              >
                Explore Current Vacancies &darr;
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

