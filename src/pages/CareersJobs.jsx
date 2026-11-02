import React, { useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { 
  ChevronRight, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Upload, 
  Send,
  Building,
  Check
} from 'lucide-react';
import FinalCTA from '../components/FinalCTA';

export default function CareersJobs() {
  const location = useLocation();
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;
  const initialPrefill = location.state || {};

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    position: initialPrefill.domain || 'Software Development & Cloud',
    experience: initialPrefill.userType === 'Experienced Professional' ? '3-5 Years' : (initialPrefill.userType === 'Fresher' ? 'Fresher (0-1 Year)' : 'Fresher (0-1 Year)'),
    skills: '',
    resumeFileName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Realistic JMG ecosystem career positions
  const roles = [
    {
      id: 'fullstack-dev',
      title: 'Full-Stack Software Engineer',
      domain: 'IT / Technology',
      entity: 'Jay Murlidhar Tech Solutions',
      location: 'Gujarat (Hybrid / Onsite)',
      type: 'Full-Time',
      experienceLevel: 'Experienced (2-4 Years)',
      description: 'Design and build high-availability web applications, modern React/Node platforms, and cloud database integrations.'
    },
    {
      id: 'erp-specialist',
      title: 'Education ERP Systems Specialist',
      domain: 'Campus Tech & Operations',
      entity: 'Jay Murlidhar Group',
      location: 'Gujarat (Onsite)',
      type: 'Full-Time',
      experienceLevel: 'Freshers & Experienced',
      description: 'Deploy, configure, and maintain integrated university enterprise resource planning modules and student databases.'
    },
    {
      id: 'ui-ux-designer',
      title: 'Product UI & Design Systems Associate',
      domain: 'Design & Experience',
      entity: 'Jay Murlidhar Tech Solutions',
      location: 'Hybrid',
      type: 'Full-Time',
      experienceLevel: 'Freshers & Experienced',
      description: 'Craft accessible, high-performance web component libraries and interfaces tailored for institutional users.'
    },
    {
      id: 'ops-analyst',
      title: 'Corporate Business Operations Analyst',
      domain: 'Business Services',
      entity: 'Jay Murlidhar Business Services',
      location: 'Gujarat',
      type: 'Full-Time / Part-Time',
      experienceLevel: 'Experienced (1-3 Years)',
      description: 'Support regional business compliance, accounting audits, GST reporting, and operational documentation pipelines.'
    },
    {
      id: 'insurance-associate',
      title: 'Insurance Technology & Underwriting Associate',
      domain: 'Insurance',
      entity: 'Jay Murlidhar Insurance',
      location: 'Gujarat (Onsite)',
      type: 'Full-Time',
      experienceLevel: 'Freshers & Experienced',
      description: 'Manage digital policy issuance, claims coordination workflows, and corporate insurance client accounts.'
    }
  ];

  const filteredRoles = activeFilter === 'All' 
    ? roles 
    : roles.filter(r => r.type.includes(activeFilter) || r.experienceLevel.includes(activeFilter));

  const handleSelectRole = (roleTitle) => {
    setFormData(prev => ({ ...prev, position: roleTitle }));
    const formElement = document.getElementById('career-application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <span className="font-semibold text-[#0B1220] tracking-wider uppercase">CAREER OPPORTUNITIES</span>
          </nav>
        </div>
      </div>

      {/* 02 HEADER */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAFAFA] to-[#FFFFFF] border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-mono font-semibold uppercase tracking-[0.16em] mb-4 text-[#0284C7]">
              <Briefcase className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>JMG GROUP TALENT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1220] tracking-tight mb-4 break-words">
              CAREER OPPORTUNITIES.
            </h1>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
              Explore full-time and part-time positions across our software engineering, campus management, and commercial business units. Welcoming both ambitious freshers and seasoned professionals.
            </p>
          </div>
        </div>
      </section>

      {/* 03 OPEN ROLES & APPLICATION SPLIT */}
      <section className="py-14 sm:py-16 lg:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left 7 Cols: Filterable Roles List */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#0B1220]">
                  Open Positions
                </h2>
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                  {['All', 'Freshers', 'Full-Time', 'Part-Time'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-md transition-colors ${
                        activeFilter === filter
                          ? 'bg-[#0B1220] text-white font-semibold'
                          : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Roles Container */}
              <div className="space-y-4">
                {filteredRoles.map((role) => (
                  <div 
                    key={role.id}
                    className="p-5 sm:p-6 rounded-[14px] border border-[#E2E8F0] bg-white hover:border-blue-300 transition-all duration-200 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[11px] font-mono text-[#0284C7] font-semibold uppercase tracking-wider block mb-1">
                          {role.domain} &bull; {role.entity}
                        </span>
                        <h3 className="text-lg font-bold text-[#0B1220]">
                          {role.title}
                        </h3>
                      </div>

                      <span className="inline-flex items-center self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-slate-100 text-slate-700">
                        {role.type}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-4">
                      {role.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-[#64748B]">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{role.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{role.experienceLevel}</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectRole(role.title)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0284C7] hover:text-[#0B1220] transition-colors"
                      >
                        <span>Apply for this Role</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* General Inquiries Note */}
              <div className="mt-8 p-5 rounded-[12px] bg-[#FAFAFA] border border-[#E2E8F0] text-xs text-[#64748B] leading-relaxed">
                <span className="font-semibold text-[#0B1220]">Don't see your exact profile?</span> JMG is continually developing new initiatives in enterprise web services, campus operations, and regional logistics. Fill out the application form with your skills and background.
              </div>
            </div>

            {/* Right 5 Cols: Application Form */}
            <div className="lg:col-span-5" id="career-application-form">
              <div className="p-6 sm:p-8 rounded-[18px] border border-[#E2E8F0] bg-[#FAFAFA] shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-24">
                
                {submitted ? (
                  <div className="py-10 text-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                      <Check className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1220] mb-2">Application Received</h3>
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-xs mx-auto mb-6">
                      Thank you for submitting your application to Jay Murlidhar Group. Our talent team will evaluate your profile and contact you for the next steps.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          mobileNumber: '',
                          email: '',
                          position: 'Software Development & Cloud',
                          experience: 'Fresher (0-1 Year)',
                          skills: '',
                          resumeFileName: ''
                        });
                      }}
                      className="px-5 py-2.5 rounded-[10px] bg-[#0B1220] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0284C7] mb-1">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>DIRECT CANDIDATE INTAKE</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#0B1220] tracking-tight mb-2">
                      APPLY FOR CAREER
                    </h2>

                    <p className="text-xs text-[#64748B] mb-6">
                      Submit your credentials for full-time or part-time opportunities across JMG operating companies.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jigar Parmar"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      {/* Mobile Number & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                            placeholder="name@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                          />
                        </div>
                      </div>

                      {/* Position / Area of Interest */}
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Position / Area of Interest *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Software Development & Cloud"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Experience Level *
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        >
                          <option value="Fresher (0-1 Year)">Fresher (0-1 Year)</option>
                          <option value="1-3 Years">1-3 Years Experience</option>
                          <option value="3-5 Years">3-5 Years Experience</option>
                          <option value="5+ Years">5+ Years Senior Specialist</option>
                        </select>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Skills / Technical Background
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Key technologies, operational software, or past project highlights..."
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-[8px] border border-[#CBD5E1] bg-white text-xs text-[#0B1220] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                        />
                      </div>

                      {/* Resume Upload */}
                      <div>
                        <label className="block text-xs font-semibold text-[#334155] uppercase tracking-wider mb-1">
                          Resume Upload (PDF / DOC)
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="career-resume-input"
                          />
                          <label
                            htmlFor="career-resume-input"
                            className="w-full px-3.5 py-3 rounded-[8px] border border-dashed border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs text-[#64748B] flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span className="truncate">
                              {formData.resumeFileName || 'Select resume file from device...'}
                            </span>
                            <Upload className="w-4 h-4 text-[#0284C7] flex-shrink-0 ml-2" />
                          </label>
                        </div>
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        className="w-full min-h-[46px] mt-2 py-3 px-6 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <span>APPLY FOR CAREER</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 04 FINAL CTA */}
      <FinalCTA onOpenContact={onOpenContact} />

    </div>
  );
}
