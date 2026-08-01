"use client";

import { AdminDataService } from "@/services/admin/AdminDataService";
import { Building2, Users, BookOpen, Globe } from "lucide-react";

export function OrganizationManagerWidget() {
  const orgs = AdminDataService.getOrganizations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Building2 className="h-6 w-6 text-amber-500" />
            <span>Multi-Tenant Organization Readiness</span>
          </h2>
          <p className="text-xs text-muted-foreground">Tenant-ready framework for Universities, Colleges, Bootcamps, and Enterprise Training Centers.</p>
        </div>

        <span className="text-xs font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-300 px-3.5 py-1.5 rounded-full border border-amber-500/20">
          {orgs.length} Partner Organizations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orgs.map((org) => (
          <div key={org.id} className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider block">{org.type} Partner</span>
                <h3 className="font-extrabold text-lg text-foreground font-heading">{org.name}</h3>
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                {org.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                <Users className="h-4 w-4 mx-auto mb-1 text-purple-500" />
                <span className="font-extrabold text-foreground">{org.studentsCount}</span>
                <p className="text-[10px] text-muted-foreground">Students</p>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                <Users className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                <span className="font-extrabold text-foreground">{org.mentorsCount}</span>
                <p className="text-[10px] text-muted-foreground">Mentors</p>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border">
                <BookOpen className="h-4 w-4 mx-auto mb-1 text-sky-500" />
                <span className="font-extrabold text-foreground">{org.coursesCount}</span>
                <p className="text-[10px] text-muted-foreground">Courses</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-muted/30 border border-border/80 text-xs font-mono flex items-center justify-between text-muted-foreground">
              <span>Domain SSO: {org.domain}</span>
              <Globe className="h-3.5 w-3.5 text-amber-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
