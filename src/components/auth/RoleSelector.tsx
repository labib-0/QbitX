"use client";

import Link from "next/link";
import { Users, GraduationCap } from "lucide-react";

interface RoleSelectorProps {
  currentRole: "student" | "mentor";
  action: "login" | "register";
}

export function RoleSelector({ currentRole, action }: RoleSelectorProps) {
  const studentPath = action === "login" ? "/login/student" : "/register/student";
  const mentorPath = action === "login" ? "/login/mentor" : "/register/mentor";

  return (
    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 w-full mb-6">
      <Link
        href={studentPath}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
          currentRole === "student"
            ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <GraduationCap className="h-4.5 w-4.5" />
        Student Portal
      </Link>

      <Link
        href={mentorPath}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
          currentRole === "mentor"
            ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Users className="h-4.5 w-4.5" />
        Senior Mentor
      </Link>
    </div>
  );
}
