import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useStep } from 'usehooks-ts';

type Helpers = ReturnType<typeof useStep>[1];

type TSignupWizardContext = {
    currentStep: number;
    helpers: Helpers;
    isWizardOpen: boolean;
    setIsWizardOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type TSignupWizardProvider = {
    children: React.ReactNode;
};

const initialHelpers: Helpers = {
    canGoToNextStep: false,
    canGoToPrevStep: false,
    goToNextStep: /* noop */ () => {
        /* noop */
    },
    goToPrevStep: /* noop */ () => {
        /* noop */
    },
    reset: /* noop */ () => {
        /* noop */
    },
    setStep: /* noop */ (() => {
        /* noop */
    }) as React.Dispatch<React.SetStateAction<number>>,
};
export const SignupWizardContext = createContext<TSignupWizardContext>({
    currentStep: 0,
    helpers: initialHelpers,
    isWizardOpen: false,
    setIsWizardOpen: /* noop */ () => {
        /* noop */
    },
});

export const useSignupWizardContext = () => {
    const context = useContext<TSignupWizardContext>(SignupWizardContext);
    if (!context)
        throw new Error('useSignupWizardContext() must be called within a component wrapped in SignupWizardProvider.');

    return context;
};

/**
 * @name SignupWizardProvider
 * @description The SignupWizardProvider component is used to wrap the components that need access to the SignupWizardContext.
 * @param {React.ReactNode} children - The content to be wrapped.
 */
export const SignupWizardProvider = ({ children }: TSignupWizardProvider) => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [currentStep, helpers] = useStep(5);

    useEffect(() => {
        if (!isWizardOpen) {
            // Reset the step when the modal is closed to ensure that the first step is always shown when the modal is opened.
            helpers.setStep(1);
        }
    }, [helpers, isWizardOpen]);

    const contextState = useMemo(
        () => ({
            currentStep,
            helpers,
            isWizardOpen,
            setIsWizardOpen,
        }),
        [currentStep, helpers, isWizardOpen]
    );

    return <SignupWizardContext.Provider value={contextState}>{children}</SignupWizardContext.Provider>;
};
