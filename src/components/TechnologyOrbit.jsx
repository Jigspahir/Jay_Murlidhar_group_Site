import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Globe, 
  Code2, 
  Cloud, 
  Database, 
  Zap, 
  ArrowRight,
  Cpu,
  Layers
} from 'lucide-react';
import { TECH_ORBIT_NODES } from '../data/ecosystemData';

const iconMap = {
  Sparkles,
  Globe,
  Code2,
  Cloud,
  Database,
  Zap,
};

export default function TechnologyOrbit() {
  const [activeTech, setActiveTech] = useState(TECH_ORBIT_NODES[0]);

  // Radius for circular positioning on desktop
  const radius = 175; // in px

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 flex flex-col items-center justify-center">
      
      {/* Interactive Circular Orbit Area (Desktop / Tablet / Mobile) */}
      <div className="relative w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] lg:w-[480px] lg:h-[480px] max-w-full flex items-center justify-center">
        
        {/* Outer subtle orbital ring */}
        <div className="absolute inset-0 rounded-full border border-slate-200/90 shadow-inner" />
        <div className="absolute inset-8 rounded-full border border-dashed border-slate-300/60 animate-[spin_60s_linear_infinite]" />
        
        {/* Pulsing Core Glow */}
        <div 
          className="absolute w-64 h-64 rounded-full blur-3xl transition-colors duration-500 opacity-20 pointer-events-none"
          style={{ backgroundColor: activeTech.color }}
        />

        {/* Orbiting Nodes around center */}
        {TECH_ORBIT_NODES.map((node, index) => {
          const Icon = iconMap[node.icon] || Cpu;
          const isSelected = activeTech.id === node.id;
          
          // Calculate angle around circle
          const total = TECH_ORBIT_NODES.length;
          const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
          
          // Position relative to center
          // Responsive radius scaling
          const currentRadius = typeof window !== 'undefined' && window.innerWidth < 640 ? 130 : 185;
          const x = Math.cos(angle) * currentRadius;
          const y = Math.sin(angle) * currentRadius;

          return (
            <div
              key={node.id}
              className="absolute z-20"
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
            >
              <button
                onClick={() => setActiveTech(node)}
                onMouseEnter={() => setActiveTech(node)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 backdrop-blur-md shadow-soft ${
                  isSelected
                    ? 'bg-slate-900 text-white scale-110 shadow-lg ring-2 ring-blue-500/40'
                    : 'bg-white/95 text-slate-700 hover:text-slate-950 border-slate-200 hover:scale-105 hover:border-slate-300'
                }`}
                style={isSelected ? { borderColor: node.color } : {}}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: isSelected ? node.color : `${node.color}20`,
                    color: isSelected ? '#ffffff' : node.color 
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold tracking-wider">{node.name}</span>
              </button>
            </div>
          );
        })}

        {/* Central Display Hub: Changes live when hovering/selecting orbit nodes */}
        <div className="relative z-10 w-[240px] sm:w-[280px] p-6 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-soft-hover text-center flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
            TECHNOLOGY HUB
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTech.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-md transition-colors"
                style={{ backgroundColor: `${activeTech.color}15`, color: activeTech.color }}
              >
                {React.createElement(iconMap[activeTech.icon] || Cpu, { className: 'w-6 h-6' })}
              </div>

              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
                {activeTech.fullName}
              </h4>

              <div 
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-3"
                style={{ backgroundColor: `${activeTech.color}15`, color: activeTech.color }}
              >
                {activeTech.stats}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {activeTech.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Mobile Accessible Button List */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-lg lg:hidden">
        {TECH_ORBIT_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => setActiveTech(node)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTech.id === node.id 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {node.name}
          </button>
        ))}
      </div>
    </div>
  );
}
