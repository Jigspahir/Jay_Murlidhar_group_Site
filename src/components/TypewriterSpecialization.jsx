import React, { useState, useEffect, useRef } from 'react';
import { SPECIALIZATION_STRINGS } from '../data/heroSpecializations';

export default function TypewriterSpecialization({
  specializations = SPECIALIZATION_STRINGS,
  typeSpeed = 80,
  deleteSpeed = 38,
  pauseDelay = 1800,
  restartDelay = 320
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const timerRef = useRef(null);

  // Listen to prefers-reduced-motion changes dynamically
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Typewriter state loop
  useEffect(() => {
    if (prefersReducedMotion || !specializations || specializations.length === 0) {
      return;
    }

    const currentFullText = specializations[index % specializations.length] || '';

    if (!isDeleting) {
      // TYPING PHASE
      if (displayedText.length < currentFullText.length) {
        timerRef.current = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, typeSpeed);
      } else {
        // Text is fully typed, pause for approximately 1.8 seconds
        timerRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else {
      // DELETING PHASE
      if (displayedText.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, deleteSpeed);
      } else {
        // Fully deleted, move to next specialization after restart delay
        timerRef.current = setTimeout(() => {
          setIsDeleting(false);
          setIndex((prevIndex) => (prevIndex + 1) % specializations.length);
        }, restartDelay);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [displayedText, isDeleting, index, specializations, typeSpeed, deleteSpeed, pauseDelay, restartDelay, prefersReducedMotion]);

  const activeText = prefersReducedMotion ? (specializations[0] || '') : displayedText;
  const currentSpecialization = specializations[index % (specializations.length || 1)] || '';

  return (
    <div 
      className="text-sm sm:text-base text-[#475569] font-normal min-h-[48px] sm:min-h-[28px] mb-7 sm:mb-8 leading-6 sm:leading-7"
      aria-label={`We specialize in ${currentSpecialization}`}
    >
      {/* Static Prefix */}
      <span className="block sm:inline text-[#64748B] font-medium select-none sm:mr-1.5">
        We specialize in
      </span>

      {/* Animated Dynamic Specialization Text */}
      <span 
        className="inline-block font-semibold text-[#2563EB] tracking-tight align-baseline"
        aria-live="polite"
      >
        <span>{activeText}</span>

        {/* Baseline anchor strut to ensure zero-height collapse never shifts vertical baseline */}
        <span className="inline-block w-0 overflow-hidden select-none pointer-events-none" aria-hidden="true">&#8203;</span>

        {/* Thin Blinking Cursor */}
        {!prefersReducedMotion && (
          <span
            className="inline-block w-[1.5px] sm:w-[2px] h-[1.15em] bg-[#2563EB] ml-0.5 align-[-0.15em] rounded-sm animate-typewriter-cursor"
            aria-hidden="true"
          />
        )}
      </span>
    </div>
  );
}
