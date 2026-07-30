"use client";

import { useAuth } from "@/context/authContext";
import { ShieldCheck, ShieldAlert, Sparkles, Check, Info } from "lucide-react";

export function DemoAdminBanner() {
  const { adminApprovedToggle, setAdminApprovedToggle } = useAuth();

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span className="font-bold text-amber-400">Demo Environment Control:</span>
        <span className="hidden sm:inline text-slate-400">Toggle admin approvals & quick demo accounts</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle Admin Approval */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Mentor Admin Approved State:</span>
          <button
            type="button"
            onClick={() => setAdminApprovedToggle(!adminApprovedToggle)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              adminApprovedToggle
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            {adminApprovedToggle ? (
              <>
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Approved
              </>
            ) : (
              <>
                <ShieldAlert className="h-3 w-3 text-amber-400" /> Under Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
