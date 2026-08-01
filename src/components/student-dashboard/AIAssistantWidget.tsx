"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/authContext";
import { AIService, AIMessage } from "@/services/AIService";
import { ConversationThread } from "@/services/ai/IAIProvider";
import {
  Bot,
  Send,
  User,
  Plus,
  Trash2,
  Edit2,
  Pin,
  Search,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  X,
  Sparkles,
  Terminal,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface AIAssistantWidgetProps {
  isFloating?: boolean;
  onCloseFloating?: () => void;
}

const CHAT_THREADS_STORAGE_KEY = "qbitx_ai_chat_threads";

export function AIAssistantWidget({ isFloating = false, onCloseFloating }: AIAssistantWidgetProps) {
  const { user } = useAuth();
  const userName = user?.name || "Student";
  const courseTitle = "Introduction to Programming Language";

  // Multi-conversation state
  const [threads, setThreads] = useState<ConversationThread[]>([
    {
      id: "thread-1",
      title: "Binary Search & Algorithms",
      isPinned: true,
      createdAt: "2026-07-30T10:00:00Z",
      updatedAt: "2026-07-30T10:00:00Z",
      messages: [
        {
          id: "m-1",
          sender: "ai",
          text: `Hello ${userName}! 👋 I'm your 24/7 QbitX AI Mentor. I see you are currently enrolled in **${courseTitle}**. Ask me anything about Python syntax, data structures, code debugging, or capstone projects!`,
          timestamp: "Just now",
        },
      ],
    },
    {
      id: "thread-2",
      title: "React Hooks & Next.js 16",
      isPinned: false,
      createdAt: "2026-07-29T14:00:00Z",
      updatedAt: "2026-07-29T14:00:00Z",
      messages: [
        {
          id: "m-2",
          sender: "ai",
          text: "React Hooks allow functional components to manage local state and side effects.",
          timestamp: "Yesterday",
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("thread-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [thinkingStage, setThinkingStage] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(CHAT_THREADS_STORAGE_KEY);
        if (stored) setThreads(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && threads.length > 0) {
      try {
        localStorage.setItem(CHAT_THREADS_STORAGE_KEY, JSON.stringify(threads));
      } catch (e) {}
    }
  }, [threads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, streamingText, thinkingStage]);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const prompts = AIService.getSuggestedPrompts();

  // Handle sending message
  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: AIMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Add user message to active thread
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? { ...t, messages: [...t.messages, userMsg], updatedAt: new Date().toISOString() }
          : t
      )
    );

    if (!textToSend) setInputPrompt("");
    setLoading(true);
    setStreamingText(null);

    try {
      const aiReply = await AIService.sendMessage(
        query,
        { userName, courseTitle },
        (stage) => setThinkingStage(stage),
        (chunk) => setStreamingText(chunk)
      );

      // Add finalized AI message to active thread
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? { ...t, messages: [...t.messages, aiReply], updatedAt: new Date().toISOString() }
            : t
        )
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setThinkingStage(null);
      setStreamingText(null);
    }
  };

  // Conversation thread operations
  const handleNewChat = () => {
    const newThread: ConversationThread = {
      id: `thread-${Date.now()}`,
      title: `New Discussion ${threads.length + 1}`,
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "ai",
          text: `Hello ${userName}! How can I assist you with your CS studies today?`,
          timestamp: "Just now",
        },
      ],
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newThread.id);
  };

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (threads.length <= 1) return;
    const filtered = threads.filter((t) => t.id !== id);
    setThreads(filtered);
    if (activeThreadId === id) setActiveThreadId(filtered[0].id);
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleToggleFeedback = (msgId: string, feedbackType: "liked" | "disliked") => {
    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              messages: t.messages.map((m) =>
                m.id === msgId ? { ...m, feedback: m.feedback === feedbackType ? undefined : feedbackType } : m
              ),
            }
          : t
      )
    );
  };

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerClasses = isFloating
    ? "fixed bottom-6 right-6 z-50 w-full max-w-lg h-[620px] rounded-3xl border border-sky-500/30 bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom duration-300"
    : "w-full h-[700px] rounded-3xl border border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden relative";

  return (
    <div className={containerClasses}>
      
      {/* AI Header Bar */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-foreground transition-colors"
            title="Toggle Conversations Drawer"
          >
            <MessageSquare className="h-4 w-4" />
          </button>

          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>

          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 font-heading">
              <span>QbitX AI Mentor 24/7</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-extrabold">
                Interactive Demo
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">Context: <strong>{courseTitle}</strong></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:bg-sky-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {isFloating && onCloseFloating && (
            <button onClick={onCloseFloating} className="p-2 rounded-xl text-muted-foreground hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Body: Conversations Sidebar + Chat Canvas */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        
        {/* Conversations Sidebar Drawer */}
        {showSidebar && (
          <aside className="w-64 border-r border-border bg-card p-3 space-y-3 flex flex-col justify-between absolute inset-y-0 left-0 z-30 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-extrabold text-foreground font-heading">Conversations</span>
                <button onClick={() => setShowSidebar(false)} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full rounded-xl bg-muted/40 border border-border pl-8 pr-2 py-1.5 text-xs text-foreground focus:outline-none"
                />
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {filteredThreads.map((t) => {
                  const isActive = t.id === activeThread.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setActiveThreadId(t.id);
                        setShowSidebar(false);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between group ${
                        isActive
                          ? "bg-sky-500 text-white border-sky-500 font-bold shadow-sm"
                          : "border-border/50 text-foreground hover:bg-muted/60"
                      }`}
                    >
                      <span className="truncate pr-2">{t.title}</span>
                      {threads.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteThread(t.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Chat Canvas */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          
          {/* Suggested Prompts Bar */}
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
            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === "user" ? "bg-sky-500 text-white" : "bg-purple-600 text-white"
                  }`}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-sky-500 text-white rounded-tr-none font-medium shadow-md shadow-sky-500/20"
                      : "bg-card text-foreground rounded-tl-none border border-border shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Formatted Code Block */}
                  {msg.codeSnippet && (
                    <div className="rounded-xl bg-slate-950 text-slate-100 p-3 font-mono text-[11px] overflow-x-auto border border-slate-800 space-y-1 mt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                        <span className="flex items-center gap-1 font-sans">
                          <Terminal className="h-3 w-3 text-sky-400" /> Python / Code Block
                        </span>
                        <button
                          onClick={() => handleCopyMessage(msg.codeSnippet!, `code-${msg.id}`)}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copiedMsgId === `code-${msg.id}` ? "Copied!" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="leading-relaxed">{msg.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Message Action Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span className="font-mono">{msg.timestamp}</span>

                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMessage(msg.text, msg.id)}
                          className="hover:text-foreground p-1"
                          title="Copy Answer"
                        >
                          {copiedMsgId === msg.id ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => handleToggleFeedback(msg.id, "liked")}
                          className={`p-1 ${msg.feedback === "liked" ? "text-emerald-500 font-bold" : "hover:text-foreground"}`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleFeedback(msg.id, "disliked")}
                          className={`p-1 ${msg.feedback === "disliked" ? "text-red-500 font-bold" : "hover:text-foreground"}`}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Simulated Thinking Pipeline Indicator */}
            {thinkingStage && (
              <div className="flex items-center gap-2 text-xs text-purple-500 dark:text-purple-400 font-bold p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 animate-in fade-in duration-200">
                <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                <span>{thinkingStage}</span>
              </div>
            )}

            {/* Simulated Streaming Output Bubble */}
            {streamingText && !thinkingStage && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-none p-4 bg-card text-foreground border border-sky-500/40 text-xs leading-relaxed shadow-sm">
                  <p className="whitespace-pre-line leading-relaxed">{streamingText}<span className="inline-block w-1.5 h-3 bg-sky-500 ml-1 animate-pulse" /></p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Footer Bar */}
          <div className="p-3 border-t border-border/50 bg-card space-y-1.5 shrink-0">
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
                className="flex-1 rounded-2xl bg-muted/40 border border-border px-4 py-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || loading}
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 p-3 text-white disabled:opacity-50 hover:scale-105 transition-transform shadow-md shadow-sky-500/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="text-[10px] text-center text-muted-foreground">
              Powered by QbitX AI Provider Abstraction Layer (Demo Mode — Zero API Key Required).
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
