"use client";

import React from "react";
import { useQuizStore } from "@/store/quiz";
import UploadSection from "@/components/UploadSection";
import QuestionEditor from "@/components/QuestionEditor";
import QuizView from "@/components/QuizView";
import ResultsView from "@/components/ResultsView";
import VectorIcon from "@/assets/icons/Vector.svg";
import Image from "next/image";
import LoadingIcon from "@/assets/icons/loading.svg";

export default function Home() {
  const {
    questions,
    isQuizActive,
    isQuizCompleted,
    uploadedFile,
    isProcessing,
  } = useQuizStore();

  return (
    <main className="min-h-screen bg-[#F8F8F9]">
      <div className="container mx-auto px-4 pb-32 py-8 flex items-center justify-center min-h-screen">
        <div>
          {/* Header */}
          <div className="text-center mb-[30px]">
            <div className="flex items-center justify-center mb-4">
              <div className="w-[38px] h-[36px] flex items-center justify-center mr-3">
                <Image src={VectorIcon} alt="App Icon" width={38} height={36} />
              </div>
              <h1 className="text-[38px] font-semibold text-[#3E3C46]">
                Unstuck Quiz Generator
              </h1>
            </div>
            <p className="text-[#15112B80] text-[20px] max-w-2xl mx-auto">
              Generate quiz questions from your course materials or textbooks to
              help you study faster and smarter.
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {!uploadedFile && !isProcessing && questions.length === 0 && (
              <UploadSection />
            )}

            {(isProcessing || (uploadedFile && questions.length === 0)) && (
              <>
                <Image
                  src={LoadingIcon}
                  alt="Loading Icon"
                  width={446}
                  height={200}
                  className="m-auto"
                />
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Generating Quiz Questions
                  </h2>
                  <p className="text-[#15112B80]">Reading your materials...</p>
                </div>
              </>
            )}

            {questions.length > 0 && !isQuizActive && !isQuizCompleted && (
              <QuestionEditor />
            )}

            {isQuizActive && <QuizView />}

            {isQuizCompleted && <ResultsView />}
          </div>
        </div>
      </div>
    </main>
  );
}
