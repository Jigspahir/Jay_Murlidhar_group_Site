import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ECOSYSTEM_DOMAINS,
  CENTER_X,
  CENTER_Y,
  BASE_RADIUS,
  ORBIT_RADIUS,
  MIDDLE_RADIUS,
  CORE_RADIUS,
  DEFAULT_PILL_DIMENSIONS,
  getRadialPosition,
  getDomainEndRadius,
  getRadialLineGeometry,
  getLogoStartRadius,
  solveCollisionSafeRadius,
  getCollisionAwareRadius,
  validateEcosystemGeometry,
} from './ecosystemGeometry';
import EcosystemOrbit from './EcosystemOrbit';
import EcosystemConnection from './EcosystemConnection';
import EcosystemDomain from './EcosystemDomain';

/**
 * JmgEcosystem Component
 * 
 * Authoritative, production-ready, perfectly circular 6-domain radial ecosystem.
 * Collision-aware: pills never overlap each other, the central logo, or the container boundary.
 * All positions and connection lines are generated from the single mathematical
 * source of truth in ecosystemGeometry.js.
 */
export default function JmgEcosystem({
  domains = ECOSYSTEM_DOMAINS,
  activeDomain: controlledActiveDomain,
  onDomainChange,
  className = '',
}) {
  const [internalActiveId, setInternalActiveId] = useState(domains[0]?.id || 'technology');
  const [hoveredDomainId, setHoveredDomainId] = useState(null);
  const [isCoreHovered, setIsCoreHovered] = useState(false);

  // Support controlled or uncontrolled active state
  const activeDomainId = controlledActiveDomain?.id || controlledActiveDomain || internalActiveId;
  const activeDomain = domains.find((d) => d.id === activeDomainId) || domains[0];

  const handleSelectDomain = (domainId) => {
    setInternalActiveId(domainId);
    if (onDomainChange) {
      onDomainChange(domainId);
    }
  };

  // Single source of truth: solve collision-safe radii with minimal displacement from baseRadius
  const { baseRadius, domainRadii } = solveCollisionSafeRadius({
    baseRadius: BASE_RADIUS,
    domains,
  });

  return (
    <div className={`ecosystem-visual w-full max-w-md sm:max-w-[400px] md:max-w-[470px] lg:max-w-[580px] xl:max-w-[660px] 2xl:max-w-[720px] flex flex-col items-center mx-auto ${className}`}>
      
      {/* ========================================================================= */}
      {/* MOBILE ADAPTIVE ECOSYSTEM (< 640px)                                       */}
      {/* Clean 1-column or 2-column layout: CORE JMG + 6 Company Cards             */}
      {/* ========================================================================= */}
      <div className="block sm:hidden w-full select-none px-1">
        {/* Mobile Central Core Anchor */}
        <div className="flex flex-col items-center justify-center mb-4 text-center">
          <div
            onClick={() => handleSelectDomain(domains[0]?.id || 'technology')}
            role="button"
            tabIndex={0}
            className="p-3 px-6 rounded-2xl bg-white/90 border border-slate-200/90 shadow-sm flex items-center justify-center max-w-[180px] w-full cursor-pointer hover:border-slate-300 transition-all active:scale-[0.98]"
            aria-label="Jay Murlidhar Group Core"
          >
            <img
              src="/assets/jmg-logo.svg"
              alt="Jay Murlidhar Group"
              className="w-full h-auto max-h-[44px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              loading="eager"
            />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400 font-semibold mt-1">
            Central Core Hub
          </span>
        </div>

        {/* 6 Clean Responsive Cards */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 w-full">
          {domains.map((domain) => {
            const isJanSuvidha = domain.id === 'jan-suvidha';
            const isInsurance = domain.id === 'insurance';
            const isTechnology = domain.id === 'technology';
            const isBusinessServices = domain.id === 'business-services';
            const isTravel = domain.id === 'travel';
            const isRetail = domain.id === 'retail';
            const targetRoute = domain.domainRoute || domain.route || `/${domain.id}`;
            const isActive = domain.id === activeDomainId;

            return (
              <Link
                key={`mob-${domain.id}`}
                to={targetRoute}
                onClick={() => handleSelectDomain(domain.id)}
                className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl border bg-white/95 shadow-sm transition-all duration-200 min-h-[44px] hover:shadow-md ${
                  isActive ? 'ring-1' : ''
                }`}
                style={{
                  borderColor: isActive ? domain.accent : `${domain.accent}40`,
                  boxShadow: isActive ? `0 2px 8px ${domain.accent}15` : undefined,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Distinct Circular Logo Container */}
                  <div
                    className="w-[28px] h-[28px] rounded-full flex items-center justify-center flex-shrink-0 border"
                    style={{
                      borderColor: `${domain.accent}40`,
                      backgroundColor: `${domain.accent}0D`,
                    }}
                  >
                    {isJanSuvidha ? (
                      <img
                        src="/assets/csc-logo.svg"
                        alt="CSC"
                        className="h-[13px] w-auto object-contain"
                        loading="eager"
                      />
                    ) : isInsurance ? (
                      <img
                        src="/assets/jay-murlidhar-insurance-logo.png"
                        alt="Insurance"
                        className="h-[18px] w-auto object-contain"
                        loading="eager"
                      />
                    ) : isTechnology ? (
                      <img
                        src="/assets/jay-murlidhar-technology-logo.png"
                        alt="Technology"
                        className="h-[18px] w-auto object-contain"
                        loading="eager"
                      />
                    ) : isBusinessServices ? (
                      <img
                        src="/assets/jay-murlidhar-business-services-logo.png"
                        alt="Business Services"
                        className="w-[17px] h-auto object-contain"
                        loading="eager"
                      />
                    ) : isTravel ? (
                      <img
                        src="/assets/jay-murlidhar-travel-logo.png"
                        alt="Travel"
                        className="w-[17px] h-auto object-contain"
                        loading="eager"
                      />
                    ) : isRetail ? (
                      <img
                        src="/assets/jmg-retail-logo.png"
                        alt="Retail"
                        className="w-[17px] h-auto object-contain"
                        loading="eager"
                      />
                    ) : null}
                  </div>

                  {/* Number & Domain Name */}
                  <div className="flex items-center gap-1 min-w-0 truncate">
                    <span className="font-mono text-[9px] font-normal text-slate-400 shrink-0">
                      {domain.number}
                    </span>
                    <span className="font-medium text-[10px] xs:text-[10.5px] tracking-wider uppercase text-slate-900 truncate">
                      {domain.name}
                    </span>
                  </div>
                </div>

                {/* Status Dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 ml-0.5"
                  style={{ backgroundColor: domain.accent }}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP & TABLET: PERFECT CIRCULAR RADIAL ECOSYSTEM (>= 640px)            */}
      {/* ========================================================================= */}
      <div 
        className="hidden sm:block ecosystem-orbit relative w-full aspect-square select-none mx-auto"
        role="region"
        aria-label="Jay Murlidhar Group Circular Radial Architecture"
      >
        
        {/* Subtle Ambient Backlight Glow for active domain (Quiet, Restrained) */}
        <div
          className="absolute inset-6 rounded-full blur-[90px] opacity-15 transition-all duration-700 pointer-events-none"
          style={{ background: activeDomain.accent }}
          aria-hidden="true"
        />

        {/* Subtle moving ambient radial glow behind Central Logo */}
        <div
          className="jmg-ambient-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] rounded-full blur-[45px] pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(168, 85, 247, 0.08) 50%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* SVG Mathematical Orbit System & Shared Radial Conduits */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Concentric, circular orbit rings (Always a perfect circle at baseRadius) */}
          <EcosystemOrbit
            centerX={CENTER_X}
            centerY={CENTER_Y}
            orbitRadius={baseRadius}
            middleRadius={MIDDLE_RADIUS}
            coreRadius={CORE_RADIUS}
          />

          {/* Radial Connecting Conduits: Follow final calculated domain radius */}
          {domains.map((domain) => {
            const isActive = domain.id === activeDomainId;
            const isHighlighted = isCoreHovered || hoveredDomainId === domain.id;
            const domainRadius = domainRadii[domain.id] ?? baseRadius;
            const endRadius = getDomainEndRadius(domain.angle, domainRadius, DEFAULT_PILL_DIMENSIONS, domain.id, 16);
            const startRadius = getLogoStartRadius(domain.angle);
            const line = getRadialLineGeometry({
              centerX: CENTER_X,
              centerY: CENTER_Y,
              angle: domain.angle,
              coreRadius: startRadius,
              endRadius,
            });

            return (
              <EcosystemConnection
                key={`conduit-${domain.id}`}
                id={domain.id}
                startX={line.startX}
                startY={line.startY}
                endX={line.endX}
                endY={line.endY}
                midX={line.midX}
                midY={line.midY}
                length={line.length}
                rotation={line.rotation}
                isActive={isActive}
                isHighlighted={isHighlighted}
                accentColor={domain.accent}
              />
            );
          })}
        </svg>

        {/* CENTER HUB: OFFICIAL JMG LOGO (Exact Center: 50%, 50%) — Visual Anchor */}
        <div
          className="jmg-center-logo absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer select-none w-[26%] sm:w-[25%] md:w-[26%] lg:w-[27%] max-w-[210px]"
          onClick={() => handleSelectDomain(domains[0]?.id || 'technology')}
          onMouseEnter={() => setIsCoreHovered(true)}
          onMouseLeave={() => setIsCoreHovered(false)}
          onFocus={() => setIsCoreHovered(true)}
          onBlur={() => setIsCoreHovered(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSelectDomain(domains[0]?.id || 'technology');
            }
          }}
          aria-label="Jay Murlidhar Group Official Logo"
        >
          <img
            src="/assets/jmg-logo.svg"
            alt="Jay Murlidhar Group"
            className="w-full h-auto object-contain pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* 5 EQUIDISTANT RADIAL DOMAIN NODES                               */}
        
        {domains.map((domain) => {
          const isActive = domain.id === activeDomainId;
          const domainRadius = domainRadii[domain.id] ?? baseRadius;
          const pos = getRadialPosition(CENTER_X, CENTER_Y, domainRadius, domain.angle);

          return (
            <EcosystemDomain
              key={domain.id}
              domain={domain}
              x={pos.x}
              y={pos.y}
              isActive={isActive}
              onSelect={handleSelectDomain}
              onHover={setHoveredDomainId}
            />
          );
        })}

      </div>

    </div>
  );
}

export {
  ECOSYSTEM_DOMAINS,
  EcosystemOrbit,
  EcosystemConnection,
  EcosystemDomain,
};
