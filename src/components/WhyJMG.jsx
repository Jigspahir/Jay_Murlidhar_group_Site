import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Cpu, 
  BookOpen, 
  HeartHandshake, 
  Network, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WHY_JMG_PILLARS } from '../data/ecosystemData';

const iconMap = {
  Lightbulb,
  Cpu,
  BookOpen,
  HeartHandshake,
  Network,
  Compass
};

const colorMap = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-300' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'hover:border-purple-300' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'hover:border-pink-300' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'hover:border-emerald-300' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'hover:border-amber-300' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'hover:border-cyan-300' },
};

export default function WhyJMG() {
  return (
    <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            CORE STRENGTHS
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-[-0.03em] leading-tight mb-5">
            WHY <span className="text-gradient">JMG?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Our identity is rooted in building sustainable, technology-enabled platforms with a relentless focus on human simplicity and genuine institutional value.
          </p>
        </div>

        {/* Six Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_JMG_PILLARS.map((item, index) => {
            const Icon = iconMap[item.icon] || Lightbulb;
            const theme = colorMap[item.accent] || colorMap.blue;

            return (
              <motion.div
                key={item.title}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`p-8 rounded-card bg-[#F8FAFC] border border-slate-200/90 shadow-soft hover:shadow-soft-hover transition-all duration-300 flex flex-col justify-between group ${theme.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 group-hover:text-slate-500 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                    {item.title}
                  </h3>

                  <div className="text-xs font-semibold text-slate-400 mb-4">
                    {item.tagline}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  <span>Explore Pillar Value</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
