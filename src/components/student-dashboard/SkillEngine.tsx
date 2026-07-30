"use client";

import { Cpu, Code, GitBranch, MessageSquare, Presentation, Users, Sparkles, Microchip, FileSearch } from "lucide-react";

export function SkillEngine() {
  const skills = [
    { name: "Programming", score: 95, color: "from-sky-500 to-indigo-600", icon: Code },
    { name: "Problem Solving", score: 90, color: "from-indigo-500 to-purple-600", icon: Cpu },
    { name: "Git & Version Control", score: 88, color: "from-purple-500 to-pink-600", icon: GitBranch },
    { name: "Communication", score: 84, color: "from-emerald-500 to-teal-600", icon: MessageSquare },
    { name: "Presentation", score: 80, color: "from-teal-500 to-cyan-600", icon: Presentation },
    { name: "Leadership", score: 82, color: "from-amber-500 to-orange-600", icon: Users },
    { name: "Teamwork", score: 92, color: "from-cyan-500 to-blue-600", icon: Users },
    { name: "AI & Prompt Eng", score: 96, color: "from-purple-600 to-indigo-700", icon: Sparkles },
    { name: "Research", score: 85, color: "from-blue-500 to-indigo-600", icon: FileSearch },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-500" />
            <span>Skill Development Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground">Real-time competency assessment validated by PASS mentors and code analysis.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((s, idx) => {
            const IconComp = s.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-2 text-foreground">
                    <IconComp className="h-4 w-4 text-sky-500 shrink-0" />
                    {s.name}
                  </span>
                  <span className="font-mono text-sky-600 dark:text-sky-400">{s.score}/100</span>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-700`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
