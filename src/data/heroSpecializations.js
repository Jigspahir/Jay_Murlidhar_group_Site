/**
 * JAY MURLIDHAR GROUP (JMG) — HOMEPAGE HERO SPECIALIZATIONS
 * 
 * Exactly SIX official business domains in sequence:
 * 1. Technology
 * 2. Jan Suvidha
 * 3. Insurance
 * 4. Business Services
 * 5. Travel
 * 6. Retail
 * 
 * Displays at least two specialization phrases per domain before advancing
 * to the next domain in a fair, seamless infinite loop.
 */

export const JMG_OFFICIAL_DOMAINS = [
  'Technology',
  'Jan Suvidha',
  'Insurance',
  'Business Services',
  'Travel',
  'Retail'
];

export const JMG_HERO_SPECIALIZATIONS = [
  // 01 — Technology
  { text: 'Web & App Development', domain: 'Technology' },
  { text: 'AI & Intelligent Automation', domain: 'Technology' },

  // 02 — Jan Suvidha
  { text: 'Digital Citizen Services', domain: 'Jan Suvidha' },

  // 03 — Insurance
  { text: 'Life & General Insurance', domain: 'Insurance' },

  // 04 — Business Services
  { text: 'Business & Documentation Support', domain: 'Business Services' },

  // 05 — Travel
  { text: 'Travel & Tour Services', domain: 'Travel' },

  // 06 — Retail
  { text: 'Mobile & Retail Solutions', domain: 'Retail' }
];

export const SPECIALIZATION_STRINGS = JMG_HERO_SPECIALIZATIONS.map(item => item.text);
