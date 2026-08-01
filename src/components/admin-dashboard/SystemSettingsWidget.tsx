"use client";

import { useState } from "react";
import { AdminDataService } from "@/services/admin/AdminDataService";
import { FeatureFlagItem } from "@/types/admin";
import { Settings, Sliders, ToggleLeft, ToggleRight, CheckCircle2, Shield } from "lucide-react";

export function SystemSettingsWidget() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>(AdminDataService.getFeatureFlags());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleFlag = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <span>System Settings & Feature Flags Control</span>
        </h2>
        <p className="text-xs text-muted-foreground">Manage platform configuration, feature flag toggles, grading scales, and maintenance modes.</p>
      </div>

      {/* Feature Flags Section */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-500" />
            <span>Platform Feature Flags</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Flags Updated
            </span>
          )}
        </div>

        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-foreground text-sm">{flag.name}</span>
                <p className="text-muted-foreground text-[11px]">{flag.description}</p>
                <span className="font-mono text-[10px] text-amber-500 font-bold block">Key: {flag.key}</span>
              </div>

              <button onClick={() => toggleFlag(flag.id)} className="p-1 text-2xl transition-all shrink-0">
                {flag.isEnabled ? (
                  <ToggleRight className="h-8 w-8 text-amber-500" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
