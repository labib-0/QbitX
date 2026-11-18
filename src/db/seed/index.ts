import { db, schema } from "../../server/db";
import { ensureDbSchema } from "../../server/db/init";
import { auth } from "../../server/auth";
import { eq } from "drizzle-orm";

export async function runSeed() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    throw new Error(
      "[QbitX Security] Refusing to run demo seed script in production. Demo seeds inject known credentials. To seed production curriculum, set ALLOW_PRODUCTION_SEED=true with customized INITIAL_ADMIN_PASSWORD."
    );
  }

  console.log("🌱 Starting QbitX database seed...");
  await ensureDbSchema();

  // 1. Seed Tracks
  const trackWebAI = {
    id: "trk-web-ai",
    slug: "web-ai-engineering",
    title: "Full-Stack Web & AI Engineering",
    description: "Master modern full-stack web development with Next.js, TypeScript, and Generative AI integrations.",
    icon: "Cpu",
    orderIndex: 1,
    isPublished: true,
  };

  const trackCS = {
    id: "trk-cs-fundamentals",
    slug: "cs-fundamentals",
    title: "Computer Science & Systems",
    description: "Core algorithms, data structures, operating systems, and distributed architecture.",
    icon: "Binary",
    orderIndex: 2,
    isPublished: true,
  };

  for (const trk of [trackWebAI, trackCS]) {
    const existing = await db.select().from(schema.tracks).where(eq(schema.tracks.id, trk.id));
    if (existing.length === 0) {
      await db.insert(schema.tracks).values(trk);
    }
  }

  // 2. Seed Admin User & Mentor Users with Credential Auth
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@qbitx.com";
  const existingAdmin = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail));
  let adminId = "usr-admin-initial";
  if (existingAdmin.length === 0) {
    try {
      const res = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: process.env.INITIAL_ADMIN_PASSWORD || "AdminPassword123!",
          name: process.env.INITIAL_ADMIN_NAME || "System Super Admin",
        },
      });
      adminId = res.user.id;
      await db
        .update(schema.users)
        .set({ role: "super_admin", emailVerified: true })
        .where(eq(schema.users.id, adminId));
    } catch {
      await db.insert(schema.users).values({
        id: adminId,
        name: process.env.INITIAL_ADMIN_NAME || "System Super Admin",
        email: adminEmail,
        emailVerified: true,
        role: "super_admin",
        status: "active",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      });
    }
  } else {
    adminId = existingAdmin[0].id;
  }

  // Seed Mentor Dr. Tariqul Islam with Credential Auth
  const mentorEmail = "mentor@qbitx.com";
  const existingMentor = await db.select().from(schema.users).where(eq(schema.users.email, mentorEmail));
  let mentor1Id = "usr-mentor-tariqul";
  if (existingMentor.length === 0) {
    try {
      const res = await auth.api.signUpEmail({
        body: {
          email: mentorEmail,
          password: "MentorPassword123!",
          name: "Dr. Tariqul Islam",
        },
      });
      mentor1Id = res.user.id;
      await db
        .update(schema.users)
        .set({ role: "mentor", emailVerified: true })
        .where(eq(schema.users.id, mentor1Id));
    } catch {
      await db.insert(schema.users).values({
        id: mentor1Id,
        name: "Dr. Tariqul Islam",
        email: mentorEmail,
        emailVerified: true,
        role: "mentor",
        status: "active",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      });
    }
  } else {
    mentor1Id = existingMentor[0].id;
    await db.update(schema.users).set({ name: "Dr. Tariqul Islam" }).where(eq(schema.users.id, mentor1Id));
  }

  // Seed Test Student Tanvir Ahmed with Credential Auth
  const studentEmail = "student@qbitx.com";
  const existingStudent = await db.select().from(schema.users).where(eq(schema.users.email, studentEmail));
  let student1Id = "usr-student-tanvir";
  if (existingStudent.length === 0) {
    try {
      const res = await auth.api.signUpEmail({
        body: {
          email: studentEmail,
          password: "StudentPassword123!",
          name: "Tanvir Ahmed",
        },
      });
      student1Id = res.user.id;
      await db
        .update(schema.users)
        .set({ role: "student", emailVerified: true })
        .where(eq(schema.users.id, student1Id));
    } catch {
      await db.insert(schema.users).values({
        id: student1Id,
        name: "Tanvir Ahmed",
        email: studentEmail,
        emailVerified: true,
        role: "student",
        status: "active",
      });
    }
  } else {
    student1Id = existingStudent[0].id;
    await db.update(schema.users).set({ name: "Tanvir Ahmed" }).where(eq(schema.users.id, student1Id));
  }

  // Seed Mentor Eng. Mahbubur Rahman
  const mentor2 = {
    id: "usr-mentor-mahbubur",
    name: "Eng. Mahbubur Rahman",
    email: "mahbubur.rahman@qbitx.com",
    emailVerified: true,
    role: "mentor" as const,
    status: "active" as const,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  };
  const exists2 = await db.select().from(schema.users).where(eq(schema.users.email, mentor2.email));
  if (exists2.length === 0) {
    await db.insert(schema.users).values(mentor2);
  } else {
    await db.update(schema.users).set({ name: mentor2.name }).where(eq(schema.users.id, exists2[0].id));
    mentor2.id = exists2[0].id;
  }

  // Seed Mentor Nusrat Jahan
  const mentor3 = {
    id: "usr-mentor-nusrat",
    name: "Nusrat Jahan",
    email: "nusrat.jahan@qbitx.com",
    emailVerified: true,
    role: "mentor" as const,
    status: "active" as const,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  };
  const exists3 = await db.select().from(schema.users).where(eq(schema.users.email, mentor3.email));
  if (exists3.length === 0) {
    await db.insert(schema.users).values(mentor3);
  } else {
    mentor3.id = exists3[0].id;
  }

  // Seed additional Bangladeshi Students
  const additionalStudents = [
    {
      id: "usr-student-anika",
      name: "Anika Tabassum",
      email: "anika.tabassum@qbitx.com",
      emailVerified: true,
      role: "student" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "usr-student-nafis",
      name: "Nafis Fuad",
      email: "nafis.fuad@qbitx.com",
      emailVerified: true,
      role: "student" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: "usr-student-sumaiya",
      name: "Sumaiya Rahman",
      email: "sumaiya.rahman@qbitx.com",
      emailVerified: true,
      role: "student" as const,
      status: "active" as const,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
  ];

  for (const s of additionalStudents) {
    const ex = await db.select().from(schema.users).where(eq(schema.users.email, s.email));
    if (ex.length === 0) {
      await db.insert(schema.users).values(s);
    }
  }

  // Mentor profiles
  const mProf1 = {
    id: "mprof-tariqul",
    userId: mentor1Id,
    fullName: "Dr. Tariqul Islam",
    expertise: ["Next.js", "TypeScript", "LLM Systems", "React 19"],
    skills: ["Full-Stack Architecture", "Next.js App Router", "Prompt Engineering", "Vector Databases"],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Neon PostgreSQL", "Google Gemini"],
    yearsOfExperience: 10,
    bio: "Associate Professor of Computer Science & Engineering at BUET, Lead AI Architect at QbitX, guiding university engineers in full-stack AI system architectures.",
    companyOrUniversity: "BUET / QbitX Faculty",
    isApproved: true,
    availabilityStatus: "available",
    meetingLink: "https://meet.google.com/qbitx-office-hours-tariqul",
  };

  const mProf2 = {
    id: "mprof-mahbubur",
    userId: mentor2.id,
    fullName: "Eng. Mahbubur Rahman",
    expertise: ["Algorithms", "Data Structures", "System Design", "Distributed Systems"],
    skills: ["Algorithm Optimization", "Dynamic Programming", "Graph Theory", "Distributed Systems"],
    technologies: ["Python", "C++", "Docker", "PostgreSQL"],
    yearsOfExperience: 8,
    bio: "Senior Staff Software Engineer & Systems Architect (ex-Brain Station 23 / Chaldal), competitive programming mentor and coach to over 600 CS undergraduates.",
    companyOrUniversity: "Brain Station 23 / BUET CSE Alum",
    isApproved: true,
    availabilityStatus: "available",
    meetingLink: "https://meet.google.com/qbitx-office-hours-mahbubur",
  };

  const mProf3 = {
    id: "mprof-nusrat",
    userId: mentor3.id,
    fullName: "Nusrat Jahan",
    expertise: ["Frontend Architecture", "UI/UX Engineering", "Web Performance", "React 19"],
    skills: ["Design Systems", "Tailwind CSS v4", "State Management", "Micro-frontends"],
    technologies: ["TypeScript", "Next.js", "Tailwind CSS", "PostgreSQL"],
    yearsOfExperience: 7,
    bio: "Senior Frontend Architect & UI/UX Specialist (ex-Pathao, BRAC University Alum), passionate about high-performance web applications and accessibility.",
    companyOrUniversity: "BRAC University / QbitX Faculty",
    isApproved: true,
    availabilityStatus: "available",
    meetingLink: "https://meet.google.com/qbitx-office-hours-nusrat",
  };

  for (const mp of [mProf1, mProf2, mProf3]) {
    const exists = await db.select().from(schema.mentorProfiles).where(eq(schema.mentorProfiles.id, mp.id));
    if (exists.length === 0) {
      await db.insert(schema.mentorProfiles).values(mp);
    }
  }

  // Student Profiles
  const sProfTanvir = {
    id: "sprof-tanvir",
    userId: student1Id,
    university: "Bangladesh University of Engineering and Technology (BUET)",
    department: "Computer Science & Engineering",
    academicYear: "2nd Year",
    bio: "2nd-year CSE student at BUET passionate about Next.js, AI system architectures, and algorithmic problem solving.",
    skills: ["TypeScript", "Next.js", "Python", "C++", "PostgreSQL"],
    githubUrl: "https://github.com/tanvir-ahmed-buet",
    linkedinUrl: "https://linkedin.com/in/tanvir-ahmed-cse",
    xp: 4850,
    level: 12,
  };
  const existsSProf = await db.select().from(schema.studentProfiles).where(eq(schema.studentProfiles.userId, student1Id));
  if (existsSProf.length === 0) {
    await db.insert(schema.studentProfiles).values(sProfTanvir);
  } else {
    await db.update(schema.studentProfiles).set(sProfTanvir).where(eq(schema.studentProfiles.userId, student1Id));
  }

  // 3. Seed Realistic Courses
  const course1 = {
    id: "crs-ai-web-eng",
    slug: "fullstack-ai-web-engineering",
    title: "Full-Stack AI Web Engineering with Next.js & Gemini",
    description: "Learn to build production-grade, AI-powered web applications from scratch using Next.js App Router, TypeScript, Drizzle ORM, Neon PostgreSQL, and Google Gemini LLMs.",
    category: "Web & AI Engineering",
    difficulty: "intermediate",
    trackId: trackWebAI.id,
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    instructorId: mentor1Id,
    instructorName: "Dr. Tariqul Islam",
    durationHours: 24,
    prerequisites: ["Basic JavaScript / TypeScript", "Fundamentals of HTML/CSS", "Git Basics"],
    learningOutcomes: [
      "Architect full-stack Next.js applications using React Server Components and Server Actions",
      "Model relational data with Drizzle ORM and Neon Serverless PostgreSQL",
      "Integrate Google Gemini for streaming AI chat and structured code reviews",
      "Deploy scalable serverless applications to Vercel with zero cold-start bottlenecks",
    ],
    isPublished: true,
  };

  const course2 = {
    id: "crs-dsa-mastery",
    slug: "dsa-practical-mastery",
    title: "Practical Data Structures & Algorithms for Software Engineers",
    description: "A hands-on algorithmic problem-solving course designed to prepare university students for technical interviews and clean software engineering.",
    category: "Computer Science",
    difficulty: "beginner",
    trackId: trackCS.id,
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    instructorId: mentor2.id,
    instructorName: "Eng. Mahbubur Rahman",
    durationHours: 32,
    prerequisites: ["Basic Programming Logic (Loops, Conditionals, Functions)"],
    learningOutcomes: [
      "Master Big-O asymptotic analysis and space/time tradeoffs",
      "Implement Arrays, Linked Lists, Trees, Graphs, and Hash Maps from scratch",
      "Solve LeetCode-style algorithmic challenges using systematic problem breakdown",
    ],
    isPublished: true,
  };

  const course3 = {
    id: "crs-cloud-backend",
    slug: "cloud-backend-microservices",
    title: "Production Cloud Backend & Microservices Architecture",
    description: "Design fault-tolerant backend services, Dockerized microservices, PostgreSQL connection pooling, and REST/gRPC APIs.",
    category: "Cloud & Systems",
    difficulty: "advanced",
    trackId: trackCS.id,
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600",
    instructorId: mentor3.id,
    instructorName: "Nusrat Jahan",
    durationHours: 28,
    prerequisites: ["Relational Databases", "Node.js / Express or Go basics"],
    learningOutcomes: [
      "Architect resilient microservices with event-driven message queues",
      "Deploy containerized workloads to cloud clusters with automated CI/CD",
      "Benchmark database throughput and optimize query response times",
    ],
    isPublished: true,
  };

  for (const c of [course1, course2, course3]) {
    const exists = await db.select().from(schema.courses).where(eq(schema.courses.id, c.id));
    if (exists.length === 0) {
      await db.insert(schema.courses).values(c);
    } else {
      await db.update(schema.courses).set(c).where(eq(schema.courses.id, c.id));
    }
  }

  // 4. Seed Course 1 Modules & Lessons
  const mod1 = {
    id: "mod-c1-foundations",
    courseId: course1.id,
    title: "Module 1: Next.js App Router Architecture & Server Components",
    description: "Understanding Server Components, Client Components, streaming, and modern full-stack routing.",
    orderIndex: 1,
    isPublished: true,
  };

  const mod2 = {
    id: "mod-c1-persistence",
    courseId: course1.id,
    title: "Module 2: Serverless Relational Persistence with Neon & Drizzle",
    description: "Configuring Neon PostgreSQL, authoring Drizzle schemas, executing migrations, and building typed data access layers.",
    orderIndex: 2,
    isPublished: true,
  };

  const mod3 = {
    id: "mod-c1-ai",
    courseId: course1.id,
    title: "Module 3: Generative AI Integrations with Vercel AI SDK & Gemini",
    description: "Connecting Google Gemini, streaming responses, context augmentation, and building an automated code reviewer.",
    orderIndex: 3,
    isPublished: true,
  };

  for (const m of [mod1, mod2, mod3]) {
    const exists = await db.select().from(schema.modules).where(eq(schema.modules.id, m.id));
    if (exists.length === 0) {
      await db.insert(schema.modules).values(m);
    }
  }

  // Lessons for Course 1
  const lesson1 = {
    id: "les-c1-1",
    moduleId: mod1.id,
    courseId: course1.id,
    title: "1.1 Introduction to Next.js App Router & Full-Stack Thinking",
    description: "Overview of modern Next.js conventions, folder routing, layout hierarchies, and React 19 features.",
    lessonType: "video",
    youtubeVideoId: "843nec-IvW0",
    durationMinutes: 18,
    orderIndex: 1,
    contentMarkdown: `## Next.js App Router Architecture\n\nIn this lesson, we explore how Next.js unifies frontend rendering and backend logic in a single type-safe framework.\n\n### Key Concepts Covered:\n- **Server Components:** Default server execution reducing client bundle sizes.\n- **Client Components (\`"use client"\`):** Interactive UI boundaries for state, event handlers, and browser APIs.\n- **Route Handlers:** Serverless HTTP endpoints in \`app/api/\`.\n- **Server Actions:** Type-safe RPC mutations directly invokable from React forms.`,
    isPublished: true,
  };

  const lesson2 = {
    id: "les-c1-2",
    moduleId: mod1.id,
    courseId: course1.id,
    title: "1.2 Building Layouts, Navigation & The Glassmorphism Design System",
    description: "Creating responsive dashboards with Tailwind CSS v4, Montserrat typography, and accessible UI components.",
    lessonType: "reading",
    youtubeVideoId: null,
    durationMinutes: 22,
    orderIndex: 2,
    contentMarkdown: `## Design System & Accessible Layouts\n\nDesign is not merely aesthetic; in educational platforms, clean visual hierarchy accelerates learning.\n\n### Visual Principles:\n1. **High Contrast:** Ensure WCAG 2.2 AA conformance.\n2. **Clean Typography:** Using Montserrat for headings and clean sans-serif for body content.\n3. **Responsive Drawers & Navbars:** Flawless usability across mobile and desktop.`,
    isPublished: true,
  };

  const lesson3 = {
    id: "les-c1-3",
    moduleId: mod2.id,
    courseId: course1.id,
    title: "2.1 Database Modeling with Drizzle ORM & Neon PostgreSQL",
    description: "Designing normalized schemas, relationships, indexes, and connection pooling for serverless environments.",
    lessonType: "video",
    youtubeVideoId: "h19RkWxrnww",
    durationMinutes: 25,
    orderIndex: 1,
    contentMarkdown: `## Relational Schema Design\n\nWe connect Neon's serverless PostgreSQL using Drizzle ORM.\n\n\`\`\`typescript\nimport { pgTable, text, timestamp } from "drizzle-orm/pg-core";\n\nexport const courses = pgTable("courses", {\n  id: text("id").primaryKey(),\n  title: text("title").notNull(),\n  createdAt: timestamp("created_at").defaultNow(),\n});\n\`\`\``,
    isPublished: true,
  };

  const lesson4 = {
    id: "les-c1-4",
    moduleId: mod3.id,
    courseId: course1.id,
    title: "3.1 Streaming AI Responses with Google Gemini & Vercel AI SDK",
    description: "Connecting Gemini 1.5 Pro, implementing streaming UI with useChat, and injecting course context.",
    lessonType: "video",
    youtubeVideoId: "tcqEUSFnH8A",
    durationMinutes: 30,
    orderIndex: 1,
    contentMarkdown: `## AI Integration with Gemini\n\nLearn how to construct a server-side AI stream that guides learners without hallucinating or leaking sensitive environment keys.`,
    isPublished: true,
  };

  for (const l of [lesson1, lesson2, lesson3, lesson4]) {
    const exists = await db.select().from(schema.lessons).where(eq(schema.lessons.id, l.id));
    if (exists.length === 0) {
      await db.insert(schema.lessons).values(l);
    }
  }

  // 5. Seed Realistic Projects
  const proj1 = {
    id: "proj-ai-code-reviewer",
    slug: "ai-code-reviewer-saas",
    title: "Autonomous AI Code Reviewer Platform",
    description: "Build an automated full-stack application that ingests GitHub repository commits, parses AST syntax, and generates structured code-quality feedback with Google Gemini.",
    difficulty: "intermediate",
    technologies: ["Next.js", "TypeScript", "Drizzle ORM", "Neon PostgreSQL", "Google Gemini"],
    learningObjectives: [
      "Implement GitHub webhook ingestion and repository URL verification",
      "Design relational schemas for pull requests, reviews, and line-item comments",
      "Deploy real-time streaming feedback and PDF summary reports",
    ],
    instructionsMarkdown: `## Capstone Instructions: AI Code Reviewer\n\n### Objective:\nCreate an interactive dashboard allowing developers to submit their code or GitHub PR links for automated review.\n\n### Requirements:\n1. **Authentication:** Student sign-in.\n2. **Submission Form:** Input GitHub URL with regex validation.\n3. **AI Pipeline:** Pass code to Gemini with strict JSON schema output.\n4. **Persistent Review:** Store findings, severity, and recommendations in PostgreSQL.`,
    starterRepoUrl: "https://github.com/qbitx/ai-code-reviewer-starter",
    estimatedHours: 25,
    isPublished: true,
  };

  const proj2 = {
    id: "proj-distributed-kv-cache",
    slug: "distributed-kv-cache-engine",
    title: "Distributed Key-Value In-Memory Cache",
    description: "Design a high-throughput in-memory caching engine featuring TTL expiration, LRU eviction policy, and Raft consensus replication.",
    difficulty: "advanced",
    technologies: ["TypeScript", "Node.js", "Docker", "Algorithms"],
    learningObjectives: [
      "Implement concurrent hash map data structures with thread-safe lock management",
      "Build LRU doubly linked list eviction algorithms with O(1) performance",
      "Benchmark throughput and latency under concurrent read/write workloads",
    ],
    instructionsMarkdown: `## Capstone Instructions: Distributed KV Cache\n\n### Objective:\nConstruct an in-memory key-value store with LRU eviction and TCP/HTTP server interfaces.`,
    starterRepoUrl: "https://github.com/qbitx/kv-cache-starter",
    estimatedHours: 35,
    isPublished: true,
  };

  const proj3 = {
    id: "proj-bkash-ledger",
    slug: "bkash-nagad-payment-ledger",
    title: "bKash/Nagad Real-Time Payment Gateway & Ledger Simulator",
    description: "High-concurrency digital wallet ledger simulating instant mobile financial services (MFS), idempotent webhook callbacks, and double-entry accounting reconciliation.",
    difficulty: "intermediate" as const,
    technologies: ["Next.js", "TypeScript", "Neon PostgreSQL", "ACID Transactions", "Webhooks"],
    learningObjectives: [
      "Implement double-entry bookkeeping ledger with transactional row-level locks",
      "Author idempotent webhook dispatchers with SHA-256 HMAC signature verification",
      "Build merchant settlement workflows and real-time transaction reconciliation dashboards",
    ],
    instructionsMarkdown: `## Capstone Instructions: bKash/Nagad Payment Ledger\n\n### Objective:\nConstruct a fault-tolerant MFS payment simulator handling concurrent debit/credit operations with zero balance drift.`,
    starterRepoUrl: "https://github.com/qbitx/bkash-ledger-starter",
    estimatedHours: 30,
    isPublished: true,
  };

  const proj4 = {
    id: "proj-dhaka-traffic",
    slug: "dhaka-traffic-flow-optimizer",
    title: "Dhaka Smart Traffic Flow Optimizer & Route Planning Engine",
    description: "Real-time traffic congestion analysis and shortest-path routing optimization engine modeled on Dhaka's arterial road networks, flyovers, and elevated expressways.",
    difficulty: "advanced" as const,
    technologies: ["Python", "FastAPI", "Graph Theory", "A* Search", "Next.js"],
    learningObjectives: [
      "Model multi-modal urban transit networks with weighted directed graphs",
      "Implement Dijkstra and A* pathfinding with real-time bottleneck weights",
      "Visualize route congestion heatmaps and simulated transit travel times",
    ],
    instructionsMarkdown: `## Capstone Instructions: Dhaka Smart Traffic\n\n### Objective:\nOptimize urban traffic routing across Mohakhali, Farmgate, and Mirpur intersections using dynamic graph weights.`,
    starterRepoUrl: "https://github.com/qbitx/dhaka-traffic-starter",
    estimatedHours: 40,
    isPublished: true,
  };

  const proj5 = {
    id: "proj-bangla-ocr",
    slug: "bangla-ocr-document-digitizer",
    title: "AI-Powered Bangla OCR & Document Digitizer Platform",
    description: "Computer vision and LLM-powered document intelligence platform for converting scanned Bengali academic textbooks, government circulars, and manuscripts into searchable text.",
    difficulty: "intermediate" as const,
    technologies: ["Next.js", "TypeScript", "Google Gemini", "Tesseract", "Tailwind CSS"],
    learningObjectives: [
      "Process high-resolution Bengali document scans and apply adaptive thresholding",
      "Integrate Gemini Vision models for nuanced Bengali grammatical correction",
      "Export structured searchable PDF and Markdown outputs with citation anchors",
    ],
    instructionsMarkdown: `## Capstone Instructions: Bangla OCR Digitizer\n\n### Objective:\nBuild a full-stack document pipeline capable of parsing complex Bengali compound letters (যুক্তবর্ণ) with 95%+ accuracy.`,
    starterRepoUrl: "https://github.com/qbitx/bangla-ocr-starter",
    estimatedHours: 28,
    isPublished: true,
  };

  const proj6 = {
    id: "proj-chaldal-inventory",
    slug: "chaldal-grocery-logistics-hub",
    title: "Chaldal-Style Real-Time Grocery Inventory & Cold-Chain Logistics Hub",
    description: "Full-stack warehousing inventory system featuring live stock reservation, FIFO warehouse dispatching, cold-chain temperature alerts, and delivery route tracking.",
    difficulty: "beginner" as const,
    technologies: ["React", "TypeScript", "Neon PostgreSQL", "Drizzle ORM"],
    learningObjectives: [
      "Design normalized inventory tables with atomic reservation decrements",
      "Build batch packing lists and micro-fulfillment dispatch pipelines",
      "Implement real-time delivery status dashboards with driver assignment",
    ],
    instructionsMarkdown: `## Capstone Instructions: Grocery Inventory Hub\n\n### Objective:\nConstruct a responsive warehouse operations portal handling stock replenishment and perishable item expiration tracking.`,
    starterRepoUrl: "https://github.com/qbitx/chaldal-inventory-starter",
    estimatedHours: 20,
    isPublished: true,
  };

  for (const p of [proj1, proj2, proj3, proj4, proj5, proj6]) {
    const exists = await db.select().from(schema.projects).where(eq(schema.projects.id, p.id));
    if (exists.length === 0) {
      await db.insert(schema.projects).values(p);
    } else {
      await db.update(schema.projects).set(p).where(eq(schema.projects.id, p.id));
    }
  }

  // Milestones for Project 1 & Project 3
  const m1 = {
    id: "ms-p1-1",
    projectId: proj1.id,
    title: "Milestone 1: Schema Architecture & GitHub URL Parser",
    description: "Set up the database tables for submissions and implement regex validation for repository URLs.",
    orderIndex: 1,
    requirements: ["Validate github.com/:owner/:repo URLs", "Create submission record in PostgreSQL with pending status"],
  };

  const m2 = {
    id: "ms-p1-2",
    projectId: proj1.id,
    title: "Milestone 2: Gemini Prompt Engineering & Structured Review Engine",
    description: "Integrate Google Gemini using Vercel AI SDK to generate structured code review findings.",
    orderIndex: 2,
    requirements: ["Define Zod schema for code review findings", "Enforce timeout and error handling"],
  };

  const m3 = {
    id: "ms-p1-3",
    projectId: proj1.id,
    title: "Milestone 3: Review Dashboard & Feedback Display",
    description: "Build an interactive UI displaying code findings with severity badges and suggested code diffs.",
    orderIndex: 3,
    requirements: ["Display findings grouped by category (Security, Performance, Style)", "Support mentor manual override grades"],
  };

  const mBkash1 = {
    id: "ms-bkash-1",
    projectId: proj3.id,
    title: "Milestone 1: Double-Entry Ledger Schema & ACID Transactions",
    description: "Author Drizzle schema with accounts, journal entries, and transactional rollback guarantees.",
    orderIndex: 1,
    requirements: ["Design atomic transfer transaction in PostgreSQL", "Enforce non-negative account balances"],
  };

  const mBkash2 = {
    id: "ms-bkash-2",
    projectId: proj3.id,
    title: "Milestone 2: Idempotent Webhook Processing Engine",
    description: "Build HMAC-SHA256 signature verification and replay attack protection for payment callbacks.",
    orderIndex: 2,
    requirements: ["Verify webhook signatures with timing-safe comparison", "Store idempotency keys with TTL"],
  };

  for (const ms of [m1, m2, m3, mBkash1, mBkash2]) {
    const exists = await db.select().from(schema.projectMilestones).where(eq(schema.projectMilestones.id, ms.id));
    if (exists.length === 0) {
      await db.insert(schema.projectMilestones).values(ms);
    }
  }

  // 6. Seed Course Enrollments for Students
  const enrollmentsToSeed = [
    {
      id: "enr-tanvir-c1",
      userId: student1Id,
      courseId: course1.id,
      status: "active",
      progressPercent: 74,
      enrolledAt: new Date(Date.now() - 25 * 86400000),
    },
    {
      id: "enr-tanvir-c2",
      userId: student1Id,
      courseId: course2.id,
      status: "active",
      progressPercent: 88,
      enrolledAt: new Date(Date.now() - 20 * 86400000),
    },
    {
      id: "enr-anika-c1",
      userId: "usr-student-anika",
      courseId: course1.id,
      status: "active",
      progressPercent: 45,
      enrolledAt: new Date(Date.now() - 14 * 86400000),
    },
    {
      id: "enr-nafis-c2",
      userId: "usr-student-nafis",
      courseId: course2.id,
      status: "active",
      progressPercent: 30,
      enrolledAt: new Date(Date.now() - 10 * 86400000),
    },
  ];

  for (const enr of enrollmentsToSeed) {
    const exists = await db.select().from(schema.enrollments).where(eq(schema.enrollments.id, enr.id));
    if (exists.length === 0) {
      await db.insert(schema.enrollments).values(enr);
    }
  }

  // 7. Seed Project Enrollments & Submissions
  const projEnrollmentsToSeed = [
    {
      id: "penr-tanvir-bkash",
      userId: student1Id,
      projectId: proj3.id,
      status: "submitted",
      currentMilestone: 2,
      startedAt: new Date(Date.now() - 15 * 86400000),
    },
    {
      id: "penr-tanvir-ocr",
      userId: student1Id,
      projectId: proj5.id,
      status: "in_progress",
      currentMilestone: 1,
      startedAt: new Date(Date.now() - 5 * 86400000),
    },
  ];

  for (const pe of projEnrollmentsToSeed) {
    const exists = await db.select().from(schema.projectEnrollments).where(eq(schema.projectEnrollments.id, pe.id));
    if (exists.length === 0) {
      await db.insert(schema.projectEnrollments).values(pe);
    }
  }

  // Project Submission & Review
  const sub1 = {
    id: "sub-bkash-tanvir",
    projectId: proj3.id,
    userId: student1Id,
    githubRepoUrl: "https://github.com/tanvir-ahmed-buet/bkash-ledger-simulator",
    liveDemoUrl: "https://bkash-ledger-buet.vercel.app",
    notes: "Implemented double-entry accounting with PostgreSQL row-level locks, HMAC webhook verification, and automated reconciliation reports.",
    status: "reviewed",
    submittedAt: new Date(Date.now() - 2 * 86400000),
  };

  const subExists = await db.select().from(schema.projectSubmissions).where(eq(schema.projectSubmissions.id, sub1.id));
  if (subExists.length === 0) {
    await db.insert(schema.projectSubmissions).values(sub1);

    await db.insert(schema.projectReviews).values({
      id: "rev-bkash-tanvir",
      submissionId: sub1.id,
      reviewerId: mentor1Id,
      score: 96,
      feedbackMarkdown: "### Outstanding Engineering Quality!\n- **Idempotency**: Excellent handling of duplicate transaction requests.\n- **ACID Integrity**: Row locks prevent race conditions during concurrent transfers.\n- **Recommendation**: Consider adding Redis cache for read-heavy account balance queries.",
      status: "approved",
      reviewedAt: new Date(Date.now() - 86400000),
    });
  }

  // 8. Seed Audit Logs
  const auditLogsToSeed = [
    {
      id: "audit-seed-1",
      actorId: mentor1Id,
      actorName: "Dr. Tariqul Islam",
      actorRole: "mentor",
      actionType: "PROJECT_SUBMISSION_GRADED",
      action: "Graded bKash Payment Ledger Capstone",
      targetId: sub1.id,
      targetType: "project_submission",
      details: { score: 96, studentName: "Tanvir Ahmed" },
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "audit-seed-2",
      actorId: mentor2.id,
      actorName: "Eng. Mahbubur Rahman",
      actorRole: "mentor",
      actionType: "OFFICE_HOURS_SCHEDULED",
      action: "Scheduled Algorithm & Competitive Programming Clinic",
      targetId: "oh-buet-1",
      targetType: "office_hour",
      details: { location: "BUET ECE Building Lab 502 / Google Meet" },
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
    {
      id: "audit-seed-3",
      actorId: adminId,
      actorName: "System Super Admin",
      actorRole: "super_admin",
      actionType: "ORGANIZATION_REGISTERED",
      action: "Registered Bangladesh University of Engineering and Technology",
      targetId: "org-buet",
      targetType: "organization",
      details: { domain: "buet.ac.bd", status: "active" },
      createdAt: new Date(Date.now() - 30 * 86400000),
    },
  ];

  for (const log of auditLogsToSeed) {
    const exists = await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.id, log.id));
    if (exists.length === 0) {
      await db.insert(schema.auditLogs).values(log);
    }
  }

  // 9. Seed Assessment Questions for Course 1, Lesson 1
  const assessment1 = {
    id: "asm-c1-l1",
    lessonId: lesson1.id,
    courseId: course1.id,
    title: "Next.js App Router Architecture Checkpoint",
    description: "Test your understanding of Server Components, Client Components, and routing boundaries.",
    passingScore: 70,
  };

  const asmExists = await db.select().from(schema.assessments).where(eq(schema.assessments.id, assessment1.id));
  if (asmExists.length === 0) {
    await db.insert(schema.assessments).values(assessment1);

    const q1 = {
      id: "q-c1-1",
      assessmentId: assessment1.id,
      questionText: "Which of the following statements about React Server Components in Next.js is TRUE?",
      options: [
        { id: 0, text: "Server Components increase client JavaScript bundle size." },
        { id: 1, text: "Server Components execute strictly on the server and do not ship JavaScript to the client by default." },
        { id: 2, text: "Server Components can use useState and useEffect hooks directly." },
        { id: 3, text: "Server Components cannot fetch data from databases directly." },
      ],
      correctOptionIndex: 1,
      explanation: "React Server Components run only on the server, allowing direct database access and zero client-bundle overhead.",
      orderIndex: 1,
    };

    const q2 = {
      id: "q-c1-2",
      assessmentId: assessment1.id,
      questionText: "What directive must be added at the top of a file in Next.js to enable client-side interactivity like useState?",
      options: [
        { id: 0, text: '"use client"' },
        { id: 1, text: '"use server"' },
        { id: 2, text: '"use browser"' },
        { id: 3, text: '"client-side"' },
      ],
      correctOptionIndex: 0,
      explanation: 'The "use client" directive marks the boundary between Server Components and Client Components in Next.js.',
      orderIndex: 2,
    };

    await db.insert(schema.assessmentQuestions).values([q1, q2]);
  }

  console.log("✅ QbitX database seed completed successfully!");
}

if (process.argv[1]?.endsWith("seed/index.ts") || process.argv[1]?.endsWith("seed/index.js")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    });
}
