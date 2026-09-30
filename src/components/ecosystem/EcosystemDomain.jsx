import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Briefcase, Compass, Smartphone } from 'lucide-react';

const DOMAIN_ICONS = {
  technology: Cpu,
  insurance: ShieldCheck,
  'business-services': Briefcase,
  travel: Compass,
  retail: Smartphone,
};

/**
 * EcosystemDomain Component
 * Renders an accessible, unrotated, horizontal domain pill at calculated coordinates {x, y}.
 * Receives calculated geometry from shared geometry utilities.
 * Uses semantic <Link> with full keyboard, hover, and tap accessibility.
 */
export default function EcosystemDomain({
  domain,
  x,
  y,
  isActive = false,
  onSelect,
}) {
  const Icon = domain.icon || DOMAIN_ICONS[domain.id] || Cpu;
  const targetRoute = domain.domainRoute || domain.route || `/${domain.id}`;

  return (
    <div
      style={{
        left: `${x / 10}%`,
        top: `${y / 10}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute z-20 transition-all duration-300 ${
        isActive ? 'opacity-100 z-30' : 'opacity-75 hover:opacity-100'
      }`}
    >
      <Link
        to={targetRoute}
        onClick={() => onSelect && onSelect(domain.id)}
        onMouseEnter={() => onSelect && onSelect(domain.id)}
        onFocus={() => onSelect && onSelect(domain.id)}
        aria-label={`Explore ${domain.name}`}
        aria-current={isActive ? 'page' : undefined}
        className={`domain-pill flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 px-2.5 sm:px-3 md:px-3.5 lg:px-[18px] xl:px-[22px] min-[1536px]:px-[24px] h-[34px] sm:h-[38px] md:h-[44px] lg:h-[48px] xl:h-[54px] rounded-full border transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 ${
          isActive
            ? 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] scale-[1.03]'
            : 'bg-white/95 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
        }`}
        style={{
          borderColor: domain.accent,
          borderWidth: isActive ? '1.8px' : '1.2px',
          boxShadow: isActive
            ? `0 6px 24px ${domain.glowColor}`
            : `0 2px 14px ${domain.glowColor}`,
        }}
      >
        {/* Domain Icon Badge */}
        <div
          className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: `${domain.accent}16`,
            color: domain.accent,
          }}
          aria-hidden="true"
        >
          <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-[15px] md:h-[15px] lg:w-[16.5px] lg:h-[16.5px] xl:w-[18px] xl:h-[18px]" />
        </div>

        {/* Number & Domain Name (Horizontal, Unrotated) */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <span className="text-[10.5px] sm:text-[11.5px] md:text-[12.5px] lg:text-[13px] xl:text-[14px] font-mono font-bold text-slate-500">
            {domain.number}
          </span>
          <span
            className="text-[11px] sm:text-[12.5px] md:text-[14px] lg:text-[15px] xl:text-[17px] font-semibold tracking-tight uppercase whitespace-nowrap text-[#0B1220]"
          >
            <span className="hidden sm:inline">{domain.name}</span>
            <span className="sm:hidden">{domain.shortName || domain.name}</span>
          </span>
        </div>

        {/* Domain Color Indicator Dot */}
        <span
          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ml-0.5 ${isActive ? 'animate-pulse' : ''}`}
          style={{ backgroundColor: domain.accent }}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
