"use client";

import { useState } from "react";
import {
  Layers,
  Cpu,
  Database,
  Shield,
  Workflow,
  Sparkles,
  GitBranch,
  Gauge,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCode,
  Terminal,
  Activity,
  Server,
  Lock,
} from "lucide-react";
import { ArchitectureDiagramSvg } from "./ArchitectureDiagramSvg";
import { DataFlowDiagramSvg } from "./DataFlowDiagramSvg";
import {
  featureMatrix,
  techStackItems,
  roadmapQuarters,
  changelogEntries,
  securityRbacPolicies,
  dataPrivacyPillars,
  aiLayerSpecifications,
  performanceScalabilitySpecs,
} from "@/lib/docsData";

interface TechnicalDocsViewProps {
  searchQuery?: string;
}

export function TechnicalDocsView({ searchQuery = "" }: TechnicalDocsViewProps) {
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>("all");

  const filteredFeatures = featureMatrix.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.feature.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const techCategories = ["all", "Frontend", "Backend & Gateway", "Data Layer", "AI & ML", "Testing & DevOps"];

  const filteredTech = techStackItems.filter((item) => {
    if (selectedTechCategory !== "all" && item.category !== selectedTechCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.purpose.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-12">
      {/* Overview Card */}
      <section id="tech-overview" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sky-500 text-xs font-bold font-mono uppercase tracking-wider">
          <Layers className="h-4 w-4" />
          <span>System Whitepaper</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground font-heading">
          Technical Architecture & Whitepaper
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          QbitX is engineered on a resilient serverless architecture utilizing Next.js 16 (App Router), React 19, Neon Serverless PostgreSQL with Drizzle ORM, Better-Auth cryptographic RBAC, and Google Gemini 2.5 generative reasoning pipelines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-xs text-muted-foreground">Frontend Delivery</span>
            <div className="text-sm font-bold text-foreground">Next.js 16 + React 19</div>
            <p className="text-[11px] text-muted-foreground">Server Components & Edge Bundles</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-xs text-muted-foreground">Data Storage</span>
            <div className="text-sm font-bold text-foreground">PostgreSQL + Drizzle</div>
            <p className="text-[11px] text-muted-foreground">Connection-pooled relational schema</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-1">
            <span className="text-xs text-muted-foreground">Cognitive Intelligence</span>
            <div className="text-sm font-bold text-foreground">Google Gemini 2.5</div>
            <p className="text-[11px] text-muted-foreground">Socratic prompts with AST validation</p>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section id="feature-matrix" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>System Feature Matrix</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live status mapping of platform capabilities across core modules
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {filteredFeatures.length} capabilities tracked
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Feature / Module</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredFeatures.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-foreground font-mono">
                    {item.feature}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] text-muted-foreground font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground max-w-md leading-relaxed">
                    {item.description}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                        item.status === "live"
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          : item.status === "beta"
                          ? "bg-sky-500/15 text-sky-500 border border-sky-500/30"
                          : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Architecture Diagram Section */}
      <section id="architecture-diagram" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Server className="h-5 w-5 text-sky-500" />
            <span>End-to-End Architecture Topology</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click any layer in the topology below to inspect its operational role and integration surface.
          </p>
        </div>

        <ArchitectureDiagramSvg />
      </section>

      {/* Data Flow Diagram Section */}
      <section id="data-flow-diagram" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Workflow className="h-5 w-5 text-purple-500" />
            <span>Data Flow & Pedagogical Execution Loop</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Traces the student telemetry lifecycle from code keystroke through Socratic reasoning and mentor alerts.
          </p>
        </div>

        <DataFlowDiagramSvg />
      </section>

      {/* Technology Stack Grid */}
      <section id="tech-stack" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
              <Cpu className="h-5 w-5 text-sky-500" />
              <span>Technology Stack Inventory</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Production libraries, frameworks, runtime environments, and foundational models.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {techCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTechCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                  selectedTechCategory === cat
                    ? "bg-sky-500 text-white shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTech.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-muted/20 border border-border/70 hover:border-sky-500/40 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground font-mono">{item.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                  {item.version}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.purpose}</p>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
                Category: {item.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Layer & AI Layer Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Layer */}
        <section id="data-layer" className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 scroll-mt-24">
          <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
            <Database className="h-4 w-4 text-amber-500" />
            <span>Data Layer & Schema Design</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Data models are strictly defined in TypeScript using Drizzle ORM schema declarations targeting Neon Serverless PostgreSQL with indexed foreign keys and JSONB telemetry payloads.
          </p>

          <div className="space-y-2.5">
            {dataPrivacyPillars.map((pillar, pIdx) => (
              <div key={pIdx} className="p-3 rounded-2xl bg-muted/20 border border-border/60 space-y-1">
                <div className="text-xs font-bold text-foreground">{pillar.title}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{pillar.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Layer */}
        <section id="ai-layer" className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 scroll-mt-24">
          <h3 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI Layer & Socratic Framework</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rather than spoon-feeding solutions, QbitX integrates a tiered multi-model LLM architecture optimized for Bloom's Taxonomy progression.
          </p>

          <div className="space-y-2.5">
            {aiLayerSpecifications.map((spec, sIdx) => (
              <div key={sIdx} className="p-3 rounded-2xl bg-muted/20 border border-border/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{spec.module}</span>
                  <span className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                    {spec.latency}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{spec.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Security & RBAC Matrix */}
      <section id="security-rbac" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-500" />
            <span>Security Architecture & RBAC Permissions</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Strict role-based access control with cryptographically signed session tokens and route-level guards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {securityRbacPolicies.map((pol, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-muted/20 border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground font-heading uppercase tracking-wide">
                  {pol.role}
                </span>
                <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{pol.scope}</p>
              <div className="text-[11px] font-mono text-foreground/80 bg-background/50 p-2 rounded-xl border border-border/50">
                Guard: {pol.guard}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Performance & Scalability */}
      <section id="scalability" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Gauge className="h-5 w-5 text-sky-500" />
            <span>Performance Targets & Scalability Profile</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Engineered for high concurrent student workspace loads and rapid round-trip AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {performanceScalabilitySpecs.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/70 text-center space-y-1">
              <div className="text-xl font-extrabold text-foreground font-mono">{item.value}</div>
              <div className="text-xs font-bold text-foreground">{item.metric}</div>
              <p className="text-[10px] text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Roadmap */}
      <section id="roadmap" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-sky-500" />
            <span>Technical & Product Roadmap</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Key architectural milestones and engineering deliverables across upcoming quarters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapQuarters.map((quarter, qIdx) => (
            <div
              key={qIdx}
              className={`p-5 rounded-2xl border space-y-3 ${
                quarter.status === "completed"
                  ? "bg-emerald-500/5 border-emerald-500/30"
                  : quarter.status === "in-progress"
                  ? "bg-sky-500/5 border-sky-500/30"
                  : "bg-muted/20 border-border/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs font-mono uppercase text-foreground">
                  {quarter.quarter}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold ${
                    quarter.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : quarter.status === "in-progress"
                      ? "bg-sky-500/10 text-sky-500"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {quarter.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground font-heading">{quarter.focus}</h4>
              <ul className="space-y-1.5 pt-1">
                {quarter.deliverables.map((item, dIdx) => (
                  <li key={dIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-sky-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Changelog */}
      <section id="changelog" className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6 scroll-mt-24">
        <div>
          <h3 className="text-xl font-bold text-foreground font-heading flex items-center gap-2">
            <Activity className="h-5 w-5 text-sky-500" />
            <span>Changelog & Release Notes</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detailed record of version releases, features, and security patches.
          </p>
        </div>

        <div className="space-y-4">
          {changelogEntries.map((log, lIdx) => (
            <div key={lIdx} className="p-4 rounded-2xl bg-muted/20 border border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                    {log.version}
                  </span>
                  <span className="text-xs text-muted-foreground">{log.date}</span>
                </div>
                <span className="text-[10px] text-sky-500 font-mono font-medium">{log.title}</span>
              </div>
              <ul className="space-y-1 pt-1">
                {log.changes.map((change, cIdx) => (
                  <li key={cIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
