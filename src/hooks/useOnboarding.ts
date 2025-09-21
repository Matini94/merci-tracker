// [AI]
import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: "top" | "bottom" | "left" | "right";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Merci Tracker! 🎉",
    description:
      "Track your daily income easily and efficiently. Let's get you started with a quick tour.",
  },
  {
    id: "navigation",
    title: "Easy Navigation",
    description:
      "Use the navigation buttons to switch between viewing your dashboard and adding new income entries.",
    targetSelector: 'nav[aria-label="Main navigation"]',
    position: "bottom",
  },
  {
    id: "dashboard",
    title: "Your Dashboard",
    description:
      "View your income summary and recent entries here. You can filter and search through your data.",
    action: {
      label: "Go to Dashboard",
      href: "/dashboard",
    },
  },
  {
    id: "add-income",
    title: "Add Income Entries",
    description:
      "Click here to quickly add a new income entry. The form will auto-save as you type.",
    action: {
      label: "Add Your First Entry",
      href: "/income/new",
    },
  },
  {
    id: "complete",
    title: "You're All Set! ✨",
    description:
      "You're ready to start tracking your income. Remember, you can always revisit this tour from the help section.",
  },
];

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage(
    "onboarding-completed",
    false
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  const startOnboarding = useCallback(() => {
    setCurrentStep(0);
    setIsOnboardingActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingActive(false);
    setHasCompletedOnboarding(true);
  }, [setHasCompletedOnboarding]);

  const restartOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    startOnboarding();
  }, [setHasCompletedOnboarding, startOnboarding]);

  // Auto-start onboarding for new users
  const shouldShowOnboarding = !hasCompletedOnboarding && !isOnboardingActive;

  return {
    hasCompletedOnboarding,
    isOnboardingActive,
    shouldShowOnboarding,
    currentStep,
    currentStepData: onboardingSteps[currentStep],
    totalSteps: onboardingSteps.length,
    startOnboarding,
    nextStep,
    prevStep,
    skipOnboarding,
    completeOnboarding,
    restartOnboarding,
  };
}
// [/AI]
