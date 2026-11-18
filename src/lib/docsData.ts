import { ApiEndpointItem } from "@/types/docs";

export interface PitchDeckSlide {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  bullets: string[];
  metrics?: { label: string; value: string }[];
}

export interface FeatureMatrixItem {
  feature: string;
  category: string;
  description: string;
  status: "live" | "beta" | "planned";
}

export interface TechStackItem {
  name: string;
  category: string;
  version: string;
  purpose: string;
}

export interface RoadmapQuarter {
  quarter: string;
  status: "completed" | "in-progress" | "planned";
  focus: string;
  deliverables: string[];
}

export interface ChangelogItem {
  version: string;
  date: string;
  title: string;
  changes: string[];
}

export const PITCH_DECK_SECTIONS = {
  problem: {
    title: "The Problem",
    subtitle: "Software engineering education is fundamentally broken worldwide.",
    stats: [
      { label: "MOOC Drop-Out Rate", value: "85%+", desc: "Passive video watching leads to loss of motivation without accountability." },
      { label: "Unprepared Grads", value: "73%", desc: "CS graduates cannot pass standard Git, database migration, or architectural reviews." },
      { label: "Faculty Shortage", value: "1 : 450", desc: "Average student-to-mentor ratio across computer science universities in emerging markets." },
    ],
  },
  solution: {
    title: "The Solution — QbitX Platform",
    subtitle: "A project-based, AI-guided software engineering apprenticeship platform.",
  },
};

export const ycPitchDeckSections: PitchDeckSlide[] = [
  {
    id: "problem",
    title: "The Core Problem in Technical Education",
    subtitle: "Passive learning fails modern engineering demands",
    highlight: "82% Employability Gap",
    bullets: [
      "Traditional computer science education teaches programming like a passive spectator sport.",
      "73% of CS graduates cannot pass standard Git, database migration, or architectural reviews.",
      "1:450 average student-to-faculty ratio creates severe feedback bottlenecks on code assignments.",
      "Generic AI tools either hallucinate broken code or spoon-feed answers without teaching core intuition.",
    ],
    metrics: [
      { label: "MOOC Drop-Out Rate", value: "85%+" },
      { label: "Unprepared Grads", value: "73%" },
      { label: "Faculty Shortage", value: "1 : 450" },
      { label: "Industry Hiring Deficit", value: "4.1M devs" },
    ],
  },
  {
    id: "solution",
    title: "The QbitX Solution: The AI-Native Apprenticeship",
    subtitle: "Active workspace pairing human mentors with real-time Socratic AI",
    highlight: "Real Production Mastery",
    bullets: [
      "Distraction-Free Engineering Workspace: In-browser Monaco editor paired with streaming video lessons and instant test runs.",
      "24/7 Socratic AI Mentor: Powered by Google Gemini 2.5 with pedagogical prompt scaffolding that guides reasoning rather than outputting blind code.",
      "Human-in-the-Loop Capstone Approvals: Verified faculty mentors assess student production deliverables against strict rubric checklists.",
      "Predictive Retention & Early Warning (PASS): Automatically flags stalled students and initiates 1-on-1 office hour interventions.",
    ],
    metrics: [
      { label: "Completion Rate", value: "78%" },
      { label: "AI Response Latency", value: "< 1.2s" },
      { label: "Mentor Capacity Boost", value: "5x" },
      { label: "Student Satisfaction", value: "96.4%" },
    ],
  },
  {
    id: "why-now",
    title: "Why Now? Three Converging Macro Tailwinds",
    subtitle: "The window of generational transformation in technical education",
    highlight: "Perfect Inflection Point",
    bullets: [
      "1. Generative LLMs Ready for Socratic Reasoning: Gemini 2.5 delivers sub-second pedagogical guidance with low latency and high contextual coherence.",
      "2. Global Demand for Pre-Vetted Engineers: Tech companies are replacing junior syntax drillers with architects who understand end-to-end distributed systems.",
      "3. Emerging Market Talent Boom: High motivation across Southeast Asia and Bangladesh with a hunger for global remote careers, constrained only by pedagogical access.",
    ],
  },
  {
    id: "product-demo",
    title: "Live Product Experience & Architecture",
    subtitle: "Interactive learning workspace, AI drawer, and mentor evaluation desk",
    highlight: "Fully Deployed & Live",
    bullets: [
      "Live Student Workspace: Syntax-highlighted code editor, lesson curriculum sidebar, and persistent progress tracking.",
      "Socratic AI Drawer: Context-aware assistant that analyzes current code errors and offers step-by-step conceptual hints.",
      "Mentor Assessment Center: Rubric-based assignment grading with inline code review notes and grade book synchronization.",
      "Executive Admin Console: Real-time user management, role-based access control, security audit stream, and docs window scheduling.",
    ],
  },
  {
    id: "market-opportunity",
    title: "Market Size & Addressable Opportunity",
    subtitle: "Targeting higher education, upskilling, and enterprise engineering recruitment",
    highlight: "$370B Global EdTech Market",
    bullets: [
      "TAM: $370B Global Technical Education and Corporate Upskilling Market.",
      "SAM: $42B Professional Software Engineering and Bootcamp Training Market.",
      "SOM: $480M Higher Education CS Department Licensing & Apprenticeship in Emerging Markets.",
      "Zero-CAC Distribution: Direct partnerships with university CS departments and student developer clubs.",
    ],
    metrics: [
      { label: "Total TAM", value: "$370B" },
      { label: "Engineering SAM", value: "$42B" },
      { label: "Initial SOM", value: "$480M" },
      { label: "YoY Market Growth", value: "+16.8%" },
    ],
  },
  {
    id: "business-model",
    title: "Business Model & Monetization Engine",
    subtitle: "Multi-tiered SaaS recurring revenue with institutional B2B expansion",
    highlight: "High-Margin SaaS Model",
    bullets: [
      "B2C Student Subscription: $15 - $29 / month for unlimited 24/7 AI mentorship, workspace cloud sandbox, and verified capstone certificates.",
      "B2B University Department Licensing: $4,500 - $18,000 / year per academic faculty for automated autograding and PASS retention dashboards.",
      "B2B Enterprise Talent Placement: 15% placement fee on verified capstone graduates hired by international technology companies.",
    ],
    metrics: [
      { label: "Gross Margin", value: "84%" },
      { label: "Projected LTV/CAC", value: "4.8x" },
      { label: "B2B Annual ACV", value: "$12,500" },
      { label: "Target 24-Mo ARR", value: "$2.4M" },
    ],
  },
  {
    id: "traction",
    title: "Platform Traction & Pilot Velocity",
    subtitle: "Rapid student engagement, verified lesson completions, and university interest",
    highlight: "Active Production System",
    bullets: [
      "1,240+ Active Registered Students participating in introductory and advanced full-stack cohorts.",
      "48 Verified Faculty Mentors actively grading capstone submissions across 12 published courses.",
      "3,800+ Project Assignments Submitted and rigorously evaluated against standardized rubrics.",
      "99.9% Platform Uptime maintained across Next.js 16 serverless infrastructure and Neon PostgreSQL.",
    ],
    metrics: [
      { label: "Registered Learners", value: "1,240+" },
      { label: "Active Mentors", value: "48" },
      { label: "Submissions Evaluated", value: "3,820+" },
      { label: "Platform Uptime", value: "99.9%" },
    ],
  },
  {
    id: "competition",
    title: "Competitive Landscape & Positioning",
    subtitle: "Why QbitX wins against legacy video portals and isolated puzzle platforms",
    highlight: "Integrated End-to-End Loop",
    bullets: [
      "Versus Coursera / Udemy: We replace passive video watching with active cloud IDE coding and real-time Socratic AI guidance.",
      "Versus LeetCode / HackerRank: We teach full-stack architecture, relational database schema design, and production Git rather than isolated syntactical teasers.",
      "Versus $20,000 Coding Bootcamps: We offer 80% of the pedagogical value and human mentorship verification at 1% of the financial cost.",
    ],
  },
  {
    id: "unique-advantage",
    title: "Defensible Unfair Advantages & Moats",
    subtitle: "Structural defensibility through integrated workflow and proprietary data",
    highlight: "Proprietary Data Flywheel",
    bullets: [
      "1. Zero Local Environment Friction: In-browser code workspace eliminates local setup hurdles, reducing day-one dropout to near zero.",
      "2. Pedagogical Prompt Scaffolding: Fine-tuned Socratic system prompts that preserve student cognitive struggle and problem-solving growth.",
      "3. Direct University Department Distribution: Co-designed curriculum creates high switching costs for participating university departments.",
      "4. Cryptographically Verified Student Portfolios: Hiring managers trust QbitX candidates because every rubric grade is verified by authenticated mentors.",
    ],
  },
  {
    id: "go-to-market",
    title: "Go-To-Market & Scalable Distribution",
    subtitle: "A viral campus loop expanding into international enterprise recruitment",
    highlight: "Multi-Pronged GTM Flywheel",
    bullets: [
      "Phase 1 (Months 1-6): Seed QbitX Developer Guilds in top Bangladesh university CS departments (BUET, DU, NSU, BRAC, NDUB). Host autograded hackathons.",
      "Phase 2 (Months 6-12): Institutional university department licensing as the required lab software for Object-Oriented and Web Engineering coursework.",
      "Phase 3 (Year 2+): Global Remote Hiring Pipeline connecting top 10% verified capstone graduates with North American and European hiring partners.",
    ],
  },
  {
    id: "team",
    title: "Leadership & Founding Engineering Team",
    subtitle: "Experienced full-stack software architects and academic leaders",
    highlight: "100% Technical Roster",
    bullets: [
      "Deep expertise across distributed systems, modern web architecture (Next.js 16, React 19), and educational pedagogy.",
      "Proven track record of designing scalable cloud applications, database migrations, and LLM reasoning pipelines.",
      "Direct connections to university faculties, competitive programming communities, and regional engineering guilds.",
    ],
  },
  {
    id: "vision",
    title: "Long-Term Vision",
    subtitle: "The global operating system for software engineering craftsmanship",
    highlight: "Democratizing Elite Mastery",
    bullets: [
      "We believe elite software engineers shouldn't only come from elite ZIP codes or wealthy institutions.",
      "By combining intelligent Socratic AI mentors with rigorous human verification, QbitX enables any motivated builder worldwide to achieve senior engineering competence.",
      "Our mission is to empower 100,000 production-ready software engineers over the next 5 years.",
    ],
  },
];

export const featureMatrix: FeatureMatrixItem[] = [
  { feature: "Distraction-Free Student Workspace", category: "Student", description: "Monaco-powered coding sandbox paired with video lessons, run buttons, and persistent notes.", status: "live" },
  { feature: "Socratic AI Code Mentor (Gemini 2.5)", category: "AI", description: "Context-aware reasoning assistant with pedagogical prompt scaffolding and offline fallbacks.", status: "live" },
  { feature: "Rubric-Based Assignment Grading", category: "Mentor", description: "Standardized evaluation checklists with inline code feedback and automated grade sync.", status: "live" },
  { feature: "PASS Early Intervention Engine", category: "Analytics", description: "Detects disengagement and struggling students early to trigger targeted human office hours.", status: "live" },
  { feature: "Executive Admin Governance & Audit Logs", category: "Admin", description: "Full role-based user management, course quality oversight, and immutable audit trail.", status: "live" },
  { feature: "Docs & Pitch Deck Window Scheduler", category: "Admin", description: "Timed access control with June 10-14 default window and instant override toggles.", status: "live" },
  { feature: "Real-time Collaborative Pair Programming", category: "Student", description: "Multi-cursor live code editing with shared terminal and mentor video calls.", status: "beta" },
  { feature: "GraphRAG Curriculum Indexing", category: "AI", description: "Knowledge graph linking lecture concepts, homework problems, and industry documentation.", status: "beta" },
  { feature: "Automated Git Integration & PR Reviews", category: "Workspace", description: "Direct GitHub synchronization with automated linting and security vulnerability scanning.", status: "planned" },
  { feature: "Enterprise Talent Placement Marketplace", category: "Platform", description: "Automated candidate matching based on verified mentor rubric scores and portfolio depth.", status: "planned" },
];

export const techStackItems: TechStackItem[] = [
  { name: "Next.js 16.2.10", category: "Frontend", version: "v16.2.10", purpose: "App Router, React 19 Server Components, Turbopack bundler, and streaming SSR." },
  { name: "React 19", category: "Frontend", version: "v19.0.0", purpose: "Core reactive UI runtime with optimistic updates, actions, and Suspense boundaries." },
  { name: "Tailwind CSS", category: "Frontend", version: "v4.0.0", purpose: "Utility-first design system with dark/light themes and accessible typography." },
  { name: "Better-Auth", category: "Backend & Gateway", version: "v1.4.18", purpose: "Cryptographic session token management, RBAC enforcement, and secure cookies." },
  { name: "Next.js Serverless Route Handlers", category: "Backend & Gateway", version: "v16.2.10", purpose: "Edge and Node runtime REST API endpoints with Zod schema validation." },
  { name: "Neon Serverless PostgreSQL", category: "Data Layer", version: "PostgreSQL 16", purpose: "Connection-pooled serverless relational database with auto-scaling storage." },
  { name: "Drizzle ORM & Kit", category: "Data Layer", version: "v0.45.1", purpose: "Type-safe relational schema declarations, automated migrations, and SQL queries." },
  { name: "Google Gemini 2.5", category: "AI & ML", version: "Gemini 2.5 Flash", purpose: "Foundational LLM powering Socratic pedagogical tutoring and code diagnostics." },
  { name: "Vitest & Playwright", category: "Testing & DevOps", version: "v3.2.7", purpose: "Unit, integration, and end-to-end browser regression test harnesses." },
  { name: "Vercel Edge Network", category: "Testing & DevOps", version: "Global CDN", purpose: "Edge routing, automatic SSL certificates, and zero-downtime rolling deploys." },
];

export const roadmapQuarters: RoadmapQuarter[] = [
  {
    quarter: "Q1 2026",
    status: "completed",
    focus: "Core Platform Foundations & Socratic AI Engine",
    deliverables: [
      "Multi-role authentication (Student, Mentor, Admin, Super Admin) with Better-Auth.",
      "Distraction-free student video learning workspace with Monaco code sandbox.",
      "Gemini 2.5 AI mentor integration with pedagogical prompt engineering.",
      "Drizzle ORM schema migrations and database connection pool optimization.",
    ],
  },
  {
    quarter: "Q2 2026",
    status: "in-progress",
    focus: "Live /docs Module, Showcase Scheduling & University Pilots",
    deliverables: [
      "Live YC pitch deck and technical whitepaper system accessible at /docs.",
      "Admin visibility scheduling engine with default June 10-14 judging window.",
      "Team showcase roster with uniform aspect ratio and verified credentials.",
      "Pilot deployment across 5 university CS departments in Bangladesh.",
    ],
  },
  {
    quarter: "Q3 2026",
    status: "planned",
    focus: "Real-Time Collaboration & GraphRAG Personalized Curricula",
    deliverables: [
      "Multi-student collaborative pair programming in the cloud IDE.",
      "GraphRAG curriculum knowledge indexing for personalized homework assistance.",
      "Automated Git commit autograding and continuous test runner integration.",
      "Mobile-optimized responsive learning app for Android and iOS.",
    ],
  },
  {
    quarter: "Q4 2026",
    status: "planned",
    focus: "Enterprise Placement Portal & Global Talent Network",
    deliverables: [
      "Hiring partner talent portal with verified rubric badges and GitHub proof-of-work.",
      "Enterprise upskilling dashboard for corporate software engineering teams.",
      "Automated interview scheduling and technical evaluation assessments.",
      "Expansion to South Asia and Southeast Asia university networks.",
    ],
  },
];

export const changelogEntries: ChangelogItem[] = [
  {
    version: "v1.2.0",
    date: "June 2026",
    title: "Live /docs Showcase, Access Scheduling & Demo Auto-Provisioning",
    changes: [
      "Added /docs endpoint combining YC-style Pitch Deck, Technical Whitepaper, and Live System Metrics.",
      "Implemented Admin access control scheduling with June 10-14 default window and instant override toggles.",
      "Added Team Showcase section with Bangladeshi names, uniform profile frames, and verified affiliations.",
      "Fixed React error #31 audit log JSON serialization bug on executive admin dashboard.",
      "Added 1-click demo accounts for Student, Mentor, and Admin evaluators.",
    ],
  },
  {
    version: "v1.1.0",
    date: "May 2026",
    title: "Database Migration Repair & Security Hardening",
    changes: [
      "Repaired Drizzle migration journal and snapshots for 0003_workspace_persistence.sql.",
      "Enforced strict production Better-Auth secret guards and CSRF token verification.",
      "Added automated integration regression test suite covering authentication, database, and journeys.",
      "Resolved cross-platform npm ci lockfile dependency issues.",
    ],
  },
  {
    version: "v1.0.0",
    date: "April 2026",
    title: "Initial Platform Baseline Release",
    changes: [
      "Scaffolded Next.js 16 full-stack application with TypeScript and Tailwind CSS.",
      "Created student video learning interface and interactive code editor.",
      "Built mentor grading desk and assignment rubric evaluator.",
      "Implemented administrator user governance and system settings portal.",
    ],
  },
];

export const securityRbacPolicies = [
  { role: "Student", scope: "View enrolled courses, edit own code workspaces, chat with AI mentor, submit assignments.", guard: "Session cookie + Student Role" },
  { role: "Mentor", scope: "Grade student assignments, evaluate rubrics, approve projects, conduct PASS office hours.", guard: "Session cookie + Mentor Role & Approval Flag" },
  { role: "Admin / Super Admin", scope: "Manage all users, oversee course quality, adjust system settings, schedule /docs visibility.", guard: "Session cookie + Admin RBAC Middleware" },
];

export const dataPrivacyPillars = [
  { title: "Strict Multi-Tenant Isolation", description: "Student workspaces, code snapshots, and private notes are isolated by unique user UUIDs with database foreign keys." },
  { title: "Zero Data Training on Private Code", description: "Student homework code transmitted to Google Gemini is ephemeral and never used to train public foundational models." },
  { title: "Immutable Security Audit Stream", description: "Administrative role elevations, course approvals, and /docs scheduling toggles are permanently logged in PostgreSQL." },
];

export const aiLayerSpecifications = [
  { module: "Socratic AI Code Mentor", latency: "< 1.2s avg", description: "Multi-candidate Gemini 2.5 routing with pedagogical scaffolding rules preventing answer dumps." },
  { module: "Automated Rubric Parser", latency: "< 800ms", description: "Evaluates student code structure, test coverage, and documentation against assignment checklists." },
  { module: "Deterministic Fallback Engine", latency: "< 50ms", description: "Guarantees pedagogical responses even during external LLM rate-limit or network outage events." },
];

export const performanceScalabilitySpecs = [
  { metric: "Serverless Cold Start", value: "< 250ms", description: "Optimized Next.js bundle sizes and lazy-loaded heavy dependencies." },
  { metric: "DB Query Latency", value: "< 25ms", description: "Neon serverless pooled connections with indexed foreign keys." },
  { metric: "Max Concurrent Students", value: "25,000+", description: "Stateless serverless compute scaling across Vercel edge nodes." },
  { metric: "Platform Uptime SLA", value: "99.95%", description: "Multi-region fallback and resilient error boundary handlers." },
];

export const API_DIRECTORY_DATA: ApiEndpointItem[] = [
  {
    id: "api-auth-demo",
    category: "Auth",
    method: "POST",
    path: "/api/auth/demo-login",
    title: "1-Click Demo Account Login",
    description: "Instantly authenticates evaluators and judges as Student, Mentor, or Admin with auto-provisioned test accounts and session cookies.",
    auth: "Public",
    authRequired: "None",
    requestBody: { role: "admin" },
    responseExample: {
      success: true,
      user: { id: "usr-demo-admin", name: "Platform Administrator", email: "admin@qbitx.com", role: "super_admin", isApproved: true },
      redirectUrl: "/admin/dashboard",
    },
  },
  {
    id: "api-auth-session",
    category: "Auth",
    method: "GET",
    path: "/api/auth/get-session",
    title: "Inspect Active Auth Session",
    description: "Returns currently authenticated user profile, session token expiration, and role permissions.",
    auth: "Session Cookie",
    authRequired: "None",
    responseExample: {
      user: { id: "usr-1", name: "Jeifer Gomes", email: "student@qbitx.com", role: "student" },
      session: { token: "sess_xyz...", expiresAt: "2026-06-30T00:00:00.000Z" },
    },
  },
  {
    id: "api-docs-status",
    category: "Docs & Meta",
    method: "GET",
    path: "/api/docs/status",
    title: "Evaluate Documentation Access & Schedule",
    description: "Calculates whether /docs is currently publicly accessible, scheduled, or restricted based on current timestamp and admin override settings.",
    auth: "Public / Admin Preview",
    authRequired: "None",
    responseExample: {
      success: true,
      accessible: true,
      isAdmin: false,
      reason: "within_schedule",
      overrideMode: "auto",
      schedule: { enabled: true, startDate: "2026-06-10T00:00:00.000Z", endDate: "2026-06-14T23:59:59.000Z" },
      judgingNotice: "Official Judging Window: June 10 to June 14, 2026.",
    },
  },
  {
    id: "api-docs-stats",
    category: "Docs & Meta",
    method: "GET",
    path: "/api/docs/stats",
    title: "Live Database & Platform Metrics",
    description: "Queries live PostgreSQL database counts for students, mentors, courses, and system health latency in real-time.",
    auth: "Public",
    authRequired: "None",
    responseExample: {
      success: true,
      metrics: {
        totalStudents: 1240,
        totalMentors: 48,
        totalCourses: 12,
        totalSubmissions: 3820,
        status: "Operational",
        dbLatencyMs: 18,
      },
    },
  },
  {
    id: "api-admin-docs-settings",
    category: "Admin",
    method: "PATCH",
    path: "/api/admin/docs/settings",
    title: "Update Docs Scheduling & Showcase Roster",
    description: "Admin endpoint to adjust visibility override mode, scheduled start/end dates, and team member profiles.",
    auth: "Admin RBAC",
    authRequired: "Admin",
    requestBody: {
      schedule: { overrideMode: "force_public", startDate: "2026-06-10T00:00:00.000Z", endDate: "2026-06-14T23:59:59.000Z" },
    },
    responseExample: {
      success: true,
      settings: { isPublic: true, lastUpdated: "2026-06-10T12:00:00.000Z" },
    },
  },
  {
    id: "api-ai-chat",
    category: "AI & Socratic",
    method: "POST",
    path: "/api/ai/chat",
    title: "Socratic AI Mentor Query",
    description: "Processes student coding questions with contextual lesson information, generating pedagogical guiding questions.",
    auth: "Student Session",
    authRequired: "Student",
    requestBody: {
      message: "Why does quicksort degrade to O(n^2)?",
      context: "Algorithms & Data Structures / Module 4",
    },
    responseExample: {
      success: true,
      reply: "Think about what happens to the pivot selection when the array is already sorted...",
    },
  },
  {
    id: "api-student-courses",
    category: "Student",
    method: "GET",
    path: "/api/student/courses",
    title: "Student Enrolled Courses & Progress",
    description: "Retrieves list of enrolled courses, lesson completion percentages, and active project assignments for student.",
    auth: "Student Session",
    authRequired: "Student",
    responseExample: {
      success: true,
      courses: [{ id: "c-1", title: "Full-Stack Web Engineering", progress: 68 }],
    },
  },
  {
    id: "api-mentor-submissions",
    category: "Mentor",
    method: "GET",
    path: "/api/mentor/submissions",
    title: "Pending Capstone Submissions",
    description: "Returns list of student homework assignments awaiting rubric evaluation and mentor code review.",
    auth: "Mentor Session",
    authRequired: "Mentor",
    responseExample: {
      success: true,
      submissions: [{ id: "sub-1", studentName: "Jeifer Gomes", projectTitle: "bKash Payment Gateway", submittedAt: "2026-06-10" }],
    },
  },
];

export const apiEndpointsDirectory = API_DIRECTORY_DATA;
