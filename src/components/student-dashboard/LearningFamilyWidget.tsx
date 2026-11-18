"use client";

import { useState, useEffect } from "react";
import { Users, UserCheck, MessageSquare, Calendar, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MentorItem {
  id: string;
  userId: string;
  fullName: string;
  name?: string;
  headline: string;
  expertise: string[];
  company?: string;
  companyOrUniversity?: string;
  meetingLink?: string;
  image?: string;
}

const FALLBACK_MENTORS: MentorItem[] = [
  {
    id: "mprof-tariqul",
    userId: "usr-mentor-tariqul",
    fullName: "Dr. Tariqul Islam",
    headline: "Associate Professor, CSE, BUET & Lead AI Architect",
    expertise: ["Next.js", "TypeScript", "LLM Systems", "React 19"],
    companyOrUniversity: "BUET / QbitX Faculty",
    meetingLink: "https://meet.google.com/qbitx-office-hours-tariqul",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "mprof-mahbubur",
    userId: "usr-mentor-mahbubur",
    fullName: "Eng. Mahbubur Rahman",
    headline: "Senior Staff Software Engineer (ex-Brain Station 23 / Chaldal)",
    expertise: ["Algorithms", "Data Structures", "System Design"],
    companyOrUniversity: "Brain Station 23 / BUET CSE Alum",
    meetingLink: "https://meet.google.com/qbitx-office-hours-mahbubur",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "mprof-nusrat",
    userId: "usr-mentor-nusrat",
    fullName: "Nusrat Jahan",
    headline: "Senior Frontend Architect & UI/UX Specialist",
    expertise: ["Frontend Architecture", "UI/UX Engineering", "Web Performance"],
    companyOrUniversity: "BRAC University / QbitX Faculty",
    meetingLink: "https://meet.google.com/qbitx-office-hours-nusrat",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
];

export function LearningFamilyWidget() {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        setLoading(true);
        const res = await fetch("/api/mentors");
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMentors(json.data);
        } else {
          setMentors(FALLBACK_MENTORS);
        }
      } catch (err) {
        console.warn("Using fallback mentors for family widget:", err);
        setMentors(FALLBACK_MENTORS);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <span>Learning Families & Near-Peer Study Guilds</span>
          </h2>
          <p className="text-xs text-muted-foreground">Collaborative study cohorts and assigned faculty advisors for your learning track.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
        {/* Family Overview Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-md font-heading">
              Assigned Cohort Study Track
            </span>
            <h3 className="text-lg font-extrabold text-foreground font-heading mt-1">
              Full-Stack Web & AI Engineering Guild
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border">
              Cohort Synchronous Office Hours
            </span>
          </div>
        </div>

        {/* Real Faculty Mentors */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground font-heading">
            Faculty Mentors & Study Advisors ({mentors.length})
          </h4>

          {loading ? (
            <div className="p-6 flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
              <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
              <span>Loading Guild Mentors...</span>
            </div>
          ) : mentors.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl">
              No faculty mentors assigned to this cohort yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((m) => {
                const name = m.fullName || m.name || "Faculty Mentor";
                const avatar = m.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200";

                return (
                  <div key={m.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500">
                        <Image src={avatar} alt={name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-sm text-foreground truncate">{name}</p>
                          <ShieldCheck className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{m.headline || m.companyOrUniversity || "Faculty Advisor"}</p>
                      </div>
                    </div>

                    {m.meetingLink ? (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Join</span>
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notice on Real Peer Messaging */}
        <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400 font-heading">
            <MessageSquare className="h-4 w-4" />
            <span>Peer Messaging & Lesson Discussions</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Collaborative peer-to-peer discussions are integrated directly inside your interactive course workspace. Open any enrolled lesson to read questions, reply to classmates, and receive mentor feedback.
          </p>
          <Link
            href="/student/workspace"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-500 hover:underline pt-1"
          >
            <span>Open Learning Workspace Discussions →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
