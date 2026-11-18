"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Settings, Globe, Lock, Clock, ChevronDown, ChevronUp, Loader2, Check } from "lucide-react";
import { DocsAccessStatus, DocsOverrideMode } from "@/types/docs";

interface AdminDocsControlBarProps {
  status: DocsAccessStatus;
  onStatusUpdated?: () => void;
}

export function AdminDocsControlBar({ status, onStatusUpdated }: AdminDocsControlBarProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!status.isAdmin) return null;

  const currentMode = status.schedule?.overrideMode || "force_public";

  const handleUpdateMode = async (newMode: DocsOverrideMode) => {
    try {
      setIsUpdating(true);
      const res = await fetch("/api/admin/docs/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule: {
            ...status.schedule,
            overrideMode: newMode,
          },
        }),
      });

      if (res.ok) {
        setFeedbackMsg(`Updated to ${newMode.replace("_", " ")}`);
        setTimeout(() => setFeedbackMsg(null), 3000);
        onStatusUpdated?.();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.error || "Failed to update docs access settings");
      }
    } catch (e) {
      console.error(e);
      alert("Network error updating docs status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <aside
      aria-label="Admin Visibility & Showcase Controls"
      className="sticky top-16 z-40 w-full bg-slate-900/95 border-b border-sky-500/30 text-white backdrop-blur-md shadow-lg transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Label */}
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-300 font-heading">
                  Admin Showcase Controls
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase ${
                    currentMode === "force_public"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : currentMode === "auto"
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {currentMode.replace("_", " ")}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Default: June 10 (00:00 UTC) – June 14 (23:59 UTC) | Logged in as Admin
              </p>
            </div>
          </div>

          {/* Quick Override Buttons & Full Panel Link */}
          <div className="flex items-center gap-2">
            {feedbackMsg && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
                <Check className="h-3.5 w-3.5" />
                {feedbackMsg}
              </span>
            )}

            <div className="inline-flex rounded-xl bg-slate-800 p-0.5 border border-slate-700">
              <button
                disabled={isUpdating}
                onClick={() => handleUpdateMode("force_public")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  currentMode === "force_public"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                title="Force Public: Anyone can see /docs right now"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden md:inline">Force Public</span>
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateMode("auto")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  currentMode === "auto"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                title="Auto Schedule: Only open during configured window (June 10-14)"
              >
                <Clock className="h-3 w-3" />
                <span className="hidden md:inline">Auto Schedule</span>
              </button>

              <button
                disabled={isUpdating}
                onClick={() => handleUpdateMode("force_private")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                  currentMode === "force_private"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                title="Force Private: Only Admins can see /docs"
              >
                <Lock className="h-3 w-3" />
                <span className="hidden md:inline">Lock Private</span>
              </button>
            </div>

            <Link
              href="/admin/docs"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Full Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
