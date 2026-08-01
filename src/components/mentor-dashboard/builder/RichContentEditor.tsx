"use client";

import { useState } from "react";
import { Bold, Italic, Code, Image as ImageIcon, Link2, List, CheckSquare, Sparkles, CheckCircle2 } from "lucide-react";

interface RichContentEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
}

export function RichContentEditor({
  initialContent = `# Lesson 1: Introduction to Python Syntax\n\nWelcome to Python 3 programming! In this lesson, we will explore fundamental syntax rules, variables, and primitive data types.\n\n### Key Concepts:\n- **Dynamic Typing**: Variables take type automatically based on assigned value.\n- **Indentation Rules**: Python uses 4-space indentation for code block scoping.\n\n\`\`\`python\ndef greet(name):\n    return f"Hello, {name}!"\n\`\`\``,
  onSave,
}: RichContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(true);

  const handleChange = (newVal: string) => {
    setContent(newVal);
    setIsSaved(false);
    setTimeout(() => {
      setIsSaved(true);
      if (onSave) onSave(newVal);
    }, 600);
  };

  const insertText = (prefix: string, suffix: string = "") => {
    setContent((prev) => prev + `\n${prefix}sample text${suffix}\n`);
    setIsSaved(false);
  };

  return (
    <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm flex flex-col justify-between">
      {/* Editor Toolbar */}
      <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
        <div className="flex items-center gap-1">
          <button onClick={() => insertText("**", "**")} className="p-2 rounded-xl hover:bg-muted font-bold text-foreground" title="Bold">
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => insertText("*", "*")} className="p-2 rounded-xl hover:bg-muted text-foreground" title="Italic">
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => insertText("```python\n", "\n```")} className="p-2 rounded-xl hover:bg-muted text-purple-500 font-mono" title="Code Block">
            <Code className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => insertText("- ")} className="p-2 rounded-xl hover:bg-muted text-foreground" title="Bullet List">
            <List className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => insertText("- [ ] ")} className="p-2 rounded-xl hover:bg-muted text-emerald-500" title="Checklist">
            <CheckSquare className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => insertText("> [!NOTE]\n> ")} className="p-2 rounded-xl hover:bg-muted text-sky-500" title="Callout Box">
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          {isSaved ? (
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <CheckCircle2 className="h-3 w-3" /> All changes auto-saved to draft
            </span>
          ) : (
            <span className="text-amber-500 font-bold">Saving draft...</span>
          )}
        </div>
      </div>

      {/* Editor Textarea Canvas */}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-96 p-6 font-mono text-xs bg-background text-foreground focus:outline-none resize-none leading-relaxed"
        placeholder="Write lesson markdown content..."
      />
    </div>
  );
}
