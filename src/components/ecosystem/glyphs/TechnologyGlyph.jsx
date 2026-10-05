import React from 'react';

/**
 * 01 — TECHNOLOGY GLYPH
 * Company: Jay Murlidhar Tech Solutions
 * Concept: Custom digital microchip & circuit architecture with signature J-circuit logic trace.
 */
export default function TechnologyGlyph({ 
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
      className={`jmg-glyph jmg-glyph-technology transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Outer structured chassis */}
      <rect 
        x="4" 
        y="4" 
        width="16" 
        height="16" 
        rx="3.5" 
        className="transition-opacity duration-200"
      />

      {/* External circuit bus pins */}
      <path 
        d="M9 1.5v2.5M15 1.5v2.5M9 20v2.5M15 20v2.5M1.5 9h2.5M1.5 15h2.5M20 9h2.5M20 15h2.5" 
        strokeWidth={1.5}
        className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
      />

      {/* Signature J-inspired internal digital circuit trace */}
      <path 
        d="M12 7.5v6a2.5 2.5 0 0 1-2.5 2.5h-1a1.5 1.5 0 0 1-1.5-1.5" 
        className="jmg-trace-primary transition-all duration-200"
      />

      {/* Horizontal logic bus branch */}
      <path 
        d="M12 10.5h4a1.5 1.5 0 0 1 1.5 1.5v0a1.5 1.5 0 0 1-1.5 1.5h-0.5" 
        className="jmg-trace-secondary transition-all duration-200 opacity-85 group-hover:opacity-100"
      />

      {/* Digital logic terminal nodes */}
      <circle cx="12" cy="7.5" r="0.85" fill="currentColor" />
      <circle cx="17.5" cy="12" r="0.75" fill="currentColor" className="opacity-90" />
    </svg>
  );
}
