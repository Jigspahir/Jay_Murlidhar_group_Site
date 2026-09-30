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
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.22" />
          <stop offset="85%" stopColor="#A855F7" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Outer Orbit Ring (Light dashed subtle ring: Radius 350) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={orbitRadius}
        fill="none"
        stroke="rgba(148, 163, 184, 0.4)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* 2. Middle Orbit Ring (Light dashed subtle ring: Radius 230) */}
      <circle
        cx={centerX}
        cy={centerY}
        r={middleRadius}
        fill="none"
        stroke="rgba(203, 213, 225, 0.6)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
      />

      {/* 3. Subtle Aura Halo around JMG Core */}
      <circle
        cx={centerX}
        cy={centerY}
        r={coreRadius + 22}
        fill="url(#hubHalo)"
      />

      {/* 4. Inner Core Orbit Boundary Ring */}
      <circle
        cx={centerX}
        cy={centerY}
        r={coreRadius}
        fill="none"
        stroke="rgba(148, 163, 184, 0.35)"
        strokeWidth="1.2"
      />
    </>
  );
}
