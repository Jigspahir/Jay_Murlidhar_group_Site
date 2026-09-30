import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { PROJECTS } from '../data/ecosystemData';

export default function ProjectsSection({ onOpenContact }) {
  const [activeProject, setActiveProject] = useState(null);

  if (!PROJECTS || PROJECTS.length === 0) return null;

  return (
    <section id="projects" className="py-20 lg:py-28 bg-surface-bg border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
            <span>Portfolio &amp; Implementations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-4">
            PROJECTS.
          </h2>

          <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-normal">
            Representative software architectures and operating systems built for institutional and commercial workflows.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-line-border rounded-container shadow-subtle overflow-hidden flex flex-col justify-between hover:border-line-hover transition-colors group"
            >
              <div>
                {/* Project Visual */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 border-b border-line-border">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-white/95 border border-line-border text-content-primary shadow-subtle">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Project Meta */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-content-primary mb-2 group-hover:text-brand-blue transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-normal mb-5">
                    {project.description}
                  </p>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium font-mono px-2 py-0.5 rounded bg-surface-subtle text-content-secondary"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setActiveProject(project)}
                  className="w-full py-2.5 px-4 rounded-btn bg-surface-bg hover:bg-content-primary hover:text-white text-content-primary text-xs font-semibold border border-line-border transition-all duration-200 flex items-center justify-between"
                >
                  <span>View Case Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Structured Case Study Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-content-primary/40 backdrop-blur-sm">
          <div className="bg-white rounded-container max-w-lg w-full p-6 sm:p-8 border border-line-border shadow-modal relative">
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface-subtle text-content-secondary hover:text-content-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider block mb-1">
              {activeProject.category}
            </span>
            <h3 className="text-2xl font-extrabold text-content-primary mb-3">
              {activeProject.name}
            </h3>

            <p className="text-sm text-content-secondary leading-relaxed mb-6 font-normal">
              {activeProject.description}
            </p>

            <div className="bg-surface-bg border border-line-border rounded-xl p-4 mb-6">
              <div className="text-xs font-bold text-content-primary mb-2">
                Tech Stack Specifications
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tech.map((t, i) => (
                  <span key={i} className="text-xs font-mono px-2 py-1 rounded bg-white border border-line-border text-content-primary">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line-border">
              <button
                onClick={() => setActiveProject(null)}
                className="px-4 py-2 rounded-btn text-xs font-semibold text-content-secondary hover:bg-surface-subtle"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setActiveProject(null);
                  onOpenContact();
                }}
                className="px-5 py-2 rounded-btn bg-content-primary hover:bg-brand-blue text-white text-xs font-semibold transition-colors"
              >
                Request Architecture Overview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
