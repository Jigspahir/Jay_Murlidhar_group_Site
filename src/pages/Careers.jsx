import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowRight, 
  Briefcase, 
  GraduationCap, 
  Laptop, 
  Building2, 
  Compass, 
  CheckCircle2, 
  Users, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import FinalCTA from '../components/FinalCTA';

export default function Careers() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  // Interactive Opportunity Selector state
  const [userType, setUserType] = useState('Student');
  const [lookingFor, setLookingFor] = useState('Internship');
  const [internshipMode, setInternshipMode] = useState('Online');
  const [domain, setDomain] = useState('IT / Technology');

  // Handle Opportunity Selector submission
  const handleFindOpportunity = (e) => {
    e.preventDefault();
    if (lookingFor === 'Internship') {
      navigate('/careers/internships', {
        state: { userType, lookingFor, internshipMode, domain }
      });
    } else {
      navigate('/careers/jobs', {
        state: { userType, lookingFor, domain }
      });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0B1220] min-h-screen">
      
      {/* 01 BREADCRUMB HEADER */}
      <div className="border-b border-[#E2E8F0] bg-[#FAFAFA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Link to="/" className="hover:text-[#0B1220] transition-colors">HOME</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-semibold text-[#0B1220] tracking-wider uppercase">CAREERS &amp; INTERNSHIPS</span>
          </nav>
        </div>
      </div>

      {/* 02 HERO HEADER */}
      <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 bg-gradient-to-b from-[#FAFAFA] to-[#FFFFFF] border-b border-[#E2E8F0] overflow-hidden">
        {/* Subtle Brand Ambient Backlight */}
        <div 
          className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#EDE9FE]/40 via-[#E0E7FF]/25 to-transparent blur-[90px] pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -top-20 -right-20 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-[#ECFDF5]/40 via-[#E0F2FE]/30 to-transparent blur-[90px] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs font-mono font-semibold uppercase tracking-[0.16em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
              <span className="text-[#0284C7]">CAREERS</span>
              <span className="text-slate-300 font-sans font-normal">&times;</span>
              <span className="text-[#9333EA]">INTERNSHIPS</span>
            </div>

            {/* Page Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0B1220] tracking-[-0.03em] leading-[1.08] mb-5">
              BUILD YOUR CAREER<br />
              WITH <span className="bg-gradient-to-r from-[#0099FF] via-[#06B6D4] to-[#D946EF] bg-clip-text text-transparent">JMG.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-2xl mb-8">
              Whether you're starting your career or building industry experience, find an opportunity that fits your journey.
            </p>

            {/* Quick Navigation Jump Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#careers-overview"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-blue-300" />
                <span>Careers Overview</span>
              </a>
              <a
                href="#internships-overview"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-white hover:bg-slate-50 text-[#0B1220] font-semibold text-xs sm:text-sm border border-[#E2E8F0] shadow-sm transition-all"
              >
                <GraduationCap className="w-4 h-4 text-[#9333EA]" />
                <span>Internships Overview</span>
              </a>
              <a
                href="#opportunity-selector"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-blue-50/80 hover:bg-blue-100/80 text-[#0284C7] font-semibold text-xs sm:text-sm border border-blue-200/70 transition-all"
              >
                <Compass className="w-4 h-4 text-[#0284C7]" />
                <span>Opportunity Selector</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 03 TWO PRIMARY SECTIONS: EDITORIAL SPLIT (DESKTOP) / STACKED (MOBILE) */}
      <section className="py-14 sm:py-18 lg:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* ========================================================
                SECTION 01 — CAREERS
            ======================================================== */}
            <div 
              id="careers-overview" 
              className="p-8 sm:p-10 rounded-[18px] border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-blue-300/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0284C7]">
                    <Briefcase className="w-4 h-4 text-[#0284C7]" />
                    <span>SECTION 01</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748B] px-2.5 py-1 rounded-full bg-slate-100">
                    ECOSYSTEM TALENT
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight mb-3">
                  CAREERS
                </h2>

                <p className="text-base text-[#64748B] leading-relaxed mb-6 font-normal">
                  Explore career opportunities with JMG across our business ecosystem.
                </p>

                {/* Structured Opportunities Target Matrix */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Opportunities For
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Freshers</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Experienced Professionals</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Full-Time Roles</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Part-Time Opportunities</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed mb-6">
                  Engage directly in high-availability enterprise web solutions, campus management suites, digital commerce hardware, and multi-sector corporate operations.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/careers/jobs"
                  className="inline-flex items-center justify-between w-full px-6 py-3.5 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-sm transition-all group shadow-sm"
                >
                  <span>VIEW CAREER OPPORTUNITIES</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>


            {/* ========================================================
                SECTION 02 — INTERNSHIPS
            ======================================================== */}
            <div 
              id="internships-overview" 
              className="p-8 sm:p-10 rounded-[18px] border border-[#E2E8F0] bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-purple-300/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#9333EA]">
                    <GraduationCap className="w-4 h-4 text-[#9333EA]" />
                    <span>SECTION 02</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#64748B] px-2.5 py-1 rounded-full bg-slate-100">
                    INDUSTRY EXPOSURE
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight mb-3">
                  INTERNSHIPS
                </h2>

                <p className="text-base text-[#64748B] leading-relaxed mb-6 font-normal">
                  Gain practical industry experience through internship opportunities designed around your academic background, skills and career goals.
                </p>

                {/* Practical Highlights Grid */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-semibold mb-2">
                    Internship Formats &amp; Domains
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <Laptop className="w-4 h-4 text-[#0284C7] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#0B1220]">Online Internships</div>
                        <div className="text-[11px] text-[#64748B]">Remote &amp; structured digital work</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <Building2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-[#0B1220]">Offline Internships</div>
                        <div className="text-[11px] text-[#64748B]">On-site practical workplace exposure</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                      <span className="text-sm font-semibold text-[#0B1220]">IT / Technology</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      <span className="text-sm font-semibold text-[#0B1220]">HR &amp; Operations</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Finance &amp; Accounts</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-3 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span className="text-sm font-semibold text-[#0B1220]">Custom Domains (Course-based)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed mb-6">
                  Work on production codebases, campus ERP modules, and corporate business workflows under the guidance of active senior practitioners.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/careers/internships"
                  className="inline-flex items-center justify-between w-full px-6 py-3.5 rounded-[10px] bg-white hover:bg-slate-50 text-[#0B1220] font-semibold text-sm border border-[#E2E8F0] shadow-sm transition-all group"
                >
                  <span>EXPLORE INTERNSHIPS</span>
                  <ArrowRight className="w-4 h-4 text-[#0B1220] group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 04 INTERNSHIP EXPERIENCE: CLEAR COMMUNICATION & ALIGNMENT */}
      <section className="py-14 sm:py-16 lg:py-20 bg-[#FAFAFA] border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-12">
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0284C7] mb-2">
              PRACTICAL LEARNING ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight mb-4">
              THE JMG INTERNSHIP EXPERIENCE.
            </h2>
            <p className="text-base text-[#64748B] leading-relaxed">
              We provide structured, verified industry internships that bridge academic learning with commercial engineering and operations.
            </p>
          </div>

          {/* ONLINE vs OFFLINE Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            
            {/* ONLINE Box */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
              <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-[#0284C7] flex items-center justify-center mb-5 border border-blue-100">
                <Laptop className="w-5 h-5" />
              </div>
              <div className="font-mono text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
                FORMAT 01
              </div>
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                ONLINE INTERNSHIPS
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-5">
                Remote / Online learning and practical work designed for students and graduates balancing ongoing university courses or distant geographic locations.
              </p>
              <ul className="space-y-2 text-xs text-[#334155]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Remote code repositories, PR workflows &amp; issue tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Weekly scheduled technical reviews with senior leads</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Flexible pacing aligned with academic examination cycles</span>
                </li>
              </ul>
            </div>

            {/* OFFLINE Box */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm">
              <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-[#10B981] flex items-center justify-center mb-5 border border-emerald-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="font-mono text-xs font-bold text-[#10B981] uppercase tracking-wider mb-1">
                FORMAT 02
              </div>
              <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                OFFLINE INTERNSHIPS
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed mb-5">
                On-site practical industry experience at JMG offices and campus facilities, working alongside engineering, operations, and business management teams.
              </p>
              <ul className="space-y-2 text-xs text-[#334155]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>In-person pair programming and hardware lab access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Direct observation of enterprise client deployments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                  <span>Collaborative workplace culture and peer learning</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Alignment Attributes Banner */}
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-6 sm:p-8 shadow-sm">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748B] mb-4">
              Individualized Academic Alignment
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Degree / Course</div>
              </div>
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Existing Skills</div>
              </div>
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Career Goals</div>
              </div>
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Preferred Domain</div>
              </div>
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Duration</div>
              </div>
              <div className="p-3 rounded-md bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase">Aligned by</div>
                <div className="text-xs font-bold text-[#0B1220] mt-0.5">Online / Offline</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 05 OPPORTUNITY SELECTOR: INTERACTIVE MATCHING ENGINE */}
      <section id="opportunity-selector" className="py-14 sm:py-18 lg:py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0284C7] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>INTERACTIVE NAVIGATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1220] tracking-tight mb-3">
              FIND YOUR OPPORTUNITY.
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              Select your current background and requirements to discover the right pathway in the JMG ecosystem.
            </p>
          </div>

          {/* Interactive Form Card */}
          <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-[20px] border border-[#E2E8F0] bg-[#FAFAFA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <form onSubmit={handleFindOpportunity} className="space-y-8">
              
              {/* Question 01: I'm a... */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mb-3">
                  1. I'm a...
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Student', 'Fresher', 'Experienced Professional'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setUserType(option)}
                      className={`px-4 py-3 rounded-[10px] text-xs sm:text-sm font-semibold border transition-all text-center ${
                        userType === option
                          ? 'bg-[#0B1220] text-white border-[#0B1220] shadow-sm'
                          : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 02: I'm looking for... */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mb-3">
                  2. I'm looking for...
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Internship', 'Full-Time Job', 'Part-Time Opportunity'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setLookingFor(option)}
                      className={`px-4 py-3 rounded-[10px] text-xs sm:text-sm font-semibold border transition-all text-center ${
                        lookingFor === option
                          ? 'bg-[#0B1220] text-white border-[#0B1220] shadow-sm'
                          : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional: If Internship is selected */}
              {lookingFor === 'Internship' && (
                <div className="pt-6 border-t border-[#E2E8F0] space-y-6 animate-in fade-in duration-200">
                  
                  {/* Internship Mode */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mb-3">
                      Internship Mode
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Online', 'Offline', 'Either'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setInternshipMode(mode)}
                          className={`px-3 sm:px-4 py-2.5 rounded-[10px] text-xs font-semibold border transition-all text-center ${
                            internshipMode === mode
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-sm'
                              : 'bg-white text-[#334155] border-[#E2E8F0] hover:bg-slate-50'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Domain */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mb-3">
                      Preferred Domain
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {['IT / Technology', 'HR', 'Finance', 'Other'].map((dom) => (
                        <button
                          key={dom}
                          type="button"
                          onClick={() => setDomain(dom)}
                          className={`px-3 py-2 rounded-[8px] text-xs font-medium border transition-all text-center ${
                            domain === dom
                              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                              : 'bg-white text-[#475569] border-[#E2E8F0] hover:bg-slate-50'
                          }`}
                        >
                          {dom}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* Summary & Submit Action */}
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs text-[#64748B] font-mono">
                  Target: <span className="font-semibold text-[#0B1220]">{userType}</span> &bull; <span className="font-semibold text-[#0B1220]">{lookingFor}</span>
                  {lookingFor === 'Internship' && (
                    <span> ({internshipMode}, {domain})</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-sm"
                >
                  <span>FIND AN OPPORTUNITY</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>

      {/* 06 FINAL CTA SECTION */}
      <FinalCTA onOpenContact={onOpenContact} />

    </div>
  );
}
