"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, Clock, Calendar, Lock, ArrowRight, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";
import { DocsAccessStatus } from "@/types/docs";

interface DocsAccessRestrictedViewProps {
  status: DocsAccessStatus;
  onRefresh?: () => void;
}

export function DocsAccessRestrictedView({ status, onRefresh }: DocsAccessRestrictedViewProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!status.schedule?.startDate) return;
    const startDateStr = status.schedule.startDate;

    const calculateTimeLeft = () => {
      const targetTime = new Date(startDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [status.schedule?.startDate]);

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(new Date(isoDate));
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full mx-auto relative z-10 space-y-8 text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide uppercase">
          <Lock className="w-3.5 h-3.5" />
          <span>Restricted Showcase Window</span>
        </div>

        {/* Title & Reason */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-white">
            QbitX Showcase & Deck
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {status.customNotice || status.reason || "This documentation and pitch deck portal is temporarily scheduled for a private evaluation window."}
          </p>
        </div>

        {/* Schedule Info Box */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl text-left space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Official Showcase Window
              </div>
              <div className="text-sm font-medium text-slate-200">
                June 10 (00:00 UTC) – June 14 (23:59 UTC), 2026
              </div>
            </div>
          </div>

          {/* Real-time countdown if before start date */}
          {timeLeft && (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Unlocks in:</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xl font-bold text-sky-400">{timeLeft.days}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Days</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xl font-bold text-sky-400">{timeLeft.hours}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Hours</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xl font-bold text-sky-400">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Mins</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                  <div className="text-xl font-bold text-sky-400">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-slate-400 uppercase">Secs</div>
                </div>
              </div>
            </div>
          )}

          {/* Active Configured Bounds */}
          {status.schedule && (
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <div className="flex justify-between">
                <span>Configured Start:</span>
                <span className="font-mono text-slate-300">{formatDate(status.schedule.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Configured End:</span>
                <span className="font-mono text-slate-300">{formatDate(status.schedule.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Mode:</span>
                <span className="font-mono text-amber-400 capitalize">{status.schedule.overrideMode.replace("_", " ")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls for Judges / Admins */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95"
          >
            <KeyRound className="w-4 h-4" />
            <span>Judge / Admin Demo Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Check Access Again</span>
            </button>
          )}
        </div>

        {/* Feature Teasers */}
        <div className="pt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-white font-bold mb-0.5">YC Pitch Deck</div>
            <div className="text-[11px] text-slate-500">12 Investor Slides</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-white font-bold mb-0.5">Technical Specs</div>
            <div className="text-[11px] text-slate-500">Full System Arch</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-white font-bold mb-0.5">Live Data View</div>
            <div className="text-[11px] text-slate-500">PostgreSQL Metrics</div>
          </div>
        </div>
      </div>
    </div>
  );
}
