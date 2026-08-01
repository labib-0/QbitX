"use client";

import { useState } from "react";
import { Bot, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface AuthoringAIAssistantProps {
  onApplyOutline?: (outlineText: string) => void;
}

export function AuthoringAIAssistant({ onApplyOutline }: AuthoringAIAssistantProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrigger = (action: string) => {
    setLoading(true);
    setTimeout(() => {
      if (action.includes("outline")) {
        setOutput(
          "### AI Generated Lesson Outline:\n1. Introduction to Syntax & Variables\n2. Control Flow & Conditional Statements\n3. Dynamic Array Data Structures\n4. Function Scoping & Recursion"
        );
      } else if (action.includes("bloom")) {
        setOutput(
          "### Bloom's Taxonomy Learning Objectives:\n- **Analyze**: Evaluate time complexity of sorting algorithms.\n- **Apply**: Build recursive tree traversal methods.\n- **Create**: Design a RAG search vector store."
        );
      } else {
        setOutput("AI Assistant is ready! Click an action to generate lesson outlines or objectives.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="rounded-3xl border border-purple-500/30 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-xs">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>AI Authoring Co-pilot</span>
        </div>
        <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2.5 py-0.5 rounded-full">
          Demo Engine
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => handleTrigger("outline")}
          className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/20 transition-all"
        >
          Generate Lesson Outline
        </button>
        <button
          onClick={() => handleTrigger("bloom")}
          className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold border border-purple-500/20 transition-all"
        >
          Suggest Bloom&apos;s Objectives
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-purple-500 font-bold p-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Generating AI curriculum suggestions...</span>
        </div>
      )}

      {output && !loading && (
        <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs leading-relaxed space-y-2">
          <p className="whitespace-pre-line text-foreground font-mono">{output}</p>
          {onApplyOutline && (
            <button
              onClick={() => onApplyOutline(output)}
              className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-extrabold text-[11px] shadow-sm"
            >
              Apply to Lesson Editor
            </button>
          )}
        </div>
      )}
    </div>
  );
}
