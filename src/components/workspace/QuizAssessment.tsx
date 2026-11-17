"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, AlertCircle, RefreshCw } from "lucide-react";

interface QuizAssessmentProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onCompleteLesson?: () => void;
}

interface QuestionItem {
  id: string;
  questionText: string;
  options: Array<{ id?: number; text: string }>;
  orderIndex: number;
}

interface AssessmentData {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  questions: QuestionItem[];
  previousAttempts?: Array<{
    id: string;
    score: number;
    passed: boolean;
    attemptedAt: string;
  }>;
}

export function QuizAssessment({
  title,
  lessonId,
  courseId,
  userId,
  onCompleteLesson,
}: QuizAssessmentProps) {
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    passed: boolean;
    passingScore: number;
    results: Record<string, { correct: boolean; correctOptionIndex: number; explanation?: string | null }>;
  } | null>(null);

  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setEvaluation(null);
      setSelectedAnswers({});

      const res = await fetch(`/api/content/assessments/${lessonId}`);
      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setAssessment(json.data);
      } else {
        setAssessment(null);
      }
    } catch (err: any) {
      console.error("Failed to load quiz assessment:", err);
      setError("Unable to load knowledge check questions.");
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadAssessment();
  }, [loadAssessment]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (evaluation) return; // Prevent changing answers after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!assessment) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/content/assessments/${assessment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: selectedAnswers,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Quiz evaluation failed.");
      }

      setEvaluation(json.data);

      if (json.data.passed && onCompleteLesson) {
        onCompleteLesson();
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setEvaluation(null);
  };

  if (loading) {
    return (
      <div className="p-8 rounded-3xl border border-border bg-card flex items-center justify-center space-x-2 text-muted-foreground text-xs font-heading">
        <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
        <span>Loading Knowledge Check Assessment...</span>
      </div>
    );
  }

  if (error || !assessment || assessment.questions.length === 0) {
    return (
      <div className="p-6 rounded-3xl border border-border bg-card text-center space-y-2">
        <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="font-extrabold text-sm text-foreground font-heading">{title}</h3>
        <p className="text-xs text-muted-foreground">
          No automated quiz is configured for this specific lesson. Review the video or reading content above and mark complete when ready.
        </p>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = assessment.questions.length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full w-fit">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Lesson Knowledge Check</span>
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            Passing Threshold: <strong className="text-foreground">{assessment.passingScore}%</strong>
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-heading">{assessment.title}</h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {assessment.description || "Answer the questions below to verify your comprehension and earn lesson completion."}
        </p>
      </div>

      {/* Evaluation Results Banner */}
      {evaluation && (
        <div className={`p-6 rounded-3xl border text-center space-y-3 ${
          evaluation.passed
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
            : "bg-red-500/10 border-red-500/30 text-red-500"
        }`}>
          <div className="flex items-center justify-center gap-2 text-xl font-black font-heading">
            {evaluation.passed ? <CheckCircle2 className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
            <span>{evaluation.passed ? "Assessment Passed!" : "Assessment Incomplete"}</span>
          </div>
          <p className="text-sm font-bold">
            Your Score: <span className="font-extrabold text-lg">{evaluation.score}%</span> (Threshold: {evaluation.passingScore}%)
          </p>
          <p className="text-xs opacity-90 max-w-md mx-auto">
            {evaluation.passed
              ? "Congratulations! Your score satisfies the curriculum requirements and this lesson has been marked complete."
              : "You scored below the passing threshold. Review the explanations below and retry the assessment."}
          </p>
          {!evaluation.passed && (
            <div className="pt-2">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {assessment.questions.map((q, qIdx) => {
          const selectedOption = selectedAnswers[q.id];
          const result = evaluation?.results[q.id];

          return (
            <div key={q.id} className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-foreground font-heading leading-snug">
                {qIdx + 1}. {q.questionText}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  let optionStyles = "bg-muted/40 border-border text-foreground hover:bg-muted/70";

                  if (evaluation && result) {
                    if (result.correctOptionIndex === oIdx) {
                      optionStyles = "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold";
                    } else if (isSelected && !result.correct) {
                      optionStyles = "bg-red-500/15 border-red-500/40 text-red-500 line-through";
                    }
                  } else if (isSelected) {
                    optionStyles = "bg-sky-500/15 border-sky-500/40 text-sky-600 dark:text-sky-400 font-bold shadow-sm";
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={!!evaluation}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${optionStyles}`}
                    >
                      <span>{opt.text}</span>
                      {evaluation && result?.correctOptionIndex === oIdx && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after evaluation */}
              {evaluation && result?.explanation && (
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-bold">Explanation: </strong>
                  {result.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!evaluation && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < totalCount}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 disabled:opacity-40 transition-all font-heading"
          >
            {submitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Evaluating on Server...</span>
              </>
            ) : (
              <span>Submit Assessment ({answeredCount}/{totalCount} Answered)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
