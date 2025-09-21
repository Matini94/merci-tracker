// [AI]
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { OnboardingStep } from "@/hooks/useOnboarding";
import { X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  step: OnboardingStep;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export default function OnboardingModal({
  isOpen,
  step,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  onComplete,
}: OnboardingModalProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSkip();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onSkip]);

  const handleAction = () => {
    if (step.action?.href) {
      router.push(step.action.href);
      onNext();
    } else if (step.action?.onClick) {
      step.action.onClick();
      onNext();
    } else {
      onNext();
    }
  };

  const isLastStep = currentStep === totalSteps - 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onSkip}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
        tabIndex={-1}
        className="relative bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2
            id="onboarding-title"
            className="text-xl font-semibold text-gray-900"
          >
            {step.title}
          </h2>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div id="onboarding-description" className="mb-6">
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={onPrev}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              onClick={onSkip}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Skip Tour
            </button>
          </div>

          <div className="flex gap-2">
            {step.action ? (
              <button
                onClick={handleAction}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {step.action.label}
              </button>
            ) : isLastStep ? (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// [/AI]
