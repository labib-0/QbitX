"use client";

import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { User, Mail, Building2, GraduationCap, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export function ProfileWidget() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "Labib",
    email: user?.email || "student@qbitx.com",
    university: "Stanford University",
    department: "Computer Science & Engineering",
    academicYear: "Senior (4th Year)",
    bio: "Passionate full-stack developer focusing on RAG pipelines, distributed systems, and modern Next.js SaaS platforms.",
    github: "github.com/labib-dev",
    linkedin: "linkedin.com/in/labib-dev",
    portfolio: "https://labib.dev",
    skills: "Next.js 16, TypeScript, Python, FastAPI, Go, Docker, PostgreSQL",
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClasses = "w-full rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 focus:outline-none";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <User className="h-5 w-5 text-sky-500" />
            <span>Student Profile & Settings</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage your public QbitX student profile, social links, and university records.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
          <div className="relative h-20 w-20 rounded-full ring-4 ring-sky-500/30 overflow-hidden shrink-0">
            <Image
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-xl text-foreground font-heading">{profile.name}</h3>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{profile.university} • {profile.department}</p>
            <span className="inline-block text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
              Level 12 Verified Student
            </span>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Profile details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">University</label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">Bio / Engineering Focus</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">GitHub</label>
              <input
                type="text"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">LinkedIn</label>
              <input
                type="text"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Portfolio Website</label>
              <input
                type="text"
                value={profile.portfolio}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition-colors shadow-md shadow-sky-500/20"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
