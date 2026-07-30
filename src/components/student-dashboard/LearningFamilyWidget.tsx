"use client";

import { useState } from "react";
import { Users, UserCheck, MessageSquare, FileText, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

export function LearningFamilyWidget() {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const familyData = {
    name: "Turing Guild #04 — Systems & AI Cohort",
    mentor: {
      name: "Dr. Sarah Chen",
      role: "Senior CS Mentor & PhD Candidate",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    assistantMentor: {
      name: "Marcus Vance",
      role: "Assistant TA & Senior CS Student",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    weeklyMeeting: "Thursdays @ 5:00 PM - 6:30 PM (Zoom)",
    attendanceRate: "98% Attendance",
    notesCount: 14,
    members: [
      { name: "Labib (You)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
      { name: "Tariq Hasan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
      { name: "Ayesha Malik", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
      { name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
      { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            <span>My Learning Family</span>
          </h2>
          <p className="text-xs text-muted-foreground">Your dedicated near-peer study group guided by senior mentors.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
        
        {/* Family Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-md">
              Assigned Learning Family
            </span>
            <h3 className="text-lg font-extrabold text-foreground font-heading mt-1">{familyData.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChatModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white border border-sky-500/20 px-3.5 py-2 text-xs font-bold transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Group Chat</span>
            </button>

            <button
              onClick={() => setShowNotesModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500 text-purple-600 dark:text-purple-300 hover:text-white border border-purple-500/20 px-3.5 py-2 text-xs font-bold transition-all"
            >
              <FileText className="h-4 w-4" />
              <span>Shared Notes ({familyData.notesCount})</span>
            </button>
          </div>
        </div>

        {/* Mentors & Members Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Senior Mentor */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500">
              <Image src={familyData.mentor.avatar} alt={familyData.mentor.name} fill className="object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-500 uppercase block">Senior Mentor</span>
              <p className="font-bold text-sm text-foreground">{familyData.mentor.name}</p>
              <p className="text-[11px] text-muted-foreground">{familyData.mentor.role}</p>
            </div>
          </div>

          {/* Assistant Mentor */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 ring-2 ring-sky-500">
              <Image src={familyData.assistantMentor.avatar} alt={familyData.assistantMentor.name} fill className="object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-500 uppercase block">Assistant Mentor</span>
              <p className="font-bold text-sm text-foreground">{familyData.assistantMentor.name}</p>
              <p className="text-[11px] text-muted-foreground">{familyData.assistantMentor.role}</p>
            </div>
          </div>

          {/* Family Members Stack */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Cohort Members ({familyData.members.length})</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {familyData.members.map((m, idx) => (
                  <div key={idx} className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-background">
                    <Image src={m.avatar} alt={m.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-foreground">100% Active</span>
            </div>
          </div>

        </div>

        {/* Weekly Meeting & Attendance Tracker */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-sky-500 shrink-0" />
            <div>
              <span className="font-bold text-foreground block">Next PASS Group Meeting:</span>
              <span className="text-muted-foreground">{familyData.weeklyMeeting}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
              ✓ {familyData.attendanceRate}
            </span>
          </div>
        </div>

      </div>

      {/* Shared Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Learning Family Shared Notes</h3>
              <button onClick={() => setShowNotesModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
              {[
                { title: "RAG Pipeline Architecture Diagram", author: "Dr. Sarah Chen", date: "Jul 26" },
                { title: "Dijkstra vs A* Algorithm Comparison", author: "Labib", date: "Jul 24" },
                { title: "Operating System Deadlock Prevention Cheatsheet", author: "Marcus Vance", date: "Jul 20" },
              ].map((n, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground text-xs">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground">Added by {n.author} • {n.date}</span>
                  </div>
                  <button className="text-sky-500 font-bold hover:underline text-xs">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Group Chat Drawer Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-bold text-lg text-foreground">Family Group Chat</h3>
              <button onClick={() => setShowChatModal(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto text-xs p-2 bg-muted/40 rounded-xl">
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="font-bold text-indigo-500 text-[10px]">Dr. Sarah Chen</span>
                <p className="text-foreground">Don&apos;t forget to bring your AST code samples to Thursday&apos;s PASS session!</p>
              </div>
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-right">
                <span className="font-bold text-sky-600 dark:text-sky-400 text-[10px]">You</span>
                <p className="text-foreground">Sounds great! My FastAPI endpoint is ready for review.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 rounded-xl bg-muted border border-border px-3 py-2 text-xs" />
              <button onClick={() => setShowChatModal(false)} className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-bold text-white">Send</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
