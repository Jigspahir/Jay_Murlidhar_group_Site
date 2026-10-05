import React from 'react';
import { CENTER_X, CENTER_Y, ORBIT_RADIUS, MIDDLE_RADIUS, CORE_RADIUS } from './ecosystemGeometry';

/**
 * EcosystemOrbit Component
 * Renders concentric, mathematically perfect circular orbit rings.
 * Orbit maintains width === height, aspect-ratio 1:1, border-radius 50%.
 */
export default function EcosystemOrbit({
  centerX = CENTER_X,
  centerY = CENTER_Y,
  orbitRadius = ORBIT_RADIUS,
  middleRadius = MIDDLE_RADIUS,
  coreRadius = CORE_RADIUS,
}) {
  return (
    <>
      <defs>
        <radialGradient id="hubHalo" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.12" />
          <stop offset="85%" stopColor="#A855F7" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Outer Orbit Ring (50-60s Clockwise) */}
      <g className="jmg-orbit-outer" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
        <circle
          cx={centerX}
          cy={centerY}
          r={orbitRadius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.22)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        {/* Subtle orbit marker pips on outer ring */}
        <circle cx={centerX} cy={centerY - orbitRadius} r="2" fill="rgba(56, 189, 248, 0.35)" />
        <circle cx={centerX + orbitRadius} cy={centerY} r="2" fill="rgba(6, 182, 212, 0.35)" />
        <circle cx={centerX} cy={centerY + orbitRadius} r="2" fill="rgba(249, 115, 22, 0.35)" />
        <circle cx={centerX - orbitRadius} cy={centerY} r="2" fill="rgba(16, 185, 129, 0.35)" />
      </g>

      {/* 2. Middle Orbit Ring (35-45s Counter-Clockwise) */}
      <g className="jmg-orbit-middle" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
        <circle
          cx={centerX}
          cy={centerY}
          r={middleRadius}
          fill="none"
          stroke="rgba(203, 213, 225, 0.32)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        {/* Subtle orbit marker pips on middle ring */}
        <circle cx={centerX + middleRadius * 0.707} cy={centerY - middleRadius * 0.707} r="1.8" fill="rgba(168, 85, 247, 0.3)" />
        <circle cx={centerX - middleRadius * 0.707} cy={centerY + middleRadius * 0.707} r="1.8" fill="rgba(56, 189, 248, 0.3)" />
      </g>

      {/* 3. Inner Orbit Ring (25-35s Clockwise) */}
      <g className="jmg-orbit-inner" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
        <circle
          cx={centerX}
          cy={centerY}
          r={Math.round((middleRadius + coreRadius) / 2)}
          fill="none"
          stroke="rgba(148, 163, 184, 0.24)"
          strokeWidth="1"
          strokeDasharray="2 5"
        />
        {/* Subtle orbit marker pips on inner ring */}
        <circle cx={centerX - Math.round((middleRadius + coreRadius) / 2) * 0.707} cy={centerY - Math.round((middleRadius + coreRadius) / 2) * 0.707} r="1.6" fill="rgba(56, 189, 248, 0.35)" />
        <circle cx={centerX + Math.round((middleRadius + coreRadius) / 2) * 0.707} cy={centerY + Math.round((middleRadius + coreRadius) / 2) * 0.707} r="1.6" fill="rgba(16, 185, 129, 0.35)" />
      </g>

      {/* 3. Subtle Aura Halo around Central Hub */}
      <circle
        cx={centerX}
        cy={centerY}
        r={coreRadius + 22}
        fill="url(#hubHalo)"
      />
    </>
  );
}
