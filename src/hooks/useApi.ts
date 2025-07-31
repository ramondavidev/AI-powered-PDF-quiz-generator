import { useMutation, useQuery } from "@tanstack/react-query";
import { Question } from "@/store/quiz";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface QuestionGenerationResponse {
  questions: Question[];
}

export interface QuizSubmissionResponse {
  score: number;
  totalQuestions: number;
  results: {
    questionId: string;
    isCorrect: boolean;
    correctAnswer: number;
  }[];
}

// Upload PDF and generate questions
export const useGenerateQuestions = () => {
  return useMutation({
    mutationFn: async (file: File): Promise<QuestionGenerationResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/generate-questions`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to generate questions");
      }

      return response.json();
    },
  });
};

// Submit quiz answers
export const useSubmitQuiz = () => {
  return useMutation({
    mutationFn: async (
      answers: { questionId: string; answer: number }[]
    ): Promise<QuizSubmissionResponse> => {
      const response = await fetch(`${API_BASE_URL}/submit-quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to submit quiz");
      }

      return response.json();
    },
  });
};

// Health check for API
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    },
    retry: false,
    enabled: false, // Only run when manually triggered
  });
};
