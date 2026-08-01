"use client";

import { PublishingValidationResult } from "@/types/builder";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, X } from "lucide-react";

interface PublishingValidationModalProps {
  result: PublishingValidationResult;
  onPublish: () => void;
  onClose: () => void;
}

export function PublishingValidationModal({ result, onPublish, onClose }: PublishingValidationModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] font-extrabold text-purple-500 uppercase tracking-wider block">Pre-Publish Validation Engine</span>
            <h3 className="font-extrabold text-lg text-foreground font-heading">Course Quality Checklist</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {result.canPublish ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-500 text-xs font-bold">
              <ShieldCheck className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-extrabold text-sm">Course Passed Validation Check!</p>
                <p className="text-[11px] opacity-90">Ready for instant publication to live student enrollments.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-500 text-xs font-bold">
              <XCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-extrabold text-sm">Publication Blocked by {result.errorsCount} Errors</p>
                <p className="text-[11px] opacity-90">Resolve required errors before publishing content to students.</p>
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
            {result.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
                  issue.severity === "error" ? "bg-red-500/5 border-red-500/20 text-red-500" : "bg-amber-500/5 border-amber-500/20 text-amber-500"
                }`}
              >
                {issue.severity === "error" ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                <div className="space-y-0.5">
                  <p className="font-bold">{issue.message}</p>
                  {issue.fixActionHint && <p className="text-[10px] opacity-80">Hint: {issue.fixActionHint}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-muted text-xs font-bold text-foreground">
            Back to Editing
          </button>
          {result.canPublish && (
            <button onClick={onPublish} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20">
              Confirm & Publish Course Live
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
