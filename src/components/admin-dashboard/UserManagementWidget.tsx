"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminDataService } from "@/services/admin/AdminDataService";
import { PlatformUserItem } from "@/types/admin";
import { Users, Search, Shield, UserX, UserCheck, Key, Filter } from "lucide-react";

export function UserManagementWidget() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<PlatformUserItem[]>(AdminDataService.getUsers());
  const [resetModalUser, setResetModalUser] = useState<PlatformUserItem | null>(null);

  const handleToggleStatus = (id: string) => {
    AdminDataService.toggleUserStatus(id);
    setUsers([...AdminDataService.getUsers()]);
  };

  const filtered = users.filter(
    (u) => !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()) || u.role.includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            <span>Unified Platform User Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">Inspect, suspend, assign roles, and manage user accounts across QbitX.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or role..."
            className="w-full rounded-2xl bg-muted/40 border border-border pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Image src={u.avatar} alt={u.name} width={44} height={44} className="rounded-2xl object-cover shrink-0" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-foreground font-heading">{u.name}</h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 uppercase">
                    {u.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{u.email} • {u.organization}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setResetModalUser(u)}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-bold flex items-center gap-1"
                title="Reset Password Simulation"
              >
                <Key className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => handleToggleStatus(u.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                  u.status === "active"
                    ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                }`}
              >
                {u.status === "active" ? "Suspend Account" : "Reactivate Account"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
