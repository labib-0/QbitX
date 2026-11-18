"use client";

import { useState, useEffect } from "react";
import { X, MessageSquare, ExternalLink, Phone, ShieldCheck, Mail, Calendar, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface HelpDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MentorItem {
  id: string;
  userId: string;
  fullName: string;
  name?: string;
  headline: string;
  expertise: string[];
  company?: string;
  companyOrUniversity?: string;
  yearsOfExperience?: number;
  meetingLink?: string;
  image?: string;
}

const FALLBACK_HELP_MENTORS: MentorItem[] = [
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

export function HelpDeskModal({ isOpen, onClose }: HelpDeskModalProps) {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Request dialog state
  const [requestMentor, setRequestMentor] = useState<MentorItem | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadMentors() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/mentors");
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMentors(json.data);
        } else {
          setMentors(FALLBACK_HELP_MENTORS);
        }
      } catch (err: any) {
        console.warn("Using fallback mentors for help desk:", err);
        setMentors(FALLBACK_HELP_MENTORS);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, [isOpen]);

  const handleOpenRequest = (m: MentorItem) => {
    setRequestMentor(m);
    setSubject("");
    setDescription("");
    setRequestError(null);
    setRequestSuccess(false);
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestMentor) return;

    try {
      setSubmitting(true);
      setRequestError(null);

      const res = await fetch("/api/mentorship/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: requestMentor.userId,
          subject: subject.trim(),
          description: description.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to submit mentorship request.");
      }

      setRequestSuccess(true);
      setTimeout(() => {
        setRequestMentor(null);
        setRequestSuccess(false);
      }, 1800);
    } catch (err: any) {
      setRequestError(err.message || "An error occurred while booking session.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-extrabold text-foreground font-heading flex items-center gap-2">
              <Phone className="h-5 w-5 text-sky-500" />
              <span>QbitX Help Desk & Direct Mentor Support</span>
            </h2>
            <p className="text-xs text-muted-foreground">Book 1-on-1 office hours and request code reviews from senior faculty mentors.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-8 flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
            <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
            <span>Connecting to Mentor Directory...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center text-xs text-red-500">
            {error}
          </div>
        ) : mentors.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground space-y-2">
            <p className="font-bold text-foreground">No mentors currently available.</p>
            <p>Faculty mentors are assigned during active semester cohorts.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {mentors.map((m) => {
              const name = m.fullName || m.name || "Faculty Mentor";
              const avatar = m.image || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200";

              return (
                <div key={m.id} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-sky-500">
                        <Image src={avatar} alt={name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 font-heading">
                          <span>{name}</span>
                          <ShieldCheck className="h-4 w-4 text-sky-500" />
                        </h3>
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{m.headline || m.companyOrUniversity || "Faculty Advisor"}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(m.expertise || []).slice(0, 3).map((exp, i) => (
                            <span key={i} className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {m.meetingLink ? (
                        <a
                          href={m.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-white px-3.5 py-2 text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Join Office Hours</span>
                        </a>
                      ) : null}

                      <button
                        onClick={() => handleOpenRequest(m)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 text-white px-3.5 py-2 text-xs font-bold hover:bg-sky-600 transition-colors shadow-sm"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Request Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mentorship Request Dialog */}
        {requestMentor && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-extrabold text-base text-foreground font-heading">
                  Request Mentorship Session
                </h3>
                <button onClick={() => setRequestMentor(null)} className="text-muted-foreground hover:text-foreground text-xs font-bold">✕</button>
              </div>

              <p className="text-xs text-muted-foreground">
                Mentor: <strong className="text-foreground">{requestMentor.fullName || requestMentor.name}</strong>
              </p>

              {requestError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                  {requestError}
                </div>
              )}

              {requestSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Session request queued! Mentor notified.</span>
                </div>
              )}

              <form onSubmit={handleSendRequest} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Code review on Dijkstra graph traversal"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">Description & Topic Details</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe specific questions or difficulties you would like help with..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRequestMentor(null)}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold hover:bg-muted/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || requestSuccess}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 disabled:opacity-50"
                  >
                    {submitting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Calendar className="h-3.5 w-3.5" />}
                    <span>Submit Request</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
