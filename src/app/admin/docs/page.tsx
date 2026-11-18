"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-dashboard/AdminLayout";
import {
  Presentation,
  Calendar,
  Clock,
  Shield,
  Users,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Globe,
  Lock,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { DocsSettings, DocsOverrideMode, TeamMember } from "@/types/docs";

export default function AdminDocsPage() {
  const [settings, setSettings] = useState<DocsSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [overrideMode, setOverrideMode] = useState<DocsOverrideMode>("force_public");
  const [startDate, setStartDate] = useState<string>("2026-06-10T00:00");
  const [endDate, setEndDate] = useState<string>("2026-06-14T23:59");
  const [noticeMessage, setNoticeMessage] = useState<string>("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // New member form
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: "",
    role: "",
    email: "",
    avatarUrl: "",
    affiliation: "",
    bio: "",
  });
  const [showAddMember, setShowAddMember] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/docs/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
          setOverrideMode(data.settings.schedule.overrideMode);
          setStartDate(data.settings.schedule.startDate?.slice(0, 16) || "2026-06-10T00:00");
          setEndDate(data.settings.schedule.endDate?.slice(0, 16) || "2026-06-14T23:59");
          setNoticeMessage(data.settings.customNoticeMessage || "");
          setTeamMembers(data.settings.teamMembers || []);
        }
      }
    } catch (e) {
      console.error(e);
      setFeedback({ type: "error", message: "Failed to load docs settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setFeedback(null);

      const payload = {
        schedule: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          overrideMode,
        },
        customNoticeMessage: noticeMessage,
        teamMembers,
      };

      const res = await fetch("/api/admin/docs/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFeedback({ type: "success", message: "Docs visibility and showcase settings saved successfully!" });
        await fetchSettings();
      } else {
        const err = await res.json().catch(() => null);
        setFeedback({ type: "error", message: err?.error || "Failed to update docs settings." });
      }
    } catch (e) {
      console.error(e);
      setFeedback({ type: "error", message: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setOverrideMode("force_public");
    setStartDate("2026-06-10T00:00");
    setEndDate("2026-06-14T23:59");
    setNoticeMessage(
      "The QbitX Showcase and Pitch Deck portal is scheduled for the official judging window from June 10 (00:00 UTC) to June 14 (23:59 UTC), 2026. Authorized judges and administrators may sign in below."
    );
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      alert("Name, role, and email are required for team members.");
      return;
    }

    const member: TeamMember = {
      id: `team-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      avatarUrl: newMember.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      affiliation: newMember.affiliation || "QbitX Core Labs",
      bio: newMember.bio || "",
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({ name: "", role: "", email: "", avatarUrl: "", affiliation: "", bio: "" });
    setShowAddMember(false);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleUpdateMemberField = (id: string, field: keyof TeamMember, val: string) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header Title Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold font-mono uppercase">
              <Presentation className="h-3.5 w-3.5" />
              <span>Showcase Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
              Pitch Deck & Docs Management
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Admin controls for `/docs` public visibility scheduling, judging window limits, and team showcase profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/docs"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold transition-all"
            >
              <span>View Live /docs</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Publish Settings</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center gap-2 font-medium animate-in fade-in ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {feedback.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Section 1: Visibility & Scheduling */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                <Calendar className="h-5 w-5 text-sky-500" />
                <span>Access Control & Window Scheduling</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set exact start and end timestamps or trigger instant override modes for judging and showcases.
              </p>
            </div>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Default (June 10-14)</span>
            </button>
          </div>

          {/* Visibility Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Publication Mode Override
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  overrideMode === "force_public"
                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : "border-border/60 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Globe className="h-4 w-4 text-emerald-500" />
                    <span>Force Public</span>
                  </div>
                  <input
                    type="radio"
                    name="overrideMode"
                    value="force_public"
                    checked={overrideMode === "force_public"}
                    onChange={() => setOverrideMode("force_public")}
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Available publicly right now to anyone with the URL, bypassing date limits.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  overrideMode === "auto"
                    ? "border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/30"
                    : "border-border/60 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Clock className="h-4 w-4 text-sky-500" />
                    <span>Auto Schedule</span>
                  </div>
                  <input
                    type="radio"
                    name="overrideMode"
                    value="auto"
                    checked={overrideMode === "auto"}
                    onChange={() => setOverrideMode("auto")}
                    className="accent-sky-500"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Strictly available between Start and End dates below. Shows preview gate outside window.
                </p>
              </label>

              <label
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  overrideMode === "force_private"
                    ? "border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/30"
                    : "border-border/60 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                    <Lock className="h-4 w-4 text-rose-500" />
                    <span>Force Private</span>
                  </div>
                  <input
                    type="radio"
                    name="overrideMode"
                    value="force_private"
                    checked={overrideMode === "force_private"}
                    onChange={() => setOverrideMode("force_private")}
                    className="accent-rose-500"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Locked for all visitors. Only authenticated Admin and Super Admin accounts can view.
                </p>
              </label>
            </div>
          </div>

          {/* Date & Time Range Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-500" />
                <span>Showcase Window Start Time (UTC)</span>
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[10px] text-muted-foreground">Default: June 10, 2026, 00:00:00 UTC</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-500" />
                <span>Showcase Window End Time (UTC)</span>
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
              <p className="text-[10px] text-muted-foreground">Default: June 14, 2026, 23:59:59 UTC</p>
            </div>
          </div>

          {/* Custom Restricted Notice Message */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-foreground">
              Locked Window Visitor Notice
            </label>
            <textarea
              rows={3}
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              placeholder="Notice presented to unauthorized visitors before or after the showcase window..."
              className="w-full p-3.5 rounded-xl bg-muted/40 border border-border text-foreground text-xs leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Section 2: Team Showcase Management */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                <span>Team Showcase Roster</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Displayed on the YC Pitch Deck slide with uniform aspect ratio, verified email badges, and affiliations.
              </p>
            </div>

            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-sky-500 text-white hover:bg-sky-400 transition-all shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Add New Member Drawer/Form */}
          {showAddMember && (
            <div className="p-5 rounded-2xl bg-muted/30 border border-sky-500/30 space-y-4 animate-in fade-in duration-200">
              <h3 className="text-xs font-bold text-sky-400 font-heading uppercase tracking-wide">
                New Team Member Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Labib Ul Hasan)"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Role (e.g. Lead Full-Stack Architect)"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Avatar Image URL (Auto-cropped to 1:1)"
                  value={newMember.avatarUrl}
                  onChange={(e) => setNewMember({ ...newMember, avatarUrl: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Affiliation (e.g. BUET / QbitX Labs)"
                  value={newMember.affiliation}
                  onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Short Bio / Background"
                  value={newMember.bio}
                  onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-card border border-border text-xs text-foreground focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Add
                </button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-muted/20 border border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-border shrink-0 bg-muted">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs bg-sky-500 text-white">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleUpdateMemberField(member.id, "name", e.target.value)}
                      className="font-bold text-sm text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-sky-500 px-1 py-0.5 rounded"
                    />
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => handleUpdateMemberField(member.id, "role", e.target.value)}
                        className="text-sky-600 dark:text-sky-400 font-medium bg-transparent border-b border-transparent hover:border-border focus:border-sky-500 px-1 py-0.5 rounded text-xs"
                      />
                      <span>•</span>
                      <input
                        type="text"
                        value={member.email}
                        onChange={(e) => handleUpdateMemberField(member.id, "email", e.target.value)}
                        className="text-muted-foreground bg-transparent border-b border-transparent hover:border-border focus:border-sky-500 px-1 py-0.5 rounded text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    title="Remove Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
