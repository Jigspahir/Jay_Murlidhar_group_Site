import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  Laptop, 
  Building2, 
  Compass
} from 'lucide-react';
import { ACADEMIC_HERO_STATS } from '../../data/academicInnovationData';

export default function AcademicHero({ onOpenContact }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-1/4 w-[480px] h-[480px] bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-7">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-700">
                JMG Academic Innovation
              </span>
              <span className="text-slate-300 font-mono">&bull;</span>
              <span className="text-xs font-mono text-slate-600">Internship Initiative</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6">
              TURN YOUR KNOWLEDGE INTO <span className="text-blue-600">EXPERIENCE.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl">
              Explore internship opportunities across technology, marketing, human resources, finance and business operations. Learn through practical assignments, collaborative work and industry-oriented exposure.
            </p>

            {/* Participation Modes Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                <Laptop className="w-4 h-4 text-blue-600" />
                <span>Online Internships (Remote)</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800">
                <Building2 className="w-4 h-4 text-[#EA580C]" />
                <span>Offline Internships (On-Site Gujarat)</span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => scrollToSection('departments')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all group"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection('departments')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Discover Our Departments</span>
              </button>
            </div>

            {/* Verified Quick Metric Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
              {ACADEMIC_HERO_STATS.map((stat, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Composition / Workspace Graphic */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-100 to-orange-100 opacity-60 blur-lg -z-10" />

              {/* Main Visual Card */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 text-white relative">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white tracking-wide">JMG Academic Portal</div>
                      <div className="text-[10px] font-mono text-slate-400">Collaborative Learning Hub</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    SEASON OPEN
                  </span>
                </div>

                {/* Simulated Milestone Canvas */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span>Curriculum Exposure</span>
                      <span className="text-blue-400 font-bold">100% Practical</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-normal leading-relaxed">
                      Real operational assignments across software systems, digital marketing, corporate finance, and HR workflows.
                    </p>
                  </div>

                  {/* Mode Indicators */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      <div className="text-blue-400 font-bold font-mono text-[11px] mb-1">MODE 01</div>
                      <div className="font-semibold text-white">Online Internship</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Cloud workspace &amp; repo access</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                      <div className="text-[#EA580C] font-bold font-mono text-[11px] mb-1">MODE 02</div>
                      <div className="font-semibold text-white">Offline Internship</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Gujarat facility immersion</div>
                    </div>
                  </div>
                </div>

                {/* Direct Action inside visual */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Structured &bull; Industry-Aligned
                  </span>
                  <button
                    onClick={onOpenContact}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Enquire Directly</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
