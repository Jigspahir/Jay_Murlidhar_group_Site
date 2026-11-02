import React from 'react';
import { 
  Layers, 
  MessageSquare, 
  Users, 
  Lightbulb, 
  FolderGit2, 
  Wrench, 
  CheckCircle2, 
  Target 
} from 'lucide-react';
import { LEARNING_AREAS } from '../../data/academicInnovationData';

const ICONS = {
  Layers,
  MessageSquare,
  Users,
  Lightbulb,
  FolderGit2,
  Wrench,
  CheckCircle2,
  Target
};

export default function WhatYouCanLearn() {
  return (
    <section id="learning" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>05 — PRACTICAL CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Build Skills Beyond the Classroom.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Our internship curriculum balances core domain competence with essential professional habits, equipping students with real-world execution confidence.
          </p>
        </div>

        {/* 8-Card Editorial Grid (2 cols on tablet, 4 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEARNING_AREAS.map((item, idx) => {
            const Icon = ICONS[item.icon] || CheckCircle2;

            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-6 sm:p-7 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>SKILL 0{idx + 1}</span>
                  <span className="text-blue-600 font-semibold group-hover:underline">Milestone Module</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

