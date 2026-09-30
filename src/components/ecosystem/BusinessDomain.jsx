import React from 'react';
import { 
  Cpu, 
  Coins, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  Compass, 
  Globe2, 
  Smartphone 
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Coins,
  ShieldCheck,
  Briefcase,
  Building2,
  Compass,
  Globe2,
  Smartphone
};

export default function BusinessDomain({ domain, isActive, onSelect }) {
  const Icon = ICON_MAP[domain.iconName] || Cpu;

  return (
    <div
      style={{
        left: `${domain.coords.x}%`,
        top: `${domain.coords.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => onSelect(domain.id)}
      onClick={() => onSelect(domain.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(domain.id);
        }
      }}
      tabIndex={0}
      role="tab"
      aria-selected={isActive}
      aria-label={`Select ${domain.name} domain`}
      className={`absolute z-20 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] rounded-xl ${
        isActive ? 'scale-105 opacity-100 z-30' : 'opacity-65 hover:opacity-95 scale-95'
      }`}
    >
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
          isActive 
            ? 'bg-[#0B1424] text-white shadow-xl' 
            : 'bg-[#070E1A]/95 hover:bg-[#0B1424] text-slate-300 border-slate-800'
        }`}
        style={{
          borderColor: isActive ? domain.accent : undefined,
          boxShadow: isActive ? `0 0 24px ${domain.glowColor}` : undefined
        }}
      >
        <div 
          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors"
          style={{
            backgroundColor: isActive ? `${domain.accent}25` : '#1E293B',
            color: isActive ? domain.accent : '#94A3B8'
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {domain.number}
            </span>
            <span className={`text-xs font-bold tracking-tight uppercase whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-300'}`}>
              {domain.name}
            </span>
          </div>
        </div>

        {isActive && (
          <span 
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: domain.accent }}
          />
        )}
      </div>
    </div>
  );
}
