import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  X,
  Sparkles
} from 'lucide-react';
import { JMG_EXPERT_TEAMS } from '../data/expertsData';

export default function OurExperts({ onOpenContact }) {
  const [activeDomainId, setActiveDomainId] = useState('technology');
  const [selectedProfile, setSelectedProfile] = useState(null);

  const activeTeam = JMG_EXPERT_TEAMS.find(t => t.id === activeDomainId) || JMG_EXPERT_TEAMS[0];

  const handleConsultTeam = () => {
    if (onOpenContact) {
      onOpenContact({
        interest: activeTeam.operatingCompany,
        message: `Consultation request for ${activeTeam.teamTitle} (${activeTeam.operatingCompany})`
      });
    }
  };

  return (
    <section id="our-experts" className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[#E2E8F0] relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div 
        className="absolute top-0 right-1/4 w-[520px] h-[380px] rounded-full bg-gradient-to-b from-blue-50/50 via-sky-50/30 to-transparent blur-3xl pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12 lg:mb-14">
          <div className="flex items-center gap-2 mb-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#2563EB]">08 —</span>
            <span className="text-[#0F172A]">SPECIALIZED TEAMS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight mb-4">
            MEET OUR EXPERTS.
          </h2>

          <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal">
            Specialized teams. Different expertise. One connected group.
          </p>
        </div>

        {/* 1. Interactive Domain Selectors (6 Domains) */}
        <div className="mb-10 lg:mb-12">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {JMG_EXPERT_TEAMS.map((team) => {
              const isActive = team.id === activeDomainId;
              const IconComponent = team.icon;

              return (
                <button
                  key={team.id}
                  onClick={() => setActiveDomainId(team.id)}
                  className={`group inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'bg-blue-50/90 text-[#2563EB] border-blue-300 shadow-sm font-semibold'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 shadow-none'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700'
                  }`}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </span>
                  
                  <span className="font-mono text-[10px] sm:text-xs opacity-60">
                    {team.number}
                  </span>

                  <span>{team.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Active Specialist Team Overview Card */}
        <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-6 sm:p-8 lg:p-10 mb-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-200/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                {activeTeam.operatingCompany}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight mb-2">
                {activeTeam.teamTitle}
              </h3>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
                {activeTeam.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={activeTeam.domainRoute}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <span>Explore Domain</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleConsultTeam}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <span>Consult Team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Specialist Disciplines Grid */}
          <div className="pt-8">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6">
              Core Specialization Disciplines
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeTeam.specialistRoles.map((role, idx) => {
                const RoleIcon = role.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200/80 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
                      <RoleIcon className="w-5 h-5" />
                    </div>

                    <h5 className="text-base sm:text-[17px] font-bold text-[#0F172A] tracking-tight mb-2">
                      {role.title}
                    </h5>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Verified Expert Profiles or Professional Coming Soon State */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Verified Specialist Profiles
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Direct credentials from the Jay Murlidhar Group employee registry.
              </p>
            </div>
          </div>

          {activeTeam.verifiedProfiles && activeTeam.verifiedProfiles.length > 0 ? (
            /* Render Verified Profiles Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTeam.verifiedProfiles.map((expert, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProfile(expert)}
                  className="cursor-pointer group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {expert.photoUrl ? (
                      <img
                        src={expert.photoUrl}
                        alt={expert.name}
                        className="w-14 h-14 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg border border-blue-200">
                        {expert.name.charAt(0)}
                      </div>
                    )}

                    <div>
                      <h5 className="font-bold text-[#0F172A] text-base group-hover:text-[#2563EB] transition-colors">
                        {expert.name}
                      </h5>
                      <p className="text-xs text-slate-500 font-medium">
                        {expert.designation}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Specialist
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {expert.bio || expert.specialization}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2563EB]">
                    <span>View Credentials</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Professional "Team Information Coming Soon" State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 sm:p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>

              <h5 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                Team Directory Onboarding in Progress
              </h5>

              <p className="text-sm text-[#475569] leading-relaxed max-w-lg mx-auto mb-6">
                Verified specialist profiles and leadership credentials for <span className="font-semibold text-[#0F172A]">{activeTeam.teamTitle}</span> are currently being updated in our corporate registry. Our consultation desk is fully active and accepting inquiries.
              </p>

              <div className="inline-flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleConsultTeam}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consult with {activeTeam.name} Team</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 5. Detail Modal for Verified Profile (if open) */}
      {selectedProfile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedProfile(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              {selectedProfile.photoUrl ? (
                <img
                  src={selectedProfile.photoUrl}
                  alt={selectedProfile.name}
                  className="w-16 h-16 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xl border border-blue-200">
                  {selectedProfile.name.charAt(0)}
                </div>
              )}

              <div>
                <h4 className="text-xl font-bold text-[#0F172A]">
                  {selectedProfile.name}
                </h4>
                <p className="text-sm text-slate-600 font-medium">
                  {selectedProfile.designation}
                </p>
                <p className="text-xs text-[#2563EB] font-semibold mt-0.5">
                  {selectedProfile.operatingCompany || activeTeam.operatingCompany}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-sm text-[#475569]">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Specialization Scope
                </span>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedProfile.specialization || selectedProfile.bio}
                </p>
              </div>

              {selectedProfile.qualifications && (
                <div>
                  <span className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Credentials &amp; Certifications
                  </span>
                  <p className="text-xs text-slate-700">
                    {selectedProfile.qualifications}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProfile(null);
                  handleConsultTeam();
                }}
                className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 shadow-sm"
              >
                Inquire with Specialist
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
