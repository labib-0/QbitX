"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { User, Mail, Building2, GraduationCap, Globe, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Save } from "lucide-react";
import Image from "next/image";

export function ProfileWidget() {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    university: "",
    department: "",
    academicYear: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: "",
    xp: 0,
    level: 1,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/student/profile");
        const json = await res.json();

        if (res.ok && json.success) {
          const u = json.data?.user || user;
          const p = json.data?.profile || {};

          setProfile({
            name: u?.name || "Jeifer Gomes",
            email: u?.email || "jeifer.gomes@qbitx.com",
            university: p.university || "Notre Dame University Bangladesh (NDUB)",
            department: p.department || "Computer Science & Engineering",
            academicYear: p.academicYear || "3rd Year",
            bio: p.bio || "3rd-year CSE undergraduate at Notre Dame University Bangladesh (NDUB). Specializing in Full-Stack Web & AI Engineering, cloud microservices, and distributed systems.",
            github: p.githubUrl || "https://github.com/jeifer-gomes",
            linkedin: p.linkedinUrl || "https://linkedin.com/in/jeifer-gomes",
            portfolio: p.portfolioUrl || "https://jeifer-gomes.dev",
            skills: Array.isArray(p.skills) ? p.skills.join(", ") : (p.skills || "TypeScript, Next.js, Python, PostgreSQL, Google Gemini, Docker"),
            xp: p.xp || 6450,
            level: p.level || 14,
          });
        }
      } catch (err: any) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile details from server.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSavedSuccess(false);

      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name.trim(),
          university: profile.university.trim(),
          department: profile.department.trim(),
          academicYear: profile.academicYear.trim(),
          bio: profile.bio.trim(),
          githubUrl: profile.github.trim(),
          linkedinUrl: profile.linkedin.trim(),
          portfolioUrl: profile.portfolio.trim(),
          skills: profile.skills,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save profile changes.");
      }

      if (profile.name.trim() !== user?.name) {
        updateUser({ name: profile.name.trim() });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "w-full rounded-xl bg-muted/40 border border-border px-4 py-2.5 text-xs font-medium text-foreground placeholder-muted-foreground focus:border-sky-500 focus:outline-none transition-colors";

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
        <RefreshCw className="h-5 w-5 animate-spin text-sky-500" />
        <span>Loading Student Profile...</span>
      </div>
    );
  }

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
              alt={profile.name || "Student"}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-extrabold text-xl text-foreground font-heading">{profile.name || "Student"}</h3>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
              {profile.university || "University"} • {profile.department || "Engineering"}
            </p>
            <span className="inline-block text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
              Level {profile.level} • {profile.xp} XP
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile details saved successfully to database!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Full Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className={`${inputClasses} opacity-60 cursor-not-allowed`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">University / Institution</label>
              <input
                type="text"
                placeholder="e.g. Daffodil International University"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Department / Major</label>
              <input
                type="text"
                placeholder="e.g. Software Engineering"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">Academic Year / Semester</label>
            <input
              type="text"
              placeholder="e.g. 2nd Year (Semester 4)"
              value={profile.academicYear}
              onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">Student Biography</label>
            <textarea
              rows={3}
              placeholder="Tell mentors and recruiters about your engineering goals..."
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-muted-foreground">Portfolio Website</label>
              <input
                type="url"
                placeholder="https://yourportfolio.dev"
                value={profile.portfolio}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-muted-foreground">Core Skills (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Next.js, TypeScript, PostgreSQL, Python, Docker"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
