import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAIN_ICONS, Cpu } from './ecosystemIcons';

/**
 * EcosystemDomain Component
 * Renders an accessible, unrotated, horizontal domain node at calculated coordinates {x, y}.
 * Refined with a professional enterprise icon system (18-22px icon in 32-36px container, 1.85px stroke).
 */
export default function EcosystemDomain({
  domain,
  x,
  y,
  isActive = false,
  onSelect,
  onHover,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = domain.icon || DOMAIN_ICONS[domain.id] || DOMAIN_ICONS[domain.shortName?.toLowerCase()] || Cpu;
  const targetRoute = domain.domainRoute || domain.route || `/${domain.id}`;

  const isBusinessServices = domain.id === 'business-services';
  const isJanSuvidha = domain.id === 'jan-suvidha';
  const isInsurance = domain.id === 'insurance';
  const isTechnology = domain.id === 'technology';
  const isTravel = domain.id === 'travel';
  const isRetail = domain.id === 'retail';

  // Dynamic 1px border with elegant restrained opacity
  const borderColor = isActive
    ? domain.accent
    : isHovered
    ? `${domain.accent}B3` // ~70% opacity on hover
    : `${domain.accent}33`; // ~20% opacity default subtle border

  // Subtle translucent surface (crisp white backdrop)
  const backgroundColor = isActive
    ? '#FFFFFF'
    : isHovered
    ? 'rgba(255, 255, 255, 0.98)'
    : 'rgba(255, 255, 255, 0.90)';

  // Quiet, understated shadow
  const boxShadow = isActive
    ? '0 4px 14px rgba(0, 0, 0, 0.06)'
    : isHovered
    ? '0 6px 18px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)'
    : '0 1px 3px rgba(0, 0, 0, 0.02)';

  // Refined Icon Container border & background (Restrained, sophisticated tint)
  const iconContainerBorder = isHovered || isActive
    ? `${domain.accent}50`
    : `${domain.accent}20`;
  const iconContainerBg = isHovered || isActive
    ? `${domain.accent}15`
    : `${domain.accent}0A`;

  const staggerClass = `jmg-stagger-${domain.id}`;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) onHover(domain.id);
    if (onSelect) onSelect(domain.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHover) onHover(null);
  };

  return (
    <div
      style={{
        left: `${x / 10}%`,
        top: `${y / 10}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute z-20 transition-opacity duration-300 domain-card-wrapper ${
        isActive ? 'opacity-100 z-30' : 'opacity-85 hover:opacity-100'
      }`}
    >
      <div className={`jmg-card-float ${staggerClass}`}>
        <Link
          to={targetRoute}
          onClick={() => onSelect && onSelect(domain.id)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
          aria-label={`Explore ${domain.name}`}
          aria-current={isActive ? 'page' : undefined}
          className="domain-pill group flex items-center gap-1 xs:gap-1.5 sm:gap-2 lg:gap-2.5 px-1.5 xs:px-2 sm:px-2.5 md:px-3 lg:px-3.5 xl:px-4 h-[26px] xs:h-[28px] sm:h-[32px] md:h-[36px] lg:h-[40px] xl:h-[42px] rounded-full border border-solid transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 backdrop-blur-sm"
          style={{
            borderWidth: '1px',
            borderColor,
            backgroundColor,
            boxShadow,
          }}
        >
        {/* Enterprise Domain Icon Container / Official CSC / Insurance / Technology Logo */}
        {isJanSuvidha ? (
          <img
            src="/assets/csc-logo.svg"
            alt="CSC Logo"
            className="h-[13px] xs:h-[14px] sm:h-[17px] md:h-[19px] lg:h-[21px] xl:h-[22px] w-auto object-contain shrink-0"
            loading="eager"
          />
        ) : isInsurance ? (
          <img
            src="/assets/jay-murlidhar-insurance-logo.png"
            alt="Jay Murlidhar Insurance"
            className="h-[18px] xs:h-[20px] sm:h-[24px] md:h-[28px] lg:h-[32px] xl:h-[34px] w-auto object-contain shrink-0"
            loading="eager"
          />
        ) : isTechnology ? (
          <img
            src="/assets/jay-murlidhar-technology-logo.png"
            alt="Jay Murlidhar Technology"
            className="h-[18px] xs:h-[20px] sm:h-[24px] md:h-[28px] lg:h-[32px] xl:h-[34px] w-auto object-contain shrink-0"
            loading="eager"
          />
        ) : isBusinessServices ? (
          <div
            className="w-[20px] h-[20px] xs:w-[22px] xs:h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px] xl:w-[34px] xl:h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border"
            style={{
              borderColor: iconContainerBorder,
              backgroundColor: iconContainerBg,
            }}
          >
            <img
              src="/assets/jay-murlidhar-business-services-logo.png"
              alt="Business Services Logo"
              className="w-[15px] xs:w-[16px] sm:w-[19px] md:w-[22px] lg:w-[24px] xl:w-[25px] h-auto object-contain shrink-0"
              loading="eager"
            />
          </div>
        ) : isTravel ? (
          <div
            className="w-[20px] h-[20px] xs:w-[22px] xs:h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px] xl:w-[34px] xl:h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border"
            style={{
              borderColor: iconContainerBorder,
              backgroundColor: iconContainerBg,
            }}
          >
            <img
              src="/assets/jay-murlidhar-travel-logo.png"
              alt="Jay Murlidhar Travel"
              className="w-[15px] xs:w-[16px] sm:w-[19px] md:w-[22px] lg:w-[24px] xl:w-[25px] h-auto object-contain shrink-0"
              loading="eager"
            />
          </div>
        ) : isRetail ? (
          <div
            className="w-[20px] h-[20px] xs:w-[22px] xs:h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px] xl:w-[34px] xl:h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border group-hover:scale-[1.03]"
            style={{
              borderColor: iconContainerBorder,
              backgroundColor: iconContainerBg,
            }}
          >
            <img
              src="/assets/jmg-retail-logo.png"
              alt="Retail Logo"
              className="w-[15px] xs:w-[16px] sm:w-[19px] md:w-[22px] lg:w-[24px] xl:w-[25px] h-auto object-contain shrink-0 transition-transform duration-200"
              loading="eager"
            />
          </div>
        ) : (
          <div
            className="w-[20px] h-[20px] xs:w-[22px] xs:h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] lg:w-[32px] lg:h-[32px] xl:w-[34px] xl:h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border"
            style={{
              borderColor: iconContainerBorder,
              backgroundColor: iconContainerBg,
              color: domain.accent,
            }}
            aria-hidden="true"
          >
            <Icon
              className="w-[12px] h-[12px] xs:w-[13px] xs:h-[13px] sm:w-[15px] sm:h-[15px] md:w-[17px] md:h-[17px] lg:w-[18px] lg:h-[18px] xl:w-[19px] xl:h-[19px] transition-transform duration-200"
              strokeWidth={1.85}
            />
          </div>
        )}

        {/* Number & Domain Name (Horizontal, Unrotated) */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          {/* Secondary Number (Smaller, Muted) */}
          <span className="font-mono font-normal text-slate-400 text-[6.5px] xs:text-[7.5px] sm:text-[8px] md:text-[8.5px] lg:text-[9px] xl:text-[9.5px]">
            {domain.number}
          </span>

          {/* Primary Domain Name (Medium Weight) */}
          <span
            className={`font-medium tracking-wider uppercase whitespace-nowrap text-slate-900 ${
              isBusinessServices
                ? 'text-[6.5px] xs:text-[7.5px] sm:text-[8.5px] md:text-[9.5px] lg:text-[10px] xl:text-[10.5px]'
                : 'text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[10.5px] xl:text-[11px]'
            }`}
          >
            {domain.name}
          </span>
        </div>

        {/* Domain Accent Color Indicator Dot */}
        <span
          className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full flex-shrink-0 ml-0.5 transition-opacity duration-200 ${
            isActive ? 'opacity-100' : isHovered ? 'opacity-90' : 'opacity-40'
          }`}
          style={{ backgroundColor: domain.accent }}
          aria-hidden="true"
        />
      </Link>
    </div>
  </div>
);
}
