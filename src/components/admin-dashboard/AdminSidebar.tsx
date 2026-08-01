"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Building2,
  BarChart2,
  ShieldAlert,
  Megaphone,
  Settings,
  FileSpreadsheet,
  Activity,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/authContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { label: "Overview Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Mentor Approvals", href: "/admin/mentors", icon: UserCheck },
    { label: "Course Quality Oversight", href: "/admin/courses", icon: BookOpen },
    { label: "Organizations", href: "/admin/organizations", icon: Building2 },
    { label: "Reports & Analytics", href: "/admin/analytics", icon: BarChart2 },
    { label: "Content Moderation", href: "/admin/moderation", icon: ShieldAlert },
    { label: "Global Broadcasts", href: "/admin/broadcasts", icon: Megaphone },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit", icon: FileSpreadsheet },
    { label: "Health & Security", href: "/admin/health", icon: Activity },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-md p-4 space-y-6 hidden lg:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20">
      <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-3 mb-2 block font-heading">
          Executive Platform Admin
        </span>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));
          const IconComp = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-md shadow-amber-500/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <IconComp className={`h-4 w-4 ${isActive ? "text-white" : "text-amber-500 group-hover:text-amber-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
