import React, { useState } from 'react';
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
 * Authoritative, production-ready, perfectly circular 5-domain radial ecosystem.
 * Collision-aware: pills never overlap each other, the Core, or the container boundary.
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
    <div className={`ecosystem-visual w-full max-w-[295px] min-[380px]:max-w-[325px] sm:max-w-[390px] md:max-w-[470px] lg:max-w-[580px] xl:max-w-[660px] min-[1536px]:max-w-[720px] flex flex-col items-center mx-auto ${className}`}>
      
      {/* PERFECT CIRCULAR RADIAL ECOSYSTEM (True 1:1 Aspect Ratio)          */}
      
      <div 
        className="ecosystem-orbit relative w-full aspect-square select-none mx-auto"
        role="region"
        aria-label="Jay Murlidhar Group Circular Radial Ecosystem"
      >
        
        {/* Subtle Ambient Backlight Glow for active domain */}
        <div
          className="absolute inset-4 rounded-full blur-[80px] opacity-25 transition-all duration-700 pointer-events-none"
          style={{ background: activeDomain.accent }}
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
            const domainRadius = domainRadii[domain.id] ?? baseRadius;
            const endRadius = getDomainEndRadius(domain.angle, domainRadius, DEFAULT_PILL_DIMENSIONS, domain.id, 16);
            const line = getRadialLineGeometry({
              centerX: CENTER_X,
              centerY: CENTER_Y,
              angle: domain.angle,
              coreRadius: CORE_RADIUS,
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
                accentColor={domain.accent}
              />
            );
          })}
        </svg>

        {/* CENTER HUB: JAY MURLIDHAR GROUP CORE (Exact Center: 50%, 50%)   */}

        <div
          className="core absolute z-20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92px] h-[92px] sm:w-[110px] sm:h-[110px] md:w-[126px] md:h-[126px] lg:w-[146px] lg:h-[146px] xl:w-[156px] xl:h-[156px] min-[1536px]:w-[166px] min-[1536px]:h-[166px] rounded-full flex flex-col items-center justify-center bg-[#09111E] border border-white/20 shadow-[0_0_35px_rgba(56,189,248,0.2)] cursor-pointer group"
          onClick={() => handleSelectDomain(domains[0]?.id || 'technology')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSelectDomain(domains[0]?.id || 'technology');
            }
          }}
          aria-label="JMG Central Core Hub"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[9.5px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[13.5px] font-mono tracking-widest text-[#38BDF8] font-bold uppercase">
              CORE
            </span>
          </div>

          <span className="text-[15px] sm:text-[19px] md:text-[22px] lg:text-[25px] xl:text-[27px] font-extrabold tracking-tight text-white uppercase text-center leading-tight">
            JMG
          </span>

          <span className="text-[8.5px] sm:text-[10px] md:text-[11px] lg:text-[12px] xl:text-[13px] text-slate-400 font-mono tracking-widest uppercase mt-0.5 sm:mt-1">
            GROUP
          </span>
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
