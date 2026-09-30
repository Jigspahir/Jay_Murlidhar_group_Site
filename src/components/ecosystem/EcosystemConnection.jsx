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
  accentColor = '#38BDF8',
  id,
}) {
  const mx = midX ?? (startX + endX) / 2;
  const my = midY ?? (startY + endY) / 2;

  return (
    <g id={`conduit-${id}`}>
      {/* Radial Conduit Line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={accentColor}
        strokeWidth={isActive ? '2.5' : '1.2'}
        strokeOpacity={isActive ? 0.95 : 0.35}
        strokeDasharray={isActive ? 'none' : '4 5'}
        className="transition-all duration-300"
      />

      {/* Subtle Energy Node at Midpoint */}
      {isActive ? (
        <circle
          cx={mx}
          cy={my}
          r="4"
          fill={accentColor}
          className="animate-pulse"
        />
      ) : (
        <circle
          cx={mx}
          cy={my}
          r="2.5"
          fill={accentColor}
          opacity="0.4"
        />
      )}
    </g>
  );
}
