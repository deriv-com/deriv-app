import { useStep } from 'usehooks-ts';
import { ACTION_TYPES } from './SignupWizardContext';

export type Helpers = ReturnType<typeof useStep>[1];

export type TSignupWizardContext = {
    currentStep: number;
    dispatch: React.Dispatch<TActions>;
    helpers: Helpers;
    isWizardOpen: boolean;
    setIsWizardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    state: TState;
};

export type TState = {
    currency?: string;
    firstName?: string;
    lastName?: string;
};

export type TSignupWizardProvider = {
    children: React.ReactNode;
};

export type TActions =
    | {
          payload: TState;
          type: Exclude<keyof typeof ACTION_TYPES, 'RESET'>;
      }
    | {
          type: typeof ACTION_TYPES.RESET;
      };
