import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HowWeBuild from '../components/HowWeBuild';
import FinalCTA from '../components/FinalCTA';

export default function Solutions() {
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
            <span className="font-semibold text-slate-900">Solutions</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#F8FAFC] border-b border-[#E2E8F0] py-16 lg:py-20">
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
          className="absolute inset-0 bg-[radial-gradient(#DBEAFE_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75 pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-md border border-blue-200">
              Enterprise Software &amp; Digital Workflows
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-4 text-[#0F172A]">
              PRACTICAL SOLUTIONS FOR MODERN OPERATIONS.
            </h1>
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed font-normal">
              Jay Murlidhar Group develops purpose-built enterprise platforms, automated workflows, and institutional operating systems designed to eliminate friction in real-world organizations.
            </p>
          </div>
        </div>
      </section>

      {/* How We Build */}
      <HowWeBuild />

      {/* Final CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </div>
  );
}
