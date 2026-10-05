import React from 'react';

/**
 * 03 — INSURANCE GLYPH
 * Company: Jay Murlidhar Insurance
 * Concept: Simplified protection shield with distinctive internal concentric verification core.
 * Communicates enterprise security, underwriting, asset protection, and trust.
 */
export default function InsuranceGlyph({ 
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
      className={`jmg-glyph jmg-glyph-insurance transition-all duration-200 ease-out ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Outer heraldic protection shield contour */}
      <path 
        d="M12 3.5 L19.5 6.5 V11.5 C19.5 16.2 12 20.5 12 20.5 C12 20.5 4.5 16.2 4.5 11.5 V6.5 Z" 
        className="transition-all duration-200"
      />

      {/* Internal concentric security core */}
      <path 
        d="M12 7.5 L16 9.3 V12.2 C16 15 12 17.2 12 17.2 C12 17.2 8 15 8 12.2 V9.3 Z" 
        className="opacity-75 group-hover:opacity-100 transition-opacity duration-200"
      />

      {/* Central assurance axis & security verification anchor */}
      <path d="M12 3.5v4" className="opacity-90" />
      <path d="M9.75 12.5 L11.25 14 L14.5 10.75" className="jmg-shield-check transition-all duration-200" />
    </svg>
  );
}
