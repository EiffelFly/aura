"use client";

import * as React from "react";

import {
  OnboardingProgressionItem,
  OnboardingProgressionRoot,
} from "./progression";
import { WelcomeStep } from "./WelcomeStep";

export type OnboardingContextValue = {
  currentStep: number;
  setCurrentStep?: (step: number) => void;
};

const OnboardingContext = React.createContext<OnboardingContextValue>({
  currentStep: 0,
});

const useOnboardingContext = () => {
  const context = React.useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within a OnboardingContextProvider",
    );
  }
  return context;
};

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const context: OnboardingContextValue = React.useMemo(
    () => ({
      currentStep,
      setCurrentStep,
    }),
    [currentStep],
  );

  return (
    <OnboardingContext.Provider value={context}>
      <div className="mx-auto flex w-full max-w-[720px] flex-col lg:py-[60px]">
        <OnboardingProgressionRoot>
          <OnboardingProgressionItem
            isCurrent={currentStep === 0}
            isPassed={currentStep > 0}
          />
          <OnboardingProgressionItem
            isCurrent={currentStep === 1}
            isPassed={currentStep > 1}
          />
          <OnboardingProgressionItem
            isCurrent={currentStep === 2}
            isPassed={currentStep > 2}
          />
          <OnboardingProgressionItem
            isCurrent={currentStep === 3}
            isPassed={currentStep > 3}
          />
          <OnboardingProgressionItem
            isCurrent={currentStep === 3}
            isPassed={currentStep > 4}
          />
        </OnboardingProgressionRoot>
        <div className="w-full">
          {currentStep === 0 ? <WelcomeStep /> : null}
        </div>
      </div>
    </OnboardingContext.Provider>
  );
};
