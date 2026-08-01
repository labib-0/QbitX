"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, X, RefreshCw } from "lucide-react";

interface AIWorkspaceAssistantProps {
  lessonTitle: string;
  onClose: () => void;
}

export function AIWorkspaceAssistant({ lessonTitle, onClose }: AIWorkspaceAssistantProps) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I am your AI Code Tutor for "${lessonTitle}". How can I help you understand this lesson's concepts or debug code?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Great question regarding "${lessonTitle}"! When working with recursive algorithms or vector embeddings, always ensure base conditions are verified. Let me know if you need code examples!`,
        },
      ]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="w-full lg:w-96 shrink-0 border-l border-border/60 bg-card p-4 space-y-4 h-full flex flex-col justify-between shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-foreground font-heading">AI Tutor Workspace Assistant</h3>
            <span className="text-[10px] font-bold text-sky-500">Context: {lessonTitle}</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === "user"
                  ? "bg-sky-500 text-white rounded-br-none shadow-md shadow-sky-500/20 font-medium"
                  : "bg-muted/60 border border-border/80 text-foreground rounded-bl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 font-medium">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-500" />
            <span>AI Tutor thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Tutor anything about this lesson..."
          className="w-full rounded-2xl bg-muted/40 border border-border pl-4 pr-10 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-40 transition-colors"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
