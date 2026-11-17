"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { UserCheck, CheckCircle2, Clock, RefreshCw, AlertTriangle, ShieldOff } from "lucide-react";

interface MentorRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  headline: string | null;
  company: string | null;
  expertise: string[] | null;
  yearsOfExperience: number | null;
  isApproved: boolean;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200";

export function MentorApprovalWidget() {
  const [mentors, setMentors] = useState<MentorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadMentors = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/admin/mentors", { cache: "no-store" });

      if (res.status === 401 || res.status === 403) {
        setError("Administrator authorization required to review mentor applications.");
        setMentors([]);
        return;
      }
      if (!res.ok) {
        throw new Error(`Failed to load mentor applications (${res.status})`);
      }

      const json = await res.json();
      setMentors(Array.isArray(json?.data) ? json.data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load mentor applications.");
      setMentors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMentors();
  }, [loadMentors]);

  const handleDecision = async (mentor: MentorRecord, isApproved: boolean) => {
    setPendingId(mentor.id);
    setError("");

    try {
      const res = await fetch("/api/admin/mentors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: mentor.id, isApproved }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ||
            `Failed to ${isApproved ? "approve" : "revoke"} this mentor (${res.status})`
        );
      }

      // Re-read from the server so the list reflects the persisted state.
      await loadMentors();
    } catch (err: any) {
      setError(err.message || "Failed to update mentor application.");
    } finally {
      setPendingId(null);
    }
  };

  const pendingCount = mentors.filter((mentor) => !mentor.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-amber-500" />
            <span>Senior Mentor Application Approvals & Workload</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Review mentor applications, approve portal access, and monitor teaching workload.
          </p>
        </div>

        <span className="text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-500/20 shrink-0">
          {pendingCount} Applications Pending
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => {
              setIsLoading(true);
              loadMentors();
            }}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1 font-bold hover:bg-red-500/10"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 rounded-3xl border border-border bg-card p-10 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
          Loading Mentor Applications...
        </div>
      ) : mentors.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center text-xs text-muted-foreground">
          No mentor applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={mentor.image || FALLBACK_AVATAR}
                  alt={mentor.name}
                  width={48}
                  height={48}
                  className="rounded-2xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-foreground font-heading">
                    {mentor.name}
                    {mentor.isApproved ? (
                      <span className="ml-2 text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Approved
                      </span>
                    ) : (
                      <span className="ml-2 text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {mentor.email}
                    {mentor.headline ? ` • ${mentor.headline}` : ""}
                    {mentor.company ? ` • ${mentor.company}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(mentor.expertise || []).map((exp, i) => (
                      <span
                        key={`${mentor.id}-exp-${i}`}
                        className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md text-foreground"
                      >
                        {exp}
                      </span>
                    ))}
                    {typeof mentor.yearsOfExperience === "number" && (
                      <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {mentor.yearsOfExperience} yrs experience
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {mentor.isApproved ? (
                <button
                  onClick={() => handleDecision(mentor, false)}
                  disabled={pendingId === mentor.id}
                  className="px-5 py-2.5 rounded-xl border border-border bg-muted hover:bg-muted/80 text-foreground text-xs font-extrabold flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {pendingId === mentor.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldOff className="h-4 w-4" />
                  )}
                  Revoke Mentor Access
                </button>
              ) : (
                <button
                  onClick={() => handleDecision(mentor, true)}
                  disabled={pendingId === mentor.id}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                >
                  {pendingId === mentor.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Approve & Grant Mentor Access
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
