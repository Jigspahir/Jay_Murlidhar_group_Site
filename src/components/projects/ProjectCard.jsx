import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Globe,
  Layers,
  Server,
  Users,
  Smartphone,
  Cpu,
  Cloud,
  ShoppingBag,
  BarChart3,
  GraduationCap,
  Package,
  Calendar,
  UserCheck,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Icon mapper for dynamic icons
const ICONS = {
  Globe,
  Layers,
  Server,
  Users,
  Smartphone,
  Cpu,
  Cloud,
  ShoppingBag,
  BarChart3,
  GraduationCap,
  Package,
  Calendar,
  UserCheck,
  FileText,
  TrendingUp
};

export default function ProjectCard({ project, onSelect, isFeatured = false }) {
  const IconComponent = ICONS[project.icon] || Layers;

  if (isFeatured) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col lg:flex-row group">
        {/* Left/Content Side */}
        <div className="p-7 sm:p-9 lg:w-7/12 flex flex-col justify-between">
          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {project.type === 'service' ? '01 — SERVICE' : '02 — PRODUCT'}
              </span>
              <span className="text-[11px] font-mono font-semibold tracking-wide uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                {project.category}
              </span>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Concept Prototype
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2.5 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-blue-600 mb-3">
              {project.subCategory}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
              {project.shortDesc}
            </p>

            {/* Feature Highlights */}
            {project.features && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {project.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.techStack?.map((tech, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Illustrative Prototype &bull; Architectural Model
            </span>
            <button
              onClick={() => onSelect(project)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-all group-hover:shadow-sm"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Visual Simulated Device / Dashboard Panel */}
        <div className="lg:w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 relative overflow-hidden">
          {/* Subtle ambient light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Simulated App Frame Header */}
          <div className="bg-slate-800/90 rounded-t-xl border border-slate-700/80 p-3 flex items-center justify-between mb-4 shadow-md backdrop-blur">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[11px] font-mono text-slate-400 truncate max-w-[180px]">
              {project.id}.prototype.jmg
            </div>
            <div className="w-4" />
          </div>

          {/* Simulated App Dashboard Canvas */}
          <div className="bg-slate-900/90 rounded-b-xl border-x border-b border-slate-700/80 p-5 space-y-4 mb-4 backdrop-blur shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">{project.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{project.category}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE MOCKUP
              </span>
            </div>

            {/* Simulated Data Rows */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-800/50">
                <span className="text-slate-400 font-mono text-[11px]">Primary Framework</span>
                <span className="text-slate-200 font-semibold text-[11px]">{project.techStack?.[0] || 'React'}</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-800/50">
                <span className="text-slate-400 font-mono text-[11px]">Database Layer</span>
                <span className="text-slate-200 font-semibold text-[11px]">{project.techStack?.find(t => t.includes('SQL') || t.includes('Mongo') || t.includes('Redis')) || 'PostgreSQL'}</span>
              </div>
              <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-800/50">
                <span className="text-slate-400 font-mono text-[11px]">Deployment Target</span>
                <span className="text-slate-200 font-semibold text-[11px]">Cloud Container / Node</span>
              </div>
            </div>
          </div>

          {/* Mandatory Demo Labeling on Visual */}
          <div className="text-center pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/60 inline-block">
              Demo Concept &bull; Illustrative Only
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Editorial Card
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Header & Simulated Mini Banner */}
        <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-105 transition-transform">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-600 block">
                {project.category}
              </span>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {project.name}
              </h4>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
            {project.shortDesc}
          </p>

          {/* Key Feature Bullets */}
          {project.features && (
            <div className="space-y-1.5 mb-5">
              {project.features.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack?.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action & Demo Notice */}
      <div className="p-5 pt-0">
        <div className="mb-3 px-2.5 py-1 rounded bg-amber-50/80 border border-amber-200/60 text-[10px] font-mono text-amber-800 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate">DEMO CONCEPT &bull; Illustrative model</span>
        </div>

        <button
          onClick={() => onSelect(project)}
          className="w-full py-2.5 px-3.5 rounded-lg bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white text-xs font-semibold border border-slate-200 hover:border-slate-900 transition-all duration-200 flex items-center justify-between group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
