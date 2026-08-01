"use client";

import { useState } from "react";
import { CalendarOfficeHoursService } from "@/services/mentor/CalendarOfficeHoursService";
import { OfficeHourSession } from "@/types/success";
import { Calendar, Plus, Clock, MapPin, Users, CheckCircle2, X } from "lucide-react";

export function CalendarOfficeHoursWidget() {
  const [sessions, setSessions] = useState<OfficeHourSession[]>(CalendarOfficeHoursService.getSessions());
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dateTime || !location) return;

    CalendarOfficeHoursService.createSession(title, dateTime, location, 5);
    setSessions([...CalendarOfficeHoursService.getSessions()]);
    setShowModal(false);
    setTitle("");
    setDateTime("");
    setLocation("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Calendar className="h-6 w-6 text-purple-500" />
            <span>Calendar & Office Hours Scheduler</span>
          </h2>
          <p className="text-xs text-muted-foreground">Schedule 1-on-1 tutoring sessions, project reviews, and assignment walkthroughs.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Office Hours</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">Office Hours Session</span>
                <h3 className="font-extrabold text-base text-foreground font-heading">{session.title}</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {session.bookedStudentsCount} / {session.maxStudents} Booked
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                <span className="font-bold text-foreground">{session.dateTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-sky-500" />
                <span>{session.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <h3 className="font-extrabold text-base text-foreground font-heading">Schedule Office Hours</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-xl text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">Session Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. 1-on-1 PASS Tutoring" className="w-full rounded-xl bg-muted/40 border border-border p-2.5 text-xs" />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Date & Time</label>
                <input type="text" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required placeholder="e.g. Thursday, Aug 6 @ 4:30 PM" className="w-full rounded-xl bg-muted/40 border border-border p-2.5 text-xs" />
              </div>
              <div>
                <label className="font-bold text-foreground block mb-1">Location / Link</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. Lab 304 / Google Meet" className="w-full rounded-xl bg-muted/40 border border-border p-2.5 text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-muted text-foreground font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-extrabold">Schedule Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
