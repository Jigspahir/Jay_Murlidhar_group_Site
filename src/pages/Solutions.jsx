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
      <div className="bg-[#0B1424] text-white py-16 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] bg-sky-950/60 px-3 py-1 rounded-md border border-sky-800/40">
              Enterprise Software &amp; Digital Workflows
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-4 text-white">
              PRACTICAL SOLUTIONS FOR MODERN OPERATIONS.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Jay Murlidhar Group develops purpose-built enterprise platforms, automated workflows, and institutional operating systems designed to eliminate friction in real-world organizations.
            </p>
          </div>
        </div>
      </div>

      {/* How We Build */}
      <HowWeBuild />

      {/* Final CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </div>
  );
}
