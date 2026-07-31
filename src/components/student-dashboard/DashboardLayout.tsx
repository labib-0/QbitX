"use client";

import React, { useState, useEffect } from "react";
import { TopNavbar } from "./TopNavbar";
import { LeftSidebar } from "./LeftSidebar";
import { RunningCourseCard } from "./RunningCourseCard";
import { ModuleTrackBar } from "./ModuleTrackBar";
import { AllCoursesGrid } from "./AllCoursesGrid";
import { NoticePanel } from "./NoticePanel";
import { QuickTilesGrid } from "./QuickTilesGrid";
import { RightSidebar } from "./RightSidebar";

import { LearningFamilyWidget } from "./LearningFamilyWidget";
import { AIAssistantWidget } from "./AIAssistantWidget";
import { AssignmentsWidget } from "./AssignmentsWidget";
import { CertificatesWidget } from "./CertificatesWidget";
import { ProfileWidget } from "./ProfileWidget";
import { SettingsWidget } from "./SettingsWidget";
import { HelpDeskModal } from "./HelpDeskModal";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { RefreshCw, Bot } from "lucide-react";

export function StudentDashboardLayout() {
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showFloatingAI, setShowFloatingAI] = useState(false);
  const [showHelpDeskModal, setShowHelpDeskModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Protected Route Check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login/student");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-xs font-bold text-muted-foreground font-heading uppercase tracking-wider">
          Loading QbitX Student Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased relative">
      
      {/* Top Navbar */}
      <TopNavbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onOpenAIAssistant={() => setShowFloatingAI(true)}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      <div className="flex-1 flex w-full mx-auto">
        
        {/* Left Sidebar Navigation (Collapsible / Hideable) */}
        <LeftSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenAIAssistant={() => setShowFloatingAI(true)}
          onOpenHelpDesk={() => setShowHelpDeskModal(true)}
        />

        {/* Main Content Area (Fluid 100% Responsive Canvas) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 xl:p-10 space-y-8">
          
          {activeTab === "Dashboard" && (
            <div className="flex flex-col lg:flex-row items-start gap-8">
              
              {/* Main Workspace Segment (Fills 100% available space dynamically) */}
              <div className="flex-1 min-w-0 space-y-8 w-full">
                
                {/* 1. Running Course / Last Access Course Hero Card */}
                <RunningCourseCard
                  onContinueCourse={() => alert("Continuing Introduction to Programming Language")}
                  onViewOutline={() => alert("Viewing Course Outline")}
                />

                {/* 2. Module Finish Track Bar */}
                <ModuleTrackBar />

                {/* 3. All Courses Grid Section (Scales dynamically up to 4 columns!) */}
                <AllCoursesGrid />

                {/* 4. Quick Action Tiles Grid (My Team, Certificates, My Courses, Profile) */}
                <QuickTilesGrid onSelectTab={(tab) => setActiveTab(tab)} />

              </div>

              {/* Right Notice & Deadlines Segment (Fixed Width Sidebar) */}
              <div className="w-full lg:w-80 xl:w-96 2xl:w-[400px] shrink-0 space-y-6 lg:sticky lg:top-20">
                
                {/* Notice Panel */}
                <NoticePanel />

                {/* Today's Tasks & Deadlines Checklist */}
                <RightSidebar />

              </div>

            </div>
          )}

          {activeTab === "My Learning" && (
            <>
              <RunningCourseCard
                onContinueCourse={() => alert("Continuing Introduction to Programming Language")}
                onViewOutline={() => alert("Viewing Course Outline")}
              />
              <AllCoursesGrid />
            </>
          )}

          {activeTab === "Learning Families" && <LearningFamilyWidget />}
          {activeTab === "Assignments" && <AssignmentsWidget />}
          {activeTab === "Certificates" && <CertificatesWidget />}
          {activeTab === "Settings" && <SettingsWidget />}
          {activeTab === "Profile" && <ProfileWidget />}

        </main>

      </div>

      {/* Floating AI Chatbot Button (Right Bottom Corner) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowFloatingAI(!showFloatingAI)}
          className="flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-extrabold text-xs shadow-2xl shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all animate-bounce hover:animate-none group font-heading"
          title="Open AI Mentor Support"
          aria-label="Open AI Mentor Support"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="hidden sm:inline tracking-wide font-bold">AI Mentor</span>
        </button>
      </div>

      {/* Floating AI Assistant Drawer */}
      {showFloatingAI && (
        <AIAssistantWidget isFloating onCloseFloating={() => setShowFloatingAI(false)} />
      )}

      {/* Help Desk Modal */}
      <HelpDeskModal
        isOpen={showHelpDeskModal}
        onClose={() => setShowHelpDeskModal(false)}
      />

    </div>
  );
}

