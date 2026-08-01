"use client";

import { useState } from "react";
import { HelpCircle, Plus, Trash2, CheckCircle2, Sliders, X } from "lucide-react";
import { QuizQuestionBuilder } from "@/types/builder";

interface VisualQuizBuilderProps {
  onClose: () => void;
  onSave: (questions: QuizQuestionBuilder[]) => void;
}

export function VisualQuizBuilder({ onClose, onSave }: VisualQuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestionBuilder[]>([
    {
      id: "q-1",
      type: "mcq",
      questionText: "What is the worst-case time complexity of Binary Search?",
      options: ["O(N)", "O(log N)", "O(N log N)", "O(1)"],
      correctAnswers: [1],
      explanation: "Binary Search divides the search space in half at each step, resulting in logarithmic time complexity.",
      difficulty: "beginner",
      points: 10,
    },
  ]);

  const handleAddQuestion = () => {
    const newQ: QuizQuestionBuilder = {
      id: `q-${Date.now()}`,
      type: "mcq",
      questionText: "New Question Text...",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswers: [0],
      explanation: "Explanation hint...",
      difficulty: "intermediate",
      points: 10,
    };
    setQuestions([...questions, newQ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="font-extrabold text-lg text-foreground font-heading">Visual Quiz Builder</h3>
            <p className="text-xs text-muted-foreground">Author questions, set correct answers, explanations, and passing thresholds.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-500">Question #{idx + 1} ({q.points} Points)</span>
                {questions.length > 1 && (
                  <button onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))} className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={q.questionText}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[idx].questionText = e.target.value;
                  setQuestions(updated);
                }}
                className="w-full rounded-xl bg-background border border-border p-2.5 font-semibold text-foreground"
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={q.correctAnswers.includes(optIdx)}
                      onChange={() => {
                        const updated = [...questions];
                        updated[idx].correctAnswers = [optIdx];
                        setQuestions(updated);
                      }}
                      className="accent-purple-600"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].options[optIdx] = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full rounded-xl bg-background border border-border p-2 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={handleAddQuestion} className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Question
          </button>
          <button onClick={() => { onSave(questions); onClose(); }} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-extrabold text-xs shadow-md">
            Save Quiz Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
