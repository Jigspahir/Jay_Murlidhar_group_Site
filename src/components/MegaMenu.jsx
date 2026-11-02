import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Cpu, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  Building2, 
  Plane, 
  Smartphone, 
  Globe2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { BUSINESSES } from '../data/ecosystemData';

const iconMap = {
  GraduationCap,
  Cpu,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Building2,
  Plane,
  Smartphone,
  Globe2
};

export default function MegaMenu({ isOpen, onClose, onSelectBusiness }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[92vw] max-w-5xl bg-white/95 backdrop-blur-2xl rounded-card p-6 shadow-2xl border border-slate-200/90 z-50 overflow-hidden"
        onMouseLeave={onClose}
      >
        {/* Subtle accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 mb-0.5">
              OUR BUSINESSES
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Integrated Multi-Disciplinary Group Companies
            </h3>
          </div>
          <a
            href="#businesses"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All 9 Verticals</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* 3x3 Grid for 9 Businesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {BUSINESSES.map((item) => {
            const Icon = iconMap[item.icon] || Briefcase;
            return (
              <a
                key={item.id}
                href={`#business-${item.id}`}
                onClick={(e) => {
                  onClose();
                  if (onSelectBusiness) onSelectBusiness(item.id);
                }}
                className="group p-3 rounded-2xl hover:bg-slate-50/90 border border-transparent hover:border-slate-200/80 transition-all duration-200 flex items-start gap-3 relative"
              >
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-normal">
                    {item.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50/50 -mx-6 -mb-6 px-6 py-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Expanding opportunities across education, digital systems & enterprise solutions.
          </span>
          <span className="font-medium text-slate-700">Jay Murlidhar Group &bull; Built For Growth</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
