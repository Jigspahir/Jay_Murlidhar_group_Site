import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA({ onOpenContact }) {
  return (
    <section className="pt-[72px] sm:pt-[76px] lg:pt-[84px] pb-[64px] sm:pb-[70px] lg:pb-[76px] bg-[#FAFAFA] border-b border-[#E2E8F0] relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column (Approx 55%): CTA */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">11 —</span>
              <span className="text-[#1E293B]">START COLLABORATION</span>
            </div>

            <h2 className="fluid-section-heading font-bold text-[#111827] mb-4 sm:mb-5">
              HAVE AN IDEA?<br />
              LET'S BUILD<br className="sm:hidden" /> SOMETHING.
            </h2>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed font-normal mb-6 sm:mb-8 max-w-xl">
              Whether you're a student, institution, entrepreneur or business, let's explore what's possible together. Connect with our engineering and operational teams.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 sm:px-7 py-3 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white font-medium text-sm transition-colors duration-200 shadow-sm"
              >
                <span>Start a Conversation</span>
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

          {/* Right Column (Approx 45%): JMG Group Intro */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#E2E8F0] lg:pl-12 xl:pl-16 flex flex-col justify-center">
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
              <span>JAY MURLIDHAR GROUP</span>
            </div>

            {/* Official JMG Logo (Original proportions and colors) */}
            <Link to="/" className="inline-block mb-4 sm:mb-5 focus:outline-none">
              <img 
                src="/assets/jay-murlidhar-group-logo.png" 
                alt="Jay Murlidhar Group" 
                className="h-10 sm:h-11 w-auto object-contain"
                loading="lazy"
              />
            </Link>

            {/* Parent Brand Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight mb-2">
              JAY MURLIDHAR GROUP
            </h3>

            {/* Tagline */}
            <div className="text-sm sm:text-base font-semibold text-[#1E293B] mb-2 sm:mb-3">
              Education. Technology. Business. Innovation.
            </div>

            {/* Supporting Statement */}
            <p className="text-xs sm:text-sm text-[#64748B] font-normal leading-relaxed">
              One Group. Multiple Businesses. One Ecosystem.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
