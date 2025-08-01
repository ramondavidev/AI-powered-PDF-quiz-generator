"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  AlertCircle,
  FileText,
  Upload,
  Zap,
  Clock,
  History,
} from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import { useGenerateQuestions } from "@/hooks/useApi";
import { sampleQuestions } from "@/data/sampleQuestions";
import SavedProgressManager from "./SavedProgressManager";
import {
  loadEditedQuestions,
  loadQuizProgress,
  isStorageDataStale,
} from "@/utils/localStorage";
import pdfIcon from "@/assets/icons/pdf icon.svg";

interface UploadSectionProps {
  onShowToast?: (
    message: string,
    type: "success" | "error" | "info",
    duration?: number,
    category?: string
  ) => void;
}

export default function UploadSection({
  onShowToast,
}: UploadSectionProps = {}) {
  const { setUploadedFile, setIsProcessing, setQuestions, loadProgress } =
    useQuizStore();
  const generateQuestions = useGenerateQuestions();
  const [showSavedProgress, setShowSavedProgress] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  // Check for saved data on component mount
  useEffect(() => {
    const checkSavedData = () => {
      const savedQuestions = loadEditedQuestions();
      const savedProgress = loadQuizProgress();

      // Check if the data is not stale (older than 24 hours)
      const hasValidQuestions =
        savedQuestions && !isStorageDataStale(savedQuestions.timestamp, 24);
      const hasValidProgress =
        savedProgress && !isStorageDataStale(savedProgress.timestamp, 24);

      setHasSavedData(!!(hasValidQuestions || hasValidProgress));
    };

    checkSavedData();

    // Check again when the component becomes visible (in case data was cleared elsewhere)
    const interval = setInterval(checkSavedData, 5000); // Check every 5 seconds instead of 1 second
    return () => clearInterval(interval);
  }, []);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        if (onShowToast) {
          onShowToast(
            "Please upload a PDF file only. Other file types are not supported.",
            "error",
            5000,
            "upload"
          );
        }
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        if (onShowToast) {
          onShowToast(
            `File size too large. Please upload a file smaller than 10MB.`,
            "error",
            6000,
            "upload"
          );
        }
        return;
      }

      setUploadedFile(file);
      setIsProcessing(true);

      try {
        const result = await generateQuestions.mutateAsync(file);
        setQuestions(result.questions);

        // Show success toast
        if (onShowToast) {
          onShowToast(
            `PDF uploaded successfully! Generated ${result.questions.length} questions from "${file.name}"`,
            "success",
            5000,
            "upload"
          );
        }
      } catch (error) {
        console.error("Error generating questions:", error);
        if (onShowToast) {
          onShowToast(
            error instanceof Error
              ? error.message
              : "Failed to generate questions. Please try again.",
            "error",
            6000,
            "upload"
          );
        }
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      setUploadedFile,
      setIsProcessing,
      setQuestions,
      generateQuestions,
      onShowToast,
    ]
  );

  const handleDemoMode = () => {
    setUploadedFile(new File([], "demo.pdf", { type: "application/pdf" }));
    setIsProcessing(true);

    // Simulate API delay
    setTimeout(() => {
      setQuestions(sampleQuestions);
      setIsProcessing(false);

      // Show success toast
      if (onShowToast) {
        onShowToast(
          `Demo mode activated! Generated ${sampleQuestions.length} sample questions`,
          "success",
          5000,
          "upload"
        );
      }
    }, 2000);
  };

  const onDropRejected = useCallback(
    (fileRejections: any[]) => {
      if (!onShowToast || fileRejections.length === 0) return;

      const rejection = fileRejections[0];
      const file = rejection.file;
      const errors = rejection.errors;

      let errorMessage = "File upload rejected";

      if (errors.some((error: any) => error.code === "file-too-large")) {
        errorMessage = `File size too large. Please upload a file smaller than 10MB.`;
      } else if (
        errors.some((error: any) => error.code === "file-invalid-type")
      ) {
        errorMessage =
          "Please upload a PDF file only. Other file types are not supported.";
      } else if (errors.some((error: any) => error.code === "too-many-files")) {
        errorMessage = "Please upload only one file at a time.";
      }

      onShowToast(errorMessage, "error", 6000, "upload");
    },
    [onShowToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 1,
  });

  return (
    <div className="max-w-2xl mx-auto">
      {/* Saved Progress Button */}
      {hasSavedData && (
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowSavedProgress(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition-all duration-200 border border-blue-300"
          >
            <Clock className="w-4 h-4 mr-2" />
            Resume Saved Progress
          </button>
        </div>
      )}

      <div
        className={`border border-solid rounded-2xl p-4 bg-white ${
          isDragActive
            ? "border-purple-400 bg-purple-50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }`}
      >
        <div
          {...getRootProps()}
          className={`
          bg-white
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-in-out
          ${
            isDragActive
              ? "border-purple-400 bg-purple-50"
              : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
          }
        `}
        >
          <input {...getInputProps()} />

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-[88px] h-[88px] bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                {isDragActive ? (
                  <Upload className="w-11 h-11 text-purple-600 animate-bounce" />
                ) : (
                  <Image
                    src={pdfIcon}
                    alt="PDF Icon"
                    width={70}
                    height={70}
                    className="animate-bounce"
                  />
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-[20px]">
                <span className="font-semibold text-[#6D56FA]">
                  Click to upload
                </span>{" "}
                or drag and drop files
              </p>
            </div>

            <div className="text-[16px] text-gray-500 !mt-1">
              <p>
                Drop Course Materials and start generating - for{" "}
                <span className="font-semibold text-[#6D56FA]">FREE</span>
              </p>
            </div>
          </div>

          {/* File requirements */}
          <div className="mt-8 text-xs text-gray-500 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>PDF files only</span>
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Max 10MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Button */}
      <div className="mt-6 text-center space-y-4">
        <div className="flex justify-center space-x-4">
          {/* <button
            onClick={handleDemoMode}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Zap className="w-5 h-5 mr-2" />
            Try Demo (No PDF Required)
          </button> */}

          <button
            onClick={() => setShowSavedProgress(true)}
            className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300"
          >
            <History className="w-4 h-4 mr-2" />
            View History
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Experience the full quiz flow with sample questions
        </p>
      </div>

      {generateQuestions.error ? (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">
              {generateQuestions.error instanceof Error
                ? generateQuestions.error.message
                : "An error occurred while generating questions"}
            </span>
          </div>
        </div>
      ) : null}

      {/* Saved Progress Manager Modal */}
      <SavedProgressManager
        isOpen={showSavedProgress}
        onClose={() => setShowSavedProgress(false)}
      />
    </div>
  );
}
