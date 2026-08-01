"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  CheckCircle2,
  BookOpen,
  Award,
  Check,
  CheckCheck,
  Trophy,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { HelpDeskModal } from "./HelpDeskModal";
import { GuidedOnboardingTour } from "@/components/onboarding/GuidedOnboardingTour";
import { GlobalOmniboxSearch } from "@/components/search/GlobalOmniboxSearch";
import type { Notification, SearchResult } from "@/lib/dashboardData";

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenAIAssistant: () => void;
  onSelectTab: (tab: string) => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  course: BookOpen,
  assignment: CheckCircle2,
  certificate: Award,
  announcement: Bell,
};

export function TopNavbar({
  onToggleMobileSidebar,
  onOpenAIAssistant,
  onSelectTab,
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Search state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notifications state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // Profile menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpDeskModal, setShowHelpDeskModal] = useState(false);

  // Close dropdowns on outside click
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // ─── Load Notifications ───────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/student/notifications");
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch {
      // silently fail
    } finally {
      setNotifLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Keyboard shortcut: Ctrl+K / Cmd+K ───────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal(true);
      }
      if (e.key === "Escape") {
        setShowSearchModal(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (showSearchModal) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [showSearchModal]);

  // ─── Live Search ──────────────────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const debounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const json = await res.json();
        if (json.success) setSearchResults(json.data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // ─── Outside click handler ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Notification actions ─────────────────────────────────────────
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/student/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/student/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─── Logout ───────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    router.push("/login/student");
  };

  const avatarSrc =
    user?.avatarUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 w-full mx-auto">

          {/* Left: Mobile Menu Trigger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/student/dashboard" className="flex items-center gap-2">
              <Image
                src="/logo_transparent_low_res.png"
                alt="QbitX Logo"
                width={140}
                height={42}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Search trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-xs font-medium"
              title="Search (Ctrl+K)"
            >
              <Search className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-muted border border-border/60 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                          {unreadCount} Unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-[11px] font-semibold text-sky-500 hover:text-sky-600 transition-colors"
                        title="Mark all as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-border/30">
                    {notifLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-5 w-5 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-8">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${!n.read ? "bg-sky-500/3" : ""}`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${!n.read ? "bg-sky-500/15 text-sky-500" : "bg-muted text-muted-foreground"}`}>
                            <Bell className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-bold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{n.description}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="shrink-0 p-1 rounded-lg text-sky-500 hover:bg-sky-500/10 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {unreadCount === 0 && notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-border text-center">
                      <span className="text-[11px] text-muted-foreground">All caught up! ✓</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((v) => !v)}
                className="flex items-center gap-2 p-1 rounded-full ring-2 ring-sky-500/30 hover:ring-sky-500 transition-all"
                aria-label="Open profile menu"
              >
                <Image
                  src={avatarSrc}
                  alt={user?.name || "Student Avatar"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="p-3 border-b border-border space-y-0.5">
                    <p className="font-bold text-sm text-foreground truncate">{user?.name || "Student"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "student@qbitx.com"}</p>
                    <span className="inline-block text-[10px] font-bold bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-md mt-1">
                      Level 12 Student
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs font-medium mt-1">
                    <button
                      onClick={() => { onSelectTab("Profile"); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors font-bold"
                    >
                      <User className="h-4 w-4 text-sky-500" />
                      <span>Customize Profile</span>
                    </button>

                    <button
                      onClick={() => { onSelectTab("Settings"); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors"
                    >
                      <Settings className="h-4 w-4 text-purple-500" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => { onSelectTab("Achievements"); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted text-foreground transition-colors"
                    >
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span>Achievements</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-border mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-500 text-xs font-bold transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Help Desk Modal */}
      <HelpDeskModal isOpen={showHelpDeskModal} onClose={() => setShowHelpDeskModal(false)} />

      {/* Global Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSearchModal(false); }}
        >
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Search Input */}
            <div className="relative border-b border-border">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, assignments, certificates..."
                className="w-full bg-transparent pl-12 pr-12 py-4 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {searchLoading ? (
                <div className="flex items-center justify-center py-10 gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                  <span className="text-xs text-muted-foreground">Searching...</span>
                </div>
              ) : searchQuery && searchResults.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold text-foreground">No results for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-xs text-muted-foreground mt-1">Try searching for a course or assignment name.</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2 space-y-1">
                  {searchResults.map((result) => {
                    const IconComp = TYPE_ICONS[result.type] || BookOpen;
                    return (
                      <button
                        key={result.id}
                        onClick={() => {
                          onSelectTab(result.tab);
                          setShowSearchModal(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left group"
                      >
                        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 shrink-0 group-hover:bg-sky-500/20 transition-colors">
                          <IconComp className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{result.title}</p>
                          <p className="text-[11px] text-muted-foreground">{result.subtitle}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md capitalize shrink-0">
                          {result.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Default suggestions
                <div className="p-4 space-y-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Quick Jump</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "My Courses", tab: "My Learning", icon: BookOpen },
                      { label: "Assignments", tab: "Assignments", icon: CheckCircle2 },
                      { label: "Certificates", tab: "Certificates", icon: Award },
                      { label: "Settings", tab: "Settings", icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => { onSelectTab(item.tab); setShowSearchModal(false); }}
                          className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 hover:bg-muted border border-border/50 transition-colors text-left"
                        >
                          <Icon className="h-4 w-4 text-sky-500 shrink-0" />
                          <span className="text-xs font-bold text-foreground">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Press <kbd className="px-1 rounded bg-muted border border-border/60 font-mono">Esc</kbd> to close</span>
              <span className="text-[10px] text-muted-foreground">Results powered by QbitX</span>
            </div>
          </div>
        </div>
      )}
      {/* Guided Onboarding Walkthrough */}
      <GuidedOnboardingTour role="student" />

      {/* Global Omnibox Search Modal */}
      <GlobalOmniboxSearch isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
}
