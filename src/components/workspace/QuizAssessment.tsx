"use client";

import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import { LearningAnalytics } from "@/services/workspace/LearningAnalytics";

interface QuizAssessmentProps {
  title: string;
  lessonId: string;
  courseId: string;
  userId: string;
  onCompleteLesson?: () => void;
}

export function QuizAssessment({
  title,
  lessonId,
  courseId,
  userId,
  onCompleteLesson,
}: QuizAssessmentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      question: "Which data structure operates on a First In, First Out (FIFO) basis?",
      options: ["Stack", "Queue", "Binary Search Tree", "Max Heap"],
      correct: 1,
    },
    {
      id: 2,
      question: "What is the average time complexity of searching in a balanced Binary Search Tree?",
      options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
      correct: 2,
    },
    {
      id: 3,
      question: "In Python, which of the following data types is mutable?",
      options: ["Tuple", "String", "List", "Integer"],
      correct: 2,
    },
  ];

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setSelectedOptions((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedOptions[i] === q.correct) correctCount += 1;
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    LearningAnalytics.logEvent({
      userId,
      courseId,
      lessonId,
      eventType: "quiz_submitted",
      payload: { score: calculatedScore },
    });

    if (calculatedScore >= 66 && onCompleteLesson) {
      onCompleteLesson();
    }
  };

  const handleRetry = () => {
    setSelectedOptions({});
    setSubmitted(false);
    setScore(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-500 bg-sky-500/10 px-3 py-1 rounded-full w-fit">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Lesson Quiz Assessment</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-heading">{title}</h1>
        <p className="text-xs text-muted-foreground">Passing Threshold: <strong>66%</strong> • Total Questions: <strong>{questions.length}</strong></p>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="p-6 rounded-3xl border border-border bg-card space-y-4 shadow-sm">
            <h3 className="font-extrabold text-base text-foreground font-heading">
              {qIdx + 1}. {q.question}
            </h3>

            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                const isSelected = selectedOptions[qIdx] === oIdx;
                const isCorrect = q.correct === oIdx;

                let optionStyle = "bg-muted/40 border-border text-foreground hover:bg-muted/80";
                if (submitted) {
                  if (isCorrect) optionStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold";
                  else if (isSelected && !isCorrect) optionStyle = "bg-red-500/15 border-red-500/40 text-red-500 font-bold";
                } else if (isSelected) {
                  optionStyle = "bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 font-bold";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(qIdx, oIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {submitted && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Results Footer */}
      <div className="p-6 rounded-3xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        {submitted ? (
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${score! >= 66 ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-500"}`}>
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="font-extrabold text-base text-foreground">Score: {score}%</p>
              <p className="text-xs text-muted-foreground">{score! >= 66 ? "Passed! Quiz completed." : "Score below passing mark. Try again!"}</p>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground font-medium">Select answers for all questions before submitting.</span>
        )}

        <div className="flex items-center gap-2">
          {submitted && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground text-xs font-bold hover:bg-muted/80"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          )}

          {!submitted && (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(selectedOptions).length < questions.length}
              className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold shadow-md shadow-sky-500/20 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
