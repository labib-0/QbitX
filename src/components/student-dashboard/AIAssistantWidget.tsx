"use client";

import { useState } from "react";
import { AIMessage, AIService } from "@/services/AIService";
import { Sparkles, Bot, Send, User, Code2, RefreshCw, X, Minimize2, Maximize2, Terminal } from "lucide-react";

interface AIAssistantWidgetProps {
  isFloating?: boolean;
  onCloseFloating?: () => void;
}

export function AIAssistantWidget({ isFloating = false, onCloseFloating }: AIAssistantWidgetProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hello Labib 👋 I'm your 24/7 QbitX AI Tutor. Ask me anything about your CS courses, code debugging, or learning roadmaps!",
      timestamp: "Just now",
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const prompts = AIService.getSuggestedPrompts();

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: AIMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");
    setLoading(true);

    try {
      const aiReply = await AIService.sendMessage(query);
      setMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = isFloating
    ? "fixed bottom-6 right-6 z-50 w-full max-w-md h-[550px] rounded-3xl border border-sky-500/30 bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-300"
    : "w-full h-[650px] rounded-3xl border border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden";

  return (
    <div className={containerClasses}>
      
      {/* AI Header */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 font-heading">
              <span>QbitX AI Mentor 24/7</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-extrabold">
                Gemini API Demo
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">Always active • Code Analysis & Tutoring</p>
          </div>
        </div>

        {isFloating && onCloseFloating && (
          <button
            onClick={onCloseFloating}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-4 py-2 bg-muted/30 border-b border-border/40 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">Suggested:</span>
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[10px] font-semibold bg-card border border-border/60 hover:border-sky-500 text-foreground px-2.5 py-1 rounded-full whitespace-nowrap transition-all shrink-0 hover:bg-sky-500/10"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
              msg.sender === "user" ? "bg-sky-500 text-white" : "bg-purple-600 text-white"
            }`}>
              {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed ${
              msg.sender === "user"
                ? "bg-sky-500 text-white rounded-tr-none font-medium"
                : "bg-muted/80 text-foreground rounded-tl-none border border-border/50"
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Code Snippet Box if available */}
              {msg.codeSnippet && (
                <div className="rounded-xl bg-slate-950 text-slate-100 p-3 font-mono text-[11px] overflow-x-auto border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                    <span className="flex items-center gap-1"><Terminal className="h-3 w-3 text-sky-400" /> JavaScript / Python Snippet</span>
                    <button onClick={() => navigator.clipboard.writeText(msg.codeSnippet!)} className="hover:text-white">Copy</button>
                  </div>
                  <pre>{msg.codeSnippet}</pre>
                </div>
              )}

              <span className={`text-[9px] block text-right font-mono opacity-70 ${
                msg.sender === "user" ? "text-slate-100" : "text-muted-foreground"
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic p-2">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-500" />
            <span>AI Tutor is analyzing logic...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="p-3 border-t border-border/50 bg-card space-y-1.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI code questions, debugging help..."
            className="flex-1 rounded-xl bg-muted/50 border border-border px-3.5 py-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 p-2.5 text-white disabled:opacity-50 hover:scale-105 transition-transform"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-muted-foreground">
          // TODO: Replace simulated model logic with Firebase AI / Gemini API in production.
        </p>
      </div>

    </div>
  );
}
