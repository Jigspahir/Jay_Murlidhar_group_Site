import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JmgDigitalUniverse from './JmgDigitalUniverse';
import TypewriterSpecialization from './TypewriterSpecialization';

export default function HeroSection({ onOpenContact: _onOpenContact }) {
  const [_activeCategory, setActiveCategory] = useState('technology');

  return (
    <section className="ecosystem-section relative pt-[90px] sm:pt-[94px] md:pt-[96px] lg:pt-[88px] min-[1536px]:pt-[92px] pb-3 sm:pb-4 md:pb-5 lg:pb-7 xl:pb-8 bg-[#FFFFFF] text-[#0B1220] overflow-hidden border-b border-[#E2E8F0]">
      
      {/* Subtle Atmospheric Pastel Background (Quiet, Ultra-Subtle Lighting) */}
      <div 
        className="absolute -top-32 -left-32 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-[#EDE9FE]/30 via-[#E0E7FF]/20 to-transparent blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-20 -right-20 w-[680px] h-[680px] rounded-full bg-gradient-to-bl from-[#ECFDF5]/30 via-[#E0F2FE]/25 to-[#FDF4FF]/20 blur-[130px] pointer-events-none" 
        aria-hidden="true" 
      />
      
      {/* Subtle Architectural Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1240px] 2xl:max-w-[1400px] mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-12 min-[1366px]:px-16 relative z-10">
        
        {/* Asymmetric Two-Column Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-9 lg:gap-8 lg:items-start">
          
          {/* Left Column: Editorial Typography & Content Block */}
          <div className="lg:col-span-5 lg:pt-2 xl:pt-3">

            {/* Main Heading with Precise Optical Line-Height */}
            <h1 className="text-[28px] xs:text-[34px] sm:text-4xl lg:text-[42px] xl:text-[46px] 2xl:text-[50px] font-extrabold text-[#0F172A] tracking-[-0.035em] leading-[1.08] mb-5 sm:mb-6">
              ONE GROUP.<br />
              <span className="text-[#2563EB] sm:whitespace-nowrap">MANY POSSIBILITIES.</span>
            </h1>

            {/* Supporting Copy — Understated, Readable */}
            <p className="text-base sm:text-[17px] text-[#475569] leading-relaxed font-normal max-w-[500px] mb-3 sm:mb-3.5">
              Jay Murlidhar Group brings together six business domains — Technology, Jan Suvidha, Insurance, Business Services, Travel and Retail — delivering connected solutions for individuals, businesses and organizations.
            </p>

            {/* Animated Specialization Line */}
            <TypewriterSpecialization />

            {/* Call to Actions — Refined Editorial Buttons (Equal 46px height, subtle hover) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mb-8 sm:mb-10 lg:mb-12">
              <Link
                to="/businesses"
                className="inline-flex items-center justify-center gap-2 h-[44px] sm:h-[46px] px-5 sm:px-[22px] rounded-lg bg-[#0B1220] hover:bg-slate-800 text-white font-medium text-[13.5px] sm:text-sm tracking-tight transition-all duration-200 shadow-sm hover:shadow group w-full sm:w-auto"
              >
                <span>Explore Our Businesses</span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 h-[44px] sm:h-[46px] px-5 sm:px-[22px] rounded-lg bg-white hover:bg-slate-50/80 text-[#0B1220] font-medium text-[13.5px] sm:text-sm tracking-tight border border-slate-200 hover:border-slate-300 shadow-sm transition-colors duration-200 w-full sm:w-auto"
              >
                <span>About JMG</span>
              </Link>
            </div>

            {/* Baseline Context Telemetry Metrics (Directly below CTA buttons) */}
            <div className="grid pt-5 border-t border-slate-200/70 grid-cols-3 gap-2 sm:gap-6 max-w-[420px] mb-5 lg:mb-0">
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-[0.14em] mb-1">Scope</div>
                <div className="text-xs sm:text-[15px] font-bold text-slate-900 tracking-tight">6 Companies</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-[0.14em] mb-1">Structure</div>
                <div className="text-xs sm:text-[15px] font-bold text-slate-900 tracking-tight">6 Domains</div>
              </div>
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-[0.14em] mb-1">Universe</div>
                <div className="text-xs sm:text-[15px] font-bold text-[#0284C7] tracking-tight">Connected</div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Focal Point — The JMG Digital Universe (Vertically centered with Left Content) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full relative z-10 lg:-mt-16 xl:-mt-20 min-[1536px]:-mt-24">
            <JmgDigitalUniverse onDomainChange={setActiveCategory} />
          </div>

        </div>

      </div>

    </section>
  );
}

