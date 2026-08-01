"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Bookmark, Code2, Sparkles, FileText, ArrowRight } from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface ReadingViewerProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onCompleteLesson?: () => void;
  onBookmarkSnippet?: (snippet: string) => void;
}

export function ReadingViewer({
  title,
  lessonId,
  courseId,
  userId,
  onCompleteLesson,
  onBookmarkSnippet,
}: ReadingViewerProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "lesson_completed",
      payload: { lessonType: "reading" },
    });
    if (onCompleteLesson) onCompleteLesson();
  };

  const sampleSnippet = `class BSTNode:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None

def insert(node, key):
    if node is None:
        return BSTNode(key)
    if key < node.key:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)
    return node`;

  const handleBookmarkCode = () => {
    if (onBookmarkSnippet) onBookmarkSnippet(sampleSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full w-fit">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Interactive Reading & Reference Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">{title}</h1>
        <p className="text-xs text-muted-foreground">Estimated Reading Time: <strong>12 mins</strong> • Difficulty: <strong>Intermediate</strong></p>
      </div>

      {/* Article Content */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm leading-relaxed text-sm text-foreground">
        <h2 className="text-xl font-extrabold text-foreground font-heading">1. Understanding Binary Search Trees (BST)</h2>
        <p className="text-muted-foreground leading-relaxed">
          A <strong>Binary Search Tree (BST)</strong> is a node-based binary tree data structure which has the following properties:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>The left subtree of a node contains only nodes with keys <strong>lesser</strong> than the node’s key.</li>
          <li>The right subtree of a node contains only nodes with keys <strong>greater</strong> than the node’s key.</li>
          <li>The left and right subtree each must also be a binary search tree.</li>
        </ul>

        {/* Callout Box */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-600 dark:text-sky-400 space-y-1">
          <span className="font-extrabold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Pro Tip: Time Complexity Note
          </span>
          <p className="text-muted-foreground">
            Search, Insertion, and Deletion operations in a balanced BST run in <strong>O(log N)</strong> time. However, if the tree becomes skewed (like a linked list), complexity degrades to <strong>O(N)</strong>.
          </p>
        </div>

        <h2 className="text-xl font-extrabold text-foreground font-heading">2. Python BST Implementation</h2>
        
        {/* Code Snippet Box */}
        <div className="relative rounded-2xl bg-slate-950 text-white p-4 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400 font-sans">
            <span className="flex items-center gap-1.5 font-bold">
              <Code2 className="h-3.5 w-3.5 text-sky-400" /> bst_implementation.py
            </span>
            <button
              onClick={handleBookmarkCode}
              className="flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors font-bold"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{copiedSnippet ? "Bookmarked!" : "Bookmark Code"}</span>
            </button>
          </div>
          <pre className="leading-relaxed font-mono text-slate-200">{sampleSnippet}</pre>
        </div>

        {/* Reading Completion Footer */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground font-medium">Have you finished reading all sections?</span>
          <button
            onClick={handleComplete}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
              completed
                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                : "bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{completed ? "Completed & Verified!" : "Mark Reading Completed"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
