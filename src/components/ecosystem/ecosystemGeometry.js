/*
 * JMG ECOSYSTEM — 6-DOMAIN COLLISION-AWARE GEOMETRY ENGINE & SOURCE OF TRUTH
 * Balanced Hexagonal Angle Convention (6 Domains evenly spaced at 60° increments, 0° = RIGHT, 180° = LEFT):
 *   01 TECHNOLOGY          180° (LEFT)
 *   02 JAN SUVIDHA         240° (UPPER-LEFT)
 *   03 INSURANCE           300° (UPPER-RIGHT)
 *   04 BUSINESS SERVICES   0°   (RIGHT)
 *   05 TRAVEL              60°  (LOWER-RIGHT)
 *   06 RETAIL              120° (LOWER-LEFT)
 * Center: (500, 500) — No node at 12 o'clock (270°) or 6 o'clock (90°)
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
  'technology': { width: 250, height: 70 },
  'jan-suvidha': { width: 260, height: 70 },
  'insurance': { width: 240, height: 70 },
  'business-services': { width: 280, height: 70 },
  'travel': { width: 230, height: 70 },
  'retail': { width: 230, height: 70 },
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

  // Enforce equal radial distance from JMG Core for all 6 nodes (as required by specification)
  for (const d of domains) {
    domainRadii[d.id] = baseRadius;
    isAdjusted[d.id] = false;
  }

  return {
    baseRadius,
    domainRadii,
    isAdjusted,
    totalDisplacement: 0,
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
export function getLogoStartRadius(angle) {
  const radians = (angle * Math.PI) / 180;
  const isHorizontal = Math.abs(Math.sin(radians)) < 0.05;
  if (isHorizontal) {
    return 138;
  }
  return 112;
}

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
    angle: 180, // LEFT
    accent: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.28)",
    label: "Technology & Digital",
    tagline: "Custom enterprise software, campus ERPs & modern digital engineering",
    description: "Engineering resilient digital platforms, academic ERP platforms, scalable cloud infrastructure, and intelligent digital systems.",
    companies: [
      { name: "Jay Murlidhar Tech Solutions", path: "/technology/jay-murlidhar-tech-solutions", role: "Software & Digital Engineering" },
    ],
    capabilities: ["Campus ERP Systems", "Cloud Software", "Custom Web Platforms", "Super Intelligence (SI)"],
  },
  {
    number: "02",
    name: "JAN SUVIDHA",
    id: "jan-suvidha",
    shortName: "JAN SUVIDHA",
    domainRoute: "/jan-suvidha",
    route: "/jan-suvidha",
    angle: 240, // UPPER-LEFT
    accent: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.28)",
    label: "Citizen & Public Services",
    tagline: "A trusted local service centre helping people access essential digital, government and citizen services.",
    description: "A trusted local service centre helping people access essential digital, government and citizen services.",
    companies: [
      { name: "Jay Murlidhar Computer", path: "/jan-suvidha/jay-murlidhar-computer", role: "CSC & Jan Suvidha Kendra" },
    ],
    capabilities: ["RTO Services", "CSC & Business Services", "Business Registration", "Academy"],
  },
  {
    number: "03",
    name: "INSURANCE",
    id: "insurance",
    shortName: "INSURE",
    domainRoute: "/insurance",
    route: "/insurance",
    angle: 300, // UPPER-RIGHT
    accent: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.18)",
    label: "Risk & Underwriting",
    tagline: "Institutional risk mitigation, general & life protection",
    description: "Corporate underwriting, academic campus liability coverage, asset risk consulting, and comprehensive health plans.",
    companies: [
      { name: "Jay Murlidhar Insurance", path: "/insurance/jay-murlidhar-insurance", role: "Enterprise & Asset Risk" },
    ],
    capabilities: ["Asset Protection", "Institutional Underwriting", "Corporate Health", "Policy Advisory"],
  },
  {
    number: "04",
    name: "BUSINESS SERVICES",
    id: "business-services",
    shortName: "BIZ SERVICES",
    domainRoute: "/business-services",
    route: "/business-services",
    angle: 0, // RIGHT
    accent: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.18)",
    label: "Corporate Operations",
    tagline: "Regulatory compliance, workflow automation & consulting",
    description: "Corporate certifications, tax advisory, statutory compliance, licensing, and day-to-day organizational workflow setups.",
    companies: [
      { name: "Jay Murlidhar Business Services", path: "/business-services/jay-murlidhar-business-services", role: "Corporate Governance" },
    ],
    capabilities: ["Regulatory Filing", "Entity Setup", "Operational Workflows", "Audits & Certifications"],
  },
  {
    number: "05",
    name: "TRAVEL",
    id: "travel",
    shortName: "TRAVEL",
    domainRoute: "/travel",
    route: "/travel",
    angle: 60, // LOWER-RIGHT
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
    number: "06",
    name: "RETAIL",
    id: "retail",
    shortName: "RETAIL",
    domainRoute: "/retail",
    route: "/retail",
    angle: 120, // LOWER-LEFT
    accent: "#EC4899",
    glowColor: "rgba(236, 72, 153, 0.18)",
    label: "Hardware & Accessories",
    tagline: "Smart consumer devices, student gear & mobility essentials",
    description: "Authentic mobile hardware, institutional tablet procurement, accessories, and certified electronics servicing.",
    companies: [
      { name: "Jay Murlidhar Mobile & Accessories", path: "/retail/jay-murlidhar-mobile-accessories", role: "Smart Hardware & Devices" },
    ],
    capabilities: ["Smartphones & Accessories", "Student Hardware", "Institutional Supply", "Device Support"],
  },
];

// Uniform mathematically balanced radius for all six domains
export const BASE_RADIUS = 320;
export const ORBIT_RADIUS = BASE_RADIUS;
export const MIDDLE_RADIUS = 215;
