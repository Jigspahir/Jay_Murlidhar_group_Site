import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Code2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, onOpenContact }) {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {project.type === 'service' ? '01 — SERVICE SOLUTION' : '02 — DIGITAL PRODUCT'}
            </span>
            <span className="text-[11px] font-mono font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {project.category}
            </span>
          </div>

          <h3 id="modal-project-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 mb-2">
            {project.name}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            {project.subCategory}
          </p>
        </div>

        {/* Mandatory Transparency Disclaimer Box */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs font-medium text-amber-900 leading-relaxed">
            <strong className="font-bold">DEMO CONCEPT</strong> — Illustrative project presentation, not a verified client deployment. Designed by Jay Murlidhar Tech Solutions as an architectural capability prototype.
          </p>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-200px)] overflow-y-auto">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
              Architecture Overview
            </h4>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {project.fullDesc || project.shortDesc}
            </p>
          </div>

          {/* Problem vs Proposed Solution Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                The Operational Challenge
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 block mb-1.5">
                Engineering Approach
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {project.proposedSolution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3">
                Key System Capabilities &amp; Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Architecture */}
          {project.techStack && project.techStack.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Recommended Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:px-8 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Architecture &amp; Feasibility Consultation</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onOpenContact) onOpenContact();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <span>Discuss Custom Solution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
