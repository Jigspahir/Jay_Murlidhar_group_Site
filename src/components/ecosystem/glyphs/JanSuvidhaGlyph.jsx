import React from 'react';

/**
 * 02 — JAN SUVIDHA GLYPH
 * Company: Jay Murlidhar Computer
 * Concept: Civic citizen service portal & digital public services architecture.
 * Communicates CSC, Jan Suvidha Kendra, government-to-citizen access.
 */
export default function JanSuvidhaGlyph({ 
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
      className={`jmg-glyph jmg-glyph-jan-suvidha transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Civic civic foundation base */}
      <path d="M4 20h16" />

      {/* Modern civic shelter canopy / lintel */}
      <path d="M4 7.5h16" />
      <path d="M12 3.5v4" className="opacity-90" />
      <circle cx="12" cy="3.5" r="0.85" fill="currentColor" />

      {/* Structured service pavilion columns */}
      <path d="M6.5 7.5v12.5M17.5 7.5v12.5" />

      {/* Central Citizen Access Portal */}
      <path 
        d="M9.5 20v-5.5a2.5 2.5 0 0 1 5 0V20" 
        className="jmg-portal transition-all duration-200"
      />

      {/* Digital citizen service connectivity nodes & ledger */}
      <circle cx="12" cy="11" r="0.9" fill="currentColor" className="jmg-service-node" />
      <path 
        d="M6.5 13.5h3M14.5 13.5h3" 
        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
      />
    </svg>
  );
}
