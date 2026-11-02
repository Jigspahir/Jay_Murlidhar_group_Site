import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { JMG_TIMELINE_PHASES } from '../../data/jmgTimelineData';
import JmgLightTimeline3D from './JmgLightTimeline3D';

export default function JmgTimelineExperience() {
  const containerRef = useRef(null);
  const timelineContentRef = useRef(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeMilestone = JMG_TIMELINE_PHASES[activeStepIndex] || JMG_TIMELINE_PHASES[0];

  // Scroll progress for the timeline content section
  const { scrollYProgress } = useScroll({
    target: timelineContentRef,
    offset: ['start center', 'end center'],
  });

  // Spring physics for smooth scroll drawing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Viewport observation: detect active step smoothly without flickering
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineContentRef.current) return;
      const stepElements = timelineContentRef.current.querySelectorAll('[data-timeline-step]');
      if (!stepElements.length) return;

      const viewportTarget = window.innerHeight * 0.42;
      let closestIdx = 0;
      let minDistance = Infinity;

      stepElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(elementCenter - viewportTarget);
        const idx = parseInt(el.getAttribute('data-timeline-step') || '0', 10);

        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      setActiveStepIndex(closestIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to step
  const scrollToStep = (idx) => {
    const el = document.getElementById(`step-card-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FAFAFA] text-slate-900 py-20 lg:py-28 border-t border-b border-slate-200 overflow-hidden"
      id="jmg-interactive-timeline"
    >
      {/* =========================================================================
          LIGHT THEME AMBIENT SURFACE DETAIL
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 opacity-[0.4] bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Soft JMG Primary Blue ambient wash (top left) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

        {/* Soft JMG Accent Orange ambient wash (bottom right) */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =======================================================================
            SECTION 3: SECTION INTRODUCTION (LIGHT THEME EDITORIAL)
            ======================================================================= */}
        <div className="max-w-3xl mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>CHRONOLOGY OF EXCELLENCE • 25+ YEARS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
          >
            Our Journey &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-orange-600">
              Milestones.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          >
            Every milestone reflects our commitment to{' '}
            <strong className="text-slate-900 font-semibold">building trust</strong>,{' '}
            <strong className="text-blue-600 font-semibold">creating opportunities</strong>, and{' '}
            <strong className="text-orange-600 font-semibold">moving forward</strong>.
          </motion.p>
        </div>

        {/* =======================================================================
            TWO-COLUMN MAIN TIMELINE EXPERIENCE
            LEFT: Large Dynamic Number Panel (Sticky on Desktop)
            RIGHT: Vertical Interactive Timeline
            ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* -------------------------------------------------------------------
              LEFT SIDE: DYNAMIC NUMBER & VISUAL PANEL (Sticky on Desktop)
              ------------------------------------------------------------------- */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 z-20">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden backdrop-blur-md">
              
              {/* Dynamic top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
                style={{ backgroundColor: activeMilestone.accentColor }}
              />

              {/* Number and Step Counter Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
                    style={{ backgroundColor: activeMilestone.accentColor }}
                  />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                    Active Milestone
                  </span>
                </div>

                {/* Counter Badge (e.g. 01 / 06) */}
                <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {activeMilestone.number} / 0{JMG_TIMELINE_PHASES.length}
                </div>
              </div>

              {/* GIANT DYNAMIC STEP NUMBER WITH ANIMATED TRANSITION */}
              <div className="relative h-28 sm:h-32 flex items-baseline overflow-hidden my-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMilestone.number}
                    initial={{ opacity: 0, y: 28, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 1.05 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-baseline gap-3"
                  >
                    <span
                      className="text-7xl sm:text-8xl font-black tracking-tighter leading-none"
                      style={{ color: activeMilestone.accentColor }}
                    >
                      {activeMilestone.number}
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-bold text-slate-400">
                      /{JMG_TIMELINE_PHASES.length}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* DYNAMIC PHASE & DOMAIN LABELS */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMilestone.id + '-label'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-5"
                >
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
                    {activeMilestone.phase} &bull; {activeMilestone.yearLabel}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {activeMilestone.company}
                  </h3>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    {activeMilestone.domain}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* DYNAMIC VISUAL SHOWCASE: 3D Crystal Visualizer & Verified Brand Visual */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 mb-6 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMilestone.id + '-visual'}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center justify-center text-center"
                  >
                    {/* Embedded 3D Light Crystal */}
                    <div className="w-full h-36 relative">
                      <JmgLightTimeline3D
                        activeIndex={activeStepIndex}
                        accentColor={activeMilestone.accentColor}
                      />
                    </div>

                    {/* Logo & Category Caption */}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 w-full justify-between px-2 text-xs text-slate-500">
                      <span className="font-mono text-[11px] truncate">{activeMilestone.domain}</span>
                      <span
                        className="font-bold text-[11px] uppercase font-mono px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${activeMilestone.accentColor}15`,
                          color: activeMilestone.accentColor,
                        }}
                      >
                        {activeMilestone.metrics[0]?.value}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* MINI STEP JUMP CONTROLS */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 font-mono">
                  <span>SELECT STEP:</span>
                  <span className="font-bold text-slate-700">0{activeStepIndex + 1} OF 06</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {JMG_TIMELINE_PHASES.map((p, idx) => {
                    const isSelected = activeStepIndex === idx;
                    return (
                      <button
                        key={p.id}
                        onClick={() => scrollToStep(idx)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-105'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title={`${p.phase}: ${p.company}`}
                      >
                        <span>{p.number}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Company Route Action */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={activeMilestone.companyRoute}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <span>Explore {activeMilestone.company}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={activeMilestone.domainRoute}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Domain &rarr;
                </Link>
              </div>

            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT SIDE: INTERACTIVE VERTICAL TIMELINE
              ------------------------------------------------------------------- */}
          <div ref={timelineContentRef} className="lg:col-span-7 relative">
            
            {/* The Vertical Guide Line */}
            <div
              className="absolute top-8 bottom-12 left-4 sm:left-6 w-[2px] bg-slate-200"
              aria-hidden="true"
            >
              {/* Dynamic Scroll-Controlled Filled Line */}
              <motion.div
                style={{ height: lineHeight }}
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-600 via-sky-500 to-orange-500 origin-top shadow-sm"
              >
                {/* Glowing Laser Node at leading edge */}
                <div className="absolute -bottom-1.5 -left-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-100 shadow-md animate-pulse" />
              </motion.div>
            </div>

            {/* Timeline Steps Stack */}
            <div className="space-y-12 sm:space-y-16 pl-10 sm:pl-14">
              {JMG_TIMELINE_PHASES.map((milestone, idx) => {
                const isActive = activeStepIndex === idx;

                return (
                  <div
                    key={milestone.id}
                    id={`step-card-${idx}`}
                    data-timeline-step={idx}
                    className="relative transition-all duration-400 cursor-pointer group"
                    onClick={() => scrollToStep(idx)}
                  >
                    {/* CIRCULAR TIMELINE NODE (Anchored to vertical line) */}
                    <div
                      className={`absolute -left-10 sm:-left-14 top-6 -translate-x-1/2 flex items-center justify-center transition-all duration-300 z-10 ${
                        isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-white shadow-lg ring-4'
                            : 'bg-white border-slate-300 group-hover:border-slate-400'
                        }`}
                        style={{
                          borderColor: isActive ? milestone.accentColor : undefined,
                          boxShadow: isActive ? `0 0 16px ${milestone.accentGlow}` : undefined,
                        }}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            isActive ? 'scale-100' : 'scale-75 bg-slate-400 group-hover:bg-slate-600'
                          }`}
                          style={{
                            backgroundColor: isActive ? milestone.accentColor : undefined,
                          }}
                        />
                      </div>
                    </div>

                    {/* MILESTONE CARD SURFACE */}
                    <motion.div
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className={`rounded-2xl p-6 sm:p-7 border transition-all duration-400 ${
                        isActive
                          ? 'bg-white border-blue-200/90 shadow-xl shadow-slate-200/70 ring-1 ring-blue-500/20 opacity-100'
                          : 'bg-white/80 border-slate-200/80 shadow-sm opacity-60 hover:opacity-90 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: milestone.accentColor }}
                          >
                            Step {milestone.number}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-500">
                            {milestone.period}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                          {milestone.domain}
                        </span>
                      </div>

                      {/* Company Name */}
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {milestone.company}
                      </div>

                      {/* Step Editorial Headline */}
                      <h4
                        className={`text-xl sm:text-2xl font-black tracking-tight leading-snug mb-3 transition-colors ${
                          isActive ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {milestone.heading}
                      </h4>

                      {/* Verified Description */}
                      <p className="text-sm text-slate-600 leading-relaxed font-normal mb-5">
                        {milestone.description}
                      </p>

                      {/* Verified Supporting Metrics Grid */}
                      <div className="grid grid-cols-3 gap-2.5 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                        {milestone.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="text-center">
                            <div
                              className="text-sm sm:text-base font-black tracking-tight"
                              style={{ color: milestone.accentColor }}
                            >
                              {metric.value}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tight truncate">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Tags & Link */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={milestone.companyRoute}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition-colors ml-auto"
                        >
                          <span>Explore Vertical</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                    </motion.div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
