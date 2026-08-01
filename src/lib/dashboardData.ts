// src/lib/dashboardData.ts
// Typed mock data layer for QbitX Student Dashboard
// This mirrors the Supabase schema so it can be swapped in seamlessly

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  category: string;
  thumbnail: string;
  lastAccessed?: string;
  enrolledAt: string;
  track: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  isActive: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  grade?: number;
  totalMarks: number;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "assignment" | "feedback" | "streak" | "announcement" | "grade";
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  category: "academic" | "event" | "deadline" | "general";
  urgent: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  course: string;
  grade: string;
  credentialId: string;
  imageUrl?: string;
}

export interface StudentStats {
  currentStreak: number;
  totalXP: number;
  level: number;
  completedCourses: number;
  totalCourses: number;
  upcomingDeadlines: number;
  unreadNotifications: number;
  semester: string;
  joinedDate: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const MOCK_COURSES: Course[] = [
  {
    id: "c1",
    title: "Introduction to Programming",
    description: "Build a solid foundation in programming with Python. Covers variables, loops, functions, and OOP.",
    instructor: "Dr. Sarah Chen",
    progress: 68,
    totalModules: 12,
    completedModules: 8,
    category: "Programming Fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    lastAccessed: "2 hours ago",
    enrolledAt: "2026-01-15",
    track: "Web Development",
    level: "Beginner",
    duration: "8 weeks",
    isActive: true,
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    description: "Master arrays, linked lists, trees, graphs, sorting, and searching algorithms.",
    instructor: "Prof. Alex Kim",
    progress: 40,
    totalModules: 16,
    completedModules: 6,
    category: "CS Fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600",
    lastAccessed: "Yesterday",
    enrolledAt: "2026-01-20",
    track: "Computer Science",
    level: "Intermediate",
    duration: "10 weeks",
    isActive: true,
  },
  {
    id: "c3",
    title: "Full-Stack Web Development",
    description: "Build complete web apps with React, Node.js, and PostgreSQL.",
    instructor: "Dr. Maya Patel",
    progress: 22,
    totalModules: 20,
    completedModules: 4,
    category: "Web Development",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    lastAccessed: "3 days ago",
    enrolledAt: "2026-02-01",
    track: "Full Stack",
    level: "Intermediate",
    duration: "12 weeks",
    isActive: true,
  },
  {
    id: "c4",
    title: "Machine Learning Foundations",
    description: "Explore supervised, unsupervised learning, neural networks, and model evaluation.",
    instructor: "Dr. James Wilson",
    progress: 5,
    totalModules: 14,
    completedModules: 1,
    category: "AI & ML",
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=600",
    lastAccessed: "1 week ago",
    enrolledAt: "2026-02-10",
    track: "AI/ML",
    level: "Advanced",
    duration: "14 weeks",
    isActive: false,
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    title: "DSA Lab #4 — Binary Trees",
    course: "Data Structures & Algorithms",
    dueDate: "2026-08-02T23:59:00",
    status: "pending",
    totalMarks: 100,
    description: "Implement binary tree traversal algorithms: inorder, preorder, and postorder.",
    priority: "high",
  },
  {
    id: "a2",
    title: "Python OOP Mini Project",
    course: "Introduction to Programming",
    dueDate: "2026-08-05T23:59:00",
    status: "pending",
    totalMarks: 50,
    description: "Build a library management system using object-oriented programming principles.",
    priority: "medium",
  },
  {
    id: "a3",
    title: "React Component Lab",
    course: "Full-Stack Web Development",
    dueDate: "2026-08-08T23:59:00",
    status: "pending",
    totalMarks: 80,
    description: "Create reusable React components for a student portal using hooks and context.",
    priority: "medium",
  },
  {
    id: "a4",
    title: "Algorithm Analysis Report",
    course: "Data Structures & Algorithms",
    dueDate: "2026-07-28T23:59:00",
    status: "submitted",
    totalMarks: 60,
    description: "Analyze time/space complexity of given algorithms with Big-O notation.",
    priority: "low",
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Mentor Feedback Received",
    description: "Dr. Sarah Chen left feedback on your RAG Pipeline assignment.",
    time: "15 min ago",
    read: false,
    type: "feedback",
  },
  {
    id: "n2",
    title: "Assignment Due Tomorrow",
    description: "DSA Lab #4 (Binary Trees) is due tomorrow at 11:59 PM. Don't forget!",
    time: "1 hour ago",
    read: false,
    type: "assignment",
  },
  {
    id: "n3",
    title: "🔥 14-Day Learning Streak!",
    description: "You've maintained a 14-day streak. Keep it up! +250 XP awarded.",
    time: "4 hours ago",
    read: true,
    type: "streak",
  },
  {
    id: "n4",
    title: "New Announcement",
    description: "Semester midterm schedule has been published. Check the Notice Panel.",
    time: "Yesterday",
    read: true,
    type: "announcement",
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an1",
    title: "Midterm Examination Schedule",
    body: "Midterms will be held from Aug 15–20. Please review the timetable on the portal.",
    date: "2026-07-30",
    category: "academic",
    urgent: true,
  },
  {
    id: "an2",
    title: "AI Hackathon — Register Now",
    body: "QbitX Annual AI Hackathon is on Aug 25. Form teams and register before Aug 10.",
    date: "2026-07-28",
    category: "event",
    urgent: false,
  },
  {
    id: "an3",
    title: "Library Access Extended",
    body: "The digital library is now open 24/7. New resources added for ML & Web Dev tracks.",
    date: "2026-07-26",
    category: "general",
    urgent: false,
  },
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: "cert1",
    title: "Python Programming Fundamentals",
    issueDate: "2026-05-10",
    course: "Introduction to Programming",
    grade: "A+",
    credentialId: "QBITX-PY-2026-0042",
  },
  {
    id: "cert2",
    title: "Web Development Bootcamp",
    issueDate: "2026-06-15",
    course: "Full-Stack Web Development",
    grade: "A",
    credentialId: "QBITX-WD-2026-0118",
  },
];

export const MOCK_STATS: StudentStats = {
  currentStreak: 14,
  totalXP: 4850,
  level: 12,
  completedCourses: 2,
  totalCourses: 4,
  upcomingDeadlines: 3,
  unreadNotifications: 2,
  semester: "Spring 2026",
  joinedDate: "2026-01-10",
};

// ─── Search Utility ───────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  title: string;
  type: "course" | "assignment" | "certificate" | "announcement";
  subtitle: string;
  tab: string;
}

export function searchAll(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();

  const results: SearchResult[] = [];

  MOCK_COURSES.forEach((c) => {
    if (c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
      results.push({ id: c.id, title: c.title, type: "course", subtitle: `Course · ${c.instructor}`, tab: "My Learning" });
    }
  });

  MOCK_ASSIGNMENTS.forEach((a) => {
    if (a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q)) {
      results.push({ id: a.id, title: a.title, type: "assignment", subtitle: `Assignment · ${a.course}`, tab: "Assignments" });
    }
  });

  MOCK_CERTIFICATES.forEach((cert) => {
    if (cert.title.toLowerCase().includes(q) || cert.course.toLowerCase().includes(q)) {
      results.push({ id: cert.id, title: cert.title, type: "certificate", subtitle: `Certificate · ${cert.credentialId}`, tab: "Certificates" });
    }
  });

  MOCK_ANNOUNCEMENTS.forEach((an) => {
    if (an.title.toLowerCase().includes(q) || an.body.toLowerCase().includes(q)) {
      results.push({ id: an.id, title: an.title, type: "announcement", subtitle: `Announcement · ${an.date}`, tab: "Dashboard" });
    }
  });

  return results.slice(0, 8);
}
