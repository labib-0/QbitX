"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  isStreaming?: boolean;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language.trim() || "code";

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800/80 text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 uppercase font-semibold tracking-wider text-sky-400">
          <Terminal className="h-3 w-3" />
          {displayLang}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-100 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto text-[11px] font-mono leading-relaxed custom-scrollbar">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Parse inline markdown tokens: bold, italic, inline code, links
 */
function renderInlineContent(text: string): React.ReactNode[] {
  // Regex token matching for inline markdown elements:
  // 1. Inline code: `code`
  // 2. Bold: **text** or __text__
  // 3. Italic: *text* or _text_
  // 4. Link: [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+(?!\*)|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-300 font-mono text-[11px] font-medium border border-sky-500/20"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold
    if (
      (part.startsWith("**") && part.endsWith("**") && part.length >= 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length >= 4)
    ) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-foreground">
          {inner.includes("`") ? renderInlineContent(inner) : inner}
        </strong>
      );
    }

    // Italic
    if (
      part.startsWith("*") &&
      part.endsWith("*") &&
      part.length >= 2 &&
      !part.startsWith("**")
    ) {
      return (
        <em key={idx} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Markdown Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 dark:text-sky-400 underline decoration-sky-500/30 hover:decoration-sky-500 font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Normal plain text
    return <span key={idx}>{part}</span>;
  });
}

/**
 * MarkdownRenderer component
 * Light-weight, zero-dependency Markdown parser and styler for AI Mentor & comments.
 */
export function MarkdownRenderer({ content, className = "", isStreaming = false }: MarkdownRendererProps) {
  if (!content) return null;

  // Split into lines for block-level parsing, normalizing newlines
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];

  let inUnorderedList = false;
  let listItems: React.ReactNode[] = [];

  let inOrderedList = false;
  let orderedListItems: React.ReactNode[] = [];

  const flushUnorderedList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-2 space-y-1 pl-4 list-disc marker:text-sky-500 text-xs">
          {listItems}
        </ul>
      );
      listItems = [];
      inUnorderedList = false;
    }
  };

  const flushOrderedList = (key: string) => {
    if (orderedListItems.length > 0) {
      elements.push(
        <ol key={key} className="my-2 space-y-1 pl-4 list-decimal marker:text-sky-500 text-xs">
          {orderedListItems}
        </ol>
      );
      orderedListItems = [];
      inOrderedList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check for fenced code block boundary
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // Closing code block
        elements.push(
          <CodeBlock
            key={`code-${i}`}
            language={codeBlockLang}
            code={codeBlockLines.join("\n")}
          />
        );
        inCodeBlock = false;
        codeBlockLang = "";
        codeBlockLines = [];
      } else {
        // Flush any active lists before code block
        flushUnorderedList(`ul-before-code-${i}`);
        flushOrderedList(`ol-before-code-${i}`);

        inCodeBlock = true;
        codeBlockLang = trimmed.replace(/^```/, "").trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Unordered list item: * or -
    const ulMatch = rawLine.match(/^(\s*)[*-]\s+(.+)$/);
    if (ulMatch) {
      flushOrderedList(`ol-before-ul-${i}`);
      inUnorderedList = true;
      listItems.push(
        <li key={`li-${i}`} className="leading-relaxed">
          {renderInlineContent(ulMatch[2])}
        </li>
      );
      continue;
    }

    // Ordered list item: 1. 2. etc.
    const olMatch = rawLine.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      flushUnorderedList(`ul-before-ol-${i}`);
      inOrderedList = true;
      orderedListItems.push(
        <li key={`oli-${i}`} className="leading-relaxed">
          {renderInlineContent(olMatch[2])}
        </li>
      );
      continue;
    }

    // If not a list item, flush any open lists
    if (inUnorderedList) {
      flushUnorderedList(`ul-flush-${i}`);
    }
    if (inOrderedList) {
      flushOrderedList(`ol-flush-${i}`);
    }

    // Blank line
    if (!trimmed) {
      continue;
    }

    // Headers
    if (trimmed.startsWith("#### ")) {
      elements.push(
        <h5 key={`h5-${i}`} className="font-bold text-xs text-foreground mt-3 mb-1">
          {renderInlineContent(trimmed.slice(5))}
        </h5>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="font-bold text-sm text-foreground mt-3 mb-1.5 flex items-center gap-1.5 font-heading">
          {renderInlineContent(trimmed.slice(4))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-extrabold text-sm text-foreground mt-3.5 mb-1.5 font-heading">
          {renderInlineContent(trimmed.slice(3))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-black text-base text-foreground mt-4 mb-2 font-heading">
          {renderInlineContent(trimmed.slice(2))}
        </h2>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-sky-500 pl-3 my-2 text-muted-foreground italic text-xs bg-sky-500/5 py-1 rounded-r"
        >
          {renderInlineContent(trimmed.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-border" />);
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 leading-relaxed text-xs">
        {renderInlineContent(trimmed)}
      </p>
    );
  }

  // Flush any open lists or unfinished code blocks at EOF
  flushUnorderedList("ul-eof");
  flushOrderedList("ol-eof");

  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <CodeBlock
        key="code-eof"
        language={codeBlockLang}
        code={codeBlockLines.join("\n")}
      />
    );
  }

  return (
    <div className={`space-y-1 text-xs break-words ${className}`}>
      {elements}
      {isStreaming && (
        <span className="inline-block w-1.5 h-3 bg-sky-500 ml-1 rounded animate-pulse align-middle" />
      )}
    </div>
  );
}
