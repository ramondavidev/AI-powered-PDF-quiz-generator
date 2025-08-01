"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  FileText,
  Trash2,
  Play,
  RotateCcw,
  Calendar,
  Trophy,
  AlertCircle,
  X,
} from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import {
  loadQuizHistory,
  removeQuizFromHistory,
  loadEditedQuestions,
  clearEditedQuestions,
  loadQuizProgress,
  StoredQuizHistory,
  StoredQuizProgress,
  isStorageDataStale,
} from "@/utils/localStorage";

interface SavedProgressManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavedProgressManager({
  isOpen,
  onClose,
}: SavedProgressManagerProps) {
  const { loadProgress, setQuestions, clearProgress } = useQuizStore();
  const [quizHistory, setQuizHistory] = useState<StoredQuizHistory[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<{
    questions: any[];
    fileName?: string;
    timestamp: number;
  } | null>(null);
  const [savedProgress, setSavedProgress] = useState<StoredQuizProgress | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"progress" | "history">(
    "progress"
  );

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    // Load quiz history
    const history = loadQuizHistory();
    setQuizHistory(history);

    // Load saved questions
    const savedQs = loadEditedQuestions();
    setSavedQuestions(savedQs);

    // Load saved quiz progress
    const progress = loadQuizProgress();
    if (progress && !isStorageDataStale(progress.timestamp, 24)) {
      setSavedProgress(progress);
    } else {
      setSavedProgress(null);
    }
  };

  const handleLoadProgress = () => {
    const loaded = loadProgress();
    if (loaded) {
      onClose();
    } else {
      // Show error message or refresh data
      console.log("Failed to load progress - refreshing data");
      loadData();
    }
  };

  const handleLoadSavedQuestions = () => {
    if (savedQuestions) {
      setQuestions(savedQuestions.questions);
      onClose();
    }
  };

  const handleClearProgress = () => {
    clearProgress();
    setSavedProgress(null);
    loadData(); // Refresh data after clearing
  };

  const handleClearSavedQuestions = () => {
    clearEditedQuestions();
    setSavedQuestions(null);
  };

  const handleRemoveFromHistory = (id: string) => {
    removeQuizFromHistory(id);
    setQuizHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Saved Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("progress")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "progress"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>In Progress</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "history"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Completed ({quizHistory.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === "progress" && (
            <div className="space-y-4">
              {/* Saved Questions */}
              {savedQuestions && (
                <div className="quiz-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Edited Questions
                        </h3>
                        <p className="text-sm text-gray-600">
                          {savedQuestions.fileName || "Unknown File"} •{" "}
                          {savedQuestions.questions.length} questions
                        </p>
                        <p className="text-xs text-gray-500">
                          {isStorageDataStale(savedQuestions.timestamp, 24) && (
                            <span className="text-yellow-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Older than 24 hours
                            </span>
                          )}
                          Saved: {formatDate(savedQuestions.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleLoadSavedQuestions}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Load Questions
                      </button>
                      <button
                        onClick={handleClearSavedQuestions}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Progress */}
              {savedProgress && (
                <div className="quiz-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Quiz Progress
                        </h3>
                        <p className="text-sm text-gray-600">
                          {savedProgress.fileName || "Unknown File"} • Question{" "}
                          {savedProgress.currentQuestionIndex + 1} of{" "}
                          {savedProgress.questions.length} • Score:{" "}
                          {savedProgress.score}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isStorageDataStale(savedProgress.timestamp, 24) && (
                            <span className="text-yellow-600 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Older than 24 hours
                            </span>
                          )}
                          Saved: {formatDate(savedProgress.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleLoadProgress}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Resume Quiz
                      </button>
                      <button
                        onClick={handleClearProgress}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!savedQuestions && !savedProgress && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No saved progress found</p>
                  <p className="text-sm">
                    Your progress will be automatically saved as you take
                    quizzes
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              {quizHistory.length > 0 ? (
                quizHistory.map((item) => (
                  <div key={item.id} className="quiz-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.fileName}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>
                              Score:{" "}
                              <span className={getScoreColor(item.percentage)}>
                                {item.score}/{item.totalQuestions} (
                                {item.percentage}%)
                              </span>
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(item.completedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRemoveFromHistory(item.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No completed quizzes yet</p>
                  <p className="text-sm">
                    Complete a quiz to see your results here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>💾 Data is saved locally in your browser</span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
