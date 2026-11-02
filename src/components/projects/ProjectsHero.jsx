import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ProjectsHero() {
  return (
    <section className="bg-white border-b border-slate-200 pt-12 pb-16 lg:pt-16 lg:pb-20 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-700">
              Projects &amp; Digital Products
            </span>
            <span className="text-slate-300 font-mono">&bull;</span>
            <span className="text-xs font-mono text-slate-600">Jay Murlidhar Tech Solutions</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            ENGINEERING DIGITAL <span className="text-blue-600">SOLUTIONS.</span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-normal max-w-3xl mb-8">
            Explore technology services, custom software solutions and digital products designed to simplify operations and support business growth.
          </p>

          {/* Transparency Disclaimer Banner */}
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-3 mb-10 max-w-3xl shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-0.5">
                Illustrative Architecture &amp; Prototype Showcase
              </p>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                All entries presented on this page are <span className="font-bold underline">demo concepts and illustrative engineering prototypes</span> designed to demonstrate technical capabilities and system architectures. None represent verified client deployments or active contracts.
              </p>
            </div>
          </div>

          {/* Editorial Quick Stats / Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block font-mono">16</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Concept Prototypes</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 block font-mono">08</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Service Solutions</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] block font-mono">08</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Digital Products</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block font-mono">100%</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Transparency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
