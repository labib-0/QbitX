"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/auth/Stepper";
import { useAuth } from "@/context/authContext";
import { UserService } from "@/services/userService";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  Briefcase,
  Code2,
  Compass,
  CheckCircle2,
  RefreshCw,
  Rocket,
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Onboarding Form State
  const [onboardingData, setOnboardingData] = useState({
    university: user?.university || "MIT / Tech University",
    department: user?.department || "Computer Science",
    selectedGoals: ["Master Full-Stack", "Pass Technical Interviews"],
    selectedSkills: ["Python", "JavaScript", "Data Structures"],
    weeklyHours: "10" as "5" | "10" | "20" | "30",
    dreamCareer: "Software Engineer",
  });

  const stepTitles = [
    "Profile Basics",
    "Learning Goals & Skills",
    "Weekly Commitment",
    "Dream Career Target",
  ];

  const goalsList = [
    "Master Full-Stack Web Dev",
    "Learn AI & Prompt Eng",
    "Pass Technical Interviews",
    "Build Production Portfolio",
    "Join Peer Guild Projects",
    "Prepare for Viva Exams",
  ];

  const skillsList = [
    "Python",
    "C++",
    "TypeScript",
    "React / Next.js",
    "PyTorch & ML",
    "Data Structures",
    "Systems Programming",
    "SQL & Databases",
    "Docker & Cloud",
    "Cybersecurity",
  ];

  const careersList = [
    { title: "Software Engineer", desc: "Build scalable web & cloud applications" },
    { title: "AI & ML Engineer", desc: "Develop LLM models & computer vision" },
    { title: "Cyber Security Specialist", desc: "Penetration testing & network security" },
    { title: "Startup Founder", desc: "Launch your own tech SaaS product" },
    { title: "Full Stack Engineer", desc: "Master frontend UI and backend APIs" },
    { title: "Research Scientist", desc: "Pursue graduate STEM research" },
  ];

  const toggleGoal = (goal: string) => {
    const goals = onboardingData.selectedGoals.includes(goal)
      ? onboardingData.selectedGoals.filter((g) => g !== goal)
      : [...onboardingData.selectedGoals, goal];
    setOnboardingData({ ...onboardingData, selectedGoals: goals });
  };

  const toggleSkill = (skill: string) => {
    const skills = onboardingData.selectedSkills.includes(skill)
      ? onboardingData.selectedSkills.filter((s) => s !== skill)
      : [...onboardingData.selectedSkills, skill];
    setOnboardingData({ ...onboardingData, selectedSkills: skills });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      if (user) {
        await UserService.saveStudentOnboarding(user.id, {
          learningGoals: onboardingData.selectedGoals,
          selectedSkills: onboardingData.selectedSkills,
          interests: onboardingData.selectedGoals,
          weeklyHours: onboardingData.weeklyHours,
          dreamCareer: onboardingData.dreamCareer,
        });
        updateUser({ onboardingCompleted: true });
      }
      router.push("/dashboard/student");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950">
      
      {/* Header */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 font-extrabold text-white text-base shadow-lg shadow-sky-500/20">
            Q
          </div>
          <span className="text-lg font-black text-white">Qbit<span className="text-sky-400">X</span></span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Sparkles className="h-4 w-4 text-sky-400" />
          <span>Student Onboarding Wizard</span>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="mx-auto w-full max-w-3xl px-4 py-8 flex-1 flex flex-col justify-center">
        
        <div className="rounded-2xl glass-panel p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
          
          {/* Stepper Progress Bar */}
          <Stepper currentStep={step} totalSteps={4} stepTitles={stepTitles} />

          {/* STEP 1: Profile Details */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Welcome to QbitX! 🎉</h2>
                <p className="text-xs text-slate-400">Confirm your university profile to match with top upperclassmen mentors.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">University / College</label>
                  <input
                    type="text"
                    value={onboardingData.university}
                    onChange={(e) => setOnboardingData({ ...onboardingData, university: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300">Department / Major</label>
                  <input
                    type="text"
                    value={onboardingData.department}
                    onChange={(e) => setOnboardingData({ ...onboardingData, department: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Goals & Skills */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Select Your Learning Goals</h2>
                <p className="text-xs text-slate-400">Choose what you want to achieve on QbitX this semester.</p>
              </div>

              <div className="space-y-4">
                {/* Goals Grid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Learning Objectives:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {goalsList.map((goal, i) => {
                      const selected = onboardingData.selectedGoals.includes(goal);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleGoal(goal)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                            selected
                              ? "bg-sky-500/10 border-sky-500 text-sky-300 shadow-md shadow-sky-500/10"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{goal}</span>
                          {selected && <Check className="h-4 w-4 text-sky-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Skills You Want To Improve:</label>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill, i) => {
                      const selected = onboardingData.selectedSkills.includes(skill);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            selected
                              ? "bg-indigo-600 text-white border-indigo-500"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Weekly Commitment */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Choose Weekly Time Commitment</h2>
                <p className="text-xs text-slate-400">Select how many hours per week you can dedicate to study sessions & projects.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { hours: "5", title: "5 Hours / Week", desc: "Casual study — 1 mentorship session + self-paced AI practice." },
                  { hours: "10", title: "10 Hours / Week", desc: "Balanced pace — 2 mentor sessions + PASS study circle." },
                  { hours: "20", title: "20 Hours / Week", desc: "Intensive track — Guild project team + weekly code reviews." },
                  { hours: "30", title: "30 Hours / Week", desc: "Full Bootcamp Mode — Fast-track job interview preparation." },
                ].map((item) => {
                  const selected = onboardingData.weeklyHours === item.hours;
                  return (
                    <button
                      key={item.hours}
                      type="button"
                      onClick={() => setOnboardingData({ ...onboardingData, weeklyHours: item.hours as any })}
                      className={`p-5 rounded-2xl border text-left space-y-2 transition-all ${
                        selected
                          ? "bg-sky-500/10 border-sky-500 text-sky-300 shadow-xl shadow-sky-500/10 scale-[1.02]"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base text-white">{item.title}</span>
                        <Clock className={`h-4 w-4 ${selected ? "text-sky-400" : "text-slate-600"}`} />
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Dream Career Target */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white">Select Your Dream Career Target</h2>
                <p className="text-xs text-slate-400">We will personalize your mentor matches & learning roadmap for this goal.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {careersList.map((car, i) => {
                  const selected = onboardingData.dreamCareer === car.title;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setOnboardingData({ ...onboardingData, dreamCareer: car.title })}
                      className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                        selected
                          ? "bg-purple-600/20 border-purple-500 text-purple-200 shadow-lg shadow-purple-500/10"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{car.title}</span>
                        {selected && <CheckCircle2 className="h-4 w-4 text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400">{car.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 transition-transform disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : step < 4 ? (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  <span>Save & Continue to Dashboard</span>
                </>
              )}
            </button>
          </div>

        </div>

      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        QbitX Onboarding Engine • Step {step} of 4
      </footer>
    </div>
  );
}
