"use client";

import { ContentRetrievalService } from "@/services/content/ContentRetrievalService";
import { GitBranch, Layers, ArrowRight, BookOpen } from "lucide-react";

export function TrackManager() {
  const tracks = ContentRetrievalService.getTracks("mentor");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-purple-500" />
          <span>Learning Tracks & Prerequisite Path Manager</span>
        </h2>
        <p className="text-xs text-muted-foreground">Organize courses into structured learning paths with prerequisites and completion rules.</p>
      </div>

      <div className="space-y-4">
        {tracks.map((track) => (
          <div key={track.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">Learning Track Path</span>
              <h3 className="font-extrabold text-lg text-foreground font-heading">{track.metadata.title}</h3>
              <p className="text-xs text-muted-foreground">{track.metadata.description}</p>
            </div>

            {/* Prerequisite Path Visualizer */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {track.courseIds.map((cid, i) => (
                <div key={cid} className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border text-xs font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span>Course #{i + 1}: {cid}</span>
                  </div>
                  {i < track.courseIds.length - 1 && <ArrowRight className="h-4 w-4 text-purple-500" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
