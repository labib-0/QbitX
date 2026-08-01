"use client";

import { useState } from "react";
import Image from "next/image";
import { CertificateApprovalService } from "@/services/mentor/CertificateApprovalService";
import { CertificateApprovalItem } from "@/types/success";
import { Award, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export function CertificateApprovalWidget() {
  const [items, setItems] = useState<CertificateApprovalItem[]>(CertificateApprovalService.getCertificateItems());

  const handleApprove = (id: string) => {
    CertificateApprovalService.approveCertificate(id, "Labib Senior Mentor");
    setItems([...CertificateApprovalService.getCertificateItems()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-500" />
            <span>Certificate Approval & Eligibility Hub</span>
          </h2>
          <p className="text-xs text-muted-foreground">Review student course completion requirements and issue verified certificates.</p>
        </div>

        <span className="text-xs font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-300 px-3.5 py-1.5 rounded-full border border-purple-500/20">
          {items.filter((i) => i.status === "eligible").length} Eligible Requests
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Image src={item.studentAvatar} alt={item.studentName} width={44} height={44} className="rounded-2xl object-cover" />
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-base text-foreground font-heading">{item.studentName}</h3>
                <p className="text-xs text-muted-foreground">
                  Course: <strong className="text-foreground">{item.courseTitle}</strong>
                </p>
                <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground pt-1">
                  <span>Completion: <strong className="text-emerald-500">{item.completionPct}%</strong></span>
                  <span>Avg Grade: <strong className="text-purple-500">{item.averageGradePct}%</strong></span>
                </div>
              </div>
            </div>

            {item.status === "approved" ? (
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="h-4 w-4" /> Approved & Issued
              </span>
            ) : (
              <button
                onClick={() => handleApprove(item.id)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-500/20 shrink-0"
              >
                Approve & Issue Certificate
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
