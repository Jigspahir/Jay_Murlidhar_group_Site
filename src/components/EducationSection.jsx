import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const EDUCATION_STREAMS = [
  {
    id: 'institutions',
    number: '01',
    title: 'Institutions',
    subtitle: 'Institutional Management & Governance',
    description: 'Centralized administration for universities and schools. Multi-campus sync, regulatory compliance documentation, and automated fee audits in one synchronized system.',
    image: '/assets/HERO2.jpg',
    capabilities: ['Multi-campus administration', 'Accreditation reporting', 'Automated fee clearing']
  },
  {
    id: 'students',
    number: '02',
    title: 'Students',
    subtitle: 'Learner Experience & Self-Service',
    description: 'A modern digital student experience. Instant access to live schedules, verified grades, contactless campus access, and digital credential verification.',
    image: '/assets/hero.jpg',
    capabilities: ['Mobile attendance logging', 'Digital fee receipts', 'Academic timetable sync']
  },
  {
    id: 'faculty',
    number: '03',
    title: 'Faculty',
    subtitle: 'Educator Workflows & Mentorship',
    description: 'Streamlining academic administration so faculty can focus on teaching. One-tap lecture attendance, rubrics grading, and automated examination tabulation.',
    image: '/assets/jay murlidhar tech.jpg',
    capabilities: ['One-tap attendance capture', 'Automated gradebook rollups', 'Curriculum progress radar']
  }
];

export default function EducationSection() {
  const [activeStream, setActiveStream] = useState(EDUCATION_STREAMS[0]);

  return (
    <section id="education-details" className="py-12 sm:py-14 lg:py-16 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] mb-4">
            <span className="font-mono text-[#2563EB] font-bold">03 &mdash;</span>
            <span className="text-[#1E293B]">ACADEMIC INNOVATION</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6">
            EDUCATION,<br />
            <span className="text-[#1E293B]">REIMAGINED.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
            We replace fragmented legacy systems with cohesive digital architecture that serves institutions, empowers faculty, and respects student time.
          </p>
        </div>

        {/* Editorial Split: Typographic Interactive Links on Left, Large Visual on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: 3 Large Typographic Links */}
          <div className="lg:col-span-6 divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {EDUCATION_STREAMS.map((item) => {
              const isActive = activeStream.id === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveStream(item)}
                  onClick={() => setActiveStream(item)}
                  className={`py-8 sm:py-10 cursor-pointer transition-all duration-200 group flex items-center justify-between ${
                    isActive ? 'pl-2' : 'hover:pl-2'
                  }`}
                >
                  <div className="flex items-center gap-6 sm:gap-8">
                    <span className={`font-mono text-sm sm:text-base font-semibold transition-colors ${
                      isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'
                    }`}>
                      {item.number}
                    </span>
                    <div>
                      <h3 className={`text-2xl sm:text-4xl font-semibold tracking-tight transition-colors ${
                        isActive ? 'text-[#111827]' : 'text-[#64748B] group-hover:text-[#111827]'
                      }`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1 font-normal hidden sm:block">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[#111827] text-white translate-x-1' 
                      : 'text-[#94A3B8] group-hover:translate-x-1 group-hover:text-[#111827]'
                  }`}>
                    <ArrowRight className="w-5 h-5 text-blue-200" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Large Education-Related Product Visual Preview */}
          <div className="lg:col-span-6">
            <div className="border border-[#E2E8F0] rounded-[16px] overflow-hidden bg-[#FAFAFA] shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              
              {/* Visual Container */}
              <div className="relative h-[280px] sm:h-[340px] w-full overflow-hidden bg-slate-900">
                <img
                  src={activeStream.image}
                  alt={activeStream.title}
                  className="w-full h-full object-cover opacity-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="font-mono text-xs uppercase tracking-wider text-blue-300 block mb-1">
                    Active Focus &bull; {activeStream.number}
                  </span>
                  <div className="text-xl font-bold">{activeStream.title} System Architecture</div>
                </div>
              </div>

              {/* Context Text Box */}
              <div className="p-6 sm:p-8">
                <p className="text-sm text-[#64748B] leading-relaxed mb-6 font-normal">
                  {activeStream.description}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E2E8F0]">
                  {activeStream.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[#1E293B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
