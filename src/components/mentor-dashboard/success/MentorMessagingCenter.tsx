"use client";

import { useState } from "react";
import { MessageSquare, Send, Megaphone, Bell, CheckCircle2 } from "lucide-react";

export function MentorMessagingCenter() {
  const [announcementText, setAnnouncementText] = useState("");
  const [dispatched, setDispatched] = useState(false);

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setAnnouncementText("");
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-purple-500" />
          <span>Student Messaging & Group Announcements Center</span>
        </h2>
        <p className="text-xs text-muted-foreground">Broadcast course announcements, direct message students, and send assignment reminders.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-purple-500 font-extrabold text-xs">
          <Megaphone className="h-4 w-4" />
          <span>Broadcast Class Announcement</span>
        </div>

        <form onSubmit={handleSendAnnouncement} className="space-y-3">
          <textarea
            rows={4}
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            placeholder="Write class announcement (e.g. Reminder: Capstone Project Sprint 2 deliverables are due this Thursday)..."
            className="w-full rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          {dispatched ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Broadcast Announcement Dispatched to 142 Students!</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!announcementText.trim()}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Announcement</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
