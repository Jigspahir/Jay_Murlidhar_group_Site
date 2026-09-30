import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Compass, Home, Layers, ChevronRight, ShieldAlert } from 'lucide-react';
import { JMG_DOMAINS, getDomainById } from '../data/jmgEcosystem';

export default function NotFoundPage({ domainHint }) {
  const location = useLocation();

  // Determine if the URL was attempted inside a recognized domain, e.g. /business-services/...
  const pathParts = location.pathname.split('/').filter(Boolean);
  const detectedDomainSlug = domainHint || (pathParts.length > 0 ? pathParts[0] : null);
  const matchedDomain = detectedDomainSlug 
    ? JMG_DOMAINS.find(d => d.id === detectedDomainSlug || d.domainRoute === `/${detectedDomainSlug}`)
    : null;

  return (
    <div className="pt-28 sm:pt-36 pb-24 bg-[#07111F] text-white min-h-[85vh] flex items-center relative overflow-hidden">
      
      {/* Background Architectural Grid Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
        aria-hidden="true"
      />

      {/* Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-15 pointer-events-none bg-[#2563EB]"
        aria-hidden="true"
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-white transition-colors">JMG</Link>
          <span>/</span>
          <Link to="/ecosystem" className="hover:text-white transition-colors">Ecosystem</Link>
          <span>/</span>
          <span className="text-[#38BDF8] font-semibold">404 &mdash; Page Not Found</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Supporting Text, and Action CTAs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] font-mono text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
              <span>ERROR 404 &bull; ROUTE UNRESOLVED</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-bold text-white tracking-[-0.03em] leading-[1.08] mb-6">
              LOST IN THE<br />
              <span className="text-[#38BDF8]">ECOSYSTEM?</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
              The page you&apos;re looking for doesn&apos;t exist or may have moved.
            </p>

            {/* If within a known domain (e.g. /business-services/unknown-company) */}
            {matchedDomain && (
              <div className="mb-8 p-4 rounded-xl bg-[#0B1424] border border-slate-800 max-w-xl">
                <div className="text-xs font-mono text-slate-400 mb-1 uppercase tracking-wider">
                  Domain Context Detected
                </div>
                <div className="text-sm font-semibold text-white mb-3">
                  This route was queried under <span className="text-[#38BDF8]">{matchedDomain.categoryTitle || matchedDomain.name}</span>.
                </div>
                <Link
                  to={matchedDomain.domainRoute}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#38BDF8] hover:text-white hover:underline transition-colors"
                >
                  <span>Back to {matchedDomain.categoryTitle || matchedDomain.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#07111F] font-semibold text-sm transition-all duration-200 shadow-md group focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              >
                <span>Back to JMG</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/ecosystem"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0B1424] hover:bg-[#111E36] border border-slate-700 text-white font-semibold text-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              >
                <span>Explore Ecosystem</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Fast Jump Links */}
            <div className="mt-12 pt-8 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-3">
                Quick Canonical Portals
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <Link to="/technology" className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
                  01 Technology &rarr;
                </Link>
                <Link to="/insurance" className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
                  02 Insurance &rarr;
                </Link>
                <Link to="/business-services" className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-slate-800 text-[#F97316] hover:text-white hover:border-slate-700 transition-colors font-bold">
                  03 Business Services &rarr;
                </Link>
                <Link to="/travel" className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
                  04 Travel &rarr;
                </Link>
                <Link to="/retail" className="px-3 py-1.5 rounded-lg bg-[#0B1424] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
                  05 Retail &rarr;
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Simplified JMG Ecosystem Visual */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-square max-w-[420px] mx-auto rounded-2xl bg-[#09111E] border border-slate-800 p-8 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {/* Subtle background radar */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Minimal Constellation Topology */}
              <div className="w-full flex justify-center pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0E1A2E] border border-slate-700 font-mono text-xs font-bold text-white shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span>JMG CORE</span>
                </div>
              </div>

              {/* Orbital Nodes */}
              <div className="w-full relative h-[180px] my-2 select-none">
                {/* SVG connection lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="18%" x2="50%" y2="50%" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="85%" y2="35%" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="72%" y2="82%" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="28%" y2="82%" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="50%" y1="50%" x2="15%" y2="35%" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                </svg>

                {/* Node 01 Technology */}
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#07111F] border border-[#38BDF8]/40 text-[9px] font-mono font-bold text-[#38BDF8]">
                  <span>01</span>
                  <span>TECHNOLOGY</span>
                </div>

                {/* Node 02 Insurance */}
                <div className="absolute top-[30%] right-[0%] flex items-center gap-1 px-2 py-0.5 rounded bg-[#07111F] border border-cyan-500/40 text-[9px] font-mono text-cyan-400">
                  <span>02</span>
                  <span>INSURANCE</span>
                </div>

                {/* Node 03 Business Services */}
                <div className="absolute top-[78%] right-[8%] flex items-center gap-1 px-2 py-0.5 rounded bg-[#07111F] border border-orange-500/40 text-[9px] font-mono text-orange-400 font-bold">
                  <span>03</span>
                  <span>BUSINESS SERVICES</span>
                </div>

                {/* Node 04 Travel */}
                <div className="absolute top-[78%] left-[8%] flex items-center gap-1 px-2 py-0.5 rounded bg-[#07111F] border border-amber-500/40 text-[9px] font-mono text-amber-400 font-bold">
                  <span>04</span>
                  <span>TRAVEL</span>
                </div>

                {/* Node 05 Retail */}
                <div className="absolute top-[30%] left-[0%] flex items-center gap-1 px-2 py-0.5 rounded bg-[#07111F] border border-pink-500/40 text-[9px] font-mono text-pink-400 font-bold">
                  <span>05</span>
                  <span>RETAIL</span>
                </div>
              </div>

              {/* Stylized 404 Status Banner */}
              <div className="w-full text-center border-t border-slate-800/80 pt-4">
                <div className="text-4xl font-extrabold tracking-widest font-mono text-slate-600 mb-0.5">
                  404
                </div>
                <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
                  COORDINATE NOT RESOLVED
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
