import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ECOSYSTEM_ITEMS = [
  {
    number: '01',
    name: 'TECHNOLOGY',
    category: 'Digital Systems & Engineering',
    tagline: 'Custom enterprise software, campus ERPs & hardware engineering',
    description: 'High-availability web platforms, custom enterprise software, academic ERP suites, and comprehensive hardware engineering.',
    accent: '#2563EB',
    image: '/assets/hero.jpg',
    tags: ['Campus ERP', 'Cloud Backends', 'Hardware AMC', 'Web Platforms'],
    companies: ['Jay Murlidhar Computer', 'Jay Murlidhar Tech Solutions'],
    slug: '/technology'
  },
  {
    number: '02',
    name: 'INSURANCE',
    category: 'Risk Mitigation & Underwriting',
    tagline: 'Institutional risk mitigation, general & life protection',
    description: 'Comprehensive general, corporate, and individual insurance consulting designed to safeguard operational assets and personnel.',
    accent: '#0284C7',
    image: '/assets/HERO2.jpg',
    tags: ['Corporate Risk', 'Campus Liability', 'Asset Protection', 'Health Plans'],
    companies: ['Jay Murlidhar Insurance'],
    slug: '/insurance'
  },
  {
    number: '03',
    name: 'BUSINESS SERVICES',
    category: 'Corporate Operations & Compliance',
    tagline: 'Regulatory compliance, workflow automation & consulting',
    description: 'End-to-end corporate workflow assistance, statutory compliance filings, legal certifications, and operational management.',
    accent: '#EA580C',
    image: '/assets/hero.jpg',
    tags: ['Entity Setup', 'Statutory Filings', 'Workflow Ops', 'ISO Certifications'],
    companies: ['Jay Murlidhar Business Services'],
    slug: '/business-services'
  },
  {
    number: '04',
    name: 'TRAVEL',
    category: 'Corporate & Educational Mobility',
    tagline: 'Educational study tours & corporate travel operations',
    description: 'Curated institutional study tours, university student delegations, faculty expeditions, and seamless corporate itineraries.',
    accent: '#D97706',
    image: '/assets/jay murlidhar tech.jpg',
    tags: ['Study Tours', 'Institutional Mobility', 'Academic Delegations', 'Expeditions'],
    companies: ['Jay Murlidhar Tours'],
    slug: '/travel'
  },
  {
    number: '05',
    name: 'RETAIL',
    category: 'Smart Hardware & Tech Essentials',
    tagline: 'Smart consumer devices, student gear & mobility essentials',
    description: 'High-performance computing devices, campus smart equipment, mobility accessories, and institutional device procurement.',
    accent: '#DB2777',
    image: '/assets/LUCES GAMER.jpeg',
    tags: ['Smart Hardware', 'Student Devices', 'Accessories', 'Electronics Servicing'],
    companies: ['Jay Murlidhar Mobile & Accessories'],
    slug: '/retail'
  }
];

export default function BusinessEcosystem() {
  const [activeItem, setActiveItem] = useState(ECOSYSTEM_ITEMS[0]);

  return (
    <section id="businesses" className="py-12 sm:py-14 lg:py-16 bg-[#FAFAFA] border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with Direct Ecosystem Page Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 sm:mb-10 lg:mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="text-[#2563EB]">08 —</span>
              <span className="text-[#1E293B]">BUSINESS ECOSYSTEM</span>
            </div>

            <h2 className="fluid-section-heading font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-4 sm:mb-6">
              DIFFERENT DIRECTIONS.<br />
              <span className="text-[#1E293B]">ONE GROUP.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
              Explore the growing ecosystem of Jay Murlidhar Group. Select any sector to inspect its operational focus.
            </p>
          </div>

          <Link
            to="/ecosystem"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group flex-shrink-0 min-h-[44px]"
          >
            <span>Explore Complete Ecosystem</span>
            <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Master Interactive Split: 80–100px Numbered List on Left, Sticky Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: 80-100px Numbered Rows */}
          <div className="lg:col-span-7 divide-y divide-[#E2E8F0] border-y border-[#E2E8F0]">
            {ECOSYSTEM_ITEMS.map((item) => {
              const isSelected = activeItem.number === item.number;
              return (
                <div
                  key={item.number}
                  onMouseEnter={() => setActiveItem(item)}
                  onClick={() => setActiveItem(item)}
                  className={`min-h-[84px] py-6 px-4 cursor-pointer transition-all duration-150 flex items-center justify-between group ${
                    isSelected ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]' : 'hover:bg-white/60'
                  }`}
                >
                  <div className="flex items-center gap-6 sm:gap-8">
                    <span 
                      className={`font-mono text-sm sm:text-base font-semibold transition-colors ${
                        isSelected ? 'text-[#2563EB]' : 'text-[#94A3B8] group-hover:text-[#2563EB]'
                      }`}
                    >
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[#64748B] font-medium hidden sm:inline">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'translate-x-1 text-[#2563EB]' : 'text-[#94A3B8] group-hover:translate-x-1 group-hover:text-[#111827]'
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Live Preview Area */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="border border-[#E2E8F0] rounded-[16px] bg-white overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              
              {/* Preview Image */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-900 border-b border-[#E2E8F0]">
                <img
                  src={activeItem.image}
                  alt={activeItem.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-white text-[#111827] shadow-sm">
                    {activeItem.number} &bull; Sector Overview
                  </span>
                </div>
              </div>

              {/* Preview Body */}
              <div className="p-6 sm:p-8">
                <span className="font-mono text-xs uppercase tracking-wider text-[#2563EB] font-semibold block mb-1">
                  {activeItem.category}
                </span>

                <h3 className="text-2xl font-bold text-[#111827] mb-3">
                  {activeItem.name}
                </h3>

                <p className="text-sm text-[#64748B] leading-relaxed font-normal mb-6">
                  {activeItem.description}
                </p>

                {/* Operating Entities */}
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-2">
                    Operating Entities
                  </div>
                  <div className="space-y-1.5">
                    {activeItem.companies.map((comp, cIdx) => (
                      <div 
                        key={cIdx}
                        className="flex items-center gap-2 text-xs font-semibold text-[#111827] bg-[#FAFAFA] p-2 rounded-lg border border-[#E2E8F0]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        <span>{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-2.5">
                    Operational Scope
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeItem.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Integrated JMG Division</span>
                  <Link
                    to={activeItem.slug}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <span>Explore Division &rarr;</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
