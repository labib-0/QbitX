"use client";

import { useState } from "react";
import { Compass, Sparkles, Globe, ShieldCheck, Cpu, Code2, FileSearch, Users, Calendar } from "lucide-react";

export function GuildsWidget() {
  const [joinedGuilds, setJoinedGuilds] = useState<string[]>(["AI Guild", "Web Guild"]);

  const guilds = [
    {
      name: "AI & Machine Learning Guild",
      category: "AI Guild",
      captain: "Prof. Alex Rivera",
      members: 342,
      weeklyEvents: "Fridays @ 6 PM — LLM Fine-Tuning Workshop",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
    },
    {
      name: "Full-Stack Web Engineering Guild",
      category: "Web Guild",
      captain: "Tariq Hasan",
      members: 512,
      weeklyEvents: "Wednesdays @ 7 PM — Next.js & Server Components",
      icon: Globe,
      color: "from-sky-500 to-cyan-600",
    },
    {
      name: "Cybersecurity & Systems Guild",
      category: "Cyber Guild",
      captain: "David Kim",
      members: 218,
      weeklyEvents: "Saturdays @ 4 PM — CTF Hackathon Practice",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "IoT & Embedded Systems Guild",
      category: "IoT Guild",
      captain: "Elena Rostova",
      members: 185,
      weeklyEvents: "Tuesdays @ 5 PM — ESP32 & Robotics Lab",
      icon: Cpu,
      color: "from-amber-500 to-orange-600",
    },
    {
      name: "Competitive Programming Guild",
      category: "CP Guild",
      captain: "Ayesha Malik",
      members: 410,
      weeklyEvents: "Mondays @ 8 PM — LeetCode Hard & Codeforces",
      icon: Code2,
      color: "from-indigo-600 to-purple-700",
    },
    {
      name: "AI & CS Academic Research Guild",
      category: "Research Guild",
      captain: "Dr. Sarah Chen",
      members: 160,
      weeklyEvents: "Thursdays @ 3 PM — Paper Reading & NeurIPS Reviews",
      icon: FileSearch,
      color: "from-cyan-600 to-blue-700",
    },
  ];

  const toggleJoin = (category: string) => {
    if (joinedGuilds.includes(category)) {
      setJoinedGuilds(joinedGuilds.filter(g => g !== category));
    } else {
      setJoinedGuilds([...joinedGuilds, category]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Compass className="h-5 w-5 text-sky-500" />
            <span>Technical Guilds & Special Interest Communities</span>
          </h2>
          <p className="text-xs text-muted-foreground">Join specialized engineering guilds to collaborate, attend workshops, and build portfolio projects.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guilds.map((g, idx) => {
          const IconComp = g.icon;
          const isJoined = joinedGuilds.includes(g.category);

          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${g.color} text-white shadow-md`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {g.members} Members
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground font-heading">{g.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Captain: <strong className="text-foreground font-semibold">{g.captain}</strong></p>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Weekly Event
                  </span>
                  <p className="text-muted-foreground leading-snug font-medium">{g.weeklyEvents}</p>
                </div>
              </div>

              <button
                onClick={() => toggleJoin(g.category)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isJoined
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-red-500/10 hover:text-red-500"
                    : "bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20"
                }`}
              >
                {isJoined ? "✓ Joined Guild (Leave)" : "+ Join Guild"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
