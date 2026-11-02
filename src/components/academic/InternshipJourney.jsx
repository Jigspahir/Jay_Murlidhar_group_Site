import React, { useState } from 'react';
import { 
  Compass, 
  MailCheck, 
  UserCheck, 
  BookOpen, 
  Share2, 
  Award
} from 'lucide-react';
import { JOURNEY_STAGES } from '../../data/academicInnovationData';

const ICONS = {
  Compass,
  MailCheck,
  UserCheck,
  BookOpen,
  Share2,
  Award
};

export default function InternshipJourney() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStage = JOURNEY_STAGES[activeStepIndex] || JOURNEY_STAGES[0];
  const ActiveIcon = ICONS[activeStage.icon] || Compass;

  return (
    <section id="journey" className="py-16 lg:py-24 bg-[#FAFAFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>04 — INTERNSHIP JOURNEY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Your Journey Starts Here.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            From initial domain discovery to milestone completion, here is how candidates progress through our structured academic internship lifecycle.
          </p>
        </div>

        {/* Desktop Interactive Stepper Bar (Hidden on Mobile) */}
        <div className="hidden lg:grid grid-cols-6 gap-3 mb-10">
          {JOURNEY_STAGES.map((stage, idx) => {
            const isActive = activeStepIndex === idx;
            const StageIcon = ICONS[stage.icon] || Compass;

            return (
              <button
                key={stage.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/10'
                    : 'bg-white/70 border-slate-200 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {stage.step}
                  </span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <StageIcon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{stage.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{stage.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Stage Spotlight Panel (Desktop) */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <ActiveIcon className="w-8 h-8" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                  STAGE {activeStage.step} OF 06
                </span>
                <span className="text-xs font-mono text-slate-400">&bull;</span>
                <span className="text-xs font-medium text-slate-500">{activeStage.summary}</span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                {activeStage.title}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed font-normal max-w-3xl">
                {activeStage.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={activeStepIndex === JOURNEY_STAGES.length - 1}
                onClick={() => setActiveStepIndex(prev => Math.min(JOURNEY_STAGES.length - 1, prev + 1))}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Vertical Timeline Layout (< 1024px) */}
        <div className="lg:hidden space-y-4">
          {JOURNEY_STAGES.map((stage) => {
            const StageIcon = ICONS[stage.icon] || Compass;

            return (
              <div 
                key={stage.step}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative pl-14"
              >
                {/* Step Circle Badge with Icon */}
                <div className="absolute left-4 top-5 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  <StageIcon className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-base text-slate-900">{stage.title}</h4>
                    <span className="text-[11px] font-mono text-slate-400">&bull; {stage.summary}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 text-center text-xs font-mono text-slate-400">
          Timelines and assessment procedures are customized to student college requirements. No fixed commercial timelines are imposed.
        </div>

      </div>
    </section>
  );
}
