"use client";

import { useState, useEffect } from "react";
import { Bookmark as BookmarkIcon, Trash2, Clock, Code2, ExternalLink, X } from "lucide-react";
import { Bookmark } from "@/types/workspace";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

interface BookmarksPanelProps {
  userId: string;
  lessonId: string;
  onClose: () => void;
}

export function BookmarksPanel({ userId, lessonId, onClose }: BookmarksPanelProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(WorkspaceService.getBookmarks(userId, lessonId));
  }, [userId, lessonId]);

  const handleRemove = (id: string) => {
    WorkspaceService.removeBookmark(id, userId);
    setBookmarks(bookmarks.filter((b) => b.id !== id));
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

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {bookmarks.length === 0 ? (
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
                    <Clock className="h-3 w-3" /> Timestamp @ 5:20
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
