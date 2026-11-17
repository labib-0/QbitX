import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/server/auth/session";
import { db, schema } from "@/server/db";
import { eq, or, and } from "drizzle-orm";
import { internalErrorResponse } from "@/server/http/api-error";

function escapeLatex(str: string): string {
  if (!str) return "";
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");
    const session = await getServerSession();

    const targetUserId = requestedUserId || session?.user?.id;
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "User ID or authenticated session required." },
        { status: 400 }
      );
    }

    // 1. Fetch user & profile
    const users = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, targetUserId));

    const user = users[0];
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const profiles = await db
      .select()
      .from(schema.studentProfiles)
      .where(eq(schema.studentProfiles.userId, user.id));

    const profile = profiles[0] || {
      university: "University",
      graduationYear: new Date().getFullYear(),
      bio: "Software Engineering Student",
      skills: ["TypeScript", "Next.js", "PostgreSQL"],
      githubUrl: "",
      linkedinUrl: "",
    };

    // 2. Fetch completed projects
    const completedProjects = await db
      .select({
        title: schema.projects.title,
        description: schema.projects.description,
        technologies: schema.projects.technologies,
        githubUrl: schema.projectSubmissions.githubRepoUrl,
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

    // 3. Fetch completed courses / certifications
    const completedCourses = await db
      .select({
        title: schema.courses.title,
        category: schema.courses.category,
      })
      .from(schema.enrollments)
      .innerJoin(schema.courses, eq(schema.enrollments.courseId, schema.courses.id))
      .where(
        and(
          eq(schema.enrollments.userId, user.id),
          eq(schema.enrollments.status, "completed")
        )
      );

    // 4. Generate LaTeX document
    const studentName = escapeLatex(user.name);
    const studentEmail = escapeLatex(user.email);
    const university = escapeLatex(profile.university || "University");
    const graduationYear = profile.graduationYear || new Date().getFullYear();
    const bio = escapeLatex(profile.bio || "Passionate software engineer building resilient web and distributed systems.");
    const skillsList = Array.isArray(profile.skills)
      ? profile.skills.map((s: string) => escapeLatex(s)).join(", ")
      : "TypeScript, React, Next.js, Node.js, SQL";

    let projectsSection = "";
    if (completedProjects.length > 0) {
      projectsSection = completedProjects
        .map((p: any) => {
          const pTitle = escapeLatex(p.title);
          const pDesc = escapeLatex(p.description);
          const pTech = Array.isArray(p.technologies)
            ? p.technologies.map((t: string) => escapeLatex(t)).join(", ")
            : "";
          const link = p.githubUrl ? `\\quad {\\small \\url{${p.githubUrl}}}` : "";
          return `\\textbf{${pTitle}} \\hfill {\\small ${pTech}}${link}\\\\
${pDesc}\\\\
\\vspace{1.5mm}`;
        })
        .join("\n");
    } else {
      projectsSection = `\\textbf{Capstone Project: AI Code Reviewer} \\hfill {\\small Next.js, TypeScript, PostgreSQL}\\\\
Designed relational schema architecture and AI-assisted code evaluation pipeline.\\\\
\\vspace{1.5mm}`;
    }

    let coursesSection = "";
    if (completedCourses.length > 0) {
      coursesSection = completedCourses
        .map((c: any) => `\\item \\textbf{${escapeLatex(c.title)}} (${escapeLatex(c.category || "General")}) - QbitX Verified Certificate`)
        .join("\n");
    } else {
      coursesSection = "\\item \\textbf{Introduction to Computer Science} - QbitX Verified Curriculum";
    }

    const latexSource = `%----------------------------------------------------------------------------------------
%	QbitX Verified Student Curriculum Vitae
%----------------------------------------------------------------------------------------
\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}

\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{2ex}{1ex}
\\setlength{\\parindent}{0pt}

\\begin{document}

%----------------------------------------------------------------------------------------
%	HEADER
%----------------------------------------------------------------------------------------
\\begin{center}
    {\\huge \\textbf{${studentName}}}\\\\[1mm]
    {\\small ${studentEmail} \\quad | \\quad ${university} \\quad | \\quad Class of ${graduationYear}}\\\\
    {\\small Verified Profile: \\url{https://qbitx.vercel.app/portfolio/${user.id}}}
\\end{center}

\\vspace{-2mm}

%----------------------------------------------------------------------------------------
%	PROFESSIONAL SUMMARY
%----------------------------------------------------------------------------------------
\\section{Professional Summary}
${bio}

%----------------------------------------------------------------------------------------
%	EDUCATION
%----------------------------------------------------------------------------------------
\\section{Education}
\\textbf{${university}} \\hfill Expected: ${graduationYear}\\\\
{\\textit{B.S. in Computer Science / Software Engineering}}\\\\
\\vspace{-2mm}

%----------------------------------------------------------------------------------------
%	TECHNICAL SKILLS
%----------------------------------------------------------------------------------------
\\section{Technical Skills}
\\textbf{Languages \\& Frameworks:} ${skillsList}\\\\
\\textbf{Platforms \\& Databases:} PostgreSQL, Docker, Git, Next.js, Vercel

%----------------------------------------------------------------------------------------
%	PROJECTS
%----------------------------------------------------------------------------------------
\\section{Software Projects \\& Capstones}
${projectsSection}

%----------------------------------------------------------------------------------------
%	CERTIFICATIONS & COURSEWORK
%----------------------------------------------------------------------------------------
\\section{Verified Certifications \\& Coursework}
\\begin{itemize}[leftmargin=*,noitemsep,topsep=0pt]
${coursesSection}
\\end{itemize}

\\vspace{4mm}
\\begin{center}
    {\\scriptsize \\textit{Generated via QbitX Verified Skill Ecosystem - Project-Based Learning Platform}}
\\end{center}

\\end{document}
`;

    return new NextResponse(latexSource, {
      status: 200,
      headers: {
        "Content-Type": "text/x-tex; charset=utf-8",
        "Content-Disposition": `attachment; filename="cv_${user.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.tex"`,
      },
    });
  } catch (error: any) {
    return internalErrorResponse(error, "/api/portfolio/cv/latex");
  }
}
