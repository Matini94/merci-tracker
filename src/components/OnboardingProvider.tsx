// [AI]
"use client";

import { useEffect } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export default function OnboardingProvider({
  children,
}: OnboardingProviderProps) {
  const {
    isOnboardingActive,
    shouldShowOnboarding,
    currentStep,
    currentStepData,
    totalSteps,
    startOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
  } = useOnboarding();

  // Auto-start onboarding for new users
  useEffect(() => {
    if (shouldShowOnboarding) {
      // Small delay to let the page load
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowOnboarding, startOnboarding]);

  return (
    <>
      {children}

      <OnboardingModal
        isOpen={isOnboardingActive}
        step={currentStepData}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipOnboarding}
        onComplete={completeOnboarding}
      />
    </>
  );
}
// [/AI]
