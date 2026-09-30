import React from 'react';

/**
 * BusinessConnections — SVG Vector Energy Conduits Connecting JMG Core to Domains
 */
export default function BusinessConnections({ domains, activeDomainId, currentStep = 4 }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" 
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="explorerHubGlowSvg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Concentric Guide Orbits (Visible in Steps 2, 3, 4) */}
      {currentStep >= 2 && (
        <>
          <circle cx="50" cy="50" r="32" fill="none" stroke="#1E293B" strokeWidth="0.35" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#0F172A" strokeWidth="0.25" strokeDasharray="2 4" />
        </>
      )}

      {/* Central Core Background Halo */}
      <circle cx="50" cy="50" r="16" fill="url(#explorerHubGlowSvg)" stroke="#334155" strokeWidth="0.4" />

      {/* Connection Conduits (Visible in Steps 3 and 4) */}
      {currentStep >= 3 && domains.map((domain) => {
        const isActive = domain.id === activeDomainId;
        return (
          <g key={`conduit-${domain.id}`}>
            {/* Underlying conduit trace */}
            <line
              x1="50"
              y1="50"
              x2={domain.coords.x}
              y2={domain.coords.y}
              stroke={isActive ? domain.accent : '#1E293B'}
              strokeWidth={isActive ? '0.7' : '0.25'}
              strokeOpacity={isActive ? 0.95 : 0.35}
              strokeDasharray={isActive ? 'none' : '1 2.5'}
              className="transition-all duration-500"
            />

            {/* Active moving energy pulse on selected domain */}
            {isActive && (
              <circle
                r="0.9"
                fill={domain.accent}
                className="animate-ping"
                cx={(50 + domain.coords.x) / 2}
                cy={(50 + domain.coords.y) / 2}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
