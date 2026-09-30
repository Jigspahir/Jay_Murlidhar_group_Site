/*
 * JMG ECOSYSTEM — 5-DOMAIN COLLISION-AWARE GEOMETRY ENGINE & SOURCE OF TRUTH
 * Canonical Angle Convention (5 Domains, clockwise, 0° = RIGHT, 90° = BOTTOM, 180° = LEFT, 270° = TOP):
 *   01 TECHNOLOGY          270° (TOP)
 *   02 INSURANCE           342° (TOP-RIGHT)
 *   03 BUSINESS SERVICES   54°  (BOTTOM-RIGHT)
 *   04 TRAVEL              126° (BOTTOM-LEFT)
 *   05 RETAIL              198° (TOP-LEFT)
 * Center: (500, 500)
 */

export const CENTER_X = 500;
export const CENTER_Y = 500;
export const CORE_RADIUS = 110;
export const CORE_HALF_WIDTH = 110;
export const CORE_HALF_HEIGHT = 110;
export const CONTAINER_PADDING = 24;
export const CORE_TO_PILL_GAP = 24;
export const DOMAIN_GAP = 16;

/**
 * Standard estimated rendered pill dimensions in 1000-unit coordinate space
 * Participating in collision geometry calculations.
 */
export const DEFAULT_PILL_DIMENSIONS = {
  'technology': { width: 300, height: 74 },
  'insurance': { width: 270, height: 74 },
  'business-services': { width: 370, height: 74 },
  'travel': { width: 240, height: 74 },
  'retail': { width: 240, height: 74 },
};

/**
 * Calculates a domain pill's projection along its radial vector.
 * Accounts for rectangular aspect ratio (horizontal pills are wider than tall).
 */
export function getPillRadialExtent(width, height, angle) {
  const radians = (angle * Math.PI) / 180;
  return (
    Math.abs(Math.cos(radians)) * (width / 2) +
    Math.abs(Math.sin(radians)) * (height / 2)
  );
}

/**
 * Calculates domain position on the orbit using the authoritative radial formula:
 *   x = centerX + radius * Math.cos(radians)
 *   y = centerY + radius * Math.sin(radians)
 */
export function getRadialPosition(
  centerX = CENTER_X,
  centerY = CENTER_Y,
  radius = BASE_RADIUS,
  angle = 0
) {
  let cx = centerX;
  let cy = centerY;
  let r = radius;
  let a = angle;

  if (arguments.length === 1 && typeof centerX === 'number') {
    a = centerX;
    cx = CENTER_X;
    cy = CENTER_Y;
    r = BASE_RADIUS;
  } else if (arguments.length === 2) {
    a = centerX;
    r = centerY;
    cx = CENTER_X;
    cy = CENTER_Y;
  }

  const radians = (a * Math.PI) / 180;

  return {
    x: Math.round((cx + r * Math.cos(radians)) * 10) / 10,
    y: Math.round((cy + r * Math.sin(radians)) * 10) / 10,
  };
}

/**
 * Minimum Safe Radius for a domain:
 * Guarantees that the domain pill never intersects the central Core Hub.
 * Accounts for horizontal elongation (e.g. 03 BUSINESS SERVICES).
 */
export function getMinimumSafeRadius({
  coreRadius = CORE_RADIUS,
  coreHalfWidth = CORE_HALF_WIDTH,
  coreHalfHeight = CORE_HALF_HEIGHT,
  pillWidth = 260,
  pillHeight = 62,
  angle = 180,
  coreToPillGap = CORE_TO_PILL_GAP,
} = {}) {
  const radians = (angle * Math.PI) / 180;
  const isHorizontal = Math.abs(Math.sin(radians)) < 0.001;
  const isVertical = Math.abs(Math.cos(radians)) < 0.001;

  if (isHorizontal) {
    return coreHalfWidth + (pillWidth / 2) + coreToPillGap;
  }
  if (isVertical) {
    return coreHalfHeight + (pillHeight / 2) + coreToPillGap;
  }

  // Diagonal / radial projection
  const extent = getPillRadialExtent(pillWidth, pillHeight, angle);
  return coreRadius + extent + coreToPillGap;
}

/**
 * Maximum Safe Radius for a domain:
 * Guarantees that the domain pill remains completely inside container safe boundaries.
 * Directly prevents 08 RETAIL from overflowing the bottom border.
 */
export function getMaximumSafeRadius({
  ecosystemSize = 1000,
  containerPadding = CONTAINER_PADDING,
  centerX = CENTER_X,
  centerY = CENTER_Y,
  pillWidth = 200,
  pillHeight = 62,
  angle = 90,
} = {}) {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  let maxRadius = ecosystemSize / 2;

  if (cos > 0.001) {
    const maxX = (centerX - containerPadding - (pillWidth / 2)) / cos;
    if (maxX < maxRadius) maxRadius = maxX;
  }
  if (sin > 0.001) {
    const maxY = (centerY - containerPadding - (pillHeight / 2)) / sin;
    if (maxY < maxRadius) maxRadius = maxY;
  }

  return Math.max(0, maxRadius);
}

export function rectsOverlap(r1, r2, gap = 0) {
  return (
    r1.left - gap < r2.right &&
    r1.right + gap > r2.left &&
    r1.top - gap < r2.bottom &&
    r1.bottom + gap > r2.top
  );
}

/**
 * Collision-Aware Solver:
 * Default: every domain sits at one shared baseRadius.
 * Exception: if and only if validation detects a real Core collision (e.g. 04/05)
 * or boundary violation (e.g. 08), minimal mathematical radial adjustment is applied
 * strictly along the domain's canonical angle vector.
 * 
 * Objective:
 *   minimize Σ |domainRadius_i - baseRadius|
 *   subject to:
 *     no Core collision
 *     no container clipping
 *     no pill-to-pill overlap
 */
export function solveCollisionSafeRadius({
  baseRadius = 310,
  ecosystemSize = 1000,
  coreRadius = CORE_RADIUS,
  coreHalfWidth = CORE_HALF_WIDTH,
  coreHalfHeight = CORE_HALF_HEIGHT,
  coreToPillGap = CORE_TO_PILL_GAP,
  containerPadding = CONTAINER_PADDING,
  domains = ECOSYSTEM_DOMAINS,
  pillDimensions = DEFAULT_PILL_DIMENSIONS,
} = {}) {
  const domainRadii = {};
  const isAdjusted = {};
  const centerX = ecosystemSize / 2;
  const centerY = ecosystemSize / 2;

  // Step 1: Initialize at baseRadius, bounded by Core clearance and Container boundaries
  for (const d of domains) {
    const dim = pillDimensions[d.id] || { width: 200, height: 62 };
    const minSafe = getMinimumSafeRadius({
      coreRadius,
      coreHalfWidth,
      coreHalfHeight,
      pillWidth: dim.width,
      pillHeight: dim.height,
      angle: d.angle,
      coreToPillGap,
    });
    const maxSafe = getMaximumSafeRadius({
      ecosystemSize,
      containerPadding,
      centerX,
      centerY,
      pillWidth: dim.width,
      pillHeight: dim.height,
      angle: d.angle,
    });

    let r = baseRadius;
    if (r < minSafe) {
      r = minSafe;
      isAdjusted[d.id] = true;
    } else if (r > maxSafe) {
      r = maxSafe;
      isAdjusted[d.id] = true;
    } else {
      isAdjusted[d.id] = false;
    }

    domainRadii[d.id] = Math.round(r * 10) / 10;
  }

  // Step 2: Pill-to-Pill pair collision check & minimal radial resolution along canonical angles
  const maxIterations = 8;
  let iteration = 0;
  let hasOverlap = true;

  while (hasOverlap && iteration < maxIterations) {
    hasOverlap = false;
    iteration++;

    const bounds = domains.map((d) => {
      const r = domainRadii[d.id];
      const rad = (d.angle * Math.PI) / 180;
      const x = centerX + r * Math.cos(rad);
      const y = centerY + r * Math.sin(rad);
      const dim = pillDimensions[d.id] || { width: 200, height: 62 };
      return {
        id: d.id,
        angle: d.angle,
        dim,
        left: x - dim.width / 2,
        right: x + dim.width / 2,
        top: y - dim.height / 2,
        bottom: y + dim.height / 2,
      };
    });

    for (let i = 0; i < domains.length; i++) {
      for (let j = i + 1; j < domains.length; j++) {
        if (rectsOverlap(bounds[i], bounds[j], 8)) {
          hasOverlap = true;
          const d1 = domains[i];
          const d2 = domains[j];
          const maxSafe1 = getMaximumSafeRadius({ ecosystemSize, containerPadding, centerX, centerY, pillWidth: bounds[i].dim.width, pillHeight: bounds[i].dim.height, angle: d1.angle });
          const maxSafe2 = getMaximumSafeRadius({ ecosystemSize, containerPadding, centerX, centerY, pillWidth: bounds[j].dim.width, pillHeight: bounds[j].dim.height, angle: d2.angle });

          if (domainRadii[d2.id] + 8 <= maxSafe2) {
            domainRadii[d2.id] = Math.round((domainRadii[d2.id] + 8) * 10) / 10;
            isAdjusted[d2.id] = true;
          } else if (domainRadii[d1.id] + 8 <= maxSafe1) {
            domainRadii[d1.id] = Math.round((domainRadii[d1.id] + 8) * 10) / 10;
            isAdjusted[d1.id] = true;
          }
        }
      }
    }
  }

  // Step 3: Compute total displacement from baseRadius
  let totalDisplacement = 0;
  for (const d of domains) {
    totalDisplacement += Math.abs(domainRadii[d.id] - baseRadius);
  }

  return {
    baseRadius,
    domainRadii,
    isAdjusted,
    totalDisplacement,
  };
}

export const getCollisionAwareRadius = solveCollisionSafeRadius;

/**
 * Validates the entire ecosystem geometry against collision and boundary rules.
 */
export function validateEcosystemGeometry({
  ecosystemSize = 1000,
  centerX = CENTER_X,
  centerY = CENTER_Y,
  baseRadius = BASE_RADIUS,
  domainRadii,
  coreRadius = CORE_RADIUS,
  coreHalfWidth = CORE_HALF_WIDTH,
  coreHalfHeight = CORE_HALF_HEIGHT,
  coreToPillGap = CORE_TO_PILL_GAP,
  containerPadding = CONTAINER_PADDING,
  domainGap = DOMAIN_GAP,
  domains = ECOSYSTEM_DOMAINS,
  pillDimensions = DEFAULT_PILL_DIMENSIONS,
} = {}) {
  const radii = domainRadii || solveCollisionSafeRadius({
    baseRadius,
    ecosystemSize,
    coreRadius,
    coreHalfWidth,
    coreHalfHeight,
    coreToPillGap,
    containerPadding,
    domains,
    pillDimensions,
  }).domainRadii;

  const violations = [];
  const boxes = [];

  for (const d of domains) {
    const r = radii[d.id] ?? baseRadius;
    const rad = (d.angle * Math.PI) / 180;
    const x = centerX + r * Math.cos(rad);
    const y = centerY + r * Math.sin(rad);
    const dim = pillDimensions[d.id] || { width: 260, height: 74 };

    const left = x - dim.width / 2;
    const right = x + dim.width / 2;
    const top = y - dim.height / 2;
    const bottom = y + dim.height / 2;

    // Check boundary
    if (left < containerPadding) violations.push(`${d.name} exceeds left container boundary (${left.toFixed(1)} < ${containerPadding})`);
    if (right > ecosystemSize - containerPadding) violations.push(`${d.name} exceeds right container boundary (${right.toFixed(1)} > ${ecosystemSize - containerPadding})`);
    if (top < containerPadding) violations.push(`${d.name} exceeds top container boundary (${top.toFixed(1)} < ${containerPadding})`);
    if (bottom > ecosystemSize - containerPadding) violations.push(`${d.name} exceeds bottom container boundary (${bottom.toFixed(1)} > ${ecosystemSize - containerPadding})`);

    // Check Core clearance
    const minSafe = getMinimumSafeRadius({
      coreRadius,
      coreHalfWidth,
      coreHalfHeight,
      pillWidth: dim.width,
      pillHeight: dim.height,
      angle: d.angle,
      coreToPillGap,
    });
    if (r < minSafe - 1) {
      violations.push(`${d.name} too close to Core (radius ${r} < required minimum ${minSafe.toFixed(1)})`);
    }

    boxes.push({ id: d.id, name: d.name, left, right, top, bottom, x, y, radius: r });
  }

  // Check pill-to-pill overlap
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const b1 = boxes[i];
      const b2 = boxes[j];
      const overlapX = b1.left < b2.right && b1.right > b2.left;
      const overlapY = b1.top < b2.bottom && b1.bottom > b2.top;
      if (overlapX && overlapY) {
        violations.push(`Pill collision between ${b1.name} and ${b2.name}`);
      }
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
    radii,
    boxes,
  };
}

/**
 * Computes endpoint radius so the connection line stops cleanly before entering the domain pill,
 * guaranteeing a clean visual gap without cutting into borders or text.
 */
export function getDomainEndRadius(
  angleDeg,
  radius = BASE_RADIUS,
  pillDimensions = DEFAULT_PILL_DIMENSIONS,
  domainId,
  clearance = 16
) {
  const dim = (domainId && pillDimensions[domainId]) || { width: 260, height: 74 };
  const extent = getPillRadialExtent(dim.width, dim.height, angleDeg);
  return radius - extent - clearance;
}

/**
 * Shared Connection-Line Geometry Helper:
 * Calculates line endpoints, midpoint, Euclidean length, and atan2 rotation.
 * Starts cleanly at Core boundary and ends before entering the domain pill.
 */
export function getRadialLineGeometry({
  centerX = CENTER_X,
  centerY = CENTER_Y,
  angle,
  coreRadius = CORE_RADIUS,
  endRadius,
}) {
  const radians = (angle * Math.PI) / 180;

  const startX = centerX + coreRadius * Math.cos(radians);
  const startY = centerY + coreRadius * Math.sin(radians);

  const endX = centerX + endRadius * Math.cos(radians);
  const endY = centerY + endRadius * Math.sin(radians);

  const dx = endX - startX;
  const dy = endY - startY;

  const length = Math.sqrt(dx * dx + dy * dy);
  const rotation = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    startX: Math.round(startX * 10) / 10,
    startY: Math.round(startY * 10) / 10,
    endX: Math.round(endX * 10) / 10,
    endY: Math.round(endY * 10) / 10,
    midX: Math.round(((startX + endX) / 2) * 10) / 10,
    midY: Math.round(((startY + endY) / 2) * 10) / 10,
    length: Math.round(length * 10) / 10,
    rotation: Math.round(rotation * 10) / 10,
  };
}

/**
 * CANONICAL DOMAIN MAP
 * Single source of truth for business domains, numbering, and canonical angles.
 */
export const ECOSYSTEM_DOMAINS = [
  {
    number: "01",
    name: "TECHNOLOGY",
    id: "technology",
    shortName: "TECH",
    domainRoute: "/technology",
    route: "/technology",
    angle: 270, // TOP
    accent: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.28)",
    label: "Technology & Digital",
    tagline: "Custom enterprise software, campus ERPs & hardware engineering",
    description: "Engineering resilient digital platforms, academic ERP platforms, workstation diagnostic setups, and cloud systems.",
    companies: [
      { name: "Jay Murlidhar Computer", path: "/technology/jay-murlidhar-computer", role: "Hardware & IT Infrastructure" },
      { name: "Jay Murlidhar Tech Solutions", path: "/technology/jay-murlidhar-tech-solutions", role: "Software & Campus ERP" },
    ],
    capabilities: ["Campus ERP Systems", "Cloud Software", "Workstations & Networking", "Digital Solutions"],
  },
  {
    number: "02",
    name: "INSURANCE",
    id: "insurance",
    shortName: "INSURE",
    domainRoute: "/insurance",
    route: "/insurance",
    angle: 342, // TOP-RIGHT (72° clockwise from 270°)
    accent: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.18)",
    label: "Risk & Underwriting",
    tagline: "Institutional risk mitigation, general & life protection",
    description: "Corporate underwriting, academic campus liability coverage, asset risk consulting, and comprehensive health plans.",
    companies: [
      { name: "Jay Murlidhar Insurance", path: "/insurance/jay-murlidhar-insurance", role: "Enterprise & Asset Risk" },
    ],
    capabilities: ["Asset Protection", "Institutional Underwriting", "Corporate Health", "Policy Advisory"],
  },
  {
    number: "03",
    name: "BUSINESS SERVICES",
    id: "business-services",
    shortName: "BIZ SERVICES",
    domainRoute: "/business-services",
    route: "/business-services",
    angle: 54, // BOTTOM-RIGHT (72° clockwise from 342°)
    accent: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.18)",
    label: "Corporate Operations",
    tagline: "Regulatory compliance, workflow automation & consulting",
    description: "Corporate certifications, tax advisory, statutory compliance, licensing, and day-to-day organizational workflow setups.",
    companies: [
      { name: "Jay Murlidhar Business Services", path: "/business-services/jay-murlidhar-business-services", role: "Corporate Governance" },
    ],
    capabilities: ["Regulatory Filing", "Entity Setup", "Operational Workflows", "Audits & Certifications"],
  },
  {
    number: "04",
    name: "TRAVEL",
    id: "travel",
    shortName: "TRAVEL",
    domainRoute: "/travel",
    route: "/travel",
    angle: 126, // BOTTOM-LEFT (72° clockwise from 54°)
    accent: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.18)",
    label: "Tours & Logistics",
    tagline: "Educational study tours & corporate travel operations",
    description: "Curated institutional study tours, university student delegations, faculty expeditions, and corporate travel planning.",
    companies: [
      { name: "Jay Murlidhar Tours", path: "/travel/jay-murlidhar-tours", role: "Study & Corporate Mobility" },
    ],
    capabilities: ["Academic Study Tours", "Corporate Delegations", "Logistics Management", "Custom Itineraries"],
  },
  {
    number: "05",
    name: "RETAIL",
    id: "retail",
    shortName: "RETAIL",
    domainRoute: "/retail",
    route: "/retail",
    angle: 198, // TOP-LEFT (72° clockwise from 126°)
    accent: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.18)",
    label: "Hardware & Accessories",
    tagline: "Smart consumer devices, student gear & mobility essentials",
    description: "Authentic mobile hardware, institutional tablet procurement, accessories, and certified electronics servicing.",
    companies: [
      { name: "Jay Murlidhar Mobile & Accessories", path: "/retail/jay-murlidhar-mobile-accessories", role: "Smart Hardware & Devices" },
    ],
    capabilities: ["Smartphones & Accessories", "Student Hardware", "Institutional Supply", "Device Support"],
  },
];

// Pre-computed default collision-safe radius
export const BASE_RADIUS = 350;
export const ORBIT_RADIUS = BASE_RADIUS;
export const MIDDLE_RADIUS = 230;
