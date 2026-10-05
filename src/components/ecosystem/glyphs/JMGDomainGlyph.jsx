import React from 'react';
import TechnologyGlyph from './TechnologyGlyph';
import JanSuvidhaGlyph from './JanSuvidhaGlyph';
import InsuranceGlyph from './InsuranceGlyph';
import BusinessServicesGlyph from './BusinessServicesGlyph';
import TravelGlyph from './TravelGlyph';
import RetailGlyph from './RetailGlyph';

/**
 * JMG SIGNATURE GLYPH SYSTEM — CENTRAL MAPPING
 * Canonical dictionary of custom geometric glyphs for Jay Murlidhar Group.
 */
export const JMG_DOMAIN_GLYPHS = {
  technology: TechnologyGlyph,
  'jan-suvidha': JanSuvidhaGlyph,
  janSuvidha: JanSuvidhaGlyph,
  insurance: InsuranceGlyph,
  'business-services': BusinessServicesGlyph,
  businessServices: BusinessServicesGlyph,
  travel: TravelGlyph,
  retail: RetailGlyph,

  // Direct name aliases
  Cpu: TechnologyGlyph,
  Landmark: JanSuvidhaGlyph,
  ShieldCheck: InsuranceGlyph,
  Briefcase: BusinessServicesGlyph,
  Plane: TravelGlyph,
  Smartphone: RetailGlyph,
};

/**
 * JMGDomainGlyph Component
 * Reusable dynamic glyph renderer for JMG ecosystem domains.
 */
export default function JMGDomainGlyph({ 
  domainId, 
  className = "w-5 h-5", 
  strokeWidth = 1.75,
  ...props 
}) {
  const normalizedKey = domainId ? String(domainId).toLowerCase().trim() : '';
  const GlyphComponent = 
    JMG_DOMAIN_GLYPHS[domainId] || 
    JMG_DOMAIN_GLYPHS[normalizedKey] || 
    TechnologyGlyph;

  return (
    <GlyphComponent 
      className={className} 
      strokeWidth={strokeWidth} 
      {...props} 
    />
  );
}

export {
  TechnologyGlyph,
  JanSuvidhaGlyph,
  InsuranceGlyph,
  BusinessServicesGlyph,
  TravelGlyph,
  RetailGlyph,
};
