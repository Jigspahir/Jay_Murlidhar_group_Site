/**
 * JAY MURLIDHAR GROUP (JMG) — CAREERS DATA ARCHITECTURE
 * 
 * Verified, production-ready career opportunities, departments,
 * editorial pillars, and recruitment workflow for JMG.
 * 
 * STRICT COMPLIANCE:
 * - Authentic roles, realistic expectations, zero fake compensation claims
 * - 7 Canonical corporate departments
 * - Transparent recruitment stages
 */

export const CAREER_DEPARTMENTS = [
  'Technology',
  'Marketing & Digital Media',
  'Human Resources',
  'Finance & Accounting',
  'Business Operations',
  'Customer Support',
  'Administration'
];

export const EMPLOYMENT_TYPES = [
  'All',
  'Full-Time',
  'Part-Time',
  'Contract'
];

export const WHY_JMG_PILLARS = [
  {
    id: 'growth-learning',
    number: '01',
    title: 'Growth & Learning',
    tagline: 'Continuous Skill Advancement',
    description:
      'Immerse yourself in active client projects, campus enterprise platforms, and digital public infrastructure. Receive direct mentorship from seasoned technical and operational leads with ongoing learning opportunities.',
    highlights: [
      'Structured technical and operational mentorship',
      'Direct hands-on experience with production systems',
      'Encouragement for professional certifications and research'
    ],
    accent: '#2563EB'
  },
  {
    id: 'collaboration',
    number: '02',
    title: 'Collaboration',
    tagline: 'Cross-Functional Synergy',
    description:
      'Work alongside specialists spanning enterprise software engineering, insurance underwriting, statutory compliance, and retail operations. Experience how distinct disciplines combine to solve tangible real-world problems.',
    highlights: [
      'Open cross-department communication',
      'Flat working hierarchy with accessible leadership',
      'Agile project squads formed around high-impact deliverables'
    ],
    accent: '#0284C7'
  },
  {
    id: 'innovation',
    number: '03',
    title: 'Innovation',
    tagline: 'Pragmatic Modernization',
    description:
      'We reject unnecessary technical complexity. We focus on pragmatic, high-reliability engineering that digitizes workflows, streamlines citizen access, and provides measurable business value for institutions and enterprises.',
    highlights: [
      'Modern, maintainable tech stacks (React, Node, Cloud)',
      'Practical automation of high-friction processes',
      'Rapid prototype-to-deployment cycle for tested solutions'
    ],
    accent: '#EA580C'
  },
  {
    id: 'responsibility',
    number: '04',
    title: 'Responsibility',
    tagline: 'Accountable Community Impact',
    description:
      'Serving thousands of citizens and enterprises across Gujarat requires uncompromising ethical standards, operational reliability, and deep respect for public trust. Every role contributes to dependable societal outcomes.',
    highlights: [
      'Strict adherence to statutory compliance & data privacy',
      'Meaningful impact on regional citizens & businesses',
      'Culture rooted in integrity, transparency, and dependability'
    ],
    accent: '#10B981'
  }
];

export const CAREER_ROLES = [
  {
    id: 'tech-fullstack-dev',
    title: 'Full Stack Web Engineer',
    department: 'Technology',
    employmentType: 'Full-Time',
    location: 'Gandhinagar, Gujarat • Hybrid',
    experience: '1–3 Years',
    workingEntity: 'Jay Murlidhar Tech Soluation',
    summary:
      'Join our core technology team developing high-availability web platforms, enterprise ERP modules, and citizen-facing digital services built on modern web standards.',
    responsibilities: [
      'Build responsive, accessible user interfaces using React, TypeScript, and modern CSS frameworks.',
      'Develop robust REST and GraphQL APIs using Node.js and PostgreSQL/MySQL databases.',
      'Collaborate with UI/UX designers and domain specialists to implement clean, scalable application workflows.',
      'Conduct code reviews, write automated unit tests, and maintain CI/CD deployment pipelines.'
    ],
    requirements: [
      'Proficiency in JavaScript (ES6+), React, and state management patterns.',
      'Solid understanding of server-side programming with Node.js/Express.',
      'Experience working with relational databases (PostgreSQL or MySQL) and query optimization.',
      'Understanding of version control (Git), RESTful API design, and web security best practices.'
    ],
    preferredSkills: ['TypeScript', 'Tailwind CSS', 'Docker', 'PostgreSQL', 'Redis'],
    openingsCount: 2
  },
  {
    id: 'tech-ui-engineer',
    title: 'UI/UX Frontend Specialist',
    department: 'Technology',
    employmentType: 'Full-Time',
    location: 'Gandhinagar, Gujarat • On-site',
    experience: '1–3 Years',
    workingEntity: 'Jay Murlidhar Tech Soluation',
    summary:
      'Create polished, human-centered digital experiences for institutional administrative portals, financial dashboards, and public service gateways.',
    responsibilities: [
      'Translate Figma design systems and user journey wireframes into pixel-perfect React components.',
      'Implement micro-interactions, responsive layouts, and accessible keyboard navigation (WCAG standards).',
      'Optimize web performance, rendering efficiency, and asset loading across desktop and mobile devices.',
      'Maintain design tokens and reusable UI component libraries across JMG products.'
    ],
    requirements: [
      'Strong portfolio demonstrating high-quality web UI design and frontend implementation.',
      'Expertise in semantic HTML, modern CSS, Tailwind CSS, and React.',
      'Solid command of Figma, design systems, and component architecture.',
      'Attention to typography, spacing, contrast, and layout balance.'
    ],
    preferredSkills: ['Figma', 'React', 'Framer Motion', 'Tailwind CSS', 'Accessibility (a11y)'],
    openingsCount: 1
  },
  {
    id: 'marketing-digital-specialist',
    title: 'Digital Marketing & Content Specialist',
    department: 'Marketing & Digital Media',
    employmentType: 'Full-Time',
    location: 'Gandhinagar, Gujarat • On-site',
    experience: '1–2 Years',
    workingEntity: 'Jay Murlidhar Group Corporate',
    summary:
      'Lead digital storytelling, search visibility, and multi-channel communication for Jay Murlidhar Group companies and regional business outreach.',
    responsibilities: [
      'Draft authentic case studies, technical articles, and social media announcements highlighting JMG achievements.',
      'Coordinate search engine optimization (SEO) audits and performance marketing campaigns for group services.',
      'Produce visual collateral, infographics, and presentation decks adhering strictly to JMG brand identity.',
      'Track engagement analytics and generate weekly reporting insights for executive leadership.'
    ],
    requirements: [
      'Demonstrated experience in digital marketing, copywriting, or communications.',
      'Familiarity with SEO principles, Google Analytics, and content management platforms.',
      'Excellent verbal and written communication in English and Gujarati.',
      'Basic proficiency with design tools (Canva, Figma, or Adobe Suite) is preferred.'
    ],
    preferredSkills: ['Content Strategy', 'SEO', 'Brand Communication', 'Google Analytics'],
    openingsCount: 1
  },
  {
    id: 'ops-compliance-executive',
    title: 'Corporate Filings & Compliance Executive',
    department: 'Business Operations',
    employmentType: 'Full-Time',
    location: 'Gandhinagar, Gujarat • On-site',
    experience: '1–3 Years',
    workingEntity: 'Jay Murlidhar Business Services',
    summary:
      'Assist corporate clients and local enterprises with statutory registrations, licensing, and documentation workflows across state and central digital portals.',
    responsibilities: [
      'Process corporate registrations, MSME/Udyam filings, GST documentation, and municipal trade licenses.',
      'Audit client paperwork for statutory completeness before submitting to regulatory authorities.',
      'Liaise with department officers and clients to resolve regulatory queries efficiently.',
      'Maintain secure, centralized audit ledgers for all corporate client portfolios.'
    ],
    requirements: [
      'Bachelor’s degree in Commerce, Law, Business Administration, or related discipline.',
      'Practical knowledge of government business portals, GST/PAN/MSME registration processes.',
      'High attention to detail, confidentiality, and document accuracy.',
      'Working knowledge of Gujarati and English official paperwork.'
    ],
    preferredSkills: ['Statutory Compliance', 'Corporate Filings', 'Documentation Audit', 'Client Management'],
    openingsCount: 1
  },
  {
    id: 'support-client-officer',
    title: 'Citizen & Client Support Associate',
    department: 'Customer Support',
    employmentType: 'Full-Time',
    location: 'Gandhinagar, Gujarat • On-site',
    experience: '0–2 Years (Freshers Welcome)',
    workingEntity: 'Jay Murlidhar Computer (Jan Suvidha)',
    summary:
      'Deliver friendly, efficient support to citizens and businesses seeking digital public services, certificate applications, and insurance assistance.',
    responsibilities: [
      'Guide walk-in and online applicants through citizen service documentation and application procedures.',
      'Input application data accurately into government and private partner portals.',
      'Provide timely status updates, resolve customer queries, and manage application tracking ledgers.',
      'Maintain an organized, welcoming front-desk operational environment.'
    ],
    requirements: [
      'Higher secondary education or graduate degree in any discipline.',
      'Good interpersonal communication skills with a customer-first attitude.',
      'Proficiency in basic computer operations, typing, and document scanning.',
      'Fluency in Gujarati and Hindi; basic English comprehension.'
    ],
    preferredSkills: ['Customer Service', 'Data Entry', 'Public Services Guidance', 'Active Listening'],
    openingsCount: 2
  }
];

export const RECRUITMENT_STAGES = [
  {
    step: '01',
    title: 'Application',
    subtitle: 'Direct Submission',
    description:
      'Submit your profile or resume through our open position links, talent pool form, or direct email. Highlight your verified work samples, GitHub repositories, or relevant professional credentials.',
    actionNote: 'No cumbersome 10-page forms — straightforward profile submission.'
  },
  {
    step: '02',
    title: 'Application Review',
    subtitle: 'Human Assessment',
    description:
      'Our domain leads review your submission against current team requirements, evaluating practical competencies, problem-solving ability, and alignment with JMG standards.',
    actionNote: 'Every candidate receives timely status communication within 3–5 business days.'
  },
  {
    step: '03',
    title: 'Interview',
    subtitle: 'Practical Discussion',
    description:
      'A focused conversational and technical exchange. For technical roles, we discuss real architecture problems and code samples. For business roles, we review case studies and operational scenarios.',
    actionNote: 'Respectful, collaborative atmosphere focused on mutual fit.'
  },
  {
    step: '04',
    title: 'Selection',
    subtitle: 'Role Confirmation',
    description:
      'We finalize role expectations, working schedule, compensation structure, and start date. We ensure both you and the leadership team are aligned on long-term growth and scope.',
    actionNote: 'Transparent discussion with clear written expectations.'
  },
  {
    step: '05',
    title: 'Onboarding',
    subtitle: 'Team Integration',
    description:
      'A structured induction into JMG infrastructure, communication channels, codebases, and team rituals. You will be paired with a dedicated lead to accelerate your ramp-up.',
    actionNote: 'Dedicated onboarding roadmap from day one.'
  }
];

export const CULTURE_VALUES = [
  {
    title: 'Craftsmanship & Pride',
    description:
      'Whether writing clean React components or submitting statutory paperwork, we believe doing things properly matters more than doing them quickly.',
    icon: 'Hammer'
  },
  {
    title: 'Authentic Mentorship',
    description:
      'Senior engineers and business heads work side-by-side with newer recruits, reviewing work collaboratively rather than delegating in isolation.',
    icon: 'Users'
  },
  {
    title: 'Real Community Impact',
    description:
      'Our solutions directly empower thousands of students, farmers, shop owners, and enterprises across Gujarat every single month.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Continuous Curiosity',
    description:
      'We encourage exploring emerging technologies, optimizing legacy workflows, and questioning outdated assumptions in a constructive environment.',
    icon: 'Sparkles'
  }
];
