import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Sparkles,
  UserPlus
} from 'lucide-react';
import { CAREER_DEPARTMENTS, EMPLOYMENT_TYPES, CAREER_ROLES } from '../../data/careersData';
import TalentPoolModal from './TalentPoolModal';

export default function JobDirectorySection({ onOpenContact }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected job for detail modal
  const [activeJob, setActiveJob] = useState(null);

  // Talent Pool modal state
  const [isTalentPoolOpen, setIsTalentPoolOpen] = useState(false);
  const [talentPoolDept, setTalentPoolDept] = useState('');

  // Filtered job list
  const filteredRoles = useMemo(() => {
    return CAREER_ROLES.filter((role) => {
      const matchDept = selectedDept === 'All' || role.department === selectedDept;
      const matchType = selectedType === 'All' || role.employmentType === selectedType;
      
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        role.title.toLowerCase().includes(query) ||
        role.department.toLowerCase().includes(query) ||
        role.workingEntity.toLowerCase().includes(query) ||
        role.preferredSkills.some((s) => s.toLowerCase().includes(query));

      return matchDept && matchType && matchSearch;
    });
  }, [selectedDept, selectedType, searchQuery]);

  const handleOpenTalentPool = (dept) => {
    setTalentPoolDept(dept || (selectedDept !== 'All' ? selectedDept : CAREER_DEPARTMENTS[0]));
    setIsTalentPoolOpen(true);
  };

  const handleApplyRole = (role) => {
    setActiveJob(null);
    if (onOpenContact) {
      onOpenContact({
        company: role.workingEntity,
        service: `Application: ${role.title} (${role.department})`
      });
    } else {
      handleOpenTalentPool(role.department);
    }
  };

  return (
    <section id="job-directory" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-4">
            <span>CAREER DIRECTORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-4">
            Find Your Place at JMG.
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            Browse active career requisitions across our 7 corporate departments. We believe in transparent requirements, grounded growth expectations, and zero artificial complexity.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm mb-10 space-y-5">
          
          {/* Top row: Search input + Employment Type selector */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by role title, skill (e.g. React, Compliance, SEO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Employment Type Pills */}
            <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-mono uppercase text-slate-400 mr-1 hidden sm:inline">Type:</span>
              {EMPLOYMENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedType === type
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

          </div>

          {/* Bottom row: Department Pills (7 canonical departments) */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              Filter By Department:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDept('All')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono uppercase transition-all ${
                  selectedDept === 'All'
                    ? 'bg-[#2563EB] text-white shadow-sm'
                    : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Departments ({CAREER_ROLES.length})
              </button>

              {CAREER_DEPARTMENTS.map((dept) => {
                const count = CAREER_ROLES.filter((r) => r.department === dept).length;
                const isSelected = selectedDept === dept;

                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDept(dept)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{dept}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Job Listings Grid */}
        {filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                className="group relative p-7 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] hover:border-blue-300 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] flex flex-col justify-between"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-mono font-semibold uppercase tracking-wider">
                      <Briefcase className="w-3.5 h-3.5" />
                      {role.department}
                    </span>

                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {role.workingEntity}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-3">
                    {role.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 mb-4">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {role.location}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {role.employmentType}
                    </span>
                    <span>•</span>
                    <span>{role.experience}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {role.summary}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-6">
                    {role.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Open Requisition
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveJob(role)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold transition-all group-hover:bg-[#2563EB]"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Transparent, Honest "No Current Openings" State */
          <div className="p-10 sm:p-14 rounded-2xl bg-white border border-[#E2E8F0] text-center shadow-sm max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-5 border border-blue-100">
              <UserPlus className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-bold text-[#0F172A] mb-2">
              No Current Openings in {selectedDept !== 'All' ? selectedDept : 'this Selection'}
            </h3>

            <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
              We do not currently have an active opening listed for this specific filter, but our group companies are continually expanding. We encourage you to share your profile with our talent team.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenTalentPool(selectedDept)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Submit Profile to Talent Pool</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedDept('All');
                  setSelectedType('All');
                  setSearchQuery('');
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Role Details Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveJob(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <div 
              className="relative w-full max-w-2xl transform rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-200 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveJob(null)}
                className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Role Header */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                  <span>{activeJob.department}</span>
                  <span>•</span>
                  <span>{activeJob.employmentType}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                  {activeJob.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                  <span>Entity: <strong className="text-slate-800">{activeJob.workingEntity}</strong></span>
                  <span>•</span>
                  <span>Location: <strong className="text-slate-800">{activeJob.location}</strong></span>
                  <span>•</span>
                  <span>Experience: <strong className="text-slate-800">{activeJob.experience}</strong></span>
                </div>
              </div>

              {/* Overview */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Role Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeJob.summary}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {activeJob.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Qualifications &amp; Requirements
                </h4>
                <ul className="space-y-2">
                  {activeJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preferred Skills */}
              <div className="mb-8">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Preferred Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeJob.preferredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-mono font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-500">
                  Direct review by hiring committee
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveJob(null)}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyRole(activeJob)}
                    className="px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Talent Pool Modal */}
      <TalentPoolModal
        key={talentPoolDept || 'default'}
        isOpen={isTalentPoolOpen}
        onClose={() => setIsTalentPoolOpen(false)}
        preselectedDepartment={talentPoolDept}
      />

    </section>
  );
}
