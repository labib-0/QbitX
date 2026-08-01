"use client";

import { useState } from "react";
import { Briefcase, User, Code2, FileText, Target, Compass, Building2, HelpCircle } from "lucide-react";
import { CareerService } from "@/services/career/CareerService";
import { DigitalPortfolioWidget } from "@/components/career/DigitalPortfolioWidget";
import { ProjectShowcaseWidget } from "@/components/career/ProjectShowcaseWidget";
import { ResumeBuilder } from "@/components/career/ResumeBuilder";
import { SkillMatrixWidget } from "@/components/career/SkillMatrixWidget";
import { CareerRoadmapsWidget } from "@/components/career/CareerRoadmapsWidget";
import { InternshipCenterWidget } from "@/components/career/InternshipCenterWidget";
import { InterviewPrepWidget } from "@/components/career/InterviewPrepWidget";

export function CareerCenterWidget() {
  const [activeTab, setActiveTab] = useState<
    "portfolio" | "projects" | "resume" | "skills" | "roadmaps" | "internships" | "interview"
  >("portfolio");

  const portfolio = CareerService.getPortfolio();

  const tabs = [
    { id: "portfolio", label: "Digital Portfolio", icon: User },
    { id: "projects", label: "Project Showcase", icon: Code2 },
    { id: "resume", label: "Resume Builder", icon: FileText },
    { id: "skills", label: "Skill Matrix", icon: Target },
    { id: "roadmaps", label: "Career Roadmaps", icon: Compass },
    { id: "internships", label: "Internships", icon: Building2 },
    { id: "interview", label: "Interview Prep", icon: HelpCircle },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Career Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-purple-500" />
            <span>QbitX Career Development & Placement Hub</span>
          </h2>
          <p className="text-xs text-muted-foreground">Transform your verified learning achievements, capstone labs, and certificates into employability.</p>
        </div>

        <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
          Target Role: Full-Stack Software Engineer
        </span>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 border-b border-border/80">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-purple-500"}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Renders */}
      {activeTab === "portfolio" && <DigitalPortfolioWidget portfolio={portfolio} />}
      {activeTab === "projects" && <ProjectShowcaseWidget projects={portfolio.projects} />}
      {activeTab === "resume" && <ResumeBuilder portfolio={portfolio} />}
      {activeTab === "skills" && <SkillMatrixWidget portfolio={portfolio} />}
      {activeTab === "roadmaps" && <CareerRoadmapsWidget roadmaps={portfolio.roadmaps} />}
      {activeTab === "internships" && <InternshipCenterWidget internships={portfolio.internships} />}
      {activeTab === "interview" && <InterviewPrepWidget />}
    </div>
  );
}
