"use client";

import { useState } from "react";
import { ArrowRight, Code, ShieldCheck, Sparkles, Database, LayoutDashboard, RefreshCcw } from "lucide-react";

export function DataFlowDiagramSvg() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 1,
      title: "1. Code / Question Input",
      desc: "Student inputs code or submits a question via the interactive Monaco workspace or Socratic AI drawer.",
      icon: Code,
      badge: "Client-side",
      meta: "Monaco Editor / React 19",
    },
    {
      id: 2,
      title: "2. Edge Validation & Auth",
      desc: "Payload is sanitized, token counts estimated, and session identity/role cryptographically verified via Better-Auth.",
      icon: ShieldCheck,
      badge: "Edge Gateway",
      meta: "Better-Auth Session & CSRF",
    },
    {
      id: 3,
      title: "3. Pedagogical AI Engine",
      desc: "Gemini 2.5 processes student queries with strict Socratic guidelines—guiding inquiry rather than dumping answers.",
      icon: Sparkles,
      badge: "LLM Orchestration",
      meta: "Gemini 2.5 + Fallback Engine",
    },
    {
      id: 4,
      title: "4. State & Audit Logging",
      desc: "Interaction logs, quiz results, and rubric grades are written to Neon PostgreSQL via Drizzle ORM.",
      icon: Database,
      badge: "Data Layer",
      meta: "PostgreSQL / JSONB Details",
    },
    {
      id: 5,
      title: "5. Real-Time Feedback",
      desc: "Markdown explanation streams to UI, updating student mastery progress, XP counters, and early-warning signals.",
      icon: LayoutDashboard,
      badge: "Streaming UI",
      meta: "Optimistic React UI",
    },
    {
      id: 6,
      title: "6. Closed-Loop Mentorship",
      desc: "Mentor dashboard surfaces low-mastery students, enabling targeted intervention and human-in-the-loop guidance.",
      icon: RefreshCcw,
      badge: "PASS Intervention",
      meta: "Predictive Analytics",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Interactive Step Explorer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isCurrent
                  ? "border-sky-500 bg-sky-500/10 shadow-sm ring-1 ring-sky-500/30"
                  : "border-border/60 bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isCurrent
                      ? "bg-sky-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted border border-border/70 text-muted-foreground">
                  {step.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-foreground font-heading">{step.title}</h4>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {step.desc}
              </p>
              <div className="mt-2 text-[10px] text-sky-600 dark:text-sky-400 font-mono">
                {step.meta}
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Data Flow Pipeline */}
      <div className="w-full overflow-x-auto custom-scrollbar p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 960 200" className="w-full max-w-5xl min-w-[760px] h-auto font-sans">
          <defs>
            <linearGradient id="df-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="df-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="df-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="df-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <marker id="df-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Node 1: Input */}
          <g transform="translate(20, 40)" className="cursor-pointer" onClick={() => setActiveStep(0)}>
            <rect width="130" height="90" rx="16" fill="#1e293b" stroke={activeStep === 0 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 0 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="47" y="12" fill="url(#df-blue)" opacity="0.9" />
            <text x="65" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">💻</text>
            <text x="65" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">1. Student Input</text>
            <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">Code & Prompts</text>
          </g>

          {/* Connector 1 -> 2 */}
          <path d="M 152 85 L 180 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#df-arrow)" />

          {/* Node 2: Gateway */}
          <g transform="translate(182, 40)" className="cursor-pointer" onClick={() => setActiveStep(1)}>
            <rect width="130" height="90" rx="16" fill="#1e293b" stroke={activeStep === 1 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 1 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="47" y="12" fill="url(#df-purple)" opacity="0.9" />
            <text x="65" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">🛡️</text>
            <text x="65" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">2. Auth & Sanitization</text>
            <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">Better-Auth RBAC</text>
          </g>

          {/* Connector 2 -> 3 */}
          <path d="M 314 85 L 342 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#df-arrow)" />

          {/* Node 3: Socratic AI */}
          <g transform="translate(344, 40)" className="cursor-pointer" onClick={() => setActiveStep(2)}>
            <rect width="130" height="90" rx="16" fill="#1e293b" stroke={activeStep === 2 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 2 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="47" y="12" fill="url(#df-blue)" opacity="0.9" />
            <text x="65" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">✨</text>
            <text x="65" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">3. Socratic AI</text>
            <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">Gemini 2.5 Engine</text>
          </g>

          {/* Connector 3 -> 4 */}
          <path d="M 476 85 L 504 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#df-arrow)" />

          {/* Node 4: Persistence */}
          <g transform="translate(506, 40)" className="cursor-pointer" onClick={() => setActiveStep(3)}>
            <rect width="130" height="90" rx="16" fill="#1e293b" stroke={activeStep === 3 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 3 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="47" y="12" fill="url(#df-amber)" opacity="0.9" />
            <text x="65" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">💾</text>
            <text x="65" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">4. Drizzle & DB</text>
            <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">PostgreSQL Audits</text>
          </g>

          {/* Connector 4 -> 5 */}
          <path d="M 638 85 L 666 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#df-arrow)" />

          {/* Node 5: Real-time UI */}
          <g transform="translate(668, 40)" className="cursor-pointer" onClick={() => setActiveStep(4)}>
            <rect width="130" height="90" rx="16" fill="#1e293b" stroke={activeStep === 4 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 4 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="47" y="12" fill="url(#df-emerald)" opacity="0.9" />
            <text x="65" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">📊</text>
            <text x="65" y="65" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">5. Real-Time UI</text>
            <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">Progress & Mastery</text>
          </g>

          {/* Connector 5 -> 6 */}
          <path d="M 800 85 L 826 85" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#df-arrow)" />

          {/* Node 6: Closed Loop Feedback */}
          <g transform="translate(828, 40)" className="cursor-pointer" onClick={() => setActiveStep(5)}>
            <rect width="112" height="90" rx="16" fill="#1e293b" stroke={activeStep === 5 ? "#38bdf8" : "#334155"} strokeWidth={activeStep === 5 ? "2.5" : "1"} />
            <rect width="36" height="36" rx="8" x="38" y="12" fill="url(#df-purple)" opacity="0.9" />
            <text x="56" y="35" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">🔄</text>
            <text x="56" y="65" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">6. Mentor Loop</text>
            <text x="56" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">Early Alerts</text>
          </g>

          {/* Bottom Loopback Path (Node 6 to Node 1) */}
          <path
            d="M 884 132 C 884 175, 85 175, 85 132"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            markerEnd="url(#df-arrow)"
            opacity="0.6"
          />
          <text x="480" y="165" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600" opacity="0.8">
            Continuous Adaptive Learning Cycle (XP, PASS Alerts, Mentor Feedback)
          </text>
        </svg>
      </div>
    </div>
  );
}
