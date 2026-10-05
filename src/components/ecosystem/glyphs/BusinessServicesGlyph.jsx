import React from 'react';

/**
 * 04 — BUSINESS SERVICES GLYPH
 * Company: Jay Murlidhar Business Services
 * Concept: Geometric corporate portfolio & structured operational workflow architecture.
 * Communicates compliance, business operations, corporate governance, and advisory.
 */
export default function BusinessServicesGlyph({ 
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
      className={`jmg-glyph jmg-glyph-business transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Precision architectural handle */}
      <path 
        d="M9 5.5V4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v1.5" 
        className="transition-all duration-200"
      />

      {/* Main corporate operational portfolio chassis */}
      <rect 
        x="3.5" 
        y="5.5" 
        width="17" 
        height="15" 
        rx="2.5" 
        className="transition-opacity duration-200"
      />

      {/* Horizontal workflow partition line */}
      <path d="M3.5 11.5h17" className="opacity-80" />

      {/* Central governance clasp / nexus */}
      <rect 
        x="10.5" 
        y="10" 
        width="3" 
        height="3" 
        rx="0.75" 
        fill="currentColor"
        className="jmg-business-clasp opacity-90 transition-transform duration-200"
      />

      {/* Structured compliance & operational data tracks */}
      <path 
        d="M7 16h4M14 16h3" 
        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
      />
    </svg>
  );
}
