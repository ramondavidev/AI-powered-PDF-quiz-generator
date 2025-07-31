import { create } from "zustand";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

export interface QuizState {
  // PDF Processing
  uploadedFile: File | null;
  isProcessing: boolean;

  // Questions
  questions: Question[];
  currentQuestionIndex: number;

  // Quiz state
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  score: number;

  // UI states
  showFeedback: boolean;

  // Actions
  setUploadedFile: (file: File | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setQuestions: (questions: Question[]) => void;
  updateQuestion: (index: number, question: Question) => void;
  startQuiz: () => void;
  answerQuestion: (answer: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  setShowFeedback: (show: boolean) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  uploadedFile: null,
  isProcessing: false,
  questions: [],
  currentQuestionIndex: 0,
  isQuizActive: false,
  isQuizCompleted: false,
  score: 0,
  showFeedback: false,

  // Actions
  setUploadedFile: (file) => set({ uploadedFile: file }),

  setIsProcessing: (processing) => set({ isProcessing: processing }),

  setQuestions: (questions) =>
    set({
      questions: questions.map((q) => ({
        ...q,
        userAnswer: undefined,
        isCorrect: undefined,
      })),
    }),

  updateQuestion: (index, question) =>
    set((state) => ({
      questions: state.questions.map((q, i) => (i === index ? question : q)),
    })),

  startQuiz: () =>
    set({
      isQuizActive: true,
      currentQuestionIndex: 0,
      isQuizCompleted: false,
      score: 0,
      showFeedback: false,
    }),

  answerQuestion: (answer) =>
    set((state) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.correctAnswer;

      const updatedQuestions = state.questions.map((q, i) =>
        i === state.currentQuestionIndex
          ? { ...q, userAnswer: answer, isCorrect }
          : q
      );

      return {
        questions: updatedQuestions,
        score: isCorrect ? state.score + 1 : state.score,
        showFeedback: true,
      };
    }),

  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= state.questions.length;

      return {
        currentQuestionIndex: nextIndex,
        isQuizCompleted: isCompleted,
        isQuizActive: !isCompleted,
        showFeedback: false,
      };
    }),

  resetQuiz: () =>
    set({
      uploadedFile: null,
      isProcessing: false,
      questions: [],
      currentQuestionIndex: 0,
      isQuizActive: false,
      isQuizCompleted: false,
      score: 0,
      showFeedback: false,
    }),

  setShowFeedback: (show) => set({ showFeedback: show }),
}));
