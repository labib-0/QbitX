"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Bell, 
  Phone, 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  CheckCircle2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { HelpDeskModal } from "./HelpDeskModal";

interface TopNavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenAIAssistant: () => void;
  onSelectTab: (tab: string) => void;
}

export function TopNavbar({ 
  onToggleMobileSidebar, 
  onOpenAIAssistant, 
  onSelectTab
}: TopNavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showHelpDeskModal, setShowHelpDeskModal] = useState(false);

  const notifications = [
    { id: 1, title: "Mentor Feedback", desc: "Dr. Sarah Chen left feedback on RAG Pipeline.", time: "15m ago", read: false },
    { id: 2, title: "Assignment Due", desc: "DSA Lab #4 due tomorrow at 11:59 PM.", time: "1h ago", read: false },
    { id: 3, title: "Streak Unlocked 🔥", desc: "14-Day Learning Streak! +250 XP", time: "4h ago", read: true },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login/student");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/85 backdrop-blur-md transition-colors">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 w-full mx-auto">
          
          {/* Left: Mobile Menu Trigger + QbitX Brand Logo */}
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



          {/* Right Icons: Search, Theme, Notifications, Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Search Everything"
            >
              <Search className="h-5 w-5" />
            </button>

            <ThemeToggle />

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl p-4 z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <h4 className="font-bold text-sm text-foreground">Notifications</h4>
                    <span className="text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                      2 Unread
                    </span>
                  </div>
                  <div className="space-y-3 py-3 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 shrink-0 mt-0.5">
                          <Bell className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-foreground">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground">{n.desc}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-full ring-2 ring-sky-500/30 hover:ring-sky-500 transition-all"
              >
                <Image
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                  alt={user?.name || "Student Avatar"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card shadow-2xl p-2 z-50 animate-in fade-in duration-200">
                  <div className="p-3 border-b border-border space-y-0.5">
                    <p className="font-bold text-sm text-foreground">{user?.name || "Labib"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "student@qbitx.com"}</p>
                    <span className="inline-block text-[10px] font-bold bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded-md mt-1">
                      Student Level 12
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs font-medium">
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
      <HelpDeskModal
        isOpen={showHelpDeskModal}
        onClose={() => setShowHelpDeskModal(false)}
      />

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, modules, assignments..."
                className="w-full rounded-xl bg-muted/50 border border-border pl-10 pr-10 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-muted-foreground font-semibold px-1">Quick Links</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: "Introduction to Programming", type: "Course", tab: "Courses", icon: BookOpen },
                  { title: "DSA Lab #4 Assignment", type: "Assignment", tab: "Assignments", icon: CheckCircle2 },
                ].map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectTab(item.tab);
                        setShowSearchModal(false);
                      }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 hover:bg-muted border border-border/50 text-left transition-colors"
                    >
                      <IconComp className="h-4 w-4 text-sky-500 shrink-0" />
                      <div>
                        <p className="font-bold text-foreground text-xs truncate">{item.title}</p>
                        <span className="text-[10px] text-muted-foreground">{item.type}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
