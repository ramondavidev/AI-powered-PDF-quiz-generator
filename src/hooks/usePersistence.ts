import { useEffect, useRef } from "react";
import { useQuizStore } from "@/store/quiz";
import {
  loadQuizProgress,
  loadEditedQuestions,
  isStorageDataStale,
} from "@/utils/localStorage";

/**
 * Hook to handle automatic loading of saved progress when the app starts
 */
export function useAutoloadProgress(
  onNotification?: (message: string, type: "info" | "success") => void
) {
  const { setQuestions, loadProgress } = useQuizStore();
  const hasShownNotification = useRef(false);

  useEffect(() => {
    // Only show notifications once per session
    if (hasShownNotification.current) return;

    // Try to load saved quiz progress first
    const savedProgress = loadQuizProgress();

    if (savedProgress && !isStorageDataStale(savedProgress.timestamp, 24)) {
      // If there's recent progress, show a notification
      const timeAgo = Math.round(
        (Date.now() - savedProgress.timestamp) / (1000 * 60)
      );
      const fileName = savedProgress.fileName || "a quiz";

      if (onNotification) {
        onNotification(
          `Found saved progress for ${fileName} from ${timeAgo} minutes ago. Use "Resume Saved Progress" to continue.`,
          "info"
        );
        hasShownNotification.current = true;
      }
      return;
    }

    // If no recent progress, try to load edited questions
    const savedQuestions = loadEditedQuestions();

    if (savedQuestions && !isStorageDataStale(savedQuestions.timestamp, 24)) {
      const timeAgo = Math.round(
        (Date.now() - savedQuestions.timestamp) / (1000 * 60)
      );
      const fileName = savedQuestions.fileName || "some questions";

      if (onNotification) {
        onNotification(
          `Found edited questions for ${fileName} from ${timeAgo} minutes ago. Check "View History" to restore them.`,
          "info"
        );
        hasShownNotification.current = true;
      }
    }
  }, [onNotification]);
}

/**
 * Hook to handle persistence warnings before page unload
 */
export function useBeforeUnloadWarning() {
  const { hasUnsavedProgress, isQuizActive } = useQuizStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedProgress || isQuizActive) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved progress. Are you sure you want to leave?";
        return "You have unsaved progress. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedProgress, isQuizActive]);
}
