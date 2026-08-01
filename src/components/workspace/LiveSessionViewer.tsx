"use client";

import { Radio, Calendar, Users, ExternalLink, Sparkles } from "lucide-react";

interface LiveSessionViewerProps {
  title: string;
  startTime?: string;
  streamUrl?: string;
}

export function LiveSessionViewer({
  title,
  startTime = "Today @ 4:00 PM EST",
  streamUrl = "https://youtube.com/live/qbitx-session-demo",
}: LiveSessionViewerProps) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="rounded-3xl border border-red-500/30 bg-card p-6 sm:p-8 space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            <Radio className="h-3.5 w-3.5 animate-pulse text-red-500" />
            <span>Interactive Live Mentor Session</span>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-sky-500" />
            {startTime}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">{title}</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Join Dr. Sarah Chen for live code reviews, architecture Q&A, and real-time debugging assistance.
        </p>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Users className="h-4 w-4 text-sky-500" />
            <span>42 Students Waiting</span>
          </div>
          <a
            href={streamUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-extrabold shadow-md shadow-red-500/20 transition-all text-xs"
          >
            <span>Join Live Stream</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
