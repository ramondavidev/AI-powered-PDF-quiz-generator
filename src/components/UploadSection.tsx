"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { AlertCircle, FileText, Upload, Zap } from "lucide-react";
import { useQuizStore } from "@/store/quiz";
import { useGenerateQuestions } from "@/hooks/useApi";
import { sampleQuestions } from "@/data/sampleQuestions";
import pdfIcon from "@/assets/icons/pdf icon.svg";

export default function UploadSection() {
  const { setUploadedFile, setIsProcessing, setQuestions } = useQuizStore();
  const generateQuestions = useGenerateQuestions();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB");
        return;
      }

      setUploadedFile(file);
      setIsProcessing(true);

      try {
        const result = await generateQuestions.mutateAsync(file);
        setQuestions(result.questions);
      } catch (error) {
        console.error("Error generating questions:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Failed to generate questions"
        );
        setUploadedFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [setUploadedFile, setIsProcessing, setQuestions, generateQuestions]
  );

  const handleDemoMode = () => {
    setUploadedFile(new File([], "demo.pdf", { type: "application/pdf" }));
    setIsProcessing(true);

    // Simulate API delay
    setTimeout(() => {
      setQuestions(sampleQuestions);
      setIsProcessing(false);
    }, 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="max-w-2xl mx-auto">
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
      <div className="mt-6 text-center">
        <button
          onClick={handleDemoMode}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Zap className="w-5 h-5 mr-2" />
          Try Demo (No PDF Required)
        </button>
        <p className="text-sm text-gray-500 mt-2">
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
    </div>
  );
}
