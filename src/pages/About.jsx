import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Building2, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';
import FinalCTA from '../components/FinalCTA';
import JmgTimelineExperience from '../components/timeline/JmgTimelineExperience';
import { JMG_COMPANIES, JMG_CATEGORIES } from '../data/jmgEcosystem';

const activeCompanyCount = JMG_COMPANIES.filter(c => c.active !== false).length;
const domainCount = JMG_CATEGORIES.length;

const GROUP_METRICS = [
  { value: "25+", label: "Years of Trust", sub: "Regional foundation & institutional heritage" },
  { value: `${domainCount}`, label: "Business Domains", sub: "Fully interconnected operating verticals" },
  { value: `${activeCompanyCount}`, label: "Operating Companies", sub: "Active dedicated operating entities" },
];

export default function About() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">About Jay Murlidhar Group</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#F8FAFC] border-b border-[#E2E8F0] py-20 lg:py-28">
        {/* Soft Blue Radial Depth Glow */}
        <div 
          className="absolute -top-24 left-1/4 w-[640px] h-[480px] rounded-full bg-gradient-to-br from-blue-100/50 via-sky-50/40 to-transparent blur-3xl pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute -top-10 right-10 w-[420px] h-[420px] rounded-full bg-blue-50/60 blur-2xl pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Subtle Light-Blue Dotted Pattern */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(#DBEAFE_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-80 pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            {/* Small Corporate Profile Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-semibold text-[#2563EB] uppercase tracking-widest mb-6 shadow-[0_1px_2px_rgba(37,99,235,0.04)]">
              <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
              Corporate Profile
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-[#0F172A] mb-6">
              ONE GROUP.<br />
              MULTIPLE BUSINESSES.<br />
              <span className="text-[#2563EB]">
                ONE CONNECTED GROUP STRUCTURE.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#475569] leading-relaxed font-normal mb-8">
              Jay Murlidhar Group is an ambitious multi-sector conglomerate with active operations spanning Technology &amp; Digital, Insurance, Business Services, Travel, and Retail.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/businesses"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm"
              >
                <span>Explore Our Businesses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] font-semibold text-sm transition-all shadow-sm"
              >
                Contact Leadership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {GROUP_METRICS.map((metric, idx) => (
              <div key={idx} className="border-l-2 border-blue-600 pl-4">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs uppercase font-bold text-slate-500 mt-1 tracking-wider">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JMG — Premium 3D Interactive Timeline Experience */}
      <JmgTimelineExperience />

      {/* Final CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </div>
  );
}
