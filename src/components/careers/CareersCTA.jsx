import React from 'react';
import { ArrowDown, Mail, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CareersCTA({ onOpenContact }) {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#F8FAFC] relative overflow-hidden">
      {/* Subtle ambient blur */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-blue-100/40 via-orange-100/20 to-transparent rounded-full blur-3xl pointer-events-none"
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>JOIN JAY MURLIDHAR GROUP</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-5">
            READY TO MAKE <br className="hidden sm:inline" />
            AN IMPACT?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-8">
            Your skills. Your ambition. Your next opportunity.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#job-directory"
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              <Briefcase className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>Explore Careers</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </a>

            {onOpenContact ? (
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm border border-[#CBD5E1] shadow-sm transition-all duration-200 hover:border-slate-400"
              >
                <Mail className="w-4 h-4 text-[#EA580C]" />
                <span>Contact JMG</span>
              </button>
            ) : (
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-sm border border-[#CBD5E1] shadow-sm transition-all duration-200 hover:border-slate-400"
              >
                <Mail className="w-4 h-4 text-[#EA580C]" />
                <span>Contact JMG</span>
              </Link>
            )}
          </div>

          {/* Subtext */}
          <p className="text-xs font-mono text-slate-400 mt-6">
            Centralized Recruitment &bull; Gandhinagar, Gujarat &bull; Jay Murlidhar Group
          </p>

        </div>
      </div>
    </section>
  );
}

