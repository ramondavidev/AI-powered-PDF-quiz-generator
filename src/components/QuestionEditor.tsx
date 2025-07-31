"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Plus, Play, ArrowLeft } from "lucide-react";
import { useQuizStore, Question } from "@/store/quiz";

export default function QuestionEditor() {
  const { questions, updateQuestion, startQuiz, resetQuiz } = useQuizStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdateQuestion = (index: number, updatedQuestion: Question) => {
    updateQuestion(index, updatedQuestion);
    setEditingIndex(null);
  };

  const handleAddOption = (questionIndex: number) => {
    const question = questions[questionIndex];
    const updatedQuestion = {
      ...question,
      options: [...question.options, "New Option"],
    };
    updateQuestion(questionIndex, updatedQuestion);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const question = questions[questionIndex];
    if (question.options.length <= 2) {
      alert("A question must have at least 2 options");
      return;
    }

    const updatedQuestion = {
      ...question,
      options: question.options.filter((_, i) => i !== optionIndex),
      correctAnswer:
        question.correctAnswer > optionIndex
          ? question.correctAnswer - 1
          : question.correctAnswer === optionIndex
          ? 0
          : question.correctAnswer,
    };
    updateQuestion(questionIndex, updatedQuestion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={resetQuiz}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Review & Edit Questions
          </h2>
        </div>
        <button
          onClick={startQuiz}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>Start Quiz</span>
        </button>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className="quiz-card p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Question {questionIndex + 1}
              </h3>
              <button
                onClick={() =>
                  setEditingIndex(
                    editingIndex === questionIndex ? null : questionIndex
                  )
                }
                className="text-gray-500 hover:text-purple-600 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            {editingIndex === questionIndex ? (
              <EditQuestionForm
                question={question}
                questionIndex={questionIndex}
                onSave={handleUpdateQuestion}
                onCancel={() => setEditingIndex(null)}
                onAddOption={handleAddOption}
                onRemoveOption={handleRemoveOption}
              />
            ) : (
              <QuestionDisplay
                question={question}
                questionIndex={questionIndex}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionDisplay({
  question,
  questionIndex,
}: {
  question: Question;
  questionIndex: number;
}) {
  return (
    <div>
      <p className="text-gray-700 mb-4 leading-relaxed">{question.question}</p>

      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-gray-800">Multiple Choice Answers</h4>
        {question.options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className={`p-3 rounded-lg border-2 ${
              optionIndex === question.correctAnswer
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center">
              <span className="font-medium text-gray-700 mr-2">
                Option {optionIndex + 1}:
              </span>
              <span className="text-gray-700">{option}</span>
              {optionIndex === question.correctAnswer && (
                <span className="ml-auto text-green-600 font-medium text-sm">
                  ✓ Correct Answer
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditQuestionForm({
  question,
  questionIndex,
  onSave,
  onCancel,
  onAddOption,
  onRemoveOption,
}: {
  question: Question;
  questionIndex: number;
  onSave: (index: number, question: Question) => void;
  onCancel: () => void;
  onAddOption: (questionIndex: number) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
}) {
  const [editedQuestion, setEditedQuestion] = useState(question);

  const handleSave = () => {
    if (!editedQuestion.question.trim()) {
      alert("Question text cannot be empty");
      return;
    }

    if (editedQuestion.options.some((opt) => !opt.trim())) {
      alert("All options must have text");
      return;
    }

    if (editedQuestion.correctAnswer >= editedQuestion.options.length) {
      alert("Please select a valid correct answer");
      return;
    }

    onSave(questionIndex, editedQuestion);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <textarea
          value={editedQuestion.question}
          onChange={(e) =>
            setEditedQuestion({ ...editedQuestion, question: e.target.value })
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer Options
        </label>
        <div className="space-y-2">
          {editedQuestion.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`correct-${questionIndex}`}
                checked={editedQuestion.correctAnswer === optionIndex}
                onChange={() =>
                  setEditedQuestion({
                    ...editedQuestion,
                    correctAnswer: optionIndex,
                  })
                }
                className="text-purple-600"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...editedQuestion.options];
                  newOptions[optionIndex] = e.target.value;
                  setEditedQuestion({ ...editedQuestion, options: newOptions });
                }}
                className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {editedQuestion.options.length > 2 && (
                <button
                  onClick={() => onRemoveOption(questionIndex, optionIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editedQuestion.options.length < 6 && (
          <button
            onClick={() => onAddOption(questionIndex)}
            className="mt-2 flex items-center text-purple-600 hover:text-purple-700 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Option
          </button>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
