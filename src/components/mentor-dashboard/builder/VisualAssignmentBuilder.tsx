"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import { AssignmentRubricCriterionBuilder } from "@/types/builder";

interface VisualAssignmentBuilderProps {
  onClose: () => void;
  onSave: (title: string, rubrics: AssignmentRubricCriterionBuilder[]) => void;
}

export function VisualAssignmentBuilder({ onClose, onSave }: VisualAssignmentBuilderProps) {
  const [title, setTitle] = useState("RAG Vector Search Capstone Assignment");
  const [rubrics, setRubrics] = useState<AssignmentRubricCriterionBuilder[]>([
    { id: "r-1", criterion: "Code Quality & Cleanliness", maxPoints: 25, description: "PEP8 formatting, proper function scoping" },
    { id: "r-2", criterion: "Functionality & Unit Tests", maxPoints: 35, description: "Passes all automated test cases" },
    { id: "r-3", criterion: "System Architecture & Design", maxPoints: 25, description: "Scalable vector store & retriever layer" },
    { id: "r-4", criterion: "Documentation & Readme", maxPoints: 15, description: "Clear setup instructions & API schema" },
  ]);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-extrabold text-lg text-foreground font-heading">Visual Assignment & Rubric Builder</h3>
            <p className="text-xs text-muted-foreground">Configure assignment title, rubric point weights, and submission criteria.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-foreground block mb-1">Assignment Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl bg-background border border-border p-2.5 font-bold" />
          </div>

          <div className="space-y-2">
            <span className="font-bold text-purple-500 block">Rubric Criteria Breakdown</span>
            {rubrics.map((r, idx) => (
              <div key={r.id} className="p-3 rounded-2xl bg-muted/40 border border-border space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={r.criterion}
                    onChange={(e) => {
                      const updated = [...rubrics];
                      updated[idx].criterion = e.target.value;
                      setRubrics(updated);
                    }}
                    className="flex-1 rounded-xl bg-background border border-border p-2 font-bold"
                  />
                  <input
                    type="number"
                    value={r.maxPoints}
                    onChange={(e) => {
                      const updated = [...rubrics];
                      updated[idx].maxPoints = parseInt(e.target.value, 10) || 0;
                      setRubrics(updated);
                    }}
                    className="w-20 rounded-xl bg-background border border-border p-2 font-bold text-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setRubrics([...rubrics, { id: `r-${Date.now()}`, criterion: "New Criterion", maxPoints: 20, description: "Description" }])}
            className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Add Rubric Criterion
          </button>
          <button onClick={() => { onSave(title, rubrics); onClose(); }} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md">
            Save Assignment & Rubric
          </button>
        </div>
      </div>
    </div>
  );
}
