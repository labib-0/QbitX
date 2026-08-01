"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Hammer,
  FileCheck,
  HelpCircle,
  FolderCheck,
  UserCheck,
  Megaphone,
  Download,
  Award,
  BarChart2,
  Calendar,
  MessageSquare,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/authContext";

export function MentorSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/mentor/dashboard", icon: LayoutDashboard },
    { label: "Students", href: "/mentor/students", icon: Users },
    { label: "Courses", href: "/mentor/courses", icon: BookOpen },
    { label: "Course Builder", href: "/mentor/builder", icon: Hammer },
    { label: "Assignments", href: "/mentor/assignments", icon: FileCheck },
    { label: "Quizzes", href: "/mentor/quizzes", icon: HelpCircle },
    { label: "Projects", href: "/mentor/projects", icon: FolderCheck },
    { label: "Teams", href: "/mentor/teams", icon: UserCheck },
    { label: "Announcements", href: "/mentor/announcements", icon: Megaphone },
    { label: "Resources", href: "/mentor/resources", icon: Download },
    { label: "Certificates", href: "/mentor/certificates", icon: Award },
    { label: "Analytics", href: "/mentor/analytics", icon: BarChart2 },
    { label: "Calendar", href: "/mentor/calendar", icon: Calendar },
    { label: "Messages", href: "/mentor/messages", icon: MessageSquare },
    { label: "AI Assistant", href: "/mentor/ai", icon: Bot },
    { label: "Settings", href: "/mentor/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-border/60 bg-card/40 backdrop-blur-md p-4 space-y-6 hidden lg:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20">
      <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-3 mb-2 block font-heading">
          Mentor Portal Navigation
        </span>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/mentor/dashboard" && pathname?.startsWith(item.href));
          const IconComp = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <IconComp className={`h-4 w-4 ${isActive ? "text-white" : "text-purple-500 group-hover:text-purple-400"}`} />
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
