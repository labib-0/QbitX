"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings, Bell, Trash2, Moon, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export function SettingsWidget() {
  const { logout } = useAuth();
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [passNotifs, setPassNotifs] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setDeleteError('Please type "DELETE" to confirm account termination.');
      return;
    }

    try {
      setDeleting(true);
      setDeleteError(null);

      const res = await fetch("/api/student/account", {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete account. Please try again.");
      }

      // Invalidate client session
      await logout();
      setShowDeleteModal(false);
      router.push("/");
    } catch (err: any) {
      setDeleteError(err.message || "An unexpected error occurred during account deletion.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            <span>Platform & Account Settings</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage appearance themes, notification preferences, and account security.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
        {/* Theme Settings */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 font-heading">
            <Moon className="h-4 w-4 text-sky-500" />
            <span>Appearance & Theme</span>
          </h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Switch between Light Mode and Dark Mode</span>
            <ThemeToggle />
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2 font-heading">
            <Bell className="h-4 w-4 text-purple-500" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground font-semibold">Email notifications for assignment due dates</span>
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={() => setEmailNotifs(!emailNotifs)}
                className="rounded border-border text-sky-500 focus:ring-sky-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-foreground font-semibold">Mentor review updates and feedback alerts</span>
              <input
                type="checkbox"
                checked={passNotifs}
                onChange={() => setPassNotifs(!passNotifs)}
                className="rounded border-border text-sky-500 focus:ring-sky-500"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-3">
          <h3 className="font-extrabold text-sm text-red-500 flex items-center gap-2 font-heading">
            <Trash2 className="h-4 w-4" />
            <span>Danger Zone</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">Permanently remove student account</span>
              <p className="text-muted-foreground text-[11px]">
                Deletes all enrolled courses, progress records, project submissions, and certificates from PostgreSQL.
              </p>
            </div>
            <button
              onClick={() => {
                setConfirmText("");
                setDeleteError(null);
                setShowDeleteModal(true);
              }}
              className="rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-2 text-xs font-bold transition-all shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-card p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-lg text-foreground font-heading">Confirm Permanent Deletion</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This operation is irreversible. All your enrolled courses, lesson progress, submissions, and verified credentials will be permanently erased.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                {deleteError}
              </div>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-foreground block">
                Type <strong className="text-red-500">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                placeholder="DELETE"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full rounded-xl bg-muted/40 border border-border px-3.5 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-center uppercase"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-bold text-foreground hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText !== "DELETE"}
                className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-xs font-bold hover:bg-red-600 disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
