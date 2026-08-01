"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PermissionService } from "@/services/admin/PermissionService";
import { AdminTopNavbar } from "./AdminTopNavbar";
import { AdminSidebar } from "./AdminSidebar";
import { RefreshCw, AlertTriangle } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login/student");
      } else if (!PermissionService.canAccessAdminPortal(user.role as string)) {
        if (user.role === "mentor") router.push("/mentor/dashboard");
        else router.push("/student/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
          Authenticating Platform Super Admin Access...
        </p>
      </div>
    );
  }

  const isAllowed = PermissionService.canAccessAdminPortal(user.role as string);

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground font-heading">Access Denied — Admin Authorization Required</h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Your account does not possess Super Admin permissions to access platform management modules.
        </p>
        <button
          onClick={() => {
            logout();
            router.push("/login/student");
          }}
          className="px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-extrabold hover:opacity-90"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <AdminTopNavbar />
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
