import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ChevronRight, FolderGit2, ArrowRight } from 'lucide-react';
import ProjectsSection from '../components/ProjectsSection';
import SelectedWork from '../components/SelectedWork';
import FinalCTA from '../components/FinalCTA';

export default function Projects() {
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
            <span className="font-semibold text-slate-900">Projects &amp; Deployments</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#0B1424] text-white py-16 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] bg-sky-950/60 px-3 py-1 rounded-md border border-sky-800/40">
              Work &amp; Implementations
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-4 text-white">
              ENGINEERED FOR SCALE, RELIABILITY &amp; IMPACT.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Explore key software systems, physical infrastructure initiatives, and enterprise digital transformations implemented across the Jay Murlidhar Group ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Showcase */}
      <ProjectsSection onOpenContact={onOpenContact} />

      {/* Selected Work */}
      <SelectedWork onOpenContact={onOpenContact} />

      {/* Final CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </div>
  );
}
