"use client";

import { useState, useEffect } from "react";
import { FeatureFlagItem } from "@/types/admin";
import { Settings, Sliders, ToggleLeft, ToggleRight, CheckCircle2, Loader2 } from "lucide-react";

export function SystemSettingsWidget() {
  const [flags, setFlags] = useState<FeatureFlagItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlags() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setFlags(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFlags();
  }, []);

  const toggleFlag = async (id: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    setUpdatingId(id);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          isEnabled: nextState,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update feature flag");
      }

      setFlags((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isEnabled: nextState } : f))
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update feature flag.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <span>System Settings & Feature Flags Control</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          Manage platform configuration, feature flag toggles, grading scales, and maintenance modes.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Feature Flags Section */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-foreground font-heading flex items-center gap-2">
            <Sliders className="h-4 w-4 text-amber-500" />
            <span>Platform Feature Flags</span>
          </h3>
          {savedSuccess && (
            <span className="text-xs font-extrabold text-emerald-500 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" /> Flags Updated & Saved
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span className="text-xs">Loading feature flags...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {flags.map((flag) => {
              const isUpdating = updatingId === flag.id;
              return (
                <div
                  key={flag.id}
                  className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-4 text-xs hover:border-amber-500/30 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-foreground text-sm">{flag.name}</span>
                    <p className="text-muted-foreground text-[11px]">{flag.description}</p>
                    <span className="font-mono text-[10px] text-amber-500 font-bold block">
                      Key: {flag.key}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFlag(flag.id, flag.isEnabled)}
                    disabled={isUpdating}
                    className="p-1 text-2xl transition-all shrink-0 hover:scale-105 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
                    ) : flag.isEnabled ? (
                      <ToggleRight className="h-8 w-8 text-amber-500" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-muted-foreground" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
