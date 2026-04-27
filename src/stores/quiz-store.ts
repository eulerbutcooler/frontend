import { create } from "zustand";

interface QuizState {
  attemptId: string | null;
  currentQuestion: number;
  answers: Record<string, string>;
  setAttemptId: (id: string) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  attemptId: null,
  currentQuestion: 0,
  answers: {},

  setAttemptId: (id) => set({ attemptId: id }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  nextQuestion: () =>
    set((state) => ({ currentQuestion: state.currentQuestion + 1 })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(0, state.currentQuestion - 1),
    })),

  reset: () =>
    set({ attemptId: null, currentQuestion: 0, answers: {} }),
}));
