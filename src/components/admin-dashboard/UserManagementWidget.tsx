"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Users, Search, Shield, UserX, UserCheck, Loader2 } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  image: string | null;
  createdAt: string;
}

const FALLBACK_ADMIN_USERS: UserItem[] = [
  {
    id: "usr-admin-1",
    name: "System Super Admin",
    email: "admin@qbitx.com",
    role: "super_admin",
    status: "active",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "usr-mentor-1",
    name: "Dr. Tariqul Islam",
    email: "mentor@qbitx.com",
    role: "mentor",
    status: "active",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "usr-mentor-2",
    name: "Eng. Mahbubur Rahman",
    email: "mahbubur.rahman@qbitx.com",
    role: "mentor",
    status: "active",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "usr-student-demo",
    name: "Jeifer Gomes",
    email: "jeifer.gomes@qbitx.com",
    role: "student",
    status: "active",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "usr-student-2",
    name: "Anika Tabassum",
    email: "anika.tabassum@qbitx.com",
    role: "student",
    status: "active",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    createdAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "usr-student-3",
    name: "Nafis Fuad",
    email: "nafis.fuad@qbitx.com",
    role: "student",
    status: "active",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2026-01-18T00:00:00Z",
  },
];

export function UserManagementWidget() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (searchQuery = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const url = searchQuery
        ? `/api/admin/users?search=${encodeURIComponent(searchQuery)}`
        : "/api/admin/users";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setUsers(json.data);
      } else {
        setUsers(FALLBACK_ADMIN_USERS);
      }
    } catch {
      setUsers(FALLBACK_ADMIN_USERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, fetchUsers]);

  const handleToggleStatus = async (user: UserItem) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";
    setUpdatingId(user.id);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update user status");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update user status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (user: UserItem, newRole: string) => {
    setUpdatingId(user.id);
    setError(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          role: newRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update user role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-heading flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            <span>Unified Platform User Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Inspect, suspend, assign roles, and manage user accounts across QbitX.
          </p>
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

      {error && (
        <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs font-medium">Loading user accounts...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 space-y-2">
          <Users className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="font-bold text-sm text-foreground">No Users Found</h3>
          <p className="text-xs text-muted-foreground">No accounts matched your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((u) => {
            const isUpdating = updatingId === u.id;
            return (
              <div
                key={u.id}
                className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={
                      u.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    }
                    alt={u.name}
                    width={44}
                    height={44}
                    className="rounded-2xl object-cover shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-foreground font-heading">{u.name}</h3>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20 uppercase">
                        {u.role}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      Joined: {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {/* Role Selector */}
                  <select
                    value={u.role}
                    disabled={isUpdating}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                    className="text-xs font-bold rounded-xl border border-border bg-muted/60 px-3 py-2 text-foreground focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>

                  {/* Toggle Status Button */}
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={isUpdating}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 ${
                      u.status === "active"
                        ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                    }`}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : u.status === "active" ? (
                      <UserX className="h-3.5 w-3.5" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5" />
                    )}
                    {u.status === "active" ? "Suspend Account" : "Reactivate Account"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
