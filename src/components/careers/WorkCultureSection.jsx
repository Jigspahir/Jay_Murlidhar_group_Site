import React from 'react';
import { Sparkles, Users, Hammer, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CULTURE_VALUES } from '../../data/careersData';

const CULTURE_ICONS = {
  Hammer,
  Users,
  ShieldCheck,
  Sparkles
};

export default function WorkCultureSection() {
  return (
    <section id="work-culture" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-mono font-semibold uppercase tracking-[0.16em] text-[#2563EB] mb-4">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>WORK CULTURE &amp; PRINCIPLES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-tight mb-4">
            People. Ideas. Progress.
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed">
            A culture grounded in craftsmanship, mutual respect, and practical impact. We foster an environment where people take genuine pride in their work and support one another’s professional development.
          </p>
        </div>

        {/* Editorial Photo Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mb-14">
          
          {/* Main Large Visual Card */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm flex flex-col">
            <div className="relative h-[260px] sm:h-[340px] overflow-hidden bg-slate-100">
              <img
                src="/assets/jay murlidhar tech.jpg"
                alt="Jay Murlidhar Tech workspace & modern digital operations"
                className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="font-mono text-[11px] uppercase tracking-wider text-blue-300 font-semibold bg-blue-900/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                  COLLABORATIVE WORKSPACES
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
                  Building Scalable Solutions Together
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                At JMG, cross-disciplinary execution is standard practice. Engineers, statutory compliance executives, and digital operations specialists work directly together to solve real problems without silos.
              </p>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Gandhinagar, Gujarat • Group Headquarters</span>
                <span>Direct Practitioner Access</span>
              </div>
            </div>
          </div>

          {/* Right Column: Secondary Visual + Culture Callout */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Visual Card 2 */}
            <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm flex-1 flex flex-col">
              <div className="relative h-[180px] sm:h-[200px] overflow-hidden bg-slate-100">
                <img
                  src="/assets/hero.jpg"
                  alt="Jay Murlidhar Group team operations"
                  className="w-full h-full object-cover object-top filter saturate-[0.9] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="font-mono text-xs uppercase tracking-wider text-orange-300 font-semibold">
                    REGIONAL SERVICE DELIVERY
                  </div>
                  <div className="text-base font-bold text-white">
                    Citizen &amp; Business Enablement
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex items-center">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every process we engineer directly touches regional business owners, students, and citizens. That responsibility defines our high standards.
                </p>
              </div>
            </div>

            {/* Quote / Editorial Manifesto Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white shadow-md">
              <div className="font-mono text-xs text-blue-400 uppercase tracking-widest mb-2 font-semibold">
                OUR OPERATIONAL PHILOSOPHY
              </div>
              <blockquote className="text-sm sm:text-base font-medium leading-relaxed text-slate-200 mb-3">
                &ldquo;We value humility, practical competence, and intellectual honesty over corporate jargon. If you build it with care, it endures.&rdquo;
              </blockquote>
              <div className="text-xs font-mono text-slate-400">
                — Jay Murlidhar Group Leadership
              </div>
            </div>

          </div>

        </div>

        {/* 4 Cultural Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CULTURE_VALUES.map((val, idx) => {
            const Icon = CULTURE_ICONS[val.icon] || Sparkles;

            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4 border border-blue-100">
                  <Icon className="w-5 h-5" />
                </div>

                <h4 className="text-base font-bold text-[#0F172A] mb-2">
                  {val.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

