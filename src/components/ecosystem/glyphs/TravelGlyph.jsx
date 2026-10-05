import React from 'react';

/**
 * 05 — TRAVEL GLYPH
 * Company: Jay Murlidhar Tours
 * Concept: Aerodynamic flight vector & orbital journey trajectory route.
 * Communicates global mobility, student delegations, expeditions, and travel.
 */
export default function TravelGlyph({ 
  className = "w-5 h-5", 
  strokeWidth = 1.75,
  ...props 
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`jmg-glyph jmg-glyph-travel transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Origin departure waypoint node */}
      <circle cx="4" cy="19.5" r="1.1" fill="currentColor" className="opacity-90" />

      {/* Sweeping journey trajectory route */}
      <path 
        d="M4 19.5 C 7.5 19.5, 11.5 16.5, 14.5 12" 
        className="jmg-travel-route opacity-75 group-hover:opacity-100 transition-all duration-200" 
        strokeDasharray="1.5 2.5"
      />

      {/* Aerodynamic supersonic flight vector craft */}
      <path 
        d="M21 3.5 L8.5 9 L13 13.5 L14.5 12 L16.5 15.5 L18 15 L16.5 11 L21 3.5 Z" 
        className="jmg-travel-vector transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />

      {/* Destination waypoint coordinates */}
      <circle cx="21" cy="3.5" r="0.75" fill="currentColor" />
    </svg>
  );
}
