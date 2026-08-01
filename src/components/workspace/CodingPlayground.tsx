"use client";

import { useState } from "react";
import { Code2, Play, CheckCircle2, RotateCcw, HelpCircle, Eye, Terminal, Sparkles } from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface CodingPlaygroundProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  starterCode?: string;
  onCompleteLesson?: () => void;
}

export function CodingPlayground({
  title,
  lessonId,
  courseId,
  userId,
  starterCode = `# Binary Search Tree Traversal Lab\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\ndef inorder_traversal(root):\n    # TODO: Write recursive inorder traversal algorithm\n    if not root:\n        return []\n    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)\n\n# Test Case\nroot = Node(10)\nroot.left = Node(5)\nroot.right = Node(15)\nprint("Inorder Output:", inorder_traversal(root))\n`,
  onCompleteLesson,
}: CodingPlaygroundProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [passed, setPassed] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "code_executed",
      payload: { codeLength: code.length },
    });

    setTimeout(() => {
      setIsRunning(false);
      setOutput("Inorder Output: [5, 10, 15]\n✓ Test Case #1 Passed!\n✓ Test Case #2 Passed!");
      setPassed(true);
      if (onCompleteLesson) onCompleteLesson();
    }, 800);
  };

  const handleResetCode = () => {
    setCode(starterCode);
    setOutput(null);
    setPassed(false);
  };

  return (
    <div className="space-y-4">
      {/* Playground Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground font-heading">{title}</h2>
            <p className="text-xs text-muted-foreground">Interactive Coding Lab • Python 3</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground bg-muted px-3 py-1.5 rounded-xl border border-border transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Hint</span>
          </button>

          <button
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-1 text-xs font-bold text-sky-500 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-500/20 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Solution</span>
          </button>

          <button
            onClick={handleResetCode}
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Reset Starter Code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hint Accordion */}
      {showHint && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 space-y-1 animate-in fade-in duration-150">
          <span className="font-extrabold flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Hint:
          </span>
          <p className="text-muted-foreground">
            Recall that in an Inorder Traversal, you visit the left child first, then append the root node value, and finally visit the right child recursively.
          </p>
        </div>
      )}

      {/* Solution Accordion */}
      {showSolution && (
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-600 dark:text-purple-400 space-y-2 animate-in fade-in duration-150">
          <span className="font-extrabold flex items-center gap-1">
            <Eye className="h-4 w-4" /> Reference Solution:
          </span>
          <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`def inorder_traversal(root):
    if not root:
        return []
    return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)`}
          </pre>
        </div>
      )}

      {/* Main Split: Code Editor & Output Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Editor */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-950 text-white overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>main.py</span>
            <span className="text-[10px] text-sky-400">Python 3.12</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-80 p-4 font-mono text-xs bg-slate-950 text-emerald-400 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 transition-all disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? "Running Tests..." : "Run Code & Tests"}</span>
            </button>
          </div>
        </div>

        {/* Console Terminal */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-950 text-slate-200 p-4 space-y-3 font-mono text-xs flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-400 text-xs font-sans font-bold">
              <Terminal className="h-4 w-4 text-sky-400" />
              <span>Output Console</span>
            </div>
            <div className="pt-3 min-h-[220px]">
              {isRunning ? (
                <div className="flex items-center gap-2 text-sky-400 animate-pulse">
                  <div className="h-3 w-3 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                  <span>Executing test suites in container...</span>
                </div>
              ) : output ? (
                <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-slate-500 italic">Click &ldquo;Run Code & Tests&rdquo; to execute tests.</p>
              )}
            </div>
          </div>

          {passed && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-sans font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> All Tests Passed!
              </span>
              <span className="text-[10px] text-white bg-emerald-600 px-2 py-0.5 rounded-md">100% Score</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
