"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[QbitX App Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans antialiased">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h2 className="text-2xl font-black text-foreground font-heading">
          Something went wrong
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error.message || "An unexpected error occurred while rendering this page."}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-extrabold hover:opacity-90 transition-all font-heading shadow-md"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground text-xs font-bold transition-all border border-border"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
