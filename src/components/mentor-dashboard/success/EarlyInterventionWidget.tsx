"use client";

import { useState } from "react";
import Image from "next/image";
import { InterventionService } from "@/services/mentor/InterventionService";
import { AtRiskStudent } from "@/types/success";
import { AlertTriangle, CheckCircle2, ShieldAlert, Send, Clock, BookOpen } from "lucide-react";

export function EarlyInterventionWidget() {
  const [students, setStudents] = useState<AtRiskStudent[]>(InterventionService.getAtRiskStudents());
  const [dispatchedId, setDispatchedId] = useState<string | null>(null);

  const handleDispatch = (studentId: string) => {
    InterventionService.dispatchIntervention(studentId, "Labib Senior Mentor");
    setDispatchedId(studentId);
    setStudents([...InterventionService.getAtRiskStudents()]);
    setTimeout(() => setDispatchedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>Early Intervention Center — At-Risk Students</span>
          </h2>
          <p className="text-xs text-muted-foreground">Automated risk flags identifying students experiencing learning gaps or missed deadlines.</p>
        </div>

        <span className="text-xs font-extrabold bg-red-500/10 text-red-500 px-3.5 py-1.5 rounded-full border border-red-500/20">
          {students.filter((s) => s.interventionStatus === "pending").length} Action Required
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => (
          <div
            key={student.studentId}
            className="rounded-3xl border border-red-500/30 bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={student.avatar}
                    alt={student.studentName}
                    width={44}
                    height={44}
                    className="rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-foreground font-heading">{student.studentName}</h3>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                  student.riskLevel === "high" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}>
                  {student.riskLevel} Risk
                </span>
              </div>

              {/* Risk Factors */}
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 space-y-1.5 text-xs">
                <span className="font-bold text-muted-foreground block text-[10px] uppercase tracking-wider">Identified Risk Factors:</span>
                <ul className="space-y-1 font-medium">
                  {student.riskFactors.map((rf, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-red-500 font-medium text-[11px]">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>{rf}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1 text-xs">
                <span className="font-extrabold text-purple-600 dark:text-purple-300 block text-[10px] uppercase tracking-wider">Recommended Intervention:</span>
                <p className="text-foreground font-semibold leading-relaxed">{student.recommendedIntervention}</p>
              </div>
            </div>

            {student.interventionStatus === "dispatched" || dispatchedId === student.studentId ? (
              <div className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Intervention Dispatched & Logged</span>
              </div>
            ) : (
              <button
                onClick={() => handleDispatch(student.studentId)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Dispatch Recommended Intervention</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
