"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useQuizStore } from "@/store/quiz";

export default function QuizView() {
  const {
    questions,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    showFeedback,
    resetQuiz,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    answerQuestion(selectedAnswer);
  };

  const handleNext = () => {
    nextQuestion();
    setSelectedAnswer(null);
  };

  const isCorrect =
    currentQuestion.userAnswer === currentQuestion.correctAnswer;

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
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
            📚 Quiz
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestionIndex + 1}</span>
          <span>
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-card p-8 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            let buttonClass =
              "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";

            if (showFeedback) {
              if (index === currentQuestion.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (
                index === currentQuestion.userAnswer &&
                index !== currentQuestion.correctAnswer
              ) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
              }
            } else if (selectedAnswer === index) {
              buttonClass += "border-purple-500 bg-purple-50 text-purple-800";
            } else {
              buttonClass +=
                "border-gray-200 hover:border-purple-300 hover:bg-purple-25";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      showFeedback && index === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-500 text-white"
                        : showFeedback &&
                          index === currentQuestion.userAnswer &&
                          index !== currentQuestion.correctAnswer
                        ? "border-red-500 bg-red-500 text-white"
                        : selectedAnswer === index
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {showFeedback &&
                      index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    {showFeedback &&
                      index === currentQuestion.userAnswer &&
                      index !== currentQuestion.correctAnswer && (
                        <XCircle className="w-4 h-4" />
                      )}
                    {!showFeedback && selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mr-3" />
              )}
              <div>
                <h3
                  className={`font-semibold ${
                    isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h3>
                {!isCorrect && (
                  <p className="text-red-700 mt-1">
                    The correct answer is:{" "}
                    {currentQuestion.options[currentQuestion.correctAnswer]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {!showFeedback ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedAnswer !== null
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <span>{isLastQuestion ? "Finish Quiz" : "Next"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
