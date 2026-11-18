"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Users,
  Target,
  TrendingUp,
  Award,
  Zap,
  Globe2,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Mail,
  Play,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { TeamMember } from "@/types/docs";
import { ycPitchDeckSections } from "@/lib/docsData";

interface PitchDeckViewProps {
  teamMembers?: TeamMember[];
  searchQuery?: string;
}

export function PitchDeckView({ teamMembers, searchQuery = "" }: PitchDeckViewProps) {
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});

  const filteredSections = ycPitchDeckSections.filter((section) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(q) ||
      section.subtitle.toLowerCase().includes(q) ||
      section.highlight.toLowerCase().includes(q) ||
      section.bullets.some((b) => b.toLowerCase().includes(q))
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const members = teamMembers && teamMembers.length > 0 ? teamMembers : [];

  return (
    <div className="space-y-12">
      {/* Intro Pitch Deck Banner */}
      <div className="p-8 rounded-3xl bg-linear-to-br from-sky-500/10 via-card to-background border border-sky-500/20 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YC Demo Day Deck Format</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
            QbitX: The Adaptive AI-Native Engineering Academy
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Bridging the 82% CS graduate employability gap through real-time Socratic AI mentorship, production code sandboxes, and early intervention alerts.
          </p>
        </div>
      </div>

      {/* Grid of Pitch Sections */}
      <div className="space-y-10">
        {filteredSections.map((sec, idx) => {
          const isTeamSection = sec.id === "team";

          return (
            <section
              key={sec.id}
              id={sec.id}
              className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 transition-all hover:border-border/80 scroll-mt-24"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-500 px-2 py-0.5 rounded-md bg-sky-500/10">
                      SLIDE {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {sec.subtitle}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground font-heading">
                    {sec.title}
                  </h3>
                </div>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border/80 text-foreground text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>{sec.highlight}</span>
                </div>
              </div>

              {/* Special Rendering: Team Section */}
              {isTeamSection ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>QbitX Core Founding & Engineering Roster</span>
                    <span className="inline-flex items-center gap-1 text-sky-500 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      100% Verified Technical Leadership
                    </span>
                  </div>

                  {/* Team Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {members.map((member) => {
                      const hasError = avatarErrors[member.id];
                      return (
                        <div
                          key={member.id}
                          className="group relative p-5 rounded-2xl bg-muted/20 border border-border/80 hover:border-sky-500/40 hover:bg-muted/40 transition-all flex flex-col items-center text-center space-y-3"
                        >
                          {/* Uniform Frame & Aspect Ratio Avatar */}
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-border group-hover:ring-sky-500/50 shadow-sm shrink-0 transition-all">
                            {member.avatarUrl && !hasError ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-full h-full object-cover object-center"
                                onError={() =>
                                  setAvatarErrors((prev) => ({ ...prev, [member.id]: true }))
                                }
                              />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-sky-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center font-mono">
                                {getInitials(member.name)}
                              </div>
                            )}
                          </div>

                          {/* Member Meta */}
                          <div className="space-y-1 w-full">
                            <h4 className="font-bold text-foreground text-sm font-heading group-hover:text-sky-500 transition-colors">
                              {member.name}
                            </h4>
                            <p className="text-xs text-sky-600 dark:text-sky-400 font-medium line-clamp-1">
                              {member.role}
                            </p>
                            {member.affiliation && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1">
                                {member.affiliation}
                              </p>
                            )}
                          </div>

                          {/* Bio */}
                          {member.bio && (
                            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                              {member.bio}
                            </p>
                          )}

                          {/* Contact & Links */}
                          <div className="pt-2 mt-auto w-full border-t border-border/60 flex items-center justify-center gap-2">
                            <a
                              href={`mailto:${member.email}`}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              title={`Email ${member.email}`}
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                            {member.linkedinUrl && (
                              <a
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title="LinkedIn"
                              >
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                                </svg>
                              </a>
                            )}
                            {member.githubUrl && (
                              <a
                                href={member.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title="GitHub"
                              >
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Special Demo Section Interactive Mockup */}
              {sec.id === "product-demo" && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                    <span className="font-mono text-sky-400">interactive_sandbox.ts</span>
                    <span className="text-emerald-400 font-medium">● Gemini 2.5 Active</span>
                  </div>
                  <div className="font-mono text-xs text-slate-300 space-y-1">
                    <p className="text-slate-500">// Student queries: "How does binary search achieve O(log n)?"</p>
                    <p className="text-sky-300">
                      AI Mentor: "Let's inspect how the array search space shrinks when dividing by 2 at each step..."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="/courses"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-all"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Interactive Student Demo</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Bullet Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {sec.bullets.map((bullet, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs sm:text-sm text-foreground/90 leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Metrics row if present */}
              {sec.metrics && sec.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                  {sec.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-2xl bg-muted/40 border border-border/70 text-center"
                    >
                      <div className="text-lg sm:text-xl font-extrabold text-foreground font-mono">
                        {m.value}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
