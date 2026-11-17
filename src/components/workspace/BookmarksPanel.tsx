"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark as BookmarkIcon, Trash2, Clock, X, Loader2 } from "lucide-react";
import { Bookmark } from "@/types/workspace";

interface BookmarksPanelProps {
  userId: string;
  lessonId: string;
  onClose: () => void;
}

export function BookmarksPanel({ userId, lessonId, onClose }: BookmarksPanelProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspace/bookmarks?lessonId=${encodeURIComponent(lessonId)}`);
      if (!res.ok) throw new Error("Failed to load bookmarks");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookmarks(json.data);
      }
    } catch {
      setError("Unable to load bookmarks.");
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/workspace/bookmarks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      } else {
        setError("Failed to remove bookmark.");
      }
    } catch {
      setError("Failed to remove bookmark.");
    }
  };

  return (
    <div className="w-full lg:w-80 shrink-0 border-l border-border/60 bg-card p-4 space-y-4 h-full flex flex-col justify-between shadow-2xl">
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="h-4.5 w-4.5 text-sky-500" />
            <h3 className="font-extrabold text-sm text-foreground">Lesson Bookmarks</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
              <p className="text-xs">Loading bookmarks...</p>
            </div>
          ) : bookmarks.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No bookmarks added.</p>
          ) : (
            bookmarks.map((bm) => (
              <div key={bm.id} className="p-3.5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-xs text-foreground leading-snug">{bm.title}</h4>
                  <button onClick={() => handleRemove(bm.id)} className="text-muted-foreground hover:text-red-500 p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {bm.timestampSeconds && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3" /> Timestamp @ {Math.floor(bm.timestampSeconds / 60)}:{(bm.timestampSeconds % 60).toString().padStart(2, "0")}
                  </span>
                )}

                {bm.codeSnippet && (
                  <pre className="p-2 rounded-xl bg-slate-950 text-slate-200 font-mono text-[10px] overflow-x-auto border border-slate-800">
                    {bm.codeSnippet}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
