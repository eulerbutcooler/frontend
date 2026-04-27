"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetQuiz } from "@/hooks/use-quiz";

interface QuizResetButtonProps {
  quizId: string;
}

export function QuizResetButton({ quizId }: QuizResetButtonProps) {
  const resetQuiz = useResetQuiz();
  const [confirming, setConfirming] = useState(false);

  const handleReset = async () => {
    await resetQuiz.mutateAsync(quizId);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="text-body-sm text-surface-tint">
          Regenerate all questions?
        </span>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleReset}
          disabled={resetQuiz.isPending}
          className="gap-1"
        >
          {resetQuiz.isPending ? (
            <RotateCw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCw className="h-3.5 w-3.5" />
          )}
          Confirm
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => setConfirming(true)}
      className="gap-2"
    >
      <RotateCw className="h-4 w-4" />
      Reset Quiz
    </Button>
  );
}
