"use client";

import React, { useState } from "react";
import { Play, AlertCircle, ExternalLink, VideoOff, CheckCircle } from "lucide-react";

interface YouTubeVideoPlayerProps {
  videoId?: string | null;
  title: string;
  onComplete?: () => void;
  isCompleted?: boolean;
}

/**
 * Extracts a clean 11-character YouTube video ID from various URL formats
 */
export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already clean 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );

  return match ? match[1] : null;
}

export function YouTubeVideoPlayer({
  videoId,
  title,
  onComplete,
  isCompleted = false,
}: YouTubeVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const cleanId = extractYouTubeId(videoId);

  if (!cleanId || hasError) {
    return (
      <div className="w-full aspect-video rounded-2xl bg-slate-900 border border-border flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-4">
        <div className="p-3 rounded-full bg-slate-800 text-amber-400">
          <VideoOff className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-heading">Video Currently Unavailable</h3>
          <p className="text-xs text-slate-400 max-w-md">
            This lecture video reference is either missing or embedding is restricted. Please refer to the written lesson notes below.
          </p>
        </div>
        {cleanId && (
          <a
            href={`https://www.youtube.com/watch?v=${cleanId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 transition-colors"
          >
            <span>Watch Directly on YouTube</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Privacy-enhanced YouTube Embed */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-border/50">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${cleanId}?rel=0&modestbranding=1&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
          onError={() => setHasError(true)}
        />
      </div>

      {/* Lesson Complete Action Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border text-xs">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <CheckCircle className="h-4 w-4" />
              <span>Lesson Completed</span>
            </span>
          ) : (
            <span className="text-muted-foreground font-medium">
              Study the video lecture and review the notes below.
            </span>
          )}
        </div>

        {onComplete && !isCompleted && (
          <button
            onClick={onComplete}
            className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold transition-all shadow-md shadow-sky-500/20 font-heading"
          >
            Mark Complete & Continue
          </button>
        )}
      </div>
    </div>
  );
}
