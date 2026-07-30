"use client";

import { Users, Award, BookOpen, UserCheck, ArrowRight, Sparkles } from "lucide-react";

interface QuickTilesGridProps {
  onSelectTab: (tab: string) => void;
}

export function QuickTilesGrid({ onSelectTab }: QuickTilesGridProps) {
  const tiles = [
    {
      title: "My Team & Cohort",
      desc: "Connect with your assigned Learning Family & Senior Mentors.",
      icon: Users,
      color: "from-sky-500 to-indigo-600",
      tab: "Learning Families",
      badge: "Active Cohort",
    },
    {
      title: "Certificates & Badges",
      desc: "View verified course completion credentials.",
      icon: Award,
      color: "from-purple-600 to-indigo-700",
      tab: "Certificates",
      badge: "2 Verified",
    },
    {
      title: "My Courses & Sessions",
      desc: "Explore all your enrolled courses and conceptual sessions.",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      tab: "My Learning",
      badge: "Enrolled",
    },
    {
      title: "Profile Dashboard",
      desc: "Customize your bio, academic credentials, and social links.",
      icon: UserCheck,
      color: "from-amber-500 to-orange-600",
      tab: "Profile",
      badge: "Customize",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-extrabold text-foreground font-heading flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-sky-500" />
        <span>Student Quick Services</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t, idx) => {
          const IconComp = t.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(t.tab)}
              className="group p-5 rounded-3xl border border-border bg-card hover:border-sky-500/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${t.color} text-white shadow-md`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-extrabold bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full border border-border/50">
                    {t.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-foreground font-heading">{t.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                <span>Access Feature</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
