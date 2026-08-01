"use client";

import { useState } from "react";
import { StudentPortfolio } from "@/types/career";
import { X, Copy, Check, Globe, Shield } from "lucide-react";

export function PublicPortfolioModal({ portfolio, isOpen, onClose }: { portfolio: StudentPortfolio; isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `https://qbitx.vercel.app/portfolio/${portfolio.name.toLowerCase().replace(/\s+/g, "-")}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-xl text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 font-extrabold text-xs">
          <Globe className="h-4 w-4 text-purple-500" />
          <span>Shareable Digital Portfolio Link</span>
        </div>

        <h3 className="font-extrabold text-xl text-foreground font-heading">Public Portfolio URL</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Share your QbitX verified portfolio with recruiters, university faculty, and tech employers.
        </p>

        <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-2 text-xs font-mono text-foreground">
          <span className="truncate">{publicUrl}</span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
