import React from 'react';

/**
 * EcosystemConnection Component
 * Renders a single radial conduit connecting the JMG Core to a domain node.
 * Receives shared mathematical line geometry (startX, startY, endX, endY, length, rotation).
 * Contains ZERO per-domain positioning logic.
 */
export default function EcosystemConnection({
  startX,
  startY,
  endX,
  endY,
  midX,
  midY,
  length,
  rotation,
  isActive = false,
  isHighlighted = false,
  accentColor = '#38BDF8',
  id,
}) {
  const mx = midX ?? (startX + endX) / 2;
  const my = midY ?? (startY + endY) / 2;

  return (
    <g id={`conduit-${id}`}>
      {/* Radial Conduit Line (Thinner, Lower Contrast, Subtle) */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={accentColor}
        strokeWidth={isActive ? '1.8' : isHighlighted ? '1.5' : '1'}
        strokeOpacity={isActive ? 0.85 : isHighlighted ? 0.65 : 0.22}
        strokeDasharray={isActive ? 'none' : '3 5'}
        className="transition-all duration-300"
      />

      {/* Continuous Subtle Moving-Dot Data Flow along Conduit (CORE JMG -> Domain) */}
      <circle
        r={isActive ? '2.5' : isHighlighted ? '2.2' : '1.7'}
        fill={accentColor}
        opacity={isActive ? 0.95 : isHighlighted ? 0.85 : 0.55}
        className="jmg-data-dot"
      >
        <animateMotion
          path={`M ${startX} ${startY} L ${endX} ${endY}`}
          dur="4.4s"
          repeatCount="indefinite"
        />
      </circle>

      <circle
        r={isActive ? '2.2' : isHighlighted ? '1.9' : '1.4'}
        fill={accentColor}
        opacity={isActive ? 0.80 : isHighlighted ? 0.70 : 0.40}
        className="jmg-data-dot"
      >
        <animateMotion
          path={`M ${startX} ${startY} L ${endX} ${endY}`}
          dur="4.4s"
          begin="2.2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Subtle Energy Node at Midpoint */}
      {isActive ? (
        <circle
          cx={mx}
          cy={my}
          r="3"
          fill={accentColor}
          className="animate-pulse"
        />
      ) : isHighlighted ? (
        <circle
          cx={mx}
          cy={my}
          r="2.2"
          fill={accentColor}
          opacity="0.6"
        />
      ) : (
        <circle
          cx={mx}
          cy={my}
          r="1.8"
          fill={accentColor}
          opacity="0.25"
        />
      )}
    </g>
  );
}
