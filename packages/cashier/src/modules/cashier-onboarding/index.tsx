import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import {
    CashierOnboardingCashCard,
    CashierOnboardingCryptoCard,
    CashierOnboardingOnrampCard,
    CashierOnboardingP2PCard,
    CashierOnboardingPaymentAgentCard,
    CashierOnboardingSideNotes,
    CashierOnboardingTitle,
} from './components';
import './onboarding.scss';

type TProps = {
    setSideNotes: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
};

const CashierOnboardingModule: React.FC<TProps> = ({ setSideNotes }) => (
    <ThemedScrollbars className='cashier-onboarding-page'>
        <CashierOnboardingTitle />
        <CashierOnboardingCashCard />
        <CashierOnboardingCryptoCard />
        <CashierOnboardingOnrampCard />
        <CashierOnboardingPaymentAgentCard />
        <CashierOnboardingP2PCard />
        <CashierOnboardingSideNotes setSideNotes={setSideNotes} />
    </ThemedScrollbars>
);

export default CashierOnboardingModule;
