"use client";

import { useState } from "react";
import { Server, Database, Bot, Shield, Globe, Cpu, CheckCircle2 } from "lucide-react";

export function ArchitectureDiagramSvg() {
  const [selectedNode, setSelectedNode] = useState<string | null>("api");

  const nodes = [
    {
      id: "client",
      title: "1. Presentation Layer",
      subtitle: "Next.js 16 & React 19 UI",
      desc: "Distraction-free learning workspace, Monaco-style coding IDE, Socratic AI mentor widget, and responsive dashboards styled with Tailwind CSS.",
      icon: Globe,
      color: "border-sky-500 bg-sky-500/10 text-sky-500",
    },
    {
      id: "auth",
      title: "2. Security & Gateway",
      subtitle: "Better-Auth & Edge Middleware",
      desc: "Multi-role RBAC enforcement (Student, Mentor, Admin, Super Admin), cryptographically hashed session cookies, and security headers.",
      icon: Shield,
      color: "border-purple-500 bg-purple-500/10 text-purple-500",
    },
    {
      id: "api",
      title: "3. Business Services Layer",
      subtitle: "Next.js Serverless Route Handlers",
      desc: "Course management, assignment rubric evaluation, audit log stream, PASS early intervention triggers, and automated notification dispatches.",
      icon: Server,
      color: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "db",
      title: "4. Data & Persistence",
      subtitle: "Neon PostgreSQL + Drizzle ORM",
      desc: "Multi-tenant relational schemas, declarative Drizzle migrations, pooled connections for serverless concurrency, and strict foreign keys.",
      icon: Database,
      color: "border-amber-500 bg-amber-500/10 text-amber-500",
    },
    {
      id: "ai",
      title: "5. AI Generative Intelligence",
      subtitle: "Google Gemini 2.5 + Fallback Engine",
      desc: "Multi-candidate routing (Flash-Lite / Pro), Socratic pedagogical system prompts, AST code review tokenizer, and deterministic offline fallbacks.",
      icon: Bot,
      color: "border-pink-500 bg-pink-500/10 text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-sky-500 bg-sky-500/10 shadow-md scale-[1.02]"
                    : "border-border/60 bg-muted/20 hover:bg-muted/50"
                }`}
              >
                <div className={`p-2 rounded-xl w-fit mb-2 ${node.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground font-heading">{node.title}</h4>
                <p className="text-[10px] text-muted-foreground">{node.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Architecture Node Detail Banner */}
        {selectedNode && (
          <div className="mt-4 p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-300 font-heading">
              <CheckCircle2 className="h-4 w-4" />
              <span>Architectural Node Specification: {nodes.find((n) => n.id === selectedNode)?.title}</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {nodes.find((n) => n.id === selectedNode)?.desc}
            </p>
          </div>
        )}
      </div>

      {/* SVG Pipeline Diagram */}
      <div className="w-full overflow-x-auto custom-scrollbar p-6 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 flex items-center justify-center">
        <svg viewBox="0 0 920 220" className="w-full max-w-4xl min-w-[700px] h-auto font-sans">
          <defs>
            <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#db2777" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>

            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Node 1: Client */}
          <rect x="20" y="50" width="140" height="110" rx="16" fill="url(#grad-blue)" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="90" y="85" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Next.js 16 UI</text>
          <text x="90" y="105" textAnchor="middle" fill="#bae6fd" fontSize="9.5">React 19 Workspace</text>
          <text x="90" y="125" textAnchor="middle" fill="#bae6fd" fontSize="9.5">Web IDE & Notes</text>

          {/* Connector 1 -> 2 */}
          <path d="M 160 105 L 195 105" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Node 2: Gateway */}
          <rect x="200" y="50" width="140" height="110" rx="16" fill="url(#grad-purple)" stroke="#c084fc" strokeWidth="1.5" />
          <text x="270" y="85" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Edge Security</text>
          <text x="270" y="105" textAnchor="middle" fill="#e9d5ff" fontSize="9.5">Better-Auth RBAC</text>
          <text x="270" y="125" textAnchor="middle" fill="#e9d5ff" fontSize="9.5">Session Tokens</text>

          {/* Connector 2 -> 3 */}
          <path d="M 340 105 L 375 105" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Node 3: Services */}
          <rect x="380" y="50" width="150" height="110" rx="16" fill="url(#grad-emerald)" stroke="#34d399" strokeWidth="1.5" />
          <text x="455" y="85" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">API & Services</text>
          <text x="455" y="105" textAnchor="middle" fill="#a7f3d0" fontSize="9.5">Course & Rubric Engine</text>
          <text x="455" y="125" textAnchor="middle" fill="#a7f3d0" fontSize="9.5">PASS Early Alert</text>

          {/* Connector 3 -> 4 */}
          <path d="M 530 105 L 565 105" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Node 4: Database */}
          <rect x="570" y="50" width="150" height="110" rx="16" fill="url(#grad-amber)" stroke="#fbbf24" strokeWidth="1.5" />
          <text x="645" y="85" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Neon PostgreSQL</text>
          <text x="645" y="105" textAnchor="middle" fill="#fde68a" fontSize="9.5">Drizzle ORM Engine</text>
          <text x="645" y="125" textAnchor="middle" fill="#fde68a" fontSize="9.5">Multi-Tenant Sessions</text>

          {/* Connector 3 -> 5 (Branching to AI) */}
          <path d="M 455 50 L 455 25 L 755 25 L 755 50" stroke="#f472b6" strokeWidth="2" strokeDasharray="4,4" markerEnd="url(#arrow)" fill="none" />

          {/* Node 5: AI Engine */}
          <rect x="730" y="50" width="160" height="110" rx="16" fill="url(#grad-pink)" stroke="#f472b6" strokeWidth="1.5" />
          <text x="810" y="85" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">Google Gemini 2.5</text>
          <text x="810" y="105" textAnchor="middle" fill="#fbcfe8" fontSize="9.5">Multi-Model Routing</text>
          <text x="810" y="125" textAnchor="middle" fill="#fbcfe8" fontSize="9.5">Big-O Socratic Tutor</text>
        </svg>
      </div>
    </div>
  );
}
