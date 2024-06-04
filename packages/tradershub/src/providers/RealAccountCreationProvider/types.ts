import { useStep } from 'usehooks-ts';
import { ACTION_TYPES } from './RealAccountCreationContext';

export type Helpers = ReturnType<typeof useStep>[1];

export type TRealAccountCreationContext = {
    currentStep: number;
    dispatch: React.Dispatch<TActions>;
    helpers: Helpers;
    isSuccessModalOpen: boolean;
    isWizardOpen: boolean;
    reset: VoidFunction;
    setIsSuccessModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsWizardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTotalSteps: React.Dispatch<React.SetStateAction<number>>;
    state: TState;
    totalSteps: number;
};

export type TState = {
    accountOpeningReason?: string;
    currency?: string;
    dateOfBirth?: string;
    detailsConfirmation?: boolean;
    firstLineAddress?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    placeOfBirth?: string;
    secondLineAddress?: string;
    stateProvince?: string;
    taxIdentificationNumber?: string;
    taxInfoConfirmation?: boolean;
    taxResidence?: string;
    townCity?: string;
    zipCode?: string;
};

export type TRealAccountCreationProvider = {
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
