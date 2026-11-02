import React from 'react';
import { 
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { WHO_CAN_APPLY } from '../../data/academicInnovationData';

export default function WhoCanApply({ onOpenContact }) {
  return (
    <section id="eligibility" className="py-16 lg:py-24 bg-[#FAFAFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>06 — CANDIDATE PROFILES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Opportunities for Aspiring Learners.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            We welcome students across varied academic semesters and backgrounds. Rather than rigid mark cut-offs, our focus centers on commitment, curiosity, and willingness to build real-world skills.
          </p>
        </div>

        {/* 5 Audience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {WHO_CAN_APPLY.map((group, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {group.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {group.category}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {group.details}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Eligible for Internship Enquiry</span>
              </div>
            </div>
          ))}

          {/* Quick Enquire Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-md">
            <div>
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block mb-2">
                Unsure About Fit?
              </span>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Consult with our Academic Mentors
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Reach out with your course syllabus and university project guidelines. We will guide you toward the right department.
              </p>
            </div>

            <button
              onClick={onOpenContact}
              className="mt-6 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              <span>Connect with Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clear Mandatory Note */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-3 max-w-4xl">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            <strong>Important Policy Note:</strong> Eligibility and selection requirements may vary depending on the internship opportunity, active project constraints, and current mentor availability. JMG does not enforce arbitrary percentage cut-offs, but candidates are evaluated based on foundational aptitude and alignment with project tasks.
          </p>
        </div>

      </div>
    </section>
  );
}
