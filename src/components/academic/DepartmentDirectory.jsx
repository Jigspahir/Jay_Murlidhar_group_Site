import React, { useState } from 'react';
import { 
  Code2, 
  Megaphone, 
  Users, 
  Calculator, 
  Briefcase, 
  Palette, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Laptop,
  Building2
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/academicInnovationData';

const ICONS = {
  Code2,
  Megaphone,
  Users,
  Calculator,
  Briefcase,
  Palette,
  Headphones
};

export default function DepartmentDirectory({ onOpenContact }) {
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0].id);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];
  const ActiveIcon = ICONS[activeDept.iconName] || Code2;

  return (
    <section id="departments" className="py-16 lg:py-24 bg-white border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>03 — INTERNSHIP DEPARTMENTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Explore Opportunities Across Multiple Domains.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Discover multi-disciplinary tracks tailored to engineering, commerce, management, arts, and creative degree paths. Select any department to inspect learning areas and delivery formats.
          </p>
        </div>

        {/* Master-Detail Interactive Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Department Navigation List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Academic Department ({DEPARTMENTS.length})
            </div>

            <div className="space-y-2">
              {DEPARTMENTS.map((dept) => {
                const isSelected = dept.id === activeDept.id;
                const DeptIcon = ICONS[dept.iconName] || Layers;

                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-500 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 group-hover:text-blue-600'
                      }`}>
                        <DeptIcon className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono font-bold ${
                            isSelected ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {dept.number}
                          </span>
                          <span className="font-bold text-sm tracking-tight">
                            {dept.name}
                          </span>
                        </div>
                        <span className={`text-[11px] block mt-0.5 line-clamp-1 ${
                          isSelected ? 'text-slate-300' : 'text-slate-500 font-normal'
                        }`}>
                          {dept.specializations.slice(0, 3).join(', ')}...
                        </span>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Department Detail Panel (7 cols) */}
          <div className="lg:col-span-7 sticky top-28">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-9 space-y-6">
              
              {/* Header with Title and Mode Badges */}
              <div className="pb-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      DEPARTMENT {activeDept.number}
                    </span>
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {activeDept.supportedModes}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>Online</span>
                    <span className="text-slate-300">&bull;</span>
                    <Building2 className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Offline</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 mt-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                    <ActiveIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {activeDept.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-600 font-medium">
                      Curriculum-oriented practical learning track
                    </p>
                  </div>
                </div>
              </div>

              {/* Department Overview */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Domain Overview
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                  {activeDept.overview}
                </p>
              </div>

              {/* Learning Areas & Specializations Checklist */}
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Core Specializations &amp; Learning Modules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDept.specializations.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Academic Backgrounds */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Ideal Academic Backgrounds
                </span>
                <p className="text-xs text-slate-700 font-normal">
                  {activeDept.targetDegrees}
                </p>
              </div>

              {/* Verification & Capacity Transparency Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <strong>Intake Transparency:</strong> Listed specializations represent core academic competencies. Individual internship openings are allocated based on active project mentor availability and current university intake cycles.
                </p>
              </div>

              {/* Enquiry Action */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-slate-500">
                  Ready to enquire for {activeDept.shortName}?
                </span>
                <button
                  onClick={onOpenContact}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>Enquire for {activeDept.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
