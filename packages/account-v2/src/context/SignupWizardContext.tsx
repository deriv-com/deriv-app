import React, { createContext, useContext, useMemo, useReducer, useState } from 'react';
import { useStep } from 'usehooks-ts';

type Helpers = ReturnType<typeof useStep>[1];

type TSignupWizardContext = {
    currentStep: number;
    dispatch: React.Dispatch<TActions>;
    helpers: Helpers;
    isWizardOpen: boolean;
    setIsWizardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    state: TState;
};

type TState = {
    currency?: string;
    firstName?: string;
    lastName?: string;
};

type TSignupWizardProvider = {
    children: React.ReactNode;
};

export const ACTION_TYPES = {
    RESET: 'RESET',
    SET_CURRENCY: 'SET_CURRENCY',
    SET_PERSONAL_DETAILS: 'SET_PERSONAL_DETAILS',
} as const;

type TActions = {
    payload: TState;
    type: keyof typeof ACTION_TYPES;
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
    dispatch: /* noop */ () => {
        /* noop */
    },
    helpers: initialHelpers,
    isWizardOpen: false,
    setIsWizardOpen: /* noop */ () => {
        /* noop */
    },
    state: {
        currency: '',
    },
});

export const useSignupWizardContext = () => {
    const context = useContext<TSignupWizardContext>(SignupWizardContext);
    if (!context)
        throw new Error('useSignupWizardContext() must be called within a component wrapped in SignupWizardProvider.');

    return context;
};

function valuesReducer(state: TState, action: TActions) {
    const { payload, type } = action;
    switch (type) {
        case ACTION_TYPES.SET_CURRENCY:
            return {
                ...state,
                currency: payload.currency,
            };
        case ACTION_TYPES.SET_PERSONAL_DETAILS:
            return {
                ...state,
                firstName: payload.firstName,
                lastName: payload.lastName,
            };
        case ACTION_TYPES.RESET:
            return {
                currency: '',
            };
        default:
            return state;
    }
}

/**
 * @name SignupWizardProvider
 * @description The SignupWizardProvider component is used to wrap the components that need access to the SignupWizardContext.
 * @param {React.ReactNode} children - The content to be wrapped.
 */
export const SignupWizardProvider = ({ children }: TSignupWizardProvider) => {
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [currentStep, helpers] = useStep(5);
    const [state, dispatch] = useReducer(valuesReducer, {
        currency: '',
    });

    const contextState = useMemo(
        () => ({
            currentStep,
            dispatch,
            helpers,
            isWizardOpen,
            setIsWizardOpen,
            state,
        }),
        [currentStep, helpers, isWizardOpen, state]
    );

    return <SignupWizardContext.Provider value={contextState}>{children}</SignupWizardContext.Provider>;
};
