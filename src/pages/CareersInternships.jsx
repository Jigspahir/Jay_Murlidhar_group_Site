import React, { useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { 
  ChevronRight, 
  GraduationCap, 
  Laptop, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Calendar, 
  BookOpen, 
  Check,
  Compass
} from 'lucide-react';
import FinalCTA from '../components/FinalCTA';

export default function CareersInternships() {
  const location = useLocation();
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;
  const initialPrefill = location.state || {};

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    collegeUniversity: '',
    course: '',
    yearSemester: '3rd Year / 5th-6th Sem',
    preferredDomain: initialPrefill.domain || 'IT / Technology',
    internshipMode: initialPrefill.internshipMode || 'Online',
    preferredDuration: '3 Months',
    skills: '',
    resumeFileName: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, resumeFileName: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FFFFFF] text-[#0B1220] min-h-screen">
      
      {/* 01 BREADCRUMB */}
      <div className="border-b border-[#E2E8F0] bg-[#FAFAFA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <Link to="/" className="hover:text-[#0B1220] transition-colors">HOME</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <Link to="/careers" className="hover:text-[#0B1220] transition-colors">CAREERS</Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="font-semibold text-[#0B1220] tracking-wider uppercase">INTERNSHIP PROGRAM</span>
          </nav>
        </div>
      </div>

      {/* 02 HEADER */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAFAFA] to-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-mono font-semibold uppercase tracking-[0.16em] mb-4 text-[#9333EA]">
              <GraduationCap className="w-3.5 h-3.5 text-[#9333EA]" />
              <span>INDUSTRY LEARNING &amp; EXPERIENCE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight mb-4">
              JMG INTERNSHIP PROGRAM.
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              Gain practical industry experience through internship opportunities designed around your academic background, skills and career goals. Available in both Online (Remote) and Offline (Onsite) formats across core domains.
            </p>
          </div>
        </div>
      </section>

      {/* 03 DETAILED INTERNSHIP EXPERIENCE BREAKDOWN */}
      <section className="py-14 sm:py-16 lg:py-20 border-b border-[#E2E8F0] bg-[#FAFAFA]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mb-10">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0284C7] mb-2">
              Structured Framework
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
              Flexible Modes Built Around Your Academics.
            </h2>
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
            
            {/* ONLINE INTERNSHIP */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-[10px] bg-blue-50 text-[#0284C7] flex items-center justify-center border border-blue-100">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-[#0284C7] font-semibold bg-blue-50 px-2.5 py-1 rounded-full">
                    REMOTE WORKSPACE
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                  ONLINE INTERNSHIP
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                  Remote / Online learning and practical work designed for students who want to gain verified industry exposure alongside university coursework without daily commuting.
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-[#334155]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Cloud-hosted code repositories, task boards &amp; asynchronous communication</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Direct weekly code and milestone reviews with senior technical mentors</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Flexible schedule adapted to examination dates and college schedules</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs font-mono text-[#64748B]">
                Available across IT / Technology, HR, and Finance
              </div>
            </div>

            {/* OFFLINE INTERNSHIP */}
            <div className="p-6 sm:p-8 bg-white border border-[#E2E8F0] rounded-[16px] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-[10px] bg-emerald-50 text-[#10B981] flex items-center justify-center border border-emerald-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-[#10B981] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                    ON-SITE FACILITY
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                  OFFLINE INTERNSHIP
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                  On-site practical industry experience at JMG offices and campus development hubs, working in direct collaboration with operational and engineering squads.
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-[#334155]">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Daily in-person engineering scrums and hardware procurement exposure</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Participation in real-world campus ERP deployment and institutional testing</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                    <span>Professional office environment fostering interpersonal teamwork</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-xs font-mono text-[#64748B]">
                Located at JMG Regional Facilities &bull; Gujarat
              </div>
            </div>

          </div>

          {/* Academic Profile Customization Highlights */}
          <div className="p-6 sm:p-8 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm">
            <h4 className="text-base font-bold text-[#0B1220] mb-2">
              Designed Around Your Individual Academic Profile
            </h4>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6 max-w-2xl">
              We align our project assignments with your university guidelines, semester deliverables, and technical curiosities rather than assigning repetitive clerical tasks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[#0284C7] font-bold uppercase mb-1">By Degree / Course</div>
                <div className="text-slate-600">B.Tech, BCA, MCA, Diploma, BBA, MBA, B.Com, and allied programs.</div>
              </div>

              <div className="p-4 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[#8B5CF6] font-bold uppercase mb-1">By Core Domain</div>
                <div className="text-slate-600">Full-Stack Web, React/Vite, Node.js, Campus ERP, HR Ops, Corporate Accounts.</div>
              </div>

              <div className="p-4 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[#10B981] font-bold uppercase mb-1">By Duration</div>
                <div className="text-slate-600">Short-term summer/winter sprints (1-2 months) or full-semester projects (3-6 months).</div>
              </div>

              <div className="p-4 rounded-[10px] bg-[#FAFAFA] border border-[#E2E8F0]">
                <div className="font-mono text-[#F59E0B] font-bold uppercase mb-1">By Learning Goals</div>
                <div className="text-slate-600">Build portfolio-grade code, learn clean Git practices, and master production architecture.</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 04 INTERNSHIP APPLICATION FORM SECTION */}
      <section className="py-14 sm:py-18 lg:py-20 bg-white border-b border-[#E2E8F0]" id="apply-internship">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto">
            
            <div className="p-6 sm:p-10 rounded-[20px] border border-[#E2E8F0] bg-[#FAFAFA] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              
              {submitted ? (
                <div className="py-12 text-center animate-in fade-in duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0B1220] mb-2">Internship Enquiry Received</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed max-w-md mx-auto mb-6">
                    Thank you, <span className="font-semibold text-[#0B1220]">{formData.fullName}</span>. Your internship application for <span className="font-semibold text-[#0B1220]">{formData.preferredDomain} ({formData.internshipMode})</span> has been logged. Our student mentorship coordinators will review your course details and reach out.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        mobileNumber: '',
                        email: '',
                        collegeUniversity: '',
                        course: '',
                        yearSemester: '3rd Year / 5th-6th Sem',
                        preferredDomain: 'IT / Technology',
                        internshipMode: 'Online',
                        preferredDuration: '3 Months',
                        skills: '',
                        resumeFileName: ''
                      });
                    }}
                    className="px-6 py-3 rounded-[10px] bg-[#0B1220] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <div>
                  
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#9333EA] mb-2">
                    <GraduationCap className="w-4 h-4 text-[#9333EA]" />
                    <span>STUDENT ENROLMENT INTAKE</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight mb-2">
                    APPLY FOR INTERNSHIP
                  </h2>

                  <p className="text-xs sm:text-sm text-[#64748B] mb-8 leading-relaxed">
                    Please provide your authentic academic credentials, course schedule, and preferred mode of engagement.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                      />
                    </div>

                    {/* Mobile Number & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.mobileNumber}
                          onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="student@university.edu"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>
                    </div>

                    {/* College / University & Course */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          College / University *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Swarnim Startup & Innovation University"
                          value={formData.collegeUniversity}
                          onChange={(e) => setFormData({ ...formData, collegeUniversity: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Degree / Course *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. B.Tech Computer Engineering / BCA"
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>
                    </div>

                    {/* Year / Semester & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Current Year / Semester *
                        </label>
                        <select
                          value={formData.yearSemester}
                          onChange={(e) => setFormData({ ...formData, yearSemester: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        >
                          <option value="1st / 2nd Year">1st / 2nd Year</option>
                          <option value="3rd Year / 5th-6th Sem">3rd Year / 5th-6th Sem</option>
                          <option value="Final Year / 7th-8th Sem">Final Year / 7th-8th Sem</option>
                          <option value="Recent Graduate">Recent Graduate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Preferred Duration *
                        </label>
                        <select
                          value={formData.preferredDuration}
                          onChange={(e) => setFormData({ ...formData, preferredDuration: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        >
                          <option value="1 Month">1 Month Sprint</option>
                          <option value="2 Months">2 Months</option>
                          <option value="3 Months">3 Months (Standard)</option>
                          <option value="6 Months">6 Months (Semester Project)</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Domain & Mode */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Preferred Domain *
                        </label>
                        <select
                          value={formData.preferredDomain}
                          onChange={(e) => setFormData({ ...formData, preferredDomain: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        >
                          <option value="IT / Technology">IT / Technology (Web, Cloud, Apps)</option>
                          <option value="HR">HR &amp; People Operations</option>
                          <option value="Finance">Finance, Audit &amp; Accounts</option>
                          <option value="Other">Other / Custom Domain based on Course</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Internship Mode *
                        </label>
                        <select
                          value={formData.internshipMode}
                          onChange={(e) => setFormData({ ...formData, internshipMode: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        >
                          <option value="Online">Online (Remote Practical Learning)</option>
                          <option value="Offline">Offline (Onsite Facility)</option>
                          <option value="Either">Either (Open to Both)</option>
                        </select>
                      </div>
                    </div>

                    {/* Skills / Areas of Interest */}
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                        Skills / Areas of Interest
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. JavaScript, React, Python, Excel, Business Writing, or subjects you've excelled at in college..."
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                      />
                    </div>

                    {/* Resume Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                        Resume / CV Upload (PDF / DOC)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="internship-resume-input"
                        />
                        <label
                          htmlFor="internship-resume-input"
                          className="w-full px-3.5 py-3 rounded-[8px] border border-dashed border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs text-[#64748B] flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <span className="truncate">
                            {formData.resumeFileName || 'Select resume file from device...'}
                          </span>
                          <Upload className="w-4 h-4 text-[#9333EA] flex-shrink-0 ml-2" />
                        </label>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className="w-full min-h-[46px] mt-2 py-3 px-6 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <span>APPLY FOR INTERNSHIP</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                  </form>

                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 05 FINAL CTA */}
      <FinalCTA onOpenContact={onOpenContact} />

    </div>
  );
}
