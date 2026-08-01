"use client";

import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Award, 
  Settings, 
  LogOut, 
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Headphones,
  Trophy
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

interface LeftSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAIAssistant?: () => void;
  onOpenHelpDesk?: () => void;
}

export function LeftSidebar({
  activeTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  onOpenAIAssistant,
  onOpenHelpDesk,
}: LeftSidebarProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { name: "My Learning", label: "My Courses", icon: BookOpen },
    { name: "AI Mentor Support", label: "AI Mentor Support", icon: Sparkles, onClick: onOpenAIAssistant },
    { name: "Help Desk", label: "Help Desk", icon: Headphones, onClick: onOpenHelpDesk },
    { name: "Learning Families", label: "My Team", icon: Users },
    { name: "Assignments", label: "Assignments", icon: CheckCircle2 },
    { name: "Certificates", label: "Certificates", icon: Award },
    { name: "Achievements", label: "Achievements", icon: Trophy },
    { name: "Settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login/student");
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 space-y-6">
      <div className="space-y-4">
        
        {/* Toggle Collapse Button Header (Below Logo) - No "Navigation" word */}
        {onToggleCollapse && (
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <button
              onClick={onToggleCollapse}
              className={`p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden lg:flex items-center gap-2 ${
                isCollapsed ? "mx-auto" : "w-full justify-between"
              }`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className={`text-xs font-bold text-muted-foreground ${isCollapsed ? "hidden" : "block"}`}>
                Menu
              </span>
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5 text-sky-500" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>
        )}

        {/* Essential Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    onSelectTab(item.name);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                } ${isCollapsed ? "justify-center px-2" : ""}`}
                title={item.label}
              >
                <IconComp className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-white" : "text-sky-500"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="pt-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
          title="Log Out"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Collapsible / Hideable) */}
      <aside
        className={`hidden lg:block border-r border-border bg-card/60 backdrop-blur-md shrink-0 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
          {SidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-card h-full z-10 shadow-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm font-extrabold text-foreground font-heading">Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              {SidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
