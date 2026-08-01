"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function MentorDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/mentor/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
      <RefreshCw className="h-8 w-8 animate-spin text-purple-500" />
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">
        Redirecting to Senior Mentor Operations Portal...
      </p>
    </div>
  );
}
