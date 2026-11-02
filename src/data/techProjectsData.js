/**
 * Jay Murlidhar Tech Solutions — Projects & Digital Products Catalog
 * 
 * NOTE: All entries in this file represent illustrative concept prototypes,
 * architectural designs, and service capabilities for demonstration purposes.
 * None of these entries represent verified client deployments or active contracts.
 */

export const DEMO_NOTICE = "DEMO CONCEPT — Illustrative project presentation, not a verified client deployment.";

export const FILTER_OPTIONS = [
  { id: 'all', label: 'All Projects' },
  { id: 'service', label: 'Service-Based' },
  { id: 'product', label: 'Product-Based' },
  { id: 'Web Development', label: 'Web Development' },
  { id: 'Software Development', label: 'Software Development' },
  { id: 'ERP & CRM', label: 'ERP & CRM' },
  { id: 'Mobile Applications', label: 'Mobile Applications' },
  { id: 'Cloud & Automation', label: 'Cloud & Automation' }
];

export const SERVICE_PROJECTS = [
  {
    id: 'srv-web-design-dev',
    name: 'Website Design & Development',
    type: 'service',
    category: 'Web Development',
    subCategory: 'Bespoke Corporate Portals',
    shortDesc: 'Modern responsive corporate websites, dynamic landing architectures, and content-managed portals with performance optimization.',
    fullDesc: 'Custom-tailored web engineering service focused on delivering ultra-fast, accessible, and high-converting web portals for growing enterprises and regional institutions.',
    problemStatement: 'Businesses often suffer from slow, non-responsive legacy templates that fail to convey professional credibility and drop mobile conversion rates.',
    proposedSolution: 'Develop component-driven, SEO-optimized web frontends with clean typography, dynamic CMS integration, and sub-second load times.',
    features: [
      'Responsive design across mobile, tablet, and desktop',
      'SEO-structured semantic markup & Core Web Vitals optimization',
      'Headless CMS content publishing workflow',
      'Interactive micro-animations with accessibility compliance'
    ],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel / Netlify'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Globe',
    accentColor: '#2563EB',
    featured: true
  },
  {
    id: 'srv-custom-web-apps',
    name: 'Custom Web Applications',
    type: 'service',
    category: 'Software Development',
    subCategory: 'Full-Stack Web Systems',
    shortDesc: 'Interactive full-stack web applications tailored for internal operations, partner access portals, and customized SaaS utilities.',
    fullDesc: 'End-to-end custom application engineering service delivering secure, scalable, and intuitive software tailored to specific organizational workflows.',
    problemStatement: 'Off-the-shelf software packages often carry unnecessary complexity while missing critical niche operational requirements.',
    proposedSolution: 'Engineer bespoke single-page applications (SPAs) with role-based access control, relational database storage, and RESTful service interfaces.',
    features: [
      'Role-based access control (RBAC) & authentication',
      'Real-time data visualization and operational dashboards',
      'Scalable RESTful API backends with relational persistence',
      'Automated background jobs and notification triggers'
    ],
    techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Layers',
    accentColor: '#0F172A',
    featured: false
  },
  {
    id: 'srv-erp-business-systems',
    name: 'ERP & Business Management Systems',
    type: 'service',
    category: 'ERP & CRM',
    subCategory: 'Enterprise Resource Architecture',
    shortDesc: 'Custom ERP architectures designed to centralize inventory, procurement, departmental logistics, and organizational records.',
    fullDesc: 'Architecture and implementation services for modular Enterprise Resource Planning systems connecting disconnected departments under unified audit rails.',
    problemStatement: 'Siloed departments relying on spreadsheets lead to data duplication, delayed reconciliation, and lack of management visibility.',
    proposedSolution: 'Design modular ERP databases and dashboard interfaces unifying procurement, inventory tracking, vendor management, and financial summaries.',
    features: [
      'Multi-branch inventory and asset tracking modules',
      'Automated approval workflows and audit trail logging',
      'Cross-departmental financial reconciliation ledgers',
      'Exportable reporting suites (Excel, PDF, CSV)'
    ],
    techStack: ['React', 'Python / Django', 'PostgreSQL', 'Docker', 'REST APIs'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Server',
    accentColor: '#2563EB',
    featured: true
  },
  {
    id: 'srv-crm-development',
    name: 'CRM Development',
    type: 'service',
    category: 'ERP & CRM',
    subCategory: 'Sales & Client Lifecycle',
    shortDesc: 'Tailored customer relationship platforms with pipeline tracking, multi-channel lead capture, and automated interaction logging.',
    fullDesc: 'Custom customer relationship management engineering providing commercial sales teams with intuitive pipeline management, follow-up scheduling, and customer data.',
    problemStatement: 'Generic CRMs are expensive, bloated, and rarely match the specific stages of regional Indian business sales processes.',
    proposedSolution: 'Build lightweight, highly focused CRM tools with custom deal stages, WhatsApp/SMS lead alerts, and transparent agent performance metrics.',
    features: [
      'Configurable visual sales pipelines & Kanban boards',
      'Contact timeline logging & automated follow-up reminders',
      'Multi-channel inquiry ingestion (Web, WhatsApp, Email)',
      'Granular sales representative access permissions'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'WebSockets'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Users',
    accentColor: '#EA580C',
    featured: false
  },
  {
    id: 'srv-mobile-app-development',
    name: 'Mobile Application Development',
    type: 'service',
    category: 'Mobile Applications',
    subCategory: 'Cross-Platform Mobile Apps',
    shortDesc: 'Cross-platform iOS and Android mobile solutions built for customer self-service, field staff reporting, and on-the-go utility.',
    fullDesc: 'Comprehensive mobile application engineering using modern cross-platform frameworks to deliver responsive native experiences with offline-first synchronization.',
    problemStatement: 'Field operators and consumers require reliable mobile access even in low-bandwidth network environments.',
    proposedSolution: 'Create cross-platform mobile apps with SQLite local caching, biometric authentication, and smooth push-notification workflows.',
    features: [
      'Cross-platform codebase (iOS & Android)',
      'Offline-first SQLite local data caching & sync',
      'Push notification alerts & real-time location mapping',
      'Biometric sign-in (Fingerprint / Face ID)'
    ],
    techStack: ['React Native', 'Flutter', 'TypeScript', 'Firebase', 'SQLite'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Smartphone',
    accentColor: '#2563EB',
    featured: true
  },
  {
    id: 'srv-api-integration-automation',
    name: 'API Integration & Automation',
    type: 'service',
    category: 'Cloud & Automation',
    subCategory: 'Middleware & Webhooks',
    shortDesc: 'Custom middleware and webhook services connecting payment gateways, government portals, messaging APIs, and legacy software.',
    fullDesc: 'System integration and automation engineering that bridges disparate third-party services into smooth, self-healing automated business workflows.',
    problemStatement: 'Manual copy-pasting of records between billing systems, banking portals, and messaging tools wastes hours and introduces human error.',
    proposedSolution: 'Develop robust middleware pipelines with resilient queue processing, retry mechanisms, and real-time webhook verifications.',
    features: [
      'Payment gateway integrations (Razorpay, UPI, Stripe)',
      'Automated SMS & WhatsApp messaging pipelines',
      'Event-driven webhook listeners with idempotency guarantees',
      'Data transformation and sanitization middleware'
    ],
    techStack: ['Node.js', 'Go', 'Redis', 'RabbitMQ', 'PostgreSQL'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Cpu',
    accentColor: '#0F172A',
    featured: false
  },
  {
    id: 'srv-cloud-infrastructure',
    name: 'Cloud Infrastructure & Deployment',
    type: 'service',
    category: 'Cloud & Automation',
    subCategory: 'DevOps & Cloud Architecture',
    shortDesc: 'Scalable cloud server setup, CI/CD pipeline configuration, automated daily backups, and containerized deployment infrastructure.',
    fullDesc: 'DevOps and cloud systems consulting to ensure high application uptime, automated deployments, data backup redundancy, and server hardening.',
    problemStatement: 'Unmanaged virtual servers are vulnerable to unmonitored downtimes, security breaches, and catastrophic data loss.',
    proposedSolution: 'Implement containerized cloud hosting with automated CI/CD releases, SSL enforcement, multi-region backups, and resource monitoring.',
    features: [
      'Container orchestration with Docker & Docker Compose',
      'Automated GitHub Actions CI/CD deployment pipelines',
      'Scheduled off-site database backups with point-in-time recovery',
      'Server health monitoring, SSL certificates & firewall configuration'
    ],
    techStack: ['AWS', 'Google Cloud', 'Docker', 'Linux / Ubuntu', 'Nginx', 'GitHub Actions'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Cloud',
    accentColor: '#2563EB',
    featured: false
  },
  {
    id: 'srv-ecommerce-development',
    name: 'E-commerce Development',
    type: 'service',
    category: 'Web Development',
    subCategory: 'Digital Commerce Platforms',
    shortDesc: 'High-performance e-commerce storefronts with catalog filtering, shopping cart mechanics, order dispatch, and payment processing.',
    fullDesc: 'Tailored e-commerce engineering enabling retail businesses to sell products online with rapid product search, secure checkout, and inventory sync.',
    problemStatement: 'Generic marketplace platforms charge high commissions and limit brand ownership, while clunky templates load slowly.',
    proposedSolution: 'Build modern, headless digital commerce storefronts with instant product filtering, streamlined checkout flows, and automated invoice delivery.',
    features: [
      'Product catalog with dynamic attribute & price filtering',
      'Secure multi-method checkout with UPI & card processing',
      'Order fulfillment management & automated customer tracking',
      'Promotional code engine & discount rule configurations'
    ],
    techStack: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe / Razorpay'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'ShoppingBag',
    accentColor: '#EA580C',
    featured: false
  }
];

export const PRODUCT_PROJECTS = [
  {
    id: 'prd-business-mgmt-platform',
    name: 'Business Management Platform',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Operations Operating System',
    shortDesc: 'A centralized multi-branch control dashboard consolidating organizational tasks, staff duty schedules, and operational health scores.',
    fullDesc: 'A scalable operational command center concept built to provide business owners with clear real-time visibility into branch activities, task statuses, and compliance.',
    problemStatement: 'Business leadership lacks single-screen visibility into multi-branch operations and daily task execution across locations.',
    proposedSolution: 'A consolidated web portal displaying branch performance indicators, task queues, operational checklists, and daily KPI tracking.',
    features: [
      'Multi-branch operational switcher & consolidated KPI views',
      'Daily staff task dispatch & completion verification',
      'Standardized operational checklists & compliance audits',
      'Automated executive end-of-day summary reports'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'BarChart3',
    accentColor: '#2563EB',
    featured: true
  },
  {
    id: 'prd-crm-product',
    name: 'Customer Relationship Management (CRM)',
    type: 'product',
    category: 'ERP & CRM',
    subCategory: 'Lead & Contact Engine',
    shortDesc: 'A streamlined relationship management suite with interactive deal stages, client document vaults, and automated follow-up cadences.',
    fullDesc: 'A lightweight software product blueprint designed to eliminate lost sales inquiries by providing structured lead tracking, stage transitions, and contact histories.',
    problemStatement: 'Sales inquiries received across WhatsApp, phone calls, and walk-ins frequently slip through the cracks without consistent follow-up.',
    proposedSolution: 'An intuitive Kanban-style deal tracker with automated inactivity alerts, customer document attachments, and instant quote generation.',
    features: [
      'Kanban drag-and-drop opportunity tracking board',
      'Customer document vault for IDs, agreements, and invoices',
      'Follow-up calendar with WhatsApp notification integration',
      'Inquiry source attribution and stage conversion analytics'
    ],
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'SQLite / PostgreSQL'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Users',
    accentColor: '#EA580C',
    featured: false
  },
  {
    id: 'prd-education-mgmt-system',
    name: 'Education Management System',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Campus & Academy Suite',
    shortDesc: 'An institutional administration platform covering student enrollment, lecture attendance, fee ledgering, and academic timetable schedules.',
    fullDesc: 'A modern administrative campus suite concept engineered to streamline academic workflows, student record verification, and tuition fee ledgers without paperwork friction.',
    problemStatement: 'Educational institutions struggle with fragmented paper rolls, manual fee audits, and chaotic timetable scheduling across departments.',
    proposedSolution: 'A unified campus dashboard providing student profiles, biometric/app attendance reconciliation, fee due notices, and conflict-free schedules.',
    features: [
      'Student master ledger with academic records & document archive',
      'Session-level attendance recording & absence alerts',
      'Fee installment tracking with digital receipt generation',
      'Faculty timetable manager with automatic room conflict checks'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Chart.js'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'GraduationCap',
    accentColor: '#2563EB',
    featured: true
  },
  {
    id: 'prd-inventory-billing',
    name: 'Inventory & Billing Management',
    type: 'product',
    category: 'ERP & CRM',
    subCategory: 'POS & Stock Controller',
    shortDesc: 'A fast point-of-sale and stock management solution with barcode lookup, GST-compliant tax invoicing, and low-inventory warnings.',
    fullDesc: 'A retail and warehouse billing concept engineered for high-speed counter transactions, barcode scanning, instant GST invoice printing, and real-time stock deductions.',
    problemStatement: 'Retailers face stock discrepancies, slow counter checkout queues, and errors when manually preparing GST tax invoices.',
    proposedSolution: 'A responsive billing interface supporting keyboard-only fast entry, barcode scanner inputs, thermal printer outputs, and automated stock alerts.',
    features: [
      'Sub-second billing checkout with keyboard shortcuts & barcode scanning',
      'GST-compliant tax calculations (CGST, SGST, IGST) with HSN codes',
      'Automated low-stock threshold notifications and purchase order generator',
      'Thermal receipt and standard A4 tax invoice print templates'
    ],
    techStack: ['React', 'Electron / Web', 'Node.js', 'SQLite', 'Tailwind CSS'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Package',
    accentColor: '#0F172A',
    featured: false
  },
  {
    id: 'prd-appointment-booking',
    name: 'Appointment & Booking Platform',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Scheduling Architecture',
    shortDesc: 'A client booking portal featuring real-time calendar availability, slot reservations, automated confirmations, and token tracking.',
    fullDesc: 'A flexible service appointment scheduling engine that enables customers to book time slots while providing staff with organized daily queues.',
    problemStatement: 'Unmanaged walk-ins and phone appointment bookings create overcrowded waiting areas and double-booked calendar slots.',
    proposedSolution: 'A self-service scheduling widget with live time slot validation, buffer time enforcement, and SMS appointment token passes.',
    features: [
      'Dynamic real-time calendar slot availability checking',
      'Self-service client booking widget with custom question fields',
      'Automated appointment confirmations & reminder notifications',
      'Live in-clinic / in-office queue token display screen'
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Twilio / WhatsApp API'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'Calendar',
    accentColor: '#2563EB',
    featured: false
  },
  {
    id: 'prd-hr-employee-mgmt',
    name: 'HR & Employee Management System',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Workforce Portal',
    shortDesc: 'An employee portal for leave applications, attendance logging, company announcements, and monthly salary slip distribution.',
    fullDesc: 'An internal human resources platform concept built to eliminate informal paper leave chits and centralize personnel records under a secure self-service portal.',
    problemStatement: 'Small and medium teams waste time managing leave requests via chat messages and distributing physical pay slips.',
    proposedSolution: 'A dedicated employee self-service portal with one-click leave requests, manager approvals, holiday calendars, and password-protected pay slips.',
    features: [
      'Employee self-service profile and identity document directory',
      'Leave balance tracker with multi-level manager approval flows',
      'Monthly payroll calculation preview & PDF salary slip download',
      'Company notice board and official holiday calendar'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'UserCheck',
    accentColor: '#EA580C',
    featured: false
  },
  {
    id: 'prd-document-workflow',
    name: 'Document & Workflow Management',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Document Vault & Approval',
    shortDesc: 'A secure cloud document repository with role-based folder permissions, version history, and sequential approval pipelines.',
    fullDesc: 'A collaborative file management architecture designed to organize legal, financial, and operational contracts with structured verification workflows.',
    problemStatement: 'Critical organizational documents are scattered across desktop folders and chat apps, risking lost revisions and data leaks.',
    proposedSolution: 'A centralized encrypted document vault with folder-level permissions, version rollback, search tagging, and step-by-step sign-off workflows.',
    features: [
      'Role-governed folder structures with granular read/write rights',
      'Document version control with audit trail logging',
      'Multi-stage approval pipeline with digital sign-off states',
      'Tag-based metadata search and full-text document indexing'
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS S3 / GCS', 'Tailwind CSS'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'FileText',
    accentColor: '#0F172A',
    featured: false
  },
  {
    id: 'prd-analytics-dashboard',
    name: 'Analytics & Reporting Dashboard',
    type: 'product',
    category: 'Software Development',
    subCategory: 'Business Intelligence Suite',
    shortDesc: 'An interactive executive analytics cockpit consolidating revenue streams, inquiry trends, and operational productivity metrics.',
    fullDesc: 'A business intelligence dashboard prototype designed to transform raw transactional tables into clear graphical trends, heatmaps, and executive insights.',
    problemStatement: 'Business managers are overwhelmed by rows of raw database records and lack quick visual insights to make tactical decisions.',
    proposedSolution: 'An interactive visual analytics platform featuring responsive charts, date-range filters, cohort analysis, and automated PDF export reports.',
    features: [
      'Interactive visual charts (bar, line, donut, area distributions)',
      'Custom date range filtering with comparative period analysis',
      'Operational health metric cards with month-over-month indicators',
      'One-click PDF executive report generation and spreadsheet export'
    ],
    techStack: ['React', 'Chart.js / Recharts', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    status: 'Concept Prototype',
    isDemo: true,
    demoNotice: DEMO_NOTICE,
    icon: 'TrendingUp',
    accentColor: '#2563EB',
    featured: true
  }
];

export const ALL_PROJECTS = [...SERVICE_PROJECTS, ...PRODUCT_PROJECTS];

