"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Sparkles,
  Zap,
} from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onBookmarkTimestamp?: (timestampSeconds: number) => void;
  onCompleteLesson?: () => void;
}

export function VideoPlayer({
  videoUrl = "https://www.youtube.com/embed/kqtD5dpn9C8",
  title,
  lessonId,
  courseId,
  userId,
  onBookmarkTimestamp,
  onCompleteLesson,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(145); // Simulated playback timestamp
  const duration = 900; // 15 mins total
  const [completed, setCompleted] = useState(false);

  const watchPercentage = Math.min(100, Math.round((currentTime / duration) * 100));

  useEffect(() => {
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "video_played",
      payload: { timestamp: currentTime, speed: playbackSpeed },
    });
  }, [lessonId, courseId, userId]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: isPlaying ? "video_paused" : "video_played",
      payload: { timestamp: currentTime },
    });
  };

  const handleBookmark = () => {
    if (onBookmarkTimestamp) {
      onBookmarkTimestamp(currentTime);
    }
  };

  const handleMarkFinished = () => {
    setCompleted(true);
    if (onCompleteLesson) onCompleteLesson();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group">
        <iframe
          src={`${videoUrl}?autoplay=0&enablejsapi=1`}
          title={title}
          className="h-full w-full object-cover"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Video Overlay Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 sm:p-6 space-y-3 opacity-95 group-hover:opacity-100 transition-opacity">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <span className="text-sky-400 font-bold">{watchPercentage}% Watched</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 cursor-pointer overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${watchPercentage}%` }}
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-3 text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              {/* Playback Speed selector */}
              <div className="flex items-center gap-1 bg-white/10 rounded-xl px-2 py-1">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      playbackSpeed === s ? "bg-sky-500 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBookmark}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 transition-colors font-bold text-[11px]"
                title="Bookmark Timestamp"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Bookmark @ {formatTime(currentTime)}</span>
              </button>

              <button
                onClick={handleMarkFinished}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                  completed
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{completed ? "Completed!" : "Complete & Next"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters / Markers */}
      <div className="p-4 rounded-2xl border border-border bg-card space-y-2 text-xs">
        <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
          Video Chapter Markers
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { title: "1. Python Installation & Virtual Environments", time: "0:00", secs: 0 },
            { title: "2. Primitive Data Types & Mutability", time: "2:25", secs: 145 },
            { title: "3. Memory Allocation & Scope Rules", time: "8:10", secs: 490 },
          ].map((chap, i) => (
            <button
              key={i}
              onClick={() => setCurrentTime(chap.secs)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border/50 text-left transition-colors font-medium"
            >
              <span className="truncate pr-2 text-foreground font-bold">{chap.title}</span>
              <span className="font-mono text-sky-500 shrink-0">{chap.time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
