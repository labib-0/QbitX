"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChevronRight, CheckCircle2, X } from "lucide-react";

interface GuidedOnboardingTourProps {
  role: "student" | "mentor" | "admin";
}

export function GuidedOnboardingTour({ role }: GuidedOnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const STORAGE_KEY = `qbitx_onboarded_${role}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasOnboarded = localStorage.getItem(STORAGE_KEY);
      if (!hasOnboarded) {
        setIsOpen(true);
      }
    }
  }, [STORAGE_KEY]);

  const stepsByRole = {
    student: [
      {
        title: "Welcome to QbitX Student Portal! 🎓",
        desc: "Your personalized learning dashboard. Track your 14-day streak, XP points, active courses, and upcoming assignment deadlines.",
      },
      {
        title: "Distraction-Free Learning Workspace 📖",
        desc: "Access interactive video players, reading viewers, Python coding playgrounds with test suites, and private student notes.",
      },
      {
        title: "24/7 AI Code Mentor 🤖",
        desc: "Ask AI questions, debug Python code, request SQL queries, or prepare for software engineering technical interviews.",
      },
      {
        title: "Capstone Teams & Certificates 🚀",
        desc: "Collaborate with peers in team project workspaces, push GitHub commits, and earn verified course certificates.",
      },
    ],
    mentor: [
      {
        title: "Welcome to Teacher Operations Portal! 👩‍🏫",
        desc: "Your central workspace for managing student learning journeys, course builder studio, and class analytics.",
      },
      {
        title: "Assignment Review & Rubric Workspace 📝",
        desc: "Evaluate student GitHub repo submissions, assign rubric scores, and leave text, voice, or video feedback.",
      },
      {
        title: "Course Builder Studio 🛠️",
        desc: "Author courses, reorder modules, build visual quizzes, manage media assets, and run pre-publish quality checklists.",
      },
      {
        title: "Early Intervention System 🛡️",
        desc: "Automated risk flags identifying struggling students with 1-click PASS tutoring session dispatches.",
      },
    ],
    admin: [
      {
        title: "Welcome to Executive Platform Control! 👑",
        desc: "Complete visibility into platform users, courses, revenue metrics, system health, and multi-tenant organization readiness.",
      },
      {
        title: "Unified User Management & Mentors 👥",
        desc: "Inspect user rosters, assign roles, suspend accounts, and review pending senior mentor applications.",
      },
      {
        title: "System Settings & Feature Flags ⚙️",
        desc: "Toggle platform feature flags, grading scales, maintenance modes, and dispatch global broadcast announcements.",
      },
    ],
  };

  const steps = stepsByRole[role] || stepsByRole.student;

  if (!isOpen) return null;

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const currentStep = steps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl border border-purple-500/40 bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 relative">
        <button onClick={handleFinish} className="absolute top-4 right-4 p-1 rounded-xl text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-xs">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>QbitX Guided Tour • Step {stepIndex + 1} of {steps.length}</span>
          </div>

          <h3 className="font-extrabold text-xl text-foreground font-heading">{currentStep.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{currentStep.desc}</p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === stepIndex ? "w-6 bg-purple-600" : "w-2 bg-muted/80"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <button onClick={handleFinish} className="text-xs font-bold text-muted-foreground hover:text-foreground">
            Skip Tour
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 flex items-center gap-1"
          >
            <span>{stepIndex < steps.length - 1 ? "Next Step" : "Get Started"}</span>
            {stepIndex < steps.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
