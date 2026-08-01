"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { CareerService } from "@/services/career/CareerService";
import { Award, Code, Star, ExternalLink, Globe, ShieldCheck } from "lucide-react";

export default function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const portfolio = CareerService.getPortfolio();
  const displayName = resolvedParams.username
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo_transparent_low_res.png" alt="QbitX Logo" width={110} height={34} className="object-contain" />
          </Link>
          <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-500" />
            Verified QbitX Student Profile
          </span>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-border bg-card p-8 space-y-4 shadow-xl text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
          <Image src={portfolio.avatar} alt={displayName} width={96} height={96} className="rounded-3xl object-cover ring-4 ring-purple-500/20 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-foreground font-heading">{displayName}</h1>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{portfolio.title}</p>
            <p className="text-xs text-muted-foreground">{portfolio.university} • GPA {portfolio.gpa} / 4.0</p>
            <p className="text-xs text-muted-foreground max-w-xl pt-2">{portfolio.bio}</p>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-lg text-foreground font-heading flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-500" />
            <span>Verified Technical Proficiencies</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {portfolio.skills.map((s, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-muted/40 border border-border space-y-1">
                <span className="font-extrabold text-xs text-foreground block">{s.skillName}</span>
                <span className="text-[10px] font-bold text-purple-500">{s.proficiencyScore}% ({s.level})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xl text-foreground font-heading">Featured Capstone Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portfolio.projects.map((p) => (
              <div key={p.id} className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm">
                <h4 className="font-extrabold text-base text-foreground font-heading">{p.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {p.technologies.map((t, i) => (
                    <span key={i} className="text-[10px] font-bold bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
