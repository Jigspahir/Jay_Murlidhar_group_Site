import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronRight, ArrowRight, GraduationCap } from 'lucide-react';
import AcademicHero from '../components/academic/AcademicHero';
import InternshipModesSection from '../components/academic/InternshipModesSection';
import DepartmentDirectory from '../components/academic/DepartmentDirectory';
import InternshipJourney from '../components/academic/InternshipJourney';
import WhatYouCanLearn from '../components/academic/WhatYouCanLearn';
import WhoCanApply from '../components/academic/WhoCanApply';
import AcademicFAQ from '../components/academic/AcademicFAQ';

export default function AcademicInnovation() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 font-sans">
      
      {/* 01 Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Link to="/" className="hover:text-slate-900 transition-colors">HOME</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/about" className="hover:text-slate-900 transition-colors">ABOUT</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-blue-600 uppercase">ACADEMIC INNOVATION</span>
          </nav>
        </div>
      </div>

      {/* SECTION 01 — HERO EXPERIENCE */}
      <AcademicHero onOpenContact={onOpenContact} />

      {/* SECTION 02 — INTERNSHIP MODES (ONLINE / OFFLINE) */}
      <InternshipModesSection onOpenContact={onOpenContact} />

      {/* SECTION 03 — INTERNSHIP DEPARTMENTS (INTERACTIVE DIRECTORY) */}
      <DepartmentDirectory onOpenContact={onOpenContact} />

      {/* SECTION 04 — INTERNSHIP JOURNEY (TIMELINE) */}
      <InternshipJourney onOpenContact={onOpenContact} />

      {/* SECTION 05 — WHAT YOU CAN LEARN */}
      <WhatYouCanLearn />

      {/* SECTION 06 — WHO CAN APPLY? */}
      <WhoCanApply onOpenContact={onOpenContact} />

      {/* SECTION 07 — FREQUENTLY ASKED QUESTIONS */}
      <AcademicFAQ onOpenContact={onOpenContact} />

      {/* SECTION 08 — FINAL CTA */}
      <section className="py-20 lg:py-24 bg-[#0F172A] text-white relative overflow-hidden">
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#EA580C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400 mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Get Started With JMG</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              YOUR NEXT LEARNING EXPERIENCE STARTS HERE.
            </h2>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed mb-8 max-w-2xl mx-auto">
              Take the first step towards practical learning and professional growth. Connect with our mentorship and coordination team today.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all group"
              >
                <span>Enquire About Internships</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors"
              >
                <span>General Contact Details</span>
              </Link>
            </div>

            {/* Footer Trust Note */}
            <div className="mt-8 text-xs font-mono text-slate-400">
              Jay Murlidhar Group &bull; Academic &amp; Internship Initiative &bull; Gujarat, India
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
