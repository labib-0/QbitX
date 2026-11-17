import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db, schema } from "@/server/db";
import { eq, or, ilike, and } from "drizzle-orm";
import {
  Award,
  Code,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Download,
  CheckCircle2,
  Calendar,
  Layers
} from "lucide-react";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface PublicPortfolioProps {
  params: Promise<{ username: string }>;
}

export default async function PublicPortfolioPage({ params }: PublicPortfolioProps) {
  const { username } = await params;

  // 1. Resolve user by ID, email prefix, or normalized name slug
  const normalizedSlugName = username.replace(/-/g, " ");

  const users = await db
    .select()
    .from(schema.users)
    .where(
      or(
        eq(schema.users.id, username),
        ilike(schema.users.email, `${username}@%`),
        ilike(schema.users.name, normalizedSlugName)
      )
    );

  let user = users[0];
  if (!user) {
    const allUsers = await db.select().from(schema.users).limit(50);
    const targetClean = username.toLowerCase().replace(/[^a-z0-9]/g, "");
    const matched = allUsers.find(
      (u: any) => u.name && u.name.toLowerCase().replace(/[^a-z0-9]/g, "") === targetClean
    );
    if (matched) {
      user = matched;
    }
  }

  if (!user) {
    notFound();
  }

  // 2. Fetch student profile
  const profiles = await db
    .select()
    .from(schema.studentProfiles)
    .where(eq(schema.studentProfiles.userId, user.id));

  const profile = profiles[0] || {
    university: "Computer Science & Engineering",
    graduationYear: 2027,
    bio: "Undergraduate student passionate about building real-world applications and mastering modern software architecture.",
    skills: ["TypeScript", "Next.js", "PostgreSQL", "React", "Git"],
    githubUrl: null,
    linkedinUrl: null,
    xp: 0,
    level: 1,
  };

  // 3. Fetch completed / active capstone projects
  const studentProjects = await db
    .select({
      id: schema.projects.id,
      title: schema.projects.title,
      description: schema.projects.description,
      difficulty: schema.projects.difficulty,
      technologies: schema.projects.technologies,
      status: schema.projectEnrollments.status,
      githubRepoUrl: schema.projectSubmissions.githubRepoUrl,
      liveDemoUrl: schema.projectSubmissions.liveDemoUrl,
    })
    .from(schema.projectEnrollments)
    .innerJoin(schema.projects, eq(schema.projectEnrollments.projectId, schema.projects.id))
    .leftJoin(
      schema.projectSubmissions,
      and(
        eq(schema.projectSubmissions.projectId, schema.projects.id),
        eq(schema.projectSubmissions.userId, user.id)
      )
    )
    .where(eq(schema.projectEnrollments.userId, user.id));

  // 4. Fetch enrolled/completed courses
  const enrollments = await db
    .select({
      courseTitle: schema.courses.title,
      category: schema.courses.category,
      status: schema.enrollments.status,
      progressPercentage: schema.enrollments.progressPercent,
    })
    .from(schema.enrollments)
    .innerJoin(schema.courses, eq(schema.enrollments.courseId, schema.courses.id))
    .where(eq(schema.enrollments.userId, user.id));

  // 5. Fetch custom portfolio items
  const customItems = await db
    .select()
    .from(schema.portfolioItems)
    .where(eq(schema.portfolioItems.userId, user.id));

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading font-black text-2xl tracking-tighter text-foreground group-hover:text-sky-500 transition-colors">
              Qbit<span className="text-sky-500">X</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href={`/api/portfolio/cv/latex?userId=${user.id}`}
              download
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted hover:bg-sky-500 hover:text-white text-foreground text-xs font-bold border border-border transition-all shadow-sm"
              title="Download verified LaTeX Resume source code"
            >
              <Download className="h-3.5 w-3.5" />
              <span>LaTeX Resume</span>
            </a>

            <span className="text-xs font-extrabold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-3.5 py-1.5 rounded-full border border-sky-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-sky-500" />
              <span>Verified Student Profile</span>
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
                {user.name}
              </h1>
              <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/20 self-center sm:self-auto">
                {profile.xp || 0} XP • Level {profile.level || 1}
              </span>
            </div>

            <p className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-center sm:justify-start gap-1.5">
              <GraduationCap className="h-4 w-4" />
              <span>{profile.university}</span>
              {profile.graduationYear && <span>• Class of {profile.graduationYear}</span>}
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {profile.bio}
            </p>

            {/* Links */}
            {(profile.githubUrl || profile.linkedinUrl) && (
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-bold"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sky-500 font-bold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Verified Skills */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Code className="h-5 w-5 text-sky-500" />
            <span>Technical Proficiencies & Skills</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {Array.isArray(profile.skills) && profile.skills.length > 0 ? (
              profile.skills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-muted text-foreground text-xs font-bold border border-border flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">General Software Engineering</span>
            )}
          </div>
        </div>

        {/* Capstone Projects Section */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xl text-foreground font-heading flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-500" />
            <span>Verified Capstone Projects</span>
          </h3>

          {studentProjects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No public capstone projects completed yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {studentProjects.map((p: any) => (
                <div
                  key={p.id}
                  className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-500">
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        {p.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-foreground font-heading">
                      {p.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {p.technologies?.map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {p.githubRepoUrl && (
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <a
                        href={p.githubRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-500 hover:underline font-bold"
                      >
                        <Github className="h-3.5 w-3.5" />
                        <span>View Repository</span>
                      </a>
                      {p.liveDemoUrl && (
                        <a
                          href={p.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coursework & Verified Learning */}
        {enrollments.length > 0 && (
          <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Academic Curriculum & Certifications</span>
            </h3>

            <div className="space-y-2.5">
              {enrollments.map((e: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border text-xs"
                >
                  <span className="font-bold text-foreground">{e.courseTitle}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{e.category}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        e.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-sky-500/10 text-sky-500"
                      }`}
                    >
                      {e.progressPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
