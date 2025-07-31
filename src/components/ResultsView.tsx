"use client";

import React from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Share,
} from "lucide-react";
import { useQuizStore } from "@/store/quiz";

export default function ResultsView() {
  const { questions, score, resetQuiz } = useQuizStore();

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const correctAnswers = questions.filter((q) => q.isCorrect);
  const incorrectAnswers = questions.filter((q) => !q.isCorrect);

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getMessage = () => {
    if (score > 7) {
      return "Great Work, you did very good on your quiz.";
    } else {
      return "Keep trying, you can improve your score!";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={resetQuiz}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            📚 Mathematics Quiz
          </div>
        </div>
        <button className="text-purple-600 hover:text-purple-700 font-medium">
          🔄 Upgrade
        </button>
      </div>

      {/* Score Card */}
      <div className="quiz-card p-8 text-center mb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-8 right-8 w-6 h-6 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-6 left-8 w-4 h-4 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-green-400 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {getMessage()}
          </h1>

          <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
            {score}/{totalQuestions}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Answered Correctly</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Missed answers</span>
            </div>
          </div>

          <button className="mt-6 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto">
            <Share className="w-4 h-4" />
            <span>Share results</span>
          </button>
        </div>
      </div>

      {/* Result Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Result Summary</h2>

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="quiz-card p-4">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    question.isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {question.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">
                      Question {index + 1}
                    </h3>
                    <span
                      className={`text-sm font-medium ${
                        question.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {question.isCorrect ? "Correct Answer" : "Wrong Answer"}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isCorrect = optionIndex === question.correctAnswer;
                      const isUserAnswer = optionIndex === question.userAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? "border-green-200 bg-green-50"
                              : isUserAnswer && !isCorrect
                              ? "border-red-200 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">{option}</span>
                            {isCorrect && (
                              <span className="text-green-600 text-sm font-medium">
                                Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <span className="text-red-600 text-sm font-medium">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetQuiz}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <button
          onClick={resetQuiz}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          <span>New Quiz</span>
        </button>
      </div>
    </div>
  );
}
