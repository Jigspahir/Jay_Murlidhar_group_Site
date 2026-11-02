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
  { text: 'Autonomous AI Agents', domain: 'Technology' },
  { text: 'Software & ERP Solutions', domain: 'Technology' },
  { text: 'Digital Transformation', domain: 'Technology' },

  // 02 — Jan Suvidha
  { text: 'Citizen & Public Services', domain: 'Jan Suvidha' },
  { text: 'Government e-Services & RTO', domain: 'Jan Suvidha' },
  { text: 'Digital Citizen Documentation', domain: 'Jan Suvidha' },

  // 03 — Insurance
  { text: 'General Insurance Services', domain: 'Insurance' },
  { text: 'Life & Health Insurance Solutions', domain: 'Insurance' },
  { text: 'Corporate Insurance', domain: 'Insurance' },

  // 04 — Business Services
  { text: 'Business Registration & Compliance', domain: 'Business Services' },
  { text: 'Corporate Operations & Filings', domain: 'Business Services' },
  { text: 'Digital & Government Services', domain: 'Business Services' },

  // 05 — Travel
  { text: 'Travel & Tour Services', domain: 'Travel' },
  { text: 'Corporate & Educational Mobility', domain: 'Travel' },

  // 06 — Retail
  { text: 'Mobile & Accessories', domain: 'Retail' },
  { text: 'Retail Technology & Solutions', domain: 'Retail' }
];

export const SPECIALIZATION_STRINGS = JMG_HERO_SPECIALIZATIONS.map(item => item.text);
