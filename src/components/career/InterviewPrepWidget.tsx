"use client";

import { useState } from "react";
import { Sparkles, HelpCircle, Code2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export function InterviewPrepWidget() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const questions = [
    {
      category: "Data Structures & LeetCode",
      question: "How do you optimize Binary Search Tree insertion to guarantee O(log N) depth?",
      answer: "Use self-balancing binary search tree algorithms such as AVL trees or Red-Black trees. These perform tree rotation operations during insertions and deletions to preserve log N height bounds.",
    },
    {
      category: "System Design & Distributed Web",
      question: "Explain the difference between WebSockets and Server-Sent Events (SSE) for AI streaming.",
      answer: "WebSockets support bi-directional full-duplex communication over a single TCP connection. SSE provides single-directional server-to-client streaming over HTTP/2, ideal for streaming LLM word completion responses.",
    },
    {
      category: "Behavioral & Leadership",
      question: "Describe a capstone project scenario where team conflict arose and how you resolved it.",
      answer: "Focus on clear task allocation, daily standups, code review standards, and technical compromise aligned with project milestones.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-purple-500" />
          <span>Technical & Behavioral Interview Question Bank</span>
        </h2>
        <p className="text-xs text-muted-foreground">Practice coding interview questions, system design walkthroughs, and behavioral checklists.</p>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm">
            <div
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">{q.category}</span>
                <h3 className="font-extrabold text-base text-foreground font-heading">{q.question}</h3>
              </div>
              <button className="p-1 rounded-xl bg-muted text-muted-foreground">
                {openIndex === idx ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {openIndex === idx && (
              <div className="pt-3 border-t border-border text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-150">
                <strong className="text-foreground block mb-1">Model Solution & Technical Rubric:</strong>
                {q.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
