"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, X, RefreshCw } from "lucide-react";
import { AIService } from "@/services/AIService";

interface AIWorkspaceAssistantProps {
  lessonTitle: string;
  onClose: () => void;
}

export function AIWorkspaceAssistant({ lessonTitle, onClose }: AIWorkspaceAssistantProps) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I am your AI Code Tutor for "${lessonTitle}". How can I help you understand this lesson's concepts or debug your code?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await AIService.sendMessage(userText, {
        lessonTitle,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: response.text,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ **Error communicating with AI mentor:** ${err.message || "Failed to reach AI service."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
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
            <span className="text-[10px] font-bold text-sky-500 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Context: {lessonTitle}</span>
            </span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
              m.sender === "ai"
                ? "bg-muted/60 text-foreground border border-border"
                : "bg-sky-500 text-white ml-auto max-w-[85%]"
            }`}
          >
            <p className="whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}

        {loading && (
          <div className="p-3 rounded-2xl bg-muted/60 border border-border flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-500" />
            <span>AI Mentor is thinking...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="relative pt-2 border-t border-border shrink-0">
        <input
          type="text"
          placeholder="Ask a question about this lesson..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-sky-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-4 p-1.5 rounded-lg bg-sky-500 text-white disabled:opacity-50"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
