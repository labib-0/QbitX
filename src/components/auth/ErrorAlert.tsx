"use client";

import { AlertCircle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 animate-in fade-in duration-200">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-400 hover:text-red-200 shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
