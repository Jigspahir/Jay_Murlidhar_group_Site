import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Terminal, Briefcase, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { PATHS } from '../data/ecosystemData';

const iconMap = {
  GraduationCap,
  Terminal,
  Briefcase
};

function TiltCard({ path, onSelect }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const Icon = iconMap[path.icon] || Sparkles;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Sensitivity factor
    setTilt({
      x: -(y / (rect.height / 2)) * 8,
      y: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="relative rounded-card bg-white p-8 border border-slate-200/90 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group overflow-hidden"
    >
      {/* Subtle top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${path.gradient}`} />

      {/* Decorative background glow on hover */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: path.accentColor }}
      />

      <div>
        {/* Badge & 3D Object Representation */}
        <div className="flex items-center justify-between mb-8">
          <span 
            className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full text-slate-800"
            style={{ backgroundColor: `${path.accentColor}18` }}
          >
            {path.badge}
          </span>

          {/* 3D-styled Icon Container */}
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${path.accentColor}15 0%, ${path.accentColor}28 100%)`,
              color: path.accentColor,
              border: `1px solid ${path.accentColor}30`
            }}
          >
            <Icon className="w-8 h-8" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
            {path.title}
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {path.tagline}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
          {path.description}
        </p>

        {/* Key Features */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-8">
          {path.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
              <CheckCircle 
                className="w-4 h-4 flex-shrink-0" 
                style={{ color: path.accentColor }}
              />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <a
        href={path.id === 'student' ? '#education' : path.id === 'creator' ? '#technology' : '#solutions'}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-btn bg-slate-900 group-hover:bg-blue-600 text-white font-semibold text-sm shadow-sm transition-all duration-300"
      >
        <span>Explore Path</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
}

export default function PathSelector() {
  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-100/30 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            CHOOSE YOUR DIRECTION
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-[-0.03em] leading-tight mb-5">
            WHERE DO YOU{' '}
            <span className="text-gradient">WANT TO GO?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Whether you are a student exploring new skills, a creator architecting technology, or an entrepreneur scaling a business, our ecosystem is built for your journey.
          </p>
        </div>

        {/* 3 Large Interactive Cards with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PATHS.map((path) => (
            <TiltCard key={path.id} path={path} />
          ))}
        </div>

      </div>
    </section>
  );
}
