import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Careers Section Subcomponents
import CareersHero from '../components/careers/CareersHero';
import WhyJMGSection from '../components/careers/WhyJMGSection';
import JobDirectorySection from '../components/careers/JobDirectorySection';
import WorkingDivisionsSection from '../components/careers/WorkingDivisionsSection';
import WorkCultureSection from '../components/careers/WorkCultureSection';
import RecruitmentProcessSection from '../components/careers/RecruitmentProcessSection';
import InternshipCrossLink from '../components/careers/InternshipCrossLink';
import CareersCTA from '../components/careers/CareersCTA';

export default function Careers() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  // Scroll to top or anchor on mount
  useEffect(() => {
    if (window.location.hash) {
      const elem = document.querySelector(window.location.hash);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#FFFFFF] text-[#0F172A] min-h-screen selection:bg-blue-100 selection:text-blue-900 font-sans">
      
      {/* 01 BREADCRUMB NAVIGATION */}
      <div className="border-b border-[#E2E8F0] bg-[#FAFAFA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Link to="/" className="hover:text-[#0F172A] transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-semibold text-[#0F172A] tracking-wider uppercase">
              CAREERS
            </span>
          </nav>
        </div>
      </div>

      {/* 02 HERO SECTION */}
      <CareersHero />

      {/* 03 WHY WORK WITH JMG */}
      <WhyJMGSection />

      {/* 04 CAREER DIRECTORY & FILTERABLE OPPORTUNITIES */}
      <JobDirectorySection onOpenContact={onOpenContact} />

      {/* 05 JMG WORKING DIVISIONS */}
      <WorkingDivisionsSection />

      {/* 06 WORK CULTURE & LIVING PRINCIPLES */}
      <WorkCultureSection />

      {/* 07 RECRUITMENT PROCESS (5-STAGE INTERACTIVE TIMELINE) */}
      <RecruitmentProcessSection />

      {/* 08 ACADEMIC INNOVATION INTERNSHIP CROSS-LINK */}
      <InternshipCrossLink />

      {/* 09 FINAL CALL TO ACTION */}
      <CareersCTA onOpenContact={onOpenContact} />

    </div>
  );
}
