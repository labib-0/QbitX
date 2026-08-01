"use client";

import { useState } from "react";
import { Bot, Sparkles, Send, Users, AlertTriangle, FileText, CheckCircle2, RefreshCw } from "lucide-react";

export function MentorAIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Senior Mentor! I am your QbitX Teacher AI Co-pilot. Click any quick action below or ask me to analyze student progress, draft feedback, or generate weekly summaries.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = (actionText: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: actionText }]);
    setLoading(true);

    setTimeout(() => {
      let reply = "";
      if (actionText.includes("at-risk")) {
        reply = "### At-Risk Student Analysis:\n- **Michael Chen**: 4 lessons behind schedule in *CS Fundamentals*. Recommending 1-on-1 tutoring session on Binary Trees.\n- **David Miller**: Missed 2 lab submissions. Automated check-in email dispatched.";
      } else if (actionText.includes("feedback")) {
        reply = "### Drafted Mentor Feedback:\n*Great job on the RAG pipeline capstone! Your vector retrieval implementation is clean and efficient. Consider adding retry logic for external LLM API timeouts.*";
      } else if (actionText.includes("summary")) {
        reply = "### Weekly Class Performance Summary:\n- Total Submissions Evaluated: 42\n- Class Average Score: 88.4%\n- Highest Performing Topic: Python Data Structures\n- Area for Improvement: Recursive Algorithm Complexity";
      } else {
        reply = "Analysis complete! I can help you draft assignment feedback, schedule office hours, or generate custom course reports.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setLoading(false);
    }, 800);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    handleAction(input);
    setInput("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-purple-500/30 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground font-heading">Mentor AI Co-pilot Engine</h2>
              <p className="text-xs text-muted-foreground">Class intelligence & automated teacher workflow assistant</p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full">
            Interactive Demo
          </span>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            "Summarize class performance",
            "Identify at-risk students",
            "Draft assignment feedback",
            "Generate weekly summary",
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => handleAction(action)}
              className="text-xs font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 px-3 py-1.5 rounded-xl transition-all"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm min-h-[360px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[380px] custom-scrollbar pr-1">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === "user" ? "bg-purple-600 text-white" : "bg-indigo-600 text-white"
              }`}>
                {m.sender === "user" ? "M" : <Bot className="h-4 w-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === "user" ? "bg-purple-600 text-white font-medium" : "bg-muted/60 border border-border/80 text-foreground"
              }`}>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-500 font-bold p-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing student analytics database...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="relative pt-3 border-t border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Teacher AI for class insights or feedback suggestions..."
            className="w-full rounded-2xl bg-muted/40 border border-border pl-4 pr-12 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" disabled={!input.trim() || loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40">
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
