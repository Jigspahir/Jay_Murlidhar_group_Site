/**
 * JMG ACADEMIC INNOVATION DATA LAYER
 * 
 * Centralized, authoritative data structure for Jay Murlidhar Group's
 * academic and internship initiative.
 * 
 * NOTE: All data is transparent and strictly avoids unverified vacancies,
 * fake placement claims, or fabricated testimonials.
 */

export const ACADEMIC_HERO_STATS = [
  { value: "07", label: "Core Academic Domains", sub: "Technology, Management, Creative" },
  { value: "02", label: "Flexible Modes", sub: "Online (Remote) & Offline (On-Site)" },
  { value: "100%", label: "Practical Focus", sub: "Assignment & Project-Driven" },
  { value: "Gujarat", label: "Regional Headquarters", sub: "Pan-India Remote Access" }
];

export const INTERNSHIP_MODES = [
  {
    id: "online",
    title: "ONLINE INTERNSHIP",
    badge: "Virtual & Remote",
    tagline: "Flexible participation alongside your university curriculum",
    description: "Designed for students who wish to gain hands-on industry exposure and complete structured project assignments without geographical or daily travel constraints.",
    features: [
      {
        title: "Remote Participation",
        desc: "Participate in structured assignments and learning milestones from anywhere with an active internet connection."
      },
      {
        title: "Virtual Collaboration",
        desc: "Interact with peer interns and mentors through modern collaboration tools, digital repositories, and shared boards."
      },
      {
        title: "Online Assignments",
        desc: "Work on practical problem statements, milestone reviews, and digital portfolio deliverables."
      },
      {
        title: "Digital Communication",
        desc: "Regular scheduled check-ins, asynchronous feedback channels, and mentor guidance sessions."
      },
      {
        title: "Curriculum Alignment",
        desc: "Paced to accommodate college schedules, mid-term examinations, and final submission deadlines."
      }
    ],
    modeNote: "Available across Technology & IT, Marketing, HR, Finance, and Business Management."
  },
  {
    id: "offline",
    title: "OFFLINE INTERNSHIP",
    badge: "On-Site & In-Office",
    tagline: "Direct practical immersion at JMG operational centers",
    description: "Designed for learners who thrive in an in-person workplace environment, collaborating face-to-face with cross-functional operational teams and senior mentors.",
    features: [
      {
        title: "Office-Based Exposure",
        desc: "Experience everyday corporate workflows, team scrums, and professional workplace dynamics firsthand."
      },
      {
        title: "Practical Workplace Learning",
        desc: "Work directly on live operational projects, institutional platforms, and regional service environments."
      },
      {
        title: "Team Collaboration",
        desc: "Engage in brainstorming sessions, peer pair-programming, and real-time operational troubleshooting."
      },
      {
        title: "On-Site Guidance",
        desc: "Receive direct, desk-side mentoring, instant architecture reviews, and personalized professional coaching."
      },
      {
        title: "Workplace Experience",
        desc: "Develop professional discipline, executive etiquette, and hands-on familiarity with physical and digital systems."
      }
    ],
    modeNote: "Hosted at Jay Murlidhar Group regional hubs and offices across Gujarat."
  }
];

export const DEPARTMENTS = [
  {
    id: "tech-it",
    number: "01",
    name: "Technology & IT",
    shortName: "Technology",
    iconName: "Code2",
    accentColor: "#2563EB",
    overview: "Engage with real-world software platforms, full-stack web applications, campus automation portals, and scalable cloud architectures.",
    specializations: [
      "Web Development",
      "Frontend Development",
      "Backend Development",
      "UI/UX Design",
      "App Development",
      "Software Testing",
      "Data Analytics",
      "AI & Automation"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "B.Tech, BCA, MCA, Diploma IT/CS, M.Tech, and Self-Taught Coders"
  },
  {
    id: "marketing-media",
    number: "02",
    name: "Marketing & Digital Media",
    shortName: "Marketing",
    iconName: "Megaphone",
    accentColor: "#EA580C",
    overview: "Learn modern performance marketing, search engine optimization, audience analytics, and brand-first content communication.",
    specializations: [
      "Digital Marketing",
      "SEO & Search Optimization",
      "Social Media Management",
      "Content Writing & Copywriting",
      "Graphic Design for Campaigns",
      "Branding & Communication"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "BBA, MBA Marketing, Mass Communication, Journalism, Digital Media"
  },
  {
    id: "human-resources",
    number: "03",
    name: "Human Resources",
    shortName: "HR",
    iconName: "Users",
    accentColor: "#0F172A",
    overview: "Understand corporate talent acquisition pipelines, staff engagement frameworks, onboarding workflows, and human resource administration.",
    specializations: [
      "Recruitment & Sourcing",
      "Talent Acquisition",
      "HR Operations",
      "Employee Engagement",
      "Training & Development",
      "HR Administration"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "BBA, MBA HR, MSW, Psychology, Allied Social Sciences"
  },
  {
    id: "finance-accounting",
    number: "04",
    name: "Finance & Accounting",
    shortName: "Finance",
    iconName: "Calculator",
    accentColor: "#2563EB",
    overview: "Gain exposure to corporate ledger reconciliation, GST compliance, taxation preparation, and financial management information systems (MIS).",
    specializations: [
      "Accounting & Bookkeeping",
      "GST & Taxation Filings",
      "Financial Analysis",
      "Business Finance",
      "MIS Reporting & Ledgers"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "B.Com, M.Com, BBA Finance, MBA Finance, CA/CS Inter aspirants"
  },
  {
    id: "business-management",
    number: "05",
    name: "Business & Management",
    shortName: "Management",
    iconName: "Briefcase",
    accentColor: "#EA580C",
    overview: "Explore commercial business development, process automation, market feasibility research, and operational team coordination.",
    specializations: [
      "Business Development",
      "Operations Management",
      "Project Coordination",
      "Market Research & Insights",
      "Entrepreneurship & Strategy"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "BBA, MBA, Engineering Management, Commerce, General Management"
  },
  {
    id: "creative-design",
    number: "06",
    name: "Creative & Design",
    shortName: "Design",
    iconName: "Palette",
    accentColor: "#2563EB",
    overview: "Build compelling visual brand identities, motion assets, user interfaces, and multimedia materials that communicate purpose.",
    specializations: [
      "Graphic Design",
      "Video Editing & Color Grading",
      "Motion Graphics & Reels",
      "UI/UX Design & Prototyping",
      "Visual Communication"
    ],
    supportedModes: "Online & Offline",
    targetDegrees: "B.Des, Fine Arts, Multimedia, Animation, Self-Taught Designers"
  },
  {
    id: "customer-support-admin",
    number: "07",
    name: "Customer Support & Administration",
    shortName: "Support & Admin",
    iconName: "Headphones",
    accentColor: "#0F172A",
    overview: "Learn multi-channel citizen support, customer issue resolution, documentation auditing, and operational administrative processing.",
    specializations: [
      "Customer Relations",
      "Documentation & Verification",
      "Office Administration",
      "Service Operations"
    ],
    supportedModes: "Offline Preferred",
    targetDegrees: "Any Graduate, B.A, B.Com, BBA, Diploma Graduates"
  }
];

export const JOURNEY_STAGES = [
  {
    step: "01",
    title: "Explore",
    summary: "Discover departments and opportunities",
    description: "Browse our academic domains, examine specialization areas, and determine whether Online or Offline engagement matches your college schedule.",
    icon: "Compass"
  },
  {
    step: "02",
    title: "Connect",
    summary: "Contact JMG regarding your preference",
    description: "Submit an academic enquiry outlining your current educational course, semester, preferred domain, and available schedule window.",
    icon: "MailCheck"
  },
  {
    step: "03",
    title: "Selection",
    summary: "Follow the applicable selection process",
    description: "Participate in our screening interaction or practical assessment task aligned with your academic background to ensure mutual fit.",
    icon: "UserCheck"
  },
  {
    step: "04",
    title: "Learn",
    summary: "Participate in practical learning activities",
    description: "Engage in structured milestone assignments, technical workshops, and mentor-guided problem solving based on realistic workplace scenarios.",
    icon: "BookOpen"
  },
  {
    step: "05",
    title: "Collaborate",
    summary: "Gain experience through teamwork",
    description: "Collaborate with fellow interns and operational teams, participating in reviews, documentation sprints, and shared milestones.",
    icon: "Share2"
  },
  {
    step: "06",
    title: "Complete",
    summary: "Evaluation and completion process",
    description: "Complete your final project evaluation, receive formal feedback from mentors, and conclude your semester or holiday internship cycle.",
    icon: "Award"
  }
];

export const LEARNING_AREAS = [
  {
    title: "Practical Industry Exposure",
    desc: "Experience how modern enterprises solve real problems with technical rigor, cost consciousness, and quality standards.",
    icon: "Layers"
  },
  {
    title: "Professional Communication",
    desc: "Master clear written documentation, professional email etiquette, and structured technical reporting.",
    icon: "MessageSquare"
  },
  {
    title: "Team Collaboration",
    desc: "Learn to work within cross-functional teams, navigate agile sprint workflows, and contribute to shared goals.",
    icon: "Users"
  },
  {
    title: "Problem Solving",
    desc: "Develop analytical frameworks to break down complex institutional and business challenges into actionable steps.",
    icon: "Lightbulb"
  },
  {
    title: "Project-Based Learning",
    desc: "Build genuine portfolio artifacts rather than textbook exercises, verified by senior operational leads.",
    icon: "FolderGit2"
  },
  {
    title: "Workplace Skills",
    desc: "Gain fluency with essential industry toolchains: Git, modern design tools, spreadsheets, and task trackers.",
    icon: "Wrench"
  },
  {
    title: "Professional Discipline",
    desc: "Cultivate accountability, timeline adherence, deadline management, and methodical attention to detail.",
    icon: "CheckCircle2"
  },
  {
    title: "Domain-Specific Knowledge",
    desc: "Deepen your understanding of your chosen discipline through practical hands-on application and guidance.",
    icon: "Target"
  }
];

export const WHO_CAN_APPLY = [
  {
    category: "College Students",
    details: "Students currently enrolled in diploma, degree, or vocational programs seeking seasonal industry exposure.",
    badge: "Active Enrolment"
  },
  {
    category: "Undergraduate Students",
    details: "1st to 4th year students in engineering, commerce, arts, sciences, business administration, and design.",
    badge: "UG Candidates"
  },
  {
    category: "Postgraduate Students",
    details: "Master's degree students seeking specialized research, advanced project work, or final-semester internships.",
    badge: "PG Candidates"
  },
  {
    category: "Freshers & Recent Graduates",
    details: "Graduates seeking practical hands-on project experience to build a verifiable, job-ready portfolio.",
    badge: "Early Career"
  },
  {
    category: "Diverse Academic Backgrounds",
    details: "Students from technical, commercial, creative, and administrative disciplines with curiosity and dedication.",
    badge: "Open Discipline"
  }
];

export const ACADEMIC_FAQS = [
  {
    question: "Are internships available online and offline?",
    answer: "Yes. JMG Academic Innovation offers both Online (Remote) and Offline (On-Site at our Gujarat facilities) opportunities. The availability of each mode depends on the specific department, current project requirements, and mentor allocation."
  },
  {
    question: "Which departments offer internships?",
    answer: "We offer learning tracks across 7 core domains: Technology & IT, Marketing & Digital Media, Human Resources, Finance & Accounting, Business & Management, Creative & Design, and Customer Support & Administration. Specific openings vary based on ongoing project cycles."
  },
  {
    question: "Can students from different academic backgrounds apply?",
    answer: "Yes. Students from diverse academic disciplines—including Engineering, Computer Applications, Management, Commerce, Design, Arts, and Humanities—are welcome to enquire. Selection is aligned with your demonstrable interests, foundational skills, and willingness to learn."
  },
  {
    question: "What is the internship duration?",
    answer: "Internship durations typically range from 1 to 6 months depending on student university requirements (such as summer projects, winter training, or full-semester industrial training). Specific schedules are discussed during the enquiry stage."
  },
  {
    question: "Are internships paid or unpaid?",
    answer: "Internship arrangements vary by domain, candidate qualifications, duration, and the specific nature of project assignments. Details regarding any applicable stipend or sponsorship are communicated transparently during the selection discussion."
  },
  {
    question: "How can students enquire about opportunities?",
    answer: "Students can submit an enquiry through our website by clicking the 'Enquire About Internships' button or contacting our team directly through the official contact portal, specifying their course, preferred department, and available dates."
  },
  {
    question: "Is prior experience required?",
    answer: "No prior commercial experience is strictly required for entry-level internship tracks. A strong academic foundation, genuine curiosity, dedication to learning, and baseline familiarity with your domain's core concepts are what we value most."
  }
];

