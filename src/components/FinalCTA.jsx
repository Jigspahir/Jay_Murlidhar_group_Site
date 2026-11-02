import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA({ 
  onOpenContact,
  eyebrow = "START COLLABORATION",
  sectionNumber = "11",
  headline,
  description = "Whether you're a student, institution, entrepreneur or business, let's explore what's possible together. Connect with our engineering and operational teams.",
  buttonText = "Start a Conversation"
}) {
  return (
    <section className="pt-12 sm:pt-14 lg:pt-16 pb-10 sm:pb-12 bg-[#FAFAFA] relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#2563EB]">{sectionNumber} —</span>
            <span className="text-[#1E293B]">{eyebrow}</span>
          </div>

          <h2 className="fluid-section-heading font-bold text-[#111827] mb-4 sm:mb-5">
            {headline || (
              <>
                HAVE AN IDEA?<br />
                LET'S BUILD<br className="sm:hidden" /> SOMETHING.
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal mb-6 sm:mb-8 max-w-xl">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 sm:px-7 py-3 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white font-medium text-sm transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/ecosystem"
              className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 sm:px-7 py-3 rounded-[10px] bg-white hover:bg-slate-100 text-[#111827] font-medium text-sm border border-[#E2E8F0] transition-colors duration-200"
            >
              <span>Explore JMG</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
