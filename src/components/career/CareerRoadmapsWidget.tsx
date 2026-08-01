"use client";

import { CareerRoadmap } from "@/types/career";
import { Compass, Code2, BrainCircuit, ArrowRight, CheckCircle2 } from "lucide-react";

export function CareerRoadmapsWidget({ roadmaps }: { roadmaps: CareerRoadmap[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Compass className="h-6 w-6 text-purple-500" />
          <span>Guided Industry Career Roadmaps</span>
        </h2>
        <p className="text-xs text-muted-foreground">Follow curated skill roadmaps designed for top tech roles in Silicon Valley and high-growth startups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmaps.map((rdm) => (
          <div key={rdm.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">Industry Career Path</span>
                <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  {rdm.readinessScore}% Match
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-foreground font-heading">{rdm.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{rdm.description}</p>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-foreground block">Key Required Competencies:</span>
                <div className="flex flex-wrap gap-1">
                  {rdm.keySkills.map((sk, i) => (
                    <span key={i} className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-md">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Enrolled in ${rdm.title} Career Pathway!`)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore Pathway & Enrol Courses</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
