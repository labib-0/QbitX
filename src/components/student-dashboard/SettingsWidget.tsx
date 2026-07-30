"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings, Shield, Bell, Trash2, Lock, Moon, Sun } from "lucide-react";

export function SettingsWidget() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [passNotifs, setPassNotifs] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-foreground tracking-tight font-heading flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            <span>Platform & Account Settings</span>
          </h2>
          <p className="text-xs text-muted-foreground">Manage appearance themes, notification channels, and account security.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-sm">
        
        {/* Theme Settings */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
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
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
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
              <span className="text-foreground font-semibold">PASS Senior Mentor meeting reminders</span>
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
          <h3 className="font-extrabold text-sm text-red-500 flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Danger Zone</span>
          </h3>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Permanently remove student account and learning records</span>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-3.5 py-2 text-xs font-bold transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-card p-6 space-y-4 text-center">
            <Trash2 className="h-10 w-10 mx-auto text-red-500" />
            <h3 className="font-extrabold text-lg text-foreground">Confirm Account Deletion</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to delete your student account? All course progress, certificates, and XP will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-bold text-foreground">Cancel</button>
              <button onClick={() => { alert("Account deleted. Redirecting..."); setShowDeleteModal(false); }} className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-xs font-bold hover:bg-red-600">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
