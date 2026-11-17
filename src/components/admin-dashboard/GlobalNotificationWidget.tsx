"use client";

import { useState } from "react";
import { Megaphone, Send, CheckCircle2, Loader2 } from "lucide-react";

export function GlobalNotificationWidget() {
  const [broadcastTitle, setBroadcastTitle] = useState("Platform Announcement");
  const [broadcastText, setBroadcastText] = useState("");
  const [audience, setAudience] = useState<"all" | "students" | "mentors">("all");
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "alert">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle.trim() || "Platform Announcement",
          message: broadcastText.trim(),
          audience,
          type: notificationType,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to dispatch broadcast");
      }

      const json = await res.json();
      setSuccessMessage(json.message || "Global broadcast dispatched successfully!");
      setBroadcastText("");
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || "Could not dispatch broadcast.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-amber-500" />
          <span>Global Broadcast & Notification Center</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          Dispatch platform announcements, maintenance notices, and emergency alerts to target audiences.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Target Audience</label>
              <select
                value={audience}
                disabled={isSubmitting}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full rounded-xl bg-muted/40 border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="all">Entire Platform (Students & Mentors)</option>
                <option value="students">Students Only</option>
                <option value="mentors">Senior Mentors Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Notification Priority</label>
              <select
                value={notificationType}
                disabled={isSubmitting}
                onChange={(e) => setNotificationType(e.target.value as any)}
                className="w-full rounded-xl bg-muted/40 border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
              >
                <option value="info">Info / General Update</option>
                <option value="warning">Warning / Action Required</option>
                <option value="alert">Alert / Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Announcement Title</label>
            <input
              type="text"
              value={broadcastTitle}
              disabled={isSubmitting}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="e.g. Scheduled Maintenance Notice"
              className="w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Announcement Message Body</label>
            <textarea
              rows={4}
              value={broadcastText}
              disabled={isSubmitting}
              onChange={(e) => setBroadcastText(e.target.value)}
              placeholder="Write global broadcast notification message..."
              required
              className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!broadcastText.trim() || isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 flex items-center gap-1.5 disabled:opacity-40"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              <span>Dispatch Platform Broadcast</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
