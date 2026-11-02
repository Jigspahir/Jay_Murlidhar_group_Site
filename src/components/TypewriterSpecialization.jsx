import React, { useState, useEffect, useRef } from 'react';
import { SPECIALIZATION_STRINGS } from '../data/heroSpecializations';

export default function TypewriterSpecialization({
  specializations = SPECIALIZATION_STRINGS,
  typeSpeed = 65,
  deleteSpeed = 35,
  pauseDelay = 1800,
  restartDelay = 400
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
      className="flex items-baseline flex-wrap gap-x-1.5 text-sm sm:text-base text-[#475569] font-normal min-h-[44px] sm:min-h-[28px] mb-7 sm:mb-8"
      aria-label={`We specialize in ${currentSpecialization}`}
    >
      {/* Static Prefix */}
      <span className="text-[#64748B] font-medium whitespace-nowrap select-none">
        We specialize in
      </span>

      {/* Animated Dynamic Specialization Text */}
      <span 
        className="font-semibold text-[#2563EB] inline-flex items-center tracking-tight"
        aria-live="polite"
      >
        <span>{activeText}</span>

        {/* Smooth Blinking Cursor */}
        {!prefersReducedMotion && (
          <span
            className="inline-block w-[2px] h-[1.15em] bg-[#2563EB] ml-1 rounded-full align-middle animate-pulse"
            aria-hidden="true"
            style={{
              animationDuration: '900ms',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)'
            }}
          />
        )}
      </span>
    </div>
  );
}
