"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminDataService } from "@/services/admin/AdminDataService";
import { MentorApplication } from "@/types/admin";
import { UserCheck, CheckCircle2, Award, Clock } from "lucide-react";

export function MentorApprovalWidget() {
  const [apps, setApps] = useState<MentorApplication[]>(AdminDataService.getMentorApplications());

  const handleApprove = (id: string) => {
    AdminDataService.approveMentorApplication(id);
    setApps([...AdminDataService.getMentorApplications()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-amber-500" />
            <span>Senior Mentor Application Approvals & Workload</span>
          </h2>
          <p className="text-xs text-muted-foreground">Review academic credentials, approve mentor portal applications, and monitor teaching workloads.</p>
        </div>

        <span className="text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          {apps.filter((a) => a.status === "pending").length} Applications Pending
        </span>
      </div>

      <div className="space-y-4">
        {apps.map((app) => (
          <div key={app.id} className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Image src={app.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"} alt={app.applicantName} width={48} height={48} className="rounded-2xl object-cover shrink-0" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-foreground font-heading">{app.applicantName}</h3>
                <p className="text-xs text-muted-foreground">{app.email} • {app.academicDegree}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {app.expertise.map((exp, i) => (
                    <span key={i} className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-md text-foreground">{exp}</span>
                  ))}
                </div>
              </div>
            </div>

            {app.status === "approved" ? (
              <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-4 w-4" /> Application Approved
              </span>
            ) : (
              <button
                onClick={() => handleApprove(app.id)}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-md shadow-amber-500/20 shrink-0"
              >
                Approve & Grant Mentor Access
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
