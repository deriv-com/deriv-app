import { createContext } from 'react';

type WalletWizardState = {
    selected_wallet?: string;
};

export const WizardContext = createContext<WalletWizardState>({});
