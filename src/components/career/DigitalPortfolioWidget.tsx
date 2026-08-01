"use client";

import { useState } from "react";
import Image from "next/image";
import { StudentPortfolio } from "@/types/career";
import { User, Award, BookOpen, Code, Share2, CheckCircle2, Star, Sparkles } from "lucide-react";
import { PublicPortfolioModal } from "./PublicPortfolioModal";

export function DigitalPortfolioWidget({ portfolio }: { portfolio: StudentPortfolio }) {
  const [showPublicModal, setShowPublicModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image src={portfolio.avatar} alt={portfolio.name} width={72} height={72} className="rounded-3xl object-cover shrink-0 ring-4 ring-purple-500/20" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-foreground font-heading">{portfolio.name}</h2>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Verified Student Profile
                </span>
              </div>
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{portfolio.title}</p>
              <p className="text-xs text-muted-foreground">{portfolio.university} • GPA {portfolio.gpa}/4.0</p>
            </div>
          </div>

          <button
            onClick={() => setShowPublicModal(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center gap-2 shrink-0"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Public Portfolio</span>
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/80">
          {portfolio.bio}
        </p>
      </div>

      {/* Verified Skills & Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technical Skills */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Code className="h-4 w-4 text-purple-500" />
            <span>Verified Technical Skills</span>
          </h3>

          <div className="space-y-3">
            {portfolio.skills.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-foreground">{s.skillName}</span>
                  <span className="text-purple-600 dark:text-purple-400">{s.proficiencyScore}% ({s.level})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${s.proficiencyScore}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentor Endorsements */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span>Senior Mentor Endorsements</span>
          </h3>

          <div className="space-y-4">
            {portfolio.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <Image src={rec.avatar} alt={rec.mentorName} width={36} height={36} className="rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-foreground">{rec.mentorName}</h4>
                    <p className="text-[10px] text-muted-foreground">{rec.mentorRole}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&quot;{rec.content}&quot;</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.endorsedSkills.map((sk, i) => (
                    <span key={i} className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-md">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showPublicModal && (
        <PublicPortfolioModal portfolio={portfolio} isOpen={showPublicModal} onClose={() => setShowPublicModal(false)} />
      )}
    </div>
  );
}
