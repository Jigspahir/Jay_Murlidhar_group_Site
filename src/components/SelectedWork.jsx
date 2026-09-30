import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PROJECTS } from '../data/ecosystemData';

export default function SelectedWork({ onOpenContact }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalProject, setModalProject] = useState(null);

  if (!PROJECTS || PROJECTS.length === 0) return null;

  const project = PROJECTS[currentIndex] || PROJECTS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  return (
    <section id="work" className="py-12 sm:py-14 lg:py-16 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Project Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">08 —</span>
              <span className="text-[#1E293B]">PORTFOLIO SHOWCASE</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08]">
              SELECTED WORK.
            </h2>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {PROJECTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-md font-mono text-xs font-semibold transition-all flex items-center justify-center ${
                    currentIndex === idx 
                      ? 'bg-[#111827] text-white' 
                      : 'bg-white text-[#64748B] hover:text-[#111827] border border-[#E2E8F0]'
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-l border-[#E2E8F0] pl-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-md bg-white border border-[#E2E8F0] hover:bg-slate-100 flex items-center justify-center text-[#111827]"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-md bg-white border border-[#E2E8F0] hover:bg-slate-100 flex items-center justify-center text-[#111827]"
                aria-label="Next Project"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* One Project at a Time Case-Study Composition (NO CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Details */}
          <div className="lg:col-span-5">
            <span className="font-mono text-base font-semibold text-[#2563EB] block mb-2">
              0{currentIndex + 1}
            </span>

            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight leading-tight mb-3">
              {project.name}
            </h3>

            <div className="text-sm font-semibold text-[#1E293B] mb-6">
              {project.category}
            </div>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal mb-8">
              {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs font-medium px-2.5 py-1 rounded bg-white border border-[#E2E8F0] text-[#1E293B]"
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              onClick={() => setModalProject(project)}
              className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group"
            >
              <span>View Case Study</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right: Large Product Visual */}
          <div className="lg:col-span-7">
            <div className="border border-[#E2E8F0] rounded-[16px] overflow-hidden bg-slate-900 shadow-[0_4px_24px_rgba(0,0,0,0.06)] relative h-[380px] sm:h-[460px] w-full">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-all duration-500 opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/75 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-blue-300 block mb-0.5">Deployment Status</span>
                  <span className="text-sm font-semibold">{project.status}</span>
                </div>
                <button
                  onClick={() => setModalProject(project)}
                  className="px-4 py-2 rounded-md bg-white text-[#111827] text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Inspect Architecture
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Case Study Modal */}
      {modalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/50 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] max-w-lg w-full p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl relative">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-100 text-[#64748B] hover:text-[#111827]"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="font-mono text-xs font-semibold text-[#2563EB] uppercase block mb-1">
              Case Study &bull; {modalProject.category}
            </span>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">
              {modalProject.name}
            </h3>

            <p className="text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
              {modalProject.description}
            </p>

            <div className="p-4 bg-[#FAFAFA] border border-[#E2E8F0] rounded-[10px] mb-6">
              <div className="text-xs font-semibold text-[#111827] mb-2">Technology Architecture</div>
              <div className="flex flex-wrap gap-1.5">
                {modalProject.tech.map((t, i) => (
                  <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#1E293B]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => setModalProject(null)}
                className="px-4 py-2 rounded-md text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalProject(null);
                  onOpenContact();
                }}
                className="px-5 py-2 rounded-md bg-[#111827] hover:bg-[#2563EB] text-white text-xs font-semibold transition-colors"
              >
                Request Technical Walkthrough
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
