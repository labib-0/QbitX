"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { ThemeToggle } from "@/components/theme-toggle";
import { Search, Bell, LogOut, Activity, Crown } from "lucide-react";
import { GuidedOnboardingTour } from "@/components/onboarding/GuidedOnboardingTour";
import { GlobalOmniboxSearch } from "@/components/search/GlobalOmniboxSearch";

export function AdminTopNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const name = user?.name || "System Admin";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Left: Logo & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src="/logo_transparent_low_res.png"
              alt="QbitX Logo"
              width={110}
              height={34}
              className="object-contain"
            />
          </Link>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-300 border border-amber-500/20">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Platform Executive Portal</span>
          </span>
        </div>

        {/* Middle: Search Bar */}
        <div onClick={() => setShowSearchModal(true)} className="hidden md:flex items-center relative w-72 cursor-pointer">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            readOnly
            placeholder="Search platform items (Ctrl+K)..."
            className="w-full rounded-2xl bg-muted/40 border border-border pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none cursor-pointer font-medium"
          />
        </div>

        {/* Right: Actions, Theme Toggle, Profile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-bold">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            <span>Systems 99.98% Operational</span>
          </div>

          <ThemeToggle />

          <button
            className="p-2 rounded-xl bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative"
            title="Admin Security Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Profile Pill */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 font-extrabold text-white text-xs shadow-md shadow-amber-500/20">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-foreground leading-tight">{name}</p>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Super Admin</p>
            </div>
          </div>

          <button
            onClick={async () => {
              await logout();
              router.push("/login/student");
            }}
            className="flex items-center gap-1.5 rounded-xl bg-muted/40 border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Guided Onboarding Walkthrough */}
      <GuidedOnboardingTour role="admin" />

      {/* Global Omnibox Search Modal */}
      <GlobalOmniboxSearch isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </>
  );
}
