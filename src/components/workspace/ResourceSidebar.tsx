"use client";

import { LearningResource } from "@/types/content";
import { Download, ExternalLink, Code2, FileText, X } from "lucide-react";

interface ResourceSidebarProps {
  resources: LearningResource[];
  onClose: () => void;
}

export function ResourceSidebar({ resources, onClose }: ResourceSidebarProps) {
  const getIcon = (type: string) => {
    if (type === "github_repo") return Code2;
    if (type === "pdf") return FileText;
    return ExternalLink;
  };

  return (
    <div className="w-full lg:w-80 shrink-0 border-l border-border/60 bg-card p-4 space-y-4 h-full flex flex-col justify-between shadow-2xl">
      <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-border shrink-0">
          <h3 className="font-extrabold text-sm text-foreground">Lesson Attachments & Resources</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
          {resources.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No attachments for this lesson.</p>
          ) : (
            resources.map((res) => {
              const IconComp = getIcon(res.type);
              return (
                <div key={res.id} className="p-3.5 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-foreground truncate">{res.title}</p>
                      <span className="text-[10px] text-muted-foreground capitalize">{res.type}</span>
                    </div>
                  </div>

                  {res.description && <p className="text-[11px] text-muted-foreground leading-relaxed">{res.description}</p>}

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-white border border-sky-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Access Resource</span>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
