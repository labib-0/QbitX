"use client";

import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Server,
  Zap,
} from "lucide-react";
import { apiEndpointsDirectory } from "@/lib/docsData";
import { ApiEndpointItem } from "@/types/docs";

interface ApiDirectoryViewProps {
  searchQuery?: string;
}

export function ApiDirectoryView({ searchQuery = "" }: ApiDirectoryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(apiEndpointsDirectory[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "all",
    "Auth",
    "Student",
    "Mentor",
    "Admin",
    "Courses & Content",
    "AI & Socratic",
    "Docs & Meta",
  ];

  const filteredEndpoints = apiEndpointsDirectory.filter((ep) => {
    if (activeCategory !== "all" && ep.category !== activeCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ep.path.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.method.toLowerCase().includes(q) ||
      ep.category.toLowerCase().includes(q)
    );
  });

  const handleCopyCurl = (ep: ApiEndpointItem) => {
    const curl = `curl -X ${ep.method} "https://qbitx.vercel.app${ep.path}" \\
  -H "Content-Type: application/json"${
    ep.auth !== "Public" ? ' \\\n  -H "Authorization: Bearer <token>"' : ""
  }${
      ep.requestBody
        ? ` \\\n  -d '${JSON.stringify(ep.requestBody)}'`
        : ""
    }`;

    navigator.clipboard.writeText(curl);
    setCopiedId(ep.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
      case "POST":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
      case "PATCH":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sky-500 text-xs font-bold font-mono uppercase tracking-wider">
          <Server className="h-4 w-4" />
          <span>Interactive REST API Directory</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground font-heading">
          API Reference & Integration Guide
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Comprehensive catalog of all exposed serverless route handlers, request validation schemas, authentication scopes, and standard responses.
        </p>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-sky-500 text-white shadow-xs font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Endpoints List */}
      <div className="space-y-3">
        {filteredEndpoints.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-border text-muted-foreground">
            No endpoints matching your search criteria.
          </div>
        ) : (
          filteredEndpoints.map((ep) => {
            const isExpanded = expandedId === ep.id;
            const isCopied = copiedId === ep.id;

            return (
              <div
                key={ep.id}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all shadow-xs"
              >
                {/* Collapsed Header / Accordion Trigger */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ep.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border uppercase shrink-0 ${getMethodBadge(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-foreground break-all">
                      {ep.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[11px] font-medium hidden sm:inline">
                      {ep.category}
                    </span>
                    <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400">
                      Auth: {ep.auth}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 border-t border-border/60 bg-muted/10 space-y-5 animate-in fade-in duration-200">
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {ep.description}
                    </p>

                    {/* Copy cURL Button */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase font-mono">
                        Terminal Request Example
                      </span>
                      <button
                        onClick={() => handleCopyCurl(ep)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted border border-border text-xs font-medium text-foreground hover:bg-muted/80 transition-all active:scale-95"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-500">cURL Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Copy cURL</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Request / Response Split Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Request Payload */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">
                          Request Payload (JSON)
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-56 custom-scrollbar">
                          {ep.requestBody ? (
                            <pre>{JSON.stringify(ep.requestBody, null, 2)}</pre>
                          ) : (
                            <span className="text-slate-500 italic">// No request body required</span>
                          )}
                        </div>
                      </div>

                      {/* Response Payload */}
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">
                          Sample Response (JSON)
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-56 custom-scrollbar">
                          {ep.responseExample ? (
                            <pre>{JSON.stringify(ep.responseExample, null, 2)}</pre>
                          ) : (
                            <span className="text-slate-500 italic">// Standard status 200 OK</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
