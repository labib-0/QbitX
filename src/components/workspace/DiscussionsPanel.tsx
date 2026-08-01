"use client";

import { useState, useEffect } from "react";
import { MessageSquare, ThumbsUp, Send, CheckCircle2, ShieldCheck, X } from "lucide-react";
import Image from "next/image";
import { DiscussionThread } from "@/types/workspace";
import { WorkspaceService } from "@/services/workspace/WorkspaceService";

interface DiscussionsPanelProps {
  userId: string;
  userName: string;
  lessonId: string;
  onClose: () => void;
}

export function DiscussionsPanel({ userId, userName, lessonId, onClose }: DiscussionsPanelProps) {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionBody, setNewQuestionBody] = useState("");
  const [activeReplyThreadId, setActiveReplyThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setThreads(WorkspaceService.getDiscussions(lessonId));
  }, [lessonId]);

  const handlePostThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;

    const created = WorkspaceService.addDiscussion({
      lessonId,
      authorId: userId,
      authorName: userName,
      authorRole: "student",
      title: newQuestionTitle,
      content: newQuestionBody,
      isPinned: false,
      isResolved: false,
      tags: ["q-and-a"],
    });

    setThreads([created, ...threads]);
    setNewQuestionTitle("");
    setNewQuestionBody("");
  };

  const handlePostComment = (threadId: string) => {
    if (!replyText.trim()) return;
    const added = WorkspaceService.addComment(threadId, lessonId, {
      authorId: userId,
      authorName: userName,
      authorRole: "student",
      content: replyText,
    });
    if (added) {
      setThreads(WorkspaceService.getDiscussions(lessonId));
      setReplyText("");
      setActiveReplyThreadId(null);
    }
  };

  return (
    <div className="w-full lg:w-[420px] shrink-0 border-l border-border/60 bg-card p-4 space-y-4 h-full flex flex-col justify-between shadow-2xl">
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-sky-500" />
            <h3 className="font-extrabold text-sm text-foreground">Lesson Q&A Discussion</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Post New Question Form */}
        <form onSubmit={handlePostThread} className="p-3.5 rounded-2xl bg-muted/40 border border-border space-y-2 shrink-0">
          <input
            type="text"
            value={newQuestionTitle}
            onChange={(e) => setNewQuestionTitle(e.target.value)}
            placeholder="Ask a question about this lesson..."
            required
            className="w-full rounded-xl bg-background border border-border px-3 py-2 text-xs font-bold text-foreground focus:outline-none"
          />
          <textarea
            rows={2}
            value={newQuestionBody}
            onChange={(e) => setNewQuestionBody(e.target.value)}
            placeholder="Describe your issue or code snippet..."
            required
            className="w-full rounded-xl bg-background border border-border p-3 text-xs text-foreground focus:outline-none resize-none"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20">
              Post Question
            </button>
          </div>
        </form>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
          {threads.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No discussions yet. Be the first to ask!</p>
          ) : (
            threads.map((thread) => (
              <div key={thread.id} className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={thread.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"}
                    alt={thread.authorName}
                    width={28}
                    height={28}
                    className="rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{thread.authorName}</p>
                    <span className="text-[10px] text-muted-foreground">{thread.authorRole === "mentor" ? "Senior Mentor" : "Student"}</span>
                  </div>
                  {thread.isResolved && (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Resolved
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-foreground font-heading">{thread.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{thread.content}</p>
                </div>

                {/* Comments / Mentor Answers */}
                {thread.comments.length > 0 && (
                  <div className="pl-3 border-l-2 border-sky-500/40 space-y-2 pt-1">
                    {thread.comments.map((comm) => (
                      <div key={comm.id} className="p-2.5 rounded-xl bg-muted/40 border border-border/50 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-foreground flex items-center gap-1">
                            {comm.authorName}
                            {comm.isInstructorAnswer && (
                              <span className="text-[9px] font-extrabold text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                Mentor Answer
                              </span>
                            )}
                          </span>
                          <span className="text-muted-foreground text-[10px] flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3 text-sky-500" /> {comm.upvotesCount}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{comm.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form Trigger */}
                {activeReplyThreadId === thread.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full rounded-xl bg-muted/40 border border-border p-2 text-xs text-foreground focus:outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setActiveReplyThreadId(null)} className="px-3 py-1 rounded-lg text-xs bg-muted">Cancel</button>
                      <button onClick={() => handlePostComment(thread.id)} className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-500 text-white">Reply</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyThreadId(thread.id)}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1 block"
                  >
                    + Reply to Thread
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
