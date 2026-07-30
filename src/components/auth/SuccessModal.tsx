"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onConfirm: () => void;
}

export function SuccessModal({
  isOpen,
  title,
  message,
  buttonText = "Continue",
  onConfirm,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center space-y-4 relative">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <h3 className="text-xl font-extrabold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed">{message}</p>

        <button
          onClick={onConfirm}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:scale-105 transition-transform"
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
