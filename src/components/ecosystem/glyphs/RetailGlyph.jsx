import React from 'react';

/**
 * 06 — RETAIL GLYPH
 * Company: Jay Murlidhar Mobile & Accessories
 * Concept: Precision smart mobile device & wireless accessory/commerce interface.
 * Communicates smartphones, smart campus hardware, mobility accessories, and device retail.
 */
export default function RetailGlyph({ 
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
      className={`jmg-glyph jmg-glyph-retail transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Precision mobile device chassis */}
      <rect 
        x="6" 
        y="2.5" 
        width="12" 
        height="19" 
        rx="2.5" 
        className="transition-opacity duration-200"
      />

      {/* Top camera / dynamic island array */}
      <path d="M10.5 5h3" className="opacity-90" />

      {/* Smart accessories & wireless commerce signal waves */}
      <path 
        d="M9.25 10a3.8 3.8 0 0 1 5.5 0" 
        className="jmg-retail-wave opacity-75 group-hover:opacity-100 transition-opacity duration-200"
      />
      <path 
        d="M10.5 12a2 2 0 0 1 3 0" 
        className="jmg-retail-wave opacity-85 group-hover:opacity-100 transition-opacity duration-200"
      />
      <circle cx="12" cy="14" r="0.75" fill="currentColor" />

      {/* Bottom device navigation bar */}
      <path d="M10 19.5h4" className="opacity-80" />
    </svg>
  );
}
