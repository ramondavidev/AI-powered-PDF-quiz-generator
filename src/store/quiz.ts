import { create } from "zustand";
import {
  saveQuizProgress,
  loadQuizProgress,
  clearQuizProgress,
  saveEditedQuestions,
  clearEditedQuestions,
  saveQuizToHistory,
} from "@/utils/localStorage";

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

  // Persistence state
  hasUnsavedProgress: boolean;
  fileName?: string;

  // Actions
  setUploadedFile: (file: File | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setQuestions: (questions: Question[]) => void;
  updateQuestion: (index: number, question: Question) => void;
  startQuiz: () => void;
  answerQuestion: (answer: number) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;
  retryQuiz: () => void;
  backToUpload: () => void;
  setShowFeedback: (show: boolean) => void;

  // Persistence actions
  saveProgress: () => void;
  loadProgress: () => boolean;
  clearProgress: () => void;
  saveToHistory: () => void;
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
  hasUnsavedProgress: false,
  fileName: undefined,

  // Actions
  setUploadedFile: (file) => set({ uploadedFile: file, fileName: file?.name }),

  setIsProcessing: (processing) => set({ isProcessing: processing }),

  setQuestions: (questions) =>
    set((state) => {
      const updatedQuestions = questions.map((q) => ({
        ...q,
        userAnswer: undefined,
        isCorrect: undefined,
      }));

      // Save edited questions to localStorage
      if (state.fileName) {
        saveEditedQuestions(updatedQuestions, state.fileName);
      }

      return {
        questions: updatedQuestions,
        hasUnsavedProgress: false,
      };
    }),

  updateQuestion: (index, question) =>
    set((state) => {
      const updatedQuestions = state.questions.map((q, i) =>
        i === index ? question : q
      );

      // Save edited questions to localStorage
      if (state.fileName) {
        saveEditedQuestions(updatedQuestions, state.fileName);
      }

      return {
        questions: updatedQuestions,
        hasUnsavedProgress: true,
      };
    }),

  startQuiz: () =>
    set((state) => {
      const newState = {
        isQuizActive: true,
        currentQuestionIndex: 0,
        isQuizCompleted: false,
        score: 0,
        showFeedback: false,
        hasUnsavedProgress: true,
      };

      // Auto-save progress when starting quiz
      saveQuizProgress({ ...state, ...newState }, state.fileName);

      return newState;
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

      const newState = {
        questions: updatedQuestions,
        score: isCorrect ? state.score + 1 : state.score,
        showFeedback: true,
        hasUnsavedProgress: true,
      };

      // Auto-save progress after answering
      saveQuizProgress({ ...state, ...newState }, state.fileName);

      return newState;
    }),

  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isCompleted = nextIndex >= state.questions.length;

      const newState = {
        currentQuestionIndex: nextIndex,
        isQuizCompleted: isCompleted,
        isQuizActive: !isCompleted,
        showFeedback: false,
        hasUnsavedProgress: !isCompleted,
      };

      // Auto-save progress
      saveQuizProgress({ ...state, ...newState }, state.fileName);

      // Save to history if completed
      if (isCompleted && state.fileName) {
        saveQuizToHistory({ ...state, ...newState }, state.fileName);
        clearQuizProgress(); // Clear progress since quiz is completed
      }

      return newState;
    }),

  resetQuiz: () =>
    set(() => {
      // Clear all stored data when resetting
      clearQuizProgress();
      clearEditedQuestions();

      return {
        uploadedFile: null,
        isProcessing: false,
        questions: [],
        currentQuestionIndex: 0,
        isQuizActive: false,
        isQuizCompleted: false,
        score: 0,
        showFeedback: false,
        hasUnsavedProgress: false,
        fileName: undefined,
      };
    }),

  retryQuiz: () =>
    set((state) => {
      const newState = {
        questions: state.questions.map((q) => ({
          ...q,
          userAnswer: undefined,
          isCorrect: undefined,
        })),
        currentQuestionIndex: 0,
        isQuizActive: true,
        isQuizCompleted: false,
        score: 0,
        showFeedback: false,
        hasUnsavedProgress: true,
      };

      // Clear previous progress and save new state
      clearQuizProgress();
      saveQuizProgress({ ...state, ...newState }, state.fileName);

      return newState;
    }),

  backToUpload: () => {
    // Refresh the page like F5
    window.location.reload();
  },

  setShowFeedback: (show) => set({ showFeedback: show }),

  // Persistence methods
  saveProgress: () => {
    const state = get();
    saveQuizProgress(state, state.fileName);
    set({ hasUnsavedProgress: false });
  },

  loadProgress: () => {
    const savedProgress = loadQuizProgress();

    if (!savedProgress) {
      return false;
    }

    // Check if saved progress is not too old (24 hours)
    const isStale = Date.now() - savedProgress.timestamp > 24 * 60 * 60 * 1000;
    if (isStale) {
      clearQuizProgress();
      return false;
    }

    // Create a dummy file object if we have a filename
    let uploadedFile = null;
    if (savedProgress.fileName) {
      uploadedFile = new File([], savedProgress.fileName, {
        type: "application/pdf",
      });
    }

    set({
      uploadedFile,
      questions: savedProgress.questions,
      currentQuestionIndex: savedProgress.currentQuestionIndex,
      isQuizActive: savedProgress.isQuizActive,
      isQuizCompleted: savedProgress.isQuizCompleted,
      score: savedProgress.score,
      fileName: savedProgress.fileName,
      hasUnsavedProgress: false,
    });

    return true;
  },

  clearProgress: () => {
    clearQuizProgress();
    set({ hasUnsavedProgress: false });
  },

  saveToHistory: () => {
    const state = get();
    if (state.fileName && state.isQuizCompleted) {
      saveQuizToHistory(state, state.fileName);
    }
  },
}));
