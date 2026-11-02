import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Laptop, Building2, CheckCircle2 } from 'lucide-react';

export default function InternshipCrossLink() {
  return (
    <section className="py-14 sm:py-20 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div 
            className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none"
            aria-hidden="true" 
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-sm text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#9333EA] mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>ACADEMIC INNOVATION &bull; STUDENT INITIATIVE</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-4">
                Starting Your Professional Journey?
              </h2>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl mb-6">
                Explore internship and learning opportunities through JMG Academic Innovation. Designed for university students, recent diploma holders, and early-career learners seeking practical industry experience.
              </p>

              {/* Quick Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-2xl">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-xs font-medium text-slate-700">
                  <Laptop className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Online &amp; Offline Formats</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-xs font-medium text-slate-700">
                  <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Real Enterprise Projects</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>Verified Completion</span>
                </div>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <Link
                to="/academic-innovation"
                className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg group"
              >
                <span>Explore Academic Innovation</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="font-mono text-xs text-slate-500 mt-2.5">
                Browse student tracks &amp; application enquiry &rarr;
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

