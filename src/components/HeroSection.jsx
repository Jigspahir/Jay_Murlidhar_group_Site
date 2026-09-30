import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JmgDigitalUniverse from './JmgDigitalUniverse';

export default function HeroSection({ onOpenContact }) {
  const [activeCategory, setActiveCategory] = useState('technology');

  return (
    <section className="ecosystem-section relative pt-[88px] sm:pt-[96px] lg:pt-[104px] min-[1536px]:pt-[110px] pb-12 sm:pb-16 lg:pb-20 bg-[#FFFFFF] text-[#0B1220] overflow-hidden border-b border-[#E2E8F0]">
      
      {/* Subtle Atmospheric Pastel Background Gradients (Reference Direction) */}
      <div 
        className="absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-[#EDE9FE]/60 via-[#E0E7FF]/35 to-transparent blur-[100px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-20 -right-20 w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-[#ECFDF5]/60 via-[#E0F2FE]/45 to-[#FDF4FF]/35 blur-[110px] pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* Subtle Perspective Architectural Grid at Floor */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12 min-[1366px]:px-16 relative z-10">
        
        {/* Asymmetric Hero Grid Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-9 lg:gap-8 items-center">
          
          {/* Left Column: Asymmetric Editorial Typography */}
          <div className="lg:col-span-5">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-xs font-mono font-semibold uppercase tracking-[0.16em] mb-4 sm:mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
              <span className="text-[#0284C7]">EDUCATION</span>
              <span className="text-slate-300 font-sans font-normal">&times;</span>
              <span className="text-[#9333EA]">TECHNOLOGY</span>
            </div>

            {/* Main Heading with Fluid Typography */}
            <h1 className="fluid-hero-heading font-extrabold text-[#0B1220] tracking-[-0.03em] leading-[1.06] mb-4 sm:mb-5">
              BUILDING<br />
              WHAT'S <span className="bg-gradient-to-r from-[#0099FF] via-[#06B6D4] to-[#D946EF] bg-clip-text text-transparent">NEXT.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal max-w-lg mb-6 sm:mb-7 lg:mb-8">
              We build technology, business and digital experiences for people and organizations.
            </p>

            {/* Call to Actions (Min 44px touch targets) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8 lg:mb-10">
              <Link
                to="/ecosystem"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 rounded-[10px] bg-[#0B1220] hover:bg-slate-800 text-white font-semibold text-sm transition-all duration-200 shadow-sm group"
              >
                <span>Explore the Ecosystem</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 rounded-[10px] bg-white hover:bg-slate-50 text-[#0B1220] font-semibold text-sm border border-[#E2E8F0] shadow-sm transition-colors duration-200"
              >
                <span>About JMG</span>
              </Link>
            </div>

            {/* Baseline Context Telemetry Metrics (Desktop position) */}
            <div className="hidden lg:grid pt-6 border-t border-[#E2E8F0] grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider">Scope</div>
                <div className="text-base font-bold text-[#0B1220] mt-0.5">6 Companies</div>
              </div>
              <div>
                <div className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider">Structure</div>
                <div className="text-base font-bold text-[#0B1220] mt-0.5">5 Domains</div>
              </div>
              <div>
                <div className="font-mono text-[11px] text-[#64748B] uppercase tracking-wider">Universe</div>
                <div className="text-base font-bold bg-gradient-to-r from-[#0099FF] to-[#D946EF] bg-clip-text text-transparent mt-0.5">Connected</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Focal Point — The JMG Digital Universe */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full relative z-10">
            <JmgDigitalUniverse onDomainChange={setActiveCategory} />

            {/* Baseline Context Telemetry Metrics (Mobile position below visual) */}
            <div className="lg:hidden mt-6 pt-5 border-t border-[#E2E8F0] grid grid-cols-3 gap-4 w-full max-w-md text-center">
              <div>
                <div className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">Scope</div>
                <div className="text-sm font-bold text-[#0B1220] mt-0.5">6 Companies</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">Structure</div>
                <div className="text-sm font-bold text-[#0B1220] mt-0.5">5 Domains</div>
              </div>
              <div>
                <div className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">Universe</div>
                <div className="text-sm font-bold bg-gradient-to-r from-[#0099FF] to-[#D946EF] bg-clip-text text-transparent mt-0.5">Connected</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

