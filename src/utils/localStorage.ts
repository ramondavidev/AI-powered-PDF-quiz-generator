/**
 * Local Storage utility functions for quiz persistence
 */

import { Question, QuizState } from "@/store/quiz";

// Storage keys
export const STORAGE_KEYS = {
  QUIZ_PROGRESS: "quiz_progress",
  EDITED_QUESTIONS: "edited_questions",
  QUIZ_HISTORY: "quiz_history",
} as const;

// Types for stored data
export interface StoredQuizProgress {
  questions: Question[];
  currentQuestionIndex: number;
  isQuizActive: boolean;
  isQuizCompleted: boolean;
  score: number;
  timestamp: number;
  fileName?: string;
}

export interface StoredQuizHistory {
  id: string;
  fileName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: number;
  questions: Question[];
}

/**
 * Generic localStorage wrapper with error handling
 */
class LocalStorageManager {
  private isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      // Additional safety check for empty or invalid JSON
      if (item === "undefined" || item === "null" || item.trim() === "") {
        console.warn(`Invalid localStorage value for key ${key}:`, item);
        return null;
      }

      return JSON.parse(item);
    } catch (error) {
      console.error(`Failed to read from localStorage (${key}):`, error);
      // Clear the corrupted data
      this.removeItem(key);
      return null;
    }
  }
  removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove from localStorage (${key}):`, error);
      return false;
    }
  }

  clear(): boolean {
    if (!this.isAvailable()) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  }
}

export const storage = new LocalStorageManager();

/**
 * Quiz progress persistence functions
 */
export const saveQuizProgress = (
  state: Partial<QuizState>,
  fileName?: string
): boolean => {
  try {
    const progressData: StoredQuizProgress = {
      questions: state.questions || [],
      currentQuestionIndex: state.currentQuestionIndex || 0,
      isQuizActive: state.isQuizActive || false,
      isQuizCompleted: state.isQuizCompleted || false,
      score: state.score || 0,
      timestamp: Date.now(),
      fileName,
    };

    return storage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, progressData);
  } catch (error) {
    console.error("Error saving quiz progress:", error);
    return false;
  }
};

export const loadQuizProgress = (): StoredQuizProgress | null => {
  return storage.getItem<StoredQuizProgress>(STORAGE_KEYS.QUIZ_PROGRESS);
};

export const clearQuizProgress = (): boolean => {
  return storage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
};

/**
 * Edited questions persistence functions
 */
export const saveEditedQuestions = (
  questions: Question[],
  fileName?: string
): boolean => {
  const questionsData = {
    questions,
    fileName,
    timestamp: Date.now(),
  };

  return storage.setItem(STORAGE_KEYS.EDITED_QUESTIONS, questionsData);
};

export const loadEditedQuestions = (): {
  questions: Question[];
  fileName?: string;
  timestamp: number;
} | null => {
  return storage.getItem(STORAGE_KEYS.EDITED_QUESTIONS);
};

export const clearEditedQuestions = (): boolean => {
  return storage.removeItem(STORAGE_KEYS.EDITED_QUESTIONS);
};

/**
 * Quiz history persistence functions
 */
export const saveQuizToHistory = (
  state: QuizState,
  fileName: string
): boolean => {
  const historyItem: StoredQuizHistory = {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fileName,
    score: state.score,
    totalQuestions: state.questions.length,
    percentage: Math.round((state.score / state.questions.length) * 100),
    completedAt: Date.now(),
    questions: state.questions,
  };

  // Get existing history
  const existingHistory =
    storage.getItem<StoredQuizHistory[]>(STORAGE_KEYS.QUIZ_HISTORY) || [];

  // Add new item and keep only last 10 entries
  const updatedHistory = [historyItem, ...existingHistory].slice(0, 10);

  return storage.setItem(STORAGE_KEYS.QUIZ_HISTORY, updatedHistory);
};

export const loadQuizHistory = (): StoredQuizHistory[] => {
  return storage.getItem<StoredQuizHistory[]>(STORAGE_KEYS.QUIZ_HISTORY) || [];
};

export const clearQuizHistory = (): boolean => {
  return storage.removeItem(STORAGE_KEYS.QUIZ_HISTORY);
};

export const removeQuizFromHistory = (id: string): boolean => {
  const history = loadQuizHistory();
  const updatedHistory = history.filter((item) => item.id !== id);
  return storage.setItem(STORAGE_KEYS.QUIZ_HISTORY, updatedHistory);
};

/**
 * Utility functions
 */
export const isStorageDataStale = (
  timestamp: number,
  maxAgeHours: number = 24
): boolean => {
  const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds
  return Date.now() - timestamp > maxAge;
};

export const getStorageUsage = (): { used: number; available: number } => {
  if (!storage["isAvailable"]()) {
    return { used: 0, available: 0 };
  }

  let used = 0;
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    console.error("Failed to calculate storage usage:", error);
  }

  // Most browsers have ~5-10MB limit for localStorage
  const available = 5 * 1024 * 1024; // 5MB estimation

  return { used, available };
};
