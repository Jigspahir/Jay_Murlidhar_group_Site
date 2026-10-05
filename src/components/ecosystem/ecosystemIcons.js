import {
  TechnologyGlyph,
  JanSuvidhaGlyph,
  InsuranceGlyph,
  BusinessServicesGlyph,
  TravelGlyph,
  RetailGlyph,
  JMG_DOMAIN_GLYPHS,
} from './glyphs';

/**
 * JMG ECOSYSTEM — SIGNATURE DOMAIN GLYPH SYSTEM
 * Central source of truth for custom vector glyphs across all six corporate domains.
 *
 * Visual DNA:
 * - 24x24 optical box with consistent 1.75px stroke width
 * - Unified geometric construction, corner radiuses, and negative space
 * - Custom brand glyphs designed specifically for Jay Murlidhar Group
 *
 * 01 TECHNOLOGY          -> Custom Microchip with J-Circuit Logic Trace (TechnologyGlyph)
 * 02 JAN SUVIDHA         -> Civic Public Service Gateway & Digital Uplink (JanSuvidhaGlyph)
 * 03 INSURANCE           -> Heraldic Protection Shield with Security Core (InsuranceGlyph)
 * 04 BUSINESS SERVICES   -> Corporate Folio & Structured Workflow Nexus (BusinessServicesGlyph)
 * 05 TRAVEL              -> Supersonic Flight Vector & Orbital Trajectory (TravelGlyph)
 * 06 RETAIL              -> Precision Smart Mobile Device & Wireless Interface (RetailGlyph)
 */
export const DOMAIN_ICONS = {
  ...JMG_DOMAIN_GLYPHS,

  // Fallbacks & legacy aliases mapping to JMG custom glyphs
  Cpu: TechnologyGlyph,
  Landmark: JanSuvidhaGlyph,
  Building2: JanSuvidhaGlyph,
  ShieldCheck: InsuranceGlyph,
  Briefcase: BusinessServicesGlyph,
  Plane: TravelGlyph,
  Compass: TravelGlyph,
  Smartphone: RetailGlyph,
};

export const Cpu = TechnologyGlyph;
export const Landmark = JanSuvidhaGlyph;
export const Building2 = JanSuvidhaGlyph;
export const ShieldCheck = InsuranceGlyph;
export const Briefcase = BusinessServicesGlyph;
export const Plane = TravelGlyph;
export const Compass = TravelGlyph;
export const Smartphone = RetailGlyph;

export {
  TechnologyGlyph,
  JanSuvidhaGlyph,
  InsuranceGlyph,
  BusinessServicesGlyph,
  TravelGlyph,
  RetailGlyph,
  JMG_DOMAIN_GLYPHS,
};
