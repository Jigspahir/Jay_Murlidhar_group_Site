import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function EducationTechnology() {
  return (
    <section id="focus" className="py-12 sm:py-14 lg:py-16 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] mb-8 lg:mb-10">
          <span className="font-mono text-[#2563EB] font-bold">02 &mdash;</span>
          <span className="text-[#1E293B]">EDUCATION &times; TECHNOLOGY</span>
        </div>

        {/* Two-Column Editorial Composition (NO CARDS) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Subtle Vertical Connection Line in Center (Desktop) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#E2E8F0] -translate-x-1/2" />

          {/* Left Column: 01 EDUCATION */}
          <div className="lg:pr-12">
            <span className="font-mono text-xs font-bold text-[#2563EB] tracking-wider mb-3 block">
              PILLAR 01
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#111827] tracking-tight leading-[1.1] mb-6">
              EDUCATION
            </h2>

            <p className="text-lg sm:text-xl text-[#1E293B] leading-relaxed font-normal mb-6">
              We create solutions for students, institutions and educators.
            </p>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal mb-10">
              From automated university administrative workflows to modern learner portals, our education systems are built to eliminate paperwork and empower institutions with synchronized real-time data.
            </p>

            <a
              href="#education-details"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm sm:text-base font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group"
            >
              <span>Explore Education</span>
              <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Visual Connecting Conduit on Mobile (Section 8 Requirement) */}
          <div className="lg:hidden flex items-center justify-center -my-6">
            <div className="flex flex-col items-center gap-1.5 py-2">
              <div className="w-[1.5px] h-8 bg-gradient-to-b from-[#2563EB] to-[#7C3AED]" />
              <span className="font-mono text-xs font-bold text-[#7C3AED]">&darr;</span>
            </div>
          </div>

          {/* Right Column: 02 TECHNOLOGY */}
          <div className="lg:pl-12">
            <span className="font-mono text-xs font-bold text-[#7C3AED] tracking-wider mb-3 block">
              PILLAR 02
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#111827] tracking-tight leading-[1.1] mb-6">
              TECHNOLOGY
            </h2>

            <p className="text-lg sm:text-xl text-[#1E293B] leading-relaxed font-normal mb-6">
              We build software, digital platforms and technology solutions.
            </p>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal mb-10">
              Modern digital engineering built with scalable cloud services, resilient APIs, and intuitive user experiences that turn complex organizational operations into fluid digital workflows.
            </p>

            <a
              href="#technology-details"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm sm:text-base font-semibold text-[#111827] hover:text-[#7C3AED] transition-colors group"
            >
              <span>Explore Technology</span>
              <ArrowRight className="w-4 h-4 text-[#7C3AED] transition-transform group-hover:translate-x-1" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
