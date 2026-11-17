"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Clock, Sparkles, X, Loader2 } from "lucide-react";
import { StudentNote } from "@/types/workspace";

interface NotesPanelProps {
  userId: string;
  courseId: string;
  lessonId: string;
  onClose: () => void;
}

export function NotesPanel({ userId, courseId, lessonId, onClose }: NotesPanelProps) {
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/workspace/notes?lessonId=${encodeURIComponent(lessonId)}`);
      if (!res.ok) throw new Error("Failed to load notes");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNotes(json.data);
      }
    } catch (err: any) {
      setError("Unable to load notes at this time.");
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/workspace/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          title: newTitle.trim(),
          content: newContent.trim(),
          tags: ["student-note"],
          isPinned: false,
          isShared: false,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save note");
      }

      const json = await res.json();
      if (json.success && json.data) {
        setNotes((prev) => [json.data, ...prev]);
        setNewTitle("");
        setNewContent("");
        setShowAddForm(false);
      }
    } catch (err: any) {
      setError(err.message || "Could not save note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/workspace/notes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete note.");
      }
    } catch {
      setError("Failed to delete note.");
    }
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full lg:w-96 shrink-0 border-l border-border/60 bg-card p-4 space-y-4 h-full flex flex-col justify-between shadow-2xl">
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-sky-500" />
            <h3 className="font-extrabold text-sm text-foreground">Private Student Notes</h3>
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

        {/* Search & Add Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-xl bg-muted/40 border border-border pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20 text-xs font-bold shrink-0"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <form onSubmit={handleAddNote} className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 shrink-0 animate-in fade-in duration-150">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Note title..."
              required
              disabled={isSaving}
              className="w-full rounded-xl bg-background border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
            />
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your note (supports Markdown)..."
              required
              disabled={isSaving}
              className="w-full rounded-xl bg-background border border-border p-3 text-xs text-foreground focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 text-white hover:bg-sky-600 flex items-center gap-1.5"
              >
                {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                Save Note
              </button>
            </div>
          </form>
        )}

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-sky-500" />
              <p className="text-xs">Loading notes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No notes saved yet.</p>
          ) : (
            filtered.map((note) => (
              <div key={note.id} className="p-3.5 rounded-2xl border border-border bg-card space-y-2 hover:border-sky-500/30 transition-colors shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-xs text-foreground leading-snug">{note.title}</h4>
                  <button onClick={() => handleDelete(note.id)} className="text-muted-foreground hover:text-red-500 p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{note.content}</p>
                {note.timestampSeconds && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3" /> @ {Math.floor(note.timestampSeconds / 60)}:{(note.timestampSeconds % 60).toString().padStart(2, "0")}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
